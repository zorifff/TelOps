import pandas as pd
import openpyxl
from openpyxl.formatting.rule import ColorScaleRule
import os
import shutil
import argparse

def generate_report(file_w0, file_w1, output_file, template_file, sheet_w1_report, sheet_w0_raw, sheet_w0_template):
    # Optional: copy files to avoid lock issues if still opened
    temp_w0 = r"temp_w0.xlsx"
    temp_w1 = r"temp_w1.xlsx"
    temp_template = r"temp_template.xlsx"
    
    try:
        shutil.copy2(file_w0, temp_w0)
        shutil.copy2(file_w1, temp_w1)
        shutil.copy2(template_file, temp_template)
    except Exception as e:
        print(f"Error mengkopi file (mungkin sedang dibuka di Excel?): {e}")
        return

    print(f"1. Mengekstrak OCC W-1 dari Report W-1 ({file_w1}) sheet '{sheet_w1_report}'...")
    try:
        # Table Report in W-1 file
        df_w1 = pd.read_excel(temp_w1, sheet_name=sheet_w1_report, header=None)
        
        # Build two dictionaries: one for WOKs, one for Branches (to handle duplicates like SURAKARTA)
        w1_occ_wok = {}
        w1_occ_branch = {}
        is_branch_section = False
        
        for idx, row in df_w1.iterrows():
            wok_raw = str(row[1]).strip()
            
            # Deteksi baris kosong sebagai pemisah antara WOK dan Branch
            if pd.isna(row[1]) or wok_raw == 'nan' or wok_raw == 'None' or wok_raw == '':
                if len(w1_occ_wok) > 0:
                    is_branch_section = True
                continue
                
            wok_upper = wok_raw.upper()
            
            # Lewati baris header/judul
            if wok_upper in ['WOK', 'NONE', 'NAN'] or 'TRACKING' in wok_upper:
                continue
                
            val = row[19]
            try:
                occ_val = float(val) if pd.notnull(val) else 0.0
            except:
                occ_val = 0.0
                
            if not is_branch_section:
                if wok_upper not in w1_occ_wok:
                    w1_occ_wok[wok_upper] = occ_val
            else:
                if wok_upper not in w1_occ_branch:
                    w1_occ_branch[wok_upper] = occ_val
                    
        print(f"   Ditemukan {len(w1_occ_wok)} WOK dan {len(w1_occ_branch)} Branch/Summary di W-1.")
    except Exception as e:
        print(f"Error membaca W-1: {e}")
        return

    print(f"2. Membaca dan Memproses Raw Data W-0 ({file_w0}) sheet '{sheet_w0_raw}'...")
    try:
        df_raw = pd.read_excel(temp_w0, sheet_name=sheet_w0_raw)
        
        # Filter Type Design = Greenfield
        if 'Type Design' in df_raw.columns:
            df_filtered = df_raw[df_raw['Type Design'].str.strip().str.upper() == 'GREENFIELD'].copy()
        else:
            print("Peringatan: Kolom 'Type Design' tidak ditemukan!")
            df_filtered = df_raw.copy()
            
        print(f"   Jumlah baris Greenfield: {len(df_filtered)}")
        
        # Ensure Used is numeric and fill NA with 0
        df_filtered['Used_new_v3'] = pd.to_numeric(df_filtered['Used_new_v3'], errors='coerce').fillna(0)
        df_filtered['Port Terbangun'] = pd.to_numeric(df_filtered['Port Terbangun'], errors='coerce').fillna(0)
        
        # Standardize duration categories
        if 'Cat Durasi Go Live' not in df_filtered.columns:
            print("Error: Kolom 'Cat Durasi Go Live' tidak ditemukan!")
            return
            
        df_filtered['Durasi_Clean'] = df_filtered['Cat Durasi Go Live'].astype(str).str.strip().str.upper()
        
        # Map raw category strings to standard buckets
        def map_bucket(val):
            if '<1' in val: return '<1 Month'
            elif '<2' in val or '2 MONTH' in val: return '<2 Month'
            elif '<3' in val or '3 MONTH' in val: return '<3 Month'
            elif '4-6' in val: return '4-6 Month'
            elif '>6' in val: return '>6 Month'
            return val
            
        df_filtered['Bucket'] = df_filtered['Durasi_Clean'].apply(map_bucket)
        
        # Aggregate
        if 'WOK' not in df_filtered.columns:
            print("Error: Kolom 'WOK' tidak ditemukan di raw data!")
            return
            
        agg_df = df_filtered.groupby(['WOK', 'Bucket']).agg({
            'Port Terbangun': 'sum',
            'Used_new_v3': 'sum'
        }).reset_index()
        
        # Create a nested dictionary: { WOK: { Bucket: (Port, Used) } }
        w0_data = {}
        for _, row in agg_df.iterrows():
            wok = str(row['WOK']).strip()
            bucket = row['Bucket']
            if wok not in w0_data:
                w0_data[wok] = {}
            w0_data[wok][bucket] = (row['Port Terbangun'], row['Used_new_v3'])
            
    except Exception as e:
        print(f"Error memproses Raw Data: {e}")
        return

    print(f"3. Menulis ke Master Template '{template_file}' pada sheet '{sheet_w0_template}'...")
    try:
        wb = openpyxl.load_workbook(temp_template)
        if sheet_w0_template not in wb.sheetnames:
            print(f"Error: Sheet '{sheet_w0_template}' tidak ditemukan di {template_file}")
            return
            
        ws = wb[sheet_w0_template]
        
        # Define column mapping for buckets (Port col, Used col)
        bucket_cols = {
            '<1 Month': (3, 4),   # C, D
            '<2 Month': (6, 7),   # F, G
            '<3 Month': (9, 10),  # I, J
            '4-6 Month': (12, 13),# L, M
            '>6 Month': (15, 16)  # O, P
        }
        
        # 1. Mengisi blok WOK (Baris 6 ke bawah sampai baris kosong)
        r = 6
        while r < 100:
            wok_cell = ws.cell(row=r, column=2)
            wok_raw = str(wok_cell.value).strip() if wok_cell.value else ""
            
            if not wok_raw or wok_raw == "None":
                r += 1
                break  # Baris kosong pertama menandakan akhir dari blok WOK
                
            wok_upper = wok_raw.upper()
            
            # Fill Port and Used for each bucket
            for bucket, (col_p, col_u) in bucket_cols.items():
                port_val = 0
                used_val = 0
                if wok_upper in w0_data and bucket in w0_data[wok_upper]:
                    port_val, used_val = w0_data[wok_upper][bucket]
                
                ws.cell(row=r, column=col_p).value = port_val
                ws.cell(row=r, column=col_u).value = used_val
            
            # Fill OCC W-1 (Column U -> index 21) dari kamus WOK
            w1_occ = w1_occ_wok.get(wok_upper, 0.0)
            ws.cell(row=r, column=21).value = w1_occ
            r += 1
            
        # 2. Mengisi blok Branch & Jateng DIY (Hanya mengisi OCC W-1, formula =SUM dibiarkan aman)
        while r < 100:
            wok_cell = ws.cell(row=r, column=2)
            wok_raw = str(wok_cell.value).strip() if wok_cell.value else ""
            
            if not wok_raw or wok_raw == "None":
                r += 1
                continue
                
            wok_upper = wok_raw.upper()
            
            # Update hanya OCC W-1 dari kamus Branch
            if wok_upper in w1_occ_branch:
                ws.cell(row=r, column=21).value = w1_occ_branch[wok_upper]
                
            r += 1

                
        # --- RE-APPLY CONDITIONAL FORMATTING ---
        # openpyxl by default drops color scale CFs, so we must add them back manually
        rule = ColorScaleRule(start_type='min', start_color='FFF8696B',
                              mid_type='percentile', mid_value=50, mid_color='FFFCFCFF',
                              end_type='max', end_color='FF63BE7B')
                              
        # WOK Block: Rows 6-21
        # Branch Block: Rows 23-28
        ranges_to_color = [
            'E6:E21', 'E23:E28',
            'H6:H21', 'H23:H28',
            'K6:K21', 'K23:K28',
            'N6:N21', 'N23:N28',
            'Q6:Q21', 'Q23:Q28',
            'T6:U21', 'T23:U28'
        ]
        
        for rng in ranges_to_color:
            ws.conditional_formatting.add(rng, rule)
        # ---------------------------------------
                
        # Save output
        wb.save(output_file)
        print(f"Selesai! File berhasil disimpan di: {output_file}")
        
    except Exception as e:
        print(f"Error menulis ke template: {e}")
    finally:
        # Cleanup temporary files
        if os.path.exists(temp_w0): os.remove(temp_w0)
        if os.path.exists(temp_w1): os.remove(temp_w1)
        if os.path.exists(temp_template): os.remove(temp_template)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Report Occupancy ODP")
    parser.add_argument("--w0", required=True, help="Path ke file W-0 (Raw Data terbaru)")
    parser.add_argument("--w1", required=True, help="Path ke file W-1 (Laporan minggu lalu)")
    parser.add_argument("--out", required=True, help="Path untuk menyimpan file output")
    parser.add_argument("--template", default="Template_Report.xlsx", help="Path ke file master template")
    
    # Optional arguments for sheet names
    parser.add_argument("--sheet-w1-report", default="Table Report", help="Nama sheet report minggu lalu (default: Table Report)")
    parser.add_argument("--sheet-w0-raw", default="ODP Golive 2026", help="Nama sheet raw data terbaru (default: ODP Golive 2026)")
    parser.add_argument("--sheet-w0-template", default="Report - Occupancy", help="Nama sheet pada file template (default: Report - Occupancy)")
    
    args = parser.parse_args()
    
    generate_report(args.w0, args.w1, args.out, args.template, args.sheet_w1_report, args.sheet_w0_raw, args.sheet_w0_template)


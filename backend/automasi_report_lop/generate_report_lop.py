import pandas as pd
import openpyxl
from openpyxl.styles import PatternFill
import argparse
import sys
import os

def generate_report_lop(w0_path, w1_path, out_path, template_path):
    if not os.path.exists(w0_path):
        print(f"Error: W-0 file not found at {w0_path}")
        sys.exit(1)
    if not os.path.exists(w1_path):
        print(f"Error: W-1 file not found at {w1_path}")
        sys.exit(1)
    if not os.path.exists(template_path):
        print(f"Error: Template file not found at {template_path}")
        sys.exit(1)
        
    print(f"Loading W-0 Data from: {w0_path}")
    df_w0 = pd.read_excel(w0_path, sheet_name="ODP Golive 2026")
    
    used_col = 'Used_new_v3' if 'Used_new_v3' in df_w0.columns else 'Used_new_v2'
    
    # Clean data
    df_w0['Type Design Clean'] = df_w0['Type Design'].astype(str).str.strip().str.upper()
    df_w0[used_col] = pd.to_numeric(df_w0[used_col], errors='coerce').fillna(0)
    df_w0.loc[df_w0[used_col] < 0, used_col] = 0
    df_w0['Port Terbangun'] = pd.to_numeric(df_w0['Port Terbangun'], errors='coerce').fillna(0)
    
    # Filter Greenfield
    mask_gf = df_w0['Type Design Clean'] == 'GREENFIELD'
    df_gf = df_w0[mask_gf].copy()
    
    # Group by LOP (Nama Proyek)
    print("Aggregating W-0 Data...")
    grouped = df_gf.groupby(['Nama Proyek', 'Telkomsel Branch', 'WOK', 'Cat Durasi Go Live']).agg(
        Jumlah_ODP=('ODP NAME', 'count'),  # any column works for count
        Port=('Port Terbangun', 'sum'),
        Used=(used_col, 'sum')
    ).reset_index()
    
    # Calculate Occ
    grouped['Occ'] = grouped.apply(lambda row: row['Used'] / row['Port'] if row['Port'] > 0 else 0.0, axis=1)
    
    print(f"Loading W-1 Data from: {w1_path}")
    df_w1 = pd.read_excel(w1_path, sheet_name="Report per LOP", header=None)
    
    w1_occ_map = {}
    for _, row in df_w1.iterrows():
        nama_lop = str(row[1]).strip() if pd.notna(row[1]) else ""
        occ_val = row[9] # Column J (index 9)
        if nama_lop and pd.notna(occ_val) and isinstance(occ_val, (int, float)):
            w1_occ_map[nama_lop] = float(occ_val)
            
    # Lookup Occ W-1
    def get_w1_occ(nama_proyek):
        key = str(nama_proyek).strip()
        return w1_occ_map.get(key, 0.0)
        
    grouped['Occ W-1'] = grouped['Nama Proyek'].apply(get_w1_occ)
    
    # Calculate Gap WoW
    grouped['Gap WoW'] = grouped['Occ'] - grouped['Occ W-1']
    
    # Sorting
    print("Sorting data...")
    grouped = grouped.sort_values(by=['Telkomsel Branch', 'WOK', 'Jumlah_ODP'], ascending=[True, True, False])
    
    print(f"Loading Template: {template_path}")
    wb = openpyxl.load_workbook(template_path)
    ws = wb['Occ LOP Greenfield']
    
    print("Writing data to template...")
    start_row = 4
    ref_row_index = 4
    
    from copy import copy

    # Define green style (Excel's standard 'Good' color scheme background only)
    green_fill = PatternFill(start_color="C6EFCE", end_color="C6EFCE", fill_type="solid")
    for idx, row in grouped.iterrows():
        dest = start_row
        
        # Copy styles from the reference row if we are beyond it
        if dest > ref_row_index:
            for col in range(11, 21):
                ref_cell = ws.cell(row=ref_row_index, column=col)
                new_cell = ws.cell(row=dest, column=col)
                if ref_cell.has_style:
                    new_cell.font = copy(ref_cell.font)
                    new_cell.border = copy(ref_cell.border)
                    new_cell.fill = copy(ref_cell.fill)
                    new_cell.number_format = ref_cell.number_format
                    new_cell.protection = copy(ref_cell.protection)
                    new_cell.alignment = copy(ref_cell.alignment)
                    
        ws.cell(row=dest, column=11).value = row['Nama Proyek']
        ws.cell(row=dest, column=12).value = row['Telkomsel Branch']
        ws.cell(row=dest, column=13).value = row['WOK']
        ws.cell(row=dest, column=14).value = row['Cat Durasi Go Live']
        ws.cell(row=dest, column=15).value = row['Jumlah_ODP']
        ws.cell(row=dest, column=16).value = row['Port']
        ws.cell(row=dest, column=17).value = row['Used']
        
        occ_cell = ws.cell(row=dest, column=18)
        occ_cell.value = row['Occ']
        
        # Color cell fill green if >= 35% (0.35)
        if row['Occ'] >= 0.35:
            occ_cell.fill = green_fill
            
        ws.cell(row=dest, column=19).value = row['Occ W-1']
        ws.cell(row=dest, column=20).value = row['Gap WoW']
        start_row += 1

    print(f"Saving output to: {out_path}")
    wb.save(out_path)
    print("Done!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Occ LOP Greenfield Report")
    parser.add_argument("--w0", required=True, help="Path to W-0 Excel file (e.g. 20072026)")
    parser.add_argument("--w1", required=True, help="Path to W-1 Excel file (e.g. 13072026)")
    parser.add_argument("--out", required=True, help="Path to output Excel file")
    parser.add_argument("--template", default=r"C:\MAGANG\OKUPANSI ODP\PROGRAM_REPORT\Template_LOP_Greenfield.xlsx", help="Path to template file")
    
    args = parser.parse_args()
    generate_report_lop(args.w0, args.w1, args.out, args.template)

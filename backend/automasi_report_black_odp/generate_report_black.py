import pandas as pd
import openpyxl
from openpyxl.formatting.rule import IconSet, FormatObject, Rule
import argparse
import sys
import os

def format_percentage(val):
    if val is None or val == "-":
        return "-"
    return val

def generate_report_black(w0_path, w1_path, out_path, template_path):
    print(f"Loading W-0 Data from: {w0_path}")
    df_w0 = pd.read_excel(w0_path, sheet_name="ODP Golive 2026")
    
    used_col_w0 = 'Used_new_v3' if 'Used_new_v3' in df_w0.columns else 'Used_new_v2'
    df_w0['Type Design Clean'] = df_w0['Type Design'].astype(str).str.strip().str.upper()
    df_w0['OCC 2 Clean'] = df_w0['OCC 2'].astype(str).str.strip().str.upper()
    df_w0['Cat Durasi Go Live'] = df_w0['Cat Durasi Go Live'].astype(str).str.strip()
    df_w0[used_col_w0] = pd.to_numeric(df_w0[used_col_w0], errors='coerce').fillna(0)
    df_w0.loc[df_w0[used_col_w0] < 0, used_col_w0] = 0
    
    mask_tot_w0 = df_w0['Type Design Clean'] == 'GREENFIELD'
    mask_blk_w0 = mask_tot_w0 & (df_w0[used_col_w0] == 0) & (df_w0['OCC 2 Clean'] == 'BLACK')
    
    df_tot_w0 = df_w0[mask_tot_w0]
    df_blk_w0 = df_w0[mask_blk_w0]
    
    agg_tot_w0 = df_tot_w0.groupby(['WOK', 'Cat Durasi Go Live']).size().reset_index(name='Total_ODP')
    agg_blk_w0 = df_blk_w0.groupby(['WOK', 'Cat Durasi Go Live']).size().reset_index(name='Black_ODP')

    durations = ['<1 Month', '<2 Month', '<3 Month', '4-6 Month', '>6 Month']
    woks_in_template = [
        "KEBUMEN", "MAGELANG TEMANGGUNG", "BATANG", "PEMALANG PURBALINGGA", 
        "TEGAL BREBES", "CILACAP BANYUMAS", "WONOSOBO BANJARNEGARA", "DEMAK", 
        "JEPARA KUDUS - PATI", "SEMARANG 1", "SEMARANG 2", "BOYOLALI", 
        "SRAGEN", "SURAKARTA", "YOGYA 1", "YOGYA 2"
    ]
    
    wok_data = {wok: {d: {'Total': 0, 'Black': 0} for d in durations} for wok in woks_in_template}
    
    for _, row in agg_tot_w0.iterrows():
        wok = str(row['WOK']).strip()
        dur = str(row['Cat Durasi Go Live']).strip()
        if wok in wok_data and dur in wok_data[wok]:
            wok_data[wok][dur]['Total'] = row['Total_ODP']
            
    for _, row in agg_blk_w0.iterrows():
        wok = str(row['WOK']).strip()
        dur = str(row['Cat Durasi Go Live']).strip()
        if wok in wok_data and dur in wok_data[wok]:
            wok_data[wok][dur]['Black'] = row['Black_ODP']

    # W-1 Data from ODP Black GF W-1 sheet
    print(f"Loading W-1 Data from sheet 'ODP Black GF W-1' in: {w1_path}")
    df_w1 = pd.read_excel(w1_path, sheet_name="ODP Black GF W-1", header=None, skiprows=6, nrows=16)
    
    w1_black = {wok: 0 for wok in woks_in_template}
    w1_total = {wok: 0 for wok in woks_in_template}
    
    for _, row in df_w1.iterrows():
        # Black ODP is in Column I (index 8), WOK in Column C (index 2)
        wok_b = str(row[2]).strip() if pd.notna(row[2]) else ""
        if wok_b in woks_in_template:
            val_b = row[8]
            if pd.notna(val_b) and isinstance(val_b, (int, float)):
                w1_black[wok_b] = int(val_b)
                
        # Total ODP is in Column S (index 18), WOK in Column M (index 12)
        wok_t = str(row[12]).strip() if pd.notna(row[12]) else ""
        if wok_t in woks_in_template:
            val_t = row[18]
            if pd.notna(val_t) and isinstance(val_t, (int, float)):
                w1_total[wok_t] = int(val_t)

    # Branch structure
    branches_map = {
        "MAGELANG": {"rows": range(7, 9), "dest": 24},
        "PEKALONGAN": {"rows": range(9, 12), "dest": 25},
        "PURWOKERTO": {"rows": range(12, 14), "dest": 26},
        "SEMARANG": {"rows": range(14, 18), "dest": 27},
        "SURAKARTA": {"rows": range(18, 21), "dest": 28},
        "YOGYAKARTA": {"rows": range(21, 23), "dest": 29}
    }
    
    # Load Template
    wb_out = openpyxl.load_workbook(template_path)
    ws_out = wb_out["Report - ODP Black"]
    
    # Process WOKs
    row_data = {}
    for idx, wok in enumerate(woks_in_template):
        r = 7 + idx
        d = wok_data[wok]
        
        # Cols C-Q
        cols = ['C', 'D', 'F', 'G', 'I', 'J', 'L', 'M', 'O', 'P']
        vals = [d['<1 Month']['Total'], d['<1 Month']['Black'],
                d['<2 Month']['Total'], d['<2 Month']['Black'],
                d['<3 Month']['Total'], d['<3 Month']['Black'],
                d['4-6 Month']['Total'], d['4-6 Month']['Black'],
                d['>6 Month']['Total'], d['>6 Month']['Black']]
                
        for c, v in zip(cols, vals):
            ws_out[f"{c}{r}"] = v
            
        # Percentages
        ws_out[f"E{r}"] = d['<1 Month']['Black'] / d['<1 Month']['Total'] if d['<1 Month']['Total'] > 0 else "-"
        ws_out[f"H{r}"] = d['<2 Month']['Black'] / d['<2 Month']['Total'] if d['<2 Month']['Total'] > 0 else "-"
        ws_out[f"K{r}"] = d['<3 Month']['Black'] / d['<3 Month']['Total'] if d['<3 Month']['Total'] > 0 else "-"
        ws_out[f"N{r}"] = d['4-6 Month']['Black'] / d['4-6 Month']['Total'] if d['4-6 Month']['Total'] > 0 else "-"
        ws_out[f"Q{r}"] = d['>6 Month']['Black'] / d['>6 Month']['Total'] if d['>6 Month']['Total'] > 0 else "-"
        
        # Totals
        tot_all = sum(v for i, v in enumerate(vals) if i % 2 == 0)
        blk_all = sum(v for i, v in enumerate(vals) if i % 2 == 1)
        
        ws_out[f"R{r}"] = tot_all
        ws_out[f"S{r}"] = blk_all
        ws_out[f"T{r}"] = blk_all / tot_all if tot_all > 0 else "-"
        
        # W-1
        w1_blk = w1_black[wok]
        w1_tot = w1_total[wok]
        
        ws_out[f"U{r}"] = w1_blk
        w1_pct = w1_blk / w1_tot if w1_tot > 0 else 0
        ws_out[f"V{r}"] = w1_pct
        
        # Selisih
        w_diff = blk_all - w1_blk
        ws_out[f"W{r}"] = w_diff
        
        t_val = (blk_all / tot_all) if tot_all > 0 else 0
        x_diff = t_val - w1_pct
        ws_out[f"X{r}"] = x_diff
        
        ws_out[f"Y{r}"] = "Berkurang" if w_diff < 0 else "Bertambah" if w_diff > 0 else "-"
        ws_out[f"Z{r}"] = "Berkurang" if x_diff < 0 else "Bertambah" if x_diff > 0 else "-"
        
        row_data[r] = {
            'C': vals[0], 'D': vals[1], 'F': vals[2], 'G': vals[3],
            'I': vals[4], 'J': vals[5], 'L': vals[6], 'M': vals[7],
            'O': vals[8], 'P': vals[9], 'R': tot_all, 'S': blk_all,
            'U': w1_blk, 'W1_Total': w1_tot
        }
        
    # Process Branches
    for branch, info in branches_map.items():
        dest = info["dest"]
        
        sum_cols = {c: 0 for c in ['C', 'D', 'F', 'G', 'I', 'J', 'L', 'M', 'O', 'P', 'R', 'S', 'U', 'W1_Total']}
        
        for r in info["rows"]:
            for c in sum_cols:
                sum_cols[c] += row_data[r][c]
                
        for c in ['C', 'D', 'F', 'G', 'I', 'J', 'L', 'M', 'O', 'P', 'R', 'S', 'U']:
            ws_out[f"{c}{dest}"] = sum_cols[c]
            
        ws_out[f"E{dest}"] = sum_cols['D'] / sum_cols['C'] if sum_cols['C'] > 0 else "-"
        ws_out[f"H{dest}"] = sum_cols['G'] / sum_cols['F'] if sum_cols['F'] > 0 else "-"
        ws_out[f"K{dest}"] = sum_cols['J'] / sum_cols['I'] if sum_cols['I'] > 0 else "-"
        ws_out[f"N{dest}"] = sum_cols['M'] / sum_cols['L'] if sum_cols['L'] > 0 else "-"
        ws_out[f"Q{dest}"] = sum_cols['P'] / sum_cols['O'] if sum_cols['O'] > 0 else "-"
        ws_out[f"T{dest}"] = sum_cols['S'] / sum_cols['R'] if sum_cols['R'] > 0 else "-"
        
        w1_pct = sum_cols['U'] / sum_cols['W1_Total'] if sum_cols['W1_Total'] > 0 else 0
        ws_out[f"V{dest}"] = w1_pct
        
        w_diff = sum_cols['S'] - sum_cols['U']
        ws_out[f"W{dest}"] = w_diff
        
        t_val = sum_cols['S'] / sum_cols['R'] if sum_cols['R'] > 0 else 0
        x_diff = t_val - w1_pct
        ws_out[f"X{dest}"] = x_diff
        
        ws_out[f"Y{dest}"] = "Berkurang" if w_diff < 0 else "Bertambah" if w_diff > 0 else "-"
        ws_out[f"Z{dest}"] = "Berkurang" if x_diff < 0 else "Bertambah" if x_diff > 0 else "-"
        
        row_data[dest] = sum_cols
        
    # Jateng DIY
    dest = 30
    sum_cols = {c: 0 for c in ['C', 'D', 'F', 'G', 'I', 'J', 'L', 'M', 'O', 'P', 'R', 'S', 'U', 'W1_Total']}
    for r in range(24, 30):
        for c in sum_cols:
            sum_cols[c] += row_data[r][c]
            
    for c in ['C', 'D', 'F', 'G', 'I', 'J', 'L', 'M', 'O', 'P', 'R', 'S', 'U']:
        ws_out[f"{c}{dest}"] = sum_cols[c]
        
    ws_out[f"E{dest}"] = sum_cols['D'] / sum_cols['C'] if sum_cols['C'] > 0 else "-"
    ws_out[f"H{dest}"] = sum_cols['G'] / sum_cols['F'] if sum_cols['F'] > 0 else "-"
    ws_out[f"K{dest}"] = sum_cols['J'] / sum_cols['I'] if sum_cols['I'] > 0 else "-"
    ws_out[f"N{dest}"] = sum_cols['M'] / sum_cols['L'] if sum_cols['L'] > 0 else "-"
    ws_out[f"Q{dest}"] = sum_cols['P'] / sum_cols['O'] if sum_cols['O'] > 0 else "-"
    ws_out[f"T{dest}"] = sum_cols['S'] / sum_cols['R'] if sum_cols['R'] > 0 else "-"
    
    w1_pct = sum_cols['U'] / sum_cols['W1_Total'] if sum_cols['W1_Total'] > 0 else 0
    ws_out[f"V{dest}"] = w1_pct
    
    w_diff = sum_cols['S'] - sum_cols['U']
    ws_out[f"W{dest}"] = w_diff
    
    t_val = sum_cols['S'] / sum_cols['R'] if sum_cols['R'] > 0 else 0
    x_diff = t_val - w1_pct
    ws_out[f"X{dest}"] = x_diff
    
    ws_out[f"Y{dest}"] = "Berkurang" if w_diff < 0 else "Bertambah" if w_diff > 0 else "-"
    ws_out[f"Z{dest}"] = "Berkurang" if x_diff < 0 else "Bertambah" if x_diff > 0 else "-"
    
    # Add IconSet rule for Column X (Delta % ODP Black)
    cfvo1 = FormatObject(type='percent', val=0)
    cfvo2 = FormatObject(type='num', val=0)
    cfvo3 = FormatObject(type='num', val=0)
    iconset = IconSet(iconSet='3TrafficLights1', cfvo=[cfvo1, cfvo2, cfvo3], reverse=True)
    rule = Rule(type='iconSet', iconSet=iconset)
    ws_out.conditional_formatting.add('X7:X22', rule)
    ws_out.conditional_formatting.add('X24:X29', rule)
    ws_out.conditional_formatting.add('X30:X30', rule)
    
    print(f"Saving output to: {out_path}")
    wb_out.save(out_path)
    print("Done!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate Report ODP Black")
    parser.add_argument("--w0", required=True, help="Path to W-0 Excel file")
    parser.add_argument("--w1", required=True, help="Path to W-1 Excel file")
    parser.add_argument("--out", required=True, help="Path to output Excel file")
    parser.add_argument("--template", default="Template_Report_Black.xlsx", help="Path to template Excel file")
    
    args = parser.parse_args()
    generate_report_black(args.w0, args.w1, args.out, args.template)

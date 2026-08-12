import pandas as pd
import numpy as np
import io
import time

def clean_msisdn_val(val):
    if pd.isna(val) or val is None or str(val).strip() in ('', 'nan', 'None', '\\N'):
        return ""
    try:
        val_float = float(val)
        if np.isnan(val_float):
            return ""
        return str(int(val_float))
    except (ValueError, TypeError):
        val_str = str(val).strip()
        if val_str.endswith('.0'):
            val_str = val_str[:-2]
        return val_str

def clean_str_val(val):
    if pd.isna(val) or val is None or str(val).strip() in ('', 'nan', 'None', '\\N'):
        return ""
    val_str = str(val).strip()
    if val_str.endswith('.0'):
        val_str = val_str[:-2]
    return val_str

def generate_pairing_report(input_file_source, mode: str = "option_a") -> bytes:
    """
    Transform Telkomsel One / Kuota Keluarga pairing data from Long (1:M) to Wide (1:1) format.
    
    :param input_file_source: File path (str) or binary buffer (BytesIO/UploadFile stream)
    :param mode: 'option_a' (Full child metadata) or 'option_b' (MSISDN child only)
    :return: Bytes of generated Excel file (.xlsx)
    """
    print(f"=== TelOps Backend: Processing Pairing Kuota Keluarga (Mode: {mode}) ===")
    t0 = time.time()

    # Read input Excel dataframe
    df = pd.read_excel(input_file_source, sheet_name=0)
    print(f"Read {len(df)} rows and {len(df.columns)} columns.")

    # Clean MSISDNs & Key Group Columns
    if 'bb_id' in df.columns:
        df['bb_id'] = df['bb_id'].apply(clean_msisdn_val)
    if 'msisdn_parent' in df.columns:
        df['msisdn_parent'] = df['msisdn_parent'].apply(clean_msisdn_val)
    if 'msisdn_child' in df.columns:
        df['msisdn_child'] = df['msisdn_child'].apply(clean_msisdn_val)

    group_cols = [c for c in ['bb_id', 'msisdn_parent'] if c in df.columns]
    if not group_cols:
        raise ValueError("File Excel tidak memiliki kolom 'bb_id' atau 'msisdn_parent'.")

    # Determine metadata columns (1:1 per group)
    all_possible_metadata = [
        'product_commercial_name', 'activation_date_ih', 'activation_date_parent',
        'city', 'region', 'area', 'cluster', 'sto', 'tsel_id_ih',
        'tsel_id_mobile_parent', 'order_id'
    ]
    metadata_cols = [c for c in all_possible_metadata if c in df.columns]

    # Determine child columns to unstack based on mode
    if mode == "option_b":
        child_cols = ['msisdn_child']
    else:
        # Option A: Full metadata child
        child_cols = ['msisdn_child', 'activation_date_child', 'tsel_id_mobile_child']

    child_cols = [c for c in child_cols if c in df.columns]

    # Calculate child sequence index per group
    df['child_seq'] = df.groupby(group_cols).cumcount() + 1
    max_children = df['child_seq'].max() if len(df) > 0 else 0

    # Build unique group dataframe for metadata
    df_groups = df.drop_duplicates(subset=group_cols)[group_cols + metadata_cols].copy()

    # Pivot child columns
    if max_children > 0 and child_cols:
        pivoted_dfs = []
        for c_col in child_cols:
            piv = df.pivot(index=group_cols, columns='child_seq', values=c_col)
            piv.columns = [f"{c_col}{seq}" for seq in piv.columns]
            pivoted_dfs.append(piv)

        df_children_wide = pd.concat(pivoted_dfs, axis=1).reset_index()

        # Interleave child columns logically
        ordered_child_cols = []
        for seq in range(1, max_children + 1):
            for c_col in child_cols:
                col_name = f"{c_col}{seq}"
                if col_name in df_children_wide.columns:
                    ordered_child_cols.append(col_name)

        df_children_wide = df_children_wide[group_cols + ordered_child_cols]
        df_final = pd.merge(df_groups, df_children_wide, on=group_cols, how='left')
    else:
        df_final = df_groups

    # Clean string formatting across final dataframe
    for col in df_final.columns:
        df_final[col] = df_final[col].apply(clean_str_val)

    print(f"Transformed to {len(df_final)} unique rows and {len(df_final.columns)} columns.")

    # Write to in-memory bytes buffer
    output_buffer = io.BytesIO()
    df_final.to_excel(output_buffer, index=False, engine='openpyxl')
    output_buffer.seek(0)
    
    print(f"Completed in {time.time() - t0:.2f} seconds.")
    return output_buffer.getvalue()

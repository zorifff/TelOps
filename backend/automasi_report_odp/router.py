import os
import tempfile
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import FileResponse

from .generate_report import generate_report

router = APIRouter()

@router.post("/generate")
async def generate_odp_report(
    type_design: str = Query("COMBINED", description="Type Design: GREENFIELD, BROWNFIELD, ALL, or COMBINED"),
    w0_file: UploadFile = File(...),
    w1_file: UploadFile = File(...)
):
    try:
        # Create temp files for inputs
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp_w0:
            tmp_w0.write(await w0_file.read())
            w0_path = Path(tmp_w0.name)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp_w1:
            tmp_w1.write(await w1_file.read())
            w1_path = Path(tmp_w1.name)
            
        # Gunakan template dari backend
        template_path = Path(__file__).parent / "Template_Report.xlsx"
        
        if not template_path.exists():
            raise HTTPException(status_code=500, detail="File Template_Report.xlsx tidak ditemukan di server.")

        td_clean = type_design.strip().upper()
        if td_clean in ('COMBINED', 'COMBINED_ALL', 'ALL_TABLES', '3_TABLES'):
            out_label = "Combined_3_Tables"
        elif td_clean in ('ALL', 'ALL TYPE', 'ALL TYPE DESIGN'):
            out_label = "All_Type_Design"
        elif td_clean == 'BROWNFIELD':
            out_label = "Brownfield"
        else:
            out_label = "Greenfield"

        out_name = f"Report_Occupancy_{out_label}.xlsx"
        output_path = w0_path.with_name(out_name)

        # Call the generate function
        generate_report(
            file_w0=str(w0_path),
            file_w1=str(w1_path),
            output_file=str(output_path),
            template_file=str(template_path),
            sheet_w1_report="Report - Occupancy",
            sheet_w0_raw="ODP Golive 2026",
            sheet_w0_template="Report - Occupancy",
            td_filter=td_clean
        )

        # Clean up input files
        for p in [w0_path, w1_path]:
            try:
                if p.exists(): os.remove(p)
            except OSError:
                pass

        if not output_path.exists():
            raise HTTPException(status_code=500, detail="Gagal menghasilkan file output")

        return FileResponse(
            path=output_path,
            filename=out_name,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

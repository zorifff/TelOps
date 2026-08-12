import os
import tempfile
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import FileResponse

from .generate_report_lop import generate_report_lop

router = APIRouter()

@router.post("/generate")
async def generate_report_lop_endpoint(
    type_design: str = Query("GREENFIELD", description="Type Design: GREENFIELD, BROWNFIELD, ALL, or COMBINED"),
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

        template_path = Path(__file__).parent / "Template_LOP_Greenfield.xlsx"
        if not template_path.exists():
            raise HTTPException(status_code=500, detail="File Template_LOP_Greenfield.xlsx tidak ditemukan di server.")

        td_clean = type_design.strip().upper()
        if td_clean in ('COMBINED', 'COMBINED_ALL', 'ALL_TABLES', '3_TABLES'):
            out_label = "Combined_3_Tables"
        elif td_clean in ('ALL', 'ALL TYPE', 'ALL TYPE DESIGN'):
            out_label = "All_Type_Design"
        elif td_clean == 'BROWNFIELD':
            out_label = "Brownfield"
        else:
            out_label = "Greenfield"

        out_name = f"Report_LOP_ODP_Golive_2026_{out_label}.xlsx"
        output_path = w0_path.with_name(out_name)

        generate_report_lop(
            w0_path=str(w0_path),
            w1_path=str(w1_path),
            out_path=str(output_path),
            template_path=str(template_path),
            td_filter=td_clean
        )

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

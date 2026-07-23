import os
import tempfile
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from .generate_report_lop import generate_report_lop

router = APIRouter()

@router.post("/generate")
async def generate_odp_lop_report(
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
        template_path = Path(__file__).parent / "Template_LOP_Greenfield.xlsx"
        
        if not template_path.exists():
            raise HTTPException(status_code=500, detail="File Template_LOP_Greenfield.xlsx tidak ditemukan di server.")

        # Output path
        output_path = w0_path.with_name(f"Report_LOP_Generated.xlsx")

        # Call the generate function
        generate_report_lop(
            w0_path=str(w0_path),
            w1_path=str(w1_path),
            out_path=str(output_path),
            template_path=str(template_path)
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
            filename="Report_LOP_Generated.xlsx",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

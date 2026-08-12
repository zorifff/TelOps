import os
import tempfile
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse

from .generate_gtm import generate_gtm_report

router = APIRouter()

@router.post("/generate")
async def generate_gtm(
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

        out_name = "Update_GTM_Requirement_Generated.xlsx"
        output_path = w0_path.with_name(out_name)

        generate_gtm_report(
            w0_path=str(w0_path),
            w1_path=str(w1_path),
            out_path=str(output_path)
        )

        # Clean up temporary input files
        for p in [w0_path, w1_path]:
            try:
                if p.exists(): os.remove(p)
            except OSError:
                pass

        if not output_path.exists():
            raise HTTPException(status_code=500, detail="Gagal menghasilkan file output Update GTM.")

        return FileResponse(
            path=output_path,
            filename=out_name,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

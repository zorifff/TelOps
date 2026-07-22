import os
import tempfile
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse

from .reverse_geocode_desa_offline import process_offline
from .reverse_geocode_google import process_google

router = APIRouter()

@router.post("/offline")
async def geocode_offline(
    input_file: UploadFile = File(...)
):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp_in:
            tmp_in.write(await input_file.read())
            input_path = Path(tmp_in.name)

        # File batas wilayah
        zip_path = Path(__file__).parent / "DESA-KECAMATAN JATENG DIY.zip"

        output_path = input_path.with_name(f"hasil_offline_{input_file.filename}")

        process_offline(input_path, zip_path, output_path)

        try:
            if input_path.exists(): os.remove(input_path)
        except OSError:
            pass

        if not output_path.exists():
            raise HTTPException(status_code=500, detail="Gagal menghasilkan file output")

        return FileResponse(
            path=output_path,
            filename=f"hasil_{input_file.filename}",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            background=None
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/online")
async def geocode_online(
    input_file: UploadFile = File(...),
    api_key: str = Form(...)
):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp_in:
            tmp_in.write(await input_file.read())
            input_path = Path(tmp_in.name)

        output_path = input_path.with_name(f"hasil_online_{input_file.filename}")

        process_google(input_path, output_path, api_key)

        try:
            if input_path.exists(): os.remove(input_path)
        except OSError:
            pass

        if not output_path.exists():
            raise HTTPException(status_code=500, detail="Gagal menghasilkan file output")

        return FileResponse(
            path=output_path,
            filename=f"hasil_{input_file.filename}",
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

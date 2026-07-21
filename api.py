import os
import tempfile
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

from reverse_geocode_desa_offline import process_offline
from reverse_geocode_google import process_google

app = FastAPI(title="Geocoding API")

# Mengizinkan Frontend (React) untuk mengakses API ini
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Dalam tahap development, kita izinkan dari mana saja
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/geocode/offline")
async def geocode_offline(
    input_file: UploadFile = File(...)
):
    try:
        # Simpan file yang diunggah ke temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp_in:
            tmp_in.write(await input_file.read())
            input_path = Path(tmp_in.name)

        # File batas wilayah sudah ada di backend
        zip_path = Path(__file__).parent / "DESA-KECAMATAN JATENG DIY.zip"

        output_path = input_path.with_name(f"hasil_offline_{input_file.filename}")

        # Jalankan fungsi
        process_offline(input_path, zip_path, output_path)

        # Bersihkan input file
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
            background=None # Kita akan biarkan file terhapus nanti atau bisa membuat background task untuk menghapus file
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/geocode/online")
async def geocode_online(
    input_file: UploadFile = File(...),
    api_key: str = Form(...)
):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp_in:
            tmp_in.write(await input_file.read())
            input_path = Path(tmp_in.name)

        output_path = input_path.with_name(f"hasil_online_{input_file.filename}")

        # Jalankan fungsi
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

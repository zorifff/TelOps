from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
import io

from backend.pairing_kuota_keluarga.generate_pairing import generate_pairing_report

router = APIRouter(tags=["Pairing Kuota Keluarga"])

@router.post("/process")
async def process_pairing_data(
    file: UploadFile = File(...),
    mode: str = Form("option_a")
):
    """
    Endpoint for processing Telkomsel One / Kuota Keluarga pairing Excel file.
    Returns transformed Excel file as downloadable stream.
    """
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="Format file harus berupa Excel (.xlsx atau .xls).")

    try:
        file_bytes = await file.read()
        file_buffer = io.BytesIO(file_bytes)
        
        output_bytes = generate_pairing_report(file_buffer, mode=mode)
        
        output_filename = "Pairing_Kuota_Keluarga_Unstacked.xlsx"
        
        return Response(
            content=output_bytes,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={
                "Content-Disposition": f"attachment; filename={output_filename}"
            }
        )
    except Exception as e:
        print(f"Error processing Pairing Kuota Keluarga: {e}")
        raise HTTPException(status_code=500, detail=f"Gagal memproses data pairing: {str(e)}")

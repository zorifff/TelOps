import os
import sys
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.location_finder.router import router as location_finder_router
from backend.automasi_report_odp.router import router as report_odp_router
from backend.automasi_report_black_odp.router import router as report_black_odp_router
from backend.automasi_report_lop.router import router as report_lop_router
from backend.update_gtm.router import router as update_gtm_router

app = FastAPI(title="TelOps API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(location_finder_router, prefix="/api/geocode")
app.include_router(report_odp_router, prefix="/api/report-odp")
app.include_router(report_black_odp_router, prefix="/api/report-black-odp")
app.include_router(report_lop_router, prefix="/api/report-lop")
app.include_router(update_gtm_router, prefix="/api/update-gtm")

# Determine base directory (PyInstaller frozen mode support)
if getattr(sys, 'frozen', False):
    BASE_DIR = Path(sys._MEIPASS)
else:
    BASE_DIR = Path(__file__).resolve().parent.parent

FRONTEND_DIST = BASE_DIR / "frontend" / "dist"

if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="static_assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = FRONTEND_DIST / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")
else:
    @app.get("/")
    def read_root():
        return {"message": "TelOps API is running"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.location_finder.router import router as location_finder_router
from backend.automasi_report_odp.router import router as report_odp_router
from backend.automasi_report_black_odp.router import router as report_black_odp_router
from backend.automasi_report_lop.router import router as report_lop_router

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

@app.get("/")
def read_root():
    return {"message": "TelOps API is running"}

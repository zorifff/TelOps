@echo off
echo =======================================
echo     Memulai TelOps Web Application
echo =======================================

echo.
echo [1] Memulai Backend (FastAPI)...
start "TelOps Backend (FastAPI)" cmd /k "python -m uvicorn api:app --reload"

echo [2] Memulai Frontend (React/Vite)...
start "TelOps Frontend (React)" cmd /k "cd frontend && npm run dev"

echo.
echo Selesai! Aplikasi sedang berjalan.
echo Jendela ini bisa Anda tutup, karena backend dan frontend sudah terbuka di jendela baru.
pause

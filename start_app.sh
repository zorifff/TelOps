#!/bin/bash
echo "======================================="
echo "    Memulai TelOps Web Application"
echo "======================================="
echo ""

echo "[1] Memulai Backend (FastAPI)..."
# Menjalankan backend di background
python3 -m uvicorn backend.main:app --reload &
BACKEND_PID=$!

echo "[2] Memulai Frontend (React/Vite)..."
cd frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Selesai! Aplikasi sedang berjalan."
echo "Tekan CTRL+C untuk menghentikan server dan keluar aplikasi."

# Menangkap sinyal CTRL+C (SIGINT) untuk mematikan background processes
trap "echo ''; echo 'Mematikan server...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

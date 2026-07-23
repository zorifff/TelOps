#!/bin/bash
echo "======================================="
echo "    Instalasi TelOps Web Application"
echo "======================================="
echo ""
echo "Pastikan Anda sudah menginstall Python (python3) dan Node.js sebelum melanjutkan!"
echo "Tekan Enter untuk melanjutkan..."
read

echo ""
echo "[1/2] Menginstall dependencies Backend (Python)..."
# Mencoba menggunakan pip3, jika gagal gunakan pip
pip3 install -r requirements.txt || pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[ERROR] Gagal menginstall Python dependencies. Pastikan Python/pip sudah terinstall."
    exit 1
fi

echo ""
echo "[2/2] Menginstall dependencies Frontend (Node.js)..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "[ERROR] Gagal menginstall Node.js dependencies. Pastikan Node.js/npm sudah terinstall."
    exit 1
fi
cd ..

echo ""
echo "======================================="
echo "Instalasi Selesai!"
echo "Anda sekarang bisa menjalankan aplikasi dengan mengetik: ./start_app.sh"
echo "======================================="

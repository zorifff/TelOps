@echo off
echo =======================================
echo     Instalasi TelOps Web Application
echo =======================================
echo.
echo Pastikan Anda sudah menginstall Python dan Node.js sebelum melanjutkan!
echo.
pause

echo.
echo [1/2] Menginstall dependencies Backend (Python)...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Gagal menginstall Python dependencies. 
    echo Pastikan Python sudah terinstall dan opsi "Add Python to PATH" dicentang.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/2] Menginstall dependencies Frontend (Node.js)...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Gagal menginstall Node.js dependencies. 
    echo Pastikan Node.js sudah terinstall dengan benar.
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo =======================================
echo Instalasi Selesai! 
echo Anda sekarang bisa menjalankan aplikasi dengan klik dua kali pada "start_app.bat".
echo =======================================
pause

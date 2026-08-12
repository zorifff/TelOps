@echo off
echo ===================================================
echo     Memulai Proses Build TelOps Desktop (.exe)
echo ===================================================

echo.
echo [1/3] Membangun Frontend (React/Vite)...
cd frontend
call cmd /c "npm run build"
if %errorlevel% neq 0 (
    echo [ERROR] Gagal melakukan build frontend.
    pause
    exit /b %errorlevel%
)
cd ..

echo.
echo [2/3] Mengemas Backend & Frontend dengan PyInstaller...
python -m PyInstaller telops.spec --noconfirm
if %errorlevel% neq 0 (
    echo [ERROR] Gagal mengemas dengan PyInstaller.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Membangun Setup Installer (.exe) dengan Inno Setup...
set ISCC="C:\Users\gatfa\AppData\Local\Programs\Antigravity IDE\resources\app\node_modules\innosetup\bin\ISCC.exe"
if exist %ISCC% (
    %ISCC% installer.iss
    if %errorlevel% neq 0 (
        echo [ERROR] Gagal membuat installer.
        pause
        exit /b %errorlevel%
    )
) else (
    echo [WARNING] ISCC.exe tidak ditemukan di lokasi standar. Lewati pembuatan installer.
)

echo.
echo ===================================================
echo  Proses Build Selesai!
echo  Aplikasi Desktop (Folder Executable): dist\TelOps\TelOps.exe
echo  Setup Installer (.exe): Output\TelOps_Setup_v1.0.0.exe
echo ===================================================
pause

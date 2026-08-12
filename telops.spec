# -*- mode: python ; coding: utf-8 -*-
import os
import sys
from PyInstaller.utils.hooks import collect_data_files, collect_submodules, collect_all

block_cipher = None

BASE_DIR = os.path.dirname(os.path.abspath('desktop_app.py'))

# Collect all data files and submodules for uvicorn, fastapi, webview, templates, and shapefiles
datas = [
    (os.path.join(BASE_DIR, 'frontend', 'dist'), os.path.join('frontend', 'dist')),
    (os.path.join(BASE_DIR, 'backend', 'automasi_report_odp', 'Template_Report.xlsx'), os.path.join('backend', 'automasi_report_odp')),
    (os.path.join(BASE_DIR, 'backend', 'automasi_report_black_odp', 'Template_Report_Black.xlsx'), os.path.join('backend', 'automasi_report_black_odp')),
    (os.path.join(BASE_DIR, 'backend', 'automasi_report_lop', 'Template_LOP_Greenfield.xlsx'), os.path.join('backend', 'automasi_report_lop')),
    (os.path.join(BASE_DIR, 'backend', 'location_finder', 'DESA-KECAMATAN JATENG DIY.zip'), os.path.join('backend', 'location_finder')),
    (os.path.join(BASE_DIR, 'Logo_Telkomsel.ico'), '.'),
]

binaries = []

# Collect data, binaries, and submodules for key packages
datas += collect_data_files('fastapi')

pyd1_datas, pyd1_binaries, pyd1_hiddenimports = collect_all('pydantic_core')
datas += pyd1_datas
binaries += pyd1_binaries

pyd2_datas, pyd2_binaries, pyd2_hiddenimports = collect_all('pydantic')
datas += pyd2_datas
binaries += pyd2_binaries

hiddenimports = [
    'uvicorn.logging',
    'uvicorn.loops',
    'uvicorn.loops.auto',
    'uvicorn.protocols',
    'uvicorn.protocols.http',
    'uvicorn.protocols.http.auto',
    'uvicorn.protocols.http.h11_impl',
    'uvicorn.lifespan',
    'uvicorn.lifespan.on',
    'uvicorn.lifespan.off',
    'fastapi',
    'pydantic',
    'pydantic_core',
    'pydantic_core._pydantic_core',
    'pandas',
    'openpyxl',
    'shapely',
    'shapefile',
    'webview',
    'clr',
]
hiddenimports += pyd1_hiddenimports
hiddenimports += pyd2_hiddenimports
hiddenimports += collect_submodules('backend')

a = Analysis(
    ['desktop_app.py'],
    pathex=['.'],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='TelOps',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon='Logo_Telkomsel.ico',
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='TelOps',
)

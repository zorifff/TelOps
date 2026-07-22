# Pencarian alamat administratif offline

`reverse_geocode_desa_offline.py` mengubah koordinat dalam Excel menjadi alamat
administratif dengan polygon desa/kelurahan dari
`DESA-KECAMATAN JATENG DIY.zip`. Tidak ada API key, biaya per permintaan, atau
koneksi internet saat program dijalankan.

## Hasil

Sheet **Hasil** memiliki empat kolom: `bb_id`, `latitude`, `longitude`, dan
`alamat`. Bentuk alamatnya:

```text
Nama Desa/Kelurahan, Kec. Nama Kecamatan, Kabupaten/Kota, Provinsi
```

Sheet **Log** mencatat tiap baris yang berada di luar cakupan Jawa Tengah/DIY,
tidak valid, atau tepat pada batas yang mencakup lebih dari satu polygon.
Baris ambigu sengaja dibiarkan kosong agar tidak ada alamat yang dipilih secara
sembarang.

## Jalankan di Windows PowerShell

```powershell
py -m pip install -r requirements_offline.txt
py .\reverse_geocode_desa_offline.py `
  "C:\Users\NUGROHO GHATHFAAN R\Downloads\Telegram Desktop\raw order 18 jul.xlsx" `
  "C:\Users\NUGROHO GHATHFAAN R\Downloads\Telegram Desktop\DESA-KECAMATAN JATENG DIY.zip" `
  ".\hasil_alamat_administratif.xlsx"
```

Data batas yang tersedia mencakup Jawa Tengah dan DI Yogyakarta. Koordinat di
luar kedua wilayah tersebut akan dicatat sebagai `TIDAK_DITEMUKAN_DI_BATAS_DATA`.
Data sumber terlihat merujuk ke batas 2019; perbarui shapefile jika ada perubahan
administrasi sebelum menjadikannya data produksi jangka panjang.

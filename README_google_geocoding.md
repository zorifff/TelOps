# Otomasi pencarian alamat dari koordinat

Program `reverse_geocode_google.py` membaca Excel dengan kolom `bb_id`, `longitude`, dan `latitude`, kemudian membuat Excel baru dengan dua sheet:

- **Hasil**: `bb_id`, `latitude`, `longitude`, `alamat`.
- **Log**: audit tiap baris, alamat asli Google, dan status kelengkapan.

`latitude` adalah istilah yang tepat untuk kolom sumber yang pada permintaan disebut “altitude”. Altitude berarti ketinggian dan tidak dapat dipakai untuk menentukan alamat.

## Layanan yang dipakai

Skrip memakai **Google Maps Geocoding API** resmi, bukan scraping halaman Google Maps. Anda memerlukan project Google Cloud dengan billing aktif dan **Geocoding API** diaktifkan. Buat API key, lalu batasi key tersebut minimal ke Geocoding API dan batasi aplikasinya sesuai lingkungan penggunaan.

## Instalasi dan eksekusi

Di Windows PowerShell, buka folder tempat file ini berada lalu jalankan:

```powershell
py -m pip install -r requirements.txt
$env:GOOGLE_MAPS_API_KEY = "ISI_API_KEY_ANDA"
py .\reverse_geocode_google.py `
  "C:\Users\NUGROHO GHATHFAAN R\Downloads\Telegram Desktop\raw order 18 jul.xlsx" `
  ".\hasil_alamat_18_jul.xlsx"
```

Untuk Command Prompt gunakan `set GOOGLE_MAPS_API_KEY=ISI_API_KEY_ANDA`. Jangan menulis API key ke file Python, workbook, atau mengirimkannya di chat.

## Ketelitian

Skrip mengirim pasangan **latitude,longitude** (urutan Google yang benar), mengambil `address_components`, dan menyusun `desa/kelurahan, kecamatan, kabupaten/kota, provinsi` hanya dari komponen yang Google kembalikan. Ia tidak menebak nama wilayah. Nilai alamat asli Google juga disimpan di sheet **Log**.

Jika Google tidak mengembalikan salah satu dari empat level administrasi, baris tersebut diberi status `PERLU_VERIFIKASI_KOMPONEN`; alamatnya jangan dianggap final sampai diperiksa pada Google Maps. Baris dengan API error atau koordinat tidak valid juga dicatat di Log. Ini penting karena titik di batas wilayah atau jalan kadang tidak mempunyai komponen administratif lengkap.

Untuk 1.665 data pada workbook saat ini, biaya dan kuota mengikuti akun Google Cloud Anda. Skrip menjalankan satu request per koordinat unik, retry untuk kegagalan sementara, dan cache di memori untuk koordinat duplikat.

Referensi resmi: https://developers.google.com/maps/documentation/geocoding/requests-reverse-geocoding

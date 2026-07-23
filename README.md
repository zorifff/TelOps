# TelOps Web Application

Aplikasi web TelOps untuk manajemen dan automasi report ODP. Terdiri dari *backend* yang dibangun menggunakan Python (FastAPI) dan *frontend* menggunakan React (Vite).

## Persyaratan Sistem (Prerequisites)

Sebelum dapat menjalankan aplikasi ini, pastikan komputer Anda sudah terinstall:

1. **Python** (Versi 3.8 atau lebih baru) - [Download Python](https://www.python.org/downloads/)
   - *Pastikan opsi "Add Python to PATH" dicentang saat instalasi.*
2. **Node.js** (Versi 18 atau lebih baru disarankan) - [Download Node.js](https://nodejs.org/)

---

## Langkah Instalasi (Hanya dilakukan pertama kali)

Setelah Python dan Node.js terinstall, Anda hanya perlu menjalankan file instalasi otomatis:

**Bagi Pengguna Windows:**
1. Pastikan Anda berada di folder utama `TelOps`.
2. Klik dua kali pada file **`install.bat`**.
3. Jendela terminal hitam akan muncul. Tekan sembarang tombol (Enter) untuk memulai instalasi.
4. Tunggu hingga proses download selesai dan muncul tulisan **"Instalasi Selesai!"**.

**Bagi Pengguna macOS / Linux:**
1. Buka aplikasi **Terminal** dan arahkan (menggunakan `cd`) ke folder utama `TelOps`.
2. Berikan izin eksekusi file instalasi dengan mengetik: `chmod +x install.sh start_app.sh`
3. Jalankan file dengan mengetik: `./install.sh`
4. Tekan Enter dan tunggu proses download selesai.

*(Jika instalasi gagal di Windows, pastikan Anda telah mencentang "Add Python to PATH" saat menginstall Python).*

---

## Cara Menjalankan Aplikasi

Jika langkah instalasi di atas sudah dilakukan, Anda tidak perlu mengulanginya lagi di kemudian hari.

**Bagi Pengguna Windows:**
1. Pastikan Anda berada di folder utama `TelOps`.
2. Klik dua kali pada file **`start_app.bat`**.
3. Akan muncul jendela terminal berwarna hitam yang menjalankan proses server. **Jangan ditutup** selama Anda masih ingin menggunakan aplikasi.
4. *Frontend* (React) biasanya akan otomatis terbuka di browser web Anda (misalnya di `http://localhost:5173`). Jika tidak terbuka otomatis, Anda bisa mengecek URL yang tertera di terminal.

**Bagi Pengguna macOS / Linux:**
1. Buka aplikasi **Terminal** di dalam folder `TelOps`.
2. Ketik dan jalankan perintah: `./start_app.sh`
3. Server akan berjalan di Terminal tersebut. **Jangan ditutup** selama Anda masih ingin menggunakan aplikasi. Tekan `CTRL+C` di Terminal untuk mematikan server.
4. Buka browser web Anda secara manual dan kunjungi `http://localhost:5173`.

---

## Troubleshooting

- Jika muncul tulisan *"`pip` is not recognized..."* atau *"`npm` is not recognized..."*, kemungkinan Python atau Node.js belum terpasang dengan benar di *Environment Variables (PATH)* komputer Anda. Silakan *restart* komputer atau periksa kembali proses instalasi Python/Node.js.

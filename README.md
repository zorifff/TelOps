# TelOps Web Application

Aplikasi web TelOps untuk manajemen dan automasi report ODP. Terdiri dari *backend* yang dibangun menggunakan Python (FastAPI) dan *frontend* menggunakan React (Vite).

## Persyaratan Sistem (Prerequisites)

Sebelum dapat menjalankan aplikasi ini, pastikan komputer Anda sudah terinstall:

1. **Python** (Versi 3.8 atau lebih baru) - [Download Python](https://www.python.org/downloads/)
   - *Pastikan opsi "Add Python to PATH" dicentang saat instalasi.*
2. **Node.js** (Versi 18 atau lebih baru disarankan) - [Download Node.js](https://nodejs.org/)

---

## Langkah Instalasi (Hanya dilakukan pertama kali)

Setelah Python dan Node.js terinstall, ikuti 2 langkah mudah berikut untuk mengunduh semua kebutuhan (*dependencies*) aplikasi:

### 1. Install Dependencies Backend (Python)
Buka aplikasi **Command Prompt (CMD)** atau **Terminal** di dalam folder `TelOps` ini, lalu ketik dan jalankan perintah berikut:
```bash
pip install -r requirements.txt
```
*(Tunggu hingga proses download selesai)*

### 2. Install Dependencies Frontend (Node.js)
Masih menggunakan Terminal, masuk ke dalam folder `frontend`, lalu jalankan instalasi:
```bash
cd frontend
npm install
```
*(Tunggu hingga proses download library React selesai)*

---

## Cara Menjalankan Aplikasi

Jika langkah instalasi di atas sudah dilakukan, Anda tidak perlu mengulanginya lagi di kemudian hari.

Untuk menjalankan aplikasi web:
1. Pastikan Anda berada di folder utama `TelOps`.
2. Klik dua kali pada file **`start_app.bat`**.
3. Akan muncul jendela terminal berwarna hitam yang menjalankan proses server. **Jangan ditutup** selama Anda masih ingin menggunakan aplikasi.
4. *Frontend* (React) biasanya akan otomatis terbuka di browser web Anda (misalnya di `http://localhost:5173`). Jika tidak terbuka otomatis, Anda bisa mengecek URL yang tertera di terminal.

---

## Troubleshooting

- Jika muncul tulisan *"`pip` is not recognized..."* atau *"`npm` is not recognized..."*, kemungkinan Python atau Node.js belum terpasang dengan benar di *Environment Variables (PATH)* komputer Anda. Silakan *restart* komputer atau periksa kembali proses instalasi Python/Node.js.

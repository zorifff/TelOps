import streamlit as st
import tempfile
import os
from pathlib import Path

# Kita akan memanggil fungsi ini dari file yang sudah dimodifikasi
# (pastikan file app.py ini berada di folder yang sama dengan script lainnya)
from reverse_geocode_desa_offline import process_offline
from reverse_geocode_google import process_google

st.set_page_config(page_title="Reverse Geocoding", layout="centered")

st.title("📍 Reverse Geocoding App")
st.write("Aplikasi untuk mencari alamat administratif dari koordinat latitude dan longitude di dalam file Excel.")

# Dropdown untuk memilih metode
method = st.selectbox(
    "Pilih Metode Pencarian",
    ("Offline (Shapefile)", "Online (Google Maps API)")
)

st.divider()

# Input file Excel utama
input_file = st.file_uploader("Unggah file Excel sumber (.xlsx)", type=["xlsx"])

# Input spesifik berdasarkan metode yang dipilih
boundary_zip = None
api_key = None

if method == "Offline (Shapefile)":
    st.info("Metode offline membutuhkan file ZIP Shapefile (misal: DESA-KECAMATAN JATENG DIY.zip).")
    boundary_zip = st.file_uploader("Unggah file ZIP Shapefile (.zip)", type=["zip"])
else:
    st.info("Metode online membutuhkan Google Maps API Key yang valid.")
    api_key = st.text_input("Masukkan Google Maps API Key", type="password")

if st.button("Jalankan Geocoding", type="primary"):
    # Validasi input sebelum proses
    if not input_file:
        st.error("Harap unggah file Excel sumber terlebih dahulu.")
    elif method == "Offline (Shapefile)" and not boundary_zip:
        st.error("Harap unggah file ZIP Shapefile.")
    elif method == "Online (Google Maps API)" and not api_key:
        st.error("Harap masukkan API Key.")
    else:
        with st.spinner("Sedang memproses data, harap tunggu..."):
            # Streamlit menyimpan file uploader di memori. 
            # Karena script asli membaca lewat Path (file lokal), kita buat file sementara.
            with tempfile.NamedTemporaryFile(delete=False, suffix=".xlsx") as tmp_in:
                tmp_in.write(input_file.getvalue())
                input_path = Path(tmp_in.name)

            output_path = input_path.with_name(f"hasil_{input_path.name}")
            
            try:
                if method == "Offline (Shapefile)":
                    # Buat temporary file untuk ZIP
                    with tempfile.NamedTemporaryFile(delete=False, suffix=".zip") as tmp_zip:
                        tmp_zip.write(boundary_zip.getvalue())
                        zip_path = Path(tmp_zip.name)
                    
                    # Panggil fungsi yang telah kita pisahkan dari reverse_geocode_desa_offline.py
                    process_offline(input_path, zip_path, output_path)
                    
                    # Hapus file zip sementara
                    os.remove(zip_path)
                    
                else:
                    # Panggil fungsi yang telah kita pisahkan dari reverse_geocode_google.py
                    process_google(input_path, output_path, api_key)

                # Jika berhasil, berikan opsi download
                if output_path.exists():
                    st.success("✅ Proses geocoding selesai!")
                    with open(output_path, "rb") as f:
                        st.download_button(
                            label="Unduh Hasil Excel",
                            data=f.read(),
                            file_name="hasil_geocoding.xlsx",
                            mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        )
                    # Hapus file hasil sementara setelah dibaca untuk download button
                    try:
                        os.remove(output_path)
                    except Exception:
                        pass
                else:
                    st.error("Gagal menghasilkan file output.")
                    
            except Exception as e:
                st.error(f"❌ Terjadi kesalahan saat memproses: {e}")
            finally:
                # Bersihkan file input sementara
                try:
                    if input_path.exists():
                        os.remove(input_path)
                except Exception:
                    pass

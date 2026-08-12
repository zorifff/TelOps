import React, { useState, useRef } from "react";
import FileUploader from "../components/FileUploader";
import { saveFileWithPicker } from "../utils/fileSaver";

export default function PairingKuotaKeluarga() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"option_a" | "option_b">("option_a");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcess = async () => {
    if (!file) {
      alert("Harap unggah file Excel Data Pairing Tsel One / Kuota Keluarga.");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("mode", mode);

      const url = "/api/pairing-kuota-keluarga/process";

      const response = await fetch(url, { method: "POST", body: formData });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Terjadi kesalahan pada server");
      }

      const blob = await response.blob();
      const defaultFilename = `Tsel_One_Pairing_Data_${mode === 'option_a' ? 'Full' : 'MSISDN'}_Unstacked.xlsx`;
      await saveFileWithPicker(blob, defaultFilename);
    } catch (e: any) {
      if (e.message !== 'Penyimpanan file dibatalkan oleh pengguna.' && e.name !== 'AbortError') {
        alert(`Error: ${e.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-['Poppins']">
      
      {/* HEADER ACTION CARD */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[20px] font-bold text-[#001a3f] m-0">
            Fitur Pairing Kuota Keluarga
          </h2>
          <p className="text-[13px] text-slate-500 m-0">
            Transformasi data pairing 1:M (Long Format) menjadi tabel baris unik 1:1 (Wide Format) dengan nomor MSISDN bersih.
          </p>
        </div>

        <button
          onClick={() => setIsGuideOpen(!isGuideOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-[13px] transition-all cursor-pointer w-fit shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{isGuideOpen ? "Tutup Panduan" : "Lihat Panduan & Syarat File"}</span>
        </button>
      </div>

      {/* COLLAPSIBLE GUIDELINE SECTION */}
      {isGuideOpen && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 flex flex-col gap-4 text-slate-700 animate-fadeIn">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-[15px]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Syarat Berkas Excel Data Pairing yang Diunggah:</span>
          </div>

          <ul className="list-disc list-inside text-[13px] text-slate-600 space-y-1.5 pl-1 leading-relaxed">
            <li>File harus berformat Excel (<strong>.xlsx</strong> atau <strong>.xls</strong>).</li>
            <li>Memiliki kolom utama: <code>bb_id</code>, <code>msisdn_parent</code>, dan <code>msisdn_child</code>.</li>
            <li>Dapat menyertakan kolom tanggal & TID child (<code>activation_date_child</code>, <code>tsel_id_mobile_child</code>) serta metadata broadband lainnya.</li>
            <li>Setiap nomor telepon (MSISDN) akan dibersihkan secara otomatis dari notasi ilmiah (<code>6.28E+12</code>) dan angka desimal (<code>.0</code>).</li>
          </ul>
        </div>
      )}

      {/* OPTIONS SELECTOR CARD */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
        <label className="text-[14px] font-bold text-[#001a3f] flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Pilih Mode Opsi Output Child:
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            onClick={() => setMode("option_a")}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-1.5 ${
              mode === "option_a"
                ? "border-red-600 bg-red-50/30 text-[#001a3f]"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px]">Opsi A: Lengkap + Metadata Child (Rekomendasi)</span>
              <input
                type="radio"
                name="option_mode"
                checked={mode === "option_a"}
                onChange={() => setMode("option_a")}
                className="accent-red-600 h-4 w-4"
              />
            </div>
            <p className="text-[12px] text-slate-500 m-0 leading-relaxed">
              Mengekstrak <code>msisdn_child1..N</code> berdampingan dengan <code>activation_date_child1..N</code> dan <code>tsel_id_mobile_child1..N</code>.
            </p>
          </div>

          <div
            onClick={() => setMode("option_b")}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col gap-1.5 ${
              mode === "option_b"
                ? "border-red-600 bg-red-50/30 text-[#001a3f]"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-[14px]">Opsi B: Hanya MSISDN Child</span>
              <input
                type="radio"
                name="option_mode"
                checked={mode === "option_b"}
                onChange={() => setMode("option_b")}
                className="accent-red-600 h-4 w-4"
              />
            </div>
            <p className="text-[12px] text-slate-500 m-0 leading-relaxed">
              Hanya mengekstrak kolom nomor telepon <code>msisdn_child1..N</code> tanpa kolom tanggal & TID child.
            </p>
          </div>
        </div>
      </div>

      {/* FILE UPLOAD CARD */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-4">
        <label className="text-[14px] font-bold text-[#001a3f]">
          Unggah File Excel Data Pairing Tsel One / Kuota Keluarga:
        </label>

        <FileUploader
          label="Pilih atau tarik berkas Excel Data Pairing (.xlsx / .xls)"
          file={file}
          setFile={setFile}
          accept=".xlsx,.xls"
          inputRef={fileInputRef}
        />
      </div>

      {/* PROCESS ACTION BUTTON */}
      <button
        onClick={handleProcess}
        disabled={isProcessing || !file}
        className={`w-full py-4 rounded-2xl font-bold text-[15px] transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer ${
          isProcessing || !file
            ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
            : "bg-[#ee2e24] text-white hover:bg-red-700 shadow-red-900/20 active:scale-[0.99]"
        }`}
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Memproses & Mentransformasi Data Pairing...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>PROSES UNSTACKING DATA PAIRING</span>
          </>
        )}
      </button>

    </div>
  );
}

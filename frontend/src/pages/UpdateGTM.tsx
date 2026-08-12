import React, { useState, useRef } from "react";
import svgPaths from "../svg-crt6tt6kec";
import FileUploader from "../components/FileUploader";
import { saveFileWithPicker } from "../utils/fileSaver";

export default function UpdateGTM() {
  const [w0File, setW0File] = useState<File | null>(null);
  const [w1File, setW1File] = useState<File | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const w0InputRef = useRef<HTMLInputElement>(null);
  const w1InputRef = useRef<HTMLInputElement>(null);

  const handleProcess = async () => {
    if (!w0File || !w1File) {
      alert("Harap unggah file Raw Data W-0 (Terbaru) dan File W-1 (Minggu Lalu).");
      return;
    }

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("w0_file", w0File);
      formData.append("w1_file", w1File);

      const url = "/api/update-gtm/generate";

      const response = await fetch(url, { method: "POST", body: formData });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Terjadi kesalahan pada server");
      }

      const blob = await response.blob();
      await saveFileWithPicker(blob, "Update_GTM_Requirement_Generated.xlsx");
    } catch (e: any) {
      if (e.message !== 'Penyimpanan file dibatalkan oleh pengguna.' && e.name !== 'AbortError') {
        alert(`Error: ${e.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* WORKSPACE CARD CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Card Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex flex-col">
            <h2 className="text-[20px] font-bold text-[#001a3f] m-0">Fitur Update GTM</h2>
            <span className="text-[13px] text-slate-500 font-medium">
              Memproses file laporan Excel untuk diunggah ke website GTM guna memperbarui data sistem.
            </span>
          </div>

          <button 
            onClick={() => setIsGuideOpen(!isGuideOpen)}
            className="bg-white border border-slate-300 hover:bg-slate-50 text-[#001a3f] px-3.5 py-2 rounded-xl font-medium text-[14px] flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ee2e24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{isGuideOpen ? "Tutup Panduan" : "Lihat Panduan & Syarat File"}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-[#64748b] transition-transform duration-200 ${isGuideOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Accordion Guide (Detailed Website Style) */}
        {isGuideOpen && (
          <div className="px-8 py-5 bg-slate-50 border-b border-slate-200">
            <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-6 font-['Poppins'] text-[#344970] text-[14px] leading-relaxed shadow-sm">
              <p className="mb-4 font-normal text-[#344970]">
                Agar sistem dapat menghasilkan file Update GTM dengan presisi, pastikan file Excel yang Anda unggah memenuhi kriteria berikut:
              </p>
              
              <div className="mb-6">
                <h4 className="font-bold text-[#001a3f] text-[16px] mb-2 flex items-center gap-2">
                  1. File W-0 (Raw Data Terbaru)
                </h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Wajib memiliki sheet: <code className="bg-gray-200 text-[#ee2e24] px-1.5 py-0.5 rounded font-mono text-[13px]">ODP Golive 2026</code> (atau sheet raw data ODP)</li>
                  <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Telkomsel Branch</code></li>
                  <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">WOK</code></li>
                  <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Nama Proyek</code></li>
                  <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">ODP NAME</code></li>
                  <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">LATITUDE</code> & <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">LONGITUDE</code></li>
                  <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">OCC 2</code></li>
                  <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Type Design</code> (Greenfield / Brownfield)</li>
                  <li>Wajib memiliki kolom Used: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Used_new_v3</code>, <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Used_new_v2</code>, atau <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Used</code></li>
                  <li>Wajib memiliki kolom Total Port: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Port Terbangun</code> atau <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Total</code></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#001a3f] text-[16px] mb-2 flex items-center gap-2">
                  2. File W-1 (Data / Laporan Minggu Lalu)
                </h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Dapat berupa <b>File Output Laporan Occupancy</b> (yang memiliki sheet <code className="bg-gray-200 text-[#ee2e24] px-1.5 py-0.5 rounded font-mono text-[13px]">Report - Occupancy</code>), atau</li>
                  <li>Dapat berupa <b>File Raw Data Minggu Lalu</b> (yang memiliki sheet <code className="bg-gray-200 text-[#ee2e24] px-1.5 py-0.5 rounded font-mono text-[13px]">ODP Golive 2026</code>).</li>
                  <li>Digunakan untuk kalkulasi perbandingan persentase <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Gap WoW</code> per Branch dan regional Jateng DIY.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Form Workstation Content */}
        <div className="p-8 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <FileUploader label="1. File W-0 (Raw Data Terbaru)" file={w0File} inputRef={w0InputRef} setFile={setW0File} />
            <FileUploader label="2. File W-1 (File Laporan Minggu Lalu)" file={w1File} inputRef={w1InputRef} setFile={setW1File} />
          </div>

          <button 
            onClick={handleProcess}
            disabled={isProcessing}
            className="bg-[#ee2e24] hover:bg-[#d62820] disabled:bg-red-300 text-white rounded-xl w-full py-4 flex gap-3 items-center justify-center transition-all duration-200 cursor-pointer border-none shadow-md font-bold text-[18px] tracking-wide uppercase"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>MEMPROSES UPDATE GTM...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path d={svgPaths.p30eba500} fill="white" />
                </svg>
                <span>MULAI</span>
              </div>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}

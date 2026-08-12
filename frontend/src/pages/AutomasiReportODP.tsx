import React, { useState, useRef } from "react";
import svgPaths from "../svg-crt6tt6kec";
import FileUploader from "../components/FileUploader";
import { saveFileWithPicker } from "../utils/fileSaver";

export default function AutomasiReportODP() {
  const [w0File, setW0File] = useState<File | null>(null);
  const [w1File, setW1File] = useState<File | null>(null);

  const [typeDesign, setTypeDesign] = useState<"GREENFIELD" | "BROWNFIELD" | "ALL" | "COMBINED">("GREENFIELD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const w0InputRef = useRef<HTMLInputElement>(null);
  const w1InputRef = useRef<HTMLInputElement>(null);

  const handleProcess = async () => {
    if (!w0File || !w1File) {
        alert("Harap unggah file W-0 dan W-1.");
        return;
    }
    
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("w0_file", w0File);
      formData.append("w1_file", w1File);
      
      const url = `/api/report-odp/generate?type_design=${typeDesign}`;

      const response = await fetch(url, { method: "POST", body: formData });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Terjadi kesalahan pada server");
      }
      
      const blob = await response.blob();
      const labelMap = {
        GREENFIELD: 'Greenfield',
        BROWNFIELD: 'Brownfield',
        ALL: 'All_Type_Design',
        COMBINED: 'Combined_3_Tables'
      };
      const defaultFilename = `Report_Occupancy_${labelMap[typeDesign]}.xlsx`;
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
    <div className="w-full flex flex-col gap-6">
      
      {/* WORKSPACE CARD CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Card Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex flex-col">
            <h2 className="text-[20px] font-bold text-[#001a3f] m-0">Automasi Report Occupancy ODP</h2>
            <span className="text-[13px] text-slate-500 font-medium">Analisis tracking Occupancy ODP New Golive 2026</span>
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
              <p className="mb-4">
                Agar sistem dapat menghitung data Occupancy dengan presisi, pastikan file Excel yang Anda unggah memenuhi kriteria berikut:
              </p>
              
              <div className="mb-6">
                <h4 className="font-bold text-[#001a3f] text-[16px] mb-2 flex items-center gap-2">
                  1. Opsi Mode Perhitungan (Type Design)
                </h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li><b>Greenfield:</b> Memproses data Occupancy khusus tipe Greenfield (1 tabel).</li>
                  <li><b>Brownfield:</b> Memproses data Occupancy khusus tipe Brownfield (1 tabel).</li>
                  <li><b>All Type Design:</b> Memproses seluruh data Occupancy tanpa memfilter Type Design (1 tabel).</li>
                  <li><b>Combined (3 Tabel):</b> Menggabungkan ketiga tabel (Greenfield, Brownfield, dan All Type Design) secara berurutan dalam 1 sheet <code>Report - Occupancy</code>.</li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-bold text-[#001a3f] text-[16px] mb-2 flex items-center gap-2">
                  2. File W-0 (Raw Data)
                </h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Wajib memiliki sheet: <code className="bg-gray-200 text-[#ee2e24] px-1.5 py-0.5 rounded font-mono text-[13px]">ODP Golive 2026</code></li>
                  <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">WOK</code></li>
                  <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Type Design</code> (Greenfield / Brownfield)</li>
                  <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Port Terbangun</code></li>
                  <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Used_new_v3</code> atau <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Used_new_v2</code></li>
                  <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Cat Durasi Go Live</code></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#001a3f] text-[16px] mb-2 flex items-center gap-2">
                  3. File W-1 (Laporan Minggu Lalu)
                </h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Wajib memiliki sheet: <code className="bg-gray-200 text-[#ee2e24] px-1.5 py-0.5 rounded font-mono text-[13px]">Report - Occupancy</code></li>
                  <li>Jika tabel tipe tertentu tidak ditemukan di file W-1, kolom <i>OCC W-1</i> pada tabel tersebut akan otomatis diset kosong.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Form Workstation Content */}
        <div className="p-8 flex flex-col gap-8">
          
          {/* TYPE DESIGN SELECTOR TABS */}
          <div className="flex flex-col gap-2">
            <label className="text-[14px] font-bold text-[#001a3f]">
              Pilih Jenis Perhitungan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setTypeDesign("GREENFIELD")}
                className={`py-3 px-2.5 rounded-lg font-bold text-[13px] transition-all cursor-pointer border-none text-center ${
                  typeDesign === "GREENFIELD"
                    ? "bg-[#ee2e24] text-white shadow-md"
                    : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                1. Greenfield
              </button>

              <button
                type="button"
                onClick={() => setTypeDesign("BROWNFIELD")}
                className={`py-3 px-2.5 rounded-lg font-bold text-[13px] transition-all cursor-pointer border-none text-center ${
                  typeDesign === "BROWNFIELD"
                    ? "bg-[#ee2e24] text-white shadow-md"
                    : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                2. Brownfield
              </button>

              <button
                type="button"
                onClick={() => setTypeDesign("ALL")}
                className={`py-3 px-2.5 rounded-lg font-bold text-[13px] transition-all cursor-pointer border-none text-center ${
                  typeDesign === "ALL"
                    ? "bg-[#ee2e24] text-white shadow-md"
                    : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                3. All Type Design
              </button>

              <button
                type="button"
                onClick={() => setTypeDesign("COMBINED")}
                className={`py-3 px-2.5 rounded-lg font-bold text-[13px] transition-all cursor-pointer border-none text-center ${
                  typeDesign === "COMBINED"
                    ? "bg-[#ee2e24] text-white shadow-md"
                    : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                4. Combined (3 Tabel)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <FileUploader label="1. File W-0 (Raw Data)" file={w0File} inputRef={w0InputRef} setFile={setW0File} />
            <FileUploader label="2. File W-1 (Minggu Lalu)" file={w1File} inputRef={w1InputRef} setFile={setW1File} />
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
                <span>MEMPROSES LAPORAN...</span>
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

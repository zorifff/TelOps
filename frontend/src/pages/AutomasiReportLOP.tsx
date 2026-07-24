import React, { useState, useRef } from "react";
import svgPaths from "../svg-crt6tt6kec";

export default function AutomasiReportLOP() {
  const [w0File, setW0File] = useState<File | null>(null);
  const [w1File, setW1File] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");

  const [status, setStatus] = useState("Menunggu File Diunggah...");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const w0InputRef = useRef<HTMLInputElement>(null);
  const w1InputRef = useRef<HTMLInputElement>(null);

  const handleProcess = async () => {
    if (!w0File || !w1File) {
        setStatus("Error: Harap unggah file W-0 dan W-1.");
        return;
    }
    
    setIsProcessing(true);
    setStatus("Memproses laporan ODP, harap tunggu...");

    try {
      const formData = new FormData();
      formData.append("w0_file", w0File);
      formData.append("w1_file", w1File);
      
      const url = "/api/report-lop/generate";

      const response = await fetch(url, { method: "POST", body: formData });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Terjadi kesalahan pada server");
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName.trim() ? `${fileName.trim()}.xlsx` : `Report_LOP_Generated.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setStatus("File report berhasil diunduh");
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const FileUploader = ({ label, file, inputRef, setFile }: any) => (
    <div className="flex flex-col items-start relative w-full">
      <div className="pb-[16px] w-full">
        <div className="font-['Poppins'] font-semibold text-[#001a3f] text-[20px]">
          {label}
        </div>
      </div>
      <div 
        className="bg-[#f8fafc] h-[192px] relative rounded-[8px] w-full cursor-pointer border-2 border-[#cbd5e1] border-dashed flex flex-col items-center justify-center p-[34px] hover:bg-gray-100 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <input type="file" className="hidden" accept=".xlsx" ref={inputRef} onChange={(e) => e.target.files && setFile(e.target.files[0])} />
        <div className="relative shrink-0 size-[32px] mb-2">
          <svg className="absolute block inset-0 size-full" viewBox="0 0 24 24">
            <path d={svgPaths.p18a23d18} fill="#002D6B" />
          </svg>
        </div>
        <div className="font-['Poppins'] font-semibold text-[#001a3f] text-[14px] text-center">
          Unggah file (.xlsx)
        </div>
        <div className="font-['Poppins'] font-medium text-[#344970] text-[12px] text-center mt-1 truncate max-w-full px-2">
          {file ? file.name : "Klik atau seret file ke sini"}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center w-full max-w-[896px] pb-[8px] px-4 mx-auto">
      <div className="bg-white relative rounded-[12px] w-full shadow-[0px_10px_30px_0px_rgba(0,12,29,0.1)] border border-[#e5e7eb] overflow-hidden">
        
        <div className="flex flex-col gap-[32px] p-[33px] relative">
          <div className="flex flex-col w-full">
            <div className="flex justify-end items-center w-full mb-2">
               <button 
                  onClick={() => setIsGuideOpen(!isGuideOpen)}
                  className="bg-white border border-[#cbd5e1] hover:bg-gray-50 text-[#001a3f] px-4 py-2 rounded-lg font-['Poppins'] font-medium text-[14px] flex items-center gap-2 transition-colors cursor-pointer"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#ee2e24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {isGuideOpen ? "Tutup Panduan" : "Lihat Panduan & Syarat File"}
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-[#64748b] transition-transform duration-200 ${isGuideOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
               </button>
            </div>
            
            {/* Accordion Content */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isGuideOpen ? 'max-h-[800px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
               <div className="bg-[#f8fafc] border border-[#cbd5e1] rounded-xl p-6 font-['Poppins'] text-[#344970] text-[14px] leading-relaxed">
                  <p className="mb-4">
                    Agar sistem dapat menghitung data Report LOP dengan tepat, pastikan file Excel yang Anda unggah memenuhi kriteria berikut:
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-[#001a3f] text-[16px] mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#ee2e24]"></div>
                      1. File W-0 (Raw Data)
                    </h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Wajib memiliki sheet: <code className="bg-gray-200 text-[#ee2e24] px-1.5 py-0.5 rounded font-mono text-[13px]">ODP Golive 2026</code></li>
                      <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Type Design</code> (Hanya membaca GREENFIELD)</li>
                      <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Nama Proyek</code></li>
                      <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Telkomsel Branch</code></li>
                      <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">WOK</code></li>
                      <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Cat Durasi Go Live</code></li>
                      <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">ODP NAME</code> (Untuk menghitung jumlah ODP)</li>
                      <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Port Terbangun</code></li>
                      <li>Wajib memiliki kolom: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Used_new_v3</code> atau <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono text-[13px]">Used_new_v2</code></li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-[#001a3f] text-[16px] mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#ee2e24]"></div>
                      2. File W-1 (Laporan Minggu Lalu)
                    </h4>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Wajib memiliki sheet: <code className="bg-gray-200 text-[#ee2e24] px-1.5 py-0.5 rounded font-mono text-[13px]">Report per LOP</code></li>
                    </ul>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] w-full relative">
            <FileUploader label="1. File W-0 (Raw Data)" file={w0File} inputRef={w0InputRef} setFile={setW0File} />
            <FileUploader label="2. File W-1 (Minggu Lalu)" file={w1File} inputRef={w1InputRef} setFile={setW1File} />
          </div>
          
          {/* Custom File Name Input */}
          <div className="w-full">
            <div className="font-['Poppins'] font-medium text-[#001a3f] text-[14px] mb-2">
              Nama File Laporan (Opsional)
            </div>
            <input 
              type="text" 
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Contoh: Report_LOP_September"
              className="w-full border border-[#cbd5e1] rounded-[8px] px-4 py-3 font-['Poppins'] text-[14px] text-[#001a3f] outline-none focus:border-[#ee2e24] transition-colors"
            />
          </div>
          
          <button 
            onClick={handleProcess}
            disabled={isProcessing}
            className="bg-[#ee2e24] hover:bg-[#d62820] disabled:bg-[#fca5a5] rounded-[8px] w-full py-[16px] flex gap-[8px] items-center justify-center transition-colors cursor-pointer border-none"
          >
            <div className="h-[24px] relative shrink-0 w-[24px]">
              <svg className="absolute block inset-0 size-full" viewBox="0 0 24 24">
                <path d={svgPaths.p30eba500} fill="white" />
              </svg>
            </div>
            <div className="font-['Poppins'] font-bold text-[20px] text-white tracking-[0.6px] uppercase">
              {isProcessing ? "MEMPROSES..." : "JALANKAN PROGRAM"}
            </div>
          </button>
        </div>
      </div>
      
      {/* Status Log */}
      <div className="flex gap-[12px] items-center w-full mt-4 px-[17px] py-[8px]">
        <div className={`${isProcessing ? 'bg-[#eab308]' : status.includes('Error') ? 'bg-[#ef4444]' : 'bg-[#22c55e]'} rounded-[9999px] shrink-0 size-[8px]`} />
        <div className="font-['Poppins'] text-[#64748b] text-[14px]">
           {status.endsWith("...") ? status.slice(0, -3) : status}
           {status.endsWith("...") && <span className="animate-ellipsis"></span>}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef } from "react";
import svgPaths from "../svg-crt6tt6kec";

export default function AutomasiReportODP() {
  const [w0File, setW0File] = useState<File | null>(null);
  const [w1File, setW1File] = useState<File | null>(null);

  const [status, setStatus] = useState("Menunggu File Diunggah...");
  const [isProcessing, setIsProcessing] = useState(false);

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
      
      const url = "http://localhost:8000/api/report-odp/generate";

      const response = await fetch(url, { method: "POST", body: formData });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Terjadi kesalahan pada server");
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Report_Occupancy_Generated.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setStatus("Berhasil! File Report Occupancy telah diunduh.");
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
          Unggah file Excel sumber (.xlsx)
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] w-full relative">
            <FileUploader label="1. File W-0 (Raw Data)" file={w0File} inputRef={w0InputRef} setFile={setW0File} />
            <FileUploader label="2. File W-1 (Minggu Lalu)" file={w1File} inputRef={w1InputRef} setFile={setW1File} />
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
        <div className="font-['Courier_New',monospace] text-[#001a3f] font-semibold text-[14px]">
           {status}
        </div>
      </div>
    </div>
  );
}

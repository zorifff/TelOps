import React, { useState, useRef } from "react";
import svgPaths from "../svg-crt6tt6kec";

export default function LocationFinder() {
  const [method, setMethod] = useState<"offline" | "online">("offline");
  const [excelFile, setExcelFile] = useState<File | null>(null);

  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("Menunggu File Diunggah...");
  const [isProcessing, setIsProcessing] = useState(false);

  const excelInputRef = useRef<HTMLInputElement>(null);

  const handleProcess = async () => {
    if (!excelFile) {
        setStatus("Error: Harap unggah file Excel sumber.");
        return;
    }
    
    setIsProcessing(true);
    setStatus("Memproses data, harap tunggu...");

    try {
      const formData = new FormData();
      formData.append("input_file", excelFile);
      
      let url = "http://localhost:8000/api/geocode/offline";
      if (method === "offline") {
          // No additional logic needed for offline
      } else {
         if (!apiKey) {
            setStatus("Error: Harap masukkan Google Maps API Key.");
            setIsProcessing(false);
            return;
         }
         formData.append("api_key", apiKey);
         url = "http://localhost:8000/api/geocode/online";
      }

      const response = await fetch(url, { method: "POST", body: formData });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Terjadi kesalahan pada server");
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `hasil_${excelFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setStatus("Berhasil! File Report telah diunduh.");
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[896px] pb-[8px] px-4 mx-auto">
      <div className="bg-white relative rounded-[12px] w-full shadow-[0px_10px_30px_0px_rgba(0,12,29,0.1)] border border-[#e5e7eb] overflow-hidden">
        {method === 'offline' ? (
          <div className="flex flex-col gap-[32px] p-[33px] relative">
            <div className="flex gap-[32px] items-start justify-center w-full relative flex-wrap md:flex-nowrap">
              
              {/* Column 1: Excel */}
              <div className="flex flex-col items-start relative w-full">
                <div className="pb-[16px] w-full">
                  <div className="font-['Poppins'] font-semibold text-[#001a3f] text-[20px]">
                    Data Mentah (Lat, Lng)
                  </div>
                </div>
                <div 
                  className="bg-[#f8fafc] h-[192px] relative rounded-[8px] w-full cursor-pointer border-2 border-[#cbd5e1] border-dashed flex flex-col items-center justify-center p-[34px] hover:bg-gray-100 transition-colors"
                  onClick={() => excelInputRef.current?.click()}
                >
                  <input type="file" className="hidden" accept=".xlsx" ref={excelInputRef} onChange={(e) => e.target.files && setExcelFile(e.target.files[0])} />
                  <div className="relative shrink-0 size-[32px] mb-2">
                    <svg className="absolute block inset-0 size-full" viewBox="0 0 24 24">
                      <path d={svgPaths.p18a23d18} fill="#002D6B" />
                    </svg>
                  </div>
                  <div className="font-['Poppins'] font-semibold text-[#001a3f] text-[14px] text-center">
                    Unggah file Excel sumber (.xlsx)
                  </div>
                  <div className="font-['Poppins'] font-medium text-[#344970] text-[12px] text-center mt-1">
                    {excelFile ? excelFile.name : "Klik atau seret file ke sini"}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
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
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] p-[33px]">
             <div className="font-['Poppins'] font-bold text-[28px] text-[#344970]">Fitur Segera Hadir</div>
             <div className="font-['Poppins'] font-medium text-[16px] text-[#64748b] mt-2 text-center max-w-[400px]">
               Fitur integrasi dengan Google Maps API ini sedang dalam tahap pengembangan dan belum siap digunakan untuk saat ini.
             </div>
          </div>
        )}
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

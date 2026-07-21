import React, { useState, useRef } from "react";
import svgPaths from "./svg-crt6tt6kec";

export default function App() {
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
    <div className="bg-[#f8fafc] flex flex-col min-h-screen w-full relative" data-name="Html → Body">
      {/* Header */}
      <div className="bg-[#001a3f] flex items-center w-full border-b border-[#002d6b] h-[64px] shrink-0 sticky top-0 z-50">
        <div className="max-w-[1280px] w-full mx-auto px-[48px] flex justify-between items-center">
          <div className="flex gap-[8px] items-center">
            <div className="h-[24px] w-[24px] relative">
              <svg className="absolute block inset-0 size-full" viewBox="0 0 24 24">
                <path d={svgPaths.p303da380} fill="white" />
              </svg>
            </div>
            <div className="font-['Poppins'] font-bold text-[24px] text-white">
              TelOps
            </div>
          </div>
          <div className="flex gap-[16px] items-center">
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center w-full pt-[48px] pb-[64px]" data-name="Main Content">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center w-full max-w-[768px] pb-[40px] px-4">
          <div className="flex flex-col font-['Poppins'] font-bold justify-center relative shrink-0 text-[#001a3f] text-[40px] text-center tracking-[-0.8px]">
            <p className="leading-[48px] m-0">Portal Alat Business Growth Analysis</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col items-center w-full max-w-[896px] pb-[32px] px-4 relative">
          <div className="flex gap-[32px] items-start justify-center w-full relative">
            <div className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
            
            {/* Offline Tab */}
            <div className="relative shrink-0 cursor-pointer" onClick={() => setMethod("offline")}>
              <div className={`absolute border-b-4 border-solid inset-0 pointer-events-none ${method === 'offline' ? 'border-[#ee2e24]' : 'border-transparent'}`} />
              <div className="flex items-center pb-[16px] px-[8px] relative">
                <div className={`font-['Poppins'] font-bold text-[18px] ${method === 'offline' ? 'text-[#001a3f]' : 'text-[#64748b]'}`}>
                  Location Finder
                </div>
              </div>
            </div>

            {/* Online Tab (Disembunyikan Sementara)
            <div className="relative shrink-0 cursor-pointer" onClick={() => setMethod("online")}>
              <div className={`absolute border-b-4 border-solid inset-0 pointer-events-none ${method === 'online' ? 'border-[#ee2e24]' : 'border-transparent'}`} />
              <div className="flex items-center pb-[16px] px-[8px] relative">
                <div className={`font-['Poppins'] font-bold text-[18px] ${method === 'online' ? 'text-[#001a3f]' : 'text-[#64748b]'}`}>
                  Coming Soon
                </div>
              </div>
            </div>
            */}
          </div>
        </div>

        {/* Main Card */}
        <div className="flex flex-col items-center w-full max-w-[896px] pb-[8px] px-4">
          <div className="bg-white relative rounded-[12px] w-full shadow-[0px_10px_30px_0px_rgba(0,12,29,0.1)] border border-[#e5e7eb] overflow-hidden">
            
            {method === 'offline' ? (
              <div className="flex flex-col gap-[32px] p-[33px] relative">
                <div className="flex gap-[32px] items-start justify-center w-full relative flex-wrap md:flex-nowrap">
                  
                  {/* Column 1: Excel */}
                  <div className="flex flex-col items-start relative w-full">
                    <div className="pb-[16px] w-full">
                      <div className="font-['Poppins'] font-semibold text-[#001a3f] text-[20px]">
                        Data Mentah (Order ID, Lat, Lng)
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
              // Coming Soon Placeholder
              <div className="flex flex-col items-center justify-center min-h-[300px] p-[33px]">
                 <div className="font-['Poppins'] font-bold text-[28px] text-[#344970]">Fitur Segera Hadir</div>
                 <div className="font-['Poppins'] font-medium text-[16px] text-[#64748b] mt-2 text-center max-w-[400px]">
                   Fitur integrasi dengan Google Maps API ini sedang dalam tahap pengembangan dan belum siap digunakan untuk saat ini.
                 </div>
              </div>
            )}

          </div>
        </div>

        {/* Status Log */}
        <div className="flex gap-[12px] items-center w-full max-w-[896px] px-[17px] py-[8px] mx-4">
          <div className={`${isProcessing ? 'bg-[#eab308]' : status.includes('Error') ? 'bg-[#ef4444]' : 'bg-[#22c55e]'} rounded-[9999px] shrink-0 size-[8px]`} />
          <div className="font-['Courier_New',monospace] text-[#001a3f] font-semibold text-[14px]">
             {status}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="bg-[#001a3f] w-full border-t border-[#002d6b] shrink-0 mt-auto">
        <div className="max-w-[1280px] w-full mx-auto px-[48px] py-[24px] grid grid-cols-1 md:grid-cols-3 items-center gap-4">
          <div className="font-['Poppins'] font-bold text-[14px] text-white justify-self-center md:justify-self-start">TelOps</div>
          <div className="font-['Poppins'] font-normal text-[#d1d5db] text-[14px] justify-self-center text-center whitespace-nowrap">
            v1.2.0 © 2024 TelOps. All rights reserved. | Versi 1.1
          </div>
          <div className="flex gap-[24px] justify-self-center md:justify-self-end">
            <div className="font-['Poppins'] font-medium text-[#d1d5db] text-[12px] cursor-pointer hover:underline">Kebijakan Privasi</div>
            <div className="font-['Poppins'] font-medium text-[#d1d5db] text-[12px] cursor-pointer hover:underline">Syarat & Ketentuan</div>
          </div>
        </div>
      </div>
    </div>
  );
}

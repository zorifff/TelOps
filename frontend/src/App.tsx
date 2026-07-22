import React, { useState } from "react";
import svgPaths from "./svg-crt6tt6kec";
import LocationFinder from "./pages/LocationFinder";
import AutomasiReportODP from "./pages/AutomasiReportODP";

export default function App() {
  const [activeTab, setActiveTab] = useState<"location_finder" | "automasi_report_odp">("location_finder");

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
            
            {/* Tab 1: Location Finder */}
            <div className="relative shrink-0 cursor-pointer" onClick={() => setActiveTab("location_finder")}>
              <div className={`absolute border-b-4 border-solid inset-0 pointer-events-none ${activeTab === 'location_finder' ? 'border-[#ee2e24]' : 'border-transparent'}`} />
              <div className="flex items-center pb-[16px] px-[8px] relative">
                <div className={`font-['Poppins'] font-bold text-[18px] ${activeTab === 'location_finder' ? 'text-[#001a3f]' : 'text-[#64748b]'}`}>
                  Location Finder
                </div>
              </div>
            </div>

            {/* Tab 2: Automasi Report ODP */}
            <div className="relative shrink-0 cursor-pointer" onClick={() => setActiveTab("automasi_report_odp")}>
              <div className={`absolute border-b-4 border-solid inset-0 pointer-events-none ${activeTab === 'automasi_report_odp' ? 'border-[#ee2e24]' : 'border-transparent'}`} />
              <div className="flex items-center pb-[16px] px-[8px] relative">
                <div className={`font-['Poppins'] font-bold text-[18px] ${activeTab === 'automasi_report_odp' ? 'text-[#001a3f]' : 'text-[#64748b]'}`}>
                  Automasi Report ODP
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Page Rendering */}
        {activeTab === 'location_finder' ? <LocationFinder /> : <AutomasiReportODP />}

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

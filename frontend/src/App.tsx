import React, { useState } from "react";
import LocationFinder from "./pages/LocationFinder";
import AutomasiReportODP from "./pages/AutomasiReportODP";
import AutomasiReportBlackODP from "./pages/AutomasiReportBlackODP";
import AutomasiReportLOP from "./pages/AutomasiReportLOP";
import Home from "./pages/Home";

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "location_finder" | "automasi_report_odp" | "automasi_report_black_odp" | "automasi_report_lop">("home");

  const navItems = [
    { id: "location_finder", label: "Location Finder" },
    { id: "automasi_report_odp", label: "Report ODP" },
    { id: "automasi_report_black_odp", label: "Report Black ODP" },
    { id: "automasi_report_lop", label: "Report LOP" },
  ];

  return (
    <div className="bg-[#f8fafc] flex flex-col min-h-screen w-full relative" data-name="Html → Body">
      {/* Header */}
      <div className="bg-white flex items-center w-full border-b border-[#e5e7eb] h-[72px] shrink-0 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1280px] w-full mx-auto px-[24px] md:px-[48px] flex justify-between items-center h-full">
          
          {/* Logo Section */}
          <div 
            className="flex gap-[12px] items-center shrink-0 cursor-pointer"
            onClick={() => setActiveTab("home")}
          >
            <div className="h-[32px] w-[32px] relative">
              <img src="/telkomsel-logo.png" alt="Telkomsel Logo" className="absolute block inset-0 size-full object-contain" />
            </div>
            <div className="font-['Poppins'] font-bold text-[24px] text-[#ec0013]">
              TelOps
            </div>
          </div>

          {/* Navigation Section */}
          <div className="hidden md:flex items-center h-full gap-[8px] lg:gap-[24px]">
            {navItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`h-full flex items-center px-2 cursor-pointer border-b-4 transition-colors ${
                  activeTab === item.id 
                    ? "border-[#ee2e24] text-[#ee2e24] font-bold" 
                    : "border-transparent text-[#001a3f] font-semibold hover:text-[#ee2e24]"
                }`}
              >
                <span className="font-['Poppins'] text-[15px]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center w-full" data-name="Main Content">
        {/* Dynamic Page Rendering */}
        <div className="w-full">
          {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
          
          <div className={`${activeTab === 'home' ? 'hidden' : 'block'} w-full pt-[56px] pb-[64px]`}>
            {activeTab === 'location_finder' && <LocationFinder />}
            {activeTab === 'automasi_report_odp' && <AutomasiReportODP />}
            {activeTab === 'automasi_report_black_odp' && <AutomasiReportBlackODP />}
            {activeTab === 'automasi_report_lop' && <AutomasiReportLOP />}
          </div>
        </div>
      </div>
      
    </div>
  );
}

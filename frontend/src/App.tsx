import React, { useState, useEffect } from "react";
import LocationFinder from "./pages/LocationFinder";
import AutomasiReportODP from "./pages/AutomasiReportODP";
import AutomasiReportBlackODP from "./pages/AutomasiReportBlackODP";
import AutomasiReportLOP from "./pages/AutomasiReportLOP";
import UpdateGTM from "./pages/UpdateGTM";
import Home from "./pages/Home";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "home" | "location_finder" | "automasi_report_odp" | "automasi_report_black_odp" | "automasi_report_lop" | "update_gtm"
  >("home");

  useEffect(() => {
    const handleWindowDragOver = (e: DragEvent) => {
      e.preventDefault();
    };
    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
    };
    window.addEventListener("dragover", handleWindowDragOver);
    window.addEventListener("drop", handleWindowDrop);
    return () => {
      window.removeEventListener("dragover", handleWindowDragOver);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, []);

  const navItems = [
    {
      id: "home",
      label: "Dashboard",
      category: "Utama",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: "location_finder",
      label: "Location Finder",
      category: "Fitur Utas",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: "automasi_report_odp",
      label: "Report ODP",
      category: "Fitur Utas",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: "automasi_report_black_odp",
      label: "Report Black ODP",
      category: "Fitur Utas",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    {
      id: "automasi_report_lop",
      label: "Report LOP",
      category: "Fitur Utas",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      id: "update_gtm",
      label: "Update GTM",
      category: "Fitur Utas",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
  ];

  const getTitle = () => {
    switch (activeTab) {
      case "home": return "Operation Dashboard";
      case "location_finder": return "Location Finder";
      case "automasi_report_odp": return "Automasi Report Occupancy ODP";
      case "automasi_report_black_odp": return "Automasi Report Black ODP";
      case "automasi_report_lop": return "Automasi Report LOP Greenfield";
      case "update_gtm": return "Update GTM Requirement";
      default: return "TelOps Management";
    }
  };

  return (
    <div className="bg-[#f1f5f9] flex h-screen w-screen overflow-hidden font-['Poppins'] select-none">
      
      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="w-[260px] bg-[#001a3f] text-white flex flex-col shrink-0 border-r border-slate-800 shadow-xl z-20">
        
        {/* Brand Header */}
        <div className="h-[72px] px-6 flex items-center gap-3 border-b border-slate-800 shrink-0">
          <div className="h-9 w-9 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-md">
            <img src="/telkomsel-logo.svg" alt="Telkomsel Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[20px] tracking-wide text-white leading-tight">TelOps</span>
            <span className="text-[11px] text-slate-400 font-medium tracking-wider uppercase">Workstation</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 py-6 px-3 flex flex-col gap-6 overflow-y-auto">
          
          {/* Main Navigation Group */}
          <div className="flex flex-col gap-1.5">
            <div className="px-3 text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1">
              Menu Utama
            </div>
            
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left ${
                    isActive
                      ? "bg-[#ee2e24] text-white font-semibold shadow-lg shadow-red-900/30 translate-x-1"
                      : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                  }`}
                >
                  <span className={`${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {item.icon}
                  </span>
                  <span className="text-[14px] leading-none">{item.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Sidebar Footer / App Version */}
        <div className="p-4 border-t border-slate-800 bg-[#001431] shrink-0 flex items-center justify-center">
          <span className="text-[12px] font-medium text-slate-400">Versi 1.0.0</span>
        </div>

      </aside>

      {/* MAIN DESKTOP WORKSPACE AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f8fafc]">
        
        {/* Top Header Bar */}
        <header className="h-[72px] bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-[20px] font-bold text-[#001a3f] m-0 leading-tight">
              {getTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-lg text-[13px] text-slate-600 font-medium">
              <span>{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Desktop Workspace View Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1100px] mx-auto">
            {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
            {activeTab === 'location_finder' && <LocationFinder />}
            {activeTab === 'automasi_report_odp' && <AutomasiReportODP />}
            {activeTab === 'automasi_report_black_odp' && <AutomasiReportBlackODP />}
            {activeTab === 'automasi_report_lop' && <AutomasiReportLOP />}
            {activeTab === 'update_gtm' && <UpdateGTM />}
          </div>
        </main>

      </div>

    </div>
  );
}

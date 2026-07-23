import React from "react";

interface HomeProps {
  setActiveTab: (tab: any) => void;
}

export default function Home({ setActiveTab }: HomeProps) {
  const features = [
    {
      id: "location_finder",
      title: "Location Finder",
      description: "Lacak berbagai titik lokasi secara fleksibel berdasarkan koordinat. Didukung reverse geocoding untuk otomatis memetakan koordinat lintang dan bujur menjadi data wilayah lengkap (desa hingga provinsi).",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ec0013]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: "automasi_report_odp",
      title: "Report ODP",
      description: "Unggah raw data Anda dan biarkan sistem mengalkulasi, merapikan, dan menyusun laporan Occupancy ODP secara otomatis.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ec0013]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: "automasi_report_black_odp",
      title: "Report Black ODP",
      description: "Analisis khusus untuk area Black ODP. Pantau progres penambahan dan pengurangan kapasitas secara mendetail dengan format yang siap pakai.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ec0013]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    {
      id: "automasi_report_lop",
      title: "Report LOP",
      description: "Evaluasi performa proyek Greenfield berbasis LOP. Sistem mengkalkulasi Occ dan Gap WoW secara otomatis untuk memastikan pemantauan performa instalasi selalu akurat.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#ec0013]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full flex flex-col">
      {/* HERO SECTION */}
      <div 
        className="relative w-full flex flex-col items-center justify-center px-4 animate-travel-gradient"
        style={{ minHeight: 'calc(100vh - 72px)' }}
      >
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-[800px] gap-8">
          <h1 className="font-['Poppins'] font-bold text-white text-[40px] md:text-[56px] tracking-[-1px] leading-tight m-0 drop-shadow-lg">
            Sistem Operasi Business Growth Analysis & Household
          </h1>
          <p className="font-['Poppins'] text-[#d1d5db] text-[18px] md:text-[20px] max-w-[700px] leading-relaxed m-0">
            Platform terpadu untuk kemudahan pemetaan lokasi, otomatisasi pelaporan ODP, dan pemantauan performa bisnis secara cepat, tepat dan terpusat.
          </p>
        </div>
      </div>

      {/* FEATURE SECTIONS (ZIG-ZAG) */}
      <div className="w-full bg-white flex flex-col items-center">
        
        {/* Global Title inside White Block */}
        <div className="w-full max-w-[1100px] px-6 pt-[96px] pb-[64px] text-center">
          <h2 className="font-['Poppins'] font-bold text-[32px] md:text-[36px] text-[#001a3f] m-0">
            Fitur apa saja yang bisa digunakan?
          </h2>
        </div>

        {/* Feature List */}
        <div className="w-full max-w-[1100px] mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature) => (
              <div 
                key={feature.id} 
                onClick={() => setActiveTab(feature.id)}
                className="bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-5 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  {feature.icon}
                </div>
                <div className="flex flex-col gap-3">
                  <h3 className="font-['Poppins'] font-bold text-[24px] text-[#001a3f] leading-tight m-0">
                    {feature.title}
                  </h3>
                  <p className="font-['Poppins'] text-[#64748b] text-[15px] leading-relaxed m-0">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

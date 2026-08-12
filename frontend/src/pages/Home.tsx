import React from "react";

interface HomeProps {
  setActiveTab: (tab: any) => void;
}

export default function Home({ setActiveTab }: HomeProps) {
  const features = [
    {
      id: "location_finder",
      title: "Location Finder",
      description: "Petakan koordinat lintang & bujur secara otomatis menjadi hierarki wilayah presisi (Desa, Kecamatan, Kabupaten, Provinsi).",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#ee2e24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      id: "automasi_report_odp",
      title: "Report Occupancy ODP",
      description: "Kalkulasi data W-0 (raw data) dan W-1 (minggu lalu) untuk kalkulasi otomatis Occupancy ODP dan pembersihan format.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#ee2e24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: "automasi_report_black_odp",
      title: "Report Black ODP",
      description: "Pantau penambahan, pengurangan, dan pergerakan ODP Black Greenfield secara otomatis dengan integrasi WoW.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#ee2e24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    {
      id: "automasi_report_lop",
      title: "Report LOP Greenfield",
      description: "Evaluasi WoW Occ & Gap performa proyek LOP Greenfield untuk memastikan laporan instalasi akurat.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#ee2e24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      id: "update_gtm",
      title: "Update GTM Requirement",
      description: "Pembaruan data GTM dengan kalkulasi Port Used, Available, Total, dan perbandingan Gap WoW dari laporan minggu lalu.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#ee2e24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      )
    },
    {
      id: "pairing_kuota_keluarga",
      title: "Pairing Kuota Keluarga",
      description: "Restrukturisasi data pairing Telkomsel One / Kuota Keluarga dari 1:M (Long) menjadi 1:1 (Wide) dengan sanitasi MSISDN presisi.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#ee2e24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      
      {/* DASHBOARD HERO BANNER */}
      <div className="bg-gradient-to-r from-[#001a3f] via-[#002b66] to-[#001a3f] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex flex-col gap-3 max-w-[750px]">
          <h2 className="text-[30px] font-bold text-white tracking-tight leading-tight m-0">
            Selamat Datang di Workstation TelOps
          </h2>
          <p className="text-slate-300 text-[15px] leading-relaxed m-0">
            Platform terpadu untuk kemudahan pemetaan lokasi, otomatisasi pelaporan ODP, dan pemantauan performa bisnis secara cepat, presisi, dan terpusat.
          </p>
        </div>

        {/* Decorative background logo */}
        <div className="absolute right-[-20px] bottom-[-30px] opacity-10 pointer-events-none">
          <img src="/telkomsel-icon.svg" alt="Telkomsel Logo" className="w-[320px] h-[320px] object-contain" />
        </div>
      </div>

      {/* FEATURE WORKSPACE LAUNCH GRID */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h3 className="text-[20px] font-bold text-[#001a3f] m-0">
            Pilih Modul Workstation
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <div
              key={feature.id}
              onClick={() => setActiveTab(feature.id)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between gap-5 group cursor-pointer"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-13 h-13 rounded-xl bg-red-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    {feature.icon}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h4 className="text-[18px] font-bold text-[#001a3f] m-0 group-hover:text-[#ee2e24] transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-[14px] text-slate-600 leading-relaxed m-0">
                    {feature.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[14px] font-bold text-[#ee2e24] pt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform w-fit">
                <span>BUKA WORKSPACE</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

import React, { useState } from "react";
import svgPaths from "../svg-crt6tt6kec";

interface FileUploaderProps {
  label: string;
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement>;
  setFile: (file: File | null) => void;
  accept?: string;
}

export default function FileUploader({
  label,
  file,
  inputRef,
  setFile,
  accept = ".xlsx",
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      e.dataTransfer.clearData();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " Bytes";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-start relative w-full">
      <div className="pb-3 w-full flex items-center justify-between">
        <div className="font-['Poppins'] font-semibold text-[#001a3f] text-[16px]">
          {label}
        </div>
        {file && (
          <button
            onClick={handleClear}
            className="text-[12px] font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border-none"
          >
            <span>✕</span>
            <span>Hapus File</span>
          </button>
        )}
      </div>

      <div
        className={`h-[180px] relative rounded-2xl w-full cursor-pointer border-2 border-dashed flex flex-col items-center justify-center p-6 transition-all duration-200 ${
          file
            ? "bg-emerald-50/60 border-emerald-500 hover:bg-emerald-50"
            : isDragging
            ? "bg-red-50 border-[#ee2e24] scale-[1.01]"
            : "bg-[#f8fafc] border-slate-300 hover:bg-slate-100/80 hover:border-slate-400"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="hidden"
          accept={accept}
          ref={inputRef}
          onChange={(e) =>
            e.target.files && e.target.files.length > 0 && setFile(e.target.files[0])
          }
        />

        {file ? (
          <div className="flex flex-col items-center gap-2 max-w-full text-center py-2">
            <div className="font-['Poppins'] font-bold text-[#001a3f] text-[15px] truncate max-w-[320px]">
              {file.name}
            </div>
            <div className="inline-flex items-center gap-2 mt-1">
              <span className="text-[12px] font-mono font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded">
                {formatFileSize(file.size)}
              </span>
              <span className="text-[12px] font-semibold text-emerald-700">File Siap Diproses</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-xl bg-slate-200/70 text-slate-600 flex items-center justify-center mb-1">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d={svgPaths.p18a23d18} fill={isDragging ? "#ee2e24" : "#001a3f"} />
              </svg>
            </div>
            <div className="font-['Poppins'] font-semibold text-[#001a3f] text-[14px]">
              {isDragging ? "Lepaskan file di sini" : "Unggah file (.xlsx)"}
            </div>
            <div className="font-['Poppins'] font-medium text-slate-500 text-[12px] truncate max-w-full">
              Klik atau seret file ke area ini
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Helper function to trigger native Windows "Save As..." file picker dialog.
 * Supports PyWebView native Windows file dialog, Web File System Access API (showSaveFilePicker),
 * and standard browser fallback.
 */
export async function saveFileWithPicker(blob: Blob, defaultFileName: string): Promise<boolean> {
  const safeName = defaultFileName.endsWith(".xlsx") ? defaultFileName : `${defaultFileName}.xlsx`;

  // 1. PyWebView Native Desktop App Windows Explorer File Dialog
  if ((window as any).pywebview && (window as any).pywebview.api) {
    try {
      const targetPath = await (window as any).pywebview.api.save_file_dialog(safeName);
      if (!targetPath) {
        throw new Error("Penyimpanan file dibatalkan oleh pengguna.");
      }

      // Convert Blob to Base64
      const arrayBuffer = await blob.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64Data = btoa(binary);

      await (window as any).pywebview.api.write_file_bytes(targetPath, base64Data);
      return true;
    } catch (err: any) {
      if (err.message === "Penyimpanan file dibatalkan oleh pengguna.") {
        throw err;
      }
      console.warn("PyWebView native save dialog failed, attempting fallback:", err);
    }
  }

  // 2. Web Browser File System Access API (showSaveFilePicker)
  if ("showSaveFilePicker" in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: safeName,
        types: [
          {
            description: "Excel Spreadsheet (*.xlsx)",
            accept: {
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
            },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } catch (err: any) {
      if (err.name === "AbortError") {
        throw new Error("Penyimpanan file dibatalkan oleh pengguna.");
      }
    }
  }

  // 3. Fallback for standard browsers
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = safeName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
  return true;
}

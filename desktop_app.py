import socket
import threading
import sys
import os
import uvicorn
import webview
import base64
from backend.main import app

class DesktopApi:
    def save_file_dialog(self, default_filename="Hasil_Report.xlsx"):
        try:
            active_window = webview.windows[0] if webview.windows else None
            if active_window:
                # Use FileDialog.SAVE (30) for native Windows Save File Dialog
                save_type = getattr(webview, 'FileDialog', None)
                dialog_enum = save_type.SAVE if save_type else getattr(webview, 'SAVE_DIALOG', 30)

                result = active_window.create_file_dialog(
                    dialog_type=dialog_enum,
                    save_filename=default_filename,
                    file_types=('Excel Files (*.xlsx)', 'All files (*.*)')
                )
                if result:
                    return result[0] if isinstance(result, (list, tuple)) else result
        except Exception as e:
            print("Error in save_file_dialog:", e)
        return None

    def write_file_bytes(self, target_path, base64_data):
        try:
            data = base64.b64decode(base64_data)
            with open(target_path, 'wb') as f:
                f.write(data)
            return True
        except Exception as e:
            print("Error writing file bytes:", e)
            raise e

def find_free_port(start_port=8000, max_port=8999):
    for port in range(start_port, max_port):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            res = sock.connect_ex(('127.0.0.1', port))
            if res != 0:
                return port
    return 8000

def run_server(host, port):
    uvicorn.run(app, host=host, port=port, log_level="error")

def main():
    port = find_free_port()
    host = "127.0.0.1"

    # Start FastAPI server in background thread
    server_thread = threading.Thread(target=run_server, args=(host, port), daemon=True)
    server_thread.start()

    api = DesktopApi()

    # Launch PyWebView desktop window
    window_title = "TelOps - Management & Report Automation"
    url = f"http://{host}:{port}"

    webview.create_window(
        title=window_title,
        url=url,
        width=1280,
        height=850,
        min_size=(1024, 700),
        resizable=True,
        js_api=api
    )

    webview.start()

if __name__ == "__main__":
    main()

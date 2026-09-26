import sys
import os

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

import uvicorn
from app.config import settings

def main():
    port = int(os.environ.get("PORT", settings.PORT))
    host = os.environ.get("HOST", settings.HOST)
    is_prod = os.environ.get("ENVIRONMENT", settings.ENVIRONMENT).lower() == "production"
    reload = False if is_prod else settings.DEBUG

    print(f"Starting CGTMSE Assist Backend on {host}:{port} (env={settings.ENVIRONMENT})...")
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    )

if __name__ == "__main__":
    main()

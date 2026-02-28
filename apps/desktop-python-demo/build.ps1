$ErrorActionPreference = 'Stop'
pyinstaller --noconfirm --clean --onefile --windowed --name "lotos-desktop-demo" app.py

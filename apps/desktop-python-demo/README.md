# LotOS Desktop Python Demo

Runnable desktop demo for LotOS UI using only Python standard library (`tkinter`).

This app is intentionally dependency-light so the repository includes at least one
desktop demo that can run immediately without external GUI packages.

## Features

- native desktop shell
- KPI rail
- searchable incident queue
- command actions
- modal confirmation
- LotOS visual styling adapted to tkinter

## Run

```powershell
cd apps\desktop-python-demo
python app.py
```

## Build

Install PyInstaller and package:

```powershell
pip install pyinstaller
./build.ps1
```

This creates a single-file executable in `dist/`.

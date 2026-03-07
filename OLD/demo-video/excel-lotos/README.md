# Demo Excel LotOS (Real Transformation)

This demo applies a LotOS-inspired style directly to an Excel workbook using VBA.

## Files

- `OLD/demo-video/excel-lotos/lotos_excel_demo.bas`

## Recording flow

1. Open Excel and load any workbook with sample operational data.
2. Show the "before" state for 10-20 seconds.
3. Press `Alt + F11` to open VBA editor.
4. Go to `File > Import File...` and import `lotos_excel_demo.bas`.
5. Run macro `ApplyLotosTheme`.
6. Return to Excel and show the transformed dashboard sheet.
7. Click buttons `Refresh Grid`, `Open Detail`, and `Apply Region` to show hook behavior.

## What this macro does

- Creates/uses sheet `Dashboard`
- Applies theme colors, typography, and layout blocks
- Builds KPI ribbon, command strip, operations table, and detail panel
- Adds status conditional formatting
- Creates named ranges:
  - `LOTOS_KPI_REVENUE`
  - `LOTOS_KPI_RISK`
  - `LOTOS_FILTER_REGION`
  - `LOTOS_GRID_SOURCE`

## Hook macros for storytelling

- `RefreshDashboard`
- `OpenDetailPanel`
- `ApplyStatusTheme`

These hooks currently show confirmation dialogs and are ready to be replaced with real workbook logic.

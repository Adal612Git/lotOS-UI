# LotOS Calc Demo (LibreOffice + Apache OpenOffice)

Real spreadsheet transformation in the same workbook (before -> after).

## File

- `OLD/demo-video/calc-lotos/lotos_calc_demo.bas`

## Works on

- LibreOffice Calc
- Apache OpenOffice Calc

## How to run (exact steps)

1. Open Calc and create/save a local spreadsheet (for example: `demo-calc-lotos.ods`).
2. Open macro editor:
   - LibreOffice: `Tools > Macros > Organize Macros > LibreOffice Basic...`
   - OpenOffice: `Tools > Macros > Organize Macros > OpenOffice Basic...`
3. In your document, create a new module (for example: `LotosDemo`).
4. Open `lotos_calc_demo.bas`, copy all content, paste into that module, save.
5. Run `CreateBeforeSheet` to generate an intentionally plain/unstyled sheet.
6. Show that "before" sheet in your recording.
7. Run `ApplyLotosThemeCalc`.
8. Show the transformed `ControlRoom` sheet.

## Optional hook macros for the demo

- `SyncControlRoom`
- `OpenAlertInspector`
- `ClearCompletedQueue`

Run them from the macro dialog to show "automation hooks ready".

## Named ranges created

- `LOTOS_ALERT_COUNT`
- `LOTOS_QUEUE_SOURCE`
- `LOTOS_OWNER_FILTER`
- `LOTOS_ACTION_TARGET`

## Suggested recording order (2-3 min segment)

1. Run `CreateBeforeSheet` and show "messy/plain" sheet.
2. Run `ApplyLotosThemeCalc`.
3. Zoom in on:
   - KPI ribbon
   - Command strip
   - Queue status colors
   - Alert rail
4. Open Named Ranges and show `LOTOS_*` entries.

Attribute VB_Name = "LotosExcelDemo"
Option Explicit

' LotOS-inspired spreadsheet modernization demo.
' Import this module into Excel VBA and run ApplyLotosTheme.

Public Sub ApplyLotosTheme()
    Dim ws As Worksheet
    Set ws = EnsureSheet("Dashboard")

    PrepareCanvas ws
    BuildHeader ws
    BuildKpiRibbon ws
    BuildCommandStrip ws
    BuildOperationsTable ws
    BuildDetailPanel ws
    ApplyStatusFormatting ws
    DefineNamedRanges ws

    ws.Activate
    ws.Range("A1").Select
    MsgBox "LotOS Excel demo theme applied.", vbInformation
End Sub

Public Sub RefreshDashboard()
    ' Hook for data refresh logic.
    MsgBox "RefreshDashboard hook executed.", vbInformation
End Sub

Public Sub OpenDetailPanel()
    ' Hook for detail panel logic.
    MsgBox "OpenDetailPanel hook executed.", vbInformation
End Sub

Public Sub ApplyStatusTheme()
    ApplyStatusFormatting EnsureSheet("Dashboard")
    MsgBox "Status styling refreshed.", vbInformation
End Sub

Private Function EnsureSheet(ByVal sheetName As String) As Worksheet
    On Error Resume Next
    Set EnsureSheet = ThisWorkbook.Worksheets(sheetName)
    On Error GoTo 0

    If EnsureSheet Is Nothing Then
        Set EnsureSheet = ThisWorkbook.Worksheets.Add
        EnsureSheet.Name = sheetName
    End If
End Function

Private Sub PrepareCanvas(ByVal ws As Worksheet)
    With ws
        .Cells.Clear
        .Cells.Interior.Color = RGB(8, 17, 28)
        .Cells.Font.Name = "Segoe UI"
        .Cells.Font.Color = RGB(232, 241, 255)
        .Columns("A:Z").ColumnWidth = 12
        .Rows("1:120").RowHeight = 22
        ActiveWindow.DisplayGridlines = False
        ActiveWindow.DisplayHeadings = False
    End With
End Sub

Private Sub BuildHeader(ByVal ws As Worksheet)
    With ws.Range("A1:H1")
        .Merge
        .Value = "Excel Operations Board (LotOS Style)"
        .Interior.Color = RGB(12, 26, 42)
        .Font.Size = 20
        .Font.Bold = True
        .HorizontalAlignment = xlLeft
        .VerticalAlignment = xlCenter
        .Borders.Color = RGB(41, 69, 107)
    End With

    With ws.Range("A2:H2")
        .Merge
        .Value = "Same workbook, clearer operational decisions."
        .Font.Size = 11
        .Font.Color = RGB(156, 182, 214)
        .HorizontalAlignment = xlLeft
        .VerticalAlignment = xlCenter
    End With
End Sub

Private Sub BuildKpiRibbon(ByVal ws As Worksheet)
    CreateKpiCard ws, "A4:B6", "$1.8M", "Net Revenue"
    CreateKpiCard ws, "C4:D6", "14", "Escalations"
    CreateKpiCard ws, "E4:F6", "93%", "SLA Health"
    CreateKpiCard ws, "G4:H6", "08", "Pending Reviews"
End Sub

Private Sub CreateKpiCard(ByVal ws As Worksheet, ByVal addr As String, ByVal valueText As String, ByVal labelText As String)
    Dim block As Range
    Set block = ws.Range(addr)

    With block
        .Merge
        .Interior.Color = RGB(19, 35, 56)
        .Borders.Color = RGB(41, 69, 107)
        .HorizontalAlignment = xlCenter
        .VerticalAlignment = xlCenter
        .WrapText = True
        .Value = valueText & vbLf & labelText
        .Font.Bold = True
        .Font.Size = 14
    End With
End Sub

Private Sub BuildCommandStrip(ByVal ws As Worksheet)
    CreateCommandButton ws, "A8:B9", "Refresh Grid", "RefreshDashboard"
    CreateCommandButton ws, "C8:D9", "Open Detail", "OpenDetailPanel"
    CreateCommandButton ws, "E8:F9", "Apply Region", "ApplyStatusTheme"
    CreateCommandButton ws, "G8:H9", "Escalate Row", "ApplyStatusTheme"
End Sub

Private Sub CreateCommandButton(ByVal ws As Worksheet, ByVal addr As String, ByVal text As String, ByVal macroName As String)
    Dim rng As Range
    Dim btn As Shape

    Set rng = ws.Range(addr)
    With rng
        .Merge
        .Interior.Color = RGB(20, 40, 62)
        .Borders.Color = RGB(41, 69, 107)
        .Value = text
        .HorizontalAlignment = xlCenter
        .VerticalAlignment = xlCenter
        .Font.Bold = True
        .Font.Size = 10
    End With

    Set btn = ws.Shapes.AddShape(msoShapeRoundedRectangle, rng.Left, rng.Top, rng.Width, rng.Height)
    With btn
        .TextFrame2.TextRange.Text = text
        .TextFrame2.TextRange.Font.Name = "Segoe UI"
        .TextFrame2.TextRange.Font.Size = 10
        .TextFrame2.TextRange.Font.Fill.ForeColor.RGB = RGB(232, 241, 255)
        .Fill.ForeColor.RGB = RGB(20, 40, 62)
        .Line.ForeColor.RGB = RGB(41, 69, 107)
        .OnAction = macroName
        .Name = "BTN_" & Replace(text, " ", "_")
    End With
    rng.ClearContents
End Sub

Private Sub BuildOperationsTable(ByVal ws As Worksheet)
    Dim headers As Variant
    headers = Array("Owner", "Region", "Queue", "Risk", "Status")

    ws.Range("A12:E12").Interior.Color = RGB(14, 25, 39)
    ws.Range("A12:E12").Font.Color = RGB(156, 182, 214)
    ws.Range("A12:E12").Font.Bold = True
    ws.Range("A12:E12").Borders.Color = RGB(41, 69, 107)

    ws.Range("A12").Resize(1, 5).Value = headers

    ws.Range("A13:E15").Value = Array( _
        Array("Monica", "North", "Receivables", "High", "Needs Review"), _
        Array("Alberto", "West", "Renewals", "Low", "Healthy"), _
        Array("Priya", "LATAM", "Collections", "Medium", "Watch") _
    )

    With ws.Range("A13:E15")
        .Interior.Color = RGB(12, 26, 42)
        .Borders.Color = RGB(41, 69, 107)
    End With
End Sub

Private Sub BuildDetailPanel(ByVal ws As Worksheet)
    With ws.Range("G12:H15")
        .Merge
        .Interior.Color = RGB(18, 31, 48)
        .Borders.Color = RGB(41, 69, 107)
        .Value = "Detail Panel" & vbLf & _
                 "- Select an owner row" & vbLf & _
                 "- Show actions" & vbLf & _
                 "- Add audit notes"
        .HorizontalAlignment = xlLeft
        .VerticalAlignment = xlTop
        .WrapText = True
    End With
End Sub

Private Sub ApplyStatusFormatting(ByVal ws As Worksheet)
    Dim statusRange As Range
    Set statusRange = ws.Range("E13:E15")

    statusRange.FormatConditions.Delete

    With statusRange.FormatConditions.Add(Type:=xlTextString, String:="Healthy", TextOperator:=xlContains)
        .Interior.Color = RGB(16, 185, 129)
        .Font.Color = RGB(6, 18, 11)
        .Font.Bold = True
    End With

    With statusRange.FormatConditions.Add(Type:=xlTextString, String:="Watch", TextOperator:=xlContains)
        .Interior.Color = RGB(245, 158, 11)
        .Font.Color = RGB(36, 18, 2)
        .Font.Bold = True
    End With

    With statusRange.FormatConditions.Add(Type:=xlTextString, String:="Needs Review", TextOperator:=xlContains)
        .Interior.Color = RGB(251, 113, 133)
        .Font.Color = RGB(48, 7, 15)
        .Font.Bold = True
    End With
End Sub

Private Sub DefineNamedRanges(ByVal ws As Worksheet)
    AddOrReplaceName "LOTOS_KPI_REVENUE", ws.Range("A4")
    AddOrReplaceName "LOTOS_KPI_RISK", ws.Range("C4")
    AddOrReplaceName "LOTOS_FILTER_REGION", ws.Range("B11")
    AddOrReplaceName "LOTOS_GRID_SOURCE", ws.Range("A13:E15")
End Sub

Private Sub AddOrReplaceName(ByVal nameText As String, ByVal target As Range)
    On Error Resume Next
    ThisWorkbook.Names(nameText).Delete
    On Error GoTo 0

    ThisWorkbook.Names.Add Name:=nameText, RefersTo:=target
End Sub

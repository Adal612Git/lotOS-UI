Option Explicit

' LotOS Pro-style modernization demo for Calc.
' Compatible with LibreOffice Calc and Apache OpenOffice Calc.

Sub CreateBeforeSheet()
    Dim doc As Object
    Dim sh As Object

    doc = ThisComponent
    If Not SupportsSpreadsheet(doc) Then
        MsgBox "Open this macro inside Calc.", 48, "LotOS Demo"
        Exit Sub
    End If

    sh = EnsureSheet(doc, "ControlRoom")
    ClearSheet sh
    SetupPlainGrid sh

    SetCellByNameText sh, "A1", "operaciones q1"
    SetCellByNameText sh, "A2", "hoja utilitaria sin sistema visual"

    SetCellByNameText sh, "A4", "owner"
    SetCellByNameText sh, "B4", "region"
    SetCellByNameText sh, "C4", "queue"
    SetCellByNameText sh, "D4", "risk"
    SetCellByNameText sh, "E4", "status"

    SetCellByNameText sh, "A5", "Monica"
    SetCellByNameText sh, "B5", "North"
    SetCellByNameText sh, "C5", "Receivables"
    SetCellByNameText sh, "D5", "High"
    SetCellByNameText sh, "E5", "Needs Review"

    SetCellByNameText sh, "A6", "Alberto"
    SetCellByNameText sh, "B6", "West"
    SetCellByNameText sh, "C6", "Renewals"
    SetCellByNameText sh, "D6", "Low"
    SetCellByNameText sh, "E6", "Healthy"

    SetCellByNameText sh, "A7", "Priya"
    SetCellByNameText sh, "B7", "LATAM"
    SetCellByNameText sh, "C7", "Collections"
    SetCellByNameText sh, "D7", "Medium"
    SetCellByNameText sh, "E7", "Watch"

    MsgBox "Before sheet ready.", 64, "LotOS Demo"
End Sub

Sub ApplyLotosThemeCalc()
    Dim doc As Object
    Dim sh As Object
    Dim queueData As Variant
    Dim queueCount As Long

    doc = ThisComponent
    If Not SupportsSpreadsheet(doc) Then
        MsgBox "Open this macro inside Calc.", 48, "LotOS Demo"
        Exit Sub
    End If

    sh = EnsureSheet(doc, "ControlRoom")
    queueData = ReadQueueData(sh, queueCount)

    On Error Resume Next
    ClearSheet sh
    SetupLotosCanvas sh
    BuildHero sh
    BuildKpiRibbon sh
    BuildCommandStrip sh
    BuildQueueTable sh, queueData, queueCount
    BuildAlertRail sh, queueCount
    BuildFooter sh, queueCount
    DefineNamedRangesSafe doc, queueCount
    On Error GoTo 0

    MsgBox "LotOS Pro theme applied.", 64, "LotOS Demo"
End Sub

Sub SyncControlRoom()
    MsgBox "SyncControlRoom hook executed.", 64, "LotOS Demo"
End Sub

Sub OpenAlertInspector()
    MsgBox "OpenAlertInspector hook executed.", 64, "LotOS Demo"
End Sub

Sub ClearCompletedQueue()
    MsgBox "ClearCompletedQueue hook executed.", 64, "LotOS Demo"
End Sub

Private Function SupportsSpreadsheet(ByVal doc As Object) As Boolean
    On Error GoTo Fail
    SupportsSpreadsheet = doc.supportsService("com.sun.star.sheet.SpreadsheetDocument")
    Exit Function
Fail:
    SupportsSpreadsheet = False
End Function

Private Function EnsureSheet(ByVal doc As Object, ByVal nameText As String) As Object
    Dim sheets As Object
    sheets = doc.Sheets

    If Not sheets.hasByName(nameText) Then
        sheets.insertNewByName nameText, sheets.getCount()
    End If

    EnsureSheet = sheets.getByName(nameText)
End Function

Private Sub ClearSheet(ByVal sh As Object)
    Dim fullRange As Object
    fullRange = sh.getCellRangeByName("A1:Z200")
    fullRange.clearContents(1023)
    fullRange.CellBackColor = RGB(255, 255, 255)
    fullRange.CharColor = RGB(0, 0, 0)
End Sub

Private Sub SetupPlainGrid(ByVal sh As Object)
    Dim i As Integer
    Dim baseRange As Object
    baseRange = sh.getCellRangeByName("A1:H80")

    baseRange.CharFontName = "Arial"
    baseRange.CharColor = RGB(30, 30, 30)
    baseRange.CellBackColor = RGB(255, 255, 255)

    For i = 0 To 7
        sh.Columns.getByIndex(i).Width = 2800
    Next i
End Sub

Private Sub SetupLotosCanvas(ByVal sh As Object)
    Dim i As Integer
    Dim baseRange As Object

    baseRange = sh.getCellRangeByName("A1:H120")
    baseRange.CharFontName = "Segoe UI"
    baseRange.CharColor = RGB(232, 241, 255)
    baseRange.CellBackColor = RGB(8, 17, 28)
    baseRange.IsTextWrapped = True

    sh.Columns.getByIndex(0).Width = 2700
    sh.Columns.getByIndex(1).Width = 2500
    sh.Columns.getByIndex(2).Width = 3000
    sh.Columns.getByIndex(3).Width = 2200
    sh.Columns.getByIndex(4).Width = 2600
    sh.Columns.getByIndex(5).Width = 1700
    sh.Columns.getByIndex(6).Width = 2900
    sh.Columns.getByIndex(7).Width = 2900

    For i = 0 To 90
        sh.Rows.getByIndex(i).Height = 520
    Next i

    sh.Rows.getByIndex(0).Height = 500
    sh.Rows.getByIndex(1).Height = 820
    sh.Rows.getByIndex(2).Height = 620
    sh.Rows.getByIndex(3).Height = 300
    sh.Rows.getByIndex(4).Height = 420
    sh.Rows.getByIndex(5).Height = 560
    sh.Rows.getByIndex(6).Height = 560
    sh.Rows.getByIndex(7).Height = 360
    sh.Rows.getByIndex(8).Height = 260
    sh.Rows.getByIndex(9).Height = 380
    sh.Rows.getByIndex(10).Height = 560
    sh.Rows.getByIndex(11).Height = 300
    sh.Rows.getByIndex(12).Height = 300
End Sub

Private Sub BuildHero(ByVal sh As Object)
    Dim kicker As Object
    Dim titleR As Object
    Dim subtitleR As Object

    kicker = sh.getCellRangeByName("A1:C1")
    kicker.merge(True)
    kicker.CellBackColor = RGB(14, 36, 57)
    kicker.CharColor = RGB(34, 211, 238)
    kicker.CharHeight = 10
    kicker.CharWeight = 150
    kicker.HoriJustify = 1
    kicker.VertJustify = 2
    SetRangeAnchorText kicker, "LOTOS CALC MODERNIZATION SURFACE"
    ApplyOuterBorder kicker, RGB(34, 211, 238), 55

    titleR = sh.getCellRangeByName("A2:H2")
    titleR.merge(True)
    titleR.CellBackColor = RGB(12, 26, 42)
    titleR.CharColor = RGB(232, 241, 255)
    titleR.CharHeight = 22
    titleR.CharWeight = 150
    titleR.HoriJustify = 1
    titleR.VertJustify = 2
    SetRangeAnchorText titleR, "ControlRoom Dashboard - same spreadsheet, premium operation"
    ApplyOuterBorder titleR, RGB(41, 69, 107), 70

    subtitleR = sh.getCellRangeByName("A3:H3")
    subtitleR.merge(True)
    subtitleR.CellBackColor = RGB(10, 22, 36)
    subtitleR.CharColor = RGB(156, 182, 214)
    subtitleR.CharHeight = 11
    subtitleR.HoriJustify = 1
    subtitleR.VertJustify = 2
    SetRangeAnchorText subtitleR, "Contract-ready layout with KPI ribbon, action strip, queue table, and alert rail."
    ApplyOuterBorder subtitleR, RGB(30, 52, 81), 40
End Sub

Private Sub BuildKpiRibbon(ByVal sh As Object)
    Dim ribbonTitle As Object
    Dim ribbonPanel As Object

    ribbonPanel = sh.getCellRangeByName("A5:H7")
    ribbonPanel.CellBackColor = RGB(12, 28, 46)
    ApplyOuterBorder ribbonPanel, RGB(41, 69, 107), 80

    ribbonTitle = sh.getCellRangeByName("A5:H5")
    ribbonTitle.merge(True)
    ribbonTitle.CharColor = RGB(156, 182, 214)
    ribbonTitle.CharHeight = 10
    ribbonTitle.CharWeight = 150
    ribbonTitle.HoriJustify = 1
    ribbonTitle.VertJustify = 2
    SetRangeAnchorText ribbonTitle, "KPI RIBBON"

    CreateKpiCard sh, "A6:B7", "$1.8M", "Net Revenue"
    CreateKpiCard sh, "C6:D7", "14", "Escalations"
    CreateKpiCard sh, "E6:F7", "93%", "SLA Health"
    CreateKpiCard sh, "G6:H7", "08", "Pending Reviews"
End Sub

Private Sub CreateKpiCard(ByVal sh As Object, ByVal addr As String, ByVal valueText As String, ByVal labelText As String)
    Dim r As Object
    r = sh.getCellRangeByName(addr)
    r.merge(True)
    r.CellBackColor = RGB(19, 35, 56)
    r.CharColor = RGB(232, 241, 255)
    r.CharWeight = 150
    r.CharHeight = 14
    r.HoriJustify = 2
    r.VertJustify = 2
    SetRangeAnchorText r, valueText & Chr(10) & UCase(labelText)
    ApplyOuterBorder r, RGB(52, 94, 143), 55
End Sub

Private Sub BuildCommandStrip(ByVal sh As Object)
    Dim stripPanel As Object
    Dim stripTitle As Object

    stripPanel = sh.getCellRangeByName("A10:H11")
    stripPanel.CellBackColor = RGB(16, 35, 58)
    ApplyOuterBorder stripPanel, RGB(56, 97, 146), 80

    stripTitle = sh.getCellRangeByName("A10:H10")
    stripTitle.merge(True)
    stripTitle.CharColor = RGB(156, 182, 214)
    stripTitle.CharWeight = 150
    stripTitle.CharHeight = 10
    stripTitle.HoriJustify = 1
    stripTitle.VertJustify = 2
    SetRangeAnchorText stripTitle, "ACTION STRIP"

    CreateCommandBlock sh, "A11:B11", "SYNC"
    CreateCommandBlock sh, "C11:D11", "INSPECT"
    CreateCommandBlock sh, "E11:F11", "ESCALATE"
    CreateCommandBlock sh, "G11:H11", "CLEAR"
End Sub

Private Sub CreateCommandBlock(ByVal sh As Object, ByVal addr As String, ByVal textVal As String)
    Dim r As Object
    r = sh.getCellRangeByName(addr)
    r.merge(True)
    r.CellBackColor = RGB(20, 40, 62)
    r.CharColor = RGB(232, 241, 255)
    r.CharWeight = 150
    r.CharHeight = 11
    r.HoriJustify = 2
    r.VertJustify = 2
    SetRangeAnchorText r, textVal
    ApplyOuterBorder r, RGB(90, 132, 181), 65
End Sub

Private Function ReadQueueData(ByVal sh As Object, ByRef rowCount As Long) As Variant
    Dim data(1 To 100, 1 To 5) As String
    Dim r As Long
    Dim c As Long
    Dim srcRow As Long
    Dim ownerText As String
    Dim foundAny As Boolean

    rowCount = 0
    foundAny = False

    ' Prefer "before" layout rows first (A5:E*), fallback to already-themed rows (A15:E*).
    If Trim(GetCellByPosText(sh, 0, 4)) <> "" Then
        srcRow = 4
    ElseIf Trim(GetCellByPosText(sh, 0, 14)) <> "" Then
        srcRow = 14
    Else
        srcRow = 4
    End If

    For r = srcRow To srcRow + 60
        ownerText = Trim(GetCellByPosText(sh, 0, r))
        If ownerText = "" Then
            If foundAny Then Exit For
        Else
            foundAny = True
            rowCount = rowCount + 1
            If rowCount > 100 Then Exit For
            For c = 0 To 4
                data(rowCount, c + 1) = GetCellByPosText(sh, c, r)
            Next c
        End If
    Next r

    If rowCount = 0 Then
        rowCount = 3
        data(1, 1) = "Monica": data(1, 2) = "North": data(1, 3) = "Receivables": data(1, 4) = "High": data(1, 5) = "Needs Review"
        data(2, 1) = "Alberto": data(2, 2) = "West": data(2, 3) = "Renewals": data(2, 4) = "Low": data(2, 5) = "Healthy"
        data(3, 1) = "Priya": data(3, 2) = "LATAM": data(3, 3) = "Collections": data(3, 4) = "Medium": data(3, 5) = "Watch"
    End If

    ReadQueueData = data
End Function

Private Sub BuildQueueTable(ByVal sh As Object, ByVal queueData As Variant, ByVal rowCount As Long)
    Dim panelTitle As Object
    Dim panelRange As Object
    Dim headerR As Object
    Dim bodyR As Object
    Dim i As Long
    Dim endRowIndex As Long
    Dim statusText As String

    If rowCount < 1 Then rowCount = 1
    If rowCount > 12 Then rowCount = 12
    endRowIndex = 14 + rowCount

    panelRange = sh.getCellRangeByName("A13:F" & CStr(endRowIndex + 1))
    panelRange.CellBackColor = RGB(9, 20, 34)
    ApplyOuterBorder panelRange, RGB(41, 69, 107), 90

    panelTitle = sh.getCellRangeByName("A13:F13")
    panelTitle.merge(True)
    panelTitle.CharColor = RGB(156, 182, 214)
    panelTitle.CharWeight = 150
    panelTitle.CharHeight = 10
    panelTitle.HoriJustify = 1
    panelTitle.VertJustify = 2
    SetRangeAnchorText panelTitle, "QUEUE TABLE"

    headerR = sh.getCellRangeByName("A14:E14")
    headerR.CellBackColor = RGB(14, 25, 39)
    headerR.CharColor = RGB(156, 182, 214)
    headerR.CharWeight = 150
    headerR.CharHeight = 10
    ApplyOuterBorder headerR, RGB(48, 82, 126), 40

    SetCellByPosText sh, 0, 13, "OWNER"
    SetCellByPosText sh, 1, 13, "REGION"
    SetCellByPosText sh, 2, 13, "QUEUE"
    SetCellByPosText sh, 3, 13, "RISK"
    SetCellByPosText sh, 4, 13, "STATUS"

    For i = 1 To rowCount
        SetCellByPosText sh, 0, 13 + i, queueData(i, 1)
        SetCellByPosText sh, 1, 13 + i, queueData(i, 2)
        SetCellByPosText sh, 2, 13 + i, queueData(i, 3)
        SetCellByPosText sh, 3, 13 + i, queueData(i, 4)
        SetCellByPosText sh, 4, 13 + i, queueData(i, 5)
    Next i

    bodyR = sh.getCellRangeByName("A15:E" & CStr(endRowIndex))
    bodyR.CellBackColor = RGB(11, 24, 39)
    bodyR.CharColor = RGB(232, 241, 255)
    ApplyOuterBorder bodyR, RGB(35, 58, 86), 30

    For i = 1 To rowCount
        statusText = LCase(Trim(GetCellByPosText(sh, 4, 13 + i)))
        If InStr(statusText, "healthy") > 0 Or InStr(statusText, "ok") > 0 Or InStr(statusText, "stable") > 0 Then
            ApplyStatusColor sh.getCellByPosition(4, 13 + i), RGB(52, 211, 153), RGB(167, 243, 208), RGB(10, 35, 28)
        ElseIf InStr(statusText, "watch") > 0 Or InStr(statusText, "medium") > 0 Then
            ApplyStatusColor sh.getCellByPosition(4, 13 + i), RGB(245, 158, 11), RGB(253, 230, 138), RGB(40, 29, 8)
        Else
            ApplyStatusColor sh.getCellByPosition(4, 13 + i), RGB(251, 113, 133), RGB(251, 207, 232), RGB(45, 16, 26)
        End If
    Next i
End Sub

Private Sub ApplyStatusColor(ByVal c As Object, ByVal borderColor As Long, ByVal textColor As Long, ByVal chipBg As Long)
    c.CellBackColor = chipBg
    c.CharColor = textColor
    c.CharWeight = 150
    c.HoriJustify = 2
    ApplyOuterBorder c, borderColor, 70
End Sub

Private Sub BuildAlertRail(ByVal sh As Object, ByVal rowCount As Long)
    Dim rail As Object
    Dim topRow As Long
    Dim endRow As Long

    topRow = 13
    endRow = 14 + rowCount
    If endRow < 17 Then endRow = 17

    rail = sh.getCellRangeByName("G" & CStr(topRow) & ":H" & CStr(endRow + 1))
    rail.merge(True)
    rail.CellBackColor = RGB(15, 31, 49)
    rail.CharColor = RGB(156, 182, 214)
    rail.CharHeight = 11
    rail.HoriJustify = 1
    rail.VertJustify = 1
    SetRangeAnchorText rail, "ALERT RAIL" & Chr(10) & Chr(10) & _
                             "Critical: Pending Vendor Sync" & Chr(10) & _
                             "Watch: Inventory Drift Review" & Chr(10) & _
                             "Hook: OpenAlertInspector" & Chr(10) & Chr(10) & _
                             "Row Capacity: " & CStr(rowCount)
    ApplyOuterBorder rail, RGB(70, 118, 168), 90
End Sub

Private Sub BuildFooter(ByVal sh As Object, ByVal rowCount As Long)
    Dim foot As Object
    Dim footerRow As Long
    footerRow = 17 + rowCount + 2
    If footerRow < 22 Then footerRow = 22

    foot = sh.getCellRangeByName("A" & CStr(footerRow) & ":H" & CStr(footerRow))
    foot.merge(True)
    foot.CellBackColor = RGB(8, 17, 28)
    foot.CharColor = RGB(127, 147, 184)
    foot.CharHeight = 10
    foot.HoriJustify = 2
    foot.VertJustify = 2
    SetRangeAnchorText foot, "LotOS modernization layer: same spreadsheet, better operation."
    ApplyOuterBorder foot, RGB(30, 52, 81), 30
End Sub

Private Sub DefineNamedRangesSafe(ByVal doc As Object, ByVal rowCount As Long)
    Dim endRow As Long
    endRow = 14 + rowCount
    If endRow < 17 Then endRow = 17

    On Error Resume Next
    AddOrReplaceNamedRange doc, "LOTOS_ALERT_COUNT", "$ControlRoom.$G$6"
    AddOrReplaceNamedRange doc, "LOTOS_QUEUE_SOURCE", "$ControlRoom.$A$15:$E$" & CStr(endRow)
    AddOrReplaceNamedRange doc, "LOTOS_OWNER_FILTER", "$ControlRoom.$B$13"
    AddOrReplaceNamedRange doc, "LOTOS_ACTION_TARGET", "$ControlRoom.$G$14:$H$" & CStr(endRow)
    On Error GoTo 0
End Sub

Private Sub AddOrReplaceNamedRange(ByVal doc As Object, ByVal nameText As String, ByVal refText As String)
    Dim nr As Object
    Dim addr As New com.sun.star.table.CellAddress

    nr = doc.NamedRanges
    addr.Sheet = 0
    addr.Column = 0
    addr.Row = 0

    If nr.hasByName(nameText) Then
        nr.removeByName nameText
    End If

    nr.addNewByName nameText, refText, addr, 0
End Sub

Private Sub ApplyOuterBorder(ByVal targetRange As Object, ByVal borderColor As Long, ByVal borderWidth As Long)
    Dim line As New com.sun.star.table.BorderLine
    line.Color = borderColor
    line.InnerLineWidth = 0
    line.OuterLineWidth = borderWidth
    line.LineDistance = 0

    targetRange.TopBorder = line
    targetRange.BottomBorder = line
    targetRange.LeftBorder = line
    targetRange.RightBorder = line
End Sub

Private Sub SetRangeAnchorText(ByVal rng As Object, ByVal txt As String)
    Dim c As Object
    c = rng.getCellByPosition(0, 0)
    c.String = txt
End Sub

Private Sub SetCellByNameText(ByVal sh As Object, ByVal addr As String, ByVal txt As String)
    Dim c As Object
    c = sh.getCellRangeByName(addr)
    c.String = txt
End Sub

Private Sub SetCellByPosText(ByVal sh As Object, ByVal col As Long, ByVal row As Long, ByVal txt As String)
    Dim c As Object
    c = sh.getCellByPosition(col, row)
    c.String = txt
End Sub

Private Function GetCellByPosText(ByVal sh As Object, ByVal col As Long, ByVal row As Long) As String
    Dim c As Object
    c = sh.getCellByPosition(col, row)
    GetCellByPosText = c.String
End Function

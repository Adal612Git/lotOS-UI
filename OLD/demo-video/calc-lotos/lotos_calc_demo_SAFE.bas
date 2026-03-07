Option Explicit

' SAFE version for LibreOffice/OpenOffice Calc.
' Minimal syntax surface to avoid parser issues.

Sub CreateBeforeSheet()
    Dim doc As Object
    Dim sh As Object

    doc = ThisComponent
    If Not doc.supportsService("com.sun.star.sheet.SpreadsheetDocument") Then
        MsgBox "Open this macro in Calc.", 48, "LotOS Demo"
        Exit Sub
    End If

    sh = EnsureSheet(doc, "ControlRoom")
    ClearSheet sh
    SetupBeforeGrid sh

    SetCell sh, 0, 0, "operaciones q1"
    SetCell sh, 0, 1, "hoja utilitaria sin sistema visual"

    SetCell sh, 0, 3, "owner"
    SetCell sh, 1, 3, "region"
    SetCell sh, 2, 3, "queue"
    SetCell sh, 3, 3, "risk"
    SetCell sh, 4, 3, "status"

    SetCell sh, 0, 4, "Monica"
    SetCell sh, 1, 4, "North"
    SetCell sh, 2, 4, "Receivables"
    SetCell sh, 3, 4, "High"
    SetCell sh, 4, 4, "Needs Review"

    SetCell sh, 0, 5, "Alberto"
    SetCell sh, 1, 5, "West"
    SetCell sh, 2, 5, "Renewals"
    SetCell sh, 3, 5, "Low"
    SetCell sh, 4, 5, "Healthy"

    SetCell sh, 0, 6, "Priya"
    SetCell sh, 1, 6, "LATAM"
    SetCell sh, 2, 6, "Collections"
    SetCell sh, 3, 6, "Medium"
    SetCell sh, 4, 6, "Watch"

    MsgBox "Before sheet created.", 64, "LotOS Demo"
End Sub

Sub ApplyLotosThemeCalc()
    Dim doc As Object
    Dim sh As Object
    Dim r As Integer
    Dim titleText As String
    Dim subtitleText As String
    Dim h1 As String, h2 As String, h3 As String, h4 As String, h5 As String

    Dim owner1 As String, owner2 As String, owner3 As String
    Dim region1 As String, region2 As String, region3 As String
    Dim queue1 As String, queue2 As String, queue3 As String
    Dim risk1 As String, risk2 As String, risk3 As String
    Dim status1 As String, status2 As String, status3 As String
    Dim totalRows As Integer, highRiskCount As Integer, healthyCount As Integer, attentionCount As Integer
    Dim alertText As String

    doc = ThisComponent
    If Not doc.supportsService("com.sun.star.sheet.SpreadsheetDocument") Then
        MsgBox "Open this macro in Calc.", 48, "LotOS Demo"
        Exit Sub
    End If

    sh = EnsureSheet(doc, "ControlRoom")

    titleText = CellText(sh, 0, 0)
    subtitleText = CellText(sh, 0, 1)
    h1 = CellText(sh, 0, 3)
    h2 = CellText(sh, 1, 3)
    h3 = CellText(sh, 2, 3)
    h4 = CellText(sh, 3, 3)
    h5 = CellText(sh, 4, 3)

    owner1 = CellText(sh, 0, 4): region1 = CellText(sh, 1, 4): queue1 = CellText(sh, 2, 4): risk1 = CellText(sh, 3, 4): status1 = CellText(sh, 4, 4)
    owner2 = CellText(sh, 0, 5): region2 = CellText(sh, 1, 5): queue2 = CellText(sh, 2, 5): risk2 = CellText(sh, 3, 5): status2 = CellText(sh, 4, 5)
    owner3 = CellText(sh, 0, 6): region3 = CellText(sh, 1, 6): queue3 = CellText(sh, 2, 6): risk3 = CellText(sh, 3, 6): status3 = CellText(sh, 4, 6)

    If titleText = "" Then titleText = "control room"
    If subtitleText = "" Then subtitleText = "same spreadsheet, styled without changing the underlying rows"
    If h1 = "" Then h1 = "owner"
    If h2 = "" Then h2 = "region"
    If h3 = "" Then h3 = "queue"
    If h4 = "" Then h4 = "risk"
    If h5 = "" Then h5 = "status"
    If owner1 = "" Then owner1 = "Monica": region1 = "North": queue1 = "Receivables": risk1 = "High": status1 = "Needs Review"
    If owner2 = "" Then owner2 = "Alberto": region2 = "West": queue2 = "Renewals": risk2 = "Low": status2 = "Healthy"
    If owner3 = "" Then owner3 = "Priya": region3 = "LATAM": queue3 = "Collections": risk3 = "Medium": status3 = "Watch"

    totalRows = 3
    highRiskCount = CountHighRisk(risk1) + CountHighRisk(risk2) + CountHighRisk(risk3)
    healthyCount = CountHealthy(status1) + CountHealthy(status2) + CountHealthy(status3)
    attentionCount = CountAttention(status1) + CountAttention(status2) + CountAttention(status3)
    alertText = BuildAlertText(owner1, status1, owner2, status2, owner3, status3)

    ClearSheet sh
    SetupLotosGrid sh

    ' Header block
    MergeRange sh, "A1:H1"
    PaintRange sh, "A1:H1", RGB(12, 26, 42), RGB(232, 241, 255), 20, True, 1
    SetCell sh, 0, 0, UCase(titleText)
    BorderRange sh, "A1:H1", RGB(41, 69, 107), 70

    MergeRange sh, "A2:H2"
    PaintRange sh, "A2:H2", RGB(10, 22, 36), RGB(156, 182, 214), 10, False, 1
    SetCell sh, 0, 1, subtitleText
    BorderRange sh, "A2:H2", RGB(30, 52, 81), 35

    ' KPI panel
    MergeRange sh, "A4:H4"
    PaintRange sh, "A4:H4", RGB(12, 28, 46), RGB(156, 182, 214), 10, True, 1
    SetCell sh, 0, 3, "SUMMARY"

    MergeRange sh, "A5:B6": PaintRange sh, "A5:B6", RGB(19, 35, 56), RGB(232, 241, 255), 13, True, 2: SetCell sh, 0, 4, CStr(totalRows) & Chr(10) & "ROWS": BorderRange sh, "A5:B6", RGB(52, 94, 143), 55
    MergeRange sh, "C5:D6": PaintRange sh, "C5:D6", RGB(19, 35, 56), RGB(232, 241, 255), 13, True, 2: SetCell sh, 2, 4, CStr(highRiskCount) & Chr(10) & "HIGH RISK": BorderRange sh, "C5:D6", RGB(52, 94, 143), 55
    MergeRange sh, "E5:F6": PaintRange sh, "E5:F6", RGB(19, 35, 56), RGB(232, 241, 255), 13, True, 2: SetCell sh, 4, 4, CStr(healthyCount) & Chr(10) & "HEALTHY": BorderRange sh, "E5:F6", RGB(52, 94, 143), 55
    MergeRange sh, "G5:H6": PaintRange sh, "G5:H6", RGB(19, 35, 56), RGB(232, 241, 255), 13, True, 2: SetCell sh, 6, 4, CStr(attentionCount) & Chr(10) & "ATTENTION": BorderRange sh, "G5:H6", RGB(52, 94, 143), 55
    BorderRange sh, "A4:H6", RGB(41, 69, 107), 80

    ' Action strip
    MergeRange sh, "A8:H8"
    PaintRange sh, "A8:H8", RGB(16, 35, 58), RGB(156, 182, 214), 10, True, 1
    SetCell sh, 0, 7, "COLUMN SHORTCUTS"
    BorderRange sh, "A8:H9", RGB(56, 97, 146), 80

    MergeRange sh, "A9:B9": PaintRange sh, "A9:B9", RGB(20, 40, 62), RGB(232, 241, 255), 10, True, 2: SetCell sh, 0, 8, UCase(h1): BorderRange sh, "A9:B9", RGB(90, 132, 181), 65
    MergeRange sh, "C9:D9": PaintRange sh, "C9:D9", RGB(20, 40, 62), RGB(232, 241, 255), 10, True, 2: SetCell sh, 2, 8, UCase(h2): BorderRange sh, "C9:D9", RGB(90, 132, 181), 65
    MergeRange sh, "E9:F9": PaintRange sh, "E9:F9", RGB(20, 40, 62), RGB(232, 241, 255), 10, True, 2: SetCell sh, 4, 8, UCase(h4): BorderRange sh, "E9:F9", RGB(90, 132, 181), 65
    MergeRange sh, "G9:H9": PaintRange sh, "G9:H9", RGB(20, 40, 62), RGB(232, 241, 255), 10, True, 2: SetCell sh, 6, 8, UCase(h5): BorderRange sh, "G9:H9", RGB(90, 132, 181), 65

    ' Queue panel
    BorderRange sh, "A11:F16", RGB(41, 69, 107), 90
    MergeRange sh, "A11:F11"
    PaintRange sh, "A11:F11", RGB(9, 20, 34), RGB(156, 182, 214), 10, True, 1
    SetCell sh, 0, 10, "QUEUE TABLE"

    PaintRange sh, "A12:E12", RGB(14, 25, 39), RGB(156, 182, 214), 10, True, 1
    SetCell sh, 0, 11, UCase(h1): SetCell sh, 1, 11, UCase(h2): SetCell sh, 2, 11, UCase(h3): SetCell sh, 3, 11, UCase(h4): SetCell sh, 4, 11, UCase(h5)

    PaintRange sh, "A13:E15", RGB(11, 24, 39), RGB(232, 241, 255), 10, False, 1
    SetCell sh, 0, 12, owner1: SetCell sh, 1, 12, region1: SetCell sh, 2, 12, queue1: SetCell sh, 3, 12, risk1: SetCell sh, 4, 12, status1
    SetCell sh, 0, 13, owner2: SetCell sh, 1, 13, region2: SetCell sh, 2, 13, queue2: SetCell sh, 3, 13, risk2: SetCell sh, 4, 13, status2
    SetCell sh, 0, 14, owner3: SetCell sh, 1, 14, region3: SetCell sh, 2, 14, queue3: SetCell sh, 3, 14, risk3: SetCell sh, 4, 14, status3

    ' Status chips
    ApplyStatusChip sh, 4, 12, status1
    ApplyStatusChip sh, 4, 13, status2
    ApplyStatusChip sh, 4, 14, status3

    ' Alert rail
    BorderRange sh, "G11:H16", RGB(70, 118, 168), 90
    MergeRange sh, "G11:H16"
    PaintRange sh, "G11:H16", RGB(15, 31, 49), RGB(156, 182, 214), 10, False, 1
    SetCell sh, 6, 10, alertText

    ' Footer
    MergeRange sh, "A18:H18"
    PaintRange sh, "A18:H18", RGB(8, 17, 28), RGB(127, 147, 184), 9, False, 2
    SetCell sh, 0, 17, "styled from existing sheet content"
    BorderRange sh, "A18:H18", RGB(30, 52, 81), 30

    ' Breathing room
    For r = 0 To 25
        sh.Rows.getByIndex(r).Height = 520
    Next r
    sh.Rows.getByIndex(0).Height = 760
    sh.Rows.getByIndex(1).Height = 560
    sh.Rows.getByIndex(3).Height = 360
    sh.Rows.getByIndex(7).Height = 340
    sh.Rows.getByIndex(10).Height = 430
    sh.Rows.getByIndex(17).Height = 430

    MsgBox "LotOS SAFE theme applied.", 64, "LotOS Demo"
End Sub

Private Function EnsureSheet(ByVal doc As Object, ByVal nameText As String) As Object
    Dim sheets As Object
    sheets = doc.Sheets
    If Not sheets.hasByName(nameText) Then
        sheets.insertNewByName nameText, sheets.getCount()
    End If
    EnsureSheet = sheets.getByName(nameText)
End Function

Private Sub ClearSheet(ByVal sh As Object)
    Dim allR As Object
    allR = sh.getCellRangeByName("A1:Z200")
    allR.clearContents(1023)
    allR.CellBackColor = RGB(255, 255, 255)
    allR.CharColor = RGB(0, 0, 0)
End Sub

Private Sub SetupBeforeGrid(ByVal sh As Object)
    Dim i As Integer
    Dim r As Object
    r = sh.getCellRangeByName("A1:H80")
    r.CharFontName = "Arial"
    r.CharHeight = 10
    r.CellBackColor = RGB(255, 255, 255)
    r.CharColor = RGB(25, 25, 25)
    For i = 0 To 7
        sh.Columns.getByIndex(i).Width = 2800
    Next i
End Sub

Private Sub SetupLotosGrid(ByVal sh As Object)
    Dim i As Integer
    Dim r As Object
    r = sh.getCellRangeByName("A1:H120")
    r.CharFontName = "Segoe UI"
    r.CharColor = RGB(232, 241, 255)
    r.CellBackColor = RGB(8, 17, 28)
    r.IsTextWrapped = True
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
End Sub

Private Sub SetCell(ByVal sh As Object, ByVal col As Long, ByVal row As Long, ByVal txt As String)
    Dim c As Object
    c = sh.getCellByPosition(col, row)
    c.String = txt
End Sub

Private Function CellText(ByVal sh As Object, ByVal col As Long, ByVal row As Long) As String
    Dim c As Object
    c = sh.getCellByPosition(col, row)
    CellText = c.String
End Function

Private Sub MergeRange(ByVal sh As Object, ByVal addr As String)
    Dim r As Object
    r = sh.getCellRangeByName(addr)
    r.merge(True)
End Sub

Private Sub PaintRange(ByVal sh As Object, ByVal addr As String, ByVal bg As Long, ByVal fg As Long, ByVal fontSize As Integer, ByVal bold As Boolean, ByVal alignMode As Integer)
    Dim r As Object
    r = sh.getCellRangeByName(addr)
    r.CellBackColor = bg
    r.CharColor = fg
    r.CharHeight = fontSize
    If bold Then
        r.CharWeight = 150
    Else
        r.CharWeight = 100
    End If
    r.HoriJustify = alignMode
    r.VertJustify = 2
End Sub

Private Sub BorderRange(ByVal sh As Object, ByVal addr As String, ByVal colorVal As Long, ByVal widthVal As Long)
    Dim r As Object
    Dim bLine As Object
    r = sh.getCellRangeByName(addr)
    bLine = CreateUnoStruct("com.sun.star.table.BorderLine")
    bLine.Color = colorVal
    bLine.InnerLineWidth = 0
    bLine.OuterLineWidth = widthVal
    bLine.LineDistance = 0
    r.TopBorder = bLine
    r.BottomBorder = bLine
    r.LeftBorder = bLine
    r.RightBorder = bLine
End Sub

Private Sub ApplyStatusChip(ByVal sh As Object, ByVal col As Long, ByVal row As Long, ByVal statusText As String)
    Dim s As String
    s = LCase(Trim(statusText))
    If InStr(s, "healthy") > 0 Or InStr(s, "ok") > 0 Or InStr(s, "stable") > 0 Then
        PaintRange sh, ColRowAddr(col, row), RGB(10, 35, 28), RGB(167, 243, 208), 10, True, 2
        BorderRange sh, ColRowAddr(col, row), RGB(52, 211, 153), 70
    ElseIf InStr(s, "watch") > 0 Or InStr(s, "medium") > 0 Then
        PaintRange sh, ColRowAddr(col, row), RGB(40, 29, 8), RGB(253, 230, 138), 10, True, 2
        BorderRange sh, ColRowAddr(col, row), RGB(245, 158, 11), 70
    Else
        PaintRange sh, ColRowAddr(col, row), RGB(45, 16, 26), RGB(251, 207, 232), 10, True, 2
        BorderRange sh, ColRowAddr(col, row), RGB(251, 113, 133), 70
    End If
End Sub

Private Function ColRowAddr(ByVal col As Long, ByVal row As Long) As String
    ColRowAddr = ColName(col) & CStr(row + 1) & ":" & ColName(col) & CStr(row + 1)
End Function

Private Function ColName(ByVal col As Long) As String
    ColName = Chr(65 + col)
End Function

Private Function CountHighRisk(ByVal riskText As String) As Integer
    Dim s As String
    s = LCase(Trim(riskText))
    If InStr(s, "high") > 0 Or InStr(s, "alto") > 0 Then
        CountHighRisk = 1
    Else
        CountHighRisk = 0
    End If
End Function

Private Function CountHealthy(ByVal statusText As String) As Integer
    Dim s As String
    s = LCase(Trim(statusText))
    If InStr(s, "healthy") > 0 Or InStr(s, "ok") > 0 Or InStr(s, "stable") > 0 Then
        CountHealthy = 1
    Else
        CountHealthy = 0
    End If
End Function

Private Function CountAttention(ByVal statusText As String) As Integer
    If CountHealthy(statusText) = 1 Then
        CountAttention = 0
    ElseIf Trim(statusText) = "" Then
        CountAttention = 0
    Else
        CountAttention = 1
    End If
End Function

Private Function BuildAlertText(ByVal owner1 As String, ByVal status1 As String, ByVal owner2 As String, ByVal status2 As String, ByVal owner3 As String, ByVal status3 As String) As String
    Dim txt As String
    txt = "ALERT RAIL"

    If CountAttention(status1) = 1 Then txt = txt & Chr(10) & Chr(10) & owner1 & ": " & status1
    If CountAttention(status2) = 1 Then txt = txt & Chr(10) & owner2 & ": " & status2
    If CountAttention(status3) = 1 Then txt = txt & Chr(10) & owner3 & ": " & status3

    If txt = "ALERT RAIL" Then
        txt = txt & Chr(10) & Chr(10) & "No alerts from current rows"
    End If

    BuildAlertText = txt
End Function

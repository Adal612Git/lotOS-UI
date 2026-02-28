using System.Drawing;
using System.Windows.Forms;

namespace LotosDesktopDemo;

internal static class Program
{
    [STAThread]
    private static void Main()
    {
        ApplicationConfiguration.Initialize();
        Application.Run(new MainWindow());
    }
}

internal sealed class MainWindow : Form
{
    private readonly Label _status;
    private readonly DataGridView _grid;

    public MainWindow()
    {
        Text = "LotOS Desktop .NET Demo";
        Width = 1360;
        Height = 860;
        MinimumSize = new Size(1180, 760);
        StartPosition = FormStartPosition.CenterScreen;
        BackColor = ColorTranslator.FromHtml("#0f172a");
        ForeColor = ColorTranslator.FromHtml("#e2e8f0");

        var shell = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 1,
            BackColor = BackColor,
            Padding = new Padding(18),
        };
        shell.ColumnStyles.Add(new ColumnStyle(SizeType.Absolute, 300));
        shell.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 100));
        Controls.Add(shell);

        shell.Controls.Add(BuildSidebar(), 0, 0);
        shell.Controls.Add(BuildMain(), 1, 0);

        _status = new Label
        {
            Text = "Ready",
            ForeColor = ColorTranslator.FromHtml("#9fb3cc"),
            AutoSize = true,
            Margin = new Padding(0, 8, 0, 0),
        };

        _grid = CreateGrid();
        PopulateGrid();
    }

    private Control BuildSidebar()
    {
        var panel = CreatePanel();
        panel.Dock = DockStyle.Fill;

        var title = new Label
        {
            Text = "LotOS Desktop",
            Font = new Font("Segoe UI Semibold", 22f),
            ForeColor = ForeColor,
            AutoSize = true,
            Location = new Point(18, 18),
        };

        var subtitle = new Label
        {
            Text = ".NET / WinForms",
            Font = new Font("Consolas", 10f, FontStyle.Bold),
            ForeColor = ColorTranslator.FromHtml("#38bdf8"),
            AutoSize = true,
            Location = new Point(20, 58),
        };

        panel.Controls.Add(title);
        panel.Controls.Add(subtitle);

        string[] items = ["Executive Overview", "Deployment Queue", "Approvals", "Audit Trail"];
        int top = 100;
        foreach (var item in items)
        {
            var block = new Panel
            {
                BackColor = ColorTranslator.FromHtml("#132542"),
                Size = new Size(240, 46),
                Location = new Point(18, top),
            };
            var label = new Label
            {
                Text = item,
                ForeColor = ForeColor,
                AutoSize = true,
                Location = new Point(14, 14),
            };
            block.Controls.Add(label);
            panel.Controls.Add(block);
            top += 56;
        }

        return panel;
    }

    private Control BuildMain()
    {
        var layout = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 1,
            RowCount = 4,
            BackColor = BackColor,
        };
        layout.RowStyles.Add(new RowStyle(SizeType.Absolute, 110));
        layout.RowStyles.Add(new RowStyle(SizeType.Absolute, 110));
        layout.RowStyles.Add(new RowStyle(SizeType.Percent, 100));
        layout.RowStyles.Add(new RowStyle(SizeType.Absolute, 36));

        layout.Controls.Add(BuildHeader(), 0, 0);
        layout.Controls.Add(BuildKpiRail(), 0, 1);
        layout.Controls.Add(BuildWorkspace(), 0, 2);

        var statusWrap = new Panel { Dock = DockStyle.Fill, BackColor = BackColor };
        statusWrap.Controls.Add(_status);
        layout.Controls.Add(statusWrap, 0, 3);

        return layout;
    }

    private Control BuildHeader()
    {
        var panel = CreatePanel();
        panel.Dock = DockStyle.Fill;

        var title = new Label
        {
            Text = "Ops Command Surface",
            Font = new Font("Segoe UI Semibold", 20f),
            ForeColor = ForeColor,
            AutoSize = true,
            Location = new Point(18, 18),
        };
        var desc = new Label
        {
            Text = "Native desktop demo using LotOS layout principles and runtime-safe actions.",
            ForeColor = ColorTranslator.FromHtml("#9fb3cc"),
            AutoSize = true,
            Location = new Point(20, 54),
        };

        var refresh = CreateButton("Refresh", false);
        refresh.Location = new Point(760, 28);
        refresh.Click += (_, _) =>
        {
            PopulateGrid();
            _status.Text = "Sync complete • queue metrics refreshed";
        };

        var command = CreateButton("Open Command Palette", true);
        command.Location = new Point(870, 28);
        command.Click += (_, _) => ShowNotice("Command palette requested");

        panel.Controls.Add(title);
        panel.Controls.Add(desc);
        panel.Controls.Add(refresh);
        panel.Controls.Add(command);
        return panel;
    }

    private Control BuildKpiRail()
    {
        var rail = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 3,
            RowCount = 1,
            BackColor = BackColor,
            Margin = new Padding(0, 12, 0, 12),
        };
        rail.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.33f));
        rail.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.33f));
        rail.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 33.33f));

        rail.Controls.Add(CreateKpi("Queue Total", "12", "#38bdf8"), 0, 0);
        rail.Controls.Add(CreateKpi("High Priority", "4", "#ef4444"), 1, 0);
        rail.Controls.Add(CreateKpi("Resolved", "8", "#22c55e"), 2, 0);

        return rail;
    }

    private Control BuildWorkspace()
    {
        var workspace = new TableLayoutPanel
        {
            Dock = DockStyle.Fill,
            ColumnCount = 2,
            RowCount = 1,
            BackColor = BackColor,
        };
        workspace.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 62f));
        workspace.ColumnStyles.Add(new ColumnStyle(SizeType.Percent, 38f));

        var left = CreatePanel();
        left.Dock = DockStyle.Fill;
        var label = new Label
        {
            Text = "Incident Queue",
            Font = new Font("Segoe UI Semibold", 13f),
            ForeColor = ForeColor,
            AutoSize = true,
            Location = new Point(18, 16),
        };
        _grid.Location = new Point(18, 52);
        _grid.Size = new Size(720, 420);
        left.Controls.Add(label);
        left.Controls.Add(_grid);

        var right = CreatePanel();
        right.Dock = DockStyle.Fill;
        right.Controls.Add(BuildActionPanel());

        workspace.Controls.Add(left, 0, 0);
        workspace.Controls.Add(right, 1, 0);
        return workspace;
    }

    private Control BuildActionPanel()
    {
        var panel = new Panel
        {
            Dock = DockStyle.Fill,
            BackColor = Color.Transparent,
        };

        var title = new Label
        {
            Text = "Action Center",
            Font = new Font("Segoe UI Semibold", 13f),
            ForeColor = ForeColor,
            AutoSize = true,
            Location = new Point(18, 16),
        };
        panel.Controls.Add(title);

        var approve = CreateButton("Approve Dispatch", true);
        approve.Location = new Point(18, 54);
        approve.Click += (_, _) => ShowNotice("Dispatch approved");

        var escalate = CreateButton("Escalate Incident", false);
        escalate.Location = new Point(18, 102);
        escalate.Click += (_, _) => ShowNotice("Escalation confirmed");

        var export = CreateButton("Export Snapshot", false);
        export.Location = new Point(18, 150);
        export.Click += (_, _) => ShowNotice("Snapshot exported");

        panel.Controls.Add(approve);
        panel.Controls.Add(escalate);
        panel.Controls.Add(export);

        return panel;
    }

    private void PopulateGrid()
    {
        _grid.Rows.Clear();
        _grid.Rows.Add("#A-118", "Mia", "High", "Queued");
        _grid.Rows.Add("#B-204", "Luis", "Medium", "Review");
        _grid.Rows.Add("#C-331", "Iris", "Low", "Approved");
        _grid.Rows.Add("#D-502", "Sana", "High", "Escalated");
    }

    private void ShowNotice(string message)
    {
        _status.Text = message;
        MessageBox.Show(
            this,
            message,
            "LotOS Desktop .NET Demo",
            MessageBoxButtons.OK,
            MessageBoxIcon.Information
        );
    }

    private static Panel CreatePanel()
    {
        return new Panel
        {
            BackColor = ColorTranslator.FromHtml("#13213a"),
            Padding = new Padding(0),
            Margin = new Padding(0),
        };
    }

    private static Control CreateKpi(string label, string value, string color)
    {
        var panel = new Panel
        {
            Dock = DockStyle.Fill,
            BackColor = ColorTranslator.FromHtml("#13213a"),
            Margin = new Padding(0, 0, 12, 0),
        };

        var l1 = new Label
        {
            Text = label.ToUpperInvariant(),
            ForeColor = ColorTranslator.FromHtml("#9fb3cc"),
            AutoSize = true,
            Font = new Font("Consolas", 9f),
            Location = new Point(16, 14),
        };
        var l2 = new Label
        {
            Text = value,
            ForeColor = ColorTranslator.FromHtml(color),
            AutoSize = true,
            Font = new Font("Segoe UI Semibold", 22f),
            Location = new Point(16, 42),
        };
        panel.Controls.Add(l1);
        panel.Controls.Add(l2);
        return panel;
    }

    private static Button CreateButton(string text, bool accent)
    {
        return new Button
        {
            Text = text,
            Width = accent ? 170 : 150,
            Height = 36,
            FlatStyle = FlatStyle.Flat,
            BackColor = ColorTranslator.FromHtml(accent ? "#38bdf8" : "#182947"),
            ForeColor = ColorTranslator.FromHtml(accent ? "#08111f" : "#e2e8f0"),
        };
    }

    private static DataGridView CreateGrid()
    {
        var grid = new DataGridView
        {
            AllowUserToAddRows = false,
            AllowUserToDeleteRows = false,
            AllowUserToResizeRows = false,
            BackgroundColor = ColorTranslator.FromHtml("#13213a"),
            BorderStyle = BorderStyle.None,
            RowHeadersVisible = false,
            MultiSelect = false,
            SelectionMode = DataGridViewSelectionMode.FullRowSelect,
            EnableHeadersVisualStyles = false,
            GridColor = ColorTranslator.FromHtml("#2c456b"),
            ColumnHeadersHeight = 36,
        };

        grid.ColumnHeadersDefaultCellStyle.BackColor = ColorTranslator.FromHtml("#182947");
        grid.ColumnHeadersDefaultCellStyle.ForeColor = ColorTranslator.FromHtml("#e2e8f0");
        grid.DefaultCellStyle.BackColor = ColorTranslator.FromHtml("#13213a");
        grid.DefaultCellStyle.ForeColor = ColorTranslator.FromHtml("#e2e8f0");
        grid.DefaultCellStyle.SelectionBackColor = ColorTranslator.FromHtml("#182947");
        grid.DefaultCellStyle.SelectionForeColor = ColorTranslator.FromHtml("#e2e8f0");

        grid.Columns.Add("Ticket", "Ticket");
        grid.Columns.Add("Owner", "Owner");
        grid.Columns.Add("Priority", "Priority");
        grid.Columns.Add("Status", "Status");

        return grid;
    }
}

from __future__ import annotations

import tkinter as tk
from tkinter import ttk


SURFACE = "#0f172a"
SURFACE_SOFT = "#13213a"
PANEL = "#182947"
LINE = "#2c456b"
TEXT = "#e2e8f0"
TEXT_SOFT = "#9fb3cc"
ACCENT = "#38bdf8"
SUCCESS = "#22c55e"
WARNING = "#f59e0b"
DANGER = "#ef4444"


def sample_queue() -> list[dict[str, str]]:
    return [
        {"ticket": "#A-118", "owner": "Mia", "priority": "High", "status": "Investigating"},
        {"ticket": "#B-204", "owner": "Luis", "priority": "Medium", "status": "Queued"},
        {"ticket": "#C-331", "owner": "Iris", "priority": "Low", "status": "Monitoring"},
        {"ticket": "#D-502", "owner": "Sana", "priority": "High", "status": "Escalated"},
        {"ticket": "#E-111", "owner": "Noah", "priority": "Medium", "status": "Resolved"},
    ]


def build_demo_state() -> dict[str, object]:
    queue = sample_queue()
    return {
        "title": "LotOS Desktop Python Demo",
        "queue_total": len(queue),
        "high_priority": sum(1 for row in queue if row["priority"] == "High"),
        "resolved": sum(1 for row in queue if row["status"] == "Resolved"),
        "queue": queue,
    }


class LotosDesktopDemo(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("LotOS Desktop Python Demo")
        self.geometry("1360x860")
        self.minsize(1180, 760)
        self.configure(bg=SURFACE)

        self.state_data = build_demo_state()
        self.search_var = tk.StringVar()
        self.status_var = tk.StringVar(value="Ready")
        self.tree: ttk.Treeview | None = None
        self._style = ttk.Style(self)

        self._configure_style()
        self._build_layout()
        self._refresh_table()

    def _configure_style(self) -> None:
        self._style.theme_use("clam")
        self._style.configure(
            "Lotos.Treeview",
            background=SURFACE_SOFT,
            fieldbackground=SURFACE_SOFT,
            foreground=TEXT,
            rowheight=32,
            bordercolor=LINE,
            borderwidth=0,
        )
        self._style.map("Lotos.Treeview", background=[("selected", PANEL)])
        self._style.configure(
            "Lotos.Treeview.Heading",
            background=PANEL,
            foreground=TEXT,
            relief="flat",
            borderwidth=0,
            font=("Segoe UI Semibold", 10),
            padding=(10, 10),
        )
        self._style.configure(
            "Lotos.TEntry",
            fieldbackground=SURFACE_SOFT,
            foreground=TEXT,
            bordercolor=LINE,
            lightcolor=LINE,
            darkcolor=LINE,
            insertcolor=TEXT,
        )

    def _build_layout(self) -> None:
        shell = tk.Frame(self, bg=SURFACE)
        shell.pack(fill="both", expand=True, padx=18, pady=18)
        shell.grid_columnconfigure(1, weight=1)
        shell.grid_rowconfigure(0, weight=1)

        nav = tk.Frame(shell, bg=SURFACE_SOFT, highlightbackground=LINE, highlightthickness=1)
        nav.grid(row=0, column=0, sticky="nsw", padx=(0, 14))
        nav.configure(width=320)
        nav.pack_propagate(False)

        content = tk.Frame(shell, bg=SURFACE)
        content.grid(row=0, column=1, sticky="nsew")
        content.grid_columnconfigure(0, weight=1)
        content.grid_rowconfigure(2, weight=1)

        self._build_nav(nav)
        self._build_header(content)
        self._build_kpis(content)
        self._build_workspace(content)
        self._build_status_bar(content)

    def _build_nav(self, parent: tk.Frame) -> None:
        tk.Label(
            parent,
            text="LotOS Desktop",
            bg=SURFACE_SOFT,
            fg=TEXT,
            font=("Segoe UI Semibold", 24),
        ).pack(anchor="w", padx=20, pady=(22, 6))

        tk.Label(
            parent,
            text="PYTHON / TKINTER",
            bg=SURFACE_SOFT,
            fg=ACCENT,
            font=("Consolas", 10, "bold"),
        ).pack(anchor="w", padx=20, pady=(0, 18))

        sections = [
            ("Pattern", "Control Center"),
            ("Mode", "Operations"),
            ("Bridge", "Native command bus"),
            ("Packaging", "PyInstaller ready"),
        ]
        for label, value in sections:
            block = tk.Frame(parent, bg=PANEL, highlightbackground=LINE, highlightthickness=1)
            block.pack(fill="x", padx=18, pady=6)
            tk.Label(block, text=label.upper(), bg=PANEL, fg=TEXT_SOFT, font=("Consolas", 9)).pack(anchor="w", padx=12, pady=(10, 2))
            tk.Label(block, text=value, bg=PANEL, fg=TEXT, font=("Segoe UI Semibold", 11)).pack(anchor="w", padx=12, pady=(0, 10))

        quick = tk.Frame(parent, bg=PANEL, highlightbackground=LINE, highlightthickness=1)
        quick.pack(fill="x", padx=18, pady=(12, 6))
        tk.Label(quick, text="Quick Actions", bg=PANEL, fg=TEXT, font=("Segoe UI Semibold", 11)).pack(anchor="w", padx=12, pady=(10, 8))
        for label, command in [
            ("Open War Room", self._show_modal),
            ("Sync Queue", self._sync_queue),
            ("Export Snapshot", self._export_snapshot),
        ]:
            self._command_button(quick, label, command, accent=False).pack(fill="x", padx=12, pady=4)

    def _build_header(self, parent: tk.Frame) -> None:
        header = tk.Frame(parent, bg=SURFACE_SOFT, highlightbackground=LINE, highlightthickness=1)
        header.grid(row=0, column=0, sticky="ew")
        header.grid_columnconfigure(0, weight=1)

        left = tk.Frame(header, bg=SURFACE_SOFT)
        left.grid(row=0, column=0, sticky="w", padx=18, pady=14)
        tk.Label(left, text="Ops Command Surface", bg=SURFACE_SOFT, fg=TEXT, font=("Segoe UI Semibold", 22)).pack(anchor="w")
        tk.Label(
            left,
            text="Native desktop demo using LotOS layout principles and runtime-safe actions.",
            bg=SURFACE_SOFT,
            fg=TEXT_SOFT,
            font=("Segoe UI", 10),
        ).pack(anchor="w", pady=(4, 0))

        right = tk.Frame(header, bg=SURFACE_SOFT)
        right.grid(row=0, column=1, sticky="e", padx=18, pady=14)
        self._command_button(right, "Open Command Palette", self._show_modal, accent=True).pack(side="left", padx=(0, 10))
        self._command_button(right, "Refresh", self._sync_queue, accent=False).pack(side="left")

    def _build_kpis(self, parent: tk.Frame) -> None:
        rail = tk.Frame(parent, bg=SURFACE)
        rail.grid(row=1, column=0, sticky="ew", pady=14)
        for index in range(3):
            rail.grid_columnconfigure(index, weight=1)

        cards = [
            ("Queue Total", str(self.state_data["queue_total"]), ACCENT),
            ("High Priority", str(self.state_data["high_priority"]), DANGER),
            ("Resolved", str(self.state_data["resolved"]), SUCCESS),
        ]
        for index, (label, value, color) in enumerate(cards):
            card = tk.Frame(rail, bg=PANEL, highlightbackground=LINE, highlightthickness=1)
            card.grid(row=0, column=index, sticky="ew", padx=(0 if index == 0 else 6, 0 if index == 2 else 6))
            tk.Label(card, text=label.upper(), bg=PANEL, fg=TEXT_SOFT, font=("Consolas", 9)).pack(anchor="w", padx=14, pady=(12, 6))
            tk.Label(card, text=value, bg=PANEL, fg=color, font=("Segoe UI Semibold", 24)).pack(anchor="w", padx=14, pady=(0, 12))

    def _build_workspace(self, parent: tk.Frame) -> None:
        workspace = tk.Frame(parent, bg=SURFACE)
        workspace.grid(row=2, column=0, sticky="nsew")
        workspace.grid_columnconfigure(0, weight=3)
        workspace.grid_columnconfigure(1, weight=2)
        workspace.grid_rowconfigure(0, weight=1)

        table_panel = tk.Frame(workspace, bg=SURFACE_SOFT, highlightbackground=LINE, highlightthickness=1)
        table_panel.grid(row=0, column=0, sticky="nsew", padx=(0, 8))
        table_panel.grid_columnconfigure(0, weight=1)
        table_panel.grid_rowconfigure(2, weight=1)

        filter_row = tk.Frame(table_panel, bg=SURFACE_SOFT)
        filter_row.grid(row=0, column=0, sticky="ew", padx=14, pady=(14, 10))
        filter_row.grid_columnconfigure(1, weight=1)
        tk.Label(filter_row, text="Incident Queue", bg=SURFACE_SOFT, fg=TEXT, font=("Segoe UI Semibold", 14)).grid(row=0, column=0, sticky="w")
        search = ttk.Entry(filter_row, textvariable=self.search_var, style="Lotos.TEntry")
        search.grid(row=0, column=1, sticky="ew", padx=12)
        search.bind("<KeyRelease>", lambda _event: self._refresh_table())

        hint = tk.Label(
            table_panel,
            text="Filter by ticket, owner, priority or status.",
            bg=SURFACE_SOFT,
            fg=TEXT_SOFT,
            font=("Segoe UI", 9),
        )
        hint.grid(row=1, column=0, sticky="w", padx=14, pady=(0, 10))

        columns = ("ticket", "owner", "priority", "status")
        tree = ttk.Treeview(table_panel, columns=columns, show="headings", style="Lotos.Treeview")
        for column in columns:
            tree.heading(column, text=column.title())
            tree.column(column, width=120 if column != "status" else 180, anchor="w")
        tree.grid(row=2, column=0, sticky="nsew", padx=14, pady=(0, 14))
        self.tree = tree

        side = tk.Frame(workspace, bg=SURFACE)
        side.grid(row=0, column=1, sticky="nsew", padx=(8, 0))
        side.grid_rowconfigure(1, weight=1)

        action_panel = tk.Frame(side, bg=SURFACE_SOFT, highlightbackground=LINE, highlightthickness=1)
        action_panel.grid(row=0, column=0, sticky="ew", pady=(0, 8))
        tk.Label(action_panel, text="Action Center", bg=SURFACE_SOFT, fg=TEXT, font=("Segoe UI Semibold", 14)).pack(anchor="w", padx=14, pady=(14, 6))
        tk.Label(
            action_panel,
            text="Native command flow that mirrors the LotOS desktop bridge model.",
            bg=SURFACE_SOFT,
            fg=TEXT_SOFT,
            font=("Segoe UI", 9),
            wraplength=300,
            justify="left",
        ).pack(anchor="w", padx=14, pady=(0, 10))
        for label, command in [
            ("Approve Dispatch", self._approve_dispatch),
            ("Escalate Incident", self._show_modal),
            ("Refresh Metrics", self._sync_queue),
        ]:
            self._command_button(action_panel, label, command, accent=label == "Approve Dispatch").pack(fill="x", padx=14, pady=4)

        notes = tk.Frame(side, bg=PANEL, highlightbackground=LINE, highlightthickness=1)
        notes.grid(row=1, column=0, sticky="nsew", pady=(8, 0))
        tk.Label(notes, text="Runtime Notes", bg=PANEL, fg=TEXT, font=("Segoe UI Semibold", 13)).pack(anchor="w", padx=14, pady=(14, 8))
        bullets = [
            "Uses shared LotOS desktop layout zones translated to native widgets.",
            "Can package as a single executable with PyInstaller.",
            "Keeps command actions and modal flow local for offline operations.",
        ]
        for bullet in bullets:
            tk.Label(
                notes,
                text=f"• {bullet}",
                bg=PANEL,
                fg=TEXT_SOFT,
                font=("Segoe UI", 9),
                wraplength=320,
                justify="left",
            ).pack(anchor="w", padx=14, pady=4)

    def _build_status_bar(self, parent: tk.Frame) -> None:
        bar = tk.Frame(parent, bg=SURFACE_SOFT, highlightbackground=LINE, highlightthickness=1)
        bar.grid(row=3, column=0, sticky="ew", pady=(14, 0))
        tk.Label(bar, textvariable=self.status_var, bg=SURFACE_SOFT, fg=TEXT_SOFT, font=("Consolas", 9)).pack(anchor="w", padx=14, pady=8)

    def _command_button(self, parent: tk.Widget, label: str, command, *, accent: bool) -> tk.Button:
        background = ACCENT if accent else PANEL
        foreground = SURFACE if accent else TEXT
        border = ACCENT if accent else LINE
        return tk.Button(
            parent,
            text=label,
            command=command,
            relief="flat",
            bd=0,
            bg=background,
            fg=foreground,
            activebackground=background,
            activeforeground=foreground,
            cursor="hand2",
            highlightthickness=1,
            highlightbackground=border,
            font=("Segoe UI Semibold", 10),
            padx=12,
            pady=10,
        )

    def _filtered_rows(self) -> list[dict[str, str]]:
        query = self.search_var.get().strip().lower()
        rows = self.state_data["queue"]
        assert isinstance(rows, list)
        if not query:
            return rows
        return [
            row for row in rows
            if query in " ".join(row.values()).lower()
        ]

    def _refresh_table(self) -> None:
        if self.tree is None:
            return
        for item in self.tree.get_children():
            self.tree.delete(item)
        rows = self._filtered_rows()
        for row in rows:
            self.tree.insert("", "end", values=(row["ticket"], row["owner"], row["priority"], row["status"]))
        self.status_var.set(f"Ready • {len(rows)} visible tickets")

    def _sync_queue(self) -> None:
        self.status_var.set("Sync complete • queue metrics refreshed")
        self._refresh_table()

    def _approve_dispatch(self) -> None:
        self.status_var.set("Dispatch approved • awaiting downstream confirmation")
        self._show_toast("Dispatch batch approved", SUCCESS)

    def _export_snapshot(self) -> None:
        self.status_var.set("Snapshot exported • desktop state captured locally")
        self._show_toast("Snapshot exported", WARNING)

    def _show_modal(self) -> None:
        modal = tk.Toplevel(self)
        modal.title("Escalation Notice")
        modal.configure(bg=SURFACE)
        modal.transient(self)
        modal.grab_set()
        modal.geometry("520x320")

        panel = tk.Frame(modal, bg=SURFACE_SOFT, highlightbackground=LINE, highlightthickness=1)
        panel.pack(fill="both", expand=True, padx=18, pady=18)
        tk.Label(panel, text="Escalation Notice", bg=SURFACE_SOFT, fg=TEXT, font=("Segoe UI Semibold", 18)).pack(anchor="w", padx=18, pady=(18, 8))
        tk.Label(
            panel,
            text="Customers in tier A will be notified immediately. Confirm the escalation path before execution.",
            bg=SURFACE_SOFT,
            fg=TEXT_SOFT,
            font=("Segoe UI", 10),
            wraplength=440,
            justify="left",
        ).pack(anchor="w", padx=18, pady=(0, 14))

        body = tk.Frame(panel, bg=PANEL, highlightbackground=LINE, highlightthickness=1)
        body.pack(fill="x", padx=18, pady=(0, 14))
        tk.Label(body, text="Bridge action", bg=PANEL, fg=TEXT_SOFT, font=("Consolas", 9)).pack(anchor="w", padx=12, pady=(12, 4))
        tk.Label(body, text="invoke('incident.escalate', { severity: 'critical' })", bg=PANEL, fg=ACCENT, font=("Consolas", 10)).pack(anchor="w", padx=12, pady=(0, 12))

        actions = tk.Frame(panel, bg=SURFACE_SOFT)
        actions.pack(anchor="e", padx=18, pady=(0, 18))
        self._command_button(actions, "Cancel", modal.destroy, accent=False).pack(side="left", padx=(0, 8))
        self._command_button(actions, "Confirm Escalation", lambda: self._confirm_modal(modal), accent=True).pack(side="left")

    def _confirm_modal(self, modal: tk.Toplevel) -> None:
        modal.destroy()
        self.status_var.set("Escalation confirmed • downstream alert bridge invoked")
        self._show_toast("Escalation confirmed", DANGER)

    def _show_toast(self, text: str, color: str) -> None:
        toast = tk.Toplevel(self)
        toast.overrideredirect(True)
        toast.configure(bg=color)
        toast.attributes("-topmost", True)
        toast.geometry(f"280x56+{self.winfo_x() + 980}+{self.winfo_y() + 40}")
        tk.Label(toast, text=text, bg=color, fg=SURFACE, font=("Segoe UI Semibold", 10)).pack(fill="both", expand=True, padx=16, pady=14)
        toast.after(1800, toast.destroy)


def main() -> None:
    app = LotosDesktopDemo()
    app.mainloop()


if __name__ == "__main__":
    main()

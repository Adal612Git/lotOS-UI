# LotOS Design Patterns - Multi Runtime

Goal: ship interfaces that are clearly superior to the default quality in C, C++, Java, PHP, .NET, Go, Mojo, and Python ecosystems.

## Non-Negotiable Visual Rules

1. One dominant action per viewport.
2. One dominant data object per viewport (table, chart, timeline, or board).
3. Spacing must follow token rhythm only.
4. Every state needs explicit styling: default, hover, focus-visible, active, disabled, error.
5. Semantic colors are mandatory; no ad-hoc status colors.
6. Typography hierarchy must be obvious in 3 levels minimum.

## Runtime Mapping

| Language | Runtime Target | Primary Strategy | Pattern Priority |
| --- | --- | --- | --- |
| PHP | Laravel Blade/Livewire | Server-render shell + hydrated widgets | SaaS Control Center |
| Python | Django Templates / Flask Jinja | Template inheritance + partial updates | SaaS Control Center, Incident Timeline |
| Java | Spring + Thymeleaf | Fragment-based layout + strict forms/tables | Data Command Hub |
| .NET | Razor/Blazor | Razor shell + typed interactive islands | Data Command Hub |
| Go | templ | Fast server-render + websocket blocks | Incident Timeline |
| C | ncurses | Token-driven TUI blocks | Executive Analytics Briefing |
| C++ | Qt / ImGui | Native widgets with token bridge | Workflow Kanban Studio |
| Mojo | Experimental TUI | Terminal-first + markdown export | Executive Analytics Briefing |

## Pattern Stack to Build First

1. SaaS Control Center
2. Data Command Hub
3. Operations Incident Timeline

## Quality Gate Before Shipping Any Adapter

1. Aesthetic audit score >= 8/10 using `runtime-aesthetic-audit.md`.
2. Keyboard navigation on all primary actions.
3. Empty state, loading state, and error state designed (not default browser/system style).
4. Time to first meaningful screen < 2 seconds on normal developer hardware.

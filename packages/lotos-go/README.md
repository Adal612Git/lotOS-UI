# @lotosui/go

Server-side Go adapter for LotOS UI contracts using `html/template`.

This package provides:

- Shared template definitions for core LotOS UI primitives
- Contract metadata for runtime-side validation
- A lightweight prop sanitizer
- A dashboard example that renders the adapter in a Go web app

Implemented primitives:

- `button`
- `badge`
- `card`
- `input`
- `form`
- `modal`
- `table`

## Usage

1. Parse `templates/components.tmpl` into your template set.
2. Use `ValidateProps` before executing a component template with dynamic data.
3. Render the named templates in your handlers.

```go
tmpl := template.Must(template.ParseFiles("templates/components.tmpl"))
safe := lotosgo.ValidateProps("button", map[string]any{"label": "Deploy", "variant": "outline"})
tmpl.ExecuteTemplate(w, "lotos_button", safe)
```

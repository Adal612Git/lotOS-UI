# Changelog

All notable changes to `@lotos/claude-arm` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-02-23

### 🎉 Initial Release

#### Added — Primitive Components (Sprint 1)
- `Button` — 5 variants (primary, secondary, ghost, outline, destructive), 3 sizes, loading state, polymorphic `as` prop, `aria-busy`
- `Badge` — 6 color variants (default, success, warning, error, info, muted)
- `Card` — Container with optional header, body, and footer slots, clickable variant
- `Input` — Text input with label, error state (`aria-invalid`), helper text, prefix/suffix icons, `aria-describedby`
- `Modal` — Focus trap with `role="dialog"` and `aria-modal`, Escape key dismiss, backdrop click dismiss

#### Added — Form Control Components (Sprint 3)
- `Select` — Native select with custom styling, placeholder, error/helper text, `aria-invalid`
- `Checkbox` — Indeterminate state, custom visual, label association, error/description, Sentinel warning
- `Switch` — `role="switch"`, CSS-animated track + thumb, label, description
- `Textarea` — Configurable resize, live character counter (`aria-live="polite"`), `maxChars`, error/helper
- `Tooltip` — `role="tooltip"`, `aria-describedby` injected on trigger, hover + focus, delay, 4 placements

#### Added — Compound Components (Sprint 4)
- `Dropdown` — `role="menu"/"menuitem"`, full keyboard navigation (Arrows/Home/End/Escape), `aria-haspopup`, `aria-expanded`, separators, destructive variant, icon slots, 4 placements
- `RadioGroup` — `fieldset/legend` pattern, arrow key navigation, controlled/uncontrolled, description per option, error/helper, horizontal/vertical orientation
- `Combobox` — `role="combobox/listbox/option"`, `aria-activedescendant`, `aria-autocomplete`, live filtering, full keyboard nav, checkmark on selected, empty state

#### Added — Layout Components (Sprint 5)
- `Tabs` — `role="tablist/tab/tabpanel"`, `aria-selected`, `aria-controls`, `aria-labelledby`, arrow key navigation (horizontal/vertical), Home/End, 3 variants (underline, pills, card), lazy panel rendering, icon support
- `Accordion` — `aria-expanded`, `aria-controls`, `role="region"`, `aria-labelledby`, single/multiple mode, controlled/uncontrolled, 3 variants, animated chevron

#### Infrastructure
- **158 unit tests** with Vitest + React Testing Library — 100% passing
- **MCP Server** with Sentinel — anti-hallucination rules for AI code generation  
- Full TypeScript typings exported
- `sideEffects: false` for tree-shaking
- Docs site built with Fumadocs — 21 SSG pages

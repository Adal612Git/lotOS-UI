# @lotosui/claude-arm

> **LotOS UI** — Accessible React component library built for AI-first development.  
> 15 components · WCAG 2.2 AAA · MCP Server integrated · TypeScript · React 19

[![npm version](https://badge.fury.io/js/%40lotosui%2Fclaude-arm.svg)](https://www.npmjs.com/package/@lotosui/claude-arm)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Features

- ✅ **15 React components** — Button, Badge, Card, Input, Modal, Select, Checkbox, Switch, Textarea, Tooltip, Dropdown, RadioGroup, Combobox, Tabs, Accordion
- ♿ **WCAG 2.2 AAA accessibility** — proper ARIA roles, keyboard navigation, focus management
- 🤖 **MCP Server integration** — anti-hallucination rules for AI code generation
- 🧪 **158 unit tests** — 100% pass rate with React Testing Library
- 📦 **Tree-shakeable** — `sideEffects: false`, ESM only
- 🔷 **TypeScript first** — full type definitions included

## Installation

```bash
npm install @lotosui/claude-arm
# peer dependencies
npm install react react-dom
```

## Usage

```tsx
import { Button, Input, Modal, Tabs } from '@lotosui/claude-arm'

function App() {
  return (
    <Button variant="primary" size="md">
      Get Started
    </Button>
  )
}
```

## Components

### Primitives
| Component | Description |
|---|---|
| `Button` | 5 variants, 3 sizes, loading state, polymorphic `as` prop |
| `Badge` | Status/label pill with 6 color variants |
| `Card` | Container with header, body, footer slots |
| `Input` | Text input with label, error, helper, prefix/suffix |
| `Modal` | Dialog with focus trap, `role="dialog"`, `aria-modal` |

### Form Controls
| Component | Description |
|---|---|
| `Select` | Native select with custom styling, placeholder, error |
| `Checkbox` | Indeterminate state support, custom visual |
| `Switch` | `role="switch"`, animated track + thumb |
| `Textarea` | Live character counter with `aria-live`, resize config |
| `Tooltip` | `role="tooltip"`, `aria-describedby` injection, 4 placements |

### Compound
| Component | Description |
|---|---|
| `Dropdown` | `role="menu"`, full keyboard nav, separators, destructive actions |
| `RadioGroup` | `fieldset/legend` pattern, arrow key navigation |
| `Combobox` | Live filtering, `aria-activedescendant`, keyboard nav |
| `Tabs` | `role="tablist"`, arrow keys, 3 variants (underline/pills/card) |
| `Accordion` | Single/multiple mode, `aria-expanded`, animated chevron |

## Accessibility

Every component follows the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/). Key features:

- Proper semantic roles (`role="dialog"`, `role="menu"`, `role="tablist"`, etc.)
- Keyboard navigation with focus trapping where required
- `aria-invalid`, `aria-describedby`, `aria-required` on form controls
- Error messages with `role="alert"` for screen reader announcement
- **Sentinel** — development warnings when accessibility props are missing

## Documentation

Full documentation: **[lotos-ui.vercel.app](https://lotos-ui.vercel.app)**

## License

MIT © [Lotos Technologies](https://lotos.dev)

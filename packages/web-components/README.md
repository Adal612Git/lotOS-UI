# @lotosui/web-components

Framework-agnostic custom elements for LotOS UI.

Current status: prototype package with two production-style components:

- `<lotos-button>`
- `<lotos-input>`

## Quick start

```ts
import { registerLotosWebComponents } from '@lotosui/web-components';

registerLotosWebComponents();
```

```html
<lotos-button variant="primary" size="md">Get Started</lotos-button>
<lotos-button variant="outline" size="sm">Learn More</lotos-button>
<lotos-input type="email" label="Work Email" placeholder="you@company.com"></lotos-input>
```

## Attributes (`lotos-button`)

- `variant`: `primary | secondary | ghost | destructive | outline`
- `size`: `sm | md | lg`
- `disabled`: boolean
- `full-width`: boolean
- `type`: `button | submit | reset`

## Attributes (`lotos-input`)

- `type`: `text | email | password | number | tel | url | search | date | time`
- `label`: string
- `placeholder`: string
- `value`: string
- `helper-text`: string
- `error`: string
- `size`: `sm | md | lg`
- `required`: boolean
- `disabled`: boolean
- `readonly`: boolean
- `name`: string
- `id`: string

## Notes

- Uses `@lotosui/core` design tokens.
- This package is the bridge toward multi-framework adapters (Laravel, Django, etc.).

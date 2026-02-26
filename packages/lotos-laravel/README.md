# lotos-laravel (Skeleton)

Laravel adapter skeleton for LotOS UI.

Status: pre-release bridge package to prepare the Laravel integration track while React remains the production runtime.

## Goals

1. Provide a clean package entry for Laravel users.
2. Define where Blade helpers and UI wrappers will live.
3. Keep architecture aligned with `@lotosui/core` and MCP contracts.

## Planned features

- Blade components mapped to LotOS UI contracts.
- Optional web-component mode for framework-agnostic rendering.
- MCP-assisted snippet generation for Blade.
- Starter dashboard template.

## Current contents

- `composer.json`
- `src/LotosUiServiceProvider.php`
- `config/lotos-ui.php`
- `resources/views/components/lotos-button.blade.php`
- `resources/views/components/lotos-input.blade.php`
- `examples/dashboard.blade.php`

## Current usage (skeleton)

```blade
<x-lotos-ui::lotos-button variant="primary" size="md">
    Save changes
</x-lotos-ui::lotos-button>

<x-lotos-ui::lotos-input
    type="email"
    label="Work email"
    placeholder="you@company.com"
    required
/>
```

`variant`: `primary | secondary | destructive | ghost`  
`size`: `sm | md | lg`

For input:

`type`: `text | email | password | number | tel | url | search | date | time`  
`size`: `sm | md | lg`

## Install (future)

```bash
composer require lotos/lotos-ui-laravel
php artisan vendor:publish --tag=lotos-ui-config
php artisan vendor:publish --tag=lotos-ui-views
```

## Notes

- This package is intentionally a skeleton.
- First production milestone: one real dashboard flow using `lotos-button` and tokenized styles.

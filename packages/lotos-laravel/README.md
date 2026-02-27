# lotos-laravel

Laravel Blade adapter for LotOS UI.

Status: adapter package with real Blade wrappers and a PHP contract mirror for runtime validation.

## What exists now

- Blade components for:
  - `lotos-button`
  - `lotos-badge`
  - `lotos-card`
  - `lotos-input`
  - `lotos-form`
  - `lotos-modal`
  - `lotos-table`
  - `lotos-theme`
- PHP-side contract registry mirroring the shared component contracts
- Basic prop validation utility for server-rendered integrations
- Dashboard demo showing Button, Card, Form, Table, and Modal together

## Install

```bash
composer require lotos/lotos-ui-laravel
php artisan vendor:publish --tag=lotos-ui-config
php artisan vendor:publish --tag=lotos-ui-views
```

## Usage

```blade
<x-lotos-ui::lotos-theme />

<x-lotos-ui::lotos-card padding="lg" shadow="md">
    <x-lotos-ui::lotos-badge variant="info">Laravel</x-lotos-ui::lotos-badge>
    <h2>Operations Console</h2>

    <x-lotos-ui::lotos-form
        title="Create deployment"
        description="Server-rendered Blade UI with LotOS contracts."
    >
        <x-lotos-ui::lotos-input label="Service" name="service" required />
        <x-lotos-ui::lotos-input label="Owner" name="owner" />
    </x-lotos-ui::lotos-form>
</x-lotos-ui::lotos-card>
```

## Contract validation

```php
use Lotos\LotOSUi\Support\ComponentPropValidator;

$issues = ComponentPropValidator::validate('button', [
    'variant' => 'primary',
    'size' => 'md',
    'loading' => false,
]);
```

This package does not execute the Zod schemas directly. It publishes a PHP-side contract mirror so Laravel can enforce the same intent as the shared contracts.

## Current scope

- Production-usable for Blade-rendered dashboards and internal tools
- Not yet a Livewire/Inertia-specific adapter
- Not yet parity with the React arm on total component count

# lotos-django

Django adapter for LotOS UI.

Status: runtime-usable adapter with template tags, shared contract mirror, and a dashboard demo.

## What exists now

- `lotos_component` template tag for `button`, `badge`, `card`, `input`, `form`, `modal`, `table`
- Python-side contract registry and prop validator
- Reusable theme partial
- Example dashboard template

## Install

```bash
pip install lotos-django
```

Add `lotos_django` to `INSTALLED_APPS`.

## Usage

```django
{% load lotos_ui %}
{% lotos_component "button" text="Deploy" variant="primary" %}
```

## Current scope

- Production-usable for server-rendered Django dashboards/internal tools
- Not yet a class-based component system
- Not yet integrated with Django forms API directly

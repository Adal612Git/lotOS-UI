# lotos-flask

Flask adapter for LotOS UI.

Status: runtime-usable adapter with Jinja macros, shared contract mirror, and a dashboard demo.

## What exists now

- Jinja macros for `button`, `badge`, `card`, `input`, `form`, `modal`, `table`
- Python-side contract registry and prop validator
- `register_lotos_ui(app)` helper for Jinja globals
- Example dashboard template

## Install

```bash
pip install lotos-flask
```

## Usage

```python
from flask import Flask
from lotos_flask import register_lotos_ui

app = Flask(__name__)
register_lotos_ui(app)
```

from __future__ import annotations

from flask import Blueprint

from .contracts import COMPONENT_CONTRACTS
from .validator import validate_props

_blueprint = Blueprint("lotos_ui", __name__, template_folder="templates")


def register_lotos_ui(app) -> None:
    if "lotos_ui" not in app.blueprints:
        app.register_blueprint(_blueprint)
    app.jinja_env.globals["lotos_contracts"] = COMPONENT_CONTRACTS
    app.jinja_env.filters["lotos_validate"] = lambda pair: validate_props(pair[0], pair[1])


__all__ = ["COMPONENT_CONTRACTS", "validate_props", "register_lotos_ui"]

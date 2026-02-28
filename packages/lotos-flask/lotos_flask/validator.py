from __future__ import annotations

from .contracts import COMPONENT_CONTRACTS


def validate_props(component: str, props: dict) -> list[dict[str, str]]:
    contract = COMPONENT_CONTRACTS.get(component)
    if not contract:
        return [{"code": "unknown-component", "message": f"Unknown LotOS component contract: {component}"}]

    issues: list[dict[str, str]] = []

    for required_key in contract.get("required", []):
        if props.get(required_key) in (None, ""):
            issues.append({"code": "missing-required-prop", "message": f"Missing required prop: {required_key}"})

    for prop, allowed in contract.items():
        if prop in {"required", "booleans"}:
            continue
        if prop not in props or props[prop] is None:
            continue
        if props[prop] not in allowed:
            issues.append({"code": "invalid-enum-value", "message": f"Invalid value for {prop}. Allowed: {', '.join(allowed)}"})

    return issues

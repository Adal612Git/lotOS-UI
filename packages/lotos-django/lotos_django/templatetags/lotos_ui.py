from django import template
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe

from lotos_django.validator import validate_props

register = template.Library()

_COMPONENT_TEMPLATE = {
    "button": "lotos_ui/button.html",
    "badge": "lotos_ui/badge.html",
    "card": "lotos_ui/card.html",
    "input": "lotos_ui/input.html",
    "form": "lotos_ui/form.html",
    "modal": "lotos_ui/modal.html",
    "table": "lotos_ui/table.html",
}


@register.filter
def get_item(mapping, key):
    if isinstance(mapping, dict):
        return mapping.get(key, "")
    return ""


@register.simple_tag
def lotos_component(component: str, **kwargs) -> str:
    issues = validate_props(component, kwargs)
    if issues:
        kwargs["validation_issues"] = issues

    template_name = _COMPONENT_TEMPLATE.get(component)
    if not template_name:
        return ""

    return mark_safe(render_to_string(template_name, kwargs))


@register.inclusion_tag("lotos_ui/theme.html")
def lotos_theme() -> dict:
    return {}

from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def dashboard(request: HttpRequest) -> HttpResponse:
    context = {
        "form_body": """
<label class=\"lotos-input-field\"><span class=\"lotos-input-field__label\">Service</span><input class=\"lotos-input\" type=\"text\" placeholder=\"billing-api\"></label>
<label class=\"lotos-input-field\"><span class=\"lotos-input-field__label\">Owner</span><input class=\"lotos-input\" type=\"email\" placeholder=\"ops@company.com\"></label>
""",
        "modal_body": """
<div class=\"lotos-card lotos-card--p-md lotos-card--border-strong\"><strong>billing-api</strong><p style=\"margin:6px 0 0;color:var(--lotos-subtext);\">Owner: ops@company.com</p></div>
""",
        "modal_footer": """
<button class=\"lotos-btn lotos-btn--ghost\" type=\"button\">Back</button>
<button class=\"lotos-btn lotos-btn--primary\" type=\"button\">Confirm</button>
""",
        "queue_columns": [
            {"key": "job", "label": "Job"},
            {"key": "state", "label": "State"},
        ],
        "queue_rows": [
            {"job": "Deploy billing-api", "state": "Queued"},
            {"job": "Rotate secrets", "state": "Pending"},
        ],
    }
    return render(request, "dashboard.html", context)

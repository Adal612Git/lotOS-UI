<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LotOS UI Laravel Demo</title>
    <style>
        :root {
            --lotos-bg: radial-gradient(circle at 15% 10%, #13203a, #081225 55%, #050a14 100%);
            --lotos-surface: rgba(12, 22, 41, 0.74);
            --lotos-border: rgba(141, 199, 255, 0.28);
            --lotos-text: #e6f3ff;
            --lotos-subtext: rgba(206, 230, 252, 0.72);
            --lotos-primary-a: #43c1ff;
            --lotos-primary-b: #3f7aff;
            --lotos-danger-a: #ff6969;
            --lotos-danger-b: #ff3e7f;
        }

        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            font-family: "Segoe UI", "Inter", sans-serif;
            background: var(--lotos-bg);
            color: var(--lotos-text);
            display: grid;
            place-items: center;
            padding: 24px;
        }

        .panel {
            width: min(900px, 100%);
            background: var(--lotos-surface);
            border: 1px solid var(--lotos-border);
            border-radius: 20px;
            padding: 28px;
            backdrop-filter: blur(10px);
        }

        h1 { margin: 0 0 8px; font-size: clamp(1.5rem, 3.4vw, 2.4rem); }
        p { margin: 0 0 22px; color: var(--lotos-subtext); line-height: 1.5; }
        .actions { display: flex; flex-wrap: wrap; gap: 12px; }
        .form-grid { margin-top: 22px; display: grid; gap: 14px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }

        .lotos-btn {
            border: 0;
            border-radius: 12px;
            color: #f6fbff;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-weight: 600;
            letter-spacing: 0.02em;
            transition: transform 140ms ease, filter 140ms ease;
        }
        .lotos-btn:hover { filter: brightness(1.05); transform: translateY(-1px); }
        .lotos-btn:disabled { opacity: 0.75; cursor: not-allowed; transform: none; }
        .lotos-btn--sm { min-height: 36px; padding: 0 14px; font-size: 0.9rem; }
        .lotos-btn--md { min-height: 44px; padding: 0 18px; font-size: 0.95rem; }
        .lotos-btn--lg { min-height: 50px; padding: 0 22px; font-size: 1rem; }
        .lotos-btn--full { width: 100%; }
        .lotos-btn--primary { background: linear-gradient(120deg, var(--lotos-primary-a), var(--lotos-primary-b)); }
        .lotos-btn--secondary { background: rgba(167, 211, 255, 0.16); border: 1px solid rgba(167, 211, 255, 0.3); }
        .lotos-btn--destructive { background: linear-gradient(120deg, var(--lotos-danger-a), var(--lotos-danger-b)); }
        .lotos-btn--ghost { background: transparent; border: 1px solid rgba(167, 211, 255, 0.3); color: var(--lotos-subtext); }
        .lotos-btn__spinner {
            width: 14px;
            height: 14px;
            border-radius: 999px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: #fff;
            animation: spin 0.9s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .lotos-input-field { display: flex; flex-direction: column; gap: 6px; }
        .lotos-input-field__label { color: var(--lotos-subtext); font-size: 0.84rem; font-weight: 600; }
        .lotos-input-field__helper { color: var(--lotos-subtext); font-size: 0.76rem; }
        .lotos-input-field__helper--error { color: #ff9dad; }
        .lotos-input {
            width: 100%;
            border-radius: 12px;
            border: 1px solid rgba(167, 211, 255, 0.28);
            color: #eff8ff;
            background: rgba(4, 11, 23, 0.62);
            transition: border-color 120ms ease, box-shadow 120ms ease;
            outline: none;
        }
        .lotos-input:focus {
            border-color: rgba(73, 186, 255, 0.88);
            box-shadow: 0 0 0 3px rgba(67, 193, 255, 0.18);
        }
        .lotos-input--sm { min-height: 36px; padding: 0 11px; font-size: 0.88rem; }
        .lotos-input--md { min-height: 42px; padding: 0 13px; font-size: 0.95rem; }
        .lotos-input--lg { min-height: 48px; padding: 0 14px; font-size: 1rem; }
        .lotos-input--error { border-color: rgba(255, 105, 105, 0.82); }
    </style>
</head>
<body>
<main class="panel">
    <h1>LotOS UI for Laravel</h1>
    <p>
        Demo skeleton using package anonymous components.
        Goal: keep visual parity with React while adapters scale to backend ecosystems.
    </p>

    <div class="actions">
        <x-lotos-ui::lotos-button variant="primary">Create Invoice</x-lotos-ui::lotos-button>
        <x-lotos-ui::lotos-button variant="secondary">Export Data</x-lotos-ui::lotos-button>
        <x-lotos-ui::lotos-button variant="destructive" size="sm">Delete Team</x-lotos-ui::lotos-button>
        <x-lotos-ui::lotos-button variant="ghost" loading>Syncing...</x-lotos-ui::lotos-button>
    </div>

    <section class="form-grid">
        <x-lotos-ui::lotos-input
            type="email"
            label="Work email"
            placeholder="you@company.com"
            name="email"
            required
        />
        <x-lotos-ui::lotos-input
            type="password"
            label="Password"
            placeholder="At least 8 characters"
            helper-text="Use one symbol and one number."
            name="password"
        />
        <x-lotos-ui::lotos-input
            type="text"
            label="API Key"
            value="invalid_key"
            error="The key format is invalid."
            name="api_key"
        />
    </section>
</main>
</body>
</html>

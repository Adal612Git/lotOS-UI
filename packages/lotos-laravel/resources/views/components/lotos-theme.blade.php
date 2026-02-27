<style>
    :root {
        --lotos-bg: radial-gradient(circle at 15% 10%, #13203a, #081225 55%, #050a14 100%);
        --lotos-surface: rgba(12, 22, 41, 0.74);
        --lotos-surface-strong: rgba(8, 16, 31, 0.86);
        --lotos-border: rgba(141, 199, 255, 0.28);
        --lotos-border-strong: rgba(141, 199, 255, 0.4);
        --lotos-text: #e6f3ff;
        --lotos-subtext: rgba(206, 230, 252, 0.72);
        --lotos-primary-a: #43c1ff;
        --lotos-primary-b: #3f7aff;
        --lotos-danger-a: #ff6969;
        --lotos-danger-b: #ff3e7f;
        --lotos-radius-sm: 12px;
        --lotos-radius-md: 16px;
        --lotos-radius-lg: 20px;
        --lotos-shadow-sm: 0 10px 24px rgba(2, 8, 23, 0.18);
        --lotos-shadow-md: 0 16px 34px rgba(2, 8, 23, 0.24);
        --lotos-shadow-lg: 0 24px 50px rgba(2, 8, 23, 0.34);
    }

    .lotos-btn {
        border: 0;
        border-radius: var(--lotos-radius-sm);
        color: #f6fbff;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-weight: 700;
        letter-spacing: 0.02em;
        transition: transform 140ms ease, filter 140ms ease, border-color 140ms ease;
        text-decoration: none;
    }
    .lotos-btn:hover { filter: brightness(1.05); transform: translateY(-1px); }
    .lotos-btn:disabled { opacity: 0.75; cursor: not-allowed; transform: none; }
    .lotos-btn--xs { min-height: 32px; padding: 0 12px; font-size: 0.82rem; }
    .lotos-btn--sm { min-height: 36px; padding: 0 14px; font-size: 0.9rem; }
    .lotos-btn--md { min-height: 44px; padding: 0 18px; font-size: 0.95rem; }
    .lotos-btn--lg { min-height: 50px; padding: 0 22px; font-size: 1rem; }
    .lotos-btn--xl { min-height: 56px; padding: 0 26px; font-size: 1.04rem; }
    .lotos-btn--full { width: 100%; }
    .lotos-btn--primary { background: linear-gradient(120deg, var(--lotos-primary-a), var(--lotos-primary-b)); }
    .lotos-btn--secondary { background: rgba(167, 211, 255, 0.16); border: 1px solid rgba(167, 211, 255, 0.3); }
    .lotos-btn--destructive { background: linear-gradient(120deg, var(--lotos-danger-a), var(--lotos-danger-b)); }
    .lotos-btn--ghost { background: transparent; border: 1px solid rgba(167, 211, 255, 0.3); color: var(--lotos-subtext); }
    .lotos-btn--outline { background: transparent; border: 1px solid var(--lotos-border-strong); color: var(--lotos-text); }
    .lotos-btn--link { background: transparent; color: #9dd7ff; padding-left: 0; padding-right: 0; }
    .lotos-btn__spinner {
        width: 14px;
        height: 14px;
        border-radius: 999px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        animation: lotos-spin 0.9s linear infinite;
    }

    .lotos-card {
        border-radius: var(--lotos-radius-md);
        background: var(--lotos-surface);
        color: var(--lotos-text);
        backdrop-filter: blur(10px);
        transition: transform 140ms ease, box-shadow 140ms ease;
    }
    .lotos-card--p-none { padding: 0; }
    .lotos-card--p-sm { padding: 12px; }
    .lotos-card--p-md { padding: 16px; }
    .lotos-card--p-lg { padding: 22px; }
    .lotos-card--shadow-none { box-shadow: none; }
    .lotos-card--shadow-sm { box-shadow: var(--lotos-shadow-sm); }
    .lotos-card--shadow-md { box-shadow: var(--lotos-shadow-md); }
    .lotos-card--shadow-lg { box-shadow: var(--lotos-shadow-lg); }
    .lotos-card--border-none { border: 0; }
    .lotos-card--border-default { border: 1px solid var(--lotos-border); }
    .lotos-card--border-strong { border: 1px solid var(--lotos-border-strong); }
    .lotos-card--glass { background: rgba(255, 255, 255, 0.08); }
    .lotos-card--interactive:hover { transform: translateY(-2px); box-shadow: var(--lotos-shadow-lg); }

    .lotos-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        border: 1px solid transparent;
    }
    .lotos-badge--sm { min-height: 20px; padding: 0 8px; font-size: 0.66rem; }
    .lotos-badge--md { min-height: 24px; padding: 0 10px; font-size: 0.72rem; }
    .lotos-badge--lg { min-height: 28px; padding: 0 12px; font-size: 0.78rem; }
    .lotos-badge--dot { width: 12px; height: 12px; min-height: 12px; padding: 0; }
    .lotos-badge--default { background: rgba(191, 219, 254, 0.14); border-color: rgba(191, 219, 254, 0.24); color: var(--lotos-text); }
    .lotos-badge--success { background: rgba(74, 222, 128, 0.14); border-color: rgba(74, 222, 128, 0.28); color: #9cf6b8; }
    .lotos-badge--warning { background: rgba(251, 191, 36, 0.14); border-color: rgba(251, 191, 36, 0.26); color: #ffe08f; }
    .lotos-badge--error { background: rgba(255, 105, 105, 0.14); border-color: rgba(255, 105, 105, 0.28); color: #ffb3c1; }
    .lotos-badge--info { background: rgba(67, 193, 255, 0.14); border-color: rgba(67, 193, 255, 0.26); color: #b4e6ff; }
    .lotos-badge--outline { background: transparent; border-color: var(--lotos-border); color: var(--lotos-subtext); }

    .lotos-input-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }
    .lotos-input-field__label {
        color: var(--lotos-subtext);
        font-size: 0.84rem;
        font-weight: 600;
    }
    .lotos-input-field__helper {
        color: var(--lotos-subtext);
        font-size: 0.76rem;
    }
    .lotos-input-field__helper--error {
        color: #ff9dad;
    }
    .lotos-input {
        width: 100%;
        border-radius: var(--lotos-radius-sm);
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

    .lotos-form {
        display: grid;
        gap: 16px;
    }
    .lotos-form--compact { gap: 12px; }
    .lotos-form--comfortable { gap: 18px; }
    .lotos-form--spacious { gap: 22px; }
    .lotos-form__grid {
        display: grid;
        gap: 14px;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .lotos-form__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: flex-end;
    }

    .lotos-modal {
        border-radius: var(--lotos-radius-lg);
        border: 1px solid var(--lotos-border);
        background: var(--lotos-surface-strong);
        color: var(--lotos-text);
        box-shadow: var(--lotos-shadow-lg);
        padding: 18px;
        width: min(720px, 100%);
    }
    .lotos-modal__shell {
        position: relative;
        isolation: isolate;
    }
    .lotos-modal__backdrop {
        position: absolute;
        inset: -14px;
        border-radius: calc(var(--lotos-radius-lg) + 10px);
        background: rgba(2, 8, 23, 0.48);
        z-index: -1;
    }
    .lotos-modal__header {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 14px;
    }
    .lotos-modal__title { margin: 0; font-size: 1.1rem; }
    .lotos-modal__description { margin: 6px 0 0; color: var(--lotos-subtext); line-height: 1.55; }
    .lotos-modal__body { display: grid; gap: 14px; }
    .lotos-modal__footer {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 16px;
    }

    .lotos-table-shell {
        display: grid;
        gap: 12px;
    }
    .lotos-table-shell__toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
    }
    .lotos-table-shell__meta {
        margin: 0;
        color: var(--lotos-subtext);
        font-size: 0.84rem;
    }
    .lotos-table {
        width: 100%;
        border-collapse: collapse;
        overflow: hidden;
        border-radius: var(--lotos-radius-md);
        border: 1px solid var(--lotos-border);
    }
    .lotos-table th,
    .lotos-table td {
        padding: 12px 14px;
        text-align: left;
        border-bottom: 1px solid rgba(141, 199, 255, 0.12);
    }
    .lotos-table th {
        color: var(--lotos-subtext);
        font-size: 0.78rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        background: rgba(255, 255, 255, 0.04);
    }
    .lotos-table tbody tr:hover {
        background: rgba(255, 255, 255, 0.03);
    }

    @keyframes lotos-spin { to { transform: rotate(360deg); } }
</style>

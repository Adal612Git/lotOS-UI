<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>LotOS UI Laravel Demo</title>
    <x-lotos-ui::lotos-theme />
</head>
<body style="margin:0; min-height:100vh; font-family:'Segoe UI','Inter',sans-serif; background:var(--lotos-bg); color:var(--lotos-text); padding:24px;">
<main style="max-width:1120px; margin:0 auto; display:grid; gap:18px;">
    <x-lotos-ui::lotos-card padding="lg" shadow="lg" border="strong">
        <div style="display:flex; justify-content:space-between; gap:16px; align-items:start; flex-wrap:wrap;">
            <div>
                <x-lotos-ui::lotos-badge variant="info" size="sm">Laravel Adapter</x-lotos-ui::lotos-badge>
                <h1 style="margin:12px 0 8px; font-size:clamp(1.7rem, 4vw, 2.7rem);">LotOS UI for Laravel</h1>
                <p style="margin:0; color:var(--lotos-subtext); max-width:720px; line-height:1.6;">
                    Real Blade wrappers using the shared contract language: button, card, form,
                    modal, and table are available inside a Laravel-first adapter package.
                </p>
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <x-lotos-ui::lotos-button variant="primary">Create Invoice</x-lotos-ui::lotos-button>
                <x-lotos-ui::lotos-button variant="outline">Inspect</x-lotos-ui::lotos-button>
            </div>
        </div>
    </x-lotos-ui::lotos-card>

    <section style="display:grid; grid-template-columns: 1.1fr .9fr; gap:18px;">
        <x-lotos-ui::lotos-card padding="lg" shadow="md">
            <x-lotos-ui::lotos-form
                title="Launch deployment"
                description="A server-rendered workflow with the same contract intent used by the React arm."
            >
                <x-lotos-ui::lotos-input type="text" label="Service" placeholder="billing-api" name="service" required />
                <x-lotos-ui::lotos-input type="email" label="Owner" placeholder="ops@company.com" name="owner" required />
                <x-lotos-ui::lotos-input type="text" label="API Key" value="invalid_key" error="The key format is invalid." name="api_key" />
                <x-lotos-ui::lotos-input type="text" label="Region" placeholder="us-east-1" name="region" />
            </x-lotos-ui::lotos-form>
            <div class="lotos-form__actions" style="margin-top:16px;">
                <x-lotos-ui::lotos-button variant="ghost" type="button">Cancel</x-lotos-ui::lotos-button>
                <x-lotos-ui::lotos-button variant="primary" type="button">Deploy now</x-lotos-ui::lotos-button>
            </div>
        </x-lotos-ui::lotos-card>

        <x-lotos-ui::lotos-card padding="lg" shadow="md" glass>
            <x-lotos-ui::lotos-table
                caption="Operations queue"
                meta="Shared visual grammar applied to backend workflows"
                :columns="[
                    ['key' => 'job', 'label' => 'Job'],
                    ['key' => 'owner', 'label' => 'Owner'],
                    ['key' => 'state', 'label' => 'State']
                ]"
                :rows="[
                    ['job' => 'Deploy billing-api', 'owner' => 'Rick', 'state' => 'Queued'],
                    ['job' => 'Rotate secrets', 'owner' => 'Ops', 'state' => 'Pending'],
                    ['job' => 'Export ledger', 'owner' => 'Finance', 'state' => 'Ready']
                ]"
            />
        </x-lotos-ui::lotos-card>
    </section>

    <x-lotos-ui::lotos-modal
        title="Deployment review"
        description="Blade can present modal-grade review surfaces before the final server action."
    >
        <x-lotos-ui::lotos-card padding="md" shadow="none" border="strong" glass>
            <div style="display:flex; justify-content:space-between; gap:14px; flex-wrap:wrap; align-items:center;">
                <div>
                    <strong>billing-api</strong>
                    <p style="margin:6px 0 0; color:var(--lotos-subtext);">Owner: ops@company.com | Region: us-east-1</p>
                </div>
                <x-lotos-ui::lotos-badge variant="warning">Pending approval</x-lotos-ui::lotos-badge>
            </div>
        </x-lotos-ui::lotos-card>
        <div class="lotos-modal__footer">
            <x-lotos-ui::lotos-button variant="ghost" type="button">Back</x-lotos-ui::lotos-button>
            <x-lotos-ui::lotos-button variant="primary" type="button">Confirm</x-lotos-ui::lotos-button>
        </div>
    </x-lotos-ui::lotos-modal>
</main>
</body>
</html>

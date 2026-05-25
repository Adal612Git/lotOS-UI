# Lemon Fixtures

These fixtures are synthetic provider envelopes for local contract checks.
They are not copied from Lemon, Supabase, logs, or a real buyer session.

## Fake Variant Aliases

- `LEMON_SOLO_VARIANT_ID=var_fixture_solo`
- `LEMON_PRO_VARIANT_ID=var_fixture_pro`
- `LEMON_LAUNCH_VARIANT_ID=var_fixture_launch`

Tests generate or validate signatures locally. Do not commit real webhook
signatures, raw provider payloads, checkout URLs, full real emails, cookies,
authorization headers, or provider secrets.
All buyer emails must use the `example.test` domain.

`payment_recovered` uses the documented recovery-style provider event name that
must still be confirmed against the active Lemon dashboard before wide sales.
`subscription_resumed` remains covered as a local alias until staging confirms
the exact provider event name.

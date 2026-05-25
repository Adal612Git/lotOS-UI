# Lemon Fixtures

Sanitized local fixtures live in `apps/web/test/fixtures/lemon/`.

They cover:

- purchase success
- subscription created
- subscription updated active
- payment failed
- payment recovered
- subscription paused
- subscription resumed
- subscription cancelled
- subscription expired
- duplicate event
- invalid signature shape
- unknown event
- unmappable event
- missing email
- missing plan
- missing subscription id

All fixture emails use `example.test`, ids use `*_fixture_*`, and signatures are
test placeholders. Do not add real Lemon payloads, checkout URLs, webhook
signatures, cookies, auth headers, tokens, or real buyer emails.

Run:

```bash
pnpm run verify:webhook-contracts
```

These contracts prove local mapper expectations. They do not replace staging
validation against the current Lemon dashboard/docs.

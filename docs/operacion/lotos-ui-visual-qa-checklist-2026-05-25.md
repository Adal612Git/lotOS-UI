# LotOS UI Visual QA Checklist - 2026-05-25

## Objetivo

Validar visualmente el Release Candidate sin instalar una suite pesada. Esta checklist complementa `npm run verify:visual-smoke`; el script revisa archivos y marcadores, la inspeccion humana revisa pixeles.

## Rutas

- `/`
- `/free`
- `/claim`
- `/pricing`
- `/demo/student-control`
- `/demo/components`
- `/demo/operator`
- `/account/access`
- `/feedback`

## Viewports

- mobile: 390 x 844
- tablet: 768 x 1024
- desktop: 1440 x 900

## Checks

- primer pantallazo comunica la promesa sin scroll extra;
- CTA principal visible;
- no horizontal scroll;
- no error boundaries;
- no texto interno como TODO, FIXME o should feel;
- no select nativo en demos principales;
- botones y badges no se enciman;
- formularios de `/claim` y `/team-access/free-grants` tienen labels visibles;
- `/team-access/free-grants` no muestra codigos completos despues de recargar;
- screenshots no contienen codigos reales, emails reales ni datos privados.

## Resultado esperado

LotOS UI debe sentirse como producto vendible: Foundation clara, Pro deseable, Full protegido y promo grants operables sin exponer premium.

# LotOS UI Pro Packs

This directory contains the premium asset layer for LotOS UI.

These files are intentionally separated from the open package flow so they can be:

- zipped and delivered manually
- moved to a private Git repository
- mirrored into a private package registry later

Current pro packs:

- `admin-starter`
- `layouts`
- `industry-kits`
- `distribution`
- `previews`

## Technical Commercialization Layer

This directory now also contains:

- `distribution/free.manifest.json` for the open deliverable surface
- `distribution/pro.manifest.json` for paid assets and delivery rules
- `previews/*.html` visual previews you can show before purchase

To stage deliverable bundles locally, run:

`pnpm export:commercial`

This generates `.commercial-dist/free` and `.commercial-dist/pro` with manifests,
licenses, previews, and the selected file payloads ready to zip or move to a private channel.

## Distribution Note

The repository structure is now separated, but if this monorepo stays public, these assets remain visible.
For real paid distribution, move this directory to a private channel before release.

import { constants as fsConstants } from 'node:fs';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { resolveCurrentAccess } from '../../../../lib/access-resolver';
import { getProtectedAsset } from '../../../../lib/commercial-assets';

export const runtime = 'nodejs';

const contentTypes: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

async function resolveAssetPath(candidates: readonly string[]) {
  const rootCandidates = [
    process.cwd(),
    path.resolve(process.cwd(), '..'),
    path.resolve(process.cwd(), '..', '..'),
  ];

  for (const rootCandidate of rootCandidates) {
    for (const candidate of candidates) {
      const absolutePath = path.isAbsolute(candidate)
        ? path.normalize(candidate)
        : path.resolve(rootCandidate, candidate);

      try {
        await access(absolutePath, fsConstants.R_OK);
        return absolutePath;
      } catch {
        continue;
      }
    }
  }

  return null;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ asset: string }> }
) {
  const { asset: assetId } = await params;
  const asset = getProtectedAsset(assetId);

  if (!asset) {
    return Response.json({ ok: false, error: 'Unknown protected asset.' }, { status: 404 });
  }

  const accessDecision = await resolveCurrentAccess(asset.plan);

  if (!accessDecision.allowed || !accessDecision.capabilities.downloads) {
    return Response.json(
      { ok: false, error: 'Premium access required.' },
      { status: 403 }
    );
  }

  const assetPath = await resolveAssetPath(asset.sourceCandidates);

  if (!assetPath) {
    return Response.json(
      {
        ok: false,
        error:
          'Protected asset source not found. Stage the private bundle before exposing this download.',
      },
      { status: 404 }
    );
  }

  const body = await readFile(assetPath);
  const extension = path.extname(asset.fileName).toLowerCase();
  const contentType = contentTypes[extension] ?? 'application/octet-stream';
  const payload = new Uint8Array(body);

  return new Response(payload, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${asset.fileName}"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

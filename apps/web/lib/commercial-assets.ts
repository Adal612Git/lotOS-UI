import type { CommercialPlan } from './plans';
import { env } from './env';

export interface ProtectedAsset {
  id: string;
  name: string;
  description: string;
  plan: CommercialPlan;
  fileName: string;
  sourceCandidates: readonly string[];
}

export interface DesktopTemplateSummary {
  id: string;
  name: string;
  summary: string;
  plan: CommercialPlan;
}

function privateAssetCandidates(relativePath: string): readonly string[] {
  const customRoot = env.LOTOS_PRIVATE_ASSETS_ROOT?.trim();
  return customRoot
    ? [`${customRoot}/${relativePath}`]
    : [`packages/pro/.private-dist/${relativePath}`];
}

export const protectedAssets: readonly ProtectedAsset[] = [
  {
    id: 'sales-preview',
    name: 'Sales Preview',
    description: 'Commercial preview deck for Solo, Pro, and Full buyers.',
    plan: 'solo',
    fileName: 'sales-preview.html',
    sourceCandidates: privateAssetCandidates('previews/sales-preview.html'),
  },
  {
    id: 'license-matrix',
    name: 'License Matrix',
    description: 'Commercial comparison sheet for protected offers.',
    plan: 'solo',
    fileName: 'license-matrix.html',
    sourceCandidates: privateAssetCandidates('previews/license-matrix.html'),
  },
  {
    id: 'excel-preview',
    name: 'Excel Grid Preview',
    description: 'Preview-only HTML for spreadsheet modernization pitches.',
    plan: 'solo',
    fileName: 'excel-lotus-grid-preview.html',
    sourceCandidates: privateAssetCandidates('previews/excel-lotus-grid-preview.html'),
  },
  {
    id: 'openoffice-preview',
    name: 'OpenOffice Calc Preview',
    description: 'Preview-only HTML for OpenOffice and LibreOffice modernization pitches.',
    plan: 'solo',
    fileName: 'openoffice-calc-command-preview.html',
    sourceCandidates: privateAssetCandidates('previews/openoffice-calc-command-preview.html'),
  },
  {
    id: 'pro-release-manifest',
    name: 'Pro Release Manifest',
    description: 'Release manifest for the protected LotOS UI Pro payload.',
    plan: 'pro',
    fileName: 'release-manifest.json',
    sourceCandidates: privateAssetCandidates('release-manifest.json'),
  },
  {
    id: 'dashboard-shell',
    name: 'Dashboard Shell',
    description: 'Premium admin starter shell from the protected distribution.',
    plan: 'pro',
    fileName: 'dashboard-shell.html',
    sourceCandidates: privateAssetCandidates('admin-starter/dashboard-shell.html'),
  },
  {
    id: 'executive-briefing-layout',
    name: 'Executive Briefing Layout',
    description: 'Reusable executive reporting layout.',
    plan: 'pro',
    fileName: 'executive-briefing-layout.html',
    sourceCandidates: privateAssetCandidates('layouts/executive-briefing-layout.html'),
  },
  {
    id: 'operator-triad-layout',
    name: 'Operator Triad Layout',
    description: 'Reusable operator workflow layout.',
    plan: 'pro',
    fileName: 'operator-triad-layout.html',
    sourceCandidates: privateAssetCandidates('layouts/operator-triad-layout.html'),
  },
  {
    id: 'finance-ops-kit',
    name: 'Finance Ops Kit',
    description: 'Protected finance-focused industry kit.',
    plan: 'pro',
    fileName: 'finance-ops-kit.json',
    sourceCandidates: privateAssetCandidates('industry-kits/finance-ops-kit.json'),
  },
  {
    id: 'health-ops-kit',
    name: 'Health Ops Kit',
    description: 'Protected health-oriented industry kit.',
    plan: 'pro',
    fileName: 'health-ops-kit.json',
    sourceCandidates: privateAssetCandidates('industry-kits/health-ops-kit.json'),
  },
  {
    id: 'excel-grid-kit',
    name: 'Excel Grid Kit',
    description: 'Pro-only spreadsheet modernization kit for Excel.',
    plan: 'pro',
    fileName: 'excel-lotus-grid-kit.json',
    sourceCandidates: privateAssetCandidates('industry-kits/excel-lotus-grid-kit.json'),
  },
  {
    id: 'openoffice-grid-kit',
    name: 'OpenOffice Calc Command Kit',
    description: 'Pro-only spreadsheet modernization kit for OpenOffice.',
    plan: 'pro',
    fileName: 'openoffice-calc-command-kit.json',
    sourceCandidates: privateAssetCandidates('industry-kits/openoffice-calc-command-kit.json'),
  },
  {
    id: 'google-sheets-command-kit',
    name: 'Google Sheets Command Kit',
    description: 'Full-only premium spreadsheet shell for Google Sheets operator workflows.',
    plan: 'launch_pack',
    fileName: 'google-sheets-command-kit.json',
    sourceCandidates: privateAssetCandidates('launch-exclusive/google-sheets-command-kit.json'),
  },
  {
    id: 'm365-excel-web-kit',
    name: 'Microsoft 365 Excel Web Kit',
    description: 'Full-only browser-first Excel operator surface for Microsoft 365 teams.',
    plan: 'launch_pack',
    fileName: 'microsoft-365-excel-web-kit.json',
    sourceCandidates: privateAssetCandidates('launch-exclusive/microsoft-365-excel-web-kit.json'),
  },
  {
    id: 'outlook-approval-console',
    name: 'Outlook Approval Console',
    description: 'Full-only approval and triage surface built for email-driven workflows.',
    plan: 'launch_pack',
    fileName: 'outlook-approval-console.json',
    sourceCandidates: privateAssetCandidates('launch-exclusive/outlook-approval-console.json'),
  },
  {
    id: 'executive-boardroom-surface',
    name: 'Executive Boardroom Surface',
    description: 'Full-only executive command layer for board-ready decisions and reporting.',
    plan: 'launch_pack',
    fileName: 'executive-boardroom-surface.json',
    sourceCandidates: privateAssetCandidates('launch-exclusive/executive-boardroom-surface.json'),
  },
  {
    id: 'power-bi-executive-visual-pack',
    name: 'Power BI Executive Visual Pack',
    description: 'Full-only visual pack for premium executive analytics and reporting surfaces.',
    plan: 'launch_pack',
    fileName: 'power-bi-executive-visual-pack.json',
    sourceCandidates: privateAssetCandidates('launch-exclusive/power-bi-executive-visual-pack.json'),
  },
  {
    id: 'figma-token-sync-plugin',
    name: 'Figma Token Sync Plugin',
    description: 'Full-only design handoff bridge for premium theme and token alignment.',
    plan: 'launch_pack',
    fileName: 'figma-token-sync-plugin.json',
    sourceCandidates: privateAssetCandidates('launch-exclusive/figma-token-sync-plugin.json'),
  },
];

export const soloAssets = protectedAssets.filter((asset) => asset.plan === 'solo');

export const proAssets = protectedAssets.filter((asset) => asset.plan === 'pro');

export const launchAssets = protectedAssets.filter((asset) => asset.plan === 'launch_pack');

export const proDesktopTemplates: readonly DesktopTemplateSummary[] = [
  {
    id: 'executive-briefing-suite',
    name: 'Executive Briefing Suite',
    summary: 'Narrative analytics desktop for board-level reporting and strategic decisions.',
    plan: 'pro',
  },
  {
    id: 'finance-ops-atlas',
    name: 'Finance Ops Atlas',
    summary: 'Multi-panel financial cockpit with variance tracking and anomaly alerts.',
    plan: 'pro',
  },
  {
    id: 'industrial-command-surface',
    name: 'Industrial Command Surface',
    summary: 'Operational desktop for factory and field monitoring with strict escalation states.',
    plan: 'pro',
  },
  {
    id: 'ai-orchestrator-desk',
    name: 'AI Orchestrator Desk',
    summary: 'Agent orchestration desktop with queue states, trace cards, and run controls.',
    plan: 'pro',
  },
];

export function getProtectedAsset(assetId: string): ProtectedAsset | undefined {
  return protectedAssets.find((asset) => asset.id === assetId);
}

import type { CommercialPlan } from './plans';

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

export const protectedAssets: readonly ProtectedAsset[] = [
  {
    id: 'sales-preview',
    name: 'Sales Preview',
    description: 'Commercial preview deck for Solo, Pro, and Launch buyers.',
    plan: 'solo',
    fileName: 'sales-preview.html',
    sourceCandidates: [
      'packages/pro/.private-dist/previews/sales-preview.html',
      'packages/pro/previews/sales-preview.html',
    ],
  },
  {
    id: 'license-matrix',
    name: 'License Matrix',
    description: 'Commercial comparison sheet for protected offers.',
    plan: 'solo',
    fileName: 'license-matrix.html',
    sourceCandidates: [
      'packages/pro/.private-dist/previews/license-matrix.html',
      'packages/pro/previews/license-matrix.html',
    ],
  },
  {
    id: 'excel-preview',
    name: 'Excel Grid Preview',
    description: 'Preview-only HTML for spreadsheet modernization pitches.',
    plan: 'solo',
    fileName: 'excel-lotus-grid-preview.html',
    sourceCandidates: ['packages/pro/previews/excel-lotus-grid-preview.html'],
  },
  {
    id: 'openoffice-preview',
    name: 'OpenOffice Calc Preview',
    description: 'Preview-only HTML for OpenOffice and LibreOffice modernization pitches.',
    plan: 'solo',
    fileName: 'openoffice-calc-command-preview.html',
    sourceCandidates: ['packages/pro/previews/openoffice-calc-command-preview.html'],
  },
  {
    id: 'pro-release-manifest',
    name: 'Pro Release Manifest',
    description: 'Release manifest for the protected LotOS UI Pro payload.',
    plan: 'pro',
    fileName: 'release-manifest.json',
    sourceCandidates: ['packages/pro/.private-dist/release-manifest.json'],
  },
  {
    id: 'dashboard-shell',
    name: 'Dashboard Shell',
    description: 'Premium admin starter shell from the protected distribution.',
    plan: 'pro',
    fileName: 'dashboard-shell.html',
    sourceCandidates: [
      'packages/pro/.private-dist/admin-starter/dashboard-shell.html',
      'packages/pro/admin-starter/dashboard-shell.html',
    ],
  },
  {
    id: 'executive-briefing-layout',
    name: 'Executive Briefing Layout',
    description: 'Reusable executive reporting layout.',
    plan: 'pro',
    fileName: 'executive-briefing-layout.html',
    sourceCandidates: [
      'packages/pro/.private-dist/layouts/executive-briefing-layout.html',
      'packages/pro/layouts/executive-briefing-layout.html',
    ],
  },
  {
    id: 'operator-triad-layout',
    name: 'Operator Triad Layout',
    description: 'Reusable operator workflow layout.',
    plan: 'pro',
    fileName: 'operator-triad-layout.html',
    sourceCandidates: [
      'packages/pro/.private-dist/layouts/operator-triad-layout.html',
      'packages/pro/layouts/operator-triad-layout.html',
    ],
  },
  {
    id: 'finance-ops-kit',
    name: 'Finance Ops Kit',
    description: 'Protected finance-focused industry kit.',
    plan: 'pro',
    fileName: 'finance-ops-kit.json',
    sourceCandidates: [
      'packages/pro/.private-dist/industry-kits/finance-ops-kit.json',
      'packages/pro/industry-kits/finance-ops-kit.json',
    ],
  },
  {
    id: 'health-ops-kit',
    name: 'Health Ops Kit',
    description: 'Protected health-oriented industry kit.',
    plan: 'pro',
    fileName: 'health-ops-kit.json',
    sourceCandidates: [
      'packages/pro/.private-dist/industry-kits/health-ops-kit.json',
      'packages/pro/industry-kits/health-ops-kit.json',
    ],
  },
  {
    id: 'excel-grid-kit',
    name: 'Excel Grid Kit',
    description: 'Pro-only spreadsheet modernization kit for Excel.',
    plan: 'pro',
    fileName: 'excel-lotus-grid-kit.json',
    sourceCandidates: ['packages/pro/industry-kits/excel-lotus-grid-kit.json'],
  },
  {
    id: 'openoffice-grid-kit',
    name: 'OpenOffice Calc Command Kit',
    description: 'Pro-only spreadsheet modernization kit for OpenOffice.',
    plan: 'pro',
    fileName: 'openoffice-calc-command-kit.json',
    sourceCandidates: ['packages/pro/industry-kits/openoffice-calc-command-kit.json'],
  },
];

export const soloAssets = protectedAssets.filter((asset) => asset.plan === 'solo');

export const proAssets = protectedAssets.filter((asset) => asset.plan === 'pro');

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

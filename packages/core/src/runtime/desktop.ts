import { type PatternId } from './patterns.js';
import { type RuntimeId } from './runtimes.js';

export const desktopHostLanguages = [
    'python',
    'rust',
    'java',
    'c',
    'cpp',
] as const;

export type DesktopHostLanguage = (typeof desktopHostLanguages)[number];

export type DesktopTemplateTier = 'free' | 'pro';

export interface DesktopBridgeRequest {
    id: string;
    method: string;
    params?: Record<string, unknown>;
}

export interface DesktopBridgeError {
    code: string;
    message: string;
    details?: unknown;
}

export interface DesktopBridgeResponse {
    id: string;
    ok: boolean;
    result?: unknown;
    error?: DesktopBridgeError;
}

export interface DesktopTemplate {
    id: string;
    name: string;
    tier: DesktopTemplateTier;
    summary: string;
    patternId: PatternId;
    layoutZones: readonly string[];
    primaryComponents: readonly string[];
    recommendedRuntimes: readonly RuntimeId[];
    starterFiles: Record<DesktopHostLanguage, readonly string[]>;
}

const sharedStarterFiles: Record<DesktopHostLanguage, readonly string[]> = {
    python: ['app.py', 'requirements.txt', 'ui/shell.html'],
    rust: ['Cargo.toml', 'src/main.rs', 'ui/shell.html'],
    java: ['App.java', 'ui/shell.html', 'README.md'],
    c: ['main.c', 'ui/shell.html', 'README.md'],
    cpp: ['main.cpp', 'ui/shell.html', 'README.md'],
};

const desktopTemplates: readonly DesktopTemplate[] = [
    {
        id: 'control-center-desktop',
        name: 'Control Center Desktop',
        tier: 'free',
        summary: 'Executive dashboard shell with KPI rail, command panel, and activity feed.',
        patternId: 'saas-control-center',
        layoutZones: ['global-nav', 'kpi-strip', 'activity-feed', 'context-pane'],
        primaryComponents: ['card', 'badge', 'button', 'tooltip'],
        recommendedRuntimes: ['python-pyside', 'rust-tauri', 'java-javafx'],
        starterFiles: sharedStarterFiles,
    },
    {
        id: 'incident-war-room',
        name: 'Incident War Room',
        tier: 'free',
        summary: 'Real-time incident timeline with severity headers and remediation action cards.',
        patternId: 'ops-incident-timeline',
        layoutZones: ['severity-header', 'timeline-core', 'runbook-pane'],
        primaryComponents: ['card', 'badge', 'button', 'modal'],
        recommendedRuntimes: ['rust-tauri', 'c-webview', 'cpp-webview'],
        starterFiles: sharedStarterFiles,
    },
    {
        id: 'workflow-studio',
        name: 'Workflow Studio',
        tier: 'free',
        summary: 'Kanban-style operations studio with editable task inspector.',
        patternId: 'workflow-kanban-studio',
        layoutZones: ['lane-grid', 'task-cards', 'inspector'],
        primaryComponents: ['card', 'badge', 'input', 'textarea', 'select'],
        recommendedRuntimes: ['python-pyside', 'java-javafx', 'cpp-webview'],
        starterFiles: sharedStarterFiles,
    },
    {
        id: 'data-command-console',
        name: 'Data Command Console',
        tier: 'free',
        summary: 'Data-heavy command desktop with filters, bulk actions, and side drawer.',
        patternId: 'data-command-hub',
        layoutZones: ['command-row', 'table-shell', 'detail-drawer'],
        primaryComponents: ['button', 'input', 'dropdown', 'card', 'tooltip'],
        recommendedRuntimes: ['rust-tauri', 'java-javafx', 'c-webview'],
        starterFiles: sharedStarterFiles,
    },
    {
        id: 'executive-briefing-suite',
        name: 'Executive Briefing Suite',
        tier: 'pro',
        summary: 'Narrative analytics desktop for board-level reporting and strategic decisions.',
        patternId: 'executive-analytics-briefing',
        layoutZones: ['headline-metrics', 'trend-atlas', 'decision-log'],
        primaryComponents: ['card', 'badge', 'tooltip', 'modal'],
        recommendedRuntimes: ['python-pyside', 'java-javafx', 'rust-tauri'],
        starterFiles: sharedStarterFiles,
    },
    {
        id: 'finance-ops-atlas',
        name: 'Finance Ops Atlas',
        tier: 'pro',
        summary: 'Multi-panel financial cockpit with variance tracking and anomaly alerts.',
        patternId: 'executive-analytics-briefing',
        layoutZones: ['ledger-summary', 'variance-panel', 'alert-stream'],
        primaryComponents: ['card', 'badge', 'button', 'tooltip'],
        recommendedRuntimes: ['rust-tauri', 'cpp-webview', 'java-javafx'],
        starterFiles: sharedStarterFiles,
    },
    {
        id: 'industrial-command-surface',
        name: 'Industrial Command Surface',
        tier: 'pro',
        summary: 'Operational desktop for factory/field monitoring with strict escalation states.',
        patternId: 'ops-incident-timeline',
        layoutZones: ['station-grid', 'alarm-stream', 'control-strip'],
        primaryComponents: ['card', 'badge', 'button', 'switch'],
        recommendedRuntimes: ['c-webview', 'cpp-webview', 'rust-tauri'],
        starterFiles: sharedStarterFiles,
    },
    {
        id: 'ai-orchestrator-desk',
        name: 'AI Orchestrator Desk',
        tier: 'pro',
        summary: 'Agent orchestration desktop with queue states, trace cards, and run controls.',
        patternId: 'data-command-hub',
        layoutZones: ['queue-grid', 'trace-panel', 'run-controls'],
        primaryComponents: ['card', 'badge', 'button', 'tabs', 'textarea'],
        recommendedRuntimes: ['python-pyside', 'rust-tauri', 'java-javafx'],
        starterFiles: sharedStarterFiles,
    },
] as const;

export function listDesktopTemplates(tier?: DesktopTemplateTier): readonly DesktopTemplate[] {
    if (!tier) {
        return desktopTemplates;
    }
    return desktopTemplates.filter((template) => template.tier === tier);
}

export function isDesktopTemplateId(value: string): boolean {
    return desktopTemplates.some((template) => template.id === value);
}

export function getDesktopTemplate(templateId: string): DesktopTemplate {
    const template = desktopTemplates.find((entry) => entry.id === templateId);
    if (!template) {
        throw new Error(`Unknown desktop template "${templateId}".`);
    }
    return template;
}

export function createDesktopErrorResponse(
    requestId: string,
    code: string,
    message: string,
    details?: unknown,
): DesktopBridgeResponse {
    return {
        id: requestId,
        ok: false,
        error: {
            code,
            message,
            details,
        },
    };
}

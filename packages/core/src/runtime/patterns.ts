import {
    getRuntimeProfile,
    type RuntimeCategory,
    type RuntimeId,
    type RuntimeProfile,
} from './runtimes.js';

export const patternIds = [
    'saas-control-center',
    'data-command-hub',
    'ops-incident-timeline',
    'workflow-kanban-studio',
    'executive-analytics-briefing',
] as const;

export type PatternId = (typeof patternIds)[number];

export interface PatternSection {
    id: string;
    title: string;
    objective: string;
    components: readonly string[];
}

export interface RuntimePatternHint {
    runtime: RuntimeId;
    integration: string;
    starterFiles: readonly string[];
    notes: readonly string[];
}

export interface DesignPattern {
    id: PatternId;
    name: string;
    summary: string;
    heroIntent: string;
    visualDirection: readonly string[];
    sections: readonly PatternSection[];
    tokenPriorities: readonly string[];
    runtimeHints: readonly RuntimePatternHint[];
}

export interface PatternBlueprint {
    pattern: DesignPattern;
    runtime: RuntimeProfile;
    integration: string;
    starterFiles: readonly string[];
    notes: readonly string[];
    qualityChecklist: readonly string[];
}

const qualityChecklist = [
    'Strong visual hierarchy: one dominant title, one dominant action, one dominant chart/table per screen.',
    'Surface depth with at least 3 elevation layers (base, card, interactive overlay).',
    'Spacing rhythm locked to token scale; no arbitrary pixel jumps.',
    'Color system with one primary accent and one semantic danger accent only.',
    'Readable typography at 16px base minimum for data-heavy screens.',
    'High-contrast states for hover, focus-visible, disabled, and error.',
    'Every critical action reachable in <= 2 interactions from the main viewport.',
] as const;

const designPatterns: readonly DesignPattern[] = [
    {
        id: 'saas-control-center',
        name: 'SaaS Control Center',
        summary: 'Premium dashboard shell with navigation, KPI cards, and action feed.',
        heroIntent: 'Make the product feel enterprise-grade on first load.',
        visualDirection: [
            'Structured asymmetry: strong left rail, dense center canvas, compact right context panel.',
            'High-density cards with soft borders and deliberate shadows.',
            'Action-first top bar with command button and global search.',
        ],
        sections: [
            {
                id: 'primary-nav',
                title: 'Primary Navigation',
                objective: 'Persistent orientation and quick context switching.',
                components: ['Sidebar', 'Badge', 'Tooltip'],
            },
            {
                id: 'kpi-strip',
                title: 'KPI Strip',
                objective: 'Immediate business state in under 5 seconds.',
                components: ['Card', 'Badge'],
            },
            {
                id: 'activity-stream',
                title: 'Activity Stream',
                objective: 'Reveal latest changes and required actions.',
                components: ['Card', 'Button'],
            },
        ],
        tokenPriorities: [
            'Spacing 2/4/6/8 for cards and gutters.',
            'Typography scale: 14/16/20/32.',
            'Accent + status colors must map to semantic tokens only.',
        ],
        runtimeHints: [
            {
                runtime: 'php-laravel',
                integration: 'Blade layout + Livewire islands for interactive widgets.',
                starterFiles: [
                    'resources/views/layouts/control-center.blade.php',
                    'app/Livewire/KpiStrip.php',
                ],
                notes: [
                    'Use server-rendered shell first; hydrate only high-interaction zones.',
                ],
            },
            {
                runtime: 'python-django',
                integration: 'Django template inheritance + HTMX for inline updates.',
                starterFiles: [
                    'templates/base_control_center.html',
                    'dashboard/views.py',
                ],
                notes: [
                    'Keep first render fast with cached metrics blocks.',
                ],
            },
        ],
    },
    {
        id: 'data-command-hub',
        name: 'Data Command Hub',
        summary: 'A data-heavy operations view with command palette and power filters.',
        heroIntent: 'Help operators act on large datasets without cognitive overload.',
        visualDirection: [
            'Data table as hero object with persistent command row.',
            'Dense but breathable rows using alternating subtle surfaces.',
            'Keyboard-first flow for bulk actions.',
        ],
        sections: [
            {
                id: 'command-row',
                title: 'Command Row',
                objective: 'Batch actions, global filters, and quick create.',
                components: ['Button', 'Input', 'Dropdown'],
            },
            {
                id: 'table-core',
                title: 'Table Core',
                objective: 'High readability across 50+ rows on desktop.',
                components: ['Card', 'Badge', 'Tooltip'],
            },
            {
                id: 'detail-drawer',
                title: 'Detail Drawer',
                objective: 'Edit details without losing table context.',
                components: ['Modal', 'Input', 'Button'],
            },
        ],
        tokenPriorities: [
            'Monospace optional for technical columns only.',
            'Row height variants must stay on spacing scale.',
            'Hover + selection states require contrast delta >= 15%.',
        ],
        runtimeHints: [
            {
                runtime: 'dotnet-razor',
                integration: 'Razor pages + Blazor component for command palette.',
                starterFiles: [
                    'Pages/Operations/Index.cshtml',
                    'Components/CommandPalette.razor',
                ],
                notes: [
                    'Keep table server paginated to avoid payload spikes.',
                ],
            },
            {
                runtime: 'java-spring',
                integration: 'Thymeleaf fragments + server-side pagination.',
                starterFiles: [
                    'src/main/resources/templates/operations/index.html',
                    'src/main/java/com/lotos/ui/OperationsController.java',
                ],
                notes: [
                    'Publish filter state to URL query params for sharing.',
                ],
            },
        ],
    },
    {
        id: 'ops-incident-timeline',
        name: 'Operations Incident Timeline',
        summary: 'Real-time timeline layout for alerting and remediation workflows.',
        heroIntent: 'Reduce time-to-resolution with strong urgency cues.',
        visualDirection: [
            'Vertical timeline with severity bands and sticky summary rail.',
            'High-contrast severity chips and explicit ownership states.',
            'Rapid contextual drill-down using inline modals.',
        ],
        sections: [
            {
                id: 'severity-header',
                title: 'Severity Header',
                objective: 'Instantly communicate urgency, scope, and owner.',
                components: ['Badge', 'Button'],
            },
            {
                id: 'timeline-feed',
                title: 'Timeline Feed',
                objective: 'Chronological source of truth for incident actions.',
                components: ['Card', 'Badge', 'Tooltip'],
            },
            {
                id: 'runbook-panel',
                title: 'Runbook Panel',
                objective: 'Guide responders through deterministic remediation steps.',
                components: ['Card', 'Button', 'Checkbox'],
            },
        ],
        tokenPriorities: [
            'Severity colors must be semantic and never reused for neutral states.',
            'Timeline markers need size contrast between major/minor events.',
            'Use motion sparingly; urgency should not become visual noise.',
        ],
        runtimeHints: [
            {
                runtime: 'go-templ',
                integration: 'templ server-rendered timeline + websocket updates.',
                starterFiles: [
                    'internal/ui/incidents.templ',
                    'internal/handlers/incidents.go',
                ],
                notes: [
                    'Use optimistic UI only for local acknowledgements.',
                ],
            },
            {
                runtime: 'python-flask',
                integration: 'Jinja templates + SSE channel for event stream.',
                starterFiles: [
                    'templates/incidents/timeline.html',
                    'app/incidents/routes.py',
                ],
                notes: [
                    'Persist active filters in session for on-call continuity.',
                ],
            },
        ],
    },
    {
        id: 'workflow-kanban-studio',
        name: 'Workflow Kanban Studio',
        summary: 'Visual workflow planner with board lanes and detail editor.',
        heroIntent: 'Turn operational chaos into a clear delivery pipeline.',
        visualDirection: [
            'Three-lane default with explicit WIP limits.',
            'Cards with compact metadata and clear priority chips.',
            'Expandable right-side inspector for editing.',
        ],
        sections: [
            {
                id: 'lane-header',
                title: 'Lane Header',
                objective: 'Expose flow pressure and throughput.',
                components: ['Badge', 'Button'],
            },
            {
                id: 'task-cards',
                title: 'Task Cards',
                objective: 'Understand owner, priority, and next action at a glance.',
                components: ['Card', 'Badge', 'Tooltip'],
            },
            {
                id: 'task-editor',
                title: 'Task Editor',
                objective: 'Edit details without navigating away from flow context.',
                components: ['Modal', 'Input', 'Textarea', 'Select'],
            },
        ],
        tokenPriorities: [
            'Card spacing and border radius must stay consistent across lanes.',
            'Priority colors should include icon + text for clarity.',
            'Avoid over-saturated lane backgrounds; use subtle tonal differences.',
        ],
        runtimeHints: [
            {
                runtime: 'cpp-qt',
                integration: 'Qt widgets board + token bridge for color/spacing.',
                starterFiles: [
                    'src/ui/workflow_board.cpp',
                    'src/ui/workflow_styles.qss',
                ],
                notes: [
                    'Cache token values as constants to avoid repeated parsing.',
                ],
            },
            {
                runtime: 'cpp-imgui',
                integration: 'ImGui lane panels with drag-drop IDs and token palette.',
                starterFiles: [
                    'src/ui/workflow_board.cpp',
                    'src/ui/token_palette.h',
                ],
                notes: [
                    'Use consistent card widths to prevent visual jitter.',
                ],
            },
        ],
    },
    {
        id: 'executive-analytics-briefing',
        name: 'Executive Analytics Briefing',
        summary: 'Narrative analytics page combining KPIs, trends, and decisions.',
        heroIntent: 'Support decision-making with confidence, not just charts.',
        visualDirection: [
            'Narrative blocks interleaved with compact data visual modules.',
            'Large typographic moments for directional metrics.',
            'Whitespace used deliberately to control cognitive pacing.',
        ],
        sections: [
            {
                id: 'headline-metrics',
                title: 'Headline Metrics',
                objective: 'Show strategic movement in first viewport.',
                components: ['Card', 'Badge'],
            },
            {
                id: 'trend-analysis',
                title: 'Trend Analysis',
                objective: 'Highlight change over time with clear annotations.',
                components: ['Card', 'Tooltip'],
            },
            {
                id: 'decision-log',
                title: 'Decision Log',
                objective: 'Capture actions linked to observed outcomes.',
                components: ['Card', 'Button', 'Modal'],
            },
        ],
        tokenPriorities: [
            'Use a restrained accent palette to preserve executive readability.',
            'Headings need strong weight contrast without excessive font switching.',
            'Metric cards must align to a strict baseline grid.',
        ],
        runtimeHints: [
            {
                runtime: 'c-ncurses',
                integration: 'Terminal cards with sparklines and keyboard navigation.',
                starterFiles: [
                    'src/dashboard/executive_briefing.c',
                    'src/dashboard/color_tokens.h',
                ],
                notes: [
                    'Prioritize crisp tabular summaries over dense decoration.',
                ],
            },
            {
                runtime: 'mojo-experimental',
                integration: 'Terminal-first storyboard plus markdown export.',
                starterFiles: [
                    'src/briefing/dashboard.mojo',
                    'src/briefing/theme_tokens.mojo',
                ],
                notes: [
                    'Keep adapter experimental and instrumentation-heavy.',
                ],
            },
        ],
    },
] as const;

const defaultIntegrationsByCategory: Record<RuntimeCategory, string> = {
    spa: 'Web components with framework wrapper and typed event adapters.',
    'web-template': 'Server-rendered HTML shell + selective hydration for rich interactions.',
    'desktop-webview': 'Native shell + token bridge + component-inspired widget composition.',
    terminal: 'Token-driven TUI blocks with keyboard-first interaction and semantic color bands.',
};

const defaultStarterFilesByCategory: Record<RuntimeCategory, readonly string[]> = {
    spa: [
        'src/layouts/AppShell.tsx',
        'src/components/lotos-adapter.ts',
    ],
    'web-template': [
        'templates/layout/base.html',
        'templates/partials/pattern-shell.html',
    ],
    'desktop-webview': [
        'ui/shell.html',
        'bridge/desktop_bridge.*',
        'host/main.*',
    ],
    terminal: [
        'src/tui/pattern_shell.*',
        'src/tui/token_map.*',
    ],
};

export function isPatternId(value: string): value is PatternId {
    return patternIds.includes(value as PatternId);
}

export function listDesignPatterns(runtime?: RuntimeId): readonly DesignPattern[] {
    if (!runtime) {
        return designPatterns;
    }

    return designPatterns.filter((pattern) =>
        pattern.runtimeHints.some((hint) => hint.runtime === runtime),
    );
}

export function getDesignPattern(patternId: PatternId): DesignPattern {
    const pattern = designPatterns.find((entry) => entry.id === patternId);
    if (!pattern) {
        throw new Error(`Unknown pattern "${patternId}".`);
    }
    return pattern;
}

export function createPatternBlueprint({
    patternId,
    runtime,
}: {
    patternId: PatternId;
    runtime: RuntimeId;
}): PatternBlueprint {
    const pattern = getDesignPattern(patternId);
    const runtimeProfile = getRuntimeProfile(runtime);
    const runtimeHint = pattern.runtimeHints.find((hint) => hint.runtime === runtime);

    const integration = runtimeHint?.integration ?? defaultIntegrationsByCategory[runtimeProfile.category];
    const starterFiles = runtimeHint?.starterFiles ?? defaultStarterFilesByCategory[runtimeProfile.category];
    const notes = runtimeHint?.notes ?? [
        `No dedicated adapter recipe yet for ${runtimeProfile.label}. Use the category defaults and keep tokens as single source of truth.`,
    ];

    return {
        pattern,
        runtime: runtimeProfile,
        integration,
        starterFiles,
        notes,
        qualityChecklist,
    };
}

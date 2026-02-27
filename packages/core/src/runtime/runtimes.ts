/**
 * Runtime catalog used to scale LotOS UI beyond React.
 * Each runtime keeps a strict profile so adapters can be built consistently.
 */

export const runtimeIds = [
    'react',
    'vue',
    'svelte',
    'angular',
    'php-laravel',
    'python-django',
    'python-flask',
    'python-pyside',
    'java-spring',
    'java-javafx',
    'dotnet-razor',
    'go-templ',
    'rust-tauri',
    'c-ncurses',
    'c-webview',
    'cpp-qt',
    'cpp-webview',
    'cpp-imgui',
    'mojo-experimental',
] as const;

export type RuntimeId = (typeof runtimeIds)[number];

export type RuntimeCategory =
    | 'spa'
    | 'web-template'
    | 'desktop-webview'
    | 'terminal';

export interface RuntimeProfile {
    id: RuntimeId;
    label: string;
    language: string;
    category: RuntimeCategory;
    adapterPackage: string;
    supportsWebComponents: boolean;
    supportsSSR: boolean;
    notes: readonly string[];
}

const runtimeAliasMap: Record<string, RuntimeId> = {
    react: 'react',
    vue: 'vue',
    svelte: 'svelte',
    angular: 'angular',
    laravel: 'php-laravel',
    php: 'php-laravel',
    'php-laravel': 'php-laravel',
    django: 'python-django',
    'python-django': 'python-django',
    flask: 'python-flask',
    'python-flask': 'python-flask',
    pyside: 'python-pyside',
    'python-pyside': 'python-pyside',
    spring: 'java-spring',
    'java-spring': 'java-spring',
    javafx: 'java-javafx',
    'java-javafx': 'java-javafx',
    blazor: 'dotnet-razor',
    razor: 'dotnet-razor',
    '.net': 'dotnet-razor',
    'dotnet-razor': 'dotnet-razor',
    go: 'go-templ',
    templ: 'go-templ',
    'go-templ': 'go-templ',
    rust: 'rust-tauri',
    tauri: 'rust-tauri',
    'rust-tauri': 'rust-tauri',
    c: 'c-ncurses',
    'c-ncurses': 'c-ncurses',
    'c-webview': 'c-webview',
    cplusplus: 'cpp-qt',
    cpp: 'cpp-qt',
    qt: 'cpp-qt',
    'cpp-qt': 'cpp-qt',
    'cpp-webview': 'cpp-webview',
    imgui: 'cpp-imgui',
    'cpp-imgui': 'cpp-imgui',
    mojo: 'mojo-experimental',
    moho: 'mojo-experimental',
    'mojo-experimental': 'mojo-experimental',
};

const runtimeCatalog: Record<RuntimeId, RuntimeProfile> = {
    react: {
        id: 'react',
        label: 'React',
        language: 'TypeScript/JavaScript',
        category: 'spa',
        adapterPackage: '@lotosui/claude-arm',
        supportsWebComponents: true,
        supportsSSR: true,
        notes: [
            'Current production runtime.',
            'Main revenue engine until adapters prove profitability.',
        ],
    },
    vue: {
        id: 'vue',
        label: 'Vue 3',
        language: 'TypeScript/JavaScript',
        category: 'spa',
        adapterPackage: '@lotosui/vue',
        supportsWebComponents: true,
        supportsSSR: true,
        notes: [
            'Thin wrapper on top of the web component core.',
        ],
    },
    svelte: {
        id: 'svelte',
        label: 'Svelte',
        language: 'TypeScript/JavaScript',
        category: 'spa',
        adapterPackage: '@lotosui/svelte',
        supportsWebComponents: true,
        supportsSSR: true,
        notes: [
            'Focus on event mapping and slot ergonomics.',
        ],
    },
    angular: {
        id: 'angular',
        label: 'Angular',
        language: 'TypeScript',
        category: 'spa',
        adapterPackage: '@lotosui/angular',
        supportsWebComponents: true,
        supportsSSR: true,
        notes: [
            'Ships with explicit typings for inputs/outputs.',
        ],
    },
    'php-laravel': {
        id: 'php-laravel',
        label: 'Laravel Blade/Livewire',
        language: 'PHP',
        category: 'web-template',
        adapterPackage: 'lotos-laravel',
        supportsWebComponents: true,
        supportsSSR: true,
        notes: [
            'Primary server-side target due market size and low UI quality.',
        ],
    },
    'python-django': {
        id: 'python-django',
        label: 'Django Templates',
        language: 'Python',
        category: 'web-template',
        adapterPackage: 'lotos-django',
        supportsWebComponents: true,
        supportsSSR: true,
        notes: [
            'High value target for admin and operations dashboards.',
        ],
    },
    'python-flask': {
        id: 'python-flask',
        label: 'Flask/Jinja',
        language: 'Python',
        category: 'web-template',
        adapterPackage: 'lotos-flask',
        supportsWebComponents: true,
        supportsSSR: true,
        notes: [
            'Best used for lightweight internal tooling kits.',
        ],
    },
    'python-pyside': {
        id: 'python-pyside',
        label: 'Python + PySide WebEngine',
        language: 'Python',
        category: 'desktop-webview',
        adapterPackage: 'lotos-pyside',
        supportsWebComponents: true,
        supportsSSR: false,
        notes: [
            'Desktop Python runtime with native Qt shell and JS bridge support.',
        ],
    },
    'java-spring': {
        id: 'java-spring',
        label: 'Spring + Thymeleaf',
        language: 'Java',
        category: 'web-template',
        adapterPackage: 'lotos-spring',
        supportsWebComponents: true,
        supportsSSR: true,
        notes: [
            'Enterprise adapter with strict a11y and audit-friendly defaults.',
        ],
    },
    'java-javafx': {
        id: 'java-javafx',
        label: 'Java + JavaFX WebView',
        language: 'Java',
        category: 'desktop-webview',
        adapterPackage: 'lotos-javafx',
        supportsWebComponents: true,
        supportsSSR: false,
        notes: [
            'Desktop runtime for Java with direct JS bridge via JavaFX WebEngine.',
        ],
    },
    'dotnet-razor': {
        id: 'dotnet-razor',
        label: '.NET Razor/Blazor',
        language: '.NET',
        category: 'web-template',
        adapterPackage: 'lotos-blazor',
        supportsWebComponents: true,
        supportsSSR: true,
        notes: [
            'Adapter should prioritize forms, data grids, and auth workflows.',
        ],
    },
    'go-templ': {
        id: 'go-templ',
        label: 'Go + templ',
        language: 'Go',
        category: 'web-template',
        adapterPackage: 'lotos-go',
        supportsWebComponents: true,
        supportsSSR: true,
        notes: [
            'Excellent fit for API-heavy dashboards with low JS overhead.',
        ],
    },
    'rust-tauri': {
        id: 'rust-tauri',
        label: 'Rust + Tauri',
        language: 'Rust',
        category: 'desktop-webview',
        adapterPackage: 'lotos-tauri',
        supportsWebComponents: true,
        supportsSSR: false,
        notes: [
            'Primary desktop adapter for secure native capabilities + rich web UI.',
        ],
    },
    'c-ncurses': {
        id: 'c-ncurses',
        label: 'C + ncurses',
        language: 'C',
        category: 'terminal',
        adapterPackage: 'lotos-tui-c',
        supportsWebComponents: false,
        supportsSSR: false,
        notes: [
            'Terminal-first mode for environments without web rendering.',
        ],
    },
    'c-webview': {
        id: 'c-webview',
        label: 'C + WebView',
        language: 'C',
        category: 'desktop-webview',
        adapterPackage: 'lotos-c-webview',
        supportsWebComponents: true,
        supportsSSR: false,
        notes: [
            'Lightweight native shell for embedded and desktop deployments.',
        ],
    },
    'cpp-qt': {
        id: 'cpp-qt',
        label: 'C++ + Qt',
        language: 'C++',
        category: 'desktop-webview',
        adapterPackage: 'lotos-cpp-qt',
        supportsWebComponents: false,
        supportsSSR: false,
        notes: [
            'Use token bridge to keep brand consistency in native widgets.',
        ],
    },
    'cpp-webview': {
        id: 'cpp-webview',
        label: 'C++ + WebView',
        language: 'C++',
        category: 'desktop-webview',
        adapterPackage: 'lotos-cpp-webview',
        supportsWebComponents: true,
        supportsSSR: false,
        notes: [
            'Cross-platform desktop shell with native bridge for high-performance modules.',
        ],
    },
    'cpp-imgui': {
        id: 'cpp-imgui',
        label: 'C++ + ImGui',
        language: 'C++',
        category: 'terminal',
        adapterPackage: 'lotos-cpp-imgui',
        supportsWebComponents: false,
        supportsSSR: false,
        notes: [
            'Great for tooling-heavy desktop apps with rapid iteration.',
        ],
    },
    'mojo-experimental': {
        id: 'mojo-experimental',
        label: 'Mojo (experimental)',
        language: 'Mojo',
        category: 'terminal',
        adapterPackage: 'lotos-mojo',
        supportsWebComponents: false,
        supportsSSR: false,
        notes: [
            'Experimental track; default to terminal and hybrid templates first.',
        ],
    },
};

export function isRuntimeId(value: string): value is RuntimeId {
    return runtimeIds.includes(value as RuntimeId);
}

export function normalizeRuntimeId(value: string): RuntimeId | null {
    return runtimeAliasMap[value.toLowerCase()] ?? null;
}

export function listRuntimeProfiles(): readonly RuntimeProfile[] {
    return runtimeIds.map((id) => runtimeCatalog[id]);
}

export function getRuntimeProfile(id: RuntimeId): RuntimeProfile {
    return runtimeCatalog[id];
}

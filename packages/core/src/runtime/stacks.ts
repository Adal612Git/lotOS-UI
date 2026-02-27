import { type RuntimeId } from './runtimes.js';

export const databaseTargets = [
    'none',
    'mongodb',
] as const;

export type DatabaseTarget = (typeof databaseTargets)[number];

export interface StackTemplate {
    id: string;
    runtime: RuntimeId;
    label: string;
    language: string;
    framework: string;
    category: 'web' | 'desktop';
    summary: string;
    supportedDatabases: readonly DatabaseTarget[];
    defaultDatabase: DatabaseTarget;
    starterFiles: readonly string[];
}

const stackTemplates: readonly StackTemplate[] = [
    {
        id: 'php-laravel-starter',
        runtime: 'php-laravel',
        label: 'PHP Laravel Starter',
        language: 'PHP',
        framework: 'Laravel',
        category: 'web',
        summary: 'Server-rendered dashboard shell with optional Mongo-powered operational data.',
        supportedDatabases: ['none', 'mongodb'],
        defaultDatabase: 'mongodb',
        starterFiles: [
            'routes/web.php',
            'app/Http/Controllers/LotosDashboardController.php',
            'resources/views/lotos/dashboard.blade.php',
            '.env.example',
        ],
    },
    {
        id: 'python-django-starter',
        runtime: 'python-django',
        label: 'Python Django Starter',
        language: 'Python',
        framework: 'Django',
        category: 'web',
        summary: 'Django template starter with tokenized UI shell and Mongo-ready service layer.',
        supportedDatabases: ['none', 'mongodb'],
        defaultDatabase: 'mongodb',
        starterFiles: [
            'requirements.txt',
            'lotos_app/views.py',
            'lotos_app/urls.py',
            'templates/lotos/dashboard.html',
            '.env.example',
        ],
    },
    {
        id: 'python-flask-starter',
        runtime: 'python-flask',
        label: 'Python Flask Starter',
        language: 'Python',
        framework: 'Flask',
        category: 'web',
        summary: 'Lean Flask dashboard starter for internal ops with optional Mongo backend.',
        supportedDatabases: ['none', 'mongodb'],
        defaultDatabase: 'mongodb',
        starterFiles: [
            'requirements.txt',
            'app.py',
            'templates/dashboard.html',
            '.env.example',
        ],
    },
    {
        id: 'java-spring-starter',
        runtime: 'java-spring',
        label: 'Java Spring Starter',
        language: 'Java',
        framework: 'Spring Boot + Thymeleaf',
        category: 'web',
        summary: 'Enterprise Java dashboard shell with repository-ready Mongo integration path.',
        supportedDatabases: ['none', 'mongodb'],
        defaultDatabase: 'mongodb',
        starterFiles: [
            'pom.xml',
            'src/main/java/com/lotosui/LotosApplication.java',
            'src/main/resources/templates/dashboard.html',
            'src/main/resources/application.properties',
        ],
    },
    {
        id: 'dotnet-razor-starter',
        runtime: 'dotnet-razor',
        label: '.NET Razor Starter',
        language: 'C#',
        framework: 'ASP.NET Core Razor',
        category: 'web',
        summary: 'Razor Pages starter with strict contracts and optional Mongo repository integration.',
        supportedDatabases: ['none', 'mongodb'],
        defaultDatabase: 'mongodb',
        starterFiles: [
            'LotosStack.csproj',
            'Program.cs',
            'Pages/Index.cshtml',
            'appsettings.json',
        ],
    },
    {
        id: 'go-templ-starter',
        runtime: 'go-templ',
        label: 'Go templ Starter',
        language: 'Go',
        framework: 'Go + templ',
        category: 'web',
        summary: 'Go server starter with LotOS shell and optional Mongo-backed state.',
        supportedDatabases: ['none', 'mongodb'],
        defaultDatabase: 'mongodb',
        starterFiles: [
            'go.mod',
            'cmd/server/main.go',
            'internal/ui/dashboard.templ',
            '.env.example',
        ],
    },
    {
        id: 'python-pyside-desktop',
        runtime: 'python-pyside',
        label: 'Python PySide Desktop Starter',
        language: 'Python',
        framework: 'PySide6 + Qt WebEngine',
        category: 'desktop',
        summary: 'Desktop shell for Python teams that need polished UI and optional Mongo sync.',
        supportedDatabases: ['none', 'mongodb'],
        defaultDatabase: 'none',
        starterFiles: [
            'app.py',
            'requirements.txt',
            'ui/shell.html',
            '.env.example',
        ],
    },
    {
        id: 'java-javafx-desktop',
        runtime: 'java-javafx',
        label: 'Java JavaFX Desktop Starter',
        language: 'Java',
        framework: 'JavaFX WebView',
        category: 'desktop',
        summary: 'Java desktop shell with embedded LotOS UI and optional Mongo API integration.',
        supportedDatabases: ['none', 'mongodb'],
        defaultDatabase: 'none',
        starterFiles: [
            'App.java',
            'ui/shell.html',
            'README.md',
            '.env.example',
        ],
    },
    {
        id: 'c-webview-desktop',
        runtime: 'c-webview',
        label: 'C WebView Desktop Starter',
        language: 'C',
        framework: 'WebView',
        category: 'desktop',
        summary: 'Native C shell around LotOS UI for lightweight desktop deployments.',
        supportedDatabases: ['none'],
        defaultDatabase: 'none',
        starterFiles: [
            'main.c',
            'ui/shell.html',
            'README.md',
        ],
    },
    {
        id: 'cpp-webview-desktop',
        runtime: 'cpp-webview',
        label: 'C++ WebView Desktop Starter',
        language: 'C++',
        framework: 'WebView',
        category: 'desktop',
        summary: 'C++ desktop shell for high-performance modules with LotOS UI front layer.',
        supportedDatabases: ['none'],
        defaultDatabase: 'none',
        starterFiles: [
            'main.cpp',
            'ui/shell.html',
            'README.md',
        ],
    },
] as const;

export type StackTemplateId = (typeof stackTemplates)[number]['id'];

export function isDatabaseTarget(value: string): value is DatabaseTarget {
    return databaseTargets.includes(value as DatabaseTarget);
}

export function listStackTemplates({
    runtime,
    database,
}: {
    runtime?: RuntimeId;
    database?: DatabaseTarget;
} = {}): readonly StackTemplate[] {
    return stackTemplates.filter((entry) => {
        if (runtime && entry.runtime !== runtime) {
            return false;
        }
        if (database && !entry.supportedDatabases.includes(database)) {
            return false;
        }
        return true;
    });
}

export function isStackTemplateId(value: string): value is StackTemplateId {
    return stackTemplates.some((entry) => entry.id === value);
}

export function getStackTemplate(id: string): StackTemplate {
    const template = stackTemplates.find((entry) => entry.id === id);
    if (!template) {
        throw new Error(`Unknown stack template "${id}".`);
    }
    return template;
}

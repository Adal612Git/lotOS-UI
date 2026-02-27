import path from 'node:path';
import fs from 'fs-extra';
import {
    getDesktopTemplate,
    isDesktopTemplateId,
    listDesktopTemplates,
    type DesktopHostLanguage,
} from '@lotosui/core/runtime';

export const desktopStarterLanguages = [
    'python',
    'rust',
    'java',
    'c',
    'cpp',
] as const;

export type DesktopStarterLanguage = (typeof desktopStarterLanguages)[number];

const desktopLanguageAliasMap: Record<string, DesktopStarterLanguage> = {
    python: 'python',
    py: 'python',
    rust: 'rust',
    rs: 'rust',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    cplusplus: 'cpp',
};

export interface DesktopScaffoldOptions {
    language: string;
    templateId: string;
    outDir?: string;
    force?: boolean;
}

export interface DesktopScaffoldResult {
    language: DesktopStarterLanguage;
    templateId: string;
    outputDir: string;
    files: string[];
}

export function normalizeDesktopLanguage(value: string): DesktopStarterLanguage | null {
    return desktopLanguageAliasMap[value.toLowerCase()] ?? null;
}

export function listDesktopTemplateSummaries(): readonly { id: string; tier: string; name: string }[] {
    return listDesktopTemplates().map((template) => ({
        id: template.id,
        tier: template.tier,
        name: template.name,
    }));
}

function buildShellHtml(templateId: string): string {
    const template = getDesktopTemplate(templateId);
    const zones = template.layoutZones
        .map((zone, index) => `<section class="zone">
                <header class="zone-header">
                    <h3>${zone}</h3>
                    <span class="zone-index">0${index + 1}</span>
                </header>
                <lotos-card class="zone-card">
                    <strong>${zone} module</strong>
                    <p>Template: ${template.name}</p>
                    <lotos-button variant="primary">Run action</lotos-button>
                </lotos-card>
            </section>`)
        .join('\n            ');
    const componentChips = template.primaryComponents
        .map((component) => `<span class="chip">${component}</span>`)
        .join('');
    const runtimeChips = template.recommendedRuntimes
        .map((runtime) => `<span class="chip runtime">${runtime}</span>`)
        .join('');

    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${template.name}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
    <style>
        :root {
            --bg-0: #f6f8fb;
            --bg-1: #e5edf7;
            --panel: rgba(255, 255, 255, 0.76);
            --ink: #122032;
            --ink-soft: #4e5f75;
            --line: rgba(18, 32, 50, 0.12);
            --accent: #078b6d;
            --accent-2: #1f6feb;
            --shadow: 0 20px 45px rgba(17, 30, 45, 0.14);
        }

        * { box-sizing: border-box; }
        body {
            margin: 0;
            color: var(--ink);
            font-family: "Manrope", "Segoe UI", sans-serif;
            background:
                radial-gradient(1200px 500px at -10% 0%, #c8f2e8 0%, transparent 58%),
                radial-gradient(900px 500px at 100% 12%, #cfe0ff 0%, transparent 50%),
                linear-gradient(180deg, var(--bg-0) 0%, var(--bg-1) 100%);
            min-height: 100vh;
        }

        .app-shell {
            display: grid;
            grid-template-columns: 320px 1fr;
            min-height: 100vh;
            gap: 20px;
            padding: 20px;
        }

        .nav, .top, .zone {
            border: 1px solid var(--line);
            border-radius: 18px;
            background: var(--panel);
            backdrop-filter: blur(8px);
            box-shadow: var(--shadow);
        }

        .nav {
            padding: 22px;
            display: grid;
            align-content: start;
            gap: 14px;
        }

        .brand {
            margin: 0;
            font-size: 26px;
            line-height: 1.1;
            letter-spacing: -0.02em;
        }

        .tier {
            display: inline-block;
            width: fit-content;
            background: #e4f3ef;
            color: #046049;
            border: 1px solid #b9e5d9;
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
        }

        .label {
            margin: 0;
            color: var(--ink-soft);
            font-size: 12px;
            font-family: "JetBrains Mono", monospace;
            text-transform: uppercase;
            letter-spacing: .08em;
        }

        .chips {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .chip {
            border: 1px solid var(--line);
            background: rgba(255, 255, 255, 0.72);
            border-radius: 999px;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: 700;
            color: var(--ink-soft);
        }

        .chip.runtime {
            color: #0e4f9d;
            background: #eaf2ff;
            border-color: #c7dafb;
        }

        .main {
            display: grid;
            gap: 14px;
            align-content: start;
        }

        .top {
            padding: 16px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        }

        .top h2 {
            margin: 0;
            font-size: 22px;
            letter-spacing: -0.01em;
        }

        .subtitle {
            margin: 2px 0 0;
            color: var(--ink-soft);
            font-size: 14px;
        }

        .content {
            display: grid;
            gap: 14px;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }

        .zone {
            padding: 14px;
            display: grid;
            gap: 10px;
            transition: transform 140ms ease, box-shadow 140ms ease;
        }

        .zone:hover {
            transform: translateY(-2px);
            box-shadow: 0 24px 42px rgba(17, 30, 45, 0.18);
        }

        .zone-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }

        .zone-header h3 {
            margin: 0;
            font-size: 13px;
            letter-spacing: .08em;
            text-transform: uppercase;
            color: var(--ink-soft);
        }

        .zone-index {
            font-family: "JetBrains Mono", monospace;
            color: var(--accent-2);
            font-size: 12px;
            font-weight: 700;
        }

        .zone-card {
            display: block;
            border-radius: 12px;
            border: 1px solid var(--line);
            background: rgba(255, 255, 255, 0.84);
            padding: 12px;
        }

        .zone-card p {
            margin: 6px 0 10px;
            color: var(--ink-soft);
            font-size: 13px;
        }

        @media (max-width: 980px) {
            .app-shell { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="app-shell">
        <aside class="nav">
            <h1 class="brand">LotOS Desktop</h1>
            <span class="tier">${template.tier}</span>
            <p class="label">Template</p>
            <strong>${template.name}</strong>
            <p class="label">Pattern</p>
            <strong>${template.patternId}</strong>
            <p class="label">Primary Components</p>
            <div class="chips">${componentChips}</div>
            <p class="label">Recommended Runtimes</p>
            <div class="chips">${runtimeChips}</div>
        </aside>
        <main class="main">
            <header class="top">
                <div>
                    <h2>${template.name}</h2>
                    <p class="subtitle">Desktop starter with LotOS visual system + bridge contract</p>
                </div>
                <lotos-button variant="primary">Open Command Palette</lotos-button>
            </header>
            <section class="content">
                ${zones}
            </section>
        </main>
    </div>
    <script type="module">
        import 'https://unpkg.com/@lotosui/web-components@0.1.0/dist/index.js';
        window.lotosDesktopBridge = {
            async call(method, params) {
                const payload = { id: String(Date.now()), method, params: params ?? {} };
                if (window.pywebview?.api?.invoke) return window.pywebview.api.invoke(payload);
                if (window.lotosBridge?.invoke) return window.lotosBridge.invoke(JSON.stringify(payload));
                return { id: payload.id, ok: true, result: { method: payload.method, params: payload.params } };
            },
        };
    </script>
</body>
</html>
`;
}

function pythonStarter(): Record<string, string> {
    return {
        'app.py': `import webview
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HTML = ROOT / "ui" / "shell.html"

class ApiBridge:
    def invoke(self, payload):
        return {"id": payload.get("id"), "ok": True, "result": {"echo": payload}}

if __name__ == "__main__":
    webview.create_window("LotOS Desktop", HTML.as_uri(), js_api=ApiBridge(), width=1360, height=860)
    webview.start(debug=True)
`,
        'requirements.txt': 'pywebview==5.2\n',
    };
}

function rustStarter(): Record<string, string> {
    return {
        'Cargo.toml': `[package]
name = "lotos_desktop_shell"
version = "0.1.0"
edition = "2021"

[dependencies]
wry = "0.45"
`,
        'src/main.rs': `use std::path::PathBuf;
use wry::application::event::{Event, WindowEvent};
use wry::application::event_loop::{ControlFlow, EventLoop};
use wry::application::window::WindowBuilder;
use wry::webview::WebViewBuilder;

fn main() -> wry::Result<()> {
    let event_loop = EventLoop::new();
    let window = WindowBuilder::new().with_title("LotOS Desktop").build(&event_loop)?;
    let html_path: PathBuf = std::env::current_dir()?.join("ui").join("shell.html");
    let url = format!("file:///{}", html_path.to_string_lossy().replace("\\\\", "/"));
    let _webview = WebViewBuilder::new(window)?.with_url(&url)?.build()?;
    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;
        if let Event::WindowEvent { event: WindowEvent::CloseRequested, .. } = event {
            *control_flow = ControlFlow::Exit;
        }
    });
}
`,
    };
}

function javaStarter(): Record<string, string> {
    return {
        'App.java': `import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import java.io.File;

public class App extends Application {
    @Override
    public void start(Stage stage) {
        WebView web = new WebView();
        String url = new File("ui/shell.html").toURI().toString();
        web.getEngine().load(url);
        stage.setTitle("LotOS Desktop");
        stage.setScene(new Scene(web, 1360, 860));
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }
}
`,
        'README.md': 'Run with JavaFX-enabled JDK. Compile App.java and launch the class.\n',
    };
}

function cStarter(): Record<string, string> {
    return {
        'main.c': `#include <webview/webview.h>

int main(void) {
  webview_t w = webview_create(0, NULL);
  webview_set_title(w, "LotOS Desktop");
  webview_set_size(w, 1360, 860, WEBVIEW_HINT_NONE);
  webview_navigate(w, "file:///./ui/shell.html");
  webview_run(w);
  webview_destroy(w);
  return 0;
}
`,
        'README.md': 'Build against webview library. Ensure ui/shell.html exists next to executable.\n',
    };
}

function cppStarter(): Record<string, string> {
    return {
        'main.cpp': `#include <webview/webview.h>

int main() {
  webview::webview w(true, nullptr);
  w.set_title("LotOS Desktop");
  w.set_size(1360, 860, WEBVIEW_HINT_NONE);
  w.navigate("file:///./ui/shell.html");
  w.run();
}
`,
        'README.md': 'Build with webview C++ wrapper and run next to ui/shell.html.\n',
    };
}

function createLanguageFiles(language: DesktopStarterLanguage): Record<string, string> {
    switch (language) {
        case 'python':
            return pythonStarter();
        case 'rust':
            return rustStarter();
        case 'java':
            return javaStarter();
        case 'c':
            return cStarter();
        case 'cpp':
            return cppStarter();
        default:
            return {};
    }
}

export async function scaffoldDesktopStarter({
    language,
    templateId,
    outDir = 'desktop-starter',
    force = false,
}: DesktopScaffoldOptions): Promise<DesktopScaffoldResult> {
    const normalizedLanguage = normalizeDesktopLanguage(language);
    if (!normalizedLanguage) {
        throw new Error(`Unsupported desktop language "${language}".`);
    }

    if (!isDesktopTemplateId(templateId)) {
        throw new Error(`Unknown desktop template "${templateId}".`);
    }

    const template = getDesktopTemplate(templateId);
    const targetDir = path.resolve(outDir);
    const shellPath = path.join(targetDir, 'ui', 'shell.html');

    if (!force && await fs.pathExists(targetDir)) {
        const entries = await fs.readdir(targetDir);
        if (entries.length > 0) {
            throw new Error(`Output directory is not empty: ${targetDir}`);
        }
    }

    await fs.ensureDir(path.dirname(shellPath));
    await fs.writeFile(shellPath, buildShellHtml(templateId), 'utf8');

    const files = createLanguageFiles(normalizedLanguage);
    const writtenFiles: string[] = ['ui/shell.html'];

    for (const [relativePath, content] of Object.entries(files)) {
        const absolutePath = path.join(targetDir, relativePath);
        await fs.ensureDir(path.dirname(absolutePath));
        await fs.writeFile(absolutePath, content, 'utf8');
        writtenFiles.push(relativePath);
    }

    const manifestPath = path.join(targetDir, 'desktop-template.json');
    await fs.writeJson(manifestPath, {
        templateId: template.id,
        templateName: template.name,
        tier: template.tier,
        language: normalizedLanguage,
        patternId: template.patternId,
        recommendedRuntimes: template.recommendedRuntimes,
        layoutZones: template.layoutZones,
        primaryComponents: template.primaryComponents,
    }, { spaces: 2 });
    writtenFiles.push('desktop-template.json');

    return {
        language: normalizedLanguage,
        templateId: template.id,
        outputDir: targetDir,
        files: writtenFiles,
    };
}

export function languageToRuntimeId(language: DesktopHostLanguage): string {
    switch (language) {
        case 'python':
            return 'python-pyside';
        case 'rust':
            return 'rust-tauri';
        case 'java':
            return 'java-javafx';
        case 'c':
            return 'c-webview';
        case 'cpp':
            return 'cpp-webview';
        default:
            return 'python-pyside';
    }
}

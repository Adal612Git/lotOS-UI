import Link from 'next/link';
import '../../demo/demo.css';

export const metadata = {
  title: 'Con LotOS UI — Desktop Multi-Lenguaje (after)',
  description: 'Python, Rust, Java, C y C++ — todos usando el mismo LotOS Desktop Shell. 1 sistema, 5 lenguajes.',
};

const langs = [
  {
    id: 'python', label: 'Python', cls: 'python' as const,
    file: 'app.py', ext: 'python',
    cmd: 'lotos-ui desktop-init -l python -t control-center-desktop -o ./my-app',
    code: `import webview
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HTML = ROOT / "ui" / "shell.html"

class ApiBridge:
    def invoke(self, payload):
        return {"id": payload.get("id"), "ok": True,
                "result": {"echo": payload}}

if __name__ == "__main__":
    webview.create_window(
        "LotOS Desktop", HTML.as_uri(),
        js_api=ApiBridge(), width=1360, height=860
    )
    webview.start(debug=True)`,
    reqs: 'requirements.txt: pywebview==5.2',
    tip: 'pip install pywebview && python app.py',
  },
  {
    id: 'rust', label: 'Rust', cls: 'rust' as const,
    file: 'src/main.rs', ext: 'rust',
    cmd: 'lotos-ui desktop-init -l rust -t control-center-desktop -o ./my-app',
    code: `use std::path::PathBuf;
use wry::application::event::{Event, WindowEvent};
use wry::application::event_loop::{ControlFlow, EventLoop};
use wry::application::window::WindowBuilder;
use wry::webview::WebViewBuilder;

fn main() -> wry::Result<()> {
    let event_loop = EventLoop::new();
    let window = WindowBuilder::new()
        .with_title("LotOS Desktop")
        .build(&event_loop)?;
    let html_path: PathBuf = std::env::current_dir()?
        .join("ui").join("shell.html");
    let url = format!("file:///{}", html_path.to_string_lossy());
    let _webview = WebViewBuilder::new(window)?
        .with_url(&url)?.build()?;
    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;
        if let Event::WindowEvent {
            event: WindowEvent::CloseRequested, .. } = event {
            *control_flow = ControlFlow::Exit;
        }
    });
}`,
    reqs: 'Cargo.toml: wry = "0.45"',
    tip: 'cargo run',
  },
  {
    id: 'java', label: 'Java', cls: 'java' as const,
    file: 'App.java', ext: 'java',
    cmd: 'lotos-ui desktop-init -l java -t control-center-desktop -o ./my-app',
    code: `import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import java.io.File;

public class App extends Application {
    @Override
    public void start(Stage stage) {
        WebView web = new WebView();
        String url = new File("ui/shell.html")
            .toURI().toString();
        web.getEngine().load(url);
        stage.setTitle("LotOS Desktop");
        stage.setScene(new Scene(web, 1360, 860));
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }
}`,
    reqs: 'JDK 21+ with JavaFX modules',
    tip: 'javac App.java && java --module-path $FX_PATH App',
  },
  {
    id: 'c', label: 'C', cls: 'c' as const,
    file: 'main.c', ext: 'c',
    cmd: 'lotos-ui desktop-init -l c -t control-center-desktop -o ./my-app',
    code: `#include <webview/webview.h>

int main(void) {
  webview_t w = webview_create(0, NULL);
  webview_set_title(w, "LotOS Desktop");
  webview_set_size(w, 1360, 860,
                   WEBVIEW_HINT_NONE);
  webview_navigate(w,
    "file:///./ui/shell.html");
  webview_run(w);
  webview_destroy(w);
  return 0;
}`,
    reqs: 'webview/webview.h (single-header)',
    tip: 'gcc main.c -o app -lwebview && ./app',
  },
  {
    id: 'cpp', label: 'C++', cls: 'cpp' as const,
    file: 'main.cpp', ext: 'cpp',
    cmd: 'lotos-ui desktop-init -l cpp -t control-center-desktop -o ./my-app',
    code: `#include <webview/webview.h>

int main() {
  webview::webview w(true, nullptr);
  w.set_title("LotOS Desktop");
  w.set_size(1360, 860,
             WEBVIEW_HINT_NONE);
  w.navigate(
    "file:///./ui/shell.html");
  w.run();
}`,
    reqs: 'webview C++ wrapper (header-only)',
    tip: 'g++ -std=c++17 main.cpp -o app -lwebview && ./app',
  },
] as const;

export default function ConLotosDesktopLangsPage() {
  return (
    <main className="demo-shell">
      <header className="demo-header">
        <div className="demo-brand">
          <span className="demo-brand-dot" />
          LotOS Desktop Shell — Multi-Lenguaje
        </div>
        <div className="demo-header-center">
          <span className="demo-badge green">1 shell.html</span>
          <span className="demo-badge blue">5 lenguajes</span>
          <span className="demo-badge violet">mismo UI</span>
        </div>
        <nav className="demo-nav">
          <Link href="/demo/sin-lotos-desktop-langs">← Sin LotOS</Link>
          <Link href="/demo">← Demos</Link>
        </nav>
      </header>

      <div className="demo-body">
        <p className="demo-section-label">Con LotOS UI · Desktop Multi-Lenguaje</p>
        <h1 className="demo-page-title">1 shell.html. 5 lenguajes. El mismo look.</h1>
        <p className="demo-page-subtitle">
          El CLI genera <code style={{ background: 'rgba(240,244,255,0.07)', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>ui/shell.html</code> + el archivo host en tu lenguaje elegido.
          Tu app nativa solo abre un WebView. LotOS hace todo lo visual.
        </p>

        {/* The key concept card */}
        <div className="demo-scard glass" style={{ marginBottom: 24, borderColor: 'rgba(7,139,109,0.3)', background: 'rgba(7,139,109,0.05)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <p className="demo-scard-title">Cómo funciona el bridge</p>
              <p className="demo-scard-body">
                El shell.html llama a <code style={{ fontSize: 11, color: '#86EFAC' }}>window.lotosDesktopBridge.call(method, params)</code>.
                Tu host app registra ese bridge. Python usa <code style={{ fontSize: 11, color: '#93C5FD' }}>js_api=ApiBridge()</code>,
                Rust usa <code style={{ fontSize: 11, color: '#FCD34D' }}>lotosBridge.invoke</code>,
                Java/C/C++ usan la misma interfaz JSON.
              </p>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, padding: '8px 12px', borderRadius: 8, background: 'rgba(7,139,109,0.1)', border: '1px solid rgba(7,139,109,0.25)', color: '#86EFAC', flexShrink: 0 }}>
              {'{ id, method, params } →\n  host app\n  ↓\n{ id, ok, result }'}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 28 }}>
          {langs.map((lang) => (
            <div key={lang.id}>
              {/* Language header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span className={`demo-lang-label ${lang.cls}`}>{lang.label}</span>
                <span style={{ fontSize: 12, color: 'rgba(240,244,255,0.45)' }}>{lang.file}</span>
                <div className="demo-divider" style={{ flex: 1, margin: 0 }} />
                <span className="demo-badge green">mismo shell.html</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 14 }}>
                {/* Shell preview (light theme — exactly what the CLI generates) */}
                <div>
                  <p className="demo-card-title" style={{ marginBottom: 8 }}>ui/shell.html — generado por CLI</p>
                  <div className="lotos-shell">
                    <div className="lotos-shell-titlebar">
                      <div className="lotos-shell-dots">
                        <div className="lotos-shell-dot r" />
                        <div className="lotos-shell-dot y" />
                        <div className="lotos-shell-dot g" />
                      </div>
                      <span className="lotos-shell-name">LotOS Desktop — Control Center</span>
                      <span style={{ fontSize: 10, color: '#4e5f75', fontFamily: 'monospace' }}>{lang.label}</span>
                    </div>
                    <div className="lotos-shell-body">
                      <div className="lotos-shell-nav">
                        <div className="lotos-shell-brand">LotOS Desktop</div>
                        <div className="lotos-shell-tier">free</div>
                        <div className="lotos-shell-label">Template</div>
                        <strong style={{ fontSize: 13, color: '#122032' }}>Control Center</strong>
                        <div className="lotos-shell-label">Components</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {['KPI Rail', 'Command', 'Table', 'Stats'].map(c => (
                            <span key={c} className="lotos-shell-chip">{c}</span>
                          ))}
                        </div>
                        <div className="lotos-shell-label">Runtimes</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {['Python', 'Rust', 'Java', 'C', 'C++'].map(r => (
                            <span key={r} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 999, color: '#0e4f9d', background: '#eaf2ff', border: '1px solid #c7dafb', fontWeight: 700 }}>{r}</span>
                          ))}
                        </div>
                      </div>
                      <div className="lotos-shell-main">
                        <div className="lotos-shell-topbar">
                          <div>
                            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.01em', color: '#122032' }}>Control Center Desktop</div>
                            <div className="lotos-shell-text-soft">Desktop starter with LotOS visual system + bridge contract</div>
                          </div>
                          <button className="lotos-shell-btn">Open Command Palette</button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {['KPI Rail', 'Command Panel', 'Activity Feed', 'System Status'].map((zone, i) => (
                            <div key={zone} className="lotos-shell-zone">
                              <div className="lotos-shell-zone-h">
                                <span className="lotos-shell-zone-title">{zone}</span>
                                <span className="lotos-shell-zone-idx">0{i + 1}</span>
                              </div>
                              <div className="lotos-shell-card">
                                <strong style={{ fontSize: 12, color: '#122032' }}>{zone} module</strong>
                                <div className="lotos-shell-text-soft">Template: Control Center</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Host code */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p className="demo-card-title" style={{ marginBottom: 0 }}>
                    {lang.file} — app host ({lang.label})
                  </p>
                  <div className="demo-code">{lang.code}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: 11, color: 'rgba(240,244,255,0.42)' }}>{lang.reqs}</div>
                    <div className="demo-salert info" style={{ fontSize: 12 }}>
                      {lang.tip}
                    </div>
                  </div>
                  <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(240,244,255,0.03)', border: '1px solid rgba(240,244,255,0.07)' }}>
                    <p className="demo-card-title" style={{ marginBottom: 6 }}>CLI — generar este proyecto</p>
                    <div className="demo-code" style={{ fontSize: 11, padding: '8px 12px' }}>{lang.cmd}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* File structure */}
        <div style={{ marginTop: 28 }}>
          <p className="demo-comp-section-label">Estructura generada — igual para todos los lenguajes</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
            {langs.map(lang => (
              <div key={lang.id} className="demo-card">
                <div className="demo-card-head">
                  <p className="demo-card-title">{lang.label}</p>
                  <span className={`demo-lang-label ${lang.cls}`} style={{ fontSize: 9 }}>{lang.id}</span>
                </div>
                <div className="demo-code" style={{ fontSize: 10, padding: '8px 10px' }}>
                  {'my-app/\n'}
                  {'├── ui/\n'}
                  {'│   └── shell.html  ← LotOS\n'}
                  {`├── ${lang.file}\n`}
                  {'└── desktop-template.json'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="demo-status-strip" style={{ marginTop: 20 }}>
          <div className="demo-status-item"><span className="demo-status-dot green" />1 shell.html · LotOS light theme</div>
          <div className="demo-status-item"><span className="demo-status-dot green" />5 host languages</div>
          <div className="demo-status-item"><span className="demo-status-dot green" />WebView bridge contract</div>
          <div className="demo-status-item"><span className="demo-status-dot green" />lotos-ui desktop-init</div>
          <div className="demo-status-item" style={{ marginLeft: 'auto' }}>
            <span style={{ fontSize: 11, color: 'rgba(240,244,255,0.3)' }}>romeromedinar612@gmail.com · Full Signature</span>
          </div>
        </div>

        <div className="demo-divider" />
        <div className="demo-btn-row">
          <Link href="/demo/sin-lotos-desktop-langs" className="demo-btn ghost">← Ver sin LotOS (5 langs)</Link>
          <Link href="/demo/con-lotos-hoja" className="demo-btn primary">Siguiente: Hojas de Cálculo →</Link>
          <Link href="/demo" className="demo-btn ghost">Todos los demos</Link>
        </div>
      </div>
    </main>
  );
}

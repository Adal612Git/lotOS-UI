import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const checks = [
  {
    id: "laravel-example",
    file: "packages/lotos-laravel/examples/dashboard.blade.php",
    markers: [
      "lotos-button",
      "lotos-form",
      "lotos-table",
      "lotos-modal"
    ]
  },
  {
    id: "django-example",
    file: "packages/lotos-django/examples/dashboard.html",
    markers: [
      "lotos_component \"button\"",
      "lotos_ui/form.html",
      "lotos_ui/table.html",
      "lotos_ui/modal.html"
    ]
  },
  {
    id: "flask-example",
    file: "packages/lotos-flask/examples/dashboard.html",
    markers: [
      "button(text=\"Create deployment\"",
      "form(title=\"Launch deployment\"",
      "table(",
      "modal("
    ]
  },
  {
    id: "spring-example",
    file: "packages/lotos-spring/src/main/resources/templates/examples/dashboard.html",
    markers: [
      "lotosBadge(",
      "lotosCard(",
      "lotosForm(",
      "lotosTable(",
      "lotosModal("
    ]
  },
  {
    id: "go-example",
    file: "packages/lotos-go/examples/dashboard.tmpl",
    markers: [
      "template \"lotos_badge\"",
      "template \"lotos_card\"",
      "template \"lotos_form\"",
      "template \"lotos_table\"",
      "template \"lotos_modal\""
    ]
  },
  {
    id: "dotnet-example",
    file: "packages/lotos-dotnet/examples/Pages/Index.cshtml",
    markers: [
      "LotosUI/_Badge",
      "LotosUI/_Card",
      "LotosUI/_Form",
      "LotosUI/_Table",
      "LotosUI/_Modal"
    ]
  },
  {
    id: "desktop-python",
    file: "apps/desktop-python-demo/app.py",
    markers: [
      "def build_demo_state",
      "class LotosDesktopDemo",
      "queue_total"
    ]
  },
  {
    id: "desktop-dotnet",
    file: "apps/desktop-dotnet-demo/Program.cs",
    markers: [
      "ApplicationConfiguration.Initialize",
      "Application.Run",
      "MainWindow"
    ]
  },
  {
    id: "desktop-java",
    file: "apps/desktop-java-demo/App.java",
    markers: [
      "createFrame()",
      "showDialog(",
      "LotOS UI Java Desktop Demo"
    ]
  },
  {
    id: "desktop-rust",
    file: "apps/desktop-rust-demo/src/main.rs",
    markers: [
      "impl eframe::App for DemoApp",
      "eframe::run_native",
      "LotOS UI Rust Desktop Demo"
    ]
  }
];

const failures = [];

for (const check of checks) {
  const absolutePath = join(repoRoot, check.file);
  if (!existsSync(absolutePath)) {
    failures.push(`[${check.id}] missing file: ${check.file}`);
    continue;
  }

  const content = readFileSync(absolutePath, "utf8");
  for (const marker of check.markers) {
    if (!content.includes(marker)) {
      failures.push(`[${check.id}] missing marker "${marker}" in ${check.file}`);
    }
  }
}

if (failures.length > 0) {
  console.error("Runtime example verification failed.");
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}

console.log(`Runtime example verification passed for ${checks.length} examples.`);

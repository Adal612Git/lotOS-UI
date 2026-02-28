import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const requiredComponentMarkers = ["button", "card", "form", "modal", "table"];

const checks = [
  {
    id: "laravel",
    files: [
      "packages/lotos-laravel/resources/views/components/lotos-button.blade.php",
      "packages/lotos-laravel/resources/views/components/lotos-card.blade.php",
      "packages/lotos-laravel/resources/views/components/lotos-form.blade.php",
      "packages/lotos-laravel/resources/views/components/lotos-modal.blade.php",
      "packages/lotos-laravel/resources/views/components/lotos-table.blade.php"
    ]
  },
  {
    id: "django",
    files: [
      "packages/lotos-django/lotos_django/templatetags/lotos_ui.py",
      "packages/lotos-django/lotos_django/templates/lotos_ui/button.html",
      "packages/lotos-django/lotos_django/templates/lotos_ui/card.html",
      "packages/lotos-django/lotos_django/templates/lotos_ui/form.html",
      "packages/lotos-django/lotos_django/templates/lotos_ui/modal.html",
      "packages/lotos-django/lotos_django/templates/lotos_ui/table.html"
    ],
    contentChecks: [
      {
        file: "packages/lotos-django/lotos_django/templatetags/lotos_ui.py",
        markers: requiredComponentMarkers
      }
    ]
  },
  {
    id: "flask",
    files: ["packages/lotos-flask/lotos_flask/templates/lotos_ui/macros.html"],
    contentChecks: [
      {
        file: "packages/lotos-flask/lotos_flask/templates/lotos_ui/macros.html",
        markers: ["macro button", "macro card", "macro form", "macro modal", "macro table"]
      }
    ]
  },
  {
    id: "spring",
    files: ["packages/lotos-spring/src/main/resources/templates/lotos-ui/components.html"],
    contentChecks: [
      {
        file: "packages/lotos-spring/src/main/resources/templates/lotos-ui/components.html",
        markers: ["th:fragment=\"lotosButton", "th:fragment=\"lotosCard", "th:fragment=\"lotosForm", "th:fragment=\"lotosModal", "th:fragment=\"lotosTable"]
      }
    ]
  },
  {
    id: "go",
    files: ["packages/lotos-go/templates/components.tmpl"],
    contentChecks: [
      {
        file: "packages/lotos-go/templates/components.tmpl",
        markers: ["define \"lotos_button\"", "define \"lotos_card\"", "define \"lotos_form\"", "define \"lotos_modal\"", "define \"lotos_table\""]
      }
    ]
  },
  {
    id: "dotnet",
    files: [
      "packages/lotos-dotnet/Views/Shared/LotosUI/_Button.cshtml",
      "packages/lotos-dotnet/Views/Shared/LotosUI/_Card.cshtml",
      "packages/lotos-dotnet/Views/Shared/LotosUI/_Form.cshtml",
      "packages/lotos-dotnet/Views/Shared/LotosUI/_Modal.cshtml",
      "packages/lotos-dotnet/Views/Shared/LotosUI/_Table.cshtml"
    ]
  }
];

const failures = [];

for (const check of checks) {
  for (const relativePath of check.files) {
    const absolutePath = join(repoRoot, relativePath);
    if (!existsSync(absolutePath)) {
      failures.push(`[${check.id}] missing file: ${relativePath}`);
    }
  }

  for (const contentCheck of check.contentChecks ?? []) {
    const absolutePath = join(repoRoot, contentCheck.file);
    if (!existsSync(absolutePath)) {
      failures.push(`[${check.id}] missing content file: ${contentCheck.file}`);
      continue;
    }

    const content = readFileSync(absolutePath, "utf8");
    for (const marker of contentCheck.markers) {
      if (!content.includes(marker)) {
        failures.push(`[${check.id}] missing marker "${marker}" in ${contentCheck.file}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error("Runtime surface verification failed.");
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}

console.log(`Runtime surface verification passed for ${checks.length} adapters.`);

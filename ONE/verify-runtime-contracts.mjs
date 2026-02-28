import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const requiredComponents = ["button", "card", "form", "modal", "table"];

const checks = [
  {
    id: "laravel-contracts",
    files: [
      "packages/lotos-laravel/src/Support/ComponentContractRegistry.php",
      "packages/lotos-laravel/src/Support/ComponentPropValidator.php"
    ],
    markers: [
      { file: "packages/lotos-laravel/src/Support/ComponentContractRegistry.php", values: requiredComponents.map((name) => `'${name}' => [`) },
      { file: "packages/lotos-laravel/src/Support/ComponentPropValidator.php", values: ["missing-required-prop", "invalid-enum-value"] }
    ]
  },
  {
    id: "django-contracts",
    files: [
      "packages/lotos-django/lotos_django/contracts.py",
      "packages/lotos-django/lotos_django/validator.py"
    ],
    markers: [
      { file: "packages/lotos-django/lotos_django/contracts.py", values: requiredComponents.map((name) => `"${name}": {`) },
      { file: "packages/lotos-django/lotos_django/validator.py", values: ["missing-required-prop", "invalid-enum-value"] }
    ]
  },
  {
    id: "flask-contracts",
    files: [
      "packages/lotos-flask/lotos_flask/contracts.py",
      "packages/lotos-flask/lotos_flask/validator.py"
    ],
    markers: [
      { file: "packages/lotos-flask/lotos_flask/contracts.py", values: requiredComponents.map((name) => `"${name}": {`) },
      { file: "packages/lotos-flask/lotos_flask/validator.py", values: ["unknown-component", "invalid-enum-value"] }
    ]
  },
  {
    id: "spring-contracts",
    files: [
      "packages/lotos-spring/src/main/java/com/lotosui/spring/contracts/ComponentContractRegistry.java",
      "packages/lotos-spring/src/main/java/com/lotosui/spring/contracts/ComponentPropValidator.java"
    ],
    markers: [
      { file: "packages/lotos-spring/src/main/java/com/lotosui/spring/contracts/ComponentContractRegistry.java", values: requiredComponents.map((name) => `"${name}"`) },
      { file: "packages/lotos-spring/src/main/java/com/lotosui/spring/contracts/ComponentPropValidator.java", values: ["hasComponent", "getAllowedProps", "sanitized"] }
    ]
  },
  {
    id: "go-contracts",
    files: [
      "packages/lotos-go/contracts.go",
      "packages/lotos-go/validator.go"
    ],
    markers: [
      { file: "packages/lotos-go/contracts.go", values: requiredComponents.map((name) => `"${name}"`) },
      { file: "packages/lotos-go/validator.go", values: ["HasComponent", "AllowedProps", "sanitized"] }
    ]
  },
  {
    id: "dotnet-contracts",
    files: [
      "packages/lotos-dotnet/Contracts/ComponentContractRegistry.cs",
      "packages/lotos-dotnet/Contracts/ComponentPropValidator.cs"
    ],
    markers: [
      { file: "packages/lotos-dotnet/Contracts/ComponentContractRegistry.cs", values: requiredComponents.map((name) => `["${name}"]`) },
      { file: "packages/lotos-dotnet/Contracts/ComponentPropValidator.cs", values: ["HasComponent", "AllowedProps", "sanitized"] }
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

  for (const markerGroup of check.markers) {
    const absolutePath = join(repoRoot, markerGroup.file);
    if (!existsSync(absolutePath)) {
      failures.push(`[${check.id}] missing marker file: ${markerGroup.file}`);
      continue;
    }

    const content = readFileSync(absolutePath, "utf8");
    for (const value of markerGroup.values) {
      if (!content.includes(value)) {
        failures.push(`[${check.id}] missing marker "${value}" in ${markerGroup.file}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error("Runtime contract verification failed.");
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}

console.log(`Runtime contract verification passed for ${checks.length} adapters.`);

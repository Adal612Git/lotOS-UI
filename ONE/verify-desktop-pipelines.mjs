import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];

const desktopTargets = [
  {
    name: "python",
    directory: "apps/desktop-python-demo",
    requiredFiles: ["README.md", "app.py", "app.spec", "build.ps1"],
    readmeMarkers: ["python app.py", "./build.ps1", "PyInstaller"]
  },
  {
    name: "dotnet",
    directory: "apps/desktop-dotnet-demo",
    requiredFiles: ["README.md", "Program.cs", "LotosDesktopDemo.csproj", "build.ps1"],
    readmeMarkers: ["dotnet run", "dotnet build", "dotnet publish", "./build.ps1"]
  },
  {
    name: "java",
    directory: "apps/desktop-java-demo",
    requiredFiles: ["README.md", "App.java", "build.ps1"],
    readmeMarkers: ["javac App.java", "java App", "jar --create", "./build.ps1"]
  },
  {
    name: "rust",
    directory: "apps/desktop-rust-demo",
    requiredFiles: ["README.md", "Cargo.toml", "src/main.rs", "build.ps1"],
    readmeMarkers: ["cargo run", "cargo build --release", "./build.ps1"]
  }
];

for (const target of desktopTargets) {
  for (const relativeFile of target.requiredFiles) {
    const fullPath = join(repoRoot, target.directory, relativeFile);
    if (!existsSync(fullPath)) {
      failures.push(`Missing ${target.name} desktop file: ${target.directory}/${relativeFile}`);
    }
  }

  const readmePath = join(repoRoot, target.directory, "README.md");
  if (existsSync(readmePath)) {
    const readme = readFileSync(readmePath, "utf8");
    for (const marker of target.readmeMarkers) {
      if (!readme.includes(marker)) {
        failures.push(`Missing ${target.name} README marker: ${marker}`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error("Desktop pipeline verification failed.");
  for (const failure of failures) {
    console.error(failure);
  }
  process.exit(1);
}

console.log("Desktop pipeline verification passed.");

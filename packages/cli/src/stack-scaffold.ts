import path from 'node:path';
import fs from 'fs-extra';
import {
    getStackTemplate,
    isDatabaseTarget,
    isStackTemplateId,
    listStackTemplates,
    type DatabaseTarget,
} from '@lotosui/core/runtime';

export interface StackScaffoldOptions {
    stackId: string;
    database?: string;
    outDir?: string;
    force?: boolean;
}

export interface StackScaffoldResult {
    stackId: string;
    runtime: string;
    database: DatabaseTarget;
    outputDir: string;
    files: string[];
}

export function listStackTemplateSummaries(): readonly {
    id: string;
    runtime: string;
    language: string;
    framework: string;
    databases: readonly DatabaseTarget[];
}[] {
    return listStackTemplates().map((template) => ({
        id: template.id,
        runtime: template.runtime,
        language: template.language,
        framework: template.framework,
        databases: template.supportedDatabases,
    }));
}

function buildUiShell(title: string): string {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${title}</title>
  <style>
    body { margin: 0; font-family: "Segoe UI", sans-serif; background: #f3f6fb; color: #13253d; }
    .shell { max-width: 1080px; margin: 24px auto; padding: 24px; background: #fff; border-radius: 18px; border: 1px solid #dbe5f2; }
    .grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
    .card { border: 1px solid #dbe5f2; border-radius: 14px; padding: 14px; background: #fbfdff; }
    h1 { margin-top: 0; }
  </style>
</head>
<body>
  <section class="shell">
    <h1>${title}</h1>
    <p>LotOS UI stack starter with runtime-specific backend and optional Mongo integration.</p>
    <div class="grid">
      <article class="card"><strong>UI Layer</strong><p>LotOS Web Components shell</p></article>
      <article class="card"><strong>Service Layer</strong><p>Runtime-native controllers/routes</p></article>
      <article class="card"><strong>Data Layer</strong><p>Pluggable: none or MongoDB</p></article>
    </div>
  </section>
  <script type="module">
    import 'https://unpkg.com/@lotosui/web-components@0.1.0/dist/index.js';
  </script>
</body>
</html>
`;
}

function filesForPhp(database: DatabaseTarget): Record<string, string> {
    const mongoBlock = database === 'mongodb'
        ? `<?php

namespace App\\Services;

use MongoDB\\Client;

final class LotosMongoClient {
    public static function connect(): Client {
        $uri = env('MONGO_URI', 'mongodb://localhost:27017/lotos');
        return new Client($uri);
    }
}
`
        : '';

    return {
        'routes/web.php': `<?php

use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\LotosDashboardController;

Route::get('/', [LotosDashboardController::class, 'index']);
`,
        'app/Http/Controllers/LotosDashboardController.php': `<?php

namespace App\\Http\\Controllers;

final class LotosDashboardController extends Controller {
    public function index() {
        return view('lotos.dashboard', ['title' => 'LotOS Laravel Stack']);
    }
}
`,
        'resources/views/lotos/dashboard.blade.php': `<!doctype html>
<html>
<head><meta charset="utf-8"><title>{{ $title }}</title></head>
<body>
  <h1>{{ $title }}</h1>
  <x-lotos-ui::lotos-button variant="primary">Deploy</x-lotos-ui::lotos-button>
</body>
</html>
`,
        '.env.example': `APP_NAME=LotOSStack
APP_ENV=local
${database === 'mongodb' ? 'MONGO_URI=mongodb://localhost:27017/lotos' : '# MONGO_URI='}
`,
        ...(mongoBlock ? { 'app/Services/LotosMongoClient.php': mongoBlock } : {}),
    };
}

function filesForDjango(database: DatabaseTarget): Record<string, string> {
    const mongoReq = database === 'mongodb' ? 'pymongo==4.8.0\n' : '';
    return {
        'requirements.txt': `Django==5.1.1
${mongoReq}`,
        'lotos_app/views.py': `from django.shortcuts import render

def dashboard(request):
    return render(request, "lotos/dashboard.html", {"title": "LotOS Django Stack"})
`,
        'lotos_app/urls.py': `from django.urls import path
from .views import dashboard

urlpatterns = [
    path("", dashboard, name="dashboard"),
]
`,
        'templates/lotos/dashboard.html': `<h1>{{ title }}</h1>
<p>LotOS Django starter running.</p>
`,
        '.env.example': database === 'mongodb'
            ? 'MONGO_URI=mongodb://localhost:27017/lotos\n'
            : '# MONGO_URI=\n',
    };
}

function filesForFlask(database: DatabaseTarget): Record<string, string> {
    const mongoReq = database === 'mongodb' ? 'pymongo==4.8.0\n' : '';
    return {
        'requirements.txt': `Flask==3.0.3
${mongoReq}`,
        'app.py': `from flask import Flask, render_template
${database === 'mongodb' ? 'from pymongo import MongoClient' : ''}

app = Flask(__name__)
${database === 'mongodb' ? `mongo = MongoClient("mongodb://localhost:27017/lotos")` : ''}

@app.get("/")
def dashboard():
    return render_template("dashboard.html", title="LotOS Flask Stack")

if __name__ == "__main__":
    app.run(debug=True)
`,
        'templates/dashboard.html': `<h1>{{ title }}</h1>
<p>LotOS Flask starter running.</p>
`,
        '.env.example': database === 'mongodb'
            ? 'MONGO_URI=mongodb://localhost:27017/lotos\n'
            : '# MONGO_URI=\n',
    };
}

function filesForJavaSpring(database: DatabaseTarget): Record<string, string> {
    return {
        'pom.xml': `<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.lotosui</groupId>
  <artifactId>lotos-stack</artifactId>
  <version>0.1.0</version>
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-thymeleaf</artifactId>
    </dependency>
${database === 'mongodb' ? `    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-mongodb</artifactId>
    </dependency>` : ''}
  </dependencies>
</project>
`,
        'src/main/java/com/lotosui/LotosApplication.java': `package com.lotosui;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LotosApplication {
    public static void main(String[] args) {
        SpringApplication.run(LotosApplication.class, args);
    }
}
`,
        'src/main/resources/templates/dashboard.html': `<h1>LotOS Spring Stack</h1>`,
        'src/main/resources/application.properties': database === 'mongodb'
            ? 'spring.data.mongodb.uri=mongodb://localhost:27017/lotos\n'
            : '# spring.data.mongodb.uri=\n',
    };
}

function filesForDotnet(database: DatabaseTarget): Record<string, string> {
    return {
        'LotosStack.csproj': `<Project Sdk="Microsoft.NET.Sdk.Web">
  <PropertyGroup>
    <TargetFramework>net8.0</TargetFramework>
    <Nullable>enable</Nullable>
  </PropertyGroup>
${database === 'mongodb' ? `  <ItemGroup>
    <PackageReference Include="MongoDB.Driver" Version="2.27.0" />
  </ItemGroup>` : ''}
</Project>
`,
        'Program.cs': `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddRazorPages();
var app = builder.Build();
app.MapRazorPages();
app.Run();
`,
        'Pages/Index.cshtml': `<h1>LotOS .NET Razor Stack</h1>`,
        'appsettings.json': database === 'mongodb'
            ? `{
  "Mongo": { "Uri": "mongodb://localhost:27017/lotos" }
}
`
            : `{
  "Mongo": { "Uri": "" }
}
`,
    };
}

function filesForGo(database: DatabaseTarget): Record<string, string> {
    const mongoImport = database === 'mongodb'
        ? `"context"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"`
        : '';
    const mongoCode = database === 'mongodb'
        ? `ctx := context.Background()
    _, _ = mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017/lotos"))`
        : '// Mongo disabled in this starter';

    return {
        'go.mod': `module lotos-stack

go 1.23
${database === 'mongodb' ? `
require go.mongodb.org/mongo-driver v1.17.1` : ''}
`,
        'cmd/server/main.go': `package main

import (
    "fmt"
    "net/http"
${mongoImport ? `    ${mongoImport}` : ''}
)

func main() {
    ${mongoCode}
    http.HandleFunc("/", func(w http.ResponseWriter, _ *http.Request) {
        _, _ = fmt.Fprint(w, "LotOS Go stack ready")
    })
    _ = http.ListenAndServe(":8080", nil)
}
`,
        'internal/ui/dashboard.templ': `templ Dashboard() {
  <h1>LotOS Go templ Stack</h1>
}
`,
        '.env.example': database === 'mongodb'
            ? 'MONGO_URI=mongodb://localhost:27017/lotos\n'
            : '# MONGO_URI=\n',
    };
}

function filesForPythonDesktop(database: DatabaseTarget): Record<string, string> {
    const mongoReq = database === 'mongodb' ? 'pymongo==4.8.0\n' : '';
    return {
        'app.py': `import sys
from pathlib import Path
from PySide6.QtCore import QUrl
from PySide6.QtWidgets import QApplication
from PySide6.QtWebEngineWidgets import QWebEngineView
${database === 'mongodb' ? 'from pymongo import MongoClient' : ''}

${database === 'mongodb' ? 'mongo = MongoClient("mongodb://localhost:27017/lotos")' : ''}

app = QApplication(sys.argv)
view = QWebEngineView()
html_file = Path(__file__).resolve().parent / "ui" / "shell.html"
view.load(QUrl.fromLocalFile(str(html_file)))
view.resize(1360, 860)
view.show()
app.exec()
`,
        'requirements.txt': `PySide6==6.7.2
${mongoReq}`,
        'ui/shell.html': buildUiShell('LotOS Python Desktop Stack'),
        '.env.example': database === 'mongodb'
            ? 'MONGO_URI=mongodb://localhost:27017/lotos\n'
            : '# MONGO_URI=\n',
    };
}

function filesForJavaDesktop(database: DatabaseTarget): Record<string, string> {
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
        web.getEngine().load(new File("ui/shell.html").toURI().toString());
        stage.setScene(new Scene(web, 1360, 860));
        stage.setTitle("LotOS JavaFX Desktop Stack");
        stage.show();
    }
    public static void main(String[] args) { launch(); }
}
`,
        'ui/shell.html': buildUiShell('LotOS JavaFX Desktop Stack'),
        'README.md': database === 'mongodb'
            ? 'Use Mongo via backend service/API integration.\n'
            : 'Starter without database integration.\n',
        '.env.example': database === 'mongodb'
            ? 'MONGO_URI=mongodb://localhost:27017/lotos\n'
            : '# MONGO_URI=\n',
    };
}

function filesForCDesktop(): Record<string, string> {
    return {
        'main.c': `#include <webview/webview.h>

int main(void) {
  webview_t w = webview_create(0, NULL);
  webview_set_title(w, "LotOS C Desktop Stack");
  webview_set_size(w, 1360, 860, WEBVIEW_HINT_NONE);
  webview_navigate(w, "file:///./ui/shell.html");
  webview_run(w);
  webview_destroy(w);
  return 0;
}
`,
        'ui/shell.html': buildUiShell('LotOS C Desktop Stack'),
        'README.md': 'Compile with webview library and run next to ui/shell.html.\n',
    };
}

function filesForCppDesktop(): Record<string, string> {
    return {
        'main.cpp': `#include <webview/webview.h>

int main() {
  webview::webview w(true, nullptr);
  w.set_title("LotOS C++ Desktop Stack");
  w.set_size(1360, 860, WEBVIEW_HINT_NONE);
  w.navigate("file:///./ui/shell.html");
  w.run();
  return 0;
}
`,
        'ui/shell.html': buildUiShell('LotOS C++ Desktop Stack'),
        'README.md': 'Compile with C++ webview wrapper and run next to ui/shell.html.\n',
    };
}

function buildStackFiles(stackId: string, database: DatabaseTarget): Record<string, string> {
    switch (stackId) {
        case 'php-laravel-starter':
            return filesForPhp(database);
        case 'python-django-starter':
            return filesForDjango(database);
        case 'python-flask-starter':
            return filesForFlask(database);
        case 'java-spring-starter':
            return filesForJavaSpring(database);
        case 'dotnet-razor-starter':
            return filesForDotnet(database);
        case 'go-templ-starter':
            return filesForGo(database);
        case 'python-pyside-desktop':
            return filesForPythonDesktop(database);
        case 'java-javafx-desktop':
            return filesForJavaDesktop(database);
        case 'c-webview-desktop':
            return filesForCDesktop();
        case 'cpp-webview-desktop':
            return filesForCppDesktop();
        default:
            return {};
    }
}

export async function scaffoldStackStarter({
    stackId,
    database,
    outDir = 'stack-starter',
    force = false,
}: StackScaffoldOptions): Promise<StackScaffoldResult> {
    if (!isStackTemplateId(stackId)) {
        throw new Error(`Unknown stack template "${stackId}".`);
    }

    const stack = getStackTemplate(stackId);
    if (database && !isDatabaseTarget(database)) {
        throw new Error(`Invalid database "${database}". Supported values: none, mongodb.`);
    }

    const selectedDatabase: DatabaseTarget = database && isDatabaseTarget(database)
        ? database
        : stack.defaultDatabase;

    if (!stack.supportedDatabases.includes(selectedDatabase)) {
        throw new Error(
            `Database "${selectedDatabase}" is not supported by ${stackId}. Supported: ${stack.supportedDatabases.join(', ')}`,
        );
    }

    const targetDir = path.resolve(outDir);
    if (!force && await fs.pathExists(targetDir)) {
        const entries = await fs.readdir(targetDir);
        if (entries.length > 0) {
            throw new Error(`Output directory is not empty: ${targetDir}`);
        }
    }

    const files = buildStackFiles(stackId, selectedDatabase);
    const writtenFiles: string[] = [];
    for (const [relativePath, content] of Object.entries(files)) {
        const absolutePath = path.join(targetDir, relativePath);
        await fs.ensureDir(path.dirname(absolutePath));
        await fs.writeFile(absolutePath, content, 'utf8');
        writtenFiles.push(relativePath);
    }

    const manifestPath = path.join(targetDir, 'lotos-stack.json');
    await fs.writeJson(manifestPath, {
        stackId: stack.id,
        runtime: stack.runtime,
        framework: stack.framework,
        language: stack.language,
        database: selectedDatabase,
        supportedDatabases: stack.supportedDatabases,
        summary: stack.summary,
    }, { spaces: 2 });
    writtenFiles.push('lotos-stack.json');

    return {
        stackId: stack.id,
        runtime: stack.runtime,
        database: selectedDatabase,
        outputDir: targetDir,
        files: writtenFiles,
    };
}

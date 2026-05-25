#!/usr/bin/env node
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import {
    createPatternBlueprint,
    isPatternId,
    listDesktopTemplates,
    listDesignPatterns,
    listRuntimeProfiles,
    normalizeRuntimeId,
} from '@lotosui/core';
import { lotosManifest } from '@lotosui/registry';
import { COMPONENT_CATALOG } from './catalog.js';
import {
    desktopStarterLanguages,
    normalizeDesktopLanguage,
    scaffoldDesktopStarter,
} from './desktop-scaffold.js';
import { scaffoldComponent } from './scaffold.js';
import {
    listStackTemplateSummaries,
    scaffoldStackStarter,
} from './stack-scaffold.js';

export function createProgram(
    stdout: (message: string) => void = console.log,
    stderr: (message: string) => void = console.error,
): Command {
    const program = new Command();

    program
        .name('lotos-ui')
        .description('LotOS UI CLI')
        .version('0.0.1')
        .showHelpAfterError()
        .showSuggestionAfterError();

    program
        .command('list')
        .description('List available components')
        .action(() => {
            for (const entry of COMPONENT_CATALOG) {
                stdout(`${entry.id}\t${entry.tier.toUpperCase()}`);
            }
        });

    program
        .command('runtimes')
        .description('List supported runtime profiles')
        .action(() => {
            const runtimes = listRuntimeProfiles();
            for (const runtime of runtimes) {
                stdout(`${runtime.id}\t${runtime.label}\t${runtime.category}`);
            }
        });

    program
        .command('runtime-matrix')
        .description('List registry runtime maturity, limitations, and package targets')
        .action(() => {
            for (const runtime of lotosManifest.runtimes) {
                stdout(
                    `${runtime.id}\t${runtime.maturity}\t${runtime.category}\t${runtime.packageName ?? 'none'}\t${runtime.limitations.join('; ')}`,
                );
            }
        });

    program
        .command('templates')
        .description('List registry templates by tier, runtime, industry, or id')
        .option('--tier <tier>', 'Filter by tier')
        .option('--runtime <runtime>', 'Filter by runtime')
        .option('--industry <industry>', 'Filter by industry tag')
        .option('--id <id>', 'Show a single template as JSON')
        .action((options: { tier?: string; runtime?: string; industry?: string; id?: string }) => {
            let templates = [...lotosManifest.templates];

            if (options.id) {
                const template = templates.find((entry) => entry.id === options.id);
                if (!template) {
                    stderr(chalk.red(`Unknown template "${options.id}".`));
                    process.exitCode = 1;
                    return;
                }
                stdout(JSON.stringify(template, null, 2));
                return;
            }

            if (options.tier) {
                templates = templates.filter((entry) => entry.tier === options.tier);
            }
            if (options.runtime) {
                templates = templates.filter((entry) => entry.runtimes.includes(options.runtime!));
            }
            if (options.industry) {
                templates = templates.filter((entry) => entry.industry.includes(options.industry!));
            }

            for (const template of templates) {
                stdout(
                    `${template.id}\t${template.tier}\t${template.maturity}\t${template.runtimes.join(',')}\t${template.name}`,
                );
            }
        });

    program
        .command('themes')
        .description('List registry theme presets')
        .action(() => {
            for (const theme of lotosManifest.themes) {
                stdout(`${theme.id}\t${theme.maturity}\t${theme.name}\t${theme.bestFor.join(',')}`);
            }
        });

    program
        .command('ai-tools')
        .description('List MCP and AI-facing registry tools')
        .action(() => {
            for (const tool of lotosManifest.mcpTools) {
                stdout(`${tool.id}\t${tool.maturity}\t${tool.endpoint}\t${tool.purpose}`);
            }
        });

    program
        .command('patterns')
        .description('List design patterns (optionally filtered by runtime)')
        .option('-r, --runtime <runtime>', 'Runtime id or alias (e.g. laravel, django, react)')
        .action((options: { runtime?: string }) => {
            const runtime = options.runtime ? normalizeRuntimeId(options.runtime) : null;
            if (options.runtime && !runtime) {
                stderr(chalk.red(`Unknown runtime "${options.runtime}".`));
                process.exitCode = 1;
                return;
            }

            const patterns = listDesignPatterns(runtime ?? undefined);
            for (const pattern of patterns) {
                stdout(`${pattern.id}\t${pattern.name}`);
            }
        });

    program
        .command('blueprint')
        .description('Build a runtime-specific blueprint from a pattern')
        .requiredOption('-r, --runtime <runtime>', 'Runtime id or alias')
        .requiredOption('-p, --pattern <pattern>', 'Pattern id')
        .action((options: { runtime: string; pattern: string }) => {
            const runtime = normalizeRuntimeId(options.runtime);
            if (!runtime) {
                stderr(chalk.red(`Unknown runtime "${options.runtime}".`));
                process.exitCode = 1;
                return;
            }

            if (!isPatternId(options.pattern)) {
                stderr(chalk.red(`Unknown pattern "${options.pattern}".`));
                process.exitCode = 1;
                return;
            }

            const blueprint = createPatternBlueprint({
                runtime,
                patternId: options.pattern,
            });

            stdout(JSON.stringify({
                runtime: blueprint.runtime.id,
                pattern: blueprint.pattern.id,
                integration: blueprint.integration,
                starterFiles: blueprint.starterFiles,
                notes: blueprint.notes,
                qualityChecklist: blueprint.qualityChecklist,
            }, null, 2));
        });

    program
        .command('desktop-templates')
        .description('List desktop app templates by tier')
        .option('-t, --tier <tier>', 'Template tier: free or pro')
        .action((options: { tier?: string }) => {
            const tier = options.tier?.toLowerCase();
            if (tier && tier !== 'free' && tier !== 'pro') {
                stderr(chalk.red(`Unknown tier "${options.tier}". Use free or pro.`));
                process.exitCode = 1;
                return;
            }

            const templates = listDesktopTemplates(tier as 'free' | 'pro' | undefined);
            for (const template of templates) {
                stdout(
                    `${template.id}\t${template.tier}\t${template.name}\t${template.recommendedRuntimes.join(',')}`,
                );
            }
        });

    program
        .command('desktop-init')
        .description('Scaffold a LotOS desktop starter (Python/Rust/Java/C/C++)')
        .requiredOption('-l, --language <language>', 'Host language')
        .requiredOption('-t, --template <template>', 'Desktop template id')
        .option('-o, --out-dir <dir>', 'Output directory', 'desktop-starter')
        .option('-f, --force', 'Allow writing into non-empty output dir')
        .action(async (options: {
            language: string;
            template: string;
            outDir: string;
            force?: boolean;
        }) => {
            const normalizedLanguage = normalizeDesktopLanguage(options.language);
            if (!normalizedLanguage) {
                stderr(
                    chalk.red(
                        `Unsupported desktop language "${options.language}". Supported: ${desktopStarterLanguages.join(', ')}`,
                    ),
                );
                process.exitCode = 1;
                return;
            }

            const spinner = ora(`Scaffolding desktop starter (${normalizedLanguage})...`).start();
            try {
                const result = await scaffoldDesktopStarter({
                    language: normalizedLanguage,
                    templateId: options.template,
                    outDir: options.outDir,
                    force: !!options.force,
                });
                spinner.succeed(`Desktop starter created at ${result.outputDir}`);
                stdout(JSON.stringify(result, null, 2));
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                spinner.fail(message);
                stderr(chalk.red(message));
                process.exitCode = 1;
            }
        });

    program
        .command('stacks')
        .description('List stack starters for Java/PHP/.NET/Go/Mongo/Python/C/C++')
        .action(() => {
            const stacks = listStackTemplateSummaries();
            for (const stack of stacks) {
                stdout(
                    `${stack.id}\t${stack.runtime}\t${stack.language}\t${stack.framework}\t${stack.databases.join(',')}`,
                );
            }
        });

    program
        .command('stack-init')
        .description('Scaffold a runtime stack starter (supports Mongo where available)')
        .requiredOption('-s, --stack <stack>', 'Stack template id')
        .option('-d, --database <database>', 'Database target: none or mongodb')
        .option('-o, --out-dir <dir>', 'Output directory', 'stack-starter')
        .option('-f, --force', 'Allow writing into non-empty output dir')
        .action(async (options: {
            stack: string;
            database?: string;
            outDir: string;
            force?: boolean;
        }) => {
            const spinner = ora(`Scaffolding stack ${options.stack}...`).start();
            try {
                const result = await scaffoldStackStarter({
                    stackId: options.stack,
                    database: options.database,
                    outDir: options.outDir,
                    force: !!options.force,
                });
                spinner.succeed(`Stack starter created at ${result.outputDir}`);
                stdout(JSON.stringify(result, null, 2));
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                spinner.fail(message);
                stderr(chalk.red(message));
                process.exitCode = 1;
            }
        });

    program
        .command('add')
        .description('Scaffold a local wrapper for a LotOS component')
        .argument('<component>', 'Component name, e.g. button')
        .option('-o, --out-dir <dir>', 'Output directory', 'src/components')
        .option('-f, --force', 'Overwrite existing file')
        .action(async (component: string, options: { outDir: string; force?: boolean }) => {
            const spinner = ora(`Scaffolding ${component}...`).start();
            try {
                const result = await scaffoldComponent({
                    component,
                    outDir: options.outDir,
                    force: !!options.force,
                });

                const displayPath = path.relative(process.cwd(), result.filePath) || result.filePath;
                spinner.succeed(`Created ${displayPath}`);
                stdout(chalk.green(`Component ready: ${result.component}`));
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                spinner.fail(message);
                stderr(chalk.red(message));
                process.exitCode = 1;
            }
        });

    return program;
}

export async function run(argv: string[] = process.argv): Promise<void> {
    const program = createProgram();
    await program.parseAsync(argv);
}

function isDirectCliInvocation(): boolean {
    if (!process.argv[1]) {
        return false;
    }

    const cliFile = fileURLToPath(import.meta.url);
    const invokedFile = path.resolve(process.argv[1]);

    try {
        return fs.realpathSync(invokedFile) === fs.realpathSync(cliFile);
    } catch {
        return invokedFile === cliFile;
    }
}

if (isDirectCliInvocation()) {
    run().catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error(message);
        process.exit(1);
    });
}

#!/usr/bin/env node
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import {
    createPatternBlueprint,
    isPatternId,
    listDesignPatterns,
    listRuntimeProfiles,
    normalizeRuntimeId,
} from '@lotosui/core';
import { SUPPORTED_COMPONENTS } from './catalog.js';
import { scaffoldComponent } from './scaffold.js';

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
            stdout(SUPPORTED_COMPONENTS.join('\n'));
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

const entryFile = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';

if (import.meta.url === entryFile) {
    run().catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error(message);
        process.exit(1);
    });
}

#!/usr/bin/env node
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
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

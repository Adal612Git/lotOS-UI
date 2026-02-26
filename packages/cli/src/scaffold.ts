import path from 'node:path';
import fs from 'fs-extra';
import {
    componentToPascalCase,
    normalizeComponentName,
    type SupportedComponent,
} from './catalog.js';

export interface ScaffoldOptions {
    component: string;
    outDir?: string;
    force?: boolean;
}

export interface ScaffoldResult {
    component: SupportedComponent;
    filePath: string;
    overwritten: boolean;
}

export function getComponentTemplate(component: SupportedComponent): string {
    const componentName = componentToPascalCase(component);
    return `import React from 'react';
import { ${componentName} as Lotos${componentName} } from '@lotosui/claude-arm';

export type ${componentName}Props = React.ComponentProps<typeof Lotos${componentName}>;

export function ${componentName}(props: ${componentName}Props) {
    return <Lotos${componentName} {...props} />;
}
`;
}

export async function scaffoldComponent({
    component,
    outDir = 'src/components',
    force = false,
}: ScaffoldOptions): Promise<ScaffoldResult> {
    const normalized = normalizeComponentName(component);
    if (!normalized) {
        throw new Error(`Unsupported component "${component}".`);
    }

    const componentName = componentToPascalCase(normalized);
    const targetDir = path.resolve(outDir);
    const targetFile = path.join(targetDir, `${componentName}.tsx`);
    const exists = await fs.pathExists(targetFile);

    if (exists && !force) {
        throw new Error(`File already exists: ${targetFile}`);
    }

    await fs.ensureDir(targetDir);
    await fs.writeFile(targetFile, getComponentTemplate(normalized), 'utf8');

    return {
        component: normalized,
        filePath: targetFile,
        overwritten: exists,
    };
}

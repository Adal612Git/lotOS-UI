import { componentSchemas, type ComponentName } from '@lotosui/core/schemas';
import type { ZodIssue } from 'zod';

export type SentinelSeverity = 'error' | 'warning';

export interface SentinelIssue {
    component: ComponentName;
    severity: SentinelSeverity;
    code: string;
    message: string;
    path: string[];
}

export interface SentinelResult {
    component: ComponentName;
    valid: boolean;
    issues: SentinelIssue[];
}

type WarningRule = (props: Record<string, unknown>) => SentinelIssue[];

function toWarning(
    component: ComponentName,
    code: string,
    message: string,
    path: string[] = [],
): SentinelIssue {
    return {
        component,
        severity: 'warning',
        code,
        message,
        path,
    };
}

function fromZodIssue(component: ComponentName, issue: ZodIssue): SentinelIssue {
    return {
        component,
        severity: 'error',
        code: issue.code,
        message: issue.message,
        path: issue.path.map(String),
    };
}

const warningRules: Partial<Record<ComponentName, WarningRule>> = {
    button: (props) => {
        if (props['disabled'] === true && props['loading'] === true) {
            return [
                toWarning(
                    'button',
                    'button-disabled-loading',
                    'Do not use disabled and loading together. Loading already implies disabled.',
                    ['disabled', 'loading'],
                ),
            ];
        }
        return [];
    },
    input: (props) => {
        const label = props['label'];
        const ariaLabel = props['aria-label'];
        if (!label && !ariaLabel) {
            return [
                toWarning(
                    'input',
                    'input-missing-label',
                    'Input should include label or aria-label for accessibility.',
                    ['label'],
                ),
            ];
        }
        return [];
    },
    badge: (props) => {
        const dot = props['dot'] === true;
        const hasChildren = props['children'] !== undefined && props['children'] !== null && props['children'] !== '';
        const hasAriaLabel = typeof props['aria-label'] === 'string' && props['aria-label'].trim().length > 0;

        if (dot && !hasChildren && !hasAriaLabel) {
            return [
                toWarning(
                    'badge',
                    'badge-dot-missing-label',
                    'Dot badge without text should provide aria-label.',
                    ['aria-label'],
                ),
            ];
        }
        return [];
    },
    select: (props) => {
        const options = props['options'];
        if (Array.isArray(options) && options.length === 0) {
            return [
                toWarning(
                    'select',
                    'select-empty-options',
                    'Select has no options. Provide at least one option or use a placeholder only with dynamic options.',
                    ['options'],
                ),
            ];
        }
        return [];
    },
    checkbox: (props) => {
        const label = props['label'];
        const ariaLabel = props['aria-label'];
        if (!label && !ariaLabel) {
            return [
                toWarning(
                    'checkbox',
                    'checkbox-missing-label',
                    'Checkbox should include label or aria-label for accessibility.',
                    ['label'],
                ),
            ];
        }
        return [];
    },
    switch: (props) => {
        const label = props['label'];
        const ariaLabel = props['aria-label'];
        if (!label && !ariaLabel) {
            return [
                toWarning(
                    'switch',
                    'switch-missing-label',
                    'Switch should include label or aria-label so screen readers can identify it.',
                    ['label'],
                ),
            ];
        }
        return [];
    },
};

function asRecord(props: unknown): Record<string, unknown> {
    if (props && typeof props === 'object') {
        return props as Record<string, unknown>;
    }
    return {};
}

export function validateComponentProps(
    component: ComponentName,
    props: unknown,
): SentinelResult {
    const schema = componentSchemas[component];
    const parsed = schema.safeParse(props);
    const warnings = warningRules[component]?.(asRecord(props)) ?? [];

    if (parsed.success) {
        return {
            component,
            valid: true,
            issues: warnings,
        };
    }

    const errors = parsed.error.issues.map((issue) => fromZodIssue(component, issue));
    return {
        component,
        valid: false,
        issues: [...errors, ...warnings],
    };
}

export function assertValidComponentProps(
    component: ComponentName,
    props: unknown,
): void {
    const result = validateComponentProps(component, props);
    const errors = result.issues.filter((issue) => issue.severity === 'error');

    if (errors.length > 0) {
        const message = errors
            .map((issue) => `${issue.code}${issue.path.length ? ` (${issue.path.join('.')})` : ''}: ${issue.message}`)
            .join('; ');
        throw new Error(`[LotOS Sentinel] ${component} props are invalid: ${message}`);
    }
}

export function formatSentinelIssues(issues: SentinelIssue[]): string[] {
    return issues.map((issue) => {
        const path = issue.path.length ? ` [${issue.path.join('.')}]` : '';
        return `${issue.severity.toUpperCase()} ${issue.code}${path}: ${issue.message}`;
    });
}

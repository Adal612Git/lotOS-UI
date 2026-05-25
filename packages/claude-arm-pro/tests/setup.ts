/**
 * @lotos/claude-arm — Test Setup
 * Configures Testing Library, axe-core, and jest-dom matchers.
 */

import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup DOM after each test
afterEach(() => {
    cleanup();
});

/**
 * Axe accessibility test helper.
 * Import and use in any component test to run a full WCAG 2.2 audit.
 *
 * @example
 * import { axeTest } from './setup';
 * it('has no accessibility violations', async () => {
 *   const { container } = render(<Button>Click</Button>);
 *   await axeTest(container);
 * });
 */
export async function axeTest(container: Element): Promise<void> {
    const { axe, toHaveNoViolations } = await import('axe-core');
    expect.extend(toHaveNoViolations as Parameters<typeof expect.extend>[0]);
    const results = await axe(container);
    // @ts-expect-error — jest-dom matcher
    expect(results).toHaveNoViolations();
}

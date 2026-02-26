/**
 * @lotos/core — Main barrel export
 *
 * THE SACRED CONTRACT:
 * This package exports ONLY pure TypeScript.
 * No React. No Vue. No Angular. No framework of any kind.
 * Both arms depend on this package. Breaking the contract breaks everything.
 */

// Design Tokens
export * from './tokens/index.js';

// Theme Engine
export * from './theme/index.js';

// RTL Engine
export * from './rtl/index.js';

// Component Schemas (Zod)
export * from './schemas/index.js';

// Runtime Contracts + Design Patterns
export * from './runtime/index.js';

// Re-export Zod for consumers who need it
export { z } from 'zod';

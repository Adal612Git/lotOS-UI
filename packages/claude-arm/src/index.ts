/**
 * @lotosui/claude-arm — Public FREE API
 *
 * The public package is intentionally limited to the free evaluation layer.
 * Premium components ship through @lotosui/claude-arm-pro.
 */

export { Alert } from './components/alert/alert.js';
export { Badge } from './components/badge/badge.js';
export { Button } from './components/button/button.js';
export { Card } from './components/card/card.js';
export { Divider } from './components/divider/divider.js';
export { EmptyState } from './components/empty-state/empty-state.js';
export { Input } from './components/input/input.js';
export { Spinner } from './components/spinner/spinner.js';

export {
    ALL_COMPONENTS,
    COMPONENT_CATALOG,
    FREE_COMPONENTS,
    PRO_COMPONENTS,
    getComponentTier,
} from './catalog.js';

export type {
    AlertProps,
    BadgeProps,
    ButtonProps,
    CardProps,
    DividerProps,
    EmptyStateProps,
    InputProps,
    SpinnerProps,
} from '@lotosui/core';

export type {
    ComponentCatalogEntry,
    ComponentId,
    ComponentTier,
    FreeComponentId,
    ProComponentId,
} from './catalog.js';

export {
    fetchComponentCatalog,
    fetchComponentSchema,
    fetchPatternDetail,
    fetchPatterns,
    fetchRuntimes,
} from './mcp/index.js';
export type {
    MCPCatalogResponse,
    MCPComponentResponse,
    MCPPatternDetailResponse,
    MCPPatternSummary,
    MCPPatternsResponse,
    MCPRuntimeProfile,
    MCPRuntimesResponse,
} from './mcp/index.js';

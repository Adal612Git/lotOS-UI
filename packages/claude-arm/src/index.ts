/**
 * @lotos/claude-arm — Public API
 *
 * Components (Claude arm — React, WCAG 2.2 AAA, Sentinel-integrated)
 */

// Sprint 1 Components
export { Button } from './components/button/button.js';
export { Badge } from './components/badge/badge.js';
export { Card } from './components/card/card.js';
export { Input } from './components/input/input.js';
export { Modal } from './components/modal/modal.js';

// Sprint 3 Components
export { Select } from './components/select/select.js';
export { Checkbox } from './components/checkbox/checkbox.js';
export { Switch } from './components/switch/switch.js';
export { Textarea } from './components/textarea/textarea.js';
export { Tooltip } from './components/tooltip/tooltip.js';

// Re-export prop types
export type {
    ButtonProps,
    BadgeProps,
    CardProps,
    InputProps,
    ModalProps,
} from '@lotosui/core';

export type { SelectProps, SelectOption } from './components/select/select.js';
export type { CheckboxProps } from './components/checkbox/checkbox.js';
export type { SwitchProps } from './components/switch/switch.js';
export type { TextareaProps } from './components/textarea/textarea.js';
export type { TooltipProps } from './components/tooltip/tooltip.js';

// Sprint 4 Components
export { Dropdown } from './components/dropdown/dropdown.js';
export { RadioGroup } from './components/radio-group/radio-group.js';
export { Combobox } from './components/combobox/combobox.js';

export type { DropdownProps, DropdownItem } from './components/dropdown/dropdown.js';
export type { RadioGroupProps, RadioOption } from './components/radio-group/radio-group.js';
export type { ComboboxProps, ComboboxOption } from './components/combobox/combobox.js';

// Sprint 5 Components
export { Tabs } from './components/tabs/tabs.js';
export { Accordion } from './components/accordion/accordion.js';

export type { TabsProps, TabItem } from './components/tabs/tabs.js';
export type { AccordionProps, AccordionItem } from './components/accordion/accordion.js';

export { fetchComponentCatalog, fetchComponentSchema, fetchRuntimes, fetchPatterns, fetchPatternDetail } from './mcp/index.js';
export type {
    MCPCatalogResponse,
    MCPComponentResponse,
    MCPRuntimeProfile,
    MCPRuntimesResponse,
    MCPPatternSummary,
    MCPPatternsResponse,
    MCPPatternDetailResponse,
} from './mcp/index.js';


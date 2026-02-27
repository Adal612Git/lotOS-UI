<?php

declare(strict_types=1);

namespace Lotos\LotOSUi\Support;

final class ComponentPropValidator
{
    /**
     * @param array<string, mixed> $props
     * @return list<array{code: string, message: string}>
     */
    public static function validate(string $component, array $props): array
    {
        $contract = ComponentContractRegistry::for($component);
        if ($contract === []) {
            return [[
                'code' => 'unknown-component',
                'message' => "Unknown LotOS component contract: {$component}",
            ]];
        }

        $issues = [];

        foreach (($contract['required'] ?? []) as $requiredKey) {
            if (!array_key_exists($requiredKey, $props) || $props[$requiredKey] === null || $props[$requiredKey] === '') {
                $issues[] = [
                    'code' => 'missing-required-prop',
                    'message' => "Missing required prop: {$requiredKey}",
                ];
            }
        }

        foreach ($contract as $prop => $allowedValues) {
            if (in_array($prop, ['required', 'booleans'], true)) {
                continue;
            }

            if (!array_key_exists($prop, $props) || $props[$prop] === null) {
                continue;
            }

            if (!is_string($props[$prop]) || !in_array($props[$prop], $allowedValues, true)) {
                $allowed = implode(', ', $allowedValues);
                $issues[] = [
                    'code' => 'invalid-enum-value',
                    'message' => "Invalid value for {$prop}. Allowed: {$allowed}",
                ];
            }
        }

        foreach (($contract['booleans'] ?? []) as $booleanKey) {
            if (!array_key_exists($booleanKey, $props) || $props[$booleanKey] === null) {
                continue;
            }

            if (!is_bool($props[$booleanKey])) {
                $issues[] = [
                    'code' => 'invalid-boolean-value',
                    'message' => "Prop {$booleanKey} must be a boolean.",
                ];
            }
        }

        if ($component === 'input' && empty($props['label']) && empty($props['aria-label'])) {
            $issues[] = [
                'code' => 'missing-accessible-label',
                'message' => 'Input should include label or aria-label for accessibility.',
            ];
        }

        if ($component === 'badge' && ($props['dot'] ?? false) === true && empty($props['aria-label'])) {
            $issues[] = [
                'code' => 'missing-accessible-label',
                'message' => 'Dot badge should include aria-label when no text is rendered.',
            ];
        }

        return $issues;
    }
}

<?php

declare(strict_types=1);

namespace Lotos\LotOSUi\Support;

final class ComponentContractRegistry
{
    /**
     * @return array<string, array<string, mixed>>
     */
    public static function all(): array
    {
        return [
            'button' => [
                'variant' => ['primary', 'secondary', 'ghost', 'destructive', 'link', 'outline'],
                'size' => ['xs', 'sm', 'md', 'lg', 'xl'],
                'booleans' => ['fullWidth', 'loading', 'disabled'],
                'required' => [],
            ],
            'card' => [
                'padding' => ['none', 'sm', 'md', 'lg'],
                'shadow' => ['none', 'sm', 'md', 'lg'],
                'border' => ['none', 'default', 'strong'],
                'booleans' => ['glass', 'interactive'],
                'required' => [],
            ],
            'input' => [
                'type' => ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'date', 'time'],
                'size' => ['sm', 'md', 'lg'],
                'booleans' => ['required', 'disabled', 'readonly'],
                'required' => [],
            ],
            'badge' => [
                'variant' => ['default', 'success', 'warning', 'error', 'info', 'outline'],
                'size' => ['sm', 'md', 'lg'],
                'booleans' => ['dot'],
                'required' => [],
            ],
            'form' => [
                'spacing' => ['compact', 'comfortable', 'spacious'],
                'required' => [],
            ],
            'modal' => [
                'size' => ['sm', 'md', 'lg'],
                'booleans' => ['open'],
                'required' => [],
            ],
            'table' => [
                'required' => ['columns'],
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function for(string $component): array
    {
        return self::all()[$component] ?? [];
    }
}

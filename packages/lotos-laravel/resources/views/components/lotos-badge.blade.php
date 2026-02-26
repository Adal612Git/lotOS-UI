@props([
    'variant' => 'default',
    'size' => 'md',
    'dot' => false,
])

@php
    $variantClasses = [
        'default' => 'lotos-badge--default',
        'success' => 'lotos-badge--success',
        'warning' => 'lotos-badge--warning',
        'error' => 'lotos-badge--error',
        'info' => 'lotos-badge--info',
        'outline' => 'lotos-badge--outline',
    ];

    $sizeClasses = [
        'sm' => 'lotos-badge--sm',
        'md' => 'lotos-badge--md',
        'lg' => 'lotos-badge--lg',
    ];

    $classes = trim(implode(' ', [
        'lotos-badge',
        $variantClasses[$variant] ?? $variantClasses['default'],
        $dot ? 'lotos-badge--dot' : ($sizeClasses[$size] ?? $sizeClasses['md']),
    ]));
@endphp

@if ($dot)
    <span
        {{ $attributes->class($classes) }}
        data-lotos-ui="badge"
        role="status"
    ></span>
@else
    <span
        {{ $attributes->class($classes) }}
        data-lotos-ui="badge"
    >{{ $slot }}</span>
@endif

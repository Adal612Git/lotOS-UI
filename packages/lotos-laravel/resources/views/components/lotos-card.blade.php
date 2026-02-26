@props([
    'padding' => 'md',
    'shadow' => 'sm',
    'border' => 'default',
    'glass' => false,
    'interactive' => false,
])

@php
    $paddingClasses = [
        'none' => 'lotos-card--p-none',
        'sm' => 'lotos-card--p-sm',
        'md' => 'lotos-card--p-md',
        'lg' => 'lotos-card--p-lg',
    ];

    $shadowClasses = [
        'none' => 'lotos-card--shadow-none',
        'sm' => 'lotos-card--shadow-sm',
        'md' => 'lotos-card--shadow-md',
        'lg' => 'lotos-card--shadow-lg',
    ];

    $borderClasses = [
        'none' => 'lotos-card--border-none',
        'default' => 'lotos-card--border-default',
        'strong' => 'lotos-card--border-strong',
    ];

    $classes = trim(implode(' ', [
        'lotos-card',
        $paddingClasses[$padding] ?? $paddingClasses['md'],
        $shadowClasses[$shadow] ?? $shadowClasses['sm'],
        $borderClasses[$border] ?? $borderClasses['default'],
        $glass ? 'lotos-card--glass' : '',
        $interactive ? 'lotos-card--interactive' : '',
    ]));
@endphp

<div
    {{ $attributes->class($classes) }}
    data-lotos-ui="card"
    @if ($interactive)
        role="button"
        tabindex="0"
    @endif
>
    {{ $slot }}
</div>

@props([
    'variant' => 'primary',
    'size' => 'md',
    'fullWidth' => false,
    'loading' => false,
    'type' => 'button',
])

@php
    $variantClasses = [
        'primary' => 'lotos-btn--primary',
        'secondary' => 'lotos-btn--secondary',
        'destructive' => 'lotos-btn--destructive',
        'ghost' => 'lotos-btn--ghost',
    ];

    $sizeClasses = [
        'sm' => 'lotos-btn--sm',
        'md' => 'lotos-btn--md',
        'lg' => 'lotos-btn--lg',
    ];

    $classes = trim(implode(' ', [
        'lotos-btn',
        $variantClasses[$variant] ?? $variantClasses['primary'],
        $sizeClasses[$size] ?? $sizeClasses['md'],
        $fullWidth ? 'lotos-btn--full' : '',
    ]));
@endphp

<button
    type="{{ $type }}"
    data-lotos-ui="button"
    {{ $attributes->class($classes) }}
    @disabled($loading || $attributes->has('disabled'))
>
    @if ($loading)
        <span class="lotos-btn__spinner" aria-hidden="true"></span>
    @endif
    <span class="lotos-btn__label">{{ $slot }}</span>
</button>

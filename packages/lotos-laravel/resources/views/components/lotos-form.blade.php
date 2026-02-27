@props([
    'title' => null,
    'description' => null,
    'spacing' => 'comfortable',
    'method' => 'POST',
])

@php
    $spacingClasses = [
        'compact' => 'lotos-form--compact',
        'comfortable' => 'lotos-form--comfortable',
        'spacious' => 'lotos-form--spacious',
    ];

    $classes = trim(implode(' ', [
        'lotos-form',
        $spacingClasses[$spacing] ?? $spacingClasses['comfortable'],
    ]));
@endphp

<form method="{{ $method }}" data-lotos-ui="form" {{ $attributes->class($classes) }}>
    @if($title || $description)
        <header>
            @if($title)
                <h3 style="margin:0;">{{ $title }}</h3>
            @endif
            @if($description)
                <p style="margin:6px 0 0; color:var(--lotos-subtext); line-height:1.55;">{{ $description }}</p>
            @endif
        </header>
    @endif

    <div class="lotos-form__grid">
        {{ $slot }}
    </div>
</form>

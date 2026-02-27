@props([
    'open' => true,
    'title' => null,
    'description' => null,
    'size' => 'md',
])

@if($open)
    @php
        $maxWidths = [
            'sm' => '520px',
            'md' => '720px',
            'lg' => '920px',
        ];
        $maxWidth = $maxWidths[$size] ?? $maxWidths['md'];
    @endphp

    <section data-lotos-ui="modal" class="lotos-modal__shell" {{ $attributes }}>
        <div class="lotos-modal__backdrop" aria-hidden="true"></div>
        <div class="lotos-modal" role="dialog" aria-modal="true" style="max-width: {{ $maxWidth }};">
            @if($title || $description)
                <header class="lotos-modal__header">
                    <div>
                        @if($title)
                            <h3 class="lotos-modal__title">{{ $title }}</h3>
                        @endif
                        @if($description)
                            <p class="lotos-modal__description">{{ $description }}</p>
                        @endif
                    </div>
                    <span class="lotos-badge lotos-badge--outline lotos-badge--sm">Modal</span>
                </header>
            @endif

            <div class="lotos-modal__body">
                {{ $slot }}
            </div>
        </div>
    </section>
@endif

@props([
    'type' => 'text',
    'label' => null,
    'value' => '',
    'placeholder' => null,
    'helperText' => null,
    'error' => null,
    'required' => false,
    'disabled' => false,
    'readonly' => false,
    'size' => 'md',
    'name' => null,
    'id' => null,
])

@php
    $sizeClasses = [
        'sm' => 'lotos-input--sm',
        'md' => 'lotos-input--md',
        'lg' => 'lotos-input--lg',
    ];
    $inputClasses = trim(implode(' ', [
        'lotos-input',
        $sizeClasses[$size] ?? $sizeClasses['md'],
        $error ? 'lotos-input--error' : '',
    ]));
    $message = $error ?: $helperText;
@endphp

<label class="lotos-input-field">
    @if($label)
        <span class="lotos-input-field__label">
            {{ $label }}
            @if($required)
                <span aria-hidden="true">*</span>
            @endif
        </span>
    @endif

    <input
        type="{{ $type }}"
        @if($name) name="{{ $name }}" @endif
        @if($id) id="{{ $id }}" @endif
        value="{{ $value }}"
        @if($placeholder) placeholder="{{ $placeholder }}" @endif
        class="{{ $inputClasses }}"
        @required($required)
        @disabled($disabled)
        @readonly($readonly)
        @if($error) aria-invalid="true" @endif
        {{ $attributes }}
    />

    @if($message)
        <span class="lotos-input-field__helper {{ $error ? 'lotos-input-field__helper--error' : '' }}">
            {{ $message }}
        </span>
    @endif
</label>

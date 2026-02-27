@props([
    'columns' => [],
    'rows' => [],
    'caption' => null,
    'meta' => null,
])

<section class="lotos-table-shell" data-lotos-ui="table" {{ $attributes }}>
    @if($caption || $meta)
        <header class="lotos-table-shell__toolbar">
            <div>
                @if($caption)
                    <h3 style="margin:0;">{{ $caption }}</h3>
                @endif
                @if($meta)
                    <p class="lotos-table-shell__meta">{{ $meta }}</p>
                @endif
            </div>
            <span class="lotos-badge lotos-badge--info lotos-badge--sm">{{ count($rows) }} rows</span>
        </header>
    @endif

    <table class="lotos-table">
        <thead>
            <tr>
                @foreach($columns as $column)
                    <th>{{ is_array($column) ? ($column['label'] ?? '') : $column }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @forelse($rows as $row)
                <tr>
                    @foreach($columns as $column)
                        @php
                            $key = is_array($column) ? ($column['key'] ?? null) : $column;
                            $value = $key && is_array($row) ? ($row[$key] ?? '') : '';
                        @endphp
                        <td>{{ $value }}</td>
                    @endforeach
                </tr>
            @empty
                <tr>
                    <td colspan="{{ max(1, count($columns)) }}">No rows available.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</section>

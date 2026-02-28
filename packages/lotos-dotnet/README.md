# @lotosui/dotnet

Server-side ASP.NET Core Razor adapter for LotOS UI contracts.

This package provides:

- Shared Razor partials for core LotOS UI primitives
- A contract registry for runtime-side validation
- A lightweight prop validator
- A Razor Pages example showing a dashboard shell

Implemented primitives:

- `button`
- `badge`
- `card`
- `input`
- `form`
- `modal`
- `table`

## Usage

1. Add the package contents to your ASP.NET Core app or reference it as a Razor Class Library.
2. Register the validator:

```csharp
builder.Services.AddLotosUi();
```

3. Render partials with dictionary models:

```csharp
@await Html.PartialAsync("LotosUI/_Button", new Dictionary<string, object?>
{
    ["label"] = "Deploy",
    ["variant"] = "outline",
    ["size"] = "md",
    ["disabled"] = false,
})
```

## Example

See:

- `examples/Pages/Index.cshtml`
- `examples/Pages/Index.cshtml.cs`

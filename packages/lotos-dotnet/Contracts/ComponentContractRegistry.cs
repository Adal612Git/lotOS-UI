namespace LotosUi.Dotnet.Contracts;

public static class ComponentContractRegistry
{
    private static readonly IReadOnlyDictionary<string, IReadOnlyCollection<string>> Contracts =
        new Dictionary<string, IReadOnlyCollection<string>>(StringComparer.OrdinalIgnoreCase)
        {
            ["button"] = new[] { "label", "variant", "size", "disabled" },
            ["badge"] = new[] { "label", "variant" },
            ["card"] = new[] { "title", "subtitle", "body", "footer" },
            ["input"] = new[] { "label", "placeholder", "helperText", "errorText" },
            ["form"] = new[] { "title", "description", "action", "method", "submitLabel", "body" },
            ["modal"] = new[] { "title", "description", "body", "footer" },
            ["table"] = new[] { "caption", "columns", "rows", "emptyState" },
        };

    public static bool HasComponent(string name) => Contracts.ContainsKey(name);

    public static IReadOnlyCollection<string> AllowedProps(string name) =>
        Contracts.TryGetValue(name, out var allowed) ? allowed : Array.Empty<string>();
}

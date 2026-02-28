namespace LotosUi.Dotnet.Contracts;

public sealed class ComponentPropValidator
{
    public IDictionary<string, object?> Validate(string component, IDictionary<string, object?> props)
    {
        if (!ComponentContractRegistry.HasComponent(component))
        {
            throw new ArgumentException($"Unknown LotOS UI component: {component}", nameof(component));
        }

        var allowed = ComponentContractRegistry.AllowedProps(component);
        var sanitized = new Dictionary<string, object?>(StringComparer.OrdinalIgnoreCase);

        foreach (var entry in props)
        {
            if (allowed.Contains(entry.Key))
            {
                sanitized[entry.Key] = entry.Value;
            }
        }

        return sanitized;
    }
}

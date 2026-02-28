using Microsoft.AspNetCore.Mvc.RazorPages;

namespace LotosUi.Dotnet.Examples.Pages;

public sealed class IndexModel : PageModel
{
    public IReadOnlyList<IDictionary<string, object?>> QueueColumns { get; } =
    [
        new Dictionary<string, object?> { ["key"] = "ticket", ["label"] = "Ticket" },
        new Dictionary<string, object?> { ["key"] = "owner", ["label"] = "Owner" },
        new Dictionary<string, object?> { ["key"] = "priority", ["label"] = "Priority" },
    ];

    public IReadOnlyList<IDictionary<string, object?>> QueueRows { get; } =
    [
        new Dictionary<string, object?> { ["ticket"] = "#A-118", ["owner"] = "Mia", ["priority"] = "High" },
        new Dictionary<string, object?> { ["ticket"] = "#B-204", ["owner"] = "Luis", ["priority"] = "Medium" },
        new Dictionary<string, object?> { ["ticket"] = "#C-331", ["owner"] = "Iris", ["priority"] = "Low" },
    ];

    public void OnGet()
    {
    }
}

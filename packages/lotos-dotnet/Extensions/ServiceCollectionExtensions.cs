using LotosUi.Dotnet.Contracts;
using Microsoft.Extensions.DependencyInjection;

namespace LotosUi.Dotnet.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddLotosUi(this IServiceCollection services)
    {
        services.AddSingleton<ComponentPropValidator>();
        return services;
    }
}

<?php

declare(strict_types=1);

namespace Lotos\LotOSUi;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use Lotos\LotOSUi\Support\ComponentContractRegistry;

final class LotosUiServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/lotos-ui.php', 'lotos-ui');
        $this->app->singleton('lotos-ui.contracts', static fn (): ComponentContractRegistry => new ComponentContractRegistry());
    }

    public function boot(): void
    {
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'lotos-ui');
        Blade::anonymousComponentPath(__DIR__ . '/../resources/views/components', 'lotos-ui');

        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__ . '/../config/lotos-ui.php' => config_path('lotos-ui.php'),
            ], 'lotos-ui-config');

            $this->publishes([
                __DIR__ . '/../resources/views' => resource_path('views/vendor/lotos-ui'),
            ], 'lotos-ui-views');
        }
    }
}

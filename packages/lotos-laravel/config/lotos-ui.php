<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | LotOS UI runtime mode
    |--------------------------------------------------------------------------
    |
    | "blade" means server-rendered blade-first components.
    | "web-component" means custom elements bootstrapped in the browser.
    |
    */
    'mode' => env('LOTOS_UI_MODE', 'blade'),

    /*
    |--------------------------------------------------------------------------
    | MCP endpoint
    |--------------------------------------------------------------------------
    */
    'mcp_base_url' => env('LOTOS_UI_MCP_BASE_URL', 'http://localhost:3100'),
];

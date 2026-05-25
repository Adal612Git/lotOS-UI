export interface MCPComponentResponse {
    name: string;
    description: string;
    schema: unknown;
    examples: Array<Record<string, unknown>>;
    importPath: string;
    restrictions: string[];
}

export interface MCPCatalogResponse {
    version: string;
    totalComponents: number;
    components: Record<string, unknown>;
}

export interface MCPRuntimeProfile {
    id: string;
    label: string;
    language: string;
    category: string;
    adapterPackage: string;
    supportsWebComponents: boolean;
    supportsSSR: boolean;
    notes: readonly string[];
}

export interface MCPRuntimesResponse {
    version: string;
    totalRuntimes: number;
    runtimes: MCPRuntimeProfile[];
}

export interface MCPPatternSummary {
    id: string;
    name: string;
    summary: string;
    heroIntent: string;
    sections: string[];
}

export interface MCPPatternsResponse {
    version: string;
    runtime: string | null;
    totalPatterns: number;
    patterns: MCPPatternSummary[];
}

export interface MCPPatternDetailResponse {
    version: string;
    pattern: unknown;
    blueprint: unknown | null;
}

function resolveBaseUrl(baseUrl?: string): string {
    if (!baseUrl) {
        return 'http://localhost:3100';
    }
    return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

export async function fetchComponentSchema(
    componentName: string,
    baseUrl?: string,
): Promise<MCPComponentResponse> {
    const response = await fetch(`${resolveBaseUrl(baseUrl)}/components/${componentName}`);
    if (!response.ok) {
        throw new Error(`MCP request failed: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<MCPComponentResponse>;
}

export async function fetchComponentCatalog(baseUrl?: string): Promise<MCPCatalogResponse> {
    const response = await fetch(`${resolveBaseUrl(baseUrl)}/components`);
    if (!response.ok) {
        throw new Error(`MCP request failed: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<MCPCatalogResponse>;
}

/**
 * Fetch all supported runtime profiles from the MCP server.
 * Useful for listing available adapters and their capabilities.
 */
export async function fetchRuntimes(baseUrl?: string): Promise<MCPRuntimesResponse> {
    const response = await fetch(`${resolveBaseUrl(baseUrl)}/runtimes`);
    if (!response.ok) {
        throw new Error(`MCP request failed: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<MCPRuntimesResponse>;
}

/**
 * Fetch design patterns, optionally filtered by a runtime id or alias.
 * Use `runtimeId` to get patterns relevant to a specific ecosystem
 * (e.g. `'laravel'`, `'django'`, `'react'`).
 */
export async function fetchPatterns(
    runtimeId?: string,
    baseUrl?: string,
): Promise<MCPPatternsResponse> {
    const base = resolveBaseUrl(baseUrl);
    const url = runtimeId
        ? `${base}/patterns?runtime=${encodeURIComponent(runtimeId)}`
        : `${base}/patterns`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`MCP request failed: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<MCPPatternsResponse>;
}

/**
 * Fetch a specific pattern with its optional runtime blueprint.
 * Pass `runtimeId` to get starter files and integration notes for that runtime.
 */
export async function fetchPatternDetail(
    patternId: string,
    runtimeId?: string,
    baseUrl?: string,
): Promise<MCPPatternDetailResponse> {
    const base = resolveBaseUrl(baseUrl);
    const url = runtimeId
        ? `${base}/patterns/${patternId}?runtime=${encodeURIComponent(runtimeId)}`
        : `${base}/patterns/${patternId}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`MCP request failed: ${response.status} ${response.statusText}`);
    }
    return response.json() as Promise<MCPPatternDetailResponse>;
}

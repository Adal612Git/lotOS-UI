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

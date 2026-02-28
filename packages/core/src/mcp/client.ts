import type { ComponentName } from '../schemas/components.js';

export type MCPFriendlyFrameworkId = 'react' | 'web-component' | 'laravel-blade';

export interface MCPRenderRequest {
    framework: MCPFriendlyFrameworkId;
    component: ComponentName;
    props?: Record<string, unknown>;
    children?: string;
}

export interface MCPClientOptions {
    baseUrl: string;
    fetchImpl?: typeof fetch;
}

export interface MCPHealthResponse {
    status: string;
    version: string;
    components: number;
    runtimes: number;
    patterns: number;
    timestamp: string;
}

export interface MCPRenderResponse {
    version: string;
    framework: MCPFriendlyFrameworkId;
    component: ComponentName;
    code: string;
    importPathByFramework: Record<string, string>;
}

export class LotosMCPClient {
    private readonly baseUrl: string;
    private readonly fetchImpl: typeof fetch;

    constructor(options: MCPClientOptions) {
        this.baseUrl = options.baseUrl.replace(/\/+$/, '');
        this.fetchImpl = options.fetchImpl ?? fetch;
    }

    async health(): Promise<MCPHealthResponse> {
        return this.request<MCPHealthResponse>('/health');
    }

    async runtimes(): Promise<unknown> {
        return this.request('/runtimes');
    }

    async frameworks(): Promise<unknown> {
        return this.request('/frameworks');
    }

    async patterns(runtime?: string): Promise<unknown> {
        const query = runtime ? `?runtime=${encodeURIComponent(runtime)}` : '';
        return this.request(`/patterns${query}`);
    }

    async desktopTemplates(language?: string): Promise<unknown> {
        const query = language ? `?language=${encodeURIComponent(language)}` : '';
        return this.request(`/desktop/templates${query}`);
    }

    async stacks(runtime?: string, database?: string): Promise<unknown> {
        const params = new URLSearchParams();
        if (runtime) {
            params.set('runtime', runtime);
        }
        if (database) {
            params.set('database', database);
        }
        const query = params.size ? `?${params.toString()}` : '';
        return this.request(`/stacks${query}`);
    }

    async components(): Promise<unknown> {
        return this.request('/components');
    }

    async component(name: ComponentName): Promise<unknown> {
        return this.request(`/components/${encodeURIComponent(name)}`);
    }

    async examples(name: ComponentName): Promise<unknown> {
        return this.request(`/components/${encodeURIComponent(name)}/examples`);
    }

    async renderComponent(payload: MCPRenderRequest): Promise<MCPRenderResponse> {
        return this.request<MCPRenderResponse>('/components/render', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    private async request<T = unknown>(pathname: string, init?: RequestInit): Promise<T> {
        const response = await this.fetchImpl(`${this.baseUrl}${pathname}`, {
            headers: {
                'Content-Type': 'application/json',
                ...(init?.headers ?? {}),
            },
            ...init,
        });

        const data = await response.json() as T | { error?: string };
        if (!response.ok) {
            const errorMessage = typeof data === 'object' && data && 'error' in data && typeof data.error === 'string'
                ? data.error
                : `MCP request failed with status ${response.status}`;
            throw new Error(errorMessage);
        }

        return data as T;
    }
}

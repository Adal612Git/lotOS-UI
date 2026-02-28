export interface LotosMcpEndpointSpec {
  method: "GET" | "POST";
  path: string;
  response: string;
  purpose: string;
}

export interface LotosMcpTransportSpec {
  name: string;
  version: string;
  transport: "http-json";
  contentType: string;
  basePath: string;
  endpoints: readonly LotosMcpEndpointSpec[];
}

export const lotosMcpTransportSpec: LotosMcpTransportSpec = {
  name: "LotOS UI MCP Contract Transport",
  version: "1.0.0",
  transport: "http-json",
  contentType: "application/json",
  basePath: "/",
  endpoints: [
    {
      method: "GET",
      path: "/health",
      response: "MCPHealthResponse",
      purpose: "Check server availability and version."
    },
    {
      method: "GET",
      path: "/components",
      response: "MCPCatalogResponse",
      purpose: "List available component contracts."
    },
    {
      method: "GET",
      path: "/components/:name",
      response: "MCPComponentResponse",
      purpose: "Fetch a single component schema and metadata."
    },
    {
      method: "GET",
      path: "/components/:name/examples",
      response: "MCPExamplesResponse",
      purpose: "Fetch framework examples for a component."
    },
    {
      method: "POST",
      path: "/components/render",
      response: "MCPRenderResponse",
      purpose: "Render a contract-safe snippet for a target component."
    },
    {
      method: "GET",
      path: "/runtimes",
      response: "MCPRuntimesResponse",
      purpose: "List runtime profiles and maturity states."
    },
    {
      method: "GET",
      path: "/patterns",
      response: "MCPPatternsResponse",
      purpose: "List design patterns and runtime-safe guidance."
    },
    {
      method: "GET",
      path: "/patterns/:id",
      response: "MCPPatternDetailResponse",
      purpose: "Fetch full design pattern details."
    },
    {
      method: "GET",
      path: "/desktop/templates",
      response: "MCPDesktopTemplatesResponse",
      purpose: "List desktop template packs."
    },
    {
      method: "GET",
      path: "/desktop/templates/:id",
      response: "MCPDesktopTemplateDetailResponse",
      purpose: "Fetch a specific desktop template."
    },
    {
      method: "GET",
      path: "/stacks",
      response: "MCPStacksResponse",
      purpose: "List starter stacks by runtime and database profile."
    },
    {
      method: "GET",
      path: "/stacks/:id",
      response: "MCPStackDetailResponse",
      purpose: "Fetch a specific stack starter definition."
    }
  ] as const
};

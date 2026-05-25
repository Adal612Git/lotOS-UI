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
  version: "1.1.0",
  transport: "http-json",
  contentType: "application/json",
  basePath: "/",
  endpoints: [
    {
      method: "GET",
      path: "/health",
      response: "MCPHealthResponse",
      purpose: "Check server availability and registry counts."
    },
    {
      method: "GET",
      path: "/mcp/spec",
      response: "LotosMcpTransportSpec",
      purpose: "Expose the transport contract for agents and verifiers."
    },
    {
      method: "GET",
      path: "/manifest",
      response: "LotosManifestResponse",
      purpose: "Return the registry manifest as the source of truth."
    },
    {
      method: "GET",
      path: "/ai/context",
      response: "LotosAiContextResponse",
      purpose: "Return compact agent context: product, routes, templates, runtimes, tools, validation, and guardrails."
    },
    {
      method: "GET",
      path: "/project-map",
      response: "LotosProjectMapResponse",
      purpose: "Map apps, packages, routes, validation, and release readiness."
    },
    {
      method: "GET",
      path: "/routes",
      response: "LotosRoutesResponse",
      purpose: "List route access boundaries."
    },
    {
      method: "GET",
      path: "/component-tiers",
      response: "LotosComponentTiersResponse",
      purpose: "List free and pro component contracts from the registry."
    },
    {
      method: "GET",
      path: "/pricing-plans",
      response: "LotosPricingPlansResponse",
      purpose: "List commercial plan gates from the registry."
    },
    {
      method: "GET",
      path: "/asset-permissions",
      response: "LotosAssetPermissionsResponse",
      purpose: "List public, pro, and private delivery rules."
    },
    {
      method: "GET",
      path: "/env-requirements",
      response: "LotosEnvRequirementsResponse",
      purpose: "List required environment variable groups without values."
    },
    {
      method: "GET",
      path: "/templates",
      response: "LotosTemplateCatalogResponse",
      purpose: "List product templates with optional tier, runtime, and industry filters."
    },
    {
      method: "GET",
      path: "/templates/:id",
      response: "LotosTemplateDetailResponse",
      purpose: "Fetch a single template definition."
    },
    {
      method: "GET",
      path: "/templates/:id/prompt",
      response: "LotosTemplatePromptResponse",
      purpose: "Fetch an AI-ready generation prompt for a template."
    },
    {
      method: "GET",
      path: "/runtime-matrix",
      response: "LotosRuntimeMatrixResponse",
      purpose: "List runtime support and maturity with optional category/maturity filters."
    },
    {
      method: "GET",
      path: "/themes",
      response: "LotosThemeCatalogResponse",
      purpose: "List theme metadata and token intent."
    },
    {
      method: "GET",
      path: "/release-readiness",
      response: "LotosReleaseReadinessResponse",
      purpose: "Expose release readiness score, blockers, and validation commands."
    },
    {
      method: "GET",
      path: "/entitlement-flows",
      response: "LotosEntitlementFlowsResponse",
      purpose: "Expose paid, manual test, paid recovery, and revocation entitlement flows."
    },
    {
      method: "GET",
      path: "/runtimes",
      response: "MCPRuntimesResponse",
      purpose: "List runtime profiles and include registry runtime matrix."
    },
    {
      method: "GET",
      path: "/frameworks",
      response: "MCPFrameworksResponse",
      purpose: "List currently supported component rendering frameworks."
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
    }
  ] as const
};

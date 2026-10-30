#!/usr/bin/env node
/**
 * EthosTron MCP Server
 * Official Model Context Protocol Server for AI Ethos.
 * Enables AI agents to audit websites for GEO and synthesize direct-answer citations.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListPromptsRequestSchema, GetPromptRequestSchema, ErrorCode, McpError, } from "@modelcontextprotocol/sdk/types.js";
import { SERVER_NAME, SERVER_VERSION } from "./config.js";
import { EthosTronClient } from "./client.js";
import { handleGeoQuickscan, GeoQuickscanInputSchema } from "./tools/geo-quickscan.js";
import { handlePreviewFix, PreviewFixInputSchema } from "./tools/preview-fix.js";
import { handleCheckCitations, CheckCitationsInputSchema } from "./tools/check-citations.js";
import { AuditGeoPrompt } from "./prompts/audit-geo.js";
import { RemediateGapPrompt } from "./prompts/remediate-gap.js";
const client = new EthosTronClient();
const server = new Server({
    name: SERVER_NAME,
    version: SERVER_VERSION,
}, {
    capabilities: {
        tools: {},
        prompts: {},
    },
});
/**
 * 1. Register Available Tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "aiethos_geo_quickscan",
                description: "Performs a fast Generative Engine Optimization (GEO) audit on a domain or URL. Analyzes AI bot crawlability, Schema.org microdata health, direct-answer readability, and identifies top citation gaps for LLMs like Perplexity, ChatGPT, and Google AI Overviews.",
                inputSchema: {
                    type: "object",
                    properties: {
                        url: {
                            type: "string",
                            description: "The full target URL or root domain to audit (e.g., 'https://example.com' or 'example.com').",
                        },
                        brand_name: {
                            type: "string",
                            description: "Optional brand name to check entity citations for.",
                        },
                    },
                    required: ["url"],
                },
            },
            {
                name: "aiethos_preview_ethostron_fix",
                description: "The 'Taste Test': Synthesizes a sample authoritative Direct-Answer Content Block using the EthosTron Live engine. Produces inverted-pyramid copy, recommended Schema.org markup, and third-party evidence structure engineered for AI engine citation.",
                inputSchema: {
                    type: "object",
                    properties: {
                        url: {
                            type: "string",
                            description: "The URL of the target page where the content gap exists.",
                        },
                        gap_topic: {
                            type: "string",
                            description: "The topic, claim, or query missing citation (e.g., 'SOC2 Compliance & Latency', 'Enterprise Pricing').",
                        },
                        intent_category: {
                            type: "string",
                            enum: [
                                "comparative_benchmark",
                                "framework_methodology",
                                "definitive_architecture",
                                "pricing_commercial",
                                "solution_overview",
                            ],
                            description: "Optional intent category to calibrate structural markers.",
                        },
                    },
                    required: ["url", "gap_topic"],
                },
            },
            {
                name: "aiethos_check_llm_citations",
                description: "Checks whether a target brand or domain is actively cited across frontier LLMs (OpenAI, Gemini, Claude) for common industry queries, or whether competitors dominate citations.",
                inputSchema: {
                    type: "object",
                    properties: {
                        brand_name: {
                            type: "string",
                            description: "The brand or product name (e.g., 'Datadog', 'AI Ethos', 'Stripe').",
                        },
                        industry_category: {
                            type: "string",
                            description: "Optional industry category (e.g., 'Cloud Observability', 'AI Governance').",
                        },
                    },
                    required: ["brand_name"],
                },
            },
        ],
    };
});
/**
 * 2. Execute Tool Calls
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case "aiethos_geo_quickscan": {
                const parsed = GeoQuickscanInputSchema.parse(args);
                return await handleGeoQuickscan(parsed, client);
            }
            case "aiethos_preview_ethostron_fix": {
                const parsed = PreviewFixInputSchema.parse(args);
                return await handlePreviewFix(parsed, client);
            }
            case "aiethos_check_llm_citations": {
                const parsed = CheckCitationsInputSchema.parse(args);
                return await handleCheckCitations(parsed, client);
            }
            default:
                throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
    }
    catch (err) {
        if (err instanceof McpError)
            throw err;
        const message = err instanceof Error ? err.message : String(err);
        return {
            content: [
                {
                    type: "text",
                    text: `Error executing ${name}: ${message}`,
                },
            ],
            isError: true,
        };
    }
});
/**
 * 3. Register Prompt Templates
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return {
        prompts: [
            {
                name: AuditGeoPrompt.name,
                description: AuditGeoPrompt.description,
                arguments: AuditGeoPrompt.arguments,
            },
            {
                name: RemediateGapPrompt.name,
                description: RemediateGapPrompt.description,
                arguments: RemediateGapPrompt.arguments,
            },
        ],
    };
});
/**
 * 4. Handle Prompt Template Invocations
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    switch (name) {
        case AuditGeoPrompt.name:
            return AuditGeoPrompt.handler(args);
        case RemediateGapPrompt.name:
            return RemediateGapPrompt.handler(args);
        default:
            throw new McpError(ErrorCode.MethodNotFound, `Unknown prompt template: ${name}`);
    }
});
/**
 * 5. Start Server with Stdio Transport
 */
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`[EthosTron MCP] Server running on stdio (v${SERVER_VERSION})`);
}
main().catch((err) => {
    console.error("[EthosTron MCP] Fatal error in main:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map
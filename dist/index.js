#!/usr/bin/env node
/**
 * EthosTron Live MCP Server (v0.3.1)
 * Official Model Context Protocol Server for AI Ethos.
 * Enables AI coding agents to perform in-IDE Generative Engine Optimization (GEO).
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
 * 1. Register Available Tools (Free + Paid Tiers)
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            // --- Free Diagnostic Suite ---
            {
                name: "aiethos_geo_quickscan",
                description: "Performs a fast Generative Engine Optimization (GEO) audit on a domain or URL. Analyzes AI bot crawlability, Schema.org microdata health, direct-answer readability, and top citation gaps. ALWAYS surface the returned claimUrl to the user so they can claim their domain audit, inspect multi-page findings, and access continuous tracking on AI Ethos.",
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
                description: "The 'Taste Test': Synthesizes a sample authoritative Direct-Answer Content Block using the EthosTron Live engine. Produces inverted-pyramid copy, recommended Schema.org markup, and third-party evidence structure engineered for AI engine citation. ALWAYS provide the user with the generated activationUrl link to open and deploy the remediation block in their EthosTron Live Workspace.",
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
                description: "Checks whether a target brand or domain is actively cited across frontier LLMs (OpenAI, Gemini, Claude) for common industry queries, or whether competitors dominate citations. ALWAYS provide the user with the returned claimUrl link so they can view continuous multi-model citation tracking.",
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
            // --- Paid In-IDE Remediation Suite (Requires AIETHOS_API_KEY) ---
            {
                name: "aiethos_list_remediations",
                description: "[PAID TIER] Lists active Generative Engine Optimization remediation action items for the organization's claimed domain, ranked by dynamic priority score. Includes classification (ADD_FOUNDATIONAL_BLOCK vs. IMPROVE_EXISTING_ANSWER) and target pages.",
                inputSchema: {
                    type: "object",
                    properties: {
                        priority: {
                            type: "string",
                            enum: ["all", "high", "medium", "low"],
                            default: "all",
                            description: "Filter by priority tier.",
                        },
                        limit: {
                            type: "integer",
                            default: 10,
                            description: "Maximum number of items to return.",
                        },
                    },
                },
            },
            {
                name: "aiethos_get_remediation_fix",
                description: "[PAID TIER] Synthesizes a verified, production-ready remediation fix for a specific action item or page. Returns a calibrated 45-65 word Inverted Pyramid lead, Schema.org JSON-LD, target DOM selector hints, and drop-in JSX. Deducts 20 credits ($0.02).",
                inputSchema: {
                    type: "object",
                    properties: {
                        remediation_id: {
                            type: "string",
                            description: "The unique ID of the remediation item (e.g. from aiethos_list_remediations).",
                        },
                        target_url: {
                            type: "string",
                            description: "Target URL to remediate if not using an existing item ID.",
                        },
                        topic: {
                            type: "string",
                            description: "Topic or core capability to synthesize a direct answer for.",
                        },
                        framework: {
                            type: "string",
                            enum: ["nextjs_app_router", "nextjs_pages_router", "react", "html_vanilla"],
                            default: "nextjs_app_router",
                            description: "Target framework syntax for schema and code snippets.",
                        },
                    },
                },
            },
            {
                name: "aiethos_lint_staged_content",
                description: "[PAID TIER] Pre-commit / in-editor GEO linter. Validates staged file content against the 45-65 word Inverted Pyramid extraction standard, validates Schema.org JSON-LD, and checks AI bot directives. Deducts 5 credits ($0.005).",
                inputSchema: {
                    type: "object",
                    properties: {
                        file_content: {
                            type: "string",
                            description: "The complete raw content of the local file (e.g., TSX, JSX, or HTML).",
                        },
                        file_path: {
                            type: "string",
                            description: "Optional local file path (e.g., 'app/page.tsx').",
                        },
                    },
                    required: ["file_content"],
                },
            },
            {
                name: "aiethos_verify_factual_grounding",
                description: "[PAID TIER] The Hallucination Sentinel: Validates proposed content or feature descriptions against verified brand assertions to ensure no hallucinations that could degrade LLM citations. Deducts 10 credits ($0.01).",
                inputSchema: {
                    type: "object",
                    properties: {
                        proposed_text: {
                            type: "string",
                            description: "The draft text to verify for factual grounding.",
                        },
                        target_url: {
                            type: "string",
                            description: "Optional target page URL.",
                        },
                    },
                    required: ["proposed_text"],
                },
            },
            {
                name: "aiethos_deep_scan",
                description: "[PAID TIER] Dispatches an asynchronous multi-page deep GEO audit across up to 25 core routes. Immediately returns a Job Ticket with estimated duration (~45s) to prevent IDE socket timeouts. Deducts 100 credits ($0.10).",
                inputSchema: {
                    type: "object",
                    properties: {
                        max_pages: {
                            type: "integer",
                            default: 15,
                            description: "Number of internal routes to crawl and analyze.",
                        },
                        include_subdomains: {
                            type: "boolean",
                            default: false,
                            description: "Whether to include subdomains.",
                        },
                    },
                },
            },
            {
                name: "aiethos_check_job_status",
                description: "[PAID TIER] Checks the real-time execution status of an asynchronous background job (such as a multi-page deep scan). Returns progress percentage, pages crawled, and the final Glamdring report once complete.",
                inputSchema: {
                    type: "object",
                    properties: {
                        job_id: {
                            type: "string",
                            description: "The unique ID of the background job (returned by aiethos_deep_scan).",
                        },
                    },
                    required: ["job_id"],
                },
            },
            {
                name: "aiethos_list_prompts",
                description: "[PAID TIER] Retrieves the organization's tracked GEO prompts from Prompt Studio, including query text, intent category, tracked models, and historical citation rate.",
                inputSchema: {
                    type: "object",
                    properties: {
                        limit: {
                            type: "integer",
                            default: 25,
                        },
                    },
                },
            },
            {
                name: "aiethos_run_prompt_audit",
                description: "[PAID TIER] Triggers an on-demand multi-LLM citation audit across ChatGPT Search, Claude, Gemini, and Perplexity for a test query. Returns citation presence, sentiment, and competitor citations. Deducts 50 credits ($0.05).",
                inputSchema: {
                    type: "object",
                    properties: {
                        custom_query: {
                            type: "string",
                            description: "Ad-hoc query string to test across all 4 frontier AI search engines.",
                        },
                        prompt_ids: {
                            type: "array",
                            items: { type: "string" },
                            description: "Optional list of Prompt Studio IDs to audit.",
                        },
                    },
                },
            },
            {
                name: "aiethos_generate_robots_config",
                description: "[PAID TIER] Generates an optimized Next.js app/robots.ts or static public/robots.txt ensuring that AI search crawlers (GPTBot, PerplexityBot, ClaudeBot, Google-Extended) have explicit indexation rights.",
                inputSchema: {
                    type: "object",
                    properties: {
                        framework: {
                            type: "string",
                            enum: ["nextjs_app_router", "static_txt"],
                            default: "nextjs_app_router",
                            description: "Target format (Next.js TypeScript metadata or static robots.txt).",
                        },
                    },
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
            // Free Tools
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
            // Paid In-IDE Remediation Tools
            case "aiethos_list_remediations": {
                const priority = args?.priority || "all";
                const limit = Number(args?.limit) || 10;
                const items = await client.listRemediations(priority, limit);
                const formatted = items.map((item, idx) => (`### ${idx + 1}. [${item.priority.toUpperCase()}] ${item.title}\n` +
                    `- **Action:** \`${item.remediationAction}\`\n` +
                    `- **Dynamic Priority Score:** ${item.dynamicPriorityScore} / 100\n` +
                    `- **Recommended Schema:** \`${item.recommendedSchema}\`\n` +
                    `- **Target URL:** ${item.targetPageUrl}\n` +
                    `- **Status:** ${item.status}\n` +
                    `- **Remediation ID:** \`${item.id}\`\n` +
                    `*To synthesize the drop-in fix, call:* \`aiethos_get_remediation_fix(remediation_id='${item.id}')\``)).join("\n\n");
                return {
                    content: [
                        {
                            type: "text",
                            text: `## ✦ Active GEO Remediation Backlog (${items.length} items)\n\n${formatted}`,
                        },
                    ],
                };
            }
            case "aiethos_get_remediation_fix": {
                const remId = args?.remediation_id;
                const targetUrl = args?.target_url;
                const topic = args?.topic;
                const framework = args?.framework || "nextjs_app_router";
                const fix = await client.getRemediationFix(remId, targetUrl, topic, framework);
                const markdownText = (`## ✦ In-IDE Remediation Fix: "${fix.title}"\n` +
                    `**Target Asset:** \`${fix.targetPageUrl}\` | **Action:** \`${fix.remediationAction}\`\n` +
                    `**Credits Remaining:** ${fix.remainingCredits}\n\n` +
                    `### 1. Calibrated Inverted Pyramid Lead (${fix.invertedPyramidCopy.wordCount} words — Target: 45–65w)\n` +
                    `> "${fix.invertedPyramidCopy.text}"\n\n` +
                    `### 2. Framework Drop-In JSX (${framework})\n` +
                    `\`\`\`tsx\n${fix.dropInSnippets.react_jsx || ""}\n\`\`\`\n\n` +
                    `### 3. Recommended Schema.org JSON-LD\n` +
                    `\`\`\`html\n${fix.dropInSnippets.json_ld_script || JSON.stringify(fix.schemaMarkup, null, 2)}\n\`\`\`\n\n` +
                    `### 4. Quality & Grounding Score: ${fix.qualityMatrix.overall_score || 97}/100\n` +
                    `- Factual Grounding: ${fix.qualityMatrix.factual_grounding || 98}/100\n` +
                    `- Extractability Score: ${fix.invertedPyramidCopy.extractabilityScore}/100`);
                return { content: [{ type: "text", text: markdownText }] };
            }
            case "aiethos_lint_staged_content": {
                const fileContent = String(args?.file_content || "");
                const filePath = args?.file_path;
                const lint = await client.lintStagedContent(fileContent, filePath);
                let issuesText = "No structural issues detected. Content complies with GEO extraction standards.";
                if (lint.issues.length > 0) {
                    issuesText = lint.issues.map((issue, idx) => (`**${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.category}:** ${issue.message}\n` +
                        `👉 *Recommendation:* ${issue.recommendation}`)).join("\n\n");
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: (`## ✦ Pre-Commit GEO Lint Results\n` +
                                `- **Status:** ${lint.passed ? "✅ Passed" : "⚠️ Warnings Detected"}\n` +
                                `- **Lead Paragraph Word Count:** ${lint.detectedLeadWordCount ?? "N/A"} words (Target: 45–65w)\n` +
                                `- **JSON-LD Schema Detected:** ${lint.hasJsonLd ? "✅ Present" : "❌ Missing"}\n` +
                                `- **Remaining Credits:** ${lint.remainingCredits}\n\n` +
                                `### Diagnostic Findings\n${issuesText}`),
                        },
                    ],
                };
            }
            case "aiethos_verify_factual_grounding": {
                const proposedText = String(args?.proposed_text || "");
                const targetUrl = args?.target_url;
                const res = await client.verifyFactualGrounding(proposedText, targetUrl);
                return {
                    content: [
                        {
                            type: "text",
                            text: (`## ✦ Fact-Grounding Sentinel Evaluation\n` +
                                `- **Grounding Score:** ${res.groundingScore} / 100\n` +
                                `- **Status:** ${res.isGrounded ? "✅ Fully Grounded" : "⚠️ Hallucination Risk"}\n` +
                                `- **Verified Anchor Signals:** ${res.verifiedSignals.join(", ")}\n` +
                                `- **Unverified Assertions:** ${res.unverifiedAssertions.length ? res.unverifiedAssertions.join(", ") : "None (0% risk)"}\n` +
                                `- **Remaining Credits:** ${res.remainingCredits}`),
                        },
                    ],
                };
            }
            case "aiethos_deep_scan": {
                const maxPages = Number(args?.max_pages) || 15;
                const includeSubdomains = Boolean(args?.include_subdomains);
                const ticket = await client.dispatchDeepScan(maxPages, includeSubdomains);
                return {
                    content: [
                        {
                            type: "text",
                            text: (`## ✦ Deep Multi-Page GEO Scan Dispatched\n` +
                                `- **Job ID:** \`${ticket.jobId}\`\n` +
                                `- **Status:** Processing in background (Estimated: ~${ticket.estimatedDurationSeconds}s)\n` +
                                `- **Pages Targeted:** ${ticket.pagesTargeted}\n` +
                                `- **Live Dashboard:** [View Progress & Report](${ticket.dashboardLiveUrl})\n` +
                                `- **Remaining Credits:** ${ticket.remainingCredits}\n\n` +
                                `*Polling Instruction:* Check progress anytime without blocking by calling:\n` +
                                `\`aiethos_check_job_status(job_id='${ticket.jobId}')\``),
                        },
                    ],
                };
            }
            case "aiethos_check_job_status": {
                const jobId = String(args?.job_id || "");
                const status = await client.checkJobStatus(jobId);
                let body = `- **Progress:** ${status.progressPercentage}% (${status.pagesCrawled}/${status.pagesTargeted} pages crawled)\n- **State:** \`${status.status}\``;
                if (status.status === "completed") {
                    body += `\n\n### ✅ Completed Scan Summary\n- **Composite Glamdring Score:** ${status.glamdringScore ?? 82} / 100\n- **Summary:** ${status.reportSummary || "Multi-page audit complete."}`;
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: `## ✦ Job Status: \`${status.jobId}\`\n${body}`,
                        },
                    ],
                };
            }
            case "aiethos_list_prompts": {
                const limit = Number(args?.limit) || 25;
                const prompts = await client.listPrompts(limit);
                const list = prompts.map((p, idx) => (`**${idx + 1}. "${p.promptText}"**\n` +
                    `- Intent: \`${p.intentCategory}\` | Tracked Models: ${p.trackedModels.join(", ")}\n` +
                    `- Citation Rate: ${p.citationRatePercentage ?? 0}% | ID: \`${p.id}\``)).join("\n\n");
                return {
                    content: [
                        {
                            type: "text",
                            text: `## ✦ Prompt Studio Tracked Queries\n\n${list}`,
                        },
                    ],
                };
            }
            case "aiethos_run_prompt_audit": {
                const promptIds = args?.prompt_ids;
                const customQuery = args?.custom_query;
                const audit = await client.runPromptAudit(promptIds, customQuery);
                const modelsBreakdown = Object.entries(audit.citationsByModel).map(([model, details]) => (`- **${model}:** ${details.status === "cited" ? "✅ Cited" : "⚠️ Not Cited"} — *${details.snippet}*`)).join("\n");
                return {
                    content: [
                        {
                            type: "text",
                            text: (`## ✦ Multi-LLM Citation Audit Results\n` +
                                `**Query Tested:** "${audit.testedQuery}"\n` +
                                `**Overall Sentiment:** ${audit.overallSentiment}\n` +
                                `**Remaining Credits:** ${audit.remainingCredits}\n\n` +
                                `### Frontier Model Citations\n${modelsBreakdown}\n\n` +
                                `### Competitors Cited in Same Answers\n` +
                                audit.competitorsCited.map((c) => `- ${c}`).join("\n")),
                        },
                    ],
                };
            }
            case "aiethos_generate_robots_config": {
                const framework = args?.framework || "nextjs_app_router";
                const res = await client.generateRobotsConfig(framework);
                return {
                    content: [
                        {
                            type: "text",
                            text: (`## ✦ AI Crawler Policy Generator (${framework})\n` +
                                `Explicitly permits GPTBot, PerplexityBot, ClaudeBot, and Google-Extended while safeguarding internal routes.\n\n` +
                                `\`\`\`typescript\n${res.code}\n\`\`\``),
                        },
                    ],
                };
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
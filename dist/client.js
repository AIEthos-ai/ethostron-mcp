/**
 * EthosTron API Client
 * Zero-Knowledge Thin Client connecting the MCP Server to the AI Ethos backend.
 * All scoring math, winning topologies, and prompt logic execute in Cloud Run.
 */
import { CONFIG, SERVER_VERSION } from "./config.js";
export class EthosTronClient {
    backendUrl;
    apiKey;
    constructor(backendUrl = CONFIG.backendUrl, apiKey = CONFIG.apiKey) {
        this.backendUrl = backendUrl.replace(/\/$/, "");
        this.apiKey = apiKey;
    }
    getHeaders() {
        const headers = {
            "Content-Type": "application/json",
            "User-Agent": `EthosTron-MCP/${SERVER_VERSION}`,
            "x-client-type": "IDE-Agent",
        };
        if (this.apiKey) {
            headers["Authorization"] = `Bearer ${this.apiKey}`;
            headers["x-api-key"] = this.apiKey;
        }
        return headers;
    }
    ensureApiKey() {
        if (!this.apiKey) {
            throw new Error("Authentication required: This tool requires an active AI Ethos subscription and API Key. " +
                "Claim your domain and generate your API key at https://aiethos.ai/dashboard/account?tab=api-access " +
                "then set AIETHOS_API_KEY in your MCP configuration.");
        }
    }
    // --- Public Diagnostic Tools ---
    async geoQuickscan(targetUrl, brandName) {
        const cleanUrl = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;
        const resp = await fetch(`${this.backendUrl}/public/mcp/quickscan`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify({ url: cleanUrl, brand_name: brandName }),
            signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
        });
        if (!resp.ok) {
            const err = await resp.text().catch(() => "Unknown error");
            throw new Error(`GEO quickscan failed (${resp.status}): ${err}`);
        }
        const data = (await resp.json());
        return {
            domain: data.domain,
            url: data.url || cleanUrl,
            geoScore: data.geoScore ?? data.geo_score ?? 50,
            crawlerStatus: data.crawlerStatus || data.crawler_status,
            schemaHealth: data.schemaHealth || data.schema_health,
            directAnswerReadability: data.directAnswerReadability || data.direct_answer_readability,
            criticalGaps: data.criticalGaps || data.critical_gaps || [],
            claimUrl: data.claimUrl || data.claim_url || "",
        };
    }
    async previewEthosTronFix(targetUrl, gapTopic, intentCategory = "definitive_architecture") {
        const cleanUrl = targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`;
        const resp = await fetch(`${this.backendUrl}/public/mcp/preview-fix`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify({
                url: cleanUrl,
                gap_topic: gapTopic,
                intent_category: intentCategory,
            }),
            signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
        });
        if (!resp.ok) {
            const err = await resp.text().catch(() => "Unknown error");
            throw new Error(`Preview fix generation failed (${resp.status}): ${err}`);
        }
        const data = (await resp.json());
        return {
            topic: data.topic,
            targetUrl: data.targetUrl || data.target_url || cleanUrl,
            synthesizedMarkdown: data.synthesizedMarkdown || data.synthesized_markdown,
            wordCount: data.wordCount || data.word_count || 0,
            recommendedSchema: data.recommendedSchema || data.recommended_schema || "Organization",
            winningTopologyApplied: data.winningTopologyApplied || data.winning_topology_applied,
            activationUrl: data.activationUrl || data.activation_url || "",
            qualityEvaluation: data.qualityEvaluation || data.quality_evaluation,
        };
    }
    async checkLlmCitations(brandName, industryCategory) {
        const resp = await fetch(`${this.backendUrl}/public/mcp/check-citations`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify({
                brand_name: brandName,
                industry_category: industryCategory,
            }),
            signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
        });
        if (!resp.ok) {
            const err = await resp.text().catch(() => "Unknown error");
            throw new Error(`Citation check failed (${resp.status}): ${err}`);
        }
        const data = (await resp.json());
        return {
            brandName: data.brandName || data.brand_name || brandName,
            industryCategory: data.industryCategory || data.industry_category,
            citationShareEstimate: data.citationShareEstimate || data.citation_share_estimate,
            topCompetitorsCited: data.topCompetitorsCited || data.top_competitors_cited || [],
            recentModelPresence: data.recentModelPresence || data.recent_model_presence || { openai: true, gemini: false, claude: true },
            claimUrl: data.claimUrl || data.claim_url || "",
        };
    }
    // --- Paid In-IDE Remediation Tools ---
    async listRemediations(priority = "all", limit = 10) {
        this.ensureApiKey();
        const resp = await fetch(`${this.backendUrl}/api/v1/mcp/remediations?priority=${priority}&limit=${limit}`, {
            headers: this.getHeaders(),
            signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
        });
        if (!resp.ok) {
            const err = await resp.text().catch(() => "Unknown error");
            throw new Error(`Failed to load remediations (${resp.status}): ${err}`);
        }
        const data = (await resp.json());
        return data.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            priority: item.priority,
            status: item.status,
            dueDate: item.due_date,
            dynamicPriorityScore: item.dynamic_priority_score,
            remediationAction: item.remediation_action,
            recommendedSchema: item.recommended_schema,
            targetPageUrl: item.target_page_url,
        }));
    }
    async getRemediationFix(remediationId, targetUrl, topic, framework = "nextjs_app_router") {
        this.ensureApiKey();
        const resp = await fetch(`${this.backendUrl}/api/v1/mcp/remediations/fix`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify({
                remediation_id: remediationId,
                target_url: targetUrl,
                topic,
                framework,
            }),
            signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
        });
        if (!resp.ok) {
            const err = await resp.text().catch(() => "Unknown error");
            throw new Error(`Failed to synthesize remediation fix (${resp.status}): ${err}`);
        }
        const data = (await resp.json());
        return {
            remediationId: data.remediation_id,
            title: data.title,
            remediationAction: data.remediation_action,
            targetPageUrl: data.target_page_url,
            targetSelectorHint: data.target_selector_hint,
            invertedPyramidCopy: {
                text: data.inverted_pyramid_copy?.text,
                wordCount: data.inverted_pyramid_copy?.word_count,
                optimalRange: data.inverted_pyramid_copy?.optimal_range,
                extractabilityScore: data.inverted_pyramid_copy?.extractability_score,
            },
            schemaMarkup: data.schema_markup,
            dropInSnippets: data.drop_in_snippets,
            qualityMatrix: data.quality_matrix,
            remainingCredits: data.remaining_credits,
        };
    }
    async lintStagedContent(fileContent, filePath) {
        this.ensureApiKey();
        const resp = await fetch(`${this.backendUrl}/api/v1/mcp/lint`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify({
                file_content: fileContent,
                file_path: filePath,
            }),
            signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
        });
        if (!resp.ok) {
            const err = await resp.text().catch(() => "Unknown error");
            throw new Error(`Failed to lint staged content (${resp.status}): ${err}`);
        }
        const data = (await resp.json());
        return {
            passed: data.passed,
            issues: data.issues || [],
            detectedLeadWordCount: data.detected_lead_word_count,
            hasJsonLd: data.has_json_ld,
            remainingCredits: data.remaining_credits,
        };
    }
    async verifyFactualGrounding(proposedText, targetUrl) {
        this.ensureApiKey();
        const resp = await fetch(`${this.backendUrl}/api/v1/mcp/grounding/verify`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify({
                proposed_text: proposedText,
                target_url: targetUrl,
            }),
            signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
        });
        if (!resp.ok) {
            const err = await resp.text().catch(() => "Unknown error");
            throw new Error(`Grounding verification failed (${resp.status}): ${err}`);
        }
        const data = (await resp.json());
        return {
            groundingScore: data.grounding_score,
            isGrounded: data.is_grounded,
            verifiedSignals: data.verified_signals || [],
            unverifiedAssertions: data.unverified_assertions || [],
            remainingCredits: data.remaining_credits,
        };
    }
    async dispatchDeepScan(maxPages, includeSubdomains = false) {
        this.ensureApiKey();
        const bodyPayload = {
            include_subdomains: includeSubdomains,
        };
        if (typeof maxPages === "number" && Number.isFinite(maxPages) && maxPages > 0) {
            bodyPayload.max_pages = Math.floor(maxPages);
        }
        const resp = await fetch(`${this.backendUrl}/api/v1/mcp/audits/deep`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify(bodyPayload),
            signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
        });
        if (!resp.ok) {
            const err = await resp.text().catch(() => "Unknown error");
            throw new Error(`Failed to dispatch deep scan (${resp.status}): ${err}`);
        }
        const data = (await resp.json());
        return {
            jobId: data.job_id,
            status: data.status,
            estimatedDurationSeconds: data.estimated_duration_seconds,
            pagesTargeted: data.pages_targeted,
            planTier: data.plan_tier,
            planPageLimit: data.plan_page_limit,
            dashboardLiveUrl: data.dashboard_live_url,
            pollingInstruction: data.polling_instruction,
            remainingCredits: data.remaining_credits,
        };
    }
    async checkJobStatus(jobId) {
        this.ensureApiKey();
        const resp = await fetch(`${this.backendUrl}/api/v1/mcp/jobs/${jobId}`, {
            headers: this.getHeaders(),
            signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
        });
        if (!resp.ok) {
            const err = await resp.text().catch(() => "Unknown error");
            throw new Error(`Failed to check job status (${resp.status}): ${err}`);
        }
        const data = (await resp.json());
        return {
            jobId: data.job_id,
            status: data.status,
            progressPercentage: data.progress_percentage,
            pagesCrawled: data.pages_crawled,
            pagesTargeted: data.pages_targeted,
            glamdringScore: data.glamdring_score,
            reportSummary: data.report_summary,
        };
    }
    async listPrompts(limit = 25, domain, subscriptionId) {
        this.ensureApiKey();
        const params = new URLSearchParams({ limit: String(limit) });
        if (domain)
            params.set("domain", domain);
        if (subscriptionId)
            params.set("subscription_id", subscriptionId);
        const resp = await fetch(`${this.backendUrl}/api/v1/mcp/prompts?${params.toString()}`, {
            headers: this.getHeaders(),
            signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
        });
        if (!resp.ok) {
            const err = await resp.text().catch(() => "Unknown error");
            throw new Error(`Failed to list prompts (${resp.status}): ${err}`);
        }
        const data = (await resp.json());
        return data.map((p) => ({
            id: p.id,
            promptText: p.prompt_text,
            intentCategory: p.intent_category,
            trackedModels: p.tracked_models || [],
            lastTestedAt: p.last_tested_at,
            citationRatePercentage: p.citation_rate_percentage,
            domain: p.domain,
            subscriptionCompany: p.subscription_company,
            subscriptionId: p.subscription_id,
        }));
    }
    async runPromptAudit(promptIds, customQuery, domain, subscriptionId) {
        this.ensureApiKey();
        const resp = await fetch(`${this.backendUrl}/api/v1/mcp/prompts/audit-run`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify({
                prompt_ids: promptIds,
                custom_query: customQuery,
                domain: domain,
                subscription_id: subscriptionId,
            }),
            signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
        });
        if (!resp.ok) {
            const err = await resp.text().catch(() => "Unknown error");
            throw new Error(`Failed to run prompt audit (${resp.status}): ${err}`);
        }
        const data = (await resp.json());
        return {
            testedQuery: data.tested_query,
            citationsByModel: data.citations_by_model || {},
            overallSentiment: data.overall_sentiment,
            competitorsCited: data.competitors_cited || [],
            remainingCredits: data.remaining_credits,
            domain: data.domain,
            subscriptionCompany: data.subscription_company,
            subscriptionId: data.subscription_id,
        };
    }
    async generateRobotsConfig(framework = "nextjs_app_router") {
        this.ensureApiKey();
        const resp = await fetch(`${this.backendUrl}/api/v1/mcp/robots/generate`, {
            method: "POST",
            headers: this.getHeaders(),
            body: JSON.stringify({ framework }),
            signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
        });
        if (!resp.ok) {
            const err = await resp.text().catch(() => "Unknown error");
            throw new Error(`Failed to generate robots policy (${resp.status}): ${err}`);
        }
        const data = (await resp.json());
        return {
            framework: data.framework,
            code: data.code,
        };
    }
}
//# sourceMappingURL=client.js.map
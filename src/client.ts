/**
 * EthosTron API Client
 * Zero-Knowledge Thin Client connecting the MCP Server to the AI Ethos backend.
 * All scoring math, winning topologies, and prompt logic execute in Cloud Run.
 */

import { CONFIG, SERVER_VERSION } from "./config.js";

export interface GeoQuickscanResult {
  domain: string;
  url: string;
  geoScore: number;
  crawlerStatus: {
    gptBot: "allowed" | "blocked" | "not_specified";
    perplexityBot: "allowed" | "blocked" | "not_specified";
    claudeBot: "allowed" | "blocked" | "not_specified";
    googleExtended: "allowed" | "blocked" | "not_specified";
  };
  schemaHealth: {
    hasJsonLd: boolean;
    detectedTypes: string[];
    missingRecommendedTypes: string[];
  };
  directAnswerReadability: {
    invertedPyramidDetected: boolean;
    openingParagraphWordCount: number;
    status: "optimal" | "too_verbose" | "too_short" | "marketing_fluff";
    recommendation: string;
  };
  criticalGaps: string[];
  claimUrl: string;
}

export interface PreviewFixResult {
  topic: string;
  targetUrl: string;
  synthesizedMarkdown: string;
  wordCount: number;
  recommendedSchema: string;
  winningTopologyApplied: string;
  activationUrl: string;
  pageType?: string;
  extractedBrand?: string;
  vertical?: string;
  schemaSnippet?: string;
  qualityEvaluation?: {
    overallQualityScore: number;
    remediationAction: string;
    factualRelevance: number;
    brandAlignment: number;
    queryAlignment: number;
    extractabilityScore: number;
    keywordStuffingRisk: number;
    schemaSelectionAccuracy: number;
    remediationRationale: string;
    groundingStatus?: string;
  };
}

export interface CitationCheckResult {
  brandName: string;
  industryCategory?: string;
  citationShareEstimate: string;
  topCompetitorsCited: string[];
  recentModelPresence: {
    openai: boolean;
    gemini: boolean;
    claude: boolean;
  };
  modelBreakdown?: Record<string, string>;
  reproduciblePrompts?: string[];
  measurementMethodology?: string;
  claimUrl: string;
}

export interface RemediationItem {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  dueDate?: string | null;
  dynamicPriorityScore: number;
  remediationAction: string;
  recommendedSchema: string;
  targetPageUrl: string;
}

export interface RemediationFixResult {
  remediationId: string;
  title: string;
  remediationAction: string;
  targetPageUrl: string;
  targetSelectorHint: string;
  invertedPyramidCopy: {
    text: string;
    wordCount: number;
    optimalRange: string;
    extractabilityScore: number;
  };
  schemaMarkup: Record<string, unknown>;
  dropInSnippets: Record<string, string>;
  qualityMatrix: Record<string, unknown>;
  remainingCredits: number;
}

export interface LintResult {
  passed: boolean;
  issues: Array<{
    severity: string;
    category: string;
    message: string;
    recommendation: string;
  }>;
  detectedLeadWordCount?: number;
  hasJsonLd: boolean;
  remainingCredits: number;
}

export interface GroundingResult {
  groundingScore: number;
  isGrounded: boolean;
  verifiedSignals: string[];
  unverifiedAssertions: string[];
  remainingCredits: number;
}

export interface DeepScanJob {
  jobId: string;
  status: string;
  estimatedDurationSeconds: number;
  pagesTargeted: number;
  dashboardLiveUrl: string;
  pollingInstruction: string;
  remainingCredits: number;
}

export interface JobStatusResult {
  jobId: string;
  status: string;
  progressPercentage: number;
  pagesCrawled: number;
  pagesTargeted: number;
  glamdringScore?: number;
  reportSummary?: string;
}

export interface PromptItem {
  id: string;
  promptText: string;
  intentCategory: string;
  trackedModels: string[];
  lastTestedAt?: string;
  citationRatePercentage?: number;
}

export interface PromptAuditResult {
  testedQuery: string;
  citationsByModel: Record<string, any>;
  overallSentiment: string;
  competitorsCited: string[];
  remainingCredits: number;
}

export interface RobotsResult {
  framework: string;
  code: string;
}

export class EthosTronClient {
  private backendUrl: string;
  private apiKey: string;

  constructor(backendUrl = CONFIG.backendUrl, apiKey = CONFIG.apiKey) {
    this.backendUrl = backendUrl.replace(/\/$/, "");
    this.apiKey = apiKey;
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
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

  private ensureApiKey(): void {
    if (!this.apiKey) {
      throw new Error(
        "Authentication required: This tool requires an active AI Ethos subscription and API Key. " +
        "Claim your domain and generate your API key at https://aiethos.ai/dashboard/account?tab=api-access " +
        "then set AIETHOS_API_KEY in your MCP configuration."
      );
    }
  }

  // --- Public Diagnostic Tools ---

  async geoQuickscan(targetUrl: string, brandName?: string): Promise<GeoQuickscanResult> {
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

    const data = (await resp.json()) as any;
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

  async previewEthosTronFix(
    targetUrl: string,
    gapTopic: string,
    intentCategory = "definitive_architecture"
  ): Promise<PreviewFixResult> {
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

    const data = (await resp.json()) as any;
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

  async checkLlmCitations(brandName: string, industryCategory?: string): Promise<CitationCheckResult> {
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

    const data = (await resp.json()) as any;
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

  async listRemediations(priority = "all", limit = 10): Promise<RemediationItem[]> {
    this.ensureApiKey();
    const resp = await fetch(`${this.backendUrl}/api/v1/mcp/remediations?priority=${priority}&limit=${limit}`, {
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => "Unknown error");
      throw new Error(`Failed to load remediations (${resp.status}): ${err}`);
    }

    const data = (await resp.json()) as any[];
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

  async getRemediationFix(
    remediationId?: string,
    targetUrl?: string,
    topic?: string,
    framework = "nextjs_app_router"
  ): Promise<RemediationFixResult> {
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

    const data = (await resp.json()) as any;
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

  async lintStagedContent(fileContent: string, filePath?: string): Promise<LintResult> {
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

    const data = (await resp.json()) as any;
    return {
      passed: data.passed,
      issues: data.issues || [],
      detectedLeadWordCount: data.detected_lead_word_count,
      hasJsonLd: data.has_json_ld,
      remainingCredits: data.remaining_credits,
    };
  }

  async verifyFactualGrounding(proposedText: string, targetUrl?: string): Promise<GroundingResult> {
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

    const data = (await resp.json()) as any;
    return {
      groundingScore: data.grounding_score,
      isGrounded: data.is_grounded,
      verifiedSignals: data.verified_signals || [],
      unverifiedAssertions: data.unverified_assertions || [],
      remainingCredits: data.remaining_credits,
    };
  }

  async dispatchDeepScan(maxPages = 15, includeSubdomains = false): Promise<DeepScanJob> {
    this.ensureApiKey();
    const resp = await fetch(`${this.backendUrl}/api/v1/mcp/audits/deep`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        max_pages: maxPages,
        include_subdomains: includeSubdomains,
      }),
      signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => "Unknown error");
      throw new Error(`Failed to dispatch deep scan (${resp.status}): ${err}`);
    }

    const data = (await resp.json()) as any;
    return {
      jobId: data.job_id,
      status: data.status,
      estimatedDurationSeconds: data.estimated_duration_seconds,
      pagesTargeted: data.pages_targeted,
      dashboardLiveUrl: data.dashboard_live_url,
      pollingInstruction: data.polling_instruction,
      remainingCredits: data.remaining_credits,
    };
  }

  async checkJobStatus(jobId: string): Promise<JobStatusResult> {
    this.ensureApiKey();
    const resp = await fetch(`${this.backendUrl}/api/v1/mcp/jobs/${jobId}`, {
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => "Unknown error");
      throw new Error(`Failed to check job status (${resp.status}): ${err}`);
    }

    const data = (await resp.json()) as any;
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

  async listPrompts(limit = 25): Promise<PromptItem[]> {
    this.ensureApiKey();
    const resp = await fetch(`${this.backendUrl}/api/v1/mcp/prompts?limit=${limit}`, {
      headers: this.getHeaders(),
      signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => "Unknown error");
      throw new Error(`Failed to list prompts (${resp.status}): ${err}`);
    }

    const data = (await resp.json()) as any[];
    return data.map((p) => ({
      id: p.id,
      promptText: p.prompt_text,
      intentCategory: p.intent_category,
      trackedModels: p.tracked_models || [],
      lastTestedAt: p.last_tested_at,
      citationRatePercentage: p.citation_rate_percentage,
    }));
  }

  async runPromptAudit(promptIds?: string[], customQuery?: string): Promise<PromptAuditResult> {
    this.ensureApiKey();
    const resp = await fetch(`${this.backendUrl}/api/v1/mcp/prompts/audit-run`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        prompt_ids: promptIds,
        custom_query: customQuery,
      }),
      signal: AbortSignal.timeout(CONFIG.requestTimeoutMs),
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => "Unknown error");
      throw new Error(`Failed to run prompt audit (${resp.status}): ${err}`);
    }

    const data = (await resp.json()) as any;
    return {
      testedQuery: data.tested_query,
      citationsByModel: data.citations_by_model || {},
      overallSentiment: data.overall_sentiment,
      competitorsCited: data.competitors_cited || [],
      remainingCredits: data.remaining_credits,
    };
  }

  async generateRobotsConfig(framework = "nextjs_app_router"): Promise<RobotsResult> {
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

    const data = (await resp.json()) as any;
    return {
      framework: data.framework,
      code: data.code,
    };
  }
}

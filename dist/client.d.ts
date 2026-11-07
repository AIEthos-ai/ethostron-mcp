/**
 * EthosTron API Client
 * Zero-Knowledge Thin Client connecting the MCP Server to the AI Ethos backend.
 * All scoring math, winning topologies, and prompt logic execute in Cloud Run.
 */
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
export declare class EthosTronClient {
    private backendUrl;
    private apiKey;
    constructor(backendUrl?: string, apiKey?: string);
    private getHeaders;
    private ensureApiKey;
    geoQuickscan(targetUrl: string, brandName?: string): Promise<GeoQuickscanResult>;
    previewEthosTronFix(targetUrl: string, gapTopic: string, intentCategory?: string): Promise<PreviewFixResult>;
    checkLlmCitations(brandName: string, industryCategory?: string): Promise<CitationCheckResult>;
    listRemediations(priority?: string, limit?: number): Promise<RemediationItem[]>;
    getRemediationFix(remediationId?: string, targetUrl?: string, topic?: string, framework?: string): Promise<RemediationFixResult>;
    lintStagedContent(fileContent: string, filePath?: string): Promise<LintResult>;
    verifyFactualGrounding(proposedText: string, targetUrl?: string): Promise<GroundingResult>;
    dispatchDeepScan(maxPages?: number, includeSubdomains?: boolean): Promise<DeepScanJob>;
    checkJobStatus(jobId: string): Promise<JobStatusResult>;
    listPrompts(limit?: number): Promise<PromptItem[]>;
    runPromptAudit(promptIds?: string[], customQuery?: string): Promise<PromptAuditResult>;
    generateRobotsConfig(framework?: string): Promise<RobotsResult>;
}

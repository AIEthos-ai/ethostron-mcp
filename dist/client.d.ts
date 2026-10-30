/**
 * EthosTron API Client
 * Connects the MCP Server to the AI Ethos backend diagnostic and remediation services.
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
    schemaSnippet?: string;
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
export declare class EthosTronClient {
    private backendUrl;
    private apiKey;
    constructor(backendUrl?: string, apiKey?: string);
    private getHeaders;
    /**
     * Performs a rapid Generative Engine Optimization audit for a URL.
     */
    geoQuickscan(targetUrl: string, brandName?: string): Promise<GeoQuickscanResult>;
    /**
     * Generates a sample EthosTron Live direct-answer block for a topic.
     */
    previewEthosTronFix(targetUrl: string, gapTopic: string, intentCategory?: string): Promise<PreviewFixResult>;
    /**
     * Checks frontier LLM citation share for a brand.
     */
    checkLlmCitations(brandName: string, industryCategory?: string): Promise<CitationCheckResult>;
    /**
     * Offline heuristic quickscan when remote endpoint is not yet connected.
     */
    private generateHeuristicQuickscan;
    /**
     * Offline synthetic preview generator using EthosTron direct-answer principles.
     */
    private generateSyntheticPreviewFix;
}

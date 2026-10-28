/**
 * Tool: aiethos_geo_quickscan
 * Rapid Generative Engine Optimization (GEO) audit tool.
 */

import { z } from "zod";
import { EthosTronClient } from "../client.js";

export const GeoQuickscanInputSchema = z.object({
  url: z.string().describe("The full target URL or root domain to audit (e.g., 'https://example.com' or 'example.com')."),
  brand_name: z.string().optional().describe("Optional brand name to check entity citations for."),
});

export type GeoQuickscanInput = z.infer<typeof GeoQuickscanInputSchema>;

export async function handleGeoQuickscan(input: GeoQuickscanInput, client: EthosTronClient) {
  const result = await client.geoQuickscan(input.url, input.brand_name);

  const markdownLines = [
    `## ⚡ AI Ethos GEO Quick-Scan: \`${result.domain}\``,
    `**Overall GEO Readiness Score:** ${result.geoScore} / 100`,
    "",
    `### 1. AI Crawler Accessibility (robots.txt)`,
    `- **GPTBot (OpenAI / SearchGPT):** ${formatCrawlerStatus(result.crawlerStatus.gptBot)}`,
    `- **PerplexityBot (Perplexity AI):** ${formatCrawlerStatus(result.crawlerStatus.perplexityBot)}`,
    `- **ClaudeBot (Anthropic):** ${formatCrawlerStatus(result.crawlerStatus.claudeBot)}`,
    `- **Google-Extended (Gemini / AI Overviews):** ${formatCrawlerStatus(result.crawlerStatus.googleExtended)}`,
    "",
    `### 2. Schema.org Microdata Health`,
    `- **JSON-LD Detected:** ${result.schemaHealth.hasJsonLd ? "✅ Present" : "❌ Missing"}`,
    `- **Active Types:** ${result.schemaHealth.detectedTypes.join(", ") || "None"}`,
    `- **Missing Recommended:** ${result.schemaHealth.missingRecommendedTypes.join(", ") || "None"}`,
    "",
    `### 3. Direct-Answer Readability (Inverted Pyramid)`,
    `- **Lead Paragraph Length:** ${result.directAnswerReadability.openingParagraphWordCount} words (Target: 45–65 words)`,
    `- **Structure Rating:** ${result.directAnswerReadability.status.replace("_", " ").toUpperCase()}`,
    `- **Recommendation:** ${result.directAnswerReadability.recommendation}`,
    "",
    `### 4. Top Critical Citation Gaps`,
    ...result.criticalGaps.map((gap, i) => `${i + 1}. ${gap}`),
    "",
    `---`,
    `🔗 **Claim Your Domain on AI Ethos:**`,
    `Connect Google Search Console & GA4 to track 50+ prompt queries, mine winning topologies, and auto-deploy fixes via GitHub PR:`,
    `👉 **[Claim Free Domain Audit & Onboarding](${result.claimUrl})**`,
  ];

  return {
    content: [
      {
        type: "text" as const,
        text: markdownLines.join("\n"),
      },
    ],
  };
}

function formatCrawlerStatus(status: string): string {
  if (status === "allowed") return "✅ Allowed";
  if (status === "blocked") return "❌ Blocked (Blocks LLM Crawling)";
  return "⚠️ Not explicitly specified";
}

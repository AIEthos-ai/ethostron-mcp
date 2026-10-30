/**
 * Tool: aiethos_check_llm_citations
 * Checks frontier LLM citation share and competitor visibility.
 */
import { z } from "zod";
export const CheckCitationsInputSchema = z.object({
    brand_name: z.string().describe("The brand or product name (e.g., 'Datadog', 'AI Ethos', 'Stripe')."),
    industry_category: z.string().optional().describe("Optional industry category (e.g., 'Cloud Observability', 'AI Governance')."),
});
export async function handleCheckCitations(input, client) {
    const result = await client.checkLlmCitations(input.brand_name, input.industry_category);
    const markdownLines = [
        `## 📊 AI Ethos LLM Citation Benchmark: \`${result.brandName}\``,
        `**Industry Focus:** ${result.industryCategory || "Technology"}`,
        `**Estimated Citation Share:** ${result.citationShareEstimate}`,
        "",
        `### Frontier Model Citation Presence`,
        `- **OpenAI (ChatGPT & SearchGPT):** ${result.recentModelPresence.openai ? "✅ Cited in recent industry queries" : "❌ Infrequent citation presence"}`,
        `- **Google (Gemini & AI Overviews):** ${result.recentModelPresence.gemini ? "✅ Active in source attributions" : "⚠️ Limited coverage in knowledge graph"}`,
        `- **Anthropic (Claude):** ${result.recentModelPresence.claude ? "✅ Referenced for technical queries" : "❌ Competitors preferred in responses"}`,
        "",
        `### Top Competitors Dominating Citations`,
        ...result.topCompetitorsCited.map((comp, i) => `${i + 1}. **${comp}**`),
        "",
        "---",
        "📈 **Track Your Prompt Audit History:**",
        "Monitor daily citation changes, detect hallucinations, and mine winning topologies for your brand:",
        `👉 **[Activate Full LLM Citation Tracking](${result.claimUrl})**`,
    ];
    return {
        content: [
            {
                type: "text",
                text: markdownLines.join("\n"),
            },
        ],
    };
}
//# sourceMappingURL=check-citations.js.map
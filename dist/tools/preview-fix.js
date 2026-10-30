/**
 * Tool: aiethos_preview_ethostron_fix
 * The "Taste Test": Generates a sample EthosTron Live Direct-Answer block.
 */
import { z } from "zod";
export const PreviewFixInputSchema = z.object({
    url: z.string().describe("The URL of the target page where the content gap exists."),
    gap_topic: z.string().describe("The topic, claim, or query missing citation (e.g., 'SOC2 Compliance & Latency', 'Enterprise Pricing')."),
    intent_category: z
        .enum([
        "comparative_benchmark",
        "framework_methodology",
        "definitive_architecture",
        "pricing_commercial",
        "solution_overview",
    ])
        .optional()
        .describe("Optional intent category to calibrate structural markers."),
});
export async function handlePreviewFix(input, client) {
    const result = await client.previewEthosTronFix(input.url, input.gap_topic, input.intent_category);
    const pageRoleInfo = result.pageType ? ` (Detected Page Role: \`${result.pageType.charAt(0).toUpperCase() + result.pageType.slice(1)}\`)` : "";
    const markdownLines = [
        `## ✦ EthosTron Live Sample Auto-Fix: "${result.topic}"`,
        `**Target Asset:** \`${result.targetUrl}\`${pageRoleInfo}`,
        `**Winning Topology Applied:** \`${result.winningTopologyApplied.replace(/_/g, " ").toUpperCase()}\``,
        `**Recommended Schema.org Type:** \`${result.recommendedSchema}\``,
        `**Direct-Answer Word Count:** ${result.wordCount} words (Optimized 45–65 word extraction target)`,
        "",
        "### Synthesized Direct-Answer Content Block",
        result.synthesizedMarkdown,
        "",
        "---",
        "🚀 **Deploy this Fix Automatically with AI Ethos:**",
        "With a full AI Ethos account, you can refine this block conversationally in **EthosTron Live** and deploy it directly via GitHub Pull Request or WordPress CMS:",
        `👉 **[Open in EthosTron Live Workspace](${result.activationUrl})**`,
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
//# sourceMappingURL=preview-fix.js.map
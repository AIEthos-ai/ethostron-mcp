/**
 * Tool: aiethos_preview_ethostron_fix
 * The "Taste Test": Generates a sample EthosTron Live Direct-Answer block.
 */

import { z } from "zod";
import { EthosTronClient } from "../client.js";

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

export type PreviewFixInput = z.infer<typeof PreviewFixInputSchema>;

export async function handlePreviewFix(input: PreviewFixInput, client: EthosTronClient) {
  const result = await client.previewEthosTronFix(input.url, input.gap_topic, input.intent_category);

  const markdownLines = [
    `## ✦ EthosTron Live Sample Auto-Fix: "${result.topic}"`,
    `**Target Asset:** \`${result.targetUrl}\``,
    `**Winning Topology Applied:** \`${result.winningTopologyApplied}\``,
    `**Recommended Schema.org Type:** \`${result.recommendedSchema}\``,
    `**Direct-Answer Word Count:** ${result.wordCount} words (Optimized for snippet extraction)`,
    "",
    "### Synthesized Direct-Answer Content Block",
    "```markdown",
    result.synthesizedMarkdown,
    "```",
    "",
    "### Formatting Rationale for LLM Retrieval",
    "1. **Inverted Pyramid Lead:** Opens with a concise, declarative 45–60 word answer that search engines can quote verbatim.",
    "2. **Structured Verification Anchors:** Bullet points ground claims with third-party verification markers.",
    `3. **Schema Compliance:** Wrap this block in \`${result.recommendedSchema}\` JSON-LD microdata for maximum indexing confidence.`,
    "",
    "---",
    "🚀 **Deploy this Fix Automatically with AI Ethos:**",
    "With a full AI Ethos account, you can refine this block conversationally in **EthosTron Live** and deploy it directly via GitHub Pull Request or WordPress CMS:",
    `👉 **[Open in EthosTron Live Workspace](${result.activationUrl})**`,
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

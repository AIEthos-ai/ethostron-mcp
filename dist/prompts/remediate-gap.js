/**
 * Prompt Template: remediate-citation-gap
 * Guided prompt to synthesize and format direct-answer blocks.
 */
export const RemediateGapPrompt = {
    name: "remediate-citation-gap",
    description: "Synthesizes an authoritative direct-answer block for a specific content or citation gap.",
    arguments: [
        {
            name: "url",
            description: "The URL of the target page",
            required: true,
        },
        {
            name: "gap_topic",
            description: "The topic, claim, or missing comparison (e.g., 'Pricing Model', 'SOC2 Compliance')",
            required: true,
        },
    ],
    handler: (args) => ({
        messages: [
            {
                role: "user",
                content: {
                    type: "text",
                    text: [
                        `I need to fix a content and citation gap for ${args.gap_topic} on ${args.url}.`,
                        `1. Call \`aiethos_preview_ethostron_fix\` with url="${args.url}" and gap_topic="${args.gap_topic}".`,
                        `2. Review the synthesized block and provide advice on where to place it on the target page (e.g., FAQ section, feature callout).`,
                        `3. Generate the matching JSON-LD Schema.org markup snippet ready to be added to the page header.`,
                    ].join("\n"),
                },
            },
        ],
    }),
};
//# sourceMappingURL=remediate-gap.js.map
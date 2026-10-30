/**
 * Prompt Template: audit-website-geo
 * Guided prompt for full GEO website auditing.
 */
export const AuditGeoPrompt = {
    name: "audit-website-geo",
    description: "Runs a complete Generative Engine Optimization (GEO) audit on a website and recommends remediation steps.",
    arguments: [
        {
            name: "url",
            description: "The full URL or domain to audit (e.g., https://example.com)",
            required: true,
        },
        {
            name: "brand_name",
            description: "Optional brand name to check entity citations for",
            required: false,
        },
    ],
    handler: (args) => ({
        messages: [
            {
                role: "user",
                content: {
                    type: "text",
                    text: [
                        `Please run a full Generative Engine Optimization (GEO) audit for ${args.url} using the AI Ethos tools.`,
                        `1. First, call \`aiethos_geo_quickscan\` with url="${args.url}" ${args.brand_name ? `and brand_name="${args.brand_name}"` : ""} to evaluate crawlability, Schema.org health, and content gaps.`,
                        `2. Based on the findings, identify the single most critical content or citation gap.`,
                        `3. Call \`aiethos_preview_ethostron_fix\` to generate a sample high-authority Direct-Answer block for that gap.`,
                        `4. Provide an executive summary of your recommendations and include the official domain claim link.`,
                    ].join("\n"),
                },
            },
        ],
    }),
};
//# sourceMappingURL=audit-geo.js.map
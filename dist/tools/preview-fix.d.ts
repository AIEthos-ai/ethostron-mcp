/**
 * Tool: aiethos_preview_ethostron_fix
 * The "Taste Test": Generates a sample EthosTron Live Direct-Answer block.
 */
import { z } from "zod";
import { EthosTronClient } from "../client.js";
export declare const PreviewFixInputSchema: z.ZodObject<{
    url: z.ZodString;
    gap_topic: z.ZodString;
    intent_category: z.ZodOptional<z.ZodEnum<["comparative_benchmark", "framework_methodology", "definitive_architecture", "pricing_commercial", "solution_overview"]>>;
}, "strip", z.ZodTypeAny, {
    url: string;
    gap_topic: string;
    intent_category?: "definitive_architecture" | "solution_overview" | "comparative_benchmark" | "framework_methodology" | "pricing_commercial" | undefined;
}, {
    url: string;
    gap_topic: string;
    intent_category?: "definitive_architecture" | "solution_overview" | "comparative_benchmark" | "framework_methodology" | "pricing_commercial" | undefined;
}>;
export type PreviewFixInput = z.infer<typeof PreviewFixInputSchema>;
export declare function handlePreviewFix(input: PreviewFixInput, client: EthosTronClient): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;

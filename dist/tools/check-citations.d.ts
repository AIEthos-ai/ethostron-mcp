/**
 * Tool: aiethos_check_llm_citations
 * Checks frontier LLM citation share and competitor visibility.
 */
import { z } from "zod";
import { EthosTronClient } from "../client.js";
export declare const CheckCitationsInputSchema: z.ZodObject<{
    brand_name: z.ZodString;
    industry_category: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    brand_name: string;
    industry_category?: string | undefined;
}, {
    brand_name: string;
    industry_category?: string | undefined;
}>;
export type CheckCitationsInput = z.infer<typeof CheckCitationsInputSchema>;
export declare function handleCheckCitations(input: CheckCitationsInput, client: EthosTronClient): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;

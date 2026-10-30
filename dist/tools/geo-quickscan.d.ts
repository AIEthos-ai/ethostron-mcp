/**
 * Tool: aiethos_geo_quickscan
 * Rapid Generative Engine Optimization (GEO) audit tool.
 */
import { z } from "zod";
import { EthosTronClient } from "../client.js";
export declare const GeoQuickscanInputSchema: z.ZodObject<{
    url: z.ZodString;
    brand_name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    url: string;
    brand_name?: string | undefined;
}, {
    url: string;
    brand_name?: string | undefined;
}>;
export type GeoQuickscanInput = z.infer<typeof GeoQuickscanInputSchema>;
export declare function handleGeoQuickscan(input: GeoQuickscanInput, client: EthosTronClient): Promise<{
    content: {
        type: "text";
        text: string;
    }[];
}>;

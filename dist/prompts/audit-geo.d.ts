/**
 * Prompt Template: audit-website-geo
 * Guided prompt for full GEO website auditing.
 */
export declare const AuditGeoPrompt: {
    name: string;
    description: string;
    arguments: {
        name: string;
        description: string;
        required: boolean;
    }[];
    handler: (args: {
        url: string;
        brand_name?: string;
    }) => {
        messages: {
            role: "user";
            content: {
                type: "text";
                text: string;
            };
        }[];
    };
};

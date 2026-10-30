/**
 * Prompt Template: remediate-citation-gap
 * Guided prompt to synthesize and format direct-answer blocks.
 */
export declare const RemediateGapPrompt: {
    name: string;
    description: string;
    arguments: {
        name: string;
        description: string;
        required: boolean;
    }[];
    handler: (args: {
        url: string;
        gap_topic: string;
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

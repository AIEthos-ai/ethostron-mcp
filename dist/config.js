/**
 * EthosTron MCP Server: Runtime Configuration
 */
export const SERVER_NAME = "ethostron-mcp";
export const SERVER_VERSION = "0.2.0";
export const CONFIG = {
    backendUrl: process.env.AIETHOS_BACKEND_URL || "https://aiethos-backend-978593064341.us-west2.run.app",
    apiKey: process.env.AIETHOS_API_KEY || "",
    activationUrl: process.env.AIETHOS_ACTIVATION_URL || "https://aiethos.ai/activate",
    requestTimeoutMs: 12000,
};
//# sourceMappingURL=config.js.map
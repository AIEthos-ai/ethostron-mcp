import { describe, it, expect, vi, beforeEach } from "vitest";
import { GeoQuickscanInputSchema, handleGeoQuickscan } from "../src/tools/geo-quickscan.js";
import { PreviewFixInputSchema, handlePreviewFix } from "../src/tools/preview-fix.js";
import { CheckCitationsInputSchema, handleCheckCitations } from "../src/tools/check-citations.js";
import { EthosTronClient } from "../src/client.js";

describe("EthosTron MCP Tools", () => {
  let client: EthosTronClient;

  beforeEach(() => {
    // Mock global fetch so tests are deterministic, offline, and instant
    global.fetch = vi.fn().mockRejectedValue(new Error("Network call mocked"));
    client = new EthosTronClient("http://mock-backend");
  });

  it("should validate and execute aiethos_geo_quickscan with fallback", async () => {
    const input = GeoQuickscanInputSchema.parse({
      url: "https://example.com",
      brand_name: "Example Corp",
    });

    const result = await handleGeoQuickscan(input, client);
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("AI Ethos GEO Quick-Scan: `example.com`");
    expect(result.content[0].text).toContain("Claim Your Domain on AI Ethos");
    expect(result.content[0].text).toContain("Overall GEO Readiness Score");
  });

  it("should validate and execute aiethos_preview_ethostron_fix with fallback", async () => {
    const input = PreviewFixInputSchema.parse({
      url: "https://example.com/solutions/security",
      gap_topic: "Deterministic Hallucination Prevention",
      intent_category: "definitive_architecture",
    });

    const result = await handlePreviewFix(input, client);
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toContain("EthosTron Live Sample Auto-Fix");
    expect(result.content[0].text).toContain("Inverted Pyramid Lead");
    expect(result.content[0].text).toContain("Open in EthosTron Live Workspace");
  });

  it("should validate and execute aiethos_check_llm_citations with fallback", async () => {
    const input = CheckCitationsInputSchema.parse({
      brand_name: "Acme AI",
      industry_category: "Observability",
    });

    const result = await handleCheckCitations(input, client);
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toContain("AI Ethos LLM Citation Benchmark: `Acme AI`");
    expect(result.content[0].text).toContain("Frontier Model Citation Presence");
    expect(result.content[0].text).toContain("Activate Full LLM Citation Tracking");
  });
});

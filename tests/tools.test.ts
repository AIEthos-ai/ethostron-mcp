import { describe, it, expect, vi, beforeEach } from "vitest";
import { GeoQuickscanInputSchema, handleGeoQuickscan } from "../src/tools/geo-quickscan.js";
import { PreviewFixInputSchema, handlePreviewFix } from "../src/tools/preview-fix.js";
import { CheckCitationsInputSchema, handleCheckCitations } from "../src/tools/check-citations.js";
import { EthosTronClient } from "../src/client.js";

describe("EthosTron MCP Tools (Zero-Knowledge Thin Client)", () => {
  let client: EthosTronClient;

  beforeEach(() => {
    // Mock global fetch to return structured backend responses
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes("/public/mcp/quickscan")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            domain: "example.com",
            url: "https://example.com",
            geo_score: 72,
            crawler_status: { gptBot: "allowed", perplexityBot: "allowed", claudeBot: "allowed", googleExtended: "allowed" },
            schema_health: { hasJsonLd: true, detectedTypes: ["Organization"], missingRecommendedTypes: [] },
            direct_answer_readability: { invertedPyramidDetected: true, openingParagraphWordCount: 52, status: "optimal", recommendation: "Good" },
            critical_gaps: [],
            claim_url: "https://aiethos.ai/activate?domain=example.com",
          }),
        });
      }

      if (url.includes("/public/mcp/preview-fix")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            topic: "Deterministic Hallucination Prevention",
            target_url: "https://example.com/solutions/security",
            synthesized_markdown: "#### Proposed Foundational Inverted Pyramid Lead:\nExample Corp delivers deterministic security.",
            word_count: 52,
            recommended_schema: "Organization",
            winning_topology_applied: "entity_definition",
            activation_url: "https://aiethos.ai/activate?claim_token=test",
            quality_evaluation: { groundingStatus: "Empirically Verified On-Page" },
          }),
        });
      }

      if (url.includes("/public/mcp/check-citations")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            brand_name: "Logan Family Properties",
            industry_category: "Property Management",
            citation_share_estimate: "75%",
            top_competitors_cited: ["AppFolio", "Buildium"],
            recent_model_presence: { openai: true, gemini: true, claude: true },
            claim_url: "https://aiethos.ai/activate",
          }),
        });
      }

      if (url.includes("/api/v1/mcp/audits/deep")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            job_id: "job_deep_test_1",
            status: "processing",
            estimated_duration_seconds: 90,
            pages_targeted: 250,
            plan_tier: "Enterprise Plan",
            plan_page_limit: 250,
            dashboard_live_url: "https://aiethos.ai/dashboard/audits",
            polling_instruction: "Poll aiethos_check_job_status(job_id='job_deep_test_1')",
            remaining_credits: 900,
          }),
        });
      }

      if (url.includes("/api/v1/mcp/remediations")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            {
              id: "rem_101",
              title: "Expand Homepage Inverted Pyramid Lead",
              description: "Lead is too short.",
              priority: "high",
              status: "planned",
              dynamic_priority_score: 92,
              remediation_action: "ADD_FOUNDATIONAL_BLOCK",
              recommended_schema: "Organization",
              target_page_url: "https://example.com",
            },
          ]),
        });
      }

      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });

    client = new EthosTronClient("http://mock-backend", "ae_live_mock_token_for_tests");
  });

  it("should validate and execute aiethos_geo_quickscan via backend client", async () => {
    const input = GeoQuickscanInputSchema.parse({
      url: "https://example.com",
      brand_name: "Example Corp",
    });

    const result = await handleGeoQuickscan(input, client);
    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("AI Ethos GEO Quick-Scan: `example.com`");
    expect(result.content[0].text).toContain("**Overall GEO Readiness Score:** 72 / 100");
    expect(result.content[0].text).toContain("Claim Your Domain on AI Ethos");
  });

  it("should validate and execute aiethos_preview_ethostron_fix via backend client", async () => {
    const input = PreviewFixInputSchema.parse({
      url: "https://example.com/solutions/security",
      gap_topic: "Deterministic Hallucination Prevention",
      intent_category: "definitive_architecture",
    });

    const result = await handlePreviewFix(input, client);
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toContain("EthosTron Live Sample Auto-Fix");
    expect(result.content[0].text).toContain("**Recommended Schema.org Type:** `Organization`");
    expect(result.content[0].text).toContain("**Factual Grounding Status:** ✅ `Empirically Verified On-Page`");
  });

  it("should validate and execute aiethos_check_llm_citations with real competitor benchmark", async () => {
    const input = CheckCitationsInputSchema.parse({
      brand_name: "Logan Family Properties",
      industry_category: "Property Management",
    });

    const result = await handleCheckCitations(input, client);
    expect(result.content).toHaveLength(1);
    expect(result.content[0].text).toContain("AI Ethos LLM Citation Benchmark: `Logan Family Properties`");
    expect(result.content[0].text).toContain("AppFolio");
  });

  it("should execute paid tool listRemediations with active API key", async () => {
    const remediations = await client.listRemediations("high", 5);
    expect(remediations).toHaveLength(1);
    expect(remediations[0].title).toBe("Expand Homepage Inverted Pyramid Lead");
    expect(remediations[0].dynamicPriorityScore).toBe(92);
  });

  it("should omit max_pages on dispatchDeepScan when not provided so backend resolves tier limits", async () => {
    const job = await client.dispatchDeepScan(undefined, false);
    expect(job.pagesTargeted).toBe(250);
    expect(job.planTier).toBe("Enterprise Plan");
    expect(job.planPageLimit).toBe(250);

    const fetchMock = global.fetch as unknown as ReturnType<typeof vi.fn>;
    const lastCall = fetchMock.mock.calls.at(-1);
    const body = JSON.parse(String(lastCall?.[1]?.body || "{}"));
    expect(body).not.toHaveProperty("max_pages");
    expect(body.include_subdomains).toBe(false);

    await client.dispatchDeepScan(40, true);
    const explicitCall = fetchMock.mock.calls.at(-1);
    const explicitBody = JSON.parse(String(explicitCall?.[1]?.body || "{}"));
    expect(explicitBody.max_pages).toBe(40);
    expect(explicitBody.include_subdomains).toBe(true);
  });
});

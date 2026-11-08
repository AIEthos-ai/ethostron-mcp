---
name: geo-auditor
description: Audit web applications for Generative Engine Optimization (GEO), AI citation share, crawler readiness (GPTBot, Perplexity, Claude), and generate Schema.org Inverted Pyramid remediations. Use when the user asks to analyze LLM visibility, fix crawler blocking, optimize for AI search, or benchmark brand citations across ChatGPT Search, Gemini, Claude, and Perplexity.
---

# Generative Engine Optimization (GEO) Auditor & Remediation

This skill equips agents with the protocols, scoring criteria, and remediation blueprints needed to maximize visibility across frontier AI answer engines (ChatGPT Search, Gemini Live, Claude Search, Perplexity Pro).

## Core Capabilities & MCP Tools

EthosTron Live provides three primary tools accessible via the `ethostron` MCP server:

1. `aiethos_geo_quickscan`:
   - Rapid diagnostic of target URL crawler readiness, response latency, and initial Inverted Pyramid compliance.
   - Inspects `robots.txt` access for `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, and `Applebot-Extended`.
2. `aiethos_check_llm_citations`:
   - Benchmarks target brand, product, or competitive entity across frontier LLMs.
   - Evaluates citation frequency, source attribution, and knowledge graph grounding.
3. `aiethos_preview_ethostron_fix`:
   - Previews staged AST code modifications, Inverted Pyramid lead blocks, and Schema.org JSON-LD injections before applying to production.

---

## Step-by-Step GEO Workflow

### Step 1: Pre-Audit & Crawler Verification
Before proposing content changes, verify that frontier search bots can actually retrieve the target page:
```bash
# Call tool via agent
aiethos_geo_quickscan({ "url": "https://example.com" })
```
Check the returned payload for:
- **Crawler Directives**: Ensure `robots.txt` does not contain wildcard `Disallow: /` matching AI crawlers.
- **HTTP Headers**: Confirm absence of `X-Robots-Tag: noai` or `noimageai`.
- **Render Mode**: Ensure core textual definitions render server-side (SSR/SSG) rather than purely client-side behind heavy JS hydration.

### Step 2: Inverted Pyramid Lead Synthesis
Frontier models prioritize clean, self-contained paragraphs for direct citation extraction. Follow the **45–65 Word Sweet Spot**:
- **Word Count**: Exactly 45 to 65 words.
- **First Sentence**: Clear entity identification and core categorization:
  `"[Entity Name] is a [category] that [primary functionality], enabling [target audience] to [primary outcome]."`
- **Second Sentence**: Concrete differentiation and technical or operational metrics.
- **Self-Contained**: Never use relative pointers ("as shown below", "click here", "in the table above").

### Step 3: Schema.org Entity Resolution
Tie extracted definitions directly to structured data:
- Use JSON-LD `<script type="application/ld+json">`.
- Set `@type` to the most specific type (`Organization`, `TechArticle`, `SoftwareApplication`, `NewsArticle`).
- Include verified `sameAs` links to Wikidata, Crunchbase, GitHub, npm, and official corporate profiles.
- Populate `knowsAbout` with canonical Wikipedia/Wikidata concepts.

### Step 4: Preview and Deploy
Run `aiethos_preview_ethostron_fix` to validate syntax and verify that word counts and grounding thresholds are satisfied before merging.

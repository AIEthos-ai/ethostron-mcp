# EthosTron™ Live MCP Server ⚡

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Protocol%20Compliant-green)](https://modelcontextprotocol.io/)
[![Vitest](https://img.shields.io/badge/Tests-3%2F3%20Passing-brightgreen)](https://vitest.dev/)
[![Status](https://img.shields.io/badge/Cloud%20Run-Live-emerald)](https://aiethos.ai)

The official **Model Context Protocol (MCP)** server for [AIEthos](https://aiethos.ai).

**EthosTron™ Live** brings real-time Generative Engine Optimization (GEO) directly into your AI coding assistant (Claude Desktop, Cursor, Antigravity, Windsurf, VS Code). In under 2 seconds, your agent can audit any website for AI search readiness, inspect crawler access (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`), detect missing Schema.org entities, and synthesize drop-in **Inverted-Pyramid Direct-Answer blocks** engineered for citation across frontier models.

---

## ⚡ Multi-Assistant Setup & Configuration

EthosTron™ Live supports both local MCP (stdio JSON-RPC) for IDE coding assistants and standard OpenAPI Actions for cloud LLM assistants like ChatGPT:

### 1. GitHub Copilot (Visual Studio Code)
GitHub Copilot natively supports MCP servers directly within VS Code.

Add to your project's `.vscode/mcp.json` (or run Command Palette `Ctrl+Shift+P` / `Cmd+Shift+P` > **Copilot: Manage MCP Servers**):

```json
{
  "mcp": {
    "servers": {
      "ethostron": {
        "command": "npx",
        "args": ["-y", "@aiethos/ethostron-mcp"]
      }
    }
  }
}
```
**Copilot Chat Usage:**
```text
@ethostron Audit https://example.com for GEO and identify missing schema types
```

---

### 2. ChatGPT (OpenAI Custom GPTs & Actions)
For OpenAI ChatGPT (Plus, Team, Enterprise), connect EthosTron Live via **OpenAPI Actions** pointing to the Cloud Run backend without needing a local daemon:

1. Open ChatGPT > **Explore GPTs** > **Create** (or edit an existing Custom GPT).
2. Go to the **Configure** tab > Scroll down to **Actions** > Click **Create new action**.
3. Under **Schema**, click **Import from URL** and enter:
   ```text
   https://aiethos-backend-978593064341.us-west2.run.app/openapi.json
   ```
4. **Authentication:** Leave as `None` (the public developer `/public/mcp/*` endpoints are open & read-only).
5. **Privacy Policy:** `https://aiethos.ai/privacy`
6. Save and publish your Custom GPT!

**ChatGPT Usage:**
```text
Audit https://stripe.com for GEO and generate a direct answer remediation block.
```

---

### 3. Google Gemini & Antigravity
For developers building with Google Gemini models or Google Antigravity:

**Option A — Antigravity & Gemini CLI (`.gemini/config/mcp_config.json`):**
```json
{
  "mcpServers": {
    "ethostron": {
      "command": "npx",
      "args": ["-y", "@aiethos/ethostron-mcp"]
    }
  }
}
```

**Option B — Google GenAI Python SDK (`google-genai`):**
```python
from google import genai
from google.genai import types

client = genai.Client()
# Connect to EthosTron Live OpenAPI endpoints directly
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents="Audit https://example.com using aiethos_geo_quickscan"
)
```

---

### 4. Claude Desktop
Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "ethostron": {
      "command": "npx",
      "args": ["-y", "@aiethos/ethostron-mcp"]
    }
  }
}
```

*Config file locations:*
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`

**Claude Usage:** Click the tool hammer icon in Claude Desktop and prompt: *"Audit https://linear.app for GEO"*.

---

### 5. Cursor & Windsurf
In **Settings > Features > MCP Servers**, add a new server:
- **Name:** `ethostron`
- **Type:** `command`
- **Command:** `npx -y @aiethos/ethostron-mcp`

Or add directly to `.cursor/mcp.json` or `.windsurf/mcp.json`:
```json
{
  "mcpServers": {
    "ethostron": {
      "command": "npx",
      "args": ["-y", "@aiethos/ethostron-mcp"]
    }
  }
}
```

---

### 6. VS Code Autonomous Agents (Cline / Roo Code / Continue)
Add to your extension's MCP configuration (e.g. `~/.cline/mcp_settings.json` or Roo Code MCP settings):

```json
{
  "mcpServers": {
    "ethostron": {
      "command": "npx",
      "args": ["-y", "@aiethos/ethostron-mcp"]
    }
  }
}
```
Autonomous coding agents will automatically invoke `aiethos_geo_quickscan` to diagnose missing Schema.org markup or robots directives, and call `aiethos_preview_ethostron_fix` to apply verified drop-in code patches.

---

## 🛠️ Available MCP Tools

### 1. `aiethos_geo_quickscan`
Performs an instant, sub-2.0s Generative Engine Optimization assessment for any URL:
- **AI Crawler Permissions:** Checks `robots.txt` directives for `GPTBot` (OpenAI), `PerplexityBot`, `ClaudeBot`, and `Google-Extended` (Gemini).
- **Schema.org Microdata Health:** Inspects JSON-LD for `Organization`, `TechArticle`, `FAQPage`, `SoftwareApplication`, and `Product`.
- **Inverted-Pyramid Readability:** Measures opening lead paragraph word count against the optimal LLM answer extraction target (45–65 words).
- **Deterministic 0–100 Score:** Provides immediate numerical grading and high-impact critical gaps.
- **Claim Link:** Includes an activation URL to upgrade to full multi-page audits.

```text
// Example Agent Prompt:
"Audit https://stripe.com for Generative Engine Optimization using aiethos_geo_quickscan"
```

**Example Response Output:**
```json
{
  "domain": "stripe.com",
  "url": "https://stripe.com",
  "geoScore": 85,
  "crawlerStatus": {
    "gptBot": "allowed",
    "perplexityBot": "allowed",
    "claudeBot": "allowed",
    "googleExtended": "allowed"
  },
  "schemaHealth": {
    "hasJsonLd": true,
    "detectedTypes": ["Organization", "WebSite"],
    "missingRecommendedTypes": ["FAQPage", "TechArticle"]
  },
  "directAnswerReadability": {
    "invertedPyramidDetected": true,
    "openingParagraphWordCount": 54,
    "status": "optimal",
    "recommendation": "Opening paragraph is concise and optimized for LLM answer extraction."
  },
  "criticalGaps": [
    "Missing high-citation schema (FAQPage or TechArticle recommended)"
  ],
  "claimUrl": "https://aiethos.ai/activate?domain=stripe.com&claim_token=mcp_8f2a1b9c&utm_source=ethostron_mcp&utm_medium=ai_copilot&utm_campaign=geo_quickscan"
}
```

---

### 2. `aiethos_preview_ethostron_fix`
The automated content remediation engine: Synthesizes a copy-paste ready, 45–60 word Direct-Answer block and matching Schema.org microdata tailored to your topic and intent category.

Supported Intent Topologies:
- `definitive_architecture`: High-authority entity definitions (what it is, core mechanism, business impact).
- `comparative_benchmark`: Objective side-by-side technical trade-offs and decision criteria.
- `troubleshooting_resolution`: Exact error signatures, root cause explanations, and CLI commands.
- `pricing_commercial`: Transparent tier tables, inclusions, and ROI formulas.
- `framework_methodology`: Sequential numbered workflows with CLI verification steps.

```text
// Example Agent Prompt:
"Use aiethos_preview_ethostron_fix to generate an authoritative direct answer block for 'SOC2 Compliance & Zero Trust' on https://acme.io with intent_category 'definitive_architecture'"
```

---

### 3. `aiethos_check_llm_citations`
Checks public prompt benchmarks to determine whether a brand is actively cited across frontier LLMs (OpenAI, Gemini, Claude) for common industry prompts, or whether competitors dominate citations.

```text
// Example Agent Prompt:
"Check AI citation share for Datadog in Cloud Observability using aiethos_check_llm_citations"
```

---

## 📋 Available Prompt Templates

- **`audit-website-geo`**: Complete workflow guiding your AI assistant through scanning, diagnosing, and delivering remediation advice for any target URL.
- **`remediate-citation-gap`**: Turns any identified content gap into a publish-ready Inverted-Pyramid markdown block and JSON-LD schema snippet.

---

## 🎯 How the MCP GEO Score is Calculated

The MCP GEO score is a **deterministic 100-point formula** evaluating the 3 technical pillars of AI search citation:

| Pillar | Max Points | Measurement Criteria |
| :--- | :---: | :--- |
| **1. AI Crawler Access** | **30 Pts** | Inspects `robots.txt` for `GPTBot` (+10), `PerplexityBot` (+10), `ClaudeBot` (+5), and `Google-Extended` (+5). |
| **2. Schema.org Health** | **40 Pts** | Valid JSON-LD present (+15), `Organization`/Brand entity grounded (+10), High-citation schema present (+15). |
| **3. Direct-Answer Readability** | **30 Pts** | Inverted-pyramid opening paragraph: **45–65 words** (+30). Suboptimal lengths (+15). Missing (+5). |

---

## 🔄 Upgrading to Full Multi-Page Audits

The MCP Quickscan is an instant single-page check. To unlock **continuous brand governance**, click the `claimUrl` returned in the tool response:

- **Full Domain Crawl:** Deep 20-page crawl with client-side SPA JavaScript rendering.
- **Web Verification:** Tavily search queries indexing 3rd-party coverage and reviews.
- **Multi-Model Consensus:** Parallel evaluation across OpenAI, Gemini, and Claude with hallucination risk penalties.
- **Autonomous Remediation:** Automated GitHub Pull Requests that apply verified JSON-LD patches.

---

## 🛡️ Privacy, Security & Quotas

- **Strictly Read-Only:** EthosTron Live never mutates local files, executes git commits, or modifies production databases.
- **SSRF Protection:** Target addresses are validated against private network CIDRs (`127.0.0.1`, `10.0.0.0/8`, `192.168.0.0/16`, `169.254.169.254`).
- **Free Anonymous Tier:** 5 quickscans per domain per day with zero setup or API key.
- **Zero Database Pollution:** Anonymous scans do not create dummy accounts or pollute customer dashboards.

---

## 💻 Local Development & Testing

```bash
# Clone repository
git clone https://github.com/AIEthos-ai/ethostron-mcp.git
cd ethostron-mcp

# Install dependencies
pnpm install

# Build TypeScript
pnpm run build

# Run unit tests
pnpm test

# Test JSON-RPC via MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

---

## 📄 License

Apache-2.0 © [AIEthos LLC](https://aiethos.ai)

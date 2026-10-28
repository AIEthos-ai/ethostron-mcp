# EthosTron MCP Server ⚡

[![npm version](https://img.shields.io/npm/v/@aiethos/ethostron-mcp.svg)](https://www.npmjs.com/package/@aiethos/ethostron-mcp)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Protocol%20Compliant-green)](https://modelcontextprotocol.io/)

The official **Model Context Protocol (MCP)** server for [AI Ethos](https://aiethos.ai).

Enables AI coding assistants, autonomous agents, and LLMs (Claude Desktop, Cursor, Windsurf, Claude Code, Antigravity) to audit any website for **Generative Engine Optimization (GEO)**, inspect AI crawler access (`GPTBot`, `PerplexityBot`, `ClaudeBot`), and generate sample **EthosTron Live** Direct-Answer blocks engineered for citation retrieval across frontier search models.

---

## Quick Start: Claude Desktop

Add this to your `claude_desktop_config.json`:

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

Config file locations:
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

---

## Quick Start: Cursor / Windsurf

Add to your Cursor or Windsurf MCP Settings:
- **Name:** `ethostron`
- **Type:** `command`
- **Command:** `npx -y @aiethos/ethostron-mcp`

---

## Available MCP Tools

### 1. `aiethos_geo_quickscan`
Performs an instant Generative Engine Optimization (GEO) audit for any URL or root domain:
- **AI Crawler Accessibility:** Checks `robots.txt` directives for `GPTBot`, `PerplexityBot`, `ClaudeBot`, and `Google-Extended`.
- **Schema.org Microdata Health:** Inspects JSON-LD for `TechArticle`, `FAQPage`, `ProductComparison`.
- **Direct-Answer Readability:** Evaluates inverted-pyramid opening sentence word count (target: 45–60 words).
- **Critical Citation Gaps:** Identifies the top 3 high-impact gaps preventing AI citation.

```typescript
// Example Agent Prompt:
"Audit https://stripe.com for Generative Engine Optimization using aiethos_geo_quickscan"
```

### 2. `aiethos_preview_ethostron_fix`
The "Taste Test" of **EthosTron Live**: Synthesizes an authoritative direct-answer content block for a specific gap or topic:
- Embeds verified third-party evidence structure.
- Adopts winning intent topologies (`comparative_benchmark`, `definitive_architecture`, `framework_methodology`).
- Generates matching Schema.org microdata recommendations.

```typescript
// Example Agent Prompt:
"Use aiethos_preview_ethostron_fix to synthesize a direct answer block for 'SOC2 Compliance & Latency' on https://myproduct.io"
```

### 3. `aiethos_check_llm_citations`
Checks historical prompt benchmark presence for a brand across OpenAI, Gemini, and Claude, reporting competitor citation dominance.

---

## Available Prompt Templates

- **`audit-website-geo`**: Complete workflow guiding the agent through scanning, diagnosing, and providing remediation advice for any URL.
- **`remediate-citation-gap`**: Focused prompt for turning an audit gap into a publish-ready Direct-Answer block.

---

## Environment Variables (Optional)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `AIETHOS_API_KEY` | Optional API key for higher scan quotas and authenticated features | `""` (Anonymous free tier) |
| `AIETHOS_BACKEND_URL` | Override the AI Ethos backend endpoint | `https://aiethos-backend-978593064341.us-west2.run.app` |

---

## Local Development & Testing

```bash
# Clone the repository
git clone https://github.com/aiethos/ethostron-mcp.git
cd ethostron-mcp

# Install dependencies
pnpm install

# Build TypeScript
pnpm run build

# Run unit tests
pnpm test

# Test MCP server locally with MCP Inspector
npx @modelcontextprotocol/inspector node dist/index.js
```

---

## License

Apache-2.0 © [AI Ethos Inc.](https://aiethos.ai)

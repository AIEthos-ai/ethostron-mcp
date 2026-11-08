# EthosTron Generative Engine Optimization (GEO) Rules

When writing, optimizing, or reviewing web content for AI search engine visibility and citation extraction:

## 1. Direct-Answer Inverted Pyramid Topology
- **Top of Page Definition**: Any informational, landing, service, or article page must present a definitive lead answer block immediately beneath the primary `<h1>`.
- **Strict Word Count**: Lead definition blocks must be between 45 and 65 words in length.
- **Syntactic Structure**:
  - Lead with the entity name and exact category definition in sentence 1.
  - Follow with technical capabilities, quantifiable metrics, or architectural traits in sentence 2.
  - Avoid deictic references ("below", "above", "on this page") that degrade standalone extractability.

## 2. Crawler & Ingestion Integrity
- Never block frontier search crawlers (`GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`) in `robots.txt` unless the user explicitly requests crawler protection.
- Ensure all canonical definitions and Schema.org metadata render in static server HTML (SSG/SSR) to guarantee ingestion without requiring heavy client-side JavaScript execution.

## 3. Schema.org Microdata & Disambiguation
- Every primary page must inject valid JSON-LD metadata (`application/ld+json`).
- Ensure `@id` and `sameAs` arrays link to authoritative entity registries (Wikidata, Crunchbase, GitHub, npm).
- Specify `knowsAbout` for topical authority reinforcement.

## 4. Factual Grounding & Verifiability
- Never hallucinate claims, citations, or benchmark statistics. Every metric cited in lead blocks must be grounded in primary codebase artifacts or verifiable documentation.

# ADR-002 — Embeddability: iFrame + URL-Param Theming

**Status:** Accepted
**Date:** June 2026
**Decided by:** Naomi Pinto

---

## Context

Finxiety's monetization path runs through institutional licensing: credit unions, CDFIs, community banks (under CRA pressure), and municipal benefits portals pay to embed Finxiety tools for their members and clients. The tools remain free to end users. The payer and the user are different people.

This decision must be made before more tools are built. The current two tools (EMG-1, MYTH-1) have Finxiety brand tokens hard-coded in their component styles. If the embeddability model isn't set now, retrofitting it across 11+ tools is the outcome.

Constraints that the chosen approach must satisfy:
- Works with `adapter-static` — no server infrastructure to add or pay for
- Partners can embed without engineering resources (target: nonprofits, credit unions, city agencies)
- Isolates Finxiety JS from partner page — no script conflicts, no XSS surface expansion
- Does not require any PII collection or storage (constraint from the Do No Harm principle)
- Maintains WCAG 2.1 AA compliance in embedded context
- The default Finxiety brand renders normally for direct traffic (no broken experience without params)

---

## Options Considered

### Option 1: iFrame + URL-param theming (chosen)

Partners embed via a standard `<iframe>` tag:

```html
<iframe
  src="https://tools.finxiety.org/tools/emergency-fund?primaryColor=%23003087&partnerName=Harbor%20Credit%20Union"
  width="100%"
  height="600"
  frameborder="0"
  title="Emergency Fund Calculator — powered by Finxiety"
></iframe>
```

A thin bootstrap script on the Finxiety page reads URL params at mount time and injects CSS variable overrides into the document root. The default Finxiety brand renders when no params are present.

PostMessage API handles iframe↔parent communication (height resize, completion events).

**Pros:** No new infrastructure. Works with static adapter. Partners need zero engineering to deploy. Finxiety JS is fully isolated from partner page. Theming is CSS-variable-based — works everywhere.

**Cons:** Some iframe UX limitations (deep-link navigation, keyboard focus traps). Cross-origin PostMessage adds implementation complexity. URL-visible params mean partner brand config is technically inspectable (not a security issue, but worth noting).

### Option 2: Web Components / Custom Elements

Each tool exported as a standalone Web Component (`<finxiety-emergency-fund>`). Partner installs a `<script>` tag from a CDN.

**Rejected:** Requires partner engineering to integrate. Credit unions and nonprofits don't have in-house dev teams. Also requires a separate build pipeline to publish Web Components — adds infrastructure without a compelling benefit over iFrame at this stage.

### Option 3: NPM package / importable modules

Publish calculators and UI as an NPM package. Partners install and render in their own stack.

**Rejected:** Assumes partner has a JS/TS frontend stack and a developer to integrate it. Narrows the addressable partner pool dramatically. Adds versioning and breaking-change management overhead.

### Option 4: Multi-tenant routing (subdomain or path-based)

Deploy per-partner instances: `harborcu.finxiety.org` or `finxiety.org/embed/harborcu/emergency-fund`.

**Rejected:** Requires a server or build-time config per partner — breaks the static adapter model. Doesn't scale without infrastructure investment. Premature before the first institutional partner is signed.

---

## Decision

**iFrame embed as the primary mechanism, with URL-param CSS variable injection for theming and a PostMessage API for iframe↔parent communication.**

### Supported URL params

| Param | CSS variable overridden | Example |
|---|---|---|
| `primaryColor` | `--terracotta` (buttons, links, focus) | `%23003087` |
| `hoverColor` | `--copper` (button hover) | `%23002060` |
| `accentColor` | `--olive` (info boxes) | `%234a7c59` |
| `bgColor` | `--cream` (page background) | `%23f5f5f5` |
| `partnerName` | Replaces "Finxiety" in attribution line | `Harbor%20Credit%20Union` |
| `logo` | Swaps wordmark src | `https://partner.org/logo.png` |
| `hideAttribution` | Removes "powered by Finxiety" footer line | `true` (paid tier only) |

### PostMessage events (iframe → parent)

```js
// Tool completed — parent page can show a follow-up CTA
{ type: 'finxiety:complete', tool: 'emergency-fund', result: 'solid' }

// Height changed — parent resizes iframe to eliminate scrollbar
{ type: 'finxiety:resize', height: 842 }

// Error state — parent can show a fallback
{ type: 'finxiety:error', tool: 'emergency-fund', code: 'validation' }
```

No PII in any PostMessage payload. The `result` field uses the internal branch key (`zero`, `starting`, `solid`, `excess`) — no user-entered numbers.

---

## Constraints This Decision Imposes on Every Future Tool

These are not optional. They must be satisfied before any tool is distributed to institutional partners.

1. **No hard-coded color values in tool files.** All color references must use CSS variables defined in `app.css`. Never `#c1674c` inline — always `var(--terracotta)`. This applies to inline styles, Svelte `<style>` blocks, and any JS-driven style changes.

2. **No Finxiety wordmark in tool body.** Brand attribution lives in the layout shell (`+layout.svelte`), which is swappable via `partnerName`/`logo` params. Individual tool pages are brand-neutral — they reference brand tokens but not brand identity.

3. **Component extraction is a prerequisite.** UI primitives (Button, InputField, ResultBox, WatchoutBox, BridgeBox) must be extracted to `src/lib/components/` before the embed shell ships. Theming changes must propagate everywhere; that requires shared components. See ARCH-1.

4. **PostMessage instrumentation on every tool.** Each tool emits `finxiety:complete` on reaching its result screen and `finxiety:resize` whenever its height changes. These events are no-ops for direct-traffic users and are required for embedded partners.

5. **Embed-ready validation checkpoint.** Before any tool is distributed to an institutional partner (not before every ship — only before partner distribution), it passes an "embed-ready" check: CSS variable compliance, PostMessage events present, no hard-coded brand values, tested in a plain HTML iframe harness.

---

## What This Does Not Include (Deferred)

- **Partner analytics dashboard.** Aggregate, anonymized usage counts per partner are valuable for institutional sales ("prove this is working") but require instrumentation infrastructure. Deferred until the first partner relationship is live.
- **`hideAttribution` (paid tier).** The ability to fully white-label without "powered by Finxiety" is a commercial differentiator. Deferred until a pricing model is defined.
- **Multi-tenant config management.** Per-partner config stored server-side (vs. URL params). Premature. Revisit when the param list outgrows what's manageable in a snippet.

---

## Implementation Sequence

1. **ARCH-1** — Extract shared UI components to `src/lib/components/`. Prerequisite for everything below.
2. **ARCH-2** — Bootstrap script for URL-param CSS variable injection + PostMessage API. Deliverable: a plain HTML test harness that embeds an existing tool with partner theming.
3. Per tool, before partner distribution — embed-ready validation checkpoint (not a new build, just a checklist run against the existing tool).

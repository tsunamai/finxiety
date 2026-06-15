# ADR-001 — Stack: SvelteKit + adapter-static + Vercel

**Status:** Accepted
**Date:** June 2026
**Decided by:** Naomi Pinto (inline, Week 1)

---

## Context

Finxiety tools are civic utilities — free, stateless, no accounts, no PII. The target user is phone-first (ALICE demographic; ~55% of sessions expected on mobile). Hosting costs must be near-zero permanently. No backend logic is needed: all calculation is client-side, all data is static JSON.

Stack selection criteria ranked in priority order:
1. Mobile-first rendering (375px base) with fast first-paint on slow connections
2. Zero server operating cost — no Node process, no database, no CDN bill per request
3. Static output for trivial Vercel deployment (single `vercel.json`)
4. TypeScript-native for shared type safety across tools and input model
5. Minimal dependency footprint — no runtime dependencies acceptable in v1

---

## Decision

**SvelteKit with `@sveltejs/adapter-static`, deployed on Vercel.**

- `export const prerender = true` set in `src/routes/+layout.ts` — all routes prerendered at build time
- Output is a directory of HTML/CSS/JS files; Vercel serves them as a static site
- No server runtime, no serverless functions, no edge functions
- All calculation logic in `src/lib/calculators/` as pure TypeScript functions (no side effects, no I/O)
- Brand tokens and base styles in `src/app.css` via CSS custom properties

---

## Rejected Alternatives

**Next.js:** More complex; SSR and API route surface area not needed. React adds bundle weight without benefit for tools of this simplicity.

**Streamlit:** Python-first, desktop-oriented rendering. The target population is phone-first; Streamlit's responsive story is weak. Eliminated Week 1.

**Plain HTML/JS:** No shared routing, no TypeScript, no component model. Maintaining 11+ tools as flat files would be unmaintainable.

**Remix / Astro:** Considered briefly. SvelteKit's static adapter produces smaller bundles than Astro for component-heavy tools; Remix is SSR-native and adds unnecessary complexity.

---

## Consequences

- All routes must be prerenderable — no server-side dynamic content, no session state, no user-specific routes
- Data (eligibility thresholds, quiz content) lives in static JSON files bundled at build time — a data change requires a redeploy
- All calculation is synchronous and client-side — no async data fetching at runtime
- Adding a tool = adding a new route under `src/routes/tools/` + a pure function in `src/lib/calculators/`
- Build output goes to `./build/` (configured in `vercel.json`)

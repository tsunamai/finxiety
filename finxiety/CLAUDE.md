# Finxiety — Product Context

Finxiety is the civic arm of Tsunam.ai: free financial clarity tools for communities the market doesn't build for. This file governs all work in `finxiety/`. Rules here override root `CLAUDE.md` where they conflict.

---

## What Finxiety Is

**Clarity engines, not calculators.** A Finxiety tool is done when someone understands something they didn't understand before and feels equipped to move — not when it returns a value.

**Target population:** People navigating financial systems without a guide. Single parents doing the math on a raise. Gig workers who don't know they're owed a tax credit. Immigrant families unsure which programs they can access. Someone holding a garnishment notice at 11pm.

**Structure:** Free. Always. Permanently. Stateless tools, client-side calculation, no login, cheap to host. Separate legal entity (501(c)(3) or fiscal sponsorship — TBD).

**Source of truth for brand, voice, and values:** `../tsunam_vault/finxiety/Finxiety — Brand & Mission.md`. Read it before touching any user-facing copy.

---

## Socioeconomic Accessibility — The Primary Lens

Finxiety tools are built for the ALICE user (Asset Limited, Income Constrained, Employed): someone working, managing month-to-month, with near-zero savings and constrained cognitive bandwidth. This is not an edge case — it's the core user.

**Persona:** `finxiety/research-findings/persona-alice-primary-user.md` — read before any copy or design decision.

**Framework:** `finxiety/docs/socioeconomic-accessibility-framework.md` — the reusable checklist applied at every validation gate.

Key behavioral science foundations every agent must internalize:
- **Scarcity mindset (Mullainathan & Shafir):** Financial stress consumes cognitive bandwidth. The tool must complete in one cognitive step.
- **Financial shame:** A result that reads as a verdict can cause more harm than no result at all. Design for information, not grade.
- **Trust deficit:** This user has been failed by financial institutions. Trust is earned in the first 30 seconds, by design.
- **No path forward = a verdict:** When the result is near-zero, the tool must signal what else exists — not as a recommendation, but as a signpost.

---

## Validation Gate (Five Agents, Run Before Distribution)

Every tool that ships runs through all five in sequence. Findings go to `finxiety/status-updates/[tool-id]-validation-[date].md`.

| Agent | What it checks | Sign-off |
|---|---|---|
| `brand` | Voice, Non-Advice Rule, Do No Harm copy flags | ⟦BRAND-REVIEWED⟧ |
| `design-ux` | Usability at 375px and 1440px — Norman, Nielsen, Ive, Simon | ⟦UX-REVIEWED⟧ |
| `qa` | Functional correctness, edge cases, WCAG 2.1 AA, mobile | ⟦QA-VERIFIED⟧ |
| `behavioral-science` | Scarcity, shame, trust, locus of control, cross-tool bridge — through ALICE persona | ⟦BEHAVIORAL-REVIEWED⟧ |
| `disability-accessibility` | Cognitive fatigue, disclosure shame, disability benefit cliffs, double vulnerability — through the Renee persona | ⟦DISABILITY-REVIEWED⟧ |

Run after every tool ships. Run again after any copy, flow, or UX change. Run before any public distribution push.

---

## Do No Harm — The Hardest Constraint

This overrides every other design decision. Every agent must know it.

1. **No recommendations.** Finxiety tools never tell people what to do. They show what's available. "You may qualify for approximately $X/month" — full stop. Not "you should apply." Not "consider applying."

2. **No urgency, no fear, no scarcity.** These are the levers bad financial tools use. Finxiety doesn't touch them.

3. **Estimates are labeled as estimates.** Every calculated output is explicitly framed as an estimate, accompanied by the official source URL to verify.

4. **Consequential decisions get flagged.** When a decision carries significant financial risk, the tool says so and refers to appropriate resources.

5. **If we can't be confident the tool helps, we don't ship it.** Uncertainty about accuracy is a reason to wait, not a reason to disclaim and publish anyway.

**The Do No Harm checklist runs before every QA sign-off and every release. It is non-negotiable.**

---

## Non-Negotiables for This Directory

- **Phone-first.** Every tool is designed for 375px before 1440px. The target population uses phones, not laptops.
- **WCAG 2.1 AA** on every screen. No exceptions. Keyboard navigation, color contrast ≥4.5:1, ARIA labels.
- **No PII.** No user data stored, transmitted, or logged anywhere. Calculation is client-side only. Any deviation requires an ADR.
- **Shared input model first.** `household_size`, `state`, `zip_code`, `gross_monthly_income`, `current_benefits` are defined exactly once in `finxiety/lib/input-model/`. Import; never redefine.
- **Data in JSON, not code.** Eligibility thresholds, certification periods, ALICE budgets live in `finxiety/data/*.json` with `last_updated` fields. Rule logic reads from data. Updating thresholds is a data change, not a code change.
- **Build must pass before push.** Before any `git push` that includes changes under `finxiety/src/`, run `npm run build` from `finxiety/` and confirm it exits 0. Do not push a failing build. The `.githooks/pre-push` hook enforces this automatically — do not bypass it.
- **Official source URLs in every result.** No output tells a user they qualify or don't qualify without linking to where they can verify.

---

## Stack

**SvelteKit + adapter-static deployed on Vercel.** Decided Week 1 (ADR-001 resolved inline).

- All routes are prerendered (`export const prerender = true` in `+layout.ts`)
- No server — 100% client-side calculation, zero SSR needed
- Each new tool = a new route under `src/routes/tools/`
- Shared calculation logic lives in `src/lib/calculators/` (pure TypeScript functions)
- Shared input types live in `src/lib/input-model/types.ts`

## File Structure

```
finxiety/
├── CLAUDE.md              ← this file
├── PRODUCT_BACKLOG.md     ← full merged backlog with ship order
├── BACKLOG_INTAKE.md      ← rough ideas land here; pm agent grooms them
├── IDEAS.md               ← original brainstorm / portfolio framing
├── docs/
│   ├── research-prompts.md  ← policy + market research prompt templates
│   └── adr/               ← architectural decision records
├── research-findings/     ← saved Claude web-search research outputs
├── src/                   ← SvelteKit app
│   ├── app.html           ← HTML shell
│   ├── app.css            ← brand tokens + base styles
│   ├── routes/
│   │   ├── +layout.ts     ← prerender = true
│   │   ├── +layout.svelte ← global shell (header, footer, skip link)
│   │   ├── +page.svelte   ← homepage
│   │   └── tools/
│   │       ├── emergency-fund/+page.svelte  ← EMG-1 (live)
│   │       ├── screener/+page.svelte        ← BEN-1 (planned)
│   │       └── myth-quiz/+page.svelte       ← MYTH-1 (planned)
│   └── lib/
│       ├── calculators/   ← pure TS calculation functions (one file per tool)
│       └── input-model/   ← shared TypeScript types (import; never redefine)
├── static/                ← static assets (favicon, etc.)
├── data/                  ← threshold JSON files (gitignored; update annually)
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Build Order (Short Form)

Two tracks. Track 1 sequence is fixed by dependencies. Track 2 can interleave.

**Track 1 — Financial Inclusion:**
1. MYTH-1 (Myth Quiz) — national, no state data, establishes brand voice
2. BEN-1 (SNAP Screener) — CA-first, builds the shared eligibility engine
3. DOC-1 (Document Checklist) + ALICE-1 (ALICE Assessment)
4. RECERT-1 (Recertification Tracker)
5. CLIFF-1 (Benefits Cliff Calculator) — depends on BEN-1's lib/eligibility/

**Track 2 — Personal Finance Myth-Busting:**
1. EMG-1 (Emergency Fund Checker) — zero external data, fastest tool in either track
2. TIP-1 (Tip Calculator) — lightweight, shareable, state-aware
3. DEBT-VIZ-1 (Debt vs. Growth Visualizer) — pure math + charting component
4. DEDUCT-1 (Deduction/Credit/Refund Clarifier) — federal brackets
5. HOURS-1 (Work Hours Calculator) — most complex; federal + state tax + FICA
6. MYTH-2 (Extended Myth Quiz) — after 2-3 Track 2 calculators are live

**Interleaving option:** MYTH-1 → EMG-1 → BEN-1 → TIP-1 → DOC-1 → DEBT-VIZ-1...  
PM agent owns sequencing decisions based on capacity and distribution priorities.

---

## Research

Use the prompt templates in `docs/research-prompts.md` directly in a Claude conversation with web search. One paste, ask the question, save the output to `finxiety/research-findings/YYYY-MM-DD_[geo]_[topic].md`. No scripts — research happens infrequently enough that a CLI wrapper adds friction without benefit.

---

## Adding a New Tool

1. Create `src/routes/tools/<tool-slug>/+page.svelte`
2. Add the calculation logic to `src/lib/calculators/<tool>.ts` (pure functions, no side effects)
3. Add any new shared input fields to `src/lib/input-model/types.ts`
4. Add a card for the tool to the homepage (`src/routes/+page.svelte`)
5. `npm run build` to verify, then push to deploy

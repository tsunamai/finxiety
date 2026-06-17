# Finxiety — Backlog Intake

Rough ideas land here. The pm agent grooms them into fully-specified tickets in `PRODUCT_BACKLOG.md`. Once groomed, remove the item from this file.

---

## How to Add an Item

One paragraph minimum. Include:
- What problem does this solve?
- Who has this problem?
- Why does it belong in Finxiety (vs. a government resource that already exists)?
- Any data sources or reference tools you're already aware of

No formatting required. The pm agent handles the rest.

---

## Intake Queue

---

### ARCH-RETURN — The Return / Spaced Repetition Problem [Forward-Looking Architecture Note]

**Problem:** Matuschak's enabling environment framework identifies spaced repetition — returning to material across time — as the mechanism that converts a moment of clarity into durable understanding. A single visit to a quiz or calculator rarely changes long-term behavior. Return visits do. This applies directly to MYTH-1, EMG-1, and any quiz or educational format Finxiety ships.

**Why Finxiety can't solve this now:** Finxiety's core constraints are "free always," stateless, and no login. A return mechanism requires either (a) server-side state (login) or (b) persistent client-side state (localStorage). Login is off the table: it creates trust friction for the ALICE user — the moment a civic financial tool asks for an email, it starts to look like every other financial service that has extracted value from this user rather than delivering it. It also increases infrastructure risk, compliance surface, and operational cost in ways that conflict with the 501(c)(3) / fiscal-sponsorship structure. Naomi's verbatim framing: "I probably don't wanna take money, but there is something about maintaining a login that increases risk."

**What "return will be part of the program" means:** Return is a product-layer concern, not a tool-layer concern. It cannot live in Finxiety itself. The most likely paths:

1. **localStorage (device-bound, no PII, no server):** Saves a user's prior estimates, scores, or results locally. No account required. No data leaves the device. Survives across sessions on the same device — not across devices or after clearing browser data. This is fully consistent with the stateless / no-PII constraint and could be added to Finxiety proper if the behavioral science case is strong enough. Research needed: how ALICE users interpret "your progress was saved" without an account — trust risk or trust gain?

2. **Separate companion product:** A lightweight stateful layer (a "return app") that has accounts but is architecturally isolated from Finxiety. Users who want spaced repetition opt into the companion; Finxiety itself stays stateless. The companion links to Finxiety tools but doesn't host them.

3. **Partnership with existing authenticated users:** A nonprofit, employer benefit program, CDFI, or benefits navigator that already has authenticated users integrates Finxiety tools into their platform. Return visits happen in their system. Finxiety provides the tools; the partner provides continuity.

**Architectural principle for anything we build:** Any stateful return mechanism must not compromise the no-login / free always / no-PII constraints of Finxiety proper. If we build a companion product, it is a separate entity — different repo, different legal container if needed, different trust architecture.

**Not a near-term ticket.** This note exists to prevent the problem from being re-derived from scratch in a future session. When Finxiety has 3+ tools live and is seeing return traffic, revisit this note and groom it into a formal architecture decision.

---

### Disability-Specific Benefit Programs (SSI, SSDI, IHSS, CalABLE, Regional Center) [Breadcrumb]

**Problem:** BEN-1 currently screens for SNAP, Medi-Cal, WIC, Lifeline, HEAP, school meals, and CalEITC, all income-threshold programs. None of the disability-specific programs (SSI, SSDI, IHSS, CalABLE, Regional Center) are in scope anywhere in the data layer or backlog, despite the disability-accessibility lens (`finxiety/research-findings/persona-renee-disability-user.md`, `finxiety/docs/disability-accessibility-framework.md`) identifying this as a real gap for a population where disability and poverty are deeply correlated.

**Why now:** Flagged while building the disability-accessibility review lens (infrastructure only; no programs were added in that build). Ready for the pm agent to groom into a ticket now that a review framework exists to check the eligibility design against, particularly the asset-limit and benefit-cliff complexity these programs carry that BEN-1's existing FPL-threshold model doesn't handle.

---

## Groomed (Archived)

Items that have been groomed and moved to `PRODUCT_BACKLOG.md`:

| Item | Groomed Date | Ticket ID | Notes |
|------|-------------|-----------|-------|
| Benefits Myth-Check Quiz | Jun 2026 | MYTH-1 | P0 — first ship (Track 1) |
| SNAP + Benefits Stack Screener | Jun 2026 | BEN-1 | P0-B — core utility |
| Document Checklist Generator | Jun 2026 | DOC-1 | P1 |
| "Are You ALICE?" Self-Assessment | Jun 2026 | ALICE-1 | P1 |
| Recertification Deadline Tracker | Jun 2026 | RECERT-1 | P2 |
| Benefits Cliff Calculator | Jun 2026 | CLIFF-1 | P2 — replaces BEN-2 |
| Real Emergency Fund Checker | Jun 2026 | EMG-1 | P0-T2 — first ship (Track 2) |
| Tip Calculator with Hidden History | Jun 2026 | TIP-1 | P1 |
| Debt vs. Growth Compound Visualizer | Jun 2026 | DEBT-VIZ-1 | P2 |
| Deduction vs. Credit vs. Refund Clarifier | Jun 2026 | DEDUCT-1 | P2 |
| "Where Do Your Work Hours Actually Go?" Calculator | Jun 2026 | HOURS-1 | P2 |
| Extended Myth Quiz (Personal Finance Track) | Jun 2026 | MYTH-2 | P2 — after Track 2 calculators exist |

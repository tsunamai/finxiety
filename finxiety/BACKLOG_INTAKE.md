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

### Tipping Article Series [Content, sourced from tip-1-tipping-research.md]

**Problem:** The TIP-1 research surfaced material well beyond the calculator's scope. Five distinct article ideas, each standalone and each addressing a different angle on tipping that Finxiety's audience encounters in daily life. None of these are calculator-shaped; they are educational content.

**Why Finxiety:** Tipping is a decision the ALICE user makes every week, often under social pressure from POS screens and face-to-face visibility with workers. Understanding the system context behind the decision is useful information that costs them nothing to have.

**Article 1: Who doesn't get tipped.** The person who serves you is one person in a supply chain of people who never see a tip: the cook, the dishwasher, the truck driver, the warehouse worker, the farm worker who harvested the food. Agricultural workers are exempt from FLSA overtime and, in small operations, from the minimum wage entirely. This is the most emotionally resonant angle and the least told.

**Article 2: The $2.13 wage and where it came from.** The federal tipped minimum wage has been $2.13/hr since 1991, unchanged for 35 years. Its history is inseparable from race: tipping was the mechanism that allowed employers to pay freed Black workers (Pullman porters, restaurant servers) sub-living wages and offload the obligation to customers who could discriminate freely. The 1996 FLSA amendment that froze it was lobbied by the National Restaurant Association.

**Article 3: How the tip screen is designed to make you spend more.** POS anchoring (18/20/25% suggested minimums making 18% feel low), the guilt-screen effect (tipping more when the worker watches you enter the amount), skip-button placement, and the spread of tip prompts to contexts with no prior tipping culture.

**Article 4: Does tipping reward good service?** Cornell research (50+ papers, Michael Lynn) and a March 2026 study confirm: tips correlate more with server race, appearance, and social behaviors (name-dropping, a light touch, writing on the check) than with service quality. The incentive mechanism doesn't work. This is a myth-quiz candidate as well.

**Article 5: When DoorDash moved the button.** In December 2023, DoorDash and Uber Eats redesigned their apps to move the tip prompt from before ordering to after delivery. A January 2026 NYC DCWP report documented the result: average tips per delivery dropped from $2.17 to $0.76, a loss of approximately $550 million per year to NYC delivery workers alone. Platform tip manipulation is documented and measurable.

**Source:** `finxiety/research-findings/tip-1-tipping-research.md`

---

### Tipping Quiz Questions for MYTH-2 [Content, sourced from tip-1-tipping-research.md]

**Problem:** MYTH-2 (Extended Myth Quiz, Personal Finance Track, P2) already has a stub note that "Tipping rewards good service" maps to TIP-1. The research now has specific, well-sourced questions ready for MYTH-2 content development.

**Four candidate questions (all sourced, all national scope):**

1. **Racial bias in tipping.** "Black servers receive lower tips than white servers for equivalent service." True, documented in Brewster and Lynn (Sociological Inquiry), replicated. Strong "surprised?" moment. Reveal must follow the MYTH-1 pattern: blame the system (unconscious bias is a documented structural phenomenon), never the guesser.

2. **What tips actually reward.** "What do tips mostly reward?" Correct answer: server social behaviors and diner demographics, not service quality. Cornell research (Michael Lynn, 50+ papers). Format: multiple choice. Works as a reveal that reframes the entire premise of tipping without moralizing.

3. **The $2.13 freeze.** "The federal tipped minimum wage has been $2.13/hr since what year?" Estimate type: year picker. Answer: 1991. Counterintuitive because the number is so low and the freeze so long. Connects naturally to the $2.13 contextual note in TIP-1.

4. **Platform tip manipulation.** "DoorDash moved the tip prompt to after delivery. What happened to average tips in New York City?" Estimate type: dollar amount before vs. after. Answer: dropped from $2.17 to $0.76 per delivery. Source: NYC DCWP January 2026 report. High surprise value; indicts a platform decision rather than individual behavior.

**Not yet groomed.** PM agent should groom these into full question specs (following myth-1-quiz-content.md format) when MYTH-2 enters the active build sequence.

**Source:** `finxiety/research-findings/tip-1-tipping-research.md`

---

### Committed Spend Baseline Calculator [Rough Idea]

**Problem:** Many ALICE users are paycheck-to-paycheck without a clear picture of how much
of their income is already spoken for before any discretionary spending happens. They know
their rent is due and their phone bill is due, but the total committed floor — the sum of
everything they owe every month regardless of choices — is rarely visible as a single number.

**Who has this problem:** Any ALICE user trying to understand where the money goes. Especially
relevant for someone considering a raise, a new job, or a budget change who wants to know
how much flexibility they actually have.

**Why Finxiety:** This is a clarity tool, not a tracker. A stateless version — user enters
their known recurring bills (rent, utilities, subscriptions, loan minimums, insurance, phone),
gets back: total committed monthly spend, committed as % of stated income, and amount
remaining before discretionary spending. No accounts, no persistence, no tracking. Different
from DEBT-VIZ-1 (which focuses on payoff timelines) and EMG-1 (emergency fund size). This
answers: "What's my floor?"

**Phone-first constraint:** Works as a simple form — enter items one at a time, see a running
total, share or screenshot the result. No charts required. The output is a number and a
breakdown list.

**Sourced from:** Kevin Kinnett's personal finance dashboard blog post (Apr 2026) — his
recurring bills + forward cash flow features were the unexpectedly highest-value part of
his app.

---

## Groomed (Archived)

Items that have been groomed and moved to `PRODUCT_BACKLOG.md`:

| Item | Groomed Date | Ticket ID | Notes |
|------|-------------|-----------|-------|
| Benefits Myth-Check Quiz | Jun 2026 | MYTH-1 | P0 — first ship (Track 1) |
| SNAP + Benefits Stack Screener | Jun 2026 | BEN-1 | P0-B — core utility |
| Document Checklist Generator | Jun 2026 | DOC-1 | P1 |
| Recertification Deadline Tracker | Jun 2026 | RECERT-1 | P2 |
| Benefits Cliff Calculator | Jun 2026 | CLIFF-1 | P2 — replaces BEN-2 |
| Real Emergency Fund Checker | Jun 2026 | EMG-1 | P0-T2 — first ship (Track 2) |
| Tip Calculator with Hidden History | Jun 2026 | TIP-1 | P1 |
| Debt vs. Growth Compound Visualizer | Jun 2026 | DEBT-VIZ-1 | P2 |
| Deduction vs. Credit vs. Refund Clarifier | Jun 2026 | DEDUCT-1 | P2 |
| "Where Do Your Work Hours Actually Go?" Calculator | Jun 2026 | HOURS-1 | P2 |
| Extended Myth Quiz (Personal Finance Track) | Jun 2026 | MYTH-2 | P2 — after Track 2 calculators exist |

# Finxiety — Product Backlog
Last updated: Jun 2026

Finxiety is the civic arm of Tsunam.ai: free financial clarity tools for communities the market doesn't build for. Mission: help people make better decisions when the systems are too complicated and the guides cost money.

Full idea portfolio lives in `IDEAS.md`. This backlog covers defined, scoped items ready for prioritization and build. Mortalia (high-net-worth decumulation) is a separate product and separate repo.

---

## THREE TRACKS

**Track 0 — Architecture Prerequisites:** Foundational infrastructure that every tool depends on for embeddability and white-label distribution. ARCH-1 and ARCH-2. Must complete before any tool is distributed to institutional partners.

**Track 1 — Financial Inclusion:** Tools for people navigating poverty, benefits, and government systems. MYTH-1 through CLIFF-1.

**Track 2 — Personal Finance Myth-Busting:** Tools targeting widely-believed financial myths that distort everyday decisions — sourced from behavioral economics research. EMG-1 through MYTH-2.

All tracks: stateless, no accounts, no PII, shared input model where applicable, related-tools footer linking across tracks.

**Interleaving option (Tracks 1 & 2):** Rather than completing Track 1 before starting Track 2, consider alternating tracks release-to-release (e.g., MYTH-1 → EMG-1 → BEN-1 → TIP-1 → DOC-1...) to build both audiences in parallel and give Track 2 tools (pure calculation, zero state data) fast early wins. PM agent owns sequencing decisions.

---

## SHIP ORDER — Active Build Sequence

Eleven tools across two tracks. Each independently deployable. Track 1 sequence is fixed by dependencies (CLIFF-1 depends on BEN-1). Track 2 sequence is by complexity (EMG-1 is zero-data; HOURS-1 is most complex). Interleaving between tracks is a scheduling option, not an architectural constraint.

```
TRACK 0 — Architecture Prerequisites (complete before partner distribution)

  ARCH-1: Extract Shared UI Components
  Prerequisite for ARCH-2 and the embed-ready validation gate.
  Extract Button, InputField, ResultBox, WatchoutBox, BridgeBox
  from EMG-1 into src/lib/components/. Verify all color references
  use CSS variables. Update EMG-1 and MYTH-1 to import from there.

  ARCH-2: iFrame Embed Shell + URL-Param Theming
  Bootstrap script: reads URL params at mount, injects CSS variable
  overrides. PostMessage API: finxiety:resize + finxiety:complete
  + finxiety:error. Deliverable: plain HTML test harness that embeds
  emergency-fund tool with partner theming applied.
  Depends on: ARCH-1.

TRACK 1 — Financial Inclusion Core

  SHIP T1-1 — Establish Brand Voice
    MYTH-1: Benefits Myth-Check Quiz
    National scope. Static quiz. Fastest Track 1 build. Establishes
    brand voice and content-marketing entry point to the suite.

  SHIP T1-2 — Core Utility
    BEN-1: SNAP + Benefits Stack Screener
    CA-first. Builds shared eligibility engine for CLIFF-1 later.
    The quiz earns attention; the screener earns trust.

  SHIP T1-3 — Framing + Documentation
    DOC-1: Document Checklist Generator

  SHIP T1-4 — Administrative Burden [promoted to P1]
    RECERT-1: Recertification Deadline Tracker
    Behavioral review note: Promoted from P2. Prevents the most common way
    enrolled users lose benefits. The .ics reminder is the cleanest
    enabling-environment win in the backlog — something is literally different
    after closing the tab.

  SHIP T1-5 — Economic Complexity
    CLIFF-1: Benefits Cliff Calculator
    Most complex. Depends on BEN-1's lib/eligibility/ engine.

TRACK 2 — Personal Finance Myth-Busting

  SHIP T2-1 — Fastest Build
    EMG-1: Real Emergency Fund Checker
    Pure arithmetic. Zero external data. Fastest tool in either track.
    Strong early-release candidate.

  SHIP T2-2 — Lightweight + Shareable
    TIP-1: Tip Calculator with Hidden History
    Small, shareable, state-aware tipped-wage context.

  SHIP T2-3 — Visualization
    DEBT-VIZ-1: Debt vs. Growth Compound Visualizer
    Pure math, but requires a charting component.

  SHIP T2-4 — Tax Clarity
    DEDUCT-1: Deduction vs. Credit vs. Refund Clarifier
    Federal brackets only for v1.

  SHIP T2-5 — Most Complex
    HOURS-1: "Where Do Your Work Hours Actually Go?" Calculator
    Federal + state tax bracket data + FICA logic.

  SHIP T2-6 — Suite Completion
    MYTH-2: Extended Myth Quiz (Personal Finance Track)
    Build after at least 2-3 Track 2 calculators exist.
```

---

## PRIORITY TIERS

- **P0-ARCH — Prerequisites**: ARCH-1 (component extraction), ARCH-2 (embed shell) — before any partner distribution
- **P0 — First ship (Track 1)**: MYTH-1 — establishes brand voice
- **P0-B — Core utility**: BEN-1 — foundational screener
- **P0-T2 — First ship (Track 2)**: EMG-1 — fastest calculator across both tracks
- **P1 — Framing + Admin Burden**: DOC-1, TIP-1, RECERT-1 — RECERT-1 promoted from P2 per behavioral review: prevents the #1 source of benefit loss (missed recertification), cleanest enabling-environment test in the suite (a calendar event exists after closing the tab)
- **P2 — Economic complexity**: CLIFF-1, HOURS-1 (most complex in each track)
- **P2 — Food security**: FOOD-1, FOOD-2 — promoted from P3 per behavioral review: best match for Dani's tactical present-tense scarcity state; underrated relative to material impact
- **P2 — Visualization / tax clarity**: DEBT-VIZ-1, DEDUCT-1
- **P2 — Suite completions**: MYTH-2
- **P3 — Wave 2 expansion**: WORK-1, WORK-2, HOUSE-1, HOUSE-2, BEN-3, BEN-4

---

## SHARED FOUNDATION

### Shared Input Model [Required before any tool ships]

Define once in `finxiety/lib/input-model/`. Every tool imports from here. Never redefine in tool-specific code.

```
household_size        (integer)
state                 (2-letter US state code)
zip_code              (optional — for county-level ALICE data)
gross_monthly_income  (number)
current_benefits      (multi-select: SNAP, Medicaid, TANF, LIHEAP, EITC, WIC,
                        housing assistance, childcare subsidy, none)
```

### Track 2 Input Model

Define in `finxiety/lib/input-model/` alongside the Track 1 model. Can overlap — `state` is shared.

```
pay_frequency             (weekly | biweekly | semi-monthly | monthly)
gross_pay_per_period      (number)
pre_tax_deductions        (list: {type, amount} — e.g., 401k, health insurance)
federal_filing_status     (single | married-filing-jointly | married-filing-separately | head-of-household)
state                     (2-letter US state code — shared with Track 1 model)
hours_worked_per_period   (number — for time-reframing tools like HOURS-1)
```

### Cross-Tool Notes

- Each tool is independently deployable but imports from `finxiety/lib/`
- Every tool's output screen includes a "related tools" footer once more than one tool exists
- State-specific data lives in versioned JSON files in `finxiety/data/` (e.g., `snap-eligibility-2026.json`) with a `last_updated` field — staleness is trackable and refreshable without code changes
- No user accounts, no databases, no PII storage in any tool
- All calculation is client-side; no user data hits a server

---

## SECTION 0 — ARCHITECTURE PREREQUISITES (Track 0)

### ARCH-1 — Extract Shared UI Components [P0-ARCH]

**What it is:**
Prerequisite for the embed shell and for all future tools. Extracts reusable UI primitives from EMG-1 into `src/lib/components/` so theming changes propagate everywhere and components can be instrumented once.

**Components to extract:**

| Component | Current location | Target |
|---|---|---|
| `Button` | Inline in EMG-1 | `src/lib/components/Button.svelte` |
| `InputField` | Inline in EMG-1 | `src/lib/components/InputField.svelte` |
| `ResultBox` | Inline in EMG-1 | `src/lib/components/ResultBox.svelte` |
| `WatchoutBox` | Inline in EMG-1 | `src/lib/components/WatchoutBox.svelte` |
| `BridgeBox` | Inline in EMG-1 | `src/lib/components/BridgeBox.svelte` |

**Acceptance criteria:**
- All color references in extracted components use CSS variables from `app.css` — no hard-coded hex values
- EMG-1 and MYTH-1 updated to import from `src/lib/components/` with identical visual output
- `npm run build` passes with no type errors

**Depends on:** Nothing
**Blocks:** ARCH-2, all future tool builds

---

### ARCH-2 — iFrame Embed Shell + URL-Param Theming [P0-ARCH]

**What it is:**
The infrastructure that makes institutional embedding possible. A bootstrap script runs on page mount in embedded contexts, reads URL params, and injects partner brand tokens as CSS variable overrides. PostMessage API enables the parent page to resize the iframe and react to tool completion.

**Deliverables:**
1. Bootstrap script in `src/lib/embed/bootstrap.ts` — reads URL params, validates values, injects CSS variable overrides at `document.documentElement`
2. PostMessage emitter utility in `src/lib/embed/postmessage.ts` — typed events (`finxiety:complete`, `finxiety:resize`, `finxiety:error`)
3. Height observer wired into `+layout.svelte` — emits `finxiety:resize` on DOM height change
4. Plain HTML test harness at `finxiety/embed-test.html` — embeds EMG-1 with partner theming applied via URL params; confirms PostMessage events fire correctly

**Supported URL params:** See ADR-002 (`finxiety/docs/adr/ADR-002-embeddability.md`) for full param table.

**PostMessage payload spec:** See ADR-002. No PII in any payload.

**Acceptance criteria:**
- `embed-test.html` opened in a browser embeds EMG-1 with a custom `primaryColor` and `partnerName` applied correctly
- `finxiety:complete` fires when the user reaches the result screen
- `finxiety:resize` fires on step transitions (height changes)
- Default Finxiety brand renders normally when no URL params are present (direct traffic)
- No console errors in embedded or direct-traffic context

**Depends on:** ARCH-1
**Enables:** Embed-ready validation gate for all tools; institutional partner distribution

---

## SECTION A — FINANCIAL INCLUSION CORE

### MYTH-1 — Benefits Myth-Check Quiz [P0 — First Ship]

**What it is:**
A short interactive quiz (8-12 questions) that surfaces and corrects widespread false beliefs about public benefits programs. True/false or multiple-choice format; each question followed by an immediate explanation and citation. Doubles as content marketing — high shareability, no state-specific complexity.

**The user experience:**
> "What percentage of SNAP recipients do you think are employed?"
> → User commits to an estimate (slider or short input) before seeing the answer.
> → "68% — here's why that surprises most people." [Explanation with data.] [Link to Benefits Cliff Calculator →]

The quiz does not use True/False or multiple-choice recognition format. Users commit to a belief before the reveal — this is the mechanism that makes belief revision possible (vs. just information reception). See Quiz Design Methodology below.

**Quiz Design Methodology (required — must pass Matuschak enabling environment lens):**

The quiz uses **estimate-before-reveal** as its core interaction pattern, not True/False or multiple-choice recognition. This is a behavioral requirement, not a UX preference — it determines whether the quiz actually changes beliefs.

*Why this matters:* Recognition-format quizzes (True/False, MCQ) allow the user to evaluate each option against the correct answer without committing to a belief. This produces the feeling of learning without the mechanism for belief revision. Estimate-before-reveal forces the user to externalize a belief before seeing any answer, creating cognitive dissonance when the actual value differs — which is the condition under which beliefs actually update.

**Each question follows this sequence:**
1. **Estimate prompt** — a quantitative question ("What percentage...?" "How many months...?") with a slider or short numeric input. Not "true or false" or "which of the following."
2. **Commitment** — user submits their estimate before the answer is revealed.
3. **Reveal** — actual figure with source citation, framed around the gap from their estimate.
4. **Elaboration** — 2-3 sentences on why the gap exists (structural, not moral — "the program was designed to..." not "many people don't realize...").
5. *(Optional)* **Elaborative interrogation** — "What made you think that?" as a soft follow-up before the reveal, surfacing the reasoning chain. This deepens the dissonance. Implement if technically feasible; deprioritize if it slows the flow.

**End-of-quiz synthesis questions:**
After all questions, ask 1-2 questions that connect earlier estimates: "Earlier you thought X% of SNAP recipients work. Knowing now it's 68%, what does that change about how you'd describe the program to someone else?" This is the moment most likely to consolidate learning — the quiz ends with the user generating language, not just receiving it.

**Behavioral review requirement:** This tool must pass the Matuschak enabling environment lens in behavioral review. The sign-off question is: "After Dani closes this tab, will anything be *different* tomorrow?" If the answer is "she now knows the number" rather than "she now understands something that changes a future conversation or decision," it has not passed.

**Why first:**
- National scope — no state-specific data required
- Fastest to build: static quiz content, client-side scoring
- Establishes Finxiety brand voice before the harder tools ship
- High shareable moment: "You got 7 out of 10 — most people don't know this"
- Each answer links to the relevant tool in the suite (myths about cliffs → CLIFF-1; myths about recertification → RECERT-1)

**Sample topics (research and expand during build):**
- "Most SNAP recipients don't work" → False (USDA data)
- "If I save money, I'll lose my benefits" → It depends — explain asset limits; note states that eliminated them
- "Applying for SNAP takes a few minutes" → False — explain average time and documentation burden
- "Getting a raise will always leave me better off" → It depends (CTA: CLIFF-1)
- "If I'm on Medicaid, I can't have a job" → False — most recipients are working-age and employed
- "SNAP benefits last the whole month easily" → Explore end-of-month exhaustion patterns

**Outputs:**
- Score + personalized summary
- Each answer links to relevant deeper tool in the suite

**V1 scope:**
- National-level facts only (no state-specific logic)
- 8-12 questions
- Static quiz content, client-side scoring

**Data sources:**
- USDA SNAP participant demographics
- CBPP / FRAC research (see `research-findings/` — use policy research prompt in `docs/research-prompts.md` if not already done)

**Technical approach:**
- Static JSON quiz content file in `finxiety/data/myth-quiz-content.json`
- Client-side scoring and question flow
- No shared input model fields required (first tool to ship; can be standalone)
- Output screen links to CLIFF-1, RECERT-1, BEN-1 via related-tools footer

**No storage required.** Static quiz content, client-side scoring.

**Status: LIVE** — https://finxiety.vercel.app/tools/myth-quiz
**Validated:** pending — validation gate not yet run

---

### BEN-1 — SNAP + Benefits Stack Screener [P0-B — Core Utility]

**What it is:**
A "router and translator" tool. Asks plain-language questions (household size, income, state, ages), applies public eligibility rules for SNAP and related programs, and points people to the official .gov application to apply. It does not submit on their behalf. It does not collect sensitive data. It is a clarity engine, not a government system.

**The core experience:**
> Tell me your ZIP code, household size, income, and ages.

Response:
> You may qualify for:
> - SNAP (food assistance)
> - Medi-Cal / Medicaid
> - Lifeline (phone / internet)
> - HEAP (utility assistance)
> - School meal programs
> - Local food pantry access
>
> Here's where to apply for each. →

**Why second:**
- Data sources are public and annually stable (thresholds update once a year, not daily)
- Reference implementations exist: mRelief, GetYourRefund, Benefits.gov screener
- Doesn't compete with or impersonate government systems — explicit design constraint
- Eligibility logic is rule tables, not simulation — clean scope for the harness
- High pain, high data availability, low build effort

**Design constraints:**
- Never submit applications on behalf of users
- Always route to official .gov or state agency URL
- Clearly label as an estimator, not a determination
- California-first v1

**Programs in scope (v1 — California):**

| Program | Administering agency | Threshold type | Update cadence |
|---------|---------------------|----------------|----------------|
| SNAP (CalFresh) | CA CDSS | Federal poverty level (FPL) | Annual (Oct) |
| Medi-Cal | CA DHCS | ACA Medicaid expansion (138% FPL) | Annual |
| WIC | CA WIC | Income + categorical (pregnant/infant) | Annual |
| Lifeline (phone) | FCC / CA PUC | FPL or program-based | Annual |
| HEAP (utility) | CA CDSS | 60% state median income | Annual |
| School meals (free/reduced) | USDA / local district | FPL-based | Annual |
| CalEITC | CA FTB | Earned income + filing status | Annual |

**Programs in scope (v2 expansion):**
- CalWORKs (cash aid)
- Housing assistance (Section 8 / HCV — waitlists, not auto-qualifying)
- Senior programs (PACE, SSI, Medicare Savings Programs)
- Veteran benefits navigator
- Child care subsidies

**Data sources:**
- Federal FPL: HHS ASPE (aspe.hhs.gov)
- CalFresh income limits: ca.gov/services + CDSS fact sheets
- Medi-Cal thresholds: DHCS annual update
- WIC: USDA Food and Nutrition Service
- Lifeline: FCC Lifeline program website
- HEAP: CA CDSS Energy Assistance fact sheets

**Reference implementations to study:**
- mRelief (mrelief.com) — conversational SNAP screener, SMS-first
- GetYourRefund (getyourrefund.org) — EITC screener + tax prep routing
- Benefits.gov screener — federal multi-program screener
- BenefitsCal (benefitscal.com) — CA state's own screener (official)

**Technical approach:**
- Rule tables as structured data in `finxiety/data/snap-eligibility-{year}.json` — not hardcoded in logic
- Plain-language question flow — not a form, a conversation
- Output: eligibility estimate + official application URL for each qualifying program
- Eligibility engine in `finxiety/lib/eligibility/` — imported by CLIFF-1 later
- Stack: TBD — see ADR needed (Streamlit vs. web-native; recommendation is web-native for mobile-first)

**What success looks like:**
A person who earns $2,200/month with a family of three gets a clear, accurate list of programs they likely qualify for and exactly where to apply — in under 2 minutes.

**No storage required.** All calculation client-side.

**Status: LIVE** — https://finxiety.vercel.app/tools/screener
**Validated:** in progress (2026-06-15) — UX and behavioral gates blocked; see `status-updates/`

---

### DOC-1 — Document Checklist Generator [P1]

**Problem statement:** Someone applying to more than one benefits program has to assemble overlapping but non-identical paperwork from separate agency websites, with no single source telling them what one folder of documents would satisfy all of their applications at once.

**Target user:** A parent applying to CalFresh and Medi-Cal in the same week who has already been asked for "proof of income" twice and does not know whether the pay stubs they gathered for one application will also work for the other. The person who gave up on a second application last year because the document hunt felt like starting over from scratch. They are doing this on a phone, often after the kids are asleep, with limited bandwidth and no caseworker to call.

**Inputs:**
- **Programs** — multi-select, required. Which programs the user is applying for. v1 set: SNAP (CalFresh), Medicaid (Medi-Cal), LIHEAP (HEAP in CA), EITC (CalEITC). At least one must be selected before a checklist renders. Presented as plain-language labels with the program acronym in parentheses, no jargon.
- **State** — 2-letter selector, required. Uses the shared input model `state` field (`finxiety/src/lib/input-model/types.ts`); do not redefine. Drives state-specific overrides. v1: CA has full state-specific data. Any other state renders the federal baseline with a clearly labeled note that requirements are shown at the national level and the user should confirm with their state agency.

No other shared input fields are used. DOC-1 does not ask for `household_size`, `income`, or `current_benefits`; it is a documentation planner, not an eligibility screener. Keeping the input surface to two fields is a scarcity-bandwidth decision, not an oversight.

**Outputs:**
- A single de-duplicated checklist covering all selected programs, grouped by document category in this fixed order: **Identity, Income, Residency, Household composition, Program-specific.**
- Each line item shows: the document name, a plain-language one-line description of what counts, a REQUIRED / IF THIS APPLIES TO YOU / CHOOSE ONE label, and a "needed for" tag naming which selected programs require it (e.g., "needed for CalFresh and Medi-Cal").
- **Divergence callouts** rendered inline on the relevant item, never as a separate wall of caveats. Example: under Residency, "CalFresh can accept a utility bill, a lease, or recent mail. HEAP specifically needs a recent energy or utility bill, so a copy of that one bill covers both."
- **CHOOSE ONE groups** render as a small set the user picks from, with the shared note "Any one of these works" so the user does not gather all of them.
- A short header line: "These are the documents commonly requested for the programs you picked. Your county may ask for something slightly different. This is a guide, not the official list." Carries the official source URL per program (links below).
- **Copy to clipboard** and **Print** actions. Both run entirely client-side. No download-to-file, no PDF in v1 (see V1 scope). The clipboard payload is plain text, grouped by category, with the "needed for" tags preserved.
- Related-tools footer linking to BEN-1 (to check what they may qualify for) and RECERT-1 (which reuses this checklist for recertification).

All output uses "commonly requested" / "your county may ask" framing. No output tells the user a document is mandatory in their specific case, because county-level practice varies; the tool surfaces the common baseline and routes to the official source for confirmation.

**V1 scope:**
- **Four programs:** SNAP (CalFresh), Medicaid (Medi-Cal), LIHEAP (HEAP), EITC (CalEITC).
- **One state with full data: California.** CA gets state-specific document language and divergence notes. Every other state renders the federal baseline with a labeled "national baseline — confirm with your state" banner. Multi-state divergence (TX, FL, NY, AZ and beyond) is explicitly OUT for v1 and deferred to v2. (This narrows the earlier stub's CA+4 ambition: compiling verified document lists for five state administrations is a much larger research task than the P1 slot supports, and CA-first matches BEN-1's scope so the two tools tell a consistent story.)
- **Five document categories**, fixed order, as listed in Outputs.
- **De-duplication across selected programs** is in scope and is the core feature.
- Output via **copy-to-clipboard and print only.** No file download, no PDF generation.

**Data sources:**
The document-requirements data must be compiled into a static JSON file before build. There is no existing research file for DOC-1 in `research-findings/` — see Open Questions; this compilation is a blocking pre-build task. Named primary sources for the compilation:
- **SNAP / CalFresh:** USDA FNS SNAP applicant documentation guidance (https://www.fns.usda.gov/snap/applicant-recipient) and CA CDSS / BenefitsCal CalFresh verification list (https://www.cdss.ca.gov/calfresh and https://benefitscal.com).
- **Medicaid / Medi-Cal:** Medicaid.gov eligibility documentation (https://www.medicaid.gov/medicaid/eligibility) and CA DHCS Medi-Cal "what you need to apply" (https://www.dhcs.ca.gov/services/medi-cal).
- **LIHEAP / HEAP:** federal LIHEAP program documentation (https://www.acf.hhs.gov/ocs/programs/liheap) and CA CSD HEAP required-documents list (https://www.csd.ca.gov/energybills).
- **EITC / CalEITC:** IRS EITC documentation requirements (https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit-eitc) and CA FTB CalEITC (https://www.ftb.ca.gov/file/personal/credits/california-earned-income-tax-credit.html).

**Research effort estimate:** ~1 focused research session (3–4 hours) to compile the four programs at the federal baseline plus CA overrides into `doc-requirements.json`, cross-checking each document item against two sources. The output is the seed data plus a short findings note saved to `finxiety/research-findings/YYYY-MM-DD_CA_doc-requirements.md` recording which sources backed each item. This must complete and be verified before the engineer starts.

**Technical approach:**
New route `finxiety/src/routes/tools/document-checklist/+page.svelte`, prerendered like every other route. Document requirements live as static data in `finxiety/src/lib/data/doc-requirements.json` (schema below), keyed by program with a CA override block. A pure de-duplication / merge function in `finxiety/src/lib/calculators/doc-checklist.ts` takes the selected program list plus state and returns a category-grouped, de-duplicated checklist with "needed for" tags and resolved divergence notes. Clipboard uses the browser Clipboard API with a textarea fallback; print uses a print-optimized CSS stylesheet so the on-screen checklist reformats cleanly for paper. No server, no storage, no PII. Add a homepage card per the standard new-tool steps. Reuses ARCH-1 shared UI components (Button, multi-select, ResultBox) if landed by build time; otherwise build local and flag for later extraction.

**De-duplication algorithm spec:**
The merge function operates on the selected programs and resolves three cases. Each document requirement in the data file carries a stable `id`; merging is keyed on that `id`.

1. **Identical requirement (simple dedup).** When two or more selected programs reference the same document `id`, emit one line item. Its "needed for" tag lists every selected program that referenced it. Example: SNAP and Medicaid both reference `income.pay_stubs`. The checklist shows "Recent pay stubs" once, tagged "needed for CalFresh and Medi-Cal." A document required by one program and only sometimes-required by another resolves to REQUIRED on the merged item (the stricter status wins), with the conditional program still listed in the "needed for" tag.

2. **Same category, different acceptable documents (show the satisfying set).** Some requirements are CHOOSE ONE groups: a program accepts any one of several documents to satisfy a need (e.g., residency accepts utility bill OR lease OR recent mail). When multiple selected programs each have a CHOOSE ONE group in the same need, the merged group is the **intersection** of acceptable documents — the documents that satisfy ALL selected programs — surfaced first under "Any one of these works for all of them." If the intersection is empty (no single document satisfies every program's residency need), the tool does NOT silently drop the requirement; it lists each program's accepted set separately with its own "needed for" tag and a divergence note. The HEAP-vs-CalFresh energy-bill case is the canonical example: CalFresh residency intersection includes a utility bill, HEAP narrows to an energy/utility bill specifically, so the merged result surfaces "a recent energy or utility bill" as the one document that covers both, with the note explaining why.

3. **Program-specific requirement (show separately).** A document required by only one selected program (e.g., HEAP's recent energy bill, EITC's prior-year tax return / SSNs for everyone claimed) renders as its own line item under the appropriate category, tagged "needed for [that program] only." It is never merged away.

Ordering within each category: REQUIRED items first, then CHOOSE ONE groups, then IF THIS APPLIES TO YOU items. Across categories, the fixed order from Outputs.

**User flow spec:**
All copy below is brand-final and must pass brand review before build. Plain language, no jargon, no urgency, no shame.

- **Step 1 — Program selection.** Heading: "Which programs are you applying for?" Helper: "Pick all that apply. We'll build one document list that covers them all." Multi-select with the four program labels. A "Next" action, disabled until at least one is selected.
- **Step 2 — State selection.** Heading: "Which state are you applying in?" Helper: "Document requirements are set state by state. Right now we have full detail for California; for other states we'll show the national baseline." State selector defaulting to no selection. "Show my list" action.
- **Step 3 — Checklist display.** Heading: "Your document list." Sub-line: the "commonly requested … this is a guide, not the official list" header from Outputs. Then the de-duplicated, category-grouped checklist with inline divergence callouts. If state is not CA, a labeled banner above the list: "Showing the national baseline. Your state may ask for something different — check the official link for each program below." Each program block in the footer carries its official source URL.
- **Step 4 — Take it with you.** Two actions: "Copy this list" (clipboard) and "Print" (print stylesheet). Confirmation microcopy after copy: "Copied. Paste it into your notes or a message to yourself." No email capture, no account, no "save."

**Dependencies:**
- Shared input model `state` field (`finxiety/src/lib/input-model/types.ts`) — already exists.
- `finxiety/src/lib/data/states.ts` for the state selector list — already exists.
- ARCH-1 shared UI components if landed by build time; not a hard blocker.
- RECERT-1 depends on DOC-1's data and merge logic (it reuses the checklist for recertification); DOC-1 does not depend on RECERT-1. BEN-1 and DOC-1 are independent but cross-link.

**Data file schema** (`finxiety/src/lib/data/doc-requirements.json`):
```jsonc
{
  "last_updated": "2026-06-XX",        // build-date of the compiled data
  "verify_at": {                        // official source per program, for the release freshness audit
    "snap": "https://www.fns.usda.gov/snap/applicant-recipient",
    "medicaid": "https://www.medicaid.gov/medicaid/eligibility",
    "liheap": "https://www.acf.hhs.gov/ocs/programs/liheap",
    "eitc": "https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit-eitc"
  },
  "_note": "Document requirements compiled at the federal baseline with California overrides. v1 scope: SNAP/CalFresh, Medicaid/Medi-Cal, LIHEAP/HEAP, EITC/CalEITC. Non-CA states render the federal baseline only. Re-verify annually; agency document lists change.",
  "programs": {
    "snap": {
      "label": "SNAP (CalFresh)",
      "official_url": "https://benefitscal.com",
      "requirements": [
        {
          "id": "identity.gov_id",          // stable id used as the merge key
          "category": "identity",            // identity | income | residency | household | program_specific
          "name": "Government-issued photo ID",
          "description": "A driver's license, state ID, or passport for the person applying.",
          "status": "required",              // required | conditional | one_of
          "one_of_group": null,              // group key when status === "one_of"; null otherwise
          "condition_note": null             // shown when status === "conditional", e.g. "if anyone in your home is self-employed"
        },
        {
          "id": "residency.proof",
          "category": "residency",
          "name": "Proof of where you live",
          "description": "A utility bill, a lease, or recent mail with your name and address.",
          "status": "one_of",
          "one_of_group": "residency_proof",
          "condition_note": null,
          "accepts": ["utility_bill", "lease", "recent_mail"]   // members of the one_of group, for intersection logic
        }
      ]
    },
    "medicaid": { "label": "Medicaid (Medi-Cal)", "official_url": "...", "requirements": [ /* ... */ ] },
    "liheap":   { "label": "LIHEAP (HEAP)",       "official_url": "...", "requirements": [ /* ... */ ] },
    "eitc":     { "label": "EITC (CalEITC)",      "official_url": "...", "requirements": [ /* ... */ ] }
  },
  "state_overrides": {
    "CA": {
      // Per-requirement overrides keyed by the same requirement id.
      // Each override may replace name/description/status/accepts and may add a divergence_note.
      "snap": {
        "residency.proof": {
          "divergence_note": "CalFresh can accept a utility bill, a lease, or recent mail. If you're also applying for HEAP, use a recent energy or utility bill so one document covers both."
        }
      },
      "liheap": {
        "program_specific.energy_bill": {
          "status": "required",
          "divergence_note": "HEAP specifically needs a recent energy or utility bill. This same bill also works as proof of where you live for CalFresh and Medi-Cal."
        }
      }
    }
  }
}
```
Notes on the schema: the federal `programs` block is the baseline every state falls back to. `state_overrides.CA` patches individual requirements by `id` and is the only state populated in v1. The release agent's freshness audit reads `last_updated` and the `verify_at` map. Every document item carries a stable `id` so the merge function and RECERT-1 can both key on it. Representative seed content for SNAP is shown above; the full four-program compilation is the pre-build research task.

**Acceptance criteria:**
- [ ] Selecting SNAP + Medicaid produces a checklist where a shared item such as "Recent pay stubs" (`income.pay_stubs`) appears exactly once, tagged "needed for CalFresh and Medi-Cal," not twice.
- [ ] Selecting SNAP + LIHEAP with state = CA produces a residency result that surfaces "a recent energy or utility bill" as the single document covering both, with the CA divergence note explaining why; the energy bill does not appear as two separate items.
- [ ] A CHOOSE ONE residency group renders with "Any one of these works" and does not instruct the user to gather every option.
- [ ] A program-specific item required by only one selected program (e.g., EITC's prior-year tax return when only EITC is selected) renders under its category tagged "needed for CalEITC only" and is never merged away.
- [ ] When two programs assign different statuses to the same `id` (one REQUIRED, one conditional), the merged item shows REQUIRED and the "needed for" tag still lists both programs.
- [ ] Selecting all four programs with state = CA produces a checklist of no more than 12 line items (de-duplication is working; if it exceeds 12, merging has failed).
- [ ] State = CA shows CA-specific divergence notes; state = TX (or any non-CA) shows the federal baseline with the "Showing the national baseline" banner and no CA-only notes.
- [ ] Selecting zero programs does not render a checklist; the "Next" action stays disabled until at least one program is selected.
- [ ] "Copy this list" places the grouped, de-duplicated plain-text checklist (with "needed for" tags) on the clipboard with no network request; "Print" reflows the checklist via the print stylesheet with no network request.
- [ ] Every program block in the footer carries its official source URL, and the header frames the list as a guide, not the official requirement set.
- [ ] WCAG 2.1 AA met: multi-select and state selector fully keyboard-operable, every control labeled, color contrast ≥ 4.5:1, status labels (REQUIRED / CHOOSE ONE / IF THIS APPLIES) not conveyed by color alone, touch targets ≥ 44px.
- [ ] Mobile-first: the full flow and the four-program checklist are usable at 375px with no horizontal scroll; verified at 375px before 1440px.
- [ ] All outputs use "commonly requested" / "your county may ask" framing; no urgency, no recommendation, no shame (Do No Harm checklist passed — see `finxiety/CLAUDE.md`).
- [ ] `doc-requirements.json` includes `last_updated` and the `verify_at` source map.
- [ ] Homepage card added to `finxiety/src/routes/+page.svelte`.
- [ ] `npm run build` from `finxiety/` exits 0.

**Out of scope for v1 (explicit):**
- Multi-state document divergence beyond California (TX, FL, NY, AZ, and all others) — they render the federal baseline only. v2.
- WIC and its program-specific documentation (proof of pregnancy / infant, medical/nutritional risk). Not in the v1 four-program set. v2.
- TANF / CalWORKs, housing assistance (Section 8 / HCV), childcare subsidy documentation. v2+.
- Immigration-status documentation. Deliberately OUT — this is sensitive, high-stakes, and county-variable; surfacing it incorrectly risks deterring eligible applicants or implying a requirement that does not apply to mixed-status households. Document only via the official source links. Revisit only with dedicated research and a behavioral + brand review.
- PDF generation and file download — copy-to-clipboard and print only in v1.
- Persisting or pre-filling the user's selections across sessions (no storage; consistent with the no-PII / stateless constraint).
- Eligibility determination — DOC-1 lists documents; it does not tell the user whether they qualify. That is BEN-1's job, and the footer links there.

**Open questions:**
- **Research compilation is a blocking pre-build dependency.** No DOC-1 research file exists in `research-findings/`. The four-program document data (federal baseline + CA overrides) must be compiled and source-verified into `doc-requirements.json`, with a findings note saved to `research-findings/`, before the engineer starts. Owner: research session, then PM verification. → Escalate scheduling to Naomi.
- Should the "needed for" tag use full program names ("CalFresh and Medi-Cal") or short tags throughout? Default to the plain program names used in the labels. → Brand agent.
- Confirm the 12-item ceiling for all-four-programs-CA is realistic against the actual compiled data; adjust the acceptance-criteria number once the data exists if real de-duplicated counts differ. → PM, after research.

⟦PM-GROOMED⟧ ticket="DOC-1" date="2026-06-17"

---

### RECERT-1 — Recertification Deadline Tracker [P2]

**What it is:**
People lose benefits not because they're ineligible but because they miss a recertification deadline or lack documents at the right moment. This is the single largest administrative burden leakage point. The tool calculates when each benefit recertifies and generates a downloadable calendar reminder.

**Inputs:**
- Benefit type(s): SNAP, Medicaid, TANF, etc. (multi-select)
- State
- Last certification/approval date (or "I don't know" option with guidance on how to find it)

**Outputs:**
- Estimated next recertification date(s) per benefit, based on state-specific certification period lengths (varies 6-12 months by state/program)
- Document checklist of what's typically needed for recertification (links to DOC-1 for the full list)
- Downloadable `.ics` calendar file with reminder dates ~30 days and ~7 days before each deadline — generated client-side; user adds to their own calendar app

**V1 scope:**
- CA + TX + FL + NY + AZ (5 states)
- SNAP + Medicaid certification periods only

**Data sources:**
- State SNAP/Medicaid policy manuals — certification period lengths are published per state

**Technical approach:**
- State certification periods in `finxiety/data/certification-periods-{year}.json`
- `.ics` file generation in `finxiety/lib/ics-generator/` — pure client-side, no email/server storage
- Uses `state` and `current_benefits` from shared input model

**No storage required.** Dates calculated and rendered client-side; `.ics` generated and downloaded directly.

---

### CLIFF-1 — Benefits Cliff Calculator [P2]

**What it is:**
"What happens if I take this raise?" A tool that shows how income changes affect benefit eligibility and total net resources. The benefits cliff — where earning more triggers a net loss — is one of the most consequential and least-understood dynamics for people in the $20K–$60K income range.

**Inputs:**
- Full shared input model
- Hypothetical new monthly income (to compare against current)

**Outputs:**
- Side-by-side comparison: current total resources (net income + benefit value) vs. hypothetical total resources at new income level
- Net change (could be negative — this is the cliff)
- Plain-language explanation of which specific benefits cause the drop ("At $X/month you lose Medicaid eligibility, which costs you $Y/month in premiums")
- Visual: simple bar or line chart showing total resources across an income range from $0 to $80K/year, so the cliff is visible as a dip
- "What to ask your employer" framing — benefits packages, phased raises, HSA contributions

**V1 scope:**
- CA, TX, FL, NY, AZ — 5 states
- SNAP and Medicaid only for v1
- Expand to childcare subsidy, TANF, housing in v2

**Data sources:**
- State SNAP/Medicaid eligibility formulas (public, via state .gov benefits pages and USDA SNAP eligibility tool documentation)
- Federal Poverty Level tables (HHS, updated annually)
- Benefit value estimation: average benefit amounts per household size from USDA/state data

**Technical approach:**
- Imports eligibility rule engine from `finxiety/lib/eligibility/` (built for BEN-1)
- Calculates eligibility and benefit value at each $1K income increment from $0 to $80K
- All calculation client-side; chart rendered in-browser (lightweight charting library — no server)

**Depends on:** BEN-1 (shared eligibility rule engine in `finxiety/lib/eligibility/`)

**No storage required.** All calculation client-side.

**Status: LIVE** — https://finxiety.vercel.app/tools/cliff-calculator
**Validated:** pending — validation gate not yet run

---

## SECTION B — FOOD SECURITY

### FOOD-1 — Healthy Meals by Budget [P3]

"I have $X until Friday. What should I buy?" A grocery planning tool that takes a budget, household size, and dietary constraints and returns a realistic meal plan with a shopping list optimized for nutrition per dollar. Not a recipe generator — a budget allocator.

Data: USDA food cost data (Thrifty Food Plan), current grocery price indices, regional cost variation. CA-first on pricing data.

**Why it belongs here:** Food insecurity and SNAP eligibility often overlap. A user who just screened for CalFresh (BEN-1) and is waiting for approval needs to eat this week. FOOD-1 is the immediate practical companion.

---

### FOOD-2 — SNAP Stretch Calculator [P3]

Given a SNAP allotment ($X/month for household of Y), show what a realistic month of groceries looks like — meals per day, cost per meal, gap between allotment and actual cost of a nutritious diet. Surfaces where the gap is and what supplemental resources (food pantries, WIC, school meals) can fill it.

Reference: USDA Thrifty Food Plan as the benchmark for "adequate nutrition at minimum cost."

---

## SECTION C — WORK & INCOME

### WORK-1 — Job Offer Reality Calculator [P3]

"Will taking this job actually leave me better off?" Takes two offers (or current vs. new) and computes true net compensation: salary, benefits, commute cost, childcare changes, tax changes, benefit cliff effects. Most job-change decisions are made on gross salary alone. This shows net-of-everything.

**The insight:** A $50K job in a high-cost city with no benefits, 2 hours commuting, and loss of childcare subsidy can be worse than a $38K job nearby with healthcare. The calculation is non-obvious and rarely done.

---

### WORK-2 — Childcare vs. Employment Calculator [P3]

"Does it make financial sense for me to work if childcare costs this much?" Frames the calculation clearly: net income after childcare, commute, and lost subsidy eligibility. Includes the often-missed long-term framing: even a small positive net is worth it for career continuity, Social Security credits, retirement contributions.

---

## SECTION D — HOUSING STABILITY

### HOUSE-1 — Rent Burden Calculator [P3]

"What rent can I actually afford?" Shows: rent as % of gross income, rent as % of take-home, and whether current or target rent crosses the standard 30% affordability threshold. Overlaid with local median rents and housing assistance eligibility from BEN-1.

---

### HOUSE-2 — Eviction Risk Self-Assessment [P3]

A tool for renters who are behind on rent to understand their legal rights and options. Surfaces local eviction moratorium status, CA tenant protection laws, emergency rental assistance programs, legal aid resources. Navigation tool only — Finxiety does not give legal advice.

---

## SECTION E — EXPANDED BENEFITS

### BEN-3 — Senior Benefits Finder [P3]

Dedicated screener for adults 60+. Programs most seniors don't know they qualify for: Medicare Savings Programs, Extra Help (Part D), SNAP for seniors (different thresholds), PACE, SSI, property tax exemptions.

---

### BEN-4 — Nonprofit / Case Worker Intake Tool [P3]

The BEN-1 eligibility logic packaged for case workers at food banks, workforce centers, or social services nonprofits. Outputs a referral sheet (printable). Tracks which programs were surfaced and which the client was referred to. B2B distribution path: grant-funded or sold to nonprofits.

---

## SECTION F — PERSONAL FINANCE MYTH-BUSTING TOOLS (Track 2)

Tools targeting widely-believed financial myths that distort everyday decisions — sourced from behavioral economics research and the myth list in Appendix A. Same constraints as Track 1: stateless, no accounts, no PII. National scope for all Track 2 tools (no state-specific eligibility logic).

---

### EMG-1 — Real Emergency Fund Checker [P0-T2 — First Track 2 Ship]

**What it is:**
People conflate "whatever's left in checking" with a real emergency fund. This tool draws a hard line between designated savings and leftover cash, showing the actual runway gap and naming the behavioral pattern behind the confusion.

**Inputs:**
- Checking account balance (leftover/undesignated cash)
- Designated emergency savings balance (separate account, if any)
- Monthly essential expenses (rent/mortgage, utilities, groceries, insurance, minimum debt payments)

**Outputs:**
- "Months of runway" calculated two ways: (1) using only designated savings, and (2) using designated savings + leftover checking
- Visual gap between perceived safety net and actual designated runway
- Plain-language note: leftover checking cash gets consumed by the next irregular expense before it can function as a true emergency fund — designating it changes that behavior

**V1 scope:**
Pure calculation, no state/program data required. Fastest tool across both tracks.

**Data sources:** None — user-supplied numbers only.

**No storage required.** Single-session calculation, all client-side.

**Status: LIVE** — https://finxiety.vercel.app/tools/emergency-fund  
**Validated:** 2026-06-14 — see `status-updates/emg-1-validation-2026-06-14.md`

#### EMG-1 v1.1 — Post-Ship Refinements

_Address before high-volume distribution. Behavioral analysis: `research-findings/emg-1-behavioral-analysis.md`._

| # | Item | Severity | From |
|---|---|---|---|
| 1 | **Near-zero cross-tool signpost.** When runway ≈ 0, show an informational bridge (not advice) — framed as "tools that check X exist" — pointing toward a benefits-eligibility check. Copy locates the cause in structural slack/income, not willpower. Coordinate with shared input model so BEN-1 can pick up `gross_monthly_income`/`current_benefits` without re-entry when it ships. | High | Behavioral |
| 2 | **De-emphasize zero-case result typography.** Reduce font-weight/scale on the primary number in the near-zero result state and/or give the contextual reframe shared visual weight so the eye doesn't land on a bold "0" in isolation. Design-ux + brand review. | High | Behavioral |
| 3 | **Rewrite contextual note's third sentence.** Keep sentences 1–2 verbatim ("Checking balances tend to cover the next irregular expense..."). Replace "Designating a separate savings account is what changes that" with copy that names why designating is structurally hard under tight margins — drops the implied prescription. Brand review. | Medium | Behavioral |
| 4 | **Replace "runway" throughout.** Button ("Calculate my runway") and results h2 ("Your runway") → "months covered" or equivalent plain unit. Brand review. | Medium | Behavioral |
| 5 | Recalculate resets all inputs — should return to form with prior values preserved so users can tweak one number without re-entering all three | Medium | UX |
| 6 | Soften entry-question hypothetical ("without income" → present-tense conditional framing). Low effort; reduces future-simulation burden under scarcity. | Low | Behavioral |
| 7 | Investigate console 404 on page load (`/tools/emergency-fund:0`) — likely missing favicon | Low | QA |
| 8 | Decide: add quiet "this is a guide, not financial advice" line, or document intentional omission | Low | Brand/PM |
| 9 | Remove or replace "Based on the numbers you entered." — filler text that does no useful work | Low | UX |

---

### TIP-1 — Tip Calculator with Hidden History [P1]

**What it is:**
A functional tip calculator that surfaces the hidden labor-economics context at the point of decision. The arithmetic (tip, total, per-person split) is the front door. The clarity engine is a state-aware contextual note that tells the user whether the server they are tipping works under a subminimum federal tipped wage or under a One Fair Wage standard. Calculator first, context second — the math is never blocked or gated by the note.

**Target user:**
Anyone splitting a restaurant check on their phone at the table. Specifically, the diner who reaches for a tip percentage on autopilot and has never been told that in most states the tip is not a bonus on top of a real wage, it largely is the wage. Also the person who notices their POS screen now suggests 25% and wants to understand what they are actually paying for.

**Inputs:**
- **Bill amount** — number, required. Currency input, two decimals.
- **Tip percentage** — segmented button set (15% | 18% | 20% | 25%) plus an "Other" numeric input for custom values (0–100, two decimals). Default selection: 18%. All four preset buttons equal visual weight, no color-coding low-to-high. "Other" input must reach 0 without friction or stigma label. The button group is `role="radiogroup"`, arrow-key navigable, each target >=44px. (Design review confirmed buttons over a slider: better phone ergonomics, no directional fill that anchors high, and codebase precedent with EMG-1's `.btn-toggle` pattern.)
- **Party size for split** — integer, optional, defaults to 1. When 1, no per-person line renders.
- **State** — 2-letter selector, required for the wage-context note. Uses the shared input model `state` field (`finxiety/src/lib/input-model/types.ts`); do not redefine.
- **Pre-tax / post-tax toggle** — which base the tip percentage applies to. Default: pre-tax subtotal (etiquette-standard base; see note copy below). When post-tax is selected, the user supplies (or the tool reuses) the bill as the post-tax total.

Note on the pre-tax/post-tax base: v1 treats the entered "Bill amount" as the base the toggle labels. The toggle does not require a separate tax field in v1 — it changes the label and the explanatory note, and the percentage applies to the single entered bill amount. A future v2 may add a discrete tax field to compute the dollar delta precisely. See Open Questions.

**Outputs (render after calculation):**
- **Tip amount** in dollars.
- **Total bill** (base + tip).
- **Per-person amount** — only if party size > 1. Equals total / party size.
- **Contextual wage note**, varying by state (both variants below). Renders as informational context, not advice.
- **Pre-tax / post-tax note** — one line explaining the difference in dollar terms (copy below).
- All numeric outputs labeled as estimates where rounding applies; the contextual note carries the official source URL (DOL Fact Sheet 15).

**Contextual note copy (both variants, ready for the engineer — engineer fills [STATE] dynamically from the state selector):**

Tipped-wage state variant:
> "In [STATE], the law lets employers pay tipped workers as little as $2.13/hr, with tips expected to make up the rest. Here, a tip is part of the wage, not an extra on top of it."

One Fair Wage state variant:
> "In [STATE], servers receive the full state minimum wage regardless of tips. A tip here is additional income, not a wage substitute."

**Optional historical one-liner (renders below the contextual note, not inline):**
> "The $2.13 federal tipped wage has been unchanged since 1991."

**Pre-tax / post-tax note copy (one line, shown beside the toggle / in output):**
> "Etiquette tips on the pre-tax subtotal; most card screens default to the post-tax total. On a $50 bill in an 8% tax area, that's roughly a $0.80 difference at 20%."

**One Fair Wage state list (current as of 2026-06 research; MUST be re-verified at build time — state tipped-wage laws change):**
Alaska (AK), California (CA), Minnesota (MN), Montana (MT), Nevada (NV), Oregon (OR), Washington (WA), plus District of Columbia (DC). All other states fall to the tipped-wage variant for v1.

Note: the federal $2.13 tipped minimum applies in all other states, though many states set a higher state-level tipped minimum above $2.13. The v1 data layer only needs the One Fair Wage **binary** (full minimum wage vs. subminimum tipped wage). Exact per-state tipped minimums are v2 scope.

Michigan (MI), Chicago (IL), and Flagstaff (AZ) are additional One Fair Wage jurisdictions per research. MI is a full-state override and may be added to the v1 binary list if trivial. **Chicago and Flagstaff require city-level lookup and are out of scope for v1** unless the data layer cheaply supports a city override (it does not today). See V1 scope boundary.

**Data sources:**
- DOL Wage and Hour Division, Fact Sheet 15 (tipped employees / FLSA): https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa
- One Fair Wage (state list — verify at build time): https://onefairwage.site/
- EPI, "Rooted in Racism and Economic Exploitation" (history; backs the 1991 one-liner): https://www.epi.org/publication/rooted-racism-tipping/
- Full research backing this ticket: `finxiety/research-findings/tip-1-tipping-research.md`

Data layer: the One Fair Wage binary is a tiny static map (8 entries + default). Per `finxiety/CLAUDE.md`, thresholds and reference tables live in `finxiety/data/*.json` with a `last_updated` field, not hardcoded in logic. Create `finxiety/data/tip-one-fair-wage-2026.json` keyed by 2-letter state with a `last_updated` of the build date and a comment pointing to onefairwage.site for re-verification. Research effort: minimal (list already compiled above); build-time task is verification, ~30 minutes.

**Technical approach:**
New route `finxiety/src/routes/tools/tip-calculator/+page.svelte`. Pure calculation function in `finxiety/src/lib/calculators/tip.ts` (bill, percentage, party size, base → tip / total / per-person). The One Fair Wage lookup reads `finxiety/data/tip-one-fair-wage-2026.json` and returns the binary plus the resolved state name for interpolation into the note copy. Uses the shared `state` input field. No server, no storage — prerendered like every other route. Add a homepage card per the standard new-tool steps.

**Dependencies:**
- Shared input model `state` field (`finxiety/src/lib/input-model/types.ts`) — already exists.
- ARCH-1 shared UI components (slider, number input, result card) if landed by build time; otherwise build local and flag for later extraction. Not a hard blocker.

**Acceptance criteria:**
- [ ] Bill amount + tip percentage produces correct tip amount, total, and per-person split. Example: bill=$50.00, tip=20%, party_size=4, base=pre-tax → tip $10.00, total $60.00, per-person $15.00.
- [ ] Per-person line does not render when party_size = 1 (the default).
- [ ] Pre-tax/post-tax toggle changes the calculation base label and shows the one-line note explaining the dollar difference; switching the toggle updates the note copy.
- [ ] State selector drives the correct note variant. Example: state=CA → One Fair Wage variant ("In California, servers receive the full state minimum wage…"); state=TX → tipped-wage variant ("In Texas, servers may be paid as little as $2.13/hr…").
- [ ] Optional historical one-liner ("The $2.13 federal tipped wage has been unchanged since 1991.") renders below the contextual note, visually distinct, not inline with it.
- [ ] Contextual note carries the DOL Fact Sheet 15 source URL.
- [ ] WCAG 2.1 AA: all controls labeled, color contrast ≥ 4.5:1, fully keyboard-navigable (slider operable by arrow keys; presets reachable as buttons), touch targets ≥ 44px.
- [ ] Mobile-first: all controls and output usable at 375px with no horizontal scroll; verified at 375px before 1440px.
- [ ] All outputs framed appropriately; no recommendation or urgency language (Do No Harm checklist passed — see `finxiety/CLAUDE.md`). The note informs; it never tells the user what to tip.
- [ ] Homepage card added to `finxiety/src/routes/+page.svelte`.
- [ ] `npm run build` from `finxiety/` exits 0.

**V1 scope boundary:**
- **State tipped minimums above $2.13** (e.g., Michigan's higher tipped floor): OUT. Only the One Fair Wage binary matters for v1. Exact per-state tipped minimums are v2.
- **City-level overrides (Chicago, Flagstaff):** OUT for v1 unless the data layer supports a trivial city lookup (it does not today). Michigan as a full-state One Fair Wage entry MAY be included if trivial.
- **Tip pooling, back-of-house wage gap, platform/delivery tip context, racial-bias research:** OUT for v1. Captured in the research doc for future myth-quiz questions and articles.
- **Precise tax-delta computation** (separate tax field): OUT for v1; the post-tax note uses an illustrative example. v2 may add a tax field.

**No storage required.** Pure arithmetic plus a static binary lookup, all client-side. Lightweight and shareable — good content-marketing companion.

**Open questions:**
- Default tip preset: ticket sets 18%. Confirm 18% (not 20%) is the right anchor given the research note that suggested-amount anchoring inflates tips — a lower default is the Do-No-Harm-aligned choice but worth a brand call. → Brand agent.
- Include Michigan as a v1 full-state One Fair Wage entry, or hold all post-stub jurisdictions for v2 for consistency? → Engineer's call at build time based on data-layer effort; default to including MI if it's a one-line addition.

⟦PM-GROOMED⟧ ticket="TIP-1" date="2026-06-17"

**Status: LIVE** — https://finxiety.vercel.app/tools/tip-calculator
**Validated:** 2026-06-17 — see `status-updates/tip-1-validation-2026-06-17.md`

---

### COMPOUND-1 — The Compounding Effect Calculator [P2]

**Status: LIVE** — https://finxiety.vercel.app/tools/compound-interest

**What it is:** A clean compound interest calculator showing how a starting amount plus monthly contributions grow over time — split into what you put in versus what interest added. Educational framing only. No investment recommendations. Rule-of-72 callout. Stacked-area SVG chart.

**Inputs:** Starting amount, monthly contribution, annual rate (default 7%, labeled as historical S&P 500 average), time horizon (5/10/20/30 yr).

**Route:** `finxiety/src/routes/tools/compound-interest/+page.svelte`
**Calculator:** `finxiety/src/lib/calculators/compound.ts`

---

### DEBT-VIZ-1 — Debt vs. Growth Compound Visualizer [P2]

**Status: LIVE** — https://finxiety.vercel.app/tools/debt-growth

**What it is:**
People are taught compound interest as a savings superpower but don't apply the same mental model to debt — credit card APR compounds against them on the same exponential curve. This tool puts both curves on the same chart.

**Inputs:**
- A debt balance + APR (e.g., credit card)
- A hypothetical investment amount + expected annual return (e.g., 7%)
- Time horizon (years)

**Outputs:**
- Two compound growth curves on the same chart, same time horizon: one showing the debt balance growing (if unpaid/minimum-payments-only), one showing the investment growing
- Callout: "In [N] years, this debt could grow to $[X] — more than your hypothetical investment would earn at [Y]% — same math, opposite direction"
- Optional: debt curve with a fixed monthly payment overlay showing "shrinking if paid down" vs. "growing if untouched"

**V1 scope:**
Single debt + single investment scenario. No multi-debt prioritization logic (future tool).

**Data sources:** None beyond standard compound interest formulas — user-supplied APR/return assumptions.

**No storage required.** Requires a charting component (lightweight in-browser library).

---

### DEDUCT-1 — Deduction vs. Credit vs. Refund Clarifier [P2]

**Status: LIVE** — https://finxiety.vercel.app/tools/tax-clarity

**What it is:**
Deductions (reduce taxable income), credits (reduce tax owed dollar-for-dollar), and refunds (return of overwithheld money, no interest) are routinely confused, causing people to over- or under-value tax decisions and treat refunds as "found money."

**Inputs:**
- Federal filing status + estimated taxable income (for bracket lookup)
- A deduction amount OR a credit amount to evaluate (user picks which)
- Optional: most recent refund amount for the refund reframe

**Outputs:**
- For a deduction: "$[X] deduction at your [Y]% bracket actually saves you $[Z] — not $[X]." Side-by-side: "if this were a credit instead, it would be worth $[X]."
- For a credit: "$[X] credit reduces what you owe by $[X], dollar-for-dollar — worth more than a deduction of the same size unless your bracket is 100%."
- For a refund: "$[X] ÷ 12 = $[Y]/month you gave the government interest-free" plus what that monthly amount would earn in a high-yield savings account (simple interest, labeled as illustrative)

**V1 scope:**
Federal brackets only for v1. State tax treatment of deductions/credits varies too much to include initially (v2 scope).

**Data sources:** IRS 2026 federal tax brackets and standard deduction amounts.

**No storage required.** Single-session calculation, all client-side.

---

### HOURS-1 — "Where Do Your Work Hours Actually Go?" Calculator [P2]

**Status: LIVE** — https://finxiety.vercel.app/tools/work-hours

**What it is:**
Tax withholding is an abstract dollar line on a pay stub. This tool converts it to working time — how many minutes/hours of each workday fund each deduction vs. take-home pay. Includes the hidden employer-side FICA match.

**Inputs:**
- Track 2 shared input model: pay frequency, gross pay per period, pre-tax deductions, federal filing status, state, hours worked per period
- Itemized pay stub deductions if available (federal withholding, state withholding, Social Security, Medicare, other pre-tax)

**Outputs:**
- A visual "workday bar" (e.g., 8-hour day) divided into segments: how much time is "worked for" each deduction vs. take-home pay
- Plain-language callout: "You work until [time] before any of today's pay is yours"
- Toggle: "Show the hidden employer-side FICA match" — reveals that total FICA contributions are double what appears on the employee stub (employer pays a matching 7.65%), reframed as additional invisible compensation
- Annual rollup: total full days per year worked entirely for taxes before any income is "kept" (a personalized Tax Freedom Day)

**V1 scope:**
Federal income tax brackets, FICA (6.2%) and Medicare (1.45%) rates. State income tax for CA, TX, FL, NY, AZ.

**Data sources:** IRS 2026 federal tax brackets, SSA FICA/Medicare rates, state department of revenue withholding tables.

**No storage required.** Single pay-stub snapshot, all client-side.

---

### MYTH-2 — Extended Myth Quiz (Personal Finance Track) [P2]

**Status: LIVE** — https://finxiety.vercel.app/tools/myth-quiz-2

**What it is:**
Same shareable/content-marketing function as MYTH-1, but covering the personal finance myths from Track 2. Could be merged into MYTH-1 as additional question categories or kept separate — decide at build time based on how MYTH-1 performs and whether the audiences feel distinct.

**Sample question topics (from Appendix A):**
- "A bigger tax refund means you did your taxes right" → reframe via DEDUCT-1
- "If I have money in checking, I have an emergency fund" → reframe via EMG-1
- "Credit card debt and investments grow at different speeds of math" → reframe via DEBT-VIZ-1 (same compound formula)
- "Tipping rewards good service" → reframe via TIP-1
- "A tax deduction and a tax credit are basically the same thing" → reframe via DEDUCT-1
- "Renting is throwing money away" → flag as a future tool; no calculator yet

**Output:** Same format as MYTH-1 — score + explanations, each linking to the relevant calculator.

**V1 scope:** National-level facts only. Build after at least 2-3 Track 2 calculators are live.

**No storage required.** Static quiz content, client-side scoring.

---

### SAVE-1 — Savings Commitment Maker [P2 — Track 2]

**Problem statement:** People who want to save more leave every financial tool the same way they arrived — knowing they should save more, with no changed structure in their life that makes saving more likely.

**Target user:** Dani, 34, single parent, $31,200/year, $0 designated savings. She has tried to save before — she moved $100 into a savings account and moved it back three weeks later when the car battery died. She is not failing to save because she lacks knowledge or willpower. She is failing to save because nothing in her financial structure makes saving the default, automatic, or low-friction action. She is not the EMG-1 user discovering she has no runway; she already knows. She is the person who wants to change one thing and needs that one thing to actually be different tomorrow.

This tool is also for Track 2 users with more financial slack — a gig worker, a tipped-wage employee with irregular income, anyone for whom "save more" is abstract motivation they want to convert into a specific, concrete, self-made commitment.

**What it is:**
A behavioral savings commitment tool. It does not calculate how much the user "should" save. It asks two questions, surfaces one insight about the user's own stated savings goal versus their stated obstacles, and produces a concrete artifact: a personalized commitment statement the user writes in their own words, plus an optional calendar reminder generated client-side.

The mechanism is not information delivery. It is structured commitment-making using implementation intentions (Gollwitzer 1999): "I will [action] at [time] in [place]." Implementation intentions are the single strongest behavioral intervention for savings behavior in low-income populations (Milkman et al., 2011; Soman & Cheema, 2011). The tool's job is to walk the user through forming one.

The "thing that is different after you close this tab" is: a specific self-authored action statement ("On the last Friday of the month, I will transfer $20 from my checking to my savings account before I open any other bill"), and, if they choose it, a calendar event set in their own phone for the date they named. That calendar event is the enabling environment — the same mechanism as RECERT-1's .ics file — except here it is not a deadline, it is a personal savings appointment the user made with themselves.

**Inputs:**
- **Savings goal** — plain-language free-text field, max 120 characters. "What are you trying to save for?" No examples listed that imply a scale (not "vacation, retirement, down payment") — the user names their own goal. Required before any output renders.
- **Target amount** — optional number. "How much would you need?" If left blank, the tool works without it. If entered, it is used to calculate one number the user may not have done: how many weeks/months at a user-named transfer amount it would take.
- **Transfer amount** — number, required for the commitment builder. "What's the smallest amount that would feel like progress?" Framing is critical: not "how much should you save" but "what amount would feel like forward motion even on a hard month." $5 is a valid answer; the tool must not suggest a floor.
- **When** — a specific time prompt, required. "When will you do it — what day, and what triggers it?" This is the implementation-intention "when" component. Free-text or guided selector (day of week, bi-weekly, monthly). Required because an implementation intention without a when has substantially weaker effect.
- **Where / linked to what** — optional but prompted. "Is there something you already do that you could link it to?" (Examples: "after I get paid," "when I pay rent," "when I drop the kids at school.") Habit-stacking anchor. Free-text, optional.

No shared input model fields are required. SAVE-1 does not use household_size, state, income, or current_benefits. It operates entirely on user-stated values. No field should be labeled "income" or ask for income — this is not an eligibility screener. Do not import shared input model fields into this tool.

**Outputs:**
After the user fills in their goal, transfer amount, and when:

1. **Commitment statement** — a full sentence generated from the user's inputs, displayed in a styled block they can read back to themselves: "I will transfer [amount] to savings [when] so that I can [goal]." The sentence must use the user's own words verbatim — no paraphrasing, no financial-advice glossing. The user has one edit pass directly in the rendered statement before they accept it.

2. **One optional calculation, clearly labeled as an estimate:** "At [amount] [frequency], reaching [target] would take approximately [N] months." Only renders if both target_amount and transfer_amount are provided. Labeled: "This is a rough estimate. Your actual timeline will vary." No chart, no compound interest, no projection — a single sentence. The tool does not celebrate or motivate based on this number.

3. **Calendar download (.ics)** — generated client-side using the same .ics generator as RECERT-1 (`finxiety/src/lib/ics-generator/`). Event title: "My savings appointment" (not named after any program or platform; no branding in the calendar event). Event body: the user's commitment statement verbatim. The first event date is set to the next occurrence of the day/trigger the user named. One repeat event is included (same recurrence if weekly/monthly); subsequent events are the user's to set. The .ics is generated locally — no server, no email, no account.

4. **One plain-text "take it with you" option:** "Copy your commitment" — clipboard only, the statement text. For users who do not want to add a calendar event, this is the minimum artifact.

5. **Related-tools footer:** Link to EMG-1 ("See how much runway you have") and to BEN-1 ("Find programs that might create more breathing room"). The bridge to BEN-1 is framed as expanding supply, not as a judgment that the user's transfer amount is too small.

**What is not in any output:**
- No recommended savings amount. No "financial advisors suggest," no "most people," no benchmark.
- No projected compound growth. That is DEBT-VIZ-1's job. SAVE-1 is about starting the behavior, not optimizing it.
- No urgency, no countdown, no "you're behind."
- No reference to the user's income. The tool never calculates what percentage of income the transfer amount represents. That framing creates shame when the percentage is small.

**V1 scope:**
- National scope. No state-specific logic. Implementation intentions and commitment statements are universal; no data files required.
- Free-text goal field, number inputs, and a day/frequency selector are the full input set.
- .ics generation is in scope (reuses RECERT-1's generator).
- Clipboard copy is in scope.
- The optional rough-timeline calculation is in scope but renders only when both target_amount and transfer_amount are provided.
- No savings account integration, no bank linking, no balance checking.
- No email capture, no reminder via SMS or email — the calendar event is the only external artifact.
- No compound interest projection (v2 scope if behavioral research supports it; strong risk of making small amounts feel futile).
- No social sharing ("tell a friend"). The commitment is personal; public commitment research in low-income populations is mixed and outside scope for v1.
- No spaced repetition / return mechanism. See ARCH-RETURN note in BACKLOG_INTAKE.md for the architectural constraint.

**Data sources:**
No external data required. All calculation uses user-supplied inputs. No eligibility tables, no threshold files, no annually-updated JSON.

Behavioral science sources that must be reviewed before copy is finalized (not data files — background for copy decisions):
- Gollwitzer (1999): implementation intentions. The core mechanism. PM and behavioral-science agent must confirm commitment-statement format is consistent with the Gollwitzer "I will [action] at [time] in [place]" structure.
- Milkman, Beshears, Choi, Laibson & Madrian (2011): "Using implementation intentions prompts to enhance influenza vaccination rates" — most-cited behavioral nudge paper; the mechanism transfers to savings with strong evidence.
- Soman & Cheema (2011): mental accounting and savings in low-income households. Directly relevant to the ALICE user's relationship with earmarking.
- Thaler & Benartzi (2004): Save More Tomorrow (SMarT). The "smallest amount that feels like progress" framing is consistent with their finding that small commitments to save future income increments have higher uptake than large commitments now.

Research gap: no dedicated SAVE-1 research file exists in `finxiety/research-findings/`. See Open Questions.

**Technical approach:**
New route `finxiety/src/routes/tools/savings-commitment/+page.svelte`, prerendered like all other routes. No calculation library required — the only math is division (target / transfer). Commitment statement assembly in `finxiety/src/lib/calculators/savings-commitment.ts` — a pure function that takes {goal, amount, frequency, when_anchor, habit_anchor} and returns the formatted commitment string. The .ics generator is imported from `finxiety/src/lib/ics-generator/` (built for RECERT-1); the only new parameters are the event title, body (the commitment statement), and start date (next occurrence of the user-named day). Clipboard copy uses the browser Clipboard API with textarea fallback, matching DOC-1's implementation. No external data files. Add a homepage card per the standard new-tool steps. Reuse ARCH-1 shared UI components (Button, InputField, ResultBox) if landed by build time; otherwise build local and flag for later extraction.

**Tool flow:**
Step 1: Goal entry. "What are you trying to save for?" Free-text. "Next" disabled until filled.
Step 2: Amount + frequency. "What's the smallest amount that would feel like progress?" + optional target amount + when/frequency. "Build my commitment" action.
Step 3: Commitment display. The assembled statement in a styled block. One edit pass. Then two actions: "Add to my calendar" (.ics download) and "Copy this" (clipboard). Optional: the rough timeline estimate, if both amounts were provided, in a clearly labeled supplementary line below the statement.
Step 4: Related-tools footer.

**Dependencies:**
- `finxiety/src/lib/ics-generator/` — built for RECERT-1. SAVE-1 must not duplicate this; it imports and reuses it. If RECERT-1 has not shipped, the engineer builds the .ics generator once and makes it shared before completing SAVE-1. The generator is the shared dependency; do not inline it in the SAVE-1 component.
- ARCH-1 shared UI components if landed by build time. Not a hard blocker.

**Acceptance criteria:**
- [ ] A user who enters goal="new tires," transfer_amount=20, frequency=biweekly, when="every other Friday after I get paid" sees the commitment statement: "I will transfer $20 to savings every other Friday after I get paid so that I can save for new tires." The user's exact words appear verbatim; no paraphrasing.
- [ ] The same user can edit the commitment statement inline before downloading or copying it.
- [ ] A user who also enters target_amount=240 sees the rough timeline estimate: "At $20 every two weeks, reaching $240 would take approximately 24 weeks." The estimate is labeled "rough estimate — your actual timeline will vary."
- [ ] A user who provides no target_amount sees no timeline estimate. The commitment statement and .ics download render regardless.
- [ ] "Add to my calendar" downloads a valid .ics file. The event title is "My savings appointment." The event body contains the user's verbatim commitment statement. The start date is the next occurrence of the user-named day/frequency from today's date.
- [ ] "Copy this" places the commitment statement as plain text on the clipboard with no network request.
- [ ] No output ever includes a recommended savings amount, a percentage of income, a benchmark, or a comparative reference to what other people save.
- [ ] The transfer amount field accepts $5 as a valid entry with no warning, no error, no prompt to reconsider. The tool must not set a floor or suggest one exists.
- [ ] The "When" field is required; submitting without it keeps the "Build my commitment" action disabled and shows a plain-language inline prompt ("Add a when — a specific day or trigger makes commitments more likely to stick"), not an error.
- [ ] WCAG 2.1 AA: all inputs labeled, color contrast ≥ 4.5:1, fully keyboard-navigable, touch targets ≥ 44px, free-text fields accessible to screen readers with appropriate aria-label.
- [ ] Mobile-first: full flow usable at 375px with no horizontal scroll; commitment statement readable and actions reachable at 375px. Verified at 375px before 1440px.
- [ ] No output uses urgency, fear, scarcity, or prescriptive framing ("you should," "you need to," "it's important to"). Do No Harm checklist passed (see `finxiety/CLAUDE.md`).
- [ ] The related-tools footer links to EMG-1 and BEN-1 with framing that expands supply ("find programs that might create more breathing room") — not framing that implies the user's commitment amount is inadequate.
- [ ] Homepage card added to `finxiety/src/routes/+page.svelte`.
- [ ] `npm run build` from `finxiety/` exits 0.

**Out of scope for v1 (explicit):**
- Bank account linking or balance verification of any kind.
- Email or SMS reminders. The .ics calendar event is the only external artifact; its delivery is the user's own calendar app.
- Social commitment ("share your goal") or accountability partner features.
- Compound interest projection or growth visualization. That is DEBT-VIZ-1.
- Savings account recommendations or referrals to financial products.
- Spaced-repetition return mechanism. See ARCH-RETURN in BACKLOG_INTAKE.md.
- Pre-set transfer amount suggestions (e.g., "try $25/week"). The user names their own amount. Pre-sets anchor upward and create implicit shame when the user's real number is lower.

**Open questions:**
- **Research gap — BLOCKING.** No dedicated savings-behavior research file exists in `finxiety/research-findings/`. Before the engineer starts, a research session must confirm: (a) the Gollwitzer implementation-intention format is the right framing for the ALICE user at the income and cognitive-bandwidth level Dani represents; (b) the "smallest amount that feels like progress" framing (Thaler/Benartzi) does not inadvertently trigger shame for users whose answer is very small; (c) there is no evidence that commitment devices cause harm in low-income populations (some research suggests social commitment creates pressure that backfires — confirm private commitment is the right form for v1). Run the policy-research prompt from `finxiety/docs/research-prompts.md` on savings behavioral interventions in low-income populations and save output to `finxiety/research-findings/save-1-savings-behavioral-research.md`. Owner: Naomi to schedule research session before SAVE-1 enters the active build queue.
- **Commitment statement edit pass:** Should the inline edit be a contenteditable span or a re-populated input field? The contenteditable approach is more visually integrated but requires careful ARIA handling for screen readers. The input approach is simpler and more accessible. Recommendation: input field pre-populated with the assembled string, allowing the user to edit freely. → Engineer to decide based on WCAG compliance ease; default to input field.
- **RECERT-1 .ics generator interface:** Does the current RECERT-1 .ics generator accept a free-text event body, or is it hardcoded to recertification-date content? If hardcoded, the engineer must refactor it into a general-purpose generator before SAVE-1 can import it. → System-analyst agent to trace `finxiety/src/lib/ics-generator/` before build starts and confirm the interface. Escalate to engineer if refactor is needed.
- **Priority slot:** SAVE-1 is behavioral-design-first and data-light — closer to EMG-1 in build cost than to HOURS-1. Possible insertion between MYTH-2 and HOURS-1 in the ship order, or after MYTH-2 as SHIP T2-7. PM to confirm placement after research gap is resolved. → Naomi.

⟦PM-GROOMED⟧ ticket="SAVE-1" date="2026-06-19"

---

## APPENDIX A — Personal Finance Myths: Research Reference

From research session 2026-06-14. Full list of 12 myths. Tools 6-10 above cover myths 1, 5, 8, 9, 12. Myths 2, 3, 4, 6, 7, 10, 11 are not yet mapped to a specific tool — flagged for future backlog items.

| # | Myth | Status |
|---|------|--------|
| 1 | Tipping as a fair-wage substitute | → TIP-1 |
| 2 | "Diversification" as a complete safety net — people diversify across asset names but remain concentrated in correlated risk factors | No tool yet — possible future "concentration checker" |
| 3 | House value as a liquid emergency fund — equity isn't cash flow; accessing it requires selling, refinancing, or HELOC debt | No tool yet |
| 4 | "If I make a financial mistake, it's permanent" — most processes allow correction; ~40% of adults have an unexpected setback yearly | No tool yet — likely educational/quiz content only, not calculator-shaped |
| 5 | Leftover checking cash = emergency fund | → EMG-1 |
| 6 | Credit card rewards as "free money" — rewards are subsidized by interchange fees passed to all consumers, including non-card-users | No tool yet |
| 7 | "Good credit = financially healthy" — credit scores measure debt-repayment behavior, not savings or net worth | No tool yet — possible "what your credit score doesn't tell you" explainer |
| 8 | Compound interest only "works for you" when investing | → DEBT-VIZ-1 |
| 9 | "Renting is throwing money away" — ignores opportunity cost of the down payment | No tool yet — flagged in MYTH-2; rent-vs-buy space is crowded; differentiation via opportunity-cost framing needed |
| 10 | Buy-now-pay-later as "safer than credit" — restructures debt to feel less like debt, but carries its own fee/default structure | No tool yet |
| 11 | "Financial progress requires big changes" — small, automatable actions often have outsized compounding effects | No tool yet — likely educational content rather than a calculator |
| 12 | Tax refund as a windfall/bonus | → DEDUCT-1 (also touches deduction vs. credit confusion) |

---

## OPEN QUESTIONS

1. ~~**Stack decision for web-native tools:**~~ **Resolved — see ADR-001.** SvelteKit + adapter-static + Vercel. Decision was made inline in Week 1 and is now documented.

2. **California-only vs. national from day one:** CA-first is the right call — state programs (CalFresh, Medi-Cal) are where the complexity lives. Federal programs (SNAP federal rules, Lifeline) are the same everywhere. CA-first with federal programs baked in gives ~12% of US population and a natural expansion template.

3. **Data freshness strategy:** Annual thresholds are the core risk. All data files include `last_updated` field. Release agent runs freshness audit before every deploy. Flag files within 60 days of next scheduled update.

4. **Domain:** finxiety.org vs. finxiety.com — `.org` reads as the civic thing it is.

5. **Legal structure:** 501(c)(3) from scratch vs. fiscal sponsorship (Tides, Open Collective) — fiscal sponsorship is faster and lower-admin. Research before launch.

6. **Distribution:** Direct (SEO, social), via nonprofits (B2B — BEN-4 path), or embedded/white-label. **Embeddability architecture decided — see ADR-002.** iFrame + URL-param theming enables institutional embedding (credit unions, CDFIs, municipalities) without server infrastructure. Nonprofit/direct paths remain open in parallel.

7. **Revenue model:** Institutional licensing (credit unions, CDFIs, banks under CRA pressure, municipal benefits portals pay to embed; end users stay free always). Mortalia cross-subsidizes during early growth. Grant funding viable for Track 1 civic tools. Formal pricing model deferred to pre-launch.

8. **Relationship visibility:** Does Finxiety publicly credit Tsunam.ai/Naomi? Depends on BlackRock departure timeline.

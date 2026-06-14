# Finxiety — Product Backlog
Last updated: Jun 2026

Finxiety is the civic arm of Tsunam.ai: free financial clarity tools for communities the market doesn't build for. Mission: help people make better decisions when the systems are too complicated and the guides cost money.

Full idea portfolio lives in `IDEAS.md`. This backlog covers defined, scoped items ready for prioritization and build. Mortalia (high-net-worth decumulation) is a separate product and separate repo.

---

## TWO TRACKS

**Track 1 — Financial Inclusion:** Tools for people navigating poverty, benefits, and government systems. MYTH-1 through CLIFF-1.

**Track 2 — Personal Finance Myth-Busting:** Tools targeting widely-believed financial myths that distort everyday decisions — sourced from behavioral economics research. EMG-1 through MYTH-2.

Both tracks: stateless, no accounts, no PII, shared input model where applicable, related-tools footer linking across both tracks.

**Interleaving option:** Rather than completing Track 1 before starting Track 2, consider alternating tracks release-to-release (e.g., MYTH-1 → EMG-1 → BEN-1 → TIP-1 → DOC-1...) to build both audiences in parallel and give Track 2 tools (pure calculation, zero state data) fast early wins. PM agent owns sequencing decisions.

---

## SHIP ORDER — Active Build Sequence

Eleven tools across two tracks. Each independently deployable. Track 1 sequence is fixed by dependencies (CLIFF-1 depends on BEN-1). Track 2 sequence is by complexity (EMG-1 is zero-data; HOURS-1 is most complex). Interleaving between tracks is a scheduling option, not an architectural constraint.

```
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
    ALICE-1: "Are You ALICE?" Self-Assessment

  SHIP T1-4 — Administrative Burden
    RECERT-1: Recertification Deadline Tracker

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

- **P0 — First ship (Track 1)**: MYTH-1 — establishes brand voice
- **P0-B — Core utility**: BEN-1 — foundational screener
- **P0-T2 — First ship (Track 2)**: EMG-1 — fastest calculator across both tracks
- **P1 — Framing suite**: DOC-1, ALICE-1, TIP-1
- **P2 — State research / visualization**: RECERT-1, DEBT-VIZ-1, DEDUCT-1
- **P2 — Economic complexity**: CLIFF-1, HOURS-1 (most complex in each track)
- **P2 — Suite completions**: MYTH-2
- **P3 — Wave 2 expansion**: FOOD-1, FOOD-2, WORK-1, WORK-2, HOUSE-1, HOUSE-2, BEN-3, BEN-4

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

## SECTION A — FINANCIAL INCLUSION CORE

### MYTH-1 — Benefits Myth-Check Quiz [P0 — First Ship]

**What it is:**
A short interactive quiz (8-12 questions) that surfaces and corrects widespread false beliefs about public benefits programs. True/false or multiple-choice format; each question followed by an immediate explanation and citation. Doubles as content marketing — high shareability, no state-specific complexity.

**The user experience:**
> "True or false: most SNAP recipients don't work."
> → False. [Explanation with data.] [Link to Benefits Cliff Calculator for the real story →]

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

---

### DOC-1 — Document Checklist Generator [P1]

**What it is:**
Programs (SNAP, Medicaid, LIHEAP, EITC, WIC) require overlapping but non-identical documentation. Applying to multiple programs means redundant, confusing paperwork hunts. A single de-duplicated checklist reduces friction.

**Inputs:**
- Multi-select: which programs the user is applying for
- State (document requirements vary by state administration)

**Outputs:**
- Single de-duplicated checklist covering all selected programs, grouped by document type (identity, income, residency, household composition, expenses)
- Notes where requirements diverge (e.g., "LIHEAP requires a copy of your most recent energy bill — not needed for SNAP")
- Printable/downloadable format (PDF or plain text — client-side generation)

**V1 scope:**
- SNAP, Medicaid, LIHEAP, EITC — 4 programs
- National baseline requirements with state-specific notes only where they significantly diverge
- CA + 4 additional states (TX, FL, NY, AZ) for state-specific notes

**Data sources:**
- USDA SNAP application guides
- Medicaid.gov application requirements
- LIHEAP state agency guides
- IRS EITC requirements

**Technical approach:**
- Static rules-based logic: `finxiety/data/document-requirements.json`
- De-duplication algorithm: merge requirements across selected programs, group by type, surface divergences
- Client-side PDF/text generation (no server needed)
- Uses `state` from shared input model

**No storage required.** Static logic; output downloaded client-side.

---

### ALICE-1 — "Are You ALICE?" Self-Assessment [P1]

**What it is:**
ALICE (Asset Limited, Income Constrained, Employed) households are above the federal poverty line but below a realistic cost-of-living threshold. Many don't realize their financial strain is structural and widespread — not personal failure. This tool makes an abstract statistic personally legible.

**Inputs:**
- `household_size`, `zip_code`, `gross_monthly_income` (from shared input model)

**Outputs:**
- Comparison of household income vs. local ALICE Household Survival Budget (county-level if zip provided; state average as fallback)
- Dollar gap (or surplus) between income and survival budget
- Breakdown of survival budget by category (housing, childcare, food, transportation, healthcare, technology)
- Framing copy emphasizing systemic pattern: "X% of households in [county] are below this threshold" — from published United for ALICE data

**V1 scope:**
- United for ALICE published county-level Household Survival Budget data (available all states; most recent: 2025 reports covering 2023 data)
- Start with states where data is cleanly available; expand as time allows

**Data sources:**
- unitedforalice.org county-level dashboards (public data — may require manual extraction into static lookup JSON)
- Lookup table: `finxiety/data/alice-budgets-{year}.json` keyed by county FIPS or ZIP prefix

**Technical approach:**
- Static JSON lookup table bundled with the app
- ZIP → county resolution (use ZIP-to-county crosswalk file in `finxiety/data/`)
- All comparison done client-side
- No shared input model `current_benefits` needed for this tool

**No storage required.** Static JSON lookup, client-side comparison.

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

---

### TIP-1 — Tip Calculator with Hidden History [P1]

**What it is:**
A functional tip calculator that surfaces the hidden labor-economics context at the point of decision. State-aware: shows whether the server is working under a subminimum tipped wage or a "one fair wage" state standard.

**Inputs:**
- Bill amount
- Desired tip percentage (slider or presets)
- State (to determine tipped minimum wage vs. one-fair-wage states)

**Outputs:**
- Standard tip calculation (tip amount, total, per-person split if applicable)
- Contextual note varying by state: in subminimum-wage states, note that the server's base wage may be as low as $2.13/hr federally and the tip functions as their primary wage; in one-fair-wage states, note that servers receive full minimum wage regardless of tips
- Optional one-line historical note on tipping's origins (brief — this is a calculator first)

**V1 scope:**
- Federal tipped minimum wage ($2.13/hr) + one-fair-wage state list (CA, WA, NV, MN, OR, AK, MT — verify at build time; state laws change)

**Data sources:** DOL tipped minimum wage table, One Fair Wage state list.

**No storage required.** Lightweight and shareable — good content-marketing companion.

---

### DEBT-VIZ-1 — Debt vs. Growth Compound Visualizer [P2]

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

1. **Stack decision for web-native tools:** Streamlit is desktop-oriented; the target population is phone-first. Recommendation: web-native (SvelteKit or equivalent lightweight framework). Needs an ADR from architect agent before build of BEN-1 starts.

2. **California-only vs. national from day one:** CA-first is the right call — state programs (CalFresh, Medi-Cal) are where the complexity lives. Federal programs (SNAP federal rules, Lifeline) are the same everywhere. CA-first with federal programs baked in gives ~12% of US population and a natural expansion template.

3. **Data freshness strategy:** Annual thresholds are the core risk. All data files include `last_updated` field. Release agent runs freshness audit before every deploy. Flag files within 60 days of next scheduled update.

4. **Domain:** finxiety.org vs. finxiety.com — `.org` reads as the civic thing it is.

5. **Legal structure:** 501(c)(3) from scratch vs. fiscal sponsorship (Tides, Open Collective) — fiscal sponsorship is faster and lower-admin. Research before launch.

6. **Distribution:** Direct (SEO, social), via nonprofits (B2B — BEN-4 path), or embedded/white-label. Nonprofit path may be the most reliable channel for reaching the actual target population.

7. **Revenue model:** Grant-funded? Freemium (consumer free, nonprofit tier paid)? Sponsored by government agencies? Social impact product — different model from Mortalia. Decision deferred to post-launch.

8. **Relationship visibility:** Does Finxiety publicly credit Tsunam.ai/Naomi? Depends on BlackRock departure timeline.

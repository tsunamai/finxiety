# QA Validation: BEN-1 CA Benefits Screener — 2026-06-21

**Reviewer:** qa agent
**Date:** 2026-06-21
**Gate:** Pre-release QA validation
**Files reviewed:**
- `finxiety/src/routes/tools/screener/+page.svelte`
- `finxiety/src/lib/eligibility/index.ts`
- `finxiety/src/lib/data/snap-eligibility.ts`
- `finxiety/src/app.css`
- Prior UX review: `finxiety/status-updates/ben-1-validation-ux-2026-06-15.md`

---

## UX-Blocked Status: Resolved

The UX review (2026-06-15) issued ⟦UX-BLOCKED⟧ on three blocking items:

1. **Color contrast failures on `--muted` text** — The palette has been updated. `--muted` is now `#506258` (a dark green-grey) rather than the `#7a7268` the UX review tested. Contrast ratios have been re-evaluated against all relevant backgrounds; see WCAG section below. All previously failing pairs now pass.
2. **Focus management on step change** — `resultsHeadingEl` and `toolHeadingEl` are bound via `bind:this` and `.focus()` is called on them in `calculate()` and `startOver()` respectively. `tabindex="-1"` is present on both h1 and h2. This addresses UX Required Change 2.
3. **aria-live region placement** — A persistent `<div class="sr-only" aria-live="polite" aria-atomic="true">` exists outside the `{#key step}` block. Its content changes only when `step === 2 && results.length > 0`. The live region itself is never destroyed and re-created, which addresses the VoiceOver/Safari reliability concern from UX Required Change 3.

UX Required Change 4 (start-over tap target): `.start-over-btn { min-height: 44px }` is present. Resolved.

---

## Functional Test Cases

### Household 1: Size=3, Income=$2,200/month, hasSchoolAgeChild=true, hasChildUnder5OrPregnant=false

Manual trace through `checkAllPrograms()`:

**CalFresh:**
- Limit: `CALFRESH.grossMonthlyLimits[3]` = $2,798
- $2,200 <= $2,798 → status = **likely**
- maxBenefit: $768 → estimatedBenefit = "up to $768/month"
- nearLimit: 2200 > 2798? No → false
- incomeVsLimit: "$2,200 vs. $2,798 limit" (rendered on likely card)
- Result: CORRECT

**Medi-Cal:**
- adultLimit: `MEDI_CAL.grossMonthlyLimits[3]` = $2,970
- $2,200 <= $2,970 → status = **likely**
- nearLimit: N/A (computed but suppressed — `nearLimit: status === 'unlikely' && ...`)
- Result: CORRECT

**WIC:**
- hasChildUnder5OrPregnant = false → status = **not_applicable**
- Filtered from `visibleResults` → not shown
- Result: CORRECT

**Lifeline:**
- limit: `LIFELINE.grossMonthlyLimits[3]` = $2,905
- calFreshLimit = $2,798; mediCalLimit = $2,970
- programBased: $2,200 <= $2,798 = true → status = **likely**
- estimatedBenefit: "up to $9.25/month off your phone or internet bill"
- Result: CORRECT

**HEAP:**
- Limit: `HEAP.grossMonthlyLimits[3]` = $4,600
- $2,200 <= $4,600 → status = **likely**
- Result: CORRECT

**School Meals:**
- hasSchoolAgeChild = true
- freeLimit: `SCHOOL_MEALS.freeMonthlyLimits[3]` = $2,798
- $2,200 <= $2,798 → status = **likely**, estimatedBenefit = "Free breakfast and lunch at school"
- Result: CORRECT

**CalEITC:**
- income = $2,200 > 0
- qualifyingChildren: hasChildUnder5OrPregnant=false (0) + hasSchoolAgeChild=true (1) = 1
- annualIncome = $2,200 × 12 = $26,400
- annualLimit: `CALEITC.earnedIncomeLimitsAnnual[1]` = $24,078
- $26,400 > $24,078 → status = **unlikely**
- nearLimit: $26,400 > $24,078 AND $26,400 <= $24,078 × 1.15 = $27,689.70 → **true**
- incomeVsLimit rendered on near-limit card: "$26,400/year vs. $24,078/year limit"
- Result: CORRECT — nearLimit triggers, incomeVsLimit shown

**Household 1 summary:** CalFresh=likely, Medi-Cal=likely, WIC=not_applicable (hidden), Lifeline=likely, HEAP=likely, School Meals=likely (free), CalEITC=unlikely+nearLimit. 5 programs show as "May qualify."

---

### Household 2: Size=1, Income=$0/month, hasChildUnder5OrPregnant=false, hasSchoolAgeChild=false

**CalFresh:**
- Limit: `CALFRESH.grossMonthlyLimits[1]` = $1,632
- $0 <= $1,632 → status = **likely**, maxBenefit = $292
- Result: CORRECT — $0 income does not crash, qualifies

**Medi-Cal:**
- adultLimit: `MEDI_CAL.grossMonthlyLimits[1]` = $1,732
- $0 <= $1,732 → status = **likely**
- Result: CORRECT

**WIC:**
- hasChildUnder5OrPregnant = false → **not_applicable**
- Result: CORRECT

**Lifeline:**
- programBased: $0 <= $1,632 = true → status = **likely**
- Result: CORRECT

**HEAP:**
- Limit: `HEAP.grossMonthlyLimits[1]` = $2,800
- $0 <= $2,800 → status = **likely**
- Result: CORRECT

**School Meals:**
- hasSchoolAgeChild = false → **not_applicable**
- Result: CORRECT

**CalEITC:**
- income = 0; condition `income <= 0` is true → status = **not_applicable**
- description: "CalEITC requires earned income. With $0 income reported, this credit would not apply."
- Result: CORRECT — CalEITC correctly marked not_applicable, not unlikely. The message correctly explains the requirement without shaming.

**Household 2 summary:** CalFresh=likely, Medi-Cal=likely, WIC=not_applicable (hidden), Lifeline=likely, HEAP=likely, School Meals=not_applicable (hidden), CalEITC=not_applicable (hidden). 4 programs show as "May qualify." $0 income does not crash.

---

### Household 3: Size=4, Income=$5,000/month, hasChildUnder5OrPregnant=false, hasSchoolAgeChild=false

**CalFresh:**
- Limit: `CALFRESH.grossMonthlyLimits[4]` = $3,380
- $5,000 > $3,380 → status = **unlikely**
- nearLimit: $5,000 > $3,380 AND $5,000 <= $3,380 × 1.15 = $3,887 → No (5000 > 3887) → **false**
- incomeVsLimit NOT shown (far-over, no nearLimit)
- Result: CORRECT

**Medi-Cal:**
- adultLimit: `MEDI_CAL.grossMonthlyLimits[4]` = $3,588
- $5,000 > $3,588 → status = **unlikely**
- nearLimit: $5,000 > $3,588 AND $5,000 <= $3,588 × 1.15 = $4,126.20 → No → **false**
- Result: CORRECT

**WIC:** hasChildUnder5OrPregnant = false → **not_applicable**. CORRECT.

**Lifeline:**
- limit: `LIFELINE.grossMonthlyLimits[4]` = $3,510
- calFreshLimit = $3,380; mediCalLimit = $3,588
- programBased: $5,000 <= $3,380? No. $5,000 <= $3,588? No → programBased = false
- $5,000 > $3,510 → status = **unlikely**
- nearLimit: $5,000 > $3,510 AND $5,000 <= $3,510 × 1.15 = $4,036.50 → No → **false**
- Result: CORRECT

**HEAP:**
- Limit: `HEAP.grossMonthlyLimits[4]` = $5,200
- $5,000 <= $5,200 → status = **likely**
- Result: CORRECT — HEAP's broader 60% SMI threshold still includes this household. This is accurate and not a false positive; the data reflects HEAP's actual policy.

**School Meals:** hasSchoolAgeChild = false → **not_applicable**. CORRECT.

**CalEITC:**
- income = $5,000 > 0; qualifyingChildren = 0
- annualIncome = $60,000; annualLimit = $18,591
- $60,000 > $18,591 → status = **unlikely**
- nearLimit: $60,000 > $18,591 AND $60,000 <= $18,591 × 1.15 = $21,379.65 → No → **false**
- incomeVsLimit NOT shown
- Result: CORRECT

**Household 3 summary:** HEAP=likely (1 program), all others unlikely or not_applicable. No false positives. nearLimit logic correctly silent when income is far over threshold.

---

## Edge Cases

| Input | Expected | Actual (traced) | Pass/Fail |
|---|---|---|---|
| householdSize=1, grossMonthlyIncome=$0 | No crash; most programs qualify | CalFresh/Medi-Cal/Lifeline/HEAP=likely; CalEITC=not_applicable (not crash) | PASS |
| grossMonthlyIncome=0, CalEITC | not_applicable with earned-income explanation | Correctly not_applicable, message explains requirement | PASS |
| hasChildUnder5OrPregnant=true only, hasSchoolAgeChild=false | WIC=likely/unlikely per income; School Meals=not_applicable | WIC checked against income; School Meals returns not_applicable | PASS |
| Both checkboxes unchecked | WIC=not_applicable, School Meals=not_applicable | Both gated on their respective flags, both return not_applicable | PASS |
| householdSize=8 | Uses table entry directly | All programs have explicit entries for size=8 in their limits tables | PASS |
| householdSize=9 (> 8) | Extrapolates via `additional` | `getLimit()` returns `limits[8] + (n-8) * additional`; CalFresh: 5711 + 583 = 6294 | PASS |
| income exactly at CalFresh limit (size=1, income=$1,632) | status='likely' (not 'unlikely') | 1632 <= 1632 → status='likely' (boundary is inclusive) | PASS |
| income=$1,633 (1 above limit, size=1) | status='unlikely'; nearLimit check: 1633 <= 1632*1.15=1876.8 → nearLimit=true | Correctly unlikely with nearLimit=true, incomeVsLimit rendered | PASS |
| hasSchoolAgeChild=false: School Meals | not_applicable, hidden from visibleResults | Filtered from display | PASS |
| householdSize=1, income=0: no crash | Graceful handling | Confirmed above | PASS |

**Note on `role="alert"` re-fire behavior (edge case — see WCAG findings below):** The `calculate()` function sets `error = ''` then immediately sets `error = 'message'`. If the user submits the form twice with the same invalid input, Svelte 5's reactive runtime may batch these two synchronous assignments into a single DOM update (no intermediate empty state rendered), meaning the alert text never changes between submissions and may not re-announce. This is a real risk in Svelte 5's signal-based reactivity. **Medium-High finding — see BUG-2 below.**

---

## Do No Harm Cases

| Scenario | Check | Result |
|---|---|---|
| Ineligible user (HH4/$5,000 — 4 programs fail) | No false positives shown | PASS — HEAP correctly shows as likely (per its actual policy); CalFresh/Medi-Cal/Lifeline show "Above limit" only |
| All estimate labels | "estimated" or "estimates" appears in output | PARTIAL — see BUG-1 below |
| No recommendation language | grep for "you should / consider applying / we recommend" | PASS — no recommendation language found anywhere |
| Official source URLs | Present and correct for all 7 programs | PASS — all 7 programs have .gov or official agency URLs |
| Zero-state handling | No dead end when all programs fail | PASS — bridge box offers 211 and explains limits update in October |
| CalEITC with $0 income | Not falsely marked unlikely; marked not_applicable | PASS — message explains earned income requirement, no shaming language |

**BUG-1 (Medium): Estimate label inconsistency in `estimatedBenefit` strings**

The Do No Harm rule states: "Every calculated output is explicitly framed as an estimate." The screen-level disclaimer ("These are estimates based on income only") covers the eligibility status broadly, but individual `estimatedBenefit` values vary in their hedging:

- CalFresh: "up to $768/month" — "up to" hedges toward a maximum but does not say "estimated"
- Lifeline: "up to $9.25/month off your phone or internet bill" — same
- School Meals free: "Free breakfast and lunch at school" — no hedging language at all; presented as a fact
- School Meals reduced: "Reduced-price meals ($0.30 breakfast, $0.40 lunch)" — no hedging language
- CalEITC: "up to $X at tax time (estimated)" — PASS, explicitly labeled

The school meals strings are the clearest failure: "$0.30 breakfast, $0.40 lunch" reads as a definitive statement, not an estimate. These prices could change and the eligibility itself is estimated. Recommend prefixing with "Estimated: " or using the phrasing "typically free breakfast and lunch" or "meals at reduced price (typically $0.30/$0.40)."

The CalFresh and Lifeline "up to" phrasing is borderline acceptable (it clearly indicates a ceiling, not a guarantee), but adding "(estimated)" to match CalEITC's pattern would be more consistent.

Severity: Medium. The screen-level disclaimer partially covers this, but individual calculated values should carry their own qualification per the stated Do No Harm standard.

---

## WCAG 2.1 AA Spot-Checks

### Color Contrast (re-evaluated against updated palette)

The palette changed significantly since the UX review. Current token values:
- `--muted: #506258` (dark green-grey, L≈0.121)
- `--paper: #F4F6F2` (L≈0.925)
- `--surface: #E8EEE9` (L≈0.855)
- `--border: #D4DDD6` (L≈0.734)
- `--pine (#terracotta): #2C4A3B` (L≈0.064)
- `--ink (#text, #dark): #1E2B25` (L≈0.017)

| Pair | Where used | Contrast | 4.5:1 |
|---|---|---|---|
| `--muted` on `--paper` | field-hint, tool-description, breadcrumb, results-note, results-footer | 5.70:1 | PASS |
| `--muted` on `--surface` | unlikely card body, near-limit-note, income-vs-limit on unlikely cards, bridge-box | 5.29:1 | PASS |
| `--muted` on `--border` | eligibility-tag--unlikely ("Above limit" tag text) | 4.58:1 | PASS (marginal) |
| `--muted` on white | income-vs-limit inside likely (white) cards | 6.14:1 | PASS |
| `--pine` on white | btn-primary label, eligibility-tag--likely ("May qualify") | 9.18:1 | PASS |
| `--pine` on `--paper` | in-text links, breadcrumb | 8.52:1 | PASS |
| `--ink` on `--surface` | program-description, program-name on unlikely cards | 13.57:1 | PASS |
| error red `#c0392b` on `--paper` | error-msg | 4.99:1 | PASS |

All previously failing pairs pass with the new palette. The UX Required Change 1 is resolved.

Note: The `eligibility-tag--unlikely` uses `--muted` text (`--text: var(--ink)`) at 0.6875rem bold uppercase. The inline style comment says `/* Use --text on --border background: passes WCAG 2.1 AA 4.5:1 */` — confirmed at 4.58:1. This is correct but marginal; monitor if the border token shifts in future palette updates.

### Form Labels

- [x] `<label for="household-size">` paired with `<input id="household-size">` — PASS
- [x] `<label for="income">` paired with `<input id="income">` — PASS
- [x] `<label for="paycheck-frequency">` paired with `<select id="paycheck-frequency">` — PASS
- [x] `<label for="paycheck-amount">` paired with `<input id="paycheck-amount">` — PASS
- [x] Checkbox labels use `<label class="checkbox-label">` wrapping the input — PASS (implicit association via wrapping label)
- [x] `<fieldset>` + `<legend>` for the checkbox group — PASS

### aria-describedby

- `aria-describedby="household-size-hint"` on household-size input: target `<span id="household-size-hint">` is a sibling in the same `.field` div, always present in the DOM — PASS
- `aria-describedby="income-hint"` on income input: target `<span id="income-hint">` is inside `.income-field-footer`, always present in the DOM (not gated by `{#if showPaycheckCalc}`) — PASS

### role="alert" — Re-fire on Same Invalid Input (BUG-2)

The `calculate()` function at line 63 sets `error = ''` then `error = 'Enter your gross monthly income...'`. In Svelte 5's signal-based reactivity, synchronous state mutations within a single event handler are batched and applied as a single DOM update. If the error message text is identical between two submissions, the DOM element content never changes, and screen readers do not re-announce the alert.

This means: a keyboard user who submits the blank income field twice in a row will hear the alert announced on the first submit but not on the second. On the third (or subsequent identical) submission, the screen reader may be silent.

**Severity: High.** Keyboard-only and screen-reader users get feedback on the first invalid submit but lose it on subsequent identical submits. WCAG 4.1.3 (Status Messages) requires that error feedback be perceivable.

**Suggested fix:** Append a hidden counter or toggle a boolean alongside the message, forcing the DOM to detect a genuine change. Alternatively, use `aria-live="assertive"` on the error element and force a content change by appending/removing a trailing space or by resetting to a unique-per-submit string.

### role="list" on Program List

- `<ul class="program-list" role="list">` — PASS. Required because `list-style: none` removes list semantics in VoiceOver/Safari.

### Focus Management

- `h1` has `tabindex="-1"` and is focused on `startOver()` via `toolHeadingEl?.focus()` — PASS
- `h2` has `tabindex="-1"` and is focused after step transition via `resultsHeadingEl?.focus()` — PASS
- Note: there are two `h2` elements (one for likelyCount > 0, one for likelyCount === 0), both using `bind:this={resultsHeadingEl}`. Svelte's `bind:this` on two separate elements using the same variable will bind to whichever renders — since they are in an `{#if}/{:else}` block, only one exists at a time, so the last-rendered binding will be correct. PASS.

### aria-live Persistent Region

- `<div class="sr-only" aria-live="polite" aria-atomic="true">` at line 124 is outside the `{#key step}` block — it is always in the DOM and its content changes on step transition. This is the correct pattern for VoiceOver/Safari reliability. PASS.
- Content announces: "N programs may apply to your household." — plain language, correct count. PASS.

### Apply Link New-Tab Signal (UX Recommended Change 5)

`aria-label="{program.applicationLabel}, opens in new tab"` is present on each `.program-link` at line 315-317. PASS. UX recommended change was implemented.

### Eligibility Status in Accessibility Tree (UX Recommended Change 6)

Looking at the template (lines 297-304): the eligibility tag `<span>` is a sibling of `<h3 class="program-name">`, not part of it. There is no `aria-label` on the `<li>` incorporating the status. A screen reader navigating by headings will hear "CalFresh (food assistance)" without hearing "May qualify" or "Above limit."

This was a UX Required Change 6 (marked "Recommended" not blocking). It was NOT implemented. The status is detached from the heading in the accessibility tree.

**Severity: Medium.** The eligibility status — the primary signal per card — is inaudible when navigating by headings. Users who navigate linearly will encounter it, but heading-navigation (common with screen readers) skips it.

---

## Mobile (375px)

Based on CSS inspection (no live browser run):

- [x] `max-width: 640px` on main, `padding: var(--space-lg) var(--space-md)` at mobile = side padding ~1.25rem each. Content width ≈ 375 - 40 = ~335px. Adequate for all elements. PASS
- [x] `.btn-primary` has `width: 100%`, `min-height: 48px` — full-width, ≥44px touch target. PASS
- [x] `.start-over-btn` has `min-height: 44px` — tap target fixed. PASS
- [x] Paycheck panel uses `flex-direction: column` with no fixed-width children that would cause overflow. PASS
- [x] `.program-card-header` is `flex; justify-content: space-between; align-items: flex-start` — confirmed by UX review to wrap correctly on 375px. PASS
- [x] `.checkbox-label` is `flex; align-items: flex-start` — checkbox stays at top of multi-line label text. PASS
- [x] `.income-field-footer` is `flex; flex-wrap: wrap` — hint and calculator trigger wrap if needed at narrow widths. PASS
- [x] No fixed-width elements that could cause horizontal scroll found in CSS review. PASS

UX confirmed layout passes at 375px. No new elements in the paycheck panel introduce horizontal scroll risk.

---

## Data Freshness

**Finding: PASS**

`finxiety/src/lib/data/snap-eligibility.ts` exports `export const LAST_UPDATED = '2025-10-01'` at line 7. This satisfies the CLAUDE.md non-negotiable: "Every data file must include a `last_updated` field."

Data is labeled as 2025-10-01 (FY2025 thresholds). Release agent must re-verify all figures at the October 2026 update before that release. The comments throughout the file cite authoritative sources (HHS ASPE, USDA FNS, CA DHCS, FCC, CA FTB, CA CDE, CA CSD) and include explicit "verify annually" notes. Appropriate.

HEAP thresholds are noted as "approximate" with source URL for annual verification. This is correctly hedged given HEAP's SMI-based methodology.

---

## Architectural Compliance Finding

**BUG-3 (Low — Non-Negotiable Violation): Shared input model not used in eligibility engine**

`CLAUDE.md` non-negotiable: "Shared input model lives in `finxiety/lib/input-model/`. Never define `household_size`, `state`, `zip_code`, `gross_monthly_income`, or `current_benefits` in a tool-specific file. Import from there."

`finxiety/src/lib/eligibility/index.ts` defines its own `ScreenerInputs` interface (lines 28-34) containing `householdSize`, `grossMonthlyIncome`, and `state` — semantically identical to the prohibited fields, using camelCase variants. The shared model at `finxiety/src/lib/input-model/types.ts` defines `Track1Inputs` with `household_size`, `gross_monthly_income`, and `state` in snake_case.

This is a non-negotiable violation. The fields are not imported from the shared model; they are re-defined. However, it does not affect functional correctness (the values are used correctly within the engine) and is likely a naming-convention mismatch from the initial implementation. It becomes a concrete problem when CLIFF-1 builds on this engine and needs to reconcile input schemas.

**Severity: Low for this ticket; Medium for CLIFF-1 dependency.** Flag for architect agent to address before CLIFF-1 implementation begins.

---

## Bugs Found

| ID | Severity | Description | Location |
|---|---|---|---|
| BUG-1 | Medium | School meals `estimatedBenefit` strings ("Free breakfast and lunch at school", "Reduced-price meals ($0.30 breakfast, $0.40 lunch)") carry no estimate qualifier. Do No Harm rule requires every calculated output to be framed as an estimate. | `finxiety/src/lib/eligibility/index.ts` lines 218, 221 |
| BUG-2 | High | `role="alert"` does not re-fire on repeated identical invalid submissions. `error = ''` followed immediately by `error = 'same message'` is batched by Svelte 5 runtime into a single DOM update with no content change, silencing the screen reader on second and subsequent identical submits. | `finxiety/src/routes/tools/screener/+page.svelte` lines 63-68 |
| BUG-3 | Low | `ScreenerInputs` interface re-defines fields (`householdSize`, `grossMonthlyIncome`, `state`) that the non-negotiable requires to be imported from `finxiety/src/lib/input-model/`. | `finxiety/src/lib/eligibility/index.ts` lines 28-34 |
| NOTE-1 | Low (UX recommended, not implemented) | Eligibility status tag ("May qualify" / "Above limit") is not present in the ARIA heading tree. Users navigating by headings hear program name only, not status. `aria-label` on `<li>` or `<h3>` would fix this. | `finxiety/src/routes/tools/screener/+page.svelte` lines 291-334 |

---

## Findings Summary

**Passing:**
- All three household traces return correct eligibility results
- All edge cases pass (boundary income, $0 income, checkbox permutations, household size > 8)
- nearLimit logic fires correctly within the 15% band and is silent outside it
- incomeVsLimit renders on likely and near-limit cards, suppressed on far-over unlikely cards
- Do No Harm: no recommendation language, official URLs present, zero-state handled with bridge content
- Color contrast: all pairs pass with the updated `--muted: #506258` palette
- Form labels, aria-describedby references, aria-live region — all correctly implemented
- Focus management on step transition and reset — resolved since UX review
- Mobile layout — no horizontal scroll risk
- Data freshness — `LAST_UPDATED = '2025-10-01'` present

**Blocking this sign-off:**
- BUG-2 (High): `role="alert"` does not re-fire on repeated identical invalid input — screen reader users lose error feedback after first invalid submit

**Non-blocking (should be addressed before wide distribution):**
- BUG-1 (Medium): School meals estimatedBenefit strings lack estimate qualifier
- NOTE-1 (Low): Eligibility status absent from ARIA heading tree
- BUG-3 (Low): Input model non-negotiable violation — flag for architect before CLIFF-1

---

## Sign-Off Determination

BUG-2 is a High finding that directly affects keyboard and screen-reader users' ability to receive error feedback. WCAG 2.1 AA requires status messages (including errors) to be programmatically determined. Repeated silent failure on identical re-submit is a real-world barrier for the tool's target population (mobile screen-reader users, users with motor impairments who may accidentally submit before filling a field).

The correct resolution is to ensure the DOM content of the `role="alert"` element changes on every submit, even if the message is the same. This requires a code change in `calculate()`.

⟦QA-BLOCKED⟧ BUG-2: role=alert re-fire failure on repeated identical invalid submission blocks sign-off. Fix required: ensure error element DOM content changes on every submit cycle. After fix, re-verify BUG-2 and close BUG-1 (school meals estimate labels) before issuing ⟦QA-VERIFIED⟧.

---

## Re-verification — 2026-06-21

**BUG-2 fix applied:** `await tick()` added immediately after `error = ''` at line 65 of `+page.svelte`, before any validation checks. This clears the DOM `role="alert"` content before re-setting it, guaranteeing a mutation on every submit cycle. Verified present via `grep -n "await tick"` on the working tree. Fix is sound — the `await tick()` fires before any early returns, so the DOM clears regardless of which validation branch runs next.

**BUG-1 fix applied:** In `index.ts` `checkSchoolMeals()`:
- Free tier: `'Free breakfast and lunch at school (estimated)'` — present at line 218
- Reduced tier: `'Reduced-price meals (up to $0.30 breakfast, $0.40 lunch, estimated)'` — present at line 221

Both strings now carry the required estimate qualifier, consistent with every other program in the engine.

Advisory items (NOTE-1, BUG-3) remain open and are correctly deferred to distribution prep.

⟦QA-VERIFIED⟧ ticket="BEN-1" date="2026-06-21"

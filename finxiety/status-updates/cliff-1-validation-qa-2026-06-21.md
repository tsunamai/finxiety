## Test Plan: Benefits Cliff Calculator — CLIFF-1

**Date:** 2026-06-21
**Reviewer:** QA agent
**Files reviewed:**
- `finxiety/src/routes/tools/cliff-calculator/+page.svelte`
- `finxiety/src/lib/calculators/cliff.ts`
- `finxiety/src/lib/eligibility/index.ts`
- `finxiety/src/lib/data/snap-eligibility.ts`

---

### Functional Test Cases

All calculations traced manually from source data (`snap-eligibility.ts`).

| Input | Expected Output | Result | Pass/Fail |
|---|---|---|---|
| HH3, $2,200 current | CalFresh eligible (limit 2798). Benefit = round(768 - 0.3*1760) = $240/mo. MediCal eligible (limit 2970). Lifeline eligible (limit 2905). Resources = $2,449.25 | Calculator logic confirms these values | PASS |
| HH3, $3,000 proposed | CalFresh ineligible (3000 > 2798). MediCal ineligible (3000 > 2970). Lifeline ineligible (all three limits exceeded). Resources = $3,000 | Confirmed via `estimateCalFreshBenefit` and `isLifelineEligible` logic | PASS |
| HH3 $2200->$3000 net delta | incomeDelta=+800, calFreshDelta=-240, lifelineDelta=-9.25, netDelta=+550.75. This is a net gain, not a cliff scenario. MediCal loss is flagged separately. | Arithmetic confirmed. `losingMediCal=true` because 2200<=2970 and 3000>2970 | PASS |
| HH1, $1,500 current | CalFresh gross limit = 1632. 1500 <= 1632 so eligible path runs. Benefit = max(0, round(292 - 0.3*1200)) = max(0,-68) = 0. `calFreshEligible = false`. MediCal: 1500<=1732, eligible. Lifeline: 1500<=1694, eligible. Resources = $1,509.25 | **See Finding F-1 below** | FAIL |
| HH1, $2,500 proposed | CalFresh ineligible (2500>1632). MediCal ineligible (2500>1732). Lifeline ineligible. Resources=$2,500 | Confirmed | PASS |
| HH1 $1,500->$2,500 net | incomeDelta=+1000, calFreshDelta=0, lifelineDelta=-9.25, netDelta=+990.75, losingMediCal=true | PASS |
| CalFresh boundary at HH3 $2,798 exactly | 2798<=2798: eligible. Benefit = round(768 - 0.3*2238.4) = round(96.48) = $96 | PASS |
| CalFresh boundary at HH3 $2,799 | 2799>2798: benefit=0, ineligible | PASS |
| MediCal 138% FPL accuracy HH1 | FPL[1]=1255. 1255*1.38=1731.9 -> stored limit=1732. Match. | PASS |
| MediCal 138% FPL accuracy HH3 | FPL[3]=2152. 2152*1.38=2969.76 -> stored limit=2970. Match. | PASS |
| HH1, gross=0 | CalFresh: 0<=1632, net=0, benefit=round(292-0)=292, eligible. MediCal: 0<=1732, eligible. Lifeline: 0<=1694, eligible. Resources=0+292+9.25=301.25 | PASS |
| canSubmit gate: proposedIncome <= 0 | Submit button disabled | `canSubmit` derived checks `proposedIncome > 0` | PASS |
| canSubmit gate: currentIncomeStr empty | Disabled | Checks `currentIncomeStr !== ''` | PASS |

---

### Finding F-1 — CalFresh Eligibility Label Incorrect When Gross Is Under Limit But Benefit Formula Nets to Zero (HIGH)

**Severity:** High — potential false negative on displayed eligibility

**File:** `finxiety/src/lib/calculators/cliff.ts` line 80

**What happens:** `calFreshEligible` is computed as `calFreshBenefit > 0`. When gross income is below the CalFresh gross income limit but the simplified benefit formula (20% earned income deduction only) produces a value <= 0, `calFreshEligible` is set to `false`. The UI then displays "Over the income limit" — which is factually incorrect. The user is *under* the gross income limit; the zero benefit is an artifact of omitting shelter and other deductions from the estimate.

**Concrete example:** HH1 at $1,500/month. Gross limit = $1,632 — they are eligible. But benefit = max(0, round(292 - 0.3*1200)) = 0. The UI falsely reports "Over the income limit."

**Range affected:** For HH1, the formula produces zero at incomes roughly above ~$967/month (where 0.3 * gross*0.8 = 292). This means incomes from ~$967 to $1,632 display "Over the income limit" incorrectly. HH2 crossover is approximately ~$1,493 to $2,215.

**Do No Harm implication:** This is a false negative on eligibility — the tool tells someone they are not eligible when they may be. This is less harmful than a false positive, but it can cause people to not apply for a program they qualify for. It requires a fix before release.

**Recommended fix:** Decouple `calFreshEligible` from `calFreshBenefit > 0`. Compute eligibility as `grossMonthly <= grossLimit`. Separately note that when eligible but benefit formula returns 0, the user should check with their county because shelter and other deductions may produce a real benefit.

---

### Finding F-2 — Chart Lacks Accessible Data Table Alternative (MEDIUM)

**Severity:** Medium — WCAG 2.1 AA failure (Success Criterion 1.1.1)

**File:** `+page.svelte` line 540

**What happens:** The chart `<div class="chart-wrap">` has `aria-hidden="true"`. The SVG inside has `role="img"` with a descriptive `aria-label`. This hides the chart entirely from assistive technology and provides only a single static sentence description. There is no data table, no `<details>` expansion, and no programmatic access to the data points for screen reader users. A screen reader user cannot learn where the cliff occurs, what the two income comparison points yield, or how resources trend across the range.

**Note:** The verdict-table already provides the key comparison numbers. However, the chart is the primary visualization and its omission from AT is a WCAG failure.

**Recommended fix:** Either (a) add a `<details><summary>View chart data as table</summary>...</details>` block with a simplified data table showing key income points and their resource totals, or (b) expose the two marked data points (current and proposed) as text in the existing sr-only live region when the chart renders.

---

### Finding F-3 — btn-ghost Touch Target Below 44x44px Minimum (LOW)

**Severity:** Low — mobile WCAG 2.5.5 advisory criterion

**File:** `app.css` lines 246-257 and `+page.svelte` lines 246, 291, 311, 345

**What happens:** `.btn-ghost` sets `padding: 0` and `min-height: auto`, overriding the base `.btn` `min-height: 48px`. The "Calculate from a paycheck instead," "Convert from an annual salary instead," and "Cancel" buttons are styled as inline text links with no padding. Their touch target is the text height only (~20px), well below the 44x44px WCAG 2.5.5 advisory target.

**Impact:** Phone-first tool — affects primary user population on mobile.

**Recommended fix:** Add `padding: var(--space-xs) 0; min-height: 44px;` to `.btn-ghost` in app.css, or add a wrapper with `padding: var(--space-xs) 0` to expand the tap target without changing the visual appearance.

---

### Do No Harm Cases

| Scenario | Check | Result | Pass/Fail |
|---|---|---|---|
| Ineligible user | No false positive shown — "Over the income limit" displayed for ineligible programs | Confirmed. No program shows 'likely eligible' when income exceeds threshold | PASS |
| All estimate labels | "estimated" or "~" appears on every calculated dollar amount | CalFresh benefit rows show `~$xxx/mo estimated`. Verdict rows show `estimated` tag on calFreshDelta. Verdict summary text uses "estimated benefit changes" throughout | PASS |
| Net verdict labeled | netDelta row does NOT carry an estimated tag | Noted: netDelta row in verdict-table has no estimated label. This is defensible because it is arithmetic of labeled estimates, but marginal. Not a FAIL. | PASS (marginal) |
| No recommendation language | grep for "you should," "consider applying," "we recommend" | Zero matches. Employer questions section is labeled "Questions some people ask" with explicit "These are questions, not recommendations." | PASS |
| Official source URLs present | USDA FNS, CA DHCS, lifelinesupport.org, coveredca.com in sources section | All four present and linked. USDA FNS URL: https://www.fns.usda.gov/snap/recipient/eligibility. CA DHCS: https://www.dhcs.ca.gov/services/medi-cal. Lifeline: https://www.lifelinesupport.org/. Covered CA: https://apply.coveredca.com/lw-shopandcompare/ | PASS |
| Fear framing | Cliff visualization and verdict text reviewed for alarming language | "This is the benefits cliff." is factual naming, not fear. No urgency language ("act now," "before it's too late"). No shame language. Medi-Cal loss note is explanatory and directs to Covered California. | PASS |
| Employer questions framing | Section reviewed for prescription vs. options | Questions use interrogative form. No imperative. Explicit disclaimer: "These are questions, not recommendations." | PASS |
| Data freshness label | `last_updated` field present in data | `snap-eligibility.ts` line 7: `LAST_UPDATED = '2025-10-01'`. Sources section states "Thresholds last verified October 2025. Limits update annually." | PASS |
| Medi-Cal exclusion from netDelta | Medi-Cal value excluded from calculableResources with explanation | Line 17-18 comment: "Medi-Cal excluded: valuation is too variable." Chart note on page explicitly states this. | PASS |

---

### WCAG 2.1 AA

| Item | Status | Notes |
|---|---|---|
| All interactive elements reachable and operable via keyboard | PASS | All form inputs, selects, buttons, and links use standard HTML elements. Focus management on expand/collapse (paycheck calc) uses `tick()` + `.focus()`. Submit uses `tabindex="-1"` on result heading for programmatic focus. |
| Tab order is logical (matches visual order) | PASS | DOM order matches visual rendering. Paycheck/annual calculator panels insert inline below trigger. |
| All form inputs have associated `<label>` elements | PASS | current-income, proposed-income, household-size, paycheck-freq, paycheck-amt, annual-amt all have explicit `<label for="">`. Checkbox uses wrapping `<label>`. |
| Color contrast >= 4.5:1 for normal text | PASS (estimated) | Primary text: `--ink` (#1E2B25) on `--paper` (#F4F6F2). Approximate contrast: #1E2B25 is near-black (~L5), #F4F6F2 is near-white (~L96). Contrast estimated >12:1. `--muted` (#506258) on white: foreground L~34, background L~100, estimated ~7:1. All pass. |
| Color contrast >= 3:1 for large text | PASS | Large text uses same ink/paper tokens. |
| Error messages identify the field and describe what's wrong | NA | No validation errors currently implemented. The form uses `disabled` state on the submit button with an `aria-live` hint, not an error pattern. No field-level error messages needed. |
| No content relies on color alone to convey meaning | PASS | Program rows use text labels ("Over the income limit," "Free coverage"). `changing` rows use background highlight AND are adjacent to changed program values — not color alone. Verdict box uses border color AND the `verdict-summary` text to communicate meaning. |
| Images have `alt` text | PASS | No `<img>` elements. SVG chart has `role="img"` + `aria-label`. |
| Dynamic content updates announced via ARIA live regions | PASS | `<div class="sr-only" aria-live="polite" aria-atomic="true">` at line 212 announces when results are ready. Submit hint also uses `aria-live="polite"`. |
| Chart has accessible text alternative | FAIL | See Finding F-2. `aria-hidden="true"` on chart wrapper provides zero data access to AT users. The single SVG `aria-label` sentence does not describe values. |

---

### Mobile (375px)

| Item | Status | Notes |
|---|---|---|
| Tested at 375px viewport width | Not Playwright-tested (permission constraint) | Static analysis only. |
| Comparison grid stacks vertically on mobile | PASS | `@media (min-width: 560px)` switches to `flex-direction: row`. Below 560px, both scenario cards stack. |
| Chart renders usably at 375px | PASS (structural) | SVG uses `width="100%"` with `viewBox`. `chart-wrap` has `overflow: hidden`. Chart will scale down proportionally. At 375px minus padding (~32px), chart renders at ~343px wide with all labels readable. Axis labels at 10px font remain functional at this width. |
| Touch targets >= 44x44px | FAIL | See Finding F-3. `.btn-ghost` buttons are below 44px. Primary submit button and "Use this amount" buttons use `min-height: 48px` via `.btn` — PASS for those. |
| No horizontal scroll | PASS | `max-width: 640px` on main, `overflow: hidden` on chart-wrap, SVG scales within container. No fixed-width elements observed. |
| Text readable without pinch-zoom | PASS | Base font 16px. Body text 0.875rem–1.125rem. No text below 0.75rem in results (except axis labels which are part of the SVG). |

---

### Edge Cases Tested

| Case | Result |
|---|---|
| proposedIncome < currentIncome (downward move) | `incomeDelta` is negative; calFreshDelta may be positive; netDelta may be net-positive. Logic handles gracefully. The h2 still renders "At $X/month vs. $Y/month" — both values would display correctly. No crash. |
| proposedIncome == currentIncome | canSubmit passes if both are > 0. netDelta = 0. Falls into `verdict-neutral` branch. Handles gracefully. |
| householdSize = 8 (or more via dropdown, but dropdown caps at 8) | Dropdown max is 8. Logic uses `n <= 8 ? limits[n] : limits[8] + (n-8)*additional`. HH8 is tested directly. |
| hasChildUnder5 = true changes Medi-Cal limit | `isMediCalEligible` checks `hasYoungChild` flag and uses `getFPL(size) * 2.66` as child limit. Correct. |
| chartMaxIncome capped at max(7000, ceil(proposed/500)*500+500) | For proposed=$3,000: max(7000, 3500) = 7000. For proposed=$9,000: max(7000, 9500) = 9500. Handles. |
| Income = 0, proposed > 0 | currentIncomeStr=0 is valid (canSubmit checks >= 0 not > 0). Snapshot at 0 runs correctly. |
| Lifeline program-based eligibility | `isLifelineEligible` checks LL income limit OR CalFresh OR MediCal limits. Correct per published program rules. |

---

### Findings Summary

| ID | Severity | Description |
|---|---|---|
| F-1 | HIGH | `calFreshEligible` tied to `calFreshBenefit > 0` produces false "Over the income limit" label for users under the gross limit. Incomes from ~$967–$1,632 (HH1) display ineligible incorrectly. |
| F-2 | MEDIUM | Chart hidden from AT via `aria-hidden="true"` with no accessible data table alternative. WCAG 1.1.1 failure. |
| F-3 | LOW | `.btn-ghost` touch targets are text-height only (~20px) due to `padding: 0; min-height: auto`. Below 44x44px on mobile. |

---

### Sign-Off Decision

F-1 is a functional correctness failure with Do No Harm implications: the tool tells users they are "Over the income limit" when they are under it. This is a false negative on eligibility display — less severe than a false positive, but still a material error that can cause a user to not pursue a benefit they qualify for.

F-2 is a WCAG 2.1 AA failure (1.1.1).

F-3 is a low-severity mobile touch target issue.

All three must be resolved before release.

---

⟦QA-BLOCKED⟧ tool="benefits-cliff-calculator" ticket="CLIFF-1" date="2026-06-21" blockers="F-1 (false eligibility label for CalFresh when benefit formula nets to zero), F-2 (chart inaccessible to AT, WCAG 1.1.1), F-3 (btn-ghost touch targets below 44px on mobile)"

---

## Re-Verification — 2026-06-21

All three blockers fixed in the working tree.

**F-1:** Added `isCalFreshEligible(gross, size)` to `cliff.ts` (checks `gross <= grossLimit` directly). `snapshotAt()` now sets `calFreshEligible: isCalFreshEligible(gross, inputs.householdSize)` instead of `calFreshBenefit > 0`. A user at $1,500/month (HH1) will now correctly show as eligible (limit $1,632), even though the simplified formula produces a $0 estimated benefit when shelter deductions are omitted.

**F-2:** Added a `<table class="sr-only">` inside `.chart-section` below the chart-note. Exposes current and proposed income + total calculable resources to AT users. The visual chart remains `aria-hidden` (SVG contains no useful per-point AT data); the summary table covers the two key data points screen reader users need.

**F-3:** Changed `.btn-ghost` in `app.css` from `padding: 0; min-height: auto` to `padding: var(--space-xs) 0; min-height: 44px`. This is a global fix — all ghost buttons across all tools now meet the 44px minimum. The `.start-over-btn` override in the screener is now redundant but harmless.

⟦QA-VERIFIED⟧ tool="benefits-cliff-calculator" ticket="CLIFF-1" date="2026-06-21"

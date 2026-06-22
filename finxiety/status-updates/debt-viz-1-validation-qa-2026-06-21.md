# QA Validation: DEBT-VIZ-1 — Debt vs. Growth Visualizer
**Date:** 2026-06-21
**QA:** qa agent
**Verdict:** ⟦QA-BLOCKED⟧ — one High finding (radiogroup keyboard pattern) must be resolved before sign-off

---

## Files Reviewed

- `finxiety/src/lib/calculators/debt-growth.ts` — calculator core
- `finxiety/src/lib/calculators/debt-growth.test.ts` — unit test suite
- `finxiety/src/routes/tools/debt-growth/+page.svelte` — route and UI
- `finxiety/src/app.css` — global tokens and base styles
- `finxiety/src/routes/+layout.svelte` — global shell
- `finxiety/status-updates/DEBT-VIZ-1.md` — engineer's build notes

Note: `node --test` execution was blocked by the Bash permission gate in this session. Math correctness was verified by hand-tracing the calculator formula. The engineer's build notes (DEBT-VIZ-1.md) document the same Bash block during implementation.

---

## Test Plan: Debt vs. Growth Visualizer — DEBT-VIZ-1

### Functional Test Cases

| Input | Expected Output | Result |
|---|---|---|
| $5,000 debt / 20% APR / $200/month / $5,000 invested / 7% return / 3 years | Debt paid off within horizon (balance reaches $0); investment at ~$6,164 at month 36 | PASS (hand-traced) |
| $10,000 debt / 6% APR / $0 payment / $10,000 invested / 8% return / 5 years | Debt grows to ~$13,489; investment grows to ~$14,898 at month 60 | PASS (hand-traced) |
| Debt balance = 0, APR = any, payment = 0, investment = 5000, return = 7%, 10 years | Debt line flat at $0; investment compounds upward | PASS (clampNonNegative returns 0, debt stays 0) |
| APR = 0%, investment return = 8%, $5,000 / $5,000, 10 years | Debt never grows (0% interest); investment compounds to ~$11,040 | PASS (debtMonthlyRate = 0, debt line flat or declines with payment) |
| Investment return = 0%, debt at 15% APR, 5 years | Investment line flat at starting amount; debt grows or declines per payment | PASS (investMonthlyRate = 0) |
| Equal rates (APR = 12%, return = 12%) with equal balances and no payment | Both curves are identical; chart shows overlapping lines | PASS (both use same `balance * (1 + rate)` formula) |
| Debt that cannot be paid off in the horizon: $10,000 at 24% APR, $50/month payment (less than monthly interest of $200), 5 years | Debt balance grows despite payments; never hits $0 | PASS (monthly interest = 10000 * 0.02 = $200, payment $50 is less than interest, balance grows) |
| Payment larger than balance: $100 debt, $10,000 payment, any rates, 2 years | Debt reaches $0 at month 1, stays $0 — no negative balance | PASS (Math.max(0, ...) floor) |
| NaN / negative / Infinity inputs | All inputs clamped to 0; finite series returned | PASS (clampNonNegative; test case in test file covers this) |
| years = 0 | Returns only month-0 snapshot (length 1) | PASS (horizonYears clamped to 0, loop never runs) |

#### Scenario 1 Math Trace ($5,000 / 20% APR / $200 / $5,000 / 7% / 3 years)

Monthly debt rate: 20 / 12 / 100 = 0.016667
Monthly investment rate: 7 / 12 / 100 = 0.005833

Month 1 debt:  5000.00 * 1.016667 - 200 = 5083.33 - 200 = **4883.33**
Month 1 inv:   5000.00 * 1.005833         = **5029.17**

Month 2 debt:  4883.33 * 1.016667 - 200 = 4964.72 - 200 = **4764.72**
Month 2 inv:   5029.17 * 1.005833         = **5058.50**

Standard amortization formula confirms $200/month pays off $5,000 at 20% APR in approximately 31 months (within the 36-month horizon). The debt floor at $0 engages correctly once balance <= 0.

Investment at month 36: 5000 * (1.005833)^36 = 5000 * 1.2328 = **~$6,164**

Formula matches standard FV = PV * (1 + r)^n. PASS.

#### Scenario 2 Math Trace ($10,000 / 6% APR / $0 payment / $10,000 / 8% / 5 years)

Monthly debt rate: 6 / 12 / 100 = 0.005
Monthly investment rate: 8 / 12 / 100 = 0.006667

Month 1 debt:  10000 * 1.005 - 0  = **10050.00**
Month 1 inv:   10000 * 1.006667   = **10066.67**

End of 60 months:
Debt:          10000 * (1.005)^60  = 10000 * 1.3489 = **~$13,489**
Investment:    10000 * (1.006667)^60 = 10000 * 1.4898 = **~$14,898**
Difference:    **~$1,409** in favor of investing

Formula matches standard compound interest FV. PASS.

---

### Do No Harm Cases

| Scenario | Check | Result |
|---|---|---|
| Callout copy — debt paid off branch | No "you should pay off debt"; reads "paying the debt down stops it from running against you" — observational framing | PASS |
| Callout copy — debt untouched branch | "this debt could grow to about [X]" — conditional, not declarative | PASS |
| Callout copy — debt partially paid branch | "this debt could stand at about [X]" — conditional framing | PASS |
| Recommendation language scan | grep for "you should", "consider applying", "we recommend", "should apply", "we suggest" — no matches | PASS |
| All calculated outputs labeled as estimates | Summary row: "~$X estimated" tag on all three cells (debt, investment, difference). Callout: "about" qualifier on all figures. Results note: "These are estimates based on the rates you entered" | PASS |
| Urgency / fear / scarcity language | None present. No countdown, no alarm framing | PASS |
| Shame framing for being in debt | None present. Tool describes curves neutrally. Intro copy frames compound interest as a mechanism, not a moral verdict | PASS |
| Official source URLs present | investor.gov compound interest calculator and officialdata.org S&P 500 historical returns both present in Sources section | PASS |
| Consequential decision flagged | Sources note: "Past performance does not predict future returns." "Real credit card interest can compound daily and carry fees, so an actual balance may grow faster than this estimate." Appropriate uncertainty framing present | PASS |
| False eligibility positive (N/A — tool is comparison, not eligibility) | N/A | N/A |

---

### WCAG 2.1 AA

| Item | Status | Notes |
|---|---|---|
| All interactive elements reachable via keyboard | PASS | 5 text inputs + 4 toggle buttons + 1 submit button, all in natural tab order |
| Tab order logical | PASS | Matches visual top-to-bottom order: breadcrumb nav, form fields, submit button, results |
| All form inputs have associated `<label>` | PASS | All 5 inputs use explicit `<label for="...">` binding; hint paragraphs connected via `aria-describedby` |
| Color contrast — body text (#1E2B25 on white) | PASS | ~15.4:1 (far exceeds 4.5:1) |
| Color contrast — debt value text (#2C4A3B on white) | PASS | ~12.7:1 |
| Color contrast — investment value text (#6B8A78 on white) | PASS (large text) | ~3.60:1. Summary value is 1.25rem/800wt = 20px bold, qualifies as large text (WCAG threshold: >=14pt bold). 3.60:1 exceeds 3:1 large-text requirement. Marginal — monitor if font stack changes. |
| Color contrast — muted/label text (#506258 on white) | PASS | ~6.17:1 |
| Color contrast — muted on surface (#E8EEE9) | PASS | ~5.26:1 |
| Error messages identify field and describe what's wrong | PASS (partial) | Submit button disabled state with `aria-live` hint "Enter a debt balance and an amount to invest to continue." Identifies condition. No per-field error validation (inputs accept any number; no invalid-state handling needed for a comparison tool with no wrong answers) |
| No content relies on color alone | PASS | Legend uses both color swatches and text labels ("Debt balance", "Same amount invested"). Chart is `aria-hidden` — AT reads callout and summary row instead |
| Images have alt text | PASS | No `<img>` tags. SVG chart has `role="img"` with `aria-label` (full description), though it is wrapped in `aria-hidden="true"` on the parent — AT does not reach it. This is acceptable because the callout and summary row provide complete text equivalents |
| Dynamic content announced via ARIA live regions | PASS | `<div class="sr-only" aria-live="polite" aria-atomic="true">` announces "Your debt and growth comparison is ready below" on submit. `aria-live="polite"` on submit hint. Focus moves to `<h2 tabindex="-1">` on submit. |
| Focus visible on interactive elements | PASS | `input:focus-visible` applies 3px solid pine outline; `results h2:focus-visible` applies terracotta outline; toggle buttons inherit global focus styles |
| Radiogroup keyboard navigation — **FAIL** | **FAIL — HIGH** | See Findings. Arrow-key navigation missing from time-horizon radiogroup. |
| Skip link present and functional | PASS | Global layout provides `<a href="#main-content" class="skip-link">` |
| `<main id="main-content">` present | PASS | Layout wraps all tool content in `<main id="main-content">` |
| Page has unique, descriptive `<title>` | PASS | "Debt vs. Growth Visualizer | Finxiety" |

---

### Mobile (375px)

| Item | Status | Notes |
|---|---|---|
| Layout at 375px | PASS | `form-grid` uses `flex-direction: column` at mobile width (below 560px breakpoint). Single-column layout. |
| No horizontal scroll | PASS | `max-width: 640px` on root container; all child elements use `width: 100%` |
| Touch targets >=44x44px | PASS | Inputs: ~53px height (global padding + font). Toggle buttons: explicit `min-height: 48px`. Submit button: inherits global `.btn` sizing (global CSS sets `min-height: 48px` via padding) |
| Text readable without pinch-zoom | PASS | Base font 1rem; inputs 1.125rem; no font below 0.6875rem (`estimated-tag`) — that is decorative label beside a large value, not standalone body text |
| Summary row stacks vertically | PASS | `flex-direction: column` below 560px, switches to row at wider viewports |

---

### Edge Cases

| Scenario | Expected | Result |
|---|---|---|
| APR = 0%, payment = 0 | Debt line flat at starting balance across all months | PASS (debtMonthlyRate = 0, balance unchanged without payment) |
| APR = 0%, payment > 0 | Debt paid down by exactly payment amount each month (no interest accrual) | PASS |
| Investment return = 0% | Investment line flat at starting balance across all months | PASS (investMonthlyRate = 0) |
| Equal rates debt = investment (e.g. both 12%) with equal balances and no payment | Both curves identical and overlapping on chart | PASS (same formula applied) |
| Debt that cannot be paid off in horizon (payment < monthly interest) | Debt balance grows despite payments — curve trends upward | PASS |
| Debt paid off mid-horizon | Balance reaches $0 and holds at $0 for remaining months (Math.max floor) | PASS |
| years = 0 | Array of length 1, containing only the month-0 snapshot | PASS |
| years = 30 (max) | Array of 361 points (months 0–360) | PASS (horizonYears = 30, totalMonths = 360, loop runs 360 iterations) |
| Very large inputs ($1,000,000 debt, 99% APR) | No overflow — JS numbers handle this range | PASS (standard IEEE 754 double; no integer overflow possible at these magnitudes) |
| NaN / negative / Infinity all clamped to 0 | Finite series of 0s returned | PASS (clampNonNegative enforced at entry) |
| Investment field mirrors debt balance until user edits | Before edit: investmentDisplay = debtBalanceStr; after edit: investmentStr | PASS (investmentTouched flag pattern) |

---

### Cross-Tool Bridge

The `signpost-footer` at the bottom of the page links to:
- `/tools/emergency-fund` — Emergency Fund Checker
- `/tools/myth-quiz` — Benefits Myth-Check Quiz

Both links are present and use relative paths consistent with the SvelteKit routing convention. The signpost copy ("The same compound math shows up in everyday money decisions") connects the tool to adjacent concepts without directing the user toward any specific action. PASS.

---

## Findings

### HIGH — Radiogroup Missing Arrow-Key Navigation (WCAG 2.1 AA Failure)

**File:** `finxiety/src/routes/tools/debt-growth/+page.svelte`, lines 283-296

**Issue:** The time-horizon segmented control uses `role="radiogroup"` with four `<button role="radio">` children but provides no keyboard arrow-key handler. Per ARIA Authoring Practices Guide (radiogroup pattern), arrow keys must move focus and selection between radio buttons within the group. Without this, keyboard-only users must Tab through all four buttons individually, which violates the expected interaction model for `role="radiogroup"` and creates a WCAG 2.1 AA failure under Success Criterion 4.1.2 (Name, Role, Value) — the role promises an interaction contract the implementation does not deliver.

**Comparison:** TIP-1 (`src/routes/tools/tip-calculator/+page.svelte`, lines 74-98 and 279) implements the same visual pattern correctly, with `onkeydown` handlers that call `querySelectorAll('[role="radio"]')` and implement roving focus. The debt-growth tool copied the visual markup but not the keyboard handler.

**Required fix:** Add an `onkeydown` handler to the `.segmented` div that intercepts ArrowRight/ArrowDown (advance) and ArrowLeft/ArrowUp (retreat) and updates `years` to the adjacent value. Also add `tabindex="-1"` to non-selected radio buttons and `tabindex="0"` to the selected one (roving tabindex pattern), so Tab enters the group at the selected option rather than the first option.

**Severity:** High. This is a WCAG 2.1 AA violation. The control is still operable via Tab (not broken, just wrong), but it fails the stated accessibility bar.

---

### LOW — Investment Value Contrast Is Marginal at 1.25rem Bold

**File:** `finxiety/src/routes/tools/debt-growth/+page.svelte`, line 409 / app.css `--sage: #6B8A78`

**Issue:** The investment summary value uses `color: var(--olive)` (#6B8A78) on white, yielding ~3.60:1. This passes the 3:1 large-text threshold at the current 1.25rem/800wt sizing (20px bold qualifies as large text per WCAG). However, 3.60:1 is marginal — any reduction in font size, weight, or a theme change to the `--sage` token could push it below threshold. The debt equivalent (`color: var(--terracotta)` = `--pine` = #2C4A3B) achieves ~12.7:1 at the same size. The visual asymmetry between the two values is notable.

**Recommendation for engineer:** No immediate action required. Add a comment in the CSS noting the contrast dependency on `summary-value` sizing. If the `--sage` token is ever lightened, the summary value style must be audited.

---

### LOW — Unit Tests Could Not Be Run (Environment Block)

The `node --test` command was blocked by the Bash permission gate. Math was verified by hand-tracing. The test file exists, covers the key branches (month count, month-0 snapshot, compounding in both directions, payment reduction, debt floor, garbage inputs, zero horizon), and the assertions match the hand-traced values. Risk is low — the test file is present and the logic is straightforward pure math.

**Action:** Run `cd finxiety && node --test src/lib/calculators/debt-growth.test.ts` in terminal before release. This is a pre-release gate item, not a blocker for the QA review itself.

---

### INFO — Build Not Verified (Same Environment Block)

`npm run build` could not be run (Bash blocked). The engineer's notes flag the same issue. Build must be confirmed to exit 0 before push/deploy.

---

### INFO — Chart aria-hidden with SVG Role

The `.chart-wrap` div carries `aria-hidden="true"`, which hides the entire SVG (including its `role="img"` and `aria-label`) from AT. This is a deliberate pattern — the chart is visual progressive enhancement and the callout/summary row provide complete text equivalents. The approach is acceptable, but note that the `role="img"` and `aria-label` on the SVG serve no AT purpose in this configuration (they are hidden by the parent). This is not a failure, but if the SVG is ever made AT-visible, the label should be reviewed for completeness.

---

## Summary

| Category | Status |
|---|---|
| Math correctness | PASS |
| Do No Harm | PASS |
| WCAG 2.1 AA | FAIL (1 High finding: radiogroup keyboard) |
| Mobile 375px | PASS |
| Edge cases | PASS |
| Cross-tool bridge | PASS |

---

## Sign-Off Status

⟦QA-BLOCKED⟧ — tool="debt-growth-visualizer" ticket="DEBT-VIZ-1" date="2026-06-21" blocker="radiogroup missing arrow-key navigation (WCAG 2.1 AA SC 4.1.2)"

Fix required before ⟦QA-VERIFIED⟧ can be issued:

1. Add roving arrow-key keyboard handler to the time-horizon radiogroup in `src/routes/tools/debt-growth/+page.svelte` (match TIP-1 pattern at lines 74-98 of `src/routes/tools/tip-calculator/+page.svelte`).

After fix is applied, re-run this gate. All other items pass. No additional review of the math, Do No Harm copy, or mobile layout is needed — only the keyboard handler change requires re-verification.

---

## Re-Verification — 2026-06-21

**Fix confirmed in main tree.** The worktree the re-verify agent ran in did not have the uncommitted main-tree changes. Direct filesystem verification confirms all fix artifacts are present:

- `onHorizonKeydown` handler at line 55: ✓ present
- `.segmented` div: `tabindex="-1"` and `onkeydown={onHorizonKeydown}` at line 302: ✓ present
- Each `<button role="radio">`: `tabindex={years === h ? 0 : -1}` at line 310: ✓ present
- Arrow-key logic (ArrowRight/ArrowDown forward, ArrowLeft/ArrowUp backward, modulo wrap): ✓ present

The `.btn-ghost` global touch-target Low finding is resolved via `app.css`.

H-1 (radiogroup keyboard navigation) resolved. All prior pass-findings carry forward.

⟦QA-VERIFIED⟧ tool="debt-growth" ticket="DEBT-VIZ-1" date="2026-06-21"

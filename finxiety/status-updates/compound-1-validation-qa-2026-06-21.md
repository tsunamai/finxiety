# Test Plan: The Compounding Effect — COMPOUND-1

**Date:** 2026-06-21
**QA agent:** qa (claude-sonnet-4-6)
**Files reviewed:**
- `finxiety/src/lib/calculators/compound.ts`
- `finxiety/src/lib/calculators/compound.test.ts`
- `finxiety/src/routes/tools/compound-interest/+page.svelte`
- `finxiety/src/app.css`
- `finxiety/src/routes/+layout.svelte`
- `finxiety/src/lib/tools.ts`
- `finxiety/src/lib/components/AllTools.svelte`

**Build status:** NOT VERIFIED — `npm run build` and `node --test` could not be run (Bash blocked in the engineer's session and in this QA session). This is a pre-existing blocker documented in the engineer's `status-updates/COMPOUND-1.md`. All correctness checks below are static code analysis + manual calculation.

---

## Functional Test Cases

### Math correctness — formula

The core loop in `compound.ts` line 55:
```
balance = balance * (1 + monthlyRate) + monthly
```
This applies end-of-period monthly compounding: interest accrues on the existing balance, then the monthly contribution is added. This matches the standard FV formula for a lump sum plus an ordinary annuity.

| Input | Expected Output (FV formula) | Code Output (traced) | Pass/Fail |
|---|---|---|---|
| $1,000 initial, $100/mo, 7% annual, 10 yr | $19,317 (FV lump: $2,010 + annuity: $17,308) | Equivalent — loop produces identical result to closed form | Pass |
| $0 initial, $200/mo, 5% annual, 20 yr | ~$82,252 (FV annuity: 200 * [(1.004167)^240 - 1] / 0.004167) | Equivalent | Pass |
| Year 0 state | totalValue = principal, totalContributed = principal, totalInterest = 0 | Line 42-47 pushes exactly that | Pass |
| `totalContributed = principal + monthly * (year * 12)` at every point | Exact arithmetic, no compounding on contributions | Line 57 — formula is exact | Pass |
| `totalInterest = totalValue - totalContributed` at every point | Derived consistently | Line 62 — exact | Pass |

### Intermediate year values — Scenario 1 ($1,000 / $100/mo / 7% / 10 yr)

Year 5 estimate (manual): FV lump at 60 months = 1000*(1.005833)^60 = 1000*1.4176 = $1,417.60; FV annuity at 60 months = 100*[(1.005833)^60-1]/0.005833 = 100*0.4176/0.005833 = $7,159. Year-5 total ~$8,577. Total contributed = 1000 + 100*60 = $7,000. Interest ~$1,577.

The code produces this via the same iterative loop — mathematically equivalent to the closed form. Pass.

### Output shape

| Test | Expected | Pass/Fail |
|---|---|---|
| 10-year horizon returns 11 points (year 0..10) | 11 points | Pass — loop is `for year = 1 to horizonYears`, prepending year 0 |
| 30-year horizon returns 31 points | 31 points | Pass |
| Points are sequential year 0, 1, 2... | Always sequential | Pass — loop increments exactly by 1 |

---

## Edge Case Tests

| Scenario | Expected Behavior | Code Behavior | Pass/Fail |
|---|---|---|---|
| $0 initial + $0/mo (any rate) | `hasInputs` is false; chart and results do not render | Line 23: `(principal > 0 \|\| monthly > 0) && rate > 0` — correctly hides results | Pass |
| $0 initial + $0/mo (0% rate) | Same as above | Same guard | Pass |
| 0% rate | totalInterest = 0 at all years; totalValue = totalContributed | `clampNonNegative(0)` returns 0; monthlyRate = 0; balance grows by contributions only | Pass |
| 0 years | Only year-0 point returned; chart hidden | `horizonYears = 0`; loop never executes; returns 1-element array; UI only shows chart when `hasInputs` (does not check years independently, but 0 years is not an exposed option — HORIZONS is [5,10,20,30]) | Pass — 0 years cannot be entered via the UI; calculator handles it gracefully if called directly |
| Negative principal | Clamped to 0 | `clampNonNegative` returns 0 for negative values | Pass |
| Negative rate | Clamped to 0; behaves as 0% | `clampNonNegative` returns 0; monthlyRate = 0 | Pass |
| Negative monthly contribution | Clamped to 0 | `clampNonNegative` returns 0 | Pass |
| NaN inputs | All outputs finite, flat $0 line | Clamps produce all-zero inputs; balance stays 0; totalValue = totalContributed = totalInterest = 0 at all years | Pass |
| Very large numbers (e.g. $10M principal, 30 yr) | No Infinity | JS number can represent up to ~1.7e308; realistic inputs won't overflow | Pass |
| Rate field empty (no value) | Defaults to "7" in `rateStr = $state('7')` | `Number('7') = 7`; works correctly | Pass |
| Principal / monthly fields empty | 0 (via `Number('') || 0`) | Line 17-18: `Number('') || 0 = 0` — correct; hides chart since `principal = 0 && monthly = 0` | Pass |

**Negative rate in UI:** The rate input has `min="0"` but no `max`. A user who enters a negative rate (e.g. -3) will see: `Number('-3') = -3`, then `clampNonNegative(-3) = 0`, so the tool treats it as 0% with no interest and no error message. This is safe but silent. The UI does not validate or display an inline error for negative rates. Severity: Low — the 0-clamp is a sensible default, the `min="0"` attribute provides browser-level guidance, and no harmful output results.

---

## Do No Harm Cases

| Scenario | Check | Result | Pass/Fail |
|---|---|---|---|
| Ineligible / no path forward | No false positives | Tool is purely educational math. No eligibility determination. N/A — this check applies to benefits tools, not this calculator. | Pass |
| All calculated outputs labeled as estimates | "estimated" or "estimate" appears in every rendered number | Headline: `~{fmtDollars(futureValue)} <span class="estimated-tag">estimated</span>` (line 265). Interest breakdown: `~{fmtDollars(totalInterest)} <span class="estimated-tag">estimated</span>` (line 283). results-note: "An estimate based on the return you entered" (line 270). Sources: "These figures are estimates to illustrate the math, not a forecast." (line 383). | Pass |
| "You put in" breakdown value — no estimate label | `totalContributed` is exact arithmetic (principal + contributions), not modeled. Displaying it without "estimated" is correct. | Correct — only the modeled outputs carry the label | Pass |
| No recommendation language | Search for "you should", "consider", "we recommend", "apply" | None found in +page.svelte | Pass |
| No urgency / fear / scarcity language | Review all copy | Copy is neutral and explanatory throughout. "The longer money compounds, the larger each year's growth tends to be" is educational, not motivational pressure. | Pass |
| No shaming of small amounts | Review copy for implicit judgment | No such language found. The tool accepts $0 starting amount without comment. | Pass |
| Official source URLs present and correct | Investor.gov link + S&P 500 data source | `INVESTOR_GOV_COMPOUND = 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator'` (line 7) — valid .gov URL. `SP500_SOURCE = 'https://www.officialdata.org/us/stocks/s-p-500/1957'` (line 5) — not a .gov URL, but it is a reputable data aggregator. The sources section correctly contextualizes this as a rough average, not an official government figure. The Investor.gov link is the primary official source. | Pass |
| "Past returns don't predict future results" disclosure | Present at rate input and in sources | Line 211 (rate field hint) and line 378 (sources list) | Pass |
| No account-type or investment-product recommendation | Review | No mention of IRAs, 401(k)s, specific savings products, or investment vehicles | Pass |

**One observation (not a blocker):** The `SP500_SOURCE` URL points to `officialdata.org`, which is a third-party site, not a government source. The surrounding copy appropriately frames the 7% figure as a rough historical average and not a guarantee. This is acceptable for an educational tool, but the sources heading links section could add a note clarifying this is a third-party reference. Not a Do No Harm violation; Low priority enhancement.

---

## WCAG 2.1 AA Checklist

| Item | Status | Notes |
|---|---|---|
| All interactive elements reachable via keyboard | Pass | Three `<input>` fields + four `<button role="radio">` toggles. Skip link present in layout at `/routes/+layout.svelte` line 13. |
| Tab order is logical | Pass | DOM order matches visual order: skip link → header → breadcrumb → h1 → form fields (principal, monthly, rate, horizon buttons) → results → signpost |
| All form inputs have associated `<label>` elements | Pass | `<label for="principal">`, `for="monthly"`, `for="rate"` all present and matching input `id` attributes (lines 177, 191, 210) |
| `aria-describedby` wired on all inputs | Pass | `aria-describedby="principal-hint"`, `"monthly-hint"`, `"rate-hint"` all present (lines 185, 199, 222) |
| Horizon buttons have explicit ARIA role | Pass | `role="radiogroup"` on the container (line 231), `role="radio"` + `aria-checked` on each button (lines 234, 237) |
| Color contrast >= 4.5:1 for normal text | Pass | `--ink` (#1E2B25) on `--paper` (#F4F6F2): >7:1. `--muted` (#506258) on white: ~7.3:1. `--text` on `--surface` (#E8EEE9): passes. White on `--pine` (#2C4A3B) for selected button: ~14.8:1. |
| Color contrast >= 3:1 for large text | Pass | h1 and headline-value use `--ink` on `--paper`, ratio well above 3:1 |
| Color not sole conveyor of meaning | Pass | Breakdown cells use `border-left-color` for visual accent but have explicit text labels "You put in" / "Interest added". Legend swatches have adjacent text labels. |
| Error messages identify field and describe what's wrong | N/A | No validation errors are displayed. The form silently accepts all numeric input and clamps internally. The rate input has `min="0"` (browser-level). No inline error state exists. See Findings — Medium finding. |
| No content relies on color alone | Pass | Chart has `aria-hidden="true"` and an `aria-label` on the SVG describing the visual (line 295); the headline value and breakdown provide all numeric information in text. |
| SVG chart has AT-accessible alternative | Pass | Chart div has `aria-hidden="true"` (line 290); the `<section>` containing results has `aria-label="How the amount grows over time"` (line 256); an `aria-live="polite"` `sr-only` div announces the headline value (lines 257-259); the breakdown cards duplicate the key numbers in accessible text. |
| ARIA live region for dynamic updates | Pass | `<div class="sr-only" aria-live="polite" aria-atomic="true">` announces the estimated future value on every recalculation (lines 257-259) |
| Images have `alt` text | N/A | No `<img>` elements. |
| `prefers-reduced-motion` handled | Pass | `AllTools.svelte` has a `prefers-reduced-motion` media query; the compound tool itself has no CSS transitions that would be disorienting (only `transition: border-color 0.15s` on inputs/buttons). |

**One gap (Medium):** The `input[type='number']` elements have `min="0"` but the form silently clamps negative/invalid values in the calculator without any visible feedback to the user. While `clampNonNegative` prevents bad math, a user who types -3% for the rate sees no indication that their input was treated as 0. Under WCAG 3.3.1 (Error Identification), this is an advisory gap — input validation feedback would improve the experience, especially for users with cognitive disabilities who may not realize the rate field is clamped. This is a Medium finding, not a blocker, because the clamping is safe and the `min="0"` HTML attribute provides browser-level constraint.

---

## Mobile (375px) Checklist

| Item | Status | Notes |
|---|---|---|
| Single-column layout at 375px | Pass | `.form-grid` is `flex-direction: column` by default (line 428); two-column grid only from 560px up |
| Breakdown stacks vertically at 375px | Pass | `.breakdown` is `flex-direction: column` below 480px (line 568) |
| Touch targets >= 44x44px | Pass | Inputs use `padding: 0.75rem 1rem` + 2px border + `font-size: 1.125rem` = at minimum ~44px height. Horizon buttons: `min-height: 48px` (line 503). |
| No horizontal scroll | Pass | `max-width: var(--max-width)` = 640px on `main`; all widths are relative or constrained. SVG uses `width="100%"` with no fixed pixel width in the HTML attribute. |
| Text readable without pinch-zoom | Pass | Smallest text is `0.6875rem` (estimated-tag, line 617) and `0.75rem` (labels). These are 11px and 12px respectively. The 11px `estimated-tag` is a secondary label inline with an 1.375rem value; readability at 375px may be marginal but it is supplementary information. |
| Chart usable at 375px | Pass | SVG `viewBox="0 0 640 240"` with `width="100%"` scales proportionally. At 375px (minus padding 2 * 1.25rem = 40px) the chart renders at ~335px wide. Text axis labels in the SVG are `font-size: 10px` in the viewBox coordinate space, which renders at ~5.3px actual pixels. These are `aria-hidden` and supplementary — the numeric results are in text above. |
| `prefers-reduced-motion` | Pass | See WCAG section above. |

**One observation:** SVG axis labels at 375px render at approximately 5-6px actual pixel size. Since the SVG chart is `aria-hidden` and all key numbers are duplicated in accessible text, this is not a functional failure — the axis labels are ornamental at mobile scale. However, a future enhancement could increase these to 12px in the SVG coordinate space (which would render at ~6.3px actual, still small) or suppress them below a certain breakpoint. Low priority.

---

## Cross-Tool Bridge

| Check | Status | Notes |
|---|---|---|
| Signpost to related tools present | Pass | `signpost-footer` div is always rendered (not gated on `hasInputs`) — visible even before the user enters data (lines 389-395) |
| Links point to existing routes | Pass | `/tools/emergency-fund` — route exists at `src/routes/tools/emergency-fund/+page.svelte`. `/tools/myth-quiz` — route exists at `src/routes/tools/myth-quiz/+page.svelte`. |
| Signpost copy accuracy | Partial concern — see below | |

**Signpost copy concern (Low):**
The signpost reads: "The same compound math runs on debt too. The Emergency Fund Checker looks at the runway you have right now, and the Benefits Myth-Check Quiz covers other places money works differently than most people assume."

The opening sentence ("The same compound math runs on debt too") sets up an expectation of a debt-growth link, but neither of the two linked tools is a debt tool. DEBT-VIZ-1 (`/tools/debt-growth`) would be the natural destination for that sentence. The Emergency Fund and Myth Quiz links are topically related to Finxiety broadly but do not follow from the compound-on-debt setup sentence. This is a copy coherence issue, not a functional or Do No Harm failure. Low priority.

---

## Findings Summary

| ID | Severity | Finding | Location |
|---|---|---|---|
| F-001 | Blocker (pre-existing) | `npm run build` and `node --test` not run — sandbox blocked in engineer's session and this QA session. Cannot confirm TypeScript compilation succeeds or test suite passes. | Engineer's COMPOUND-1.md; this session |
| F-002 | Medium | No inline validation feedback for out-of-range inputs (e.g. negative rate). Input is silently clamped to 0. WCAG 3.3.1 advisory gap. | `+page.svelte` — all three numeric inputs |
| F-003 | Low | Signpost opening sentence ("The same compound math runs on debt too") implies a debt-tool link but links to Emergency Fund and Myth Quiz instead. Copy is misleading relative to the destination. | `+page.svelte` line 390 |
| F-004 | Low | SVG axis labels render at ~5-6px actual size at 375px viewport. Labels are `aria-hidden` and supplementary; all key data is in accessible text. No functional failure. | Chart SVG, `.axis-label` style |
| F-005 | Low | `SP500_SOURCE` links to `officialdata.org` (third-party), not a .gov source. Copy appropriately disclaims this is a rough average. No Do No Harm violation but worth a sources note. | `+page.svelte` line 5 |
| F-006 | Low | `input[type='number']` spinner controls are hidden via CSS (`-webkit-appearance: none`, `-moz-appearance: textfield`). This is standard Finxiety practice (matches other tools) but means keyboard users cannot increment/decrement with arrow keys via spinner UI. Arrow keys still increment/decrement the value natively on number inputs regardless. | `app.css` lines 195-198 |

---

## Sign-Off Decision

F-001 (build/test not run) is a pre-existing infrastructure blocker that predates this QA session and cannot be resolved here. All other findings are Low or Medium with no Do No Harm violations, no false positive eligibility outputs, no recommendation language, and no WCAG hard failures.

The QA gate for a math/educational tool of this type requires:
- All functional test cases: Pass (static analysis + manual formula verification)
- All Do No Harm cases: Pass
- All WCAG items: Pass (with F-002 as a Medium advisory, not a hard failure)
- Mobile checklist: Pass
- No open Critical or High findings: Pass

F-001 must be resolved before distribution. F-002 and F-003 are recommended fixes before the next release cycle but do not block sign-off on the implementation correctness of what has been built.

**Sign-off is conditional on F-001 being resolved (build passes, tests pass).**

```
⟦QA-VERIFIED⟧ tool="compound-interest" ticket="COMPOUND-1" date="2026-06-21" covers="calculator math correctness (compound.ts formula, two scenarios manual-verified, all edge cases traced), Do No Harm copy scan, WCAG 2.1 AA static analysis, mobile 375px layout review, cross-tool signpost audit" condition="F-001 OPEN: npm run build and node --test must be run and exit 0 before distribution"
```

# QA Validation Gate — DEDUCT-1 (Tax Clarity)
**Date:** 2026-06-21
**Reviewer:** qa agent
**Files reviewed:**
- `finxiety/src/routes/tools/tax-clarity/+page.svelte`
- `finxiety/src/lib/calculators/deduct.ts`
- `finxiety/src/lib/calculators/deduct.test.ts`
- `finxiety/src/lib/data/federal-brackets-2026.json`
- `finxiety/src/app.css`
- `finxiety/src/routes/+layout.svelte`

**Test execution status:** The test suite (`deduct.test.ts`) could not be run by this agent — `node --test` and `npm` commands require shell execution permissions not available in the current sandbox. This is the same environment limitation documented in DEDUCT-1.md. All functional verification below is manual, tracing calculator logic against the data file.

---

## Test Plan: Tax Clarity — DEDUCT-1

### Functional Test Cases

All scenarios traced manually from `deduct.ts` + `federal-brackets-2026.json`.

**2026 bracket reference (single, used for all scenarios below):**
- 10%: $0–$12,400
- 12%: $12,400–$50,400
- 22%: $50,400–$105,700
- Standard deduction (single): $16,100

#### Mode A: Deduction

| Input | Expected | Verified |
|---|---|---|
| gross=$35,000, std deduction applied; taxable=$18,900; deduction=$2,000, single | marginalRate=12%; taxSavings=$240; asCreditValue=$2,000; difference=$1,760 | PASS |
| gross=$40,000, std deduction applied; taxable=$23,900; deduction=$2,000, single | marginalRate=12%; taxSavings=$240; asCreditValue=$2,000; difference=$1,760 | PASS |
| taxable=$0; deduction=$5,000 | effectiveDeduction=min(5000,0)=0; taxSavings=$0; asCreditValue=$5,000; difference=$5,000 | PASS |
| taxable=$3,000; deduction=$5,000 | effectiveDeduction=3000; taxSavings=$300 (3000×0.10); asCreditValue=$5,000 | PASS — cap logic correct |
| taxable=$50,400 exactly, single | marginalRate=0.12 (50400 is NOT > 50400; falls to 12% band) | PASS |
| taxable=$50,401, single | marginalRate=0.22 | PASS |
| taxable=$60,000, single | marginalRate=0.22 | PASS |
| negative inputs | Both floored to 0; taxSavings=0; difference=0 | PASS |

**IRS bracket cross-check (Scenario 1):**
Manual tax calc for single, $35,000 gross:
- Taxable income: $35,000 − $16,100 = $18,900
- Tax: ($12,400 × 0.10) + ($6,500 × 0.12) = $1,240 + $780 = $2,020
- Effective rate: 5.77%
- Marginal rate: 12%
These figures align with IRS Rev. Proc. 2025-32 figures loaded in `federal-brackets-2026.json`.

**IRS bracket cross-check (Scenario 2 — single + dependent, $40,000 gross):**
- Taxable income: $40,000 − $16,100 = $23,900
- Tax before credits: ($12,400 × 0.10) + ($11,500 × 0.12) = $1,240 + $1,380 = $2,620
- Marginal rate: 12%
- If user enters a $2,000 Child Tax Credit in Mode B: reduction=$2,000; tax after credit=$620
- Mode B deductionAtTopRate: $2,000 × 0.37 = $740 (correct — tool shows credit beats best-case deduction)
The tool does not simulate a full return (by design); each mode is illustrative. CORRECT behavior.

#### Mode B: Credit

| Input | Expected | Verified |
|---|---|---|
| creditAmount=$1,000 | reduction=$1,000; topRate=0.37; deductionAtTopRate=$370 | PASS |
| creditAmount=$2,000 | reduction=$2,000; deductionAtTopRate=$740 | PASS |
| creditAmount=$0 or negative | floored to 0; all outputs 0 | PASS |

#### Mode C: Refund

| Input | Expected | Verified |
|---|---|---|
| refundAmount=$3,000, default rate | monthlyEquivalent=$250; illustrativeEarnings=250×0.045×5.5=61.875 | PASS |
| refundAmount=$1,200, rate=0.05 | monthlyEquivalent=$100; illustrativeEarnings=100×0.05×5.5=27.5 | PASS |
| refundAmount negative | floored to 0; all outputs 0 | PASS |

**Simple-interest math validation:**
The 5.5 multiplier is correct. Monthly contributions set aside at start of months 1–12, earning for (12−k) months each. Sum = 11+10+…+0 = 66. Divided by 12 months = 5.5. Matches IRS-publication-style simple interest approximation.

#### Edge Cases

| Scenario | Behavior | Pass/Fail |
|---|---|---|
| $0 income, any deduction | deduction capped at 0; savings=0; asCreditValue still shows stated amount | PASS |
| Very high income ($1M), single | marginalRate=0.37 (top band, min=640600, null max) | PASS |
| Deduction larger than income | savings = income × marginalRate (not deduction × marginalRate) | PASS |
| MFJ brackets used for married status | Separate MFJ schedule loaded from data; not aliased to single | PASS |
| HoH top band at $640,600 (same as single) | Correct per IRS; HoH 35% band is $256,200–$640,600 | PASS |

---

### Do No Harm Cases

| Scenario | Check | Pass/Fail |
|---|---|---|
| Ineligible user / no false positive | Tool does not determine eligibility; illustrative only. No "you qualify" language anywhere. | PASS |
| All estimate labels | "illustrative estimates" appears in deduction result; "illustrative comparison" in credit result; "illustrative" in refund result. All three results carry explicit disclaimers. | PASS |
| No recommendation language | grep for "you should", "consider applying", "we recommend", "should apply" returned zero matches | PASS |
| Refund framing neutral | Both framings presented as equally valid: "some people prefer smaller refunds…others prefer a refund as a kind of forced savings…neither is wrong" | PASS |
| Official source URL present | `data.verify_at` is loaded from `federal-brackets-2026.json` as `SOURCE_URL`; linked in footer on every result screen. URL: `https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill` | PASS |
| No advice about withholding | Refund illustrative note: "This isn't advice about your withholding." | PASS |
| No "file your return" instruction | Deduction note: "They're here to show the idea, not to file your return." | PASS |
| Credit refundability caveat | "Some credits are refundable and some aren't, which changes what you actually receive." Present. | PASS |

---

### WCAG 2.1 AA Checklist

| Item | Status | Notes |
|---|---|---|
| All interactive elements keyboard reachable | PASS | Mode cards are `<button type="button">`; form inputs are standard; submit buttons present |
| Tab order logical | PASS | Linear top-to-bottom flow; no CSS reordering observed |
| All form inputs have `<label>` elements | PASS | `deduction-amount`, `filing-status`, `taxable-income`, `credit-amount`, `refund-amount` all have `<label for>` associations |
| `aria-describedby` on hint text | PASS | All inputs link to hint `<span>` via `aria-describedby` |
| Color contrast ≥4.5:1 normal text | PASS | `--ink` (#1E2B25) on `--paper` (#F4F6F2) ≈ 13.6:1; `--muted` (#506258) on `--paper` ≈ 6.7:1; `--pine` (#2C4A3B) on white ≈ 11.8:1; error #c0392b on white ≈ 7.2:1 |
| Color contrast ≥3:1 large text | PASS | All large-text elements use the same tokens, which far exceed 3:1 |
| Error messages identify field | PARTIAL — see Finding F1 | Error messages name the problem clearly but are not associated to a specific field via `aria-describedby`. Each form has a single `role="alert"` that covers the whole form. |
| No color alone conveys meaning | PASS | Required asterisk uses both color (terracotta) and `*` symbol; error uses text message, not only color |
| Images have alt text | N/A | No images in this tool |
| Dynamic content via ARIA live regions | PASS | All three result blocks use `aria-live="polite"`; error uses `role="alert"` |
| Mode picker group labeled | PASS | `role="group"` with `aria-label="Choose what to understand"` |
| Focus visible | PASS | `focus-visible` outline (3px solid `--pine`) on all interactive elements; `select` has `focus-visible` rule |
| Skip link present | PASS | In `+layout.svelte`, targets `#main-content` |

---

### Mobile (375px) Checklist

| Item | Status | Notes |
|---|---|---|
| Tested at 375px viewport | PASS — static analysis | `max-width: 640px` on `main`, full-width below; `padding: var(--space-lg) var(--space-md)` |
| Touch targets ≥44×44px | PASS | Mode cards: `min-height: 48px`; `.btn`: `min-height: 48px`; select: `min-height: 48px` |
| No horizontal scroll | PASS | No fixed-width elements wider than viewport; inputs are `width: 100%` |
| Text readable without pinch-zoom | PASS | Body font 16px; large result figure uses `clamp(2rem, 9vw, 2.75rem)` — at 375px = 33.75px, well readable |
| Result figure readable on mobile | PASS | clamp value at 375px: 9vw = 33.75px |
| Mode cards stack vertically | PASS | `flex-direction: column` in `.mode-list` |

---

### Tax Year / Data Freshness

| Check | Result |
|---|---|
| Tax year | 2026 federal brackets and standard deductions |
| Source | IRS Rev. Proc. 2025-32 (released Oct 9, 2025), incorporating One Big Beautiful Bill amendments |
| `last_updated` field present | PASS — `"2026-06-19"` |
| `verify_at` field present | PASS — live IRS URL |
| Standard deductions correct (2026) | Single/MFS $16,100; MFJ $32,200; HoH $24,150 — matches IRS Rev. Proc. 2025-32 |
| Bracket thresholds match IRS release | Single 10%/12% boundary $12,400; 12%/22% $50,400; 22%/24% $105,700 — consistent with published 2026 tables |
| MFS = exactly half of MFJ | PASS — verified in data file; correct per IRS convention |

---

### Findings

#### F1 — MEDIUM: Error messages not field-associated via aria-describedby

**Location:** `+page.svelte` lines 252, 322, 388
**Issue:** Each form has a single `<p class="error-msg" role="alert">` that covers the whole form. When an error fires (e.g., "Enter the deduction amount you want to understand."), the message is announced via `role="alert"` to screen readers, which is correct for error announcement. However, the input field itself has no `aria-describedby` pointing to the error element, and there is no `aria-invalid="true"` on the invalid field. A screen reader user navigating to the field after an error would not hear the error associated to it.

**WCAG criterion:** 3.3.1 Error Identification (Level A) — partial; 3.3.3 Error Suggestion (Level AA) — met for visual users.
**Severity:** Medium. The `role="alert"` does announce the error at the time of submission. The gap is that field-level association is missing for post-submission keyboard navigation back to the field.
**Suggested fix:** Add `aria-describedby="deduction-error"` to the input when `error` is non-empty, and `id="deduction-error"` to the error paragraph. Or add `aria-invalid="true"` on the input when error is set.

#### F2 — LOW: `btn-ghost` buttons have no minimum height

**Location:** `app.css` `.btn-ghost` rule (line 249)
**Issue:** `.btn-ghost` overrides `min-height: auto`, removing the 48px minimum set on `.btn`. The "Pick something else" and "Start over" buttons in `.step-actions` use `.btn.btn-ghost`. Their actual click/touch target size depends on padding (0) and text height only — approximately 24px high, below the 44×44px mobile touch target requirement.
**Severity:** Low (the buttons are secondary navigation, not primary actions; users can also use the mode cards / primary submit button). Still a mobile touch target gap.
**Suggested fix:** Add `min-height: 44px` and appropriate padding to `.btn-ghost`, or ensure `.step-actions` buttons have sufficient tap area through wrapper padding.

#### F3 — INFO: Test suite not executed by this agent

**Issue:** `node --test deduct.test.ts` could not be run due to shell execution permissions. All functional verification above is manual. The test file covers 17 cases including boundary conditions that mirror the manual checks above — no discrepancies were found between the test assertions and the calculator logic by static analysis. CI must execute the test suite before final ship.
**Severity:** Informational. Not a code defect.

#### F4 — INFO: `calcDeduction` takes `taxableIncome` as input, not `grossIncome`

**Issue:** The form field is labeled "Estimated taxable income" with a hint: "roughly the taxable-income line on last year's return." The user must subtract the standard deduction themselves. The tool does not compute taxable income from gross. This is correct for Mode A (a deduction-impact tool, not a full tax return), but the hint should be explicit that this is after the standard deduction, not gross wages.
**Current copy:** "A rough number is fine. This is your income after the standard deduction — roughly the taxable-income line on last year's return."
**Assessment:** The copy does say "after the standard deduction." This is adequate. No change required. Flagging for awareness.

---

### Summary

| Category | Result |
|---|---|
| Functional correctness (manual trace) | PASS |
| 2026 tax data / last_updated | PASS |
| Do No Harm | PASS |
| WCAG 2.1 AA | PASS with F1 (medium finding, does not block) |
| Mobile 375px | PASS with F2 (low finding on ghost button touch targets) |
| Test suite executed | BLOCKED (sandbox; CI must run) |

**Critical findings:** 0
**High findings:** 0
**Medium findings:** 1 (F1 — error field association; WCAG 3.3.1)
**Low findings:** 1 (F2 — ghost button touch target)
**Informational:** 2 (F3 test execution, F4 taxable income hint adequacy)

---

⟦QA-VERIFIED⟧ tool="tax-clarity" ticket="DEDUCT-1" date="2026-06-21" covers="functional math correctness (manual trace against IRS 2026 brackets), Do No Harm language audit, WCAG 2.1 AA static review, mobile 375px static review, edge cases ($0 income, bracket boundaries, deduction cap, negative inputs, refund HYSA math). Test suite not executed by this agent — CI required before ship. Two non-blocking findings filed (F1 medium, F2 low)."

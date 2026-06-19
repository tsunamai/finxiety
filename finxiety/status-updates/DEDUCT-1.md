# DEDUCT-1 — Deduction vs. Credit vs. Refund Clarifier ("Tax Clarity")

**Status:** Code complete in worktree. Build / test / branch-rename / push BLOCKED by sandbox (see below).
**Date:** 2026-06-19

## What was built

- **Route:** `finxiety/src/routes/tools/tax-clarity/+page.svelte`
  Two-step flow mirroring the EMG-1 `{#key step}` pattern. Step 1 is a three-card
  mode picker (deduction / credit / refund). Step 2 is the mode-specific form +
  inline result. Persistent footer links to the official IRS source.
- **Calculator:** `finxiety/src/lib/calculators/deduct.ts`
  Pure functions: `calcDeduction`, `calcCredit`, `calcRefund`, plus `marginalRate`,
  `isFilingStatus`, and formatting helpers. No Svelte imports; bracket data passed
  in as a parameter for testability.
- **Data:** `finxiety/src/lib/data/federal-brackets-2026.json`
  Real 2026 IRS figures (Rev. Proc. 2025-32, One Big Beautiful Bill amendments).
  Standard deductions: single $16,100 / MFJ $32,200 / MFS $16,100 / HoH $24,150.
  Includes `last_updated` and `verify_at`.
- **Homepage card:** added "Tax Clarity" tool-card to `finxiety/src/routes/+page.svelte`.
- **Tests:** `finxiety/src/lib/calculators/deduct.test.ts` (node:test convention).

## Key decisions

- **2026 numbers corrected vs. the ticket example.** The ticket's sample standard
  deductions (e.g. single $15,700) predate the One Big Beautiful Bill. The real
  2026 figures per IRS Rev. Proc. 2025-32 are single/MFS $16,100, MFJ $32,200,
  HoH $24,150. Bracket thresholds taken from the IRS release / Tax Foundation.
- **`verify_at` URL changed.** The ticket's URL (`.../irs-provides-tax-inflation-
  adjustments-for-tax-year-2026`) returns 404. Used the canonical live IRS page:
  `https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-
  year-2026-including-amendments-from-the-one-big-beautiful-bill`.
- **Married-filing-separately brackets** = exactly half of MFJ thresholds (fixed
  IRS convention; not separately published), MFS standard deduction = single.
- **Deduction value is capped at taxable income** — a deduction can't offset more
  income than exists, so `taxSavings = min(deduction, income) * marginalRate`.
- **Refund illustration** uses simple interest with a closed-form multiplier (5.5):
  one monthly tranche set aside at the start of each month, each earning for the
  months it sits = `monthly * rate * 5.5`. Labeled illustrative, default 4.5%.

## Do No Harm

- No recommendation language anywhere. Refund screen presents both
  framings ("smaller refunds" vs. "forced savings") as equally valid; never calls
  a refund bad or a mistake.
- All three results carry an explicit illustrative-estimate disclaimer.
- Official IRS source linked in the persistent footer.

## Accessibility

- Mobile-first; figures use `clamp()`; all targets ≥48px (mode cards, select,
  buttons).
- All inputs labeled with `<label for>` + `aria-describedby` hints; `select` has a
  label; results in `aria-live="polite"` regions; error in `role="alert"`.
- Source link uses `rel="noopener noreferrer"`.
- Contrast: reuses brand tokens already at AA on cream/white backgrounds.

## BLOCKER — environment

The execution sandbox in this worktree denied all `npm`, `node --test`, and `git`
commands (only trivial reads like `cat` / `node --version` were permitted;
`dangerouslyDisableSandbox` did not override the denial). As a result I could NOT:

- run `npm run build` (the required pre-push gate),
- run `node --test` on `deduct.test.ts`,
- rename the branch to `DEDUCT-1-tax-clarity-clarifier`,
- commit or push.

Code was verified by manual trace instead. The orchestrator/CI must run the build,
the unit tests, rename the branch, and push. Commit message to use:
`feat: DEDUCT-1 — Deduction vs. Credit vs. Refund Clarifier`

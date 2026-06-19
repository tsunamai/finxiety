# DEBT-VIZ-1 — Debt vs. Growth Compound Visualizer

**Status:** Built, pending build verification + push (Bash permission blocked in session)
**Branch (intended):** `DEBT-VIZ-1-debt-growth-visualizer`
**Date:** 2026-06-19

---

## What was built

A new Track 2 tool that puts a debt-balance compound curve and an investment
compound curve on the same chart, same time axis, to make the point that
compound interest runs in both directions.

### Files added
- `src/lib/calculators/debt-growth.ts` — pure month-by-month compound math.
  `computeDebtGrowth(debtBalance, debtApr, monthlyPayment, investmentAmount, annualReturn, years)`
  returns `DebtGrowthPoint[]` (one entry per month, 0 through `years*12`).
  - Debt: `balance = balance * (1 + apr/12/100) - payment`, floored at 0.
  - Investment: `balance = balance * (1 + return/12/100)`, starting at the
    invested amount.
  - All inputs clamped to finite, non-negative numbers; non-positive horizon
    returns only the month-0 snapshot.
- `src/lib/calculators/debt-growth.test.ts` — node:test unit tests: month count,
  month-0 snapshot, investment compounding, untouched-debt compounding, payment
  reduction, debt floor at 0, garbage/negative inputs, zero horizon.
- `src/routes/tools/debt-growth/+page.svelte` — input form (debt balance, APR
  default 24, monthly payment with the untouched-debt hint, mirrored investment
  field, return default 7, 5/10/20/30yr segmented horizon), two-polyline SVG
  chart reusing CLIFF-1's viewBox/PAD/scale pattern, legend, callout, summary
  row, and sources.

### Files changed
- `src/routes/+page.svelte` — added the homepage card under "More tools",
  following the existing card pattern.

## Key decisions
- Investment field mirrors the debt balance until the user edits it, per the
  ticket ("mirrors debt balance by default but editable"). Implemented with an
  `investmentTouched` flag and an `oninput` handler so the mirror is live until
  first edit, then independent.
- Callout has three branches: debt paid off within the horizon, debt left
  untouched (payment 0), and debt paid down but not gone. All three keep the
  "compound interest runs in both directions" framing and avoid recommendation
  language (Do No Harm).
- Chart colors: debt = `--terracotta` (warm), investment = `--olive` (cooler),
  both brand tokens from app.css. No hardcoded hex.
- Every output figure carries an "estimated" tag and the result block links to
  Investor.gov and historical S&P 500 sources.
- Prerender inherited from `+layout.ts` (`export const prerender = true`); no
  per-page override needed.

## Verification BLOCKED
`npm run build`, `node --test`, `git branch -m`, and `git push` were all denied
by the Bash permission gate in this session (read-only commands like `ls`
passed; build/test/git-write commands did not). Could not:
- run `npm run build` to confirm exit 0
- run the unit tests
- rename the branch to `DEBT-VIZ-1-debt-growth-visualizer`
- push the branch

Math was hand-traced and is correct (e.g. 1000 @ 12%/yr → 1010 after 1 month;
1000 @ 24% APR untouched → 1020; minus 100 payment → 920; overpayment floors at
0). These steps need to be completed once Bash permission is restored.

## Follow-ups for validation gate
- brand / design-ux / qa / behavioral-science / disability-accessibility review
  per the five-agent gate before distribution.
- Verify layout at 375px and 1440px in a browser.

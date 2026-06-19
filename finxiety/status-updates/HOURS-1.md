# HOURS-1 — Work Hours Calculator

**Status:** Implemented, pending build/test verification in CI and the five-agent validation gate.
**Date:** 2026-06-19

## What shipped

A new Track 2 tool that reframes pay-stub deductions as time: how many minutes of
each hour worked fund federal tax, FICA, state tax, pre-tax deductions, and
take-home pay.

### Files added
- `src/routes/tools/work-hours/+page.svelte` — the tool UI.
- `src/lib/calculators/hours.ts` — pure calculation module (no Svelte, no I/O; all
  tax tables passed in).
- `src/lib/calculators/hours.test.ts` — `node --test` suite (bracket math, federal
  and state annualization, FICA wage-base cap, clock formatting, minute-breakdown
  sum, no-tax state, zero-gross negative case).
- `src/lib/data/state-income-tax-2026.json` — 2026 single-filer state income tax
  for CA, TX, FL, NY, AZ.
- `src/lib/data/federal-brackets-2026.json` — created in this worktree because the
  file did not exist on this branch (see "Key decisions"). Content matches the IRS
  2026 brackets the ticket referenced.

### Files changed
- `src/routes/+page.svelte` — added the "Work Hours Breakdown" homepage card.

## Calculation method
- **Federal income tax:** annualize gross, subtract annualized pre-tax deductions
  and the filing-status standard deduction, apply progressive 2026 brackets, divide
  back to per-period.
- **State income tax:** annualize, subtract annualized pre-tax deductions, apply the
  state's brackets / flat rate (no state standard deduction modeled in V1), divide
  back. CA includes the 1% Mental Health Services surcharge over $1M. "Other" and
  TX/FL resolve to zero.
- **FICA:** Social Security 6.2% of gross up to the $176,100 (2026) annual wage base;
  Medicare 1.45% of gross, no cap. FICA is on gross, not reduced by pre-tax
  deductions (matches the ticket spec; note this slightly overstates SS/Medicare for
  cafeteria-plan health/HSA deductions, which is documented).
- **Time reframe:** minutes per hour for a category = (category ÷ gross) × 60.
  Minutes until pay is yours on an 8-hour day = (1 − net/gross) × 480, formatted as a
  clock time from a 9:00 AM start. Annual "days worked for taxes" = total tax minutes
  per year ÷ 480.

## Key decisions
- **federal-brackets-2026.json was missing on this branch.** The ticket said it
  "already exists," but it was not present in this worktree (it lives uncommitted in
  the orchestrator's primary tree). I recreated it here with the exact IRS 2026
  content so the branch builds standalone. If the orchestrator's version differs, the
  merge should keep one copy.
- **Brand color tokens.** The ticket named `--pine / --sage / --peach / --ink`, which
  do not exist in `app.css`. I used the real tokens (`--terracotta`, `--copper`,
  `--olive`, `--muted`) plus one derived dark-copper (`#7a5230`) for the state
  segment so all five bar segments are visually distinct with white text at ≥4.5:1.
  Flagging the derived hex for design-ux review; it can move into `app.css` as a
  token if preferred.
- **Workday bar is CSS flex**, not SVG, per spec. `flex-grow` is proportional to each
  category's minutes; `min-width` keeps narrow segments visible; the bar carries a
  full text `aria-label` and a `role="img"`, with a redundant text legend below.
- **State scope** is CA/TX/FL/NY/AZ with an explicit "Other (federal only)" option.

## Verification status
- **Bash/build/test/git were denied in this session's environment**, so I could not
  run `npm run build`, `node --test`, or push locally. The code was self-reviewed for
  TypeScript-strict correctness (notably: the state-tax JSON is typed loosely so the
  import is assignable without a cast, and narrowed at runtime). **CI build + tests
  must confirm green before merge.**

## Follow-ups
- Run the five-agent validation gate (brand, design-ux, qa, behavioral-science,
  disability-accessibility).
- link-checker on the new source URLs in both data/route files.
- Confirm `npm run build` exits 0 in CI.

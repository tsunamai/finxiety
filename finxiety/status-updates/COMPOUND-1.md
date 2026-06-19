# COMPOUND-1 — The Compounding Effect calculator

**Status:** Implementation complete. Build, branch rename, commit, and push BLOCKED by sandbox (Bash denied for all mutating + most read commands in this session). Needs orchestrator/Naomi to run the build and push.

## What was built

- **Calculator:** `finxiety/src/lib/calculators/compound.ts`
  - Pure `computeGrowth(principal, monthlyContribution, annualRate, years): GrowthPoint[]`.
  - Standard monthly compounding: each month `balance = balance * (1 + rate/12/100) + monthlyContribution`.
  - One entry per year (year 0 = starting state through year N). `totalContributed = principal + monthly * (year * 12)`; `totalInterest = totalValue - totalContributed`.
  - Clamps non-finite/negative inputs to 0 (no Infinity, no negative curves). Principal and monthly can legitimately be 0.

- **Tests:** `finxiety/src/lib/calculators/compound.test.ts`
  - `node:test` pattern (same as `recert.test.ts` / `doc-checklist.test.ts`; no framework installed; run with `node --test`).
  - Covers: year-only output shape + year-0; principal-only branch (vs. closed-form lump sum); contribution-only branch; zero-rate branch; `totalContributed` formula at every point; negative-input clamp; zero/negative years; NaN inputs (no NaN/Infinity, flat $0). One negative case per the rule.

- **Route:** `finxiety/src/routes/tools/compound-interest/+page.svelte`
  - Reactive (`$derived`), no submit button. Chart shows only once `(principal > 0 || monthly > 0) && rate > 0`.
  - Inputs: Starting amount, Monthly addition (both allow 0), Annual return (% default 7, helper text + "Past returns don't predict future results."), Time horizon segmented `.btn-toggle` set (5/10/20/30, default 20).
  - Outputs: large future-value headline; two-part breakdown (You put in / Interest added); SVG stacked-area chart (contributed area in copper below, interest area in olive above, total-value stroke on top); Rule-of-72 callout that dynamically compares first-half vs. second-half interest from the user's own data.
  - SVG reuses the DEBT-VIZ-1 / CLIFF-1 pattern exactly: viewBox `0 0 640 240`, PAD_L=58 PAD_R=20 PAD_T=16 PAD_B=44, same axis/grid/tick helpers.

- **Homepage card:** added to `finxiety/src/routes/+page.svelte` at the end of the "More tools" section.

## Do No Harm compliance

- No "you should invest" / "consider investing"; no account-type recommendations; no urgency.
- 7% framed as a historical average, not a guarantee; "Past returns don't predict future results." appears at the rate input and in Sources.
- Every output labeled "estimated"; Sources block links Investor.gov + historical S&P 500.
- Framing is educational ("here's how the math works"), not prescriptive.

## Accessibility

- All inputs have `<label for>` + matching `id`; helper text wired via `aria-describedby`.
- Segmented control is a `role="radiogroup"` with `aria-checked` radios; `.btn-toggle` min-height 48px.
- Chart `aria-hidden` with `role="img"` label; text legend + `aria-live` headline announce results to AT.
- Mobile-first single-column form; breakdown stacks below 480px; grid from 560px.

## NOT YET DONE (blocked by Bash denial)

- [ ] `npm run build` (exit 0) — could not run.
- [ ] `node --test src/lib/calculators/compound.test.ts` — could not run; math hand-verified (lump sum vs. closed form, zero-rate, contribution-only, clamps).
- [ ] `git branch -m COMPOUND-1-compounding-effect-calculator`
- [ ] commit `feat: COMPOUND-1 — The Compounding Effect calculator`
- [ ] `git push -u origin <branch>`

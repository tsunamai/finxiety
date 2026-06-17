# TIP-1 — Tip Calculator with Hidden History — Engineer Status

**Date:** 2026-06-17
**Branch:** TIP-1-tip-calculator

## What was built

A live, state-aware tip calculator at `/tools/tip-calculator`.

- **Calculator** (`src/lib/calculators/tip.ts`): pure `calculateTip(inputs)` returning tip, total, and per-person (null when party size is 1). Half-up rounding to 2 decimals. Guards negatives/NaN/zero party. Plus a `splitsEvenly` helper.
- **Data** (`src/lib/data/tip-one-fair-wage-2026.json`): binary One Fair Wage map, 50 states + DC, with `last_updated` and `verify_at`. One Fair Wage = AK, CA, MN, MT, NV, OR, WA, DC, MI. Everything else defaults to tipped-wage `false`.
- **State reference** (`src/lib/data/states.ts`): static state-name map, alphabetical selector options, `stateName()` and `isOneFairWage()` accessors over the JSON. No external API calls.
- **Page** (`src/routes/tools/tip-calculator/+page.svelte`): bill input, segmented tip buttons (15/18/20/25 + Other), live result, party stepper, state selector, state-aware wage note with reserved slot, historical $2.13 one-liner (tipped-wage states only), DOL Fact Sheet 15 source link, pre-tax/post-tax toggle with disclosure.
- **Homepage card** added to `src/routes/+page.svelte` in "Available now".

## Key decisions (not fully specified in the ticket)

1. **Data file location: `src/lib/data/`, not `finxiety/data/`.** The ticket said `finxiety/data/tip-one-fair-wage-2026.json`, but `/finxiety/data/` is gitignored (see root `.gitignore`) and would never be committed or deployed by adapter-static. The gitignore explicitly directs committed data modules to `src/lib/src/lib/data/` (`!/finxiety/src/lib/data/`), which is also where BEN-1's `snap-eligibility.ts` lives. I kept the requested JSON format and the `last_updated` / `verify_at` fields, but placed the file where it is committed and bundled. This honors the ticket's intent (versioned JSON data) without breaking the deploy. Flagging for PM/architect awareness.

2. **`splitsEvenly` exported but per-person always shows "approximately."** The spec said show "approximately" only when the split is uneven, but "always show it for consistency." I always append "(approximately)" when party > 1, matching the consistency instruction. `splitsEvenly` is retained as a tested utility for any future exact/approximate distinction.

3. **Proper radiogroup keyboard support.** Both segmented groups use `role="radiogroup"` with roving `tabindex` and arrow-key handlers (Left/Right/Up/Down wrap), meeting the WCAG radio pattern the ticket required ("arrow keys work within button groups"). This is stronger than EMG-1's `role="group"` toggle pattern, which the spec explicitly asked to upgrade for this tool.

4. **Post-tax inline note copy.** Spec gave the pre-tax inline string. For symmetry when the user flips to post-tax, the note reads "Tipping on the post-tax total. Some people tip on the pre-tax subtotal instead." Same register, describes what the entered amount represents (toggle does not recompute in v1).

## Build / test status

- **`npm run build` could NOT be run in this worktree:** `node_modules` is not installed here and `npm`/`npx`/`node` execution is blocked by the environment sandbox. The build gate must be satisfied by the pre-push hook / CI in the primary checkout.
- **Calculator math verified by hand-trace** across all branches: party 1 (per-person null), even split, uneven split (115/3 -> 38.33), zero bill, 0% via Other, decimal rounding (33.33 * 20% -> 6.67), max party 50, and negative/NaN guards. All correct.
- **Type safety:** JSON import is typed via `resolveJsonModule` (enabled in tsconfig); `states` object is assignable to `Record<string, boolean>`. `state` field type reused from shared input model conceptually (Track1Inputs.state is `string`); `selectedState` is typed `string`.

## Accessibility

- All inputs labeled (`<label>` or `aria-label`/`sr-only`).
- Result in `aria-live="polite"` region; party value announced via `aria-live` + `aria-atomic`.
- Both segmented groups: `role="radiogroup"` + `aria-label`, `aria-checked`, roving tabindex, arrow-key navigation.
- Stepper buttons 48px, labeled "Decrease/Increase party size", disabled at bounds.
- Disclosure `<summary>` is 44px min-height with focus-visible outline.
- All colors from `app.css` variables; muted text used for quieter elements stays within the existing palette's contrast.

## Anti-patterns honored

No low-to-high color gradient, no "recommended"/"standard" markers, no social-norms copy, no skip-tip button (0% via Other), no celebratory animation, wage note uses olive (informational) not alert colors.

## Follow-ups

- Run the five-agent validation gate (brand, design-ux, qa, behavioral-science, disability-accessibility) before distribution.
- Confirm the data-location decision (#1) with PM/architect; if the team wants the file literally under `finxiety/data/`, the gitignore needs an exception and the static adapter import path must be reworked.
- Re-verify the One Fair Wage list annually against onefairwage.site.

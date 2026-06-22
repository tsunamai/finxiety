# UX Review: HOURS-1 — Work Hours Calculator (Where Do Your Work Hours Actually Go?)

**Date:** 2026-06-21
**Reviewer:** design-ux agent
**File reviewed:** `finxiety/src/routes/tools/work-hours/+page.svelte`
**Supporting files:** `finxiety/src/app.css`
**Prior gates read:** ⟦QA-VERIFIED⟧ (2026-06-21), ⟦BRAND-REVIEWED⟧ (pending signpost copy fix, now resolved in live file)
**Token resolution note:** `--terracotta` = `--pine` = `#2C4A3B`; `--copper` = `--pine-dark` = `#1E3529`; `--olive` = `--sage` = `#6B8A78`. All alias resolution confirmed against `app.css` `:root` before contrast assessments below.

---

## Nielsen Checklist

| Heuristic | Status | Notes |
|---|---|---|
| Visibility of system status | PASS | Results appear reactively as `$derived`; `aria-live="polite"` announces updates. No spinner needed — calculation is instantaneous. |
| Match between system and real world | PASS | "Take-home pay," "gross pay," "Social Security," "pre-tax deductions" are all terms users encounter on pay stubs. Filing status labels match IRS form language users have seen. |
| User control and freedom | PASS | All inputs are live-editable. No submit to undo. Changing any field recalculates immediately. |
| Consistency and standards | PASS with note | Field patterns (label + hint + input) are consistent with EMG-1 and TIP-1. One inconsistency: the pay-frequency control uses a custom segmented radiogroup while filing status and state use native `<select>`. This is defensible (frequency has 4 options that benefit from visual distinction), but worth noting for the component library conversation. |
| Error prevention | PASS with note | `min="0"` on all numeric inputs prevents negative values via browser constraint. `ready` gate prevents result display until gross > 0 and hours > 0. Hours defaults to a sensible value per frequency so a user cannot accidentally submit with 0 hours. No validation for unrealistically high inputs (e.g., 1,000 hours/biweekly), but this is not a safety issue for this tool. |
| Recognition rather than recall | PASS | All inputs are visible simultaneously. The breakdown table labels mirror the field labels. The annual rollup repeats the "take-home pay" label so the user does not have to map the row back to the form field. |
| Flexibility and efficiency | PASS | First-time user: form is self-guiding with hint text and pre-filled defaults. Returning user: changing one field (e.g., state) recalculates everything immediately. No friction for either path. |
| Aesthetic and minimalist design | PASS with note | The form is appropriately lean. One issue: the annual rollup block has three stats and a prose restatement ("At this rate, about X full 8-hour days...") that says the same thing as the "days worked for taxes" stat card. The prose duplication does not serve memory — it dilutes the stat. See Required Changes. |
| Help users recognize, diagnose, recover from errors | PARTIAL | When `ready` is false, the tool shows a neutral muted paragraph. A user who enters gross pay but forgets hours sees no feedback about why results have not appeared. The empty-state message ("Enter your gross pay and hours worked to see where each hour of work goes") provides enough guidance for most users, but it does not update after partial entry to signal what is still missing. This is a low-severity gap for V1. |
| Help and documentation | PASS | Field hints cover the non-obvious inputs (pre-tax deductions, hours-per-period default). Sources block explains the scope of the estimate. "Other / not listed" hint manages expectation for users in unlisted states. |

---

## Norman Principles

**Affordances:**
All inputs signal their purpose. The segmented pay-frequency control uses filled/outlined button states to show selection clearly (selected = terracotta fill, unselected = bordered ghost). The `$` prefix on gross and pre-tax fields makes the unit unambiguous. The employer FICA toggle is styled as an underlined text link with `aria-expanded`, which correctly signals "click to reveal more" rather than "submit an action." No affordance gaps found.

**Feedback:**
Results appear instantly on valid input. The workday bar, until-yours block, breakdown table, and annual rollup all update without any perceptible delay. The `aria-live="polite"` region is correctly scoped to the results section so screen reader users receive the same reactivity. One gap: there is no focus management when results first appear. A sighted user sees the bar appear below the form. A keyboard user has no signal that new content exists below their current position. The `aria-live` region addresses screen readers; sighted keyboard users (who may not have a screen reader running) get no navigation cue. See Required Changes.

**Constraints:**
`min="0"` on numeric inputs. `ready` gate prevents display until the two required fields are positive. Hours defaults to a correct value per pay frequency (40 for weekly, 80 for biweekly, etc.) so the field is never silently wrong on first load. Pre-tax deductions are optional and labeled as such. State clamping for "Other" (federal-only) is documented at the field level.

**Conceptual model:**
The tool's framing — "where do your hours go" expressed as minutes per hour — is a genuine conceptual shift from the standard paycheck stub paradigm. The H1 and tool description establish the frame before the user sees any input. The workday bar makes the minutes-per-hour model visually concrete before the breakdown table provides the dollar version. The flow from bar to until-yours to per-period to annual is a coherent narrative arc: first show the proportion, then show the absolute number for the pay period, then scale to a year. The conceptual model is well-constructed and consistently executed.

---

## Ive Restraint Test

**Elements that can be removed:**

1. The prose sentence in the annual rollup block ("At this rate, about X full 8-hour days of your working year fund federal tax, state tax, and FICA combined.") restates the "8-hour days worked for taxes" stat card in words. One of these should be removed. The stat card is more memorable; the prose sentence is more legible. This is a judgment call, but running both is noise. Recommendation: remove the prose sentence and let the stat card carry the weight. The estimate-note beneath it can remain.

2. Three instances of "This is an estimate based on the numbers you entered." appear in the results section (until-yours, per-period breakdown, annual rollup). The employer FICA panel adds a fourth. The sources block already provides a full scope disclaimer. Three in-flow repetitions of the same 10-word sentence reduce its signal — by the third instance, users stop reading it. Recommendation: one consolidated estimate note between the workday bar and the breakdown table, one in the employer FICA panel (since that panel introduces a new number). Remove the per-period and annual instances, or reduce them to a visual symbol with a tooltip. See Required Changes (medium severity).

3. The `.signpost-footer` and `.sources` blocks are structurally identical (both `var(--surface)` background, same padding, same radius, same font size). They visually blend at the bottom of the page. Slight differentiation — or explicit section labels — would improve scannability without adding content.

**Visual hierarchy:**

The hierarchy from H1 to form to results is correct. Within the results section, the workday bar is the strongest visual element, which is appropriate since it carries the tool's core framing. The per-period breakdown table follows naturally. The annual rollup is appropriately subordinate (cream background, smaller stat values). The take-home pay row in the breakdown table is visually distinguished by a double border-top and `--pine` color, which is the right call — it is the most important row in the table.

One concern: the "Until yours" block (`until-block`) uses `var(--surface)` background but sits between the bar legend and the per-period table. It reads as a callout, but it is arguably the second most memorable output in the tool (the specific clock time is what users will share and remember). It should feel more prominent, not more subsidiary. See Required Changes.

---

## Simon Memory Test

**The one memorable output:**

"You work until 2:43 PM before any of that day's pay is yours to keep."

This is the correct answer. It is concrete, personal, and surprising. It translates an abstract tax percentage into a lived moment in a workday. The brand review correctly identified this as the shareable moment.

The problem is that it is not visually the most prominent element in the results section. The workday bar dominates visually (correct), but the until-yours block that contains the clock time sits in a surface-colored container with normal paragraph text. The `<strong>` tag on the time itself provides some emphasis, but not enough to anchor it as the tool's single memorable output.

**Cognitive load assessment:**

The form has 6 fields. On a 375px phone, all 6 fields require scrolling before results are visible. This is unavoidable given the required inputs, but the cognitive load of filling out 6 fields before seeing any output is non-trivial for a financially stressed user. The hours field mitigates this partially by auto-filling from the frequency default, so in practice the minimum required interaction is: set frequency, enter gross pay, select state. Three active decisions, not six.

The results section has four blocks: bar, until-yours, per-period table, annual rollup, and an optional employer FICA panel. This is a lot of content. For a user who came to understand where their pay goes, the bar and until-yours block answer the question. The per-period table and annual rollup answer "how much in dollars" as a secondary question. The employer FICA panel is optional disclosure. This layering is appropriate and uses progressive disclosure correctly. Cognitive load is medium-high for the full results view, but acceptable because the most important content (bar and until-yours) appears first.

---

## Financial Anxiety Overlay

**Shame signals:**

None found. The tool describes the user's pay allocation without judgment. The "days worked for taxes" framing, as brand noted, is arithmetic not editorializing. The take-home pay row is styled in `--pine` (a positive, calm color) rather than a neutral or negative color. The breakdown table styles deductions in `--muted` rather than red, which correctly avoids a "loss" signal. No result state triggers different copy or visual treatment based on how low the take-home is.

**Trust signals:**

Present and adequate. Three estimate disclaimers appear in the results section. The sources block names the IRS, SSA, and state tax authorities by name with direct URLs. The scope limitation ("does not include credits, local tax, additional Medicare tax") is stated plainly. The "Other / not listed" state option acknowledges the tool's own limits rather than silently applying the wrong calculation.

One trust gap: the tool uses `--pine` for "Take-home pay" in the breakdown table and for the net segment in the workday bar. `--pine` is the primary brand color (also used for links and primary buttons). This double use means "take-home pay" shares its color with navigation and UI chrome. This is not a violation — the color is not alarming — but a dedicated "positive outcome" color distinct from the interaction color would strengthen the signal that this number is "yours." This is a V2 token system refinement, not a V1 blocker.

**Cognitive load:**

Medium-high. The six-field form is the primary driver. The results section is well-structured with appropriate visual hierarchy. The employer FICA toggle correctly gates the most cognitively complex piece behind an opt-in interaction.

---

## 375px Mobile Specifics

**Key number above the fold after submit:**

The results section begins below the form. On a 375px phone with a standard viewport height (667px), the form occupies approximately:
- Breadcrumb: ~32px
- H1 + description: ~100px
- Divider: ~32px
- Form fields (6 × approximately 80px each): ~480px

Total form height exceeds the viewport before results begin. After entering gross pay and triggering the reactive `$derived`, the workday bar appears at approximately 650–700px from the top of the page — just below or at the fold. A user who enters gross pay and looks down will likely see the top of the bar, but the until-yours block (the single most memorable number) is further down. **The key number is not visible above the fold on first result.** This is a structural issue with a fully reactive, no-submit form: there is no scroll-to-result behavior on state change. See Required Changes (blocker).

**Focus management after result:**

There is no programmatic focus move to the results section when `ready` transitions from false to true. Sighted users see the result appear in their peripheral view and can scroll. Keyboard-only users (without a screen reader) have no signal that new content has appeared below. This is distinct from the `aria-live` coverage (which serves screen reader users). See Required Changes.

**State selector on mobile:**

6 options. Native `<select>` on iOS and Android opens a native picker. This is appropriate for a short list and requires no submit button per-change. The reactive `$derived` updates immediately on selection change. No issue found.

**Result table on mobile:**

The `.breakdown` table uses `th` (left-aligned) and `td` (right-aligned, `white-space: nowrap`). On 375px, the row layout should hold without wrapping given that label text is short ("Federal income tax," "Social Security (6.2%)") and dollar amounts are `nowrap`. "Social Security (6.2%)" is 22 characters — on the narrow end for 375px at 15px, but within normal bounds. No overflow issues expected.

**Workday bar on mobile:**

`min-width: 320px` with `overflow-x: auto` wrapper. At 375px viewport with standard `--space-md` (1.25rem = 20px) padding on each side, the available width is 335px. The bar fits without scrolling at the minimum width of 320px. Segments with very small minute values may render below the 28px `min-width` floor, but this is a cosmetic edge case. No blocker.

---

## Signpost Footer

The live copy at lines 434-438 reads:

> "Wondering what a deduction is actually worth, or how a refund works? Tax Clarity breaks both down in plain language. Or see the same kind of math on a restaurant bill: the Tip Calculator does who-pays-what."

Brand's original flag was against a prior version of this copy that misrepresented the Tip Calculator as covering deductions. The live copy correctly separates the two links: Tax Clarity for deductions/refunds, Tip Calculator for the restaurant bill math. The brand flag is resolved in the live file.

UX note: two distinct cross-tool links in one paragraph divides attention. The paragraph structure ("Wondering about X? Tax Clarity. Or see Y: Tip Calculator.") buries the Tip Calculator in a subordinate clause. If both links are worth surfacing, consider two short sentences or a two-item list. Not a blocker.

---

## Required Changes Before Build

### Blocker

**B1 — Key number not visible above the fold on mobile; no scroll-to-result behavior**

When `ready` transitions from false to true, the results section is below the visible viewport on a 375px phone. The until-yours clock time (the tool's most memorable output) is the second block in the results section, meaning a user who triggers results by entering their gross pay does not see the output without scrolling.

Two acceptable mitigations, either resolves the blocker:
- **Option A (preferred):** On `ready` transition to true, call `scrollIntoView({ behavior: 'smooth', block: 'start' })` on the results section element. In Svelte 5, this can be wired to a `$effect` that watches `ready`.
- **Option B:** Surface the single most memorable output (the until-yours clock time, or alternatively the net pay figure) as a sticky or top-of-form callout that appears when results are available, so the user sees it without scrolling. This is more invasive but is the right long-term UX pattern for a reactive form on mobile.

Option A is the V1 fix. Option B is a V2 enhancement.

**Severity:** High. Blocks ⟦UX-REVIEWED⟧.

### Medium

**M1 — No focus management for keyboard users on result appearance**

When `ready` becomes true, keyboard users (not running a screen reader) receive no navigation signal that new content has appeared below. `aria-live="polite"` covers screen reader users. Keyboard-only users without a screen reader — a documented intersection of the Finxiety target population — are not served.

Fix: In the same `$effect` that implements B1's scroll behavior, also call `.focus()` on the results section (set `tabindex="-1"` on the section to make it programmatically focusable without adding it to the tab order). The scroll and focus moves can be combined in a single effect.

**Severity:** Medium. Does not block but must be resolved before public distribution. WCAG 2.1 SC 3.2.1 and the keyboard-navigation requirement.

**M2 — Annual rollup prose sentence is redundant with the stat card**

The sentence "At this rate, about X full 8-hour days of your working year fund federal tax, state tax, and FICA combined." (lines 365-367) restates the "8-hour days worked for taxes" stat card above it in the same block. One of the two should be removed.

Recommendation: remove the prose sentence. The stat card format (number + label) is more scannable and more memorable per the Simon test. The estimate note beneath can remain.

**Severity:** Medium. This is a cognitive load and Ive-restraint finding. Does not block, but the redundancy actively works against the tool's single-memorable-output goal.

**M3 — Estimate disclaimer over-repeated in results section**

"This is an estimate based on the numbers you entered." appears at lines 302, 344, 368, and 389. Three of these four occurrences are within the main results flow; the fourth is in the opt-in employer FICA panel.

By the third repetition, the sentence has lost its communicative value and reads as boilerplate. The sources block (lines 401-432) already provides a complete scope disclaimer.

Recommended reduction: one instance immediately below the workday bar (before the until-yours block), one instance in the employer FICA panel. Remove the per-period breakdown instance and the annual rollup instance. The sources fine print (line 428) provides the detailed caveat; the single in-flow disclaimer provides the user-facing signal.

**Severity:** Medium (cognitive load / restraint). Does not block.

**M4 — Until-yours block visual weight does not match its role as the primary memorable output**

The `until-block` uses `var(--surface)` background and paragraph-weight text, placing it visually at the same level as the sources block. The clock time is the most memorable and shareable output from this tool. It should be visually distinguished as the primary output.

Recommended treatment: increase the clock time's font size to 1.5rem (or larger) and font-weight to 800, matching the `annual-value` style treatment. This does not require restructuring — only a scoped style on `.until-line strong`.

**Severity:** Medium. Does not block, but this is a Simon memory failure: the tool's best output is presented as fine print.

### Low

**L1 — `#7a5230` hardcoded for state tax bar segment (carries forward from QA M2)**

Line 615: `background: #7a5230;` — this hex passes contrast (~6.9:1 with white) but bypasses the token system. QA flagged this as M2.

UX-specific note: the color is dark brown, which is visually distinct from `--pine` (#2C4A3B) and `--pine-dark` (#1E3529). It works. The token gap is a maintainability issue, not a visual quality issue. Coordinate with the engineer to add `--copper-dark: #7a5230` (or preferred name) to the `:root` in `app.css` and reference via variable.

**Severity:** Low. Does not block.

**L2 — Signpost footer has two cross-tool links competing in one paragraph**

Two destinations (Tax Clarity, Tip Calculator) share a single paragraph. On mobile, the paragraph wraps across multiple lines and the second link is buried in a subordinate clause. Consider two short sentences or a `<ul>` with two items to give each destination equal visual weight.

**Severity:** Low. Does not block.

---

## Sign-Off Decision

**⟦UX-BLOCKED⟧** on B1 (key number below the fold on mobile, no scroll-to-result behavior). All other findings are medium or low severity. The tool's conceptual model, information hierarchy, financial anxiety handling, and mobile form structure are well-executed. The bar visualization is strong. The signpost copy flag from brand is resolved in the live file.

B1 is the only blocker. After B1 is resolved (scroll-to-result on `ready` transition), this gate can issue ⟦UX-REVIEWED⟧. M1 (keyboard focus) must be resolved before public distribution.

After B1 and M1 are both confirmed resolved by the engineer:

```
⟦UX-REVIEWED⟧ tool="work-hours" ticket="HOURS-1" date="<date-of-fix>" covers="Norman (affordances, feedback, constraints, conceptual model), Nielsen (10 heuristics), Ive restraint, Simon memory test, financial anxiety overlay, 375px mobile (fold visibility, focus management, touch targets, table layout, bar scroll), signpost footer"
```

---

## Re-Verification: B1 + M1 Fix Confirmation

**Date:** 2026-06-21
**Reviewer:** design-ux agent
**File re-read:** `finxiety/src/routes/tools/work-hours/+page.svelte`

### Claimed Changes Verified Against Source

**`import { tick } from 'svelte'` (line 2):** Present. `tick` is imported but not called in the effect body — the `$effect` already runs post-DOM-update, so `tick` is unnecessary. The import is harmless and introduces no behavioral problem. Minor lint note only; not a blocker.

**`let resultsEl: HTMLElement | null = $state(null)` (line 146):** Present and correctly typed.

**`let firstReadyShown = false` (line 147):** Present as a plain (non-reactive) variable. No `$state()` wrapper. Correct. This is the mechanism that prevents the reactive loop: because the flag is not reactive, assigning `firstReadyShown = true` inside the `$effect` does not re-trigger the effect.

**`$effect` block (lines 149-159):** Present and structurally correct. The effect reads `ready` (a `$derived`) and `resultsEl` (a `$state`) — both are tracked dependencies. On the first transition of `ready` to `true`, the guard `!firstReadyShown && resultsEl` fires, sets the flag, calls `resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })`, then calls `resultsEl.focus()`. The `else` branch resets `firstReadyShown = false` when `ready` returns to `false`, re-arming the effect for the next valid-input cycle. No reactive loop is possible.

**`<section ... tabindex="-1" bind:this={resultsEl}>` (line 283):** Present. Both `tabindex="-1"` and `bind:this={resultsEl}` are on the results section element. The `aria-live="polite"` and `aria-label="Your work-hours breakdown"` attributes are also present and correct.

**`.results:focus-visible { outline: none; }` (lines 955-957):** Present. This correctly suppresses the visible focus ring on programmatic focus while preserving it for keyboard-initiated focus (`:focus-visible` scoping). This is the right implementation pattern for a programmatic focus target that is not itself a tab-stop.

### Platform Caveat (Non-Blocking)

iOS Safari does not honor programmatic `focus()` on non-input elements without an active user gesture context. Keyboard users on iOS who are not running VoiceOver will not receive the focus move; they will receive the scroll only. This is a known platform constraint, not a code defect. The `aria-live="polite"` region covers VoiceOver users. For V1, this is acceptable. A V2 enhancement could surface a visible "Results ready" indicator for this population.

### B1 and M1 Status

Both B1 (scroll-to-result on `ready` transition) and M1 (keyboard focus management on result appearance) are resolved in the implementation. The scroll fires on the first `ready` transition and is re-armed correctly on input clear. The focus move targets a `tabindex="-1"` section with a suppressed `:focus-visible` ring.

⟦UX-REVIEWED⟧ tool="work-hours" ticket="HOURS-1" date="2026-06-21" covers="Norman (affordances, feedback, constraints, conceptual model), Nielsen (10 heuristics), Ive restraint, Simon memory test, financial anxiety overlay, 375px mobile (fold visibility, focus management, touch targets, table layout, bar scroll), signpost footer"

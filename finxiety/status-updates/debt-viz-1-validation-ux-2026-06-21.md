# UX Review: DEBT-VIZ-1 — Debt vs. Growth Visualizer

**Date:** 2026-06-21
**Reviewer:** design-ux agent
**Source file:** `finxiety/src/routes/tools/debt-growth/+page.svelte`
**Prior gates:** ⟦QA-VERIFIED⟧ · ⟦BRAND-REVIEWED⟧
**Scope:** Norman, Nielsen, Ive, Carmen Simon frameworks; financial anxiety overlay; 375px mobile; keyboard navigation; empty/zero state; result clarity.

---

## Nielsen Checklist

| Heuristic | Status | Notes |
|---|---|---|
| Visibility of system status | PASS | Submit button is disabled with `aria-live` hint while inputs are incomplete. `sr-only` live region announces "Your debt and growth comparison is ready below" on submit. Focus moves to results `<h2>` on calculation. |
| Match between system and real world | PASS | "Debt balance," "APR," "Monthly payment," "Same amount invested," "Time horizon" — all plain language. APR hint contextualizes "Credit cards often run 20–29%." Field hints orient without jargon. |
| User control and freedom | CONCERN | The tool has a submit button, so the user can change any input and resubmit. However, there is no explicit affordance to reset or start over. Once results appear, the form stays visible above — the user can edit inline — but this is not signaled. On mobile, after submit the user lands on the focused `<h2>` with the form scrolled out of view. They must scroll back up to change inputs. A low-friction "recalculate" path is implied but not stated. Not a blocker; noted for enhancement. |
| Consistency and standards | PASS | Dollar prefix, percent suffix, toggle button pattern, callout, summary row, and sources section all match patterns established in TIP-1 and EMG-1. Token usage is consistent with `app.css`. |
| Error prevention | PASS | Submit is disabled until `debtBalance > 0` and `effectiveInvestment > 0`. Number inputs carry `min="0"`. No negative inputs can trigger broken output. The investment field mirrors debt balance until touched — a sensible default that prevents a common user error (leaving the comparison field blank). |
| Recognition rather than recall | PASS | Defaults pre-populate APR (24%) and return (7%) with label hints explaining why. The investment field mirrors the debt field visually so the user does not need to remember what they typed. Summary row repeats the year horizon ("Debt after 10 years") so the user does not need to remember the selected horizon when reading results. |
| Flexibility and efficiency | PASS | Pre-populated APR and return defaults mean a user can enter a single number (debt balance) and immediately submit. The investment mirroring removes a second required input for the default comparison case. Experienced users can override all fields. |
| Aesthetic and minimalist design | CONCERN | The tool description paragraph (lines 199-203) is accurate but slightly long for the cognitive state of the target user. It introduces the conceptual framing before any interaction has occurred. The user has not yet typed anything; the paragraph front-loads explanation rather than letting the tool demonstrate the concept interactively. This is a minor copy tightening, not a structural problem. See Required Changes. |
| Help users recognize, diagnose, recover from errors | PASS | No per-field validation errors are needed (any number is a valid input for a comparison tool). The only error state is an incomplete submission, handled by the submit-disabled pattern with plain-English hint. |
| Help and documentation | PASS | Field hints are present on every input. The results-note ("These are estimates based on the rates you entered... The point is the shape of the two curves") pre-empts the most likely user confusion about output meaning. Sources section links to external verification. |

---

## Norman Principles

**Affordances**

Number inputs look fillable (full-width, 2px bordered, white background — consistent with global input tokens). The dollar prefix and percent suffix are visible, non-interactive decorative marks that correctly signal field type. The submit button is full-width, prominent, and labeled with an action verb ("Show me both curves"). The four time-horizon toggles have explicit `selected` state styling (terracotta fill + white text) and `hover` styling (border color shift), so the selected state and interactivity are both visible.

One affordance gap: the segmented time-horizon control does not look visually distinct from four separate buttons at a glance. A user could reasonably interpret it as four unrelated buttons rather than a single-select group. The ARIA `radiogroup` role is correct, but the visual grouping relies only on proximity and flex layout. A subtle background container or border around the group would reinforce the "pick one" affordance without adding visual noise. This is an enhancement, not a blocker.

**Feedback**

Submit produces three simultaneous feedback signals: focus moves to results `<h2>`, the `sr-only` live region announces the result, and the results section renders below the form. This is thorough. The chart redraws reactively on time-horizon changes after initial submission because the `chartData` derivation runs on the already-computed result — actually, re-reading: `chartData` is only set inside `handleSubmit`, so changing the horizon after initial submission does NOT redraw automatically. The user must re-click "Show me both curves." This is the correct behavior for a submit-button tool and is fine, but it creates a minor expectation mismatch: the time-horizon toggles look like they should update the chart instantly (they are visually reactive — the selected state changes immediately) but the chart does not change until resubmit.

This is a real but minor feedback gap. The selected horizon label in the results `<h2>` ("Over 10 years") will become stale if the user changes the toggle without resubmitting. A user who changes the horizon toggle and sees the results heading still read "Over 10 years" with the old chart data may not notice the mismatch. See Required Changes.

**Constraints**

`min="0"` on all number inputs. `canSubmit` gate prevents submission without meaningful values. `clampNonNegative` in the calculator (per QA report) handles any value that slips through. The investment field default mirrors debt balance, preventing the "I forgot to fill that in" submission. These constraints are well-implemented.

The monthly payment field defaults to "0" with a hint explaining what zero means ("Leave at 0 to see what happens if the debt sits untouched"). This is good constraint design: the default is a valid, instructive scenario, not a broken state.

**Conceptual model**

The tool frames itself as a visualizer ("Debt vs. Growth Visualizer"), and the primary output is a chart. This is consistent. The conceptual model — "type your numbers, see both curves" — is clear from the form structure. The submit button label "Show me both curves" directly names the output the user will receive, reinforcing the model.

One conceptual model tension: the investment field is labeled "Same amount invested" which implies the comparison is always between the debt amount and the same amount invested. But the field is editable — a user can enter any investment amount. The label is not inaccurate, but it describes the default behavior rather than the field's actual function. A user who enters a different investment amount than their debt balance may briefly wonder why the label says "same amount." The field hint ("Mirrors your debt balance by default. Edit it to compare a different amount.") resolves this, but the label itself could be clearer. See Required Changes.

---

## Ive Restraint Test

**Elements that can be removed or simplified**

1. The tool description paragraph (lines 199-203) contains two sentences. The second sentence ("This puts both on one chart so you can see them side by side") restates what the first sentence already established and what the tool's name says. One sentence would be enough. The user does not need to be told they can "see them side by side" — the chart will show them.

2. The `<hr class="divider">` between the description and the form (line 205) adds visual separation that the paragraph's bottom margin and the form's top spacing already provide contextually. It is structural scaffolding made visible. Not a blocking concern; it does earn its place by signaling the transition from description to interactive form, but it is a candidate for removal if the design ever feels busy.

3. The results `<h2>` reads "Over {years} years." This heading earns its place as the focus target on submit (it is programmatically focused) and as the landmark for screen readers. However, it provides minimal informational value beyond reiterating the selected horizon. If the callout immediately follows, the heading could be absorbed into the callout structure. This is a structural change that would require ARIA landmark rethinking — not recommended without broader redesign.

4. The signpost footer (lines 458-465) is appropriately restrained. The cross-links are accurate and the connective copy is minimal. No action needed.

**Visual hierarchy**

On mobile at 375px, the visual hierarchy is:

1. Breadcrumb (back nav)
2. H1 (tool name)
3. Description paragraph
4. Divider
5. Five form fields (single column)
6. Submit button
7. [After submit:] Results heading, results note, chart, callout, summary row, sources

The H1 is the right entry point. The form fields follow in logical order (debt first, then the comparison side). The submit button is full-width and visually final.

The critical hierarchy concern is the post-submit results section. On mobile, the results section renders below the form. After clicking "Show me both curves," focus moves to the results `<h2>` ("Over {years} years"). The user's attention is correctly directed to the results. However, the first visible content in the results section after the heading is the `results-note` — a caveat paragraph in muted text at 0.8125rem — before the chart and before the callout. The caveat precedes the insight. A user who lands on the `<h2>` and reads down encounters the disclaimer before they encounter the result. See Required Changes.

---

## Simon Memory Test

**The one memorable output**

The tool produces multiple numbers: debt end balance, investment end balance, and the difference. The callout paragraph names all three in prose. The summary row repeats all three as labeled cells. There is no single number that the tool highlights as the answer.

This is the most significant UX concern in this review.

Carmen Simon's framework: one tool, one memorable output. The ALICE user using this tool is trying to understand compound interest viscerally — not to get three numbers. The insight the tool is designed to create is: "here is how much more the invested version would be worth compared to the debt version." That is the `difference` value. But the difference is currently the third cell in the summary row, given equal visual weight to the debt end and investment end cells.

The difference value is the answer. The debt end and investment end are context for that answer. The design currently treats them equally. This inverts the information hierarchy. A user who sees three equally-weighted numbers will remember none of them 24 hours later. A user who sees one large number ("$47,000 more") with context below it will remember the scale of the gap.

See Required Changes — this is the highest-priority UX change.

**Cognitive load assessment**

The form has five inputs plus a time horizon selector. For the target population (ALICE user, high cognitive tax, financial stress), five inputs is at the high end of acceptable. The tool partially compensates with two pre-populated defaults (APR: 24, return: 7) and one mirrored default (investment mirrors debt balance), meaning a first-time user effectively needs to enter only one number (debt balance) to see a result. This is well-designed.

The cognitive load concern is the results section. After submitting, the user encounters:
- A heading ("Over 10 years")
- A results-note paragraph (caveat, 2 sentences)
- A chart (aria-hidden, visual only)
- A legend (2 items)
- A callout paragraph (3 sentences, 3 numbers)
- A summary row (3 labeled cells, 3 numbers)
- A sources section (3 bullet points)
- A signpost footer (1 paragraph, 2 links)

That is eight distinct content blocks, containing approximately 6 numbers and 200 words of text, after a single click. For a user already cognitively taxed by financial stress, this results section is dense. The callout and summary row together present the same three numbers twice — once in prose, once as labeled cells. This duplication is the primary cognitive load driver. The callout and summary row should not both be presenting all three numbers.

---

## Financial Anxiety Overlay

**Shame signals**

None found. This finding is consistent with the brand gate. The tool describes curves and math, not the user's financial choices. The callout copy observes behavior ("this debt could grow to about") rather than attributing cause or implying failure. No red states, no failure copy, no urgency language.

**Trust signals**

Present and well-implemented. Three layers: results-note caveat ("These are estimates"), tilde prefix on all summary values, inline "estimated" tag on all summary cells. Source links are present and link to investor.gov and a historical data aggregator. The meta description's "Free, nothing saved" is strong trust copy (per brand review).

One trust gap: the results-note appears before the chart and callout in the DOM. On mobile, after submit, focus lands on the `<h2>` and the user reads the caveat before seeing the result. The caveat front-running the result is technically correct (estimates should be labeled as estimates) but may create a minor trust friction — the user reads a disclaimer before they know what's being disclaimed. The callout's own "about" qualifier is sufficient trust framing at the point of the result. The results-note could move after the summary row without losing its function.

**Cognitive load**

High. See Simon Memory Test above. The primary driver is the parallel structure of callout + summary row both presenting three numbers. The secondary driver is the results-note caveat appearing before the result rather than after. These are addressable without structural rethinking.

---

## Required Changes Before Build

These changes are ordered by severity. Changes 1 and 2 are required before ⟦UX-REVIEWED⟧ can be issued. Changes 3 through 6 are strong recommendations that do not block sign-off but should be resolved before public distribution.

---

### 1. REQUIRED — Differentiate the "Difference" value in the summary row

**Severity:** High (Carmen Simon memory test; information hierarchy failure)

**Problem:** The three summary cells (debt end, investment end, difference) are given identical visual weight. The difference is the answer. The other two are context. The current design inverts this.

**Recommended fix:** Increase the visual weight of the difference cell. Options in order of restraint:
- Option A (minimal): Add a CSS class to the difference cell that increases `font-size` to `1.5rem` and uses `color: var(--ink)` (darkest, most neutral) while the debt and investment cells remain at `1.25rem` in their respective palette colors.
- Option B (moderate): Move the difference cell to a separate row above the debt/investment pair, full-width, with slightly larger type. This makes it the first thing the eye hits in the summary section.
- Option C (structural): Replace the three-cell summary row with a single-number callout at the top of the results section ("The gap: ~$47,000 estimated") and demote debt end and investment end to a secondary detail table below the chart.

Option A is the minimum viable change. Option B is preferable. The engineer should default to Option B unless the design system strongly favors Option A.

The difference value should also carry directional framing. Currently `fmtDollars(Math.abs(difference))` strips the sign — the user cannot tell from the summary row whether the investment won or the debt won. The callout prose does answer this, but the summary row should be self-contained. Add a directional label: "Investment ahead by ~$47,000" or "Debt ahead by ~$12,000" depending on which is larger.

---

### 2. REQUIRED — Resolve the stale-results problem when time horizon changes after initial submit

**Severity:** Medium (Norman feedback gap; Nielsen visibility of system status)

**Problem:** After initial submission, the time-horizon radio buttons remain interactive. The selected state updates immediately (visual feedback). But `chartData` is only recomputed inside `handleSubmit`, so the chart and callout do not update. The results `<h2>` ("Over 10 years") will display the old horizon while the toggle shows a new one. The user sees inconsistent state.

**Recommended fix (preferred):** Make the computation reactive. Move the `computeDebtGrowth` call into a `$derived` block (or a `$effect`) that runs whenever `years`, `debtBalance`, `apr`, `monthlyPayment`, `effectiveInvestment`, or `annualReturn` change and `canSubmit` is true. Remove the submit button's role as the computation trigger — it becomes a "reveal results" toggle (sets `submitted = true`) rather than a computation trigger. After first submission, any input change recomputes automatically.

This would make the tool fully reactive (no submit button needed after first use), which matches the tool description ("Reactive chart redraws on any input change") in the original brief. The current implementation does not match this description.

**Alternative fix (minimal):** If full reactivity is deferred, add a visual stale indicator when any input changes after submission. A "Recalculate" button that replaces or supplements the submit button after first submission, with the button highlighted when inputs have changed since last calculation. This ensures the user knows the displayed results are no longer current.

The preferred fix is correct; the alternative is acceptable as a temporary state. Note in the ticket which path the engineer should take.

---

### 3. RECOMMENDATION — Move the results-note after the callout

**Severity:** Low (trust signal ordering; cognitive load)

**Problem:** The results-note caveat ("These are estimates based on the rates you entered...") appears before the chart and callout. The user reads a disclaimer before they see the result.

**Recommended fix:** Move the `<p class="results-note">` to after the callout and before the summary row. The callout's own "about" qualifier provides in-line uncertainty framing at the point of the number. The broader caveat ("The point is the shape of the two curves, not an exact dollar prediction") reads better after the user has seen the curves, not before.

DOM order: `<h2>` → chart → callout → results-note → summary row → sources.

---

### 4. RECOMMENDATION — Rename the "Same amount invested" field label

**Severity:** Low (Norman conceptual model)

**Problem:** The label "Same amount invested" describes the default behavior (mirroring the debt balance) rather than the field's actual function (a user-specified investment amount for comparison). A user who overrides the field with a different amount will find the label misleading.

**Recommended fix:** Change the label to "Amount to invest (for comparison)" or simply "Investment amount." The field hint already explains the mirroring behavior; the label does not need to carry that weight.

---

### 5. RECOMMENDATION — Add a visual container to the time-horizon segmented control

**Severity:** Low (Norman affordances; recognition of single-select group)

**Problem:** The four time-horizon toggle buttons are visually grouped only by proximity and flex layout. The "pick one" affordance is not reinforced by a visual boundary around the group.

**Recommended fix:** Add a background and border-radius to the `.segmented` container — a subtle grouping container (e.g., `background: var(--surface); border-radius: var(--radius); padding: var(--space-xs);`) that makes the four buttons read as a single control. This is a one-line CSS addition.

---

### 6. RECOMMENDATION — Trim one sentence from the tool description

**Severity:** Low (Ive restraint; cognitive load at landing)

**Problem:** The description paragraph's second sentence ("This puts both on one chart so you can see them side by side") restates the tool's name and the obvious output.

**Recommended fix:** Delete the second sentence. The paragraph becomes: "Compound interest is usually explained as a savings superpower. It runs the same way on debt — the same exponential curve, pointed the other direction." The chart demonstrates the side-by-side view; it does not need to be described in advance.

---

## Summary

| Category | Status | Key finding |
|---|---|---|
| Nielsen heuristics | PASS with 1 concern | User control/freedom: no recalculate affordance after submit |
| Norman principles | CONCERN | Feedback gap on horizon change post-submit; conceptual model gap on investment label |
| Ive restraint | CONCERN | Results section presents 3 numbers twice; description has one redundant sentence |
| Simon memory test | FAIL | No single dominant output; difference value has equal weight to context values |
| Financial anxiety overlay | PASS | No shame signals; trust signals present and layered; cognitive load is high but addressable |
| 375px mobile | PASS | Single-column layout, touch targets met, results stack correctly |
| Keyboard / radiogroup | PASS | Roving tabindex and arrow-key handler confirmed in place (per QA re-verification) |
| Empty/zero state | PASS | Submit disabled with plain-English hint; no broken copy possible in zero-input state |

---

## Sign-Off Status

⟦UX-BLOCKED⟧ tool="debt-growth-visualizer" ticket="DEBT-VIZ-1" date="2026-06-21"

Two required changes block sign-off:

1. **Differentiate the difference value** in the summary row (Required Change 1) — the current equal-weight three-cell layout fails the Simon memory test. The tool has no single memorable output.
2. **Resolve the stale-results state** when time horizon changes after initial submit (Required Change 2) — the results heading and chart display old data while the toggle shows a new selection.

After both are resolved:
- Re-run this gate on the updated file.
- Changes 3-6 can be addressed in the same pass or deferred to a subsequent iteration — they do not block ⟦UX-REVIEWED⟧.
- No re-review of math, keyboard navigation, WCAG contrast, or Do No Harm copy is needed — those pass from prior gates and are unaffected by the required changes.

---

## Re-Verification — 2026-06-21

**Reviewer:** design-ux agent
**Scope:** Required Change 1 (winner row) and Required Change 2 (stale results). Four non-blocking recommendations not re-examined; they do not affect gate status.

---

### Required Change 1 — Winner row: RESOLVED

**What was verified (file lines cited from `+page.svelte`):**

DOM position: The `.summary-winner` div (lines 438-448) appears before `.summary-row` (lines 460-469). The winner row is above the two-cell row as specified.

Conditional branches: All four branches are present and directionally correct.
- `debtPaidOff` (line 439): "Debt paid off — investment ahead by ~`<strong>{fmtDollars(investmentEnd)}</strong>`" — fires when `debtEnd === 0`; uses `investmentEnd` because the debt has cleared. Correct.
- `debtWinning` (line 441): "Debt ahead by ~`<strong>{fmtDollars(Math.abs(difference))}</strong>`" — fires when `debtEnd > investmentEnd` (line 111). Correct.
- `difference === 0` (line 443): "Both end at the same balance — ~`<strong>{fmtDollars(debtEnd)}</strong>`". Correct.
- Default (line 445): "Investment ahead by ~`<strong>{fmtDollars(difference)}</strong>`" — fires when investment leads. Correct.

Dollar amount prominence: `.winner-label` carries `font-size: 1.125rem; font-weight: 700; color: var(--pine)` (lines 869-875). The `<strong>` inside carries `font-size: 1.375rem; font-weight: 800` (lines 877-881). The dollar amount is visually heavier than the wrapper text and significantly heavier than the summary cell values at `1.25rem / 800` (lines 800-806) — meets the "visually prominent" requirement.

Summary row cell count: `.summary-row` contains exactly two `.summary-cell` divs (lines 461-468): "Debt after N years" and "Investment after N years." The third "Difference" cell has been removed. Correct.

Trust signal: `<span class="estimated-tag">estimated</span>` is present on every branch of the winner label. Consistent with the tool's layered trust framing.

**Verdict: RESOLVED.**

---

### Required Change 2 — Stale results after horizon toggle: RESOLVED

**What was verified:**

The `$effect` block at lines 91-102 reads `submitted`, `canSubmit`, `debtBalance`, `apr`, `monthlyPayment`, `effectiveInvestment`, `annualReturn`, and `years`. Svelte 5 tracks every reactive read inside an `$effect` body, so a change to any of these — including `years` from the horizon toggle — re-runs the block. When `submitted && canSubmit`, it assigns a fresh `computeDebtGrowth` result to `chartData`. No re-submit required.

The `<h2>` at line 346 reads `Over {years} years` where `years` is the live `$state` value (line 19). It updates in the same reactive cycle as the effect. The heading and chart are always in sync.

Double-computation on initial submit: `handleSubmit` (lines 77-84) assigns `chartData` directly, and the `$effect` fires again in the same update cycle because `submitted` just transitioned to `true`. Both calls receive identical inputs and produce identical output. The effect runs after the DOM update; `await tick()` and focus management in `handleSubmit` are not affected. No behavioral defect.

**Verdict: RESOLVED.**

---

### Gate Status

Both required blockers are resolved. The four non-blocking recommendations (move results-note, rename investment label, add segmented control container, trim tool description) remain open and can be addressed in a subsequent iteration.

⟦UX-REVIEWED⟧ tool="debt-growth-visualizer" ticket="DEBT-VIZ-1" date="2026-06-21"

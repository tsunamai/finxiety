# UX Review: COMPOUND-1 — The Compounding Effect

**Date:** 2026-06-21
**Design-UX agent:** design-ux (claude-sonnet-4-6)
**Files reviewed:**
- `finxiety/src/routes/tools/compound-interest/+page.svelte`
- `finxiety/src/app.css`
- `finxiety/status-updates/compound-1-validation-brand-2026-06-21.md`
- `finxiety/status-updates/compound-1-validation-qa-2026-06-21.md`
**Viewport assessed:** 375px (primary), 640px (secondary)
**Prior gates:** Brand — REVIEWED (F-DNH-1 resolved). QA — VERIFIED (conditional on F-001 build gate).

---

## Nielsen Checklist

| Heuristic | Status | Notes |
|---|---|---|
| 1. Visibility of system status | PASS | The chart and results section render reactively as the user types — no submit button needed. The `aria-live` region announces updates to screen reader users. The `submit-hint` paragraph tells the user exactly why nothing is showing yet ("Enter a starting amount or a monthly addition, and a return above 0, to see the chart"). |
| 2. Match between system and real world | PASS | "Starting amount," "Monthly addition," "Annual return," "Time horizon" are plain language. "Interest added" is more natural than "accumulated interest." The intro copy defines compound interest in one plain sentence before asking the user to touch anything. |
| 3. User control and freedom | PARTIAL PASS — see UX-002 | All four inputs are always visible and editable. Changing any input immediately updates the chart, which is good. However, there is no explicit reset affordance. A user who wants to start over must manually clear each field. On mobile this friction is higher because you cannot select-all as easily. The rate field pre-fills at 7, which is helpful, but also means clearing it feels destructive. |
| 4. Consistency and standards | PASS | Input wrapper patterns (prefix dollar sign, suffix percent, min-height 48px buttons, field-hint below label) match the established Finxiety pattern across EMG-1, TIP-1, and DEBT-VIZ-1. The breakdown card two-column structure is consistent with how other tools display dual-value results. |
| 5. Error prevention | PARTIAL PASS — see UX-003 | The `min="0"` HTML attribute offers browser-level constraint. `clampNonNegative` in the calculator handles invalid values silently. However, no inline feedback exists for out-of-range entries. A user who types -3 for the rate sees the chart update to a flat 0% line with no explanation. This is safe but not clear. The rate field is the highest-risk input for confused users: "7" is pre-filled but there is no upper bound, so 700 is accepted silently. |
| 6. Recognition rather than recall | PASS | All labels and hints are co-located with their inputs. The breakdown cards repeat the user's input context ("You put in" vs "Interest added") so the user does not need to remember what they typed to interpret the output. |
| 7. Flexibility and efficiency | PASS | The reactive calculation pattern (no submit button) is efficient for experienced users. The default rate of 7 means the tool is usable with only two fields filled in. HORIZONS as a segmented control is faster than a text input for the most common case. |
| 8. Aesthetic and minimalist design | PASS with advisory | Every element earns its place. The two-part breakdown, the callout, and the sources section all carry distinct information. One advisory: the signpost footer is always visible, including before any inputs are entered. On a 375px screen with no results showing, it appears below the submit-hint and contributes to a slightly long pre-result scroll. Not a hard failure, but worth noting in the context of first-use clarity. |
| 9. Help users recognize, diagnose, recover from errors | FAIL — see UX-003 | Silent clamping is the only error response for invalid inputs. A user who enters 700 for the rate sees a very large future value and no warning. A user who enters 0 for both amount fields sees the submit-hint reappear but gets no explanation of why the chart disappeared if they had previously entered values. |
| 10. Help and documentation | PASS | The rate field hint pre-empts the most common question ("what rate do I use?"). The sources section answers "where does the 7% come from?" and "is this a real forecast?" The results-note and callout explain the math in the user's own numbers. No documentation page is needed. |

---

## Norman Principles

**Affordances:**
All three text inputs use `type="number"` with `inputmode="decimal"`, which on iOS/Android presents the numeric keyboard with a decimal point. The dollar prefix and percent suffix are positioned as visual affordances that signal the expected unit before the user types. The HORIZONS segmented control's `selected` state (terracotta fill, white text) clearly distinguishes the chosen option from the others. The chart renders reactively as soon as there are inputs, which acts as an implicit affordance: typing something in produces a visible result, reinforcing that the tool is live. No submit button means the conceptual model matches the experience — it is a visualizer, not a form submission.

One affordance gap: the rate field is pre-filled with "7" but there is no visual cue that it is editable until the user taps it. On mobile, a pre-filled field can read as a static label rather than an input, especially at first glance. This is a known pattern tradeoff. Given the field has the same border/padding as the other inputs and the same focus ring, this is acceptable but worth watching.

**Feedback:**
Reactive computation is the strongest feedback mechanism in the tool. Every keypress updates the chart and the headline value. The `aria-live` region ensures screen reader users get audible feedback. The `submit-hint` provides early feedback for why the results section is empty. The breakdown cards provide immediate feedback on the split between contributions and interest.

Gap: there is no loading state or visual indicator during computation. For the values typical of this tool, computation is instantaneous in JS, so this is not a real problem. However, if the tool is ever extended to include more complex projections, the reactive pattern would need a debounce or skeleton state.

**Constraints:**
`min="0"` is set on all three numeric inputs. `clampNonNegative` in the calculator enforces non-negative values at the math layer. HORIZONS constrains the time horizon to four valid values; no free-text entry for years is allowed, which correctly prevents fractional or invalid horizons. The tool has no maximum constraint on rate or principal, which means a user can enter 1,000,000 for either without feedback. The resulting chart will render correctly but could mislead a user who accidentally typed an extra zero.

**Conceptual model:**
The tool presents as a visualizer, not a form. This matches the reactive computation pattern. The prose framing ("see how the math plays out over time") sets the right expectation. The chart, the breakdown, and the callout all reinforce a single mental model: you put in some money, and the interest adds more on top, accelerating over time. The three layers of the chart (contributed area, interest area, total curve) map directly to the three numbers in the breakdown. Conceptual model alignment is strong.

---

## Ive Restraint Test

**Elements that can be removed without loss:**

- The `<hr class="divider" />` between the description and the form. The `--space-lg` margin on the form already creates enough separation. The divider adds visual noise without adding structure. Low-priority removal.
- The `results-note` paragraph ("An estimate based on the return you entered, compounded monthly. Real returns vary year to year...") largely repeats the callout and the sources section. The "estimated" labels on the values already do the epistemic work. If the sources section is present, this paragraph may be redundant. However, it does appear before the chart and serves users who do not scroll to sources, so there is a case for keeping it. Consider tightening to one sentence if it stays.
- The signpost footer uses a background surface (`var(--surface)`) that gives it card-like weight. On mobile, this adds visual heaviness below the results. The same content could be rendered as plain muted text with a lighter border-top divider, reducing the visual mass of the page-end.

**Visual hierarchy:**
On mobile (375px), the reading order is: breadcrumb, h1, description, divider, form fields, submit-hint (or results). The hierarchy is clean. The headline value uses `clamp(2rem, 8vw, 2.75rem)` at weight 800, which is visually dominant above the breakdown cards. The breakdown labels ("YOU PUT IN", "INTEREST ADDED") are visually lighter than their values, which is correct.

One hierarchy question: the "ESTIMATED VALUE AFTER X YEARS" label above the headline value is `0.75rem / uppercase / muted`. It may read as a category tag rather than a caption, which is the right register. However, a user on a 375px screen who has just scrolled past the form might not immediately associate the headline number with the label above it. The label-then-value pattern is standard and should be fine, but the visual distance between `headline-label` and `headline-value` could be reduced slightly (the current gap is `--space-xs = 0.5rem`, which is fine, but the letter-spacing on the uppercase label makes it feel disconnected from the large number below it).

---

## Simon Memory Test

**The one memorable output:**
The personalized callout — "the last 20 years add $X in interest — more than the $Y from the first 10" — is the single most memorable output in the tool. It does three things simultaneously: gives the user their own numbers, makes a concrete comparison, and delivers the insight the tool exists to communicate (compounding accelerates). This is exactly the "I finally understand this" moment the tool is built around. The format is correct: a single strong sentence with two bolded numbers. No other element competes with it.

The headline future value (~$X,XXX estimated) is visually dominant but is not the memorable output by design, and correctly framed as an estimate.

**Cognitive load assessment:**
Low to medium. Four inputs, all with clear labels and hints. No branching. The reactive chart reduces load by eliminating the submit action entirely. The result screen introduces three numbers (future value, you put in, interest added), a chart, a callout, and a sources section. That is more than one screen's worth of content on a 375px device, but the information architecture is progressive: the headline is first, the breakdown is second, the chart is third, the callout is fourth, sources are last. A user can stop reading at any point and have gotten the core answer.

The one cognitive load concern is the rate field. The 7% default is helpful, but many Finxiety users are not saving through equities — they may have a savings account at 4.5% or a CD at 5.2%. The hint copy ("7% is the historical S&P 500 average. Use a lower rate for savings accounts.") addresses this, but the phrase "historical S&P 500 average" may not land for the core Finxiety user who does not know what the S&P 500 is. The hint is doing double duty (anchoring the default AND explaining what to change it to) in 22 words. This is tight but functional.

---

## Financial Anxiety Overlay

**Shame signals:**
None found. The tool shows math, not a grade. No "you should have started earlier" framing, no comparison to peers, no urgency language. The "Can be 0" hints on principal and monthly are the exact right move: they pre-empt the shame of not having a starting amount by normalizing zero as a valid input. The breakdown labels ("You put in" / "Interest added") describe the math, not the person.

The Rule of 72 callout says "money roughly doubles every X years" — framed as how the math works, not as an admonishment that the user has missed X doubling cycles. This is correct.

**Trust signals:**
Present and well-placed. The "estimated" labels on every modeled output are present on first render, not hidden in fine print. The results-note appears immediately below the headline before the chart, so the epistemic framing reaches the user before they start interpreting the large number. The investor.gov link is in the sources section. The past-returns disclaimer appears both in the rate field hint (at the moment of interaction) and in the sources section. Trust signals are layered across the experience rather than concentrated at the bottom.

One observation: the `officialdata.org` link for the S&P 500 source is a third-party site. QA flagged this as Low priority. From a trust perspective, a user who clicks through and finds a non-.gov site may feel slightly less anchored. The surrounding copy appropriately contextualizes it as a rough average, not an official figure. Acceptable as-is, but worth a brief "(third-party data)" annotation in a future pass.

**Cognitive load: Low to Medium.** The reactive pattern removes one cognitive step (remembering to hit submit). The progressive disclosure structure means a casual user and a detail-oriented user both get what they need without being overwhelmed. The one medium-load element is the rate input, where the user must make a judgment call about what rate to enter. The hint addresses this but cannot resolve the underlying knowledge gap for users unfamiliar with investment returns.

---

## Specific Assessment of the Nine Review Points

**1. First-use clarity: does the user understand what to enter before touching any field?**
Yes. The intro paragraph ("Enter a starting amount and a monthly addition to see how the math plays out over time") is specific about what the tool does before the form appears. The field labels ("Starting amount," "Monthly addition") are self-explanatory. The `submit-hint` text is visible before any inputs are entered when `!hasInputs` is true. The rate field pre-fills at 7, which means the user only needs to fill in two fields to get a result. First-use clarity is strong.

**2. Input labeling: are all fields labeled? Are hints appropriate?**
All three text inputs have visible `<label>` elements associated via `for`/`id`. The time horizon segmented control uses a `<span class="group-label">` with `id="horizon-label"` and `aria-labelledby` on the `role="radiogroup"`. Hints are present for all four fields via `field-hint` paragraphs and `aria-describedby` on the inputs. Hint copy is appropriate: it explains what each field means and what to enter (including "Can be 0" for the amount fields and the S&P 500 context for rate). One improvement opportunity: the rate hint includes a past-returns disclaimer ("Past returns don't predict future results") which is important but makes the hint the longest of the three at approximately 22 words. On a 375px screen, this hint wraps to 3-4 lines and sits between the label and the input, adding vertical height to the rate field section. Acceptable, but if the hint is trimmed for any reason, the past-returns disclaimer should move to the results section, not be dropped entirely.

**3. Number input pattern: `type="number"` or `inputmode="numeric"`?**
All three inputs use `type="number"` combined with `inputmode="decimal"`. This is the correct pattern for currency and rate inputs on mobile: `type="number"` provides native numeric input semantics (min, step, arrow key increment), and `inputmode="decimal"` ensures the decimal keyboard (not the integer-only `inputmode="numeric"`) is presented on iOS and Android. The `step="any"` attribute correctly allows decimal values (e.g. 7.5% for rate). Spinner controls are hidden via CSS per Finxiety convention, which is appropriate. This pattern is consistent with other tools in the suite. Pass.

**4. Results section: is the headline number immediately visible above the fold on a 375px screen?**
This is the most important layout question in the review. On a 375px device, the page structure before the results section is:
- Header bar (approx 52px)
- Breadcrumb (approx 28px)
- h1 (approx 44px, `clamp(1.75rem, 5vw, 2.25rem)`)
- Description paragraph (approx 64px, 3 lines of muted text)
- Divider (1px + `--space-lg` 32px above + below = 65px total)
- Form grid (single column): principal field (label + hint + input = approx 100px), monthly field (approx 100px), rate field (label + 4-line hint + input = approx 128px), horizon segmented control (label + buttons = approx 76px)

Estimated form height: approximately 404px. With header and pre-form content, the results section begins at approximately 660-700px from the top of the viewport. On a 375x667px phone (iPhone SE), the headline value is not visible above the fold when first arriving at a result.

This is a structural issue specific to the reactive-no-submit pattern. With a submit button, the user taps the button and the result scrolls into view (or the button stays at the bottom of the form and the result renders above it). With reactive rendering, the result section renders below the form and the user must scroll to find it.

The current implementation has an `aria-live` region that announces the result to screen reader users, which handles the accessibility case. But sighted users on 375px will need to scroll before seeing the headline number. There is no scroll-into-view behavior, no sticky result panel, and no visual cue that a result has appeared below the fold.

Severity: Medium. The tool is still usable — the user scrolls and finds the result. But the design intent ("see how the math plays out") is undermined if the math is below the fold. The callout moment ("the last 20 years add $X") is even further below, likely at approximately 900-1000px on a 375px screen after the chart renders.

See Required Change UX-001.

**5. The personalized callout: does it render correctly? Is it above or below the fold?**
The callout renders correctly when `secondHalfWins && firstHalfInterest > 0`. For the most common case (positive rate, horizon >= 10 years, any positive input), this condition is true and the personalized version appears. When the condition is false (e.g. 0% rate, or very short horizon where compounding has not differentiated the halves enough), the fallback copy ("The longer money compounds, the larger each year's growth tends to be") is shown. This is the right fallback.

The callout is positioned after the chart, which means on 375px it is approximately 900-1000px from the top of the viewport — well below the fold. As the most memorable output in the tool, this placement is a problem. A user who gets their headline number and leaves before scrolling past the chart never encounters the moment the tool is built around.

See Required Change UX-001 (scroll-to-results) and the advisory in UX-004 (callout placement).

**6. Focus management: after results render, does focus land on the result heading?**
No. The tool uses reactive computation — results appear in the DOM when `hasInputs` becomes true, but there is no `focus()` call on the results section heading or the `aria-live` container. Keyboard users who have finished entering inputs will find themselves tabbed to the last segmented button (30 yr) with no indication that a results section has appeared below. The `aria-live` region announces the future value to screen reader users, which partially covers this. But focus does not move.

For sighted keyboard users (not screen reader users), this is a gap. After tabbing through the four horizon buttons, the next Tab takes the user into the results section's link elements (investor.gov, officialdata.org), skipping the headline value and breakdown cards entirely.

Severity: Medium. The aria-live region covers the screen reader case. The sighted keyboard case is gaps-in-navigation, not broken navigation. But for a tool targeting users who may be navigating by keyboard due to motor limitations, this is worth addressing.

See Required Change UX-002.

**7. Error states: if a user enters invalid input, is feedback clear and accessible?**
No inline error feedback exists. The behavior on invalid input is:
- Negative principal or monthly: `clampNonNegative` silently returns 0. The results update as if the user entered 0.
- Negative rate: silently treated as 0%; the chart goes flat and the headline shows the total contributions with no interest. No warning.
- Rate of 0 entered explicitly: chart disappears because `hasInputs` requires `rate > 0`. The `submit-hint` reappears, but only if both amount fields are also 0 or empty. If principal > 0 but rate = 0, `hasInputs` is false and the results section vanishes. The submit-hint reads "Enter a starting amount or a monthly addition, and a return above 0, to see the chart" — this does explain the condition, but only if the user notices it.
- Extremely high rate (e.g. 700): accepted silently; chart renders a very steep exponential curve; future value is an astronomical number. The "estimated" label is present but nothing warns the user that 700% is not a realistic rate.

QA flagged this as WCAG 3.3.1 advisory (Medium, F-002). From a UX perspective, the silent clamp on negative values is the most concerning pattern, because the user gets a result that does not correspond to their input with no feedback about why.

See Required Change UX-003.

**8. WCAG: color contrast, touch targets, keyboard navigation.**
QA performed a thorough WCAG audit. Findings:
- Color contrast: All pairs pass 4.5:1. `--muted` (#506258) on white is approximately 7.3:1. White on `--pine` (#2C4A3B) for the selected toggle button is approximately 14.8:1.
- Touch targets: Inputs are minimum 44px height. Horizon buttons are `min-height: 48px` with `flex: 1` on a wrapping flex container, so at 375px each button occupies approximately 75-80px width (four buttons with gaps in a 335px container). All meet 44x44px minimum.
- Keyboard navigation: Tab order follows DOM order. The horizon radiogroup uses `role="radiogroup"` and `role="radio"` with `aria-checked`. However, there is a keyboard navigation gap: a `role="radiogroup"` with `role="radio"` buttons is expected by AT to support arrow key navigation between options (as per the ARIA authoring practices radiogroup pattern). The current implementation uses `<button>` elements with `role="radio"`, which means each button is a separate tab stop. A keyboard user must Tab four times to move through the horizon options rather than using arrow keys within the group. This is a WCAG 2.1 AA advisory gap (not a hard failure under SC 2.1.1, since the Tab path works), but it does not match the AT expectation for a radiogroup pattern.

See Required Change UX-005 (arrow key navigation in horizon radiogroup).

**9. Reset/recalculate pattern: can the user change inputs and recalculate without confusion?**
Yes, with one qualification. Because calculation is reactive (no submit button), changing any input immediately updates the chart. This is the strongest aspect of the recalculate experience — there is no "Recalculate" button to forget to press, no stale result state. The user simply changes the rate field and the chart updates in real time.

The qualification: there is no explicit "Clear" or "Start over" affordance. If a user has entered values and wants to reset to defaults, they must manually clear or change each field. The rate field defaults to 7, but there is no visual indication that 7 is the default (as opposed to a value the user entered). A first-time user who changes the rate and then wants to restore it to "what it was" has no single action to do so.

This is a Low priority issue for most users. For the core Finxiety user (first-time, unfamiliar with compound interest), who may want to experiment with different scenarios without losing their original inputs, the lack of a reset is a minor friction point.

---

## Required Changes Before Build (Ordered by Severity)

**UX-001 — MEDIUM — Scroll-to-results on first render**
When `hasInputs` transitions from false to true (the first time the chart and results section render), the page should scroll the results section into view. In Svelte, this can be accomplished with a `$effect` that watches `hasInputs` and calls `document.querySelector('.results')?.scrollIntoView({ behavior: 'smooth', block: 'start' })` when it transitions to true. This ensures the headline number is visible above the fold on 375px without the user needing to discover it by scrolling. On subsequent input changes (already-true hasInputs), no scroll should occur — the user is actively editing inputs and the results should update in place.

This is the single highest-impact UX change in the review. The callout ("the last X years add $Y — more than $Z from the first half") is the most memorable output in the tool. If it lives below the fold at 900px on mobile and the user never scrolls to it, the tool's core insight is not delivered.

**UX-002 — MEDIUM — Focus management after first render**
When the results section first renders, programmatic focus should move to the `.headline` or the `headline-value` paragraph (which should receive a `tabindex="-1"` to be focusable without entering tab order). This ensures keyboard users who have tabbed through the form discover that results have appeared. The `aria-live` region covers screen reader announcement; this covers sighted keyboard navigation. In Svelte, this can be done via a reactive `$effect` or a `bind:this` reference combined with an `if/else` block tracking the `hasInputs` transition.

**UX-003 — MEDIUM — Inline validation feedback for out-of-range rate input**
Add a visible inline warning (not a blocking error) when the rate field contains a value that has been clamped or is outside a reasonable range:
- Rate < 0: display "Rate adjusted to 0% — negative rates are treated as 0" below the field using the `.error-msg` class (already defined in `app.css`).
- Rate > 50: display "Heads up — rates above 50% are unusual. Check your entry." This is not a hard block; the user can proceed. It prevents the silent acceptance of accidental inputs like 700.

The message should appear below the rate hint in the `.field` container and be associated with the input via `aria-describedby` (append to the existing `rate-hint` id or add a second `aria-describedby` id). Use neutral language — "adjusted to" rather than "invalid" or "error."

**UX-004 — LOW — Callout placement advisory**
Consider whether the callout ("the last X years add $Y in interest — more than $Z from the first half") should move above the chart rather than below it. The callout is the most memorable output; the chart is a supporting visual. On 375px, the chart occupies significant vertical space (approximately 200px at mobile scale), pushing the callout further below the fold. If the callout moved above the chart (between the breakdown and the chart), it would appear at approximately 600-650px from the top of the viewport — still below the fold, but reached on a shorter scroll, and visually before the chart rather than after.

This is an advisory, not a required change. The current placement is defensible (chart explains the mechanism, callout explains the implication), but the reading order could be inverted without loss.

**UX-005 — LOW — Arrow key navigation in horizon radiogroup**
The four HORIZONS buttons use `role="radio"` within a `role="radiogroup"`. The ARIA Authoring Practices Guide pattern for radiogroups specifies that arrow keys move focus within the group and Tab exits the group, rather than Tab moving between radio options. The current implementation makes each button a separate Tab stop. This matches how browsers handle `<input type="radio">` natively but does not match the ARIA keyboard pattern users expect for a `role="radiogroup"`.

Fix: add a `keydown` handler to the radiogroup that intercepts `ArrowRight`/`ArrowDown` (move to next option) and `ArrowLeft`/`ArrowUp` (move to previous option), setting `tabindex="0"` on the focused button and `tabindex="-1"` on the others (roving tabindex pattern). This is a standard WCAG 2.1 AA improvement for keyboard accessibility and is not a hard blocker, but it is the correct implementation for the stated ARIA roles.

**UX-006 — LOW — Rate hint length on mobile**
The rate field hint is the longest of the three field hints at approximately 22 words including the past-returns disclaimer. On 375px it wraps to 3-4 lines, making the rate field section approximately 128px tall compared to approximately 100px for the other fields. The visual asymmetry is minor but noticeable in a two-column layout at 560px+. If the hint is shortened in a future pass, do not remove the past-returns disclaimer — move it to the `results-note` instead. Advisory only.

---

## Summary of Findings

| ID | Severity | Description |
|---|---|---|
| UX-001 | Medium | No scroll-to-results on first render; headline and callout below fold on 375px |
| UX-002 | Medium | No focus management when results section first renders; keyboard users have no cue |
| UX-003 | Medium | No inline feedback for clamped/out-of-range rate input |
| UX-004 | Low | Callout below chart; consider moving above for faster access to the memorable output |
| UX-005 | Low | Horizon radiogroup does not implement roving tabindex arrow-key pattern per ARIA APG |
| UX-006 | Low | Rate hint length at 22 words adds vertical height asymmetry in two-column layout |

---

## Sign-Off Decision

The tool is structurally sound. The input model is correct, the reactive pattern is well-suited to the tool's purpose, and the information architecture is progressive and appropriate for the Finxiety user. The first-use framing, trust signals, and shame-avoidance patterns are all implemented correctly. Brand has cleared (F-DNH-1 resolved). QA has cleared conditionally (pending build gate F-001).

Three medium findings (UX-001, UX-002, UX-003) must be resolved before distribution. They do not block further gate reviews (behavioral-science, disability-accessibility) but must land in the same ship cycle as the tool. All three are implementable without architectural changes to the page structure.

UX-001 (scroll-to-results) carries the highest user-facing impact because it determines whether the most memorable output in the tool — the personalized compounding callout — is actually seen by the majority of mobile users.

```
⟦UX-BLOCKED⟧ tool="compound-interest" ticket="COMPOUND-1" date="2026-06-21" blockers="UX-001: no scroll-to-results on first render (headline and callout below fold at 375px); UX-002: no focus management after first render (keyboard users have no cue that results appeared); UX-003: no inline feedback for clamped/out-of-range rate input" low-priority-open="UX-004 callout placement, UX-005 radiogroup arrow-key pattern, UX-006 rate hint length" clear-to-continue-gates="yes — behavioral-science and disability-accessibility reviews may proceed in parallel"
```

---

## Re-Verification: Medium Blockers — 2026-06-21

**Reviewer:** design-ux (claude-sonnet-4-6)
**File verified:** `finxiety/src/routes/tools/compound-interest/+page.svelte`
**Verification method:** Static code inspection, full file read

### UX-001 — Scroll to results on first render

RESOLVED.

Lines 156-166: `$effect` watches `hasInputs`. When `hasInputs` is true and `!firstResultShown && headlineEl`, it sets `firstResultShown = true` and calls `headlineEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' })`. The `else` branch resets `firstResultShown = false` when `hasInputs` returns to false, correctly re-arming the effect for a second first-render if the user clears all inputs.

`firstResultShown` is declared as a plain `let` (line 154), not `$state` — correct. It is non-reactive and will not trigger Svelte's reactivity system when set.

`headlineEl` target is `<div class="headline" tabindex="-1" bind:this={headlineEl}>` at line 288.

### UX-002 — Focus after first render

RESOLVED.

`headlineEl.focus()` is called on line 161, immediately after `scrollIntoView`, inside the same `!firstResultShown && headlineEl` guard. The headline `<div>` has `tabindex="-1"` (line 288) making it programmatically focusable without entering tab order. Focus-visible ring defined at lines 801-806 (`outline: 2px solid var(--pine); outline-offset: 4px`).

The `aria-live` region for screen reader announcement (line 283-285) remains in place alongside the programmatic focus, covering both modalities.

### UX-003 — Inline feedback for out-of-range rate input

RESOLVED.

`rateWarning` derived at lines 148-151: returns the negative-rate message when `rateStr !== '' && Number(rateStr) < 0`, and the high-rate advisory when `rateStr !== '' && Number(rateStr) > 50`. The empty-string guard correctly suppresses the warning on initial load.

Rendered at lines 247-249 as `<p class="field-hint rate-warning" role="alert">{rateWarning}</p>` inside `{#if rateWarning}`. The `role="alert"` ensures screen readers announce the message on appearance. `.rate-warning` styles it in `var(--terracotta)` (lines 796-799).

Secondary consistency check: the `rate` derived at line 19 uses `Number(rateStr) || 0` (falsy coercion), so a user entering `-3` produces `rate = 0` while `rateStr` remains `"-3"`. The `rateWarning` derived checks `rateStr` directly, so the warning fires correctly even though `rate` has already been clamped to 0. The two derivations are consistent.

---

### Re-Verification Summary

| ID | Severity | Prior status | Post-fix status |
|---|---|---|---|
| UX-001 | Medium | FAIL | PASS |
| UX-002 | Medium | FAIL | PASS |
| UX-003 | Medium | FAIL | PASS |
| UX-004 | Low | Advisory open | Advisory open — does not block |
| UX-005 | Low | Advisory open | Advisory open — does not block |
| UX-006 | Low | Advisory open | Advisory open — does not block |

All three medium blockers are resolved. No new issues introduced by the fixes. Low advisories remain open and are carried forward for a future pass.

```
⟦UX-REVIEWED⟧ tool="compound-interest" ticket="COMPOUND-1" date="2026-06-21" resolved="UX-001, UX-002, UX-003" low-priority-open="UX-004, UX-005, UX-006" gate="CLEAR"
```

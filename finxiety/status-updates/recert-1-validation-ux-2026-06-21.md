# UX Review: RECERT-1 — Recertification Deadline Tracker

**Date:** 2026-06-21
**Reviewer:** design-ux agent
**Source files reviewed:**
- `finxiety/src/routes/tools/recertification/+page.svelte`
- `finxiety/src/lib/data/certification-periods-2026.json`
**Viewport target:** 375px phone-first

---

## Nielsen Checklist

| Heuristic | Status | Notes |
|---|---|---|
| Visibility of system status | PASS | `aria-live` region announces step transitions. `Step N of 3` indicator visible above fold on each step. Download button transitions to `copy-status` with `role="status"`. |
| Match between system and real world | PASS | Generic labels ("SNAP / food benefits", "Medicaid / health coverage") used before state selection, then resolved to state-specific labels (CalFresh, Medi-Cal, AHCCCS) from data. Language is plain throughout. |
| User control and freedom | PASS | Back button present on step 2. Start over available on step 3. No dead ends. |
| Consistency and standards | PASS | Signpost-box, btn-primary/secondary, field-hint, and cert-block patterns match the DOC-1 and TIP-1 corpus. |
| Error prevention | PARTIAL | Next button is disabled until `canLeaveStep1` is satisfied. Show my reminders is disabled until every chosen program is resolved. However, the date input has no `min` constraint (see Finding 1 below). |
| Recognition rather than recall | PASS | Step 3 repeats the state name inline ("typical certification periods in [state]"). The last cert date is echoed back ("starting from [date]") in the result card. |
| Flexibility and efficiency | PASS | One-program path and two-program path both work. "I don't know" path keeps the user moving without forcing a date. |
| Aesthetic and minimalist design | PASS | No decorative chrome. Every element earns its place by Ive criteria (see Ive section below). One concern: `result-detail` runs long at 375px (see Finding 3). |
| Help users recognize, diagnose, recover from errors | PASS | Past-deadline state is handled with a calm signpost box pointing to 211. No red, no alarm language. "I don't know" state gives a specific recovery path (approval notice or 211). |
| Help and documentation | PASS | Each result card links to the official agency source. Privacy note at the bottom of step 3 is unobtrusive and present. |

---

## Norman Principles

**Affordances:**
Strong. Checkboxes have 44px hit targets (`min-height: 44px` on `.program-label`). Date input visually matches the select field in height and border weight. The disabled state on Next is clearly communicated via `opacity: 0.45` and `cursor: not-allowed`. The download button is styled identically to primary CTAs elsewhere — unambiguous.

One affordance gap: the `.ics` download button is labeled "Download reminders." Nothing in the button itself signals what "reminders" means in concrete terms. The hint text below clarifies ("Opens in Apple Calendar, Google Calendar..."), but on a quick scan the button could be read as downloading a PDF or document. The hint is visible but small (`.field-hint` is 0.8125rem). See Finding 2.

**Feedback:**
Excellent. Focus moves programmatically to the step-2 and step-3 headings via `bind:this` + `tick()` + `.focus()`. The `aria-live="polite"` region announces step transitions to screen reader users. The submit-hint paragraph uses `aria-live="polite"` to surface eligibility gate reasons without page reload. `downloadStatus` uses `role="status"` and `aria-live="polite"`.

One feedback gap: when the user taps "Download reminders" and the download actually succeeds, the `downloadStatus` message is displayed at 0.8125rem in `var(--muted)` — small, low-contrast relative to body text. Screen reader announces it, but sighted users on a small screen may miss it. See Finding 4.

**Constraints:**
The date input has a `max={todayIso}` constraint, correctly preventing a future last-certification date. However, there is no `min` constraint. A user can enter a date from 1950, which would generate a deadline 70+ years in the past and trigger the past-deadline state confusingly. The past-deadline path handles it gracefully, but the confusion is unnecessary. See Finding 1.

The state selector is filtered to only SUPPORTED_STATES — a well-executed constraint. The unsupported state signpost box handles any case where state data is missing.

**Conceptual model:**
The tool presents as a three-step wizard: select programs + state, enter dates, see results. This matches the user's mental model of "tell me what you have, I'll tell you what's coming." The step indicator ("Step 1 of 3") reinforces this. The jump from step 2 to results is immediate (no loading state), which is correct since calculation is synchronous — no false affordance of async work.

One model concern: the unsupported-state signpost appears inside the form at step 1, below the select, but the Next button is still disabled and there's no heading or container that distinguishes the "we can't help you right now" state from "keep filling this in." A user who selects an unsupported state then scans down sees a note and a disabled button with no clear instruction. See Finding 5.

---

## Ive Restraint Test

**Elements that can be removed:**
- The `<hr class="divider">` between the intro paragraph and step 1 (line 270) adds structural weight without communicating anything the whitespace and step indicator don't already communicate. It is not present in steps 2 or 3. Either use it consistently or remove it from step 1.
- The `<p class="step-indicator" aria-hidden="true">Step {step} of 3</p>` at the top of every step (line 268) conveys progress. The `aria-live` region on transitions (lines 249-255) does the same work for screen readers. Both are correct and necessary. No redundancy to cut.

**Visual hierarchy:**
Sound at 375px. `h1` (page title) > `h2` (step heading) > `h3` (result card title) is a clean three-level hierarchy. The result-date / result-due / result-detail progression inside each card reads correctly: the bold date is the primary datum, the days-until phrase is secondary context, the methodology detail is tertiary.

One hierarchy note: `.result-due` uses `color: var(--olive)` and `font-weight: 700`. For the past-deadline state, this class renders "The estimated date has already passed." in olive bold — visually treating a past deadline identically to a future countdown. The past-deadline text should be neutral weight and color to match the calm signpost box that follows it. As-is, the bold olive styling on past-deadline text adds unintended alarm weight. See Finding 6.

---

## Simon Memory Test

**The one memorable output:**
Step 3 surfaces one of two things: "Estimated next recertification: [Month Day, Year]" in bold, or "The estimated date has already passed." Both are concrete and memorable. This is correct. The user will leave remembering a date or a direction to take action. The `describeDue()` function adds the days/months plain-language gloss below the date, which reinforces the memory without cluttering the primary output.

**Cognitive load assessment:**
Low to medium. The three-step structure progressively discloses complexity. Step 1 is two questions. Step 2 is one question per program with an explicit escape hatch. Step 3 is results. No step requires the user to hold information from a prior step in working memory — it is all echoed back.

One load concern: when both programs are selected and both have dates, step 3 renders two result cards, each with: a date, a days-until phrase, a 3-sentence detail paragraph, a conditional signpost (mid-cert note), and a source link. At 375px this is approximately 400-450px of stacked content per card before the download block. Two cards puts the download CTA well below the fold on most phones. See Finding 7.

---

## Financial Anxiety Overlay

**Shame signals:**
None found. The "I don't know" path uses "No problem." framing and a forward path. The past-deadline path uses neutral language ("the estimated date has already passed") and immediately redirects to 211. There is no red, no warning icon, no language that reads as a verdict about the person.

One subtle concern: the `excludedPrograms` signpost (step 3) says "We left [program] out of the reminders because we don't have a last renewal date for it." This is accurate and non-shaming, but it sits in the results section where a user might read it as a failure state. The framing is already good — "come back and we'll add it in" is forward-facing. No change required; noting it as intentionally handled.

**Trust signals:**
Strong. Present on every result card: official agency source link, explicit "This is an estimate" language, reference to the approval notice as the authoritative source. Privacy note at the bottom of step 3 ("Nothing here is saved or sent anywhere") is appropriately understated — present but not defensive.

The `.ics` calendar event descriptions (built in `buildDescription()`) also include the estimate disclaimer and the document checklist URL. Trust is carried through into the calendar artifact itself. This is excellent.

**Cognitive load:**
Low on steps 1 and 2. Medium on step 3 when two programs are in play (see Finding 7). The "I don't know" path correctly reduces load by giving a next step rather than a dead end.

---

## Required Changes Before Build

**Critical**

None.

**High**

**Finding 1 — Date input: no `min` constraint allows implausible historical dates (line 357)**
The `<input type="date">` on step 2 sets `max={todayIso}` but no `min`. A user entering a date from a decade ago will trigger the past-deadline path with a result like "The estimated date has already passed" and no calendar download — a confusing outcome that looks like a tool error rather than a user input issue. The past-deadline signpost gives correct recovery guidance, but the confusion is preventable.

Prescribed fix: Add `min="2010-01-01"` (or a computed value of today minus 10 years) to the date input. This prevents dates so old the estimate is meaningless while allowing enough history for longer certification periods. Pair with a plain-language hint below the input: "Enter the date on your most recent approval or renewal notice."

**Finding 2 — Download button affordance does not name the format (lines 461-465)**
"Download reminders" could mean a PDF, a print view, or a text list. The hint below names Apple Calendar and Google Calendar but the button label does not. On a phone, small hint text below a large button is easy to miss — especially for a user scrolling fast.

Prescribed fix: Change the button label to "Add reminders to my calendar" or "Download calendar reminders (.ics)." The current hint text ("Opens in Apple Calendar, Google Calendar, or any calendar app") can stay as-is below the button to confirm the behavior.

**Medium**

**Finding 3 — `result-detail` paragraph runs long at 375px (lines 419-425)**
The detail paragraph reads: "Based on a [N]-month certification period, starting from [date]. The estimated renewal window is based on typical periods in [state]. Your actual deadline appears on your approval notice." At 375px, with 15px padding on each side, this is approximately 5-7 lines of text. It is explanatory and accurate, but it pushes the source link (and the second card, if present) further below the fold.

Prescribed fix: Split into two shorter lines or reduce to one sentence: "Based on a [N]-month period from [date], for [state]. Verify with your approval notice." The source link already does the work of pointing to the official source — the second sentence in the detail paragraph is partially redundant.

**Finding 4 — `downloadStatus` success message is visually undersized (line 468)**
At 0.8125rem in `var(--muted)`, the confirmation message after a successful download is technically present but poorly weighted against a phone's ambient visual noise (low ambient light, small screen). Screen readers get it; sighted users on a phone may miss that anything happened at all.

Prescribed fix: After a successful download, increase the `copy-status` font-size to 0.9375rem (matching `result-detail`) and use `var(--text)` instead of `var(--muted)` for at least 3 seconds. A time-limited inline style swap or a brief CSS class toggle (`download-confirmed`) would achieve this without adding a new element.

**Finding 5 — Unsupported state leaves the Next button disabled without a clear action (lines 307-315)**
When a user selects an unsupported state, the signpost box explains why we can't help, but the Next button is still visibly disabled with no path to "what should I do instead?" The submit-hint reads "Pick at least one benefit and a state we have data for to continue" — which is accurate but feels dismissive when the user has already picked a state and it just doesn't work.

Prescribed fix: When `selectedState !== '' && !stateSupported`, replace the submit-hint text with "We don't have data for [state name] yet — try selecting a different state, or check your approval notice for your exact date." This surfaces the same information as the signpost box in the action zone, making the path forward obvious without requiring the user to read both the signpost and the hint.

**Finding 6 — Past-deadline `.result-due` styled as olive bold (line 409)**
The `.result-due` class applies `font-weight: 700` and `color: var(--olive)`. For future deadlines this is appropriate — olive weight draws attention to the countdown phrase. For the past-deadline state ("The estimated date has already passed."), the same styling adds unintended alarm weight, because olive-on-white bold text reads as a flag, not a neutral statement.

Prescribed fix: Conditionally apply a modifier class to `.result-due` when `r.daysUntilDue < 0`: e.g. `class="result-due result-due--past"`. Style `.result-due--past` as `font-weight: 400; color: var(--muted)` to match the calm, neutral tone of the signpost that follows it.

**Low**

**Finding 7 — Two-program step 3 pushes download CTA below the fold at 375px (lines 402-438)**
With both SNAP and Medicaid selected and dated, step 3 renders two full result cards before the download block. On a 375x812 screen, the download CTA lands approximately 900-1000px below the fold. Users who complete the form and see results may not scroll far enough to discover the calendar download.

Prescribed fix: Consider adding a sticky or early-placed download prompt at the top of the results section when `hasDateableResults` is true and `results.length > 1` — for example, a single line above the first card: "Reminders ready — see the download at the bottom of this page." This is a low-lift change that preserves the current layout while solving the discoverability problem on small screens.

**Finding 8 — `<hr class="divider">` present only on step 1 (line 270)**
The divider appears between the intro paragraph and the form on step 1 but not on steps 2 or 3. This is visually inconsistent — it adds structural weight to step 1 that step 2 and 3 don't have, making step 1 feel heavier than the others.

Prescribed fix: Remove the `<hr class="divider">` from step 1. The step indicator and the form's own white space provide sufficient separation.

---

## WCAG 2.1 AA Spot-Check (Code-Level)

- All form inputs have explicit `<label for="...">` associations or wrapping `<label>` elements. Pass.
- Fieldsets use `<legend>` correctly for grouped checkboxes. Pass.
- `tabindex="-1"` on step headings enables programmatic focus without adding them to tab order. Pass.
- The `aria-live="polite"` region at the top of the page correctly announces transitions. Pass.
- `aria-hidden="true"` on the decorative arrow span in source links (line 436). Pass.
- The `role="note"` on signpost boxes is semantically appropriate. Pass.
- All buttons have visible `:focus-visible` outlines (3px solid terracotta). Pass.
- The `disabled` attribute on the Next button is a native attribute — fully conveyed to assistive technology without needing `aria-disabled`. Pass.
- `.sr-only` pattern used for the live region — assuming this class is defined in global styles (confirmed present in the DOC-1 corpus). Pass.

One code-level concern: the `copy-status` paragraph at line 468 renders an empty string by default (`{downloadStatus}`), leaving a `<p>` with `min-height: 1.2rem` but no content. Some screen readers may announce this as a focusable empty element. The `aria-live="polite"` attribute means it will be announced when populated, which is correct. No change needed, but the `min-height` placeholder is doing layout work — document that as intentional to prevent future removal.

---

## Summary Verdict

RECERT-1 is well-constructed. The three-step wizard pattern is clean, the "I don't know" path is handled correctly, focus management is implemented, and trust signals are present throughout — including inside the `.ics` artifact itself. No critical issues found. Two high-severity findings (date `min` constraint and download button label) must be resolved before shipping. Four medium findings address past-deadline styling, download feedback weight, unsupported-state messaging, and result card verbosity at 375px. These are buildable fixes, not rearchitecting.

⟦UX-BLOCKED⟧

Blocked on Finding 1 (High — date input missing `min` constraint) and Finding 2 (High — download button affordance does not communicate format). Resolve both and re-submit for sign-off. All other findings are queued for the same pass.

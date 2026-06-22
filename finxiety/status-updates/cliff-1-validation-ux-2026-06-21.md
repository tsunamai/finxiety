## UX Review: Benefits Cliff Calculator — CLIFF-1

**Date:** 2026-06-21
**Reviewer:** design-ux agent
**Files reviewed:**
- `finxiety/src/routes/tools/cliff-calculator/+page.svelte`
- `finxiety/src/app.css`
- `finxiety/research-findings/persona-alice-primary-user.md`
**Gate sequence:** QA cleared (⟦QA-VERIFIED⟧ 2026-06-21), Brand cleared (⟦BRAND-REVIEWED⟧ 2026-06-21). This is gate 2 of 5 (UX).

Prior QA findings F-1, F-2, F-3 were all fixed and re-verified by QA before this review. This review does not re-litigate those findings; it proceeds from the fixed state of the file.

---

### Nielsen Checklist

| Heuristic | Status | Notes |
|---|---|---|
| 1. Visibility of system status | PASS | `aria-live="polite"` region announces when results are ready. Submit button disabled state signals that the form is not ready to proceed. `aria-expanded` on paycheck/annual converter toggles signals open/closed. No ambiguous states found. |
| 2. Match between system and real world | PASS | "CalFresh (food assistance)" and "Medi-Cal (health coverage)" both carry the plain-language description in parentheses. "Over the income limit" is plain English. "Right now" and "At the new income" are conversational. No program codes, no government jargon used standalone. |
| 3. User control and freedom | PASS WITH NOTE | The form is always visible above results; the user can change inputs and resubmit at any time. There is no destructive confirm step. Results replace in place without clearing inputs. Minor note: once results render, the page is long and the form is far above. There is no "back to form" anchor or scroll shortcut. Not a FAIL -- but if testing shows users struggle to locate the form on return, a scroll-to-form link would resolve it. |
| 4. Consistency and standards | PASS | Label-hint-input ordering is consistent across all four fields. Toggle buttons for converters follow the same pattern (button with `aria-expanded`, focused input on open, returns focus to trigger on close). Verdict box variants all use the same structural layout. Terminology consistent with other Finxiety tools. |
| 5. Error prevention | PASS | Submit button remains disabled until both income values and household size are valid. Household size is a select (impossible to enter an invalid value). The `min="0"` attribute on income inputs constrains browser-native spin behavior. No opportunity for the user to submit a broken state. |
| 6. Recognition rather than recall | PASS | The comparison grid shows both income values and all program statuses side-by-side. The verdict box repeats the income delta in prose. The user does not need to remember what they entered; the results carry the inputs as context. |
| 7. Flexibility and efficiency | PASS | The paycheck and annual salary converters are progressive disclosures -- invisible to users who already know their monthly income, available on one tap for users who think in paychecks or annual salary. The primary path (type monthly income, submit) is two fields and a button. No forced detours. |
| 8. Aesthetic and minimalist design | PASS WITH NOTE | The tool is lean. Unnecessary decoration is absent. One issue: the `submit-hint` ("Enter your current and proposed income to continue") is visible on page load before the user has touched anything. See UX-1. |
| 9. Help users recognize, diagnose, recover from errors | PASS | There are no error states because invalid states are prevented at the input level. The disabled button plus `aria-live` hint adequately covers the "not ready" state without using an error message pattern. |
| 10. Help and documentation | PASS | Field hints explain exactly what each input expects. "Gross (before taxes). Enter 0 if not currently working." is specific and accurate. The `hasChildUnder5` checkbox is explained inline. The results section carries a plain-language note about what the estimates cover and where they come from. |

---

### Norman Principles

**Affordances:** All interactive elements use standard HTML controls -- inputs, selects, buttons. Nothing requires discovery or invention. The `btn-ghost` toggle buttons for the converters look and behave like text links, which is appropriate for an optional utility affordance that should not compete with the primary inputs. The "Show me what changes" primary button is full-width, minimum 48px, and uses the `btn-primary` treatment -- unmistakably the primary action.

**Feedback:** Submit produces immediate result rendering and programmatic focus to the result heading (confirmed: `resultHeadingEl?.focus()` after `await tick()` in `handleSubmit`). The paycheck and annual converters provide inline previews ("That's about $X/month") as the user types, before they confirm -- correct real-time feedback that helps the user validate the conversion before committing it. The `aria-live` announcement ensures screen reader users also receive the state change confirmation.

**Constraints:** Household size is constrained by a select (1-8, no free entry). Income inputs use `type="number" inputmode="decimal" min="0"`. The `canSubmit` derived value enforces that both income fields are populated and proposed income is greater than zero before the primary action becomes available. There is no path to a broken result state through normal interaction.

**Conceptual model:** The tool's mental model is a side-by-side comparison with a net verdict. The label-input-calculate-compare structure matches how a person would think through this decision manually. "You earn X now. You'd earn Y. Here's what each looks like, and here's the net." The comparison grid (two cards, side by side at 560px+, stacked on mobile), followed by the verdict box, followed by the chart, is a logical information cascade: specific details first, summary second, context third. The chart extends the model by showing the user where they sit on the full curve -- it moves from "your comparison" to "the landscape." This is the right conceptual order.

---

### Ive Restraint Test

**Elements that can be removed:**

- The `submit-hint` paragraph ("Enter your current and proposed income to continue") on lines 376-379 renders on page load before any user interaction. It is not an error; it is a pre-emptive instruction for a state the user hasn't triggered yet. It adds visual noise without aiding the user at their arrival moment. The disabled button state already communicates "not ready." This element is redundant before interaction and the `aria-live` attribute means it fires again when the user has begun entering data -- which is also the wrong moment for a readiness message. See UX-1.

- The `change-flag` span inside `program-value.ineligible` for Medi-Cal (line 451-453) reads "Over the income limit changes" because the word "changes" is appended inside the ineligible text block without visual or textual separation. The semantic intent is good (signal that this row is changing) but the execution adds a small badge that competes with the "Over the income limit" message. The `.changing` CSS class on the `program-row` already highlights the row with a background wash. The badge is doing redundant work for sighted users and broken work for screen readers (see UX-3). Remove the badge; rely on the row highlight and the verdict box to carry the "this changed" signal.

**Visual hierarchy:** The results hierarchy is clear: H2 (the comparison label) -> results note -> comparison grid -> verdict box -> conditional Medi-Cal note -> chart -> employer questions -> sources. The verdict box correctly uses `border-left` color to communicate outcome polarity (terracotta / olive / neutral) without using red -- this is the right signal. One hierarchy concern: the H2 result heading ("At $X/month vs. $Y/month") describes the comparison parameters but does not itself convey the verdict. The user must read down to the verdict box to understand whether this is good or bad news. At 375px, the two stacked scenario cards can consume significant vertical space before the verdict box appears. This is the primary information-hierarchy gap. See UX-2.

---

### Simon Memory Test

**The one memorable output:** The tool does produce a candidate memorable output -- the net delta figure in the verdict box ("+$X/month" or "-$X/month net change"). This is the number Dani will carry with her. The verdict-summary text directly below it frames the concept in plain language ("This is the benefits cliff"). The combination of the delta figure and the cliff naming is strong.

**However:** At 375px, the net delta is not the first result element Dani sees after submit. After the page scrolls to the H2 result heading (which focus management lands on), the visual sequence is: heading -> results note -> scenario card 1 (Right now) -> scenario card 2 (At the new income) -> verdict box with net delta. The two scenario cards are individually valuable, but they delay the memorable output. On a 375px screen with the heading and results note taking ~80px and each stacked scenario card taking ~180px, the net delta is approximately 440px below the result heading -- likely below the fold. Dani has to scroll to reach the number she came for. This undermines the Simon principle: the memorable output should be where attention lands, not where it arrives after work.

**Cognitive load assessment:** The form is four fields with two optional progressive disclosures. This is appropriate. The results section asks the user to synthesize a comparison grid, a verdict box, a conditional Medi-Cal note, a chart, optional employer questions, and a sources section. The conditional rendering (Medi-Cal note only when losing Medi-Cal, employer questions only when netDelta < 100 with benefit loss) reduces load appropriately -- the page shows less when there is less to say. The chart is supplementary context, not the primary answer, which is the right framing.

**The 24-hour memory question:** What will Dani remember the day after using this tool? She will remember whether the raise was net positive or net negative, and by approximately how much. The tool is structured to produce this memory. The risk is that the pathway to that memory -- scrolling through two scenario cards before reaching the verdict box -- creates enough friction that she may not absorb the net delta cleanly during a short session on a phone.

---

### Financial Anxiety Overlay

**Shame signals:** None found. "Over the income limit" is neutral description, not judgment. The tool never tells Dani she is "losing" something or made a mistake. The cliff scenario text names the systemic phenomenon ("This is the benefits cliff") rather than characterizing the user's situation as bad luck or failure. The employer questions section uses third-person framing ("Questions some people ask") which removes directional judgment entirely. The results-note disclaimer ("California programs only. Estimates based on published income thresholds. Your exact benefit depends on your specific situation and what your county processes.") is calibrated -- it sets expectations without suggesting the tool might produce alarming inaccuracies.

**Trust signals:** Present and well-placed. The results-note appears immediately below the H2, before any numbers. All CalFresh benefit estimates carry both a tilde (~) and the word "estimated." The sources section is present, specific, and includes a data freshness date. The "nothing saved" signal is in the meta description (discoverable before the tool loads). The Medi-Cal note correctly says "you would likely no longer qualify" -- hedged appropriately.

One gap: the `aria-live` announcement "Your benefits cliff comparison is ready below" (line 213-215) uses the phrase "benefits cliff comparison." This is accurate and non-alarming. However, for a user in Scenario B (crisis state -- just got a job offer, anxious about the math), "benefits cliff" in the announcement text may land as alarm before they've seen the results. This is a marginal concern; the phrase is clinically accurate and has been established as the tool's name. Not flagging as a required change, but noting it.

**Cognitive load:** Medium, trending toward the right end of acceptable. The form is low load. The results section is medium load because it contains multiple sequential sections. The conditional rendering keeps the worst-case scenario (cliff + losing Medi-Cal + employer questions) from being overwhelming by spreading the sections down the page. The chart is labeled and described in prose before it appears, which prevents the "what am I looking at" moment.

The primary cognitive load risk is the distance between result heading and verdict box at 375px (see UX-2). If Dani has 8 minutes and is reading on a phone at a bus stop, she needs the net delta to appear before she runs out of attention. The current layout does not guarantee this.

---

### Required Changes Before Build

**UX-1 — Remove the pre-interaction submit-hint (MEDIUM)**

File: `+page.svelte` lines 375-379

The `{#if !canSubmit}` block renders the hint "Enter your current and proposed income to continue" immediately on page load, before the user has touched any field. This is not an error state -- the user hasn't done anything wrong. Showing a readiness instruction before interaction reads as a pre-emptive correction. It adds text below the primary button that competes with the button's own label ("Show me what changes") for the user's next-action attention.

The disabled state of the button is itself the signal that the form is not ready. The `aria-live` attribute on the hint means assistive technology will announce the text on load, which may confuse screen reader users who arrive at a page and immediately hear "Enter your current and proposed income to continue" with no context of what just happened.

Recommended fix: Change the condition so the hint only appears after the user has begun interacting -- for example, after either income field has been touched (use a `touched` state flag set on the first `input` event on either income field). Or remove the hint entirely and rely on the button's disabled state and label to carry the readiness signal.

**UX-2 — Move net delta above the comparison grid on mobile (HIGH)**

File: `+page.svelte` lines 383-507

At 375px, the two stacked scenario cards place the verdict box (containing the net delta) approximately 440px below the result heading focus point. Dani's memorable output -- the number she came for -- is below the fold on mobile after the result is calculated and focus has been delivered to the H2.

This is the tool's primary information architecture problem. The Simon principle and the ALICE persona both point to the same fix: the net verdict must be the first thing the user sees after submitting, not the third.

Recommended fix: Reorder the results section so the verdict box appears immediately below the H2 result heading and results-note, before the comparison grid. The comparison grid becomes supporting detail that the user can read for specifics after seeing the headline verdict. The structure becomes:

1. H2: "At $X/month vs. $Y/month" (focus lands here)
2. Results-note (the estimate disclaimer)
3. Verdict box (net delta + verdict summary -- the memorable output)
4. Medi-Cal note (conditional)
5. Comparison grid (program-by-program detail)
6. Chart
7. Employer questions (conditional)
8. Sources

This is an information hierarchy inversion -- summary before detail -- which matches both how the user's question is structured ("am I better off?") and how people scan on phones.

Note: Contrast with desktop. At 560px+ the comparison grid renders as a side-by-side two-column layout. Moving the verdict above the grid would mean the grid becomes a drill-down below the verdict on all screen sizes. This is still correct behavior -- the user gets the verdict, then can read the detail. The comparison grid is not invalidated by this change; it is repositioned from "first thing" to "supporting evidence."

**UX-3 — Fix broken screen reader text in the Medi-Cal `change-flag` span (MEDIUM)**

File: `+page.svelte` lines 449-454

The `change-flag` span containing "changes" is rendered inside the `program-value.ineligible` span, which reads "Over the income limit." The concatenated screen reader output becomes "Over the income limit changes" which is not grammatical and does not convey the intended meaning (that this program's status is changing between scenarios).

The `.changing` CSS class on the parent `program-row` already applies a background highlight to signal the change for sighted users. The change-flag badge is doing redundant visual work and broken aural work.

Recommended fix: Remove the `change-flag` span entirely. Rely on the comparison between "Right now" and "At the new income" cards, the `.changing` row highlight, and the verdict box to communicate that Medi-Cal status is changing. If an explicit text signal is needed for AT, add a visually-hidden but screen-reader-visible descriptive phrase within the row label or as a separate `sr-only` span that says something complete, like "Medi-Cal eligibility changes at this income."

---

### Findings Summary

| ID | Severity | Description | Action required |
|---|---|---|---|
| UX-1 | Medium | Submit-hint renders on page load before any interaction; adds noise and fires on `aria-live` unprompted | Add interaction guard (touched state) or remove hint; rely on disabled button state |
| UX-2 | High | Net delta (the memorable output) appears below the fold on 375px because comparison grid precedes verdict box | Move verdict box above comparison grid in results DOM order |
| UX-3 | Medium | `change-flag` span ("changes") concatenates with "Over the income limit" producing broken screen reader text | Remove change-flag span; retain `.changing` row highlight |

---

### Sign-Off Decision

UX-2 is a high-severity information architecture problem. On the primary user's primary device (phone, 375px), the most important output -- the net delta -- is below the fold after submission. The persona documentation is explicit: Dani has five to ten minutes and will not scroll for the answer. This is the tool's core value proposition and it must be above the fold.

UX-1 and UX-3 are medium severity but both are quick to fix (one state flag, one span deletion). None of the three findings require changes to the calculation logic or the style system.

The tool does not have a clean path to ⟦UX-REVIEWED⟧ until UX-2 is resolved. UX-1 and UX-3 must be fixed before distribution.

⟦UX-BLOCKED⟧ tool="benefits-cliff-calculator" ticket="CLIFF-1" date="2026-06-21" blockers="UX-2 (verdict box below fold at 375px — net delta not the first result the user sees), UX-1 (submit-hint fires on page load before interaction), UX-3 (change-flag span produces broken screen reader text)"

---

## Re-Verification: UX Blockers CLIFF-1

**Date:** 2026-06-21
**Reviewer:** design-ux agent
**Re-verification scope:** UX-1, UX-2, UX-3 only. No new findings raised in this pass.

### UX-2 (HIGH) -- Verdict box above comparison grid

**Claimed fix:** verdict-box moved to render before comparison-grid.

**Verified against:** `+page.svelte` lines 390-544.

DOM order inside `{#if submitted && result}`:

1. `<h2>` result heading (line 392)
2. `results-note` paragraph (lines 395-398)
3. `verdict-box` div (lines 401-438)
4. `medi-cal-note` conditional (lines 441-463)
5. `cliff-signpost` conditional (lines 466-470)
6. `comparison-grid` div (lines 472-544)
7. `chart-section` (lines 547-641)
8. `scope-note` (lines 644-646)
9. `employer-questions` conditional (lines 649-665)
10. `sources` (lines 668-677)

This matches the specified order exactly. At 375px the net delta in the verdict-box is the first substantive result element after the heading and disclaimer note. The comparison grid is now supporting detail below the headline verdict.

**Status: RESOLVED.**

### UX-1 (MEDIUM) -- Submit hint gated behind touched state

**Claimed fix:** `let touched = $state(false)` added; `oninput` handlers on both income inputs set `touched = true`; hint condition changed to `{#if !canSubmit && touched}`.

**Verified against:** `+page.svelte` lines 35, 247, 312, 383-387.

- Line 35: `let touched = $state(false);` -- state variable initialized false.
- Line 247: `oninput={() => { touched = true; }}` on current-income input.
- Line 312: `oninput={() => { touched = true; }}` on proposed-income input.
- Lines 383-387: `{#if !canSubmit && touched}` guards the hint block.

On page load `touched` is `false`; the hint does not render. The hint appears only after the user has interacted with either income field and the form is still not submittable. The `aria-live` announcement no longer fires on arrival.

**Status: RESOLVED.**

### UX-3 (MEDIUM) -- change-flag span removed from Medi-Cal ineligible text

**Claimed fix:** `{#if result.losingMediCal}<span class="change-flag">changes</span>{/if}` removed from inside the `.ineligible` span; `.changing` row class retained for visual indication.

**Verified against:** `+page.svelte` lines 525-531.

The Medi-Cal program-row in the proposed income card reads:

```
<div class="program-row {result.losingMediCal || result.gainingMediCal ? 'changing' : ''}">
    <span class="program-name">Medi-Cal (health coverage)</span>
    {#if result.proposed.mediCalEligible}
        <span class="program-value eligible">Free coverage</span>
    {:else}
        <span class="program-value ineligible">Over the income limit</span>
    {/if}
</div>
```

No `change-flag` span is present. The `.ineligible` span contains only "Over the income limit" -- screen reader output is clean. The `.changing` class fires the background highlight for sighted users when eligibility changes. The accessible change signal is carried by the verdict-box, which now appears above the grid.

Minor observation: the `.change-flag` CSS rule (lines 924-930) is now dead code. Not a blocker -- unused styles are harmless -- but may be removed at the engineer's discretion.

**Status: RESOLVED.**

---

### Re-Verification Summary

| ID | Severity | Original finding | Re-verification result |
|---|---|---|---|
| UX-1 | Medium | Submit-hint rendered on page load before interaction | RESOLVED -- `touched` guard confirmed at lines 35, 247, 312, 383 |
| UX-2 | High | Verdict box below fold at 375px; comparison grid preceded it | RESOLVED -- verdict-box precedes comparison-grid; DOM order verified lines 401-544 |
| UX-3 | Medium | change-flag span produced broken screen reader text | RESOLVED -- span absent from lines 525-531; row highlight retained |

All three blockers are resolved. No new blocking findings identified in this pass.

⟦UX-REVIEWED⟧ tool="benefits-cliff-calculator" ticket="CLIFF-1" date="2026-06-21"

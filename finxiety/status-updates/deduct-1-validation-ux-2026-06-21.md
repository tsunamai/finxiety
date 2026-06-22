# UX Review: Tax Clarity — DEDUCT-1

**Date:** 2026-06-21
**Reviewer:** design-ux agent
**Files reviewed:**
- `finxiety/src/routes/tools/tax-clarity/+page.svelte`
- `finxiety/status-updates/deduct-1-validation-brand-2026-06-21.md`
**Viewport target:** 375px phone-first
**Brand status at review:** BRAND-REVIEWED (no violations)
**QA status at review:** QA-VERIFIED (two non-blocking findings)

---

## Nielsen Checklist

| Heuristic | Status | Notes |
|---|---|---|
| Visibility of system status | PASS | aria-live="polite" on result div; fadeIn animation confirms render; submit buttons labeled with outcome verbs |
| Match between system and real world | PASS | Mode picker gives plain definitions before asking any input; no IRS-register language |
| User control and freedom | PARTIAL FAIL | goBack() and startOver() both present and correct; however both sit below the fold on mobile when a result is visible — discoverable only by scrolling |
| Consistency and standards | PASS | Button labels, field patterns, and dollar-prefix wrap consistent across all three modes |
| Error prevention | PARTIAL FAIL | min="0" and parseAmount() guard are present; however type="number" on iOS allows a minus sign before submit-time validation fires — constraint surfaces after the fact |
| Recognition rather than recall | PASS | result-lead re-states the inputs ("A $X deduction at your Y% bracket"); compare-box re-states original amount; user never has to remember what they typed |
| Flexibility and efficiency | PASS | Credit and refund modes are one input each; deduction mode adds fields only because the calculation requires them |
| Aesthetic and minimalist design | PASS | No decoration; dividers and neutral-box both earn their place |
| Help users recognize, diagnose, recover from errors | PASS | role="alert" on error container; error copy is plain English and action-oriented |
| Help and documentation | PASS | Field hints are inline and anxiety-reducing; "A rough number is fine" and "We only use it to find your bracket" do real work |

---

## Norman Principles

**Affordances:**
Mode cards are the strongest affordance in the tool: min-height 48px, visible border, hover state, right-arrow glyph, full-width tap target. Submit buttons are labeled with outcome verbs ("Show what it saves," "Show what it's worth," "Show what it means") rather than generic "Submit."

One affordance gap: the mode picker uses role="group" with button children. Keyboard users navigate between cards via Tab, not arrow keys. For a three-option set that communicates mutual exclusivity visually, keyboard users expect arrow-key cycling within the group (the radiogroup pattern). The current Tab behavior is not wrong, but it does not match the affordance the visual design communicates.

**Feedback:**
The aria-live="polite" region announces the result to screen-reader users on render. The fadeIn animation confirms the result appeared for sighted users. The feedback loop is complete.

Critical gap: after submission, the result block renders below the form with no scroll-into-view and no focus delivery to the result. On a 375px screen the result is below the fold. The aria-live region handles screen-reader users; sighted mobile users must know to scroll. This is the most significant interaction failure in the tool.

**Constraints:**
min="0" on all inputs, parseAmount() rejecting negatives, isFilingStatus() guard — all solid. novalidate is set on all forms, which disables browser default validation UI and hands control entirely to the JS layer. That is a legitimate pattern here. However, validation surfaces only on submit, not in-flight. For a user who has misread "taxable income" as "gross income," there is no signal until they tap submit. Acceptable for this tool type; noted.

**Conceptual model:**
The step model (mode picker on step 1, form + result on step 2) matches the user's mental model exactly: pick what you want to know, give it a number, see the answer. {#key step} causes the section to re-render cleanly on transition with no leftover DOM state. Correct.

---

## Ive Restraint Test

**Elements that can be removed:**
The "Illustrative" box-label in the refund compare-box (line 406) is semantically ambiguous — a user scanning the compare-box heading reads "Illustrative" as describing the type of comparison rather than its reliability. The illustrative-note below already carries the reliability disclosure. Either relabel to describe the comparison content ("If you'd set it aside monthly") or remove the box-label. The refund mode is the only mode where the box-label does not describe what the box shows.

All other elements earn their place. The hr dividers, neutral-box in refund mode, and mode-arrow glyphs all do structural or affordance work.

**Visual hierarchy:**
result-figure (clamp 2rem-2.75rem, weight 800, terracotta) is the dominant visual element after submission — correct. Compare-box follows. Illustrative-note is smallest and muted — correct priority order.

One hierarchy problem: the illustrative-note sits at the very bottom of the result block, below the compare-box. On a 375px screen a user who reads the headline figure and compare-box but does not scroll further will leave with an uncaveated number. The estimate framing must appear before the compare-box, not after it.

---

## Simon Memory Test

**The one memorable output per mode:**
- Deduction: "A $X deduction only saved me $Y, not $X." The gap between the deduction amount and the actual savings is the insight. Achieved.
- Credit: "A credit is worth more than a deduction of the same size." The dollar differential in the compare-box is the memorable number. Achieved.
- Refund: "$X/month" — converting the annual lump sum into a monthly number is the strongest Simon moment in the tool. The memorable sentence is "My $3,000 refund is $250 I sent them every month." Achieved.

**Cognitive load assessment:**
- Step 1 (mode picker): Low. Three large-tap-target buttons, plain language, no inputs.
- Step 2, credit and refund: Low. One input, immediate result.
- Step 2, deduction: Medium-high. Three inputs; taxable income requires estimation from the user. The field hint ("A rough number is fine. This is your income after the standard deduction — roughly the taxable-income line on last year's return") adequately reduces anxiety. The highest-friction moment in the tool but appropriate to the information required.

---

## Financial Anxiety Overlay

**Shame signals:**
None found. The refund neutral-box ("Neither is wrong — it's about what fits your life.") is exemplary. All result frames present information, not verdicts.

**Trust signals:**
Present, with one gap. The IRS URL is present in the footer on every screen, pulling from data.verify_at — it cannot drift from the actual data file. The illustrative-note pattern appears in all three modes.

Gap: the IRS URL is only in the footer. On mobile with a result rendered, the footer is well below the fold. A user who reads the result and compare-box without scrolling further will not encounter "verify against the official source." The trust signal and the output are not in the same viewport.

**Cognitive load:** Medium overall; low in credit and refund modes, medium-high in deduction mode.

---

## Mode-Switching State Assessment

The {#key step} wrapper causes a full DOM replacement on step transitions. goBack() clears all three result states and nulls the mode. startOver() additionally clears all inputs. There is no scenario where a stale result from a prior mode persists into a new mode's view. State is clean on all transitions.

---

## WCAG Notes

**Color contrast:** var(--terracotta) on result-figure against white. At the clamp floor (2rem, 32px, weight 800), this qualifies as large text under WCAG 2.1 (threshold: 18.67px bold) and requires only 3:1. Confirm the resolved hex value meets 3:1 before distribution. QA flagged this as non-blocking; retaining as an open verification item.

**Touch targets:** mode-card min-height 48px (passes). Submit buttons are full-width. Select has min-height 48px. btn-ghost touch target size not defined in this file — verify it meets 44px minimum in app.css.

**Focus-visible:** Defined for .mode-card and select in this file. btn-ghost and btn-primary focus-visible styles not in this file — verify they exist in app.css.

**aria-live scope:** The live region wraps the entire result block. For the deduction result this produces a long announcement (result-lead + figure + sub + compare-box text + illustrative-note). Scope aria-live to result-lead and result-figure only. Compare-box and illustrative-note are supplementary and should not interrupt the user's screen-reader flow.

---

## Required Changes Before Build

1. **[HIGH] Deliver focus or scroll to result after submission.** After any successful calculation, the result block renders below the form with no scroll-into-view and no focus delivery. On a 375px screen the result is below the fold and a sighted user must know to scroll. Add scrollIntoView({ behavior: 'smooth', block: 'start' }) on the result container after each successful calculation, or add tabindex="-1" to the result-lead paragraph and call focus() after render. The aria-live region already handles screen-reader users; this fixes the sighted mobile path.

2. **[HIGH] Move illustrative-note above the compare-box in all three modes.** The estimate disclosure ("These are illustrative estimates...") currently sits below the compare-box — the last element before the end of the result block. On mobile, a user who reads the headline figure and compare-box without scrolling leaves with an uncaveated number. The estimate label must be visible in the same viewport as the result figure. Move illustrative-note to between result-sub and compare-box, or add a condensed inline caveat directly appended to result-sub. The full note can stay at the bottom as a secondary anchor.

3. **[MEDIUM] Add a "Try another" escape route immediately below the result block.** The "← Pick something else" and "Start over" buttons currently sit in the step-actions group below the fold. The user's natural moment to switch modes is after reading the result — exactly when these buttons are farthest away. Add a single "← Try another" ghost button as the first element after the result block (inside or immediately after .result), before the step-actions. The step-actions group can remain as secondary exits.

4. **[MEDIUM] Adopt the radiogroup keyboard pattern for the mode picker, or add cardinality to each button label.** The three mode cards communicate mutual exclusivity visually but implement as a role="group" with button children. Keyboard users navigate by Tab, not arrow keys, which does not match the picker affordance. Either: (a) convert to role="radiogroup" with role="radio" children (preferred for WCAG AA); or (b) add aria-label to each button that includes the option position, e.g., aria-label="A tax deduction — option 1 of 3."

5. **[MEDIUM] Add an inline IRS source link alongside the illustrative-note.** The official source URL is in the footer, which is below the fold on mobile when a result is showing. Add a brief "Source: IRS 2026 brackets (irs.gov)" link at the end of the illustrative-note in addition to the footer. The trust signal and the output must coexist in the same viewport.

6. **[LOW] Relabel the "Illustrative" box-label in the refund compare-box.** "Illustrative" as a heading describes the box's reliability rather than its content, creating ambiguity for a scanning user. The illustrative-note below already handles the reliability disclosure. Relabel to something that describes what the comparison shows, e.g., "If you'd set it aside monthly" or "The monthly equivalent working for you."

7. **[LOW — verification] Confirm btn-ghost touch target meets 44px in app.css.** Not defined in this file. Required for WCAG 2.1 AA compliance. Confirm before distribution.

8. **[LOW — verification] Narrow aria-live scope to result-lead and result-figure.** The current live region wraps the full result block. For the deduction mode this is a long announcement that includes the compare-box body text. Move aria-live="polite" to a wrapper around result-lead and result-figure only, and let the compare-box and illustrative-note be read by the user on navigation rather than announced automatically on render.

---

Items 1 and 2 are blockers — they directly affect whether the estimate framing and result are usable on a 375px phone. Items 3-5 are required before public distribution. Items 6-8 are low-severity and can be resolved in the same pass.

⟦UX-BLOCKED⟧ ticket="DEDUCT-1" tool="tax-clarity" date="2026-06-21" blockers="result-not-above-fold-on-mobile (item 1), illustrative-note-below-compare-box (item 2)" required-before-distribution="items 3-5" low-severity="items 6-8"

---

## Re-Verification: Blockers 1 and 2
**Date:** 2026-06-21
**Reviewer:** design-ux agent
**File reviewed:** `finxiety/src/routes/tools/tax-clarity/+page.svelte`

### Blocker 1 — Result not above fold on mobile (was: item 1)

RESOLVED.

All three calculate functions are `async`. Each follows the identical pattern: set result state, `await tick()`, then call `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` and `focus()` on the bound result element.

Verified line by line:

- `calculateDeduction` (line 89): sets `deductionResult`, awaits tick, calls `deductionResultEl?.scrollIntoView(...)` then `deductionResultEl?.focus()` (lines 108-109).
- `calculateCredit` (line 112): sets `creditResult`, awaits tick, calls `creditResultEl?.scrollIntoView(...)` then `creditResultEl?.focus()` (lines 122-123).
- `calculateRefund` (line 126): sets `refundResult`, awaits tick, calls `refundResultEl?.scrollIntoView(...)` then `refundResultEl?.focus()` (lines 136-137).

Each result div has `tabindex="-1"` and `bind:this` pointing to the corresponding state variable (lines 277, 356, 422). The `tick()` import is present at line 2. State variables for the three bound elements are declared at lines 53-55. Pattern is correct and consistent across all three modes.

### Blocker 2 — Illustrative-note buried below compare-box (was: item 2)

RESOLVED.

DOM order verified in all three modes:

- Deduction mode (lines 276-313): `result-lead` -> `result-figure` -> `result-sub` -> `illustrative-note` (296-300) -> `compare-box` (302-310). Note precedes box.
- Credit mode (lines 355-379): `result-lead` -> `result-figure` -> `result-sub` -> `illustrative-note` (363-367) -> `compare-box` (369-378). Note precedes box.
- Refund mode (lines 421-455): `result-lead` -> `result-figure` -> `result-sub` -> `illustrative-note` (432-435) -> `compare-box` (437-445) -> `neutral-box`. Note precedes box.

The estimate disclosure is visible in the same viewport region as the headline figure in all three modes. A user on a 375px screen who reads the result figure and stops before the compare-box will encounter the caveat first. Blocker condition is gone.

### Open Items

The three medium advisories from the original review remain open and non-blocking:
- Item 3: "Try another" button placement (medium)
- Item 4: Radiogroup ARIA pattern for mode picker (medium)
- Item 5: Inline IRS source link alongside illustrative-note (medium)

Items 6-8 (low severity) also remain open.

⟦UX-REVIEWED⟧ ticket="DEDUCT-1" tool="tax-clarity" date="2026-06-21" blockers-resolved="result-not-above-fold-on-mobile, illustrative-note-below-compare-box" open-non-blocking="items 3-5 (medium), items 6-8 (low)"

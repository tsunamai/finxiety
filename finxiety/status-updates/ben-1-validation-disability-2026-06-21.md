# BEN-1 (CA Benefits Screener) — Disability & Chronic Illness Accessibility Validation

**Tool:** BEN-1 — CA Benefits Screener (`/tools/screener`)
**Gate:** Disability accessibility (final gate; brand, UX, behavioral passed)
**Persona applied:** Renee — Disability & Chronic Illness User (`finxiety/research-findings/persona-renee-disability-user.md`), held alongside Dani (`finxiety/research-findings/persona-alice-primary-user.md`)
**Reviewer:** disability-accessibility agent
**Date:** 2026-06-21
**Status:** ⟦DISABILITY-REVIEWED⟧ — all blocking findings resolved on re-review (2026-06-21)

---

## Re-Review Outcome (2026-06-21)

All three findings from the initial review have been addressed in `finxiety/src/routes/tools/screener/+page.svelte` and verified.

### Finding #1 (HIGH) — RESOLVED
A second `results-note` was added to the `results-header` (lines 288-291):

> "If your income includes SSI or SSDI, some programs also consider savings and assets. Call 211 to reach a navigator who knows the full rules."

- **Renders on both result paths.** The `results-header` div (lines 274-292) is shared by the `likelyCount > 0` heading and the no-match `else` heading, so the note appears whether or not programs matched. Confirmed by reading the conditional structure, not just the note copy.
- **Resolves the load-bearing concern.** The original High finding was that a Medi-Cal "may qualify" result, screened on income alone, is silent on asset limits and SSI/SSDI interaction for a likely-Renee user — and that silence reads as an affirmative "this doesn't apply to you." The note now names the asset/savings reality and externalizes the full rules to a 211 navigator. The 2am "lose Medi-Cal mid-flare" scenario is no longer met with silence.
- **Do No Harm compliant.** No recommendation (no "you should apply"), no urgency, no fear, no scarcity. Conditional framing ("If your income includes...") means a non-disability user reads past it without being alarmed or mislabeled. It points to an institution rather than asking the user to disclose, prove, or self-assess anything. Consistent with the existing 211 bridge-box pattern.

### Finding #2 (LOW) — RESOLVED
`min-height: 44px` added to `.calc-field select` (line 517). The paycheck-frequency dropdown now meets the 44px touch-target minimum, tolerating imprecise taps during a flare.

### Finding #3 (LOW) — RESOLVED
Income field-hint updated (line 180) to: "Enter $0 if you have no income right now. If your income varies, use a recent typical month." This normalizes variable income as the normal case rather than a data error, directly answering the persona's BEN-1 note. For a user whose last three months were $1,890 / $2,640 / $1,140, the tool now tells her which month to enter instead of leaving the choice silently ambiguous.

### Accepted deliberate omission — ABLE account surfacing
My prior solution space offered, as an *optional* addition to the same note, naming that ABLE accounts exist. This was a suggestion inside finding #1's solution space, not a separate finding. The implemented note resolves the blocking concern (asset-limit silence) without it. I am accepting its absence for this pass rather than reopening sign-off, and flagging it as a candidate for a future copy iteration: an ABLE mention would still serve Renee, who per the persona "doesn't know it exists" and for whom it "would solve her exact problem." Recommend the PM consider it when BEN-1 copy is next revisited, or when any disability-specific program (SSI/CalABLE) enters scope. Not blocking.

---

## Disability Accessibility Review: CA Benefits Screener

### Cognitive Accessibility Beyond Compliance

- **Interruption survivability:** Strong. The form is a single screen (step 1), all inputs visible at once, no multi-page wizard. If Renee sets the phone down mid-flare and comes back, nothing has reset and nothing was lost as long as the tab stays open. State is client-side reactive, not server-round-tripped. There is no timeout.
- **Working memory burden:** Low and well-handled. The paycheck calculator does not ask her to compute and remember a number then re-type it elsewhere: `usePaycheckAmount()` writes the result straight into the income field for her. That is the correct pattern for a fog day — the tool does the carrying, not the user.
- **One decision per screen:** Step 1 stacks household size, income, and two optional checkboxes. This is acceptable because the checkboxes are explicitly optional and labeled "optional, but helpful," so a depleted user can skip them and still get a result. The required surface is just two fields.
- **Error forgiveness:** Good. The income error ("Enter your gross monthly income. Use $0 if you have no income right now.") is plain, non-punishing, and does not wipe entered values — `error` is set but no inputs are cleared. `startOver()` is the only thing that resets state, and it is user-initiated.
- **Finding: pass.** The flow is genuinely completable on a bad-symptom day. The paycheck-calculator auto-fill is a real fatigue reduction, not a decorative feature.

### Sensory Accessibility in Lived Practice

- **Dynamic content announcement:** Handled deliberately. A persistent `aria-live="polite"` region sits *outside* the `{#key step}` block (line 124), with a code comment showing the team already hit and solved the VoiceOver/Safari re-announcement problem. The paycheck calc result also has its own `aria-live="polite"`. Results heading receives focus after calculation (`resultsHeadingEl?.focus()`).
- **Focus management:** Good throughout. Calculate → focus moves to results heading (tabindex="-1"). Start over → focus returns to the tool h1. Toggle paycheck calc open → focus moves into the amount input; close/cancel/use → focus returns to the trigger button. This is correct, attention-following focus behavior, not stranded-at-top.
- **Color-only signals:** Pass. Status is never color-alone: "May qualify" / "Above limit" text tags accompany the card border-color difference, and `incomeVsLimit` gives the numeric comparison in text. The unlikely tag has an explicit WCAG-contrast comment (line 676).
- **Finding: pass.** This holds up beyond the automated scan. The live-region-outside-`{#key}` detail in particular is the kind of thing that fails a real screen-reader walk but passes an audit, and it was caught.

### Physical & Fatigue Considerations

- **Touch target sizing:** Mostly good, two spot-check notes. Primary/ghost buttons are `min-height: 48px` (app.css) and the calc cancel + start-over buttons have explicit `min-height: 44px`. **The `<select id="paycheck-frequency">` has no explicit min-height** — padding `0.75rem` top/bottom + 1rem font computes to roughly 40-42px, marginally under 44px. **The checkboxes render at 1.125rem (~18px)**, but the entire `.checkbox-label` (checkbox + full text) is the click target and is comfortably large, so imprecise-tap risk is mitigated. Flag the select as a minor item.
- **Interaction count:** Minimal. Two required fields and a button. The optional paycheck path is opt-in. No multi-tap confirmations, no nested dropdowns requiring scroll except the 4-option frequency select.
- **Energy-to-value ratio:** Excellent for this user. Two fields return a 7-program eligibility picture with application links and a 211 fallback. The value strongly exceeds the energy cost. This is the right ratio for a spoon-budget user.
- **Finding: flag (minor).** Add `min-height: 44px` to `.calc-field select`. Not blocking on its own.

### Disability-Specific Shame & Disclosure Anxiety

Disclosure Safety Test run on every question touching health, capacity, or program enrollment.

- **Q: "People in your household"** — neutral, no health inference. Pass.
- **Q: "Gross monthly income before taxes"** — see High finding below for the income-source ambiguity, but on disclosure *framing* it passes: hint says "Enter $0 if you have no income right now," which normalizes the worst case without judgment.
- **Q: Checkbox "Someone in my household is pregnant, gave birth in the last 12 months, or is under age 5"** — Disclosure Safety Test: (1) feels safe, not a test; (2) it is an optional checkbox, so "leave it unchecked" *is* the "it doesn't apply / I'd rather not say" answer — there is no forced binary; (3) framed as "optional, but helpful," no penalty implied; (4) least-favorable result (unchecked) still returns a full screen. Pass.
- **Q: Checkbox "A school-age child (ages 5-18) is in my household"** — same structure, same pass.
- **Critical strength for Renee specifically:** the tool asks **no disability question at all.** There is no "do you have a disability?" binary, no condition disclosure, no determination-status field. For a user mid-SSDI-appeal who has been taught that disclosing a fluctuating condition invites doubt, the *absence* of that question is exactly right. She is never asked to label herself or prove anything to the tool.
- **Finding: pass.** No question in this flow reads as an assessment. Renee can complete it without disclosing disability status at all.

### Benefit-Cliff Fear Specific to Disability

This is where the tool is weakest for Renee, and it is the reason for the gate block.

- **Asset-limit acknowledgment:** **Absent.** The tool screens Medi-Cal purely on a 138% FPL income test. For a user on (or applying for) SSI, Medi-Cal eligibility can run through a separate, asset-tested pathway, and SSI itself has a hard ~$2,000 resource limit. Renee has $1,800 in a Roth IRA and has been told conflicting things about whether it disqualifies her. The tool says nothing about assets anywhere. Per Dimension 5, "silence reads as 'this doesn't apply to you,' which may be false."
- **Income-is-not-always-good-news framing:** **Absent and slightly risky.** The results note is "These are estimates based on income only. Actual eligibility is determined by the administering agency." This covers the *direction the tool already worries about* (you might not qualify) but not the direction that matters for Renee (a higher reported income in a good month could threaten a benefit she currently holds, and disability-program interactions are not modeled here at all). For a stable-paycheck Dani this is fine. For Renee it is the 2am scenario the persona names explicitly.
- **ABLE account surfacing:** **Absent.** The persona calls out that an ABLE account "would solve her exact problem" with the Roth IRA and "she doesn't know it exists," and the framework lists this as a place "the tool may be one of few places they'd encounter the option." Not surfaced anywhere.
- **Variable income treated as data error:** Pass on the mechanics — the paycheck calculator handles irregular pay structures, and "$0 if you have no income right now" normalizes a flare month. But the single `grossMonthlyIncome` field still silently assumes one representative number. The persona's BEN-1 note flags exactly this: "any future income-related copy or input design should be reviewed against whether it silently assumes income stability." It does. There is no copy acknowledging that the right month to enter is itself ambiguous for someone whose income swings $1,140–$2,640.
- **Finding: fail (High).** The income-only disclaimer does not adequately cover the SSI/SSDI interaction risk for a disability-income user. A "may qualify" Medi-Cal result that ignores asset limits is technically accurate at the FPL level and materially incomplete for a likely Renee.

### Double Vulnerability (Disability × Poverty)

- **Compounding-load check:** Reviewed as one user who is both ALICE and disabled in the same session, not two passes. The cognitive budget holds: one screen, two required fields, auto-filled calculator, forgiving errors, no disclosure gauntlet. The scarcity tax and the fog tax stack here without overrunning the flow. This is well done.
- **Where double vulnerability breaks:** It is not the cognitive load — it is the *content gap*. The user who is both is precisely the user whose income is disability payments and whose savings sit near an asset limit. The tool serves the "poverty" axis of that user fully and the "disability" axis not at all in the results content. It does not branch into two flows (good — Dimension 6 wants one flow), but the single flow is missing the disability-specific caution the both-at-once user needs.
- **Finding: flag.** One flow, correct structure, but the results content is calibrated to Dani and silent on the part that is specifically Renee.

---

## Critical Findings (ordered by severity)

### 1. HIGH — Medi-Cal "may qualify" result ignores asset limits and SSI/SSDI interaction
**What it is:** Medi-Cal is screened on income alone (138% FPL). A user whose income is SSI/SSDI, or who is mid-appeal, can get a "May qualify" Medi-Cal result that omits the asset-test pathway and the SSI resource limit entirely. The blanket "estimates based on income only… determined by the administering agency" disclaimer technically covers it but does not *flag the specific stakes* — that for someone on disability income, the rules are categorically different and more than income is in play.
**Why it matters for Renee:** Losing Medi-Cal mid-flare is her named 2am fear. A result that reads "you may qualify" with no asterisk about disability-program interaction can either falsely reassure her or, in the other direction, lead her to act on an income number in a way that touches a benefit she already holds. The framework treats silence on asset limits as an affirmative (and possibly false) "this doesn't apply to you."
**Solution space (PM/brand/Naomi call, not mine to decide):** A short, non-alarming results-level note that triggers as relevant — for example, surfacing once: "If your income is from SSI or SSDI, or you're applying for disability benefits, eligibility for these programs can work differently — asset limits and benefit interactions apply that this estimate doesn't cover. A community navigator at 211 can help." This satisfies Do No Harm (no recommendation, no fear, names the institutional reality the persona asks for), adds no new question, and requires no disclosure. ABLE accounts could be named in the same note as something that *exists*, not as advice. Keep it as a calm signpost, consistent with the existing 211 bridge box.

### 2. LOW — `.calc-field select` (paycheck frequency) lacks explicit 44px min-height
**What it is:** The frequency dropdown computes to roughly 40-42px tall, marginally under the 44px target.
**Why it matters for Renee:** Tremor and limited fine motor control during a flare make a sub-44px control a missed-tap risk; the framework (Dimension 3) asks for targets that tolerate imprecision, not just minimum size.
**Solution space:** Add `min-height: 44px` to `.calc-field select`.

### 3. LOW — Single income field silently assumes a stable representative month
**What it is:** No copy acknowledges that "gross monthly income" is ambiguous for someone whose income swings month to month. The persona's own BEN-1 note flags this.
**Why it matters for Renee:** Her last three months were $1,890 / $2,640 / $1,140. Which one does she enter? The tool doesn't say, and the choice changes the result. This is not a "fix today" blocker on its own, but it compounds finding #1.
**Solution space:** A one-line hint near the income field acknowledging variable income (e.g., "Income changes month to month? Use a typical or recent month — you can check again anytime"). Normalizes variability as the persona asks, without adding a field.

---

## What the Tool Does Well for This User

- **It asks no disability question.** The single best thing about this tool for Renee. No binary, no determination field, no condition disclosure, no "disabled enough" gatekeeping. She can use it fully without revealing or labeling anything.
- **The paycheck calculator carries the number for her** instead of asking her to compute and re-type during fog. Genuine fatigue reduction.
- **Interruption-safe single screen** with no timeout and no progress loss.
- **Focus management and the live-region-outside-`{#key}` detail** show a real screen-reader walk was done, not just an audited scan.
- **"$0 if you have no income right now"** normalizes the worst month without judgment.
- **Optional checkboxes function as their own opt-out**, so no health-adjacent question is ever forced into a binary.
- **The 211 bridge box** already models the calm-signpost pattern that finding #1's fix should extend.

---

## Sign-off

**Initial review:** Withheld pending resolution of the High finding (asset-limit / SSI-SSDI interaction silence on the Medi-Cal result).

**Re-review (2026-06-21):** Granted. The High finding is resolved by a Do-No-Harm-compliant signpost note that renders on both the match and no-match result paths, names the asset/savings reality, and externalizes the full rules to a 211 navigator without adding a question, a field, or any required disclosure. Both Low findings are resolved in the same pass. The ABLE-account mention is an accepted deliberate omission for a future copy iteration, not a blocker.

No Critical or High findings remain.

⟦DISABILITY-REVIEWED⟧ tool="screener" ticket="BEN-1" date="2026-06-21"

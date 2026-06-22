## Brand Review: Savings Commitment Maker — SAVE-1

**Date:** 2026-06-21
**Reviewer:** Brand agent
**Files reviewed:**
- `finxiety/src/routes/tools/savings-commitment/+page.svelte`
- `finxiety/src/lib/calculators/savings-commitment.ts`
- `../tsunam_vault/finxiety/Finxiety — Brand & Mission.md`
**Gate sequence:** Brand gate (gate 1 of 5).

---

### Voice Violations

**V-1 — Field prompt reads as behavioral claim (Medium)**

Line 331–333 (`+page.svelte`):
> "Add a when — a specific day or trigger makes commitments more likely to stick."

"Makes commitments more likely to stick" is a behavioral claim stated as fact. The underlying Gollwitzer research supports it, but on its own in the UI this reads as mild pressure: do this or your commitment is less likely to work. That is urgency-adjacent. It also tells the user what the field does to them, rather than describing what the tool does with their input.

Suggested revision:
> "A specific day or trigger — like 'every other Friday after I get paid.'"

This matches the existing `field-hint` placeholder example already shown on line 319, removes the behavioral nudge, and lets the field label carry its own weight. The hint example below is doing the right work already; this duplicate explanation is redundant as well as problematic.

**Severity:** Medium. Not a Do No Harm violation, but it violates the rule against urgency framing and crosses into telling the user how their behavior works rather than describing what the tool does.

---

**V-2 — "Build my commitment" CTA overclaims slightly (Low)**

Line 367 (`+page.svelte`):
> "Build my commitment"

"Build" implies the tool is constructing something substantial. The tool assembles the user's own words into a formatted statement — which is accurate and valuable, but "build" suggests more engineering than is actually happening. More importantly, the user is the author here; the tool is the formatter. A label that reflects that better would serve the tool's actual value proposition.

Suggested revision:
> "Make my commitment statement"

or simply:
> "Write my commitment"

Either keeps the user as the agent without understating what the tool produces. This is low severity because "Build my commitment" does not tell the user what to do or imply judgment — it is just slightly inflated.

**Severity:** Low. Fix is a single word change and improves accuracy; not a blocker.

---

### Do No Harm Flags

No Do No Harm violations found. Specific checks:

**DNH-1 — Does the tool imply that not saving is a failure? No.**

The entry question is "What are you saving for?" — open, neutral, invites the user to name their own goal without implying they should have one already. No copy implies the user has failed to save or is behind. Pass.

**DNH-2 — Does the tool tell the user they should save? No.**

The tool description (lines 242–245) reads:
> "Saving is easier when the plan is yours and it's specific. Write one commitment in your own words, and take it with you — as a note you can keep or a reminder in your own calendar."

This describes what the tool does without telling the user they need to save or that their current approach is wrong. "Saving is easier when the plan is yours and it's specific" is a statement about the tool's premise, not a directive. It does not say "you should save" or "saving is important." Pass — with one note below.

The phrase "Saving is easier when the plan is yours and it's specific" comes close to the edge. It asserts that saving (implicitly: the thing you should be doing) becomes easier with this tool. For a user who cannot save — who opened this tool out of aspiration and hit a wall at Step 2 — "easier" could land as a mild reproach. This is not a violation but it is worth watching. No change required now; flag for behavioral science review.

**DNH-3 — Does the aspiration-setting register tip into shame? Mostly no.**

The copy throughout remains at the level of facilitation, not motivation. The tool never says "you can do this" or "this is achievable" — both of which would imply the user needs encouragement, which implies doubt. The form is factual and functional throughout. The one exception is the field label on line 275:

> "What's the smallest amount that would feel like progress?"

This is good behavioral science framing (lowering the activation threshold) but it carries a subtle implication: that there is a right answer, and that it is a small one. For a user who cannot identify any amount that feels like progress, this framing has nowhere to land. This is primarily a behavioral science concern rather than a brand concern — flag for that review. Brand assessment: the label is warm and does not shame, but it does make an assumption about what the user can do. Pass on brand; escalate to behavioral science.

**DNH-4 — Is the rough timeline estimate labeled as an estimate? Yes.**

The calculator (`savings-commitment.ts` line 84–86) suffixes all timeline output with:
> "rough estimate; your actual timeline will vary."

The template surfaces this via the `.timeline-note` style on line 380 with the prefix "One rough estimate:" — so the displayed text reads "One rough estimate: At $X [cadence], reaching $Y would take approximately Z [units] — rough estimate; your actual timeline will vary." The phrase "rough estimate" appears twice in the rendered output (once in the template prefix, once in the calculator suffix), which is slightly redundant but not harmful. It is unambiguous that this is illustrative. Pass.

**DNH-5 — Does "not a lock" copy release the user without creating guilt? Yes.**

Line 383–385 (`+page.svelte`):
> "This is a plan you made, not a lock. Your money is still yours to use."

This is the strongest piece of copy in the tool. It releases the commitment from binding force without undermining the user's agency. "Your money is still yours to use" is exactly right for a user who may have debt, irregular expenses, or an emergency coming — it signals that using the money is not a failure of the commitment. This is a model for how to frame behavioral scaffolding without trapping the user in a shame loop. No change needed.

**DNH-6 — Does the privacy note adequately cover the stateless design? Yes.**

Line 405–408 (`+page.svelte`):
> "Nothing here is saved or sent anywhere. Your commitment stays on your device, and the calendar file is built right in your browser."

Plain, specific, and accurate. "Built right in your browser" is a clear explanation of client-side generation without technical jargon. Pass.

---

### Non-Advice Rule

**Step 2 label "When will you do it?" — passes.**

This is an open question that collects the user's own timing anchor. It does not suggest what the timing should be. The hint example ("every other Friday after I get paid") is illustrative, not prescriptive. Pass.

**Step 2 habit anchor label (line 354) — passes with a note.**

> "Is there something you already do you could link it to? (optional)"

This is a soft suggestion that the user consider habit-stacking. It is framed as a question ("Is there something...") and marked optional, which keeps agency with the user. It does not say "you should link it to a habit." Pass.

However, the label is a leading question — it nudges toward a specific behavioral strategy (habit stacking) that may not fit every user's life. This is not a Non-Advice violation but it is worth flagging for behavioral science review.

**The commitment statement itself — passes.**

The output is in the user's first person ("I will transfer..."). The tool formats; the user authors. The statement structure is transparent: the user sees exactly how their inputs are assembled before and after (editable textarea at line 388). The tool does not add motivational language, endorsements, or qualifications to the user's own words. Pass.

**Calendar CTA copy — passes.**

"Add to my calendar" and "Copy this" (lines 397, 400) describe what the buttons do. Neither sells the action as important or implies urgency. Pass.

---

### Tool Name and Description

**Page title (line 221):** "Savings Commitment Maker | Finxiety" — accurate, literal, findable. No inflation.

**Meta description (lines 223–225):**
> "Write one specific savings commitment in your own words — and get a calendar reminder to make it happen."

"Make it happen" is slightly promotional. "Make it happen" implies an outcome the tool cannot guarantee — that the commitment will be kept. The tool produces a statement and a calendar file; whether that becomes action is up to the user.

Suggested revision:
> "Write one specific savings commitment in your own words, and download a calendar reminder to take with you."

"Take with you" is in the spirit of the tool description below (line 244: "take it with you") and describes what the output is rather than what it will cause.

**Severity:** Low. "Make it happen" is not urgency language per se, but it is a mild outcome promise the tool cannot make. Fix is minor.

**H1 (line 241):** "Savings Commitment Maker" — literal and correct. Describes the function without overpromising.

**Tool description (lines 242–245):**
> "Saving is easier when the plan is yours and it's specific. Write one commitment in your own words, and take it with you — as a note you can keep or a reminder in your own calendar."

"Saving is easier when the plan is yours and it's specific" — states the tool's premise accurately. "Write one commitment" — describes what the user does. "Take it with you" — describes the output. The phrase "your own calendar" is warm and correct (the ICS file goes to the user's calendar app, not Finxiety's). Pass, with the Do No Harm edge-case flag noted above in DNH-2.

---

### Related-Tools Signpost Footer

Lines 419–430 (`+page.svelte`):
> "Emergency Fund Checker — see how much runway your savings would give you."
> "Benefits Screener — find programs that might create more breathing room."

**Emergency Fund Checker link:** "See how much runway your savings would give you" — describes what the tool shows, uses the user's savings as the input, natural next step after setting a savings commitment. Warm handoff. Pass.

**Benefits Screener link:** "Find programs that might create more breathing room" — describes what the tool does, uses "might" appropriately (no overclaiming eligibility). "Breathing room" is colloquial and right for Finxiety's register. Pass.

Both handoffs are question-free (unlike the cliff calculator's footer, which used questions well — these work equally well without them because the context is a natural continuation). No urgency, no upselling. Pass.

---

### Strengths

- "This is a plan you made, not a lock. Your money is still yours to use." (line 383–385) is the best single piece of copy in the tool. It handles the behavioral risk of commitment framing — that a user who dips into their savings will feel they have failed — with directness and zero condescension. This pattern belongs in the Finxiety copy library for any future tool that involves commitments, goals, or targets.
- The tool's output is entirely in the user's own first-person words. There is no Finxiety voice interpolated into the commitment statement — the tool formats but does not author. This is a clean implementation of the Agency value from the brand document.
- "Nothing here is saved or sent anywhere" (line 405) is plain and specific. It does not say "your privacy is protected" (which is vague and branded) — it says exactly what does not happen. This is the right level of specificity for a user with a trust deficit.
- The "Edit your commitment (optional)" textarea (line 389) preserves user control over the final output. This is unusual and correct — most commitment tools present a fixed statement. Giving the user edit access reinforces that the words are theirs.
- The calendar event summary is "My savings appointment" (line 165 of the calculator) rather than "Finxiety savings reminder." This is a small choice that matters: when the event appears in the user's calendar a week from now, it will not read as a brand notification. It will read as the user's own appointment.

---

### Distribution Notes

**Who finds this first:**

This tool is not primarily findable via organic search on a specific financial need — "savings commitment" is not a query people make when they are in distress. The tool is better positioned as:

1. A warm handoff from the Emergency Fund Checker ("now that you know your runway, here is a way to extend it").
2. A nonprofit partner recommendation from financial coaches, credit counselors, and community financial education programs — the kind of tool a coach hands to a client to do on their own after a session.
3. A social share, but only in the right framing — see below.

The meta description should include the phrase "savings transfer" or "automatic transfer" to catch users who are already in the mental model of setting up a recurring transfer and want a way to make it concrete before they log into their bank.

**Shareable moment:**

The commitment statement itself is the shareable unit — but only if the user chooses to share it. Unlike a quiz score, a commitment statement is personal. Sharing it requires the user to want to make the commitment public, which is a meaningful act of accountability. The tool should not prompt sharing. The "Copy this" button is correct as implemented — it puts the statement on the clipboard and leaves what the user does with it entirely up to them. Do not add a share CTA.

**Cross-tool bridge:**

The current footer links (Emergency Fund Checker, Benefits Screener) are appropriate. After the user has made a savings commitment, the most natural next question is "what would this give me?" (emergency fund) or "is there anything else available to help?" (screener). Both are correctly placed. No missing bridge.

---

### Findings Summary

| ID | Severity | Description | File:Line | Action |
|---|---|---|---|---|
| V-1 | Medium | Field prompt "makes commitments more likely to stick" is behavioral pressure / urgency-adjacent | `+page.svelte:331` | Replace with plain description; remove behavioral claim |
| V-2 | Low | "Build my commitment" CTA slightly inflates what the tool does; user is the author | `+page.svelte:367` | Change to "Write my commitment" or "Make my commitment statement" |
| V-3 | Low | Meta description: "make it happen" is a mild outcome promise the tool cannot keep | `+page.svelte:224` | Change to "download a calendar reminder to take with you" |
| F-1 | Flag (behavioral) | "What's the smallest amount that would feel like progress?" makes an assumption about affordability | `+page.svelte:275` | Escalate to behavioral science review |
| F-2 | Flag (behavioral) | "Saving is easier when the plan is yours and it's specific" may land poorly for a user who cannot save | `+page.svelte:242` | Escalate to behavioral science review |
| F-3 | Flag (behavioral) | Habit-stacking label is a leading question that presupposes availability of a linking habit | `+page.svelte:354` | Escalate to behavioral science review |

---

### Sign-Off Decision

No Critical or High violations found. No Do No Harm failure. No Non-Advice Rule violation.

V-1 is the most significant finding: the field prompt "makes commitments more likely to stick" is urgency-adjacent and states a behavioral claim as fact. It requires a one-line fix but does not rise to a blocker on its own — it is not a directive, does not imply the user is failing, and does not cause financial harm. However, in the context of Finxiety's zero-urgency principle, it should be corrected before distribution.

V-2 and V-3 are cosmetic. Fix before distribution; not blockers.

All three behavioral flags (F-1, F-2, F-3) are escalated to the behavioral science review gate and should not delay the brand gate from passing.

The three copy fixes are small and do not require re-review; they can be verified inline by the engineer. Brand gate passes.

⟦BRAND-REVIEWED⟧ tool="savings-commitment-maker" ticket="SAVE-1" date="2026-06-21" notes="V-1/V-2/V-3 require pre-distribution copy fixes; three behavioral flags escalated to behavioral-science gate"

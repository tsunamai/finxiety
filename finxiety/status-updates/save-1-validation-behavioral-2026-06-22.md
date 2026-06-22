## Behavioral Science Review: Savings Commitment Maker (SAVE-1)
## Persona applied: ALICE Primary User (finxiety/research-findings/persona-alice-primary-user.md)

**Date:** 2026-06-22
**Reviewer:** Behavioral science agent
**Gate sequence:** Behavioral gate (gate 4 of 5)
**Files reviewed:**
- `finxiety/src/routes/tools/savings-commitment/+page.svelte`
- `finxiety/src/lib/calculators/savings-commitment.ts`

**Upstream context honored:** Brand gate (save-1-validation-brand-2026-06-21.md) escalated three flags to this gate: F-1 (the "smallest amount that would feel like progress" affordability assumption), F-2 ("Saving is easier..." premise for a user who cannot save), F-3 (habit-stacking leading question). All three are adjudicated below. Brand's V-1 ("makes commitments more likely to stick") is confirmed already removed in the current code — line 342 now carries only the plain hint. Good.

---

### The core question this review turns on

This tool is well-built. The copy is, in most places, a model of facilitation-not-motivation. The "not a lock" line is the best single piece of behavioral copy in the suite. But the tool has one structural assumption baked into its flow that the persona does not survive: **it cannot be completed by a user who has $0 available right now.** The amount field is required and must be `> 0` (`amountValid = Number.isFinite(amount) && amount > 0`, line 51; `canStartCommitment` gates the Step-2 submit, line 56). There is no path through this tool for Dani on the day her balance is $47 and rent hits in nine days.

That is the day she is most likely to be here. Everything else in this review is secondary to that.

---

### Scarcity Mindset
- **Cognitive steps required:** Moderate. Step 2 asks the user to hold five fields at once (amount, frequency, when, optional target, optional habit) before producing anything. Two are optional, three are required. This is more than one cognitive step, but the fields are sequential and plainly labeled, and nothing must be computed by the user. Acceptable, not ideal, for a bandwidth-taxed user.
- **Tunneling risk:** Low-to-moderate. A user in scarcity will tunnel on the amount field — "what can I actually spare?" — and may stall there. Because that field is required and floored at >0, tunneling on it has no escape hatch (see C-1).
- **Present-bias risk:** **Present.** The entire tool asks for future-oriented thinking — a recurring transfer, a "when," an optional total target, an optional 48-month timeline. Per Mullainathan & Shafir and the persona (lines 68–76), future-oriented planning is the cognitively expensive mode that is least available to Dani-in-crisis. This is inherent to a commitment tool and not a defect by itself — but it means this tool is built for Dani-in-Scenario-A (the calm referral), not Dani-in-Scenario-B (the crisis). The tool currently does nothing to acknowledge that a user who arrived in crisis may not be in the right state for it, and offers them no graceful exit toward a tool that is. See C-1.
- **Finding:** **flag** — The tool is a future-oriented planning instrument with no accommodation for the present-tense, zero-slack state in which the ALICE user most often opens a financial tool. Not a failure of the happy path; a failure of the worst-case path.

---

### Financial Shame
- **Potential shame triggers, enumerated:**
  - Line 293, "What's the smallest amount that would feel like progress?" (brand F-1). The word "smallest" is doing real, good work — it lowers the activation threshold and signals that a tiny number is welcome. But the question presupposes that *some* positive amount exists. For a user who has nothing this week, the question has, in brand's exact words, "nowhere to land." Worse, because the field is required, the user cannot proceed past a question they cannot truthfully answer with anything but $0 — and $0 is rejected. The framing is warm; the gate behind it is not. **Adjudication of F-1: upheld as contributing to C-1.** The label copy is fine; the required-positive-amount gate behind it is the harm.
  - Line 257–258, "Saving is easier when the plan is yours and it's specific" (brand F-2). Read in isolation this is a premise statement, not a directive — brand is right that it does not say "you should save." But for the user who hits the $0 wall at Step 2, this opening line retroactively reframes as a setup to a failure: the tool promised saving would be "easier," then refused to let her through. The line is not a shame trigger *on its own*; it becomes one only in combination with C-1. **Adjudication of F-2: the line stays; it is not independently harmful. Fixing C-1 neutralizes it.**
  - Line 379, the habit-stacking field (brand F-3). "Is there something you already do you could link it to?" The persona notes Dani's routine is "constrained and unpredictable" (and the persona text describes a life with little stable daily structure). A user with no stable anchorable habit could read this as one more thing she lacks. **Adjudication of F-3: the *optional* marking and question framing are sufficient protection. This field passes.** It is genuinely skippable, it is visually and semantically optional, the submit does not depend on it, and the generated statement reads correctly without it (verified in the calculator, lines 107–112). No fix required. Leaving it as-is is the right call — habit-stacking is a real, evidence-based assist for the users who *do* have an anchor, and the optional framing costs the users who don't nothing they can't skip in one tap.
- **Result display:** The Step-3 commitment statement is rendered in the user's own first-person words (`I will transfer $X...`), in a quote block, with no Finxiety voice interpolated, no grade, no comparison, no "good job." This is exactly right. The output is a mirror of the user's own intention, not a verdict on it.
- **Implicit comparisons:** None found. No "most people," no "experts recommend," no benchmark, no income field, no compound-growth projection that would invite "you're behind." This is a clean pass on the comparison axis — and notably better than the workshop slides that drove Dani out of the room (persona line 49).
- **Finding:** **flag** — No shame trigger is independently disqualifying, and F-3 is cleared. But F-1 compounds with the C-1 structural gate to manufacture a small shame event precisely for the user with the least to spare. The copy is not the problem; the gate behind the copy is.

---

### Trust
- **Trust-building elements:** No login, no email, no income field (persona line 55 — the email field is named as a ten-second tab-closer; its absence is load-bearing). The privacy note (lines 432–435) says exactly what does *not* happen rather than vaguely promising "privacy." The calendar event is titled "My savings appointment," not a brand notification (calculator-adjacent, line 173) — a week from now it reads as her own appointment, not an ad. The editable textarea (line 417) hands final authorship to the user. All of this earns trust in the first thirty seconds.
- **Trust-breaking elements:** The required positive-amount gate is the one trust risk. A user who has been failed by financial systems, who tried to save $100 and had to pull it back when the car battery died (persona line 36), arrives already primed to expect that this tool, too, was built for someone with more than she has. The moment the tool refuses to let her continue without a positive number, it confirms that prior. That is the specific failure mode the persona warns against: "If the first question assumes she has a designated savings account, she'll feel that the tool was built for someone else" (line 157). Requiring a positive transfer amount is the functional equivalent.
- **Trust arc:** Starts high (clean, no-ask entry). For the happy-path user, stays high through a genuinely respectful result. For the $0 user, breaks at Step 2 and does not recover — she closes the tab with the prior confirmed.
- **Finding:** **flag** — Trust is well-earned on the happy path and lost on the worst-case path, at exactly the point the persona flagged.

---

### Locus of Control
- **Does the output feel actionable or verdictive?** Actionable. The output is a self-authored plan plus a portable artifact (calendar file / copyable text). It is the user's own statement, in her own words, that she can carry out of the tool. This is the opposite of a verdict — it is an instrument of agency. Strong pass on the happy path.
- **Path forward:** The calendar event and the copyable statement *are* the path forward, and they are concrete. The "not a lock" line (lines 411–413) is exemplary: it pre-empts the single most likely agency-destroying event — Dani dipping into the saved money for an emergency and reading that as personal failure — and disarms it in advance. "Your money is still yours to use" is precisely calibrated for a user with irregular expenses every six weeks. This is the tool at its best.
- **For the $0 user:** Inverted. A tool she cannot complete is the definition of an external-locus confirmation — "even the free tool built for people like me won't let me in." The fix (C-1) is to give her a path forward *at the wall* rather than a dead end.
- **Finding:** **pass (happy path) / flag (worst-case)** — The happy-path agency design is a model. The worst-case path needs the C-1 escape hatch to avoid being a locus-of-control negative.

---

### Cross-Tool Bridge
- **Near-zero / wall state:** The related-tools footer (lines 445–457) links EMG-1 (Emergency Fund Checker) and BEN-1 (Benefits Screener). For the happy-path user these are well-framed warm handoffs (brand confirmed). **But the bridge is only present in the persistent footer — it is not surfaced at the moment a $0 user hits the wall.** The user who cannot enter an amount never gets a contextual signpost that BEN-1 exists precisely because she may need supply (more income / benefits) before a savings commitment is even possible. The bridge exists; it just isn't placed where the worst-case user is standing.
- **Character of the bridge:** Informational, not directive. "Find programs that might create more breathing room" uses "might," makes no eligibility claim, does not say "you should." Correct register. The issue is placement, not character.
- **Finding:** **flag** — The bridge is correctly written but absent at the one moment (the $0 wall) where it would function as a true warm handoff rather than a footer. Fixing C-1 should route the $0 user toward BEN-1/EMG-1 as expanded supply, explicitly *not* as a verdict that her amount was too small.

---

### Enabling Environment (Matuschak)
- **Changed capability:** Yes — and this is the tool's strongest claim to being more than informative. The user leaves with two things she did not have: (1) a specific, self-authored implementation intention (Gollwitzer's mechanism is real and the tool implements it faithfully — verbatim user words, a concrete "when," an optional habit anchor), and (2) a calendar event that re-presents that intention at the moment of action a week later. This is the difference between "I now know a number" and "a future decision will be different." The calendar artifact is the active ingredient: it returns the idea to the user across time, which is exactly Matuschak's condition for understanding that sticks.
- **After-the-tab question:** For the happy-path user, something concrete is different in 24 hours and again at the next pay cycle: an event will fire on her own calendar, in her own words, titled as her own appointment. That is a genuine behavioral-change mechanism, not aspiration. This passes the after-the-tab test more cleanly than most tools in the suite.
- **Active vs. passive:** Active. The user authors the statement, chooses the cadence, names the trigger, and can edit the final text. She is not receiving information; she is constructing a plan. This is the right side of the active/passive line.
- **Illusion-of-understanding risk:** Low-to-moderate. The one risk: a user could complete the flow, feel the satisfaction of "I made a plan," download the calendar file, and never transfer the money — mistaking the feeling of commitment for the act. The "not a lock" line slightly increases this risk (it lowers the stakes) while simultaneously protecting against commitment-regret shame. This is an acceptable trade: the tool correctly prioritizes not-harming the user who dips into savings over maximizing follow-through pressure. Finxiety's Do No Harm posture is right to accept slightly weaker adherence in exchange for zero shame. No change needed.
- **Finding:** **pass** — For the user who can use it, this is one of the more genuinely *enabling* tools in the suite. The calendar artifact is the mechanism that carries it past the illusion-of-understanding trap most educational tools fall into.

---

### Critical Findings

**C-1 — HIGH — The tool cannot be completed by a user with $0 available, and offers her no path forward at the wall.**
- **What it is:** The amount field is required and must be strictly positive (`+page.svelte:51`, `+page.svelte:56`; the Step-2 submit is `disabled={!canStartCommitment}` at line 394). A user who enters $0, or who cannot enter any positive amount, is blocked at Step 2 with only the inline prompt "Enter an amount to continue." (line 306). There is no off-ramp.
- **Why it matters for this specific user:** Dani opens financial tools most often in Scenario B — the crisis, balance at $47, rent in nine days (persona lines 64–66). On that day she has no positive amount to commit. The tool that was supposed to help her presents a question she can't truthfully answer (F-1), refuses her entry, and — per the persona's explicit trust criterion (line 157) — confirms that it "was built for someone else." This converts a facilitation tool into an external-locus-of-control confirmation for the exact user the suite exists to serve. It is the single highest-stakes moment in the flow and it currently fails.
- **Solution space (this gate flags; PM decides):** Several non-exclusive options, in rough order of preference:
  1. **A contextual off-ramp at the $0 wall.** When the amount is empty/zero and the user attempts to advance, replace the bare "Enter an amount to continue" with a non-directive signpost: that a savings commitment works best once there's a little room to spare, that there's no wrong answer here, and a plain link to BEN-1 ("If money is tight right now, the Benefits Screener can show programs that might free up some room") and/or EMG-1. Informational, not "you should." This turns the dead end into the warm handoff the Cross-Tool Bridge section calls for.
  2. **Allow $0 / a "not sure yet" path through to a statement** that omits the amount ("I will set aside what I can ... when I get paid"), preserving the implementation-intention and calendar mechanism without forcing a number the user doesn't have. (Calculator change required; today `buildCommitment` assumes a positive amount and `formatAmount` would print `$0`.)
  3. **At minimum**, reword the entry so the tool never *implies* a positive amount is a precondition for being welcome here, and ensure the bridge to BEN-1 is visible before the user abandons.
- **Note:** This is rated High, not Critical, because the tool does not produce a harmful *output* — it produces no output and turns the user away. But for this persona, being turned away at the moment of need is among the more damaging things a Finxiety tool can do, and it lands on the worst-case path the validation gate exists to protect.

**F-1 (brand, upheld) — folded into C-1.** Label copy "smallest amount that would feel like progress" is acceptable; the required-positive gate behind it is the harm. Addressed by C-1.

**F-2 (brand, resolved) — no independent fix.** "Saving is easier when the plan is yours and it's specific" is a premise, not a directive, and is not independently harmful. It only reads as a broken promise *if* the user hits the C-1 wall. Fixing C-1 neutralizes it. Keep the line.

**F-3 (brand, cleared) — no fix.** The habit-stacking field's optional marking and question framing are sufficient protection for the user with no anchorable routine. It is genuinely skippable in one tap and the output reads correctly without it. Keep as-is.

**L-1 — LOW — Timeline number has no motivational framing in either direction (this is correct; noting for the record).** The 48-months-style estimate (calculator lines 83–86) is suffixed "rough estimate; your actual timeline will vary" and surfaced under a neutral "One rough estimate:" prefix (line 408). It does not say "that's a long time" and does not say "you can do it." This is exactly the neutral handling the persona requires for a number that could otherwise discourage. **Pass — no action.** Recorded only because the task asked this gate to confirm the timeline carries no motivational framing; it does not.

---

### What the Tool Does Well for This User

- **The "not a lock" copy (lines 411–413) is the strongest piece of behavioral design in the suite.** It pre-disarms the single most likely shame event for this user — dipping into savings during the next six-week emergency — before it can happen. "Your money is still yours to use" is calibrated precisely for a life with irregular expenses. This pattern should be lifted into the Finxiety copy library for any future commitment/goal/target tool.
- **No income field, no benchmark, no compound projection, no comparison of any kind.** The tool stays entirely out of the verdict business. This is the lesson of Mint and the church workshop (persona lines 47–49) correctly learned.
- **The output is the user's own words, editable, in first person.** The tool formats; the user authors. This is a clean implementation of agency and the right answer to a user with a trust deficit.
- **The calendar artifact is a real enabling-environment mechanism,** not aspiration. It returns the user's own intention to her at the moment of action, across time — Matuschak's condition for understanding that changes behavior. Titling the event "My savings appointment" rather than a brand string is a small, correct choice that compounds.
- **Privacy note says what does not happen, not that "privacy is protected."** Right specificity for this user.

---

### Sign-Off Decision

One High finding (C-1) remains open: the tool turns away the $0 user at the moment she is most likely to need it, with no path forward. This is the worst-case path the gate exists to protect, and it lands on the core persona at her most reachable, most vulnerable moment. The happy-path experience is excellent and several elements are suite-leading — but a High finding on the worst-case path is, by this gate's standard, a blocker.

Behavioral flags F-1 (upheld, folded into C-1), F-2 (resolved, no fix), and F-3 (cleared, no fix) are adjudicated as noted. The timeline handling (L-1) passes as-is.

Sign-off is **withheld** pending resolution of C-1. Recommended minimum to clear: a non-directive off-ramp at the $0 wall that routes to BEN-1/EMG-1 as expanded supply (Solution 1), framed explicitly as a signpost and not as "your amount was too small." Re-review required after the C-1 change, since it touches both flow and copy at the highest-stakes moment.

⟦BEHAVIORAL-BLOCKED⟧ tool="savings-commitment-maker" ticket="SAVE-1" date="2026-06-22" notes="HIGH C-1: tool cannot be completed by a $0 user and offers no path forward at the wall; brand F-1 upheld and folded in, F-2 resolved, F-3 cleared, timeline passes. Re-review required after C-1 fix."

---

## Re-verify

**Date:** 2026-06-22
**Reviewer:** Behavioral science agent
**Scope:** Targeted re-verification of C-1 (HIGH) only, against the C-1 fix applied. F-2, F-3, L-1 and the happy-path findings are unchanged and not re-litigated here.

**Fix under review:**
- `+page.svelte:52` — `const amountIsZero = $derived(amountInput !== '' && Number.isFinite(amount) && amount === 0);`
- `+page.svelte:306–312` — two-branch prompt: when `amountPrompted && amountIsZero`, a `.signpost-box` reads *"Nothing to commit right now? The Benefits Screener → or Emergency Fund → may open up some room first."*; otherwise the original "Enter an amount to continue." prompt.

### Verification against the four questions

**1. Genuine, non-directive path forward / "expanded supply" framing — PASS.**
The $0 user is no longer turned away into a dead end. The signpost reframes a zero as a *supply* condition ("nothing to commit right now," "may open up some room") rather than a verdict on her ("your amount was too small," "you need to enter more"). It routes to BEN-1 and EMG-1 — the two tools the Cross-Tool Bridge section named — as things that may create room she doesn't currently have. This is the warm handoff Solution 1 called for, and it is correctly framed as expanded supply, not personal deficit. It does not grade her, does not imply the gate was her failure, and gives the door the persona requires (persona line 161: "a result with no path forward is just a mirror... what she needs is a door"). On content and framing, this resolves the core of C-1.

**2. "may open up some room first" vs. recommendation (Do No Harm) — PASS, with a Low note.**
"May open up some room" uses the conditional and asserts no outcome — it stays on the signpost side of the Non-Advice line and does not say "you should apply" or "go do this." It clears Do No Harm rule 1. The one word carrying mild residual weight is **"first"** — a sequencing cue that lightly implies *do those before coming back here*. It is an ordering nudge, not a directive, and "may" defuses most of it; it does not rise to a recommendation. Recorded as **L-2 (Low)** for the PM/brand to consider softening (e.g., "...may open up some room" without "first," or "...are built for exactly that"), but it is **not** a blocker.

**3. Right moment — PASS. This is the strongest part of the fix.**
The signpost is gated on `amountPrompted && amountIsZero` (line 306). `amountPrompted` flips true only inside `buildStatement` on submit attempt (line 108); `amountIsZero` requires a non-empty input that parses to exactly `0` (line 52, the `amountInput !== ''` guard). Consequently the signpost:
- does **not** appear on first load,
- does **not** appear while the field is empty (the `amountInput !== ''` guard prevents it; an empty field that is submitted still falls to the neutral "Enter an amount to continue." branch, which is correct — an empty field is "haven't answered yet," not "I have zero"),
- does **not** appear mid-typing before a submit attempt,
- appears **only** when the user has explicitly typed `0` and tried to advance.
This is exactly the intended trigger surface: the signpost meets the user precisely at the moment she has told the tool she has nothing, and not a moment before. The empty-vs-zero distinction is handled correctly and is a genuinely thoughtful piece of the fix.

**4. Does it address the core C-1 concern — SUBSTANTIALLY YES.**
SAVE-1 is no longer functionally inaccessible to Dani at the $0 wall. The dead end ("Enter an amount" + disabled button, nothing else) is replaced by a path that acknowledges her state without judgment and points to where room might come from. The locus-of-control inversion C-1 identified ("even the free tool built for people like me won't let me in") is neutralized: she is now met, not turned away. F-1 (the warm label over a hard gate) is correspondingly resolved — the gate now has a door beside it.

### Residual finding

**C-1a — MEDIUM — The `.signpost-box` has no CSS rule on this route; the off-ramp renders unstyled at the highest-stakes moment.**
- **What it is:** `.signpost-box` is the suite's established, *component-scoped* styled pattern for warm-handoff boxes — it is defined in the `<style>` block of recertification (`+page.svelte:755`), myth-quiz (`:662`), myth-quiz-2 (`:642`), tip-calculator (`:925`), document-checklist (`:450`), and work-hours (`:824`). Svelte styles are scoped per component, so each route must define its own `.signpost-box`. `savings-commitment/+page.svelte` **uses** the class at line 307 but **never defines the rule** (only `.signpost-footer` exists, line 699; confirmed by grep — no `.signpost-box` selector in this file). On this page the box therefore renders as default-flow body text with default user-agent link styling, directly under the input.
- **Why it matters for this user:** The entire behavioral point of the fix is that the off-ramp must read as *a calm, intentional, set-apart door* — not as an error message and not as a verdict. The contained, visually-distinct box is the signal that says "this is a help, not a failure." Rendered as raw unstyled text immediately below the amount input — in the exact slot the error prompt otherwise occupies — it risks reading as error-adjacent at the precise moment trust is most fragile (persona: result must read "like a weather report, not a test score," line 159). The content does the right thing; the missing visual container undercuts the affect the content is trying to carry.
- **Why MEDIUM, not HIGH:** The path forward genuinely exists, the links work, the trigger logic is correct, and the copy is non-judgmental — the substance of C-1 is resolved. This is an affect/presentation gap, not a content or logic failure. It does not turn the user away. But it is worth closing before distribution because it lands on the worst-case path at the highest-stakes moment.
- **Solution space (this gate flags; PM/engineer decides):** Add a scoped `.signpost-box` rule to this file mirroring the suite pattern (e.g., the recertification/work-hours treatment: surface background, radius, padding, muted-but-legible text, link affordance) so the off-ramp reads as a deliberate signpost box consistent with the rest of the suite. No content change required.

### Updated Sign-Off Decision

**C-1 (HIGH) is resolved.** The $0 user now has a genuine, non-directive, expanded-supply path forward, triggered at exactly the right moment, framed as a door and not a verdict. F-1 is resolved with it. The Do No Harm boundary holds (L-2 Low note on "first" only).

One residual finding remains: **C-1a (MEDIUM)** — the off-ramp renders unstyled because this route is missing the scoped `.signpost-box` CSS rule the rest of the suite defines. Per this gate's standard, no Critical or High findings remain open, so sign-off is **not** withheld. C-1a (Medium) and L-2 (Low) are flagged for the PM/engineer to close before distribution; neither blocks the behavioral seal.

⟦BEHAVIORAL-REVIEWED⟧ tool="savings-commitment-maker" ticket="SAVE-1" date="2026-06-22"

_Seal notes: C-1 (HIGH) resolved — $0 user now met with a non-directive, expanded-supply off-ramp to BEN-1/EMG-1, correctly gated on explicit-zero-after-submit; F-1 resolved. Open: C-1a (MEDIUM) — `.signpost-box` CSS rule missing on this route, off-ramp renders unstyled; L-2 (LOW) — "first" is a mild sequencing nudge, consider softening. Neither is a blocker._

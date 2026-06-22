# Disability Accessibility Review: RECERT-1 (Recertification Deadline Tracker)

**Persona applied:** Disability & Chronic Illness User (`finxiety/research-findings/persona-renee-disability-user.md`), held simultaneously with the ALICE persona (`finxiety/research-findings/persona-alice-primary-user.md`).
**Tool:** `/tools/recertification`
**Files reviewed:**
- `finxiety/src/routes/tools/recertification/+page.svelte`
- `finxiety/src/lib/data/certification-periods-2026.json`
- `finxiety/src/lib/calculators/recert.ts` (supporting logic only)

**Date:** 2026-06-22
**Reviewer:** disability-accessibility agent
**Seal:** see end of document

---

## How Renee arrives here

Scenario B from the persona is the live one for this tool: Renee is mid-flare, a Medi-Cal redetermination notice has arrived, and she hasn't opened it because she's scared of what it says. She is on her phone, typing slowly, with a depleted spoon budget. The acute trigger calendar in the ALICE persona names this exact moment ("A recertification deadline approaches... She got a letter. It says she has 30 days... Missing it means losing a benefit she depends on"). This tool sits precisely on top of one of the persona's named entry points, which raises the stakes for getting the emotional framing right.

---

## Cognitive Accessibility Beyond Compliance

- **Interruption survivability:** Strong. The flow is three discrete steps, each self-contained. If Renee sets the phone down mid-flow and returns, the current step still renders all its own context (Step 2's legend re-states which program and what "last renewed" means; Step 3 re-states that figures are estimates). No timer anywhere. No session expiry. Nothing is lost on interruption *within a step*. The one caveat: state is held in memory only, so a full page reload (accidental browser refresh, OS killing a backgrounded tab during a long flare break) drops everything and returns her to Step 1. For a stateless, no-PII tool this is an accepted tradeoff, not a finding — but see the calendar download framing (Finding 4), which is the real mitigation: once she has the .ics, the reload risk no longer matters.
- **Working memory burden:** Low and well-handled. The tool never asks Renee to carry a value from one screen to the next. The program labels and state chosen in Step 1 are re-displayed (not re-asked) in Steps 2 and 3. The "last renewed, not first applied" clarification is repeated at both the section level (`result-note`, line 331) and the per-program legend (line 339-341), so a foggy reader who missed it once gets it again. This is the right pattern for brain fog.
- **One genuine cognitive-load concern:** Step 2 asks for "the date the agency last approved or renewed your benefits." For Renee on a bad-symptom day, an exact administrative date is often not retrievable from memory. The tool handles this correctly with the "I don't know this date" checkbox and a concrete next step (see Finding on the "I don't know" path below). This is the single most important accommodation in the tool for this persona, and it is present.

**Finding: pass.** The flow is completable on a bad-symptom day. The "last renewed date" requirement is the one demand that exceeds typical flare-day recall, and the tool provides a non-punitive escape hatch for exactly that.

---

## Sensory Accessibility in Lived Practice

- **Dynamic content announcement:** A persistent visually-hidden `aria-live="polite"` region (lines 248-255) announces step transitions ("Step 2 of 3: enter your last certification dates" / "Step 3 of 3: your reminders are ready below"). This is good practice and means a screen reader user is told the context changed, not left to discover it. The download confirmation also lives in a `role="status" aria-live="polite"` region (line 465), so the "reminder file is ready" message announces itself after the download click.
- **Focus management:** Handled deliberately. On entering Step 2, focus moves to the Step 2 heading (`step2HeadingEl?.focus()`, line 131); same for Step 3 (line 170). Both headings are `tabindex="-1"` with a visible focus style (lines 531-535). This moves a keyboard/screen-reader user's attention to where the new content begins rather than stranding focus on a now-hidden button. The "Back" path (line 134-138) relies on the re-rendered h1 receiving focus on re-render; this is a slightly weaker pattern than the explicit forward-focus calls, but the h1 is the first focusable landmark and the comment acknowledges the intent. Flag-level only, noted below.
- **Color-only signals:** Checked specifically because this persona may be navigating alongside QA's automated pass, not as a duplicate of it. The past-deadline state uses `result-due--past` which changes both weight and color (`color: var(--muted)`, line 742-745), but it is also accompanied by explicit text ("The estimated date has already passed...") — so the status is never color-only. The "due soon" date uses olive color + bold weight, but again the plain-language `describeDue()` string ("in about 3 months") carries the same information in text. No status is conveyed by color alone.

**Finding: pass (one flag).** The lived screen-reader and keyboard experience holds up. Flag: the Back-to-Step-1 focus return is implicit (relies on h1 re-render) rather than an explicit `.focus()` call like the forward transitions. Low severity; recommend an explicit focus target on the h1 for parity, so a screen reader user going *back* gets the same deliberate focus placement they get going forward.

---

## Physical & Fatigue Considerations

- **Touch target sizing:** Meets the bar. Program checkboxes sit in `.program-label` rows with `min-height: 44px` (line 564). The "I don't know" checkbox row is `min-height: 44px` (line 657). Select and date inputs are `min-height: 48px` (lines 591, 609). The whole label is the click target, not just the checkbox glyph, which forgives imprecise tapping during a flare when fine motor control is reduced — a direct accommodation for the persona's swollen-hands days.
- **Interaction count:** Minimal for the value returned. For the common single-program path (one benefit, known date): pick state, tick one program, Next, enter one date, Show, Download. That is roughly six interactions to a durable artifact. There is no way to meaningfully reduce this further without losing the per-program date entry the calculation requires. The tool does not pad the flow with optional fields or upsells.
- **Energy-to-value ratio:** This is where the tool is strongest for Renee. The output is not ephemeral. The .ics file converts a one-time expenditure of spoons into a set of automated reminders that fire 30 and 7 days before each deadline, with no further action required. "Do the task once on a good-enough day, carry the reminder through every bad day after" is precisely the right fatigue-economics design. The energy spent yields durable value. See Finding 4 on making this framing explicit.

**Finding: pass.** Targets, interaction count, and especially the energy-to-value ratio all serve the fatigue-limited user well.

---

## Disability-Specific Shame & Disclosure Anxiety

This is the lens where RECERT-1 needed the most careful walk, because the persona's core wound is the SSDI denial and the IHSS-assessor stories: being disbelieved, and being made to feel she must prove or justify a fluctuating condition. I ran the Disclosure Safety Test on every question that touches health, capacity, work-history gaps, or program enrollment.

**Question 1 — "Which benefits are you currently enrolled in?" (SNAP / Medicaid checkboxes, lines 274-291)**
1. *Does answering honestly feel safe?* Yes. The framing is "which reminders do you want," not "which programs have you qualified for." It reads as a logistics question, not an eligibility test.
2. *Room for "it varies"?* The question is about current enrollment, which is a stable fact (you are or aren't enrolled), so a binary checkbox is appropriate here — this is not a capacity or disability-status question in disguise. No issue.
3. *Does framing suggest a benefit/penalty attached to the answer?* No. Nothing is gated on which boxes are ticked except which reminders get built.
4. *Honest answer, least favorable result — still treated fairly?* Yes. There is no unfavorable result; you get reminders for what you pick.
**This question passes.** Critically, selecting "Medicaid / health coverage" does **not** function as a disability-disclosure gate. Medicaid enrollment is broad (income-based, not disability-based, for most enrollees), and the tool never asks *why* she's enrolled, never asks about disability status, diagnosis, work history, or SSI/SSDI. Renee can use this tool end-to-end without ever telling it she is disabled. That is the correct design for this persona.

**Question 2 — "When did [program] last approve or renew your benefits?" (date input, lines 351-361)**
1. *Safe to answer honestly?* Yes — and the "I don't know this date" checkbox (lines 364-367) means not-knowing is a first-class answer, not a failure. For a persona defined partly by poor recall of administrative dates during fog, this is the difference between a usable and an unusable tool.
2. *Room for uncertainty?* Yes, explicitly. "I don't know this date" is offered with equal visual weight to the input, not buried.
3. *Benefit/penalty framing?* None. Choosing "I don't know" routes her to a calm next step (call 211 / check the notice), not to a dead end or a scold.
4. *Honest answer, worst result?* The worst result of "I don't know" is "we couldn't estimate this one, come back when you find it" (lines 439-453) — framed as a held-open door, not a closed one.
**This question passes.**

**No question in the flow asks Renee to categorize, prove, justify, or label a disability.** There is no "do you have a disability?" binary anywhere — the exact trap the persona warns against. The persona's trust condition #1 ("doesn't ask her to diagnose or label herself to proceed") and #2 ("doesn't require a determination she doesn't have yet") are both satisfied by omission, which is the right way to satisfy them for a deadline-tracking tool.

**Past-deadline copy (lines 411-416), checked specifically per the brief.** The visible line reads: "The estimated date has already passed — a passed estimate doesn't necessarily mean your benefits have lapsed," followed by the signpost: "Your approval notice from the agency shows your actual deadline. Calling 211 connects you to a navigator who can check with the agency on your behalf."
Running the Disclosure Safety Test on this as an experience (not a question):
1. Does it feel like a test she failed? **No.** The copy pre-empts the failure read in the same sentence ("doesn't necessarily mean your benefits have lapsed"). It locates authority in the agency's notice, not in the tool's estimate, which protects her from treating a Finxiety estimate as a verdict.
2. The 211 framing — "a navigator who can check with the agency *on your behalf*" — is well-judged for this persona specifically. It offers a human intermediary rather than instructing her to call the agency herself, which lowers the disclosure/confrontation cost for someone with institutional distrust.
4. Worst case (the date genuinely passed): she still feels the tool treated her fairly, because it framed the estimate as fallible and handed her a concrete, low-confrontation way to find the truth.
**The past-deadline state passes the Disclosure Safety Test.** It avoids implying failure and it avoids the adversarial pattern the persona is sensitized to.

**Finding: pass.** RECERT-1 is, for this lens, a model of how to serve Renee without ever forcing disclosure. The tool is useful at every stage of her disability journey (undiagnosed, mid-appeal, determined) because it never asks where in that journey she is.

---

## Benefit-Cliff Fear Specific to Disability

This is the one lens with substantive findings. The brief asked specifically: does the tool surface awareness that Medicaid renewal decisions can affect SSI/Medicaid coordination, and is any such framing information rather than verdict?

What the tool currently surfaces around Medicaid: the Medicaid result card shows the estimated renewal date, a "check your approval notice" caveat, and a link to the state Medicaid site. There is a `mid_cert_note` mechanism (lines 424-428, fed by `mid_cert_note` in the data file), but inspecting `certification-periods-2026.json` confirms **the only `mid_cert_note` defined for any state/program is CA SNAP (CalFresh SAR-7)**. No Medicaid entry in any of the five states carries a mid-cert or coordination note. So for Renee — a California Medi-Cal enrollee — the Medi-Cal card shows a renewal date and nothing about the asset-test / SSI-coordination reality that the persona explicitly loses sleep over ("She is afraid to earn more in a good month because she doesn't fully understand whether a redetermination could end her coverage mid-flare... it's the scenario she thinks about at 2am").

Two things must be held in tension here:
- **Do No Harm and scope discipline:** RECERT-1 is a deadline tracker, not an eligibility or cliff calculator. It must not start giving SSI/asset-limit guidance it isn't built to give, and it must not manufacture fear or urgency (Do No Harm #2). A wall of Medicaid-coordination caveats would both exceed scope and violate the no-fear constraint.
- **The persona's actual need:** Renee does not need this tool to *solve* the cliff. She needs it to not pretend the cliff doesn't exist, and ideally to name — once, calmly, as information — that ABLE accounts exist, since the persona states plainly she has never heard of one and it "would solve her exact problem." The persona's trust condition #4 is "it names the institutional reality without being asked," and condition #7 is "it's honest when something is genuinely complicated."

These are reconcilable. A single, calm, optional signpost — not a warning, not urgency — would close the gap without turning the tracker into a cliff calculator. See Findings 1 and 2.

- **Asset limit acknowledgment:** absent for Medicaid. (Flagged — Finding 1.)
- **Income-is-not-always-good-news framing:** absent. Appropriately so for a *tracker's primary flow* — but a one-line signpost pointing to the cliff tool, where this lens is the whole point, is the right bridge rather than in-lining the warning here. (Finding 2.)
- **ABLE account surfacing:** absent. (Flagged — Finding 1. This is the highest-value, lowest-risk addition available to this tool for this persona.)

**Finding: flag.** Not a fail — the tool's silence on the cliff is partly correct scope discipline, and nothing currently present misleads Renee. But for a tool whose two programs are SNAP and Medicaid, and whose deadline-renewal moment is exactly when an asset-tested disability enrollee is most exposed, the total absence of any signpost to ABLE or to the cliff tool is a missed accommodation for the persona's named 2am fear. See Findings 1 and 2 for the bounded, Do-No-Harm-compliant fix.

---

## Double Vulnerability (Disability × Poverty)

Reviewed as one person who is both ALICE and disabled at once, not two passes.

The compounding-load test: Renee arrives fog-impaired (disability tax) *and* bandwidth-taxed by scarcity (poverty tax), and these draw from the same pool. The tool's design respects this: one decision per step, every prior choice re-displayed rather than re-asked, an explicit "I don't know" that removes the single hardest cognitive demand, and an artifact that ends the need to ever return. A tool that handled only the poverty axis might still demand the exact date with no escape hatch (defeating the fog user); a tool that handled only the disability axis might over-explain and bloat the flow (defeating the scarcity user who has five minutes). RECERT-1 threads both: it is short enough for Dani-in-a-ten-minute-window and forgiving enough for Renee-in-a-flare. The .ics artifact serves both at once — it is a scarcity accommodation (do it once, don't lose the deadline that costs you a benefit) and a fatigue accommodation (don't spend spoons re-doing this) simultaneously.

The single place the double-vulnerability lens *adds* a requirement beyond what either single persona would demand: the Medicaid/SSI coordination gap (above). The poverty lens alone might accept a clean tracker; the disability lens flags that for an asset-tested enrollee, the renewal moment carries a sharper, disability-specific risk that deserves at minimum a calm signpost. That is captured in Findings 1 and 2.

**Finding: pass (with the cliff-signpost flag carried from the section above).** The cognitive-load budget holds for the doubly-vulnerable user. The flow does not compound load; it actively reduces it.

---

## Findings (ordered by severity)

### Finding 1 — MEDIUM: No mention of ABLE accounts anywhere in the Medicaid path
**What it is:** RECERT-1 covers Medicaid, an asset-tested program, and is used at the renewal moment — exactly when an enrollee with disability-linked savings concerns is most activated. The tool never surfaces that ABLE accounts exist. Per the persona, Renee has modest savings (a $1,800 Roth IRA) she fears could jeopardize Medi-Cal/SSI, has never heard of ABLE accounts, and an ABLE account "would solve her exact problem."
**Why it matters for this user:** This is the persona's named, specific, unresolved confusion. A single informational line is the highest-value, lowest-risk thing this tool could add for Renee. The persona's trust condition #4 is that the tool "names the institutional reality without being asked."
**Solution space (for PM, not a directive):** A single calm, optional signpost on the Medicaid result card only — informational, not a warning, no urgency. Something in the register of: "If you have savings and you're on a means-tested program, ABLE accounts are a type of savings account that doesn't count against benefit limits for people with disabilities. [link to an authoritative explainer, e.g. CalABLE or the ABLE National Resource Center]." Must be phrased so it does not imply she *should* have one (Do No Harm #1) and does not imply earning/saving more is dangerous in a fear register (Do No Harm #2). Whether this belongs in RECERT-1 at all, versus the cliff tool, is the PM's call — but the persona evidence that she will never otherwise encounter the concept is strong. Note the scope tension honestly in the ticket.

### Finding 2 — MEDIUM: No bridge to the benefit-cliff tool from the Medicaid renewal moment
**What it is:** The renewal moment is when an income-variable, asset-tested enrollee is most exposed to the cliff (earn more in a good month → redetermination → possible coverage loss mid-flare — the persona's explicit 2am scenario). The result page cross-links to Document Checklist and Benefits Screener (lines 480-492) but not to any cliff/CLIFF-1 tool where this exact fear is the entire subject.
**Why it matters for this user:** RECERT-1 correctly keeps the cliff *out of its primary flow* (scope + Do No Harm), but offering no door at all to where that fear *can* be addressed leaves Renee's sharpest concern unacknowledged by the suite at the moment she's most reachable. The ALICE persona's cross-tool-bridge value and the disability persona's "honest when something is complicated" both point here.
**Solution space:** When CLIFF-1 ships, add it to the related-tools footer (or a Medicaid-card signpost) with moment-naming copy, e.g. "Wondering whether earning more could affect this benefit? [Benefits Cliff tool]." Until CLIFF-1 exists, this is a deferred dependency, not an actionable change — note it against CLIFF-1 so the bridge lands when the destination exists. No urgency framing.

### Finding 3 — LOW: Back-to-Step-1 focus return is implicit, not explicit
**What it is:** Forward transitions explicitly move focus to the new step heading (`step2HeadingEl?.focus()`, `step3HeadingEl?.focus()`). The Back action (lines 134-138) relies on the re-rendered h1 receiving focus on re-render rather than an explicit `.focus()` call.
**Why it matters for this user:** A screen-reader or keyboard user moving *backward* (e.g. Renee realizes she ticked the wrong program) should get the same deliberate focus placement she gets moving forward. Implicit focus return is more fragile across browsers/AT than the explicit pattern already used elsewhere in the same file.
**Solution space:** Give the h1 a `tabindex="-1"` and an explicit `.focus()` after `await tick()` in `backToStep1()`, mirroring the forward transitions, so all three navigations behave identically for AT. Small, self-contained.

---

## What the Tool Does Well for This User

Stated honestly, because these are deliberate wins, not accidents:

1. **It never forces disability disclosure.** Renee can complete the entire flow without telling the tool she is disabled, undiagnosed, mid-appeal, or anything about her body. Selecting Medicaid is not a disclosure gate. This is the single most important thing the tool gets right for this persona, and it gets it right by design.
2. **"I don't know this date" is a first-class answer.** For a persona defined partly by fog-impaired recall of administrative dates, offering not-knowing with equal weight and a concrete, low-confrontation next step (211 navigator) is exactly the accommodation needed.
3. **The past-deadline copy refuses to read as failure.** It pre-empts the "I blew it" interpretation in the same breath, locates authority in the agency notice rather than the estimate, and offers a human intermediary "on your behalf."
4. **The .ics artifact is genuine fatigue economics.** It converts one good-day expenditure of spoons into durable, automated reminders, solving the scarcity deadline-loss risk and the fatigue re-do cost at once.
5. **Working memory is never taxed across screens.** Every prior choice is re-displayed, not re-asked; key clarifications are repeated for the foggy re-reader.
6. **Touch targets forgive imprecise input.** Full-label tap targets at 44px+ accommodate reduced fine motor control during flares.
7. **No timers, no urgency, no fear levers** anywhere in the flow — which protects the doubly-vulnerable user from exactly the manipulation the persona is primed to distrust.

---

## Seal

No Critical or High findings. The three open findings are two MEDIUM (both in the benefit-cliff lens, both bounded and Do-No-Harm-constrained, one of them deferred behind CLIFF-1) and one LOW (focus parity). None of them block: nothing currently present misleads, shames, or forces disclosure on Renee, and the gaps are additive opportunities rather than active harms. The cliff-lens findings are PM/scope calls (whether ABLE belongs in a tracker vs. the cliff tool) rather than accessibility defects.

Sealing as reviewed, with the three findings handed to the PM for disposition.

⟦DISABILITY-REVIEWED⟧ tool="RECERT-1" ticket="RECERT-1" date="2026-06-22"

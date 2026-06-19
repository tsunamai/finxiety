# DOC-1 — Document Checklist Generator: Disability Accessibility Validation Gate

**Reviewer:** disability-accessibility agent
**Date:** 2026-06-19
**Ticket:** DOC-1
**Method:** Static review of the compiled implementation, walked through the Renee persona, then the Dani persona, then both held at once. Every result state traced by hand through `buildChecklist` (single program, SNAP+Medi-Cal, all four + CA, non-CA baseline, empty-list). Disclosure Safety Test run separately on every input and every condition_note in the data file. A live 375px viewport walkthrough was not run this session (sandbox); the cognitive-load and disclosure substance is fully reviewable from source, and the one item that needs a live viewport is flagged below as a confirm-at-viewport, consistent with the behavioral gate's open finding #3.

**Files reviewed:**
- `/Users/naomipinto/Documents/tsunam/finxiety/src/routes/tools/document-checklist/+page.svelte`
- `/Users/naomipinto/Documents/tsunam/finxiety/src/lib/calculators/doc-checklist.ts`
- `/Users/naomipinto/Documents/tsunam/finxiety/src/lib/data/doc-requirements.json`
- Prior gate sign-offs in `/Users/naomipinto/Documents/tsunam/finxiety/status-updates/doc-1-validation-2026-06-17.md`

**Framing note that shapes this whole review.** DOC-1 is the gentlest tool in the suite for this persona because it asks her nothing about herself. The two inputs are "which programs" and "which state." There is no health question, no capacity question, no work-history-gap question, no disability question, direct or by inference. The entire surface area for disclosure shame is therefore close to zero by construction. The risks that remain for Renee are not disclosure risks; they are (1) a fatigue/working-memory question about whether the multi-program list survives a flare day, and (2) a scope/signposting question: the v1 program set is not disability-specific, and a Renee who comes here mid-SSDI-appeal looking for what to bring to a disability claim will not find it, and is not told so. Those are the two things this review actually turns on.

---

## Cognitive Accessibility Beyond Compliance

- **Interruption survivability:** Strong. The tool is a single-screen form (two controls, one button) followed by a static, persistent result. Nothing is timed. If Renee sets the phone down mid-flare and comes back, her checkbox and dropdown state are still on screen; after submit, the rendered list is static HTML she can re-read from any point. There is no wizard, no step she can lose, no expander she has to remember she opened. The Copy and Print affordances let her move the result out of the volatile browser session entirely (text to herself, printout in her bag), which is the strongest possible interruption defense: the artifact outlives the session.
- **Working memory burden:** None across screens. There is only one screen of input and one screen of output, and the output never asks her to hold a value from the input. Within the result, the de-duplication is the antidote to working-memory load, not a source of it: the "Needed for CalFresh, Medi-Cal, and HEAP" tag and the divergence notes ("one copy covers all three") mean she does not have to mentally cross-reference three separate lists to notice an overlap. The tool does that for her. For a brain-fog reader this is exactly right.
- **Sentence length under complexity:** Mostly short and plain. One watch item: a few `accepts` and `description` strings in the data file are long, multi-clause sentences (e.g. the `identity.ssn` description, the `benefit_income` description). They are readable on a good day but are the densest text in the tool. They are descriptive, not load-bearing for completing the task, so a fog reader can skim past them without losing the thread. Not a blocker.
- **One decision per screen:** The screen carries two decisions (programs, state) plus a button. This is within tolerance: both are recognition tasks (tick boxes, pick from a list), not recall or calculation, and the disabled-until-ready button means she cannot make a wrong move. The framework prefers one decision per screen "where possible"; collapsing to one screen here is the right call because it avoids a multi-step flow that a flare could interrupt mid-stream.
- **Errors are forgiving:** There is no error state that costs progress. The only gate is the disabled submit button, which now carries an inline hint ("Select at least one program and a state to continue") so a high-fatigue user is told what is missing rather than left guessing why the button is dead. The non-blocking item the prior disability note raised here is resolved in the implementation.

**Finding: PASS.** The flow survives interruption, carries no cross-screen working-memory load, and the de-dup mechanic actively reduces cognitive load rather than adding it. Completable on a bad-symptom day.

---

## Sensory Accessibility in Lived Practice

- **Dynamic content announcement:** The result appears without a page reload, and a persistent `aria-live="polite" aria-atomic="true"` region announces "Your document checklist is ready below." on submit. The copy-confirmation uses `role="status" aria-live="polite"`. A screen reader user is told both that the list rendered and that a copy succeeded or failed. Correct.
- **Focus management:** After submit, focus moves to the result `<h2>` (`tabindex="-1"`, `resultHeadingEl?.focus()` after `await tick()`). Focus lands where a sighted user's attention would go, not stranded at the top. Correct.
- **Color-only signals:** The status pills (Required / Choose one / If it applies) carry their meaning in text, with an `sr-only` prefix span announcing the status and an `aria-hidden` span for the visual. Meaning is not conveyed by color alone. The non-CA baseline banner is the olive signpost style, not a warning color, and its meaning is in the text. Correct.
- **Targets with imprecise input:** Program label rows are full-width with `min-height: 44px`, so a tremor or imprecise tap lands on the whole row, not just the small checkbox. The state select is `min-height: 48px`. Source links and the secondary action buttons meet 44px. This tolerates imprecise input, which is the lived-practice bar for RA-affected hands on a flare day, not just the minimum-size bar.

**Finding: PASS.** No new sensory issue beyond what QA already verified. The 44px-plus full-row tap targets specifically serve the limited-fine-motor case this persona lives.

---

## Physical & Fatigue Considerations

- **Touch target sizing:** Meets and exceeds 44px on every interactive element (program rows 44px, state select 48px, source links 44px, action buttons full-width with 44px). Spacing between program rows is adequate; an imprecise tap will not toggle the wrong program.
- **Interaction count:** Minimal and correct. To reach the full result: tick one-to-four checkboxes, pick one state, tap one button. No dropdown-requiring-scroll except the state select (unavoidable, and a native select on mobile is a single-gesture wheel, not a fatigue load). No multi-tap confirmations, no toggles to manage. The result is then read-only; no further interaction is required to extract value.
- **Energy-to-value ratio:** Strongly positive for this persona, and this is the heart of the fatigue case. Renee's alternative to DOC-1 is opening three separate program sites, each with its own document list, and manually working out which documents overlap, on a day when typing hurts. DOC-1 collapses that into roughly six taps and returns a de-duplicated, portable list. The energy spent is far less than the energy the result saves, which is the exact ratio the framework demands. A tool that took five minutes of careful typing to return this would fail here; this one does not.

**Finding: PASS.** Low interaction count, generous targets, and a genuinely favorable energy-to-value ratio. For a spoon-limited user this tool gives back more capacity than it costs, which is rare and is the point.

---

## Disability-Specific Shame & Disclosure Anxiety

### Disclosure Safety Test — run on every question and every condition_note

The tool has only two inputs and a set of conditional document notes. None is a health, capacity, or work-history question. I ran the four-question test on each surface that touches benefit-program enrollment or could reveal status by inference.

**Input 1 — "Which programs are you applying for?" (checkboxes)**
1. Safe, or feels like a test? Safe. It is a "what are you doing" question, not a "what are you" question. Ticking CalFresh and Medi-Cal discloses intent to apply, nothing about her body or her worthiness.
2. Room for uncertainty? She can tick one, several, or — if she is unsure — follow the footer to the screener instead. No forced binary.
3. Benefit/penalty attached to the answer? None. The tool makes no determination. Ticking more boxes only ever produces a more complete list, never a judgment.
4. Honest answer, least favorable result, still feels fair? The least favorable result is the empty-list state, which routes calmly to official sources. Yes, fair.
**Result: PASS.**

**Input 2 — "Your state" (select)**
1. Safe? Yes. Geographic, administrative.
2. Room for uncertainty? Selecting a non-CA state yields the national baseline with a calm banner, not an error. "I'm not in your detailed state" is a valid, gracefully handled answer.
3. Benefit/penalty? None.
4. Least favorable (non-CA baseline) still fair? Yes — see Do No Harm section below.
**Result: PASS.**

**Condition_note: "Bring this if anyone in your household receives disability, unemployment, child support, or other benefits."** (the `benefit_income` item)
This is the only place the word "disability" appears in the tool. It is critical to be precise about what it does and does not do:
1. Safe? Yes. It names disability as one example of a *type of income a household might receive*, alongside unemployment and child support. It is not asking Renee to declare herself disabled; it is telling her that if disability income exists in her household, the award letter that proves its amount is a useful document to bring. The framing points at the document, not at her.
2. Room for uncertainty? Yes — "if anyone... receives." She is not asked to categorize herself. If she has an SSDI award she brings the letter; if her appeal is unresolved and she has no award yet, the condition simply does not apply to her and she moves on. Both states are valid and neither is flagged as incomplete.
3. Benefit/penalty attached? None. It is a conditional document hint, not an eligibility input.
4. Honest answer, least favorable, fair? There is no unfavorable result; it is a packing note.
**Result: PASS.** The word "disability" here is income-category language, not status-identifier language. The prior gate's reasoning holds and I confirm it independently against the disclosure framework: this is the correct, safe way to reference disability income, and it does not require Renee to claim or prove a status to the tool.

**Other condition_notes** ("if anyone is self-employed," "if you are applying for a child," "if you are claiming a qualifying child," "if you have one available") — all administrative/household facts, none health- or capacity-coded. PASS.

- **"Disabled enough" gatekeeping:** Absent. There is no copy anywhere that grades, ranks, or implies a threshold of disability. The tool cannot tell Renee she is or is not disabled enough because it never evaluates her at all.
- **Disclosure has visible cost:** No. Nothing she enters is held against her; nothing is stored; ticking a program never produces a worse outcome.

**Finding: PASS.** This is the safest possible posture for this persona on the disclosure axis: the tool asks her nothing about herself. The single appearance of "disability" is correctly scoped as a household-income example, not a status question. A user mid-appeal, undiagnosed, or self-identifying without a determination can complete the entire tool without ever being asked to label herself.

---

## Benefit-Cliff Fear Specific to Disability

This is where the substantive findings live. DOC-1 makes no eligibility or income determination, so it cannot itself push Renee over a cliff by telling her a higher number is good news — that whole class of harm is structurally absent here. But the framework's checklist still applies in two specific ways, and the tool's silence on its own scope is the issue.

- **Asset-limit acknowledgment:** Not present, and for v1 this is acceptable but worth naming. The v1 programs (SNAP/CalFresh, Medi-Cal, LIHEAP/HEAP, EITC/CalEITC) are income-tested, not asset-tested in the SSI sense, and DOC-1 only lists documents — it never asks about or comments on assets. So there is no place where the tool implies "assets don't matter to you" falsely. The asset-limit/ABLE concern attaches to SSI and to Medi-Cal's aged-and-disabled pathways, neither of which is the document scope here. ABLE surfacing is therefore **not yet relevant to this tool's scope**, and forcing it in would be noise. I note it only to record that I checked: the absence is correct, not an oversight.
- **Variable income treated as a data error:** Not applicable in a harmful way — the tool never asks for an income figure, so it cannot assume a stable monthly number. This is actually a quiet win for Renee: unlike a screener with a single `gross_monthly_income` field, DOC-1 has nothing that signals "we assumed your income is stable." It asks her to bring "proof of income from the last 30 days," which accommodates a variable-income reality without comment.
- **"Earning more is good news" framing:** Absent, correctly. No such framing exists because there is no income or eligibility surface.
- **Scope disclaimer and the missing disability-program bridge:** This is the real finding (High, below). The v1 set contains no disability-specific program. A Renee who arrives mid-SSDI-appeal — a plausible and named entry path for this persona — and is looking for "what do I bring to a disability claim" will tick nothing that matches her actual need, and the tool never tells her that SSI/SSDI/IHSS document checklists are out of scope or where to look. The only bridge offered is to the Benefits Screener (BEN-1), which is itself currently non-disability-specific. The tool is silent about its own boundary, and for this persona that silence can read as "there's nothing here for me" or, worse, as the same institutional shrug she already knows.

**Finding: FLAG (one High finding, see below).** No cliff-harm is possible from this tool's outputs. But the unacknowledged scope boundary, combined with the absence of any signpost toward disability-specific document help, is a real gap for the persona this gate exists to protect.

---

## Double Vulnerability (Disability × Poverty)

- **Compounding-load check, both personas held on the same screen:** I read the result screen as Renee-and-Dani at once: a flare week, a redetermination notice she is scared to open, scarcity bandwidth and brain fog stacked. The tool holds up. The cognitive budget for someone carrying both is smaller than for either alone, and DOC-1 spends almost none of it: recognition-only inputs, a de-duplicated rather than additive list, named category buckets instead of an undifferentiated pile, and a portable artifact she can act on later when the flare lifts. The de-dup is doubly valuable for this user: it is bandwidth relief for the scarcity axis and effort relief for the fatigue axis at the same time, from the same mechanic.
- **One flow, not a disability-version branch:** The tool does not fork. There is no "are you disabled" question that would split Renee into a separate path. She uses the identical flow Dani uses. This is correct per the framework — but it also means the scope gap above lands on the same single flow, which is why the fix should be a universally-worded signpost, not a disability-only branch.
- **The one place the compounding load is heaviest:** The longest data-file sentences (SSN accepts list, benefit_income description) are the densest reading in the tool. For a both-axes reader on a bad day these are skimmable rather than blocking, because they are descriptive detail under an already-named item, not instructions she must parse to proceed. Watch item, not a finding.

**Finding: PASS.** The single shared flow serves both axes, and the de-dup mechanic relieves both the scarcity tax and the fatigue tax simultaneously. The tool does not assume disability and poverty are separate users.

---

## Critical Findings

**1. [HIGH] No scope disclaimer and no bridge toward disability-specific document help.**
*What it is:* The v1 program set is SNAP/CalFresh, Medi-Cal, LIHEAP/HEAP, EITC/CalEITC — none disability-specific. The tool never states that disability-claim document checklists (SSI, SSDI, IHSS) are out of scope, and offers no signpost toward where a user navigating a disability claim could look. The only forward bridge is the footer link to the Benefits Screener, which is itself currently non-disability-specific.
*Why it matters for this user:* Scenario B in the persona is explicit: Renee opens a Finxiety tool three days into a flare, scared of a benefits notice, looking for clarity fast. She is fourteen months into an SSDI appeal. If she lands on DOC-1 hoping for "what do I bring," she finds four programs that may not be the one on her mind, and silence about everything that is. For a user whose defining experience is the institutional shrug — the SSDI denial letter that ignored eleven years of records — a tool that quietly has nothing for her, and does not say so, can reproduce that exact "this system isn't for me" feeling. The tool's own honesty principle ("This is a guide, not the official list") sets a standard it does not yet meet about its own coverage.
*What a solution space looks like:* A short, calm, universally-worded line near the result or footer naming the boundary and pointing onward without requiring any disclosure — something in the register of "This list covers SNAP, Medi-Cal, energy assistance, and the EITC. Documents for disability claims like SSI, SSDI, or IHSS work differently; [official starting point] is the place to begin for those." It must not branch on a disability question, must not ask her to self-identify, and must match the persona's stated preference (#4, #5): name the institutional reality plainly, do not perform sympathy. This is a copy + light-data addition, not a flow change. PM, brand, and Naomi own whether and how to word it; flagging it as the blocker for this gate.

**2. [LOW] Densest data-file sentences are a mild fatigue cost on a bad day.**
*What it is:* A few `description` and `accepts` strings (notably `identity.ssn` and `income.benefit_income`) are long multi-clause sentences — the densest reading in an otherwise plain-language tool.
*Why it matters for this user:* On a brain-fog day, long sentences cost more to parse. These are skimmable (descriptive detail under an already-named item, not instructions to complete a step), so the cost is real but not blocking.
*What a solution space looks like:* Optional future copy pass to break the longest into two short sentences. Not a v1 blocker; recorded so it is visible if a copy pass happens.

**3. [LOW / confirm-at-viewport] Repeated "Required" pill weight at live 375px.**
*What it is:* This is the behavioral gate's open finding #3, carried forward because it bears on this persona too. A 9-to-11-item list each stamped with a filled status pill could, at live 375px, read as a wall rather than as named buckets.
*Why it matters for this user:* For a both-axes reader, the difference between "five small named buckets" and "eleven things stamped REQUIRED" is the difference between relief and dread, and it lives entirely in visual weight. Structurally the category groupings and the "Choose one"/"If it applies" pills mitigate this, so it is likely already fine.
*What a solution space looks like:* design-ux/QA confirm at a live 375px viewport that category groupings visually dominate over the repeated pills. Not a known defect; a confirm item shared with the behavioral gate.

---

## What the Tool Does Well for This User

- **It asks her nothing about herself.** Zero health, capacity, work-history, or disability questions. The entire disclosure-shame surface is absent by construction. For a user whose every prior contact with disability systems involved being assessed and doubted, a tool that simply hands her information without evaluating her is itself a kind of relief.
- **The one appearance of "disability" is correctly scoped.** It names disability as a type of household income (alongside unemployment, child support), not as a status she must claim or prove. This is the right, safe way to reference disability income, and it leaves a mid-appeal or undiagnosed user able to answer honestly with no test attached.
- **It never assumes stable income.** With no income field at all, it cannot signal "we assumed your paycheck is steady" the way a single-`gross_monthly_income` screener would. "Proof of income from the last 30 days" quietly accommodates a variable-income reality.
- **The de-dup relieves both the scarcity tax and the fatigue tax from one mechanic.** Gather the energy bill once for three applications: less to hold in mind and less to physically chase on a flare day, simultaneously.
- **It is portable, which is the real interruption defense.** Copy and Print move the list out of the volatile session into her phone or her bag, so a flare that ends the session does not end her access to the result.
- **The energy-to-value ratio is genuinely favorable.** Six taps in exchange for collapsing three separate document hunts into one is exactly the trade a spoon-limited user should be offered.

---

## Sign-off

One High finding remains open: the tool has no scope disclaimer and no signpost toward disability-specific document help (SSI/SSDI/IHSS), and its only forward bridge is to a currently non-disability-specific screener. For the persona this gate exists to protect — a user who may arrive mid-disability-claim and whose defining wound is the institutional shrug — a tool that silently has nothing for her, and does not say so, is a Do-No-Harm-adjacent gap, not a cosmetic one. The fix is a small, universally-worded, disclosure-free signpost; it does not require a flow change or a disability question.

Everything else passes, and several dimensions pass unusually well: disclosure safety, fatigue/energy-to-value, and double-vulnerability load are all strong.

Withholding sign-off pending resolution of Finding #1 (High). Findings #2 and #3 are Low / confirm-at-viewport and do not block on their own.

No `⟦DISABILITY-REVIEWED⟧` sign-off issued at this time.

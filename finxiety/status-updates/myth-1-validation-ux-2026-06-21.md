## UX Review: Benefits Myth-Check Quiz (MYTH-1) — Full Flow

**UX review date:** 2026-06-21
**Reviewer:** design-ux agent
**Files reviewed:**
- `finxiety/src/routes/tools/myth-quiz/+page.svelte`
- `finxiety/src/lib/data/myth-quiz.ts`
- `finxiety/src/app.css`
- `finxiety/research-findings/persona-alice-primary-user.md`
- `finxiety/status-updates/myth-1-validation-qa-2026-06-21.md`

---

### Nielsen Checklist

| Heuristic | Status | Notes |
|---|---|---|
| Visibility of system status | PASS | Progress bar (terracotta/pine fill, 6px track) plus "Question X of 5" label keep the user oriented at all times. Bar is aria-hidden — decorative only — but the text label backs it up for screen readers. |
| Match between system and real world | PASS | "Lock in my guess," "The real number," "You guessed" — all plain English. No bureaucratic program names on the question or reveal surface (BBCE, SNAP are named in context only after the user has committed). |
| User control and freedom | PASS | Back navigation exists on both estimate and reveal phases. "Start over" resets cleanly. State is locked (estimates can't be re-opened) which is intentional and correct — not a loss of control. |
| Consistency and standards | PASS | Button hierarchy (btn-primary / btn-ghost), field-hint, error-msg, and reveal card patterns match the system-wide app.css tokens. No orphan styles or one-off conventions. |
| Error prevention | CONDITIONAL PASS | Sliders (percentage, range) prevent invalid input by design. Number inputs have min/max validation on submit. The Q1 empty-string-to-0 edge case (QA F-2) is the one gap — see Required Changes. |
| Recognition rather than recall | PASS | The compare block on each reveal shows both "You guessed" and "The real number" side by side — the user never needs to remember their estimate. Progress label maintains location context. |
| Flexibility and efficiency | PASS | Single-input-per-phase pattern is appropriate for the ALICE user. No power-user path is needed; the quiz is short enough that shortcuts would not add value. |
| Aesthetic and minimalist design | PASS WITH NOTE | The reveal phase has four distinct content blocks in sequence: compare card, headline + body, why-box, signpost-box, then a collapsible sources disclosure. This is five separate visual units before the navigation row. Each block earns its place informationally, but the density is worth watching as questions with longer revealBody text are added. See Ive section. |
| Help users recover from errors | PASS | Error messages are in plain English ("Enter a number between 0 and 50.") and positioned immediately below the input, before the submit button. `role="alert"` ensures announcement. |
| Help and documentation | PASS | The welcome screen sets expectations in two sentences. "No grades, no right answers" removes performance anxiety. In-field hints state bounds inline. No external documentation needed for a 5-question quiz. |

---

### Norman Principles

**Affordances:**
The estimate controls signal their purpose correctly. Number inputs look fillable (standard text box). Slider inputs are rendered at full width with anchor labels at both ends and a live output value that updates as the thumb moves — this is strong affordance for a non-obvious control type. The "Lock in my guess" CTA is clear about what happens next (commitment, not just a next-page advance). The "details/summary" sources disclosure is a native browser element with arrow indicator — discoverable without instruction. One gap: the range slider (Q2, "A few thousand" / "Millions") has no live readout displayed beside the thumb the way the percentage slider does (which shows "{currentValue}%"). The range slider's `field-hint` updates with `describeRange()` text, but this is below the slider rather than adjacent to the thumb. At 375px, this creates a cognitive gap — the user moves the thumb and must look down to see what their position means. This is a polish-level affordance issue but worth correcting.

**Feedback:**
The estimate-to-reveal transition is the most critical feedback moment in the tool, and it delivers well: the compare block puts guess and real answer side by side immediately, in a surface-contrast card, with the real answer in the brand accent color. This is the "I finally understand this" moment Carmen Simon identifies as the most memorable experience the tool can create. The transition is animated (fadeIn 0.2s) which gives a perceptible state change signal. The progress bar advances on reveal (from qIndex/total to (qIndex+1)/total), reinforcing progress. No spinner or loading state is needed given client-side execution.

**Constraints:**
Sliders cannot go out of range by design. Number inputs have min/max attributes plus server-side-style validation on submit. The Q1 empty-input gap (QA F-2) is the only unconstrained edge case. The dollar input (Q3) is protected because inputMin=1 rejects the 0 that an empty string produces. Q1 (number, inputMin=0) is the single failure point.

**Conceptual model:**
The tool describes itself as a quiz — "guess first, then see the real number" — and behaves exactly like that. The mental model is: make a guess, get the real answer, understand the gap. This is coherent and met. One subtle tension: the synthesis screen ("One more thing") appears after all reveals and before the score screen, which creates a structural surprise — the user expects either "you're done" or "one more question." The optional framing and "no right answers" language handle this adequately, but the phase transition copy could be slightly more orienting. This is low severity.

---

### Ive Restraint Test

**Elements that can be removed:**
- The `.box-label` text "Why the gap exists" above the why-box is the one element that does not earn its place. The olive left-border and cream background already visually separate this block. The label adds no information — it tells the user what the paragraph says before they read the paragraph. Removing it would reduce visual weight on the reveal screen without losing any informational value. The signpost-box has no equivalent label and reads better for it. Recommend removing.
- The `<p class="tool-description">` on the synthesis screen ("One more thing (optional, no right answers).") gives the user accurate orientation, but "no right answers" was already established on the welcome screen. The redundancy is not harmful but the line could be tightened to "One more question — no right answers." at most.

**Elements that must stay:**
- Both the why-box and signpost-box. These are the structural explanation and the exit ramp respectively. Removing either would reduce the reveal to a fact-delivery moment without system framing. The system framing is what makes the tool feel different from a trivia quiz.
- The `<details>` sources expander. It does not load the screen because it defaults to collapsed; it provides the credibility signal Dani needs to trust the output.
- The "No grades, no right answers" line on the welcome screen. This is the most important copy on that screen. It removes the performance threat that would cause an ALICE user to disengage before starting.

**Visual hierarchy:**
On the reveal phase, the hierarchy reads: compare card (dominant, surface background) → headline (1.375rem bold) → body (1rem) → why-box (olive border) → signpost-box (terracotta border) → sources (collapsed, muted). This is appropriate. The primary information (guess vs. real) is visually first. The structural explanation and cross-tool signpost are secondary. The sources are available but not competing. The only issue is that the why-box and signpost-box are visually similar (same cream background, same left-border pattern, different border color). At a glance, they read as a single visual region rather than two distinct things. This is not a critical problem given the box-label on the why-box, but removing that label (per above recommendation) would make them more distinct rather than less — the signpost-box's terracotta border would then be the stronger visual pull, which is correct (it's the action-oriented element).

---

### Simon Memory Test

**The one memorable output:**
As currently designed, the score screen presents "X of 5 reveals seen" — but the user has seen all 5, so this will almost always read "5 of 5 reveals seen." That number conveys nothing memorable. It is not a verdict (correctly), but it is also not a fact. The tool's reveals are rich with memorable specific facts: $6.16/day, 41 states, 41% procedural loss rate. The score screen does not surface any of these. A user who finishes the quiz and closes the tab has a pile of facts from five reveals but no single crystallized takeaway from the close.

Contrast this with the Simon principle: "One memorable output per tool." For MYTH-1, that output should be something like "You just learned five things about benefits programs that most people don't know." Or more specifically, it could reflect the synthesis choice (if the user selected one). The current score copy ("Most of these gaps aren't about what any one person did. They're about how the systems are built.") is the right message — but it's presented as body text below a meaningless "5 of 5" number. The structural framing should be the score card headline, not a number. This is a Required Change (see below), medium severity.

**Cognitive load assessment:**
Per question: low. One question, one control, one submit. The estimate phase is as cognitively minimal as this type of question can be.

Per reveal: medium, but appropriately so. The user has just committed a guess and wants to see the real number. The compare block delivers that immediately. The additional blocks (why-box, signpost) are available for the user who wants more, and the sources expander is collapsed by default. The reveal is not overwhelming — it sequences the information in the right order.

Per synthesis: low. Two optional questions, neither graded, no submission required.

Score screen: low. This should remain simple. The only change needed is to the score-card headline value (see above).

Overall: cognitive load is well-managed. The progressive disclosure of sources, the collapsible expander, and the one-question-per-phase structure are all correct decisions for the ALICE user who is managing high ambient cognitive load.

---

### Financial Anxiety Overlay

**Shame signals:**
None detected. Review confirmed the following:
- Score screen uses "reveals seen" not "correct answers" or "score." This is the single most important shame-prevention decision in the tool and it is correctly implemented.
- Error messages are neutral and instructional ("Enter a number between 0 and 50"). No exclamation. No "incorrect."
- All five `revealHeadline` values locate the gap in the system, not in the guesser. Q2: "And it's a design flaw, not a personal failure." Q4: "eligible families who lost benefits over paperwork." The structural framing is consistent throughout.
- The synthesis prompt "Which of these surprised you most?" correctly positions the user as having learned something, not having been wrong about something.
- No comparison to other users. No "most people know that..." No benchmarking. The language describes the systems, not the user's performance relative to others.

**Trust signals:**
Present and adequate. Official sources are linked per reveal in a collapsible block. The score screen disclaimer ("These figures come from public research, linked on each reveal. Programs change. The official sources are the place to confirm what applies to you.") is present and correctly scoped. The `last_updated` field in the data module is not surfaced in the UI — this is the right call for a quiz whose data is a public record rather than a personalized calculation. Sources per reveal function as the trust anchor.

One gap: the signpost on Q4 (the paperwork/recertification reveal) has no URL — only text. The text mentions "knowing your deadline in advance is the fix" but offers no link. This is noted in QA F-16 as intentional (no dead link), but from a trust perspective, a reveal that tells someone they may be at risk of losing benefits they still qualify for, and then offers no path, creates a trust close that lands softly rather than landing with a door. This is a UX issue, not a Do No Harm violation. A link to an informational resource on SNAP recertification (CBPP or benefits.gov) would close the loop. This is a polish item, not a required change, given that RECERT-1 is on the roadmap.

**Cognitive load:**
Low on estimate and synthesis phases. Medium on reveal phase (appropriate — the reveal is where the learning happens; medium is correct here, not a failure). The reveal's structure sequences information from most concrete (the numbers) to most contextual (structural explanation) to most actionable (signpost). This matches how a stressed user processes information: immediate answer first, context second, path forward third. The ordering is correct.

---

### Required Changes Before Build

1. **[REQUIRED — Medium] Score screen headline is not the memorable output (Simon).** The score-number card shows "5 of 5 / reveals seen" which is both always true and informationally empty. The `<h2 class="reveal-headline">` below it ("The real numbers behind five things most people believe.") is the actual memorable close. Restructure: promote the structural framing copy to the score-card, and remove or deprioritize the "X of 5" count. If the count is kept, position it as a secondary detail, not the visual apex of the screen. The user should leave remembering what they learned, not that they clicked through all five slides.

2. **[REQUIRED — Medium] Q1 empty-input submits silently as 0 (QA F-2, confirmed UX concern).** This is not merely an edge case bug — it is a UX failure on the first question of the tool. Q1 is the first action Dani takes. If she has not yet interacted with the number input and taps "Lock in my guess," she sees "You guessed: 0 states / The real number: 9 states." She did not guess 0. She made no guess. The reveal will read as a result for a guess she did not make. This undermines the estimate-before-reveal mechanic that is the tool's core interaction. Add the explicit empty-string check before the Number() conversion, as specified in QA F-2.

3. **[REQUIRED — Low, but must be resolved before public launch] Focus management on phase transitions (QA A-2).** Keyboard users who activate "Lock in my guess" will have focus dropped when the estimate section is replaced by the reveal section. `aria-live="polite"` will announce the reveal content, but focus will be at an undefined location — browser-dependent, typically the body or the preceding focusable element. WCAG 2.4.3 (Focus Order) requires that focus follow a logical sequence. After any phase transition, focus should be moved to the first meaningful element of the incoming phase: the progress label, the compare card, or an `h2` at the top of the reveal. Implement via a Svelte `$effect` on phase that, after the next tick, calls `.focus()` on a `tabindex="-1"` element at the top of each phase's section.

---

### Polish Items (Not Required for Launch)

These do not block the ⟦UX-REVIEWED⟧ sign-off but should be tracked for the first post-launch iteration.

**P-1 — Range slider has no adjacent live readout.** The percentage slider (Q4, Q5) shows the current value inline next to the thumb via `<output class="slider-value">`. The range slider (Q2) does not — the description appears in the field-hint below. At 375px, this creates a spatial disconnect between the action (moving the thumb) and the feedback (reading the label). Add a readout adjacent to the thumb for the range slider, matching the percentage slider pattern. The `describeRange()` function already computes the display text; it only needs to be placed next to the thumb.

**P-2 — Remove the `.box-label` "Why the gap exists" label on the why-box.** The olive left border already differentiates this block. The label restates what the paragraph does. Removing it reduces visual noise on the reveal screen without losing information.

**P-3 — Duplicate sr-only label on percentage inputs (QA A-1).** The outer question-prompt label and the sr-only secondary label both target `id="estimate-input"`. Screen readers concatenate them. The sr-only label "Your estimate, as a percentage" is redundant given `aria-valuetext="{currentValue} percent"` on the slider. Remove the sr-only label from the percentage input block; the aria-valuetext already handles unit context during interaction.

**P-4 — Q4 signpost has no outbound link.** The recertification reveal's signpost ("Knowing your deadline in advance is the fix") offers no link. When RECERT-1 ships, this should be updated to point to it. Until then, consider linking to benefits.gov or a CBPP recertification resource to close the loop for users who arrive at this reveal in the highest state of urgency.

**P-5 — Ghost button tap targets on score screen.** QA M-1 noted that `.btn-ghost` overrides min-height: 48px. At the score screen, the two ghost buttons ("Back to Finxiety" and "Start over") are end-of-flow navigation — not primary actions. WCAG 2.5.5 is Level AAA, so this is advisory at AA. However, Finxiety targets the ALICE user on a phone, and small tap targets on navigation actions at the end of a flow cost goodwill. Recommend setting `min-height: 44px` on `.btn-ghost` as a floor.

---

### Assessment Against Dani (ALICE Persona)

Dani opens this on her phone, possibly between picking up her kids. The tool starts without asking for anything. The welcome screen is two sentences and a button. The first question is clear and the input is sized for a thumb. The "No grades, no right answers" line removes the performance threat that would cause her to close the tab.

The estimate-before-reveal mechanic is the right structure for this user. She has absorbed enough financial shame that a tool which simply delivers facts she "should have known" would fail her. The mechanic makes her the active participant — she committed a guess, she got the real answer, the gap is framed as a system failure, not a knowledge failure. This is well-designed for her emotional state.

The five reveals are each followed by a cross-tool signpost. The signpost is informational ("the Benefits Screener checks eligibility for CalFresh, Medi-Cal, WIC, and more in one pass") rather than imperative. This is correct. Dani knows what she needs. She does not need to be told to apply.

The synthesis screen's optional free-text question ("If someone told you they'd lost their SNAP benefits last year, what would you assume happened?") is the most sophisticated piece of this tool. It inverts the shame dynamic: it asks Dani what she would assume about someone else. If she completes it honestly, she will likely write something like "they must have earned too much" or "they probably did something wrong" — and then she has just documented her own prior belief, immediately after learning that 41% of families lose benefits to paperwork, not to income. This is good behavioral design. It does not need to be called out; it works quietly.

The score screen is the one place the tool currently fails Dani. She reaches the end having processed five substantive reveals, and the screen greets her with "5 of 5 reveals seen" — a number that means nothing. She needed a closing line that reflects what she just learned. The structural framing copy below the score card is that line; it needs to be elevated.

---

### Summary Table

| Area | Status |
|---|---|
| Flow clarity and affordance | PASS |
| Mobile 375px operability | PASS (with P-1 polish note on range slider readout) |
| Cognitive load per phase | PASS — low/medium appropriately distributed |
| Progressive disclosure | PASS |
| Focus management (QA A-2) | REQUIRED CHANGE before public launch |
| Empty-estimate edge case (QA F-2) | REQUIRED CHANGE — undermines core mechanic on Q1 |
| Score screen memorability | REQUIRED CHANGE — restructure score-card headline |
| Shame signals | NONE DETECTED |
| Trust signals | PRESENT — sources, disclaimer, structural framing |
| Financial anxiety overlay | PASS — framing is system-first throughout |

---

⟦UX-REVIEWED⟧ tool="benefits-myth-check-quiz" ticket="MYTH-1" date="2026-06-21" status="CONDITIONAL" open-required-changes="3 (score-screen-headline, Q1-empty-input, focus-management)" open-polish="5 (range-slider-readout, box-label, sr-only-label, Q4-signpost-link, ghost-button-tap-target)" sign-off-condition="Required changes 1-3 resolved before public launch; polish items tracked for first post-launch iteration"

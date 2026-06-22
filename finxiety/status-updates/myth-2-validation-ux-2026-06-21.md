## UX Review: Personal Finance Myth Quiz (MYTH-2) — Full Flow

**UX review date:** 2026-06-21
**Reviewer:** design-ux agent
**Files reviewed:**
- `finxiety/src/routes/tools/myth-quiz-2/+page.svelte`
- `finxiety/src/lib/data/myth-quiz-2.ts`
- `finxiety/src/app.css`
- `finxiety/status-updates/myth-2-validation-qa-2026-06-21.md`
- `finxiety/status-updates/myth-2-validation-brand-2026-06-21.md`
- `finxiety/status-updates/myth-1-validation-ux-2026-06-21.md` (for pattern baseline)

**Prior gates:** ⟦QA-VERIFIED⟧ ⟦BRAND-REVIEWED⟧

---

### Nielsen Checklist

| Heuristic | Status | Notes |
|---|---|---|
| Visibility of system status | PASS | Progress bar (6px terracotta/pine fill) plus "Question X of 10" text label present on both estimate and reveal phases. The bar fills from 0% (Q1 estimate) to 100% (Q10 reveal) in logical increments. Progress is aria-hidden but backed by the text label for screen readers. |
| Match between system and real world | PASS | "Lock in my guess," "You guessed," "The real number" — plain language. No program jargon on question surfaces. The quiz promise (guess first, see the real answer) is delivered exactly as stated. |
| User control and freedom | PASS | Back navigation exists at both estimate and reveal phases. "Start over" on the score screen resets all state cleanly. Estimates are intentionally locked (no re-opening a committed guess), which is correct — it supports the mechanic. |
| Consistency and standards | PASS | Button hierarchy (btn-primary / btn-ghost), field-hint, error-msg, and reveal card patterns match app.css system tokens exactly. The why-box (olive left border) and signpost-box (terracotta left border) use the same left-border pattern established in MYTH-1. No one-off conventions introduced. |
| Error prevention | PASS | Sliders prevent out-of-range input by design. The single number input (Q2, tipped-minimum) has min/max attributes and validates on submit. Empty slider submission is impossible (sliders always carry a value). No edge case equivalent to MYTH-1's Q1 empty-input bug (Q2 is a number input with inputDefault=2010, within range). |
| Recognition rather than recall | PASS | The compare block shows "You guessed" and "The real number" side by side. The user never needs to remember their estimate from the previous phase. The progress label maintains question position context across all phases. |
| Flexibility and efficiency | PASS | Single-input-per-phase. No power-user path needed. The tool is short enough (10 questions) that shortcut paths add no value. |
| Aesthetic and minimalist design | CONDITIONAL PASS | The reveal phase carries five sequential visual units before the navigation row: compare card, headline + body, why-box, signpost-box, and sources disclosure. Each block earns its place informationally. The density is the same as MYTH-1, which passed here — but at 10 questions vs. MYTH-1's 5, the user encounters this density ten times. The cumulative weight of the scroll depth on each reveal is a longer-haul problem than it was in MYTH-1. See Ive section. |
| Help users recover from errors | PASS | Error message ("Enter a number between 1950 and 2024.") is in plain English, positioned before the submit button, carries role="alert" for screen reader announcement. No blame language. |
| Help and documentation | PASS | Welcome screen sets expectations in two sentences. "No grades, no right answers" removes performance anxiety before Q1. In-field hints state bounds inline for the number input. Synthesis screen labels both prompts as optional and ungraded. |

---

### Norman Principles

**Affordances:**
The estimate controls are strong. Percentage sliders (8 of 10 questions) render at full width with anchor labels at each end and a live `<output>` value to the right of the thumb showing the current selection as "{value}%". The thumb position and the numeric readout together give the user two simultaneous affordance signals — good design. The range slider (no MYTH-2 questions use it — the range inputType exists in the data schema but no current question invokes it, per QA's dead-code note) would have the MYTH-1 P-1 gap (no adjacent readout), but this is not presently exposed. The number input for Q2 (tipped-minimum) is a standard text field with bounds hint — appropriate for a year-entry question.

The "Lock in my guess" CTA label is well-chosen. It communicates commitment and finality, which matches the mechanic: once submitted, the estimate is locked. No user will misunderstand that clicking this opens a next page.

**Feedback:**
The estimate-to-reveal transition is the tool's most critical feedback moment. It delivers: the compare block (surface background, guess in muted color, real answer in terracotta/pine) arrives immediately at the top of the reveal section. The real answer is visually dominant. The `.step` fadeIn animation (0.2s, 4px vertical translate) provides a perceptible state-change signal. Progress bar updates from qIndex/total to (qIndex+1)/total on reveal. These signals together confirm something changed and something new is available to read.

**Constraints:**
Sliders cannot go out of range. The number input for Q2 has min/max and validates on submit. The empty-input path (an empty number field submitting) is handled: the submit guard at line 81-88 of +page.svelte checks for empty string and NaN before the range check. The MYTH-1 Q1 empty-input regression is not present here because the only number input (Q2) has a non-zero inputDefault (2010) that falls within range.

**Conceptual model:**
The tool presents itself as a quiz ("Guess first, then see what the research actually says") and delivers exactly that. The mental model — commit a guess, receive the real answer, understand the gap — is coherent throughout. The synthesis screen ("One more thing (optional, no right answers)") is the only structural surprise; the optional framing handles it adequately but the transition is slightly abrupt after 10 reveals. This is the same minor tension flagged in MYTH-1's review.

---

### Ive Restraint Test

**Elements that can be removed:**

The `.box-label` "Why the gap exists" label above the why-box. This was flagged in MYTH-1 as P-2 (polish, not required). The olive left border already differentiates the why-box from surrounding content. The label tells the user what the paragraph does before they read it. Removing it reduces visual weight on the reveal screen. At 10 reveals instead of 5, the cumulative visual noise of this label appearing 10 times is twice what it was in MYTH-1. The recommendation to remove it carries more weight in MYTH-2. The signpost-box has no equivalent label and reads better for it — the asymmetry confirms the label is not doing necessary work.

**Elements that must stay:**

Both the why-box and signpost-box belong. They are what separate this from a trivia quiz. The why-box delivers the system-blame framing that makes the tool work for the ALICE user. The signpost-box is the exit ramp to related tools. The sources `<details>` expander belongs — collapsed by default, it adds no visual weight but provides the trust anchor for users who want to verify a figure. The "No grades, no right answers" line on the welcome screen is the most important copy on that screen.

**Visual hierarchy:**
The reveal hierarchy reads: compare card (visually dominant, surface background) → headline (1.375rem bold, the one-line summary) → body (1rem, line-height 1.65, the explanation) → why-box (olive left border, structural framing) → signpost-box (terracotta left border, cross-tool exit) → sources (collapsed, muted, bottom). This is the correct order: most concrete first, most contextual last. The primary information (guess vs. real) is visually first and never buried.

One hierarchy concern: the why-box and signpost-box use the same left-border-on-cream pattern with different border colors. At 375px they read as a visual unit despite serving different purposes. The signpost-box uses the terracotta/pine color (the brand's interactive color) while the why-box uses olive (the brand's contextual/secondary color). This color assignment is the correct signal — terracotta/pine for the actionable element (follow this link), olive for the explanatory element. But because they share the cream background and the same structural pattern, users who are reading quickly may process them as a single extended block. This does not require a change, but the vertical gap between them (var(--space-md) below the why-box) should not be reduced.

**The 375px fold problem — a real constraint:**
At 375px, the reveal screen's layout means the signpost-box will consistently fall below the fold. The typical fold on a mid-tier Android at 375px CSS-width is approximately 550px viewport height. The reveal screen above the fold contains: progress bar (~22px), progress label (~20px + margin), compare block (~100px), headline (~50px). That totals roughly 200px of meaningful content — and this is before the `h2.reveal-headline` heading and the `p.reveal-body` paragraph (which is typically 2-3 lines at 1rem / 1.65 line-height, so another 100-120px). The why-box adds another 100-120px. By the time the user reaches the signpost-box, they are likely 450-550px down the page — at or below the fold on most 375px devices. At 16px base font, the why-box at 0.9375rem renders at 15px, which means longer structural explanations will push the signpost further down.

This is not a blocking issue but it means the cross-tool signpost, which is a key distribution mechanism for Finxiety, is functionally invisible to users who do not scroll past the structural explanation. For users in a hurry (the ALICE user), this path is likely missed entirely on many of the 10 reveals. The per-question scroll depth on MYTH-2 exceeds MYTH-1 because the why-box structural explanations in MYTH-2 are generally longer (MYTH-2 explains systemic mechanisms; MYTH-1 explains benefit program rules, which tend to be more compact).

**Scroll depth is not a blocker, but it is a required-change candidate for the next iteration.** See Required Changes.

---

### Simon Memory Test

**The one memorable output:**
This is the same structural problem identified in MYTH-1's UX gate as Required Change #1 — and it has not been resolved in MYTH-2.

The score screen presents "10 of 10 / reveals seen" as the visual apex of the score card. This number will always read "10 of 10" for anyone who completes the quiz, because the flow is linear and all 10 reveals are seen in sequence. It conveys no information. It is not a grade (correctly) but it is also not a fact the user will remember or carry.

Carmen Simon's principle: one memorable output per tool. For a myth quiz, the memorable output should be a fact, a reframe, or a precise number from one of the reveals. The score screen copy below the card — "Most of these gaps aren't about what any one person did. They're about how the systems are built, and how rarely anyone explains them. Knowing that changes how you move." — is the actual memorable close. It is currently body text positioned below a meaningless number. It should be the headline.

The MYTH-1 UX gate identified this as Required Change #1. MYTH-2 was built after MYTH-1. The same issue appearing in MYTH-2 means the engineer implemented the MYTH-1 pattern without incorporating the MYTH-1 UX gate's fix. This makes it a Required Change for MYTH-2 as well.

**Concrete fix:** Replace the `.score-number` / `.score-label` "10 of 10 / reveals seen" visual apex with the structural framing line ("Most of these gaps aren't about what any one person did. They're about how the systems are built, and how rarely anyone explains them."). If the count is retained (e.g., as a secondary proof-of-completion signal), it should be presented as small muted text below the structural headline, not as the large-number centerpiece. The user should leave remembering the frame, not counting their clicks.

**Cognitive load assessment:**
Per question (estimate phase): Low. One question, one control, one CTA. As minimal as the mechanic allows.

Per reveal: Medium — appropriate. The user committed a guess and wants the answer immediately. The compare block delivers it. The subsequent blocks (headline, body, why-box, signpost) are available for the user who reads further; they do not obscure the primary reveal. Collapsed sources expander adds no load. Medium is the right level here, not a failure.

Per synthesis: Low. Two optional questions, neither graded.

Score screen: Low — should remain simple. The required change (restructure the score-card headline) keeps it simple; it replaces a number with a line of text. No complexity is added.

Overall: Cognitive load is well-managed across the flow. The per-question pattern (estimate, reveal, advance) gives the ALICE user a clear, repeatable structure that reduces the decision overhead at each step. The only load concern is that the synthesis screen transitions somewhat abruptly from the 10th reveal's "Next question / Continue" button — the user may not expect a reflection prompt after 10 reveals. The synthesis header "One more thing (optional, no right answers)" handles this but could be more explicit: "One last question before your results." This is polish, not required.

---

### Financial Anxiety Overlay

**Shame signals:**
None detected across any phase or content block.

Score screen: "reveals seen" is the correct label. It does not grade, rank, or compare. The welcome screen's "No grades, no right answers" removes the performance threat before Q1. Synthesis prompts frame both "changed" and "confirmed" as valid outcomes. No question tells the user they were wrong about something.

Reveal headlines: All ten follow the MYTH-1 standard of structural attribution — the gap lives in policy, in institutional design, in information asymmetry, in a product decision. "Decades of research say otherwise." / "Since 1991. Congress has not changed it once." / "To $0.76. That one design decision cost NYC delivery workers roughly $550 million per year." None of these headlines make the guesser's estimate a failure. They make the system the actor.

Error messages: "Enter a number between 1950 and 2024." — neutral, instructional, no exclamation. No "incorrect" or "wrong" framing anywhere in the interface.

**Trust signals:**
Present and well-calibrated. Every reveal carries a sources `<details>` expander with at least one linked citation. The score screen disclaimer is precise: "These figures come from public research, linked on each reveal. Programs change. The official sources are the place to confirm what applies to you." The tool does not claim eligibility outputs (not applicable to a quiz), so the estimate-label trust convention from the calculators does not apply. Official source links per reveal function as the trust anchor — the user can verify any figure they find surprising.

One structural trust signal that works especially well: the `tipped-minimum` and `platform-tips` questions both name specific actors (Congress, DoorDash, the National Restaurant Association). This is a trust move in the ALICE context — the tool is telling the user who the actor is, which validates the user's lived experience and locates the systemic blame with precision. This is correct and should be preserved.

**Cognitive load:**
Low on estimate and synthesis phases. Medium on reveal phase — appropriate, as this is where the learning happens. The ordering of reveal content (most concrete to most contextual) matches how a cognitively taxed user processes information: the specific number first, the explanation second, the path forward third. This ordering is correct and should not be changed.

At 10 questions, the overall session length is approximately twice MYTH-1. The per-question load is low but the cumulative session length may challenge the ALICE user who is interrupted mid-quiz. There is no partial save or resume mechanism — nor should there be, given the stateless/no-PII architecture. The quiz must be short enough to complete in one session. At 10 questions with an average of 30-45 seconds per question-plus-reveal, this runs approximately 5-8 minutes. This is at the edge of what a distracted phone user will sustain. This is not a blocking UX issue but it is a usage pattern risk the behavioral-science gate should evaluate.

---

### Focus Management — Correction of QA F2

QA finding F2 states "no programmatic focus management exists when phases transition." This is inaccurate per code review.

The +page.svelte file at lines 97-99 calls:
```
phase = 'reveal';
await tick();
revealSectionEl?.focus();
```
The reveal `<section>` element at line 287 carries `tabindex="-1"` and `bind:this={revealSectionEl}`. After `tick()`, the section is in the DOM and `revealSectionEl` is bound. The same pattern exists for synthesis (line 113, `synthesisSectionEl?.focus()`) and score (line 131, `scoreSectionEl?.focus()`).

Focus management is implemented and functional. The section wrapper with `tabindex="-1"` receives focus on each phase transition, which announces the section's `aria-label` to screen readers ("The real answer," "Reflection," "Your results"). This is WCAG 2.4.3 compliant.

The actual gap, distinct from QA's characterization, is narrower: focus lands on the section container (which announces a generic aria-label) rather than on the `h2.reveal-headline` (which announces the specific reveal headline for that question). For a sighted keyboard user, focus on the container places the cursor above the compare block — which is the correct starting read position. For a screen reader user, the section's aria-label ("The real answer") is less informative than the headline would be. This is an accessibility polish item, not a WCAG violation and not a blocker.

Recommendation: On the reveal section, move focus to the `.reveal-headline h2` by giving it `tabindex="-1"` and targeting it directly with `revealHeadlineEl?.focus()` after tick. This produces a more specific announcement ("Decades of research say otherwise" vs. "The real answer") that better orients the screen reader user. This is tracked as Required Change R-3 (Low).

QA should update F2's characterization in their record. The section-focus is present and correct per WCAG; the headline-focus would be a refinement.

---

### Required Changes Before Build (or Before Public Launch)

**R-1 — [REQUIRED — Medium] Score screen memorable output (carry-forward from MYTH-1 Required Change #1)**

The score-number card presents "10 of 10 / reveals seen" as the visual apex of the score screen. This number is always true for everyone who completes the quiz (the flow is linear; all 10 reveals are seen). It carries no information and is not memorable. Carmen Simon's principle requires one memorable output per tool. The memorable output for this tool is the structural reframe: "These gaps aren't about what any one person did. They're about how the systems are built."

This fix was identified as Required Change #1 in the MYTH-1 UX gate. MYTH-2 inherited the same structure without incorporating the fix. Both quizzes need this resolved before public launch.

Specific change: Replace the `.score-number` / `.score-label` visual apex with the structural framing copy currently in `p.reveal-body` below the score card. If a completion count is retained, it should be rendered as a secondary muted detail below the structural headline, not as the centerpiece. The user should leave remembering the frame, not counting their clicks.

**R-2 — [REQUIRED — Low] Focus target on reveal transition should be h2, not section container**

Current behavior: on submitEstimate(), focus moves to the reveal `<section>` (tabindex="-1", aria-label="The real answer"). This is WCAG compliant but produces a less informative screen reader announcement than focusing the reveal headline.

Recommended change: Add a `bind:this={revealHeadlineEl}` to the `h2.reveal-headline` element, give that element `tabindex="-1"`, and call `revealHeadlineEl?.focus()` in submitEstimate() instead of `revealSectionEl?.focus()`. This makes the screen reader announce the specific headline for each question ("Decades of research say otherwise", "Since 1991. Congress has not changed it once.", etc.) rather than the static "The real answer" section label. The question-specific headline is more informative and better orients the user to what changed.

The same refinement should be applied to the synthesis and score phase transitions: focus the first meaningful h2 rather than the section container.

This is Low severity. The current implementation is compliant. This refinement improves screen reader UX without functional regression.

**R-3 — [REQUIRED — Low] Remove the `.box-label` "Why the gap exists" on the why-box**

At 10 questions, this label appears 10 times. In MYTH-1 it was flagged as P-2 (polish). In MYTH-2, with 10 repetitions, the cumulative visual noise is significant enough to promote this to a Required Change.

The olive left border already visually distinguishes the why-box from surrounding content. The label "Why the gap exists" tells the user what the paragraph does before they read it. The signpost-box operates identically without such a label, and reads better for it. Removing this label reduces visual weight per reveal and across the 10-question session.

Specific change: Remove `<p class="box-label">Why the gap exists</p>` from the why-box block in the reveal phase (line 315 of +page.svelte).

---

### Polish Items (Not Required for Launch)

These do not block ⟦UX-REVIEWED⟧ sign-off but should be tracked for the first post-launch iteration.

**P-1 — Signpost-box is below the fold at 375px on virtually every reveal.**
The reveal screen layout stacks: progress bar, progress label, compare block, h2, p.reveal-body, .why-box, then .signpost-box. On a 375px device with a typical ~550px viewport height, the signpost arrives at approximately 500-600px of cumulative content — below the fold on most reveals. The structural explanation (why-box) tends to be 2-3 lines long. The ALICE user who is moving quickly through the quiz will not scroll to the signpost on most questions. This reduces the cross-tool bridge effectiveness that the signpost is designed to deliver. Potential mitigation: consider reordering the reveal blocks so the signpost appears immediately after the compare card and headline, before the structural explanation. The signpost provides a path forward; the structural explanation is additive context. Priority ordering would be: compare → headline → signpost → why-box → sources. This reordering does not violate any Norman or Nielsen principle. However, it changes the reading arc that the brand gate evaluated. A copy or behavioral-science consultation is recommended before making this change.

**P-2 — Progress bar starts at 0% on Q1 estimate.**
`width: {(qIndex / totalQuestions) * 100}%` on the estimate phase renders the bar at 0% for Q1 (qIndex=0). The bar is empty when the user arrives at the first question. This communicates "you haven't started yet" accurately but may feel uninviting or stalled. Compare: the reveal phase renders at `(qIndex + 1) / totalQuestions` so after Q1 the bar shows 10%. A starting state of 0% is technically correct and not a violation, but a 1-step advance (showing the first segment already filled on arriving at Q1) would feel more motivating for a 10-question quiz. Minor.

**P-3 — Empty spacer `<span>` in step-actions on Q1.**
On the first question's reveal (where no Previous button should show), the step-actions div renders `<span></span>` to maintain justify-content: space-between layout. Using an empty presentational span for layout is a code smell. The same visual result can be achieved with CSS: `justify-content: flex-end` when only one button is present, or a conditional CSS class. Not a functional issue.

**P-4 — Synthesis screen transition is slightly abrupt.**
After completing Q10 and advancing, the synthesis screen header reads "One more thing (optional, no right answers)." The user who expected to see results may be momentarily disoriented. MYTH-1 had the same note. A single clarifying phrase — "Before your results — one last question." — would orient the user without adding length. Optional, low effort.

**P-5 — `.btn-ghost` tap target is 44px min-height (app.css), not 48px.**
The score screen ghost buttons ("Back to Finxiety" and "Start over") carry `min-height: 44px` via the `.btn-ghost` rule in app.css. This meets WCAG 2.5.5 at Level AAA advisory, not a required minimum at AA. However, for Finxiety's ALICE phone user, end-of-flow navigation with small tap targets costs goodwill. Upgrading `.btn-ghost` to `min-height: 48px` consistently across the system would bring it in line with `.btn-primary`. QA noted the same in MYTH-1 P-5.

---

### Assessment Against the ALICE User

Naomi (ALICE persona: managing month-to-month, moderate financial anxiety, opens this on her phone in a spare moment) starts this quiz without being asked for anything. Welcome screen is two sentences and a button. "No grades, no right answers" is the second line she reads, not buried. Q1 puts a percentage slider in front of her — zero cognitive setup required, just drag and submit. The estimate mechanic puts her in an active role before the reveal, which means the information belongs to her rather than being delivered at her.

The 10-question length is the one usage-pattern risk. At 30-45 seconds per question/reveal, this is a 5-8 minute quiz. For an ALICE user who is managing cognitive load from financial stress, 8 minutes is at the upper edge of sustained attention on a mobile quiz. The tool does not require all 10 questions to be useful — any single reveal delivers value. But there is no explicit affordance to stop mid-quiz and come back, and the architecture cannot support session save. The welcome screen could help here by saying "Ten short questions — each one stands on its own. Stop whenever you want." This removes the psychological commitment of the number 10.

The structural attribution pattern is the strongest thing about this tool for the ALICE user. Every reveal locates the gap in a decision made by an institution, a company, or a Congress. This validates the user's lived experience and removes the assumption that their financial situation reflects personal failure. For a user who carries financial shame — which is nearly everyone in the ALICE range — this reframe is the most valuable thing the tool provides. The brand gate confirmed the 10 questions are all correctly attributed. This is the tool's core offering.

---

### Summary Table

| Area | Status |
|---|---|
| Flow clarity and affordance | PASS |
| Mobile 375px operability | PASS — slider, compare block, CTA all above fold on estimate; signpost below fold on reveal (tracked as P-1) |
| Cognitive load per phase | PASS — low/medium appropriately distributed |
| Progressive disclosure | PASS |
| Focus management on phase transitions | PASS — section-level focus is implemented and WCAG compliant; heading-level focus is a required refinement (R-2) |
| Score screen memorability | REQUIRED CHANGE — "10 of 10 reveals seen" is informationally empty; structural framing copy must be promoted (R-1) |
| Shame signals | NONE DETECTED |
| Trust signals | PRESENT — per-reveal source citations, score screen disclaimer, structural attribution |
| Financial anxiety overlay | PASS — framing is system-first on all 10 reveals; no shame trigger anywhere in the flow |
| Cross-tool signposts | PASS — all 5 target routes confirmed live; signpost positioning below fold tracked as P-1 |

---

### QA Correction Note

QA finding F2 describes "no programmatic focus management" on phase transitions. This characterization is inaccurate. Focus management is implemented in the component: `revealSectionEl?.focus()`, `synthesisSectionEl?.focus()`, and `scoreSectionEl?.focus()` are each called after `await tick()` on the relevant phase transitions (lines 99, 113, 131 of +page.svelte). Each target element carries `tabindex="-1"`. The implementation is WCAG 2.4.3 compliant at the section level. R-2 in this review recommends refining focus to the h2 level for a better screen reader experience — that is a quality improvement, not a correction of a missing feature. The QA gate's medium severity rating for F2 is not warranted as a blocker; the existing focus management is functional.

---

⟦UX-REVIEWED⟧ tool="personal-finance-myth-quiz" ticket="MYTH-2" date="2026-06-21" status="CONDITIONAL" open-required-changes="3 (R-1: score-screen-memorable-output [Medium]; R-2: reveal-focus-h2-not-section [Low]; R-3: remove-box-label [Low])" open-polish="5 (P-1: signpost-below-fold-at-375px; P-2: progress-bar-starts-at-0pct; P-3: empty-spacer-span; P-4: synthesis-transition-phrasing; P-5: btn-ghost-tap-target)" sign-off-condition="R-1 must be resolved before public launch. R-2 and R-3 should be resolved before public launch but do not block internal distribution. Polish items tracked for first post-launch iteration."

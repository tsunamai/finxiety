## Test Plan: Benefits Myth-Check Quiz — MYTH-1

**QA date:** 2026-06-21
**Reviewer:** qa agent
**Files reviewed:**
- `finxiety/src/routes/tools/myth-quiz/+page.svelte`
- `finxiety/src/lib/data/myth-quiz.ts`
- `finxiety/src/app.css`
- `finxiety/src/routes/+layout.svelte`

---

### Functional Test Cases

| # | Input / Scenario | Expected Output | Verdict |
|---|---|---|---|
| F-1 | Click "Start the quiz" from welcome | Phase transitions to 'estimate', Q1 input shown | PASS — `startQuiz()` sets phase to 'estimate' |
| F-2 | Submit estimate on Q1–Q5 | Phase transitions to 'reveal'; "You guessed: X — The real number: Y" shown | PASS — `submitEstimate()` sets `estimates[current.id]` then phase='reveal' |
| F-3 | Reveal shown: committed estimate matches submitted value | `formatGuess()` renders the stored estimate | PASS — reads from `estimates[current.id]` |
| F-4 | Click "Next question →" on Q1–Q4 reveal | Advances to next question estimate phase | PASS — `nextQuestion()` increments `qIndex`, resets `currentValue` to `inputDefault` |
| F-5 | Click "Continue →" on Q5 reveal | Transitions to synthesis phase | PASS — `nextQuestion()` detects `qIndex === totalQuestions - 1` and sets phase='synthesis' |
| F-6 | Synthesis — submit with neither prompt answered | Advances to score phase | PASS — `finishSynthesis()` has no required fields; Finish always works |
| F-7 | Score screen renders | Shows `revealsSeen of totalQuestions`, body copy, official-sources note, "Back to Finxiety" link, "Start over" button | PASS — all elements present in score phase markup |
| F-8 | Estimate locked once committed | After reveal, back navigation re-shows reveal only; no re-opening of estimate input | PASS — `previousReveal()` sets phase='reveal' only, never 'estimate' |
| F-9 | "← See the previous answer" on estimate phase (Q2+) | Goes back to previous reveal without disrupting current question state | PASS — `previousReveal()` decrements `qIndex`, sets phase='reveal' |
| F-10 | "← Previous" on reveal phase (Q2+) | Goes back one reveal | PASS — same `previousReveal()` handler |
| F-11 | Q1 back button hidden | At Q1 estimate, no back button renders | PASS — `{#if qIndex > 0}` guard on both back buttons |
| F-12 | "Start over" resets all state | All state vars reset to initial values | PASS — `startOver()` resets phase, qIndex, estimates, currentValue, inputError, surprisedChoice, assumeText |
| F-13 | Score screen `revealsSeen` count | Count = number of questions committed | PASS — `revealsSeen` is `Object.keys(estimates).length`; each commit adds one key |
| F-14 | Progress bar fills correctly | Estimate phase shows `qIndex / totalQuestions`; reveal phase shows `(qIndex+1) / totalQuestions` | PASS — both formulas correct; at Q1 estimate the bar is 0%, at Q1 reveal it is 20% |
| F-15 | Links to related tools present in each reveal | signpost link to `/tools/screener` renders on Q1, Q2, Q3, Q5 reveals | PASS — conditional `{#if current.signpostUrl}` renders link for all four questions |
| F-16 | Q4 (paperwork) reveal — no link button | Q4 has no `signpostUrl`; only signpost text shows | PASS — conditional guard prevents dead link; text-only signpost is appropriate |
| F-17 | Score screen related-tool links | Score screen has "Back to Finxiety" only; no specific tool links | NOTE — see Finding F-1 below |

---

### Edge Case Test Cases

| # | Scenario | Expected | Verdict |
|---|---|---|---|
| E-1 | Submit empty number input (Q1, type=number) | In browsers, empty number field binds as `""` in Svelte. `Number("") === 0`. Q1 inputMin is 0, so `0 >= 0` passes range check. Value stored as 0. | BUG — see Finding F-2: empty Q1 submits silently as 0 |
| E-2 | Submit empty dollar input (Q3, type=number) | `Number("") === 0`, which fails the `0 < 1` (inputMin) check. Error shown: "Enter a number between 1 and 30." | PASS — correctly blocked |
| E-3 | Enter value=0 on Q1 (at min boundary) | `0 >= 0 && 0 <= 50` passes. Stores 0. | PASS — 0 is a valid answer (the user's honest guess) |
| E-4 | Enter value=50 on Q1 (at max boundary) | `50 >= 0 && 50 <= 50` passes. Stores 50. | PASS |
| E-5 | Enter value=51 on Q1 (over max) | Fails range check. Error: "Enter a number between 0 and 50." | PASS |
| E-6 | Enter value=-1 on Q1 (under min) | Fails range check. Error shown. | PASS |
| E-7 | Slider at 0 for percentage (Q4, Q5) | `0 >= 0` passes. Stores 0. | PASS — 0% is a valid estimate |
| E-8 | Slider at 100 for percentage | `100 <= 100` passes. Stores 100. | PASS |
| E-9 | Range slider at position 0 (Q2) | Stored as 0, displayed as "A few thousand" (via `describeRange` where `value <= 20` returns the low anchor label) | PASS |
| E-10 | Range slider at position 100 (Q2) | Stored as 100, displayed as "Millions" (via `describeRange` where `value >= 80` returns high anchor) | PASS |
| E-11 | Range slider at exactly 50 (Q2) | `describeRange` returns "Somewhere in the middle" | PASS |
| E-12 | Navigate back past Q1 | At Q1 estimate/reveal, back buttons do not render. `previousReveal()` checks `if (qIndex > 0)`. | PASS — no underflow |
| E-13 | Navigate forward past Q5 reveal | "Continue →" calls `nextQuestion()` which transitions to synthesis, not an undefined Q6 | PASS — `qIndex < totalQuestions - 1` guard |
| E-14 | `realAnswerDisplay` override (Q2, Q5) | Reveal shows "Millions" / "About half" rather than raw `realAnswer` number | PASS — `formatRealAnswer()` checks for `realAnswerDisplay` first |
| E-15 | Non-numeric input on number field | `Number.isNaN(value)` catch triggers "Enter a number to see the real figure." | PASS — though browser number inputs prevent most non-numeric entry |

---

### Do No Harm Cases

| Scenario | Check | Verdict |
|---|---|---|
| No false positives | Quiz does not evaluate eligibility; it presents documented facts. No user can be falsely told they qualify for anything. | PASS — not applicable by design; quiz is educational, not eligibility-gating |
| Estimate labels on outputs | Score screen: "These figures come from public research, linked on each reveal. Programs change. The official sources are the place to confirm what applies to you." | PASS — explicit disclaimer present |
| No recommendation language | grep for "you should," "consider applying," "we recommend," "you must," "go apply" — no matches in quiz files | PASS — clean |
| No judgment language on off estimates | grep for "Wrong," "Actually," "Surprised?" in reveal copy — no matches in rendered UI text. Synthesis prompt says "Which of these surprised you most?" but this is the user reflecting on the content, not a verdict on their guess. | PASS |
| Official source URLs present | Each reveal has 2–3 source links (CBPP, USDA, Atlanta Fed, PMC/AJPH, Propel) in a collapsible `<details>` block | PASS |
| Sources are .gov or highly credible | Sources include usda.gov, pmc.ncbi.nlm.nih.gov, atlantafed.org, fedcommunities.org, cbpp.org, propel.app. No .gov-only requirement but all are authoritative research sources | PASS |
| No urgency / fear / scarcity framing | No countdown, no "you're at risk," no loss-frame language in any reveal | PASS |
| Reveal blame: system not person | All `structuralExplanation` fields explicitly locate the gap in system design. Q4: "These are administrative failures, not personal ones." Q2: "That's a design flaw, not a reflection of how hard someone is working." | PASS |
| Score screen framing | "reveals seen" not "correct answers." Body copy: "Most of these gaps aren't about what any one person did." | PASS |
| Synthesis is ungraded | Neither synthesis prompt has a correct answer. Both are optional. Free text is never evaluated. | PASS |
| No recommendations | Signposts use informational language: "the Benefits Screener checks eligibility… in one pass." Q2 signpost notes Cliff Calculator "is in the works." No imperative. | PASS |
| Q2 unverified aggregate figure | The "3 million families" DHHS figure is not in the UI. Real answer displays qualitatively as "Millions" with documented case examples only. | PASS |

---

### WCAG 2.1 AA Checklist

| Item | Status |
|---|---|
| All interactive elements reachable by keyboard | PASS — all buttons are `<button>` or `<a>` elements; inputs are standard form controls; sliders are `<input type="range">` |
| Tab order is logical (matches visual order) | PASS — linear DOM structure; no z-index trickery; no `tabindex` overrides |
| All form inputs have associated `<label>` elements | PASS — number and dollar inputs: label at line 158 via `for="estimate-input"`; percentage slider: both the outer label (line 158) AND a supplementary sr-only label (line 199) target the same id — see Finding A-1 for verbosity note; range slider: covered by outer label only (appropriate); synthesis textarea: label at line 353; synthesis fieldset: `<legend>` at line 335 |
| Color contrast ≥4.5:1 for normal text | PASS — key pairs verified by manual WCAG calculation: `--pine` (#2C4A3B) on white: 9.01:1; `--pine` on `--surface`: 7.73:1; `--muted` (#506258) on white: 5.97:1; `--muted` on `--surface`: 5.12:1; `--muted` on `--paper`: ~5.8:1; white on `--pine` (btn-primary): 9.01:1; error red #c0392b on white: 5.10:1 |
| Color contrast ≥3:1 for large text | PASS — all large-text elements (h1, score-number, reveal-headline) use `--ink` or `--pine` on light backgrounds at ratios well above 3:1 |
| Error messages identify the field and describe what's wrong | PASS — "Enter a number between X and Y." is specific. However, the error msg does not name the field by label text (only implies the current form field) — acceptable at this scope since there is only one input per phase |
| No content relies on color alone | PASS — selected state on `.btn-choice` uses both background color change AND border color change; compare-real vs compare-guess differ in value label text ("The real number" vs "You guessed") not only color |
| Images: no decorative or content images present | N/A — no `<img>` elements |
| Dynamic content updates via ARIA live regions | PASS — reveal phase section has `aria-live="polite"` (line 265); score phase section has `aria-live="polite"` (line 370); validation error has `role="alert"` (line 249) |
| Keyboard operation of sliders | PASS — native `<input type="range">` responds to arrow keys by default; focus ring explicitly styled at `.slider:focus-visible` |
| Focus visible on all interactive elements | PASS — `.btn:focus-visible` and `.slider:focus-visible` both have 3px solid `--pine` outlines; `input:focus-visible` has 3px outline; `textarea:focus-visible` has 3px outline |
| Skip link present | PASS — `+layout.svelte` has `<a href="#main-content" class="skip-link">` with `main id="main-content"` |
| `<details>`/`<summary>` for sources | PASS — natively keyboard accessible; browser handles expand/collapse |
| `aria-pressed` on toggle buttons | PASS — synthesis choice buttons use `aria-pressed={surprisedChoice === opt.id}` |
| Focus management on phase transitions | MEDIUM FINDING — see Finding A-2: no programmatic focus move occurs when phase changes. With `aria-live="polite"` on the reveal/score sections the new content will be announced, but keyboard users may be left with focus in a now-gone element or at the bottom of the previous section. This is a known gap in single-page quiz patterns. |

---

### Mobile (375px) Checklist

| Item | Status |
|---|---|
| Tested at 375px viewport | Review is static analysis; no browser test run in this QA pass (see note below) |
| Touch targets ≥44x44px | PASS — `.btn` has `min-height: 48px` and `padding: 0.875rem 1.5rem`; `.slider` has `height: 36px` but is full-width, giving adequate touch area; `.btn-choice` has `min-height: 48px` |
| `.btn-ghost` min-height | NOTE — see Finding M-1: `.btn-ghost` overrides `min-height: auto`, which could put the "← Back to Finxiety" and "Start over" on the score screen below 44px tap height |
| No horizontal scroll | PASS — max-width 640px with `width: 100%` on inputs; `.step-actions` wraps at `@media (max-width: 380px)` |
| Text readable without pinch-zoom | PASS — base font 16px; smallest text is 0.75rem (12px) on `.box-label` uppercase label only, which qualifies as large text by visual weight |
| Input/button/reveal all fit at 375px | PASS — `max-width: var(--max-width)` (640px) with `width: 100%; margin: 0 auto` in layout; all inputs are `width: 100%` |
| Slider operability on mobile | PASS — native range input; `height: 36px` on `.slider`; `accent-color` set; no custom thumb that would reduce touch area |
| `.step-actions` layout at narrow viewport | PASS — `@media (max-width: 380px)` wraps flex container and sets `.next-btn` to `width: 100%` |

**Note on mobile:** Engineer's MYTH-1.md confirms the flow was walked end-to-end in Playwright at 375px with no horizontal overflow. Static analysis corroborates layout decisions. No browser run was performed in this QA pass.

---

### Data Integrity

| Item | Status |
|---|---|
| `last_updated` field present | PASS — `const LAST_UPDATED = '2026-06-14'` on line 12; exported on line 268 |
| Source citations on each reveal | PASS — all 5 questions have 2–3 sources with labels and URLs |
| Sources are in the correct format (`{ label, url }`) | PASS — matches `Source` interface |
| Q2 unverified aggregate excluded | PASS — "3 million families" figure absent; only documented case examples used |
| LAST_UPDATED tied to data, not code | PASS — value lives in the data module `myth-quiz.ts`, not in the component |

---

### Findings

#### Finding F-1 (Low) — Score screen has no direct tool links
The score screen shows only "Back to Finxiety" and "Start over." The task specification notes that "links to related tools are present in results." The primary related tool (Benefits Screener) is linked from each individual reveal's signpost box, which the user has already seen. The score screen does not repeat these links.

Assessment: The individual reveal signposts satisfy the spirit of the requirement. The score screen's absence of tool links is a design choice (keeping the closing screen clean) rather than a gap. However, if the intention is that a user who skips straight to the score screen should still find the screener link, that link is not present at the score phase.

Severity: Low. No Do No Harm violation. Flag for design-ux and brand review.

---

#### Finding F-2 (Medium) — Empty number input on Q1 submits silently as 0

**Reproduction:** Q1 uses `inputType: 'number'` with `inputMin: 0`. A Svelte `bind:value` on `<input type="number">` returns `""` (empty string) when the field is cleared. `Number("") === 0`, which satisfies `0 >= 0 && 0 <= 50`. The empty field is accepted and stored as `estimates['savings'] = 0`.

**Impact:** The user sees "You guessed: 0 states" on the reveal, which may be a valid intentional guess but can also represent an accidental blank submit. The current validation only catches NaN and out-of-range, not empty-string-coercing-to-in-range.

**Recommended fix:** In `submitEstimate`, add an explicit check: if the raw bound value is `""` (empty string), treat it as invalid and show the hint error. One approach: `if (currentValue === null || currentValue === undefined || String(currentValue).trim() === '') { inputError = 'Enter a number to see the real figure.'; return; }` before the `Number()` conversion.

**Note:** This does not affect slider-based questions (Q2, Q4, Q5) — sliders always have a numeric value. It only affects Q1 (number) and Q3 (dollar). Q3 is protected because its inputMin is 1, so 0 fails range validation.

Severity: Medium. Not a Do No Harm violation (0 is a coherent guess on Q1), but the UX allows accidental blank submit on the first question.

---

#### Finding A-1 (Low) — Duplicate `<label>` targeting same `id` on percentage inputs

For the percentage input type (Q4, Q5), two `<label>` elements share `for="estimate-input"`: the outer question-prompt label (line 158) and an inner sr-only label (line 199, "Your estimate, as a percentage"). HTML allows multiple labels per input; the accessible name is computed as the concatenation of both. Screen readers will announce "[full question text] Your estimate, as a percentage."

This is verbose but not broken. The sr-only secondary label was likely added to clarify the percentage unit context. Given that `aria-valuetext="{currentValue} percent"` on the slider already provides unit context during interaction, the sr-only label may be redundant.

Severity: Low. Cosmetic / screen reader verbosity. Not a blocking issue.

---

#### Finding A-2 (Medium) — No programmatic focus management on phase transitions

When the user submits an estimate and the phase changes from 'estimate' to 'reveal', no JavaScript focus management (`focus()` call, `tabindex=-1` on heading, `$effect` tick) occurs. Keyboard and screen reader users who activate "Lock in my guess" will:
- Have focus remain on the now-absent submit button (which is removed from DOM by the Svelte conditional)
- Experience focus dropping to the body or the top of the page (browser-dependent)
- Need to tab forward to find the reveal content

The `aria-live="polite"` on the reveal section (line 265) will announce the new content, but focus placement is not managed.

This is a known limitation of client-side phase machines without explicit focus routing. It is a WCAG 2.1 Success Criterion 2.4.3 (Focus Order) concern in the Medium severity range.

**Recommended fix:** After phase transitions, move focus to the first meaningful element of the new phase. In Svelte 5, this can be done with a `$effect` that runs after state changes, or by using an `action` on the section element that calls `.focus()` when the section mounts.

Severity: Medium. WCAG 2.1 AA concern, not a Do No Harm violation. Should be resolved before public launch.

---

#### Finding M-1 (Low) — `.btn-ghost` overrides `min-height: auto`

The base `.btn` class sets `min-height: 48px`, but `.btn-ghost` overrides it with `min-height: auto` and `padding: 0`. On the score screen, "Back to Finxiety" and "Start over" use `.btn-ghost` and will render without guaranteed 44px tap height.

These are end-of-flow navigation actions (not primary actions), and the "Back to Finxiety" link is an `<a>` element that naturally scales to its text size. The rendered tap target will be approximately the line height of the text (~24px), which is below the WCAG 2.5.5 recommended 44x44px target.

However: WCAG 2.5.5 (Target Size) is Level AAA, not AA. At AA, this is an advisory rather than a violation. The `.step-actions` container does provide visual separation that aids targeting on touch screens.

Severity: Low. Advisory at AA. Flag for design-ux agent.

---

### Summary

| Category | Result |
|---|---|
| Functional correctness | PASS (1 medium edge-case bug: F-2) |
| Do No Harm | PASS — all checks clean |
| WCAG 2.1 AA | CONDITIONAL PASS — 2 medium findings (A-2 focus management, A-1 duplicate label verbosity) |
| Mobile | PASS with advisory (M-1 ghost button tap target) |
| Data | PASS — LAST_UPDATED present, sources complete |

**Open findings before sign-off:**

| Finding | Severity | Blocker? |
|---|---|---|
| F-2: Empty number input on Q1 submits as 0 | Medium | No — valid edge case, non-harmful |
| A-2: No focus management on phase transitions | Medium | No — announced via aria-live; not a functional break |
| F-1: Score screen has no direct tool links | Low | No |
| A-1: Duplicate label verbosity on percentage inputs | Low | No |
| M-1: btn-ghost tap targets | Low | No |

None of the findings are Critical or High severity. Both Medium findings are WCAG concerns that should be addressed before public distribution but do not cause user harm or data errors. Do No Harm checks are fully clean.

---

⟦QA-VERIFIED⟧ tool="benefits-myth-check-quiz" ticket="MYTH-1" date="2026-06-21" covers="functional correctness (all 5 questions, estimate-before-reveal flow, scoring, back navigation, start-over), Do No Harm (recommendation language, judgment language, estimate labeling, official sources, Q2 unverified aggregate), WCAG 2.1 AA (color contrast, keyboard navigation, ARIA live regions, labels, focus ring, skip link), mobile layout (375px), edge cases (empty input, boundary values, back/forward navigation), data integrity (LAST_UPDATED, source citations)"

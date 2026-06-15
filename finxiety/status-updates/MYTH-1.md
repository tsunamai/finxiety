# MYTH-1 — Benefits Myth-Check Quiz

**Status:** Built, verified end-to-end, pushed for validation gate.
**Branch:** `MYTH-1-benefits-myth-quiz`
**Date:** 2026-06-14

---

## What was built

A new client-side tool: an estimate-before-reveal quiz with 5 questions, a synthesis
(reflection) layer, and a discovery-framed score screen.

**Files:**
- `src/lib/data/myth-quiz.ts` — typed quiz content (`Question` interface, `questions`
  array, `synthesisPrompts` const, `Source`/`SynthesisPrompt` types, `LAST_UPDATED`).
  All on-screen copy is verbatim from the content spec. Research-only framing (myth
  labels, unverified aggregate figures, fear/urgency stats) is intentionally excluded.
- `src/routes/tools/myth-quiz/+page.svelte` — the quiz UI (Svelte 5 runes), phase
  machine: welcome → estimate/reveal (×5) → synthesis → score.
- `src/routes/+page.svelte` — homepage card added to "Available now".

## Flow (verified in preview at 375px)

welcome → Q1 estimate → Q1 reveal → … → Q5 reveal → synthesis → score.

Each reveal shows "You guessed: X — The real number: Y" above the headline, then
reveal body, a "Why the gap exists" structural box, an informational cross-tool
signpost, and a collapsible sources list with official URLs (target=_blank,
rel=noopener noreferrer).

**Estimate controls by question:**
- Q1 savings → number input, 0–50
- Q2 cliff → range slider, anchors "A few thousand" / "Millions"
- Q3 daily amount → dollar input, $1–$30
- Q4 paperwork → percentage slider, 0–100%
- Q5 WIC → percentage slider, 0–100%

## Content-spec ambiguities resolved

1. **Q2 aggregate figure (Do No Harm).** The spec flags the "3 million families" DHHS
   figure as unconfirmed and instructs: ship documented examples only, omit the
   unverified aggregate. The estimate-vs-real mechanic needs a comparison value, so the
   real answer is displayed qualitatively as **"Millions"** (via `realAnswerDisplay`),
   not as a hard number. The reveal body uses only the two documented case examples
   ($640 net loss; $9,000/year childcare loss). No unverified number ships.
2. **Q3 dollar range.** Spec example said "$3–$20"; ticket said "$1–$30". Used the
   ticket's $1–$30.
3. **Q5 real answer.** Headline anchors on "About half"; reveal body carries the 56%
   2023 participation nuance. The comparison line shows **"About half"** (via
   `realAnswerDisplay`) rather than a bare percent, matching the headline framing.
4. **Range guess display.** A 0–100 slider position is reported descriptively
   ("A few thousand" / "Closer to…" / "Millions"), never as a bare number, so the
   guess reads honestly against a qualitative answer.
5. **Synthesis select.** Prompt 1 is single-select and toggleable (click again to
   clear). Both prompts are optional; Finish always advances.
6. **Shared input model.** The quiz collects no household_size / state / income /
   benefits fields — it's stateless trivia — so there was nothing to import from
   `lib/input-model`. No shared fields redefined.

## Do No Harm / brand adherence

- Myth-label lines never render on screen.
- Reveal headlines blame the system / information gap, never the guesser. No "Wrong,"
  "Actually," or "Surprised?" anywhere. Guess-vs-real line is neutral.
- Cross-tool signposts are informational ("a tool … is coming soon"), never imperative.
- Synthesis layer is ungraded; no correct answer; free text is never judged.
- Score screen frames discovery ("reveals seen"), not grading.
- Estimates labeled as estimates on the score screen; official sources linked per reveal.

## Accessibility (WCAG 2.1 AA)

- Keyboard navigable; all inputs labelled (sliders use the prompt as label + sr-only
  helper; `aria-valuetext` on sliders).
- Reveal and score regions use `aria-live="polite"`; validation errors use
  `role="alert"`.
- Color via CSS variables only; terracotta-on-cream and text tokens meet ≥4.5:1.
- Slider focus ring and 48px touch targets carried from base styles.

## Tests / verification

- `npm run build` — passes, zero errors; myth-quiz route prerendered.
- `npm run preview` + Playwright at 375px — full flow walked end-to-end; all 5 reveals
  show guess-vs-real; synthesis Finish works with neither prompt answered; score screen
  correct.
- No horizontal overflow at 375px (scrollWidth == clientWidth == 375).
- Out-of-range input (99 on a 0–50 question) shows an error and holds on the estimate
  phase.
- Zero console errors/warnings.
- `svelte-check` — 0 errors. (1 pre-existing tsconfig warning: missing `@types/node`,
  unrelated to this work.)

## Follow-ups

- Validation gate not yet run: `brand`, `design-ux`, `qa`, `behavioral-science`.
- Release agent should re-verify all figures before ship and each October (data
  freshness); `LAST_UPDATED` is set in the data module.
- Q2's HHS primary source for the aggregate remains unconfirmed — kept out of UI by
  design; revisit if a primary link is confirmed.

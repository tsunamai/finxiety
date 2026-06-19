# MYTH-2 — Personal Finance Myth Quiz (Personal Finance Track)

**Status:** Built, build passing, committed in worktree. Awaiting orchestrator merge to main and the five-agent validation gate.

**Date:** 2026-06-19
**Branch:** MYTH-2-personal-finance-myth-quiz

## What was built

Two files, sibling to MYTH-1:

- `finxiety/src/lib/data/myth-quiz-2.ts` — 10-question personal-finance data file. Replicates the `Question` and `SynthesisPrompt` interfaces from `myth-quiz.ts` exactly; exports `questions`, `synthesisPrompts`, and `LAST_UPDATED = '2026-06-19'`. All 10 questions and reveal copy are verbatim from the ticket spec. Two synthesis prompts: a 10-option "Which finding surprised you most?" select and a free-text "Is there something you assumed about money that this changed or confirmed?".
- `finxiety/src/routes/tools/myth-quiz-2/+page.svelte` — near-copy of the MYTH-1 quiz page, importing from `$lib/data/myth-quiz-2`. Title, meta description, h1, and welcome copy updated per the ticket. Component logic (phases, slider/number/dollar/percentage controls, reveal, synthesis, score, keyboard/ARIA structure) is identical to MYTH-1.

The homepage card was intentionally NOT added — the orchestrator owns that.

## Key decisions (not in the literal "changes 1-6" list, made for correctness)

1. **Generic signpost link label.** MYTH-1 hard-codes `Open the Benefits Screener →` because all its signposts point to the Screener. MYTH-2's signposts point to several different tools (Tip Calculator, Tax Clarity, Emergency Fund, Debt vs. Growth, Compounding Effect). Leaving the MYTH-1 label literally identical would render a wrong, misleading link label — a Do No Harm / clarity violation. Changed to the neutral `Open the tool →`. This honors the ticket's "keep the rest identical" intent (same structure/behavior) without shipping incorrect copy.
2. **Score headline reads "ten things"** (MYTH-1 said "five things"), matching the 10-question count. Same rationale: keeping the literal "five" would be factually wrong on a 10-question quiz.
3. **Dollar-field hint** dropped the MYTH-1 "per day" suffix (`A dollar amount from $X to $Y.`), since Q3's dollar control is a per-order tip amount, not a per-day figure.

## Known content note for the validation gate (flagging, not fixing — figures are per spec)

- **Q3 (`platform-tips`) guess-vs-real unit mismatch.** The dollar slider ranges 0–217 and the guess renders as a whole-dollar string (e.g. `$150`), while `realAnswerDisplay` shows `$0.76`. This follows the ticket's exact `inputMin/Max/Default` and `realAnswer: 76` spec, and the reveal text is correct, but the "You guessed $150 / The real number $0.76" comparison reads as a scale mismatch (the slider is effectively in dollars while the answer is in cents-of-a-dollar). The shared `formatGuess`/`formatRealAnswer` helpers were left untouched to keep the component a true sibling of MYTH-1. Recommend design-ux/brand confirm this framing during the gate, or adjust the Q3 control scale in a follow-up.

## Tests / build

- `npm install` then `npm run build` from `finxiety/` — exits 0. Build output includes `entries/pages/tools/myth-quiz-2/_page.svelte.js`, confirming the new route prerendered cleanly. No new TypeScript or Svelte errors.
- No unit tests exist for the MYTH-1 quiz (it is data + presentational component); none added, matching the existing pattern.

## Follow-ups

- Orchestrator: add homepage card and merge to main.
- Run the five-agent validation gate (brand, design-ux, qa, behavioral-science, disability-accessibility) before any distribution. Specifically surface the Q3 unit-mismatch note above.
- Several signpost URLs reference tools that may not be live yet (`/tools/tax-clarity`, `/tools/debt-growth`, `/tools/compound-interest`). QA should confirm whether those routes exist or whether the signposts should degrade gracefully.

# SAVE-1 — Savings Commitment Maker

**Status:** Built. Build passes (`npm run build` exits 0). Awaiting validation gate.

## What was built

- `src/lib/calculators/savings-commitment.ts` — pure functions: `buildCommitment` assembles the verbatim implementation-intention statement; `buildRoughTimeline` produces the optional, clearly-caveated timeline; `formatAmount` renders `$X` (whole) or `$X.X`.
- `src/routes/tools/savings-commitment/+page.svelte` — three-step flow (goal → amount/frequency/when → commitment + actions), prerendered, 100% client-side. Reuses the RECERT-1 `.ics` generator and the HOURS-1 segmented radiogroup pattern. Clipboard with textarea/`execCommand` fallback (DOC-1 pattern).
- `status-updates/SAVE-1.md` — this file.

No homepage card added (orchestrator owns it, per ticket). No shared input-model fields imported. No data files (national scope).

## Acceptance criteria

- **Verbatim commitment statement** — Confirmed: goal="new tires", amount=20, biweekly, when="every other Friday after I get paid" yields exactly "I will transfer $20 to savings every other Friday after I get paid so that I can save for new tires." User words pass through `.trim()` only.
- **Inline edit pass** — Step 3 textarea is bound to the same `editedStatement` value shown in the commitment block; calendar and copy actions use the edited text.
- **Rough timeline** — target=240 yields "At $20 every two weeks, reaching $240 would take approximately 24 weeks — rough estimate; your actual timeline will vary." Caveat suffix always present.
- **No target → no timeline** — `roughTimeline` is undefined when target is blank/0; statement and downloads render regardless.
- **Calendar download** — `.ics` via `generateIcs`/`downloadIcs`; summary "My savings appointment", description = verbatim commitment, dtstart = `nextOccurrence(frequencyKey, today)`, dtend = dtstart + 1 day, uid `save-${Date.now()}@finxiety`.
- **Copy this** — `navigator.clipboard.writeText` with textarea fallback; no network; "Copied!" for 2s.
- **No recommendation / benchmark / percentage-of-income** — none present anywhere.
- **$5 valid, no floor** — amount only needs to be > 0; no warning, no suggested minimum.
- **"When" required** — "Build my commitment" stays disabled until amount > 0, frequency chosen, and when non-empty; submitting blank shows the plain-language inline prompt, not an error.
- **WCAG 2.1 AA** — all inputs have visible `<label>`s; segmented selector is `role="radiogroup"`/`role="radio"` with roving tabindex and arrow-key nav; touch targets ≥ 44–48px; brand tokens meet ≥4.5:1; step transitions move focus to the new heading and announce via a polite live region.
- **Mobile-first** — single-column flow, segmented buttons wrap, `max-width` content; no horizontal scroll at 375px. (Visual check recommended at the validation gate.)
- **No urgency / shame / prescriptive language** — copy is descriptive only; includes the research-driven "This is a plan you made, not a lock. Your money is still yours to use." guard (Sussman & O'Brien 2016).
- **Related-tools footer** — links to `/tools/emergency-fund` and `/tools/screener`, framed as expanding supply.

## Notes / follow-ups

- Multi-step focus management follows the RECERT-1 `{#if step}` + heading-focus pattern (functionally equivalent to `{#key step}` for focus; matches the reference file the ticket pointed to).
- The frequency segmented selection drives only the timeline math and the `.ics` start date; the cadence in the statement comes from the user's own "when" words, so the assembled sentence is never doubled.
- Homepage card and the five-agent validation gate are still pending (orchestrator / validation owners).

# UX Review: BEN-1 CA Benefits Screener — Re-review

**Reviewer:** design-ux agent
**Date:** 2026-06-21
**Gate:** Pre-release re-validation (resolving ⟦UX-BLOCKED⟧ from 2026-06-15)
**Files reviewed:** `finxiety/src/routes/tools/screener/+page.svelte`, `finxiety/src/app.css`, `finxiety/src/lib/components/SearchBox.svelte`, `finxiety/src/lib/components/SearchResults.svelte`

---

## Prior Blockers — All Resolved

### Blocker 1: `--muted` contrast failures — RESOLVED
The brand palette was updated from the terracotta/cream palette to a pine/green palette. Token `--muted` is now `#506258`. WCAG contrast ratios computed numerically:

| Pair | Background | Ratio | AA 4.5:1 |
|---|---|---|---|
| `--muted` #506258 | `--paper` #F4F6F2 | 5.98:1 | PASS |
| `--muted` #506258 | `--surface` #E8EEE9 | 5.52:1 | PASS |
| `--muted` #506258 | `--border` #D4DDD6 | 4.74:1 | PASS |
| `--muted` #506258 | white | 7.72:1 | PASS |
| `--text` (--ink) #1E2B25 | `--border` #D4DDD6 | 10.59:1 | PASS |

`eligibility-tag--unlikely` now uses `color: var(--text)` on `--border` background (10.59:1). All formerly-failing pairs now pass.

### Blocker 2: Focus management on step change — RESOLVED
`calculate()` calls `await tick(); resultsHeadingEl?.focus()` after step flip. `startOver()` calls `await tick(); toolHeadingEl?.focus()`. The `h1` is bound outside `{#key step}` (persists); the results `h2` is bound inside step 2 and re-acquired on each render via `bind:this`. Focus management is correct.

### Blocker 3: `aria-live` placement unreliable — RESOLVED
A persistent `<div class="sr-only" aria-live="polite" aria-atomic="true">` now lives **outside** `{#key step}`, before the breadcrumb (lines 123–128). Only its content changes when step 2 renders. This is the correct pattern for reliable VoiceOver/Safari announcement.

---

## Recommended Items from Prior Review

| Item | Status |
|---|---|
| 4 — "Check another household" tap target | RESOLVED — `.start-over-btn { min-height: 44px }` |
| 5 — New-tab signal on apply links | RESOLVED — `aria-label="{program.applicationLabel}, opens in new tab"` on each link |
| 6 — Eligibility status in a11y tree | NOT addressed — `<li>` has no `aria-label` pairing status with name. Heading navigation still skips the tag. Advisory for future iteration. |
| 7 — Sort likely-first / collapse unlikely | NOT addressed. `visibleResults` is unfiltered-order from `checkAllPrograms`. Advisory for future iteration. |
| 8 — Deduplicate Myth Quiz link on no-match path | RESOLVED — bridge box now links to 211, not the quiz. Quiz link appears once in the footer. |
| 9 — Paycheck hint formatting | RESOLVED — hint moved behind a `"Calculate from paycheck"` expander (collapsed by default, `aria-expanded` wired correctly). |

---

## New Finding During Re-review

### [WCAG BLOCKER — addressed in this pass] SearchBox placeholder contrast
`SearchBox.svelte:67` — `.search-input::placeholder { color: var(--ink-faint) }`. Token was `--ink-faint: #8A897F`, which computes to 3.52:1 on white (`--paper-elevated`). Placeholder text is informative (WCAG 1.4.3, 4.5:1 required). `SearchResults.svelte:210` also uses `--ink-faint` but on a decorative `aria-hidden` glyph — exempt.

**Fix applied:** `--ink-faint` changed to `#595959` (7.00:1 on white) in `app.css`. Verified: no informative text uses this token at a ratio that would now fail.

---

## Suite-Level WCAG Audit Summary (all tools, 2026-06-21)

All token pairs verified numerically. Post-fix, no failing pairs:

| Pair | Ratio | Note |
|---|---|---|
| ink / paper | 13.53:1 | Body text |
| ink / white | 14.71:1 | Card text |
| pine / white | 9.77:1 | Primary buttons, links |
| muted / paper | 5.98:1 | Hints, footnotes |
| muted / surface | 5.52:1 | Result box secondary text |
| ink-faint / white | 7.00:1 | Placeholder text (post-fix) |
| error #c0392b / paper | 5.00:1 | Error messages |

---

## Non-Blocking Improvements Queued

1. **TIP-1:** Remove `.wage-slot` placeholder sentence before state is selected (low-value instructional text in reserved space).
2. **Screener results:** Show document checklist link when `likelyCount > 0`, myth quiz link when `likelyCount === 0` — one contextual link per state rather than both always.
3. **Screener results:** Suppress `income-vs-limit` line on "likely" cards where it is redundant with the benefit estimate already shown.
4. **Screener a11y:** Add `aria-label="{program.name}, {statusText}"` on each `<li>` so heading navigation carries the eligibility status (items 6 and 7 from prior review).

---

⟦UX-REVIEWED⟧ tool="screener" ticket="BEN-1" date="2026-06-21"

# GUIDE-1 — Routing Questionnaire at `/tools/guide`

**Status:** Built, build passing, pushed.
**Date:** 2026-06-19

## What shipped

A single-question routing questionnaire that points users to the right Finxiety
tools based on their situation. No submit button, no page reload — results render
immediately on selection.

- **New:** `src/routes/tools/guide/+page.svelte`
- **Changed:** `src/routes/+page.svelte` — homepage CTA href `/tools/screener` → `/tools/guide` (one line, nothing else touched)

## Behavior

- One `h1` question ("What's going on?"), five situation cards in a `role="radiogroup"`.
- Cards are `role="radio"` buttons with `aria-checked`, roving tabindex (selected card or first card is tabbable, rest are `-1`), arrow-key cycling (Up/Down + Left/Right), Space/Enter to select.
- Results section (`{#if selected}`) is `aria-live="polite"`, receives programmatic focus via `$effect` on selection, fades in over 150ms.
- Each result is a `.tool-row` link matching the existing `/tools` list pattern exactly.
- "Not quite right? See all tools →" escape hatch always present when results show.

## Do No Harm

- No recommendation language — neutral list under "Here's where to start."
- No urgency, no fear, no scarcity.
- Tools are surfaced as options the user picks into, never as "you need to."
- Escape hatch to the full tool list is always available.

## Accessibility (WCAG 2.1 AA)

- Radiogroup semantics with roving tabindex and arrow-key navigation.
- Visible focus ring (`3px solid var(--forest)`, offset 2px) on cards; `--pine` ring on result rows.
- Cards ≥48px min-height, full-width tappable rows, mobile-first.
- Selected state conveyed by both border color and background shift (not color alone — left-border accent thickens to forest plus tinted background).
- `prefers-reduced-motion`: all transitions and the fade animation disabled.
- Results focus moves to the results region on selection so screen-reader and keyboard users land on the new content.

## Build

`npm run build` from `finxiety/` exits 0. Guide page prerenders to
`build/tools/guide.html`; homepage `build/index.html` CTA confirmed pointing at `/tools/guide`.

## Notes / follow-ups

- Routing data is inline in the component per ticket (no separate data file).
- All 13 tool slugs referenced in `toolMeta` were verified to exist as routes under `src/routes/tools/`.
- Validation gate (brand / design-ux / qa / behavioral-science / disability-accessibility) not yet run — recommended before public distribution per `finxiety/CLAUDE.md`.

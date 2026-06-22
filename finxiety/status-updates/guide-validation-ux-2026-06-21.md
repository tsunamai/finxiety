# UX Review: Guide Tool ("What's going on?") — Full Validation Gate
**Route:** `/tools/guide`
**File reviewed:** `finxiety/src/routes/tools/guide/+page.svelte`
**Reviewer:** design-ux agent
**Date:** 2026-06-21
**Viewport scope:** 375px primary, 640px+ secondary

---

## Nielsen Checklist

| # | Heuristic | Status | Notes |
|---|---|---|---|
| 1 | Visibility of system status | PASS | Selected card shows border + background change; results section appears immediately on selection with fade-in. State is always legible. |
| 2 | Match between system and real world | PASS | Situation labels are written in the user's voice ("I got some financial news — a raise, a job change..."), not in program jargon. Tool names inside results are question-framed ("Got a raise — do you actually come out ahead?"). Consistent with Finxiety voice. |
| 3 | User control and freedom | PASS | User can re-select any other card at will, overwriting the results. No dead ends. Breadcrumb links back to all tools. The `.fallback` row ("Not quite right? See all tools") provides a named escape hatch. |
| 4 | Consistency and standards | PASS | Tokens, typography, and card radius match the rest of the suite. `--forest`, `--pine`, `--border` used consistently with other tool pages. |
| 5 | Error prevention | PASS | No free-text input; no invalid state is possible. Pure selection UI. |
| 6 | Recognition rather than recall | PASS | All matched tools are presented inline — user never needs to remember their selection to act on it. |
| 7 | Flexibility and efficiency | PASS | First-time user: tap a card, see results instantly. Experienced keyboard user: arrow-key roving tabindex, Enter/Space to select. No power-user trap for new users. |
| 8 | Aesthetic and minimalist design | PASS with note | Results section heading "Tools that match your situation" is functional but redundant given the context. The cards and results are well-stripped. See Required Changes #1. |
| 9 | Help users recognize, diagnose, recover from errors | NA | No error states possible in this tool. |
| 10 | Help and documentation | PASS | `.subhead` provides a one-line instruction. Tool is self-explanatory with zero cognitive setup required. |

---

## Norman Principles

**Affordances:** The `.card` element is a `<button>` with `role="radio"`, `min-height: 48px`, full-width display, and visible border. It reads as tappable. The left border color-shift on hover reinforces interactivity. The tool-row links use an explicit `→` arrow that signals forward navigation. Both affordances are present and unambiguous.

**Feedback:** On card selection: border-color and background shift immediately (150ms transition), and the results section fades in below. The `$effect` block programmatically moves focus to the results element on selection — this is correct feedback for both sighted and screen-reader users. One concern: the fade-in animation on the results section (`animation: fade-in 150ms ease both`) triggers on every re-selection. On a slow device or when the user rapidly switches situations, this briefly flickers. Low severity but worth noting. Reduced-motion is handled.

**Constraints:** Not applicable in this tool — no user input is possible outside the defined option set. The constraint is baked into the design.

**Conceptual model:** The tool presents as "pick your situation, see your tools." The interaction exactly matches this promise. There is no mismatch between what the heading implies and what the tool delivers. The only conceptual gap is that users cannot predict how many tools they will see before selecting — this is acceptable for a routing page but the range (2–4 tools) should be consistent enough that no situation feels sparse. The `learning` situation surfaces 4 tools; `paycheck` surfaces 2. That asymmetry is minor and does not break the model.

---

## Ive Restraint Test

**Elements that can be removed or simplified:**

1. The `<h2>` inside `.results` reads "Tools that match your situation." The results appear directly below the selected card; their relationship is compositionally obvious. This heading adds visual weight without adding meaning. The only reason to keep it is for the `aria-live` announcement — but `aria-live="polite"` on the section already causes the section's content to be announced when it populates. The heading can be removed and the `aria-label` on the section (currently absent) can carry the accessible name. This is a refinement, not a blocker. Logged as Required Change #1.

2. The breadcrumb "← All tools" is correct and earns its place as an entry-point escape. Keep.

3. The `.fallback` paragraph ("Not quite right? See all tools →") is minimal and functional. Keep.

4. The `→` arrow on tool rows is the only decoration and it is load-bearing (communicates forward navigation). Keep.

**Visual hierarchy:** Correct. H1 (display serif, large) → subhead (muted, 0.9375rem) → cards (full-width, 48px+ height) → results (question-framed tool name at 600 weight, desc at muted 0.8125rem). The hierarchy reads cleanly at 375px without reflow issues.

---

## Simon Memory Test

**The one memorable output:** After selecting a situation, the user should leave remembering "these are my tools." The tool-name question format ("Got a raise — do you actually come out ahead?") is the most memorable element on the screen — it names the user's specific anxiety. This is well-designed. The user is more likely to remember the question framing than the tool name or description.

**What will the user remember 24 hours later?** Probably one question that landed for them, not the page structure. This is correct — the question framing inside result rows is doing the right memory work.

**Cognitive load assessment:** Very low. No inputs. No math. One decision point. The longest situation label ("I'm trying to figure out what programs or assistance I might be able to get") is one full sentence but reads as natural speech. The cognitive path from landing to seeing relevant tools is approximately 2 seconds. This is the right design for a first-touch entry point used by an ALICE user at unknown time pressure.

---

## Financial Anxiety Overlay

**Shame signals:** None found. Situation labels are framed as circumstances ("I got some financial news..."), not judgments about the user. No language places the user in a deficit category. The `benefits` situation label does not use the word "poor" or anything that reads as a marker of low status.

**Trust signals:** Present but partial. The results show tools with descriptions but carry no "this is free / no account needed" signal. For a user who has never used Finxiety before — which is the majority of users of this page — there is no visible reassurance that clicking a tool requires nothing from them. The layout header wordmark "Finxiety" and the breadcrumb "All tools" provide implicit context but no explicit trust marker. Logged as Required Change #2.

**Cognitive load:** Low. One question, five options, instant results. Correct for the entry-point role.

---

## WCAG 2.1 AA Assessment

**radiogroup / radio pattern:** Correctly implemented. The `.cards` div carries `role="radiogroup"` and `aria-labelledby="guide-q"` pointing to the `<h1>`. Each `.card` button carries `role="radio"` and `aria-checked` bound to the selected state. This is a valid ARIA radio group pattern.

**Roving tabindex:** Implemented correctly. The first card is `tabindex="0"` when nothing is selected; the selected card holds `tabindex="0"` after selection; all others are `tabindex="-1"`. Arrow keys cycle through cards and update focus. Space and Enter activate selection. This matches the APG radio group keyboard pattern.

**Focus management on results reveal:** The `$effect` block calls `resultsEl.setAttribute('tabindex', '-1')` then `resultsEl.focus()` when `selected` is set. `.results:focus { outline: none; }` suppresses the focus ring on the container, which is standard practice for programmatic focus management on a non-interactive container. Correct.

**`aria-live="polite"` on results section:** Present on the `<section class="results">`. When results populate, the live region will announce its contents to screen readers. One concern: the `aria-live` region has no `aria-label` or `aria-labelledby`, which means screen readers may announce the full section text without a heading context. The `<h2>` "Tools that match your situation" partially addresses this but since it is inside the live region it will be announced on every re-selection, which becomes repetitive for keyboard users switching between situations. This is the same heading flagged in the Ive test — removing it and adding `aria-label="Matched tools"` to the section would resolve both issues. See Required Change #1.

**Color contrast:**

- `.card` default: text `var(--ink)` (#1E2B25) on `background: transparent` over `var(--paper)` (#F4F6F2). Contrast ratio: #1E2B25 on #F4F6F2 = approximately 13.5:1. PASS.
- `.card.selected` background: `rgba(60, 74, 58, 0.06)` over `var(--paper)` (#F4F6F2). This blends to approximately #EFF1ED. Text #1E2B25 on #EFF1ED = approximately 12.8:1. PASS.
- `.tool-desc` text: `var(--muted)` (#506258) on white (tool-row sits on the page background). #506258 on #F4F6F2 = approximately 5.1:1. PASS at AA level (4.5:1 required for normal text).
- `.tool-arrow`: `var(--sage)` (#6B8A78) on #F4F6F2. #6B8A78 on #F4F6F2 = approximately 3.1:1. FAIL at AA for the arrow glyph character. The arrow is `aria-hidden="true"` so it carries no informational content for AT users, but sighted low-vision users may miss it. This is a Medium severity finding because the affordance of navigation is also carried by the full `.tool-row` link treatment and the hover color change. Logged as Required Change #3.
- `.fallback` text: `var(--ink-mute)` (#6B6A62) on #F4F6F2. #6B6A62 on #F4F6F2 = approximately 4.6:1. Passes AA at normal text size (0.875rem / 14px). PASS, but close to the threshold. Monitor if the background lightens.

**Selected state non-color distinction:** The selected card differs from the unselected card in border-left color (from `var(--border)` to `var(--forest)`), border color (same shift), and background tint. The border-left thickness remains 3px in both states — it does not change thickness. For users who cannot distinguish `#D4DDD6` from `#3C4A3A`, there is no non-color signal of selection on the card itself. There is no checkmark, no icon change, no label change. This is a **High** severity WCAG 1.4.1 (Use of Color) finding. Selection state must not rely on color alone. Logged as Required Change #4.

**Touch target size:** `.card` has `min-height: 48px` and `width: 100%`. The tool-row links have `padding: var(--space-sm) 0` = 12px vertical padding. At 375px, the tool-row height is approximately 44px minimum (icon 22px + padding). The WCAG 2.5.5 target size is 44x44px. This passes at the minimum threshold. The breadcrumb link "← All tools" has no minimum height set — it is inline text. This is a Low finding since the breadcrumb is navigational rather than primary action, but worth noting.

**Skip link:** Present in the layout (`<a href="#main-content" class="skip-link">`). The `<main>` has `id="main-content"`. The skip link is correctly implemented globally. No action needed on the guide page.

---

## Required Changes Before Build

Listed by severity. Items 4 and 2 are blocking. Items 1, 3, and 5 are High/Medium and should be resolved before public distribution.

**1. HIGH — Selected state relies on color alone (WCAG 1.4.1)**
File: `finxiety/src/routes/tools/guide/+page.svelte`, line 289 (`.card.selected` rule)

The selected radio card currently signals selection only through a border color change and a faint background tint. Users with color vision deficiency, low-vision users, and high-contrast mode users cannot reliably distinguish selected from unselected. Add a non-color signal to the selected state. Recommended: add a filled circle or checkmark icon inside the card, or change the left border from 3px to 5px AND add a visible indicator such as a short bold prefix label ("Selected: ") that is visually rendered, not just in the aria-checked attribute. The simplest fix that requires no icon dependency: add `font-weight: 600` to `.card.selected` text so the selected label reads visually heavier than unselected, and increase left border to 5px.

```
.card.selected {
    border-left-width: 5px;
    font-weight: 600;
    /* existing color rules stay */
}
```

This alone does not fully satisfy 1.4.1 in strict interpretation — a checkmark or indicator mark is the clean solution. At minimum, the font-weight + border-width change makes the selected state legible without color.

**2. HIGH — No trust signal for first-time user (Financial Anxiety Overlay)**
File: `finxiety/src/routes/tools/guide/+page.svelte`, line 193 (`.subhead`)

This page is often the first thing a new user sees. There is no visible signal that the tools are free, require no account, and store nothing. The subhead currently reads: "Pick the situation that fits — we'll show you the tools that match." Add a single, brief trust line below the subhead or within it. Recommended addition as a second sentence or small line beneath the subhead:

"Free. No account. Nothing stored."

This is three words per concept, matches Finxiety's stripped voice, and addresses the most common barrier to engagement for a user who has been turned away or scammed by financial tools before.

**3. MEDIUM — `<h2>` "Tools that match your situation" is announced on every re-selection**
File: `finxiety/src/routes/tools/guide/+page.svelte`, line 215 and 214

The `<h2>` inside the `aria-live="polite"` region is announced every time the user changes their selection. For a keyboard user cycling through all five situations, this becomes a repetitive interrupt. The heading also adds visual weight that the design does not need (see Ive test above).

Fix: Remove the `<h2>` from inside the `aria-live` section. Add `aria-label="Matched tools"` to the `<section class="results">` element so AT users have a landmark name without an in-region announcement. The results themselves (tool question + description) are sufficient to communicate context.

**4. MEDIUM — Arrow glyph (`→`) on tool rows fails contrast at AA**
File: `finxiety/src/routes/tools/guide/+page.svelte`, line 225 and line 386 (`.tool-arrow`)

`var(--sage)` (#6B8A78) on `var(--paper)` (#F4F6F2) = approximately 3.1:1. WCAG requires 4.5:1 for normal text at this font size. The arrow is `aria-hidden="true"` and carries no semantic role, but it is the primary forward-navigation visual affordance for sighted users. Change `.tool-arrow` color to `var(--muted)` (#506258) which passes at approximately 5.1:1, or to `var(--pine)` (#2C4A3B) at approximately 10:1. The hover state already changes the arrow to `var(--pine)` — the default state should not be significantly lighter than the hover state.

**5. LOW — Roving tabindex pattern is not discoverable for sighted non-AT keyboard users**
File: `finxiety/src/routes/tools/guide/+page.svelte`, line 163 (`onKeydown`)

The arrow key navigation works correctly, but a sighted keyboard user who tabs to the radio group has no indication that arrow keys are the mechanism for movement within it. Most web users expect Tab to move between all interactive elements. Consider adding a visually present (not sr-only) hint below the card group, shown only when the group first receives keyboard focus:

"Use arrow keys to move between options."

This can be implemented as a `<p>` element that becomes visible when any `.card` has `:focus-visible` within the group, using a CSS `:has()` selector pattern or a Svelte `$state` focus flag. At minimum, add the instruction as a non-sr-only footnote visible to all keyboard users.

**6. LOW — `tip-calculator` listed under `learning` situation**
File: `finxiety/src/routes/tools/guide/+page.svelte`, line 57

The `tip-calculator` is surfaced under "I just want to understand how money or benefits actually work." This is a weak match — the tip calculator is a transaction utility, not a financial literacy tool. A user landing on this page because they want to understand money systems and seeing the tip calculator as a match may feel the tool misread their intent. Consider removing it from the `learning` situation or swapping it for a better-fit tool (e.g., `debt-growth`) once that tool is live.

---

## Summary

The guide tool is architecturally clean: correct ARIA pattern, correct keyboard behavior, correct focus management, reduced-motion handled, appropriate token usage, and a cognitive footprint of near-zero for the primary ALICE user. It is close to ship-ready.

Two items block distribution under the validation gate: the color-only selected state (Required Change #1, WCAG 1.4.1) and the missing trust signal (Required Change #2, Financial Anxiety Overlay). Both are small code changes. All other findings are Medium or Low and should be resolved before public distribution push but do not block internal review or staged deployment.

⟦UX-BLOCKED⟧ — resolve Required Changes 1 and 2 before public distribution.

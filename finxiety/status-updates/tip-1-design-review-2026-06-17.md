# TIP-1 Pre-Build Design Review — 2026-06-17

## Brand Review

### Contextual note copy

**Tipped-wage variant (as written):**
> "In [STATE], servers may be paid as little as $2.13/hr by their employer. Tips aren't a bonus here, they're most of their wage."

Reads as: mostly factual, with one phrase that tips toward advocacy. The first sentence is clean, sourced (DOL Fact Sheet 15), and Non-Advice-compliant. The second sentence, "they're most of their wage," is the risk line. It does not tell the user what to tip, so it passes the literal Non-Advice Rule. But it carries an implied "and therefore you should care more," which is the soft-pressure register Do No Harm guards against. The ALICE user who can only afford 10% is exactly who reads this note and feels the squeeze. The fix is to describe the wage structure, not the moral stakes of it. Let the user draw the conclusion.

Suggested revision:
> "In [STATE], the law lets employers pay tipped workers as little as $2.13/hr, with tips expected to make up the rest. Here, a tip is part of the wage, not an extra on top of it."

This keeps every fact, drops the second-person emotional load ("aren't a bonus" implicitly addresses the diner's intent), and stays descriptive. "Make up the rest" mirrors how the law actually frames the tip credit, which is more accurate than "most of their wage" anyway. No directive, no judgment.

**One Fair Wage variant (as written):**
> "In [STATE], servers receive the full state minimum wage regardless of tips. A tip here is additional income, not a wage substitute."

Reads as: factual, symmetrical, low harm risk. Passes as written. Minor polish only, to match the revised tipped-wage register and avoid the slightly clinical "wage substitute":
> "In [STATE], servers get the full state minimum wage no matter what they're tipped. Here, a tip is extra income on top of the wage, not a substitute for it."

Either the original or the polish is acceptable. The original does not violate any rule.

**Symmetry note for the engineer:** the two variants must feel like the same voice describing two facts, not one warm note and one cold one. Whatever revision lands, run both side by side and read them aloud. The user in a One Fair Wage state should not get a noticeably softer note than the user in a tipped-wage state, or the tool reads as if it has an opinion about which state is "better."

### Historical one-liner

> "The $2.13 federal tipped wage has been unchanged since 1991."

Right register. Dry, factual, dated, sourced (EPI). It does the most brand-aligned thing a sentence can do here: it states a number and a date and gets out of the way. No revision.

Placement is correct as specced: below the contextual note, visually distinct, not inline. Inline would editorialize the live calculation; set apart, it reads as a footnote-grade fact the curious user can absorb or skip. Keep it visually quieter than the contextual note (smaller, lower contrast but still WCAG 4.5:1), so it never competes with the actual tip math. This is the shareable line, see Distribution.

### Pre-tax/post-tax note copy

> "Etiquette tips on the pre-tax subtotal; most card screens default to the post-tax total. On a $50 bill in an 8% tax area, that's roughly a $0.80 difference at 20%."

Too verbose for mobile inline. Three clauses and a worked example stack into a paragraph at 375px, which buries the one thing the user needs: which base am I tipping on right now, and does it matter much. The worked example is good content but it should not be the always-on inline copy.

Suggested split:

Inline (always visible, beside the toggle):
> "Tipping on the pre-tax subtotal. Most card screens use the post-tax total instead."

Expandable detail ("How much does this change?" or an info affordance):
> "The difference is small. On a $50 bill in an 8% tax area, post-tax vs. pre-tax is about $0.80 at 20%."

This keeps the inline line scannable in one glance, preserves the concrete example for anyone who taps in, and the inline label updates with the toggle state (pre-tax vs. post-tax) so it always tells the truth about the current calculation. Note "The difference is small" is a fair, non-directive framing that pre-empts the anxiety spiral of "am I doing this wrong" without telling anyone what base to choose.

### Default tip preset: brand call

**Decision: default to 18%.** Confirmed, do not move to 20%.

Rationale: The behavioral research is the deciding factor and it aligns cleanly with Do No Harm. POS suggested-amount anchoring measurably inflates tips, which means a higher default is not a neutral convenience, it is a thumb on the scale. Finxiety does not touch urgency, scarcity, or pressure levers, and a tip tool that quietly nudges the number up is doing a soft version of exactly that. 18% is a defensible, common etiquette baseline that leaves the user choosing up or down from a fair midpoint rather than talking themselves down from an anchor someone else set. The slider does the brand work here: it presents 18% as a starting point, not a recommendation, and every preset (15/18/20/25) is equally one tap away with no visual emphasis on the higher numbers.

### Homepage card copy

"Tip Calculator with Hidden History" is internal spec language. "Hidden History" overpromises and sounds like a documentary; it is not how the user describes their need at the table.

Recommended user-facing card copy:

Title:
> **Tip Calculator**

Description:
> "Split the check and see the actual math. Plus what your tip means for the person serving you, depending on the state you're in."

Alternate, shorter (if the card layout is tight):
> "Do the tip math. And see why it matters more in some states than others."

Both say what the tool does (tip math, split) first, then name the context layer plainly without "hidden" mystery framing. Neither tells the user what to tip. The first option's "what your tip means for the person serving you" is the honest hook and it is descriptive, not directive.

### Open issues for engineer

1. **Tipped-wage variant copy (highest priority):** replace "Tips aren't a bonus here, they're most of their wage" with the descriptive revision above. This is the one line in the ticket that risks making an ALICE user feel judged. Get it right before build, not in QA.
2. **Voice symmetry between the two state variants:** apply the same register to both notes and read them side by side. The One Fair Wage user must not get a softer note than the tipped-wage user.
3. **Pre-tax/post-tax note:** split into the scannable inline line plus an expandable detail; do not ship the full three-clause sentence as always-on inline copy at 375px. Inline label must update with the toggle state.
4. **Default preset 18% confirmed:** no visual emphasis on the higher presets (20/25); all four presets equal weight, slider starts at 18%.
5. **Homepage card:** use the recommended "Tip Calculator" copy; retire "Hidden History" as the user-facing name.
6. **Historical one-liner styling:** keep it visually quieter than the contextual note (still WCAG 4.5:1) so it never competes with the live tip math.

### Distribution Notes

- **Who finds this first:** this is a social-share and SEO tool, not a referral-from-a-nonprofit tool. The search intent is "how much to tip" / "tip calculator split check," and the differentiator that earns the link and the share is the state-aware wage context. Lead the meta description and any social card with the context layer, since the plain calculator is a commodity.
- **The shareable moment:** it is the historical one-liner and the $2.13 fact, not the user's own tip amount. Nobody shares "I tipped $9 on $50." People share "the federal tipped wage has been unchanged since 1991." Design the fact to be screenshot-clean and quotable on its own. This is the content-marketing companion the ticket already flags.
- **Cross-tool handoff:** a warm related-tools footer link to the Myth Quiz fits naturally; the tipping-wage fact is myth-quiz-adjacent content and the research doc already earmarks tipping material for future quiz questions. Keep the footer a handoff, not an ad.

⟦BRAND-PRE-BUILD⟧ ticket="TIP-1" date="2026-06-17"

---

## Design-UX Review

### Interaction flow at 375px

The user is standing or seated at a table, phone in one hand, the bill in the other, people waiting. This is a high-distraction, low-patience context. The screen must let them reach a number in two or three taps. The calculator is the front door; the wage context is the meaning of the result, not a gate on it.

Render order, top to bottom, single column, no horizontal scroll:

1. **Bill amount** — first, required, currency input. The one thing the user already knows and wants to type. Autofocus is acceptable here because it matches the conceptual model of a calculator. `inputmode="decimal"`, `$` prefix, reusing EMG-1's `.input-prefix-wrap` pattern for consistency.
2. **Tip percentage** — second, required. The primary lever. Control recommendation below.
3. **Result block** — tip amount and total. Appears the moment bill and tip are both present.
4. **Party size** — secondary. Stepper, default 1; per-person line appears only when > 1.
5. **State selector** — secondary. Drives the contextual wage note. Not required for the math; required for the context.
6. **Pre-tax / post-tax toggle** — secondary, lowest priority. Most users never touch it; it must not compete with the primary inputs.

Hierarchy rationale (Ive / Simon): bill and tip are the only two fields that must be visible and reachable in the first viewport at 375px. Everything below the result is "deepen the answer," not "complete the input." This protects the single cognitive step the scarcity-mindset user can spend (CLAUDE.md: "complete in one cognitive step"). A user who types a bill and taps 18% has a complete, correct answer before they ever scroll to state, party, or the toggle. Recognition over recall (Nielsen): the result carries the bill and tip forward so the user never re-reads their own inputs.

### Tip percentage control

**Recommendation: segmented button set (15% | 18% | 20% | 25%) plus a distinct "Other" numeric input. Do not ship a slider.**

This diverges from the ticket (which specs a slider with preset stops) and from the brand review (which assumes a slider and describes "the slider starts at 18%"). Flagging the conflict explicitly so PM and brand can resolve it before build. The brand rationale for 18%-as-starting-point survives the swap intact: a segmented set presents 18% as a pre-selected starting point with every preset equally one tap away and no visual emphasis on the higher numbers, which is exactly the brand goal. The control change does not weaken the brand argument; it strengthens it.

Why buttons over a slider on a phone:

1. **Affordance and precision (Norman).** A slider affords "continuous, approximate." Tip percentage is a discrete, deliberate choice. A thumb drag across a 375px track between 15 and 25 is a fat-finger lottery, and the values that matter most are exactly the presets. Buttons afford "pick one of these," which is the actual mental model.
2. **Feedback.** A button gives a clean selected / unselected state. EMG-1's `.btn-toggle` with `aria-pressed` is already in the codebase and proven. A slider thumb position is harder to read and confirm at a glance.
3. **Accessibility (WCAG 2.1 AA).** A `role="radiogroup"` of buttons is a solved pattern: arrow-key navigation, clear focus ring, labelled values, each a >=44px target. A native range input with discrete stops, value text, and a 44px thumb is more to get right and easier to get wrong. Lower risk to the AA bar.
4. **Anti-pattern surface.** A slider with a fill that grows as the percentage rises visually rewards "more" — the anchoring nudge the research warns against (Section 5). A neutral button set has no directional gradient to exploit.

Control spec for the engineer:
- Segmented group, `role="radiogroup"`, four preset buttons plus an "Other" affordance that reveals a small numeric input (`inputmode="decimal"`, 0 to 100, two decimals max).
- All five targets >=44px, equal visual weight, no color-coding low-to-high (see anti-patterns).
- Default selection 18% per ticket and brand. Any default is a mild anchor, so keep it the lowest of the common "standard" values, not the modal POS value.
- The "Other" input must reach **0** with no friction and no stigma label. 0% is a legitimate, reachable value, not a "skip."

### State-aware note placement

The wage note is the clarity engine; the math is the front door. Placement must make the note read as the meaning of the result, not a disclaimer bolted underneath.

- **Position:** directly beneath the result block (tip + total), before the secondary controls. The note is context on the number the user just produced, so it belongs adjacent to that number.
- **Before a state is selected:** the user must know the context exists or they will never discover it. Render a quiet neutral prompt in the note's slot from first paint, e.g. "Select your state to see what your tip actually means for the person serving you." This is a recognition cue (Nielsen), not a nag, and it reserves the note's eventual position so the layout does not jump when state is chosen (feedback / no layout shift).
- **Above the fold at 375px:** the result must be above the fold. The full two-sentence note generally will not fit above the fold once bill, tip control, and result are stacked, and that is acceptable; the note is "deepen," not "complete." What must be visible without scrolling is the result plus enough of the note slot (the prompt line) that the user knows more context is one action away. Do not shrink type to force the whole note up; readability and 4.5:1 contrast win.
- **Source and framing:** the DOL Fact Sheet 15 URL rides with the note. Style it as context (an EMG-1 `role="note"` box is the right precedent), visually distinct from the result, never an alert or warning color. Use brand's revised copy, not the ticket's draft line.

### Pre-tax/post-tax toggle

**Default: control visible, explanatory copy collapsed.** The toggle shows; the verbose paragraph does not until the user asks.

- Two-option segmented control ("Pre-tax" | "Post-tax"), default Pre-tax, placed last among the secondary controls. Keep it visible so it is discoverable and the user is never surprised which base produced their number (visibility of system status, Nielsen).
- The full copy is too long for 375px inline. Use brand's split: a scannable inline label that updates with the toggle state, plus an expandable "How much does this change?" disclosure holding the $0.80 worked example. This is the minimalist-design and reduce-cognitive-load move (Ive / Simon). Implement the disclosure with `<details>`/`<summary>` or an accessible disclosure button; verify keyboard operability and labelling.
- **Conceptual-model risk (Norman):** because v1 applies the percentage to the single entered bill amount regardless of toggle, flipping the toggle moves no number. A user expecting the total to change sees nothing happen — broken feedback. The inline label must state that the toggle describes what the entered amount represents, not a recalculation. See open issue 1.

### Party split flow

The proposed pattern is right, with refinements.

- **Stepper (minus / value / plus), always visible, default 1.** Correct. Clear affordances, constrains input to valid integers by construction (no 0 people, no decimals, no negatives — error prevention, Norman / Nielsen), and faster than a numeric keypad for small party sizes.
- **Per-person line renders only when value > 1.** Correct and minimalist; a per-person line for a party of one is noise, and its appearance on reaching 2 is good feedback that the split is now active.
- Refinements for the engineer:
  - Both minus and plus >=44px targets, with screen-reader labels ("decrease party size" / "increase party size") and the current value announced on change.
  - Constrain minimum to 1 (minus disabled or no-op at 1; never allow 0, which would divide-by-zero the per-person math). Set a sane maximum (~50).
  - When the per-person line appears it should read as a derived, secondary number, subordinate to the total, keeping the hierarchy: total first, per-person second.

### One memorable output (Simon test)

The thing the user remembers 24 hours later is not the tip total — it is the realization: "in most states the tip isn't a bonus, it's the wage." The design must let the wage note carry that one idea cleanly. If the note is buried, truncated, or styled as a disclaimer, the tool loses its only memorable output and degrades to an ordinary tip calculator. Protect the note's legibility and placement above all secondary chrome.

### Anti-patterns to avoid

From the research Section 5 (anchoring, guilt-screen, skip stigma), explicitly prohibited in TIP-1:

1. **No low-to-high color coding of presets.** Do not mute 15% and saturate 25%, and do not let any control fill grow more "rewarding" as the percentage rises. Equal visual weight for all preset values.
2. **No "recommended" / "most popular" markers or ascending emphasis** on any preset. The neutral selected state is the only highlight. The tool informs; it never tells the user what to tip (Do No Harm).
3. **No social-norms or guilt copy.** No "most diners tip 20%," no "servers rely on your generosity," no emotive prompt at entry. The wage note explains the system neutrally; it never pressures the transaction.
4. **0% reachable without a stigmatized path.** The "Other" input reaches 0 plainly. No "Skip," "No tip," or "not recommended" labels; no shrinking, hiding, or below-the-fold treatment of low values.
5. **No worker-watching / performance framing.** Nothing that simulates the counter-service "the worker can see your entry" guilt screen. This is a private, self-directed calculation.
6. **No urgency, no animation that celebrates higher tips.** Result updates are calm and identical regardless of amount.
7. **State note stays neutral, never accusatory.** Describe the system, not the person. The tipped-wage variant must not imply the user is underpaying or shame any tip level (financial-anxiety overlay). Use brand's revised, symmetric copy.

### Open issues for engineer

1. **(High) Toggle conceptual model.** v1 does not recompute on pre-tax/post-tax (same amount, percentage unchanged), so flipping the toggle moves no number. Resolve the broken-feedback risk: the inline label must describe what the entered amount *is* (e.g. "you entered the ... total"), so the absence of recalculation matches expectation. Confirm microcopy with brand.
2. **(High) Replace slider with segmented `role="radiogroup"` + "Other" input.** Reuse EMG-1's `.btn-toggle` / `aria-pressed` pattern; all five targets >=44px, arrow-key navigable, no low-to-high color. **Conflicts with the ticket and the brand review (both assume a slider) — PM and brand to confirm before build.** Rationale above; the 18%-as-starting-point brand goal is preserved.
3. **(High) Live recompute, no Calculate button.** Result updates as bill and tip change. Diverges from EMG-1's deliberate submit-then-reveal; it is the honest control model for a live calculator. Confirm with PM.
4. **(Med) State-note placeholder slot.** Reserve the note's position from first paint with a neutral "select your state" prompt so the context is discoverable and there is no layout shift on selection.
5. **(Med) Pre-tax/post-tax copy in a disclosure.** Scannable inline label (updates with toggle state) plus an accessible `<details>`/disclosure holding brand's $0.80 example. Verify keyboard operability and labelling.
6. **(Med) Stepper constraints.** Min 1 (no 0, no divide-by-zero), sane max (~50), >=44px targets, SR labels, value announced on change.
7. **(Med) Default tip 18%, no endorsement styling.** Selected state only; no "recommended" badge; all presets equal weight. (Brand has confirmed 18%.)
8. **(Low) Above-the-fold target at 375px:** result block + note prompt line visible without scroll; full note may sit below the fold. Do not shrink type below the readability / contrast bar to force it up.
9. **(Low) `state` field:** import from `finxiety/src/lib/input-model/types.ts` (`Track1Inputs.state`); do not redefine. Confirm the selector covers all states + DC and degrades gracefully before selection.

⟦UX-PRE-BUILD⟧ ticket="TIP-1" date="2026-06-17"

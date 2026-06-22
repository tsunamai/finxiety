# UX Review: SAVE-1 (Savings Commitment Maker) — Full Tool Flow

**File reviewed:** `finxiety/src/routes/tools/savings-commitment/+page.svelte`
**Date:** 2026-06-21
**Reviewer:** design-ux agent

---

## UX Review: SAVE-1 — Step 1 (Goal Entry)

### Nielsen Checklist

| Heuristic | Status | Notes |
|---|---|---|
| Visibility of system status | PASS | Step indicator "Step 1 of 3" at top; aria-live region announces step transitions to screen readers |
| Match between system and real world | PASS | "What are you saving for?" is plain, human language |
| User control and freedom | PASS | Back button on step 2; start over on step 3; breadcrumb to homepage present |
| Consistency and standards | PASS | Button patterns consistent with other Finxiety tools |
| Error prevention | PARTIAL | `disabled` state on Next when goal is empty prevents empty advance — good. But there is no character-count indicator even though `maxlength="120"` is set. User hitting the limit silently will not know why input stopped accepting text. |
| Recognition rather than recall | PASS | No prior-step recall required at step 1 |
| Flexibility and efficiency | PASS | Single field; fast path for any user |
| Aesthetic and minimalist design | PASS | Only one field on screen; clean |
| Help users recognize, diagnose, recover from errors | PASS | No error states possible at step 1 (blank is handled by disabled button) |
| Help and documentation | PASS | Subtitle copy sets context adequately |

### Norman Principles

- **Affordances:** The goal input looks like a text field (it is). Button disabled state clearly communicates "not ready yet." No discoverability issue.
- **Feedback:** Submitting with a non-empty goal instantly transitions to step 2, focus moves to the step 2 heading via `step2HeadingEl?.focus()`. Transition is clear.
- **Constraints:** `maxlength="120"` is set but not communicated to the user. The browser will silently stop accepting input at 120 chars. This is a constraint with no affordance.
- **Conceptual model:** "Write one commitment in your own words" matches the mental model a user arrives with. No gap.

### Ive Restraint Test

- Elements that can be removed: None. Step 1 is already minimal — one heading, one label, one input, one button.
- Visual hierarchy: Correct. H1 title > subtitle > step indicator > step heading > field > CTA.

### Simon Memory Test

- The one memorable output: Step 1 has no output — it is an input. The memorable anchor is being asked "What are you saving for?" rather than "Enter savings goal." The human question is the right move.
- Cognitive load assessment: Low. Single question, no instructions to parse.

### Financial Anxiety Overlay

- Shame signals: None. The framing "What are you saving for?" is aspirational, not diagnostic.
- Trust signals: Subtitle copy sets intent without pressure. No urgency language.
- Cognitive load: Low.

---

## UX Review: SAVE-1 — Step 2 (Transfer Setup)

### Nielsen Checklist

| Heuristic | Status | Notes |
|---|---|---|
| Visibility of system status | PASS | Step indicator updates; aria-live announces "Step 2 of 3: choose your amount, how often, and when." |
| Match between system and real world | PASS | Label "What's the smallest amount that would feel like progress?" is deliberately non-intimidating |
| User control and freedom | PASS | Back button returns to step 1 |
| Consistency and standards | PASS | Dollar-prefix input pattern matches TIP-1/HOURS-1 |
| Error prevention | PARTIAL | Amount field has `min="0"` on the HTML element but `type="number"` means the browser will allow negative entry by keyboard on some platforms. Client-side guard is `amount > 0` in derived `amountValid`, which is correct — but the browser number-input spinner shows on desktop and can be confusing for small amounts like $5. The `inputmode="decimal"` is present (correct), but no `min` enforcement produces an error message; the submit button simply stays disabled. On its own this is acceptable, but there is no hint text telling the user the amount is required. Optional fields are marked "(optional)"; required fields are not differentiated. |
| Recognition rather than recall | PASS | Goal text from step 1 is not repeated on step 2, but this is acceptable — the user just typed it, and the step heading "Set up your transfer" bridges naturally |
| Flexibility and efficiency | PASS | Optional fields clearly labeled; user can skip habit anchor and target |
| Aesthetic and minimalist design | PASS | Five fields is the right number for this step; nothing extraneous |
| Help users recognize, diagnose, recover from errors | PARTIAL | The `whenPrompted` error state is calm in tone ("A specific day or trigger — like 'every other Friday after I get paid.'") but it uses `role="status"` and `aria-live="polite"`. This is correct for a soft hint, but the duplicate hint text (once in the static `field-hint` paragraph and again in the `whenPrompted` message) means a screen-reader user hears essentially the same sentence twice. The second appearance adds no new information. |
| Help and documentation | PASS | Hint text on the when field is the right approach |

### Norman Principles

- **Affordances:** The roving radiogroup for frequency is well-implemented. `role="radio"`, `aria-checked`, and keyboard arrow-key navigation are all present. On mobile, the three buttons are `flex-wrap: wrap` with `min-width: 88px` — adequate for 375px assuming all three fit in two rows at worst. "Every two weeks" at 88px minimum is tight; the label may wrap inside the button at the lower bound. This needs a minimum-width increase or a layout test.
- **Feedback:** `canStartCommitment` disables the primary CTA until all required fields are filled. This is good error prevention, but the user cannot easily tell which of the three required fields (amount, frequency, when) is causing the button to remain disabled. A user who has filled amount and frequency but not "when" gets no visible indication of why the button is still grey.
- **Constraints:** `maxlength="120"` on both free-text fields, `maxlength="80"` on habit anchor — none of these are communicated visually. Same issue as step 1.
- **Conceptual model:** The split between "how often" (frequency segmented control) and "when will you do it" (free text) may confuse some users. "Monthly" answers "how often" but "the 15th of every month" answers "when." The hint text ("every other Friday after I get paid") suggests a combined answer is expected in the "when" field, but a user who selects "Monthly" and then types "monthly" in the when field will produce a redundant statement. The instructions do not explain the relationship.

### Ive Restraint Test

- Elements that can be removed: The `field-hint` paragraph on "when" (`aria-describedby="when-hint"`) provides value. However, when `whenPrompted` triggers, the second paragraph with nearly identical text is redundant. One appearance of the hint is enough.
- Visual hierarchy: Correct. Labels before inputs, optional markers clearly appended, CTA row at the bottom.

### Simon Memory Test

- The one memorable output: Step 2 has no output yet, but the framing "What's the smallest amount that would feel like progress?" is the most memorable moment of the entire flow. It reframes savings as any movement, not a target. This is the tool's best copy.
- Cognitive load assessment: Medium. Five fields in sequence with the frequency selector requiring visual parsing. Acceptable for this user, but the required/optional distinction should be cleaner to reduce decision overhead.

### Financial Anxiety Overlay

- Shame signals: None. "Smallest amount that would feel like progress" actively neutralizes shame around small amounts. This is correct.
- Trust signals: No benchmark shown, no comparison to what others save. No judgment signal.
- Cognitive load: Medium. The combined required-field ambiguity (why is my button still grey?) adds friction for a user already under cognitive load.

---

## UX Review: SAVE-1 — Step 3 (Commitment + Artifacts)

### Nielsen Checklist

| Heuristic | Status | Notes |
|---|---|---|
| Visibility of system status | PASS | `aria-live` announces "Step 3 of 3: your commitment is ready below." Focus moves to step 3 heading. |
| Match between system and real world | PASS | "Your commitment" is the right heading. "Add to my calendar" and "Copy this" are plain action language. |
| User control and freedom | PASS | "Start over" is present. Commitment is editable inline. |
| Consistency and standards | PASS | Button layout matches step 2 step-actions pattern |
| Error prevention | PASS | Empty textarea state on download is caught: "Add some text to your commitment first, then download it." Empty copy is silently no-op'd (returns without action) — should provide feedback instead. |
| Recognition rather than recall | PASS | The full commitment statement is visible on screen before the user acts on it |
| Flexibility and efficiency | PASS | Copy is faster; calendar download is richer. Two paths for different user needs. |
| Aesthetic and minimalist design | PARTIAL | Two `<p class="copy-status" role="status" aria-live="polite">` elements, one for `copyStatus` and one for `downloadStatus`, both always rendered (they just may be empty strings). Two live regions firing simultaneously is noisy for screen readers. These should be a single region that shows whichever message is current. |
| Help users recognize, diagnose, recover from errors | PARTIAL | Empty copy (blank textarea + Copy button) produces no user feedback — the `handleCopy` function returns silently if `text === ''`. The user gets no indication anything happened or didn't happen. |
| Help and documentation | PASS | Calendar download status message is excellent: explains what to do on phone vs. computer. Privacy note is present and well-placed. |

### Norman Principles

- **Affordances:** The `<blockquote>` display of the commitment statement does not look editable — it is a styled blockquote, not a form element. The edit textarea below it is labeled "Edit your commitment (optional)" which correctly exposes the edit path. However, the blockquote and the textarea both show the same text, and the relationship between them (the blockquote updates live as the textarea is edited, since `editedStatement` is bound to both) is the conceptual model. On mobile, the vertical distance between the blockquote and the edit textarea may not be obvious. A user who edits the textarea and looks up at the blockquote will see it has changed — this is good feedback — but the initial discoverability of "there is an editable version of this" requires reading down to the label. The blockquote itself carries no affordance signal that it is responsive to edits.
- **Feedback:** The live update of `blockquote` content as `editedStatement` changes via the textarea binding is excellent real-time feedback. `copyStatus` clears after 2000ms (correct). `downloadStatus` does not clear — it persists until start-over. This is intentional (the instructions are durable), which is the right call.
- **Constraints:** The textarea has no `maxlength`. A user could write an arbitrarily long commitment statement. This is acceptable since the commitment is personal and the artifact is local. No constraint needed here.
- **Conceptual model:** The `blockquote` above the edit field creates an ambiguity: is the blockquote the "final" version and the textarea a draft, or are they the same thing? The code makes them identical via shared state, but visually the blockquote looks like output and the textarea looks like input. A first-time user may not connect them immediately.

### Ive Restraint Test

- Elements that can be removed: The "not-a-lock" paragraph ("This is a plan you made, not a lock. Your money is still yours to use.") is doing real emotional work — it preempts anxiety about having committed to something. Keep it.
- The privacy note is earning its place given the target user's trust deficit with financial tools. Keep it.
- The `<blockquote>` followed by an edit textarea is one element too many in the visual stack. Consider whether the blockquote is needed at all if the edit textarea is immediately below it and always in sync. The blockquote's value is presentation quality (olive border, cream background) — it makes the commitment feel official. The textarea is functional. Both serve distinct roles; the current dual-display approach is defensible but adds visual length on a phone.
- The second `step-actions` div (containing only "Start over") is separated from the first (calendar + copy). This is intentional pacing — start over is a destructive action and deserves distance. The spacing is correct.

### Simon Memory Test

- The one memorable output: "I will set aside $[amount] [frequency] [when]." This is the correct single memorable output. The commitment statement in the user's own words is the artifact they take away. Everything else is supporting cast.
- Cognitive load assessment: Low once the commitment is generated. The step presents the result first, then optional editing, then actions. This sequence matches how people naturally process: see the thing, adjust if needed, do something with it.

### Financial Anxiety Overlay

- Shame signals: None. The "not-a-lock" line actively reduces shame/pressure. The "nothing here is saved" privacy note reduces surveillance anxiety (relevant for this population). Correct.
- Trust signals: Privacy note present. "This is a plan you made" assigns ownership correctly — the tool is a tool, not an authority.
- Cognitive load: Low on happy path. The dual live-region issue (two `<p role="status">` elements) adds unnecessary noise for assistive technology users.

---

## Full-Flow Cross-Cutting Findings

### Character Count Indicators (all steps)

`maxlength` attributes exist on goal (120), when (120), and habit anchor (80) fields. None have visible character count indicators. On mobile, reaching the limit causes the keyboard to stop accepting characters with no explanation. This is the most pervasive single gap across the flow.

### Required vs. Optional Field Differentiation (step 2)

Three required fields (amount, frequency, when) and two optional fields. Optional fields are marked "(optional)" in the label. Required fields are unlabeled as required. The submit button disables silently. A user staring at a grey "Write my commitment" button with no error state cannot tell which field is blocking them. This is the most significant usability issue in the flow.

### Focus Management

Step 1 to step 2: focus moves to `step2HeadingEl` via `await tick(); step2HeadingEl?.focus()`. Correct.
Step 2 to step 3: `tick().then(() => step3HeadingEl?.focus())`. Correct pattern, using `.then()` rather than `await` — functionally equivalent, no issue.
Back from step 2 to step 1: `backToStep1()` does not restore focus to a specific element. The goal input does not receive focus. A keyboard user returning to step 1 will have focus dropped to the document body (or browser default). Low-severity but real gap for keyboard navigation.

### Keyboard Navigation: Frequency Radiogroup

The roving radiogroup pattern is implemented correctly: `role="radiogroup"`, `role="radio"`, `aria-checked`, arrow-key handling, `tabindex` management. Arrow Right/Down and Left/Up navigate correctly with wraparound. The `tabindex="-1"` on the container `div` is intentional so it does not appear in the tab order (correct). This is one of the better keyboard patterns in the Finxiety suite.

### Mobile Target Sizing

Button height `min-height: 48px` on frequency toggle buttons is correct (meets 44px minimum). "Every two weeks" at `min-width: 88px` may cause label wrapping inside the button on narrow containers if CSS flex calculates available width below that threshold. Worth a visual spot-check at 375px but likely acceptable given `flex-wrap: wrap` allows three buttons to flow to two rows.

### Two Simultaneous Live Regions (step 3)

Lines 402-403 render two separate `<p role="status" aria-live="polite">` elements, one for `copyStatus` and one for `downloadStatus`. When both hold non-empty strings (e.g., user copies after downloading), a screen reader may announce both. They should be merged into a single live region showing whichever string is non-empty, or the messages should be made mutually exclusive by consolidating into one `statusMessage` state variable cleared and re-set by each action.

### Empty Copy (Step 3)

`handleCopy()` returns silently when the textarea is empty. This is an edge case (the textarea is pre-populated by `buildStatement`) but it can be reached if the user deletes all text from the textarea and then taps Copy. The silent no-op leaves the user without feedback. Should produce a short status message parallel to the download guard ("Add some text to your commitment first").

---

## Required Changes Before Build

**Critical**

None.

**High**

1. **Required field identification on step 2 (file:line 275-333):** When the primary CTA is disabled, the user has no way to know which required field is blocking them. Add visible required indicators (e.g., asterisk with a screen-reader-accessible legend, or inline hint text on focus-out for empty required fields). The `whenPrompted` pattern already handles the "when" field on submit attempt — extend this pattern to amount and frequency so all three required fields surface a prompt when the user tries to submit without them filled. Without this, the grey disabled button is a dead end for the user.

2. **Character count feedback on text inputs (file:line 258-262, 322-326, 356-360):** Add visible character count display (e.g., "82/120") below the goal, when, and habit anchor fields when they contain text. Silent truncation at `maxlength` is a trust-breaking failure mode on mobile keyboards. At minimum, add count display once the user has typed more than half the allowed length (e.g., >60 chars for 120-char fields).

**Medium**

3. **Duplicate hint text on "when" field (file:line 318-333):** The static `field-hint` paragraph and the `whenPrompted` conditional paragraph contain near-identical text. The `whenPrompted` version currently fires as `role="status" aria-live="polite"` — screen reader users hear the same guidance twice. Change the `whenPrompted` paragraph to add genuinely new information (e.g., "This field is required before you can continue") rather than repeating the placeholder hint.

4. **Consolidate dual live regions on step 3 (file:line 402-403):** Merge `copyStatus` and `downloadStatus` into a single `<p role="status" aria-live="polite">` element. Use a single `statusMessage` reactive variable that is cleared and re-set by both `handleCopy` and `handleAddToCalendar`. This prevents screen readers from announcing two messages simultaneously.

5. **Focus restoration on back navigation (file:line 90-93):** After `backToStep1()`, restore focus to the goal input (`document.getElementById('goal')?.focus()`) following the `await tick()`. Without this, keyboard users lose their place in the page.

6. **Silent no-op on empty Copy (file:line 173-176):** If `text === ''` in `handleCopy`, set a status message ("Add some text to your commitment first") instead of returning silently. Mirrors the existing guard in `handleAddToCalendar`.

**Low**

7. **Frequency/when conceptual model clarification (file:line 316-326):** The relationship between the "How often?" segmented control and the "When will you do it?" free-text field is not explained. A user who selects "Monthly" may type "monthly" in the when field, producing a redundant statement. Add a one-line hint beneath the "when" label clarifying that the free-text captures the specific day or trigger, e.g., "Think day, not cadence — you already chose that above."

8. **Download status message does not clear (file:line 169-170):** The download status is intentionally durable (instructions are useful to keep visible). However, if the user later taps Copy, `copyStatus` appears in its separate live region but `downloadStatus` still shows the long instruction paragraph below it. On a narrow phone, two status blocks stack below the action buttons, compressing the Start Over region. Consider whether to clear `downloadStatus` when a copy action succeeds (since the user is no longer in the download flow).

---

## Summary

SAVE-1 is structurally sound. The step flow is clear, focus management is implemented for forward navigation, the keyboard radiogroup pattern is correct, and the emotional framing throughout is exactly right for the target user. The commitment statement generation and inline editing approach is well-conceived.

The two High issues both relate to the same root problem: silent failure. The grey disabled button with no explanation (step 2) and the silent copy no-op (step 3) both leave the user without feedback at the exact moment they need it. These are solvable without touching the architecture.

The character count gap is a mobile-specific trust issue that disproportionately affects users on constrained keyboards.

None of the issues warrant blocking the build, but the two High findings should be resolved before the tool is distributed publicly.

⟦UX-BLOCKED⟧

<!-- Block reason: two High findings (required field identification, character count feedback) must be resolved before public distribution. Internal/preview use may proceed. -->

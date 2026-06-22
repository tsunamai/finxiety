## Disability Accessibility Review: Personal Finance Myth Quiz (MYTH-2)
## Persona applied: Disability & Chronic Illness User (finxiety/research-findings/persona-renee-disability-user.md)

**Reviewer:** disability-accessibility agent
**Date:** 2026-06-21
**Ticket:** MYTH-2
**Files reviewed:**
- `finxiety/src/routes/tools/myth-quiz-2/+page.svelte`
- `finxiety/src/lib/data/myth-quiz-2.ts`
- `finxiety/src/app.css`
- Prior gates: `myth-2-validation-qa-2026-06-21.md` ⟦QA-VERIFIED⟧, `myth-2-validation-brand-2026-06-21.md` ⟦BRAND-REVIEWED⟧

I am not re-running QA's WCAG audit or brand's voice review. I am reviewing what this tool does to a person carrying fluctuating capacity, institutional distrust, and disclosure risk at the same time as financial precarity. Renee is reviewed here as the same person as Dani on a worse week.

---

### Cognitive Accessibility Beyond Compliance

- **Interruption survivability:** This is the central concern, and it is where the tool is weakest for this user. The flow holds all state in component memory (`$state` runes — `phase`, `qIndex`, `estimates`, `currentValue`, synthesis answers). There is no persistence. If Renee gets four questions in, sets the phone down during a pain spike, and the tab is evicted by mobile Safari (which aggressively discards background tabs to reclaim memory), or she simply closes it and comes back an hour later, she returns to the welcome screen with zero progress. The persona is explicit: "If a flow is interrupted (a pain spike, a knock at the door, a task that has to be set down), resuming should not cost re-reading everything from the start." This is the longest flow in Finxiety (10 questions, 20+ phase transitions) and the only one where losing place costs the most, yet it has the least protection against interruption.
- **Working memory burden:** Low, and this is done well. Each question is self-contained. Nothing requires holding a figure from one screen to use on another. The reveal restates "You guessed X / The real number Y" so the user never has to remember what they entered. Back-navigation re-shows the locked reveal rather than re-opening the input, which removes the "did I already answer this?" load. This is correct for a fog day.
- **Error cost:** Low and well-handled. Validation only applies to the one number-input question (tipped-minimum); a bad entry produces an inline message and never discards a prior answer. Sliders cannot produce an empty/invalid state. No error in this flow costs committed progress.
- **Finding: flag.** Working-memory design is genuinely good. The gap is interruption survivability across a session — the single longest flow with no state preservation, reviewed against a persona whose defining trait is that capacity runs out mid-task.

### Sensory Accessibility in Lived Practice

- **Dynamic content announcement:** Reveal and score sections carry `aria-live="polite"`, so new content is announced. But there is a subtlety the automated audit didn't surface: the reveal section is wrapped in `{#key current.id}`, and `aria-live` regions that are removed and re-inserted (rather than mutated in place) do not reliably re-announce in all screen reader / browser combinations. Combined with the focus gap below, a VoiceOver user on a flare day may submit a guess and land in silence, unsure whether anything happened.
- **Focus management:** QA's F2 flagged this as Medium. **For this persona I am raising it to High** (see Critical Findings). On submit, focus is dropped. For a sighted keyboard user this is a few extra Tab presses. For a screen-reader user navigating on a high-fatigue / brain-fog day — slow, low-spoon, already braced for systems that don't work for her — being dropped to document body with no focus anchor, 10 times in a row, is not a minor inconvenience. It is the difference between a flow that is completable on a bad-symptom day and one that is not. The estimate→reveal transition is the exact moment the payoff content appears, and it's the moment focus vanishes.

  Note: the code at lines 98-99, 112-113, 129-130 *does* call `revealSectionEl?.focus()` / `synthesisSectionEl?.focus()` / `scoreSectionEl?.focus()` after `tick()`. The estimate phase also focuses `estimateSectionEl`. So focus management is partially implemented — focus moves to the section wrapper (which has `tabindex="-1"`). QA's F2 may have been written against an earlier build. **This needs live verification** (see Critical Findings): if focus does land on the reveal `<section>`, the High concern is substantially mitigated and drops toward the original Medium. If the focus call is failing silently (e.g. the `{#key}` block re-creating the element after the bound ref is captured), the High stands. I could not run the browser in this gate.
- **Color-only signals:** Pass. The compare block uses text labels ("You guessed" / "The real number"), not color, to distinguish guess from real. The terracotta on the real answer is reinforcement, not the sole signal. Slider state is conveyed by the numeric `<output>` and `aria-valuetext`, not color.
- **Finding: flag.** Color is clean. The live-region-plus-`{#key}` re-announcement pattern and the unverified focus landing are the open sensory questions, both feeding the High finding.

### Physical & Fatigue Considerations

- **Touch target sizing:** The slider is the primary input for 9 of 10 questions. The track is `height: 36px`. QA noted iOS pads the hit area to ~44px. That is true for the *vertical* touch slop, but it does not address the harder problem for this persona: **horizontal precision**. A range input with `step=5` across a 0-100 range has 21 discrete stops spread across a ~300px-wide track at 375px — roughly 15px per step. For a user whose hands swell during an RA flare ("her hands swell too much to type"), landing on or near an intended value with a shaky drag is high-effort and easy to overshoot. The slider thumb itself has no explicit sizing in the component CSS or app.css (no `::-webkit-slider-thumb` / `::-moz-range-thumb` rule), so it renders at the browser default (~16-20px), below the 44px comfortable-target guidance for an imprecise pointer.
- **Mitigating factor:** Because the quiz is explicitly ungraded and the slider answer only drives a "you guessed X" restatement, precision genuinely does not matter to the outcome. Renee can drag approximately and the tool still works. This meaningfully lowers the stakes of the precision problem — but it is not surfaced to her. She doesn't know her imprecision is costless; the UI presents the slider with the same visual seriousness as a real input, so she may still spend spoons trying to be accurate.
- **Keyboard/AT alternative:** A native range input is arrow-key adjustable, which is a real accessibility win for motor-limited users who use a keyboard or switch — they are not forced into a drag gesture. Good.
- **Interaction count / energy-to-value ratio:** 10 questions × (slide + lock-in + read reveal + next) is a high total interaction count — the highest in the suite. For a low-spoon session the full run is a lot. There is no way to take the tool in smaller bites (tied directly to the no-persistence finding) and no indication up front of how long it runs beyond "Ten questions." The value is genuine (the reveals are real information), but the tool asks for a sustained 10-unit commitment with no save point.
- **Finding: flag.** Slider precision is forgiving by design but not communicated as forgiving; thumb is sub-44px for imprecise input; total interaction load is high with no way to pause and resume.

### Disability-Specific Shame & Disclosure Anxiety

- **Disclosure Safety Test:** I walked all 10 questions and both synthesis prompts looking for anything that touches income, work status, health, capacity, work-history gaps, or benefit enrollment.
  - None of the 10 quiz questions ask Renee anything about herself. They ask her to estimate a *fact about the world* (a research figure, a year, a percentage). She is never asked her income, her work status, her health, whether she has savings, or whether she has a disability. There is no field that could reveal disability status by direct question or by inference.
  - The `emergency-fund` and `credit-score` questions ask "true or false" about general claims ("Having money in checking means you have an emergency fund"), not about *her* checking account or *her* credit. The framing is about the concept, not the user. This passes cleanly.
  - Synthesis prompt 1 ("Which finding surprised you most?") and prompt 2 ("Is there something you assumed about money that this changed or confirmed?") are both optional, ungraded, and self-directed. Neither asks her to disclose a circumstance. The free-text field is never read, scored, or transmitted (stateless tool).
  - Running the four-question test on the closest-to-personal items (emergency-fund, credit-score true/false): (1) answering honestly does not feel like a test with a right/wrong answer because the tool pre-commits to "No grades, no right answers" on the welcome and synthesis screens; (2) "it varies / I'm not sure" is structurally accommodated — the slider has no wrong position and the true/false is a guess, not a declaration; (3) no benefit or penalty attaches to any answer; (4) the least-favorable result ("you guessed far from the real number") is framed by every reveal headline as the *system's* gap, not hers.
- **Finding: pass.** This tool carries no disability-disclosure surface. There is no question Renee would feel scrutinized answering. This is the tool's strongest dimension for this persona, and it is structural — the quiz format simply never asks her to categorize herself.

### Benefit-Cliff Fear Specific to Disability

- **Asset limit acknowledgment:** Not applicable to this tool's scope. MYTH-2 touches no asset-tested or income-tested disability program (no SSI, SSDI, Medi-Cal, IHSS, CalFresh content). It is a personal-finance-myth quiz about tips, taxes, credit, and compounding.
- **Income-is-not-always-good-news framing:** Not applicable — no income input, no eligibility output.
- **ABLE account surfacing:** Here is the one place worth a deliberate note, not a blocker. The `emergency-fund` question and the `big-changes` question both discuss saving money as a generically good thing ("set aside specifically for unplanned events," "transferring $5 weekly"). For Renee specifically, saving into an ordinary account is *not* unambiguously good news — accumulating assets can threaten SSI/Medi-Cal eligibility once her appeal resolves, which is her exact unresolved 2am fear, and ABLE accounts exist to solve precisely this. **I am not asking MYTH-2 to teach ABLE accounts** — that would be scope creep and would break the tool's clean myth-quiz frame, and the Do No Harm principle cautions against bolting disability-benefit complexity onto a general tool where it could mislead. But it is worth logging for the suite: a person on means-tested disability benefits who takes the "just save automatically" message at face value could be quietly steered toward a cliff. The right home for ABLE is a future disability-specific tool, surfaced by the cross-tool signpost system, not this quiz.
- **Finding: pass (with one suite-level note logged, non-blocking for MYTH-2).**

### Double Vulnerability

- **Compounding load check:** Reviewed as Renee-who-is-also-Dani, on a flare day, between shifts, braced. The scarcity bandwidth tax and the fatigue/fog tax draw on the same pool. Where the tool serves both at once: the per-question self-containment, the restated guess, the locked-reveal back-navigation, and the zero-disclosure format all keep the *moment-to-moment* cognitive cost low. That is real and worth crediting. Where the two loads compound against the tool: the no-persistence + high-interaction-count + dropped-focus combination. On a good-spoon day none of these bite. On a flare day, all three land together — she is slow, she is low on capacity, she is likely to be interrupted, and if she is on a screen reader she may also be losing her place on every transition. The tool is completable for Dani-on-a-normal-day and for Renee-on-a-good-week. The open question is Renee-on-a-flare, which is the case the persona says must be the design target, not the edge case.
- **Finding: flag.** Each individual screen holds. The full 10-question journey, taken on a low-capacity day, is where the compounding shows.

---

### Critical Findings

**D1 — HIGH — Focus management on phase transitions must be verified for a screen-reader user on a flare day (escalated from QA F2 Medium)**

QA scored the focus gap Medium on a general-keyboard-user basis. For this persona it is High, because the estimate→reveal transition is repeated 10 times and is the exact moment the payoff content appears; a screen-reader user on a high-fatigue day who is dropped to document body each time, with no focus anchor, may be unable to tell whether her guess registered, and must re-Tab into content 10 times in a sequence already taxing her capacity. **However:** the current code (lines 98-99, 112-113, 129-130, 42-43, 108-109) *does* call `.focus()` on the destination section wrapper after `tick()`, and each section carries `tabindex="-1"`. This may mean F2 was written against an earlier build and the gap is already largely closed. The blocker is that I could not confirm at runtime whether focus actually lands on the reveal section — the `{#key current.id}` wrapper re-creates the element, and if the bound reference (`revealSectionEl`) is captured before the keyed re-render completes, the focus call could no-op silently.

*Why it matters for this user:* "The tool must be completable on a bad-symptom day, not just a good one." A screen-reader flare-day run is the bad-symptom day, and focus continuity is what makes it completable.

*Solution space:* Live-verify with VoiceOver/iOS + a screen reader on desktop that, after each "Lock in my guess," focus and the AT reading cursor land on the reveal. If confirmed working, D1 downgrades to the original Medium and this gate's blocker clears. If focus is being dropped, move focus explicitly to the `.reveal-headline` (give it `tabindex="-1"`) rather than the section wrapper, which gives the AT a concrete, meaningful landing point. Also verify the `aria-live` region re-announces despite the `{#key}` remount; if it does not, consider a single persistent live region outside the keyed block.

**D2 — MEDIUM — No session persistence on the longest flow in the suite**

State lives only in component memory. A flare-day interruption (tab discarded by mobile Safari, phone set down, app backgrounded) returns Renee to the welcome screen with all 10 questions to redo. This is the tool most likely to be interrupted (longest) and the one with the least protection.

*Why it matters for this user:* The persona's defining cognitive trait is that capacity runs out mid-task and the task gets set down. A flow that punishes setting-down is a flow built for the good-week version of her.

*Solution space:* This is a no-PII tool, so persistence must stay client-side. A lightweight `sessionStorage` (or `localStorage`) snapshot of `phase`, `qIndex`, and `estimates`, restored on mount with a quiet "Pick up where you left off?" affordance, would close it without violating the stateless-server rule (no data leaves the device). This is a design/architecture decision for the PM, not a fix I prescribe — flagging that the no-PII constraint is about *server* storage and does not forbid client-side resume.

**D3 — MEDIUM — `fadeIn` animation has no `prefers-reduced-motion` guard, and it fires on every one of 20+ transitions**

`.step { animation: fadeIn 0.2s ease; }` (translateY + opacity) runs on every phase change with no reduced-motion media query. Six other components in this codebase (`SearchResults`, `SearchBox`, `PromptChips`, `AllTools`, `tools/+page`, `tools/guide/+page`) already wrap their animations in `@media (prefers-reduced-motion: reduce)`. This component is the outlier.

*Why it matters for this user:* Vestibular sensitivity and motion-triggered nausea are common with chronic illness and with medication side effects — the persona specifically names prednisone fog. A small translate-and-fade, fired 20+ times across a 10-question run, is exactly the repeated motion a reduced-motion preference exists to suppress. The pattern is already established elsewhere in the codebase; this is consistency, not new work.

*Solution space:* Add `@media (prefers-reduced-motion: reduce) { .step { animation: none; } }` to the component, matching the existing pattern in the six siblings.

**D4 — LOW — Slider thumb is sub-44px for imprecise input, and the forgiving nature of the slider is not communicated**

The range thumb has no explicit sizing (renders at browser default, ~16-20px), below comfortable-target guidance for a shaky or imprecise pointer. The mitigating reality — that precision is costless because the quiz is ungraded — is true but invisible to the user, who may spend capacity trying to land an exact value that doesn't matter.

*Why it matters for this user:* RA flares make fine drag gestures high-effort. A larger thumb lowers the motor cost; signaling "approximate is fine" lowers the cognitive cost of perfectionism.

*Solution space:* Add `::-webkit-slider-thumb` / `::-moz-range-thumb` sizing to ~28-32px (visually larger, easier to grab; arrow-key adjustment already serves keyboard/switch users). Optionally soften the field hint toward "a rough guess is all this needs." Both are enhancements, not blockers.

**Suite-level note (non-blocking, logged for the backlog, not a MYTH-2 finding):** The generic "saving is good" framing in the `emergency-fund` and `big-changes` reveals is unambiguously good advice for Dani but carries a hidden asset-cliff risk for a user on means-tested disability benefits (SSI/Medi-Cal asset limits; ABLE accounts solve this). This does not belong in MYTH-2 and should not be added here. It belongs in a future disability-specific tool reachable via the signpost system. Logging so the suite-level decision is made deliberately rather than by omission.

---

### What the Tool Does Well for This User

- **Zero disclosure surface.** Renee is never asked to categorize herself, declare a disability, state an income, or reveal a circumstance. The quiz-about-the-world format means there is no question she would feel scrutinized answering and no answer that feels like a test she might fail in either direction. For a user whose first contact with disability systems was a denial letter, a tool that asks nothing of her identity is a relief by construction.
- **System-blame framing throughout.** Every reveal locates the gap in policy, product design, or information asymmetry — never in the guesser. "This is a policy choice, not an oversight." "The intervention wasn't the user's psychology — it was the company's product decision." This is the same institutional-honesty the persona says would "land as relief, not generic reassurance." It does not perform sympathy or treat her as fragile; it delivers accurate information the same way it would to anyone, which is exactly what she asks for.
- **No-grade commitment is structural, not cosmetic.** "Reveals seen," not "X correct." The score screen externalizes the knowledge gap explicitly. There is no version of this tool's ending that reads as a verdict on her — important for a user already carrying the "am I disabled/broke enough" doubt.
- **Working-memory design is genuinely good.** Self-contained questions, restated guesses, locked reveals on back-navigation. Nothing forces her to hold a value across screens — the right call for a fog day.
- **Forgiving inputs.** Sliders cannot error; the one number field never discards prior progress on a bad entry; arrow-key adjustment serves motor-limited keyboard users. The moment-to-moment interaction is low-stakes.

---

### Sign-off

Three findings at Medium and one at High remain open. The High (D1) is conditional — it may already be resolved in the current build and requires only a live screen-reader verification to confirm or close. The two Mediums (D2 persistence, D3 reduced-motion) are real gaps against the flare-day design target. Withholding sign-off pending: (1) live verification of D1 focus landing, and (2) PM disposition of D2 and D3. None of these block on the disclosure or benefit-cliff axes, which both pass cleanly.

⟦DISABILITY-REVIEW-WITHHELD⟧ tool="myth-quiz-2" ticket="MYTH-2" date="2026-06-21" blockers="D1 HIGH (focus management on phase transitions — escalated from QA F2; requires live screen-reader verification to confirm whether already resolved in current build or still dropping focus)" open="D2 MEDIUM (no session persistence on the longest flow — flare-day interruption discards all progress), D3 MEDIUM (fadeIn animation lacks prefers-reduced-motion guard, fires 20+ times per run, outlier vs. six other components), D4 LOW (sub-44px slider thumb for imprecise input; forgiving nature not communicated)" passes="disclosure safety (zero disability-disclosure surface across all 10 questions and both synthesis prompts), benefit-cliff (out of scope; one suite-level ABLE note logged non-blocking), color-only signals, working-memory burden"

---

## Re-verify — 2026-06-21

Re-running D1 against the current build with the UX agent's structural confirmation now in hand. The UX agent reviewed the focus implementation and confirmed the ordering is sound: `{#key current.id}` destroys and recreates the DOM section, `bind:this` captures the new element reference after that recreation, `await tick()` flushes all pending DOM updates, and `.focus()` then runs on the live element. My remaining D1 concern was that the bound ref might be captured before the keyed re-render completes, causing a silent no-op. That ordering concern is the exact thing the UX review resolved.

Confirmed against the current source:

- All async navigation functions call `await tick()` immediately before `.focus()`: `startQuiz` (lines 42-43), `submitEstimate` (98-99), `nextQuestion` (108-109 estimate path, 112-113 synthesis path), `previousReveal` (122-123), `finishSynthesis` (129-130). `startOver` (133-141) returns to the welcome screen, which carries its own start button and needs no programmatic focus — correct.
- Every section that receives focus has both `tabindex="-1"` and `bind:this`: estimate section (line 169), reveal section (287), synthesis section (354), score section (395).
- `{#key current.id}` wraps both the estimate section (line 168) and the reveal section (286) — the two per-question phases where the element is destroyed and recreated and where the focus-after-recreation ordering matters.

D2/D3 re-check: the welcome systemic-framing line (`estimate-note`, line 163: "These gaps aren't about financial literacy — they're about how systems were built and what they don't explain. No grades, no right answers.") and the conditional `signpost-note` paragraph (lines 324-326, with a link to The Benefits Screener) were reviewed for disability-specific effect. The welcome framing reinforces the system-blame and no-grade posture that already passed the Disclosure Safety Test — it strengthens that dimension and introduces no new disclosure surface. The signpost note is plain, optional, and reachable by keyboard/AT as a normal link; it asks nothing of the user and reveals nothing about her. Neither D2 (session persistence) nor D3 (reduced-motion) is affected by these text changes; both remain exactly as previously logged, non-blocking Mediums for PM disposition.

### D1 (Focus management): Cleared

The async-tick-then-focus ordering is implemented consistently across all five navigation functions, every focus target carries `tabindex="-1"` + `bind:this`, and the `{#key}` wrapper is on both per-question phases. The UX agent's structural confirmation resolves the one runtime ambiguity I could not test myself: the bound reference is captured after the keyed recreation, `tick()` flushes before focus, so `.focus()` lands on the live element rather than no-opping. For a screen-reader user on a flare day, focus and the AT reading cursor now land on the destination section after every "Lock in my guess," which is what makes the 10-question run completable on a bad-symptom day. D1 clears.

### D2 and D3 updates (if any)

None on the disclosure or focus axes. The welcome systemic-framing change and the signpost-note addition do not affect D2 (no session persistence) or D3 (no `prefers-reduced-motion` guard on `fadeIn`); both stand as previously written, non-blocking Mediums for the PM. The welcome framing modestly strengthens the already-passing disclosure-safety dimension. No re-scoring needed.

### New findings (if any)

None. The `estimate-note` welcome line carries no disclosure surface and reinforces the no-grade framing. The `signpost-note` paragraph (lines 324-326) renders a plain optional link to The Benefits Screener, asks nothing of the user, reveals nothing about her, and is keyboard/AT-reachable — it introduces no new cognitive-load, disclosure, or benefit-cliff concern. Note for completeness, not as a finding: the signpost link to /tools/screener does mean a user who follows it may then encounter the BEN-1 "gross monthly income" field, which the persona flags as assuming income stability — but that is BEN-1's review surface, already logged there, not a MYTH-2 finding.

With D1 cleared and no new HIGH blockers, the only remaining open items are the two non-blocking Mediums (D2, D3) and one Low (D4), all dispositioned to the PM. No Critical or High findings remain.

⟦DISABILITY-REVIEWED⟧ tool="myth-quiz-2" ticket="MYTH-2" date="2026-06-21"

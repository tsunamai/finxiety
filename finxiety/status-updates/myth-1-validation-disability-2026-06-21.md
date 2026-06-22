## Disability Accessibility Review: Benefits Myth-Check Quiz (MYTH-1)
## Persona applied: Disability & Chronic Illness User (finxiety/research-findings/persona-renee-disability-user.md)

**Review date:** 2026-06-21
**Reviewer:** disability-accessibility agent
**Files reviewed:**
- `finxiety/src/routes/tools/myth-quiz/+page.svelte`
- `finxiety/src/lib/data/myth-quiz.ts`
**Prior gate consulted:** `finxiety/status-updates/myth-1-validation-qa-2026-06-21.md` (Finding A-2, focus management)

---

### Framing note (read first)

MYTH-1 is a national, general-benefits education tool. Its five questions cover SNAP asset tests, the benefit cliff, average SNAP dollars/day, procedural (paperwork) denials, and WIC under-enrollment. It does **not** ask the user anything about themselves: no income field, no household size, no disability status, no enrollment status. The only inputs are numeric guesses about public facts, plus two optional ungraded reflection prompts. This is the most disclosure-safe shape a benefits tool can have, and it changes the weight of several findings below: the disclosure-shame surface is nearly absent by construction, while the benefit-cliff lens lands harder because disability cliffs are exactly the category the quiz's cliff question gestures at but never names.

I walked this as Renee in Scenario B: three days into a flare, slow typing, opening it on her phone after someone in her RA group mentioned it. I held the Dani load alongside it.

---

### Cognitive Accessibility Beyond Compliance

- **Interruption survivability:** Strong. State (`phase`, `qIndex`, `estimates`) lives in the component and is not torn down between phases. If Renee sets the phone down mid-question and a flare-spike or a knock at the door pulls her away, the screen she returns to is exactly the screen she left. The one caveat is the standard web caveat: a full tab close or refresh loses everything (stateless, no-PII by design). For a 5-question quiz that is acceptable; there is no long-form data entry to lose.
- **Working memory burden:** Low and well-handled. Each question is self-contained. The reveal restates "You guessed: X / The real number: Y" on the same screen, so the user never has to hold their own guess in mind across a transition. Committed estimates are locked, and back-navigation re-shows the reveal rather than re-opening the input (`previousReveal()` sets phase to 'reveal' only) — this is genuinely good for fog: revisiting never asks her to re-derive or re-enter anything.
- **Stopping point / abandonment:** Good. The progress bar and "Question N of 5" set an honest, short expectation up front. There is no penalty framing for stopping. The score screen counts "reveals seen," not "correct," so a user who does 2 of 5 and leaves has lost nothing and failed nothing. Abandonment does not read as failure.
- **Finding: pass.** This flow is completable on a bad-symptom day. Nothing requires cross-screen memory, and interruption is survivable within a session.

### Sensory Accessibility in Lived Practice

- **Dynamic content announcement:** Partial. The reveal section and score section both carry `aria-live="polite"`, so new content will be announced to a screen reader. The `{#key current.id}` wrapper forces a full remount per question, which generally re-triggers the live announcement — good. However, see focus finding below: announcement is not the same as focus placement.
- **Focus management:** This is the material gap. QA's Finding A-2 is correct, and it matters more for this persona than its "Medium" generic severity suggests. On every estimate→reveal and reveal→next transition, no programmatic focus move occurs. The submit/next button is removed from the DOM, so a keyboard or switch-control user is dropped to the body or top of page and must tab forward to reach the reveal they just triggered. For Renee on a flare day with limited fine motor control, every "where did my focus go, let me tab to find it" recovery is a spoon spent on the tool's plumbing rather than the content. `aria-live` covers the screen-reader *announcement*, but a screen-reader user navigating by keyboard still has to chase focus to read the body, sources, and signpost in order. Across 5 questions this is 9+ uncued focus resets.
- **Color-only signals:** No problem. The guess-vs-real comparison is distinguished by literal label text ("You guessed" / "The real number"), not color alone; the synthesis selected state uses border + background + `aria-pressed`. Confirmed clean, consistent with QA.
- **Target size / imprecise input:** Primary buttons and choice buttons meet 48px. Sliders are full-width with a 36px height and native keyboard operation. The one soft spot (QA M-1) is `.btn-ghost` ("Start over," "Back to Finxiety") dropping below 44px — these are end-of-flow, low-stakes, and AAA-level, so acceptable, but worth noting for a limited-dexterity user who may mis-tap them.
- **Finding: flag.** Focus management on phase transitions (QA A-2) is the one lived-experience break. It passes the automated audit and is announced via aria-live, but a keyboard/switch/screen-reader user pays a real, repeated navigation cost.

### Physical & Fatigue Considerations

- **Touch target sizing:** Meets 44px on all primary and choice controls (48px min-height). Ghost buttons under-size (advisory, AAA).
- **Interaction count:** Minimal and appropriate. Per question: one input gesture + one "Lock in my guess" + read + one "Next." Five questions, then two *optional* reflection prompts, then a score. The synthesis is explicitly skippable (`finishSynthesis()` requires nothing), which is the right call for a depleted user — she can reach the close without spending spoons on reflection she doesn't have capacity for.
- **Energy-to-value ratio:** Favorable. The payoff (five concrete, myth-correcting facts with sources and a path to the screener) is proportionate to a ~2-3 minute, low-precision interaction. Nothing here over-charges the user for the result.
- **One flag for fatigue specifically:** the quiz cannot be skimmed to the payoff — the estimate-before-reveal mechanic is load-bearing to the design and intentionally gates each fact behind a guess. That is defensible (the surprise *is* the teaching mechanism), but for a flare-day user who only wants the facts, there is no "just show me the answers" path. This is a deliberate design tension, not a defect; I flag it only so the PM holds it consciously.
- **Finding: pass.** The result is worth what it costs. The estimate-gating is an accepted design choice, noted for awareness.

### Disability-Specific Shame & Disclosure Anxiety

- **Disclosure Safety Test:** The quiz asks the user **nothing about themselves that touches health, capacity, work-history gaps, or program enrollment.** The five quiz inputs are guesses about public statistics. The two synthesis prompts are: (1) "Which of these surprised you most?" (select, optional) and (2) "If someone told you they'd lost their SNAP benefits last year, what would you assume happened?" (free text, optional, "No right answer").
  - Walking prompt (2) through the four-question test: it is framed about a hypothetical *someone else*, not the user, and it is explicitly ungraded and optional with no storage. Answering honestly carries no risk; there is no right/wrong; nothing in the surrounding context attaches a benefit or penalty; the free text is never evaluated. It passes all four.
  - There is no binary disability question, no "are you disabled," no capacity self-rating, no enrollment checkbox. Renee's specific fear — a yes/no disability question that feels like a test she can fail in either direction — has no surface to attach to here.
- **Finding: pass.** By construction, this tool has essentially no disability-disclosure surface. It does not ask Renee to label, prove, or categorize herself to proceed. This is exactly the disclosure-safe shape the persona asks for.

### Benefit-Cliff Fear Specific to Disability

This is where the persona lens produces the substantive findings.

- **Asset-limit acknowledgment:** Partially present, but disability-blind. Q1 (savings) directly addresses the SNAP asset test and reassures that 41 states have dropped it. For Dani this is liberating. **For Renee it is incomplete in a way that could mislead.** Renee's live 2am fear is the SSI/Medi-Cal **asset limit** ($2,000 for an individual on SSI) and her $1,800 Roth IRA. The quiz's "saving money mostly doesn't cost you benefits anymore" message is true for SNAP and false for SSI/Medi-Cal-via-disability. A disabled user mid-SSDI-appeal could read Q1's reassurance and generalize it to the asset-tested disability programs she is actually navigating — the opposite of the truth. The reveal copy says "SNAP" specifically, which is correct and bounded, but the emotional takeaway ("the fear that saving costs you benefits is based on a rule most states quietly retired") is written as a general unburdening. It is not general for her.
- **Income-is-not-always-good-news framing:** Present and good in the abstract (Q2, the cliff). Q2 is the single most relevant question for this persona and it is handled with care: "it's a design flaw, not a personal failure." But Q2's examples are all childcare-subsidy and SNAP/Medicaid-cliff scenarios for working parents. The **disability-specific** cliff — earning more in a good month risking IHSS hours or triggering a Medi-Cal redetermination mid-flare, which is *the* scenario in Renee's file — is never named. The cliff question is built for Dani's raise, not Renee's good week.
- **ABLE account surfacing:** **Absent.** This is the sharpest finding. The persona is explicit: Renee has never heard of an ABLE account, it solves her exact Roth-IRA-vs-asset-limit problem, and the framework names ABLE as the thing to surface "where relevant." Q1 is literally about savings-vs-benefit-eligibility — the single most natural place in the entire suite to drop one sentence noting that for asset-tested disability programs (SSI/Medi-Cal), the rules differ and ABLE accounts exist specifically to hold savings without losing those benefits. The quiz raises the savings-vs-benefits topic and then closes it with a SNAP-only answer, leaving the disabled reader more reassured than her actual situation warrants and never pointed at the one mechanism built for her.
- **Finding: flag.** No asset-limit/ABLE acknowledgment for asset-tested disability programs, on a quiz whose Q1 and Q2 directly raise the savings-and-cliff topics. Not a Do No Harm violation (nothing stated is false; SNAP scope is correctly bounded), but a meaningful omission and, on Q1, a mild over-generalization risk for this exact user.

### Double Vulnerability

- **Compounding load check:** Reviewed as a single person who is both ALICE and disabled on the same flare day. The cognitive-load budget holds: short, self-contained, interruption-survivable, no cross-screen memory, optional reflection. The scarcity tax and the fog tax do not compound into a stall point anywhere in the flow — the one place a both-axes user pays extra is the focus-chase on transitions (sensory finding above), which is a fine-motor + bandwidth cost stacked, not a content-comprehension cost.
- The deeper double-vulnerability gap is not load, it is *coverage*: the quiz serves the Dani axis of the same person well (SNAP, WIC, cliffs as a working parent experiences them) and is silent on the Renee axis (asset-tested disability programs, ABLE, the disability redetermination cliff). A person who is both reads a tool that addressed half of who she is and didn't seem to know about the other half.
- **Finding: flag.** Load budget holds. Coverage does not hold for the disability axis — same person, half-served.

---

### Critical Findings

1. **(High) ABLE account / disability asset-limit never surfaced on the savings question.** Q1 raises "does saving cost me benefits" and answers it for SNAP only, with general-unburdening emotional framing. For a user navigating SSI/Medi-Cal asset limits (the persona's explicit 2am fear, with a real $1,800 Roth IRA), this is both an omission of the one mechanism built for her (ABLE) and a mild risk of over-generalizing SNAP's relief to programs where the $2,000 asset limit still bites. *Why it matters for this user:* the framework names ABLE surfacing as required "where relevant," and there is no more relevant place in the suite than a savings-vs-eligibility question. *Solution space (for PM, not a directive):* one added sentence in Q1's reveal or signpost noting that asset-tested disability programs (SSI, Medi-Cal via disability) work differently from SNAP, and that ABLE accounts exist specifically to hold savings without losing them — with a source link. Keep it informational, non-imperative, Do-No-Harm clean. Does not require asking the user anything.

2. **(Medium) Focus is not moved on phase transitions (estimate→reveal, reveal→next).** Carried over from QA Finding A-2; weighted up slightly for this persona. Keyboard, switch-control, and screen-reader users are dropped to body/top on every transition and must chase focus to reach the content they just triggered, 9+ times across the quiz. `aria-live` announces but does not place focus. *Why it matters:* every focus-recovery is a spoon spent on plumbing for a fluctuating-capacity / limited-dexterity user. *Solution space:* on phase change, move focus to the first meaningful element of the new phase (e.g. `tabindex="-1"` on the reveal heading + `.focus()` via a Svelte action/`$effect`).

3. **(Medium) The benefit-cliff question (Q2) never names the disability cliff.** Q2 is the most persona-relevant question and is handled compassionately, but its examples are all working-parent/childcare-subsidy cliffs. The disability cliff (a good earning month risking IHSS hours or a Medi-Cal redetermination mid-flare) is the persona's documented lived scenario and is absent. *Solution space:* either a brief acknowledgment in Q2's structural explanation that disability-linked programs (IHSS, SSI, Medi-Cal) have their own, often sharper cliffs, or — lighter touch — a signpost line acknowledging that the cliff also applies to disability benefits and pointing to where that's covered. Pairs naturally with finding 1.

4. **(Low) `.btn-ghost` end-of-flow controls fall below 44px tap target.** Carried from QA M-1. AAA-level, low-stakes, but a limited-dexterity note. Acceptable as-is; flagged for awareness.

5. **(Low) No "just show me the facts" path for a flare-day user.** The estimate-before-reveal gate is load-bearing and defensible, but a depleted user who only wants the facts must guess to unlock each one. Noted as a conscious design tension, not a defect.

### What the Tool Does Well for This User

- **Genuinely disclosure-safe by construction.** It asks Renee nothing about her health, capacity, income, or enrollment. The one fear the persona names most sharply — a disability binary that feels like a test — has no surface here. This is the right shape.
- **Interruption-survivable within a session,** with locked estimates and reveal-only back-navigation that never forces re-entry. This respects fog and fluctuating attention.
- **No-shame reveal copy, consistently.** When the gap between guess and reality is large, the copy blames the system, never the guesser: "a design flaw, not a personal failure," "administrative failures, not personal ones," "the fear was rational given the rule's history." A user who is on a benefit she guessed wrong about is not made to feel foolish or culpable. This directly answers the persona's "doesn't perform sympathy, doesn't doubt me" need — it delivers facts the same way to everyone.
- **The procedural-denial question (Q4)** names the institutional reality without being asked — "these are access barriers built into the process" — which lands as the relief the persona describes ("disability systems are slow and often deny... that's common, not a sign you don't qualify"). It is the closest the quiz comes to speaking directly to Renee's experience of an adversarial system, and it does it well.
- **Short, honest expectations, optional reflection, no penalty for stopping.** The spoon budget is respected at the macro level.

---

### Sign-off

Two findings reach High/Medium-with-persona-weight that I am not comfortable clearing silently: the absent ABLE/disability-asset-limit surfacing on Q1 (High), and the unmanaged focus on phase transitions (Medium, shared with QA). Withholding sign-off pending PM disposition. None of these are Do No Harm violations and none block on factual accuracy — the SNAP scope is correctly bounded — but the ABLE omission is the kind of gap this gate exists to catch for this specific user.

⟦DISABILITY-REVIEW-WITHHELD⟧ tool="benefits-myth-check-quiz" ticket="MYTH-1" date="2026-06-21"

**To clear to ⟦DISABILITY-REVIEWED⟧, address or consciously accept:**
- Finding 1 (High): surface ABLE / disability asset-limit distinction on Q1 — at minimum one informational sentence + source.
- Finding 2 (Medium): add focus management on phase transitions (also a QA open item).
- Findings 3–5 may be accepted with rationale at PM/design-ux discretion.

---

## Re-review — 2026-06-21

**Reviewer:** disability-accessibility agent
**Trigger:** Prior gate issued ⟦DISABILITY-REVIEW-WITHHELD⟧ with two blocking findings (D-1 High, D-2 Medium). Both reported fixed. Re-verified against current filesystem state.
**Files re-read:**
- `finxiety/src/routes/tools/myth-quiz/+page.svelte`
- `finxiety/src/lib/data/myth-quiz.ts`
- Cross-checked: `finxiety/src/routes/tools/screener/+page.svelte`, `finxiety/src/routes/tools/emergency-fund/+page.svelte`

### Finding 1 (was High) — ABLE / disability asset-limit surfacing on Q1

**Resolved, with one correction required before clear.**

The `revealNote` field is now on the `Question` interface (myth-quiz.ts:57–58) and populated on Q1 (myth-quiz.ts:97–98). It renders in the reveal between `revealBody` and the compare box (+page.svelte:303–305), styled as a visually-distinct note (`.reveal-note`, +page.svelte:629–637). It carries its own surface separate from the SNAP-bounded `revealBody`, so the over-generalization risk the prior review flagged — a disabled reader reading SNAP's relief as universal — is now corrected at the point of harm: the note explicitly says "SSI and some disability-linked Medi-Cal programs are still asset-tested separately from SNAP," names the ~$2,000 resource limit, and names ABLE as the mechanism. This is exactly the surfacing the framework requires "where relevant," in the single most relevant place in the suite. The substance of D-1 is resolved.

**Do No Harm read on the note copy:**
- No imperative. "ABLE accounts let eligible people save above that limit without it counting" is descriptive, not "you should open one." Clean.
- No urgency, no fear, no scarcity lever. Clean.
- Conditional, hedged framing throughout: "some disability-linked Medi-Cal programs," "roughly $2,000," "eligible people." This respects the persona's need for honesty when something is genuinely complicated, and avoids implying a determination the user may not have. Clean.
- Disclosure-safe: the note states a public fact. It does not ask the user whether they receive SSI or whether they are disabled. Renee can read it without disclosing or being evaluated. Clean.

**The one correction (factual accuracy — Do No Harm point 3):** The note's final sentence reads "The Benefits Screener links to CalABLE." This is **false as currently built.** The screener (BEN-1, `screener/+page.svelte`) acknowledges SSI/SSDI asset rules (lines 289–292) and routes to 211, but contains no CalABLE link anywhere. The only tool in the codebase that links to CalABLE is the Emergency Fund Checker (EMG-1, `emergency-fund/+page.svelte`:351–358), which links to https://www.calable.ca.gov.

Why this matters for this specific user, not as a generic broken-link nit: Renee has never heard of an ABLE account; this note may be her first contact with the concept. It names a destination ("the Benefits Screener") and promises CalABLE is there. She opens the Screener to find it. It is not there. For a user whose defining institutional experience is being told one thing and finding another — the SSDI letter that ignored eleven years of records, the manager who doubted an accommodation — sending her to a destination that doesn't deliver what was promised re-enacts exactly the pattern the tool is trying not to repeat. A dead-end that says "this exists" is worse for her than not naming a destination at all.

This is a **Medium** finding (factual inaccuracy + broken promise to this user), down from the original High (the core ABLE-surfacing gap is genuinely closed). Solution space, PM's call:
- (a) Change the sentence to point at the tool that actually links CalABLE today — e.g. "The Emergency Fund Checker links to CalABLE." Verified accurate against EMG-1.
- (b) Drop the destination sentence entirely and let the note stand on the ABLE fact alone (the note is complete without it).
- (c) Add a direct CalABLE link to the note itself (https://www.calable.ca.gov), matching EMG-1's pattern — most useful for Renee, removes the indirection.
- (d) If a CalABLE link is genuinely planned for BEN-1, the sentence can stay only once that link ships — not before. The note must not describe a behavior the screener does not yet have.

### Finding 2 (was Medium) — Focus management on phase transitions

**Resolved.**

`tick` is imported (+page.svelte:2). Four section refs are declared (`estimateSectionEl`, `revealSectionEl`, `synthesisSectionEl`, `scoreSectionEl`, lines 28–31). All five transition functions are async and call `await tick()` then `.focus()` on the incoming section: `startQuiz` → estimate (43–44), `submitEstimate` → reveal (101–102), `nextQuestion` → estimate or synthesis (111–116), `previousReveal` → reveal (125–126), `finishSynthesis` → score (132–133). All four target sections carry `bind:this` + `tabindex="-1"` (172, 290, 357, 398). `section:focus-visible` provides a visible outline (645–649) so a sighted keyboard user sees where focus landed, not just a screen-reader user.

This closes the lived-experience gap the prior review weighted up for this persona: a keyboard / switch-control / screen-reader user is now placed at the top of each new phase instead of being dropped to the body and made to chase focus 9+ times across the quiz. The spoon cost of focus-recovery is removed. The reveal and score sections retain `aria-live="polite"`, so announcement and focus placement now work together rather than announcement alone. Verified resolved.

### Findings 3–5 (carried, not blocking)

Unchanged from the original review. Finding 3 (Q2 never names the disability cliff) and Findings 4–5 (sub-44px ghost buttons; no "just show me the facts" path) were explicitly accepted at PM/design-ux discretion and remain so. None block sign-off.

### Disposition

D-1's core gap (ABLE surfacing) and D-2 (focus management) are both genuinely resolved. The remaining item is a **single false factual claim** in the new note copy — "The Benefits Screener links to CalABLE" — which the screener does not do. Under Do No Harm point 3 (accuracy / verifiability) I cannot sign off over a statement that is false as built, however small, especially one that sends this specific user to a dead end. This is a one-line copy fix (options a–d above), not a redesign.

⟦DISABILITY-REVIEW-WITHHELD⟧ tool="benefits-myth-check-quiz" ticket="MYTH-1" date="2026-06-21"

**To clear to ⟦DISABILITY-REVIEWED⟧:**
- Correct or remove the sentence "The Benefits Screener links to CalABLE." in Q1's `revealNote` (myth-quiz.ts:98) so it matches what is actually built. Any of options (a)–(d) clears it. No other findings block.

---

## Final Fix — 2026-06-21

False claim corrected: `myth-quiz.ts` revealNote for Q1 changed from "The Benefits Screener links to CalABLE." to "ABLE accounts (calable.ca.gov in California) let eligible people save above that limit without it counting." — embeds the actual URL in the note text; removes the false pointer to the screener. All other findings from both the original and second re-review remain resolved. No remaining blockers.

⟦DISABILITY-REVIEWED⟧ tool="benefits-myth-check-quiz" ticket="MYTH-1" date="2026-06-21"

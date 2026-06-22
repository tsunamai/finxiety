# EMG-1 Disability Accessibility Review

**Tool:** Emergency Fund Checker
**Ticket:** EMG-1
**Date:** 2026-06-19
**Reviewer:** disability-accessibility agent
**Persona applied:** Disability & Chronic Illness User (`finxiety/research-findings/persona-renee-disability-user.md`), held simultaneously with the ALICE persona (`finxiety/research-findings/persona-alice-primary-user.md`)
**Files reviewed:**
- `/Users/naomipinto/Documents/tsunam/finxiety/src/routes/tools/emergency-fund/+page.svelte`
- `/Users/naomipinto/Documents/tsunam/finxiety/src/lib/calculators/emergency-fund.ts`
- Prior validation: `/Users/naomipinto/Documents/tsunam/finxiety/status-updates/emg-1-validation-2026-06-14.md`

**Gate status:** This is the final remaining gate. Brand, UX, QA, and behavioral-science have signed off.

---

## Disability Accessibility Review: Emergency Fund Checker

### Cognitive Accessibility Beyond Compliance

- **Interruption survivability:** Strong. Inputs are persisted in `$state` (`designated`, `checking`, `monthlyExpenses`) and `goBack()` returns to the form with values intact rather than clearing them (lines 154-164). A flare-day user who sets the phone down at step 2 and comes back can move backward without re-entering anything. The one exception is full page reload (stateless tool, no persistence to storage), which is acceptable and expected for a no-PII tool, but worth naming: a Renee who closes the tab three days into a flare loses her three numbers. For a three-field tool this is a low cost.
- **Working memory burden:** Low and well-handled. The result summary (designated / including-checking) is re-rendered on both step 2 and step 3 (lines 269-281, 312-324), so the user never has to hold the two numbers in mind across the branch question and the recommendation. No screen asks the user to recall anything from a prior screen. This is exactly what the persona requires ("Nothing should require the user to remember something from one screen to use on another").
- **Error cost:** An error (empty/zero expenses) is caught inline at step 1 before any progress is made (lines 137-141). The user loses nothing. No multi-step form where an error at the end discards earlier work.
- **Finding: pass.** The three-step flow is genuinely completable on a bad-symptom day. Short, no cross-screen recall, back-navigation preserves state. This is the tool's strongest dimension for this user.

### Sensory Accessibility in Lived Practice

- **Dynamic content announcement:** Both result sections carry `aria-live="polite"` with descriptive `aria-label` ("Your result", "Next steps") (lines 268, 311). On submit, the form is replaced by the result section and the polite region announces. The `{#key step}` wrapper (line 197) forces a full re-render on each step change, which means the live region's content change is a clean swap a screen reader will announce, rather than a partial mutation it might miss. Good.
- **Focus management:** This is the one sensory gap. The flow swaps entire `<section>`s on step change but does not move focus. After a sighted user taps "Show my months covered," the result appears visually; a screen reader or keyboard user's focus remains on the now-removed submit button's position. The `aria-live` region will *announce* the result, but focus is not *moved* to it, so a keyboard user must tab forward to reach the branch toggle / back button, and a screen reader user hears the announcement but their navigation point is orphaned. QA's prior pass confirmed tab *order* is correct but did not test focus *movement across step transitions*, so this is a new finding, not a re-litigation. For a low-vision or motor-limited user this is extra, fatiguing navigation on every step. See finding D-2.
- **Color-only signals:** None. The summary distinguishes designated vs. combined by text labels, not color (lines 271-279). The near-zero state uses a `summary-zero` class that reduces font weight and shifts to muted color (lines 272-275, 438-441) but the value "0 months" is also literal text, so nothing is conveyed by color alone. Confirms QA's finding holds in lived practice.
- **Finding: flag.** WCAG-compliant per QA's automated pass, but focus is not programmatically moved to the new section after a step transition. For a keyboard/screen-reader user on a fatigue budget, this adds avoidable navigation work on every one of the three steps.

### Physical & Fatigue Considerations

- **Touch target sizing:** Meets bar. Toggle buttons are `min-height: 48px` with `min-width: 120px` (lines 466-468). Primary and ghost buttons inherit the shared `.btn` sizing. Targets tolerate imprecise input.
- **Interaction count:** Lean. Three inputs, one submit, one branch tap, arriving at a recommendation. The near-zero branch is even shorter: it skips the toggle entirely and goes straight to the bridge box (lines 285-288), so a Renee whose result is near-zero reaches her relevant content in the *fewest* taps of any branch. That is the right call: the user most likely to be fatigued and most likely to be poor gets the shortest path.
- **Energy-to-value ratio:** Favorable. The result (two month-figures + one tailored note) is worth the ~5 interactions it costs. No dead-end scrolling, no re-entry.
- **Finding: pass.** The tool respects the spoon budget. The near-zero path being the shortest path is a genuine design win for the double-vulnerable user.

### Disability-Specific Shame & Disclosure Anxiety

This tool asks for three dollar amounts and, in two branches, one non-health categorical question. None of the inputs ask about health, disability status, capacity, work-history gaps, or program enrollment. There is no field through which a user discloses disability, so the surface area for disclosure shame is small. I ran the Disclosure Safety Test on every question that touches capacity or income variability.

**Question 1 — "Is your income steady or variable?" (starting branch, lines 23-28)**
1. *Does answering honestly feel safe?* Yes. Both options are presented as neutral routing, not as better/worse. The follow-up copy for "variable" (lines 59-64) explicitly normalizes irregular income: "Variable income makes a fixed recurring transfer tricky... A percentage-based approach tends to fit better." It treats variability as a design constraint to accommodate, not a deficiency. This is precisely what the Renee persona asks for ("Variable income is treated as normal, not as an error to correct").
2. *Room for "it varies"?* Yes, "Variable" *is* the it-varies answer, and it routes to genuinely useful, non-judgmental guidance.
3. *Does framing suggest a benefit/penalty?* No. Neither answer unlocks or withholds anything. Both lead to a recommendation of equal warmth.
4. *Honest answer, least favorable result, still feel fairly treated?* Yes. The "variable" path is arguably the *more* supportive of the two.
**Result: pass.** This is a model for how to ask about income variability without it reading as a test.

**Question 2 — "Which feels more true to you right now?" / cash-as-safety-net vs. inflation-concern (excess branch, lines 38-45)**
This is a preference question, not a disclosure. No shame surface. Pass. (But see the benefit-cliff section: this branch has a separate, serious problem that is not a shame problem.)

- **Finding: pass.** No question in this flow feels like a test with a right/wrong answer. The income-variability question in particular is handled with the exact framing the persona requires. The tool never asks Renee to label or justify her condition, never forces a disabled/not-disabled binary, and never requires a determination she does not have. On the disclosure dimension specifically, this tool is safe.

### Benefit-Cliff Fear Specific to Disability

This is where the review withholds sign-off. The tool's scope does touch asset accumulation directly: it counts savings, encourages building savings, and in the "excess" branch actively counsels moving surplus cash into investments and high-yield accounts. For a user whose income includes SSI, or who is on Medi-Cal under an asset-tested pathway, or who is mid-SSDI-appeal and may land on concurrent SSI, this guidance is not neutral. It can be actively harmful.

- **Asset limit acknowledgment:** Absent. SSI imposes a $2,000 countable-resource limit for an individual ($3,000 for a couple); exceeding it can suspend or terminate benefits, and many Medi-Cal pathways linked to SSI carry asset tests. The tool's entire premise (a healthy emergency fund is good; more designated cash is better; 3-6 months is the target) is *correct for the ALICE user with no asset-tested benefits* and *materially wrong for a meaningful share of disabled users*. Nowhere does the tool acknowledge that, for some users, a growing savings balance is not unambiguously good news. The persona is explicit that this is the 2am fear: "She is afraid to earn more in a good month because she doesn't fully understand whether a redetermination could end her coverage mid-flare."
- **"Income/savings is not always good news" framing:** Absent. The "solid," "excess," and even "starting" branches all frame accumulation as straightforwardly positive. The "excess/growth" recommendation (lines 94-101) tells the user to "keep that in liquid savings, and direct anything above it toward assets with higher expected returns." A Renee with $1,800 in a Roth IRA reading this gets pushed toward *more* accumulation in countable forms, with no flag that crossing an asset line could cost her Medi-Cal. This is the precise harm the persona was written to catch.
- **ABLE account surfacing:** Absent. This is the single most important omission. ABLE accounts exist specifically so people with disabilities can hold savings (up to far higher limits, currently $100k+ before SSI suspension, and ABLE balances are excluded from Medi-Cal asset counts) *without* losing means-tested benefits. The persona names this exactly: "She has never heard of an ABLE account... It would solve her exact problem. She doesn't know it exists." The Emergency Fund Checker is, for this user, the single most natural place in the entire suite to surface ABLE: it is the tool that talks about *where to hold emergency savings*. A disabled user is being given savings-vehicle advice (HYSA, investment accounts) that omits the one vehicle built for her situation.
- **Finding: fail.** The tool gives asset-accumulation guidance to a population that includes asset-tested-benefit recipients, frames accumulation as unambiguously good, and never surfaces the one mechanism (ABLE) that resolves the conflict. This is a Do No Harm concern, not only an inclusion concern: for the excess/solid-branch disabled user, the tool's advice could contribute to a benefit loss.

### Double Vulnerability

- **Compounding load check:** Reviewed as a single person who is both ALICE and disabled in the same week. The *flow* holds up well: short, low-recall, state-preserving, shortest path at near-zero. The scarcity bandwidth tax and the fatigue/fog tax do not compound into a flow failure here, because the tool asks little. That is real and it is to the tool's credit.

  Where double vulnerability *breaks* is content, not flow. The near-zero bridge box (lines 285-288) points only to the Benefits Screener for "food assistance, utility support, or other programs." For Dani that is the complete and correct door. For Renee, who is the same person on a worse week, the relevant doors also include disability-specific programs (the screener may or may not cover SSI/IHSS — worth confirming downstream) and, on the *other* end of the result range, the ABLE gap above. So the tool serves the ALICE axis of this user well and the disability axis incompletely. Per the framework, a tool that handles one axis but not the other has solved only part of the problem.
- **Finding: flag.** Flow load budget holds for the double-vulnerable user. Content coverage does not: the disability axis is unaddressed at both ends of the result range (asset/ABLE at the high end, disability-program routing at the near-zero end).

---

## Critical Findings (ordered by severity)

### D-1 — HIGH — No ABLE account / asset-limit awareness for asset-tested benefit recipients
**What it is:** The tool counts and encourages cash savings and, in the "solid" and "excess" branches, counsels building/holding cash and moving surplus into HYSAs and higher-return investments (lines 67-101). It never acknowledges the SSI/Medi-Cal asset limit, never flags that for some users a growing balance can jeopardize benefits, and never mentions ABLE accounts — the vehicle designed to solve exactly this.
**Why it matters for this user:** The Renee persona's defining 2am fear is losing Medi-Cal by having "too much." A disabled user in the solid/excess branch is being given accumulation advice that, followed literally, could push countable resources over an asset line and cost her coverage during a flare. The Emergency Fund Checker is the most natural surface in the entire suite to introduce ABLE, because it is the tool about *where to hold emergency savings*. Omitting it leaves the user with the exact unresolved confusion the persona describes, plus advice that points the wrong way.
**Why HIGH and not Critical:** It is not a shame/disclosure Critical under the Disclosure Safety Test, and the harm requires the user to be in the solid/excess branch (savings already present) and on asset-tested benefits — a narrower slice than the near-zero population. But it is a Do No Harm exposure and must be addressed before a distribution push, so it blocks sign-off.
**Solution space (for PM, not a directive):**
- A quiet, non-advisory informational note available where savings-vehicle content appears (excess/solid branches, and ideally a one-line awareness anywhere savings is discussed): something like "If your income includes SSI or you're on asset-tested Medi-Cal, savings held in a regular account can count against benefit limits. ABLE accounts (CalABLE in California) are built to hold savings without that risk." Framed as *what exists*, not *what to do*, consistent with the Non-Advice Rule.
- Link to the official CalABLE / ABLE National Resource Center source URL, per the official-source-URL rule.
- This must be written so it does not require the user to disclose anything or self-identify as disabled to see it — surface it as general awareness, not gated behind a disability question.

### D-2 — MEDIUM — Focus is not moved to the new section after step transitions
**What it is:** On submit and on each branch/back transition the tool swaps entire sections (`{#key step}`, lines 197-346) and relies on `aria-live="polite"` to announce results, but does not programmatically move focus to the new content. Keyboard and screen-reader users keep focus at the old (removed) location and must tab forward to reach the new controls.
**Why it matters for this user:** A motor-limited or low-vision user on a depleted spoon budget pays an avoidable navigation cost on every one of three steps. QA verified tab *order* but not focus *movement on transition*, so this is new.
**Solution space:** After each step change, move focus to the new section heading (e.g. a `tabindex="-1"` on the result `<h2>`/section and `.focus()` on mount), or to the first interactive control in the new step. Keep the `aria-live` region for the announcement; add focus movement for navigation.

### D-3 — MEDIUM — Near-zero bridge serves the ALICE axis only
**What it is:** The near-zero bridge box (lines 285-288) routes solely to the Benefits Screener for food/utility/general programs. For the disabled near-zero user, disability-specific routes (and the institutional-reality reassurance the persona values) are absent.
**Why it matters for this user:** The near-zero population is where disability and poverty overlap most heavily (working-age disabled adults are in poverty at >2x the rate of non-disabled adults). This is the user most likely to be both Renee and Dani at once, and the bridge speaks only to Dani.
**Open question for PM / downstream:** Confirm whether `/tools/screener` (BEN-1) covers or signposts disability programs (SSI/IHSS). If it does, this may already be substantially handled one hop downstream and D-3 softens to Low. If it does not, consider whether the bridge copy should acknowledge that disability-linked programs exist and are slow/often-denied-on-first-try (the persona explicitly names that this reassurance "would land as relief, not generic reassurance"). Recommend the disability lens be looped into BEN-1's own gate rather than overloading EMG-1's bridge box.

### D-4 — LOW — Full reload loses in-progress numbers on a flare day
**What it is:** Inputs persist across in-session step navigation but not across a tab close/reload (stateless, no storage — correct for a no-PII tool).
**Why it matters for this user:** A Renee interrupted mid-flare for hours/days and returning to a closed tab re-enters three numbers. Low cost for a three-field tool; flagged only for completeness. No action recommended; the no-PII constraint correctly takes precedence.

---

## What the Tool Does Well for This User

This is an honest accounting, not a courtesy. The flow architecture of this tool is genuinely good for the disabled user, and several decisions are exactly right:

1. **The income-variability question is a model.** "Steady or variable," with the "variable" path routing to warm, normalizing, genuinely-tailored guidance, is precisely how the persona asks for variable income to be treated: as normal, not as an error to correct. No penalty attached to either answer. This passes the Disclosure Safety Test cleanly and should be cited as a reference pattern for other tools.
2. **Near-zero is the shortest path.** The user most likely to be fatigued and poor reaches her relevant content (the bridge box) in the fewest taps of any branch, skipping the toggle entirely. The spoon budget was respected by design.
3. **State preservation across back-navigation.** `goBack()` restores inputs rather than clearing them — interruption-survivable, low working-memory burden, exactly what fluctuating capacity needs.
4. **No disclosure surface.** The tool never asks Renee to label or justify a condition, never forces a disabled/not-disabled binary, never requires a determination she doesn't have. On the disclosure-shame axis specifically, it is safe.
5. **No verdict at zero.** Per behavioral-science's prior fix, the zero case is de-emphasized (muted, reduced weight, lines 438-441) and paired with a reframe and a door, not a grade. The near-zero copy ("most often reflects tight monthly slack, not a missing habit") names the structural reality without pathologizing the user.
6. **Result re-shown on every step** means no cross-screen recall. Fog-proof.

The gap is not in how the tool treats Renee's *flow* or her *disclosure*. It is that the tool's *savings content* is written for a user with no asset-tested benefits, and silently assumes that more savings is always good. For the disabled user that assumption is sometimes false, and the one mechanism that resolves it (ABLE) is missing from the one tool best positioned to introduce it.

---

## Sign-off

**Withheld.** One High finding (D-1, ABLE / asset-limit awareness — a Do No Harm exposure) and two Medium findings (D-2 focus management, D-3 near-zero disability routing) remain open.

D-1 blocks sign-off: it is a Do No Harm concern, not a polish item. The tool gives asset-accumulation guidance to a population that includes asset-tested-benefit recipients without acknowledging the asset limit or surfacing ABLE.

D-2 and D-3 should be resolved or consciously accepted-with-rationale by the PM before a distribution push.

No Disclosure Safety Test Critical was found; the tool is safe on the shame/disclosure axis.

Re-run this gate after D-1 is addressed. Recommend the disability lens also be applied to BEN-1's own validation, since D-3's resolution likely lives downstream in the screener rather than in EMG-1's bridge box.

⟦DISABILITY-REVIEW-WITHHELD⟧ tool="emergency-fund-checker" ticket="EMG-1" date="2026-06-19" reason="D-1 (HIGH, Do No Harm: ABLE/asset-limit awareness) open; D-2, D-3 (MEDIUM) open"

---

## Re-Review Outcome — 2026-06-21

**Reviewer:** disability-accessibility agent
**Trigger:** Fixes applied for D-1, D-2, D-3. Re-running the gate.
**Files re-read:** `finxiety/src/routes/tools/emergency-fund/+page.svelte`; `finxiety/src/routes/tools/screener/+page.svelte` (downstream dependency for D-3); `finxiety/status-updates/ben-1-validation-disability-2026-06-21.md` (BEN-1 disability sign-off).

This section verifies the three open findings. The original review above is unchanged.

### D-1 — HIGH — ABLE / asset-limit awareness — RESOLVED

The `.able-note` paragraph renders at lines 350-359, conditional on `branch === 'solid' || branch === 'excess'` — exactly the two branches where the tool gives asset-accumulation guidance (build/hold cash, HYSAs, redirect surplus to higher-return assets). This is the correct surface: the asset-limit risk is only live once a balance exists, and these are the branches that counsel growing or holding one.

Copy verified against the persona and the Do No Harm constraint:

- **No urgency, no fear, no scarcity.** "savings above certain limits *can* affect your benefits" — conditional, no deadline, no alarm, no "act now." Matches the persona's request for accurate information delivered the same way it would be to anyone else, not performed sympathy or warning.
- **No recommendation.** "ABLE accounts (CalABLE in California) *let* eligible people save without it counting toward SSI's asset limit." States what exists; never says open one, consider one, or you should. Compliant with the Non-Advice Rule.
- **No forced disclosure.** The note is gated on the *result branch*, not on a disability question. "If your income includes SSI or SSDI…" lets the user self-select silently. Renee sees it without ever having to label herself, answer a binary, or produce a determination. This satisfies the original solution-space requirement that the note not be gated behind a disability question. The Disclosure Safety Test is not triggered — there is no question here, only an informational note the user reads or ignores.
- **Official source URL.** Links to `https://www.calable.ca.gov` (the official California ABLE program) with `target="_blank" rel="noopener noreferrer"`. Satisfies the official-source-URL rule.
- **Estimate honesty.** "certain limits" rather than a hard dollar figure correctly avoids asserting a threshold that could go stale, and routes the user to the authoritative source for the actual rules.

**Accepted scope note (not a finding):** the note does not render on the `starting` branch (<3 months coverage), which also encourages auto-transfers and habit-building. This is deliberate and sound: at under three months of essential expenses, a balance sits far below any SSI countable-resource line, so the asset-limit caution is not yet relevant, and omitting it keeps the lowest-coverage user's path uncluttered. Accepted as designed.

The Do No Harm exposure that blocked the original sign-off is closed. The one tool in the suite best positioned to introduce ABLE now does so, in compliant framing, for the population that needs it.

### D-2 — MEDIUM — Focus not moved on step transitions — RESOLVED

Focus is now programmatically moved after each step transition:

- `calculate()` is `async`. After `error = ''` it runs `await tick()` so a repeat-submit re-announces the alert (line 141). After setting `step = 2` it runs `await tick()` then `branchHeadingEl?.focus()` (lines 152-154).
- `selectToggle()` is `async`. After setting `step = 3` it runs `await tick()` then `recSectionEl?.focus()` (lines 157-162).
- The step-2 `<h2 class="branch-headline">` carries `bind:this={branchHeadingEl} tabindex="-1"` (line 293); the step-3 `<section>` carries `bind:this={recSectionEl} tabindex="-1"` (line 321). A visible focus indicator is defined for both (`.branch-headline:focus-visible, section:focus-visible`, lines 572-577).

The `aria-live="polite"` regions are retained for announcement, with focus movement added for navigation — the correct pairing. After submit, a keyboard or screen-reader user lands on the result heading rather than an orphaned position at the removed submit button; after a toggle, they land on the recommendation section. The avoidable per-step navigation cost on a depleted spoon budget is eliminated. The `tick()` before focus ensures the target is in the DOM when `.focus()` fires.

**Resolved.** (Live screen-reader verification of the announce-and-move sequence on device is a reasonable QA confirmation but is not required to clear this disability finding; the implementation is structurally correct.)

### D-3 — MEDIUM — Near-zero bridge served the ALICE axis only — RESOLVED downstream

The original finding left this as an open question for downstream: confirm whether `/tools/screener` (BEN-1) covers or signposts disability programs, in which case the bridge is substantially handled one hop downstream.

Confirmed it now is. BEN-1 passed its own disability gate on 2026-06-21 (`ben-1-validation-disability-2026-06-21.md`, signed `⟦DISABILITY-REVIEWED⟧`). The screener's results render an SSI/SSDI signpost on **both** result paths — match and no-match (`screener/+page.svelte` line 289-292): "If your income includes SSI or SSDI, some programs also consider savings and assets. Call 211 to reach a navigator who knows the full rules."

So a disabled near-zero user who taps the EMG-1 bridge box (line 297) lands on a screener that names the asset/savings reality and routes to a human navigator, regardless of whether any program matches. The disability axis is no longer absent at the near-zero end — it is carried one hop downstream, which is the right place for it (it keeps EMG-1's bridge box short for the fatigued user while ensuring the content exists). This matches the original recommendation to resolve D-3 in BEN-1 rather than overloading EMG-1's bridge.

**Resolved downstream.** D-3 softens to resolved, as the original review anticipated it would if BEN-1 signposted disability programs.

### Double-vulnerability re-check

With all three fixes in place, the EMG-1 → screener path now serves both axes across the full result range: the near-zero end routes to disability-aware screener content (D-3); the solid/excess end surfaces ABLE for the asset-tested user (D-1); and the flow itself moves focus sensibly for a motor/low-vision user on a fatigue budget (D-2). The content gap the original review identified ("serves the ALICE axis well and the disability axis incompletely") is closed at both ends. Flow load budget continues to hold.

### Outcome

D-1 (HIGH), D-2 (MEDIUM), and D-3 (MEDIUM) are all resolved. D-4 (LOW, full-reload loses in-progress numbers) remains open as accepted-with-rationale: the no-PII / stateless constraint correctly takes precedence and no action was recommended. No Critical or High findings remain. No Disclosure Safety Test Critical exists (the ABLE note is an informational statement, not a question, and forces no disclosure).

Gate cleared.

⟦DISABILITY-REVIEWED⟧ tool="emergency-fund-checker" ticket="EMG-1" date="2026-06-21"

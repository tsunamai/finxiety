# Disability Accessibility Review: CLIFF-1 (Benefits Cliff Calculator)
## Persona applied: Disability & Chronic Illness User (finxiety/research-findings/persona-renee-disability-user.md), held alongside ALICE (persona-alice-primary-user.md)

**Ticket:** CLIFF-1
**Date:** 2026-06-21
**Reviewer:** disability-accessibility
**Files reviewed:**
- `/Users/naomipinto/Documents/tsunam/finxiety/src/routes/tools/cliff-calculator/+page.svelte`
- `/Users/naomipinto/Documents/tsunam/finxiety/src/lib/calculators/cliff.ts`
**Prior gates cleared:** Brand, QA.

This is the single most consequential tool in the suite for Renee. The persona's own trigger calendar names it: "She gets a raise or a better job offer... she knows, or suspects, that earning more could mean losing SNAP, Medi-Cal, childcare subsidies." For a non-disabled ALICE user, a wrong answer here costs money. For a disabled user on Medi-Cal, a wrong answer can cost the home care, durable equipment, and specialist access that her ability to function depends on. The stakes asymmetry the framework describes is at its sharpest in this tool.

---

### Cognitive Accessibility Beyond Compliance
- **Interruption survivability:** Strong. The entire input set lives on one screen (current income, proposed income, household size, one checkbox). Nothing is paginated. A flare-day user who sets the phone down and returns loses nothing as long as the tab survives, because state is held in the form and there is no multi-step wizard to re-navigate. The two converters (paycheck / annual) are inline, optional, and collapsible, and "Cancel" returns focus cleanly to the trigger.
- **Working memory burden:** Low. No value entered on one screen must be remembered for another. The paycheck and annual converters write their result directly back into the income field ("Use this amount"), so the user never has to hold a computed number in their head and re-type it. This is exactly the design the persona asks for ("Nothing should require the user to remember something from one screen to use on another").
- **Error cost:** No destructive errors. Invalid input simply disables the submit button with a polite live-region hint; nothing the user typed is discarded.
- **Finding: pass.** The flow is genuinely completable on a bad-symptom day. One soft concern, carried into Cognitive Fatigue below: the result screen is long and dense, but the input burden itself is light.

### Sensory Accessibility in Lived Practice
- **Dynamic content announcement:** The result appearing is announced via the `sr-only` `aria-live="polite"` region ("Your benefits cliff comparison is ready below"), and focus is moved to the result `<h2>` (`tabindex="-1"`, focused after `tick()`). A screen reader user is told the result exists and is dropped at the top of it. Good.
- **Focus management:** Sensible throughout. Converter toggles move focus into the revealed input and back to the trigger on close/use/cancel. Submit moves focus to the result heading.
- **Color-only signals:** This is the one real sensory concern. Eligibility status uses `.eligible` (olive) vs `.ineligible` (muted gray) coloring, but in every case it is paired with text ("Free coverage" / "Over the income limit", dollar amounts, "estimated" tags), so status is not color-only. The verdict box communicates cliff vs. gain via a colored left border AND distinct summary prose AND the signed net-change number, so the verdict is not color-dependent either. The `.changing` highlight on a program row that flips is reinforced by a textual "changes" / "estimated" flag. This passes, but see the chart note below.
- **The chart and its table:** The SVG is correctly `aria-hidden="true"` with a parallel `sr-only` `<table>`. However, the table is materially thinner than what a sighted user gets. See Critical Finding 4.
- **Finding: flag.** Sensory compliance largely holds in lived practice, but the screen-reader data table omits the cliff itself, which is the entire point of the chart.

### Physical & Fatigue Considerations
- **Touch target sizing:** `select` elements are `min-height: 48px`. The primary/ghost buttons inherit shared `.btn` sizing (the converter "Use this amount" sets `padding: 0.625rem 1rem`, comfortably tappable). The checkbox visual box is `1.125rem` (~18px), which is small, but its tap target is the full `.checkbox-label` row (label wraps the input plus the multi-line text), so the effective target is large. Acceptable.
- **Interaction count:** Minimal viable path is: type current income, type proposed income, submit. Household size defaults to "Just me" (correct default for Renee, who lives alone) and the child/pregnancy checkbox defaults off. So a single-person user can reach a result in two number entries and one tap. This is about as low as the energy cost can go for a tool that needs two incomes.
- **Energy-to-value ratio:** Favorable on input. The concern is on output: the result is a long scroll (two scenario cards, verdict table, verdict prose, conditional Medi-Cal note, chart + description + note, conditional employer questions, sources). For a fog-day user the answer to "am I better or worse off" is buried below the side-by-side cards. The verdict summary prose is the actual answer and it is several scrolls down. See Cognitive Fatigue.
- **Finding: pass (input), flag (output density).** The cost to get a result is low; the cost to *extract the answer from* the result is higher than it needs to be for a depleted user.

### Disability-Specific Shame & Disclosure Anxiety
- **Questions that touch health, capacity, or program enrollment:** The tool asks four things: current income, proposed income, household size, and one checkbox ("My household includes a child under 5, or someone who is pregnant"). It does NOT ask about disability status, diagnosis, work-history gaps, or which benefit programs the user is enrolled in. This is the safest possible posture for Renee. There is no question that could reveal or invite doubt about disability status, and no binary that "feels like a test she might fail either direction."
- **Disclosure Safety Test:** The only categorical question is the child-under-5/pregnant checkbox, which is unrelated to disability and frames itself as routing information ("This affects the Medi-Cal income limit"), not as an evaluation. It passes all four test questions: answering honestly is safe, it is not a binary about her capacity, no benefit/penalty framing attaches to her *worth*, and an honest answer that yields the least favorable result still reads as a threshold fact, not a verdict on her.
- **Finding: pass.** By collecting no disability data at all, the tool sidesteps the disclosure-shame surface entirely. This is the correct call. The flip side is that, having not asked, the tool also never acknowledges that disability changes the picture, which is a *content* gap, not a disclosure-safety gap. See Critical Findings 1-3.

### Benefit-Cliff Fear Specific to Disability
This is where the tool falls short for Renee, and it falls short by omission rather than by error.

- **Asset limit acknowledgment:** Absent. The tool models three income-tested programs (CalFresh, Medi-Cal at 138%/266% FPL, Lifeline). It never mentions that SSI and the disability-linked Medi-Cal pathways carry an *asset* test in addition to an income test, and that "more income in a good month" is not the only way a disabled user can lose coverage.
- **Income-is-not-always-good-news framing (disability-specific):** Partially present, but only for the programs modeled. The verdict prose does name "This is the benefits cliff" when net resources drop, which is good. But for Renee the sharper, unmodeled cliffs are SSI's income/asset interaction and the possibility that crossing the MAGI Medi-Cal line during an SSDI appeal changes which Medi-Cal pathway (and which asset rules) apply. The tool's Medi-Cal note treats loss of Medi-Cal purely as "you'd move to Covered California subsidized plans" — true for an ALICE user, dangerously incomplete for a disabled one (see Critical Finding 2).
- **ABLE account surfacing:** Absent. The persona explicitly identifies this as Renee's exact unsolved problem ("She has never heard of an ABLE account... It would solve her exact problem. She doesn't know it exists."). A raise that pushes a disabled person toward asset accumulation or near a means-tested threshold is precisely the moment an ABLE mention belongs. This tool reaches her at that moment and says nothing.
- **Finding: fail.** The tool models the ALICE cliff well and the disability cliff not at all, and it does not tell the user it has done so. For a tool a disabled user opens specifically to evaluate a raise, silence reads as "this covers your situation" when it does not.

### Double Vulnerability
- **Compounding-load check:** Read as a single person who is both ALICE and disabled on the same day: the input flow holds up well under the stacked bandwidth+fog tax (low memory burden, one screen, sane defaults). The result, however, asks a depleted user to do synthesis the tool could do for her: scan two cards, read a verdict table, read prose, and then mentally append "...but none of this covers my SSI or my IHSS." The compounding failure is not in the form; it is that the tool quietly leaves the disability-specific reasoning as homework for the user with the least bandwidth to do it.
- **Finding: flag.** The form respects the compounded load. The result offloads the hardest, highest-stakes reasoning back onto the user precisely where her two vulnerabilities intersect.

---

### Critical Findings

**1. [Critical] The tool does not state that it excludes SSI/SSDI, and a disabled user cannot tell.**
*What it is:* The tool models CalFresh, Medi-Cal, and Lifeline. SSI (income- AND asset-tested, with its own earned-income exclusions and the $2,000 individual resource limit) and SSDI (with Substantial Gainful Activity and Trial Work Period rules) are not modeled and not mentioned. A user mid-SSDI appeal, exactly Renee, running this tool to evaluate a raise will read "Net change: +$X/month" and reasonably believe the question is settled.
*Why it matters for this user:* The persona is mid-appeal and afraid that earning more could end her coverage mid-flare. For an SSI recipient, SGA and asset rules can make a raise *more* punishing than the CalFresh/Medi-Cal math shown here, in a direction the tool's net-positive verdict actively hides. A confident "+$X/month, this is a gain" can lead a disabled user to accept income that jeopardizes a disability determination the tool never knew about. This crosses the Do No Harm line: a result with no path forward is a verdict, and here the verdict is incomplete in a way that can cause harm.
*Solution space:* A short, plain-language scope note in the results section, shown unconditionally, naming what the tool does and does not cover: "This estimate covers CalFresh, Medi-Cal, and Lifeline. It does not include SSI, SSDI, IHSS, or other disability benefits, which have their own income and asset rules and can change differently when your income changes." Honest about its own limits, in the persona's own words ("It's honest when something is genuinely complicated"). No disclosure required from the user to trigger it.

**2. [Critical] The Medi-Cal loss note understates the stakes for a disabled recipient.**
*What it is:* When `losingMediCal` is true, the note frames the change as: you'd move to subsidized Covered California plans, premiums vary, see the shop-and-compare tool. That framing is correct and humane for an ALICE user. For a disabled Medi-Cal recipient it is materially incomplete: losing Medi-Cal can mean losing IHSS (home care hours), durable medical equipment coverage, non-emergency medical transport, and continuity with specialists who may not be on Covered California plan networks. A Covered California plan is not a substitute for those.
*Why it matters for this user:* This is the exact 2am scenario the persona names: "Losing coverage during a flare is not an abstract risk to her." Telling her "you'd qualify for subsidized plans" without naming that home care and equipment access may not transfer understates a loss that, for her, is about whether she can function, not just whether she has insurance.
*Solution space:* Extend the existing Medi-Cal note (it is already conditional and well-placed) with one sentence acknowledging that for people who rely on Medi-Cal for home care (IHSS), durable medical equipment, or specialist care, a coverage change can affect more than premiums, and that those programs have their own rules worth checking before acting. Keep it factual, not alarming, consistent with Do No Harm (flag the consequential decision; do not manufacture fear).

**3. [High] No mention of ABLE accounts at the one moment the user most needs it.**
*What it is:* The tool reaches a disabled user at the precise decision point, "should I take this raise" and never surfaces that ABLE accounts exist to let people with disabilities hold savings without losing means-tested benefits.
*Why it matters for this user:* The persona calls this out by name as Renee's unsolved problem. A raise is the moment savings (and therefore asset limits) become relevant. This is the highest-leverage place in the entire suite to surface ABLE, and it is silent.
*Solution space:* Within (or adjacent to) the scope note from Finding 1, a single neutral line: "If your situation involves SSI or other asset-tested programs, ABLE accounts (CalABLE in California) let people with qualifying disabilities save without those savings counting against benefit limits." Informational, links to CalABLE, asks nothing of the user, recommends nothing (Do No Harm compliant: states what exists).

**4. [High] The screen-reader data table omits the cliff that the chart exists to show.**
*What it is:* The visible chart plots ~140 points across the full income range and shows the cliff shape, where total resources stop tracking income and drop, plus "Now" and "Proposed" markers. The `sr-only` table conveys only two rows: current and proposed total resources. A screen-reader user gets the endpoints but not the shape, and specifically not *where between her current and proposed income the cliff sits*. The chart's `aria-label` mentions "a cliff where CalFresh benefits drop off," but the table, the actual accessible data, never locates it.
*Why it matters for this user:* Renee may be a screen-reader user (named in the brief). The cliff's *location* is decision-relevant: a raise that stops just short of the cliff is fine; one that steps just over it is the trap. A sighted user sees that at a glance; the AT user is given only two numbers and told a cliff exists somewhere.
*Solution space:* Either (a) add the income level(s) at which each modeled program's eligibility flips to the accessible summary (e.g., "CalFresh eligibility ends at about $X/month for your household"), or (b) add a short prose sentence in the (currently `aria-hidden` chart region but should be exposed) description stating where the nearest cliff falls relative to her two incomes. The calculator already computes per-program limits; the thresholds are available to surface.

**5. [Medium] The result answer is buried for a fog-day user.**
*What it is:* The plain-language verdict ("you'd have about $X less... This is the benefits cliff") is the answer, and it sits below the two scenario cards and the verdict table. A depleted user lands (via focus) on the comparison `<h2>` and must read/scroll through side-by-side program lists before reaching the sentence that actually answers "am I better or worse off."
*Why it matters for this user:* The stacked scarcity + fog load means the answer should be first, not assembled by the user. ALICE design already calls for "the answer must be in the first place she looks"; the disability lens sharpens it.
*Solution space:* Consider leading the results section with the one-sentence verdict (better off / about the same / worse off, and by how much), then offer the cards and table as the supporting detail beneath it. This is a UX/behavioral call (defer to design-ux and behavioral-science on ordering), flagged here because the fog-day cost is real.

---

### What the Tool Does Well for This User

- **Collects no disability data and asks nothing it doesn't need.** The disclosure-shame surface is essentially zero. There is no binary "are you disabled" trap, no diagnosis field, no work-gap question. This is exactly right and should be preserved in any fix.
- **Single-screen, low-memory input flow** that survives interruption and re-typing, genuinely completable on a flare day. Defaults ("Just me", checkbox off) match Renee's lived situation, so her minimal path is two numbers and a tap.
- **The converters eliminate held-in-head math.** Computing monthly from a paycheck or annual salary and writing it back into the field removes exactly the working-memory step fog makes unreliable.
- **Decouples CalFresh eligibility from a $0 benefit estimate** (`isCalFreshEligible` separate from `estimateCalFreshBenefit`), so a low estimated benefit never falsely reads as "ineligible." This protects a variable-income user from a misleading "you don't qualify."
- **Names the cliff plainly** ("This is the benefits cliff") and frames a loss as a structural fact, not a personal failing. No urgency, no fear language, recommendations avoided. Do No Harm posture is sound for the programs it does model.
- **Honest, sourced, and dated.** Every program links to its official source; thresholds carry a verified date. The Medi-Cal note already exists as a separate, conditional callout, which is the right place to extend for Finding 2.

---

### Sign-off

Three findings rise to Critical/High and concern the disability-specific stakes this tool is uniquely positioned to address: undisclosed exclusion of SSI/SSDI (Critical), an understated Medi-Cal-loss note that ignores IHSS/DME/specialist stakes (Critical), and no ABLE surfacing at the decision moment (High), plus an AT-incomplete chart table (High). None require collecting any new data from the user; all are content/disclosure-of-scope additions consistent with Do No Harm. Until findings 1-4 are addressed (or accepted with deliberate rationale by the PM, with input from brand and Naomi), I withhold sign-off.

⟦DISABILITY-REVIEW-WITHHELD⟧ tool="cliff-calculator" ticket="CLIFF-1" date="2026-06-21"

---

## Re-Verification — 2026-06-21

**Reviewer:** disability-accessibility
**Trigger:** Engineering reports all Critical and High findings addressed. Re-verified against `/Users/naomipinto/Documents/tsunam/finxiety/src/routes/tools/cliff-calculator/+page.svelte`.

### Finding 1 [Critical] — Undisclosed SSI/SSDI exclusion: RESOLVED
Unconditional `.scope-note` div (`role="note"`) present at lines 643-646, inside the results block so it appears whenever the user has a result to potentially misread. Copy: "This calculator covers CalFresh, Medi-Cal, and Lifeline only. SSI and SSDI have separate income rules — including a roughly $2,000 asset limit for SSI — that are not modeled here. ABLE accounts let eligible people save above that limit without it affecting SSI eligibility." This names the tool's own scope honestly (matches persona criterion: "honest when something is genuinely complicated"), names the $2,000 SSI asset limit, and asks nothing of the user to trigger it. The net-positive verdict can no longer read to a mid-appeal user as "the question is settled." Disclosure surface unchanged: no new data collected. Resolved.

### Finding 2 [Critical] — Medi-Cal note understated disability stakes: RESOLVED
Second `<p class="medi-cal-warning">` added inside the existing conditional `.medi-cal-note` at lines 459-461: names In-Home Supportive Services (IHSS) by name, states a coverage change "involves more than premiums," and routes to Disability Rights California (disabilityrightsca.org) and the county social services office. This directly answers the persona's 2am scenario ("Losing coverage during a flare is not an abstract risk to her") and the IHSS/DME/specialist-continuity gap. Factual, not alarming — consistent with Do No Harm (flags the consequential decision, manufactures no fear). Resolved.

### Finding 3 [High] — No ABLE account surfacing: RESOLVED
Addressed via the same scope note (line 645), ABLE accounts linked to calable.ca.gov. This reaches Renee at the exact decision point the persona names as her unsolved problem ("She has never heard of an ABLE account... It would solve her exact problem"). The line is informational, links out, recommends nothing — Do No Harm compliant. Resolved.

### Finding 4 [High] — sr-only chart table omitted the cliff location: RESOLVED
Conditional third table row added at lines 632-638, guarded by `cliffBottomPoint && cliffBottomPoint.grossMonthly !== currentIncome && cliffBottomPoint.grossMonthly !== proposedIncome`. Row labels "Approximate lowest point in the chart" with its gross-monthly income and total-resources values. `cliffBottomPoint` is derived correctly (lines 154-157) as the minimum-resources point across the plotted range. A screen-reader user now gets the cliff's approximate location relative to their two incomes, not just the two endpoints — the decision-relevant fact a sighted user reads at a glance. The guard correctly suppresses the row when the low point coincides with an income already in the table, avoiding a redundant/confusing duplicate. Resolved.

### Finding 5 [Medium] — Answer buried for a fog-day user: RESOLVED (beyond requirement)
Verdict-box now renders before the comparison-grid (lines 400-438 precede line 472), with an inline rationale comment ("so key number is above the fold at 375px"). A depleted user landing on the result heading now reaches the net-change number and the plain-language verdict before the side-by-side program lists. This was a Medium and not required for sign-off; addressing it is a genuine improvement to the energy-to-value ratio at the output stage flagged in the original Cognitive Fatigue and Double Vulnerability sections.

### Net assessment
All four Critical/High findings are resolved in source, and the single Medium is resolved as well. Every fix is a content/disclosure-of-scope addition; none collects new data, so the original "zero disclosure surface" strength is fully preserved — the tool still asks Renee nothing about her disability status. The double-vulnerability concern from the original review (the tool leaving disability-specific reasoning as homework for the user with the least bandwidth) is now substantively closed: the scope note, the IHSS warning, and the ABLE link do that reasoning for her, unprompted.

No Critical or High findings remain. Sign-off issued.

⟦DISABILITY-REVIEWED⟧ tool="cliff-calculator" ticket="CLIFF-1" date="2026-06-21"

# Finxiety: Disability & Chronic Illness Accessibility Framework

_A mandatory review checklist for every Finxiety tool before distribution._

Disability accessibility is a dimension of accessibility distinct from technical WCAG compliance. A tool that passes an automated accessibility audit but was designed assuming stable health, stable income, and stable cognitive capacity is not accessible to a large share of the people Finxiety is built for. Disability and poverty are not separate populations: working-age adults with disabilities live in poverty at more than double the rate of non-disabled adults.

This framework runs alongside the Socioeconomic Accessibility Framework, not instead of it, applied by the `disability-accessibility` agent using the Renee persona (`finxiety/research-findings/persona-renee-disability-user.md`). The agent issues `⟦DISABILITY-REVIEWED⟧` when all checks pass or all open findings are accepted with deliberate rationale.

---

## The Primary Reference

Before applying this framework, read the Renee persona document. Every check below connects to a specific characteristic of that user. The persona is not background material; it's the lens.

`finxiety/research-findings/persona-renee-disability-user.md`

---

## The Six Dimensions

### Dimension 1: Cognitive Accessibility Beyond Compliance

WCAG technical compliance (labels, contrast, keyboard nav) does not guarantee a tool is usable during brain fog, fatigue, or a flare. Plain language under stress is a different bar than plain language for an alert reader.

**Checklist:**

- [ ] **The flow survives interruption.** If the user has to stop mid-task (pain spike, fatigue, distraction) and come back, resuming does not require re-reading or re-entering everything from the start.
- [ ] **No reliance on cross-screen working memory.** The user is never asked to hold a number, choice, or instruction from one screen in their head to use it on the next.
- [ ] **Sentences stay short even where the topic is complex.** Complexity in the subject matter (eligibility rules, asset limits) does not justify complexity in the sentence structure.
- [ ] **One decision per screen where possible.** Stacking multiple decisions on one screen raises the cost of a single moment of fog.
- [ ] **Errors are forgiving, not punitive.** A typo or an out-of-range entry gets a plain correction, not a reset of progress already made.

**Failure mode:** A user who could complete the tool on a good day cannot complete it on a bad day, and bad days are not rare for this population. They're routine.

---

### Dimension 2: Sensory Accessibility in Lived Practice

This is not a re-check of QA's WCAG audit. It asks whether technical compliance holds up in the actual flow a screen reader or keyboard-only user experiences, not just in an automated scan.

**Checklist:**

- [ ] **Dynamic content announces itself.** Results, calculator outputs, and error messages that appear without a page reload use `aria-live` so a screen reader user knows something changed.
- [ ] **Focus moves where a sighted user's attention would move.** After a step transition or an expand/collapse action, focus lands somewhere sensible, not stranded at the top of the page or left on a now-hidden element.
- [ ] **Nothing depends on color alone.** Status, validity, and emphasis are conveyed by text or icon, not color alone. This matters for color-blind users and for low-vision users with custom contrast settings.
- [ ] **Touch and click targets work with imprecise input.** Tremor, limited fine motor control, and switch-access devices all need targets that tolerate imprecision, not just minimum size.

**Failure mode:** An automated audit passes, but a real screen reader or low-vision user hits a dead end the audit didn't catch.

---

### Dimension 3: Physical & Fatigue Considerations

Every interaction has an energy cost, not just a time cost. A tool can be short in time and still expensive in energy if it requires many small decisions or repeated fine-motor actions.

**Checklist:**

- [ ] **Touch targets meet or exceed 44px** and have enough spacing that an imprecise tap doesn't trigger the wrong control.
- [ ] **Interaction count is minimized, not just input count.** Toggles, dropdowns requiring scroll, and multi-tap confirmations all cost more than they appear to in a design review.
- [ ] **The tool does not require sustained scrolling or sustained typing** where a tap, a selection, or a short entry would do.
- [ ] **The value returned is worth the energy spent.** A tool that takes five minutes of careful typing to return information the user could have gotten in one question has a bad energy-to-value ratio for this user.

**Failure mode:** Completing the tool costs the user more capacity than the result gives back. They would have been better off not starting.

---

### Dimension 4: Disability-Specific Shame & Disclosure Anxiety

This is distinct from the financial shame the Socioeconomic Framework already checks. It is shame and risk specific to revealing a disability or chronic illness, sharpened by past experiences of disbelief, denial, or adversarial assessment.

**Checklist:**

- [ ] **No binary disability question without room for uncertainty.** "Do you have a disability?" with only yes/no options forces a determination the user may not have, may be mid-appeal on, or may not believe they're "entitled" to claim.
- [ ] **No framing that implies disability status is being evaluated or judged**, rather than simply used to route the user to relevant information.
- [ ] **No requirement to justify or prove a condition to the tool itself.** The tool is not an assessor. It should never read like one.
- [ ] **Fluctuating and "it varies" answers are treated as valid input**, not as incomplete data the user failed to provide.
- [ ] **Copy does not imply a standard of "disabled enough."** Avoid language that could read as gatekeeping who counts.
- [ ] **Disclosure has no visible cost.** Nothing about the visual weight, copy tone, or flow suggests that answering honestly will be held against the user.

**Failure mode:** The user either lies to get past a question that feels like a test, or abandons the tool rather than risk disclosure. Either way, the tool has reproduced the exact dynamic that made institutional systems unsafe for this user in the first place.

---

### Dimension 5: Benefit-Cliff Fear Specific to Disability

Disability-linked benefit cliffs are sharper and more punishing than the income cliffs a typical ALICE tool models. Losing Medi-Cal or IHSS hours by earning more in a good month is a materially different risk than a SNAP allotment shrinking.

**Checklist:**

- [ ] **Asset limits are not silently ignored.** If a tool's scope touches SSI, Medi-Cal, or other asset-tested programs, the existence of an asset limit is acknowledged even if exact calculation is out of scope. Silence reads as "this doesn't apply to you," which may be false.
- [ ] **Variable or irregular income is not treated as a data error.** A field or flow built only for stable paychecks signals to a user with disability-linked variable income that the tool wasn't built for them.
- [ ] **Where relevant, the tool does not imply that earning more is straightforwardly good news.** For this user, a higher number can mean a benefit reduction. The framing should not erase that possibility when it's plausibly in play.
- [ ] **ABLE accounts are surfaced where genuinely relevant**, since most users navigating SSI/Medi-Cal asset limits have never heard of them and the tool may be one of few places they'd encounter the option.

**Failure mode:** A tool that's accurate for a stable-income user gives a number that, if acted on, could cost a disabled user their healthcare or in-home support, and never warned them the stakes were different.

---

### Dimension 6: Double Vulnerability (Disability × Poverty)

The Renee persona and the Dani persona frequently describe the same person on a different week. A tool that handles either axis well but not both has only solved part of the problem.

**Checklist:**

- [ ] **The tool does not assume disability and poverty are separate users requiring separate flows.** One flow should serve both, not branch into a "disability version" and a "poverty version."
- [ ] **Cognitive load from scarcity and cognitive load from fatigue/fog are treated as compounding, not parallel.** A tool that budgets cognitive load for one alone will overrun it for a user carrying both.
- [ ] **Both personas are checked against the same screen**, not reviewed as alternate, mutually exclusive paths through the tool.

**Failure mode:** The tool is reviewed against each persona separately, passes both reviews, and still fails the user who is both at once.

---

## The Disclosure Safety Test

This is the signature test for this framework. Run it every time a tool asks any question that could reveal disability status, directly or by inference.

Find every question in the flow that touches health, capacity, work history gaps, or benefit program enrollment. For each one, ask:

1. Does answering honestly feel safe, or does it feel like a test with a right and wrong answer?
2. Is there room for "it varies," "I'm not sure," or "I haven't been determined yet," or only a binary?
3. Does the copy framing, visual weight, or surrounding context suggest a benefit or a penalty attached to the answer?
4. If the user answers honestly and gets the least favorable possible result, do they still feel the tool treated them fairly?

If the answer to #1 is "feels like a test," or the answer to #4 is "no," the tool is not ready for distribution.

---

## When to Run This Framework

- **Before distribution of any new tool**, alongside the Socioeconomic Accessibility Framework, not after it
- **After any copy or flow change that touches health, capacity, income stability, or benefit enrollment**
- **When adding any question that could reveal disability status, directly or by inference.** Always run the Disclosure Safety Test specifically
- **Before any partnership or referral integration with a disability-focused organization.** That referral source's trust is on the line too

---

## Relationship to Do No Harm

Do No Harm is the rule. This framework is the method for detecting violations specific to disability and chronic illness, violations that are invisible to a WCAG audit and to the Socioeconomic Accessibility Framework alone, because they require understanding how institutional disbelief and disclosure risk change a user's relationship to a tool.

Both frameworks apply, together, to every tool. Neither replaces the other.

---

## Research Grounding

- U.S. Census Bureau, American Community Survey (2024). Poverty rate for working-age adults with disabilities vs. without.
- Social Security Administration, Annual Statistical Report (2024 data). Initial SSDI denial rates and most common denial reasons.
- Miserandino, C. (2003). "The Spoon Theory." Fluctuating daily capacity budget for chronic illness.
- Goffman, E. (1963). *Stigma: Notes on the Management of Spoiled Identity.* Disclosure management and social risk.
- Wendell, S. (1996). *The Rejected Body: Feminist Philosophical Reflections on Disability.* Invisible and fluctuating disability.
- ABLE Act (2014). Tax-advantaged savings accounts for people with disabilities that don't count against SSI/Medicaid asset limits.

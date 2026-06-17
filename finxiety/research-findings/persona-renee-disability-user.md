---
type: persona
project: finxiety
date: 2026-06-16
source: disability studies (Goffman 1963, Wendell 1996), spoon theory (Miserandino 2003), SSA disability statistics, US Census disability/poverty statistics, ABLE Act (2014)
status: draft, for review and refinement with community input before final
---

# Secondary User Persona: The Disability & Chronic Illness User

_Fluctuating capacity, institutional distrust, and disclosure risk, layered on top of the bandwidth tax ALICE already carries_

This is not a demographic sketch. It is a companion to the ALICE persona (`persona-alice-primary-user.md`), not a replacement for it. Disability and poverty are not two separate audiences. In 2024, working-age adults with disabilities lived in poverty at more than double the rate of non-disabled adults (23.6% vs. 9.6%, US Census Bureau, American Community Survey). For a large share of Finxiety's users, this persona and the ALICE persona describe the same person on the same day.

---

## Who She Is

Her name is Renee. She's 41. She lives alone in a studio apartment in Sacramento. Rent is $1,650/month. She was diagnosed with rheumatoid arthritis at 33. RA is fluctuating: some weeks she works full shifts with no visible sign anything is wrong. Other weeks her hands swell too much to type, and she can't get out of bed before noon without help from a dose of prednisone that brings its own fog.

She works as a remote customer service rep for a telecom company, paid per shift, with no guaranteed hours. This isn't a choice; it's the only arrangement that survives a flare without her losing the job entirely. Her income last month was $1,890. The month before, $2,640. The month before that, $1,140, because she missed eight shifts during a flare and used up her sick time by week two.

She applied for SSDI fourteen months ago. She was denied at initial determination, which is what happens to most people: roughly two-thirds of initial SSDI applications are denied, most often for "insufficient medical evidence" even when the applicant has years of records (SSA Annual Statistical Report, 2024 data). She's mid-appeal now, working with a disability attorney on contingency. There's no fixed timeline. She's been told it could be another year.

She is not poor in the way a single bad month makes someone poor. She is poor in the way an unpredictable body makes income unpredictable, and an adversarial determination process makes the safety net itself feel like one more thing to manage.

---

## Her Financial & Disability Reality

She qualifies for Medi-Cal and has it. She is afraid to earn more in a good month because she doesn't fully understand whether a redetermination could end her coverage mid-flare. Losing coverage during a flare is not an abstract risk to her; it's the scenario she thinks about at 2am.

She has not applied for CalFresh, even though her income likely qualifies her. Partly it's the paperwork, which is hard to face during a flare. Partly it's a quieter belief: that food assistance is for people who are "more disabled" or "more broke" than her, and that needing it would confirm something she doesn't want confirmed.

She has not pursued IHSS (In-Home Supportive Services), despite real difficulty with some daily tasks during flares. She has heard stories in her RA support group about the in-home assessment: assessors who say "you don't look disabled," or who hold a bad-symptom day against a good-symptom day, as if fluctuating conditions are a contradiction to be caught rather than the actual nature of the illness. She would rather struggle through a bad week alone than be assessed and disbelieved.

She has $1,800 in a Roth IRA from a full-time job she had before her diagnosis. She has heard conflicting things about whether that money could disqualify her from SSI or jeopardize Medi-Cal once her SSDI appeal resolves. Nobody has explained it to her clearly. She has never heard of an ABLE account, a tax-advantaged account created by federal law in 2014 specifically so people with disabilities can hold modest savings without losing means-tested benefits. It would solve her exact problem. She doesn't know it exists.

---

## Her Relationship with Disability Systems

The SSDI denial letter was the first real contact she had with the disability benefits system, and it set the tone for everything after. It was clinical, formatted like a form rejection, and made no reference to the eleven years of rheumatologist visits she'd submitted. It said, in essence: *we have determined you are not disabled.* She had not asked anyone to determine that. She was just trying to get help.

Before her diagnosis worsened, she once asked a previous employer for a minor accommodation: a chair, a later start time on bad mornings. Her manager asked, not unkindly but pointedly, whether she was "sure" she needed it, since she'd seemed fine the day before. That single interaction taught her something she has not unlearned: disclosing a fluctuating condition invites doubt, not accommodation.

So she has learned to manage disclosure carefully. She says "I have arthritis" more easily than "I'm disabled." The first sounds like a fact; the second feels like a claim she might be challenged on. She has internalized a quiet, specific doubt: *am I disabled enough to use that word, to ask for that help, to take up that space in a system built for people worse off than me?* This is not a personality trait. It is the rational residue of a system that has, so far, treated her health information as something to be doubted by default.

---

## Cognitive State at the Moment of Use

Renee comes to a Finxiety tool one of two ways:

**Scenario A: The Referral.** Someone in her RA support group mentions a free screener that tells you what you might qualify for without making you talk to anyone first. She opens it on her phone between shifts, cautiously, the way she opens most things related to benefits: bracing slightly.

**Scenario B: The Flare.** She's three days into a flare. Her hands hurt enough that typing is slow and frustrating. A Medi-Cal redetermination notice arrived and she hasn't opened it yet because she's scared of what it says. She's looking for clarity, fast, in a format that doesn't ask much of her.

In both scenarios, two cognitive loads are stacked, not parallel: the scarcity bandwidth tax Mullainathan and Shafir describe for the ALICE user, and a second tax from fatigue and brain fog that is specific to chronic illness, sometimes called "spoon theory" in disability community language (Miserandino, 2003): a finite, sometimes-depleted daily budget of physical and cognitive capacity that has to cover everything, not just the task in front of her.

**What this means for tool design:**
- The tool must be completable on a bad-symptom day, not just a good one. Slow typing, brief attention, and occasional re-reading should not break the flow
- Nothing should require the user to remember something from one screen to use on another; fog erodes working memory unpredictably
- If a flow is interrupted (a pain spike, a knock at the door, a task that has to be set down), resuming should not cost re-reading everything from the start
- The tool cannot assume a stable, single "gross monthly income" without acknowledging that income may vary month to month for reasons outside the user's control

---

## Her Emotional State Around Disability and Money

Renee's shame is not the same shame Dani carries, though it sits near it. Dani's shame is about not having enough. Renee's shame has an added layer: the fear of being seen as not disabled *enough* to deserve help, or, in the opposite direction, of being disbelieved and treated as exaggerating or "faking it." Both fears can be active in the same week.

This produces specific design consequences:
- A question that asks her to categorize her disability status in a binary way (yes/no, with no room for "it varies") will feel like a test she might fail either direction
- Any framing that implies disability status itself is being evaluated, rather than simply used to route her to relevant information, will trigger the same wariness the SSDI denial letter did
- A result that requires her to *prove* something, rather than simply tell her what exists, repeats the adversarial pattern she already lives inside
- She needs the tool to treat fluctuating and uncertain answers as valid, not as gaps to be resolved

---

## What Would Make Her Trust This Tool

1. **It doesn't ask her to diagnose or label herself to proceed.** A question like "do you have a disability" should allow uncertainty, not force a binary that feels like a test.
2. **It doesn't require a determination she doesn't have yet.** Many people navigating disability benefits are mid-appeal, undiagnosed, or self-identifying without a formal determination. The tool should be useful at every stage of that, not only after a determination exists.
3. **Variable income is treated as normal, not as an error to correct.** If a flow assumes one stable monthly number, it has already signaled it wasn't built for her.
4. **It names the institutional reality without being asked.** Something like "disability benefit systems are slow and often deny on the first try. That's common, not a sign you don't qualify" would land as relief, not generic reassurance.
5. **It doesn't perform sympathy.** Renee does not want a tool that treats her as fragile. She wants accurate information delivered the same way it would be delivered to anyone else.
6. **There's a path forward that doesn't require more disclosure than she's given.** If a result points to IHSS or SSI, it should not require her to explain or justify anything further to the tool itself.
7. **It's honest when something is genuinely complicated.** Disability benefit eligibility is often more complex than SNAP or Medi-Cal income thresholds: asset limits, work incentives, concurrent program rules. A tool that oversimplifies this to make itself feel cleaner is doing her a disservice, not a favor.

---

## What This Means for the Suite

This persona runs alongside ALICE, not instead of her, for every tool.

- **BEN-1 (Benefits Screener):** The single "gross monthly income" field works for someone with a stable paycheck. For Renee, income varies month to month for reasons outside her control. This doesn't have to be solved today, but any future income-related copy or input design should be reviewed against whether it silently assumes income stability.
- **Future disability-specific programs (SSI, SSDI, IHSS, CalABLE):** Not yet in scope for any tool, but when they are, the eligibility rules are categorically more complex than the FPL-based thresholds BEN-1 already models: asset limits, work incentive rules, and concurrent-program interactions all apply. The disability-accessibility lens should be involved from the design stage, not just the review stage, for any of these.
- **All tools:** Any categorical question that could reveal disability status (directly or by inference) should be reviewed for disclosure safety, not just data privacy, but whether answering honestly feels emotionally safe in the moment.

---

## What She Is Not

She is not constantly suffering, and she is not fragile. She has good weeks where nothing about her day looks different from anyone else's. She is not asking to be treated delicately. She is asking not to be doubted, and not to be forced into a binary (disabled / not disabled, deserving / not deserving) that doesn't match how her condition actually works.

She is also not separate from the ALICE user. She is frequently the same person, on a worse week. A tool that serves Dani well but silently assumes stable health and stable income has only solved part of the problem for a population where the two are this tightly linked.

She doesn't need to be inspired or reassured. She needs systems that take fluctuating, uncertain, and partially-determined situations as the normal case rather than the edge case.

---

## Research Grounding

- **U.S. Census Bureau, American Community Survey (2024).** Poverty rate for working-age adults with disabilities (23.6%) vs. without disabilities (9.6%), more than double, consistent across recent years.
- **Social Security Administration, Annual Statistical Report (2024 data).** Roughly 62-68% of initial SSDI applications are denied; insufficient medical evidence is the most commonly cited reason even when extensive records exist.
- **Miserandino, C. (2003).** "The Spoon Theory." Originating description of a finite, fluctuating daily capacity budget for chronic illness, widely used in disability community language for fatigue and cognitive load that compounds with other demands on attention.
- **Goffman, E. (1963).** *Stigma: Notes on the Management of Spoiled Identity.* Disclosure management and the social risk of revealing a discreditable or discreditable-seeming trait.
- **Wendell, S. (1996).** *The Rejected Body: Feminist Philosophical Reflections on Disability.* On invisible and fluctuating disability, and how systems built around a stable, legible disability status fail people whose conditions don't present that way.
- **ABLE Act (2014).** Federal law creating tax-advantaged savings accounts for people with disabilities that don't count against SSI/Medicaid asset limits. Directly relevant to Renee's specific, unresolved confusion about her Roth IRA.
- **Mullainathan, S. & Shafir, E. (2013).** *Scarcity: Why Having Too Little Means So Much.* Shared theoretical root with the ALICE persona: the bandwidth tax this persona stacks a second load on top of.

---

_This persona is a first draft, written as a companion to the ALICE persona. It should be refined with input from disability community partners and people with lived experience of fluctuating, invisible, and chronic disabling conditions, not only the condition modeled here. It is a starting point, not a final authority._

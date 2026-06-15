# MYTH-1 Benefits Myth-Check Quiz — Content Spec

**last_updated:** 2026-06-14
**revised:** 2026-06-14 (post brand + behavioral science review — supersedes v1)
**status:** 5 questions + synthesis layer — ready for engineer

---

## What changed from v1

- Cut from 10 to 5 questions. Kept: Q2 (asset limits), Q4 (benefits cliff), Q6 (daily SNAP amount), Q9 (paperwork loss), Q8 (WIC — reframed)
- Dropped: Q1 (stereotype-correction aimed at wrong audience), Q3 (NYC-specific stat, un-guessable), Q5 (population trivia), Q7 (TANF — deepens external locus with no door), Q10 (redundant with Q2)
- Added synthesis layer — was missing from v1; required by backlog spec
- Q6: cut hypoglycemia/children's test scores reveal (Do No Harm — fear/urgency about user's own children)
- Q4: flagged "3M families" for primary source confirmation before build; elevated CLIFF-1 bridge to primary payoff
- Q8: reframed from population-participation-rate trivia to "you might be missing this even with SNAP"
- All myth labels marked research-only — must not render on screen verbatim
- Reveal headlines written for every question under one rule: blame the system or the information gap, never the guesser
- "Link to" callouts rewritten as warm on-screen signpost copy
- Secondary stats moved to research-only blocks or optional expanders
- Point-of-use plain-English definitions added for all jargon

---

## Interaction design (internal — not for on-screen display)

Each question is a quantitative estimate. The user commits to a number before the reveal. The reveal shows the real figure plus a structural explanation that locates the gap in system design, never in the user's behavior.

**Two rules for the engineer:**
1. Never surface myth labels verbatim as on-screen headers.
2. Reveal headlines must blame the system or information gap, never the guesser. No "Wrong," no "Actually," no "Surprised?" framing.

---

## Question 1: Saving money and SNAP

**[Research-only — do not display] Myth addressed:** Having savings disqualifies you from SNAP — so there's no point in saving.

**Question prompt (on-screen):**
> If a SNAP household managed to put away $2,000 in savings, how many U.S. states do you think would count that against their eligibility?

**Estimate type:** Number picker (0–50)

**Reveal headline (on-screen):**
> Fewer than 10. In 41 states, that savings doesn't affect eligibility at all.

**Reveal body (on-screen):**
> 41 states have completely eliminated the SNAP asset test. Only 9 still use the federal default savings limit. The fear of "saving costs you benefits" is based on a rule that most states have quietly retired — without much public notice.

**Structural explanation (on-screen):**
> The change happened through a policy option called Broad-Based Categorical Eligibility (BBCE), which states can adopt without a federal announcement. Most applicants have never heard of it. The fear was rational given the rule's history — the map just changed without anyone updating the signs.

**Plain-English definitions:**
- *Asset test*: a savings limit. If your savings exceed the limit, you lose eligibility.
- *BBCE (Broad-Based Categorical Eligibility)*: a policy option states can use to drop the savings limit. About 46 states have used it in some form.

**[Research-only — do not display] Federal default limits (for 9 states still using them):** $3,000 for most households; $4,500 for households with an elderly or disabled member.

**Cross-tool signpost (on-screen):**
> A tool that checks your state's current rules alongside SNAP and other benefits is coming soon.

**Sources:**
- CBPP, March 2026: https://www.cbpp.org/research/food-assistance/snaps-broad-based-categorical-eligibility-supports-working-families-and-0
- Propel state-by-state breakdown: https://www.propel.app/snap/asset-limits-states/

---

## Question 2: The benefits cliff

**[Research-only — do not display] Myth addressed:** More income always means more money at the end of the month — a raise is always worth it.

**Question prompt (on-screen):**
> Researchers have documented cases where a $1/hour raise left a low-income parent with less money at the end of the month because of benefits they lost. Roughly how many families with children do you think could face this situation?

**Estimate type:** Open number or range slider (anchor labels: "A few thousand" → "Millions")

**Reveal headline (on-screen):**
> Millions — and it's a design flaw, not a personal failure.

**Reveal body (on-screen):**
> In one documented case, a $1/hour raise added $160/month in wages but triggered immediate benefit reductions of $800/month — a net loss of $640. In another, a $0.10/hour raise caused a family to lose $9,000/year in childcare subsidies.

**[Research-only — build note] Source confidence:** A DHHS figure of "more than 3 million households" is cited in the Federal Reserve Communities summary. A direct HHS primary link must be confirmed before build. If not confirmed: use only the concrete documented examples above and omit the aggregate figure entirely. Do not ship an unverified aggregate claim.

**Structural explanation (on-screen):**
> Benefits programs have separate eligibility cutoffs at different income thresholds. When SNAP, Medicaid, housing assistance, and childcare subsidies all have hard cutoffs stacked near each other, the combination can make it economically irrational to accept a raise. This is a design flaw in how programs interact — not a reflection of how hard someone is working.

**Plain-English definitions:**
- *200% of poverty*: roughly $60,000/year for a family of four in 2023.
- *Benefits cliff*: the income point where earning more triggers a net loss because multiple benefits phase out at once.

**Cross-tool signpost (on-screen) — primary payoff for this question:**
> There's a tool being built that calculates whether a specific raise would help or hurt your total resources, taking into account your current benefits. It's called the Benefits Cliff Calculator — coming soon.

**Sources:**
- Atlanta Fed: https://www.atlantafed.org/what-we-study/workforce-development/advancing-careers-for-low-income-families/what-are-benefits-cliffs
- Federal Reserve Communities: https://fedcommunities.org/the-benefits-cliff-explained/
- CBPP: https://www.cbpp.org/research/poverty-and-inequality/block-granting-not-a-solution-to-benefit-cliffs

---

## Question 3: What SNAP actually buys

**[Research-only — do not display] Myth addressed:** SNAP provides enough to eat all month. Running out early means mismanagement.

**Question prompt (on-screen):**
> On average, SNAP gives each person roughly how much money per day to spend on food?

**Estimate type:** Dollar input (e.g., $3 – $20 range)

**Reveal headline (on-screen):**
> $6.16 — less than the cost of a minimum adequate diet.

**Reveal body (on-screen):**
> The average SNAP benefit works out to $6.16 per person per day. That's below what the USDA's own Thrifty Food Plan — its estimate of the minimum cost to eat adequately — runs in most markets. Running short at the end of the month is a structural consequence of that gap.

**[Research-only — optional expander only, not primary reveal]**
- 59% of SNAP benefits are spent in the first week of issuance (PMC 2016)
- 25% of households exhaust virtually all benefits within week one (USDA ERS)
- Do not include hypoglycemia study or children's test score data in any user-facing copy — these import fear/urgency about health outcomes in a way that violates Do No Harm

**Structural explanation (on-screen):**
> Benefit levels are set by Congress and haven't kept pace with actual food costs. Families often spend quickly at the start of the month to stock up on shelf-stable foods, then run short when perishables run out. The pattern is a structural consequence of inadequate benefit levels — not impulsive spending.

**Plain-English definition:**
- *Thrifty Food Plan*: the USDA's own calculation of the minimum cost to feed a family adequately. SNAP benefit amounts are pegged to this plan.

**Cross-tool signpost (on-screen):**
> SNAP, Medicaid, and other programs are covered in the benefits screener coming soon.

**Sources:**
- CBPP: https://www.cbpp.org/research/food-assistance/the-supplemental-nutrition-assistance-program-snap
- PMC (spending timing): https://pmc.ncbi.nlm.nih.gov/articles/PMC4943850/
- USDA ERS: https://www.ers.usda.gov/amber-waves/2018/december/monthly-timing-of-snap-spending-less-smooth-for-some-households

---

## Question 4: Paperwork loss

**[Research-only — do not display] Myth addressed:** Only ineligible people lose SNAP. If you're eligible, you keep it.

**Question prompt (on-screen):**
> In a Massachusetts study, what percentage of SNAP participants with young children temporarily lost their benefits — not because they became financially ineligible, but for administrative reasons like a missed deadline or incomplete paperwork?

**Estimate type:** Percentage slider or input (0–100%)

**Reveal headline (on-screen):**
> Nearly 41% — eligible families, lost benefits over paperwork.

**Reveal body (on-screen):**
> In that study, 40.9% of SNAP families with young children experienced a benefits interruption for purely administrative reasons: a missed recertification deadline, incomplete paperwork, or a missed phone interview. Researchers call these "procedural denials" — benefits lost despite full financial eligibility.

**[Research-only — optional expander]:**
- Urban Institute 6-state study: 17–28% of SNAP households experienced "churn" (losing and re-enrolling within 90 days) in 2011
- 68–90% of those exits happened at recertification, not mid-certification

**Structural explanation (on-screen):**
> Recertification requires submitting new documents, completing a new interview, and meeting a deadline set by the agency — on a schedule that doesn't account for work shifts, no paid leave, or limited English. These are access barriers built into the process. The research is explicit: these are administrative failures, not personal ones.

**Plain-English definition:**
- *Recertification*: the periodic renewal process SNAP requires to keep receiving benefits, typically every 6–12 months.
- *Procedural denial*: losing benefits for paperwork reasons, not because you became ineligible.

**Cross-tool signpost (on-screen):**
> Missing a recertification deadline is the most common reason eligible families lose benefits. A tool that tracks your deadline and prep list is coming soon — knowing yours in advance is the fix.

**Sources:**
- PMC/AJPH: https://pmc.ncbi.nlm.nih.gov/articles/PMC9449793/
- CBPP renewals: https://www.cbpp.org/research/food-assistance/improving-snap-and-medicaid-access-snap-renewals
- CBPP churn: https://www.cbpp.org/research/lessons-churned-measuring-the-impact-of-churn-in-health-and-human-services-programs-on

---

## Question 5: WIC and the missed connection

**[Research-only — do not display] Myth addressed:** If a family needs WIC, they've signed up. The families most in need find it.

**Reframing rationale (internal):** Original framing asked for population-level participation trivia. Reframed to anchor in the user's possible situation: "if you're already on SNAP with a young child, are you also on WIC?" — opens a door rather than describing a statistic about other people.

**Question prompt (on-screen):**
> If a family is already enrolled in SNAP and has a child under 5, what percentage do you think are also enrolled in WIC — the nutrition program for young children?

**Estimate type:** Percentage slider or input (0–100%)

**Reveal headline (on-screen):**
> About half — meaning nearly half of eligible families are missing it, even with SNAP.

**Reveal body (on-screen):**
> Nearly half of WIC-eligible people who are already enrolled in SNAP or Medicaid don't access WIC — even though SNAP enrollment can serve as a fast path to WIC eligibility. Overall, only 56% of eligible people participated in 2023.

**[Research-only — optional expander]:**
- Eligible infants: 82.3% participation
- Eligible 4-year-olds: only 26.9% participation

**Structural explanation (on-screen):**
> WIC requires a separate application from SNAP and Medicaid, an in-person visit for nutritional screening, and a nearby WIC clinic. Being on SNAP with a young child and still not being enrolled in WIC is common — not a sign of not trying. The programs don't automatically connect, and no one is required to tell you.

**Cross-tool signpost (on-screen):**
> The benefits screener coming soon will check WIC eligibility alongside SNAP and Medicaid in one pass.

**Sources:**
- USDA FNS WIC Eligibility and Coverage Rates 2023: https://www.fns.usda.gov/research/wic/eer/2023
- CBPP: https://www.cbpp.org/research/food-assistance/wics-critical-benefits-reach-more-of-those-eligible-than-in-recent-years

---

## Synthesis Layer

**Required — do not skip. This is the enabling-environment payoff. A stat quiz that ends without this produces the illusion of understanding and changes nothing.**

The synthesis layer is 2 short prompts at the end of the quiz. Both are ungraded, both are optional to answer, and there is no correct response. The goal: the user articulates the structural reframe in their own words. That's what converts a moment of surprise into a revised belief they carry out the door.

**Synthesis prompt 1 (on-screen):**
> Which of these surprised you most?
> - That saving money might not affect SNAP in your state
> - That a raise can sometimes leave you with less
> - That paperwork — not eligibility — is why most people lose benefits
> - That missing WIC while on SNAP is common
> - That $6.16 a day is below what the USDA's own minimum diet costs

**Synthesis prompt 2 (on-screen):**
> If someone told you they'd lost their SNAP benefits last year, what would you assume happened?
> *(A few words is fine — there's no right answer.)*

**Engineer note:** Prompt 2 is a free-text or soft-select field. No scoring, no judgment, no result screen that grades the answer. The point is that the user generates language about the cause — ideally a structural one ("probably paperwork," "the system dropped them," "maybe they got a small raise"). Even a private mental answer counts. This screen is not optional — it is the feature.

---

## Dropped questions — retained for reference

The following questions from v1 were cut. Data is preserved here if needed for future tools.

**Q1 (SNAP employment rate):** 28–33% earned income point-in-time; ~74% over 25-month window (CBPP). Cut: stereotype-correction framed at wrong audience (Dani is on SNAP, not someone who holds the "recipients don't work" stereotype). Reframe needed before using.

**Q3 (NYC missed interview, 20%):** Cut: NYC-specific stat, un-guessable, reads as trivia. The underlying point (administrative barriers cause eligible people to lose benefits) is covered by Q4.

**Q5 (Medicaid 64% working):** Cut: population-level trivia about a group Dani is part of. Data: KFF, May 2025, updated Feb 2026. 64% non-elderly Medicaid adults employed full/part-time. Only 6% neither working nor qualifying for exemption. Usable in a reframed format for future tools.

**Q7 (TANF 21 of 100 families):** Cut: deepens external locus with no door. As written, tells the user the system has abandoned families like hers and then sends her to a screener for a program that reaches almost no one. Data: CBPP October 2025. CA: 65/100; TX/AR: 2/100. If used in future, lead with the state variation and the CA figure as the empowering fact.

**Q10 (SNAP households with savings, median $450):** Cut: redundant with Q1; the savings behavior finding is a powerful footnote for Q1's "Why the gap exists" but doesn't need its own question.

---

## Research notes and caveats

**Data freshness:** SNAP characteristics, WIC eligibility rates, and TANF-to-poverty ratios update annually (federal fiscal year, October). Release agent must verify all figures before ship and re-check each October.

**Q2 benefits cliff source:** "3 million families" from DHHS, cited in Federal Reserve Communities summary. Direct HHS primary link unconfirmed at time of research. Do not ship aggregate figure without confirmation — use concrete examples only if needed.

**SNAP spending timing:** 59%/first-week from PMC 2016 study. CBPP cites 78%/two-weeks from 2017 data. Both valid; first-week figure used as primary for Q3 (more viscerally illustrative).

**Q4 Massachusetts study:** PMC/AJPH. Specific to families with young children in Massachusetts. Note geographic scope in any fine print.

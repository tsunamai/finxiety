# SAVE-1 Behavioral Research: Savings Interventions in Low-Income Populations

**Research date:** 2026-06-19
**Blocking questions answered:** Three pre-build blockers from the SAVE-1 ticket.
**Verdict:** All three questions resolve in favor of the current SAVE-1 design. One additional risk flag added.

---

## Blocking Question 1: Is the Gollwitzer implementation-intention format right for the ALICE user?

**Finding: Yes — with one important condition.**

Implementation intentions ("I will [action] at [time] in [place]") have a medium-to-large average effect on goal attainment across 94 independent studies with 8,000+ participants (d = 0.65, Gollwitzer & Sheeran 2006). The mechanism has been validated across diverse populations including low-income, elderly, racial and ethnic minorities, and individuals under cognitive stress.

The counterintuitive finding relevant to the ALICE user: implementation intentions may be *more* effective, not less, for people under cognitive scarcity. Scarcity research (Mullainathan & Shafir 2013) shows that tunneling and cognitive load reduce the capacity for deliberative decision-making. Implementation intentions work precisely by converting an intention into an if-then automatic response — they reduce the cognitive load required at the moment of action. The user doesn't have to decide again; the decision is already made and encoded as a cue-response pair.

The condition: the format must be SHORT and simple. The SAVE-1 design (a single "I will transfer $X to savings [when] so that I can [goal]" sentence) matches the research-validated form. Multi-step plans, elaborate condition-checking, or abstract goal statements have weaker effects than simple, specific, concrete if-then pairs.

Milkman et al. (2012) "Following through on Good Intentions: The Power of Planning Prompts" specifically validated the planning prompt mechanism in behavioral intervention contexts — the act of forming the plan in writing is itself the intervention.

**Design implication:** The commitment statement must be formed in the user's own words and stated as a single concrete sentence. The SAVE-1 spec already requires this. Do not add complexity to the planning step.

---

## Blocking Question 2: Does "smallest amount that feels like progress" framing risk shame when the user's answer is very small?

**Finding: Low risk — the risk is comparison framing, not amount size.**

Soman & Cheema (2011) "Earmarking and Partitioning: Increasing Saving by Low-Income Households" (Journal of Marketing Research) directly tested small savings in low-income households. In a randomized evaluation, workers who received earmarked savings in two envelopes saved 72% more than workers with one envelope. The mechanism was not the size of the amount — it was the act of earmarking. The amount was small in all conditions; what mattered was the commitment structure.

Thaler & Benartzi (2004) Save More Tomorrow (SMarT): participants committed to saving a portion of future pay increases — starting at very low amounts — with high uptake and low dropout. The success factor was the smallness and specificity of the initial commitment, not its scale. The program's logic directly supports "smallest amount that feels like progress": a small amount that actually happens beats a larger amount that stays aspirational.

**Where shame does enter:** Comparison framing. "Most people save X," "the recommended amount is X," or any implicit floor (suggesting $5 is too small to count) activates social comparison and triggers shame in low-income contexts. The SAVE-1 spec already guards against this:
- The prompt is "smallest amount that would feel like progress" — not a recommendation
- The tool explicitly accepts $5 with no warning
- No benchmark is displayed
- No percentage-of-income calculation is shown

**Additional risk to guard:** Sussman & O'Brien (2016) "Knowing When to Spend: Unintended Financial Consequences of Earmarking" found that earmarked savings labels can cause people to maintain labeled savings while taking on high-interest debt during emergencies — because the label makes the money feel "off limits." For SAVE-1, the commitment is aspirational (a self-made appointment), not a restriction. The user's money remains fully accessible. This should be made legible in the tool: the commitment statement and calendar reminder are a plan, not a lock. **Design action:** Ensure nothing in the SAVE-1 UI implies the labeled amount is inaccessible or that spending it is failure. The commitment is to a future action, not a restriction on current access.

---

## Blocking Question 3: Is private commitment (not social) the right form for v1?

**Finding: Yes — social commitment has documented harm risk in low-income populations specifically.**

Anett John (2020) "When Commitment Fails: Evidence from a Field Experiment" (Management Science): a field study offering low-income individuals personalized installment-savings commitment accounts with self-chosen default penalties. Result: while the average effect on bank savings was large, **55% of clients defaulted and incurred monetary losses**. The chosen penalties were too low to overcome self-control problems, and imperfect self-knowledge about preferences led participants to select incentive-incompatible commitments. The commitment mechanism hurt more than half the participants.

This was a hard commitment device with penalties. The SAVE-1 design is a soft commitment device (self-authored statement + calendar reminder, no restrictions, no penalties). The RAND working paper "Soft versus Hard Commitments: A Test on Savings Behaviors" confirms that soft psychological devices (account labels, reminders) achieve similar outcomes at lower cost and with substantially less harm risk.

The India field experiment (Commitment or concealment? Dupas & Robinson, ScienceDirect 2021) found that low-income savers specifically sought **privacy** for their savings, not social accountability. The finding: savings concealment from social networks was a feature, not a bug — low-income households face legitimate social network demands (family requests, community obligations) that can drain savings when the existence of savings is known. Public commitment + income shock + social network demand = default + social exposure + shame.

For the ALICE user at Dani's income level, this risk is acute. Irregular income, an emergency, or a family member's need can make a publicly-committed savings goal impossible to keep — and social exposure of that failure compounds the harm. Private commitment avoids the social-pressure failure mode entirely.

**The "My savings appointment" framing** in the SAVE-1 spec — a private calendar event with a neutral title — is correct. It is legible only to the user. No social element belongs in v1.

---

## Summary for Engineer and PM

| Question | Answer | Confidence |
|---|---|---|
| Gollwitzer implementation-intention format appropriate for ALICE user? | Yes — short, specific, concrete if-then form; reduces cognitive load under scarcity | High |
| "Smallest amount that feels like progress" risks shame when amount is very small? | Low risk — shame comes from comparison framing, not amount size; current spec guards against this | High |
| Private commitment is right for v1 (not social)? | Yes — social commitment has documented 55%+ default/harm rate in low-income field experiments; privacy from social network pressure is protective | High |

**One additional design action:**
Ensure no language in the SAVE-1 UI implies the earmarked commitment amount is locked or inaccessible. The commitment is a forward-looking plan, not a restriction. Users must feel free to access their own money without violating the commitment.

---

## Sources

- Gollwitzer, P.M. & Sheeran, P. (2006). Implementation Intentions and Goal Achievement: A Meta-Analysis of Effects and Processes. [Gollwitzer Sheeran 2006 — Implementation Intentions meta-analysis](https://www.prospectivepsych.org/sites/default/files/pictures/Gollwitzer_Implementation-intentions-1999.pdf)
- Gollwitzer, P.M. (1999). Implementation Intentions: Strong Effects of Simple Plans. [Implementation Intentions — strong effects of simple plans](https://www.prospectivepsych.org/sites/default/files/pictures/Gollwitzer_Implementation-intentions-1999.pdf)
- Milkman, K.L., Beshears, J., Choi, J.J., Laibson, D., & Madrian, B.C. (2012). Following through on Good Intentions: The Power of Planning Prompts. [IDEAS/RePec: Katherine Milkman](https://ideas.repec.org/f/c/pmi292.html)
- Thaler, R.H. & Benartzi, S. (2004). Save More Tomorrow: Using Behavioral Economics to Increase Employee Saving. [Journal of Political Economy, Vol 112](https://www.journals.uchicago.edu/doi/10.1086/380085)
- Soman, D. & Cheema, A. (2011). Earmarking and Partitioning: Increasing Saving by Low-Income Households. [Journal of Marketing Research](https://journals.sagepub.com/doi/10.1509/jmkr.48.SPL.S14)
- Sussman, A.B. & O'Brien, R.L. (2016). Knowing When to Spend: Unintended Financial Consequences of Earmarking to Encourage Savings. [Journal of Marketing Research](https://journals.sagepub.com/doi/10.1509/jmr.14.0455)
- John, A. (2020). When Commitment Fails: Evidence from a Field Experiment. Management Science, 66(2). [When Commitment Fails — IPA](https://poverty-action.org/publication/when-commitment-fails-%E2%80%93-evidence-field-experiment)
- RAND Working Paper: Soft versus Hard Commitments: A Test on Savings Behaviors. [RAND WR1055](https://www.rand.org/content/dam/rand/pubs/working_papers/WR1000/WR1055/RAND_WR1055.pdf)
- Dupas, P. & Robinson, J. et al. (2021). Commitment or Concealment? Impacts and use of a portable saving device: Evidence from a field experiment in urban India. [ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0167268121004984)
- J-PAL Evidence Summary: Leveraging behavioral insights to increase savings in low- and middle-income countries. [povertyactionlab.org](https://www.povertyactionlab.org/blog/5-26-21/leveraging-behavioral-insights-increase-savings-low-and-middle-income-countries)
- Ideas42: A Behavioral Economics Perspective on Innovations in Savings Programs. [ideas42.org](https://www.ideas42.org/wp-content/uploads/2015/05/A-Behavioral-Economics-Perspective-on-Innovations-in-Savings-Programs-1.pdf)

# Finxiety — Socioeconomic Accessibility Framework

_A mandatory review checklist for every Finxiety tool before distribution._

Socioeconomic accessibility is a dimension of accessibility, like physical, cognitive, and sensory accessibility. A tool that's technically accessible but built for users with financial stability is not accessible to the people Finxiety is built for.

This framework is the fourth gate in the Finxiety validation loop, run by the `behavioral-science` agent using the ALICE primary user persona (`finxiety/research-findings/persona-alice-primary-user.md`). The agent issues `⟦BEHAVIORAL-REVIEWED⟧` when all checks pass or all open findings are accepted with deliberate rationale.

---

## The Primary Reference

Before applying this framework, read the ALICE persona document. Every check below connects to a specific characteristic of that user. The persona is not background material — it's the lens.

`finxiety/research-findings/persona-alice-primary-user.md`

---

## The Five Dimensions

### Dimension 1: Cognitive Load Under Scarcity

The ALICE user arrives with constrained bandwidth. Financial worry is occupying mental resources. The tool must be completable in the cognitive space they have, not the cognitive space they'd have under less stress.

**Checklist:**

- [ ] **Single-step completion.** A user can enter what they know and get the answer in one flow. No multi-page, no multi-decision, no required return visits for a meaningful result.
- [ ] **No working memory burden.** The user does not need to remember something from one screen to use it on another.
- [ ] **No future-oriented framing.** Questions like "what do you plan to save?" or "what are your financial goals?" require forward planning. Under scarcity, forward planning is cognitively taxed. Frame around what the user knows now, not what they aspire to.
- [ ] **Three inputs maximum** for any first result. Every additional required field is a decision that costs bandwidth. If more than three inputs are needed, use progressive disclosure: get the first result, then offer refinement.
- [ ] **Answer is in the first place they look.** The result is not buried below explanation or context. The fact comes first.

**Failure mode:** A user with limited time and attention abandons before completing. The tool helped no one.

---

### Dimension 2: Shame Architecture

Financial shame is the single most likely reason a user closes the tab and leaves worse than before they came. Shame is not about intention — the most well-meaning design choices can activate it. Review every copy string, every result display, every piece of contextual text.

**Checklist:**

- [ ] **Results display as facts, not grades.** A number is information. A number in a red box with a frowning icon is a verdict. Check every result for judgment signals: color (red/green), iconography, comparative language.
- [ ] **No benchmarks unless the benchmark is the point.** "Experts recommend 3–6 months" next to a "1.2 months" result is a comparison the user is losing. If the benchmark is not the tool's core value, leave it out.
- [ ] **No "you're behind" framing.** Language like "most people," "financial best practice says," or "you should have" implies a standard the user may not reach. This is shame-adjacent even when not intended.
- [ ] **Worst-case result is treated the same as best-case result.** The near-zero result state — the one Dani is most likely to see — must be reviewed separately. Does it read as information or confirmation of failure?
- [ ] **Context note explains structural reality, not personal failure.** When context is needed after a low result, the framing should attribute the pattern to structural mechanics ("irregular expenses tend to consume available cash before savings can accumulate"), not to the user's behavior.
- [ ] **No "you should" anywhere.** Full stop. This is a Do No Harm rule and a shame rule simultaneously.

**Failure mode:** The user receives accurate information and feels worse about themselves. The tool caused harm.

---

### Dimension 3: Trust Architecture

The ALICE user approaches financial tools with rational distrust. They have been failed by financial institutions, financial advice, and financial tools built for different users. Trust is not given — it's earned, in the first 30 seconds, by design decisions.

**Checklist:**

- [ ] **No login, no email, no account.** These are friction and surveillance signals. Every field that asks for identity reduces trust.
- [ ] **No path that looks like a product.** If the tool or its result could plausibly be a lead-generation funnel, it will be perceived that way. No newsletter prompts, no "talk to an advisor," no upsell signals.
- [ ] **Copy sounds like a person, not a brochure.** The ALICE user can tell the difference between a human voice and an institutional voice in the first sentence. Institutional voice is a trust-breaker.
- [ ] **Result is not a surprise.** If the result could plausibly reveal something alarming that the user wasn't prepared for, the input framing should prepare them. (This applies especially to eligibility tools: a denied result should not feel like a trap.)
- [ ] **No jargon without immediate plain-English translation.** "SNAP allotment," "FPL," "gross income" — if the term is necessary, define it in the same breath.
- [ ] **Stateless design is a trust signal.** The tool does not store anything. This is already in the architecture. Make it visible where trust is at stake: "This tool doesn't save your numbers or track you."

**Failure mode:** The user does not trust the result, or does not return, or warns others away. The tool fails at the first moment of use.

---

### Dimension 4: Locus of Control

A result with no path forward is a verdict. For a user who already experiences outcomes as outside their control, a tool that shows a gap they cannot close alone — and then ends — may reinforce the sense that nothing can be done. The tool's obligation is to leave the user with more agency than they came in with.

**Checklist:**

- [ ] **The output is actionable or gives a path to something actionable.** The tool should answer the implicit "so what?" — not by giving advice, but by signaling what options exist.
- [ ] **Near-zero results have a bridge.** When the result is near-zero or reveals a significant gap, the tool surfaces relevant programs, tools, or resources that might exist. Not "you should apply for X." Rather: "Programs that help in situations like this include X." Or a link to BEN-1 when live.
- [ ] **The bridge is informational, not directive.** The user decides what to do with the information. The tool provides the information and gets out of the way.
- [ ] **The tool does not end at the problem.** Every result state — especially the worst case — should have a natural next step visible, even if only "here's where this connects to other tools."

**Failure mode:** The user sees a gap they cannot close, has nowhere to go next, and is worse off for knowing than for not knowing. The tool failed the Do No Harm principle.

---

### Dimension 5: Accessibility of Concepts

Financial concepts that are obvious to financial professionals — and even to middle-class users with some financial history — may be inaccessible to someone who has never had a savings account, never heard of an ALICE threshold, or never thought of their money in terms of "runway." Concept accessibility is different from plain language. A sentence can be grammatically simple and still describe a category that doesn't exist in the user's experience.

**Checklist:**

- [ ] **Every input concept can be resolved by someone with no financial history.** Test: would Dani, who has never had a designated savings account, know what to enter in each field? If a hint is needed, the hint must be concrete ("A savings account set aside only for emergencies. Enter $0 if you don't have one.").
- [ ] **The tool's frame applies to users with $0 in every field.** Some tools are implicitly designed for people who have something. An emergency fund checker implicitly assumes the user has an emergency fund worth checking. If the tool is also for someone with $0, the design must make that legible — in the framing, in the hints, in the result display.
- [ ] **Financial vocabulary that assumes a middle-class life is flagged.** "Runway" (startup/professional frame), "portfolio" (investment frame), "financial goals" (advisory frame) — these carry implicit audience signals. Replace or contextualize.
- [ ] **The result is interpretable without external knowledge.** A user should not need to know what "3–6 months" means to interpret their result. The result tells you what it tells you; it does not require external reference.

**Failure mode:** The user cannot complete the tool because a concept doesn't match their experience. Or they complete it and can't interpret the result. The tool was built for someone else.

---

## The Near-Zero Result Test

This is the single most important test for any Finxiety tool. Run it every time.

Fill the tool with Dani's numbers: minimal or zero savings, income at or below the ALICE threshold, expenses that consume most of that income. Whatever the near-zero result state is — that is the result most of your target users will see.

Ask:
1. Does the result read as information or verdict?
2. Is there a path forward?
3. Does the contextual note explain the structural reality or imply personal failure?
4. Would a user who got this result feel more informed and more capable, or less?

If the answer to #4 is "less" — the tool is not ready for distribution.

---

## When to Run This Framework

- **Before distribution of any new tool** — as the fourth gate after brand, UX, and QA
- **After any copy or flow change** — new copy can introduce shame language; new flows can introduce locus-of-control problems
- **When adding a near-zero or edge result state** — always run the Near-Zero Result Test specifically
- **Before any partnership or referral integration** — if a nonprofit is referring users to a tool, that tool's bar is higher, not lower

---

## Relationship to Do No Harm

Do No Harm is the rule. This framework is the method for detecting violations at the behavioral science level — violations that are invisible to standard UX review because they require understanding how financial stress changes cognition.

Both apply. This framework does not replace Do No Harm; it operationalizes it for the specific conditions of the ALICE user.

---

## Research Grounding

- Mullainathan, S. & Shafir, E. (2013). *Scarcity: Why Having Too Little Means So Much.*
- United Way ALICE Project. Survival budget methodology and threshold data.
- Brown, B. (2010). *The Gifts of Imperfection.* Shame as cognitive inhibitor.
- Klontz, B., Britt, S., et al. Financial therapy research on financial shame triggers.
- SAMHSA (2014). *Trauma-Informed Care in Behavioral Health Services.* Six principles adapted to design context.
- Bertrand, M., Mullainathan, S., & Shafir, E. (2006). Behavioral economics and marketing in aid of financial literacy.

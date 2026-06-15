# BEN-1 — CA Benefits Screener: Behavioral Science Validation

**Gate:** Pre-release behavioral review
**Reviewer:** Behavioral Science (Finxiety)
**Date:** 2026-06-15
**Persona applied:** ALICE Primary User — Dani (`finxiety/research-findings/persona-alice-primary-user.md`)
**Scope:** `src/routes/tools/screener/+page.svelte`, `src/lib/eligibility/index.ts`, `src/lib/data/snap-eligibility.ts`
**Lenses:** Scarcity (Mullainathan & Shafir), Financial shame, Trust calibration, Locus of control, Cross-tool bridge, Enabling environment (Matuschak)

---

## Verdict: BLOCKED — 1 blocking finding, 4 advisory notes

The tool is, on the whole, well-built for this user. The brand reviewer is right that the externalized framing of the no-match path is strong work. But there is one finding that crosses from advisory into blocking, because it touches the exact failure mode this persona is most vulnerable to: a result that reads as a silent verdict with no information and no door.

I want to be precise about what I am and am not blocking on, because the brand review's "near-miss" note (the income-gap line) and my blocking finding are about *different* code paths. Brand assumed the gap line renders on all unlikely cards. It does not. The bare card is the problem.

---

## The two unlikely-card states (this distinction drives the whole review)

In `+page.svelte:192-198`, an unlikely card has exactly two possible renders:

1. **Near-limit unlikely** (`program.nearLimit === true`): renders the name, the "Above limit" badge, the near-limit note ("You are close to the income limit... Worth checking again if your income or household changes."), AND the `incomeVsLimit` gap line.
2. **Far-over unlikely** (`program.nearLimit === false`): renders ONLY the name and the "Above limit" badge. No note. No gap line. No explanation. Nothing.

The `{:else if program.nearLimit}` at line 192 has no trailing `{:else}`. So the far-over case is a dead-silent card. This is the case my blocking finding is about.

---

## 1. Scarcity Mindset

- **Cognitive steps required:** One screen, one decision to submit. Household size, income, two optional checkboxes. This is one cognitive step to the answer. Good. Within the persona's "few minutes on a phone" budget.
- **Tunneling risk:** The paycheck-conversion hint (`+page.svelte:116-121`) is always-visible and multi-line: three pay-frequency multipliers plus a "$0" instruction. For a user in scarcity who already knows her monthly number, this is three lines of arithmetic instructions she must visually skip past to get to the next field. It is scaffolding for the user who needs it, but it taxes the user who doesn't. Mullainathan/Shafir: under bandwidth load, dense instructional text near an input increases the felt effort of the input. Mitigating factor: the `placeholder="e.g. 2200"` (line 110) gives a fast path. Net: tolerable, but see Advisory 1.
- **Present-bias risk:** Low. The tool asks only for *this month's* income — a present-tense, tactical number this user has at her fingertips. It does not ask her to project, plan, or imagine the future. This is correctly built for the scarcity state. The one near-future ask ("Worth checking again if your income or household changes," line 195) is a soft signpost, not a planning demand.
- **Household size starting at 1** (`+page.svelte:4`): Dani is a household of 3. She must change the default. A number input at 375px means tapping the field, clearing/incrementing to 3. Minor friction, not blocking. The hint "Include everyone you buy food and pay shared bills for" (line 85) is genuinely useful — household composition for benefits is non-obvious and this prevents a common undercount error.
- **Finding: PASS** — One cognitive step, present-tense input, no future-thinking demand. The hint density is an advisory, not a fail.

## 2. Financial Shame

- **Potential shame triggers, enumerated:**
  - "Above limit" badge (`+page.svelte:174`): On a *near-limit* card it is softened by the accompanying note and gap line — the user sees she was close and why. On a *far-over* bare card, the badge stands alone. "Above limit" with nothing else is the closest this tool comes to a verdict. It is factual ("limit," not "you earn too much"), which is the right instinct, but with no surrounding text it reads as a closed door rather than information.
  - The no-match headline "These programs may not match your situation right now." (`+page.svelte:154`): Strong. "May not match" frames the mismatch as between programs and situation, not as a deficiency in her. "Right now" leaves time open. This is good shame-aware writing.
  - The near-limit note (`+page.svelte:193-196`): Softens well. "You are close" reframes a miss as a near-hit; "Limits update each October" externalizes; "Worth checking again" leaves a door. For the near-limit case this is close to ideal.
  - `incomeVsLimit` gap line (e.g. "$26,400/year vs. $24,078/year limit", or for a far-over user "$5,000 vs. $1,632 limit"): a number-vs-number comparison. On near-limit cards the gap is small and the comparison is reassuring. Note it does NOT render on far-over cards (because nearLimit is false), so the stark-gap scenario the brand review worried about does not actually occur in the bare case. The gap line only appears where the gap is small. That is, by accident or design, the shame-protective behavior.
- **Result display — verdict or information?** Mixed. The likely path and the near-limit path read as information with a path. The far-over bare card reads as a verdict (badge only, no context). A column of three or four bare "Above limit" cards with no text under any of them is the single most verdict-like surface in the tool.
- **Implicit comparisons:** No "most families," no "experts recommend," no peer benchmark. The only comparison is the user's own income vs. the program's own limit — a comparison to a policy line, not to other people. This is exactly the right comparison object for this persona. Good.
- **Finding: FLAG (blocking via Finding #1 below)** — The far-over bare card is a silent verdict. Everything else in the shame architecture is sound.

## 3. Trust

- **Trust-building elements:** No login, no email, no PII (consistent with the stateless mandate). Purpose stated in the first sentence: "Check which California benefits programs you may qualify for." (`+page.svelte:72-73`) — a 5-second-readable statement of what the tool does. Every likely result links to an official `.gov` / official-program URL. CTA labels are navigation ("Check eligibility on BenefitsCal," "Find a WIC office near you"), not sales. The "$0 income" handling in both the input hint and the CalEITC branch treats the hardest case without alarm. All of this earns trust with a user who has been denied before.
- **Trust-breaking risks:**
  - "These are estimates based on income only. Actual eligibility is determined by the administering agency." (`+page.svelte:157-159`): This is honest and necessary, but for a user who has been *denied before*, "just an estimate, the agency decides" can land as "this might be another dead end like last time." The risk is low because it is paired with concrete next steps, but the disclaimer's placement directly under the headline means it is the second thing she reads. See Advisory 2.
  - The far-over bare card (Finding #1) is also a trust risk: a benefits tool that shows her a program name, stamps "Above limit," and says nothing else can read like every other system that told her "no" without explanation. This is the specific institutional failure the persona carries forward.
- **Trust arc:** Starts high (no gate, plain purpose). For Dani (5 "May qualify" results) it ends *higher* — the tool found things she didn't know about. For a no-match user it ends lower than it should, because the bare cards withhold the "why" that the rest of the tool is so careful to provide.
- **Finding: PASS for the likely path; FLAG for the no-match path** (folded into Finding #1).

## 4. Locus of Control

- **Actionable or verdictive?** The likely path is strongly actionable: each card carries a description, an estimated benefit, and a labeled door to the official application. This is "here is what exists and where to go," which builds agency. The no-match path is partially actionable (the bridge box + quiz link give a door) but the bare per-program cards above the bridge are verdictive — they assert a closed door without a handle.
- **Path forward:** Present on every path. Likely → application URL. No-match → bridge box + Myth-Check Quiz. Near-limit → "check again if income/household changes." No user reaches a true dead end. This is the persona's #7 requirement ("there's somewhere to go next") and the tool meets it at the page level. The gap is at the *card* level for far-over programs.
- **Finding: PASS** — The tool consistently leaves a door at the page level. The card-level silence is the only erosion.

## 5. Cross-Tool Bridge

- **Near-zero / no-match state:** The bridge box (`+page.svelte:203-214`) externalizes the cause ("Income limits are set by Congress and state agencies and update annually each October") and links to the Myth-Check Quiz with a reason ("covers what these programs actually provide and why so many eligible families never enroll"). This is informational, not directive, and it reads as a warm handoff, not an ad. Strong.
- **Character of the bridge:** Informational. It does not say "try the quiz instead" or "you should." It says what the quiz is about. Correct register for this persona.
- **One concern, not blocking:** On the no-match path the Myth-Check Quiz link appears twice within one short scroll — once in the bridge box (line 210) and once in the footer cross-tool link (line 224). For a user with constrained bandwidth, a duplicated link can read as "is this the same thing or different?" — a small tax. See Advisory 4. (Brand flagged the same dedupe.)
- **Finding: PASS** — The bridge is well-constructed and correctly placed.

---

## Critical Findings

### Finding #1 — BLOCKING — The far-over "Above limit" card is a context-free verdict
**What it is:** When a program is unlikely AND not near-limit, the card renders only the program name and the "Above limit" badge (`+page.svelte:192-198`; the `{:else if program.nearLimit}` block has no `{:else}`). No explanation, no gap line, no signpost. For a no-match user (e.g. household 3 at $3,800/mo), the results page is a stack of bare "Above limit" cards above the bridge box.

**Why it matters for this user:** This is the persona's defining wound. Dani "tried to apply for Medi-Cal two years ago and was denied... she doesn't know" the rules changed. She carries calibrated distrust from systems that said "no" without telling her why. A bare "Medi-Cal — Above limit" card reproduces exactly that experience: a verdict with no information. The persona document is explicit that "if a tool shows a 'bad' result, the design must prevent that result from reading as a verdict about her." A name-plus-rejection-badge with nothing else is a verdict. The bridge box at the bottom does real work, but it is *page-level* — it does not reach up and explain any individual card, and a user scanning a column of red-adjacent "Above limit" tags may absorb the verdict before she reaches the bridge.

Note this is NOT the income-gap-line concern the brand review raised. The gap line does not render on these cards. The problem is the opposite: *silence*, not a stark number.

**Solution space (PM/UX to decide, not me):**
- Give the far-over card a single line of context, mirroring the near-limit note's externalizing tone — e.g. a one-line "Your income is above this program's current limit. Limits are set by federal and state rules and change each October." This converts a verdict into information without adding a number that could sting.
- OR collapse far-over programs into a single quieter "Programs your income is currently above" summary group rather than individual stamped cards, reducing the verdict-stacking effect.
- OR suppress the per-program far-over cards entirely on the no-match path and lead with the bridge box (the externalizing copy already does the explanatory work). This is the lowest-effort option and aligns with the persona's "she will not scroll for the answer."
- Any of these clears the block. The requirement is: no card may present a rejection badge with zero surrounding context.

### Finding #2 — ADVISORY — Paycheck hint density taxes the bandwidth-loaded user
**What it is:** The always-visible three-line conversion hint (`+page.svelte:116-121`).
**Why it matters:** Useful for the user who doesn't know her monthly figure; friction for the one who does (Dani knows hers). Consider progressive disclosure (a "not sure of your monthly total?" toggle/expander) so the default view is one clean field. Non-blocking.

### Finding #3 — ADVISORY — CalEITC "at tax time" framing for the present-focused user
**What it is:** CalEITC description "Claimed when you file state taxes, not monthly." (`snap-eligibility.ts:191`) and benefit string "up to $X at tax time (estimated)" (`index.ts:274`).
**Why it matters:** For a user tunneled on *this month's* bills, "at tax time" can quietly file CalEITC under "not for me right now" and she may not register that this is potentially the largest single dollar figure on the page (up to $3,529 for 3 kids vs. $768/mo CalFresh). This is accurate and honestly hedged — no Do No Harm issue. But the *salience* of a large annual sum is at risk of being discounted by a present-biased reader. Advisory only: consider whether the benefit string could anchor the magnitude (e.g. naming it as a lump sum) without implying she should act now. Do not add urgency. Non-blocking.

### Finding #4 — ADVISORY — Duplicate Myth-Check Quiz link on the no-match path
**What it is:** The quiz link appears in both the bridge box (`+page.svelte:210`) and the footer cross-tool link (`+page.svelte:224`) within one scroll.
**Why it matters:** Minor bandwidth tax / "are these the same?" ambiguity. Dedupe on the no-match path. (Brand flagged this independently.) Non-blocking.

---

## Enabling Environment (Matuschak)

- **Changed capability:** For Dani, yes — meaningfully. She arrives believing (per persona) she may not qualify for things she actually qualifies for. The tool shows her 5 concrete programs with names, plain descriptions, dollar estimates, and official doors. After this, she can *do* something she could not do before: she knows CalFresh/Medi-Cal/School Meals/Lifeline/HEAP exist for her and where to apply. This is genuine capability change, not just a number.
- **After-the-tab question:** If Dani closes the tab and returns in a week, what is different? For the likely path: she may have an EBT application started, or at minimum a revised belief ("I qualify for things"). That belief revision is the durable change. For the no-match user: less is different — she gets externalizing framing and a quiz link, but no new capability unless she follows the bridge. This is acceptable for a true no-match but underlines why Finding #1 matters: a bare verdict changes nothing except possibly reinforcing "the system is closed to me," which is the *anti*-enabling outcome.
- **Active vs. passive:** Mostly passive reception (she reads results). The two optional checkboxes are the only active engagement, and they meaningfully change results (WIC, School Meals, Medi-Cal child branch, CalEITC child count), so they are doing real work, not decoration. This is more active than a pure display. Acceptable for a screener — the action this tool enables happens *after* (on BenefitsCal), which is the correct locus.
- **Illusion of understanding risk:** Low-to-moderate. The estimates disclaimer correctly prevents over-confidence ("the agency decides"). The risk is the inverse for the no-match user: a *feeling of closure* ("I checked, I don't qualify, done") that is false because rules change and the bare card gave her no reason to "check again." The near-limit note solves this for near-limit cards; the far-over card does not. Finding #1's fix would close this gap too.
- **Finding: PASS for the likely path; FLAG for the no-match path** (addressed by Finding #1).

---

## What the Tool Does Well for This User

- **One cognitive step to the answer.** Single screen, present-tense input, no future-projection demand. Built for the scarcity state, not against it.
- **No gate of any kind.** No login, email, or PII. Trust earned in the first 30 seconds, exactly as the persona requires.
- **Comparison object is a policy line, not other people.** Income vs. *the program's own limit* — never "most families," never "experts recommend." This is the single most important shame-protective choice in the design and it is made correctly throughout.
- **The no-match bridge externalizes cause.** "Income limits are set by Congress and state agencies" tells a denied-before user the threshold is a policy line, not a judgment of her. This is the persona's requirement #6 ("it acknowledges the structural reality") executed well.
- **Every program self-translates and every door is official.** "Lifeline (phone or internet discount)," official .gov URLs, navigation-not-directive CTAs. Dignity and verifiability together.
- **The $0-income case is handled humanely** in both the input hint and the CalEITC branch — the hardest case, treated plainly and without alarm.
- **For Dani specifically, this tool does the job the persona names for it:** "She qualifies. She doesn't know. This tool's job is to tell her that, clearly, and point her to where to actually apply." For her real numbers it returns 5 "May qualify" results with doors. That is a real win for the user who needs it most.

---

## Disposition

One blocking finding (#1: the far-over context-free "Above limit" card). It is narrow and any of three solution-space options clears it. Three advisories for future iteration. The likely path — the path Dani is most likely to land on — is sound today; the block is specifically about protecting the no-match user from a silent verdict.

Withholding sign-off pending resolution of Finding #1.

⟦BEHAVIORAL-BLOCKED⟧ tool="screener" ticket="BEN-1" date="2026-06-15"

# Behavioral Science Review: MYTH-1 (Benefits Myth-Check Quiz)

**Persona applied:** ALICE Primary User — Dani (`finxiety/research-findings/persona-alice-primary-user.md`)
**Ticket:** MYTH-1
**Date:** 2026-06-21
**Files reviewed:**
- `/Users/naomipinto/Documents/tsunam/finxiety/src/routes/tools/myth-quiz/+page.svelte`
- `/Users/naomipinto/Documents/tsunam/finxiety/src/lib/data/myth-quiz.ts`

---

## Summary

MYTH-1 is, on the whole, a careful and unusually well-considered piece of work for this user. The reveal copy consistently blames systems, not people; the cross-tool signposts are warm and non-directive; the welcome screen disarms test anxiety with "No grades, no right answers." This is the rare educational format that has internalized that the user is capable and has been failed by systems, not the reverse.

There is **no Critical finding**. There are **two High findings** — both at the seam between the quiz's intent and its mechanics, and both fixable with copy/logic changes, not redesign. One concerns the scoring screen, which currently undercuts the brand's own anti-grade stance. The other concerns the guess-commit mechanic on the two questions where being wrong overlaps with the user's lived experience, where the design risks producing exactly the shame it elsewhere works so hard to avoid.

---

## Scarcity Mindset

- **Cognitive steps required:** Per question, two steps — (1) form a guess and lock it in, (2) read the reveal. That is the correct shape. The estimate is a single control (number / slider / dollar), never a multi-field form. Good.
- **Total length:** 5 questions × 2 steps + welcome + synthesis + score = ~12 screens. That is long for a user with a 5–10 minute window on her phone during a break. Each individual screen is light, but the *sequence* asks for sustained attention that Dani-in-crisis (Scenario B) may not have.
- **Abandonment is safe and lossless.** This is the single most important scarcity-protective property of the tool, and it is correctly built. State is held in `$state`, nothing is submitted, there is no account, and the reveals are front-loaded — the value lands on each reveal, not at the end. A user who quits after question 2 still leaves with two real facts. This is exactly right for a tunneling user: every reveal is a complete unit of value. **Pass on this dimension specifically.**
- **Tunneling risk:** The `<details>` "Sources for this figure" expander is correctly collapsed by default — it is available to the skeptic without taxing the user who just wants the number. Good.
- **Present-bias risk:** Question 2 (the cliff) and its signpost ask Dani to think about "what a raise might affect" — future-oriented framing. For most of the suite this would be a flag, but here it is naming a *fear she already holds in the present* (the persona explicitly notes she "may decline the raise without asking anyone"). It reads as recognition, not homework. Acceptable.
- **Finding: PASS (with one note)** — The per-question load is right and abandonment is genuinely lossless. The note is length: see Medium finding #3 on whether 5 questions is the right count for the device and the moment.

---

## Financial Shame

This is where the tool's intent and its mechanics are in the most tension, and it deserves the most careful read.

- **The welcome disarms well:** "No grades, no right answers" is the correct first move. It pre-empts the report-card reflex that made Dani close Mint.
- **The reveal headlines blame systems, consistently.** "It's a design flaw, not a personal failure." "The map just changed without anyone updating the signs." "That pattern is structural, not impulsive spending." "These are administrative failures, not personal ones." Every single reveal carries an explicit absolution. This is the brand principle executed at the sentence level, and it is the strongest thing about the tool.

- **The shame risk is not in the reveals — it's in the comparison line plus the question framing on Q4 and Q5.** Consider Dani specifically:
  - **Q4 (paperwork, 41% lose benefits to procedural denial):** The persona is a single parent of two who is managing recertification deadlines around 32 hours of shift work. The reveal says 41% of eligible families lose benefits over paperwork. The structural framing is excellent — but a user who *has herself lost a benefit to a missed deadline* (highly plausible for Dani) now sees "You guessed: 50%. The real number: 41%." The number is no longer abstract trivia; it is a description of her own life, and the guess/real comparison frames her as someone who *underestimated a thing that happened to her.* The structural copy catches this on the way down, but the comparison row lands first and lands visually (terracotta, bold).
  - **Q5 (WIC, ~half of eligible SNAP families miss it):** Same structure, sharper edge. Dani has a young-ish household and qualifies for benefits she doesn't know about — the persona says so directly. The reveal "nearly half are missing it, even with SNAP" can read, to the right user, as *"you are probably one of the people missing out."* That is the persona's exact stated fear ("benefits she may have missed"). The structural copy ("no one is required to tell you") absolves the *reason* — but the affective hit ("I've been missing money my kids qualified for") arrives before the absolution is read.

  This is not a reason to cut these questions — they are the two most *valuable* questions in the quiz for this exact user, because they point at benefits she can still act on. It is a reason to make sure the **emotional sequence within the reveal** leads with the system and the door, not with the gap. See High finding #2.

- **Implicit comparisons:** The quiz mostly avoids "most experts recommend" framing. But note the repeated rhetorical move "most people believe X" (welcome description, score headline). For most users this is fine — it makes the *myth* the out-group, not the user. Watch that it never tips into "most people believe X, and you did too." Currently it does not. Pass, but flagged for the score screen (below).

- **The score screen is the highest shame-risk surface in the tool, and it partially contradicts the welcome's own promise.** "No grades, no right answers" (welcome) → `{revealsSeen} of {totalQuestions}` rendered at 2.5rem, weight 800, in terracotta, labeled "reveals seen" (score). The label "reveals seen" is a genuine and thoughtful attempt to de-grade the number — it counts *exposure*, not *correctness*, which is the right instinct. But the **visual treatment is identical to a score**: a big bold fraction in a card is the universal grammar of a test result. A user does not read "reveals seen" first; she reads "3 of 5" first, in the typographic form of a grade, and for a beat it *is* a grade — and worse, a fraction less than 5/5 reads as *incomplete*, i.e., as failure, for a user who abandoned early precisely because her bandwidth ran out. The tool punishes the scarcity-driven exit it elsewhere protects. See High finding #1.

- **Finding: FLAG → the reveal copy is excellent; the score-screen *presentation* and the Q4/Q5 *reveal sequencing* are where shame can re-enter.** Two High findings below.

---

## Trust

- **Trust-building elements (strong):** No login, no email, no PII, breadcrumb back to safety on every screen, plain-spoken copy ("the map just changed without anyone updating the signs" sounds like a person), sources linked and verifiable on every figure, and the explicit "Programs change. The official sources are the place to confirm what applies to you." The sources expander is a major trust asset for a user with *calibrated* distrust — it says "don't take our word, here's the government's."
- **Trust-breaking risks:**
  - The guess-commit mechanic ("Lock in my guess") is a small trust gamble. For a user who has been *tricked* by financial interfaces, being asked to commit before seeing the answer can momentarily read as "is this a setup?" The welcome's "no right answers" mitigates this, and the payoff (a genuinely useful fact) redeems it. Net acceptable, but it is why the score screen matters so much — if the *end* feels like a graded trick, it retroactively reframes every "lock in my guess" as the bait. Trust is won and lost across the whole arc.
  - The signposts name a tool ("Benefits Screener") and, for the cliff, a tool that does not yet exist ("A Benefits Cliff Calculator is in the works"). Naming an unbuilt tool is mildly risky — a distrust-calibrated user who clicks expecting it and finds nothing loses trust. The copy is careful ("is in the works ... in the meantime, the Benefits Screener can...") and redirects to a live tool, so it does not strand her. Acceptable, but confirm at QA that no link points to a 404.
- **Trust arc:** Starts neutral-to-cautious → builds steadily through the reveals (each verifiable, each absolving) → **dips at the score screen** if the fraction reads as a grade. The fix to High #1 closes this dip and lets the arc end up.
- **Finding: PASS (conditional on resolving the score screen).** The trust scaffolding is genuinely strong; the only thing that can break it is the ending reading as a test.

---

## Locus of Control

- **Actionable vs. verdictive:** The reveals are information, not verdict — and crucially, four of five carry a *door* (a signpost to a tool or an actionable fact, e.g., "knowing your deadline in advance is the fix"). This is the persona's stated requirement #7: "There's somewhere to go next... What she needs is a door." The tool delivers a door on most reveals.
- **Path forward:** Present on Q1, Q2, Q3, Q5 (Benefits Screener) and Q4 (knowing your recert deadline — though note Q4 has *no signpostUrl*; it names the fix but doesn't link RECERT-1/the deadline tool, leaving the one reveal most about a fixable problem without a clickable door. See Medium #4).
- **The risk:** The cumulative weight of five "the system is broken and it cost you" facts can, without an integrating close, leave a user feeling *the system is rigged against me* — which is externalized locus reinforced. The synthesis and score screens are supposed to integrate this into agency. The score-screen body does try: "Knowing that changes how you move." That is the right closing note — it converts the facts into a capability. But it is undercut by the grade-fraction sitting above it (High #1). Fix the fraction and this closing line does its job.
- **Finding: PASS (conditional).** The door is present on nearly every reveal and the closing reframe is correct. Resolving High #1 is what lets the locus-of-control payoff actually land.

---

## Cross-Tool Bridge

- **Character of the bridges:** Informational and warm, not directive. "In California, the Benefits Screener checks eligibility for CalFresh, Medi-Cal, WIC, and more in one pass." This is a signpost ("here is what exists"), not a recommendation ("you should apply"). Compliant with Do No Harm. The cliff signpost is a model of the warm handoff: it is honest that the dedicated tool isn't built yet and redirects to the useful adjacent tool without overselling.
- **Geographic honesty:** The signposts say "In California" — correct, since the Screener is CA-first. A non-CA user is not promised something she can't use. Good.
- **Synthesis → score handoff:** The synthesis ("Which surprised you most?" / "what would you assume happened?") is a genuine attempt at active engagement rather than passive reception — more on this in the Enabling Environment section. The final score screen's only forward paths are "Back to Finxiety" and "Start over." There is **no signpost to BEN-1 / the Screener on the final screen itself** — the bridges live only inside individual reveals. A user who tunneled past the reveals' signpost boxes and arrived at the end has no consolidated "here's where to go" door. See Medium #5.
- **Finding: PASS.** The bridges are exactly the right character. One gap: the final screen doesn't consolidate them (Medium #5).

---

## Enabling Environment (Matuschak)

This is the lens that matters most for a quiz, and the one most likely to be where MYTH-1 quietly under-delivers.

- **Changed capability:** Does Dani leave able to *do* something she couldn't? Partially yes — three of the five facts are genuinely capability-changing because they are *specific and actionable*: (Q1) saving may not cost you SNAP in 41 states → she can open the savings account she abandoned; (Q4) paperwork, not eligibility, is the #1 reason people lose benefits → she can watch her recert deadline; (Q5) SNAP can fast-track WIC and half of eligible families miss it → she can apply for WIC. These are durable, usable mental models, not just trivia.
- **The after-the-tab question:** If Dani closes the tab now and doesn't return for a week, what is different? Best case: she remembers *one* of "I might be able to save without losing SNAP" or "I should check WIC." That is a real outcome — better than most financial education achieves. But the design does not *secure* it. The quiz is structured as **passive reveal**: guess → see the answer → feel surprise → move on. Matuschak's core warning applies directly: the "aha" of the reveal produces the *feeling* of having learned without reliably changing what she does. Momentary surprise is not belief revision.
- **Active vs. passive:** The guess-commit is a *mild* active element (committing a prediction does create more durable surprise than passive reading — this is a real and good design choice). The synthesis questions ("which surprised you most," "what would you assume happened") are the strongest active-engagement move in the tool: the second question in particular asks her to surface her *own prior belief* and confront it, which is closer to genuine belief revision than anything else here. **But the synthesis answers go nowhere** — they are collected, then `finishSynthesis()` simply advances to the score. Her reflection isn't reflected back, connected to a reveal, or used to personalize the close. The most enabling moment in the tool is currently a dead end.
- **Illusion-of-understanding risk:** Moderate-to-high. The reveal format is *engineered to feel illuminating* ("oh, I had that wrong!"). That feeling is exactly the trap Matuschak names: it reads as success to both the user and the designer, but five surprises in a row can produce "I finally get how benefits work" with no corresponding change in what Dani does Monday morning. The score screen's "Knowing that changes how you move" *asserts* the capability change but does not *create* it.
- **What would make it enabling rather than informative:** The hooks are already in the data — every reveal has a concrete action latent in it (open a savings account, check your recert date, apply for WIC). The tool could convert "I learned a surprising number" into "here is the one thing this means for me" by using the synthesis answer (which already captures *which fact hit hardest*) to surface that fact's specific door on the closing screen. That is the difference between a quiz she enjoyed and a quiz that changed a future decision.
- **Finding: FLAG** — Informative, occasionally enabling, but the architecture stops one step short of durable. The synthesis collects engagement and then discards it; the close asserts capability change rather than enabling it. Not a Critical or High (the per-reveal facts are genuinely good), but the single highest-leverage *improvement* available. See Medium #6.

---

## What the Tool Does Well for This User

This is real and should not be lost in the findings:

1. **Every reveal absolves.** The system-blame framing is executed at the sentence level on all five questions, not bolted on. This is the brand's hardest principle and it's done well.
2. **Abandonment is lossless and value is front-loaded.** A tunneling user who quits after one question still leaves with one real, usable fact. This is the correct architecture for a scarcity user and it's rare.
3. **The welcome disarms the report-card reflex** ("No grades, no right answers") before the user can flinch.
4. **Sources on every figure, collapsed by default.** Honors calibrated distrust without taxing the user who just wants the number.
5. **Warm, honest cross-tool signposts** — including honesty about an unbuilt tool — that signpost rather than sell. Textbook Do No Harm.
6. **The questions are chosen for *this* user.** Savings-without-losing-SNAP, the cliff, WIC-you're-missing — these are not generic benefits trivia. They are the specific myths the persona is documented to hold, each pointing at money or access Dani can actually still get.
7. **The synthesis attempt at active reflection** is the right instinct even though it currently dead-ends.

---

## Critical Findings

_None._

## High Findings

### HIGH-1 — The score screen reads as a grade, contradicting the tool's own "no grades" promise
**What it is:** `{revealsSeen} of {totalQuestions}` renders at 2.5rem / weight 800 / terracotta in a centered card — the exact visual grammar of a test score — under the label "reveals seen." The welcome promised "No grades, no right answers."
**Why it matters for Dani:** She closed Mint because it felt like "a report card she didn't study for." A fraction less than 5/5 reads as *incomplete/failed* before the de-graded label is processed, and it specifically penalizes the scarcity-driven early exit the rest of the tool protects. It can retroactively reframe every "Lock in my guess" as a setup, collapsing the trust the reveals built.
**Solution space (not prescriptive):** De-emphasize or remove the bare fraction. Options: replace the number with the *content* of what she saw ("You saw the real figures behind 3 of benefits' most common myths" as prose, not a card); or, if a count stays, strip the test-card typography so it cannot be mistaken for a grade; or drop the numerator entirely and lead the screen with the integrating message ("Most of these gaps aren't about what any one person did...") which is already written and is the right close. The number is the only thing on this screen working against the tool.

### HIGH-2 — On Q4 and Q5, the guess/real comparison can land as personal shame before the structural absolution is read
**What it is:** For the two questions whose subject matter overlaps with the persona's own likely lived experience (losing a benefit to paperwork; missing WIC while on SNAP), the bold terracotta "The real number" comparison row renders *above* the structural explanation. The affective hit ("this happened to me / I'm probably missing out") arrives before "no one is required to tell you / these are administrative failures, not personal ones."
**Why it matters for Dani:** The persona explicitly names "benefits she may have missed" as a live fear. The structural copy is excellent — but order of operations matters under a bandwidth tax: the gap is felt before the absolution is read. This is the precise mechanism by which a well-intentioned reveal produces shame.
**Solution space:** Lead these two reveals with the system frame and the door, then show the figure — i.e., for the high-overlap questions, present the absolution/structural line *first*, or pair the comparison row with an immediately adjacent one-line system frame so the number never sits alone. Consider whether the "You guessed" row needs equal visual weight to "The real number" on these two; the contrast is what sharpens the "I underestimated my own situation" reading. (Note: this is a per-question sequencing/treatment change, not a rewrite — the copy that does the work already exists.)

## Medium Findings

### MEDIUM-3 — Five questions may exceed the device-and-moment budget
Five questions × two steps + synthesis + score is ~12 screens for a user with a 5–10 minute phone window, often in crisis mode. Front-loaded value mitigates this (she can quit anytime with gain), but consider whether 3–4 questions would deliver the same belief shift with less attrition, or whether the order should put the two most *actionable* reveals (savings, WIC) first so the highest-value facts land before bandwidth runs out.

### MEDIUM-4 — Q4 (paperwork) names the fix but gives no clickable door
Q4's signpost says "Knowing your deadline in advance is the fix" but has no `signpostUrl`. It is the one reveal most squarely about a *fixable* problem (procedural denial), yet it leaves the user without a link to RECERT-1 or a deadline tool. The locus-of-control payoff is asserted but not actionable here.

### MEDIUM-5 — The final score screen consolidates no cross-tool door
Bridges live only inside individual reveals. A user who tunneled past the in-reveal signpost boxes reaches a final screen whose only paths are "Back to Finxiety" and "Start over." The persona's requirement #7 (a door, not a mirror) is best honored by a consolidated "here's where to go next" on the closing screen — especially a single warm pointer to the Benefits Screener.

### MEDIUM-6 — The synthesis collects engagement, then discards it (Enabling Environment)
The synthesis questions are the tool's strongest active-engagement / belief-revision move, but the answers go nowhere — `finishSynthesis()` advances to a generic score. The "which surprised you most?" answer already identifies the fact that hit hardest; surfacing *that fact's* specific door on the closing screen would convert "I learned a surprising number" into "here's the one thing this means for me Monday." Highest-leverage path from *informative* to *enabling*.

---

## Sign-off

Two High findings remain (HIGH-1 score-screen-as-grade; HIGH-2 Q4/Q5 reveal sequencing). Both are fixable with copy/treatment/ordering changes, not redesign, and both sit on top of a tool whose underlying intent and reveal copy are genuinely strong. Because both are unresolved and each can re-introduce the exact shame the tool is built to prevent, behavioral sign-off is **withheld** pending their resolution (or a deliberate, documented PM decision to accept them).

⟦BEHAVIORAL-BLOCKED⟧ tool="MYTH-1" ticket="MYTH-1" date="2026-06-21"

Re-review trigger: resolution of HIGH-1 and HIGH-2 (Medium findings recommended but not blocking).

---

# Re-Review — 2026-06-21

**Trigger:** Both High findings reported fixed. Re-verified against current source.
**Files re-read:**
- `/Users/naomipinto/Documents/tsunam/finxiety/src/routes/tools/myth-quiz/+page.svelte`
- `/Users/naomipinto/Documents/tsunam/finxiety/src/lib/data/myth-quiz.ts`

## HIGH-1 — Score screen reads as a grade → RESOLVED

The grade-card is gone. There is no `.score-card` rule in the stylesheet, and no 2.5rem/800/terracotta fraction renders anywhere on the score screen.

The score screen (`+page.svelte` lines 397–413) now opens with the structural absolution as its primary close:
> `<h2 class="reveal-headline">Most of these gaps aren't about what any one person did.</h2>`
followed by the integrating body ("They're about how the systems are built... Knowing that changes how you move.").

The count survives only as a small, muted, secondary line — `<p class="score-tally">{revealsSeen} of {totalQuestions} reveals seen.</p>` (line 403), styled at lines 639–643 as `font-size: 0.875rem; color: var(--muted);` with **no bold weight and no terracotta**. It now reads as a quiet log of where she got to, not a grade — and because it sits *below* the structural headline, the first thing she reads is the absolution, not the fraction.

This closes the specific harm the finding named: a sub-5 fraction can no longer be read, in the typographic grammar of a test score, as *incomplete/failed* before the de-graded label is processed. It also closes the trust dip identified in the Trust arc — the ending no longer retroactively reframes "Lock in my guess" as a setup. The welcome's "No grades, no right answers" promise is now honored end-to-end. **Verified.**

## HIGH-2 — Q4/Q5 comparison lands as personal shame before absolution → RESOLVED

The `.compare` box has been moved below the headline and body. Current reveal order (`+page.svelte` lines 301–330):
1. `reveal-headline` (301)
2. `reveal-body` (302)
3. `reveal-note` if present (303–305)
4. `.compare` — guess vs. real (307–318)
5. `.why-box` — structural explanation (320–323)
6. `.signpost-box` (325–330)

The finding's mechanism was: the bold terracotta "real number" arrives *before* the user has been told the gap isn't her fault. Verified against the two high-overlap questions in the data file, the absolution now leads:

- **Q4 (paperwork):** the headline ("eligible families who lost benefits over paperwork") and body ("benefits lost despite full financial eligibility... procedural denials") deliver the system frame *above* the compare box. By the time the "You guessed / The real number" row appears, she has already read that this is an administrative failure, not eligibility.
- **Q5 (WIC):** the headline ("nearly half are missing it, even with SNAP") and body ("even though SNAP enrollment can fast-track WIC... only 56% of eligible people were enrolled") establish that missing WIC is *common and structural* before the discrepancy number lands.

For both questions, the number no longer sits alone at the top of the user's attention. The affective hit ("this happened to me / I'm probably missing out") now arrives *after* the framing that locates the cause in the system. This is exactly the absolution-before-discrepancy sequence the finding asked for, achieved through ordering rather than rewrite — the load-bearing copy already existed and now renders in the right order. **Verified.**

## Medium findings — status

MEDIUM-3 (length), MEDIUM-4 (Q4 has no clickable door), MEDIUM-5 (no consolidated bridge on the final screen), and MEDIUM-6 (synthesis collects engagement then discards it) were explicitly non-blocking and remain open. None re-introduce shame; they are impact/enabling-environment improvements, recommended but not required for sign-off. I note MEDIUM-6 in particular as the highest-leverage future improvement — the synthesis answer that already identifies the hardest-hitting fact could surface that fact's specific door on the close, converting "I learned a surprising number" into "here's the one thing this means for me." That remains for the PM to schedule; it does not gate this release.

## Sign-off

Both High findings are resolved with no regressions and no new Critical/High findings introduced. The fixes do exactly what was asked and nothing more: the score screen leads with absolution and demotes the count to a muted secondary line; the high-overlap reveals frame the system before they show the gap. The tool's underlying strengths (lossless abandonment, system-blame at the sentence level, sources on every figure, warm non-directive bridges) are intact.

⟦BEHAVIORAL-REVIEWED⟧ tool="MYTH-1" ticket="MYTH-1" date="2026-06-21"

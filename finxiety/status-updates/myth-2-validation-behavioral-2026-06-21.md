# Behavioral Science Review: MYTH-2 — Personal Finance Myth Quiz (extended)

**Persona applied:** ALICE Primary User (`finxiety/research-findings/persona-alice-primary-user.md`)
**Framework:** Socioeconomic Accessibility Framework (`finxiety/docs/socioeconomic-accessibility-framework.md`)
**Reviewer:** behavioral-science agent
**Date:** 2026-06-21
**Files reviewed:**
- `/Users/naomipinto/Documents/tsunam/finxiety/src/routes/tools/myth-quiz-2/+page.svelte`
- `/Users/naomipinto/Documents/tsunam/finxiety/src/lib/data/myth-quiz-2.ts` (all 10 `structuralExplanation` and `signpost` fields read in full)
- `/Users/naomipinto/Documents/tsunam/finxiety/src/app.css` (referenced via tokens)
- Prior gates: ⟦QA-VERIFIED⟧ (2026-06-21), ⟦BRAND-REVIEWED⟧ (2026-06-21)

---

## Summary judgment

MYTH-2 is a careful, well-built tool. Every `structuralExplanation` field correctly locates the gap in system design, policy, or information asymmetry — none blames the guesser. The score screen does the externalizing work the brand and QA gates credited it for. The cross-tool bridge is real and per-reveal, not bolted on at the end.

The behavioral risks that remain are not about any single string being wrong. They are about **length under scarcity**, **the emotional load of the tipping cluster landing on a tipped worker**, and **the gap between a quiz that informs and a tool that changes what the user can do** (Matuschak). Two findings rise to High. None is a Critical. I am withholding sign-off pending disposition of the two High findings — both have low-cost solution spaces and at least one (early reframe) is a copy-only change.

---

## Scarcity Mindset

- **Cognitive steps required:** 10 estimate-reveal cycles + 1 synthesis screen + 1 score screen = ~21 discrete screens, ~10 slider decisions. This is, as the ticket notes, **the longest flow in Finxiety.**
- **Tunneling risk:** Moderate. The per-question structure is itself low-burden — one slider, one prompt, one reveal, no working-memory carryover between questions (each reveal is self-contained; QA confirmed `revealsSeen` is the only cross-screen state and it's invisible to the user). That is correct design. The tunneling risk is not *within* a question; it is **completion under a short window.** The persona is explicit: Dani has "five to ten minutes, optimistic," often on a phone on a break or in a pickup line. A 21-screen flow is not completable in that window at a reflective pace. A scarcity-taxed user will either rush the back half (degrading the reveals into noise) or abandon mid-flow.
- **Present-bias risk:** Low-to-moderate. The quiz asks the user to *guess*, which is present-tense and concrete — good. But the **value of the tool is back-loaded**: the synthesis prompts ("which surprised you most," "what did this change") and the score-screen thesis ("these gaps aren't about what any one person did") are the behaviorally richest moments, and they only arrive after 10 questions. A user who abandons at question 5 never reaches the frame that makes the whole thing land. The most important message is gated behind the longest flow.
- **Finding:** **FLAG** — The per-question cognitive budget is appropriate; the *aggregate* length is not matched to the persona's documented window, and the payoff is back-loaded behind it. See Critical Finding #1 and #2.

---

## Financial Shame

- **Potential shame triggers reviewed (every reveal):**
  - **`tipping-service`** (tips track appearance, not service): Information, not blame. Safe. If anything, it relieves a shame a *tipped worker* might carry ("I must not be good enough at my job"). Net positive.
  - **`tipped-minimum`** ($2.13/hr, frozen since 1991): **Highest emotional-load reveal in the tool.** For Dani — or for the food-service workers the brand gate explicitly names as a distribution channel — this is not a neutral statistic. It can produce shock and anger, and it can produce a quieter, more dangerous response: *recognition without exit.* "Yes. That is my life. I already knew that." The `structuralExplanation` is excellent and fully system-blame ("This is a policy choice, not an oversight... heavily lobbied by the National Restaurant Association"). The blame is correctly placed on Congress and a lobby, never the worker. So the **shame architecture passes** — this does not read as a verdict about Dani. But the **affect architecture** (anger, fatigue, hopelessness) is unaddressed in this reveal, and the only signpost is to the Tip Calculator, which shows her *more* of the same bad news. See Critical Finding #3.
  - **`platform-tips`** (DoorDash tip drop): Same profile. System-blame is airtight ("the platform changed when you see the screen; workers absorbed the result"; "the intervention here wasn't the user's psychology — it was the company's product decision"). For a gig worker this is validating, not shaming, but it is heavy.
  - **`tax-refund`, `deduction-vs-credit`, `compound-direction`, `credit-score`, `rewards-myth`**: All clean. These are "the vocabulary is built to confuse you" reveals. They externalize correctly ("the same vocabulary covers both," "the mechanism is invisible by design," "credit scores are designed for lenders, not for individuals"). No shame surface.
  - **`emergency-fund`** (checking ≠ emergency fund): **Watch item, not a fail.** Dani, per the persona, has ~$150 in checking and $0 in designated savings. She "tried to open a savings account once" and had to drain it for a car battery. This reveal tells her that the money she has doesn't "count" as an emergency fund. The framing is purpose-based and non-judgmental ("the distinction is purpose, not location"), and it does *not* say "you should have one" — good. But the closing line, "Knowing the difference changes how you evaluate financial stability," combined with the signpost to the Emergency Fund Checker, risks routing her toward a tool whose near-zero result she has already lived. The reveal itself is safe; the *handoff* needs the same care EMG-1's own near-zero state got. Flag, not fail.
  - **`big-changes`** (small automatic actions beat big intentions): **The most shame-sensitive of the "neutral" reveals.** "Small, automatic actions like transferring $5 weekly... outperform large aspirational goals." For most users this is liberating. For Dani — who ends the month with $60–$140 and has unexpected expenses every six weeks — "just transfer $5 a week automatically" can read as *another* piece of advice that assumes a stability she doesn't have, the same way the 50/30/20 workshop did. The reveal's actual framing is better than that summary ("the barrier to progress is rarely knowledge of the right action — it's structure"), and it correctly avoids "you should." But the examples ($5 weekly, round-ups) are exactly the kind of small-but-still-not-zero amounts that can sting when zero is the honest number. See Critical Finding #4.
- **Result display:** There is no "score" in the evaluative sense. "X of 10 reveals seen" is genuinely non-graded — this is right and matches MYTH-1. The compare block ("You guessed X / The real number Y") shows guess vs. real **without** a correct/incorrect marker, no red/green, no checkmark/X. The `.compare-real` value is terracotta (brand accent), not a "wrong answer" red. **This passes the framework's "facts not grades" test cleanly.**
- **Implicit comparisons:** No "most people have," no "experts recommend X months," no benchmark the user is losing against. The one "most people" usages are in service of *myth identification* ("ten things most people believe"), which frames the user as in good company, not behind. Correct use.
- **Finding:** **FLAG** — Shame-by-direct-statement is well controlled across all 10 reveals; the system-blame standard is met everywhere. The residual risk is **shame-and-fatigue by accumulation** in the tipping cluster for the exact worker the tool is distributed to, and two reveals (`emergency-fund`, `big-changes`) whose handoffs need the near-zero care. Not a fail; specific, addressable.

---

## Trust

- **Trust-building elements:** No login, no email, no account (framework Dimension 3 — pass). Stateless. Starts immediately ("Start the quiz") with no gate. Sources are exposed per-reveal in a `<details>` — this is a strong trust signal: "here's where I got this, check me." Voice is human ("Tips mostly reward good service. How much of the research actually supports that?"). No product funnel — the signposts go to *other free Finxiety tools*, never to an advisor, a newsletter, or a paywall. The disclaimer ("Programs change. The official sources are the place to confirm what applies to you") models humility.
- **Trust-breaking elements:** Minor. The guess-then-reveal mechanic carries a small "gotcha" risk — a user who has been burned by financial systems may, on the first one or two questions, read "guess first, then we tell you you're wrong" as a setup to be made to feel stupid. The welcome copy ("No grades, no right answers") pre-empts this, and the first reveal's headline ("Decades of research say otherwise") points at *the research*, not the guesser. So the risk is largely mitigated by design. Watch only.
- **Trust arc:** Net positive. A user who completes the flow ends with *more* trust than they came in with, because the tool repeatedly sided with them against the systems ("the intervention wasn't your psychology — it was the company's product decision"). That is exactly the trust-repair move the persona calls for. The risk to the arc is not trust-breaking content; it's **non-completion** — a user who abandons at question 5 never reaches the score-screen thesis that completes the arc.
- **Finding:** **PASS** — Trust architecture is sound. The arc is strong *for users who finish.* The threat to it is length (covered under Scarcity), not any trust-breaking element.

---

## Locus of Control

- **Does the output feel actionable or verdictive?** Mixed, and this is the heart of the review. The *reveals* are diagnostic ("here is how the system is built against you"). Diagnosis of a system you cannot change is, for a user with an already-external locus of control, a double-edged thing: it can **relieve self-blame** ("it's not me, it's the system") — which is genuinely valuable and trauma-informed — or it can **confirm powerlessness** ("the system is built against me and there's nothing I can do"). Which one lands depends entirely on whether each reveal leaves a door.
- **Path forward:** Present but uneven. Every reveal has a signpost to another tool — that is a door. But the doors vary in quality:
  - **Strong doors** (the reveal points to a tool that gives the user *new actionable footing*): `deduction-vs-credit` → Tax Clarity ("enter a deduction or credit and see what it actually saves you"), `emergency-fund` → Emergency Fund Checker, `compound-direction` → Debt vs. Growth. These let the user *do* something with their own numbers next.
  - **Weak doors** (the reveal points to a tool that shows *more of the same systemic bad news*): `tipped-minimum` and `platform-tips` both signpost to the Tip Calculator — which will show a tipped worker, again, how little the floor is. For a user who is themselves a tipped worker, the door from "the system underpays you" opens into "here, see exactly how much the system underpays you." That is not a path forward; it's a deeper look at the wall. **This is the locus-of-control weak point.** The structural reveals about wages have no bridge to the *one tool that actually helps that user change her situation*: the benefits screener (BEN-1, when live) — a tipped worker at $2.13 + tips is very likely SNAP/Medicaid eligible. The suite has the right door; this tool doesn't open it.
- **Finding:** **FLAG** — Most reveals leave a usable door. The wage-cluster reveals (the heaviest, most anger-and-hopelessness-prone) leave the *weakest* doors, and miss the single most agency-restoring bridge in the suite (the benefits screener). See Critical Finding #3.

---

## Cross-Tool Bridge

- **Near-zero / worst-case state for this tool:** The "near-zero result" analog for a quiz is **the user who answers, in effect, "I already knew all of this."** A tipped worker, a gig worker, a single parent who has lived these facts does not experience the reveals as revelation — she experiences them as her Tuesday. For her, the quiz risks being a mirror, not a door: it confirms what she knows and changes nothing. The framework's Near-Zero Result Test question #4 — "would this user feel *more* informed and *more* capable, or less?" — is the one I am least confident the current build passes for this specific user. See Critical Finding #2.
- **Character of the bridges:** Informational, not directive — confirmed across all 10 `signpost` fields. Every signpost describes what a tool *shows*, never instructs the user to act. The `rewards-myth` signpost has already been revised per the brand gate (the current data file reads "Debt vs. Growth shows what compound interest looks like..." — the "is a start" nudge is gone; good). The signposts are warm handoffs, not ads.
- **The missing bridge:** Across all 10 reveals and the score screen, **there is no signpost to the benefits screener (BEN-1) anywhere in this tool**, even though three reveals (`tipping-service`, `tipped-minimum`, `platform-tips`) are precisely the situation in which a user is most likely to be eligible for benefits she doesn't know about — which is the persona's single most important unmet need ("She qualifies for SNAP but doesn't know it"). Every signpost in MYTH-2 routes to a *personal-finance clarity* tool (tip, tax, emergency fund, debt, compound). None routes to the *material-help* side of the suite. For the worst-case user, the clarity tools are the weak doors; the help tool is the strong one, and it's absent. (Note: if BEN-1 is not yet live, the bridge can still be named informationally as "Programs that help in situations like this include..." per framework Dimension 4 — its absence is a content gap, not a dependency block.)
- **Finding:** **FLAG** — Bridges are present, informational, and well-charactered. But the *suite-level* bridge — from "the system underpays you" to "here is the help you may not know you qualify for" — is missing from the exact reveals that most need it. This is the most consequential cross-tool gap in the tool.

---

## Enabling Environment (Matuschak)

- **Changed capability:** Partial. After MYTH-2, the user *knows* ten facts (a deduction ≠ a credit; checking ≠ an emergency fund; the tipped floor is $2.13). Knowing is not the same as new capability. The quiz is, mechanically, **passive reveal**: guess → see the answer → read why. Matuschak's specific warning applies directly — "showing someone the correct answer after they guess wrong doesn't revise a false belief; it produces momentary surprise." The guess step is good (it creates a prediction the reveal can violate, which is more active than pure exposition), but nothing asks the user to *use* the new model. The closest the tool comes to active engagement is the synthesis screen ("which surprised you most," "what did this change") — that is genuine active recall and is the most enabling moment in the tool. It arrives once, at the end, optional.
- **The after-the-tab question:** For the *deduction/credit*, *emergency-fund*, and *compound-direction* reveals, there is a plausible behavior change in 24 hours **only if the user crosses into the signposted tool** and runs her own numbers. The reveal alone will not change what she does. For the *wage* reveals, the honest after-the-tab answer for Dani is: nothing changes, because the reveal diagnoses a system she can't alter and points her at a tool that re-describes it. **The tool's enabling power is concentrated entirely in the cross-tool handoff, not in the quiz itself** — which makes the quality of each signpost the load-bearing element, and makes the missing benefits bridge (Finding #3) an *enabling-environment* failure, not just a locus-of-control one.
- **Active vs. passive:** Predominantly passive (reveal). The one active mechanic (guess) is good but shallow; the one genuinely active reflective moment (synthesis) is end-gated and optional.
- **Illusion-of-understanding risk:** **Present and worth naming.** The tool produces a strong *feeling* of "huh, I get it now" ten times in a row. Carmen Simon's memorability and Matuschak's enabling-environment lenses diverge here: the reveals are memorable and feel like understanding, but feeling-of-understanding without a change in what the user can *do* is exactly the failure mode Matuschak flags. The score-screen thesis ("knowing that changes how you move") **asserts** the capability change the tool does not, by itself, produce. That sentence is doing rhetorical work the mechanics don't back up.
- **Finding:** **FLAG** — The tool is informative. It is enabling *only* at the handoffs, and only for the reveals whose handoffs lead to a tool the user can act in. It is least enabling for the user who needs it most (the one who already knows the facts). The synthesis screen is the right instinct and should be weighted more heavily, not buried at the end.

---

## Critical Findings

Ordered by severity.

### 1. HIGH — The score-screen thesis ("these gaps aren't about what any one person did") is gated behind the longest flow in Finxiety.

**What it is:** The single most important, most trust-repairing, most locus-of-control-restoring sentence in the tool — "Most of these gaps aren't about what any one person did. They're about how the systems are built" — appears **only on the score screen, after all 10 questions.** A scarcity-taxed user on a 5–10 minute window (the persona's documented reality) has a high probability of abandoning before reaching it. The frame that makes the entire tool safe and meaningful is the part most users won't see.

**Why it matters for this user:** Dani arrives in a tunneled, time-poor state. If she completes three reveals and leaves, what she takes away is three pieces of bad news about systems stacked against her — *without* the framing that turns "the system is against me" (hopeless) into "this isn't your fault and it isn't yours to fix alone" (relieving). The protective frame must not be back-loaded behind a 21-screen flow.

**Solution space (low cost, copy/placement):** Surface the systemic frame **at or near the start** — a single line on the welcome screen or carried into the first reveal ("These are about how the systems are built, not about anything you did wrong"). This is the same move the persona's trust list calls for: "acknowledge the structural reality" early. The score-screen version can stay as the bookend. This is a copy + placement change, not a rebuild.

### 2. HIGH — No path out for the "I already knew all this" user (the near-zero result analog), and the enabling power depends entirely on a handoff that may not fire.

**What it is:** For the lived-experience user — a tipped worker, a gig worker, a single parent who has lived these facts — the quiz confirms what she knows and, on its own, changes nothing. The framework's Near-Zero Result Test #4 ("would she feel more capable, or less?") is at risk of failing for her. The tool's only mechanism for becoming *enabling* rather than merely *confirming* is the cross-tool signpost — and for the reveals most relevant to her (the wage cluster), the signpost leads to a tool that re-shows the bad news rather than opening a door to help.

**Why it matters for this user:** This is the persona's core user, not an edge case. A tool that confirms a powerless person's powerlessness, with no door, is the Do No Harm failure the framework names explicitly: "the user sees a gap they cannot close, has nowhere to go next, and is worse off for knowing." MYTH-2 does not fully fall into this — it has doors — but for *this* user the doors are the weak ones.

**Solution space:** (a) Fix the wage-cluster bridges per Finding #3 (add the benefits-screener / "programs that help in situations like this" door). (b) Consider weighting the synthesis screen earlier or making its reflective question (the genuinely active, enabling moment) more central rather than a terminal optional step. The combination converts "I already knew this" from a dead end into "I knew this *and here is the door I didn't know about*."

### 3. HIGH (folded into #2's disposition) — The heaviest reveals leave the weakest doors; the suite's strongest agency bridge (benefits) is absent.

**What it is:** `tipped-minimum` and `platform-tips` — the most anger/fatigue/hopelessness-prone reveals, distributed (per the brand gate) directly to food-service and gig-worker networks — both signpost *only* to the Tip Calculator, which shows the same user more of the same bad news. No reveal in the tool bridges to the benefits side of the suite, despite the wage reveals being the exact situation where the persona's #1 unmet need (undiscovered SNAP/Medicaid eligibility) lives.

**Why it matters:** This is where a structural-fact tool can do real material good: the worker who learns the floor is $2.13 is the worker most likely to qualify for help she doesn't know exists. Routing her to "see how low the floor is" instead of "here's help you may qualify for" inverts the agency move.

**Solution space:** Add an informational benefits bridge to the wage-cluster reveals (and/or the score screen). If BEN-1 is live, link it. If not, name it informationally per framework Dimension 4: "Workers earning at or near the tipped floor often qualify for programs they don't know about." Non-directive, no "you should." This is the highest-value single change in the review.

### 4. MEDIUM — Two reveals (`big-changes`, `emergency-fund`) use small-but-nonzero examples that can sting a $0 user, and hand off to tools whose near-zero state she's already lived.

**What it is:** `big-changes` cites "$5 weekly" and round-ups as the better path; `emergency-fund` tells the user her checking money "doesn't count." Both are framed non-judgmentally and avoid "you should." But for Dani ($60–$140 left at month-end, $0 designated savings, drained her one savings attempt for a car battery), "$5 a week" and "you don't have an emergency fund" are the register of the workshop she walked out of.

**Why it matters:** Lower-severity because the reveal copy itself is careful and the framing is structural ("the barrier is structure, not knowledge"). But the persona is specific about this exact trigger — advice scaled to a stability she doesn't have reads as "built for someone else."

**Solution space:** For `big-changes`, ensure the structural line ("the barrier to progress is rarely knowledge — it's structure") leads, and consider softening the dollar-specific example or framing it as illustrative, not prescriptive. For `emergency-fund`, mirror the near-zero care EMG-1's own result state received in its handoff. Low-cost copy review.

### 5. LOW — Illusion-of-understanding: the score screen asserts a capability change the mechanics don't produce.

**What it is:** "Knowing that changes how you move" claims behavior change that passive reveal alone rarely delivers (Matuschak). The brand gate already flagged this sentence to "monitor." From the enabling-environment lens it's a small overclaim, not a harm.

**Solution space:** Either soften ("Knowing that is a different place to stand") or — better — *earn* the claim by strengthening the active/handoff elements (#2, #3), at which point the sentence becomes true rather than aspirational.

---

## What the Tool Does Well for This User

This is a genuinely careful tool and the care shows. Honest accounting:

- **System-blame is airtight across all 10 reveals.** I read every `structuralExplanation`. Not one locates the gap in the user's behavior, knowledge, or choices. Congress, the National Restaurant Association, a platform's product team, lender-designed vocabulary, ad-funded framing — the actor is always the system. This is the hardest thing to get right and the tool gets it right ten times in a row.
- **No grading, genuinely.** "Reveals seen," not "correct." No red/green, no checkmarks, no benchmark the user loses against. The compare block shows guess-vs-real with zero evaluative marking. This passes the framework's central shame test cleanly.
- **The guess-first mechanic is more enabling than pure exposition.** Asking the user to predict before revealing creates a small active moment that plain telling wouldn't — the right instinct.
- **Per-reveal sources, exposed and checkable.** "Here's where I got this" is a real trust signal for a user with calibrated distrust.
- **No funnel.** Every door leads to another free tool, never to an advisor, an email capture, or a paywall. The tool never tries to convert the user into anything.
- **The tipping cluster relieves a real shame.** "Tips track appearance more than service" can lift a tipped worker's self-blame about her own earnings — a quietly valuable, trauma-informed move.
- **The synthesis screen is the right instinct.** "What did this change or confirm" validates both outcomes equally and is the most genuinely enabling moment in the tool. It deserves to be more central, not less.
- **No-login, stateless, phone-first, sources on every figure** — the trust-architecture fundamentals are all in place.

The findings above are not a verdict on the build quality. They are about matching a careful tool to the documented state of the user it's distributed to: time-poor, often the very worker the wage reveals describe, and in need of a door more than a mirror.

---

## Disposition

Two HIGH findings remain open (#1 early reframe; #2/#3 the missing benefits bridge and weak wage-cluster doors). Both have low-cost, copy-and-placement solution spaces; neither requires a rebuild. Per the framework, I withhold sign-off until they are addressed or accepted with deliberate rationale by the PM.

**Recommended minimum before distribution:**
1. Surface the "this isn't about what you did" systemic frame at the start, not only the end (#1).
2. Add an informational benefits bridge to the wage-cluster reveals and/or the score screen (#3) — the single highest-value change.

The MEDIUM (#4) and LOW (#5) findings can be handled in the same copy pass or accepted with rationale.

⟦BEHAVIORAL-BLOCKED⟧ tool="myth-quiz-2" ticket="MYTH-2" date="2026-06-21" blockers="2 HIGH: (1) systemic-frame thesis gated behind the full 10-question flow — the protective framing the longest-in-suite flow depends on is back-loaded past the persona's documented 5–10 min completion window; surface it early. (2) the 'I already knew this' near-zero user has no door, and the heaviest reveals (tipped-minimum, platform-tips) signpost only to the Tip Calculator (more of the same bad news) while the suite's strongest agency bridge — the benefits screener for SNAP/Medicaid eligibility, the persona's #1 unmet need — is absent from every reveal; add an informational benefits bridge to the wage cluster. Both are copy/placement changes, not rebuilds." open_lower="1 MEDIUM (small-nonzero examples in big-changes/emergency-fund can sting a $0 user; mirror EMG-1 near-zero handoff care), 1 LOW (score-screen 'changes how you move' overclaims capability the passive-reveal mechanics don't produce)."

---

## Re-verify — 2026-06-21

### H1 (Welcome systemic frame): Cleared
The welcome `<p class="estimate-note">` (`+page.svelte:163`) now reads "These gaps aren't about financial literacy — they're about how systems were built and what they don't explain. No grades, no right answers." This places the protective, externalizing frame *before* the user starts the flow, exactly where Finding #1 said it needed to live. The frame is no longer gated behind 10 questions; a scarcity-taxed user who abandons mid-flow has already received the "this isn't about you, it's about how systems were built" message up front. The score-screen bookend remains as reinforcement.

### H2 (Wage-cluster benefits signpost): Cleared
Both wage-cluster questions carry a `signpostNote` pointing to the Benefits Screener for SNAP/Medi-Cal: `tipped-minimum` (`myth-quiz-2.ts:133`) and `platform-tips` (`myth-quiz-2.ts:167`). The note is informational and non-directive — "Workers earning at or near the tipped minimum often qualify for programs like SNAP and Medi-Cal that aren't widely advertised. The Benefits Screener can check what's available based on income and household size." No "you should," no urgency; it names what exists. The template renders it inside `signpost-box` as `<p class="signpost-note">` with a link to `/tools/screener` (`+page.svelte:324–326`). This adds the suite's strongest agency bridge to the exact two reveals (the heaviest, most hopelessness-prone) that previously dead-ended at the Tip Calculator. The locus-of-control inversion called out in the prior review is resolved for the wage cluster.

### New findings (if any)
None at the HIGH/Critical level. Two cosmetic, non-blocking notes:
- The two `signpostNote` strings use inconsistent apostrophe escapes — `tipped-minimum` uses straight-quote escapes (`\'t` → `aren't`), `platform-tips` uses curly-quote escapes (`\’t` → `aren’t`). Both render correctly (the backslash before a non-special char is a no-op in JS); the only effect is a straight-vs-curly apostrophe mismatch between the two notes. Cosmetic, not behavioral — flag to brand/copy at next pass, not a blocker.
- The benefits signpost is now the one bridge in the tool that points to a not-yet-live route (`/tools/screener`, BEN-1 planned). The note's wording is informational ("can check what's available") rather than promising an immediate result, so a user who finds the destination not-yet-live is not misled into expecting an answer that isn't there — acceptable per framework Dimension 4 (the bridge may be named informationally before the tool is live). Worth confirming the route resolves gracefully at QA, but no behavioral harm in the copy itself.

⟦BEHAVIORAL-REVIEWED⟧ tool="myth-quiz-2" ticket="MYTH-2" date="2026-06-21"

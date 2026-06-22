# Behavioral Science Validation — COMPOUND-1 (The Compounding Effect)

**Date:** 2026-06-21
**Reviewer:** behavioral-science agent
**Persona applied:** ALICE Primary User (`finxiety/research-findings/persona-alice-primary-user.md`)
**Framework:** `finxiety/docs/socioeconomic-accessibility-framework.md`
**Files reviewed:**
- `finxiety/src/routes/tools/compound-interest/+page.svelte`
- `finxiety/src/lib/calculators/compound.ts`

Brand and QA passed prior to this gate.

---

## Summary

COMPOUND-1 is, of the Track 2 personal-finance tools, the one most structurally at risk of failing the ALICE user — not because of bad copy, but because of what the tool *is*. It is an investment-growth visualizer. Its core proposition assumes the user has money they can set aside and leave untouched for 5–30 years. That is precisely the thing Dani does not have, and the persona is explicit about it: she opened a savings account once, moved in $100, and pulled it back out three weeks later when her car battery died ("Her Financial Reality"). She has $0 in retirement and $0 in designated savings.

The build team has clearly anticipated this. The framing is careful, the "Can be 0" hints are present, estimates are labeled, the privacy signal is in the meta description, and the future-oriented number never appears as a grade. This is good work and it lifts the tool out of the worst failure modes.

But the tool still has **one High finding and two Medium findings** that, through the ALICE lens, prevent a clean sign-off as written. The central problem is **locus of control and the after-the-tab question**: for the user who has nothing to invest, this tool currently produces a beautiful curve about a life she isn't living, with no bridge to anything she *can* act on today. It is the church-workshop 50/30/20 problem in a nicer wrapper — accurate math that quietly tells her it was built for someone else.

**Disposition: ⟦BEHAVIORAL-BLOCKED⟧** — one High finding (locus of control / no path forward on the near-zero path) must be addressed or formally accepted with rationale before sign-off.

---

## Dimension 1: Cognitive Load Under Scarcity

- **Cognitive steps to first result:** Effectively one. Sensible defaults (rate 7%, horizon 20yr) are pre-filled; the user types one number and the chart appears reactively with no submit button. Good.
- **Inputs required for a result:** One (either starting amount *or* monthly addition). Well under the three-input ceiling.
- **Working memory burden:** None. Single screen, no carry-over between steps, no return visit required.
- **Present-bias / future-orientation:** This is the structural tension. The framework's Dimension 1 says plainly: "No future-oriented framing... Under scarcity, forward planning is cognitively taxed." This tool is *entirely* future-oriented — its subject is 5–30 years out. The time-horizon control (5/10/20/30 yr) literally asks the user to think in decades. For Dani in Scenario B (crisis, $47 in the account, rent in 9 days), this concept is close to cognitively inaccessible.
  - Mitigating factor: the tool does not *ask her to plan*. It shows how math behaves. The horizon buttons are exploration, not a commitment to save for 30 years. That distinction matters and it is the reason this is a flag, not a fail.

**Finding: FLAG.** Cognitive load is genuinely low and the build did well on step-count. But the *subject matter itself* is future-oriented in a way that is intrinsically taxing under scarcity. This cannot be fully engineered away — it is the nature of compound interest. It can be partially addressed by anchoring the tool to a smaller, nearer concept (see Medium finding 2).

---

## Dimension 2: Shame Architecture

- **Result display:** The headline future value reads as information, not a grade — "Estimated value after 20 years," prefixed with `~`, tagged "estimated," in neutral dark type. No red, no green, no icon, no verdict styling. The two-part breakdown ("You put in" / "Interest added") is descriptive, not evaluative.
- **Benchmarks:** None present. There is no "experts recommend you invest X" anywhere. The 7% default is framed as a historical average and explicitly hedged ("Past returns don't predict future results"). Correct.
- **"You should" language:** Absent. The callout describes how the math behaves; it never instructs.
- **Implicit comparison risk — the personalized callout (lines 356–360):** "In your numbers, the last {N} years add about $X in interest — more than the $Y from the first {M}." This is well-intentioned (show acceleration with the user's own numbers) and for a user with real inputs it is genuinely the "aha." But read it as Dani who entered **$10/month** because that is honestly what she might spare: the callout will compute a real but tiny figure, and the surrounding triumphant framing ("the more the back half outpaces the front") can land as a quiet mismatch — the tool is excited about an amount that doesn't change her life. This is not acute shame; it is the subtler "this was built for someone with more" signal the persona warns closes the tab ("Language that says 'your financial goals'... the assumption that she has more than one account"). Flag, not fail.
- **Entry framing shame check:** "Starting amount — What you're starting with. Can be 0." and "Monthly addition... Can be 0." These hints are the single most important shame-protective design choice in the tool. They pre-empt the "I have nothing to put here" flinch. Strong.

**Finding: PASS (with one flag).** No acute shame triggers. The result is information, not verdict, and the "Can be 0" hints actively protect the user. The one soft spot is the celebratory tone of the personalized callout when inputs are small — see Medium finding 1.

---

## Dimension 3: Trust Architecture

- **Trust-building elements:** No login, no email, no account, no submit funnel. Reactive result appears as you type. Copy sounds like a person ("money earning interest, and then that interest earning interest too"). Estimates are labeled at three points (headline tag, breakdown tag, results-note). Sources are real, external, and verifiable (Investor.gov, historical S&P data). The "Past returns don't predict future results" hedge appears twice. This is a high-trust build.
- **Privacy signal:** Present in the meta description ("Free, nothing saved") but **not visible on the page itself**. The framework (Dimension 3) says to "make it visible where trust is at stake." A meta description is invisible to the user in the browser. EMG-1 and peers surface the stateless promise on-page. This is a minor consistency gap.
- **Trust-breaking elements:** None of the classic ones (no upsell, no advisor CTA, no scarcity/urgency). The only latent risk: a 7%-default growth chart on a financial site can pattern-match to "investment product marketing" for a distrustful user. The heavy, repeated hedging mitigates this well.
- **Trust arc:** Starts neutral-to-cautious, ends higher for a user with something to enter. For the $0/$0 user it ends flat (no result, just an instruction) — neither gained nor lost, but a missed opportunity (see Dimension 4).

**Finding: PASS.** Trust architecture is strong. One Low finding: surface the "nothing saved" signal on-page, not only in metadata.

---

## Dimension 4: Locus of Control

- **Is the output actionable?** For the user who already invests or saves, yes — it clarifies a real mechanism. For Dani, the output is a number about a hypothetical she has no current means to enter. It risks reading exactly like the 50/30/20 workshop: accurate, clear, and about someone else's life.
- **The near-zero path (the most important state for this user):** When `principal = 0` and `monthly = 0`, `hasInputs` is false (line 23) and the tool shows only: "Enter a starting amount or a monthly addition, and a return above 0, to see the chart." This is the state most likely for a first-time ALICE visitor who arrives with nothing to model. **At this exact moment the tool offers no path forward of any kind.** It is a locked door with instructions to bring money she doesn't have. Per the framework: "A result with no path forward is a verdict." Here there isn't even a result — just a requirement she can't meet.
- **The cross-tool bridge:** The signpost footer (lines 389–394) links to EMG-1 and MYTH-1 and is well-written ("the same compound math runs in reverse on debt"). **But it sits below the results section and is only contextually meaningful once a result exists.** The user who enters nothing and bounces may never register it as *her* door. More importantly, the bridge points to EMG-1 and MYTH-1 but **not to BEN-1** — and BEN-1 (benefits screener) is the single most relevant next step for a user whose honest answer to "what can you set aside?" is "nothing right now." For Dani, the truthful path out of this tool is not "save more" — it's "you may qualify for support that frees up cash." That bridge is absent.

**Finding: FAIL (High).** The near-zero / empty-input path — the state most ALICE users will land in — ends at a requirement the user cannot satisfy, with no path forward surfaced *at that moment*. This is the locus-of-control failure mode the framework names explicitly. See High finding below.

---

## Dimension 5: Accessibility of Concepts

- **"Compound interest," "annual return," "principal/starting amount":** Each is defined in plain language inline. "Money earning interest, and then that interest earning interest too" is an excellent concept-level (not just word-level) definition. The Rule of 72 is named *and* explained.
- **Concept-accessibility risk:** "Annual return (%)" and the 7% S&P framing assume the user has a mental model of "investing money in the market." Dani has never had a 401k or a brokerage account. The hint does well to add "Use a lower rate for savings accounts" — this is the one bridge to her actual experience (a savings account), and it's good it's there.
- **Does the frame apply to a $0 user?** Partially. The inputs accept 0, but the *result* requires non-zero. So while the concept is explained accessibly, the tool's payoff is gated behind having something to model. A user with $0 in every realistic field gets the explanation but never the demonstration.

**Finding: PASS (with flag).** Concepts are well-translated. The residual issue is not vocabulary but *applicability* — covered under Dimension 4.

---

## The Near-Zero Result Test (mandatory)

Filled with Dani's reality — principal $0, monthly $0 (or the more honest "I genuinely have nothing to set aside right now"):

1. **Information or verdict?** Neither — it's a gate. No result renders.
2. **Path forward?** No. Only an instruction to enter money she doesn't have. The footer bridge exists but is positioned and worded for the post-result user, and omits BEN-1.
3. **Structural reality named?** No structural note appears on the empty path.
4. **More informed and capable, or less?** For the truest-to-persona user, **neutral-to-less** — she may conclude, again, that the helpful thing was for people with money. **This is the framework's stated bar for "not ready for distribution."**

The tool passes the Near-Zero Test for a user who can enter even a few dollars. It does **not** pass for the user who arrives with nothing — and that is a large share of the target population.

---

## Enabling Environment (Matuschak)

- **Changed capability:** For a user who can invest, yes — she may genuinely understand "interest earns interest" for the first time, and the personalized callout (acceleration in her own numbers) is real active engagement with the idea. That's a legitimate enabling moment.
- **After-the-tab question:** What is different for Dani in 24 hours? If she had nothing to enter: nothing. If she entered a small real number: she has seen a curve, felt a flicker of "huh," and likely closed the tab — the classic illusion-of-understanding risk. The math is intellectually clear without changing what she can *do* tomorrow, because the binding constraint isn't understanding compounding — it's having surplus to compound.
- **Active vs. passive:** The reactive typing and horizon toggles are mildly active. The callout asks her to locate herself in the numbers. Good. But there is no engagement that connects to an action within her reach.
- **Illusion-of-understanding risk:** Present and meaningful. "I finally get compound interest" feels like progress and changes nothing about her position. The tool's honest enabling move would be to connect the insight to the nearest thing she *can* act on — even a no-fee savings account, or the benefits screener that frees up the cash that makes any of this possible.

**Finding: FLAG.** Genuinely enabling for the funded user; at risk of producing clarity-without-capability for the ALICE user. The fix is the same bridge fix as Dimension 4.

---

## Critical Findings (ordered by severity)

### HIGH — 1. The empty/near-zero path is a locked door with no path forward
**What:** When the user enters nothing (the most likely ALICE first state), the tool renders only "Enter a starting amount or a monthly addition…" The cross-tool bridge that would give a path forward sits below the (non-existent) results and omits the most relevant destination, BEN-1.
**Why it matters for this user:** Dani's honest answer to "what can you set aside?" is often "nothing this month." The framework is explicit: a result with no path forward is a verdict, and the near-zero state must carry a bridge to what else exists. Right now the truest-to-persona user hits a requirement she can't meet and leaves — reinforcing "this was built for someone else," the exact pattern that closed Mint and the church workshop for her.
**Solution space (not a directive — options for the PM):**
- Make the empty-state message do real work: alongside the instruction, add an informational, non-directive bridge — e.g. a line acknowledging that "setting aside anything is hard when money is tight" and pointing to EMG-1 (what runway you have now) and **BEN-1 when live** (support that may free up cash). Keep it informational, not "you should."
- Add BEN-1 to the signpost footer's destinations.
- Consider rendering the footer/bridge regardless of `hasInputs` so the path exists before a result does.

### MEDIUM — 2. The celebratory callout can misfire on small, honest inputs
**What:** The personalized callout (lines 356–364) frames the second-half acceleration triumphantly ("the more the back half outpaces the front") regardless of magnitude. On a $10/month input it celebrates a life-irrelevant figure.
**Why it matters:** For a user primed to feel that financial tools aren't for her, enthusiasm about a trivial number reads as tone-deafness — soft shame, the "built for someone with more" signal. The persona warns this is a tab-closer.
**Solution space:** Keep the mechanism explanation; soften the celebratory framing so it teaches the *principle* without cheering the *amount*. The point is "this is how compounding behaves," not "look how much you'll have." Magnitude-neutral language protects the small-input user without weakening the lesson for the large-input one.

### MEDIUM — 3. Tool is intrinsically future-oriented with no near-term anchor
**What:** The entire subject sits 5–30 years out; the horizon control asks the user to think in decades. Under scarcity this is cognitively expensive and emotionally distant.
**Why it matters:** Framework Dimension 1 flags future-oriented framing directly. The persona is in the present; Scenario-B Dani cannot easily access "20 years from now."
**Solution space:** Anchor the tool to something nearer at least once — e.g. lead the explanation or callout with the smallest, soonest visible effect (what even one year does, or what compounding does on a modest savings-account rate), so the user gets a concrete near-term handhold before the decades view. This doesn't change the math; it changes the entry altitude.

### LOW — 4. "Nothing saved" privacy signal is not visible on-page
**What:** The stateless promise lives only in the meta description (line 153), invisible in the browser.
**Why it matters:** Framework Dimension 3: make the stateless promise visible where trust is at stake. Peers surface it on-page.
**Solution space:** Add a short on-page line (footer or near the form) — "This tool doesn't save your numbers or track you." — consistent with the rest of the suite.

---

## What the Tool Does Well for This User

- **The "Can be 0" hints** on both money fields are the strongest shame-protective choice in the build. They pre-empt the "I have nothing to put here" flinch before it can land.
- **One-input, no-submit, defaults-prefilled** flow keeps cognitive load genuinely low — completable in the few minutes Dani has.
- **Result is information, not a grade** — no red/green, no verdict styling, `~` and "estimated" tags throughout, no benchmark the user is "losing" against.
- **Triple-hedged estimates** and real, verifiable external sources build appropriate trust without overclaiming.
- **Concept-level (not just word-level) plain language** — "interest earning interest too" and an *explained* Rule of 72, not just a named one.
- **"Use a lower rate for savings accounts"** is a quiet, important bridge to the one financial vehicle Dani has actually touched.
- **The signpost footer copy itself** ("the same compound math runs in reverse on debt") is well-crafted; the issue is its placement and missing BEN-1 link, not its quality.

---

## Disposition

The tool is close, and the careful build choices are real. But the empty/near-zero path — the state most ALICE users will actually see — currently ends at a requirement the user cannot satisfy, with no path forward and no bridge to the tool (BEN-1) most relevant to her. That is the locus-of-control failure the framework treats as a distribution blocker.

Withholding sign-off pending resolution or deliberate, documented acceptance of HIGH finding #1. The two Medium and one Low findings should be weighed by the PM but are not, on their own, blockers.

⟦BEHAVIORAL-BLOCKED⟧ tool="compound-interest" ticket="COMPOUND-1" date="2026-06-21"

---

## Re-verification — 2026-06-21

**Reviewer:** behavioral-science agent
**Trigger:** Build team addressed HIGH finding #1 (empty/near-zero path had no path forward).
**File re-read:** `finxiety/src/routes/tools/compound-interest/+page.svelte`

### What was checked

The empty state (`{#if !hasInputs}`, lines 271–278) now renders a second paragraph below the existing instruction hint:

> "Don't have amounts to enter right now? **The Emergency Fund Checker** starts with what you have, and **the Benefits Screener** can check what programs are available."

Links resolve to `/tools/emergency-fund` (EMG-1) and `/tools/screener` (BEN-1). Both route directories confirmed present on disk.

### Verdict on HIGH finding #1 — RESOLVED

1. **Bridge now renders at the exact moment of need.** The signpost lives inside the `{#if !hasInputs}` block, so it appears precisely when the user arrives with nothing to model — the most-likely ALICE first state. It no longer sits only below a non-existent result. The locked-door problem is closed: the empty path now carries a door, not just a requirement.

2. **BEN-1 is present — the specific gap is filled.** The prior review's central objection was that the only bridge omitted the benefits screener, the single most relevant next step for a user whose honest answer to "what can you set aside?" is "nothing right now." "The Benefits Screener can check what programs are available" names BEN-1 by its function and points to `/tools/screener`. For Dani, this is the truthful path out — support that may free up cash, not "save more." Correct destination.

3. **EMG-1 is the right near-term anchor.** "Starts with what you have" meets the user where she is (checking-account reality, not a 30-year hypothetical) and partially softens the future-orientation tension noted in Medium finding #3, without restructuring the tool.

4. **Framing is informational, not directive.** The copy describes what each tool *does*; there is no "you should," no imperative, no urgency. The opening question ("Don't have amounts to enter right now?") normalizes the empty-handed state rather than treating it as a failure to meet a requirement. Satisfies Do No Harm (no recommendations) and reads as a warm signpost, not an ad. Pass.

The Near-Zero Result Test now passes for the user who arrives with nothing: she leaves with a path to two tools — one that works with what she has today (EMG-1) and one that may surface support that changes the underlying constraint (BEN-1) — instead of an instruction to bring money she doesn't have.

### Non-blocking findings (carried forward, unchanged)

- **MEDIUM #2** (celebratory callout can misfire on small honest inputs) — not addressed; non-blocking per PM disposition.
- **MEDIUM #3** (intrinsically future-oriented, no near-term anchor) — partially eased by the EMG-1 "starts with what you have" pointer in the new empty-state copy; non-blocking.
- **LOW #4** (privacy signal only in meta description, not on-page) — not addressed; non-blocking.

These remain open for the PM to weigh. None blocks distribution.

### Disposition

HIGH finding #1 is resolved. No Critical or High findings remain. Sign-off granted.

⟦BEHAVIORAL-REVIEWED⟧ tool="compound-interest" ticket="COMPOUND-1" date="2026-06-21"

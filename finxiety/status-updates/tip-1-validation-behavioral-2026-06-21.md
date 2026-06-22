# TIP-1 Behavioral Science Validation Gate — 2026-06-21

## Behavioral Science Review: Tip Calculator (TIP-1)
## Persona applied: ALICE Primary User (`finxiety/research-findings/persona-alice-primary-user.md`)

Reviewer: behavioral-science
Files reviewed:
- `finxiety/src/routes/tools/tip-calculator/+page.svelte` (full component + styles)
- `finxiety/src/lib/calculators/tip.ts`
- `finxiety/src/lib/data/tip-one-fair-wage-2026.json`
- Prior validation: `finxiety/status-updates/tip-1-validation-2026-06-17.md`
- Live cross-tool target: `finxiety/src/routes/tools/myth-quiz/+page.svelte`

This is a re-review at the validation gate. The 2026-06-17 behavioral pass was clean on
every axis except one High finding — the absence of a cross-tool bridge — which withheld
sign-off. This review confirms the prior findings still hold against the current code and
resolves the open High finding. Method: full source read (component, styles, calculator,
data file) plus confirmation of the live MYTH-1 route and its h1. The component is small and
its visual hierarchy is fully determined by DOM order plus inline styles, so source-level
findings are reliable; a live 375px screenshot pass is owned by QA/UX, who have both signed.

---

### Scarcity Mindset

- **Cognitive steps required: 1.** Bill amount is the first field, tip percentage the second
  (18% pre-selected), result block the third. A user can enter the bill, accept the default,
  and read the tip/total without scrolling past any context and without a submit step. The
  result is `$derived` and `aria-live="polite"` — it recomputes reactively. Single cognitive
  step, confirmed at the code level (no Calculate button, no second screen).
- **Tunneling risk (minor, unchanged from prior review):** the result block (lines 356-379)
  sits *between* the tip-percentage field and the party-size stepper. A diner splitting a
  check has to scroll past the result to reach "Split between." This is low severity — party
  size defaults to 1 and the per-person line is additive, not required — but if a layout
  revision happens, placing the split control adjacent to or above the result better matches
  the at-the-table task order. Not a blocker.
- **Present-bias risk: none.** The tool asks for nothing future-oriented. It is a present,
  tactical instrument used in the moment (at the table). This is the correct register for the
  point of use.
- **Finding: PASS.** Completes in one cognitive step; the answer is first; context (state,
  wage note, pre/post-tax toggle) all renders below the result and never gates the math.

### Financial Shame

- **Potential shame triggers — checklist, string by string:**
  - Results display as facts, not grades — PASS. Result block is a neutral `var(--surface)`
    background, bold numbers, no color judgment, no iconography, no grade.
  - No benchmarks unless the benchmark is the point — PASS. No "recommended %," no "average
    tip," no comparison to any standard anywhere.
  - No "you're behind" framing — PASS. No "most people," no "best practice," no "you should."
  - Historical one-liner ("The $2.13 federal tipped wage has been unchanged since 1991.") —
    PASS. A statement about policy stagnation, styled quieter (`--muted`, 0.8125rem), no
    second-person address, no implied ask.
  - One Fair Wage variant ("A tip here is additional income, not a wage substitute.") — PASS.
    Accurate; neither absolves nor obligates. States the wage fact and stops.
- **Result display (worst case — the low-tip result):** I re-traced $40 bill, 10% via "Other,"
  party 1. `calculateTip` returns tipAmount $4.00, total $44.00, perPerson null. The render is
  `$4.00` and `$44.00` in bold on a neutral surface — no icon, no color change, no comparative
  copy, no "low tip" signal of any kind. **Confirmed at the code level: there is no
  tip-reactive logic anywhere.** The wage note is driven only by state selection (lines 50-52,
  401-419); a 10% tip produces the identical wage context as a 25% tip. This is the single most
  important pass in the review — the low tip appears as a fact, never a verdict.
- **Implicit comparisons: none.** The preset row spans 15-25 with 18 pre-selected, so the
  visible band communicates "normal is 15-25." A Dani who can afford 10% enters it via "Other"
  (min 0, `placeholder="0"`, neutral SR label "Custom tip percentage," no friction, no "below
  recommended" warning). This is an accepted, unavoidable property of any preset design; the
  mitigation (equal weight, low default, frictionless un-stigmatized Other) is the correct one
  and is present.
- **Finding: PASS.** No copy string implies a correct tip amount. The low-tip result is plain
  information, with no mechanism anywhere that reacts to the size of the tip.

### Trust

- **Trust-building elements:** No login, no email, no account, no PII, fully client-side.
  Copy sounds like a person ("Split the check and see the actual math"), not a brochure. No
  product funnel, no upsell, no "talk to an advisor." A tip calculator inherently assumes the
  user has nothing, which makes it a low-shame entry point to the suite. Persona trust
  conditions #1, #2, #3, #4 satisfied.
- **DOL source link (re-examined):** Citing DOL Fact Sheet 15 backs a structural claim the
  tool makes about the law. It is styled quietly (`--muted`, small, below the note), opens in a
  new tab (`rel="noopener noreferrer"`, keeps her in the tool), and is a *citation, not a
  referral* — it does not send Dani to an agency to prove anything. For an ALICE user with
  calibrated distrust, a checkable source on a structural claim reads as "this tool is not
  making this up." Trust-positive.
- **Trust arc:** Net positive. Stateless, voice-forward, no funnel; the citation strengthens
  rather than costs trust.
- **Finding: PASS.**

### Locus of Control

- **Output: actionable/informational, not verdictive.** The wage note delivers genuinely new
  structural knowledge — that in most states the tip largely *is* the wage, set by a federal
  floor frozen since 1991 — and the copy places the agent of harm on "the law" and "employers"
  ("the law lets employers pay tipped workers as little as $2.13/hr"). The structural cause is
  named and located *outside* Dani. The note never uses "you," never implies an amount, never
  reacts to her tip. It explains how the system is built, not how she should respond. This
  matches persona trust condition #6.
- **Path forward:** For TIP-1 specifically, the "action" is correctly informational, not
  directive — there is no "fix the tipped wage" action to offer a diner, and the tool offers
  none. The onward path is the cross-tool bridge (see below), now present.
- **Residual phrase note (carried from prior review, not a blocker):** "with tips expected to
  make up the rest" carries a faint normative pull ("expected"). The surrounding sentence keeps
  the agent on the law and employer, and the note is spatially/temporally decoupled from tip
  entry, so this does not rise to a shame trigger. Worth a brand eye on a future copy pass;
  brand has already signed, having reviewed this exact line.
- **Finding: PASS.** Real structural information, no transfer of obligation. Locus of control
  preserved.

### Cross-Tool Bridge

- **Status: RESOLVED.** This was the sole High finding withholding sign-off on 2026-06-17.
  The bridge is now built. Lines 686-688:
  > "More on how financial systems work differently than most people assume:
  > [Benefits Myth-Check Quiz](/tools/myth-quiz) applies the same format to benefits programs."
- **Target verified live:** `src/routes/tools/myth-quiz/+page.svelte` exists as a substantive
  built tool (~18.6KB), not a placeholder. Its `<h1>` is "Benefits Myth-Check Quiz" (line 133),
  which matches the footer link text exactly — no recognition mismatch on arrival.
- **Character of the bridge: informational, not directive.** Styled as a quiet `role="note"` on
  `var(--surface)` with `var(--muted)` text (lines 992-1000), outside the `<form>`, below the
  toggle — quieter than the result, no button chrome, no urgency. It is a handoff, not an ad.
- **Honesty of the bridge:** It bridges on *method* ("applies the same format"), not on subject
  matter — an accurate through-line from what TIP-1 just taught (the tip is the wage; the system
  is not what most people assume) to MYTH-1's domain. This is the suite's most natural handoff
  for the user least likely to start at an eligibility screener. Persona condition #7 ("there's
  somewhere to go next") and framework Dimension 4 are now satisfied.
- **Finding: PASS.** Bridge present, live, honest, and appropriately quiet.

### Critical Findings

None. No Critical or High findings remain open.

- **Low (carried, non-blocking):** Result block sits between the tip field and the party
  stepper; a check-splitter scrolls past the result to reach "Split between." Layout-revision
  consideration only.
- **Low (carried, non-blocking, brand's domain):** "with tips expected to make up the rest"
  carries a faint normative pull. Not a shame trigger as constructed; flagged for a future copy
  pass. Brand has reviewed and signed this line as-is.

### Enabling Environment

- **Changed capability: YES, meaningfully.** After this tool, Dani understands that in most
  states the tip *is* the wage, not a bonus, and that the floor has been frozen since 1991. That
  is a revised mental model, not a retained number. It is stronger after-the-tab value than a
  calculator usually earns, because the fact is surprising and reframes a routine act she
  performs often.
- **After-the-tab question:** In 24 hours the dollar figure is gone (correctly — it was
  situational), but the structural fact has a real chance of persisting, reinforced by a
  repeated real-world trigger (every future check, every POS tip screen).
- **Active vs. passive:** Mostly passive reception of the wage fact; the active element is
  choosing her state, which personalizes the note (mild engagement). Acceptable for a
  calculator. The now-built MYTH-1 handoff is precisely the affordance that can convert the
  passive fact into active belief-revision — its presence upgrades this dimension relative to
  the prior review.
- **Illusion of understanding risk: LOW.** The fact is concrete and singular ("the tip is the
  wage; $2.13 since 1991"), not a vague feeling of clarity. Little room for "I get it now"
  without substance.
- **Finding: PASS.** Genuinely changes a mental model; low illusion-of-understanding risk.

### What the Tool Does Well for This User

- The low-tip result is handled exactly right: a fact, never a verdict, with zero tip-reactive
  logic anywhere in the code. This is the hardest thing to get right and it is right.
- The wage note places the agent of harm on the law and the employer, never the diner — the
  line between information and guilt, and it lands on the information side.
- 18% low-anchor default + equal-weight presets + a frictionless, un-stigmatized "Other" path
  is a textbook anti-anchoring design.
- It teaches something genuinely new and structural — rare for a calculator — without a single
  "you should."
- Stateless, no PII, person-voiced, no funnel: a clean, low-shame entry point to the suite, now
  with an honest door onward to MYTH-1.

---

### Verdict

PASS. No Critical, no High findings. The single High item that withheld the 2026-06-17
sign-off — the absent cross-tool bridge — is resolved: the MYTH-1 handoff is built, points to a
live and substantive tool, matches its destination's name exactly, and is styled as a quiet
handoff rather than an ad. Every prior clean pass (low-tip result, wage note, anchoring, trust,
locus of control, enabling environment) holds against the current code. Two Low, non-blocking
notes remain (result/stepper order; "expected" phrasing) and are documented for future polish.

⟦BEHAVIORAL-REVIEWED⟧ tool="tip-calculator" ticket="TIP-1" date="2026-06-21"

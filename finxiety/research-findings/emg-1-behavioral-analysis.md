---
type: behavioral-analysis
project: finxiety
tool: emergency-fund-checker
ticket: EMG-1
date: 2026-06-14
agent: behavioral-science
persona: finxiety/research-findings/persona-alice-primary-user.md
sign-off: "⟦BEHAVIORAL-REVIEWED⟧ tool=\"emergency-fund-checker\" ticket=\"EMG-1\" date=\"2026-06-14\""
---

## Behavioral Science Review: Emergency Fund Checker (EMG-1)
## Persona applied: ALICE Primary User (Dani, 34, single parent, $31,200/year, $0 designated savings)

---

### Scarcity Mindset

**Cognitive steps required:** Three inputs, one of which (designated savings) requires Dani to first parse a concept she may not hold. Two of the three are "enter $0 if you don't have one / if none" — effectively a single real number she knows (monthly essentials) plus two near-instant zeros. The math is done for her. Net: one genuine cognitive step (essentials), two trivial. Strong.

**Tunneling risk:** Low on input. One moderate risk on output: a tunneled user reads only the large bold number ("0 months") and leaves before the contextual note reframes it. The note is doing the de-shaming work, but it sits *below* the number that triggers the tunnel. Reading order matters under scarcity.

**Present-bias risk:** The entry question — "How many months of expenses can you cover *without income*?" — demands a future-oriented simulation (imagine income stops, project forward). That is precisely the executive-function task scarcity makes hard to access. Dani lives in "this month." Asking her to model a hypothetical income loss is the one place the tool reaches past her bandwidth. Minor, because she likely answers intuitively ("basically none"), but it's there.

**Finding: PASS** — Input load is genuinely low and respects constrained bandwidth. The only friction is the output ordering (number before reframe) and the hypothetical framing of the entry question.

---

### Financial Shame

**Potential shame triggers:**

- "**runway**" — borrowed from a world (startups, professionals with severance) Dani is not in. Mild signal the tool wasn't built for her.
- "Designated emergency savings" — names a thing she has tried and failed to maintain ($100 gone in three weeks). The label can read as "the thing responsible people have."
- The large bold "**0 months**" — see Result Display below.
- "Designating a separate savings account **is what changes that**" — borders on prescription; implies the fix is a choice she hasn't made.

**Result display:** "0 months" at font-weight 800, large, dark. The *intent* is honesty without a verdict — no red, no benchmark, no grade. But size and weight carry emotional charge independent of color. A large bold "0" is visually emphatic; it can read as an indictment rendered in neutral type. The absence of a 3–6 month benchmark is exactly right (removes the unreachable standard). But the typographic emphasis partially reintroduces the verdict the benchmark removal was meant to prevent.

**Implicit comparisons:** No explicit benchmark (excellent). One implicit one survives: "what financial guidance usually means when it says emergency fund" gestures at an external standard, even while declining to state the number. It's gentler than "experts recommend," but it still locates Dani relative to a norm.

**Finding: FLAG** — The copy discipline is strong and the benchmark omission is correct. But the bold-large "0 months" risks functioning as a grade through typography alone, and the reframe that softens it arrives *after* the eye has already landed on the number.

---

### Trust

**Trust-building elements:** "Free. Always." in the footer. No signup, no email gate, no product upsell. Plain-language hints. The refusal to show a 3–6 month benchmark is itself a trust signal — it says "we're not here to grade you." The contextual note naming the car-repair/medical-bill reality is the single biggest trust earner when it lands as understanding.

**Trust-breaking elements:** "runway" (signals wrong audience). The two-number framing ("true emergency fund" vs "total picture") could read as the tool gently telling her the better number (including checking) doesn't really count — which, while true, can feel like a trick that gives with one hand and takes with the other. The contextual note's "is what changes that" can tip from understanding into instruction.

**Trust arc:** Dani enters expecting confirmation of bad news. She gets it ("0 months"), but with no email captured, nothing sold, no scolding. If the contextual note lands as recognition, she leaves thinking "this one didn't try to sell me anything and it *got* it." If the note lands as a lecture, she leaves thinking "told me what I already know, then told me what I should've done." The arc is genuinely positive *conditional on the note's tone* and *conditional on her not bouncing off "runway" at the button.*

**Finding: PASS (conditional)** — The structural trust foundations (free, stateless, no upsell, no benchmark) are excellent and rare. Trust holds as long as the note reads as recognition and the language doesn't telegraph the wrong audience.

---

### Locus of Control

**Output as actionable vs. verdictive:** Leans verdictive. The tool tells Dani what her runway *is* and explains *why* checking doesn't count — but offers no lever she can pull. "Designating a separate savings account is what changes that" is the closest thing to a path, but it's a path she has already tried and that scarcity actively defeats (the $100 / car battery story). Telling someone with no slack that the solution is to set aside savings reinforces external locus: "the fix is a thing my circumstances won't let me do."

**Path forward:** Effectively absent. The tool ends at diagnosis. For an internal-locus user this is fine (they'll act). For Dani — external locus, correctly so — diagnosis-without-door confirms a condition she can't change. That's the helplessness-reinforcing pattern the framework warns against.

**Finding: FLAG** — The output is honest and well-framed but terminates at a verdict. The only "action" implied (designate savings) is the exact action her constraints defeat, which can deepen rather than relieve external locus.

---

### Cross-Tool Bridge

**Near-zero result state:** Absent. When designated savings = $0, the same contextual note appears with no signpost to anything else. The footer says "More tools coming soon" — that's a product roadmap note, not a bridge.

**What should be there:** Dani's "0 months" has a likely upstream cause: income too low to generate slack, and possibly unclaimed benefits (she qualifies for SNAP and doesn't know it). The most honest, non-advice bridge is informational: *"A near-zero runway is usually about how much is left over each month, not willpower. Tools that check whether you're leaving benefits unclaimed exist for that."* That is information ("tools like X exist"), not recommendation ("you should apply for SNAP"). It reframes the cause away from personal failure and points at a door — without crossing into advice.

**Finding: FLAG** — A near-zero result is the highest-value moment to offer a signpost, and the tool currently offers none. This is a missed bridge, not a harmful one.

---

### Answers to Specific Questions

**1. The entry frame ("How many months... without income?")** — Worth asking, but the framing is slightly mis-aimed. Dani knows the answer is ~zero, so the question isn't *informative* to her — its value is *legitimizing*: it tells her this is a real, named thing that's okay to not have much of. The risk is the "without income" hypothetical, which asks for future simulation under scarcity. It invites more than it alienates, but a present-tense framing ("If your income stopped, how long could you cover essentials?") asks the same thing with less abstraction.

**2. "Designated emergency savings" as a concept** — For someone who has never had one, the label alone is partially opaque and slightly shame-adjacent. The hint ("A savings account set aside only for emergencies. Enter $0 if you don't have one.") resolves the confusion *and* — crucially — the "Enter $0 if you don't have one" pre-normalizes having zero. That phrase is quietly excellent: it tells Dani upfront that $0 is an expected, anticipated answer, not a failure state. The label works *because* the hint defuses it.

**3. "0 months" in large bold text** — The philosophy (truthful, uncolored, no benchmark) is the right call. The *execution* (font-weight 800, large) is the problem. Bold and large are emphasis; emphasis on a zero reads as "look at how zero this is." The truthfulness doesn't require the volume. Dial the typographic emphasis down to match the "including checking" row, or let the contextual note share visual weight so the eye doesn't land on the zero in isolation.

**4. The contextual note** — It's the strongest and the riskiest copy in the tool. "Checking balances tend to cover the next irregular expense before you can use them as a safety net — car repair, medical bill, something that breaks without warning" is *recognition* — it names Dani's exact lived reality without blaming her. That earns trust. But "Designating a separate savings account **is what changes that**" pivots from naming a structural reality to prescribing the structural fix — and it edges into advice. Worse, it's advice she's tried. Keep the first two sentences verbatim and rework the last so it doesn't imply a lever she can simply pull.

**5. No path forward** — The most important miss in the review. For Dani, the tool confirms what she knew and then stops. Confirmation without a door is the definition of a verdict for an external-locus user. The fix isn't a recommendation — it's an informational signpost at near-zero.

**6. The trust arc** — Earns trust: free/always, no signup, no upsell, no benchmark to fail against, a contextual note that demonstrably understands her life. Breaks trust: "runway" (wrong-audience signal), the two-number structure if it reads as "your real number is worse than your hopeful number," and "is what changes that" if it reads as a gentle scold. Net positive arc, but fragile at the language layer.

**7. "Calculate my runway"** — "Runway" is the wrong word for Dani. It's startup/professional vocabulary (cash runway, severance runway) and presumes a person who operates with a planning horizon. Dani operates in triage, not runway. The word subtly signals the tool was built for someone else — a quiet trust leak at the exact moment she commits (the button). "Calculate" is also slightly clinical. Something plainer — "Show my months covered" / "See how long I'm covered" — uses the tool's own honest unit (months) and drops the borrowed metaphor. The h2 "Your runway" carries the same issue.

---

### Critical Findings
*(ordered by severity)*

There are **no Critical findings.** The tool does no harm in its current form.

1. **HIGH — No path forward at near-zero result.** For an external-locus user, diagnosis without a door reinforces helplessness. Dani learns what she already knew and the tool ends. *Why it matters:* she leaves with confirmation and no signal that her situation has structural causes (income, unclaimed benefits) or that other tools address them. *Solution space:* add an informational (not advisory) cross-tool signpost that appears when the runway is near-zero, framed as "tools like X exist" — ideally pointing toward a benefits-eligibility check, with copy that locates the cause in slack/structure, not willpower.

2. **HIGH — Bold-large "0 months" does unintended emotional work.** The benchmark was correctly removed to avoid a grade; typographic emphasis partially reintroduces one. *Why it matters:* a large bold zero can read as an indictment even in brand-neutral color, and it's the first thing she sees — before the de-shaming note. *Solution space:* reduce the emphasis on the zero case (match the second row's weight), and/or reorder so the contextual reframe shares the visual moment rather than following it.

3. **MEDIUM — "is what changes that" tips from recognition into advice.** *Why it matters:* it prescribes the exact action her constraints defeat, converting an understanding note into a subtle scold. *Solution space:* keep the first two sentences; rewrite the third to name *why* designating is structurally hard rather than instructing her to do it.

4. **MEDIUM — "runway" signals the wrong audience.** Appears in the button ("Calculate my runway") and results h2 ("Your runway"). *Why it matters:* a wrong-audience cue at the commit point and the result point is a trust leak. *Solution space:* replace with the tool's own honest unit — "months covered."

5. **LOW — Entry question's "without income" demands future simulation.** *Why it matters:* scarcity makes hypothetical projection costly. *Solution space:* present-tense conditional phrasing carries the same meaning with less abstraction.

6. **LOW — Reading order under tunneling.** The reframe sits below the trigger number. *Solution space:* addressed largely by fixing #2 (shared visual weight).

---

### What This Tool Gets Right for This User

- **"Enter $0 if you don't have one" pre-normalizes zero** before Dani answers. This is genuinely excellent trauma-informed design — it tells her upfront that her likely answer is expected, not a failure. This single choice is doing significant emotional work.
- **The benchmark omission (no "3–6 months").** Removing the unreachable standard removes the grade. This is the single best decision in the tool.
- **Brand-color bars, not traffic-light red/green.** Refuses to render her situation as a failing score.
- **The first two sentences of the contextual note** name Dani's exact lived reality (the irregular expense that eats the balance) without attributing it to her choices. This is the recognition that earns trust.
- **Stateless, free, no signup, no upsell.** The structural trust foundation is rare and correct, and directly answers a user who has been failed by financial products that wanted something from her.
- **Low cognitive load on input.** Three fields, two effectively pre-zeroed, math done for her. Respects constrained bandwidth.

---

⟦BEHAVIORAL-REVIEWED⟧ tool="emergency-fund-checker" ticket="EMG-1" date="2026-06-14"

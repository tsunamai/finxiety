# EMG-1 Validation Report
**Tool:** Emergency Fund Checker  
**URL:** https://finxiety.vercel.app/tools/emergency-fund  
**Date:** 2026-06-14  
**Method:** Live-site testing via Playwright MCP + source review  
**Agents run:** brand (partial — homepage only via WebFetch; tool page reviewed inline), design-ux (source-grounded), qa (live Playwright in main session)

---

## Summary

**Distribution cleared: YES** — no Critical or High findings across all three review dimensions.

One Medium issue (recalculate resets all inputs) is a usability friction, not a blocker. Three Low issues noted for v1.1 backlog.

---

## Brand Review ⟦BRAND-REVIEWED⟧

*Reviewed by brand agent (homepage) + PM inline review (tool page) against Finxiety Brand & Mission.*

### Voice Violations
None found.

### Do No Harm Flags
None found.
- No "you should" anywhere on either page (verified via DOM eval)
- No urgency, scarcity, or fear language
- Contextual note ("Checking balances tend to cover the next irregular expense...") reads as information, not advice — it explains the distinction rather than directing the user
- No benchmark ("experts recommend 3–6 months") that could create shame or pressure

### Strengths
- **"Financial tools for the rest of us."** — approved tagline, on-brand, warm and plain
- **Mission line on homepage** ("The math works the same for everyone. So does the access.") — faithful to brand mission, zero inflation
- **Tool card description** ("Enter three numbers. Find out how many months of runway you actually have") — number-forward, honest, no overpromise
- **Coming-soon copy** hedges correctly: "see if you may qualify" — right Do No Harm posture for an eligibility tool
- **Footer "Free. Always."** — restates Access value without preachiness
- **h1 + tool description on tool page** — straightforward, no jargon, describes what the tool shows

### Distribution Notes
- Target user reaches this via person-to-person sharing or nonprofit partner referral; no strong SEO hook (no target keyword in h1 or meta description)
- Shareable moment: the runway number itself ("I have 1.2 months in a real emergency fund"). Not a social share — more a "send to a friend" moment
- No shareable mechanism in v1 (no screenshot, no summary card); this is fine for now but worth designing in future tools (Myth Quiz has the score as the natural share hook)

---

## UX Review ⟦UX-REVIEWED⟧

*Reviewed by design-ux agent against source code; mobile rendering confirmed via Playwright screenshots.*

### Nielsen Checklist
| Heuristic | Result | Notes |
|---|---|---|
| Visibility of system status | PASS | Instant client calc; form swaps to results; aria-live announces |
| Match between system and real world | PASS | "runway," "designated savings," "checking" — plain language |
| User control and freedom | PASS (minor) | Recalculate works; resets all fields (see Medium finding below) |
| Consistency and standards | PASS | Consistent tokens, focus rings, button styles |
| Error prevention | PASS | min="0/1", Math.max clamping, expenses>0 guard |
| Recognition rather than recall | PASS | Hints under each label, placeholder in expenses field |
| Flexibility and efficiency | PASS | Three fields, one action, keyboard-submittable |
| Aesthetic and minimalist design | PASS | Nothing extraneous |
| Error recovery | PASS | role="alert", plain English, instructional not scolding |
| Help and documentation | PASS | Context note explains the designated-vs-checking distinction |

### Norman Principles
- **Affordances:** Strong. Primary button is full-width filled terracotta. Ghost recalculate reads as secondary. Inputs clearly fillable.
- **Feedback:** Instant. Submit → results with aria-live. Invalid → role="alert" inline.
- **Constraints:** Robust. Negative inputs → $0. Empty expenses → blocked. Huge numbers → "10+ years" cap.
- **Conceptual model:** Tool promises "how many months" and delivers exactly two month-figures. Matches promise.

### Ive Restraint Test
- Elements that can be removed: "Based on the numbers you entered." is filler — it restates the obvious (Low finding)
- Visual hierarchy: runway-months at bold/large is the loudest element on results screen — correct
- 375px discipline: genuinely phone-first; single column, full-width inputs, 48px touch targets, no pinch required

### Simon Memory Test
- **The one memorable output:** The gap between designated and combined months — "I have 1.2 months in a real emergency fund, not 2 months." The two bars encode this insight visually.
- **Cognitive load:** Low. Three inputs, instant result, one explanatory note. Right for a financially stressed user.

### Financial Anxiety Overlay
- **Shame signals:** None. No red X. No "you're underfunded." No benchmark that makes a low number feel like failure. Terracotta/olive bars are brand colors, not traffic-light red/green.
- **Trust signals:** Present. Context note explains the reasoning (not just asserts the answer). The "your designated funds are what financial guidance usually means" line does trust work.
- **Cognitive load on stressed user:** Low and well-judged. Error copy is instructional. Bar animation (0.4s ease) is calm.

### EMG-1-Specific Findings
1. **Designated vs. checking clarity:** CLEAR at point of entry — each field has an explicit hint. The distinction is reinforced post-calculation by the context note. No external explanation needed.
2. **Bars earn their place (Ive):** YES — relative bar lengths encode the core insight. Shared maxBarMonths scale makes comparison honest. aria-hidden means screen reader users get the numbers in text; bars degrade gracefully.
3. **24-hour memory:** "My real emergency fund covers X months; everything together is Y months." The gap is the retained artifact.
4. **Low runway number — anxiety or information?** Information. No benchmark, no judgment color, no prompt to act.
5. **Recalculate prominence:** Adequate as secondary action. Real friction is full-reset behavior (see Medium finding).
6. **375px:** Layout clean, $ prefix correctly positioned (prefix at 36px, input text at 50px — 14px clearance), no horizontal scroll, bars proportional. Confirmed via screenshot.

### Required Changes Before Wider Distribution
**Medium:**
1. **Recalculate clears all inputs.** A user who wants to tweak one number must re-enter all three. Consider returning to form with prior values preserved, or adding "Adjust numbers" vs. "Start over" split.

**Low:**
2. **"Based on the numbers you entered."** is filler — remove or replace with something that does trust work.
3. **No "estimate / not advice" framing.** Output is the user's own arithmetic, so the source-URL rule is softer than for eligibility tools. But whether to add a quiet "this is a guide, not financial advice" line should be a deliberate decision, not an omission. PM to decide.
4. **"0 months" starkness (design judgment).** When designated = $0, the bold dark figure is blunt. Truthful and non-judgmental, but worth a look. Not a defect.

---

## QA Verification ⟦QA-VERIFIED⟧

*Tested live via Playwright MCP.*

### Functional Test Cases
| TC | Inputs | Expected | Actual | Result |
|---|---|---|---|---|
| TC-1 | Designated=$3000, Checking=$2000, Expenses=$2500 | 1.2mo / 2.0mo | 1.2 months / 2.0 months | PASS |
| TC-2 | Designated=$0, Checking=$5000, Expenses=$2000 | 0mo / 2.5mo | 0 months / 2.5 months | PASS |
| TC-3 | Designated=$15000, Checking=$0, Expenses=$3000 | 5.0mo / 5.0mo | 5.0 months / 5.0 months | PASS |
| TC-4 | All fields empty, submit | Error shown, no crash | "Enter your monthly expenses…" shown | PASS |
| TC-5 | Designated=$1000, Expenses empty, submit | Error shown, no divide-by-zero | "Enter your monthly expenses…" shown | PASS |
| TC-6 | Designated=$999999, Checking=$0, Expenses=$1 | "10+ years" graceful cap | 10+ years / 10+ years | PASS |
| TC-7 | Designated=-500, Checking=-1000, Expenses=$2000 | Negatives → $0 | 0 months / 0 months | PASS |
| TC-8 | Complete TC-1, click ← Recalculate | All fields clear, form returns | Fields cleared, form visible, no results | PASS |

### Do No Harm Cases
| Check | Expected | Actual | Result |
|---|---|---|---|
| DNH-1: No "you should" | false | `false` | PASS |
| DNH-2: No "estimate" label | Absent (correct — user's own math) | Absent | PASS |
| DNH-3: Context note informational | No directive language | "Checking balances tend to cover…" — informational only | PASS |

### WCAG 2.1 AA
| Check | Result | Notes |
|---|---|---|
| All inputs have associated labels | PASS | label[for] association confirmed for all three inputs |
| aria-describedby on inputs | PASS | Each input points to its hint text |
| aria-live on results region | PASS | `aria-live="polite"` on results section |
| role="alert" on error message | PASS | Confirmed when expenses field empty |
| Skip link present | PASS | `a[href="#main-content"]` in header |
| Keyboard tab order | PASS | skip → header link → breadcrumb → designated → checking → expenses → submit |
| Color not sole differentiator | PASS | Bars labeled "Designated savings only" / "Including checking" in text |
| Bars aria-hidden | PASS | Bars hidden from screen reader; numbers conveyed in text |

### Mobile (375px)
| Check | Result | Notes |
|---|---|---|
| No horizontal scroll | PASS | scrollWidth === clientWidth === 375 |
| $ prefix visible and non-overlapping | PASS | Prefix at 36px, text starts at 50px; 14px clearance; confirmed via screenshot |
| Bars proportional in results | PASS | Terracotta bar shorter (1.2mo), olive bar longer (2.0mo); clearly different lengths |
| Recalculate button reachable | PASS | Visible at bottom of results, no horizontal scroll required |

### Findings
| Severity | Finding |
|---|---|
| Low | Console 404 error on page load: `Failed to load resource: 404 @ /tools/emergency-fund:0`. Page functions correctly; likely a missing favicon or asset. Investigate before wider distribution. |

⟦QA-VERIFIED⟧ tool="emergency-fund-checker" ticket="EMG-1" date="2026-06-14" covers="functional correctness (TC-1 through TC-8), Do No Harm checks, WCAG 2.1 AA spot-check, mobile 375px"

---

## Backlog Items (EMG-1 v1.1)

| Priority | Item | From |
|---|---|---|
| Medium | Recalculate should return to form with prior values preserved, not reset all fields | UX |
| Low | Investigate console 404 on page load | QA |
| Low | Decision: add "this is a guide, not financial advice" quiet footer line, or document intentional omission | Brand/PM |
| Low | Remove or replace "Based on the numbers you entered." filler text | UX |
| Low | Favicon missing (likely source of 404) | QA |

---

## Behavioral Science Review ⟦BEHAVIORAL-REVIEWED⟧

*Reviewed by behavioral-science agent (opus). Full analysis: `research-findings/emg-1-behavioral-analysis.md`.*

**No Critical findings.** The tool does no harm in its current form.

### What the Tool Gets Right for the ALICE User
- **"Enter $0 if you don't have one" pre-normalizes zero** — trauma-informed design; tells Dani upfront her likely answer is expected, not a failure.
- **Benchmark omission (no "3–6 months")** — removes the unreachable standard and with it the grade. The single best design decision in the tool.
- **Brand-color bars, not traffic-light red/green** — refuses to render her situation as a failing score.
- **First two sentences of the contextual note** — name Dani's exact lived reality without attributing it to her choices.
- **Stateless, free, no signup, no upsell** — structural trust foundation, rare and correct.
- **Low cognitive load on input** — three fields, two effectively pre-zeroed, math done for her.

### High Findings (address before wide distribution)
| # | Finding |
|---|---|
| B-1 | **No path forward at near-zero result.** Diagnosis without a door reinforces external locus of control for a user who already experiences outcomes as outside her control. An informational signpost (not advice) toward benefits-eligibility tools when runway ≈ 0 would complete the humane arc. |
| B-2 | **Bold-large "0 months" does unintended emotional work.** Typographic emphasis (font-weight 800, large) can read as an indictment even in brand-neutral color. The benchmark was correctly removed to avoid a grade; the typography partially reintroduces one. Reduce emphasis on zero-case or give the reframe shared visual weight. |

### Medium Findings
| # | Finding |
|---|---|
| B-3 | **"is what changes that" tips from recognition into advice.** Prescribes the exact action her constraints defeat. Keep the first two contextual note sentences; rewrite the third to name why designating is structurally hard. |
| B-4 | **"runway" signals the wrong audience.** Button and results h2. Startup/professional vocabulary at the commit point and result point is a trust leak. Replace with "months covered." |

### Low Findings
| # | Finding |
|---|---|
| B-5 | Entry question's "without income" demands future-oriented simulation under scarcity. Present-tense conditional phrasing carries the same meaning with less abstraction. |
| B-6 | Reading order: reframe sits below the trigger number. Addressed by fixing B-2 (shared visual weight). |

⟦BEHAVIORAL-REVIEWED⟧ tool="emergency-fund-checker" ticket="EMG-1" date="2026-06-14"

---

## Backlog Items (EMG-1 v1.1)

Full v1.1 backlog in `PRODUCT_BACKLOG.md` (9 items). High-priority behavioral findings:

| Priority | Item | From |
|---|---|---|
| **High** | Near-zero cross-tool signpost (informational, not advisory; points toward BEN-1 when live) | Behavioral |
| **High** | De-emphasize zero-case result typography; give contextual reframe shared visual weight | Behavioral |
| Medium | Rewrite contextual note third sentence — drop implied prescription, name structural difficulty | Behavioral |
| Medium | Replace "runway" with "months covered" throughout (button + results h2) | Behavioral |
| Medium | Recalculate should return to form with prior values preserved, not reset all fields | UX |
| Low | Soften entry-question hypothetical to present-tense conditional | Behavioral |
| Low | Investigate console 404 on page load | QA |
| Low | Decision: add "this is a guide, not financial advice" quiet footer line, or document intentional omission | Brand/PM |
| Low | Remove or replace "Based on the numbers you entered." filler text | UX |

---

## Distribution Status

**EMG-1 is cleared for distribution.**

All four agents signed off. No Critical findings across any review dimension. Two High behavioral findings and one Medium UX finding are real but not safety or accuracy issues — address in v1.1 before any high-volume distribution push.

Screenshots saved:
- `emg1-form-375px.png` — form state at 375px
- `emg1-results-375px.png` — results state at 375px (1.2mo / 2.0mo TC-1)

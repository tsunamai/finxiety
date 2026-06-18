# DOC-1 — Document Checklist Generator: Pre-Build Brand Review

**Gate:** Pre-build brand review (copy is brand-final before the engineer starts)
**Reviewer:** Brand & Marketing (Finxiety)
**Date:** 2026-06-17
**Scope:** All user-facing copy in the DOC-1 ticket (`finxiety/PRODUCT_BACKLOG.md`, DOC-1 section): step labels, helper copy, status labels, the checklist header framing, the "needed for" tags, the national-baseline banner, the "Take it with you" copy, and the out-of-scope handling of immigration-status documentation.
**Source of truth:** `../tsunam_vault/finxiety/Finxiety — Brand & Mission.md`

---

## Verdict: PROCEED WITH CHANGES

The copy is strong and largely on-voice. The header framing and the "Take it with you" microcopy are some of the best Do No Harm work in the backlog. Two changes are required before build, and a handful are recommended. None are large. Details below, with required items marked **[REQUIRED]** and optional items marked **[RECOMMEND]**.

---

## 1. Step labels and helper copy — PASS, with one tweak

The flow copy is plain, direct, and non-judgmental. It treats complexity as the tool's problem, not the user's, which is exactly the brand instruction.

- **"Which programs are you applying for?"** — Good. Plain question, no jargon. PASS.
- **Helper: "Pick all that apply. We'll build one document list that covers them all."** — Good. "We'll build... that covers them all" frames the de-dup feature as a relief, not a feature. On-voice. PASS.
- **"Which state are you applying in?"** — Good. PASS.
- **Helper: "Document requirements are set state by state. Right now we have full detail for California; for other states we'll show the national baseline."** — On-voice and honest about coverage. PASS. See section 6 on "national baseline" as a term; the helper is the right place to teach it before the banner uses it.
- **"Your document list"** — Good. Possessive "Your" gives ownership without inflation. Matches the brand's agency value. PASS.
- **"Take it with you"** — Good, warm, and human. Reads like a person handing you a folder, not a software export step. PASS. This is the right register for a stressful moment.

**[RECOMMEND]** Step 1 helper says "covers them all." Step 3 heading says "Your document list" (singular). These are consistent, but consider making the payoff explicit on the result heading for the multi-program case, e.g. a sub-line "One list for everything you picked." Optional; the current copy is fine.

---

## 2. Status labels (REQUIRED / IF THIS APPLIES TO YOU / CHOOSE ONE)

**[REQUIRED] Change "IF THIS APPLIES TO YOU" to "IF IT APPLIES."**

The PM's instinct is right. "IF THIS APPLIES TO YOU" is long and faintly clinical, and at 375px a long all-caps tag competes with the document name for line space. The phrase also points at the user ("...TO YOU"), which subtly frames the user as the variable. The condition lives on the document, not the person.

Recommended: **"IF IT APPLIES"** — shorter, reads as conditional, points at the document rather than the user. It pairs cleanly with the `condition_note` field already in the schema (e.g. "IF IT APPLIES" + "if anyone in your home is self-employed"), which carries the specificity so the tag does not have to.

Rejected alternatives, for the record:
- "SOMETIMES" — too vague; does not read as conditional-on-your-situation.
- "MAYBE" — reads as uncertainty about the requirement itself, not about whether it applies to this household. Wrong meaning.
- "IF NEEDED" — implies the user judges need; the condition is factual ("if you are self-employed"), not a judgment call.

**REQUIRED and CHOOSE ONE — PASS.** Both are short, plain, and accurate. "CHOOSE ONE" paired with the "Any one of these works" line is excellent: it actively prevents over-gathering, which is real Do No Harm work for a bandwidth-constrained user. Keep both.

**[REQUIRED] Casing note for the engineer / accessibility:** The status labels must read as ALL CAPS visually but be authored in the markup as normal-case text styled with `text-transform: uppercase`, not typed in capital letters. Screen readers may spell out typed all-caps strings letter by letter. The WCAG criterion in the ticket already requires these labels not be conveyed by color alone; this adds: not by visual casing alone either. The labels need a non-visual form (e.g. visually-hidden text or an `aria-label`). Flag to design-ux and QA; noting here because it is a copy-authoring decision.

---

## 3. Header framing copy — PASS. This hits the Do No Harm bar correctly.

> "These are the documents commonly requested for the programs you picked. Your county may ask for something slightly different. This is a guide, not the official list."

This is the strongest copy in the ticket. It does three things the brand requires, in order:
1. **States what the tool shows** ("commonly requested"), not what the user must have.
2. **Externalizes variance** ("Your county may ask"), so a mismatch later is the county's variation, not the user's mistake.
3. **Disclaims authority** ("a guide, not the official list") and routes to the official source.

**On "commonly requested" specifically:** it works, and it is the correct word. It does not oversell ("required," "you will need") and it does not undersell ("might possibly sometimes"). It is the honest, defensible claim: these are the documents agencies commonly ask for. It is the same register as BEN-1's "may qualify" framing, which passed and shipped. Keep "commonly requested" verbatim throughout. Do not let it drift to "required" or "you'll need" anywhere downstream (see section 8).

**[RECOMMEND]** "slightly different" — the word "slightly" makes a quiet promise that the variance is small. For most items it is, but county practice can diverge more than "slightly" for some documents. Consider dropping "slightly": "Your county may ask for something different." Cleaner, and it does not under-promise the variance. Optional, low-stakes.

---

## 4. "Take it with you" copy — PASS. Warm and respectful of the moment.

> "Copy this list" / "Copied. Paste it into your notes or a message to yourself."

This respects the stressed, late-night, phone-first user well. "A message to yourself" is a genuinely good detail: it names the actual behavior (text yourself the list) that this user does, instead of an abstract "saved to clipboard." It assumes the user is competent and busy, not confused. On-voice. PASS.

- **"Copy this list"** — Good. Plain verb, plain object. PASS.
- **"Print"** — Good. One word, no embellishment. PASS.
- **"Copied. Paste it into your notes or a message to yourself."** — Good. The period after "Copied." gives a clean beat of confirmation before the next instruction. PASS.

**[RECOMMEND]** Consider one trailing reassurance that nothing was sent anywhere, since a no-PII tool's trust is partly earned by saying so: "Copied. It stays on your phone. Paste it into your notes or a message to yourself." This reinforces the stateless/no-storage promise at the exact moment the user is wondering where their list went. Optional but well-aligned with the trust-deficit note in `finxiety/CLAUDE.md`. If kept short is preferred, leave as-is; the current copy passes.

---

## 5. "Needed for" tag — full program names vs. short tags

**Brand recommendation: use the full plain-language program labels, the same ones used everywhere else in the tool.** "needed for CalFresh and Medi-Cal." This resolves the PM's open question in favor of the ticket's stated default.

Reasoning:
- **Consistency with the established voice rule.** BEN-1's brand review praised that "every program name is self-translating" and "no acronym ships naked." DOC-1 already commits to plain labels with the acronym in parentheses at selection ("SNAP (CalFresh)"). The tag should match the word the user just selected. A user who picked "SNAP (CalFresh)" and then sees a short code or bare acronym in the tag has to re-translate. That is the user doing the tool's work.
- **In CA, use the program of administration name the user will actually see on the agency site.** In California the user applies through CalFresh and Medi-Cal, so "needed for CalFresh and Medi-Cal" matches BenefitsCal and reduces friction at the official source. For non-CA (federal baseline), use the federal names the user will see there: "needed for SNAP and Medicaid." Tie the tag's program name to the same state context that drives the rest of the list. This is one rule, applied per state, not two conventions.
- **Length is not a real objection.** The tag sits on its own line under the item description in the mobile layout; full names fit. If a four-program tag ("needed for CalFresh, Medi-Cal, HEAP, and CalEITC") gets long, that is a layout problem for design-ux, not a reason to abbreviate into jargon. Do not solve a layout problem by degrading the language.

**[REQUIRED] One naming rule to lock before build:** the "needed for" tag, the selection labels, the divergence notes, the official-source footer, and the clipboard payload must all use the identical program string for a given program in a given state. Pick the string once (per state context) and source it from one field in `doc-requirements.json` (`programs.<id>.label` for the federal baseline; the CA label in the override). No hand-typed program names in the Svelte file. This prevents "Medi-Cal" in one place and "Medicaid (Medi-Cal)" in another. The "and" serial formatting ("CalFresh and Medi-Cal" for two; "CalFresh, Medi-Cal, and HEAP" for three-plus, Oxford comma) should be one shared formatter, not authored per item.

---

## 6. National baseline banner — PASS, with a wording fix

> "Showing the national baseline. Your state may ask for something different — check the official link for each program below."

**[REQUIRED] Remove the em dash.** Brand and house style: no em dashes in user-facing copy. Rewrite as two sentences: **"Showing the national baseline. Your state may ask for something different. Check the official link for each program below."** This is non-negotiable per the writing-style rule; flagging it as REQUIRED so it does not slip into the build.

**On "national baseline" as a term:** it is borderline jargon, but it is acceptable here for two reasons. First, the Step 2 helper has already taught it ("for other states we'll show the national baseline"), so by the time the banner appears the user has met the phrase. Second, it is honest and short; the alternatives ("federal default," "general requirements") are either more jargon or less precise. Keep it, but only because the helper primes it. If the helper copy changes and stops introducing the term, the banner must reintroduce it.

**[RECOMMEND]** Consider opening the banner with the plainer half first: "Your state may ask for something different. This is the national baseline. Check the official link for each program below." Leading with the user-relevant fact ("your state may ask for something different") before the term-of-art reads slightly warmer. Optional.

---

## 7. Out-of-scope check: immigration-status documentation — PASS. No copy surfaces it.

I checked every user-facing string in the ticket for any phrasing that could imply, ask about, or surface immigration or citizenship status. None does. Specifically:
- The category set is **Identity, Income, Residency, Household composition, Program-specific.** "Identity" is framed as "Government-issued photo ID... driver's license, state ID, or passport" — none of which is citizenship-coded language, and the description does not say "proof of citizenship" or "immigration documents."
- No helper, banner, header, or tag references status, citizenship, eligibility-by-status, or "lawful presence."
- The header's "This is a guide, not the official list" plus the per-program official-source links is the correct and only channel for a user to encounter status questions, which is exactly the ticket's stated handling. Good.

**[REQUIRED] One guardrail to write into the engineer brief and the research-compilation note, so it does not regress during data compilation:** the `doc-requirements.json` content must not introduce a status-coded document item under any category, even at the federal baseline. Two specific traps to avoid in the compiled data:
- An "Identity" item worded as "proof of citizenship or immigration status" or "Social Security card / immigration document." If an SSN is genuinely a commonly-requested item for a program (it is for EITC), it must be worded narrowly to the tax-filing purpose ("Social Security numbers for everyone you claim, for your tax return") and must not generalize into a status inquiry. The EITC SSN item in the ticket already does this correctly; the guardrail is to keep it that way across all four programs.
- A divergence note that explains a status-based difference. None should exist in v1 data.

Because the compiled data is the part of DOC-1 not yet written, this is the place the deliberate exclusion is most likely to leak back in. Behavioral-science should re-check the compiled `doc-requirements.json` at the validation gate, per the ticket's own note that this exclusion is revisited "only with dedicated research and a behavioral + brand review." Flagging now so the data is compiled to that bar from the start, not patched after.

---

## 8. Do No Harm check: no copy slides toward "you must have" / "you will be asked for"

I swept the ticket copy for any phrasing that overstates the claim from "commonly requested" to "required in your case." Findings:

- **Header, banner, helpers, "Take it with you"** — all use "commonly requested," "may ask," "a guide." Clean. PASS.
- **Status label "REQUIRED"** — this is the one place the word "required" appears, and it is acceptable, because it describes the document's status *within the program's stated requirements*, not a verdict on the user's specific case. The header already scopes the whole list as "commonly requested... a guide, not the official list." So "REQUIRED" reads as "this program lists this as required," not "you personally will be denied without it." The framing layer carries the hedge so the item label can be terse. PASS, but with one guardrail below.

**[REQUIRED] Guardrail on the clipboard payload.** The header's "commonly requested / a guide, not the official list" hedge lives on the screen. When the user copies the list to plain text and pastes it into a message to themselves, the de-duplicated items travel but the screen header may not. A bare text list titled "Your document list" with items marked "REQUIRED" reads, out of context, as "you must have these" — the exact claim we cannot back. **The clipboard payload must lead with a one-line hedge** so the copied artifact carries its own framing. Recommended first line of the copied text:

```
Documents commonly requested for: CalFresh, Medi-Cal. This is a guide, not the official list. Confirm with each program's official site.
```

Followed by the grouped items. This is a Do No Harm requirement, not a nicety: the copied list is the artifact the user acts on days later, away from the page. It must not read as a mandate. Add to acceptance criteria.

**[RECOMMEND]** Within the divergence notes, the phrasing "HEAP specifically needs a recent energy or utility bill" uses "needs." In context (explaining why one bill covers two programs) it is fine and reads as helpful, not as a personal mandate. No change required, but keep "needs" scoped to the program ("HEAP needs...") and never to the user ("you need..."). The current note does this correctly.

---

## Voice Violations
- None blocking. One em dash to remove (section 6) and one long/clinical status label to shorten (section 2). Both marked REQUIRED.

## Do No Harm Flags
- The clipboard payload must carry its own hedge (section 8) — **[REQUIRED]**, because the copied artifact outlives the on-screen framing.
- The compiled `doc-requirements.json` must not reintroduce status-coded items via the data layer (section 7) — **[REQUIRED]** guardrail for the research/compilation step.

## Strengths
- **The header framing is model Do No Harm copy.** "A guide, not the official list" plus externalized county variance is exactly the brand's standard, executed cleanly.
- **"CHOOSE ONE" + "Any one of these works"** actively reduces over-gathering. This is the brand's "treat complexity as our problem" value doing real work for a bandwidth-constrained user.
- **"Paste it into ... a message to yourself"** names the real behavior of the real user. Warm, specific, competent. Best microcopy in the ticket.
- **The two-field input surface** (programs + state only, no income/household) is itself a brand-aligned decision: the tool does not interrogate the user for a documentation task. The ticket correctly names this a scarcity-bandwidth choice. It also keeps DOC-1 from feeling like an eligibility screener, which preserves the clean handoff to BEN-1.

## Distribution Notes
- **Who finds this first:** Like BEN-1, this is a partner-and-SEO tool, not an organic-share tool. Primary discovery: county-agency and nonprofit referral (a caseworker or 211 operator saying "here's a list of what to bring"), and SEO on intent terms like "what documents do I need for CalFresh and Medi-Cal" / "documents to apply for Medi-Cal California." The plain-language program names in the page title and meta description will carry that long-tail search well, the same pattern that worked for BEN-1. Make sure the page `<title>` and meta name the programs by both the federal and CA names so both search phrasings match.
- **Shareable moment:** low, and that is correct. A document checklist is private and utilitarian. Do not design a share affordance for the list. The shareable surface is the cross-link out to the Myth-Check Quiz, the same routing BEN-1 uses.
- **Cross-tool handoffs:** the ticket links the footer to BEN-1 ("to check what they may qualify for") and RECERT-1 ("which reuses this checklist for recertification"). Both are warm, relevant handoffs, not ads. One brand note for the engineer: write these as descriptive next-steps, not directives. Good model: "Not sure which programs to apply for? The Benefits Screener shows what you may qualify for." Avoid: "You should check your eligibility first." Keep the BEN-1 register, which passed review.
- **One distribution-and-trust win to preserve:** the "it stays on your phone" reassurance suggested in section 4, if adopted, doubles as a quiet trust signal that supports partner adoption. Caseworkers recommend tools they trust with their clients' privacy; a tool that visibly stores nothing is easier to recommend.

---

## Required changes before build (summary)
1. Status label: **"IF THIS APPLIES TO YOU" → "IF IT APPLIES."** (section 2)
2. Status labels authored normal-case + styled uppercase, with a non-visual form; not typed in caps. (section 2)
3. National-baseline banner: **remove the em dash**, split into two sentences. (section 6)
4. "Needed for" tag, selection labels, divergence notes, footer, and clipboard all source the program string from one data field per state context; one shared serial formatter. (section 5)
5. Clipboard payload **leads with a one-line "commonly requested / a guide" hedge.** Add to acceptance criteria. (section 8)
6. Engineer brief + research-compilation note carry the guardrail that no status-coded document item enters `doc-requirements.json`. (section 7)

Recommended (non-blocking): drop "slightly" from the header (section 3); add "It stays on your phone" to the copy confirmation (section 4); lead the banner with the user-relevant half (section 6).

With the six required changes folded in, the copy passes voice and Do No Harm.

**PROCEED WITH CHANGES.**

(No ⟦BRAND-REVIEWED⟧ sign-off yet: this is a pre-build review and two changes are Do No Harm gating. The build sign-off comes at the post-build validation gate, after the required changes are present in the implementation and the compiled data is checked.)

---
---

# DOC-1 — Document Checklist Generator: Pre-Build UX Review

**Gate:** Pre-build design/UX review (interaction design locked before the engineer starts)
**Reviewer:** Design & UX (Finxiety)
**Date:** 2026-06-17
**Reference patterns read:** EMG-1 (`emergency-fund/+page.svelte`, 2-step), BEN-1 screener (`screener/+page.svelte`, 2-step with native checkbox fieldset + focus management), TIP-1 (`tip-calculator/+page.svelte`, single live-updating form with segmented radiogroup + roving tabindex). No print styles exist in `app.css` today.
**Note on the status labels:** I adopt the brand decision above — the conditional label is **"IF IT APPLIES"** (not "IF THIS APPLIES TO YOU"), and all status labels are authored normal-case and styled with `text-transform: uppercase`, never typed in caps. My WCAG notes (Q10) build on the brand's casing/accessibility flag rather than restating it.

## UX Review: Document Checklist Generator — Full Flow

This is a pre-build review. The brief's questions are answered in order, then folded into the standard review format with the required-changes list at the end.

### Nielsen Checklist (against the proposed flow)

| Heuristic | Verdict | Note |
|---|---|---|
| Visibility of system status | PASS w/ change | List renders instantly on static data; needs a copy-confirmation (announced) and the "national baseline" banner so the user knows which dataset they got. |
| Match system / real world | PASS | "Which programs are you applying for?", plain labels with acronym in parens. Keep "needed for CalFresh and Medi-Cal" wording. |
| User control and freedom | PASS w/ change | User must change programs/state without losing their place. See collapse-to-one-input-screen (Q1). |
| Consistency and standards | PASS w/ change | Reuse `.field`, `.input-prefix-wrap`, `select`, breadcrumb, and the screener checkbox pattern verbatim. Do not invent a control. |
| Error prevention | PASS | "Show my list" disabled until >=1 program AND a state chosen. No free text. Static data cannot produce a bad number. |
| Recognition not recall | FAIL (as specced) | A 3-screen wizard makes the user hold "which programs did I pick" across screens while the payoff (the list) is what they came for. Collapse the inputs (Q1). |
| Flexibility and efficiency | PASS w/ change | A user arriving from BEN-1 or RECERT-1 should reach the list in one screen, not click Next twice. |
| Aesthetic / minimalist | PASS w/ change | Each item carries four metadata pieces. Restraint work required (Q3). |
| Recognize/recover from errors | NA | No user-entered values to validate; only the empty-state edge (Q8). |
| Help and documentation | PASS | Guide-not-official-list header + per-program source URLs is the right level. |

### Norman Principles

- **Affordances:** Checkboxes read "pick several"; a segmented radiogroup reads "pick one." Because programs are multi-select, the control MUST look multi-select. Native checkboxes (already styled in the screener) are the honest affordance. Do NOT reuse the TIP-1 segmented radiogroup here — it signals single-choice and users will think picking program B deselects program A.
- **Feedback:** Copy action needs visible AND announced confirmation (brand-final copy: "Copied. Paste it into your notes or a message to yourself."). Print needs no confirmation (the OS print dialog is the feedback). The list appearing is the feedback for the input step.
- **Constraints:** "Show my list" stays disabled until the minimum valid selection exists (>=1 program + a state). Correct error-prevention; keep it.
- **Conceptual model:** The promise is "one folder of documents that satisfies all my applications." The interface must make the *merge* visible — the "needed for CalFresh and Medi-Cal" tag is the proof de-duplication happened. That tag is the conceptual payoff, not decoration. It must be legible, not buried.

### Answers to the 10 design questions

**Q1 — Two-step (really three-screen) flow vs. single form. RECOMMEND: single input screen, then reveal the list.**
The spec's Step 1 (programs) -> Step 2 (state) -> Step 3 (list) is three screens to collect two fields. EMG-1 and BEN-1 justify their step split because they collect 3+ inputs and the boundary creates a deliberate "moment before the result." DOC-1 collects exactly two fields, neither cognitively heavy, and the result is a reference document the user will scroll, copy, and re-open. Three taps to reach a reference list is friction the ALICE user (low bandwidth, phone, late at night) does not need.

Recommended: **one input screen** with both controls stacked (program checkboxes, then state selector) and a single "Show my list" button (disabled until valid). On submit, reveal the checklist with the inputs still editable above (a "Change programs / state" affordance), or transition to a result view that keeps a clear path back. This matches TIP-1's single-form altitude (the right precedent for a low-input reference tool) while keeping BEN-1's focus-management discipline on the reveal.

Do NOT keep three screens. If a step boundary is wanted for pacing, the maximum is two: [inputs] -> [list]. Never separate programs from state onto their own screens — they are one decision ("what am I applying for, and where").

**Q2 — Multi-select pattern. RECOMMEND: native checkboxes in a fieldset (the screener pattern).**
Four items, multi-select, must show selected state without extra styling, keyboard-operable, 44px targets. Native checkboxes win on every axis:
- Affordance is unambiguous (checkbox = many).
- Already built and styled in the screener (`.checkbox-group` / `.checkbox-label` / `accent-color: var(--terracotta)`). Reuse it; do not rebuild.
- Free keyboard support, free screen-reader semantics, free selected-state.
- One caveat: the screener's checkbox is 1.125rem with a small hit area (it was a secondary "optional details" control there). For a *primary* input, make the whole `.checkbox-label` row the target: full width, min-height 44px, generous padding, so the tap target is the row, not the 18px box.

Reject card-style selectors (heavier, more pixels, no a11y gain) and reject segmented toggle buttons (single-select affordance — wrong for multi-select; see Norman).

**Q3 — Checklist item at 375px. RECOMMEND: stacked block per item, not a dense one-line row.**
Four data points per item (name, description, status label, "needed for" tag) cannot share one row at 375px without wrapping into mush. Structure each item as a small stacked block:

```
[STATUS]  Document name
          One-line description (muted)
          needed for CalFresh and Medi-Cal   (small tag)
```

- Document name: heaviest weight (the thing being scanned for).
- Status label: a text pill before/above the name so the eye hits "what kind of requirement" first.
- Description: one line, `var(--muted)`, smaller.
- "needed for" tag: smallest, but present — proof of merge.

Card-like vertical spacing between items (gap, not a border on every row — borders on 12 items reads as a cage). Indent items under each category heading to group them. Closer to the EMG-1 `.tactic-box` rhythm than to a table. Do not attempt a table at 375px.

**Q4 — CHOOSE ONE groups. RECOMMEND: one bounded item with an indented option set + the shared "Any one of these works" line.**
Render the group as ONE line item (so it counts as one thing to gather), with the acceptable documents as a small indented sub-list:
- Status pill reads `CHOOSE ONE`.
- Under the description: a quiet "Any one of these works:" line, then the options as a compact indented list, visually lighter than top-level items.
- The sub-list must read as "options within one requirement," not "more checklist items": smaller type, indentation, no status pills on sub-items, and a containing tint (the `var(--cream)` inset used by `.tactic-box`) so the group reads as one bounded unit.
This kills the "checklist-within-a-checklist" anxiety where the user thinks they must collect all options.

**Q5 — Divergence callouts. RECOMMEND: inline, visible, quiet signpost attached to the item; NOT a `<details>` expander; never a warning color.**
The HEAP/CalFresh energy-bill note is the single most valuable insight the tool produces ("one bill covers both") — hiding it behind `<details>` buries the payoff. Render it inline, directly under the item it modifies:
- Reuse the `.signpost-box` / `.bridge-box` treatment (cream background, 3px left border in `var(--olive)`), smaller and indented under the item so it visually belongs to that row.
- Lead with a non-color text marker so it is not color-alone (e.g. "Good to know:"). Olive, never red/amber — information, not a warning (Do No Harm: no alarm colors).
- One callout per item maximum; if two would attach, restructure the data.
Reserve `<details>` for genuinely secondary long content (none specced here). TIP-1's `.base-details` "How much does this change?" is the correct use of `<details>`; a load-bearing divergence note is not.

**Q6 — Copy / Print actions. RECOMMEND: in-flow buttons after the last category. Sticky bar is out.**
On a reference list read top-to-bottom, a permanent sticky bottom bar steals vertical space on a 375px viewport for the entire scroll — costly when the content is the point. Put `Copy this list` and `Print` as in-flow buttons immediately after the last category, where the reading motion ends. Consistent with EMG-1 / BEN-1.
- The "scroll past the whole list" objection is weak: the list is capped at ~12 items, and a user who wants to copy has by definition finished reading.
- If a sticky element is desired, the only acceptable form is a single compact "Copy" pill that appears after the user scrolls past the header, respects safe-area insets, and never covers a full row. Do not build a full sticky bar with both actions. Treat sticky as nice-to-have; in-flow is the baseline that ships.

**Q7 — National-baseline banner (state != CA). RECOMMEND: neutral olive signpost above the list; never a warning style; never degrade the list.**
It must say "this is the general version, confirm locally" without making the user distrust the tool:
- Use the `.signpost-box` style (cream + olive left border), full width, directly above the first category.
- Brand-final copy (em dash removed per brand section): "Showing the national baseline. Your state may ask for something different. Check the official link for each program below." Frames the limit as a known boundary with a next step, not a failure.
- No red, no amber, no warning icon, no exclamation. An info marker at most.
- Keep the list visually identical to the CA version — same confidence, same layout. No greying-out, no reduced opacity. Degrading the list reads as "this data is unreliable" and violates the trust principle. The banner contextualizes; it must not make the list look degraded.

**Q8 — Empty state. RECOMMEND: a calm fallback, never blank, never an error.**
With static data this should be impossible, but defend against it. If the merged checklist comes back empty:
- Do NOT show a red error or "something went wrong."
- Show a calm message that keeps the user oriented and routes them out: e.g. "We couldn't build a list for that combination. The official links below are the most reliable source for each program." Then render the per-program source URLs (which exist regardless of merge state).
This satisfies "no path forward = a verdict" — there is always the official-source signpost. Also handle the pre-submit state: before "Show my list" is pressed, the result region is simply absent (not an empty box), consistent with TIP-1's "Enter a bill amount..." empty line.

**Q9 — Print stylesheet. Specific considerations for the engineer:**
- **Strip chrome:** `@media print` must hide the global header, footer, skip link, breadcrumb, the input controls (checkboxes, state select, "Show my list"), and the Copy/Print buttons themselves. Print only: title + guide header + checklist + per-program source URLs.
- **Print source URLs as visible text.** Screen links show link text; on paper the user needs the actual URL. Use `a[href]::after { content: " (" attr(href) ")"; }` scoped to the footer source links so the official URLs are usable from the printout (the whole point is confirming with the official source).
- **Page breaks:** `break-inside: avoid` on each line-item block and each CHOOSE ONE group so a document never splits across pages. `break-after: avoid` on category headings so a heading never orphans at a page bottom.
- **De-dup already done in data:** the print view renders the same merged list — no separate print de-dup logic. Confirm the printed list is the merged list, not the raw per-program lists.
- **Black on white, drop background tints:** convert the cream/olive callout boxes to a thin grey/black left rule for print; do not rely on background-color (browsers often drop print backgrounds, and ink economy matters for a user printing at a library).
- **No fixed/sticky in print:** any sticky Copy pill must be `display:none` in print.
- Add print rules to the tool's `<style>` or a shared print partial; `app.css` has zero print styles today, so this is net-new.

**Q10 — WCAG specifics (building on the brand casing/a11y flag):**
- **Multi-select keyboard:** native checkboxes are keyboard-operable for free (Tab to each, Space to toggle) — the single biggest reason to use them over a custom control. If a custom control were ever used, it must implement the full checkbox keyboard contract; there is no reason to, use native.
- **Status labels not color-alone AND not casing-alone:** REQUIRED / CHOOSE ONE / IF IT APPLIES must be conveyed by the literal pill text, authored normal-case + `text-transform: uppercase` (per brand), with the label in the accessible reading order (not `aria-hidden`). A screen-reader user must hear "Required, Government-issued photo ID, ..." in sensible order. Verify with a greyscale screenshot at QA.
- **Contrast:** all pills, tags, and notes >=4.5:1 against their background. `var(--muted)` (#625c57) on `var(--cream)` passes; `var(--muted)` on `var(--surface)` is the tighter case — verify any muted-on-surface tag. Filled pills (e.g. terracotta) need white text to pass.
- **Touch targets >=44px:** each program checkbox row, state select, "Show my list", Copy, Print, and each source link >=44px tappable. The screener checkbox box alone is 18px — the *row* must be the target.
- **Focus management on reveal:** when the list appears, move focus to the result heading ("Your document list", `tabindex="-1"`, programmatic focus), exactly as the screener does with `resultsHeadingEl`. Announce via `aria-live="polite"` so screen-reader users know the list rendered.
- **Copy confirmation announced:** the "Copied." microcopy must live in an `aria-live` region, or screen-reader users get no feedback that copy succeeded.
- **List semantics:** render each category as a real list (`role="list"` / `<ul>`), matching the screener's `.program-list role="list"`, so assistive tech announces counts.

### Ive Restraint Test

- **Removable:** the third screen (separate state step) — remove it, fold into one input screen. Per-row borders on every item — remove, use spacing. A "Your document list" heading is acceptable here only because it doubles as the print title and the focus target; keep it minimal.
- **Visual hierarchy (order of emphasis):** category heading > document name > status pill > description > "needed for" tag > divergence note. The "needed for" tag is small but must not vanish — it is the proof the tool did its one job.
- **Earned elements:** the divergence callout earns its place (it is the insight). The "Any one of these works" line earns its place (it prevents over-gathering). Everything else stays quiet.

### Simon Memory Test

- **The one memorable output:** "One bill, both applications." The tool exists to produce the realization that the documents overlap — that the second application is *not* starting from scratch. The merged item with "needed for CalFresh and Medi-Cal" plus the energy-bill divergence note ARE that memory. The "needed for" tags and overlap notes are the emotional payload ("I already have most of this"), not metadata to minimize. Idea (for brand/PM, not a requirement): a single quiet count line at the top — "These documents cover all N applications" — could carry the memory explicitly; if added it must use plain count framing, no celebration tone.
- **Cognitive load:** LOW if inputs collapse to one screen and the per-item block stays disciplined. HIGH risk if the three-screen wizard ships or the item crams four data points onto one line. The whole review pushes load down.

### Financial Anxiety Overlay

- **Shame signals:** none inherent in a document list. Guard the empty state and the non-CA banner from reading as "you did something wrong" or "this tool can't help you" — both must route calmly to the official sources.
- **Trust signals:** PRESENT and good — guide-not-official-list header, per-program source URLs, "your county may ask" framing. The source URLs and the brand's required clipboard hedge must survive into the printout (Q9) AND the clipboard payload, or the trust signal dies the moment the list leaves the screen.
- **Cognitive load:** LOW-to-MEDIUM by design; the recommendations keep it LOW. The ALICE user is the explicit target (phone, late, low bandwidth) — every Next-tap removed is a real win.

### Required Changes Before Build

1. **Collapse the three-screen wizard to a single input screen + revealed list.** Programs and state on one screen, one "Show my list" button (disabled until >=1 program AND a state). Max two views; never split programs from state. (Severity: high — friction + recall burden for the core user.)
2. **Use native checkboxes (screener `.checkbox-group` pattern) for the program multi-select; not a segmented/toggle/radiogroup control.** Make the full row the >=44px target. (Severity: high — affordance + accessibility.)
3. **Render each checklist item as a stacked block (status pill, name, description, "needed for" tag), not a dense one-line row.** Card-like spacing, no per-row borders. (Severity: high — 375px legibility.)
4. **Render CHOOSE ONE as one bounded item with an indented "Any one of these works" option set,** visually distinct from top-level items (tint + indent + lighter type). (Severity: medium.)
5. **Render divergence callouts inline and visible (olive signpost), never in a `<details>` expander, never a warning color;** lead with a non-color text marker. (Severity: medium — the tool's key insight; do not bury or alarm.)
6. **Place Copy/Print as in-flow buttons after the last category.** Full sticky bar is out; an optional single non-occluding sticky "Copy" pill only. (Severity: low/medium.)
7. **National-baseline banner: neutral olive signpost above the list; do not degrade the list's visual confidence (no greying, no warning styling).** (Severity: medium — trust.)
8. **Empty/failure state renders a calm message + per-program official source links, never a red error.** (Severity: low — defensive.)
9. **Print stylesheet: strip header/footer/breadcrumb/inputs/action buttons; print source URLs as visible text via `::after attr(href)`; `break-inside: avoid` on items and CHOOSE ONE groups; convert tinted callouts to ink-economical rules; no sticky/fixed in print.** (Severity: medium — net-new, no precedent.)
10. **WCAG: move focus to the list heading on reveal (screener pattern) with aria-live announcement; announce copy confirmation via aria-live; status labels by pill text not color, authored normal-case + CSS uppercase (per brand), in the accessible reading order; all targets >=44px; verify muted-on-surface contrast >=4.5:1.** (Severity: high — non-negotiable bar.)
11. **Ensure the clipboard plain-text payload includes the brand-required guide-not-official hedge AND the per-program source URLs,** so trust + verifiability survive when the list leaves the screen. (Aligns with brand section 8 — same artifact, UX confirms it must also carry the source URLs.) (Severity: medium — trust continuity.)

### Verdict

**PROCEED WITH CHANGES** — implement the 11 changes above. The ticket is well-specified, low-risk on accuracy (static, source-verified data) and on Do No Harm (no eligibility verdict, guide framing throughout). The one substantive architecture decision is collapsing the three-screen wizard to a single input screen and committing to native checkboxes + stacked item blocks; the rest are treatment specifics that align with existing EMG-1 / BEN-1 / TIP-1 patterns. Re-run this review only if the flow architecture diverges from the single-screen recommendation.

⟦UX-REVIEWED⟧ ticket="DOC-1" date="2026-06-17" status="PROCEED WITH CHANGES"

---
---

# DOC-1 — Document Checklist Generator: Post-Build Brand Validation

**Gate:** Post-build brand validation (verify the pre-build required changes are present in the implementation)
**Reviewer:** Brand & Marketing (Finxiety)
**Date:** 2026-06-17
**Branch under review:** `DOC-1-document-checklist`
**Source of truth:** `../tsunam_vault/finxiety/Finxiety — Brand & Mission.md`

## Verdict: BLOCKED — could not read the implementation

I was unable to inspect the DOC-1 implementation, so I cannot verify any of the six required changes or the additional checks. No sign-off is possible. This is an environment/access blocker, not a copy finding. Details below so the next run can clear it quickly.

### What I needed to read (and could not)

1. `DOC-1-document-checklist:finxiety/src/routes/tools/document-checklist/+page.svelte` — the tool template (status labels, banner, "needed for" tags, clipboard payload, Medi-Cal note).
2. `DOC-1-document-checklist:finxiety/src/routes/+page.svelte` — the homepage card copy.
3. `DOC-1-document-checklist:finxiety/src/lib/data/doc-requirements.json` — the data file (status-coded items, descriptions, divergence notes, program labels). Path confirmed during this session.

None of these exist on `main`/the primary working tree; all three live only on the DOC-1 branch.

### Read paths attempted, and why each failed

- **`git -C ... show DOC-1-document-checklist:<path>`** (the exact command the task specifies) — Bash permission denied. Note: Bash is selectively allowed (`ls`, `git worktree list` succeeded) but denied for `git show` and file reads.
- **GitHub MCP `get_file_contents`** (origin = `github.com/tsunamai/finxiety`, branch `DOC-1-document-checklist`) — permission denied.
- **Direct `Read` of the branch's worktree** (`.claude/worktrees/agent-a4b85dc3796c518b0/...`) — blocked by the `cross-worktree-read-guard.sh` PreToolUse hook, because this session's containing tree is the repo root, not that worktree.
- **`EnterWorktree` via `path`** into that worktree — refused, because switching is only allowed from a session already inside a worktree; this session is at the repo root.
- **Subagent pinned to the worktree** — also could not `EnterWorktree` and correctly declined to defeat the read-guard hook via Bash.

I did not attempt to circumvent the cross-worktree guard (e.g. routing around the Read hook with `cat`/`sed`), because that hook exists specifically to prevent reviewing stale cross-branch content, and bypassing it would undermine the integrity of this very review.

### Required changes — verification status (all UNVERIFIED)

| # | Required change | Status |
|---|---|---|
| 1 | Status label reads "IF IT APPLIES" (not "IF THIS APPLIES TO YOU") | UNVERIFIED — file unreadable |
| 2 | Status labels authored normal-case + CSS `text-transform: uppercase`, not typed in caps | UNVERIFIED |
| 3 | National-baseline banner: no em dash, two sentences | UNVERIFIED |
| 4 | "Needed for" tags sourced from one `formatNeededFor` function off the data-file program label; no hand-typed program names | UNVERIFIED |
| 5 | Clipboard payload leads with "Documents commonly requested for: [programs]. This is a guide, not the official list." | UNVERIFIED |
| 6 | No status-coded immigration/citizenship items in `doc-requirements.json` | UNVERIFIED |
| + | No em dashes anywhere in user-facing copy | UNVERIFIED |
| + | "commonly requested" / "your county may ask" / "a guide, not the official list" framing throughout; never "you must have" / "you will be asked for" | UNVERIFIED |
| + | Medi-Cal CA note implies no status requirement | UNVERIFIED |
| + | Homepage card copy present and exact | UNVERIFIED |

### How to unblock (any one of these clears it)

1. Grant Bash permission for read-only `git show` on this repo, then re-run this validation (the task's own instructions assume this command works).
2. Re-run this validation from a session whose working directory is **inside** the DOC-1 worktree (`.claude/worktrees/agent-a4b85dc3796c518b0`); own-worktree reads are permitted by the guard.
3. Grant the GitHub MCP `get_file_contents` permission (the branch is pushed to origin).

Once any of these is in place, the verification table above can be completed and a ⟦BRAND-REVIEWED⟧ sign-off (or specific copy blockers) issued in a follow-up section.

**No ⟦BRAND-REVIEWED⟧ sign-off.** Signing off on copy I could not read would violate the Do No Harm gate's purpose. Re-run after unblocking.

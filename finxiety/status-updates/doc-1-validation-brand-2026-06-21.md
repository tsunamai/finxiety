# Brand Validation Gate: Document Checklist Generator (DOC-1)

**Gate:** Brand
**Reviewer:** brand agent
**Date:** 2026-06-21
**Files reviewed:**
- `finxiety/src/routes/tools/document-checklist/+page.svelte`
- `finxiety/src/lib/data/doc-requirements.json`
- `../tsunam_vault/finxiety/Finxiety — Brand & Mission.md` (source of truth)

**Prior brand review:** Inline orchestrator review 2026-06-18 (doc-1-validation-2026-06-17.md). This gate is a full independent review against the current live files.

---

## Findings

### Voice Violations

No violations found. All findings below are informational or Low severity.

---

### Do No Harm Flags

No Critical or High issues found.

---

### Full Findings List

**[LOW] Double-hyphen (`--`) in one CA state override divergence note**
- File: `finxiety/src/lib/data/doc-requirements.json`, line 297
- Text: `"CalFresh can accept a utility bill, a lease, or recent mail. If you are also applying for HEAP, a recent energy or utility bill covers both at once."`
- Note: This instance reads cleanly -- no double-hyphen is present. The prior review (2026-06-17) flagged a `--` here and described it as replaced. The current file confirms the fix is in. This finding is a PASS, included for audit trail continuity.

**[LOW] Clipboard payload `condition_note` prefix constructs a sentence fragment risk**
- File: `finxiety/src/routes/tools/document-checklist/+page.svelte`, line 95
- Text: `Bring this {item.condition_note}` in the clipboard output (line 95); rendered in-template at line 261 as `Bring this {item.condition_note}`
- All four condition_notes are: "if anyone in your household is self-employed.", "if anyone in your household receives disability, unemployment, child support, or other benefits.", "if you are applying for a child.", "if you are claiming a qualifying child.", "if you have one available."
- All five combine grammatically with "Bring this" without issue. This is a PASS and a maintenance note: any future condition_note added to the data file must begin lowercase and complete the sentence "Bring this [condition_note]" correctly. No current defect.

**[INFORMATIONAL] `last_updated` field displays the data review date, not a program-policy date**
- File: `finxiety/src/routes/tools/document-checklist/+page.svelte`, line 296-299
- Text: `Document requirements last reviewed {data.last_updated}. They can change; the official links above are always current.`
- `data.last_updated` is `"2026-06-18"`. The framing "last reviewed" is correct -- it describes when Finxiety last checked the requirements, not a government-issued effective date. The following sentence ("They can change; the official links above are always current.") provides the hedge. This is the correct pattern per the Do No Harm principle: estimates and reviews labeled as such, with the official source as authority. PASS.

---

### Strengths

**1. Non-Advice Rule executed structurally, not just verbally.**
The tool never tells the user what to do because it literally cannot -- the output is a list of documents, not a recommendation or eligibility determination. "Documents commonly requested for" and "This is a guide, not the official list" appear in the visible result heading (line 208-211), the sources section (line 280), and as the first line of the clipboard payload (line 79-82). The hedge is present in every context where the list could be acted on. This is the right architecture: hedging built into the structure, not applied as a disclaimer at the bottom.

**2. "Commonly requested" is the right phrase.**
It is accurate (programs do not guarantee these documents will always be sufficient or that no others will be requested) and non-alarming. It does not understate ("these are the documents") or overstate ("these are exactly what you need"). Warm, direct, honest.

**3. Status pill labels use normal-case authored values, uppercase via CSS.**
`statusPillLabels`: `required: 'Required'`, `one_of: 'Choose one'`, `conditional: 'If it applies'`. The sr-only span reads the authored form; the visual span is uppercased by `text-transform: uppercase`. Screen-reader experience does not receive all-caps text. This is the correct pattern for accessible status copy.

**4. "If it applies" instead of "Conditional" or "Optional."**
"If it applies" is plain English and non-alarming. "Conditional" is bureaucratic. "Optional" would be inaccurate (these documents are required under certain conditions, not optional). The chosen label is the right one.

**5. State selector hint is honest about current coverage.**
"California has the most detail right now. Other states show the national baseline." (line 185-186) This sets expectations without apologizing or overpromising. Users who select a non-CA state will see the baseline banner and understand why -- they were told at the input stage. No bait-and-switch.

**6. Non-CA baseline banner: warm, not alarming.**
"Good to know: Showing the national baseline. Your state may ask for something different. Check the official link for each program below." No urgency, no warning color (olive signpost, not red), no directive urgency. "Check" as an imperative is the mildest form; here it is appropriate because checking the official link is exactly the next action.

**7. Empty-list state is calm and routes forward.**
"We could not build a list for that combination. The official links below are the most reliable source for each program." No blame, no failure language, immediate next step. The user is not left at a dead end.

**8. Official sources section framing.**
"The most reliable list always comes from the program itself." This is a trust statement, not a disclaimer. It positions the official source as a resource, not as a correction of Finxiety's inadequacy. Behavioral review identified this phrase as trust-load-bearing; it should be preserved verbatim in future edits.

**9. Clipboard payload leads with the hedge.**
The first line of the exported text is "Documents commonly requested for: [programs]. This is a guide, not the official list. Confirm with the official link for each program." The hedge precedes all document entries, meaning it travels with the artifact when the user texts or prints it. This matters because the user acts on the list later, away from the page.

**10. Footer crosslink to BEN-1 is informational, not directive.**
"Not sure which programs you may qualify for? The Benefits Screener can help you find out." This speaks only to the user who arrived without the upstream question settled. It does not say "check your eligibility first" or "you should use this tool before proceeding." Correct warm handoff register.

**11. No banned vocabulary anywhere in user-facing copy.**
Full sweep of `+page.svelte` and `doc-requirements.json`: no instances of "empower," "journey," "personalized insights," "transformative," "unlock," urgency language, scarcity language, fear language, or "you should apply" / "consider applying" constructions found. Clean.

**12. EITC program note is clarifying, not directive.**
"EITC is a tax credit you claim on your tax return when you file, not a separate application. The documents below are what you bring to your tax preparer or use to file." This explains the structural difference between EITC and the other programs -- genuinely useful for a user who does not know what EITC is -- without telling the user what to do. PASS.

---

### Distribution Notes

**Who finds this first and how:**
The primary discovery path is downstream from BEN-1 (the Benefits Screener). A user who learns they may qualify for CalFresh and Medi-Cal follows the warm handoff to DOC-1 as their immediate next step. This is the highest-intent entry point: user has already decided to apply, needs exactly what DOC-1 provides.

Secondary discovery paths: nonprofit partner referral (social workers and benefits navigators will link to this directly as a preparation tool for clients), and organic search on terms like "CalFresh documents to apply," "Medi-Cal what do I need to bring," "SNAP application documents checklist."

**Shareable moment:**
The clipboard copy and print features create a portable artifact that travels beyond the session -- shared by text, printed at the library, photographed. This is the tool's native share mechanism and it is correctly designed: the clipboard payload carries the hedge and source URLs so the artifact is honest wherever it lands.

Unlike the Myth Quiz score (which is inherently social), the document checklist is a private utility. Design accordingly: no social share prompt, no "share your checklist" CTA. The current design is correct on this point -- Copy and Print are task-completion affordances, not social mechanics.

**Related-tool footer:**
The BEN-1 footer link is the only related-tool CTA, and it is correctly conditioned on the user not knowing which programs apply to them. A future addition to consider: a reverse crosslink from BEN-1's result page into DOC-1 ("Now that you know which programs you may qualify for, here is what to bring"). That bridge is BEN-1's footer to own, not DOC-1's, but it is the higher-traffic direction once both tools are live.

---

## Verdict

No Critical or High findings. No Voice Violations. No Do No Harm flags. All copy is warm, direct, non-directive, and hedged correctly. The Non-Advice Rule is executed structurally, not just verbally. The immigration-safety constraint in the data file is satisfied in the current version (confirmed independently and via the prior behavioral gate).

The one maintenance note for future data file edits: any new `condition_note` must complete the sentence "Bring this [condition_note]" grammatically, and any new document item must be reviewed against the status-neutrality constraint before merge.

⟦BRAND-REVIEWED⟧ tool="document-checklist" ticket="DOC-1" date="2026-06-21" reviewer="brand-agent"

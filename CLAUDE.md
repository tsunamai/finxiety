# Tsunam.ai — Workspace Root

Tsunam.ai is a portfolio of civic and financial tools. Two products are in active development:
- **Finxiety** — free financial clarity tools for underserved communities
- **Mortalia** — retirement scenario tools for single pre-retirees with $1M-$6M, California-first

`nsum-harnesses/` is a reference harness borrowed from nsum.ai. Read it; do not modify it.

---

## Non-Negotiables

- **Read before you write.** Never edit a file you haven't read.
- **No mechanical transforms** (sed/regex/awk) on production code — every line written by hand.
- **Civic tools are phone-first.** Any user-facing Finxiety interface must work on a mobile browser before it works on desktop.
- **WCAG 2.1 AA is the minimum** accessibility bar for all Finxiety tools. Non-negotiable.
- **No PII stored.** Finxiety tools are stateless. No user data is written to a server. All calculation is client-side.
- **Shared input model lives in `finxiety/lib/input-model/`.** Never define household_size, state, zip_code, gross_monthly_income, or current_benefits in a tool-specific file. Import from there.
- **Data freshness risk:** Finxiety threshold tables (FPL, SNAP limits, Medicaid thresholds) update annually each October. Every data file must include a `last_updated` field. Before release, the release agent audits for staleness.
- **Do No Harm principle** (see `finxiety/CLAUDE.md`) overrides every other design consideration.

---

## Context Cascade — Read the Local CLAUDE.md for the Area You're Editing

| Path | Covers |
|---|---|
| `finxiety/CLAUDE.md` | Finxiety product conventions, Do No Harm, tool structure |
| `mortalia/CLAUDE.md` | Mortalia product philosophy, Do No Harm (financial), target user, validation gate |

---

## Team — Agent Roster

Agents live in `.claude/agents/`. Each has a defined role; invoke by name via the Agent tool.

| Agent | File | Role |
|---|---|---|
| `pm` | `.claude/agents/pm.md` | Grooms tickets; owns backlog quality |
| `brand` | `.claude/agents/brand.md` | Brand voice, copy review, marketing |
| `design-ux` | `.claude/agents/design-ux.md` | UX critique, accessibility, behavioral design |
| `architect` | `.claude/agents/architect.md` | File organization, ADRs, cross-tool patterns |
| `engineer` | `.claude/agents/engineer.md` | Full-stack implementation in worktree isolation |
| `qa` | `.claude/agents/qa.md` | Test plans, quality gates, WCAG spot-checks |
| `behavioral-science` | `.claude/agents/behavioral-science.md` | Poverty psychology, scarcity mindset, financial shame — reviews tools against the ALICE user persona |
| `disability-accessibility` | `.claude/agents/disability-accessibility.md` | Disability and chronic illness accessibility: cognitive fatigue, disclosure shame, disability benefit cliffs. Reviews tools against the Renee persona |
| `release` | `.claude/agents/release.md` | Release notes, versioning, deploy checklist |
| `system-analyst` | `.claude/agents/system-analyst.md` | Read-only behavioral trace; signs verified claims |
| `code-reviewer` | `.claude/agents/code-reviewer.md` | PR review; three-layer methodology |
| `link-checker` | `.claude/agents/link-checker.md` | Checks and auto-fixes broken application URLs in Finxiety data files |
| `cpa-tax` | `.claude/agents/cpa-tax.md` | Tax calculation accuracy, RMD schedules, IRS + CA FTB table freshness — Mortalia only. **Inactive (personal use phase).** |
| `legal-compliance` | `.claude/agents/legal-compliance.md` | Unlicensed advice boundary, disclaimer adequacy, liability exposure — Mortalia only. **Inactive (personal use phase).** |

---

## Where to Find Things

- **Product backlogs:** `finxiety/PRODUCT_BACKLOG.md` · `mortalia/PRODUCT_BACKLOG.md`
- **Ideation intake:** `finxiety/BACKLOG_INTAKE.md` — rough ideas land here before grooming
- **Research findings:** `finxiety/research-findings/` · `mortalia/research-findings/` — saved outputs from Claude research sessions (see `finxiety/docs/research-prompts.md` for prompt templates)
- **Cross-product principles:** `FRONT-DOOR.md` — question-first architecture; applies to Finxiety, Mortalia-for-others, and all future tools
- **Harness reference:** `nsum-harnesses/docs/` — development loop, checks-and-balances, worktrees
- **Brand source:** `../tsunam_vault/finxiety/Finxiety — Brand & Mission.md`

---

## The Product Loop (Short Form)

```
Ideation → BACKLOG_INTAKE.md
Research → Claude + web search (prompts in finxiety/docs/research-prompts.md) → research-findings/
Grooming → pm agent (groom-ticket skill) → PRODUCT_BACKLOG.md
Design Review → design-ux agent + brand agent
Architecture → architect agent → ADR
Build → engineer agent (worktree isolation)
QA → qa agent → ⟦QA-VERIFIED⟧
Behavioral Review → behavioral-science agent → ⟦BEHAVIORAL-REVIEWED⟧
Disability Review → disability-accessibility agent → ⟦DISABILITY-REVIEWED⟧
Release → release agent → Naomi sign-off
```

---

## Credit Efficiency

**Agent models** are right-sized by role (see each agent's frontmatter). Do not upgrade an agent to `opus` without a specific reason — the defaults are intentional.

**Explore agents** are search-only. Always pass `model: "haiku"` when spawning them:
```
Agent({ subagent_type: "Explore", model: "haiku", prompt: "..." })
```

**Playwright MCP** results stay in context for the entire session. Run `/compact` immediately after any `/verify` run before continuing other work.

**Session hygiene:** `/compact` mid-session when context grows large (after multi-agent bursts, after Playwright). `/clear` when switching to a genuinely new task.

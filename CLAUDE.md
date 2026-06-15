# Tsunam.ai — Workspace Root

Tsunam.ai is a portfolio of civic and financial tools. Two products are in active development:
- **Finxiety** — free financial clarity tools for underserved communities
- **Mortalia** — decumulation and retirement planning for mass-affluent individuals

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
| `mortalia/CLAUDE.md` | Mortalia architecture, three-layer design, no shared state with Finxiety |

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
| `release` | `.claude/agents/release.md` | Release notes, versioning, deploy checklist |
| `system-analyst` | `.claude/agents/system-analyst.md` | Read-only behavioral trace; signs verified claims |
| `code-reviewer` | `.claude/agents/code-reviewer.md` | PR review; three-layer methodology |

---

## Where to Find Things

- **Product backlogs:** `finxiety/PRODUCT_BACKLOG.md` · `mortalia/` (TBD)
- **Ideation intake:** `finxiety/BACKLOG_INTAKE.md` — rough ideas land here before grooming
- **Research findings:** `finxiety/research-findings/` — saved outputs from Claude web-search research sessions (see `finxiety/docs/research-prompts.md` for prompt templates)
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
Release → release agent → Naomi sign-off
```

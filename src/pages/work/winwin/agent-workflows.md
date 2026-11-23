---
layout: ../../../layouts/ErpCase.astro
slug: agent-workflows
title: Production restores and agent workflows
group: AI and DevOps
deck: "Reusable Claude Code and Codex workflows: restoring production data, project rules, and persistent memory."
problem: "Repetitive engineering tasks, such as restoring a production backup for testing, kept hitting the same traps."
role: "I wrote a standards pack, a UI skill and a memory of lessons for AI agents, plus ops workflows for restoring a production backup locally and rewiring its integrations."
hard: "A restored copy of production behaves differently from production, and the differences look like bugs."
stack: "Claude Code · Codex · Frappe bench · MariaDB · Playwright"
notes:
  - "Rules, checklist and mistakes log as files"
  - "Memory notes record the why"
  - "One worktree per feature"
---

## The problem

Development ran on restored copies of the production database. Restores brought the same surprises, and they caught different sessions out. Agents working on the code also needed to know the house rules without being told each time.

## What I built

- **A standards pack for agents.** It has working rules, a pre-change and validation checklist, a UI standard, and a mistakes log. Each log entry records the mistake, its impact, the root cause, a prevention rule and the check that would have caught it. The rules set the promotion path: local, then UAT, then production.
- **A Claude skill** that carries the house UI standard for Vue pages in the ERP. It says plainly that generic React or Tailwind guidance does not apply to this stack.
- **Persistent memory.** About 150 notes, each a non-obvious lesson with the reason and how to apply it.
- **Ops workflows** for restoring a production backup into a local site and rewiring the integrations, plus a WhatsApp gateway skill.
- **Working practice.** One git worktree per feature, each shipped as a pull request, with browser-test proof at phone and desktop widths.

## The hard part

A restored site is not production. Several notes capture how it goes wrong:

- The encryption key no longer matches, so most stored secrets cannot be decrypted. A flag meant to make the lookup fail softly does not cover a wrong key.
- Failing push jobs piled up on one worker and made background features look stuck.
- The restore was database-only, so uploaded images were missing.
- Database users were tied to a container address that changes on restart.
- A "rolled back" rehearsal had kept its changes, because setup code that touches the schema commits. The lesson is to rehearse on a copy.

## What this work demonstrates

- Turning repeated mistakes into rules and checks that agents can follow.
- Recording the reason for a rule, not only the rule.
- Telling an environment artifact from a real bug before changing code.

---
layout: ../../../layouts/ErpCase.astro
slug: equipment-checklists
title: Equipment and maintenance checklists
group: Manufacturing and quality
deck: "Paper daily, weekly and monthly maintenance sheets became one phone-friendly checklist hub with photo evidence and sign-off."
problem: "Forklift, towing truck, lorry and machine checks were filled in on paper, so evidence, review and repair follow-up were hard to track."
role: "I built a generic checklist doctype and page, then added each paper form as configuration, plus repair requests, prints and reminders."
hard: "Making one design fit forms that differ in period, unit, filler, reviewer chain and site, without breaking sheets already filled in."
stack: "Frappe v15 · Python · Vue 3 · MariaDB · Jinja print formats"
notes:
  - "New form means one config entry"
  - "Operators fill only own unit"
  - "Photo required for every item"
  - "Repairs separate from signed sheet"
flow:
  - title: "Operator ticks the sheet"
    note: "Each item gets a photo; a remark is required when it is not OK."
  - title: "Reviewer signs off"
    note: "The store manager, or the machine's reviewer chain, reviews the sheet."
  - title: "Repair loop"
    note: "A repair request with photos is approved, completed with proof, then reviewed."
---

## The problem

WinWin Food Industries kept its equipment checks on paper: forklift and towing truck preventive maintenance, a lorry checklist, and machine maintenance sheets at daily, weekly and monthly intervals. Paper gave no photo evidence, no easy view of what was overdue, and no link between a failed item and the repair that followed.

## What I built

One Equipment Checklist Record covers one unit for one period: a week for vehicles, a month or a day for machines. The form definitions live in one configuration file, so adding a form means adding an entry, not new code. The first forms were forklift and lorry. Towing trucks and the machine daily, weekly and monthly sheets came later.

Operators see only their own unit. They tick every item, attach a photo, and add a remark when an item is not OK. Some alarm and horn checks need a short video, recorded in the page with a size cap because the servers have no transcoder. Reviewers sign off in a second step, and the print matches the paper form. A Friday reminder surfaces unfinished sheets in the existing task bubble. Drivers use the same checklist inside the driver app.

Repairs are separate documents linked to the sheet, so several can be raised without changing a signed checklist. A request needs an explanation and at least one photo, a manager approves it with a date, and the operator completes it with completion photos. The request records breakdown date, root cause and downtime, and a manager signs a final review.

## The hard part

The forms differ in unit type, period, who fills, who reviews and which site they run on. The machine sheets use a longer chain: a production supervisor checks, an engineering manager verifies, then a reviewer signs. Each change also had to leave existing sheets with uploaded photos intact. The video patch only touched open rows that still lacked evidence, and was mutation-checked.

## What this work demonstrates

- Designing for the second and third form, not just the first.
- Role-scoped data access enforced on lists and direct links.
- Evidence capture that works on a phone under real constraints.
- Careful rollout of changes onto live, already-filled records.

---
layout: ../../../layouts/ErpCase.astro
slug: driver-allowance
title: Driver Allowance Monitor
group: Logistics and fleet
deck: "A review page and rules engine for driver and assistant trip allowances, including manager-marked stop deductions."
problem: "Allowance depends on where each trip went and what was collected, and a wrong rule match changes someone's pay."
role: "Built the review page, the manual rule override, the manager-mark deduction with carry-forward, and later rules for collection stops."
hard: "Allowance is computed on every read, so a rule change quietly re-rates months that were already paid."
stack: "Vue 3 · Frappe · Python · MariaDB"
notes:
  - "One engine feeds report, page and app"
  - "Manual picks are audited, never silent"
  - "Deductions net against the month pool"
flow:
  - title: "Match a rule"
    note: "The engine picks a Driver Allowance Rule for each trip."
  - title: "Review"
    note: "A reviewer sees the paid rule and flags trips with none."
  - title: "Override or deduct"
    note: "A reviewer picks another rule, or a manager mark adds a deduction."
---

## The problem

Driver and assistant allowances at WinWin Food Industries depend on the trip: outstation or local by address, how many stops, and whether collections were made. A Monthly Driver Allowance report already calculated this. Reviewers still had no easy way to see which rule each trip was actually paid on, or to correct a wrong match.

## What I built

I built a Vue page on top of that report engine. It lists each Delivery Trip with the rule it was paid on, flags trips where no rule matched, and lets an authorised reviewer replace the rule for one trip. The override stores who changed it, when and why, and it shows in the Notes column, so it never changes a payout silently. The server returns the recomputed month after a change, so the table and totals move together. Fetched months are cached on the client and refreshed quietly.

I also built a manager mark. A Delivery Manager can close a stop the driver never updated, and that applies a fixed deduction per stop, counted once per destination. A System Manager mark waives the deduction, and so does a part-time placeholder driver. Deductions net against the driver's whole-month pool, floor at zero, and carry forward. If a driver was only offline and the queued delivery arrives with an earlier capture time than the mark, the mark is reversed.

Later rules rated each collection by its own address, so local collections are unpaid and outstation ones are paid.

## The hard part

Allowances are computed on every read and never stored. Any rule or code change silently re-rates earlier months, including ones already paid. I wrote up a plan to snapshot the allowance onto each trip with a backfill, but the source marks it as agreed and not started, so I do not claim it as shipped.

Access needed care too. The page mirrors the report's role list and permission check, because it can change payouts.

## What this work demonstrates

- Putting one calculation behind a report, a review page and a mobile app.
- Auditable overrides and money rules with clear edge cases.
- Spotting a data-integrity risk in computed values.
- Matching permissions across surfaces that expose the same pay data.

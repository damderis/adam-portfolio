---
layout: ../../../layouts/ErpCase.astro
slug: batch-tools
title: Back-Office Batch Tools
group: Sales and purchasing
deck: "Office tools that turn salespeople's requests, supplier collections and delivered orders into documents with fewer manual steps."
problem: "Office staff were handling purchase-order paperwork, collection requests and delivery order submission one document at a time."
role: "Built Batch SR Processing, the statement console, the Collect Item Request page and the delayed auto-submission of delivered orders."
hard: "The tools span two company sites and several readers of the same data, so small field behaviours caused quiet errors."
stack: "Vue 3 · Frappe · Python · MariaDB · Redis"
notes:
  - "Collect requests read POs, never write"
  - "Delivery orders submit after a working-day delay"
  - "Office edits needed fetch_if_empty"
flow:
  - title: "Capture"
    note: "A request, a scanned PO or a delivered stop enters the system."
  - title: "Office review"
    note: "Staff check the match, set dates and shipment source."
  - title: "Create the document"
    note: "A delivery order, collection draft or submission is produced."
---

## The problem

At WinWin Food Industries, salespeople raise sales requests with a customer PO attached. Purchasing needs lorries to collect goods from suppliers. Delivered orders need submitting for e-invoicing. Each of these used to depend on office staff handling documents one at a time.

## What I built

Batch SR Processing lets the office turn salespeople's requests into delivery orders. It shows the PO beside the request, lets staff set the delivery date and the shipment-from source, and reads PO lines the way the delivery order import does. A Statement of Accounts console handles customer statements in batches.

Collect Item Request lets purchasing raise a lorry collection for a purchase order. The page runs on the distribution site and reads the purchase orders from the sister company's site over an existing integration channel, so nothing is written there. A request is a draft with an approval step, appears in the planner, and shows on the driver's phone as a collect-from-supplier stop.

Delivery order auto-submission schedules each delivered order for submission and e-invoice 48 working hours later, skipping weekends and holidays. A manager sees a live countdown and can cancel it. The job runs every 15 minutes and isolates failures per record.

## The hard part

Small field behaviours caused quiet errors. Every active Sales Request state is a draft, so a field fetched from the customer was refreshed on every workflow save and overwrote the office's shipment-from edit. The fix was to fetch only when empty and re-fetch when the customer changes. On a Delivery Note, setting only the warehouse is overwritten on save because it follows the shipment-from field. Seventy-four orders had been fixed by hand before a conversion path was corrected.

Batch SR also keeps its own item matcher, scoped to the request's items. Its purpose is items, not money, so a PO price difference is reported only as information.

## What this work demonstrates

- Automating clerical work while keeping a human review step.
- Cross-site integration with a one-way, read-only design.
- Tracing quiet data bugs to their root cause.
- Scheduled jobs that are idempotent and cancellable.

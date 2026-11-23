---
layout: ../../../layouts/ErpCase.astro
slug: ncr-car
title: Non-conformance and corrective actions
group: Manufacturing and quality
deck: "Paper and spreadsheet quality reports became an approval workflow that holds stock and closes only when the fix is verified."
problem: "The QC team logged non-conformances in Excel workbooks with ink signatures, two fixed action rows, formula-driven closure and no link to the stock documents involved."
role: "I built the report and corrective-action workflows end to end: data model, approval routing, Vue pages, print formats, tests and the import of the old paper records."
hard: "Importing 1,354 legacy reports without posting stock or inventing signatures, and closing a corrective action on verified effectiveness rather than on the action date."
stack: "Frappe v15 · Python · Vue 3 · MariaDB · Playwright"
notes:
  - "Approval never moves stock"
  - "Held stock uses real reservations"
  - "CAR closes on effectiveness, not action"
  - "Legacy import carries no links"
flow:
  - title: "QC raises a report"
    note: "Pick an area, add item, batch, quantity and photos; submit goes to that area's approver."
  - title: "Action and verification"
    note: "Owners record done dates; a corrective action also needs an effectiveness score."
  - title: "Close and review"
    note: "A QC manager completes it, then the production director signs a review."
---

## The problem

At WinWin Food Industries, the quality team ran its non-conformance reports in two Excel workbooks, one for in-house issues and one for suppliers. Each had a printable form driven by lookups. The form allowed two action rows, closure was a spreadsheet formula, and nothing tied a report to the stock documents it came from.

## What I built

A submittable non-conformance report with one document for five areas: incoming material, customer return, finished goods store, production issue and expired material. The area decides which sections show and who approves. A Vue page gives each user a "waiting on me" list, and the controller recalculates closure and sign-offs server-side, so the browser cannot set them. Held stock is reserved through ERPNext's own stock reservation, so it cannot be picked from any document. A report with mixed per-product actions runs each action separately, with its own person in charge.

The corrective action request sits beside it. In-house and supplier requests share one lifecycle, and suppliers answer through a public link that only works once the request is approved. Closing is refused until an effectiveness score is recorded. The end-to-end record for corrective actions shows 56 of 56 stages passing, each run as the user who would press that button.

## The hard part

The old paper log held 1,354 records. I imported them as read-only history with no item, warehouse or user links, which is what made a bulk import safe: afterwards there were no stock reservations, stock entries or notifications. Frappe will not create a document in a later workflow state, so the patch inserts drafts and then sets the final state. A corrective action closes on its effectiveness check, not on its action date. Reading closure off the action dates had made 60 unverified requests look complete.

The NCR test run covered 17 reports across the five areas with 250 passes and 8 failures out of 258 checks, and it logged those defects instead of hiding them.

## What this work demonstrates

- Modelling a paper quality process as a workflow with roles, sign-offs and audit stamps.
- Keeping business rules on the server and treating the browser as untrusted.
- Migrating years of legacy records without side effects.
- Testing by acting as each real role, not as an administrator.

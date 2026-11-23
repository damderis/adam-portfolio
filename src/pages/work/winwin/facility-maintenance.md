---
layout: ../../../layouts/ErpCase.astro
slug: facility-maintenance
title: Facility maintenance requests
group: Manufacturing and quality
deck: "A paper building-maintenance request became an eight-stage approval and engineering workflow with photos and visibility rules."
problem: "Building and facility repairs were requested on a paper form, with no visible status and an older system that held no records."
role: "I replaced the old doctype in place and built the workflow, Vue page, permissions, photo markup and print form."
hard: "Letting only the people involved see a request, consistently across the page, lists, direct links and private photos."
stack: "Frappe v15 · Python · Vue 3 · MariaDB · Jinja print formats"
notes:
  - "Visibility by involvement, not role"
  - "Parts recorded, no stock moves"
  - "Reject and send-back need reasons"
  - "Replace the unused doctype in place"
flow:
  - title: "Request and approve"
    note: "The requester submits and picks an approver, who approves or rejects."
  - title: "Check, assign, do"
    note: "An engineering manager checks and assigns engineers, who mark the work done."
  - title: "Verify and close"
    note: "The manager verifies or sends it back; the requester completes it."
---

## The problem

Building and facility repairs at WinWin Food Industries were requested on a paper maintenance form. An older version of the request doctype existed, but it held no records on either site, so there was no history to preserve and the owner chose to replace it in place.

## What I built

A Vue page where any desk user can raise a request, with a draft state before submission. The request then moves through approval, an engineering manager's check, assignment to one or more engineers, completion, manager verification and a final completion by the requester. The lifecycle strip reuses the one from the quality workflow and shows who moved each of its eight stages and when. A manager who does not accept the work can send it back with a reason, which clears the done stamp and notifies the engineers.

Parts are recorded against the request but move no stock. Photos attach to each detail line, can be dragged or pasted in, and can be marked up with an annotator reused from another module. Locations come from the existing factory records plus the hostel, so a new factory appears without a code change. The print format follows the paper layout. Requests waiting on a user also appear in the floating task bubble.

## The hard part

Only people related to a request may see it: the requester, the chosen approver, engineering managers once it is approved, the assigned engineers and the system manager. That rule is written twice, once in Python and once as a SQL condition, and both are wired into the permission hooks. The page list, desk list, reports, direct links and private photos all apply it. The roles are not in any fixture file, so they are created by hand per site, and end-to-end testing found that engineering managers could not read an item through the standard call, which led to a purpose-built part lookup.

## What this work demonstrates

- Row-level permissions that stay consistent across every access path.
- Reusing existing components instead of rebuilding them.
- Finding permission gaps through end-to-end testing.
- Taking user feedback during the build, such as the photo rules and the chosen approver.

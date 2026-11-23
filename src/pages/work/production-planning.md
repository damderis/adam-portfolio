---
layout: ../../layouts/CaseStudy.astro
slug: production-planning
problem: "A production plan depends on the sales order behind it, and that order can change after planning has started."
role: "Two-way bill-of-materials sync, packing-aware material views and view preferences in a Frappe and ERPNext manufacturing planner."
hard: "Deciding which changes are safe, which records stay unchanged and how exceptions reach the person editing the order."
notes:
  - "One work-in-progress lock rule for both paths"
  - "No-op guards stop save loops"
  - "Show substitutions, keep the original reference"
context: WinWin Food Industries Sdn Bhd, an F&B manufacturer and distributor in Malaysia
---

## Orders change. Plans need boundaries.

A production plan depends on the details of a sales order: the selected bill of materials, the packing requirements and the quantity being made. A snapshot helps preserve what was planned, but it can also become stale when an order changes.

This work extends a manufacturing planner in Frappe and ERPNext for an F&B manufacturer and distributor in Malaysia. It focuses on keeping related records consistent while protecting plans that have already moved into work in progress.

## Synchronising the bill of materials

Before the synchronisation work, changing the bill of materials on a sales order did not propagate to an assigned production block. Changing it inside the planner also did not update the originating order line.

The two-way flow handles both entry points. An order change can update linked production blocks only when the plan is still a draft, no work in progress has been planned and the replacement bill of materials is valid for the item. Blocks that cannot be changed are skipped and reported to the person editing the order.

The planner uses the same work-in-progress lock rule as the order synchronisation path. Centralising that rule avoids two interfaces giving different answers to whether a change is allowed.

## Avoiding an update loop

Two-way synchronisation can accidentally become an endless chain of saves. These paths use targeted field updates and no-op guards when values already match, rather than repeatedly saving the parent document.

The scope is deliberately precise. A planner-side edit changes the block being edited and its originating order line; it does not cascade to sibling production blocks. Updates from the order side can fan out to eligible linked blocks. Open planner views receive refresh events after changes are committed.

## Material demand should reflect the actual packing

Customer-specific packing substitutions were already applied when creating a work order, but the planner’s material views could still show the original bill-of-materials items. That left planning and execution describing different requirements.

Packing snapshots on production blocks allow the planner to show effective substitutions and additional packing items. The per-order material view and aggregated material summary use those effective requirements. Where a quantity has no packing snapshot, its original bill-of-materials packing remains in the calculation.

Substitution provenance stays visible in the interface. The planner’s calculation is a display and aggregation concern; it does not rewrite the order’s original material reference. Maintaining agreement with work-order packing logic remains an explicit engineering constraint.

## Remember the layout, not a stale day

View preferences preserve the chosen board or calendar layout per browser and user. They intentionally exclude business filters and the viewed date, so reopening the planner does not silently restore a stale planning period. Storage is best-effort: unavailable browser storage should not stop the planning screen from working.

## What this work demonstrates

The difficult part is deciding which changes are safe, which records should remain unchanged and how exceptions reach the user. This work brings those decisions into Vue interfaces, Python services and the underlying data model.

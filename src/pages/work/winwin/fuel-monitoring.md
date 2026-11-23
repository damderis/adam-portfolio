---
layout: ../../../layouts/ErpCase.astro
slug: fuel-monitoring
title: Fuel Monitoring
group: Logistics and fleet
deck: "Fuel receipts are checked against GPS tank data, and managers review the flagged ones on a dedicated page."
problem: "Fuel was tracked only as money, and nothing checked that the fuel paid for went into the lorry."
role: "Built the receipt check, the scheduled sweep, the review page with acknowledgement, and the move to litres for the diesel quota."
hard: "Telemetry cannot be read back later, and the first version measured the wrong thing and raised false alerts."
stack: "Python · Frappe · Vue 3 · Playwright · Redis"
notes:
  - "Check runs minutes after the receipt"
  - "Scheduled sweep instead of delayed jobs"
  - "Alerts stay in the page only"
flow:
  - title: "Receipt scanned"
    note: "A driver photographs the fuel receipt and OCR reads it."
  - title: "Delayed check"
    note: "A scheduled job reads the lorry's tank level from GPS data."
  - title: "Manager review"
    note: "Flagged receipts show with the photo and need a reason to clear."
---

## The problem

Drivers photograph a fuel receipt in the driver app, and OCR reads the amount, date and plate. That recorded the spend, but nothing verified the fuel reached the tank. Company policy is a full tank at every fill.

## What I built

I extended the receipt record with a read-only sensor check. A few minutes after a receipt is saved, a job that runs every five minutes asks the fleet GPS provider for the lorry's live tank level. A reading below the configured threshold, 93 percent in the first version, is flagged. A lorry with no fuel probe resolves to "No Sensor Data" and never raises an alert.

I chose a scheduled sweep over a delayed queue job because a missed tick is picked up on the next run. The check is deferred because a float sensor takes minutes to settle after a fill, and an immediate read would report a false low. Results are written directly to the record rather than through a full save, so a background job cannot fail on a receipt that was already accepted.

A Fuel Monitoring page shows alerts first, then per-lorry status and a receipt archive. A manager opens a receipt, sees the photo, the OCR result and the tank reading, and acknowledges it with a mandatory reason. Alerts are in the page only; the source records that nothing is pushed, emailed or sent by WhatsApp. I later moved the subsidised diesel limit from money to litres and had the scan read litres off the slip.

## The hard part

The provider's fuel and odometer readings exist only on live endpoints, so every reading has to be captured when it happens. The first version also compared tank percentage after a refuel, which gave a false alert on a receipt that the provider's own refuel figures showed as accurate. I reworked it to compare the receipt against the provider's detected refuel events, driven through its web interface with Playwright, because it has no API for that. I fixed a stale-table bug that attributed one lorry's refuels to the next by reloading the page per lorry.

## What this work demonstrates

- Working around an external system's limits.
- Background jobs that fail soft and recover on their own.
- Finding and correcting a wrong metric.
- Review tooling with an audit trail.

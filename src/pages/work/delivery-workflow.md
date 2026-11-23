---
layout: ../../layouts/CaseStudy.astro
slug: delivery-workflow
problem: "Office teams plan trips while drivers record each stop in the field, and the connection is not always there."
role: "A delivery planning board and calendar, plus offline capture and safe replay in the mobile driver app, across Vue, Python and database constraints."
hard: "A retry has to be safe even when the request reached the server but the response never reached the device."
notes:
  - "An operational day, not midnight to midnight"
  - "Capture time is stored apart from upload time"
  - "Request ID plus a unique constraint"
  - "Offline capture, not an offline app"
context: WinWin Food Industries Sdn Bhd, an F&B manufacturer and distributor in Malaysia
---

## The plan has to reach the driver

Dispatch planning and delivery capture are two views of the same working day. Office teams need to assign orders, returns and collections to vehicles. Drivers need a mobile view of their trips and a way to record what happened at each stop.

This work connects a delivery planning interface with extensions to a mobile driver application inside an existing Frappe and ERPNext environment. The system serves an F&B manufacturer and distributor in Malaysia.

## A shared dispatch view

The delivery planner provides a board and calendar for assigning delivery work. Its workflow includes realtime collaboration and presence, a touch-first mobile view, visibility for undelivered orders and service dates alongside the planning calendar.

The application uses an operational day rather than assuming every day begins at midnight. That is a small but important modelling decision: the software needs to match the business’s planning window.

Trip instructions also need to survive changes after departure. When a manager changes a remark after a trip has departed, the driver sees the updated instruction the next time the trip is opened or refreshed. Acknowledgement belongs to the assigned driver. This is refresh-based behaviour, rather than a claim of live push delivery.

## When the connection disappears

The driver workflow previously had a failure path where a delivery submission could remain in a recording state when the server could not be reached. Offline capture addresses that gap with an IndexedDB queue for delivery confirmations, photos and cannot-deliver actions.

Pending submissions survive closing the app. Replay is triggered when connectivity returns, when the app regains focus, during retry checks and on startup. The queue preserves capture order and processes one submission at a time.

## Retrying without duplicating

A retry needs to be safe even when the original request reached the server but its response did not reach the device. Each submission carries a client-generated request identifier. A database uniqueness constraint provides the final protection against duplicate delivery records and repeated side effects.

Capture time is stored separately from upload time. This lets a delayed upload retain when the driver actually recorded the delivery. Implausible device timestamps fall back to server time rather than being accepted without validation.

Transport failures stay queued for retry. Repeated server rejections are surfaced for attention instead of being retried indefinitely. Pending status and a manual sync action make that state visible to the driver.

## The boundary matters

This is offline capture and replay, not a fully offline application. The driver still opens the application while connected. There is no service worker providing a cold start in a dead zone, and not every action is queued. Keeping that limit explicit helps the interface set the right expectation.

## What this work demonstrates

The work spans Vue interfaces, Python services and database constraints. Its central concern is consistency across a human handoff: planning work in the office, capturing it in the field and reconciling the record when a network connection becomes available.

---
layout: ../../../layouts/ErpCase.astro
slug: inventory-system
title: Inventory System
group: Sales and purchasing
deck: "A separate Frappe app for office, hardware and spare-part purchasing, with batched approval emails and material gate passes."
problem: "Purchasing and stock for office items, hardware and spare parts needed quotations, approvals, receiving, stock and supplier custody tracking in one place."
role: "I built the app from October to November 2026: 52 commits and 61 merged pull requests, covering the desk page, approvals, prints, imports and gate passes."
hard: "Making email approvals safe: signed links, expiry, stale-document checks and a clear route for each item type."
stack: "Frappe v15 · ERPNext · Python · Vue 3 · MariaDB · Redis"
notes:
  - "Reuse ERPNext documents, no new stock types"
  - "Approvals batched every 30 minutes"
  - "Signed links die when document changes"
  - "Gate passes create no stock entries"
flow:
  - title: "Quotation or direct PO"
    note: "The store drafts a quotation or raises an order; approvers are chosen by item type."
  - title: "Batched approval email"
    note: "Each approver gets one digest with approve, reject and postpone actions."
  - title: "Receive, issue, track"
    note: "Receipts go to each item's store; service orders can open a gate pass."
---

## The problem

WinWin Food Industries buys office stationery, hardware and spare parts through a store. That needs quotations, approvals, purchase orders, receiving, stock counts and, for services, tracking of material sent to suppliers. I built this as a separate Frappe app over October and November 2026: 52 commits and 61 merged pull requests.

## What I built

An Inventory Desk page covers quotations, purchase orders, receiving with QR stickers, suppliers, scan-to-issue and borrow, stock and loans. The app uses ERPNext's own documents and entry types and defines none of its own. Each item type has its own store, and a document holding only these items cannot mix them with production materials.

Quotations stay drafts until the store submits them. Approvals are emailed in batches every 30 minutes, one email per approver, with approve and reject per document, postpone for orders, and approve-all. Reject and postpone open pages that require a reason or a date. Purchase orders for office items need a second release approval before download. A rejected order can be resubmitted with new proof images. Other pieces include PDF and Excel print output, a selectable Excel template for stock imports, supplier maintenance, payment terms and return decisions.

Material gate passes follow a service order. A QR-based public form lets a supplier submit details, the selected approver approves, security records departure and return, and partial returns and overdue filtering are supported. Custody tracking creates no stock or accounting entries.

## The hard part

Approval pages are open to guests, so each acts only under a link signed for one approver. Links expire after seven days and stop working once the document changes after the email. Postponing never approves automatically; on the chosen date the request returns to pending and asks again. One-click approve was a user requirement, and the docs record the trade-off that email scanners opening the link could trigger it.

## What this work demonstrates

- Building a full purchasing flow on top of ERPNext rather than around it.
- Security-minded design for public, token-based approval pages.
- Shipping steadily through small, reviewed pull requests.
- Recording trade-offs and rollout checks in writing.

---
layout: ../../../layouts/ErpCase.astro
slug: goods-receipt-ocr
title: Goods receipt with supplier DO scanning
group: Manufacturing and quality
deck: "A receiving page where the operator photographs the supplier's delivery order and the system suggests the matching purchase order and lines."
problem: "Receiving staff typed delivery order details and picked purchase orders by hand on a desk form."
role: "I built the Vue receiving page, the scanning pipeline, the server-side matching and the redirects from the old form."
hard: "Making a vision model's output useful without trusting it: it only suggests, and the physical count is always typed."
stack: "Frappe v15 · Python · Vue 3 · OpenRouter vision model · OpenCV.js"
notes:
  - "Scanned quantity is a hint only"
  - "Blur warns, never blocks"
  - "Scan can only propose pickable POs"
  - "Server enforces the PO date rule"
flow:
  - title: "Photograph the DO"
    note: "The camera finds the page, flattens it and checks sharpness before upload."
  - title: "Read and match"
    note: "A vision model reads DO and PO numbers and lines; the server resolves real records."
  - title: "Count and submit"
    note: "The operator enters the true counts, completes the quality checklist and submits."
---

## The problem

Receiving at WinWin Food Industries used a desk form on which staff typed the supplier's delivery order number and picked purchase orders by hand. The goal was a page that cuts the typing by reading the paper delivery order.

## What I built

A full Vue page that replaces the form for creating and completing a goods receipt. In the first stage the operator photographs the supplier's paper delivery order. A vision model, called from the server so the key never reaches the browser, reads the delivery order number, purchase order numbers and delivered lines. The page fills the delivery order number, selects the matching purchase order and shows what the document claimed beside each line. One delivery order can quote several purchase orders, and one tap adds all scanned items.

The second stage is the quality checklist with photos, and submitting creates the quality inspections. The old desk form still works for submitted and read-only records, and both paths share one server helper so item mapping cannot diverge.

## The hard part

The scan is only a hint. Scanned quantities are never written to the received quantity, and the scanned supplier name never narrows the search, because a misread would hide the real order. Matching goes through the same query the manual picker uses, so a scan can only propose an order the operator could have chosen. Line matching refuses a result unless it clearly beats the runner-up.

The work was iterative. A configured model tier had never been passed to the request, and the line-item prompt was one sentence. A short read looked like a full one until the model was asked to return its own row count, so the page can say "Read 2 of 5 item rows". Order numbers often sit inside the item table, which needed prompt and code changes. Testing also showed the model reports high confidence on a blurred photo, so a client-side sharpness check does the real work, and it warns without blocking. A server rule stops receipts from allocating against purchase order lines scheduled in the future.

## What this work demonstrates

- Putting an AI model behind validation and keeping a human in control of numbers.
- Debugging a model pipeline from evidence: logs, counts and measured thresholds.
- Mobile-first capture with graceful fallbacks.
- Enforcing business rules at one server choke point.

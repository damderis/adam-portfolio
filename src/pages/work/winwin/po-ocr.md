---
layout: ../../../layouts/ErpCase.astro
slug: po-ocr
title: AI OCR for purchase orders
group: AI and DevOps
deck: "Turning customers' purchase orders, in many layouts, into draft delivery orders with AI reading, parsers and matching."
problem: "Customer purchase orders arrive as PDFs and spreadsheets in different layouts and had to become delivery orders."
role: "I built the import and scan paths: per-customer parsers, AI OCR for inconsistent formats, PDF splitting, and item matching."
hard: "Deciding which source to trust, and matching a printed PO line to the right item without guessing."
stack: "Frappe v15 · Python · Vue 3 · OCR · PDF parsing"
notes:
  - "One parser per customer layout"
  - "Excel is the data, PDF is evidence"
  - "Matching scoped to the request's items"
flow:
  - title: "Upload"
    note: "Staff upload a PO as PDF, photo or Excel."
  - title: "Read"
    note: "A parser or AI OCR extracts PO numbers and lines."
  - title: "Match"
    note: "Lines map to items and a delivery address; mismatches become warnings."
---

## The problem

Customers send purchase orders in their own formats. The ERP needed them as delivery orders. A single PDF could also hold several POs, and one user complaint was that a multi-PO PDF was not being split correctly.

## What I built

Two tools read POs.

**Delivery Order Import** turns PO PDFs and Excel files into delivery orders. It uses one parser per customer layout, splits multi-PO PDFs, and from July 2026 added an AI OCR path for layouts the parsers could not handle.

**Batch Sales Request processing** is the office-side tool that turns salespeople's requests into delivery orders. It scans the attached PO and shows the PO beside the request. Commits from September add a step where the reviewer separates the pages and the AI reads the ones plain OCR cannot.

For three customers I added a paired import. The Excel file is the source of data, and the PDF is used only to find each PO's pages and attach a split copy as evidence. The import warns when the PDF has POs the Excel lacks, or the reverse. This let me delete about 150 lines of fuzzy address matching, so addresses now match only by store-code mapping or exact title.

## The hard part

Matching a scanned line to an item is where wrong answers hide. Delivery Order Import resolves lines by barcode, then by a maintained table of customer item codes, with reversals for chains that print codes differently. Batch processing scopes matching to the request's own items, so a barcode repair cannot land on an unrelated product. A line for a product nobody keyed is reported as not on the request, not guessed.

A product ruling shaped it too: Batch processing is about the items, not the money. A PO price that differs from the price list is flagged as information only, because the operator settles the real rate when creating the order.

## What this work demonstrates

- Treating AI reading as one source to cross-check, not as the answer.
- Choosing a trusted source and surfacing mismatches rather than hiding them.
- Deleting complex heuristics when a simpler rule is more reliable.

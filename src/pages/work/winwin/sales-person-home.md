---
layout: ../../../layouts/ErpCase.astro
slug: sales-person-home
title: Sales Person Home
group: Sales and purchasing
deck: "A phone hub for field salespeople: visit clock-in, sales requests, forecasts, returns and stock-take periods."
problem: "Salespeople work from their phones in the field, and the standard ERP forms were not built for that."
role: "Built the clock-in flow and the mobile pages around it, plus the rules that tie visits, commission and stock-take closures to delivery."
hard: "Field data feeds pay and delivery decisions, so each rule had to be enforced on the server and not just in the interface."
stack: "Vue 3 · Frappe · Python · MariaDB · Playwright"
notes:
  - "GPS radius check happens on the server"
  - "Commission counts address, type and month"
  - "Stock take blocks delivery orders, not plans"
flow:
  - title: "Clock in on site"
    note: "Phone GPS finds nearby customer sites within a set radius."
  - title: "Complete the visit"
    note: "Activities and proof photos are recorded and may go to review."
  - title: "Feed downstream rules"
    note: "Approved visits count toward commission and stock-take windows."
---

## The problem

WinWin Food Industries has a field sales force. Salespeople need to prove they visited a customer, raise sales requests, record returns and forecasts, and report when an outlet closes to count stock. The standard ERP forms do not suit that on a phone.

## What I built

The first page I built, in April 2026, was Salesman Visit Clock In. It reads the phone's GPS, finds nearby customer sites within a 3 km radius, and creates a visit with a locked timestamp. The salesperson picks activities, and proof photos are mandatory only for Block Display. A visit goes to Pending Review until a manager approves the display evidence and any linked third-party customer. Commission counts one visit per address, display type and month.

Sales Person Home grew from that into the hub for the other pages: sales requests, customer return, forecast, survey, customer detail, stock take period and expense claim. It became the visual reference for the other pages I built. The custom pages are for plain salespeople, and back-office roles fall back to the standard forms.

Other rules sit behind it. A Sales Forecasting report combines sales history, free stock, draft Delivery Note demand and open Work Orders. A sales request can produce several Delivery Notes, and its status moves from Approved through In Process and Partially Completed to Completed. Customers who require a PO cannot submit a request without one.

## The hard part

Stock take closures must stop deliveries without blocking planning. A draft is a plan and a delivery order is a delivery, so only order creation is blocked, using the delivery date rather than today. Stale drafts must not block anything. In the source's example, 17 open drafts looked blocked and only 2 were genuinely current. Adding a three-day lead-in to the badge also broke the planner's confirmation gate until I changed it to read the closure window directly.

I tested the custom pages with a Playwright harness that checks them against the standard form workflow.

## What this work demonstrates

- Mobile-first field tooling tied to real business rules.
- Server-side enforcement of rules the interface only reflects.
- Reasoning about dates and edge cases in a gating rule.
- End-to-end browser testing to protect live users.

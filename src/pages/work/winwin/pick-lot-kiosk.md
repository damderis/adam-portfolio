---
layout: ../../../layouts/ErpCase.astro
slug: pick-lot-kiosk
title: Pick Lot Kiosk Login
group: Logistics and fleet
deck: "A badge-scan login that turns a shared warehouse terminal into per-person sessions."
problem: "On a shared terminal nobody logged out, so every pick was attributed to whoever opened it first."
role: "Built the badge login, idle-timeout enforcement, activity audit logs and an API role guard for the picking scanner."
hard: "Frappe's own session expiry cannot enforce a precise idle timeout, so the idle clock had to be built separately."
stack: "Python · Frappe · Redis · Vue 3 · JavaScript"
notes:
  - "Only a hash of each badge is stored"
  - "Idle measured from real user input"
  - "UI lockdown is not the security boundary"
flow:
  - title: "Scan badge"
    note: "A scanner gun types the token into a public prompt page."
  - title: "Session for that person"
    note: "The token is hashed and checked, then logs in the badge's own user."
  - title: "Idle logout"
    note: "No input for the window ends the session and returns to the prompt."
---

## The problem

The pick lot scanner is a warehouse picking page used on shared shop-floor terminals. Reaching it meant typing a username and password into the ERP. Nobody logged out, so the session belonged to whoever opened it first and every pick was attributed to that one account.

## What I built

The terminal now sits on a public page that shows only a "scan your badge" prompt. A store employee scans a printed QR badge with a hardware scanner, and that creates a real session for their own user account, so picks are attributed correctly. The scanner page itself was not modified.

Only a hash of each badge token is stored, so a lost printout is regenerated, not reprinted. A badge works only if it is enabled, unexpired, and linked to an enabled user who holds the store role. Every failure returns one generic message, and attempts are rate limited. Each terminal is a bookmark with its own name, which is stamped on the logs.

Two audit logs record sign-ins, including failed ones, and the write actions each person then took. The kiosk strips the ERP navigation and routes the session only to the warehouse pages.

I also found that the role list on the scanner page gated only page rendering. Any logged-in user could call its server methods directly. I added a role guard to every one of them.

## The hard part

Frappe's per-session expiry refreshes too coarsely to enforce a precise idle window. Using last request time was no help either, because the page polls the server on its own. So idleness is measured from real user input in the browser, with a heartbeat to a Redis key that expires. A request hook ends the session when the key is gone. If Redis is flushed, kiosk sessions fail closed.

The source states plainly that hiding the interface is not a security boundary. The real boundary is the server guard and giving badge users the minimum role.

## What this work demonstrates

- Authentication design with attention to failure modes.
- Closing a real permission gap found while reading the code.
- Auditing that logs failed attempts as well as successes.
- Documenting limits honestly.

---
layout: ../../../layouts/ErpCase.astro
slug: slot-booking-bot
title: Retailer slot-booking bot
group: AI and DevOps
deck: "A Playwright bot that books and cancels delivery slots on a retailer's supplier portal and shows the gate QR in the ERP."
problem: "A retail chain would not admit a lorry without a booked warehouse slot and a QR shown at the gate."
role: "I built the portal automation, the booking records, and the planner and driver-app views that show the booking and QR."
hard: "The portal is a Blazor Server app whose pages fail silently, and its UI changed during the year."
stack: "Python · Playwright · Frappe v15 · Vue 3"
notes:
  - "Positive sign-in signal, not absence of form"
  - "Find booking by PO in a child table"
  - "Test every function on the live portal"
flow:
  - title: "Plan"
    note: "A delivery is planned for the retailer's POs."
  - title: "Book"
    note: "The bot signs in and books one slot covering those POs."
  - title: "Show"
    note: "The booking and gate QR appear on the planner and driver apps."
---

## The problem

One retail chain requires a booked warehouse slot before it admits a lorry, and issues a QR that the driver shows at the gate. Slots are booked on the retailer's supplier portal.

## What I built

A Playwright bot that signs in to the portal and reads booking history. It retrieves the QR and matches each booking to a lorry and trip. By 14 August 2026 this was verified on a restored copy of production data: login, history, QR retrieval, matching, planner badges, and the QR on the driver and assistant apps.

The booking and cancel actions were added later. When the portal was redesigned in November, I fixed the selectors and tested every function against the live portal. That meant booking and cancelling sample slots, including through the planner dialog in a browser. I also fixed cancelled rows, which have no QR and were being duplicated on every sync.

## The hard part

The portal's behaviour was not visible in the code, and each quirk showed up as a hang or a plausible wrong answer.

- **Blazor Server.** Waiting for the network to go idle never finishes, because the socket stays open.
- **Login.** The form paints, re-renders and blanks its inputs, so the bot must settle, fill, and read the values back.
- **Signed in.** Success needs a positive marker. A missing password field proves nothing, because a stale cookie shows the page shell anyway.
- **One booking, many POs.** A booking covers several POs, so lookup has to ask which booking contains a PO. A text match on a shorter PO number can return a longer one and hand the driver the wrong QR.
- **Plates.** The plate is free text and sometimes spaced, so matching strips it to letters and digits and looks for known fleet plates.

One path is untested: a real refusal from the portal was only simulated, not seen.

## What this work demonstrates

- Automating a system with no API, and recording its quirks for the next person.
- Verifying against the real system before deploying, including cleaning up test bookings.
- Choosing safe lookups where a wrong match has a real-world cost.

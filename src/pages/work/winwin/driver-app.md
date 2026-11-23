---
layout: ../../../layouts/ErpCase.astro
slug: driver-app
title: Driver App
group: Logistics and fleet
deck: "A phone-first app for lorry drivers and their assistants, covering the trip schedule, allowance and lorry tyre records."
problem: "Drivers needed one place on their phone for trips, allowance and lorry records, and the screens had to work for people who hold almost no ERP permissions."
role: "Extended the Vue 3 driver app inside the ERP, added its Allowance tab, dark mode, a read-only assistant version and per-lorry tyre diagrams."
hard: "Drivers hold a single narrow role, so anything that looked fine to an administrator, such as private photos, failed for the people who needed it in the field."
stack: "Vue 3 · Frappe · Python · PrimeVue · IndexedDB"
notes:
  - "Allowance reuses the report's calculation"
  - "Identity comes from the Driver link"
  - "Assistant app is strictly read-only"
flow:
  - title: "Open the app"
    note: "The session user is matched to a Driver record."
  - title: "Schedule or Allowance"
    note: "A tabbed shell shows trips and stops, or the month's allowance."
  - title: "Record and sync"
    note: "Deliveries are saved on the device if signal drops, then replayed."
---

## The problem

WinWin Food Industries runs its own lorry fleet. Drivers and their assistants need to see their trips, record deliveries, check the allowance they have earned, and report on the lorry, all from a phone. The people using it hold one narrow ERP role, so the app cannot lean on the permissions an office user has.

## What I built

The driver app was already a mobile-first Vue 3 page, and I extended it. I turned it into a tabbed shell with a Schedule tab and a new Allowance tab. The Allowance tab calls the same calculation the monthly allowance report uses, so a driver's figures cannot disagree with the report. I added dark mode through shared colour tokens, so each tab picks it up without its own overrides.

I also built a read-only Driver Assistant app for the person riding along. It reuses the driver app's helpers and the shared Allowance component, and it has no write path at all. For lorry upkeep, I added tyre diagrams per lorry type in the checklist, where a driver taps a tyre to attach a photo and see its record. Delivery capture also survives dead zones through on-device storage and automatic replay, which has its own case study.

I wrote an architecture brief comparing three ways to package the app: a home-screen web app, a thin Capacitor shell, or a full native rewrite. It recommended the cheapest option that worked.

For warehouse terminals and drivers there is also a React Native (Expo) app, built from one codebase in two flavours: a kiosk launcher for store terminals with badge sign-in, and a phone app for drivers. It adds in-app update detection, simpler location-permission recovery, local storage while offline and automatic sync when the connection returns.

## The hard part

Drivers hold only the Delivery User role, and assistants only the Driver Assistant role. A private file attached to a custom record failed the permission check for every driver, while it displayed correctly for an administrator. I fixed it by serving the file through an endpoint that checks the driver owns the trip, then reads the file on the system's behalf. Verification used a real download as the driver, because permission-check helpers gave false answers.

Access in both apps rests on the driver link, never on the page's role list, which is left open.

## What this work demonstrates

- Designing for restricted users, and testing as them rather than as an administrator.
- Keeping one source of truth for money calculations across a report and an app.
- Choosing the lowest-cost packaging option and writing down why.
- Extending an existing system without copying it.

---
layout: ../../layouts/CaseStudy.astro
slug: amjohor
problem: "A Johor state-level programme needed one place for its staff to follow council members' activity across local authorities, review it and report on performance."
role: "Built the web frontend in Nuxt 4: role-based navigation, the activity feed and review flow, performance views, dashboards and printable reports, connected to the programme's API."
hard: "Giving each staff role the right view and the right scope across many local authorities, in one consistent portal."
notes:
  - "Role-based views from one codebase"
  - "One source for on-screen and printed reports"
  - "Documented for the next developer"
context: Freelance via Treom Tech · Nuxt 4 management portal · Oct–Dec 2026
---

## What the portal is for

AM Johor is a Malay-language staff portal for a state-level programme that works with council members (Ahli Majlis) across Johor's local authorities. Council members record their field activity, and programme staff use the portal to follow that activity, review it and understand performance across the state.

Different staff roles see different things. Reviewers work through the activity in their area, while executives look at the bigger picture across local authorities and the state as a whole.

## What I built

I built the staff-facing web frontend in Nuxt 4, working from October 2026 as a freelancer through Treom Tech:

- An activity feed with filters, comments and follow-up.
- A review flow for feedback and appeals.
- Performance views with a breakdown for each member.
- A dashboard for an overview at a glance.
- Reports for the state, a local authority or a single member, exported as PDF or CSV.
- Light and dark themes, and layouts that work on a phone.

## How it fits together

Access follows each person's role and assignment, so the same portal serves every role without separate versions. Scores and results are shown exactly as the programme's API provides them, which keeps every screen and report consistent with one another.

Reports are built once and used twice: the same preview becomes A4 pages for printing to PDF and a CSV file for spreadsheets.

The codebase is organised into feature layers, covered by automated tests for sessions, roles, workflows and reports, and documented in a technical blueprint so another developer can pick it up.

## What this work demonstrates

AM Johor shows building a role-based internal tool for a public-sector programme: clear navigation for different kinds of staff, reliable reporting, and a codebase organised and documented for whoever maintains it next.

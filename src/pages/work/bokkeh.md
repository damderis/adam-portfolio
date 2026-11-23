---
layout: ../../layouts/CaseStudy.astro
slug: bokkeh
problem: "A photographer’s booking takes more than a portfolio: the client has to understand the offer, book and pay, and later receive the gallery."
role: "The public sales funnel and landing page, demo vendor experiences, portfolio presentation, the R2 gallery storage migration and a broader interface restyle."
hard: "CHIP payments and the WhatsApp AI booking bot are distinct integration boundaries, each with its own state and failure cases."
notes:
  - "One path from discovery to a booked session"
  - "Galleries on Cloudflare R2 or Google Drive"
  - "Each integration has its own failure cases"
context: Independent photography platform
caption: A real view of Bokkeh’s public product experience.
---

## One place for the whole booking

Photographers sell with pictures, but booking one takes a lot more than a nice portfolio. The client has to understand what’s on offer, pick a slot and pay. After the shoot, the photographer still has to get the gallery to them somehow.

Bokkeh puts all of that in one product for photographers and studios: portfolio pages, a booking flow, payments and client galleries. I worked on both sides of it, the public pages that sell a vendor and the tools that run the booking behind them.

## The product takes a wider view

The public sales funnel and vendor pages are part of the product, rather than a separate marketing exercise. Work on Bokkeh has included the landing page, demo vendor experiences, portfolio presentation and a broader interface restyle. The aim is a coherent path from discovering a photographer to understanding what to book.

The platform also includes pricing plans, analytics and a blog workflow with AI-generated drafts. These sit around the core service: helping a photography business present its work and manage the next step with a client.

## Galleries, storage and payments

Client galleries support Cloudflare R2 storage or Google Drive. Work on the R2 migration connects the visible gallery experience to a practical storage decision: delivering photos requires a dependable way to store and serve them, alongside the booking application.

CHIP provides the payment integration. A WhatsApp AI booking bot is another part of the product, extending booking conversations into a channel already familiar to its intended users. These are distinct integration boundaries, each with its own state and failure cases.

## Engineering across the product

The application uses Next.js, Convex, Tailwind and shadcn/ui, with Cloudflare R2 for storage. The work brings together frontend presentation, application data, external integrations and the supporting commercial experience.

The useful engineering question is how each part fits into the photographer’s workflow. A gallery should connect to the service being delivered; a vendor page should lead somewhere useful; a payment should belong to a booking. That relationship between product flow and implementation is the focus of this project.

## What this work demonstrates

Bokkeh shows product development across a connected service, from public discovery to post-session delivery. The work connects the presentation of a creative business with the practical systems needed to run its service.

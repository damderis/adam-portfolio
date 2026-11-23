---
layout: ../../layouts/CaseStudy.astro
slug: aifiqh
problem: "AI Fiqh lets people explore Islamic knowledge through AI chat and a digital library, so answers have to arrive as a live stream and still point back to their sources."
role: "Part-time freelance engineer on the web app and its Java and Node backends, covering streamed chat UI, library and billing screens, email and limit endpoints, and a background-worker server."
hard: "Keeping a token-by-token stream, tool-call steps and message IDs consistent across several answer modes without duplicated or out-of-order messages."
notes:
  - "Read the stream event by event"
  - "One singleton worker beside two API slots"
  - "Switch traffic only after a health check"
context: Freelance · AI Fiqh (FiqhTech)
caption: The AI Fiqh chat, signed out.
---

## What it is

AI Fiqh is a web app for exploring Islamic knowledge. You can chat with an AI, browse a library of classical texts, sort conversations into collections and pay for a plan. Every answer has to show where it came from, so the chat handles a lot more than plain text.

## What I built

The frontend is Next.js and React with TanStack Query, NextAuth and i18next, and it ships as an installable PWA. I refactored legacy screens into a route, screen and service layering, and wrote page-level docs for it. On top of that I built the chat interface, library and collection pages, pricing and checkout flows, and the account screens that show plan and message limits.

## The streamed answers

The chat reads server-sent events from a streaming service through `fetch` and `ReadableStream`. Events carry message IDs, answer chunks, tool calls, tool results and errors, and each is handled on its own path. One mode splits an answer into six scholarly tabs that fill as their sections arrive. The agentic modes show a thinking panel that lists each tool step the model takes, and a reference tab opens the original source text. I added Tafsir and Hadith modes alongside Sirah and Madrasah, and spent a good share of the work on fixes for duplicated streaming, message ordering and message ID mismatches.

## Backend and the worker server

On the Spring Boot API I worked on the message-limit reset endpoint, email verification and timezone handling, newsletter delivery, collection admin fields and promo checkout. For bulk email I set up a separate background-worker server for a NestJS application. It runs under systemd with two API slots, primary and backup, and one singleton worker that is the only process allowed to run schedules and consume email jobs. A deploy script refuses to rebuild the live slot, waits for health checks, switches the Nginx upstream, and restores the previous release if the worker fails to come up. Rollback means switching back to the other slot. Access is restricted by bearer key, origin check and loopback-only app ports.

## What this work demonstrates

- Building LLM interfaces that stream, show tool activity and keep references attached to answers.
- Running a production worker with systemd, health-checked releases and a rollback path.
- Working across a Next.js frontend and Java and Node services, including testing, client support and production fixes.

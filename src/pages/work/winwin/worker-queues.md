---
layout: ../../../layouts/ErpCase.astro
slug: worker-queues
title: Cross-site integration and worker queues
group: AI and DevOps
deck: "Dedicated background queues so heavy jobs stop blocking the rest, and a retry-safe stock handoff between two company sites."
problem: "One worker served all scheduled and user-triggered jobs, so push notifications, backups and report sweeps starved everything else."
role: "I split the work into dedicated queues, routed each job type to the right one, and built the call that closes a stock transfer on the sister company's site."
hard: "Frappe hardcodes some queue choices, and a queue without a running worker drops jobs silently."
stack: "Frappe v15 · Python · Redis RQ · MariaDB"
notes:
  - "Tick wrappers route cron jobs to queues"
  - "Remote call runs before local submit"
  - "Retry 405s, which come from nginx"
flow:
  - title: "Delivered"
    note: "A driver confirms delivery on the distribution site."
  - title: "Submit"
    note: "The draft's pre-submit step calls the manufacturing site's endpoint."
  - title: "Close"
    note: "The remote stock entry submits; if refused, the local submit aborts."
---

## The problem

The ERP runs two company sites in one bench: a distribution site and a manufacturing site. Before this work, a single worker process served the three built-in queues for both. Frappe puts every cron, daily, hourly and "all" job on the default queue, which left about 98 job types sharing one worker.

The worst offenders were push notifications at about 8,500 a day, an every-minute S3 backup that ran inline, and three multi-minute stock-cache sweeps. Push notifications accounted for 229 of the 231 failed jobs on the default queue.

## What I built

I set up seven dedicated queues, five of them new (notification, backup, batch, stock cache and bulk delivery-order conversion, alongside the report and print queues production had declared but never used). Each has its own timeout and worker line. Cron entries cannot choose their own queue, so I turned them into short "tick" functions that enqueue the real work, keeping the original hook names so no scheduled-job rows needed changing. Where Frappe core hardcodes a queue, I overrode only that method.

For cross-site work, closing a delivery draft on the distribution site now submits the matching stock entry on the manufacturing site over the existing integration connection. The remote call runs before the local submit, so a refusal leaves the draft open and shows the remote error text. It is idempotent, and the remote side only accepts safety-stock replenishment transfers.

## The hard part

Two quiet failures shaped the design. A bare worker consumes every custom queue, which undoes the isolation, so the general worker is pinned to its three queues. And enqueueing to a queue with no worker raises no error, so config and worker process must ship together. I also traced intermittent 405 responses on the cross-site call to nginx rather than Frappe, and added 405 to the retryable statuses.

## What this work demonstrates

- Diagnosing load from measured job volumes rather than guesses.
- Writing rollout steps that account for production differing from dev.
- Designing a cross-system call that fails safely and can be retried.

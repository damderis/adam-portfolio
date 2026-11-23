---
layout: ../../../layouts/ErpCase.astro
slug: ai-workspace
title: AI Workspace
group: AI and DevOps
deck: "An AI assistant panel inside the ERP that reads page and record context, with each user's chats kept private."
problem: "Staff needed help finding information and understanding errors, but a shared AI login would expose everyone's chats and ERP data."
role: "I built a standalone Frappe app with a ChatGPT-style interface, an assistant that reads ERP records as the signed-in user, and a task inbox in the same panel."
hard: "Driving one shared browser login for many users without letting anyone see another person's conversations or data they lack permission to read."
stack: "Frappe v15 · Python · Vue 3 · Playwright · Redis queue"
notes:
  - "Own app, not inside the main ERP app"
  - "Every chat runs as a Temporary Chat"
  - "Ownership enforced by Frappe permissions"
flow:
  - title: "Ask"
    note: "User asks from a floating panel or an error dialog."
  - title: "Queue"
    note: "A background worker adds record context and calls the model."
  - title: "Answer"
    note: "The reply streams to that user only and is saved to their own chat."
---

## The problem

The ERP already had an "Ask IT" assistant. Its "ask AI what to do" button on error dialogs was the most-used entry point. But it lived inside the main ERP app and had permission problems. The plan documented six of them. One example: its answer cache was keyed on the question and page, not the user, so one person's ERP-derived answer could be served to another.

## What I built

I moved the assistant into its own Frappe app, for both company sites, and built a ChatGPT-style workspace page plus a floating panel on every Desk page. The app reached 82 commits across September and October 2026.

- **Backend choice.** The first backend was a shared ChatGPT login driven through Playwright, because a real browser avoids the token and challenge problems of calling the service directly. Later commits added a Codex-based ERP mode and an OpenAI-compatible API for Chat, with a fallback to another provider when one fails silently.
- **Modes.** Chat is conversation only. Work may query ERP records, read-only and only when a question needs it.
- **Task notifications.** The same panel carries a task inbox, so users who cannot chat still see their assigned tasks.
- **Access by role.** Chat is limited to chosen roles; other desk users get the task list only.

## The hard part: isolation

The requirement was that users only see their own chats, and that the AI sees only what the user could see. The design runs every conversation as a Temporary Chat, so nothing lands in the shared account's sidebar. Ownership uses Frappe's own owner-only permission on both the chat and message records, and every endpoint re-checks the owner. The design also names a realtime trap: a progress call would have moved the stream to a room anyone could join, so it is banned on this path.

The plan states its limits too: a System Manager can still read the table, and a document-count call has no permission check.

## What this work demonstrates

- Reading a framework's permission and realtime code to find where a requirement could leak.
- Choosing an architecture, writing down its costs, and changing backend as needs changed.
- Putting slow AI calls on a background queue so web workers stay free.
- Treating model output as untrusted, including cleaning rendered markdown.

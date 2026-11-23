---
layout: ../../../layouts/ErpCase.astro
slug: deploy-bot
title: Deployment page and Telegram bot
group: AI and DevOps
deck: "One deployment page and a Telegram bot for six production servers."
problem: "Deploying meant logging into each production server by hand."
role: "I built a centralized deployment page and a Telegram bot that cover six production servers."
hard: "Making one-message deployment safe by limiting who can trigger it."
stack: "Telegram bot · Web deployment page"
notes:
  - "Telegram user ID allow-list"
  - "One page for all six servers"
---

## The problem

WinWin Food Industries runs six production servers. Deploying to them meant direct server access each time.

## What I built

I built a centralized deployment page and a Telegram bot. It reduces manual server access to roughly five actions in the page, or one authorized message to the bot.

## The hard part

Letting a chat message trigger a deployment is only acceptable if the sender is controlled. The bot restricts access by Telegram user ID, so only listed people can trigger it.

## What this work demonstrates

- Replacing repeated manual operations with a single entry point.
- Treating access control as part of the design for any tool that can change production.

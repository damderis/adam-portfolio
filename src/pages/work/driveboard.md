---
layout: ../../layouts/CaseStudy.astro
slug: driveboard
problem: "Exploring a car dashboard arranged around a daily routine of media, weather, prayer times and Quran content."
role: "A personal Android Auto app in Java with the Android car-app library, iterated in the Desktop Head Unit simulator."
hard: "Working within an automotive display, where layout, control size and the link between phone and head unit all shape the design."
notes:
  - "Arranged around a routine"
  - "Iterated in the head-unit simulator"
context: Personal Android Auto exploration
caption: "The board in the Desktop Head Unit simulator: clock, prayer times, now playing and weather."
detailCaption: Synchronised lyrics, opened from the now-playing card.
detailAlt: "DriveBoard lyrics view: album art, song title and the current line highlighted"
gallery:
  - "Al-Fātiḥah playing, with generated surah calligraphy as the cover art."
  - "The Quran surah list beside the prayer and clock widgets."
  - "Split layout: music on the left, prayer times, clock and weather on the right."
  - "The companion phone app: live board preview, prayer zone, background picture and colour source."
---

## An interface around a routine

DriveBoard is a personal Android Auto project exploring a dashboard shaped around media, weather, prayer times and Quran content. It combines configurable layouts with glass-style widgets over a wallpaper and a Material 3 Expressive visual direction.

Unlike a general web application, this project works within the constraints of an automotive interface. The arrangement of information, the size of controls and the relationship between the phone and the head unit all influence the design.

## The dashboard as a composition

The interface includes a now-playing view with album art and synchronised lyrics, media controls, weather and prayer times. A Quran view adds the current ayah and generated khat art. Split layouts and customisation let these elements be arranged around different preferences.

Scheduled Quran routines explore how the interface can follow a recurring daily pattern rather than requiring the same manual setup each time. The project also includes browser and video-panel experimentation within the personal prototype.

## A different implementation context

DriveBoard is built in Java with the Android car-app library and Gradle. Iteration used the Desktop Head Unit simulator, providing a way to inspect the car-facing interface independently of the phone screen.

The simulator provided a repeatable environment for exercising the interface and reviewing layout changes across the development iterations.

## What this work demonstrates

This project expands the work beyond browser interfaces into Android and a constrained display context. The common thread remains practical: arrange information around a routine, make the state understandable and iterate on the actual interface rather than an imagined mockup.

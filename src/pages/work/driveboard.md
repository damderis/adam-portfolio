---
layout: ../../layouts/CaseStudy.astro
slug: driveboard
problem: "Exploring a car dashboard arranged around a daily routine of media, weather, prayer times and Quran content."
role: "A personal Android Auto app in Java with the Android car-app library, iterated in the Desktop Head Unit simulator."
hard: "Android Auto picks an app's layout by its category, so getting a live map beside the board took a second car app built from the same code."
notes:
  - "Two car apps, one codebase"
  - "The map sits beside the board, not inside it"
  - "Tested in the head-unit simulator"
context: Personal Android Auto exploration
caption: "The board in the Desktop Head Unit simulator: clock, prayer times, now playing and weather."
detailCaption: Synchronised lyrics, opened from the now-playing card.
detailAlt: "DriveBoard lyrics view: album art, song title and the current line highlighted"
gallery:
  - "Al-Fātiḥah playing, with generated surah calligraphy as the cover art."
  - "The Quran surah list beside the prayer and clock widgets."
  - "Split layout: music on the left, prayer times, clock and weather on the right."
  - "Synced lyrics beside the music card. The current line is the bright one."
  - "Next to a music app on the same screen: glass cards over my own wallpaper."
  - "The board in Bahasa Melayu, saying the car isn't sharing its data."
  - "An earlier Material 3 pass, before the glass cards and wallpaper."
  - "Where it started: the first version, flat teal cards with nothing playing."
  - "The phone app now: a live preview of the car board, prayer zone, background picture and colour source."
  - "The first phone app: drag cards to move them, pull a corner to resize, pick a colour tone."
---

## A dashboard for my own drive

DriveBoard is an Android Auto screen I built for my own car. It shows music, weather, prayer times and Quran content in layouts I can rearrange, with glass-style widgets over a wallpaper and a Material 3 Expressive look.

A car screen is a different beast from a web app. Where things sit, how big the buttons are and how the phone talks to the head unit all decide what works while you drive.

## What's on the board

Music comes from whatever app is playing on the phone, with album art, controls and synced lyrics you open with a tap. Prayer times follow the JAKIM zone, picked from the phone's location, and a prayer alert can pop up over any car app. Weather comes from Open-Meteo.

When the Quran app is playing, the board shows the current ayah and generated khat art for the surah, and Quran playback picks up again when the car connects. A browser and YouTube work too, but only while the car is parked. Above 8 km/h, by the phone's GPS, they lock.

## Split screen with the map

This was the part I had to figure out. Android Auto decides how much of the screen an app gets from its category. A navigation app owns the full screen. Every other kind of app can get the navigation app's live map in a panel beside it.

So DriveBoard Peta ("peta" is Malay for map) declares itself a weather app. Android Auto then puts Google Maps or Waze in its side panel and lets DriveBoard draw in the space next to it. DriveBoard doesn't draw the map or touch the route. It only arranges its own cards around a panel it doesn't control. On Android Auto's car API 7 and newer, the board sits beside a grid of shortcuts: Home, Charging, nearest mosque, petrol, food, R&R stops. Home, Charging and the mosque open whichever navigation app I pick. Older head units get the shortcut grid on its own.

The catch is that the panel isn't the same size everywhere. The e.MAS 5's head unit draws a wider, taller panel, so the board estimates the panel's height from its width and lines its rows up with it. The directions banner also stays hidden in this mode, since the map beside it already shows the next turn.

## Why there are two DriveBoard apps

One install registers two car apps that share the same board code:

- **DriveBoard** is the navigation app. It gets the whole screen, can sit in the side slot next to any other app, and shows a directions banner read from Google Maps or Waze.
- **DriveBoard Peta** is the weather app, which is the only way to get the live map beside the board.

Each category comes with its own layout, so instead of choosing, I kept both. Peta borrows its card options and colours from DriveBoard's split layout, so the two look like the same product.

## Getting it into the real car

Everything ran fine in the simulator, but the car refused it. Android Auto on a real head unit doesn't list car apps installed from outside the Play Store. So DriveBoard is now packaged for Google Play, to install through Play's internal app sharing.

## Built and tested in the simulator

DriveBoard is Java on the Android car-app library, built with Gradle. Most of the work happened in Google's Desktop Head Unit simulator, and it caught real problems. The hardware renderer crashed when the car swapped drawing surfaces, so the board draws with the software canvas and never releases surfaces Android Auto owns. The static part of the board was being redrawn every second, so now it only rebuilds when its content changes.

## What this work demonstrates

This took me outside the browser, into Android and a screen with strict rules about who controls what. The lesson I keep coming back to: read how the platform actually lays things out, then design inside those rules instead of fighting them.

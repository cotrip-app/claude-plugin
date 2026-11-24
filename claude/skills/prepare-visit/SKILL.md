---
name: prepare-visit
description: Prepares the visit to one or more places of a CoTrip trip (best time, suggested duration, highlights, cautions, how to get there) by searching the web and saving it with prepare_visit, in the standard format or the one the person asks for. Use when the person says "prepare the visit", "research this place", "what to see at museum X", "prepare the places of the day" or asks for tips about a place that's already in CoTrip.
argument-hint: "[trip] [place, day or 'all not prepared']"
---

# Prepare a visit

Follow the `cotrip` skill rules. Here you do what the app's **Prepare visit** button does, with your own research, and save the result on the place. Write it in the person's language.

## 1. Pick the places

`get_trip` and find the requested places. Places with `briefing: null` haven't been prepared yet. For "the whole day", take the day's places that aren't visited. If there are many (more than 5), say how many and confirm first, because each save counts as one edit in the free plan's weekly limit.

## 2. Read the context of each place

`get_visit` returns the place, the **day** (date and city) and the visit in use, if any. The date matters: check the weekday, holidays and the season. If there's already a visit, read it first and improve it instead of repeating it.

## 3. Research

Search the web: opening hours on the day of the visit, tickets and booking (how far ahead, price), schedule or events on the date, what not to miss, queues and best time, how to get there, cautions (clothing, cash, closures, scams). Separate confirmed facts from recommendations, and don't make up hours, prices or events; what you couldn't confirm stays as "to be confirmed".

## 4. Save with `prepare_visit`

Standard format, which the app shows in blocks:

- `summary`: 2 to 4 sentences about what it is and why it's worth it.
- `bestTime` (short: "Early morning, before 10am") and `reasoning` (why).
- `recommendedDurationMinutes`: also becomes the place's duration in the itinerary.
- `highlights`: "Don't miss", one item per line.
- `warnings`: "Heads up", what causes trouble if ignored.
- `sources`: the pages you used.

If the person asks for another format (a route inside the museum, photo tips, what to order at the restaurant, step-by-step directions), put it in `details`, in simple Markdown: paragraphs, `## headings`, lists with `-`, `**bold**` and links. Only `summary` is required; the rest can be left out if it doesn't make sense.

Each call creates a new version in the place's history and becomes the version in use; the person can go back to an earlier one in the app.

## 5. Let them know

Summarize the essentials per place (best time and the main caution) and say the full visit is on the place screen in CoTrip. If something needs action (book, buy a ticket), suggest creating an alert on the day with `add_note`. End with the trip link in CoTrip (the `url` field that comes in `get_trip`, `list_trips`, `create_trip` and `update_trip`; the day's, when only one day changed), so the person can open it directly in the app.

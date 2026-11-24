---
name: review-day
description: Reviews one or more days of a CoTrip trip and points out problems (packed day, opening hours, back and forth on the map, missing transport, item with the wrong type, booking without an alert) with fixes ready to apply. Use when the person asks "review my day", "is this day good?", "check the itinerary", "is it too packed?" or before closing an itinerary.
argument-hint: "[trip] [day or 'all']"
---

# Review a day

Follow the `cotrip` skill rules. Reviewing doesn't edit anything until the person approves.

## 1. Read

`get_trip` and take the requested days (all of them, if the person said "the itinerary"). For each day, note the date and the **weekday**, the city, and the sequence of items.

## 2. Check

For each day, look for:

1. **Load**: sum of `durationMinutes` (90 min when missing) + travel. More than ~9h, or more than ~5h on an arrival/departure day = packed.
2. **Times**: `timeSlot` outside `openingHours`; a place that's closed on that weekday; a sunset activity in the morning; two items at the same time; times out of order.
3. **Geography**: areas (`area`) that go back and forth (A → B → A); a place from another city on the day; a long leg late at night.
4. **Transport**: consecutive places with no transport between them when the distance calls for it; a transport whose `from`/`to` doesn't match the neighboring places; a transport without `mode`.
5. **Types**: a note that's a leg of travel (should be `transport`), a video link saved as a note (should be `link`), a warning with a consequence saved as a note (should be `alert`), a hotel saved as a place or note (should be lodging, `lodging`, with the departure day), a flight or train with airline, seat or gate written in the text (they go in the transport's `carrier`, `number`, `seat` and `gate` fields), a photo tip saved as a note (should be a photo spot, `photo`).
6. **Missing alerts**: required booking, timed ticket, early closing, cash only, dress code (temples, churches).
7. **Basics**: a meal in the day; a day with no title or the wrong city; a place repeated on two days; `visited`/`missed` status on a future day.

Only point out what can be verified from the data or from a source you checked. If you suspect something but can't confirm it, say "worth checking".

## 3. Report

Per day, at most 5 points, from most to least serious, each with the proposed fix. In the person's language, for example:

> **Fri 03/14 · Asakusa and Ueno** — packed (≈10h)
> 1. The National Museum closes at 5pm and is set for 5:30pm → swap with Senso-ji (becomes 09:00 / 15:00).
> 2. Missing transport Ueno → Akihabara → Ginza Line metro, ~10 min.
> 3. "Take the train to Nikko" is a note → turn it into a transport.

Also say what's good, in one line, when the day is well rounded.

## 4. Apply what the person approves

Use `update_place`, `move_places`, `add_note`/`update_note` and, last, `get_trip` + `reorder_day`. Removals (`delete_place`, `delete_note`) only with explicit confirmation; prefer sending places to Unplanned. End with a summary of what changed and the trip link (or the day's) from the `url` in `get_trip`.

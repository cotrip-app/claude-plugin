---
name: distribute-places
description: Spreads the places of a CoTrip trip across the days, grouping by area, respecting opening hours, priorities and the person's pace, and leaves each day in the right order. Use when the person asks to "organize the days", "spread the places", "plan the Unplanned", "rebalance the itinerary" or "fit these places in".
argument-hint: "[trip] [specific days or places]"
---

# Distribute places across days

Follow the `cotrip` skill rules.

## 1. Read the current state

`get_trip`. Separate:
- **Fixed**: places already on days with a `timeSlot`, bookings, or that the person said not to touch. Don't move them without asking.
- **To distribute**: `unplanned` + the ones the person asked to reorganize.
- **Capacity of each day**: the day's city, arrival/departure (transport already added), weekdays. First and last days count as half or less.

If places to distribute are missing `area`, infer it from the name/link or ask; without an area you can't group them.

## 2. Plan (no edits yet)

Rules, in this order of priority:

1. **City**: only put a place on a day in that city.
2. **Date and time constraints**: closing days (`openingHours`), dated events, bookings. Museums often close on Mondays; check what's on the place.
3. **Area**: one day = one or two neighboring areas. Avoid crossing the city and coming back.
4. **Load**: add up `durationMinutes` (use 90 min if missing) + ~30 min per leg of travel. Aim for up to ~8h on a balanced day, ~6h on a relaxed one, ~10h on an intense one. Include meals.
5. **Priority**: `high` first. If it doesn't fit, `optional` goes back to Unplanned (don't delete).
6. **Order within the day**: what opens early or gets crowded (viewpoints, famous sights) in the morning; museums midday; viewpoints and night neighborhoods at the end; finish near the lodging or dinner.
7. **Variety**: alternate types (not three museums in a row) when possible.

Set an approximate `timeSlot` for each place ("09:00", "Lunch", "Late afternoon").

Show the plan to the person as a list per day (place — area — time) and what was left over. Ask for an ok. If they already asked to apply it directly, apply it.

## 3. Apply

1. `move_places` per day, with the `placeIds` **already in the planned order** (they go to the end of the day in that order).
2. `update_place` only where `timeSlot`, `priority` or `status` need to change.
3. If the day already had items (notes, transport, fixed places), `get_trip` and then `reorder_day` with the full list in the final order, fitting each transport between the places it connects.
4. Places that didn't fit: `move_places` with `dayId: null`.

## 4. Wrap up

Summarize what went to each day and what was left out. Suggest running `add-transport` if the legs aren't added yet. End with the trip link in CoTrip (the `url` field that comes in `get_trip`, `list_trips`, `create_trip` and `update_trip`; the day's, when only one day changed), so the person can open it directly in the app.

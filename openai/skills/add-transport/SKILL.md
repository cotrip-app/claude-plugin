---
name: add-transport
description: Adds transport in CoTrip, one per leg, between the places of a day, on the arrival and departure of the trip, and for flights, trains and transfers the person gives. Use when the person says "how do I get from one place to the other", "add the legs", "add the flight", "connect the places of the day" or pastes a transport booking.
argument-hint: "[trip] [day] or booking details"
---

# Add transport

Follow the `cotrip` skill rules. A transport is always **one leg**: `from` → `to`. A route with stops becomes several transports, in order.

## 1. Find the legs

`get_trip` and, for each requested day, walk through the sequence of items:

- Two consecutive places with no transport between them = one leg.
- First place of the day: a leg from the lodging, if the person said where it is.
- Last place: back to the lodging, when it makes sense (far-off day, night).
- Arrival/departure day: airport/station ↔ lodging.
- Bookings the person pasted (flight, train, transfer): use the exact details.

Skip legs that already have a transport. Don't create legs between obviously adjacent places if the person asked only for the main ones.

## 2. Pick the mode

- Infer it when it's clear: a flight between distant cities (`plane`); a short leg in the same neighborhood, up to ~15 min on foot (`walk`); metro/train/bus mentioned by the person or obvious in the city (`metro`, `train`, `bus`).
- When you can't tell (rental car or public transport? taxi or metro?), **ask once for the whole day** before creating, offering the most common option in the city.
- In `details`, write how to get there in practical terms: line and direction, boarding and exit station, approximate time, where to buy the ticket. If you're not sure about the line, say "check on Maps" instead of making it up.
- `departAt` and `arriveAt` only with real times (booking or the places' `timeSlot`). `code` for the booking or confirmation code. For a flight, train, bus or boat with a ticket, fill in `carrier`, `number`, `seat` and `gate` with the booking details: the app shows the leg as a ticket. Don't make up a seat, gate or platform; leave it empty when the booking doesn't say.
- `text` is for a short remark ("Bring passport", "Buy a Suica at the airport").

## 3. Create and fit in

1. `add_note` with `type: "transport"` and the `transport` object for each leg (they go to the end of the day).
2. `get_trip` again.
3. `reorder_day` with the full list of the day, putting each transport **between the two places it connects** (or at the start/end for lodging and airport).
4. If you find a note that is actually a leg of travel ("take the metro to Shibuya"), convert it with `update_note` to `transport` instead of creating another one.

## 4. Wrap up

Say how many legs were created per day and which need confirmation (mode, time or line). End with the trip link in CoTrip (the `url` field that comes in `get_trip`, `list_trips`, `create_trip` and `update_trip`; the day's, when only one day changed), so the person can open it directly in the app.

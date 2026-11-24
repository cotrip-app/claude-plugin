---
name: build-itinerary
description: Builds a trip in CoTrip from scratch, from a conversation, a list of places or a pasted itinerary (blog, PDF, message). Use when the person says "build my itinerary", "create the trip in CoTrip", "plan X days in Y", "put these places in CoTrip" or pastes a list of places.
argument-hint: "[destination and dates, or list of places]"
---

# Build an itinerary from scratch

Follow the `cotrip` skill rules. The goal is a trip in CoTrip where every day makes sense on the map and on the clock, and the person only needs to adjust details.

## 1. Understand the trip (one round of questions, at most)

Take what the person already said and ask only what's missing, all at once:

- Destination(s) and departure and return dates. If several cities, how many nights in each.
- Lodging (neighborhood or address) in each city: it's the start and end point of each day.
- Arrival and departure times (flights, trains), if they exist already.
- Pace: relaxed (2–3 activities a day), balanced (3–4) or intense (5+).
- Interests and constraints: food, museums, nature, shopping, nightlife, kids, mobility, budget.
- What's a must-see and what's already booked (with day and time).

If the person pasted a list or an itinerary, extract the places and confirm only what's ambiguous (e.g. two "Tower"s in the same city).

## 2. Trip and days

1. `list_trips`: if there's already a trip with the same destination and dates, ask whether to use it instead of creating another.
2. `create_trip` with a short name ("Japan 2027"), destination and dates.
3. `get_trip` to get the day IDs.
4. `update_day` on each day with the right city (when there's more than one) and a title that says the theme of the day ("Arrival", "Asakusa and Ueno", "Day trip to Nikko", "Return").

## 3. Places

1. Build the candidate list: the person's requests + your suggestions that match their interests. Keep the suggestions to the size of the chosen pace; better to fall short than to overload.
2. Show the list in blocks by area and mark what's your suggestion. Ask for an ok before creating.
3. Create them with `add_place` **without dayId** (they go to Unplanned), filling in `area`, `category`, `durationMinutes`, `priority` and, when you know from a reliable source, `openingHours` and `mapsUrl`. The person's must-sees = `high`; your suggestions = `medium` or `optional`.

## 4. Distribute and connect

1. Use the `distribute-places` skill to take the places to the days.
2. Use the `add-transport` skill for the legs between places, the arrival and the return.
3. If the person said where they're staying, create the lodging (`add_note` with `type` = `lodging`) on the check-in day, with the departure day in `checkOutDayId`. One per stay.
4. Add alerts (`alert`) for required bookings, closing days and cut-off times.
   If the person likes photography or asked for photo tips, create photo spots (`photo`) next to the most photogenic places, with the best time and the framing tip.
5. Run the `review-day` skill on each day and fix what it points out.

## 5. Deliver

Reply with a summary per day (title + 1 line with the main places), what stayed in Unplanned and why, and what still needs a decision from the person (bookings, times to confirm). Close with the trip link (the `url` that `create_trip` returns), so they can open it in CoTrip and drag items to adjust.

---
name: cotrip
description: Rules for reading and editing trips in CoTrip through the connector tools (list_trips, get_trip, add_place, move_places, reorder_day, add_note, prepare_visit...). Use whenever the person talks about a CoTrip trip, itinerary, day or place, asks to "put it in CoTrip", or when another CoTrip skill is used.
---

# How to work with CoTrip

CoTrip organizes a trip into **days** (one per date, each with a city and a title) and an **Unplanned** list (places with no day yet; the app may show it as "Não planejados"). Each day has a single sequence of items mixing **places** and **day items** (note, alert, checklist, transport or ticket, lodging, photo spot, link and file). The order of that sequence is the itinerary the person sees on their phone.

## Before changing anything

1. If the CoTrip tools are not available, ask the person to turn on the CoTrip plugin (in ChatGPT or Codex). They sign in with their CoTrip account and approve access once.
2. Start with `list_trips`. If more than one trip could match, ask which one. For a new trip, use `create_trip` (it creates one day per date, up to 90).
3. Call `get_trip` and only use IDs that came from it. Never make up IDs. Call `get_trip` again after a series of changes, before reordering or reviewing.

## Tools and gotchas

| Tool | Use | Watch out |
|---|---|---|
| `list_trips`, `get_trip` | Read | Reading is always allowed. Trips and days include `url`, their address in the app |
| `create_trip`, `update_trip` | Trip | Return the trip `url`. Send `startDate` and `endDate` together. The trip keeps one day per date; empty days outside the range are removed, and days with items come back in `keptOutside` (move the items and call again) |
| `update_day` | Day title and city | Short titles: "Arrival", "Day trip to Nikko" |
| `add_place` | New place | With `dayId` it goes to the **end** of the day; without `dayId` it goes to Unplanned. Send `mapsUrl` when you have it. If it already exists you get `added=false` (don't duplicate) |
| `update_place` | Place fields | Doesn't change the day; use `move_places` for that |
| `get_visit`, `prepare_visit` | Prepare the visit to a place | See the `prepare-visit` skill |
| `move_places` | Move places to a day | They go to the **end** of the day, in the order sent. `dayId: null` sends them back to Unplanned |
| `reorder_day` | Final order of the day | Send **every** item of the day (places and notes), each as `{kind, id}`, none missing or repeated |
| `add_note` | Day item | Goes to the end of the day, or next to another item with `beforeId`/`afterId` |
| `add_reminder`, `update_checklist` | Reminders and tasks | See the `reminders` skill. Reuse the checklist that already exists for the same moment |
| `update_note` | Edit an item | Change the type instead of deleting and recreating, to keep the position |
| `delete_place`, `delete_note` | Remove | Can't be undone: confirm with the person first |

Flow to build a day: `move_places` (or `add_place` with `dayId`) → `add_note` for transport and alerts → `get_trip` → `reorder_day` with the final order.

## Place fields

- `status`: `wishlist` (want to go), `planned`, `visited`, `missed`. Places moved to a day become planned.
- `priority`: `high`, `medium`, `optional`. Use `optional` for what can be dropped if the day gets tight.
- `durationMinutes`: expected time at the place (5 to 1440).
- `timeSlot`: planned time as short text ("09:30", "Morning", "Sunset").
- `openingHours`: opening hours as text ("Tue–Sun 9am–5pm, closed Mon").
- `area`: neighborhood or region. It's the field that groups nearby places, so always fill it in.
- `category`: "Museum", "Restaurant", "Park", "Viewpoint", "Temple"...
- `note`: a note about the place, shown on the place screen in the app ("Book the mini-trekking", "Order the lamb"). Research about the place goes in `prepare_visit`, not here.

## Day item types

Pick by what the item is; don't create everything as a note.

- **transport**: any leg of travel. A route with stops becomes one transport per leg, in order. Fill in `mode` (`plane`, `train`, `metro`, `bus`, `car`, `walk`, `boat`, `other`), `from`, `to`, and when known `departAt`/`arriveAt` (HH:MM), `details` (line, platform, where to buy the ticket) and `code` (booking, confirmation code). For a flight, train, bus or boat with a ticket, also fill in `carrier` (airline or operator), `number` (flight, train or line), `seat` and `gate` (terminal and gate, platform or pier) when the person gives them: the app shows the item as a ticket, with the booking code to copy. An arrival after midnight goes with the time only (the app shows +1). If the mode can't be inferred, ask before creating it.
- **link**: videos (YouTube, TikTok, Instagram) and useful pages, with a `title` that says what it is. YouTube shows up as a video in the itinerary.
- **alert**: a warning with a consequence if ignored ("Closes at 5pm", "Needs a reservation", "Cash only").
- **checklist**: tasks the person needs to do (buy, book, bring, confirm). `text` is the title; the tasks go in `checklist.items`. "Remind me to…" requests use `add_reminder` (`reminders` skill).
- **lodging**: where they stay (hotel, Airbnb, a friend's place). One item per stay, on the check-in day, with `lodging.checkOutDayId` = the day they leave. Fill in `name` and, when known, `address`, `checkInAt`/`checkOutAt` (HH:MM), `code` (booking, confirmation code), `details` (room, breakfast included) and `info` (Wi-Fi, phone, how to get the key). The app shows "Leaving from" and "Sleeping at" on each day by itself; if the person changes hotels, create another lodging on the day of the change.
- **photo**: photo spot, a good place to take pictures. `photo.title` says what to shoot; `where`, from where; `bestTime`, the best light or hour; `text`, the framing tip. Create it next to the place it refers to (`beforeId`/`afterId`).
- **note**: everything else (ideas, remarks).
- Files (photos, PDFs, tickets) can only be added in the app; say so if the person asks.

## Limits

- Agent **edits** may have a weekly limit on the account (reading doesn't count). If the limit message shows up, stop, repeat the message as it came and say what was left undone. Don't keep retrying and don't suggest purchases or plans.
- So plan before editing: build the proposal, show it to the person, and only then apply it in one go, with no test calls or back and forth.

## How to talk

- Always reply in the person's language, and write what you save in CoTrip (titles, notes, tasks) in that language too. Dates in their format (e.g. "Fri, 03/14" or "sex, 14/03").
- Before a big change (more than one day, removals, date changes), show the plan in a short text and ask for an ok.
- After applying, summarize what changed per day and remind them they can adjust by dragging in the app.
- Whenever you create or change something, end the reply with the trip link (`url`) as a clickable link: "[Open in CoTrip](url)". If only one day changed, use the day's `url`. Only use links that came from the tools; don't build the address by hand.
- Don't make up opening hours, prices or rules. If you searched the web, say you checked and when; if you couldn't check, mark it as "to be confirmed".

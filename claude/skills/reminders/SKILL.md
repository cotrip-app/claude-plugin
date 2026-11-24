---
name: reminders
description: Saves trip reminders and to-dos as tasks in CoTrip checklists, in the right checklist and at the right point of the itinerary, and checks off what's done. Use when the person says "remind me to…", "I can't forget to…", "I need to sort out/buy/book…", "note down for me to…", "I already did X" or asks "what's left to do?".
---

# Reminders and to-dos in CoTrip

Reminders become **tasks** inside a **checklist** in the itinerary (a day item with `type = checklist`). The checklist has a title that says the moment (e.g. "Before the trip", "Before the Louvre", "Check-out") and sits on the day and at the position where the person will need it. In the app, the person checks off tasks and sees how many to-dos each day has.

Also follow the `cotrip` skill rules. Write checklist titles and tasks in the person's language.

## Save a reminder

1. Find the trip (`list_trips`; if more than one could match and the context doesn't say, ask) and read it with `get_trip`. Note the checklists that already exist: day, title and tasks.
2. Decide **when** the task needs to be done:
   - **Before the trip** (buy a SIM, insurance, exchange money, book ahead, get a visa): a "Before the trip" checklist at the **start of the first day** (`beforeId` = first item of the day).
   - **On a day, place or leg** (bring the passport on the tour, pick up the audio guide, print the train ticket): that day's checklist, **right before** the place or transport it refers to (`beforeId`). If it applies to the whole day, at the start of the day.
   - **On the way back** (check-out, return the car, claim tax free): on the last day, before the return transport.
   - If you can't tell the moment, use "Before the trip" and tell the person.
3. **Reuse**: if there's already a checklist for that moment (same day and same subject), use `add_reminder` with `checklistId`. Don't create one checklist per task.
4. If there isn't one, use `add_reminder` with `newChecklist` (`dayId`, short `title`, `beforeId` or `afterId`).
5. Write each task as a short action starting with a verb ("Buy a SIM card", "Book a table at Dishoom"). Several requests in the same sentence become several tasks in the same call.
6. Reply saying where it went ("I put it in **Before the Louvre**, on day 2, right before the museum") and end with the day link (the `url` in the response).

Examples:

| The person says | Goes to |
|---|---|
| "Remind me to buy a plug adapter" | "Before the trip", start of day 1 |
| "I can't forget to bring the printed ticket to the Louvre" | "Before the Louvre", right before the Louvre |
| "I need to check out by 11am on the day we go to London" | "Check-out", start of that day, before the train |
| "Note: book dinner and buy the musical tickets in London" | Two tasks in a checklist on the London day |

If the reminder has a **consequence** if ignored and isn't something the person has to do ("the museum closes at 5pm"), it's an `alert`, not a task.

## Check off, edit and look up

- "I already bought the SIM": find the task in `get_trip` and use `update_checklist` with `check` (task ids). `uncheck` unchecks, `edit` changes the text, `remove` removes, `add` adds, `title` renames.
- "What's left to do?": list the tasks with `done = false` from all the trip's checklists, grouped by day and checklist. Reading doesn't use edits.
- To move the whole checklist, use `update_note` (`dayId`) or `reorder_day`.
- Delete the checklist (`delete_note`) only with confirmation.

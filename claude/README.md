# CoTrip plugin for Claude

Connects Claude to [CoTrip](https://cotrip.wlln.dev) and teaches it to build itineraries the way the app works.

## What's included

- **CoTrip connector**: the MCP server `https://cotrip.wlln.dev/api/mcp`. The first time, Claude opens CoTrip so you can sign in with your email and approve access. No keys or setup.
- **`trip-planner` agent**: builds or reorganizes the whole trip, going through the skills below.
- **Skills**:
  - `cotrip`: rules for reading and editing trips (IDs, day order, item types, limits).
  - `build-itinerary`: creates the trip from scratch from a conversation, a list of places or a pasted itinerary.
  - `distribute-places`: takes the places to the days by area, opening hours, priority and pace.
  - `add-transport`: adds one transport per leg and fits it between the places.
  - `review-day`: points out packed days, wrong hours, back and forth on the map, missing alerts.
  - `reminders`: "remind me to…" becomes a task in a checklist in the itinerary, on the right day and at the right point; checks off what's done and lists what's left.
  - `prepare-visit`: researches each place (best time, highlights, cautions) and saves the visit in CoTrip, in the standard format or the one you ask for.

Claude always answers in your language, and what it saves in CoTrip follows that language too.

## Install

**Claude Code**

```
/plugin marketplace add cotrip-app/claude-plugin
/plugin install cotrip@cotrip
```

Then run `/mcp`, pick `cotrip` and authenticate.

**Claude (app and claude.ai)**

Add the `cotrip-app/claude-plugin` marketplace in the plugins area, or download `cotrip.plugin` from the [latest release](https://github.com/cotrip-app/claude-plugin/releases/latest/download/cotrip.plugin). If you only want the connector, open [CoTrip in the Claude directory](https://claude.ai/directory/cotrip) and tap Connect.

## Examples

- "I'm going to Lisbon from May 10 to 16, build the itinerary in CoTrip."
- "Spread the Unplanned places of my Tokyo trip across the days."
- "Add the transport for day 3."
- "Review my Rome itinerary, is it too packed?"

Authorized agents show up at https://cotrip.wlln.dev/agentes, where you can disconnect them.

MIT license. Support: https://github.com/cotrip-app/claude-plugin/issues

[Privacy policy](https://cotrip.wlln.dev/privacidade) · [Terms of service](https://cotrip.wlln.dev/termos)

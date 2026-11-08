Design a mobile boarding pass screen for a fictional airline called Northline.

Flight data to show:
- Passenger: QUINT / MARA MS
- Flight NL 482, Lisbon (LIS) → Reykjavík (KEF)
- Date 14 Mar, departs 06:40, arrives 09:55 (local times), 4h 15m
- Gate B17, boarding 06:05, group 3, seat 23A (window), cabin Economy
- Booking ref K7Q2ZP, ticket 157 2214 889 301
- Status: On time

Must have
- The information a traveler needs at the gate (gate, boarding time, seat,
  group) can be read in under two seconds. Everything else is still there but
  ranked below it.
- A scannable code area (a convincing drawn barcode or QR-style pattern is
  fine; it does not need to decode).
- A tap on the status toggles a "Delayed — new boarding 06:50" state, and the
  screen updates every place that depends on it.
- An "add to wallet" button with a pressed state and a confirmation.

Rules
- Designed for a 390 px phone first; at 768 and 1440 px show it as a
  centered pass, not a stretched one.
- Light and dark schemes via `prefers-color-scheme`.

Visual style, illustration, brand and motion are up to you.

Use the github.com/sorrycc/frontend-rails skill for this.

Write the result to `index.html` in the current working directory: a single
self-contained HTML file with inline CSS and JS, no external resources.

Build the file incrementally: create the HTML skeleton and styles first, then
append sections, content and JavaScript in several separate tool calls. Never
try to emit the entire file in a single tool call.
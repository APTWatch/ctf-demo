# You Are What Your Cookie Says (Part 2 of 4: Web / Cookie Editing)

**Category:** Web
**Difficulty:** Beginner (High School)
**Tool:** Just a browser (DevTools)

## Description

The admin note you found in Part 1 (decode it with your browser's console: `atob("...")`, or any online Base64 decoder) hints that the portal "remembers" something about you between visits, beyond just your login.

It does: a `role` cookie. Right now yours says `role=guest`. The dashboard only shows its "Admin Tools" panel to visitors whose cookie says `role=admin`, and nothing on the server stops you from just changing that.

## Steps (for the walkthrough)

1. Decode the Part 1 note (Base64) to learn you should be looking at what the site remembers about you.
2. Open DevTools, then **Application** (Chrome/Edge) or **Storage** (Firefox), then **Cookies**. Find `role`, currently set to `guest`.
3. Edit the value to `admin` (or run `document.cookie = "role=admin; path=/"` in the DevTools **Console**).
4. Wait a moment, or reload `dashboard.html`. The "Admin Tools" panel appears with the next encoded note.

## Hint

The server does check the `role` cookie before showing the admin note, it just trusts whatever value you send it, instead of verifying it against your actual login session. A cookie the client can freely edit can't be trusted to prove who you are. That's the whole lesson here.

## Notes

No flag is checked on this page. This stage unlocks the note that leads to Part 3 (OSINT/Recon).

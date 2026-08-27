# The Student Portal (Part 1 of 4: Web)

**Category:** Web
**Difficulty:** Beginner (High School)
**Tool:** Just a browser (View Source / DevTools)

## Description

Welcome to the GreenValley High "Student Portal." There's a login page, but no account was given to you yet. Whoever built this site left something behind that they shouldn't have.

Once you're in, you'll land on your own (pretty boring) profile page. But notice how your profile is loaded, because the page might be trusting something it shouldn't.

## Steps (for the walkthrough)

1. Open the login page and view the page source. A leftover developer comment reveals a test account's username and password.
2. Log in with those creds and land on your own dashboard/profile page, loaded via something like `dashboard.html?id=4471`.
3. Try changing the `id` in the URL. The page doesn't check whether that profile belongs to you: this is an IDOR (Insecure Direct Object Reference).
4. Find the admin/staff profile this way. It contains a note that isn't in plain English (leads into Part 2).

## Hint

"View Source" and "the URL bar" are your only tools here.

## Notes

No flag is checked on this page. This stage just gets you the encoded note that leads to Part 2 (Cookie Editing). Flags for the overall challenge are graded in CTFd, not on the site itself.

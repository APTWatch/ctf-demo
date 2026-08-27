# What the Robots Don't See (Part 3 of 4: OSINT / Recon)

**Category:** OSINT
**Difficulty:** Beginner (High School)
**Tool:** Just a browser

## Description

The decoded note (Part 2) mentioned "search engines" and what they're told not to crawl. Every well-behaved website has a file that lists exactly that, and it's always in the same, predictable place.

This is real open-source recon: a page nobody linked to, but the site itself tells you it exists (and asks you politely not to look).

## Steps (for the walkthrough)

1. Visit the site's `robots.txt` (for example `yoursite.com/robots.txt`).
2. Find the `Disallow:` entry. That's a page path the owner didn't want indexed by Google, but never actually protected.
3. Visit that path directly. It's an "unlisted" staff archive page with a file to look at next (Part 4).

## Hint

`robots.txt` is a plain text file, always at the root of the site, no login required.

## Notes

No flag here either. This step just points you to the file you need for Part 4 (Forensics).

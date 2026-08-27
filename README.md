# Web Demo: Organizer Notes (not for students)

A single chained challenge (Web, Cookie Editing, OSINT/Recon, Forensics/Steganography). Everything through Part 3 needs only a browser; the final step needs StegOnline (a free browser-based tool, no install) and any QR scanner. Has a real Node.js backend, no npm dependencies to install. No flag is checked anywhere in this site; grade the final flag in CTFd.

## Hosting

Requires Node.js (any recent version). From this folder:

```bash
node server.js
```

Then open `http://localhost:8000/` (set `PORT=xxxx` to use a different port). No npm install needed, the server only uses Node's built-in modules.

This is a real backend now, so it needs an actual host that can run a Node process (a VM, Render/Railway/Fly.io free tier, etc). It will **not** work on a static host like GitHub Pages or Netlify anymore.

## Solve path / answer key

1. **Web** - View source on `index.html`, find the HTML comment with creds: `ghost_admin` / `Fall2024!`. Logging in POSTs to `/api/login`, which checks them server-side and sets a `session` cookie (HttpOnly) plus a `role=guest` cookie (not HttpOnly, editable on purpose), then redirects to `dashboard.html?id=4471`.
2. **Web (IDOR)** - Change the URL to `dashboard.html?id=1001` to view the Principal's profile. `GET /api/profile?id=` only checks that you're logged in (valid `session` cookie); it never checks that the `id` belongs to you. That's the IDOR. (`id=4472` is just a decoy student, no lead.) The note is Base64, decode it with `atob("...")` in the browser console to get a hint to check what the site remembers about you.
3. **Cookie editing** - DevTools > Application/Storage > Cookies, `role` is `guest`. Edit it to `admin` (or `document.cookie = "role=admin; path=/"` in the console). `GET /api/admin-note` is gated purely on that cookie value, never checked against the server-side session. The "Admin Tools" panel appears live (the page polls every 800ms, no reload needed) with another Base64 note, decoding to a tip about `robots.txt`.
4. **OSINT/Recon** - Visit `/robots.txt`, see `Disallow: /staff-archive.html`, visit that page directly (served as a plain static file, not linked from nav).
5. **Forensics / Steganography** - `staff-archive.html` has `hidden-qr.png`. The flag is hidden via LSB steganography: the least-significant bit of R, G, and B is the same at every pixel, encoding a QR code. Open the image in [StegOnline](https://georgeom.net/StegOnline/), extract the bit-0 plane of any color channel, and a scannable QR code appears. Scanning it gives the flag directly.

**Final flag:** `CZCTF{st3g0_pix3ls_reveal_qr}`

`hidden-qr.png` was generated with the `qrcode` and `pngjs` npm packages: render the flag as a QR PNG, then for every pixel set bit 0 of R, G, and B on a plain gradient cover image to 1 if the corresponding QR pixel is light, or 0 if dark. Verified by round-tripping the extraction with `jsqr` before shipping.

## Files

- `server.js`: the backend. In-memory user/profile/session "databases", no persistence, resets on restart. Serves the static files below plus three API routes:
  - `POST /api/login`: real credential check, issues the `session` + `role` cookies
  - `GET /api/profile?id=`: requires login, not ownership (the IDOR)
  - `GET /api/admin-note`: requires login and trusts the client-editable `role` cookie (the broken access control)
- `index.html`: login page, posts to `/api/login`
- `dashboard.html` / `dashboard.js`: profile/IDOR page plus cookie-gated "Admin Tools" panel; no secrets in the page source, everything comes from the API at runtime
- `robots.txt`: points to the unlisted page
- `staff-archive.html`: unlisted static page, not linked from nav
- `hidden-qr.png`: cover image with a QR code hidden in the LSBs of R, G, and B; extract in StegOnline to reveal and scan it for the flag
- `style.css`: shared styling

## Resetting between demo runs

Sessions and the `role` cookie are just server memory and browser cookies. Restart `node server.js` and clear cookies for the site (or use a private/incognito window) to get a clean run.

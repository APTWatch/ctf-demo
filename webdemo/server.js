// GreenValley High "Student Portal" -- intentionally vulnerable demo backend.
// No dependencies: just Node's built-in http/fs. Run with: node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 8000;
const ROOT = __dirname;

// --- "databases" (in-memory, reset on restart) ---------------------------

const users = {
  ghost_admin: { password: 'Fall2024!', id: '4471' }
};

const profiles = {
  '4471': {
    name: 'Ghost Test Account',
    role: 'QA / Test Account',
    note: 'This is just a placeholder account used for testing. Nothing to see here.'
  },
  '4472': {
    name: 'Jamie Rivera',
    role: 'Student',
    note: "Can't wait for the CTF club meeting on Friday!"
  },
  '1001': {
    name: 'Principal Turing',
    role: 'Administrator',
    // Base64 -- decode with atob() in the browser console.
    note: 'TmljZSB3b3JrLCB5b3UgZm91bmQgdGhlIGFkbWluIGFjY291bnQuIEJ1dCB0aGlzIHBvcnRhbCBkb2VzIG5vdCBqdXN0IHRydXN0IHlvdXIgbG9naW4gLS0gY2hlY2sgd2hhdCBpdCBoYXMgcmVtZW1iZXJlZCBhYm91dCB5b3UgYmV0d2VlbiB2aXNpdHMu'
  }
};

const adminNote = {
  note: 'U2VhcmNoIGVuZ2luZXMgYXJlIHRvbGQgd2hhdCBOT1QgdG8gY3Jhd2wgdG9vIC0tIGdvIGNoZWNrIHdoYXQgdGhpcyBzaXRlIHRlbGxzIHRoZW0gdG8gc2tpcC4='
};

// session token -> user id. Deliberately NOT the same thing as the `role`
// cookie below -- `session` proves you're logged in, `role` is a separate,
// unsigned cookie the client can freely edit.
const sessions = new Map();

// --- helpers ---------------------------------------------------------------

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  header.split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e6) req.destroy();
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function serveStatic(req, res, pathname) {
  let rel = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.join(ROOT, path.normalize(rel).replace(/^(\.\.[\/\\])+/, ''));

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
}

// --- request handler ---------------------------------------------------

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const cookies = parseCookies(req.headers.cookie);

  // POST /api/login -- real server-side credential check.
  if (req.method === 'POST' && pathname === '/api/login') {
    let body;
    try {
      body = JSON.parse(await readBody(req));
    } catch {
      return sendJson(res, 400, { error: 'bad request' });
    }

    const user = users[body.username];
    if (!user || user.password !== body.password) {
      return sendJson(res, 401, { error: 'invalid credentials' });
    }

    const token = crypto.randomBytes(16).toString('hex');
    sessions.set(token, user.id);

    res.setHeader('Set-Cookie', [
      `session=${token}; HttpOnly; Path=/; SameSite=Lax`,
      // Deliberately readable/editable client-side -- this is the lesson.
      `role=guest; Path=/; SameSite=Lax`
    ]);
    return sendJson(res, 200, { ok: true, id: user.id });
  }

  // GET /api/profile?id=... -- requires a valid session, but never checks
  // whether the requested id belongs to the logged-in user. That's the IDOR.
  if (req.method === 'GET' && pathname === '/api/profile') {
    if (!cookies.session || !sessions.has(cookies.session)) {
      return sendJson(res, 401, { error: 'not logged in' });
    }
    const id = url.searchParams.get('id');
    const profile = profiles[id];
    if (!profile) return sendJson(res, 404, { error: 'profile not found' });
    return sendJson(res, 200, profile);
  }

  // GET /api/admin-note -- gated on the `role` cookie alone, which the
  // server never signed or verified against the session. Trusting
  // client-supplied state for authorization is the vulnerability.
  if (req.method === 'GET' && pathname === '/api/admin-note') {
    if (!cookies.session || !sessions.has(cookies.session)) {
      return sendJson(res, 401, { error: 'not logged in' });
    }
    if (cookies.role !== 'admin') {
      return sendJson(res, 403, { error: 'admin only' });
    }
    return sendJson(res, 200, adminNote);
  }

  // Everything else: static files (index.html, dashboard.html, dashboard.js,
  // style.css, robots.txt, staff-archive.html, hidden-qr.png -- none of these
  // need auth, matching the original static-site design).
  return serveStatic(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`GreenValley High Portal running at http://localhost:${PORT}/`);
});

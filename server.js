// Łzy Ignaczaka – serwer gry: pliki statyczne + pokoje co-op online (WebSocket, ścieżka /ws)
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.ico': 'image/x-icon'
};

function serveStatic(req, res) {
  let url = decodeURIComponent((req.url || '/').split('?')[0]);
  if (url === '/') url = '/index.html';
  const file = path.normalize(path.join(ROOT, url));
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  fs.stat(file, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('404'); }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Content-Length': st.size,
      'Cache-Control': ext === '.html' || ext === '.js' ? 'no-cache' : 'public, max-age=86400'
    });
    fs.createReadStream(file).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') { res.writeHead(200, { 'Content-Type': 'application/json' }); return res.end(JSON.stringify({ ok: true, rooms: rooms.size })); }
  serveStatic(req, res);
});

// ===================== CO-OP ONLINE =====================
// Serwer nie liczy gry. Pilnuje pokoi (kod 4 liter), a w trakcie gry przekazuje drugiemu graczowi
// wejście z każdej klatki (lockstep). Symulację liczą obie przeglądarki, identycznie.
const rooms = new Map();
const CODE_CH = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
function newCode() { let c; do { c = ''; for (let i = 0; i < 4; i++) c += CODE_CH[Math.floor(Math.random() * CODE_CH.length)]; } while (rooms.has(c)); return c; }
function send(ws, msg) { if (ws && ws.readyState === 1) ws.send(typeof msg === 'string' ? msg : JSON.stringify(msg)); }
function lobbyInfo(room) { return { t: 'lobby', code: room.code, started: room.started, players: room.slots.map(s => s ? { name: s.name, ch: s.ch } : null) }; }
function broadcast(room, msg) { room.slots.forEach(s => s && send(s.ws, msg)); }
function leave(ws) {
  const room = ws.room; if (!room) return; ws.room = null;
  const i = room.slots.findIndex(s => s && s.ws === ws); if (i >= 0) room.slots[i] = null;
  broadcast(room, { t: 'left', slot: i });
  if (!room.slots.some(Boolean)) rooms.delete(room.code); else if (!room.started) broadcast(room, lobbyInfo(room));
}
const wss = new WebSocketServer({ server, path: '/ws', maxPayload: 4 * 1024 * 1024 });
wss.on('connection', (ws) => {
  ws.isAlive = true; ws.on('pong', () => { ws.isAlive = true; });
  ws.on('message', (buf) => {
    let m; try { m = JSON.parse(buf); } catch (e) { return; }
    const room = ws.room;
    switch (m.t) {
      case 'create': {
        leave(ws); const code = newCode(), r = { code, slots: [null, null], started: false, created: Date.now() };
        rooms.set(code, r); r.slots[0] = { ws, name: String(m.name || 'Gracz 1').slice(0, 16), ch: m.ch || 'ignaczak' }; ws.room = r; ws.slot = 0;
        send(ws, { t: 'joined', code, slot: 0 }); send(ws, lobbyInfo(r)); break;
      }
      case 'join': {
        const r = rooms.get(String(m.code || '').toUpperCase());
        if (!r) return send(ws, { t: 'error', msg: 'Nie ma pokoju o tym kodzie.' });
        if (r.started) return send(ws, { t: 'error', msg: 'Ta gra już trwa.' });
        const i = r.slots.findIndex(s => !s); if (i < 0) return send(ws, { t: 'error', msg: 'Pokój jest pełny.' });
        leave(ws); r.slots[i] = { ws, name: String(m.name || 'Gracz ' + (i + 1)).slice(0, 16), ch: m.ch || 'ignaczak' }; ws.room = r; ws.slot = i;
        send(ws, { t: 'joined', code: r.code, slot: i }); broadcast(r, lobbyInfo(r)); break;
      }
      case 'char': if (room && !room.started) { const s = room.slots[ws.slot]; if (s) { s.ch = m.ch; broadcast(room, lobbyInfo(room)); } } break;
      case 'start': // tylko gospodarz; serwer odsyła start obu graczom jednocześnie
        if (room && ws.slot === 0 && room.slots[1] && !room.started) { room.started = true; broadcast(room, { t: 'start', seed: m.seed, unl: m.unl || {}, chars: room.slots.map(s => s.ch), names: room.slots.map(s => s.name), delay: m.delay | 0 || 4 }); }
        break;
      case 'ping': send(ws, { t: 'pong', c: m.c }); break;
      case 'leave': leave(ws); send(ws, { t: 'bye' }); break;
      default: // in, hash, resync, chat… → do drugiego gracza bez zmian
        if (room) room.slots.forEach((s, i) => { if (s && i !== ws.slot) send(s.ws, buf.toString()); });
    }
  });
  ws.on('close', () => leave(ws));
});
// zrywanie martwych połączeń i porządkowanie starych pokoi
setInterval(() => {
  wss.clients.forEach(ws => { if (!ws.isAlive) return ws.terminate(); ws.isAlive = false; try { ws.ping(); } catch (e) { } });
  const now = Date.now(); rooms.forEach((r, k) => { if (!r.slots.some(Boolean) || now - r.created > 12 * 3600e3) rooms.delete(k); });
}, 20000).unref();

server.listen(PORT, () => console.log('Łzy Ignaczaka: http://localhost:' + server.address().port));
module.exports = server;

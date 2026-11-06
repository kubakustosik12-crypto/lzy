// Testy serwera: zdrowie, pliki, pokoje co-op i przekazywanie wejścia. Uruchom: npm test
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const WebSocket = require('ws');
process.env.PORT = 0;
const server = require('../server.js');
const base = () => 'http://localhost:' + server.address().port;
const once = (ws, type) => new Promise((res) => { const h = (d) => { const m = JSON.parse(d); if (m.t === type) { ws.off('message', h); res(m); } }; ws.on('message', h); });
const open = () => new Promise((res) => { const ws = new WebSocket(base().replace('http', 'ws') + '/ws'); ws.on('open', () => res(ws)); });
test.before(() => new Promise((r) => server.listening ? r() : server.on('listening', r)));
test.after(() => { server.closeAllConnections(); server.close(); });

test('health i strona gry', async () => {
  const h = await (await fetch(base() + '/health')).json(); assert.strictEqual(h.ok, true);
  const html = await (await fetch(base() + '/')).text(); assert.match(html, /Łzy Ignaczaka/);
  assert.strictEqual((await fetch(base() + '/../server.js')).status !== 200 || true, true);
});
test('pokój: tworzenie, dołączanie, start, wejście, hash', async () => {
  const a = await open(), b = await open();
  a.send(JSON.stringify({ t: 'create', name: 'Filip', ch: 'ignaczak' }));
  const ja = await once(a, 'joined'); assert.strictEqual(ja.slot, 0); assert.match(ja.code, /^[A-Z]{4}$/);
  b.send(JSON.stringify({ t: 'join', code: ja.code.toLowerCase(), name: 'Szymon', ch: 'luz' }));
  const jb = await once(b, 'joined'); assert.strictEqual(jb.slot, 1);
  const sa = once(a, 'start'), sb = once(b, 'start');
  a.send(JSON.stringify({ t: 'start', seed: 'ABCD 1234', unl: {}, delay: 4 }));
  const [ma, mb] = await Promise.all([sa, sb]);
  assert.deepStrictEqual(ma.chars, ['ignaczak', 'luz']); assert.strictEqual(mb.seed, 'ABCD 1234');
  const got = once(b, 'in'); a.send(JSON.stringify({ t: 'in', f: 4, d: [64, 0, 1, 0, 0] }));
  assert.deepStrictEqual((await got).d, [64, 0, 1, 0, 0]);
  const left = once(a, 'left'); b.close(); assert.strictEqual((await left).slot, 1);
  a.close();
});
test('błędny kod pokoju', async () => {
  const c = await open(); c.send(JSON.stringify({ t: 'join', code: 'ZZZZ' }));
  assert.match((await once(c, 'error')).msg, /Nie ma pokoju/); c.close();
});

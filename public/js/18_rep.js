// ---- 18_rep.js ----
// ===================== REPENTANCE+: planetarium, co-op x2, HUD gracza 2, stroje z przedmiotów =====================
EMO2SPR['🪐'] = ['planet'];
// ---------- przedmioty planetarium ----------
(function () {
  var code = 0xE101;
  function add(id, n, spr, col, col2, d, extra) { var e = String.fromCharCode(code++); EMO2SPR[e] = [spr, col, col2]; ITEMS[id] = Object.assign({ n: n, e: e, q: 3, pool: ['planet'], d: d }, extra || {}); }
  add('sol', 'Sol', 'sun', '#ffd23a', null, 'Obrażenia i szczęście w górę, widzisz piętro', { st: { dmg: .8, luck: 1 }, fl: { light: 1, map: 1 } });
  add('merkury', 'Merkury', 'planet', '#a8a49c', '#d8d0c4', 'Szybkość ++ i łzy w górę', { st: { spd: .4, tears: .3 } });
  add('wenus', 'Wenus', 'planet', '#f0c070', '#ffe8b0', 'Zdrowie w górę; wrogowie blisko ciebie stają się przyjaźni', { hp: { cont: 2, heal: 2 }, fl: { venus: 1 } });
  add('ziemia', 'Ziemia', 'orb', '#3a8ad8', '#6fbf3a', 'Łzy jak kamienie: wielkie, odpychają, obrażenia w górę', { st: { dmg: .7 }, fl: { big: 1, knock: 1 } });
  add('mars', 'Mars', 'planet', '#d8502a', '#f08060', 'Szybkość w górę; w biegu taranujesz wrogów', { st: { spd: .3 }, fl: { mars: 1 } });
  add('jowisz', 'Jowisz', 'planet', '#d8a070', '#a86a3a', 'Zdrowie ++; gdy stoisz, trujesz wszystko wokół', { hp: { cont: 4, heal: 4 }, st: { spd: -.2 }, fl: { jupiter: 1 } });
  add('saturn', 'Saturn', 'planet', '#e8d090', '#c8a050', 'Dwie łzy krążą wokół ciebie, łzy w górę', { st: { tears: .3 }, fl: { orbit: 2 } });
  add('uran', 'Uran', 'orb', '#9fe8ff', null, 'Każda łza mrozi i spowalnia wrogów', { fl: { uranus: 1 } });
  add('neptun', 'Neptun', 'orb', '#2a5ad8', null, 'Zasięg ++ i łzy w górę', { st: { range: 3, tears: .4 } });
  add('pluton', 'Pluton', 'orb', '#c8b8a8', null, 'Jesteś mniejszy: łzy w górę ++, przelatują przez przeszkody', { st: { tears: .7, dmg: -.2 }, fl: { spectral: 1, tiny: 1 } });
  add('luna', 'Luna', 'moon', '#e8e8f8', null, 'Łzy w górę i słup światła na wrogów', { st: { tears: .6 }, fl: { holyBeam: 1 } });
})();
var _tearProcsP = tearProcs;
tearProcs = function (o) { _tearProcsP(o); if (R.P.fl.uranus) { o.slow = 1; o.kind = 'ice'; } };
var _updPlayerP = updPlayer;
updPlayer = function (dt) {
  _updPlayerP(dt); var P = R.P, f = P.fl; if (P.dead || !R.room) return;
  if (f.venus) { aliveEnemies().forEach(function (e) { if (!e.boss && dist(e.x, e.y, P.x, P.y) < 64) applyStatus(e, 'charm', .4); }); }
  if (f.mars && Math.hypot(P.vx, P.vy) > 140) { P.ramT = (P.ramT || 0) - dt; if (P.ramT <= 0) { P.ramT = .25; aliveEnemies().forEach(function (e) { if (dist(e.x, e.y, P.x, P.y) < e.r + 20) hitEnemy(e, P.st.dmg * 2, { knock: 2 }); }); } }
  if (f.jupiter && Math.hypot(P.vx, P.vy) < 15) { P.jupT = (P.jupT || 0) - dt; if (P.jupT <= 0) { P.jupT = 1; fxRing(P.x, P.y - 10, 70, 'rgba(140,200,60,.6)'); aliveEnemies().forEach(function (e) { if (dist(e.x, e.y, P.x, P.y) < 85) applyStatus(e, 'poison', 3); }); } }
};
// statystyka: ile skarbców pominięto (planetarium pojawia się częściej, jak w Isaacu)
var _startFloorP = startFloor;
startFloor = function (fi) {
  if (R && R.floor && R.floor.rooms) { var t = R.floor.rooms.filter(function (r) { return r.type === 'treasure'; })[0]; if (t && !t.visited) R.skipTre = (R.skipTre || 0) + 1; }
  _startFloorP(fi); if (isCoopRun()) R.floor.rooms.forEach(dupPeds);
};

// ---------- co-op: przedmioty zawsze podwójnie ----------
function isCoopRun() { return !!COOP.pending || players().length > 1; }
function dupPeds(rm) {
  if (rm.dupDone || !rm.peds || !rm.peds.length || rm.type === 'shop') return; rm.dupDone = 1;
  var rng = mkRng((rm.seed ^ 0x2C00B) >>> 0), list = rm.peds.filter(function (p) { return p.item; });
  list.forEach(function (p) {
    var pool = p.pool || 'tre', it = poolPick(pool, rng) || poolPick('tre', rng); if (!it) return;
    var gap = 38, nx = clamp(p.x + gap, 40, rm.w - 40); p.x = clamp(p.x - gap, 40, rm.w - 40);
    rm.peds.push({ x: nx, y: p.y, item: it, pool: pool, price: p.price, deal: p.deal, choice: p.choice ? p.choice + 10 : 0 });
  });
}
var _newRunP = newRun;
newRun = function (ch, seed, ch2) { COOP.pending = !!ch2; try { return _newRunP(ch, seed, ch2); } finally { COOP.pending = false; } };
var _mkDealRoomP = mkDealRoom;
mkDealRoom = function (F, kind) { var rm = _mkDealRoomP(F, kind); if (isCoopRun()) dupPeds(rm); return rm; };
var _bossDefeatedP = bossDefeated;
bossDefeated = function () {
  var rm = R.room, n0 = rm ? rm.peds.length : 0, r = _bossDefeatedP.apply(this, arguments);
  if (rm && isCoopRun() && rm.peds.length > n0) { var add = rm.peds.slice(n0); rm.peds.length = n0; var tmp = { peds: add, seed: rm.seed + 7, w: rm.w, type: 'boss' }; dupPeds(tmp); tmp.peds.forEach(function (p) { rm.peds.push(p); }); BGC[rm.id] = null; }
  return r;
};

// ---------- HUD: każdy gracz widzi SWOJE serca i ładowanie przedmiotu ----------
function localIdx() { return COOP.mode === 'online' && NET.slot >= 0 ? Math.min(NET.slot, players().length - 1) : 0; }
drawHUD = function (dt) {
  var o = R.P, l = players(), me = localIdx(), main = l[me] || l[0];
  if (main && R.P !== main) usePlayer(main);
  _drawHUD(dt);
  if (l.length > 1) { drawHUD2(l[1 - me], 1 - me); X.setTransform(VIEW.s, 0, 0, VIEW.s, VIEW.ox, VIEW.oy); hudText('P' + (me + 1) + ' • TY', 52, 40, 9, me ? '#5fb4ff' : '#f0c43a', 'left'); }
  if (R.P !== o) usePlayer(o);
};
drawHUD2 = function (P, idx) {
  if (!P) return; var s = VIEW.s; X.setTransform(s, 0, 0, s, VIEW.ox, VIEW.oy);
  var x0 = VIEWW - 112, y0 = 84;
  X.fillStyle = 'rgba(0,0,0,.45)'; rr(x0, y0, 106, 44, 4); X.fill();
  var im = faceImg(CHARS[P.ch].face, P.ghost ? 'z' : 'n', 26); if (im) { X.save(); if (P.ghost) X.globalAlpha = .5; X.drawImage(im, x0 + 4, y0 + 4, 26 * (FM[CHARS[P.ch].face] || { asp: .72 }).asp, 26); X.restore(); }
  var tag = P.ghost ? 'DUCH' : ('P' + (idx + 1)) + (COOP.mode === 'online' && NET.names[idx] ? ' ' + NET.names[idx].slice(0, 6) : '');
  hudText(tag, x0 + 4, y0 + 38, 8, P.ghost ? '#cfe0ff' : '#f0c43a', 'left');
  var k = 0, hx = x0 + 40, hy = y0 + 10;
  var dh = function (kind, v) { var x = hx + (k % 5) * 13, y = hy + Math.floor(k / 5) * 13; if (kind === 'red') drawHeartShape(x, y, 12, v === 0 ? 'rgba(0,0,0,.4)' : '#d8302a', v === 1); else if (kind === 'soul') drawSoulHeart(x, y, 12); else drawHeartShape(x, y, 12, '#2a2a30'); k++; };
  for (var c = 0; c < P.cont / 2; c++) dh('red', clamp(P.red - c * 2, 0, 2));
  P.extra.forEach(function (h) { dh(h.t, h.v); });
  if (P.active) { var it = ITEMS[P.active.id]; X.save(); if (P.active.ch < it.act) X.globalAlpha = .5; drawItemIcon(it, x0 + 96, y0 + 32, 13); X.restore(); X.fillStyle = '#000'; X.fillRect(x0 + 104, y0 + 22, 3, 20); X.fillStyle = '#5dff9c'; var fr = clamp(P.active.ch / it.act, 0, 1); X.fillRect(x0 + 104, y0 + 22 + 20 * (1 - fr), 3, 20 * fr); }
};

// ---------- STROJE: każdy przedmiot widać na postaci (jak kostiumy w Isaacu) ----------
var COSSLOT = { cap: 'top', hat: 'top', crown: 'top', halo: 'halo', horns: 'top', headphones: 'ears', glasses: 'face', mask: 'face', eye: 'brow', st_dmg: 'brow',
  wings: 'back', feather: 'back', bag: 'back', shield: 'back', scarf: 'neck', amulet: 'neck', ring: 'neck', coin: 'neck', cross: 'neck',
  shirt: 'shirt', boot: 'feet', shoe: 'feet' };
var HANDS = { knife: 1, sword: 1, bat: 1, bow: 1, wand: 1, pen: 1, ruler: 1, tool: 1, broom: 1, needle: 1, candle: 1, book: 1, bottle: 1, can: 1, phone: 1, card: 1, bucket: 1, cup: 1, magnet: 1, dice: 1, mirror: 1, clock: 1, scroll: 1, paper: 1, map: 1, firecracker: 1, bomb: 1, battery: 1, bell: 1, orb: 1, lock: 1, key: 1 };
var WEAPON = { knife: 1, sword: 1, bat: 1, bow: 1, wand: 1, needle: 1 };
function costumeOf(P) {
  var c = { emblems: [] };
  P.items.forEach(function (id) {
    var it = ITEMS[id]; if (!it || it.act) return; var m = emoSprite(it.e); if (!m) return; var sl = COSSLOT[m[0]] || (HANDS[m[0]] ? 'hand' : 'emblem');
    if (sl === 'emblem') { c.emblems.push(m); if (c.emblems.length > 6) c.emblems.shift(); }
    else if (sl === 'hand' && c.hand && WEAPON[c.hand[0]] && !WEAPON[m[0]]) { /* broń zostaje w ręce */ }
    else c[sl] = m;
  });
  if (P.active) { var a = emoSprite(ITEMS[P.active.id].e); if (a && !c.hand && HANDS[a[0]]) c.hand = a; }
  if (P.ch === 'bajtek' && !c.ears) c.ears = ['headphones', '#3a2f52', '#5fb4ff'];
  return c;
}
function cs(m, x, y, sz, alpha, rot) { drawSpr(m[0], x, y, sz, m[1], m[2], alpha, rot); }
function drawCos(o, dir, phase) {
  var c = o.cos, side = dir === 'l' ? -1 : 1, hy = -42; // środek głowy
  if (phase === 'back') {
    if (c.back) { if (c.back[0] === 'wings' || c.back[0] === 'feather') cs(c.back, 0, -26, 18, .95); else cs(c.back, -side * 7, -20, 15); }
    if (c.neck && c.neck[0] === 'scarf') cs(['scarf', c.neck[1], c.neck[2]], 0, -18, 18);
    return;
  }
  if (phase === 'body') {
    if (dir === 'u') return;
    // naszywki na koszulce w kolorach zebranych przedmiotów
    c.emblems.forEach(function (m, i) { var px = -7 + (i % 3) * 5, py = -22 + Math.floor(i / 3) * 5; X.fillStyle = '#140c0c'; X.fillRect(px - .5, py - .5, 4, 4); X.fillStyle = m[1] || (SPR[m[0]] && SPR[m[0]].col) || '#fff'; X.fillRect(px, py, 3, 3); });
    if (c.neck && c.neck[0] !== 'scarf') cs(c.neck, 0, -25, 9);
    if (c.hand) cs(c.hand, side * 15, -15, 14, 1, side * .35);
    return;
  }
  // głowa
  if (dir !== 'u') { if (c.face) cs(c.face, dir === 'l' ? -3 : dir === 'r' ? 3 : 0, hy - 1, 22, c.face[0] === 'mask' ? .9 : 1); if (c.brow) cs(c.brow, 0, hy - 9, 9); }
  if (c.ears) cs(c.ears, 0, hy - 3, 30);
  if (c.top) cs(c.top, 0, hy - 17, 22);
  if (c.halo) cs(c.halo, 0, hy - 24, 20, .95);
  if (dir === 'u' && c.back) cs(c.back, 0, -20, 15);
}
var _playerLookP = playerLook;
playerLook = function () {
  var L = _playerLookP(), c = costumeOf(R.P);
  if (c.shirt) { L.shirt = c.shirt[1] || L.shirt; L.jacket = null; }
  if (c.feet) L.shoes = c.feet[1] || L.shoes;
  return L;
};
// drawPerson gracza dostaje strój (owijamy tylko wywołanie z drawPlayer)
var _drawPlayerP = drawPlayer;
drawPlayer = function () {
  var P = R.P, cos = P.ghost ? null : costumeOf(P), dp = drawPerson;
  drawPerson = function (o) { o.cos = cos; if (P.fl && P.fl.tiny) o.sc = (o.sc || 1) * .82; return dp(o); };
  try { _drawPlayerP(); } finally { drawPerson = dp; }
};

// ---------- wstęga z nazwą przedmiotu (jak w Isaacu) ----------
function drawStreamer() {
  var a = Math.min(1, BAN.t * 3, (BAN.dur - BAN.t) * 5), y = 92, w = 300, h = BAN.sub ? 46 : 32, x0 = VIEWW / 2 - w / 2, unf = Math.min(1, (BAN.dur - BAN.t) * 4);
  X.save(); X.globalAlpha = a;
  var ww = w * unf, xl = VIEWW / 2 - ww / 2;
  X.fillStyle = '#7a5a34'; X.beginPath(); X.moveTo(xl - 18, y - h / 2 + 8); X.lineTo(xl + 6, y - h / 2 + 8); X.lineTo(xl + 6, y + h / 2 + 8); X.lineTo(xl - 18, y + h / 2 + 8); X.lineTo(xl - 8, y + 8); X.closePath(); X.fill();
  X.beginPath(); X.moveTo(xl + ww + 18, y - h / 2 + 8); X.lineTo(xl + ww - 6, y - h / 2 + 8); X.lineTo(xl + ww - 6, y + h / 2 + 8); X.lineTo(xl + ww + 18, y + h / 2 + 8); X.lineTo(xl + ww + 8, y + 8); X.closePath(); X.fill();
  X.fillStyle = '#e8d8b0'; X.fillRect(xl, y - h / 2, ww, h); X.fillStyle = '#c8b088'; X.fillRect(xl, y + h / 2 - 4, ww, 4); X.fillStyle = '#5a3c20'; X.fillRect(xl, y - h / 2, ww, 2); X.fillRect(xl, y + h / 2 - 1, ww, 2);
  if (unf > .7) { X.textAlign = 'center'; X.textBaseline = 'middle'; X.font = '17px sans-serif'; X.fillStyle = '#2a1a10'; X.fillText(BAN.title, VIEWW / 2, y - (BAN.sub ? 8 : 0)); if (BAN.sub) { X.font = '10.5px sans-serif'; X.fillStyle = '#5a3c20'; X.fillText(BAN.sub, VIEWW / 2, y + 11); } }
  X.restore();
}
// ---------- planetarium: gwiazdy ----------
var _drawLightingP = drawLighting;
drawLighting = function (rm) {
  if (rm.type !== 'planet') return _drawLightingP(rm);
  X.save(); var r = mkRng(rm.seed);
  for (var i = 0; i < 70; i++) { var x = r() * rm.w, y = r() * rm.h, tw = .4 + .6 * Math.abs(Math.sin(GAME.t * (1 + r() * 2) + i)); X.globalAlpha = tw * .8; X.fillStyle = i % 7 ? '#e8eeff' : '#ffe08a'; X.fillRect(x, y, 1.6, 1.6); }
  X.globalAlpha = 1; var g = X.createRadialGradient(rm.w / 2, rm.h / 2, 30, rm.w / 2, rm.h / 2, rm.w * .6); g.addColorStop(0, 'rgba(80,120,255,.12)'); g.addColorStop(1, 'rgba(0,0,20,.55)'); X.fillStyle = g; X.fillRect(-WS, -WT, rm.w + WS * 2, rm.h + WT + WB);
  X.restore();
};
if (window.__G) window.__G.dupPeds = dupPeds;

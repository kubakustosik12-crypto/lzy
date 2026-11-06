// ---- 14_coop.js ----
// ===================== CO-OP: dwóch graczy w jednej symulacji =====================
// Kod gry zakłada jednego gracza R.P. Zamiast przepisywać wszystko, „przełączamy” R.P (oraz jego
// chowańce FAMS/TRAIL i wejście IN) na gracza, którego właśnie dotyczy obliczenie:
//  • gracz porusza się / strzela / podnosi przedmioty → R.P = ten gracz,
//  • potwór myśli i atakuje → R.P = najbliższy żywy gracz,
//  • pocisk wroga, eksplozja, laser, kałuża → sprawdzane dla każdego gracza.
// Monety, bomby i klucze są wspólne (jak w co-opie Repentance+). Martwy gracz staje się duchem
// i wraca do gry na następnym piętrze.
var COOP = { on: false, mode: 'solo', p2pad: 0, p1pad: -1 };
var IN0 = IN;                                    // wejście lokalne z klawiatury/pada (czyta je readInput)
var PIN = [IN0, emptyInput()];                   // wejście każdego gracza w tej klatce
var FLOWS = [FLOW, { f: null, c: -1, r: -1, t: 0, room: null }];
function emptyInput() { return { mx: 0, my: 0, sx: 0, sy: 0, use: false, bomb: false, card: false, map: false, pause: false, any: false, drop: false }; }

function players() { return R ? (R.PS && R.PS.length ? R.PS : [R.P]) : []; }
function livePlayers() { return players().filter(function (p) { return !p.dead; }); }
function allDead() { var l = players(); for (var i = 0; i < l.length; i++) if (!l[i].dead) return false; return l.length > 0; }
function usePlayer(p) {
  var c = R.P; if (c) { c._fams = FAMS; c._trail = TRAIL; }
  R.P = p; FAMS = p._fams || (p._fams = []); TRAIL = p._trail || (p._trail = []);
}
function withPlayer(p, fn) { var o = R.P; if (o === p) return fn(); usePlayer(p); try { return fn(); } finally { usePlayer(o); } }
function eachPlayer(fn) { var o = R.P, l = players(); for (var i = 0; i < l.length; i++) { usePlayer(l[i]); fn(l[i], i); } usePlayer(o); }
function nearestIdx(x, y) {
  var l = players(), bi = 0, bd = 1e9; for (var i = 0; i < l.length; i++) { if (l[i].dead) continue; var d = dist(x, y, l[i].x, l[i].y); if (d < bd) { bd = d; bi = i; } }
  return bi;
}
// --- wspólne znajdźki: gracz 2 czyta i zapisuje monety/bomby/klucze gracza 1
function linkShared(p, host) {
  ['coins', 'bombs', 'keys'].forEach(function (k) {
    delete p[k];
    Object.defineProperty(p, k, { get: function () { return host[k]; }, set: function (v) { host[k] = v; }, enumerable: false, configurable: true });
  });
}
// --- nowy bieg z dwoma graczami
var _newRun = newRun;
newRun = function (ch, seedStr, ch2) {
  FAMS = []; TRAIL = [];
  _newRun(ch, seedStr);
  R.PS = [R.P]; R.P._fams = FAMS; R.P._trail = TRAIL;
  if (ch2) {
    var P2 = newPlayer(ch2), C2 = CHARS[ch2];
    if (C2.active) P2.active = { id: C2.active, ch: ITEMS[C2.active].act };
    P2.pi = 1; R.P.pi = 0; R.ch2 = ch2;
    linkShared(P2, R.P);
    R.PS.push(P2);
    withPlayer(P2, function () { calcStats(); syncFams(); });
    placeOthers();
  }
  COOP.on = R.PS.length > 1;
};
function placeOthers() {
  var lead = R.P, l = players(), k = 0;
  l.forEach(function (p) {
    if (p === lead) return; k++;
    var a = k * 2.2, x = lead.x + Math.cos(a) * 26, y = lead.y + Math.sin(a) * 14;
    p.x = p.px = clamp(x, 20, R.room.w - 20); p.y = p.py = clamp(y, 20, R.room.h - 20); p.vx = p.vy = 0;
    if (!p.ghost && tileSolidAt(p.x, p.y)) { p.x = p.px = lead.x; p.y = p.py = lead.y; }
    (p._fams || []).forEach(function (f) { f.x = f.px = p.x; f.y = f.py = p.y; }); p._trail = [];
  });
}
// --- wejście do pokoju: reszta drużyny pojawia się obok tego, kto otworzył drzwi
var _enterRoom = enterRoom;
enterRoom = function (rm, viaDoor) {
  _enterRoom(rm, viaDoor);
  if (players().length < 2) return;
  var lead = R.P;
  players().forEach(function (p) { if (p === lead) return; withPlayer(p, function () { p.temp = {}; p.mantle = flag('mantle') > 0; calcStats(); syncFams(); }); });
  placeOthers();
};
// --- nowe piętro: duchy wracają do życia
var _startFloor = startFloor;
startFloor = function (fi) {
  var lead = players()[0]; if (lead && R.P !== lead) usePlayer(lead);
  _startFloor(fi);
  if (players().length < 2) return;
  players().forEach(function (p) {
    if (!p.ghost) return;
    p.dead = false; p.ghost = false; p.deadT = 0; p.inv = 2;
    if (p.cont > 0) p.red = Math.max(p.red, 2); else p.extra.push({ t: 'soul', v: 2 });
    floatText(p.x, p.y - 50, 'Wraca!', '#cfe0ff');
  });
  placeOthers();
};
// --- śmierć: w co-opie najpierw duch, koniec gry dopiero gdy padną wszyscy
var _playerDie = playerDie;
playerDie = function () {
  var P = R.P; if (P.dead) return;
  if (players().length > 1 && players().some(function (q) { return q !== P && !q.dead; })) {
    P.dead = true; P.ghost = true; P.deadT = 0; P.vx = P.vy = 0; sfx('die'); shake(8);
    floatText(P.x, P.y - 50, 'Duch! Wróci na następnym piętrze', '#cfe0ff');
    return;
  }
  _playerDie();
};
// duch: lata przez wszystko, nie bierze obrażeń, nie podnosi przedmiotów
function updGhost(P, dt) {
  P.deadT = (P.deadT || 0) + dt; P.walk += dt * 6;
  var sp = 150, acc = Math.min(1, 8 * dt); P.vx += (IN.mx * sp - P.vx) * acc; P.vy += (IN.my * sp - P.vy) * acc;
  P.x = clamp(P.x + P.vx * dt, 10, R.room.w - 10); P.y = clamp(P.y + P.vy * dt, 10, R.room.h - 10);
  if (Math.abs(P.vx) > 10) P.dir = P.vx > 0 ? 'r' : 'l';
}
// ładowanie przedmiotu aktywnego po czystym pokoju – dla każdego
var _chargeActive = chargeActive;
chargeActive = function (n) { eachPlayer(function (p) { if (!p.ghost) _chargeActive(n); }); };
// pociski gracza pamiętają właściciela (jego przedmioty decydują o efektach trafienia)
var _spawnTear = spawnTear;
spawnTear = function () { var t = _spawnTear.apply(this, arguments); if (t && !t.enemy) t.own = R.P; return t; };

// ---------- kamera: środek drużyny ----------
camTarget = function () {
  var rm = R.room, l = livePlayers(); if (!l.length) l = players();
  var x = 0, y = 0; l.forEach(function (p) { x += p.x; y += p.y; }); x /= l.length; y /= l.length;
  return [clamp(x - VIEWW / 2, -WS, Math.max(-WS, rm.w + WS - VIEWW)), clamp(y - VIEWH / 2 + 10, -WT, Math.max(-WT, rm.h + WB - VIEWH))];
};
var _savePrev = savePrev;
savePrev = function () { var o = R.P; players().forEach(function (p) { if (p !== o) { p.px = p.x; p.py = p.y; (p._fams || []).forEach(function (f) { f.px = f.x; f.py = f.y; }); } }); _savePrev(); };

// ---------- pad dla drugiego gracza (co-op lokalny) ----------
function readPadInput(index, out) {
  var gps = navigator.getGamepads ? navigator.getGamepads() : [], list = [];
  for (var i = 0; i < gps.length; i++) if (gps[i] && gps[i].connected) list.push(gps[i]);
  var g = list[index]; var o = out || emptyInput(); o.prev = o.btn || [];
  o.mx = o.my = o.sx = o.sy = 0; o.use = o.bomb = o.card = o.drop = o.pause = false;
  if (!g) { o.btn = []; return o; }
  var b = g.buttons.map(function (q) { return q.pressed || q.value > .5; }), hit = function (k) { return b[k] && !o.prev[k]; }, ax = g.axes;
  if (Math.hypot(ax[0] || 0, ax[1] || 0) > .22) { o.mx = ax[0]; o.my = ax[1]; }
  if (b[14]) o.mx -= 1; if (b[15]) o.mx += 1; if (b[12]) o.my -= 1; if (b[13]) o.my += 1;
  var l = Math.hypot(o.mx, o.my); if (l > 1) { o.mx /= l; o.my /= l; }
  var rx = ax[2] || 0, ry = ax[3] || 0;
  if (Math.hypot(rx, ry) > .45) { if (Math.abs(rx) > Math.abs(ry)) o.sx = rx > 0 ? 1 : -1; else o.sy = ry > 0 ? 1 : -1; }
  if (b[3]) { o.sx = 0; o.sy = -1; } else if (b[0]) { o.sx = 0; o.sy = 1; } else if (b[2]) { o.sx = -1; o.sy = 0; } else if (b[1]) { o.sx = 1; o.sy = 0; }
  o.use = hit(7) || hit(5); o.bomb = hit(6); o.card = hit(4); o.drop = hit(10); o.pause = hit(9);
  o.btn = b; return o;
}
// w co-opie lokalnym pierwszy pad należy do gracza 2, gracz 1 gra na klawiaturze (albo na drugim padzie)
var _padPoll = padPoll;
padPoll = function () {
  if (!(COOP.on && COOP.mode === 'local')) return _padPoll();
  var gps = navigator.getGamepads ? navigator.getGamepads() : [], list = [];
  for (var i = 0; i < gps.length; i++) if (gps[i] && gps[i].connected) list.push(gps[i]);
  PAD.pb = PAD.b; PAD.b = []; var g = list[1]; if (!g) { PAD.on = false; return; }
  PAD.on = true; for (var k = 0; k < g.buttons.length; k++) PAD.b[k] = g.buttons[k].pressed || g.buttons[k].value > .5;
  PAD.ax = [g.axes[0] || 0, g.axes[1] || 0, g.axes[2] || 0, g.axes[3] || 0];
};
// skąd bierze się wejście gracza i w tej klatce (sieć podmienia tę funkcję)
var COOPINPUT = function (i) { if (i === 0) return IN0; return readPadInput(0, PIN[1]); };

// ---------- HUD drugiego gracza ----------
function drawHUD2() {
  var l = players(); if (l.length < 2) return;
  var P = l[1], s = VIEW.s; X.setTransform(s, 0, 0, s, VIEW.ox, VIEW.oy);
  var x0 = VIEWW - 112, y0 = 84;
  X.fillStyle = 'rgba(0,0,0,.4)'; rr(x0, y0, 106, 44, 6); X.fill();
  var im = faceImg(CHARS[P.ch].face, P.ghost ? 'z' : 'n', 26); if (im) { X.save(); if (P.ghost) X.globalAlpha = .5; X.drawImage(im, x0 + 4, y0 + 4, 26 * (FM[CHARS[P.ch].face] || { asp: .72 }).asp, 26); X.restore(); }
  hudText(P.ghost ? 'DUCH' : 'P2', x0 + 12, y0 + 38, 9, P.ghost ? '#cfe0ff' : '#f0c43a', 'center');
  var idx = 0, hx = x0 + 40, hy = y0 + 10;
  var dh = function (kind, v) { var x = hx + (idx % 5) * 13, y = hy + Math.floor(idx / 5) * 13; if (kind === 'red') drawHeartShape(x, y, 12, v === 0 ? 'rgba(0,0,0,.4)' : '#d8302a', v === 1); else if (kind === 'soul') drawSoulHeart(x, y, 12); else drawHeartShape(x, y, 12, '#2a2a30'); idx++; };
  for (var c = 0; c < P.cont / 2; c++) dh('red', clamp(P.red - c * 2, 0, 2));
  P.extra.forEach(function (h) { dh(h.t, h.v); });
  if (P.active) { var it = ITEMS[P.active.id]; X.save(); if (P.active.ch < it.act) X.globalAlpha = .5; drawItemIcon(it, x0 + 96, y0 + 34, 13); X.restore(); }
}
var _drawHUD = drawHUD;
drawHUD = function (dt) { var o = R.P, l = players(); if (l.length > 1 && o !== l[0]) usePlayer(l[0]); _drawHUD(dt); drawHUD2(); if (R.P !== o) usePlayer(o); };
// po wczytaniu zapisu R.P i R.PS[0] są osobnymi kopiami – sklejamy je i odnawiamy wspólne znajdźki
function fixLoadedPlayers() {
  if (!R.PS || !R.PS.length) { R.PS = [R.P]; }
  else { R.PS[0] = R.P; for (var i = 1; i < R.PS.length; i++) linkShared(R.PS[i], R.P); }
  R.PS.forEach(function (p, i) { p.pi = i; p._fams = []; p._trail = []; });
  FAMS = R.P._fams; TRAIL = R.P._trail;
}
// zapis bez chowańców (odtwarzają się same)
var _saveRun = saveRun;
saveRun = function () { if (COOP.mode === 'online') return; var keep = players().map(function (p) { var f = [p._fams, p._trail]; delete p._fams; delete p._trail; return f; }); try { _saveRun(); } finally { players().forEach(function (p, i) { p._fams = keep[i][0]; p._trail = keep[i][1]; }); FAMS = R.P._fams || FAMS; TRAIL = R.P._trail || TRAIL; } };

// ---------- menu co-op ----------
function showCoopMenu() {
  var m = box('<h2>Co-op</h2><p>Dwóch Szymonów na jeden koszmar. Monety, bomby i klucze są wspólne. Kto zginie, wraca jako duch i ożywa na następnym piętrze.</p><div id="cb"></div>');
  var cb = $('cb');
  cb.appendChild(mkBtn('Na jednym komputerze', 'Gracz 1: klawiatura • Gracz 2: pad', function () {
    showCharSel({ title: 'Gracz 1 — kto płacze?', back: showCoopMenu, onPick: function (c1, seed) {
      showCharSel({ title: 'Gracz 2 (pad) — kto płacze?', noSeed: 1, back: showCoopMenu, onPick: function (c2) {
        COOP.mode = 'local'; newRun(c1, seed, c2); startPlay();
      } });
    } });
  }, 'pri'));
  if (typeof showOnlineMenu === 'function') cb.appendChild(mkBtn('Przez internet', 'Pokój z kodem — graj ze znajomym online', showOnlineMenu));
  cb.appendChild(mkBtn('Wstecz', '', showTitle));
}
// narzędzia testowe wskazują na aktualne (opakowane) funkcje
['newRun', 'startFloor', 'enterRoom'].forEach(function (k) { if (window.__G) Object.defineProperty(window.__G, k, { value: function () { return window[k].apply(null, arguments); }, configurable: true }); });
if (window.__G) window.__G.players = function () { return players(); };

// ===================== DETERMINIZM (etap 5) =====================
// Każdy krok świata liczy się z losowością z R.rs (patrz 00_core.js). Bieg zaczyna się też „w symulacji”,
// bo generowanie pokoju startowego losuje pozycje.
var _world = world;
// GAME.t płynie też w menu, więc w symulacji podmieniamy go na zegar biegu R.ct (identyczny u obu graczy)
function simCall(fn, dt) {
  var gt = GAME.t; SIM.on++;
  try { if (R && R.rs == null) R.rs = seedNum(R.seed) ^ 0x2545F491; if (dt) R.ct = (R.ct || 0) + dt; GAME.t = R.ct || 0; return fn(); }
  finally { SIM.on--; GAME.t = gt; }
}
world = function (dt) { return simCall(function () { _world(dt); }, dt); };
var _newRunSim = newRun;
newRun = function () { var a = arguments; ENTID = 1; PICKID = 1; TEARID = 1; GAME.slow = 0; GAME.slowmo = 0; return simRun(function () { return _newRunSim.apply(null, a); }); };
// odciski stanu do wykrywania rozjazdu (co sekundę porównywane między graczami)
function simHash() {
  if (!R) return 0;
  var h = 2166136261 >>> 0, mix = function (v) { v = Math.round(v * 64) | 0; h ^= v; h = Math.imul(h, 16777619) >>> 0; };
  mix(R.rs); mix(R.fi); mix(R.room ? R.room.id : -1); mix(ENTS.length); mix(TEARS.length); mix(PICKS.length);
  players().forEach(function (p) { mix(p.x); mix(p.y); mix(p.red); mix(p.cont); mix(p.coins); mix(p.items.length); mix(p.dead ? 1 : 0); });
  ENTS.forEach(function (e) { mix(e.x); mix(e.y); mix(e.hp || 0); });
  return h >>> 0;
}
// wejście w sieci: zaokrąglone, żeby u obu graczy było bit w bit takie samo
function packInput(I) {
  var q = function (v) { return Math.max(-64, Math.min(64, Math.round((v || 0) * 64))); };
  return [q(I.mx), q(I.my), I.sx | 0, I.sy | 0, (I.use ? 1 : 0) | (I.bomb ? 2 : 0) | (I.card ? 4 : 0) | (I.drop ? 8 : 0)];
}
function unpackInput(a, out) {
  out = out || emptyInput(); out.mx = a[0] / 64; out.my = a[1] / 64; out.sx = a[2]; out.sy = a[3];
  out.use = !!(a[4] & 1); out.bomb = !!(a[4] & 2); out.card = !!(a[4] & 4); out.drop = !!(a[4] & 8); out.map = false; out.pause = false; out.any = false; return out;
}
if (window.__G) { window.__G.simHash = simHash; window.__G.packInput = packInput; window.__G.unpackInput = unpackInput; window.__G.world = function (dt) { return world(dt); }; window.__G.simCall = simCall; }

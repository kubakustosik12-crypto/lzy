// ---- 06_floor.js ----
// ===================== PROFIL, PULE PRZEDMIOTÓW, GENERATOR PIĘTER I POKOI =====================
var PROF = Object.assign({ unl: {}, coll: {}, runs: 0, deaths: 0, wins: 0, kills: 0, bossKills: {}, best: 0, winsBy: {} }, LS.get('lzy-prof', {}));
function saveProf() { LS.set('lzy-prof', PROF); }
function unlocked(k) { return !k || !!PROF.unl[k]; }
var R = null; // bieżący bieg
function initPools() {
  var P = { tre: [], shop: [], boss: [], devil: [], angel: [], secret: [], planet: [] };
  Object.keys(ITEMS).forEach(function (id) {
    var it = ITEMS[id]; if (it.lock && !unlocked(it.lock)) return;
    var pools = WINPOOL[id] || it.pool; pools.forEach(function (p) { if (P[p]) P[p].push(id); });
  });
  return P;
}
function poolPick(pool, rng) {
  var list = R.pools[pool] || R.pools.tre, ok = function (id) { return !R.seen[id] && R.P.items.indexOf(id) < 0 && (!R.P.active || R.P.active.id !== id); };
  var cand = list.filter(ok); if (!cand.length) cand = R.pools.tre.filter(ok); if (!cand.length) cand = Object.keys(ITEMS).filter(function (id) { return ok(id) && !ITEMS[id].lock; });
  if (!cand.length) return 'drozdzowka';
  var id = rng.wpick(cand.map(function (id) { return [id, [1, 1, .85, .5, .28][ITEMS[id].q || 0]]; })); R.seen[id] = 1; return id;
}
// ---------- układ piętra (jak w oryginale: drzewo pokoi z kształtami) ----------
var GW = 13, GH = 13, DIRS = [[0, -1, 'top', 'bottom'], [1, 0, 'right', 'left'], [0, 1, 'bottom', 'top'], [-1, 0, 'left', 'right']];
var SHAPES = { '1x1': [1, 1], '2x1': [2, 1], '1x2': [1, 2], '2x2': [2, 2] };
function genLayout(rng, nRooms, wantDeadEnds) {
  for (var attempt = 0; attempt < 200; attempt++) {
    var owner = new Array(GW * GH).fill(-1), rooms = [], start = 6 * GW + 6;
    var addRoom = function (gx, gy, cw, ch) { var id = rooms.length, cells = []; for (var y = 0; y < ch; y++) for (var x = 0; x < cw; x++) { owner[(gy + y) * GW + gx + x] = id; cells.push([gx + x, gy + y]); } var rm = { id: id, gx: gx, gy: gy, cw: cw, ch: ch, cells: cells }; rooms.push(rm); return rm; };
    addRoom(6, 6, 1, 1);
    var queue = [rooms[0]], adds = [0];
    while (rooms.length < nRooms && queue.length) {
      var rm = queue.shift(), added = 0, cells = rng.shuffle(rm.cells.slice());
      for (var ci = 0; ci < cells.length && rooms.length < nRooms; ci++) {
        var dirs = rng.shuffle(DIRS.slice());
        for (var di = 0; di < 4 && rooms.length < nRooms; di++) {
          var c = cells[ci], d = dirs[di], nx = c[0] + d[0], ny = c[1] + d[1];
          if (nx < 1 || ny < 1 || nx >= GW - 1 || ny >= GH - 1 || owner[ny * GW + nx] >= 0) continue;
          if (rng.chance(.5)) continue;
          // spróbuj większego kształtu (nie przy starcie)
          var shapeKey = rm.id === 0 ? '1x1' : rng.wpick([['1x1', 10], ['2x1', 1.3], ['1x2', 1.1], ['2x2', .8]]), placed = null;
          var tries = shapeKey === '1x1' ? [['1x1']] : [[shapeKey], ['1x1']];
          for (var ti = 0; ti < tries.length && !placed; ti++) {
            var sh = SHAPES[tries[ti][0]], opts = [];
            for (var oy = 0; oy < sh[1]; oy++) for (var ox = 0; ox < sh[0]; ox++) opts.push([nx - ox, ny - oy]);
            rng.shuffle(opts);
            for (var oi = 0; oi < opts.length && !placed; oi++) { var gx = opts[oi][0], gy = opts[oi][1]; if (shapeFits(owner, gx, gy, sh[0], sh[1], rm.id)) placed = addRoom(gx, gy, sh[0], sh[1]); }
          }
          if (placed) { queue.push(placed); adds.push(0); added++; }
        }
      }
      adds[rm.id] = added;
    }
    if (rooms.length < nRooms) continue;
    // ślepe zaułki: pokoje 1x1 z jednym sąsiadem, nie start
    var dead = rooms.filter(function (rm) { return rm.id && rm.cw === 1 && rm.ch === 1 && neighRooms(owner, rm).length === 1; });
    if (dead.length < wantDeadEnds) continue;
    return { owner: owner, rooms: rooms, dead: dead };
  }
  return null;
}
function shapeFits(owner, gx, gy, cw, ch, parent) {
  if (gx < 1 || gy < 1 || gx + cw > GW - 1 || gy + ch > GH - 1) return false;
  var touch = 0, other = false;
  for (var y = 0; y < ch; y++) for (var x = 0; x < cw; x++) { if (owner[(gy + y) * GW + gx + x] >= 0) return false; }
  for (y = 0; y < ch; y++) for (x = 0; x < cw; x++) DIRS.forEach(function (d) { var ax = gx + x + d[0], ay = gy + y + d[1]; if (ax >= gx && ax < gx + cw && ay >= gy && ay < gy + ch) return; if (ax < 0 || ay < 0 || ax >= GW || ay >= GH) return; var o = owner[ay * GW + ax]; if (o < 0) return; if (o === parent) touch++; else other = true; });
  return touch === 1 && !other;
}
function neighRooms(owner, rm) { var s = {}; rm.cells.forEach(function (c) { DIRS.forEach(function (d) { var ax = c[0] + d[0], ay = c[1] + d[1]; if (ax < 0 || ay < 0 || ax >= GW || ay >= GH) return; var o = owner[ay * GW + ax]; if (o >= 0 && o !== rm.id) s[o] = 1; }); }); return Object.keys(s).map(Number); }
function roomDist(L) { var d = new Array(L.rooms.length).fill(-1), q = [0]; d[0] = 0; while (q.length) { var a = q.shift(); neighRooms(L.owner, L.rooms[a]).forEach(function (b) { if (d[b] < 0) { d[b] = d[a] + 1; q.push(b); } }); } return d; }
// ---------- piętro ----------
function genFloor(fi) {
  var def = FLOORS[fi], seed = (seedNum(R.seed) + fi * 1013 + 77) >>> 0, rng = mkRng(seed);
  var n = Math.min(15, 7 + Math.floor((fi + 1) * 1.1) + rng.int(0, 1)), arcade = fi >= 1 && !def.last && rng.chance(.45);
  var want = 2 + (def.last ? 0 : 1) + (arcade ? 1 : 0);
  var L = genLayout(rng, n, want); if (!L) L = genLayout(mkRng(seed + 1), n, 2);
  var F = { i: fi, def: def, seed: seed, owner: L.owner, rooms: [], cur: 0, curse: null };
  var dist = roomDist(L);
  L.rooms.forEach(function (rm) { F.rooms.push(mkRoom(F, rm, rm.id === 0 ? 'start' : 'normal')); });
  var dead = L.dead.slice().sort(function (a, b) { return dist[b.id] - dist[a.id]; });
  var boss = dead.shift(); F.rooms[boss.id].type = 'boss'; F.boss = boss.id;
  var rest = rng.shuffle(dead.slice());
  if (rest.length) { F.rooms[rest.shift().id].type = 'treasure'; }
  if (!def.last && rest.length) { F.rooms[rest.shift().id].type = 'shop'; }
  if (arcade && rest.length) { F.rooms[rest.shift().id].type = 'arcade'; }
  // planetarium (jak w Isaacu): od 2. piętra, rzadko – częściej gdy pominiesz skarbce
  if (fi >= 1 && !def.last && rest.length && rng() < Math.min(.6, .2 + (R.skipTre || 0) * .15)) { F.rooms[rest.shift().id].type = 'planet'; }
  // skrytka: pusta komórka z największą liczbą sąsiadów (nie przy bossie)
  var best = null, bestN = 0;
  for (var gy = 1; gy < GH - 1; gy++) for (var gx = 1; gx < GW - 1; gx++) {
    if (L.owner[gy * GW + gx] >= 0) continue; var nb = {}, bad = false;
    DIRS.forEach(function (d) { var o = L.owner[(gy + d[1]) * GW + gx + d[0]]; if (o >= 0) { nb[o] = 1; if (F.rooms[o].type === 'boss') bad = true; } });
    var cnt = Object.keys(nb).length; if (bad || !cnt) continue; var sc = cnt + rng() * .5; if (sc > bestN) { bestN = sc; best = [gx, gy]; }
  }
  if (best) { var sid = F.rooms.length; L.owner[best[1] * GW + best[0]] = sid; F.rooms.push(mkRoom(F, { id: sid, gx: best[0], gy: best[1], cw: 1, ch: 1, cells: [best] }, 'secret')); F.secret = sid; }
  F.owner = L.owner;
  F.rooms.forEach(function (rm) { rm.theme = roomTheme(F, rm); });
  F.rooms.forEach(function (rm) { makeDoors(F, rm); });
  F.rooms.forEach(function (rm) { var r2 = mkRng(rm.seed); layoutRoom(F, rm, r2); fillRoom(F, rm, r2); });
  // klątwy
  if (def.dark) F.curse = 'dark'; else if (fi >= 2 && rng.chance(.12)) F.curse = rng.pick(['dark', 'lost']);
  return F;
}
function roomTheme(F, rm) {
  if (rm.type === 'start' && F.i === 0) return 'lazienka';
  if (rm.type === 'arcade') return 'kasyno'; if (rm.type === 'devil') return 'diabel'; if (rm.type === 'angel') return 'aniol'; if (rm.type === 'planet') return 'planetarium';
  return F.def.theme;
}
function mkRoom(F, L, type) {
  var cw = L.cw, ch = L.ch;
  return { id: L.id, type: type, gx: L.gx, gy: L.gy, cw: cw, ch: ch, cells: L.cells, w: cw * RW, h: ch * RH, cols: cw * CW, rows: ch * CH, seed: (F.seed * 31 + L.id * 7919 + 13) >>> 0,
    doors: [], obs: null, spawn: [], peds: [], picks: [], npcs: [], decals: [], cleared: type !== 'normal' && type !== 'boss', visited: false, seen: false, trap: null };
}
function makeDoors(F, rm) {
  rm.doors = [];
  rm.cells.forEach(function (c) {
    DIRS.forEach(function (d) {
      var ax = c[0] + d[0], ay = c[1] + d[1]; if (ax < 0 || ay < 0 || ax >= GW || ay >= GH) return; var o = F.owner[ay * GW + ax]; if (o < 0 || o === rm.id) return;
      var other = F.rooms[o], lx = c[0] - rm.gx, ly = c[1] - rm.gy, side = d[2], dr = { side: side, to: o, lx: lx, ly: ly };
      doorGeom(rm, dr);
      var spec = rm.type !== 'normal' && rm.type !== 'start' ? rm.type : other.type !== 'normal' && other.type !== 'start' ? other.type : 'normal';
      dr.type = spec === 'treasure' || spec === 'shop' || spec === 'boss' || spec === 'secret' || spec === 'arcade' || spec === 'planet' ? spec : 'normal';
      if (other.type === 'secret') { dr.hidden = true; dr.type = 'secret'; dr.cracked = ((rm.seed >> 3) + o) % 3 !== 0; }
      if (rm.type === 'secret') { dr.type = 'secret'; }
      if (F.i >= 1 && (other.type === 'treasure' || other.type === 'shop')) dr.locked = true;
      rm.doors.push(dr);
    });
  });
}
function doorGeom(rm, dr) {
  var lx = dr.lx, ly = dr.ly;
  if (dr.side === 'top') { dr.x = lx * RW + RW / 2; dr.y = 0; dr.rot = 0; dr.tc = lx * CW + 6; dr.tr = 0; }
  else if (dr.side === 'bottom') { dr.x = lx * RW + RW / 2; dr.y = rm.h; dr.rot = PI; dr.tc = lx * CW + 6; dr.tr = rm.rows - 1; }
  else if (dr.side === 'left') { dr.x = 0; dr.y = ly * RH + RH / 2; dr.rot = -PI / 2; dr.tc = 0; dr.tr = ly * CH + 3; }
  else { dr.x = rm.w; dr.y = ly * RH + RH / 2; dr.rot = PI / 2; dr.tc = rm.cols - 1; dr.tr = ly * CH + 3; }
}
// ---------- przeszkody ----------
var OBSKIND = {
  szkola: [['rock', 6], ['block', 1], ['pot', 1.2], ['poop', 1], ['spikes', .5], ['tnt', .2]],
  rynek: [['rock', 6], ['block', 1], ['poop', 2.2], ['pot', 1], ['fire', .7], ['tnt', .5]],
  internat: [['rock', 6], ['block', 1.5], ['pot', 1], ['spikes', .8], ['poop', .4]],
  piwnica: [['rock', 6], ['block', 1], ['fire', 1], ['tnt', .8], ['spikes', 1], ['poop', .6]],
  olimp: [['rock', 6], ['block', 2], ['fire', .7], ['spikes', .5]]
};
var SOLID = { rock: 1, block: 1, poop: 1, pot: 1, fire: 1, tnt: 1, pit: 1 };
var OBSHP = { poop: 4, pot: 2, fire: 4, tnt: 3 };
function isSolidTile(o, flying) { return o && o.hp !== 0 && SOLID[o.k] && !(flying && o.k === 'pit'); }
function obsAt(rm, c, r) { if (c < 0 || r < 0 || c >= rm.cols || r >= rm.rows) return null; return rm.obs[r * rm.cols + c]; }
function putObs(rm, c, r, k, rng) {
  if (c < 0 || r < 0 || c >= rm.cols || r >= rm.rows) return; var o = { k: k, x: c * TS + TS / 2, y: r * TS + TS / 2, c: c, r: r, seed: rng.int(1, 1e9) };
  if (OBSHP[k]) o.hp = o.max = OBSHP[k]; rm.obs[r * rm.cols + c] = o;
}
var TPL = [
  ['empty', 2.2, function () { }],
  ['corners', 1.4, function (P) { P.s4(1, 1); P.s4(2, 1); P.s4(1, 2); }],
  ['cross', 1, function (P) { P.at(6, 3); P.at(5, 3); P.at(7, 3); P.at(6, 2); P.at(6, 4); }],
  ['pillars', 1.4, function (P) { P.s4(3, 2); }],
  ['pillars2', 1, function (P) { P.s4(2, 1); P.s4(4, 2); }],
  ['walls', 1, function (P) { P.s4(4, 1); P.s4(4, 2); }],
  ['bars', 1, function (P) { for (var c = 2; c <= 4; c++) P.s2h(c, 3); }],
  ['ring', .8, function (P) { for (var c = 5; c <= 7; c++) { P.at(c, 2); P.at(c, 4); } P.at(5, 3); P.at(7, 3); }],
  ['scatter', 2, function (P, r) { var n = r.int(2, 4); for (var i = 0; i < n; i++) P.s4(r.int(1, 5), r.int(1, 2)); }],
  ['diag', .8, function (P) { P.s4(2, 1); P.s4(3, 2); P.s4(4, 2); }],
  ['pitmid', .6, function (P) { for (var c = 4; c <= 8; c++) for (var rr2 = 2; rr2 <= 4; rr2++) P.at(c, rr2, 'pit'); }],
  ['pitside', .5, function (P) { for (var rr2 = 1; rr2 <= 5; rr2++) { P.s2h(2, rr2, 'pit'); } }],
  ['poops', .9, function (P, r) { var n = r.int(2, 3); for (var i = 0; i < n; i++) P.s4(r.int(1, 5), r.int(1, 2), 'poop'); }],
  ['fires', .5, function (P) { P.s4(1, 1, 'fire'); }],
  ['spikes', .6, function (P) { for (var c = 5; c <= 7; c++) for (var rr2 = 2; rr2 <= 4; rr2++) P.at(c, rr2, 'spikes'); }],
  ['pots', .7, function (P) { P.s4(1, 0, 'pot'); P.s4(4, 0, 'pot'); }],
  ['tnt', .4, function (P) { P.at(6, 3, 'tnt'); P.s4(4, 2); }]
];
function layoutRoom(F, rm, rng) {
  var n = rm.cols * rm.rows;
  for (var att = 0; att < 12; att++) {
    rm.obs = new Array(n).fill(null);
    if (rm.type === 'normal' || (rm.type === 'boss' && rng.chance(.35))) {
      var kinds = OBSKIND[F.def.ch] || OBSKIND.szkola;
      for (var by = 0; by < rm.ch; by++) for (var bx = 0; bx < rm.cw; bx++) {
        var tpl = rm.type === 'boss' ? TPL[rng.pick([1, 3])] : rng.wpick(TPL.map(function (t) { return [t, t[1]]; }));
        if (F.i === 0 && rm.id < 3 && /pit|tnt|spikes|fire/.test(tpl[0])) tpl = TPL[3];
        var base = rng.wpick(kinds), c0 = bx * CW, r0 = by * CH;
        var P = { at: function (c, r, k) { var kk = k || (rng.chance(.82) ? base : rng.wpick(kinds)); if (kk === 'rock' && rng.chance(.05)) kk = 'rockT'; putObs(rm, c0 + c, r0 + r, kk === 'rockT' ? 'rock' : kk, rng); if (kk === 'rockT') rm.obs[(r0 + r) * rm.cols + c0 + c].tint = 1; },
          s2h: function (c, r, k) { P.at(c, r, k); P.at(12 - c, r, k); }, s4: function (c, r, k) { P.at(c, r, k); P.at(12 - c, r, k); P.at(c, 6 - r, k); P.at(12 - c, 6 - r, k); } };
        tpl[2](P, rng);
      }
    }
    // drzwi i pola przed nimi muszą być wolne
    rm.doors.forEach(function (d) { clearAround(rm, d.tc, d.tr, d); });
    if (rm.type !== 'normal' && rm.type !== 'boss') { rm.obs = new Array(n).fill(null); break; }
    if (doorsConnected(rm)) break;
  }
  if (!doorsConnected(rm)) rm.obs = new Array(n).fill(null);
}
function clearAround(rm, c, r, d) {
  var pts = [[c, r]]; if (d.side === 'top') pts.push([c, r + 1]); if (d.side === 'bottom') pts.push([c, r - 1]); if (d.side === 'left') pts.push([c + 1, r]); if (d.side === 'right') pts.push([c - 1, r]);
  pts.forEach(function (p) { if (p[0] >= 0 && p[1] >= 0 && p[0] < rm.cols && p[1] < rm.rows) rm.obs[p[1] * rm.cols + p[0]] = null; });
}
function floodFrom(rm, c, r) {
  var seen = new Uint8Array(rm.cols * rm.rows), q = [[c, r]]; seen[r * rm.cols + c] = 1;
  while (q.length) { var p = q.pop(); DIRS.forEach(function (d) { var x = p[0] + d[0], y = p[1] + d[1]; if (x < 0 || y < 0 || x >= rm.cols || y >= rm.rows) return; var i = y * rm.cols + x; if (seen[i]) return; var o = rm.obs[i]; if (o && SOLID[o.k]) return; seen[i] = 1; q.push([x, y]); }); }
  return seen;
}
function doorsConnected(rm) {
  if (!rm.doors.length) return true; var d0 = rm.doors[0], s = floodFrom(rm, d0.tc, d0.tr);
  if (!rm.doors.every(function (d) { return s[d.tr * rm.cols + d.tc]; })) return false;
  var c = (rm.cols >> 1), r = (rm.rows >> 1); var free = 0; for (var i = 0; i < s.length; i++) if (s[i]) free++;
  return free > rm.cols * rm.rows * .45;
}
function freeTiles(rm, reach) { var s = reach || (rm.doors.length ? floodFrom(rm, rm.doors[0].tc, rm.doors[0].tr) : null), out = []; for (var r = 0; r < rm.rows; r++) for (var c = 0; c < rm.cols; c++) { var i = r * rm.cols + c; if (rm.obs[i]) continue; if (s && !s[i]) continue; out.push([c, r]); } return out; }
// ---------- zawartość pokoju ----------
function fillRoom(F, rm, rng) {
  var cx = rm.w / 2, cy = rm.h / 2;
  if (rm.type === 'normal') {
    var cap = rm.cw * rm.ch, cnt = Math.round((rng.int(3, 5) + Math.min(1.5, F.i * .2)) * (cap === 1 ? 1 : cap === 2 ? 1.6 : 2.1));
    var pool = MOBPOOL[F.def.ch].filter(function (m) { return !m[2] || F.i % 2 === 1; }), types = [], nt = rng.wpick([[1, 3], [2, 4], [3, 2]]);
    for (var i = 0; i < nt; i++) types.push(rng.wpick(pool.map(function (m) { return [m[0], m[1]]; })));
    // stado gołębi / karaluchów w większej liczbie
    var tiles = rng.shuffle(freeTiles(rm).filter(function (t) { return rm.doors.every(function (d) { return Math.abs(d.tc - t[0]) + Math.abs(d.tr - t[1]) > 3; }); }));
    for (i = 0; i < cnt && tiles.length; i++) {
      var t = types[i % types.length], tl = tiles.pop(), champ = null;
      if (rng.chance(.04 + F.i * .012)) champ = rng.pick(Object.keys(CHAMPS));
      rm.spawn.push({ t: t, x: tl[0] * TS + TS / 2, y: tl[1] * TS + TS / 2, champ: champ });
      if ((t === 'golab' || t === 'karaluch') && rng.chance(.3) && tiles.length) { tl = tiles.pop(); rm.spawn.push({ t: t, x: tl[0] * TS + TS / 2, y: tl[1] * TS + TS / 2 }); }
    }
    if (!rm.spawn.length) rm.cleared = true;
  } else if (rm.type === 'start') {
    if (F.i === 0) rm.decal = 'tut';
  } else if (rm.type === 'boss') {
    rm.boss = rng.pick(F.def.bosses); rm.decal = 'boss';
  } else if (rm.type === 'treasure') {
    rm.peds.push({ x: cx, y: cy, item: poolPick('tre', rng), pool: 'tre' });
    if (F.i >= 3 && rng.chance(.2)) { rm.peds[0].x = cx - 60; rm.peds.push({ x: cx + 60, y: cy, item: poolPick('tre', rng), pool: 'tre', choice: 1 }); rm.peds[0].choice = 1; }
  } else if (rm.type === 'planet') {
    rm.peds.push({ x: cx, y: cy, item: poolPick('planet', rng), pool: 'planet' }); rm.decal = 'planet';
  } else if (rm.type === 'shop') {
    var slots = [cx - 160, cx - 80, cx, cx + 80, cx + 160], nItems = rng.chance(.35) ? 2 : 1, picks = rng.shuffle([['heart', 'full', 3], ['heart', 'soul', 5], ['key', 1, 5], ['bomb', 1, 5], ['card', null, 5], ['pill', null, 4], ['battery', 1, 6], ['bomb', 2, 7], ['heart', 'full', 3]]);
    (nItems === 1 ? [2] : [1, 3]).forEach(function (si) { rm.peds.push({ x: slots[si], y: cy + 20, item: poolPick('shop', rng), pool: 'shop', price: 15 }); });
    var used = rm.peds.map(function (p) { return p.x; });
    slots.forEach(function (x) { if (used.indexOf(x) >= 0) return; var p = picks.pop(); rm.peds.push({ x: x, y: cy + 20, pick: { type: p[0], val: p[1] }, price: p[2] }); });
    rm.npcs.push({ k: 'heniek', x: cx, y: 46, r: 14 });
  } else if (rm.type === 'secret') {
    var roll = rng();
    if (roll < .3) rm.peds.push({ x: cx, y: cy, item: poolPick(rng.chance(.5) ? 'secret' : 'tre', rng), pool: 'secret' });
    else { var nn = rng.int(3, 5); for (var k = 0; k < nn; k++) rm.picks.push(mkPick(rng.wpick([['coin', 4], ['bomb', 2], ['key', 2], ['heart', 2], ['chest', 1], ['card', 1]]), null, cx + rng.range(-80, 80), cy + rng.range(-40, 40), rng)); }
  } else if (rm.type === 'arcade') {
    rm.npcs.push({ k: 'slot', x: cx - 140, y: cy - 30, r: 16 }, { k: 'fortune', x: cx + 140, y: cy - 30, r: 16 }, { k: 'babcia', x: cx, y: 60, r: 13 });
    if (rng.chance(.5)) rm.npcs.push({ k: 'slot', x: cx - 140, y: cy + 60, r: 16 });
  }
}
// znajdźka (dane)
var PICKID = 1;
function mkPick(type, val, x, y, rng) {
  var r = rng || rnd01; var rn = typeof r === "function" ? r : rnd01;
  if (val == null) {
    if (type === 'coin') val = rn() < .07 ? 5 : rn() < .02 ? 10 : 1;
    else if (type === 'heart') { var q = rn(); val = q < .55 ? 'full' : q < .82 ? 'half' : q < .96 ? 'soul' : 'black'; }
    else if (type === 'key') val = rn() < .03 ? 'gold' : 1;
    else if (type === 'bomb') val = rn() < .1 ? 2 : 1;
    else if (type === 'card') { var ks = Object.keys(CARDS); val = ks[Math.floor(rn() * ks.length)]; }
    else if (type === 'pill') val = Math.floor(rn() * 8);
    else if (type === 'chest') val = rn() < .2 ? 'gold' : 'brown';
    else if (type === 'trinket') { var tk = Object.keys(TRINKETS).filter(function (k) { return !R || !R.seenT[k]; }); val = tk.length ? tk[Math.floor(rn() * tk.length)] : 'kapsel'; if (R) R.seenT[val] = 1; }
    else if (type === 'battery') val = 1;
  }
  return { id: PICKID++, type: type, val: val, x: x, y: y, vx: 0, vy: 0, z: 0, vz: 0 };
}
// pokój diabła / anioła (poza siatką)
function mkDealRoom(F, kind) {
  var id = F.rooms.length, rm = mkRoom(F, { id: id, gx: -9, gy: -9, cw: 1, ch: 1, cells: [] }, kind); rm.theme = kind === 'devil' ? 'diabel' : 'aniol';
  rm.obs = new Array(rm.cols * rm.rows).fill(null); var rng = mkRng(rm.seed), cx = rm.w / 2, cy = rm.h / 2 + 20;
  rm.doors = [{ side: 'bottom', to: F.boss, lx: 0, ly: 0, type: kind, deal: 1 }]; doorGeom(rm, rm.doors[0]);
  if (kind === 'devil') {
    var n = rng.wpick([[1, 1], [2, 3], [3, 3]]), xs = n === 1 ? [cx] : n === 2 ? [cx - 70, cx + 70] : [cx - 110, cx, cx + 110];
    xs.forEach(function (x) { var it = poolPick('devil', rng); rm.peds.push({ x: x, y: cy, item: it, pool: 'devil', deal: ITEMS[it].q >= 3 ? 2 : 1 }); });
    rm.npcs.push({ k: 'statueScary', x: cx, y: 44, r: 18 });
  } else {
    var it2 = poolPick('angel', rng); rm.peds.push({ x: cx, y: cy, item: it2, pool: 'angel' });
    if (rng.chance(.3)) { rm.peds[0].x = cx - 70; rm.peds[0].choice = 1; rm.peds.push({ x: cx + 70, y: cy, item: poolPick('angel', rng), pool: 'angel', choice: 1 }); }
    rm.npcs.push({ k: 'statueGreek', x: cx, y: 44, r: 18 });
  }
  F.rooms.push(rm); return rm;
}
// ---------- naklejki na podłodze ----------
var DECALS = {
  tut: function (x, r, T, rm) {
    x.save(); x.globalAlpha = .55; x.fillStyle = '#5a6a72'; x.font = 'bold 15px "Trebuchet MS",sans-serif'; x.textAlign = 'center';
    var cx = rm.w / 2;
    x.fillText('WASD — ruch', cx - 150, 92); x.fillText('STRZAŁKI — płacz', cx + 150, 92);
    x.fillText('E — petarda   SPACJA — przedmiot   Q — karta', cx, 196);
    x.font = 'italic 13px Georgia,serif'; x.fillText('Szymon zasnął na lekcji… i obudził się w koszmarze.', cx, 236);
    x.restore();
  },
  boss: function (x, r, T, rm) { x.save(); x.globalAlpha = .18; x.strokeStyle = '#000'; x.lineWidth = 3; for (var i = 0; i < 5; i++) { x.beginPath(); x.arc(rm.w / 2 + r.range(-120, 120), rm.h / 2 + r.range(-60, 60), r.range(10, 30), 0, TAU); x.stroke(); } x.restore(); }
};

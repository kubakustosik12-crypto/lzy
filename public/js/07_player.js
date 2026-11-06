// ---- 07_player.js ----
// ===================== GRACZ: statystyki, zdrowie, przedmioty, strzelanie, aktywne, karty, puszki =====================
function newPlayer(ch) {
  var C = CHARS[ch];
  var P = { ch: ch, x: RW / 2, y: RH / 2 + 30, px: 0, py: 0, vx: 0, vy: 0, r: 11,
    cont: C.cont, red: C.red, extra: [], coins: C.coins, bombs: C.bombs, keys: C.keys,
    items: [], active: null, pocket: null, trinket: null, st: {}, fl: {}, tags: {}, trans: {},
    pillMods: {}, temp: {}, allies: 0, fireCd: 0, inv: 0, dir: 'd', walk: 0, sdx: 0, sdy: 1, cryT: 0, hurtT: 0, blinkT: 2, exT: 0, ex: '', holdItem: null,
    brimCh: 0, shieldT: 0, poseT: 0, mantle: false, bearUsed: false, dodgeT: 0, para: 0, confuse: 0, famT: 0, pen: 0, dead: false };
  if (C.soul) addExtra(P, 'soul', C.soul); if (C.black) addExtra(P, 'black', C.black);
  return P;
}
function has(id) { return R && R.P.items.indexOf(id) >= 0; }
function flag(k) { return R ? (R.P.fl[k] || 0) : 0; }
function trink(k) { return R && R.P.trinket === k; }
// ---------- statystyki (jak w oryginale: łzy z opóźnieniem, obrażenia z pierwiastkiem) ----------
function addMods(m, s) { if (!s) return; for (var k in s) { if (k === 'tearsMult' || k === 'dmgMult') m[k] *= s[k]; else m[k] = (m[k] || 0) + s[k]; } }
function calcStats() {
  var P = R.P, m = { spd: 0, tears: 0, dmg: 0, range: 0, ss: 0, luck: 0, tearsMult: 1, dmgMult: 1, dmgFlat: 0, tearsFlat: 0 };
  addMods(m, CHARS[P.ch].st); P.items.forEach(function (id) { addMods(m, ITEMS[id].st); }); addMods(m, P.pillMods); addMods(m, P.temp);
  var tk = { kapsel: { luck: 1 }, gumka: { tears: .35 }, zakladka: { range: 1.5 }, nakretka: { spd: .15 }, lisc: { dmg: .5 } }[P.trinket]; addMods(m, tk);
  if (P.trans.menel) m.dmg += 1; if (P.trans.grek) { m.dmg += .3; m.tears += .2; }
  if (flag('money')) m.dmgFlat += P.coins * .04;
  if (flag('triple')) m.tearsMult *= .55;
  if (P.poseT > 0) m.dmgMult *= 1.5;
  P.st.spd = clamp(1 + m.spd, .1, 2);
  var T = m.tears, delay = T >= 0 ? Math.max(5, 16 - 6 * Math.sqrt(1.3 * T + 1)) : 10 - 6 * T;
  P.st.tears = Math.max(.35, (30 / (delay + 1) + m.tearsFlat) * m.tearsMult);
  var D = Math.max(-.8, m.dmg), base = 3.5 * Math.sqrt(Math.max(.05, 1 + 1.2 * D));
  P.st.dmg = Math.max(.5, (base + m.dmgFlat) * m.dmgMult);
  P.st.range = Math.max(1.5, 6.5 + m.range); P.st.ss = Math.max(.6, 1 + m.ss); P.st.luck = m.luck;
  P.fl = {}; P.items.forEach(function (id) { var f = ITEMS[id].fl; if (f) for (var k in f) P.fl[k] = (P.fl[k] || 0) + f[k]; });
  if (P.trans.golab || P.trans.grek) P.fl.fly = 1;
  if (CHARS[P.ch].perk === 'homing') P.fl.homing = (P.fl.homing || 0) + 1;
  if (P.ch === 'bajtek') { P.fl.spectral = 1; P.fl.pierce = (P.fl.pierce || 0) + 1; }
}
// ---------- zdrowie ----------
function slots(P) { return P.cont / 2 + P.extra.length; }
function addExtra(P, t, halves) {
  while (halves > 0) { var last = P.extra[P.extra.length - 1]; if (last && last.v === 1) { last.v = 2; if (t === 'black') last.t = 'black'; halves--; continue; } if (slots(P) >= 12) return; P.extra.push({ t: t, v: Math.min(2, halves) }); halves -= 2; }
}
function addCont(P, halves) {
  if (CHARS[P.ch].perk === 'soulOnly') { addExtra(P, 'soul', halves); return; }
  if (halves > 0) { var room = (12 - slots(P)) * 2; halves = Math.min(halves, room); P.cont += halves; } else { P.cont = Math.max(0, P.cont + halves); P.red = Math.min(P.red, P.cont); if (P.cont === 0 && !P.extra.length) P.cont = P.red = 2; }
}
function healRed(P, halves) { if (P.cont <= 0) return 0; var b = P.red; P.red = Math.min(P.cont, P.red + halves * (flag('bow') ? 2 : 1)); return P.red - b; }
function hurtAmount() { return R.floor.i >= 5 ? 2 : 1; }
function damagePlayer(n, src) {
  var P = R.P; if (P.dead || P.inv > 0 || GOD || P.shieldT > 0 || P.poseT > 0 || ROOMT.k) return false;
  if (P.mantle) { P.mantle = false; P.inv = .9; fxRing(P.x, P.y - 16, 40, 'rgba(255,240,180,.9)'); sfx('soul'); return false; }
  if (flag('bear') && !P.bearUsed) { P.bearUsed = true; P.inv = 1; floatText(P.x, P.y - 50, 'Miś Cię osłonił!', '#ffd8a0'); sfx('pickup'); return false; }
  if (flag('dodge') && rnd01() < .1 + Math.max(0, P.st.luck) * .02) { P.inv = .5; floatText(P.x, P.y - 50, 'Unik!', '#cfe8ff'); return false; }
  var redLost = false;
  for (var i = 0; i < n; i++) {
    if (P.extra.length) { var last = P.extra[P.extra.length - 1]; last.v--; if (last.v <= 0) { P.extra.pop(); if (last.t === 'black') blackBurst(); } }
    else if (P.red > 0) { P.red--; redLost = true; }
  }
  if (redLost) R.redHit = true; if (R.room && R.room.type === 'boss') R.bossHit = true;
  P.inv = flag('iframes') ? 1.6 : 1; P.hurtT = .6; P.cryT = 0; shake(7); sfx('hurt'); R.lastHit = src || '?';
  if (flag('hurtGas')) { ENTS.forEach(function (e) { if (dist(e.x, e.y, P.x, P.y) < 95) applyStatus(e, 'poison', 4); }); fxCloud(P.x, P.y, 'rgba(160,200,60,.5)', 90); }
  if (flag('hurtRing')) for (var k = 0; k < 10; k++) { var a = k / 10 * TAU; spawnTear(P.x, P.y - 8, Math.cos(a), Math.sin(a), { dmg: P.st.dmg, kind: 'tear' }); }
  if (flag('piggy') && P.coins > 0) { var lose = Math.min(P.coins, rndi(1, 2)); P.coins -= lose; for (var c = 0; c < lose; c++) dropPick('coin', 1, P.x, P.y, true); }
  if (P.red <= 0 && !P.extra.length) playerDie();
  return true;
}
function blackBurst() { ENTS.forEach(function (e) { hitEnemy(e, 40, { kind: 'dark' }); }); fxFlash('rgba(40,0,60,.5)'); sfx('boom'); }
// ---------- przedmioty ----------
function giveItem(id, quiet) {
  var P = R.P, it = ITEMS[id]; if (!it) return;
  PROF.coll[id] = 1; saveProf();
  if (it.act) { P.active = { id: id, ch: it.act }; }
  else {
    P.items.push(id);
    if (it.hp) { if (it.hp.cont) addCont(P, it.hp.cont); if (it.hp.heal) healRed(P, it.hp.heal); if (it.hp.soul) addExtra(P, 'soul', it.hp.soul); if (it.hp.black) addExtra(P, 'black', it.hp.black); }
    if (it.pick) { P.coins = Math.min(99, P.coins + (it.pick.coins || 0)); P.bombs = Math.min(99, P.bombs + (it.pick.bombs || 0)); P.keys = Math.min(99, P.keys + (it.pick.keys || 0)); }
    if (it.fl && it.fl.pawn) P.coins = 0;
    if (it.fl && it.fl.map) revealMap(true); if (it.fl && (it.fl.compass || it.fl.secretMap)) revealMap(false);
  }
  (it.tags || []).forEach(function (t) { P.tags[t] = (P.tags[t] || 0) + 1; if (P.tags[t] >= 3 && !P.trans[t]) { P.trans[t] = true; transform(t); } });
  calcStats();
  if (!quiet) { banner(it.n, it.d, it.q >= 3 ? '#ffe08a' : '#fff'); sfx('item'); P.holdItem = { id: id, t: 1.2 }; P.exT = 1.4; P.ex = 'y'; }
}
function transform(t) {
  var P = R.P, T = TRANS[t]; later(1.5, function () { banner('Przemiana: ' + T.n, T.d, '#9fe0ff'); }, true);
  if (t === 'grek') addExtra(P, 'soul', 6); if (t === 'menel') addExtra(P, 'black', 2);
  sfx('jackpot');
}
// ---------- strzelanie ----------
var TEARID = 1;
function tearKindFor() { var P = R.P, k = CHARS[P.ch].tear; if (P.trans.menel) k = 'bottle'; if (flag('milk')) k = 'milk'; return k; }
function procChance(base) { return clamp(base + R.P.st.luck * .04, .03, 1); }
function playerShoot(dx, dy) {
  var P = R.P, st = P.st, sp = 300 * st.ss, pkind = tearKindFor();
  var dirs = [[0, 0]];
  if (flag('triple') && flag('double')) dirs = [[-.12, 0], [-.04, 0], [.04, 0], [.12, 0]];
  else if (flag('triple')) dirs = [[-.13, 0], [0, 0], [.13, 0]];
  else if (flag('double')) dirs = [[0, -6], [0, 6]];
  if (P.trans.kujon && rnd01() < .2) dirs.push([rnd(-.2, .2), 0]);
  var base = Math.atan2(dy, dx);
  if (flag('laser')) { dirs.forEach(function (d) { fireLaser(P.x + Math.cos(base) * 8, P.y - 12, base + d[0], st.dmg, 'tech'); }); sfx('laser', .6); return; }
  dirs.forEach(function (d) {
    var a = base + d[0], ox = -Math.sin(base) * d[1], oy = Math.cos(base) * d[1];
    var o = { dmg: st.dmg, kind: pkind, life: st.range * TS / sp, sp: sp };
    tearProcs(o);
    var t = spawnTear(P.x + Math.cos(a) * 8 + ox, P.y - 8 + oy, Math.cos(a), Math.sin(a), o);
    t.vx += P.vx * .3; t.vy += P.vy * .3;
  });
  sfx('shoot', .8);
}
function tearProcs(o) {
  var P = R.P, f = P.fl, ch = procChance(.18);
  o.pierce = f.pierce || (trink('pinezka') && rnd01() < .25); o.spectral = f.spectral; o.homing = f.homing; o.bounce = f.bounce; o.knock = f.knock ? 2.2 : 1; o.chain = f.chain; o.big = f.big;
  if (f.fire && rnd01() < ch) { o.burn = 1; o.kind = 'fire'; }
  if (f.ice && rnd01() < ch) { o.slow = 1; o.kind = 'ice'; }
  if (trink('zab') && rnd01() < procChance(.08)) { o.freeze = 1; o.kind = 'ice'; }
  if (f.poison && rnd01() < ch) { o.poison = 1; o.kind = 'poison'; }
  if (f.fear && rnd01() < ch) { o.fear = 1; }
  if (trink('kreda') && rnd01() < .1) o.fear = 1;
  if (f.stun && rnd01() < ch) { o.stun = 1; o.kind = 'note'; }
  if (f.random) { var e = pick(['burn', 'slow', 'poison', 'fear', 'stun', 'homing', 'pierce', 'big', 'charm']); o[e] = 1; o.kind = { burn: 'fire', slow: 'ice', poison: 'poison', stun: 'zap', charm: 'blood' }[e] || o.kind; }
  if (f.pen4) { var k = ['burn', 'slow', 'poison', 'stun'][P.pen++ % 4]; o[k] = 1; o.kind = { burn: 'fire', slow: 'ice', poison: 'poison', stun: 'zap' }[k]; }
  if (CHARS[P.ch].perk === 'credit') o.credit = 1;
  if (P.ch === 'bajtek') { o.confuse = 1; o.sp *= .75; o.life *= 1.35; }
  if (P.poseT > 0 && o.kind === 'tear') o.kind = 'gold';
}
function spawnTear(x, y, dx, dy, o) {
  var sp = o.sp || 300, dmg = o.dmg || 3.5;
  var r = clamp(5.2 * Math.sqrt(dmg / 3.5), 3.6, 14) * (o.big ? 1.45 : 1) * (o.kind === 'smoke' ? 1.6 : 1);
  var t = { id: TEARID++, x: x, y: y, px: x, py: y, vx: dx * sp, vy: dy * sp, z: o.z == null ? 12 : o.z, r: r, dmg: dmg, life: o.life || 6.5 * TS / sp, kind: o.kind || 'tear', hit: {}, enemy: !!o.enemy };
  for (var k in o) if (!(k in t) && k !== 'sp') t[k] = o[k];
  t.maxLife = t.life; TEARS.push(t); return t;
}
// laser (Łańcuch piorunów / Spojrzenie Scary'ego)
function fireLaser(x, y, a, dmg, kind, opt) {
  opt = opt || {}; var len = Math.min(opt.len || 2000, laserLen(x, y, a));
  var L = { x: x, y: y, a: a, len: len, w: opt.w || 5, t: opt.dur || .12, max: opt.dur || .12, kind: kind, dmg: dmg, tick: 0, enemy: !!opt.enemy, every: opt.every || 0 };
  LASERS.push(L); laserHit(L); return L;
}
// ---------- aktywne ----------
function useActive() {
  var P = R.P, A = P.active; if (!A) return; var it = ITEMS[A.id];
  if (A.ch < it.act) { sfx('error'); return; }
  var ok = activeEffect(A.id);
  if (ok === false) return;
  A.ch = 0; sfx('use');
  if (trink('bateria') && rnd01() < .25) A.ch = 1;
}
function aliveEnemies() { return ENTS.filter(function (e) { return !e.dead && !e.ally && !e.inert; }); }
function activeEffect(id) {
  var P = R.P, en = aliveEnemies(), a = Math.atan2(P.sdy, P.sdx);
  switch (id) {
    case 'szloch': for (var i = 0; i < 10; i++) { var aa = i / 10 * TAU; spawnTear(P.x, P.y - 8, Math.cos(aa), Math.sin(aa), { dmg: 10 + P.st.dmg, kind: 'tear', big: 1, life: 1.4 }); } P.exT = 1; P.ex = 's'; P.cryT = 1; break;
    case 'wiadro': for (var j = -3; j <= 3; j++) spawnTear(P.x, P.y - 8, Math.cos(a + j * .14), Math.sin(a + j * .14), { dmg: 6 + P.st.dmg * 1.5, kind: 'milk', slow: 1, sp: 330, life: .7 }); for (var k = 1; k <= 3; k++) addCreep(P.x + Math.cos(a) * k * 34, P.y + Math.sin(a) * k * 34, 22, 'milk', 4, false); sfx('vomit', .6); break;
    case 'hipnoza': en.forEach(function (e) { applyStatus(e, 'stun', e.boss ? 1.5 : 4); }); floatText(P.x, P.y - 60, '6… 7…', '#ffd8a0'); fxRing(P.x, P.y - 12, 220, 'rgba(255,220,160,.6)'); break;
    case 'zubr': P.temp.dmgFlat = (P.temp.dmgFlat || 0) + 2; calcStats(); sfx('burp'); P.exT = 3; P.ex = 'd'; floatText(P.x, P.y - 60, '*psst*', '#ffe08a'); break;
    case 'chill': GAME.slow = 6; fxFlash('rgba(120,160,255,.25)'); floatText(P.x, P.y - 60, 'Chill…', '#bcd8ff'); break;
    case 'helo': vox('helo', { vol: 1 }); en.forEach(function (e) { applyStatus(e, 'stun', e.boss ? 1 : 2.5); }); fxRing(P.x, P.y - 12, 260, 'rgba(255,255,255,.8)'); shake(6); floatText(P.x, P.y - 60, 'HELO GUYS!', '#fff'); break;
    case 'sigeon': vox('sigeon', { vol: .9 }); for (var s = 0; s < 6; s++) spawnAlly(P.x + rnd(-14, 14), P.y - 20 + rnd(-8, 8)); break;
    case 'simi': vox('simi', { vol: .9 }); en.forEach(function (e) { applyStatus(e, 'sleep', e.boss ? 2 : 5); }); fxFlash('rgba(80,60,140,.35)'); break;
    case 'scary': vox('scaryV', { vol: 1 }); en.forEach(function (e) { applyStatus(e, 'fear', e.boss ? 2 : 5); }); fxFlash('rgba(0,0,0,.6)'); shake(8); P.exT = 1.2; P.ex = 'k'; break;
    case 'numbero': vox('n1', { vol: 1 }); en.forEach(function (e) { hitEnemy(e, 100, { kind: 'gold' }); }); fxFlash('rgba(255,215,90,.6)'); shake(12); break;
    case 'kostka': var any = false; R.room.peds.forEach(function (p) { if (p.item) { p.item = poolPick(p.pool || 'tre', mkRng((rnd01() * 1e9) | 0)); any = true; fxPoof(p.x, p.y - 26, '#fff'); } }); if (!any) return false; sfx('slot'); break;
    case 'poza': P.poseT = 6; calcStats(); P.exT = 6; P.ex = 'm'; sfx('soul'); break;
    case 'telefon': en.forEach(function (e) { hitEnemy(e, 47, { kind: 'zap' }); }); floatText(P.x, P.y - 60, '47 nieodebranych', '#ff9a8a'); sfx('zap'); shake(5); break;
    case 'paw': P.exT = 1.5; P.ex = 'v'; sfx('vomit'); for (var v = 1; v <= 6; v++) addCreep(P.x + Math.cos(a) * v * 26, P.y + Math.sin(a) * v * 26, 20, 'vomit', 7, false); for (var v2 = 0; v2 < 6; v2++) spawnTear(P.x, P.y - 6, Math.cos(a + rnd(-.25, .25)), Math.sin(a + rnd(-.25, .25)), { dmg: P.st.dmg * 1.2, kind: 'vomit', poison: 1, sp: rnd(220, 330), life: .6 }); break;
    case 'tarcza': P.shieldT = 7; sfx('soul'); break;
    case 'skok': var cand = R.floor.rooms.filter(function (r) { return r !== R.room && r.gx >= 0 && r.type !== 'secret' && r.type !== 'boss'; }); if (!cand.length) return false; teleportTo(pick(cand)); break;
    case 'deszcz': var tg = en.length ? en : [{ x: P.x, y: P.y }]; for (var d = 0; d < 8; d++) (function (d) { var e = tg[d % tg.length]; later(d * .18, function () { var x = (e.x || P.x) + rnd(-25, 25), y = (e.y || P.y) + rnd(-25, 25); fallObj(x, y, 'can', function () { explodeAt(x, y, 45, 25, { noPlayer: 1, small: 1 }); }); }); })(d); break;
    case 'meteor': var tgt = en.sort(function (p, q) { return q.hp - p.hp; })[0], mx = tgt ? tgt.x : R.room.w / 2, my = tgt ? tgt.y : R.room.h / 2; fallObj(mx, my, 'meteor', function () { explodeAt(mx, my, 95, 150, { noPlayer: 1, big: 1 }); }, 1.2); break;
    case 'oklad': if (P.cont > 0 && P.red < P.cont) healRed(P, 2); else addExtra(P, 'soul', 2); sfx('heart'); break;
    case 'gasnica': en.forEach(function (e) { var d2 = dist(e.x, e.y, P.x, P.y), ang = Math.abs(angDiff(a, angTo(P.x, P.y, e.x, e.y))); if (d2 < 170 && ang < .7) { applyStatus(e, 'freeze', e.boss ? 1 : 3); } }); for (var f = 0; f < 18; f++) fxPart(P.x + Math.cos(a) * 20, P.y - 10 + Math.sin(a) * 20, Math.cos(a + rnd(-.6, .6)) * rnd(80, 220), Math.sin(a + rnd(-.6, .6)) * rnd(80, 220), 'rgba(240,250,255,.85)', rnd(5, 10), .7); sfx('splat'); break;
    case 'zdrapka': var q = rnd01(); if (q < .45) floatText(P.x, P.y - 60, 'Nic…', '#aaa'); else if (q < .72) { for (var c = 0; c < rndi(1, 3); c++) dropPick('coin', 1, P.x, P.y, true); } else if (q < .84) dropPick('heart', 'full', P.x, P.y, true); else if (q < .93) dropPick(rnd01() < .5 ? 'key' : 'bomb', 1, P.x, P.y, true); else if (q < .985) { for (var c2 = 0; c2 < 4; c2++) dropPick('coin', 1, P.x, P.y, true); dropPick('coin', 5, P.x, P.y, true); sfx('jackpot'); } else { spawnPed(P.x, P.y - 50, poolPick('tre', mkRng((rnd01() * 1e9) | 0)), 'tre'); sfx('jackpot'); } break;
    case 'smrod': ENTS.forEach(function (e) { if (dist(e.x, e.y, P.x, P.y) < 100) { applyStatus(e, 'poison', 5); var ang2 = angTo(P.x, P.y, e.x, e.y); e.vx += Math.cos(ang2) * 260; e.vy += Math.sin(ang2) * 260; } }); fxCloud(P.x, P.y, 'rgba(150,190,60,.55)', 100); sfx('burp'); break;
  }
  return true;
}
// ---------- karty i puszki ----------
function usePocket() {
  var P = R.P, pk = P.pocket; if (!pk) return; P.pocket = null;
  if (pk.type === 'card') useCard(pk.val); else usePill(pk.val);
}
function useCard(id) {
  var P = R.P, F = R.floor, C = CARDS[id]; banner(C.n, C.d, '#ffe9b0'); sfx('card');
  var find = function (t) { return F.rooms.filter(function (r) { return r.type === t; })[0]; };
  switch (id) {
    case 'wagary': teleportTo(F.rooms[0]); break;
    case 'dyrektor': teleportTo(F.rooms[F.boss]); break;
    case 'sklep': var sh = find('shop'); if (sh) teleportTo(sh); break;
    case 'skarb': var tr = find('treasure'); if (tr) teleportTo(tr); break;
    case 'ksiezyc': if (F.secret != null) teleportTo(F.rooms[F.secret]); break;
    case 'joker': var deal = F.rooms.filter(function (r) { return r.type === 'devil' || r.type === 'angel'; })[0] || mkDealRoom(F, R.devilTaken || rnd01() < .6 ? 'devil' : 'angel'); teleportTo(deal); break;
    case 'plan': revealMap(true); break;
    case 'sila': P.temp.dmgMult = (P.temp.dmgMult || 1) * 1.5; calcStats(); healRed(P, 2); break;
    case 'sprawiedliwosc': dropPick('coin', 1, P.x, P.y, true); dropPick('key', 1, P.x, P.y, true); dropPick('bomb', 1, P.x, P.y, true); dropPick('heart', 'full', P.x, P.y, true); break;
    case 'wieza': for (var i = 0; i < 6; i++) later(i * .16, function () { var x = rnd(40, R.room.w - 40), y = rnd(40, R.room.h - 40); if (dist(x, y, P.x, P.y) < 70) x = R.room.w - x; placeBomb(x, y, .3, true); }); break;
    case 'slonce': healRed(P, 99); revealMap(true); aliveEnemies().forEach(function (e) { hitEnemy(e, 100, { kind: 'gold' }); }); fxFlash('rgba(255,240,180,.6)'); break;
    case 'kochankowie': dropPick('heart', 'full', P.x, P.y, true); dropPick('heart', 'full', P.x, P.y, true); break;
    case 'smierc': aliveEnemies().forEach(function (e) { hitEnemy(e, 40, { kind: 'dark' }); }); fxFlash('rgba(0,0,0,.5)'); break;
    case 'kier2': healRed(P, P.red); break;
    case 'trefl2': P.bombs = Math.min(99, Math.max(1, P.bombs * 2)); break;
    case 'pik2': P.keys = Math.min(99, Math.max(1, P.keys * 2)); break;
    case 'karo2': P.coins = Math.min(99, Math.max(1, P.coins * 2)); calcStats(); break;
  }
}
function pillName(col) { var eff = R.pillMap[col]; return (R.pillKnown[col] || flag('phd')) ? PILLS[eff].n : 'Puszka ???'; }
function usePill(col) {
  var P = R.P, eff = R.pillMap[col], D = PILLS[eff]; R.pillKnown[col] = 1; sfx('pill');
  if (flag('phd') && !D.good && eff !== 'paw' && eff !== 'bak') { /* ściąga: złe puszki zamieniają się w dobre */ eff = pick(['tearsup', 'spdup', 'rangeup', 'luckup', 'zdrowie']); D = PILLS[eff]; }
  banner(D.n, D.good ? 'Smakowało' : 'Coś poszło nie tak…', D.good ? '#c8ffb0' : '#ffb0a0');
  var pm = P.pillMods, add = function (k, v) { pm[k] = (pm[k] || 0) + v; calcStats(); };
  P.exT = 1.4; P.ex = D.good ? 'y' : 'v';
  switch (eff) {
    case 'zdrowie': healRed(P, 99); break; case 'hpup': addCont(P, 2); healRed(P, 2); break; case 'hpdown': if (P.cont > 2) addCont(P, -2); else addExtra(P, 'soul', 1); break;
    case 'tearsup': add('tears', .35); break; case 'tearsdown': add('tears', -.28); break; case 'spdup': add('spd', .15); break; case 'spddown': add('spd', -.12); break;
    case 'rangeup': add('range', 1); break; case 'rangedown': add('range', -.8); break; case 'luckup': add('luck', 1); break; case 'luckdown': add('luck', -1); break;
    case 'stal': addExtra(P, 'soul', 4); break;
    case 'zatrucie': if (P.red + P.extra.length * 2 <= 2) healRed(P, 99); else { P.inv = 0; damagePlayer(2, 'pill'); } break;
    case 'bak': ENTS.forEach(function (e) { if (dist(e.x, e.y, P.x, P.y) < 100) applyStatus(e, 'poison', 4); }); fxCloud(P.x, P.y, 'rgba(150,190,60,.55)', 100); sfx('burp'); break;
    case 'widze': revealMap(true); break;
    case 'boom': for (var i = 0; i < 4; i++) later(.4 + i * .9, function () { placeBomb(R.P.x, R.P.y, 1.6, true); }, true); break;
    case 'energia': if (P.active) P.active.ch = ITEMS[P.active.id].act; sfx('charge'); break;
    case 'tele': var cand = R.floor.rooms.filter(function (r) { return r !== R.room && r.gx >= 0; }); teleportTo(pick(cand)); break;
    case 'paraliz': P.para = 2; break;
    case 'paw': for (var v = 0; v < 8; v++) { var a = v / 8 * TAU; addCreep(P.x + Math.cos(a) * 30, P.y + Math.sin(a) * 30, 20, 'vomit', 6, false); } sfx('vomit'); break;
    case 'zamula': GAME.slow = 5; break;
    case 'jazda': ENTS.forEach(function (e) { e.haste = 6; }); break;
    case 'gdzie': P.confuse = 6; break;
    case 'golebie': for (var g = 0; g < 3; g++) spawnAlly(P.x, P.y - 20); break;
  }
}
// ---------- drobne ----------
function revealMap(all) { R.floor.rooms.forEach(function (r) { if (r.gx < 0) return; if (all && r.type !== 'secret') r.seen = true; if (!all && (r.type === 'boss' || r.type === 'treasure' || (flag('secretMap') && r.type === 'secret'))) r.seen = true; if (all && flag('secretMap') && r.type === 'secret') r.seen = true; }); }
function playerFace() {
  var P = R.P; if (P.hurtT > 0) return 'h'; if (P.exT > 0 && P.ex) return P.ex; if (P.trans.grek) return 'm';
  if (P.cryT > 0) return 's'; if (P.blinkT < .12) return 'b'; return 'n';
}
function playerLook() {
  var C = CHARS[R.P.ch], L = Object.assign({}, C.look);
  if (has('toga')) { L.shirt = '#f4efe2'; L.jacket = null; L.overalls = null; }
  else if (has('dres')) { L.shirt = '#151518'; L.pants = '#151518'; L.stripes = 1; L.jacket = null; }
  else if (has('kamizelka')) { L.jacket = '#d8f02a'; }
  else if (has('kurtka')) { L.jacket = '#7a1f1f'; }
  if (R.P.trans.grek) { L.skin = '#ece6da'; }
  return L;
}
function playerHat() {
  if (has('crown')) return hatCrown; if (has('laurel') || R.P.trans.grek) return laurelHat; if (has('tiara')) return function (hw, hh) { X.fillStyle = '#1a1a22'; X.fillRect(-hw * .24, -hh * .9, hw * .48, hh * .42); X.fillRect(-hw * .38, -hh * .5, hw * .76, hh * .06); X.fillStyle = '#7a2aa8'; X.fillRect(-hw * .24, -hh * .56, hw * .48, hh * .05); };
  if (has('cap')) return hatCap('#d8302a'); if (has('kaptur')) return hatCap('#2a7a3a'); return null;
}
function drawPlayer() {
  var P = R.P, x = P.ix, y = P.iy;
  if (P.ghost) { drawPerson({ x: x, y: y, ch: CHARS[P.ch].face, ex: 'z', look: { shirt: '#e8f7ff', pants: '#cfe0ff', shoes: '#e8f7ff', hair: '#cfe0ff', skin: '#e8f7ff' }, dir: P.dir, walk: P.walk, moving: true, sc: .9, alpha: .45 + Math.sin(GAME.t * 4) * .1, fly: true, wingCol: 'rgba(230,240,255,.8)', curly: CHARS[P.ch].curly }); return; }
  if (P.dead && P.deadT > 1.6) return;
  var blink = P.inv > 0 && P.hurtT <= 0 && (GAME.frame >> 2) % 2 === 0;
  var dirMap = P.sdx || P.sdy ? (Math.abs(P.sdx) > Math.abs(P.sdy) ? (P.sdx > 0 ? 'r' : 'l') : (P.sdy > 0 ? 'd' : 'u')) : P.dir;
  var shooting = P.cryT > 0, dir = shooting ? dirMap : P.dir;
  if (P.shieldT > 0) { X.save(); X.globalAlpha = .35 + Math.sin(GAME.t * 10) * .1; X.fillStyle = '#9fd8ff'; X.beginPath(); X.arc(x, y - 18, 30, 0, TAU); X.fill(); X.restore(); }
  if (P.mantle) { X.save(); X.globalAlpha = .25; X.strokeStyle = '#fff2b0'; X.lineWidth = 2; X.beginPath(); X.arc(x, y - 18, 27, 0, TAU); X.stroke(); X.restore(); }
  drawPerson({ x: x, y: y, ch: CHARS[P.ch].face, ex: playerFace(), look: playerLook(), dir: P.holdItem ? 'd' : dir, walk: P.walk, moving: Math.hypot(P.vx, P.vy) > 20, shoot: shooting, sc: 1, flash: P.hurtT > .45 ? (P.hurtT - .45) * 4 : 0, alpha: blink ? .35 : (P.dead ? Math.max(0, 1 - P.deadT) : 1), fly: flag('fly'), tears: shooting && P.ch !== 'bajtek', hat: playerHat(), curly: CHARS[P.ch].curly, wingCol: P.trans.grek ? 'rgba(255,250,235,.95)' : null });
  if (P.holdItem) { var it = ITEMS[P.holdItem.id]; X.save(); X.globalAlpha = Math.min(1, P.holdItem.t * 3); drawItemIcon(it, x, y - 74, 24); X.restore(); }
  if (P.para > 0) emo('💫', x, y - 62, 16, GAME.t * 3);
  if (P.confuse > 0) emo('❓', x + 12, y - 60, 14);
}

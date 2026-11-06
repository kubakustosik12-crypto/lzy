// ---- 08_ents.js ----
// ===================== ENCJE: wrogowie, łzy, lasery, petardy, znajdźki, kałuże, pomocnicy, efekty =====================
var ENTS = [], TEARS = [], PICKS = [], BOMBS = [], CREEP = [], FX = [], LASERS = [], ALLY = [], FAMS = [], FALL = [];
var TIMERS = [];
function later(t, fn, keep) { TIMERS.push({ t: t, fn: fn, keep: !!keep }); }
function updTimers(dt) { for (var i = 0; i < TIMERS.length; i++) { var T = TIMERS[i]; T.t -= dt; if (T.t <= 0) { TIMERS.splice(i--, 1); try { T.fn(); } catch (e) { console.error(e); } } } }
function clearRoomTimers() { TIMERS = TIMERS.filter(function (T) { return T.keep; }); }
function laserLen(x, y, a) { var rm = R.room, dx = Math.cos(a), dy = Math.sin(a), len = 0; while (len < 2000) { var px = x + dx * len, py = y + 8 + dy * len; if (px < -4 || py < -4 || px > rm.w + 4 || py > rm.h + 4) break; len += 6; } return len; }
function warnLaser(x, y, a, t, kind) { var L = { x: x, y: y, a: a, len: laserLen(x, y, a), w: 2, t: t, max: t, kind: kind || 'boss', warn: 1, dmg: 0, tick: 0, every: 0 }; LASERS.push(L); return L; }
var GOD = false, ENTID = 1, SHAKE = { t: 0, a: 0 }, FLASH = { col: '', t: 0, max: 1 };
function shake(a) { if (!SET.shake) return; SHAKE.a = Math.max(SHAKE.a * (SHAKE.t > 0 ? 1 : 0), a); SHAKE.t = .25; }
function fxFlash(col, t) { FLASH.col = col; FLASH.t = FLASH.max = t || .35; }
// ---------- kolizje z kaflami ----------
function tileSolidAt(x, y, flying) { var rm = R.room; if (!rm.obs) return false; var c = Math.floor(x / TS), r = Math.floor(y / TS); if (c < 0 || r < 0 || c >= rm.cols || r >= rm.rows) return false; return isSolidTile(rm.obs[r * rm.cols + c], flying); }
function collideTiles(o, flying, noTiles) {
  var rm = R.room, r = o.r;
  if (!noTiles && rm.obs) {
    var c0 = Math.floor((o.x - r) / TS), c1 = Math.floor((o.x + r) / TS), r0 = Math.floor((o.y - r) / TS), r1 = Math.floor((o.y + r) / TS), hit = false;
    for (var ty = r0; ty <= r1; ty++) for (var tx = c0; tx <= c1; tx++) {
      if (tx < 0 || ty < 0 || tx >= rm.cols || ty >= rm.rows) continue; var ob = rm.obs[ty * rm.cols + tx]; if (!isSolidTile(ob, flying)) continue;
      var nx = clamp(o.x, tx * TS, tx * TS + TS), ny = clamp(o.y, ty * TS, ty * TS + TS), dx = o.x - nx, dy = o.y - ny, d2 = dx * dx + dy * dy;
      if (d2 < r * r) { var d = Math.sqrt(d2) || .01; if (d2 < .0001) { dx = o.x - (tx * TS + TS / 2); dy = o.y - (ty * TS + TS / 2); d = Math.hypot(dx, dy) || 1; o.x += dx / d * r * .5; o.y += dy / d * r * .5; } else { o.x += dx / d * (r - d); o.y += dy / d * (r - d); } hit = true; if (ob.k === 'fire' && o === R.P && ob.hp > 0 && !flying) damagePlayer(hurtAmount(), 'fire'); }
    }
    o.tileHit = hit;
  }
  var wh = false; if (o.x < r) { o.x = r; wh = true; } if (o.x > rm.w - r) { o.x = rm.w - r; wh = true; } if (o.y < r) { o.y = r; wh = true; } if (o.y > rm.h - r) { o.y = rm.h - r; wh = true; }
  o.wallHit = wh; return o.tileHit || wh;
}
function losClear(x0, y0, x1, y1, flying) { var d = dist(x0, y0, x1, y1), n = Math.ceil(d / 12); for (var i = 1; i < n; i++) { var k = i / n; if (tileSolidAt(lerp(x0, x1, k), lerp(y0, y1, k), flying)) return false; } return true; }
// ---------- pole przepływu (szukanie drogi do gracza) ----------
var FLOW = { f: null, c: -1, r: -1, t: 0, room: null };
function flowUpdate(force) {
  var rm = R.room, P = R.P, c = clamp(Math.floor(P.x / TS), 0, rm.cols - 1), r = clamp(Math.floor(P.y / TS), 0, rm.rows - 1);
  if (!force && FLOW.room === rm && FLOW.c === c && FLOW.r === r && FLOW.t > 0) return;
  FLOW.room = rm; FLOW.c = c; FLOW.r = r; FLOW.t = .5;
  var n = rm.cols * rm.rows, f = FLOW.f && FLOW.f.length === n ? FLOW.f : new Int16Array(n); f.fill(32000);
  var q = new Int32Array(n), qh = 0, qt = 0; f[r * rm.cols + c] = 0; q[qt++] = r * rm.cols + c;
  while (qh < qt) { var i = q[qh++], x = i % rm.cols, y = (i / rm.cols) | 0, v = f[i] + 1;
    if (x > 0 && v < f[i - 1] && !isSolidTile(rm.obs[i - 1])) { f[i - 1] = v; q[qt++] = i - 1; }
    if (x < rm.cols - 1 && v < f[i + 1] && !isSolidTile(rm.obs[i + 1])) { f[i + 1] = v; q[qt++] = i + 1; }
    if (y > 0 && v < f[i - rm.cols] && !isSolidTile(rm.obs[i - rm.cols])) { f[i - rm.cols] = v; q[qt++] = i - rm.cols; }
    if (y < rm.rows - 1 && v < f[i + rm.cols] && !isSolidTile(rm.obs[i + rm.cols])) { f[i + rm.cols] = v; q[qt++] = i + rm.cols; } }
  FLOW.f = f;
}
function flowDir(e) { // kierunek do gracza po kaflach
  var rm = R.room, P = R.P; if (losClear(e.x, e.y, P.x, P.y) && dist(e.x, e.y, P.x, P.y) < 260) { var a = angTo(e.x, e.y, P.x, P.y); return [Math.cos(a), Math.sin(a)]; }
  var c = clamp(Math.floor(e.x / TS), 0, rm.cols - 1), r = clamp(Math.floor(e.y / TS), 0, rm.rows - 1), f = FLOW.f, best = f[r * rm.cols + c], bx = c, by = r;
  [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (d) { var x = c + d[0], y = r + d[1]; if (x < 0 || y < 0 || x >= rm.cols || y >= rm.rows) return; if (d[0] && d[1] && (isSolidTile(rm.obs[r * rm.cols + x]) || isSolidTile(rm.obs[y * rm.cols + c]))) return; var v = f[y * rm.cols + x] + (d[0] && d[1] ? .4 : 0); if (v < best) { best = v; bx = x; by = y; } });
  if (bx === c && by === r) { var a2 = angTo(e.x, e.y, P.x, P.y); return [Math.cos(a2), Math.sin(a2)]; }
  var tx = bx * TS + TS / 2, ty = by * TS + TS / 2, a3 = angTo(e.x, e.y, tx, ty); return [Math.cos(a3), Math.sin(a3)];
}
// ---------- wrogowie ----------
function spawnMob(t, x, y, o) {
  var D = MOBS[t]; o = o || {}; var fi = R.floor ? R.floor.i : 0, hpMul = (1 + fi * .12) * (o.champ ? CHAMPS[o.champ].hp : 1);
  var e = { id: ENTID++, t: t, D: D, x: x, y: y, px: x, py: y, ix: x, iy: y, vx: 0, vy: 0, r: D.r, hp: D.hp * hpMul, maxHp: D.hp * hpMul, fly: !!D.fly, anim: rnd(0, 5), st: 'idle', stT: rnd(.4, 1.2), shotT: rnd(.6, 1) * (D.shot ? D.shot.cd : 1),
    fx: rnd01() < .5 ? -1 : 1, dir: 'd', flash: 0, z: 0, champ: o.champ || null, spawnT: o.noAnim ? 0 : .45, ang: rnd(0, TAU), ex: 'n' };
  if (o.boss) e.boss = o.boss; ENTS.push(e); return e;
}
function applyStatus(e, k, t) {
  if (e.dead) return; if (k === 'freeze') k = 'frozen'; if (k === 'charm') k = 'charmed';
  if (e.boss && (k === 'stun' || k === 'sleep' || k === 'frozen' || k === 'fear' || k === 'confuse' || k === 'charmed')) { if (e.ccImm > 0) return; t = Math.min(t, 2); e.ccImm = t + 2.5; }
  e[k] = Math.max(e[k] || 0, t);
}
function hitEnemy(e, dmg, o) {
  if (e.dead || e.inert || e.phase || e.invul > 0) return; o = o || {};
  if (e.fear > 0 && R.P.active && R.P.active.id === 'scary') dmg *= 1.4;
  if (e.rata > 0) dmg *= 1.25;
  if (e.boss && e.armor) dmg *= e.armor;
  e.hp -= dmg; e.flash = .1; e.hitT = .25; sfx('hit', .5);
  if (o.kx != null && !e.boss) { var m = (o.knock || 1) * (e.heavy ? .3 : 1); e.vx += o.kx * 140 * m; e.vy += o.ky * 140 * m; }
  if (o.burn) applyStatus(e, 'burn', 3); if (o.slow) applyStatus(e, 'slow', 3); if (o.freeze) applyStatus(e, 'frozen', 2); if (o.poison) applyStatus(e, 'poison', 3.5);
  if (o.fear) applyStatus(e, 'fear', 3); if (o.stun) applyStatus(e, 'stun', 1.1); if (o.confuse) applyStatus(e, 'confuse', 2.5); if (o.charm) applyStatus(e, 'charmed', 3); if (o.credit) e.rata = 4;
  if (e.sleep > 0 && !e.boss && dmg > 0) e.sleep = Math.min(e.sleep, .3);
  if (e.boss) BOSSBAR.hitT = .2;
  if (e.hp <= 0) killEnemy(e);
}
function killEnemy(e) {
  if (e.dead) return; e.dead = true; e.deadT = 0;
  var D = e.D || {}, col = { bird: '#c8ccd4', bug: '#4a2a12', onion: '#e8c8a0', clock: '#c83a2a', chair: '#c8924a', rat: '#7a7a80', spider: '#2a1a1a', bat: '#3a2e40', ghost: '#e8eeff', statue: '#e8e2d6', paper: '#fbfbf4', human: '#c83a2a', pillow: '#e8e0f0' }[D.art] || '#c83a2a';
  for (var i = 0; i < 12; i++) fxPart(e.x, e.y - 10, rnd(-160, 160), rnd(-200, 40), col, rnd(3, 6), rnd(.35, .7), 1);
  if (D.art === 'bird') for (var k = 0; k < 5; k++) fxPart(e.x, e.y - 12, rnd(-60, 60), rnd(-90, -10), '#dfe3ea', 4, 1.2, 0, 'feather');
  addDecal(e.x, e.y, D.art === 'ghost' || D.art === 'statue' || D.art === 'paper' ? null : col);
  sfx('die', .7); PROF.kills++;
  if (e.boss) { bossDefeated(e); return; }
  if (e.champ) { dropPick(rnd01() < .5 ? 'heart' : pick(['coin', 'key', 'bomb', 'card']), null, e.x, e.y, true); if (e.champ === 'blue') for (var j = 0; j < 8; j++) enemyShot(e.x, e.y, j / 8 * TAU, 130, 'enemy'); }
  if (D.coins) for (var c = 0; c < D.coins; c++) dropPick('coin', 1, e.x, e.y, true);
  if (e.rata > 0 && rnd01() < .3) dropPick('coin', 1, e.x, e.y, true);
  if (R.P.trans.golab && rnd01() < .25) spawnAlly(e.x, e.y);
  if (flag('bodyBoom')) explodeAt(e.x, e.y, 55, 12 + R.P.st.dmg, { noPlayer: 1, small: 1 });
}
var CURMOB = null;
function enemyShot(x, y, a, spd, kind, o) {
  o = o || {}; var t = spawnTear(x, y, Math.cos(a), Math.sin(a), { enemy: true, sp: spd, kind: kind || 'enemy', life: o.life || 4, z: o.z == null ? 10 : o.z, dmg: 1 });
  t.src = CURMOB ? CURMOB.t : 'enemy'; t.r = o.r || (kind === 'zzz' ? 8 : 6); if (o.lob) { t.lob = o.lob; t.vx = 0; t.vy = 0; } if (o.curve) t.curve = o.curve; if (o.accel) t.accel = o.accel; return t;
}
function lobShot(x, y, tx, ty, T, kind, onLand) { var t = enemyShot(x, y, 0, 0, kind, { lob: { x0: x, y0: y, tx: tx, ty: ty, T: T, t: 0 }, life: T + .1, r: 8 }); t.onLand = onLand; return t; }
function mobSpd(e) { var m = 1; if (e.slow > 0) m *= .5; if (GAME.slow > 0) m *= .45; if (e.haste > 0) m *= 1.5; if (flag('slowAll')) m *= .85; if (e.champ === 'yellow') m *= 1.35; return m; }
function updMob(e, dt) {
  var D = e.D, P = R.P, rm = R.room; e.anim += dt; e.flash = Math.max(0, e.flash - dt); e.hitT = Math.max(0, (e.hitT || 0) - dt);
  ['stun', 'sleep', 'frozen', 'fear', 'slow', 'burn', 'poison', 'confuse', 'charmed', 'rata', 'haste', 'ccImm', 'invul'].forEach(function (k) { if (e[k] > 0) e[k] -= dt; });
  if (e.burn > 0 || e.poison > 0) { e.dotT = (e.dotT || 0) - dt; if (e.dotT <= 0) { e.dotT = .5; var dd = e.burn > 0 ? 2 + P.st.dmg * .3 : 1.5 + P.st.dmg * .25; e.hp -= dd; e.flash = .05; if (e.hp <= 0) { killEnemy(e); return; } } }
  if (e.spawnT > 0) { e.spawnT -= dt; return; }
  CURMOB = e;
  if (e.boss) { bossUpdate(e, dt); }
  else {
    var cc = e.stun > 0 || e.sleep > 0 || e.frozen > 0;
    if (!cc) MOBAI[D.ai](e, dt, mobSpd(e));
    e.vx *= Math.pow(.0005, dt); e.vy *= Math.pow(.0005, dt);
  }
  CURMOB = null;
  // ruch + kolizje
  e.x += e.vx * dt; e.y += e.vy * dt;
  if (!e.noCollide) collideTiles(e, e.fly || e.z > 10, e.fly);
  // rozpychanie
  for (var i = 0; i < ENTS.length; i++) { var o = ENTS[i]; if (o === e || o.dead || o.boss || e.boss) continue; var dx = e.x - o.x, dy = e.y - o.y, d2 = dx * dx + dy * dy, rr2 = (e.r + o.r) * .8; if (d2 < rr2 * rr2 && d2 > .01) { var d = Math.sqrt(d2), p = (rr2 - d) * .5; e.x += dx / d * p; e.y += dy / d * p; } }
  if (Math.abs(e.vx) > 5) e.fx = e.vx > 0 ? 1 : -1;
  if (e.boss) { var bdx = P.x - e.x, bdy = P.y - e.y; e.dir = Math.abs(bdx) > Math.abs(bdy) * 1.4 ? (bdx > 0 ? 'r' : 'l') : 'd'; }
  else if (Math.abs(e.vx) > Math.abs(e.vy)) e.dir = e.vx > 0 ? 'r' : 'l'; else if (Math.abs(e.vy) > 8) e.dir = e.vy > 0 ? 'd' : 'u';
  // kontakt z graczem
  if (!e.charmed && !e.phase && !e.noTouch && (e.z || 0) < 10 && dist(e.x, e.y, P.x, P.y) < e.r + P.r - 2) damagePlayer(e.boss || e.champ === 'black' ? Math.max(hurtAmount(), e.champ === 'black' ? 2 : 1) : hurtAmount(), e.t);
}
function wobble(e, dt, spd, k) { e.wa = (e.wa || rnd(0, TAU)) + rnd(-4, 4) * dt; e.vx += Math.cos(e.wa) * spd * k * dt * 6; e.vy += Math.sin(e.wa) * spd * k * dt * 6; }
function steer(e, tx, ty, spd, acc, dt) { var a = angTo(e.x, e.y, tx, ty); e.vx += (Math.cos(a) * spd - e.vx) * Math.min(1, acc * dt); e.vy += (Math.sin(a) * spd - e.vy) * Math.min(1, acc * dt); }
function targetOf(e) { var P = R.P; if (e.fear > 0) return { x: e.x * 2 - P.x, y: e.y * 2 - P.y }; if (e.confuse > 0 || e.charmed > 0) { if (!e.cft || e.cft < GAME.t) { e.cft = GAME.t + 1; e.cfx = rnd(30, R.room.w - 30); e.cfy = rnd(30, R.room.h - 30); } return { x: e.cfx, y: e.cfy }; } return P; }
function shotTell(e, dt, cd, fn) { e.shotT -= dt; if (e.shotT < .4 && !e.tell) e.tell = 1; if (e.shotT <= 0) { e.tell = 0; e.shotT = cd * rnd(.85, 1.2); if (e.fear > 0 || e.confuse > 0 || e.charmed > 0) return; fn(); } }
var MOBAI = {
  fly: function (e, dt, m) { var T = targetOf(e); steer(e, T.x, T.y, e.D.spd * m, 2.2, dt); wobble(e, dt, e.D.spd, .9); },
  flyShoot: function (e, dt, m) { var P = R.P, T = targetOf(e), d = dist(e.x, e.y, P.x, P.y); if (d > 170 || T !== P) steer(e, T.x, T.y, e.D.spd * m, 2, dt); else if (d < 110) steer(e, e.x * 2 - P.x, e.y * 2 - P.y, e.D.spd * m, 2, dt); wobble(e, dt, e.D.spd, .8);
    var S = e.D.shot; shotTell(e, dt, S.cd, function () { var a = angTo(e.x, e.y, P.x, P.y), n = S.n || 1; for (var i = 0; i < n; i++) enemyShot(e.x, e.y - 12, a + (i - (n - 1) / 2) * (S.spread || 0), S.spd, S.kind); sfx(S.kind === 'milk' ? 'splat' : 'shoot', .4); }); },
  bounce: function (e, dt, m) { if (!e.bdx) { e.bdx = rnd01() < .5 ? -1 : 1; e.bdy = rnd01() < .5 ? -1 : 1; } var sp = e.D.spd * m; e.vx = e.bdx * sp; e.vy = e.bdy * sp; var rm = R.room; if (e.x <= e.r + 1) e.bdx = 1; if (e.x >= rm.w - e.r - 1) e.bdx = -1; if (e.y <= e.r + 1) e.bdy = 1; if (e.y >= rm.h - e.r - 1) e.bdy = -1; },
  walk: function (e, dt, m) { var T = targetOf(e), d; if (T === R.P) d = flowDir(e); else { var a = angTo(e.x, e.y, T.x, T.y); d = [Math.cos(a), Math.sin(a)]; } var sp = e.D.spd * m; e.vx += (d[0] * sp - e.vx) * Math.min(1, 8 * dt); e.vy += (d[1] * sp - e.vy) * Math.min(1, 8 * dt); e.moving = true; },
  walkShoot: function (e, dt, m) { var P = R.P; MOBAI.walk(e, dt, m * (e.tell ? .2 : 1)); var S = e.D.shot; shotTell(e, dt, S.cd, function () { if (dist(e.x, e.y, P.x, P.y) > 320) return; enemyShot(e.x, e.y - 14, angTo(e.x, e.y, P.x, P.y), S.spd, S.kind); sfx('splat', .4); }); },
  run: function (e, dt, m) { e.stT -= dt; if (e.stT <= 0 || e.tileHit || e.wallHit) { e.stT = rnd(.3, .9); e.pause = !e.pause && rnd01() < .35; if (e.pause) e.stT = rnd(.25, .55); var P = R.P, T = targetOf(e); if (rnd01() < .4) e.ang = angTo(e.x, e.y, T.x, T.y) + rnd(-.5, .5); else e.ang = rndi(0, 3) * PI / 2 + rnd(-.2, .2); } var sp = e.pause ? 0 : e.D.spd * m; e.vx = Math.cos(e.ang) * sp; e.vy = Math.sin(e.ang) * sp; },
  turret: function (e, dt, m) { var T = targetOf(e); steer(e, T.x, T.y, e.D.spd * m, 1, dt); var S = e.D.shot; shotTell(e, dt, S.cd, function () { e.alt = !e.alt; for (var i = 0; i < 4; i++) enemyShot(e.x, e.y - 12, i * PI / 2 + (e.alt ? PI / 4 : 0), S.spd, 'enemy'); sfx('splat', .4); }); },
  charge: function (e, dt, m) {
    var P = R.P;
    if (e.st === 'charge') { e.vx = e.cdx * e.D.cspd * m; e.vy = e.cdy * e.D.cspd * m; e.moving = true; if (e.tileHit || e.wallHit) { e.st = 'daze'; e.stT = .7; shake(2); sfx('hit'); } return; }
    if (e.st === 'daze') { e.stT -= dt; e.vx *= .8; e.vy *= .8; if (e.stT <= 0) e.st = 'idle'; return; }
    e.stT -= dt; if (e.stT <= 0 || e.tileHit) { e.stT = rnd(.6, 1.4); e.ang = rndi(0, 3) * PI / 2; }
    var sp = e.D.spd * m; e.vx = Math.cos(e.ang) * sp; e.vy = Math.sin(e.ang) * sp; e.moving = true;
    if (e.fear > 0 || e.confuse > 0) return;
    var dx = P.x - e.x, dy = P.y - e.y; if ((Math.abs(dx) < 14 || Math.abs(dy) < 14) && Math.hypot(dx, dy) < 330 && losClear(e.x, e.y, P.x, P.y)) { e.st = 'charge'; if (Math.abs(dx) < 14) { e.cdx = 0; e.cdy = Math.sign(dy); } else { e.cdy = 0; e.cdx = Math.sign(dx); } floatText(e.x, e.y - 50, '!', '#ff5a3a'); }
  },
  lob: function (e, dt, m) { var P = R.P, d = dist(e.x, e.y, P.x, P.y); if (d < 120) { var a = angTo(P.x, P.y, e.x, e.y); steer(e, e.x + Math.cos(a) * 50, e.y + Math.sin(a) * 50, e.D.spd * m, 3, dt); } else if (d > 230) MOBAI.walk(e, dt, m); else { e.vx *= .9; e.vy *= .9; } e.moving = Math.hypot(e.vx, e.vy) > 10;
    shotTell(e, dt, e.D.shot.cd, function () { lobShot(e.x, e.y - 20, P.x + P.vx * .4, P.y + P.vy * .4, .9, 'can', function (t) { for (var i = 0; i < 4; i++) enemyShot(t.x, t.y, i * PI / 2 + PI / 4, 120, 'enemy', { z: 4 }); addCreep(t.x, t.y, 18, 'vomit', 3, true); sfx('splat'); }); }); },
  swoop: function (e, dt, m) {
    var P = R.P, T = targetOf(e);
    if (e.st === 'dive') { e.stT -= dt; if (e.stT <= 0) { e.st = 'idle'; e.stT = rnd(1.4, 2.6); } return; }
    e.orb = (e.orb || rnd(0, TAU)) + dt * .9; steer(e, T.x + Math.cos(e.orb) * 120, T.y + Math.sin(e.orb) * 90, e.D.spd * m, 2, dt);
    e.stT -= dt; if (e.stT <= 0 && T === P) { e.st = 'dive'; e.stT = .55; var a = angTo(e.x, e.y, P.x, P.y); e.vx = Math.cos(a) * e.D.spd * 3.2 * m; e.vy = Math.sin(a) * e.D.spd * 3.2 * m; }
  },
  ring: function (e, dt, m) { e.ring = Math.max(0, (e.ring || 0) - dt); var S = e.D.shot; e.shotT -= dt; if (e.shotT < .6 && !e.ring) e.ring = .6; if (e.shotT <= 0) { e.shotT = S.cd * rnd(.9, 1.2); if (e.fear > 0) return; e.alt = !e.alt; for (var i = 0; i < S.n; i++) enemyShot(e.x, e.y - 14, i / S.n * TAU + (e.alt ? PI / S.n : 0), S.spd, 'enemy'); sfx('zap', .4); } e.stT -= dt; if (e.stT <= 0) { e.stT = rnd(1.5, 3); var a = rnd(0, TAU); e.vx = Math.cos(a) * 60; e.vy = Math.sin(a) * 60; } },
  aura: function (e, dt, m) { MOBAI.walk(e, dt, m); var P = R.P; if (dist(e.x, e.y, P.x, P.y) < 95 && !flag('calm')) P.yawnT = .25; e.stT -= dt; if (e.stT <= 0) { e.stT = rnd(3, 5); if (dist(e.x, e.y, P.x, P.y) < 300) enemyShot(e.x, e.y - 30, angTo(e.x, e.y, P.x, P.y), 70, 'zzz', { life: 5 }); } },
  hop: function (e, dt, m) {
    var P = R.P, T = targetOf(e);
    if (e.st === 'air') { e.stT -= dt * m; var k = 1 - e.stT / e.air; e.z = Math.sin(k * PI) * 34; e.noCollide = false; if (e.stT <= 0) { e.st = 'idle'; e.stT = rnd(.5, 1.1); e.z = 0; e.vx = e.vy = 0; e.squash = .25; sfx('step', 2); } return; }
    e.squash = Math.max(0, (e.squash || 0) - dt); e.stT -= dt * m; e.vx *= .8; e.vy *= .8;
    if (e.stT <= 0) { e.st = 'air'; e.air = e.stT = .55; var a = angTo(e.x, e.y, T.x, T.y) + rnd(-.3, .3), d = Math.min(150, dist(e.x, e.y, T.x, T.y)); e.vx = Math.cos(a) * d / e.air; e.vy = Math.sin(a) * d / e.air; }
  },
  hopShoot: function (e, dt, m) { MOBAI.hop(e, dt, m * 1.4); var P = R.P, S = e.D.shot; if (e.st !== 'air') shotTell(e, dt, S.cd, function () { enemyShot(e.x, e.y - 8, angTo(e.x, e.y, P.x, P.y), S.spd, 'web', { r: 7 }); }); },
  rat: function (e, dt, m) { MOBAI.walk(e, dt, m); e.ang = Math.atan2(e.vy, e.vx); e.stT -= dt; if (e.stT <= 0) { e.stT = rnd(.6, 1.2); addCreep(e.x, e.y, 13, 'poison', 3, true); } },
  ghost: function (e, dt, m) { var T = targetOf(e); e.stT -= dt; if (e.stT <= 0) { e.phase = !e.phase; e.stT = e.phase ? 1.4 : rnd(2, 3); } steer(e, T.x, T.y, e.D.spd * m * (e.phase ? 1.8 : 1), 1.5, dt); wobble(e, dt, e.D.spd, .5); },
  statue: function (e, dt, m) {
    if (e.st === 'stomp') { e.stT -= dt; e.sc = 1 + Math.sin((.6 - e.stT) * 20) * .03; if (e.stT <= 0) { e.st = 'idle'; e.sc = 1; for (var i = 0; i < 10; i++) enemyShot(e.x, e.y, i / 10 * TAU, 140, 'enemy', { z: 4 }); fxRing(e.x, e.y, 70, 'rgba(255,255,255,.7)'); shake(4); sfx('trap'); if (dist(e.x, e.y, R.P.x, R.P.y) < 55) damagePlayer(hurtAmount(), 'posag'); } return; }
    MOBAI.walk(e, dt, m); e.stT -= dt; if (e.stT <= 0) { e.stT = rnd(3.5, 5); e.st = 'stomp'; e.stT = .6; e.vx = e.vy = 0; } e.heavy = 1;
  }
};
function drawMob(e) {
  if (e.spawnT > 0) { X.save(); X.globalAlpha *= 1 - e.spawnT / .45; }
  if (e.boss) drawBoss(e);
  else { var D = e.D, f = MOBART[D.art]; if (f) f(e, D.o || {}); }
  if (e.spawnT > 0) X.restore();
  if (e.tell && !e.boss) { X.save(); X.globalAlpha = .5 + Math.sin(GAME.t * 30) * .3; X.fillStyle = '#ff4a3a'; X.beginPath(); X.arc(e.ix, e.iy - 40 * (e.D.o && e.D.o.sz || 1), 3, 0, TAU); X.fill(); X.restore(); }
  if (e.sleep > 0) { X.fillStyle = '#cfe0ff'; X.font = 'bold 12px sans-serif'; X.textAlign = 'center'; X.fillText('z', e.ix + 10 + Math.sin(GAME.t * 2) * 3, e.iy - 40 - (GAME.t * 10 % 12)); }
  if (e.stun > 0) emo('💫', e.ix, e.iy - 44 * (e.boss ? 1.6 : 1), 12, GAME.t * 4);
  if (e.fear > 0) emo('😨', e.ix + 12, e.iy - 46, 11);
  if (e.charmed > 0) emo('💗', e.ix, e.iy - 46, 11);
}
var MOBART = { bird: artBird, bug: artBug, onion: artOnion, clock: artClock, chair: artChair, rat: artRat, spider: artSpider, bat: artBat, ghost: function (e, o) { artGhost(e, o); }, statue: artStatue, paper: artPaper, human: function (e, o) { artHuman(e, Object.assign({}, o, { hat: o.hat === 'nightcap' ? hatNightcap : o.hat })); }, pillow: artPillow };
function artPillow(e) {
  var f = Math.sin(e.anim * 5); shadow(e.ix, e.iy + 4, 12, 4, .18); champRing(e, 12);
  mobBegin(e, 1); X.translate(0, -18 + Math.sin(e.anim * 3) * 4); X.rotate(f * .12);
  var g = X.createLinearGradient(0, -12, 0, 12); g.addColorStop(0, '#fbf6ff'); g.addColorStop(1, '#c8b8e0'); X.fillStyle = g;
  X.beginPath(); X.moveTo(-16, -10); X.quadraticCurveTo(0, -15, 16, -10); X.quadraticCurveTo(20, 0, 16, 10); X.quadraticCurveTo(0, 15, -16, 10); X.quadraticCurveTo(-20, 0, -16, -10); X.fill();
  X.strokeStyle = 'rgba(120,90,160,.35)'; X.lineWidth = 1; X.stroke(); eyes(0, -1, 5, 2.4, true);
  X.fillStyle = '#5a2a5a'; X.beginPath(); X.arc(0, 5, 2.5, 0, PI); X.fill(); mobEnd();
}
// ---------- łzy ----------
function updTears(dt) {
  var P = R.P, rm = R.room;
  for (var i = TEARS.length - 1; i >= 0; i--) {
    var t = TEARS[i], dts = t.enemy && GAME.slow > 0 ? dt * .45 : dt;
    if (t.own && !t.enemy && R.P !== t.own && t.own._fams) usePlayer(t.own);
    if (t.lob) { var L = t.lob; L.t += dts; var k = Math.min(1, L.t / L.T); t.x = lerp(L.x0, L.tx, k); t.y = lerp(L.y0, L.ty, k); t.z = Math.sin(k * PI) * 70 + 4 * (1 - k); if (k >= 1) { if (t.onLand) t.onLand(t); else fxSplash(t.x, t.y, t.kind); TEARS.splice(i, 1); } continue; }
    if (t.homing && !t.enemy) { var best = null, bd = 220; ENTS.forEach(function (e) { if (e.dead || e.phase || e.inert) return; var d = dist(t.x, t.y, e.x, e.y); if (d < bd) { bd = d; best = e; } }); if (best) { var sp = Math.hypot(t.vx, t.vy), a = Math.atan2(t.vy, t.vx), want = angTo(t.x, t.y, best.x, best.y - 8); a += clamp(angDiff(a, want), -5 * dt, 5 * dt); t.vx = Math.cos(a) * sp; t.vy = Math.sin(a) * sp; } }
    if (t.curve) { var a2 = Math.atan2(t.vy, t.vx) + t.curve * dts, s2 = Math.hypot(t.vx, t.vy); t.vx = Math.cos(a2) * s2; t.vy = Math.sin(a2) * s2; }
    if (t.accel) { var s3 = Math.hypot(t.vx, t.vy) || 1, ns = Math.max(20, s3 + t.accel * dts); t.vx *= ns / s3; t.vy *= ns / s3; }
    if (t.boomer && Math.hypot(t.vx, t.vy) <= 25) { var bb = ENTS.filter(function (e) { return e.boss && !e.dead; })[0], ba = bb ? angTo(t.x, t.y, bb.x, bb.y - 40) : Math.atan2(-t.vy, -t.vx); t.vx = Math.cos(ba) * 300; t.vy = Math.sin(ba) * 300; t.accel = 0; t.boomer = 0; t.life = 2.2; }
    t.x += t.vx * dts; t.y += t.vy * dts; t.life -= dts;
    if (t.life < .16 && !t.enemy) t.z = Math.max(0, t.z - 90 * dts);
    var dead = t.life <= 0;
    // ściany
    if (t.x < 2 || t.y < 2 || t.x > rm.w - 2 || t.y > rm.h - 2) { if (t.bounce && (t.bounced || 0) < 3) { t.bounced = (t.bounced || 0) + 1; if (t.x < 2 || t.x > rm.w - 2) t.vx *= -1; else t.vy *= -1; t.x = clamp(t.x, 3, rm.w - 3); t.y = clamp(t.y, 3, rm.h - 3); } else dead = true; }
    // przeszkody
    if (!dead && !t.spectral && rm.obs) { var c = Math.floor(t.x / TS), r = Math.floor(t.y / TS), ob = c >= 0 && r >= 0 && c < rm.cols && r < rm.rows ? rm.obs[r * rm.cols + c] : null; if (ob && ob.k !== 'pit' && ob.k !== 'spikes' && SOLID[ob.k] && ob.hp !== 0) { if (!t.enemy && OBSHP[ob.k]) damageObs(ob, 1); dead = true; } }
    if (!dead && !t.enemy) {
      for (var j = 0; j < ENTS.length; j++) { var e = ENTS[j]; if (e.dead || e.inert || t.hit[e.id] || e.phase || e.spawnT > 0) continue; var hr = e.r + t.r * .8 + (e.boss ? 6 : 0); if ((e.z || 0) > 30) continue; var dy = (t.y - (e.boss ? (e.hitOff || 10) : 6)) - e.y; if (t.x - e.x > -hr && t.x - e.x < hr && Math.abs(dy) < hr + 6 && Math.hypot(t.x - e.x, dy) < hr + 4) {
        var sp4 = Math.hypot(t.vx, t.vy) || 1; t.hit[e.id] = 1; hitEnemy(e, t.dmg, { kx: t.vx / sp4, ky: t.vy / sp4, knock: t.knock, burn: t.burn, slow: t.slow, freeze: t.freeze, poison: t.poison, fear: t.fear, stun: t.stun, confuse: t.confuse, charm: t.charm, credit: t.credit });
        if (t.chain) chainZap(e, t.dmg * .5);
        if (!t.pierce) { dead = true; break; } } }
      // niszczenie łajna/koszy łzami przez kafel
    }
    if (!dead && t.enemy) for (var pq = 0, PLs = livePlayers(); pq < PLs.length && !dead; pq++) {
      P = PLs[pq]; if (R.P !== P) usePlayer(P);
      if (P.shieldT > 0 && dist(t.x, t.y, P.x, P.y - 14) < 34) dead = true;
      else if (FAMS.some(function (f) { return f.orbit && dist(t.x, t.y, f.x, f.y) < 12 + t.r; })) dead = true;
      else if (dist(t.x, t.y, P.x, P.y - 6) < P.r + t.r - 2 && t.z < 40) { if (t.kind === 'web') { P.webT = 2; } if (t.kind === 'zzz' && !flag('calm')) { P.yawnT = 1.5; } damagePlayer(hurtAmount(), t.src || 'enemy'); dead = true; }
    }
    if (dead) { fxSplash(t.x, t.y - t.z, t.kind); TEARS.splice(i, 1); }
  }
  var P0 = players()[0]; if (P0 && R.P !== P0) usePlayer(P0);
}
function chainZap(from, dmg) { var src = from, done = {}; done[from.id] = 1; for (var n = 0; n < 2; n++) { var best = null, bd = 140; ENTS.forEach(function (e) { if (e.dead || done[e.id] || e.inert) return; var d = dist(src.x, src.y, e.x, e.y); if (d < bd) { bd = d; best = e; } }); if (!best) break; done[best.id] = 1; FX.push({ type: 'zap', x: src.x, y: src.y - 12, x2: best.x, y2: best.y - 12, life: .15, max: .15 }); hitEnemy(best, dmg, { stun: rnd01() < .2 }); src = best; } sfx('zap', .4); }
// ---------- lasery ----------
function segDist(px, py, x0, y0, x1, y1) { var dx = x1 - x0, dy = y1 - y0, l2 = dx * dx + dy * dy, t = l2 ? clamp(((px - x0) * dx + (py - y0) * dy) / l2, 0, 1) : 0; return dist(px, py, x0 + dx * t, y0 + dy * t); }
function laserHit(L) {
  var x1 = L.x + Math.cos(L.a) * L.len, y1 = L.y + Math.sin(L.a) * L.len;
  if (L.enemy) { livePlayers().forEach(function (P) { if (segDist(P.x, P.y - 10, L.x, L.y, x1, y1) < L.w / 2 + P.r) withPlayer(P, function () { damagePlayer(hurtAmount(), 'laser'); }); }); return; }
  ENTS.forEach(function (e) { if (e.dead || e.inert || e.phase) return; if (segDist(e.x, e.y - 8, L.x, L.y, x1, y1) < L.w / 2 + e.r) hitEnemy(e, L.dmg, { kx: Math.cos(L.a), ky: Math.sin(L.a), knock: .4 }); });
}
function updLasers(dt) { for (var i = LASERS.length - 1; i >= 0; i--) { var L = LASERS[i]; L.t -= dt; if (L.every) { L.tick -= dt; if (L.tick <= 0) { L.tick = L.every; laserHit(L); } } if (L.follow) { L.x = R.P.x + Math.cos(L.a) * 8; L.y = R.P.y - 12; } if (L.t <= 0) LASERS.splice(i, 1); } }
function drawLaser(L) {
  var k = L.t / L.max, w = L.w * (L.every ? (.8 + Math.sin(GAME.t * 40) * .2) : 1) * Math.min(1, k * 3), x1 = L.x + Math.cos(L.a) * L.len, y1 = L.y + Math.sin(L.a) * L.len;
  var col = L.kind === 'tech' ? ['rgba(255,80,80,.9)', '#fff'] : L.kind === 'brim' ? ['rgba(200,20,30,.95)', '#ffb0a0'] : L.kind === 'gold' ? ['rgba(255,200,60,.9)', '#fff8d0'] : ['rgba(255,60,60,.9)', '#fff'];
  if (L.warn) { X.save(); X.globalAlpha = .35 + Math.sin(GAME.t * 30) * .2; X.strokeStyle = col[0]; X.lineWidth = 2; X.setLineDash([8, 6]); X.beginPath(); X.moveTo(L.x, L.y); X.lineTo(x1, y1); X.stroke(); X.restore(); return; }
  X.save(); X.globalCompositeOperation = 'lighter'; X.lineCap = 'round';
  X.strokeStyle = col[0]; X.lineWidth = w * 2.2; X.globalAlpha = .45; X.beginPath(); X.moveTo(L.x, L.y); X.lineTo(x1, y1); X.stroke();
  X.globalAlpha = 1; X.lineWidth = w; X.beginPath(); X.moveTo(L.x, L.y); X.lineTo(x1, y1); X.stroke();
  X.strokeStyle = col[1]; X.lineWidth = Math.max(1, w * .35); X.beginPath(); X.moveTo(L.x, L.y); X.lineTo(x1, y1); X.stroke();
  X.restore();
}
// ---------- petardy i wybuchy ----------
function placeBomb(x, y, fuse, free) { var P = R.P; if (!free) { if (P.bombs <= 0) return; P.bombs--; } BOMBS.push({ x: x, y: y, px: x, py: y, vx: 0, vy: 0, r: 10, fuse: fuse == null ? 1.5 : fuse, mega: flag('megaBomb') }); sfx('bomb'); sfx('fuse', .6); }
function updBombs(dt) { for (var i = BOMBS.length - 1; i >= 0; i--) { var b = BOMBS[i]; b.fuse -= dt; b.x += b.vx * dt; b.y += b.vy * dt; b.vx *= .9; b.vy *= .9; collideTiles(b, false); if (b.fuse <= 0) { BOMBS.splice(i, 1); explodeAt(b.x, b.y, b.mega ? 100 : 78, b.mega ? 110 : 60, {}); } } }
function explodeAt(x, y, rad, dmg, o) {
  o = o || {}; var P = R.P, rm = R.room;
  FX.push({ type: 'boom', x: x, y: y, r: rad, life: .45, max: .45 }); for (var i = 0; i < (o.small ? 8 : 18); i++) fxPart(x, y - 10, rnd(-1, 1) * rad * 4, rnd(-1, .4) * rad * 4, pick(['#ffcf5a', '#ff7a2a', '#5a5a5a', '#3a3a3a']), rnd(4, 9), rnd(.3, .8), 1);
  addDecal(x, y, 'scorch'); sfx('boom', o.small ? .5 : 1); shake(o.small ? 4 : o.big ? 14 : 9);
  ENTS.forEach(function (e) { if (e.dead) return; var d = dist(x, y, e.x, e.y); if (d < rad + e.r) { var a = angTo(x, y, e.x, e.y); hitEnemy(e, dmg, { kx: Math.cos(a), ky: Math.sin(a), knock: 2.5, burn: o.fire }); } });
  if (!o.noPlayer) livePlayers().forEach(function (q) { if (dist(x, y, q.x, q.y) < rad + q.r - 4) withPlayer(q, function () { damagePlayer(2, 'bomb'); }); });
  PICKS.forEach(function (p) { var d = dist(x, y, p.x, p.y); if (d < rad * 1.4) { var a = angTo(x, y, p.x, p.y); p.vx += Math.cos(a) * 260; p.vy += Math.sin(a) * 260; p.vz = 120; } });
  BOMBS.forEach(function (b) { var d = dist(x, y, b.x, b.y); if (d < rad && d > 1) { var a = angTo(x, y, b.x, b.y); b.vx += Math.cos(a) * 240; b.vy += Math.sin(a) * 240; } });
  if (rm.obs) for (var r = 0; r < rm.rows; r++) for (var c = 0; c < rm.cols; c++) { var ob = rm.obs[r * rm.cols + c]; if (!ob) continue; if (dist(x, y, ob.x, ob.y) < rad + 14) destroyObs(ob, true); }
  rm.doors.forEach(function (d) { if (d.hidden && dist(x, y, d.x, d.y) < rad + 34) revealSecretDoor(d); });
  rm.npcs.forEach(function (n) { if (!n.dead && dist(x, y, n.x, n.y) < rad + n.r) npcBlown(n); });
}
function damageObs(ob, n) { if (!ob.max) return; ob.hp = Math.max(0, ob.hp - n); fxPart(ob.x, ob.y - 8, rnd(-60, 60), rnd(-90, -20), ob.k === 'poop' ? '#7a6a52' : ob.k === 'fire' ? '#ffb040' : '#8a9aaa', 4, .4, 1); if (ob.hp <= 0) destroyObs(ob); }
function destroyObs(ob, boom) {
  var rm = R.room, i = ob.r * rm.cols + ob.c; if (rm.obs[i] !== ob) return;
  if (ob.k === 'block' || ob.k === 'pit') return;
  if (ob.k === 'spikes' && !boom) return; if (ob.k === 'spikes') return;
  if (ob.k === 'tnt') { rm.obs[i] = null; later(.12, function () { if (R && R.room === rm) explodeAt(ob.x, ob.y, 80, 50, {}); }); return; }
  if (ob.k === 'fire') { if (ob.hp > 0 && !boom) return; rm.obs[i] = null; if (rnd01() < .25) dropPick(pick(['coin', 'heart']), null, ob.x, ob.y, true); return; }
  rm.obs[i] = null; for (var k = 0; k < 8; k++) fxPart(ob.x, ob.y - 10, rnd(-120, 120), rnd(-160, 0), ob.k === 'poop' ? '#6a5a42' : ob.k === 'pot' ? '#6a7a8a' : '#8a8076', rnd(3, 7), rnd(.4, .8), 1);
  if (ob.tint) { if (rnd01() < .5) dropPick('heart', 'soul', ob.x, ob.y, true); else for (var j = 0; j < rndi(2, 3); j++) dropPick(pick(['coin', 'bomb', 'key']), null, ob.x, ob.y, true); }
  else if (ob.k === 'poop' && rnd01() < .15) dropPick('coin', 1, ob.x, ob.y, true);
  else if (ob.k === 'pot' && rnd01() < .3) dropPick(pick(['coin', 'coin', 'heart', 'key', 'bomb', 'pill']), null, ob.x, ob.y, true);
  if (FLOW.room === rm) FLOW.t = 0;
}
// ---------- znajdźki ----------
function dropPick(type, val, x, y, burst) { var p = mkPick(type, val, x, y); if (burst) { var a = rnd(0, TAU), s = rnd(60, 160); p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s; p.vz = 140; } p.spawnT = .3; PICKS.push(p); return p; }
function updPicks(dt) {
  var P = R.P;
  for (var i = PICKS.length - 1; i >= 0; i--) {
    var p = PICKS[i]; P = players()[nearestIdx(p.x, p.y)]; if (R.P !== P) usePlayer(P); p.r = 9; p.spawnT = Math.max(0, (p.spawnT || 0) - dt); p.cd = Math.max(0, (p.cd || 0) - dt);
    if (p.vz || p.z > 0) { p.vz -= 520 * dt; p.z += p.vz * dt; if (p.z <= 0) { p.z = 0; p.vz = Math.abs(p.vz) > 60 ? -p.vz * .35 : 0; } }
    if (flag('magnet') && p.type !== 'chest' && dist(p.x, p.y, P.x, P.y) < 220) { var a = angTo(p.x, p.y, P.x, P.y); p.vx += Math.cos(a) * 700 * dt; p.vy += Math.sin(a) * 700 * dt; }
    p.x += p.vx * dt; p.y += p.vy * dt; var fr = Math.pow(.02, dt); p.vx *= fr; p.vy *= fr; collideTiles(p, false);
    if (p.cd <= 0 && p.z < 12 && dist(p.x, p.y, P.x, P.y) < P.r + 11 && !P.dead) { if (collectPick(p)) PICKS.splice(i, 1); }
  }
  var P0 = players()[0]; if (P0 && R.P !== P0) usePlayer(P0);
}
function collectPick(p) {
  var P = R.P;
  switch (p.type) {
    case 'coin': P.coins = Math.min(99, P.coins + p.val); sfx('coin'); if (flag('money')) calcStats(); fxPoof(p.x, p.y - 6, '#ffe070'); return true;
    case 'key': P.keys = Math.min(99, P.keys + (p.val === 'gold' ? 3 : 1)); sfx('key'); return true;
    case 'bomb': P.bombs = Math.min(99, P.bombs + p.val); sfx('pickup'); return true;
    case 'battery': if (!P.active || P.active.ch >= ITEMS[P.active.id].act) return false; P.active.ch = ITEMS[P.active.id].act; sfx('charge'); return true;
    case 'heart':
      if (p.val === 'soul' || p.val === 'black') { if (slots(P) >= 12 && !(P.extra.length && P.extra[P.extra.length - 1].v === 1)) return false; addExtra(P, p.val, 2); sfx('soul'); return true; }
      if (CHARS[P.ch].perk === 'soulOnly' && P.cont === 0) return false;
      if (P.red >= P.cont) return false; healRed(P, p.val === 'half' ? 1 : 2); sfx('heart'); return true;
    case 'card': case 'pill': if (P.pocket) { var old = P.pocket, d = dropPick(old.type, old.val, P.x, P.y, false); d.cd = 1.2; } P.pocket = { type: p.type, val: p.val }; sfx('card'); banner(p.type === 'card' ? CARDS[p.val].n : pillName(p.val), p.type === 'card' ? 'Karta — wciśnij Q' : 'Puszka — wciśnij Q', '#ffe9b0', 1.6); return true;
    case 'trinket': if (P.trinket) { var d2 = dropPick('trinket', P.trinket, P.x, P.y, false); d2.cd = 1.2; } P.trinket = p.val; calcStats(); banner(TRINKETS[p.val].n, TRINKETS[p.val].d, '#d8f0ff', 2); sfx('pickup'); return true;
    case 'chest': if (p.val === 'gold') { if (P.keys <= 0) { p.cd = .8; return false; } P.keys--; } openChest(p); return true;
  }
  return false;
}
function openChest(p) {
  sfx('open'); var gold = p.val === 'gold', n = gold ? rndi(2, 4) : rndi(1, 3);
  if (gold && rnd01() < .3) { spawnPed(p.x, p.y, poolPick(rnd01() < .5 ? 'tre' : 'boss', mkRng((rnd01() * 1e9) | 0)), 'tre'); return; }
  for (var i = 0; i < n; i++) dropPick(pick(['coin', 'coin', 'heart', 'key', 'bomb', 'pill', 'card']), null, p.x, p.y, true);
  if (rnd01() < .12) dropPick('trinket', null, p.x, p.y, true);
}
function spawnPed(x, y, item, pool) { var rm = R.room; x = clamp(x, 40, rm.w - 40); y = clamp(y, 50, rm.h - 30); rm.peds.push({ x: x, y: y, item: item, pool: pool || 'tre', cd: .8 }); fxPoof(x, y - 20, '#fff'); }
// ---------- kałuże ----------
function addCreep(x, y, r, kind, life, enemy) { CREEP.push({ x: x, y: y, r: r * rnd(.85, 1.15), kind: kind, life: life, enemy: enemy, rot: rnd(0, PI), t: 0 }); if (CREEP.length > 90) CREEP.shift(); }
function updCreep(dt) {
  var P = R.P;
  for (var i = CREEP.length - 1; i >= 0; i--) {
    var c = CREEP[i]; c.life -= dt; c.t -= dt; if (c.life <= 0) { CREEP.splice(i, 1); continue; }
    if (c.enemy) { livePlayers().forEach(function (P) { withPlayer(P, function () { if (!flag('fly') && !flag('boots') && dist(c.x, c.y, P.x, P.y) < c.r) { if (c.kind === 'web' || c.kind === 'milk') P.webT = .3; else damagePlayer(hurtAmount(), c.kind === 'fire' ? 'fire' : 'enemy'); } }); }); }
    else if (c.t <= 0) { c.t = .33; ENTS.forEach(function (e) { if (e.dead || e.fly || e.inert || dist(c.x, c.y, e.x, e.y) > c.r + e.r * .5) return; if (c.kind === 'milk') applyStatus(e, 'slow', 1); else hitEnemy(e, c.kind === 'holy' ? 4 : 1.5 + R.P.st.dmg * .35, { poison: c.kind === 'vomit' && rnd01() < .3 }); }); }
  }
}
// ---------- sojusznicze gołębie ----------
function spawnAlly(x, y) { if (ALLY.length >= 14) return; ALLY.push({ x: x, y: y, px: x, py: y, vx: rnd(-80, 80), vy: rnd(-120, -40), anim: rnd(0, 5), r: 7, fx: 1 }); R.P.allies = ALLY.length; }
function updAllies(dt) {
  var P = R.P;
  for (var i = ALLY.length - 1; i >= 0; i--) {
    var a = ALLY[i]; a.anim += dt; var best = null, bd = 1e9;
    ENTS.forEach(function (e) { if (e.dead || e.inert || e.phase || e.spawnT > 0) return; var d = dist(a.x, a.y, e.x, e.y); if (d < bd) { bd = d; best = e; } });
    if (best) { steer(a, best.x, best.y - 6, 230, 3, dt); if (bd < best.r + 9) { hitEnemy(best, 7 + P.st.dmg, {}); fxPoof(a.x, a.y - 10, '#cfe0ff'); for (var k = 0; k < 4; k++) fxPart(a.x, a.y - 10, rnd(-60, 60), rnd(-80, 0), '#dfe8f4', 3, .8, 0, 'feather'); ALLY.splice(i, 1); R.P.allies = ALLY.length; continue; } }
    else { var t = GAME.t * 1.6 + i * TAU / Math.max(1, ALLY.length); steer(a, P.x + Math.cos(t) * 34, P.y - 20 + Math.sin(t) * 18, 160, 3, dt); }
    a.x += a.vx * dt; a.y += a.vy * dt; if (Math.abs(a.vx) > 5) a.fx = a.vx > 0 ? 1 : -1;
  }
}
// ---------- pomocnicy (podążają lub krążą) ----------
var TRAIL = [];
function syncFams() {
  var P = R.P, want = [];
  if (flag('famPigeon')) want.push({ k: 'pigeon', cd: .5, dmg: 3.5 });
  if (flag('famBuddy')) want.push({ k: 'buddy', cd: .75, dmg: 5 });
  for (var o = 0; o < (flag('orbit') || 0); o++) want.push({ k: 'orbit', orbit: 1, i: o });
  if (FAMS.length === want.length && FAMS.every(function (f, i) { return f.k === want[i].k; })) return;
  FAMS = want.map(function (w, i) { return Object.assign({ x: P.x, y: P.y, px: P.x, py: P.y, t: 0, anim: rnd(0, 4), fx: 1 }, w); });
}
function updFams(dt) {
  var P = R.P, fi = 0; TRAIL.unshift([P.x, P.y]); if (TRAIL.length > 80) TRAIL.pop();
  FAMS.forEach(function (f) {
    f.anim += dt;
    if (f.orbit) { var n = flag('orbit'), a = GAME.t * 2.2 + f.i * TAU / n; f.x = P.x + Math.cos(a) * 40; f.y = P.y - 14 + Math.sin(a) * 26; ENTS.forEach(function (e) { if (!e.dead && dist(e.x, e.y - 8, f.x, f.y) < e.r + 8) { e.orbT = (e.orbT || 0) - dt; if (e.orbT <= 0) { e.orbT = .25; hitEnemy(e, 2.5, {}); } } }); return; }
    fi++; var tp = TRAIL[Math.min(TRAIL.length - 1, fi * 14)] || [P.x, P.y]; f.x += (tp[0] - f.x) * Math.min(1, 10 * dt); f.y += (tp[1] - f.y) * Math.min(1, 10 * dt);
    f.t -= dt; if ((IN.sx || IN.sy) && f.t <= 0 && !P.dead) { f.t = f.cd; spawnTear(f.x, f.y - 14, IN.sx, IN.sy, { dmg: f.dmg, kind: f.k === 'pigeon' ? 'milk' : 'tear', sp: 280, life: .9 }).r = 4; }
    if (IN.sx) f.fx = IN.sx; else if (Math.abs(P.vx) > 10) f.fx = P.vx > 0 ? 1 : -1;
  });
}
function drawFam(f) {
  if (f.k === 'buddy') { drawPerson({ x: f.ix, y: f.iy, ch: 'luz', ex: (IN.sx || IN.sy) ? 's' : 'n', look: CHARS.luz.look, dir: IN.sx > 0 ? 'r' : IN.sx < 0 ? 'l' : IN.sy < 0 ? 'u' : 'd', walk: f.anim * 8, moving: true, sc: .55, curly: 1 }); return; }
  artBird({ ix: f.ix, iy: f.iy, fx: f.fx, anim: f.anim, fly: true, flash: 0 }, f.k === 'orbit' ? { col: '#f0c43a', wing: '#c89a1c', sz: .7, neck: false } : { col: '#8f98a3', sz: .8 });
}
// ---------- spadające obiekty (puszki, meteor) ----------
function fallObj(x, y, kind, onLand, T) { FALL.push({ x: x, y: y, kind: kind, t: 0, T: T || .6, onLand: onLand }); }
function updFall(dt) { for (var i = FALL.length - 1; i >= 0; i--) { var f = FALL[i]; f.t += dt; if (f.t >= f.T) { FALL.splice(i, 1); if (f.onLand) f.onLand(); } } }
function drawFall(f) {
  var k = f.t / f.T, h = (1 - k) * 380; X.save(); X.globalAlpha = .25 + k * .4; X.fillStyle = f.kind === 'meteor' ? 'rgba(255,90,30,.5)' : 'rgba(0,0,0,.4)'; X.beginPath(); X.ellipse(f.x, f.y, (f.kind === 'meteor' ? 70 : 18) * (.4 + k * .6), (f.kind === 'meteor' ? 30 : 7) * (.4 + k * .6), 0, 0, TAU); X.fill(); X.restore();
  if (f.kind === 'meteor') { X.save(); X.globalCompositeOperation = 'lighter'; var g = X.createRadialGradient(f.x, f.y - h, 2, f.x, f.y - h, 34); g.addColorStop(0, '#fff6c0'); g.addColorStop(.4, '#ffa030'); g.addColorStop(1, 'rgba(255,60,0,0)'); X.fillStyle = g; X.beginPath(); X.arc(f.x, f.y - h, 34, 0, TAU); X.fill(); X.restore(); emo('☄️', f.x, f.y - h, 34); }
  else if (f.kind === 'boot') { emo('🩴', f.x, f.y - h, 60); }
  else if (f.kind === 'bolt') { X.save(); X.strokeStyle = 'rgba(255,250,200,' + k + ')'; X.lineWidth = 3; X.beginPath(); X.moveTo(f.x, f.y - 320); for (var j = 1; j <= 8; j++) X.lineTo(f.x + rnd(-14, 14), f.y - 320 + j * 40); X.stroke(); X.restore(); }
  else drawTear({ ix: f.x, iy: f.y, z: h, r: 7, kind: 'can', vx: 0, vy: 1, id: 3 });
}
// ---------- efekty ----------
function fxPart(x, y, vx, vy, col, size, life, grav, shape) { if (FX.length > 420) return; FX.push({ type: 'part', x: x, y: y, vx: vx, vy: vy, col: col, size: size, life: life, max: life, grav: grav ? 420 : 0, shape: shape, rot: rnd(0, TAU), vr: rnd(-8, 8) }); }
function fxPoof(x, y, col) { for (var i = 0; i < 8; i++) { var a = i / 8 * TAU; fxPart(x, y, Math.cos(a) * 70, Math.sin(a) * 70, col || '#fff', 4, .35); } }
function fxRing(x, y, r, col) { FX.push({ type: 'ring', x: x, y: y, r: r, col: col, life: .45, max: .45 }); }
function fxCloud(x, y, col, r) { for (var i = 0; i < 14; i++) { var a = rnd(0, TAU), d = rnd(0, r * .6); FX.push({ type: 'cloud', x: x + Math.cos(a) * d, y: y + Math.sin(a) * d * .7, col: col, size: rnd(r * .25, r * .45), life: rnd(.8, 1.4), max: 1.4, vx: Math.cos(a) * 20, vy: Math.sin(a) * 12 - 8 }); } }
function fxSplash(x, y, kind) { var c = (TEARCOL[kind] || TEARCOL.tear)[1]; if (kind === 'pigeon') { for (var k = 0; k < 3; k++) fxPart(x, y, rnd(-50, 50), rnd(-70, -10), '#dfe3ea', 3, .7, 0, 'feather'); return; } for (var i = 0; i < 5; i++) fxPart(x, y, rnd(-70, 70), rnd(-90, 10), c, rnd(2, 3.5), .3, 1); FX.push({ type: 'splash', x: x, y: y, col: c, life: .25, max: .25 }); }
function floatText(x, y, txt, col) { FX.push({ type: 'text', x: x, y: y, txt: txt, col: col || '#fff', life: 1.1, max: 1.1 }); }
function addDecal(x, y, col) { var rm = R.room; if (!rm) return; rm.decals.push({ x: Math.round(x), y: Math.round(y), c: col || 'scorch', s: rnd(.7, 1.3), a: rnd(0, TAU) }); if (rm.decals.length > 40) rm.decals.shift(); }
function updFX(dt) { for (var i = FX.length - 1; i >= 0; i--) { var f = FX[i]; f.life -= dt; if (f.life <= 0) { FX.splice(i, 1); continue; } if (f.type === 'part' || f.type === 'cloud') { f.x += f.vx * dt; f.y += f.vy * dt; if (f.grav) f.vy += f.grav * dt; else { f.vx *= .96; f.vy *= .96; } if (f.vr) f.rot += f.vr * dt; } else if (f.type === 'text') f.y -= 34 * dt; } }
function drawDecals(rm) {
  rm.decals.forEach(function (d) {
    X.save(); X.translate(d.x, d.y); X.rotate(d.a); X.scale(d.s, d.s * .7);
    if (d.c === 'scorch') { var g = X.createRadialGradient(0, 0, 2, 0, 0, 34); g.addColorStop(0, 'rgba(0,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.beginPath(); X.arc(0, 0, 34, 0, TAU); X.fill(); }
    else { X.globalAlpha = .35; X.fillStyle = d.c; X.beginPath(); X.arc(0, 0, 9, 0, TAU); X.arc(10, 4, 5, 0, TAU); X.arc(-8, 6, 4, 0, TAU); X.arc(4, -9, 3.5, 0, TAU); X.fill(); }
    X.restore();
  });
}
function drawFX() {
  FX.forEach(function (f) {
    var k = f.life / f.max;
    if (f.type === 'part') { X.globalAlpha = Math.min(1, k * 2); if (f.shape === 'feather') { X.save(); X.translate(f.x, f.y); X.rotate(f.rot); X.fillStyle = f.col; X.beginPath(); X.ellipse(0, 0, f.size * 1.5, f.size * .5, 0, 0, TAU); X.fill(); X.restore(); } else { X.fillStyle = f.col; X.beginPath(); X.arc(f.x, f.y, f.size * (.5 + k * .5), 0, TAU); X.fill(); } X.globalAlpha = 1; }
    else if (f.type === 'cloud') { X.globalAlpha = Math.min(1, k * 1.6) * .8; X.fillStyle = f.col; X.beginPath(); X.arc(f.x, f.y, f.size * (1.2 - k * .4), 0, TAU); X.fill(); X.globalAlpha = 1; }
    else if (f.type === 'ring') { X.globalAlpha = k; X.strokeStyle = f.col; X.lineWidth = 4 * k + 1; X.beginPath(); X.ellipse(f.x, f.y, f.r * (1 - k * .8), f.r * (1 - k * .8) * .75, 0, 0, TAU); X.stroke(); X.globalAlpha = 1; }
    else if (f.type === 'splash') { X.globalAlpha = k; X.strokeStyle = f.col; X.lineWidth = 2; X.beginPath(); X.ellipse(f.x, f.y, 10 * (1.4 - k), 6 * (1.4 - k), 0, 0, TAU); X.stroke(); X.globalAlpha = 1; }
    else if (f.type === 'boom') { var g = X.createRadialGradient(f.x, f.y - 10, 1, f.x, f.y - 10, f.r * (1.1 - k * .3)); g.addColorStop(0, 'rgba(255,250,220,' + k + ')'); g.addColorStop(.35, 'rgba(255,170,60,' + k * .9 + ')'); g.addColorStop(.7, 'rgba(160,60,20,' + k * .6 + ')'); g.addColorStop(1, 'rgba(40,20,10,0)'); X.fillStyle = g; X.beginPath(); X.arc(f.x, f.y - 10, f.r * (1.1 - k * .3), 0, TAU); X.fill(); }
    else if (f.type === 'zap') { X.save(); X.globalAlpha = k; X.strokeStyle = '#fff6a0'; X.lineWidth = 2.5; X.beginPath(); X.moveTo(f.x, f.y); var n = 6; for (var j = 1; j <= n; j++) X.lineTo(lerp(f.x, f.x2, j / n) + (j < n ? rnd(-8, 8) : 0), lerp(f.y, f.y2, j / n) + (j < n ? rnd(-8, 8) : 0)); X.stroke(); X.restore(); }
    else if (f.type === 'text') { X.globalAlpha = Math.min(1, k * 2); X.font = 'bold 13px "Trebuchet MS",sans-serif'; X.textAlign = 'center'; X.lineWidth = 3; X.strokeStyle = 'rgba(0,0,0,.8)'; X.strokeText(f.txt, f.x, f.y); X.fillStyle = f.col; X.fillText(f.txt, f.x, f.y); X.globalAlpha = 1; }
  });
}

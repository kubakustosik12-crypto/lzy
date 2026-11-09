// ---- 10_room.js ----
// ===================== BIEG, PIĘTRA, POKOJE, DRZWI, NAGRODY, GRACZ =====================
var ROOMT = { k: 0, t: 0, T: .26, dx: 0, dy: 0, img: null };
var INTRO = { t: 0, boss: null };
var OPP = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
function newRun(ch, seedStr) {
  R = { v: GV, seed: seedStr || newSeedStr(), ch: ch, seen: {}, seenT: {}, pillKnown: {}, devilTaken: false, devilSeen: false, redHit: false, bossHit: false, time: 0, kills0: PROF.kills, loops: 0, darkT: 0, won: false };
  R.rs = seedNum(R.seed) ^ 0x2545F491;
  R.pools = initPools();
  var rng = mkRng(seedNum(R.seed) ^ 0x51ED);
  var eff = Object.keys(PILLS), map = []; for (var i = 0; i < 8; i++) { var k = rng.wpick(eff.filter(function (e) { return map.indexOf(e) < 0; }).map(function (e) { return [e, PILLS[e].w]; })); map.push(k); } R.pillMap = map;
  R.P = newPlayer(ch); var C = CHARS[ch];
  if (C.active) R.P.active = { id: C.active, ch: ITEMS[C.active].act };
  if (ch === 'ignaczak' && unlocked('win_ignaczak')) R.P.active = { id: 'kostka', ch: 6 };
  calcStats(); PROF.runs++; saveProf();
  ALLY = []; FAMS = []; TRAIL = []; TIMERS = []; INTRO.t = 0; ROOMT.k = 0; R.falling = 0;
  startFloor(0);
}
function startFloor(fi) {
  R.fi = fi; R.floor = genFloor(fi); R.redHit = false; R.P.bearUsed = false; R.darkT = 0;
  BGC = {}; var st = R.floor.rooms[0]; R.room = null;
  enterRoom(st, null); R.P.x = st.w / 2; R.P.y = st.h / 2 + (fi === 0 ? 0 : 20); R.P.px = R.P.x; R.P.py = R.P.y;
  if (flag('map')) revealMap(true); if (flag('compass') || flag('secretMap')) revealMap(false);
  var F = FLOORS[fi], sub = F.numbero ? 'Koszmar Numbero ' + F.numbero : (fi === 0 ? 'Szymon budzi się w szkolnej łazience…' : '');
  if (R.floor.curse === 'dark') sub = 'Klątwa ciemności'; if (R.floor.curse === 'lost') sub = 'Klątwa zagubienia — brak mapy';
  bigBanner(F.n, sub); music(F.mus); saveRun();
  if (fi === 0) { if (AU.buf) vox('intro', { vol: .9 }); else AU.pendingIntro = 1; }
}
EV.on('audioReady', function () { if (AU.pendingIntro && GAME.state === 'play') vox('intro', { vol: .9 }); AU.pendingIntro = 0; });
function roomAt(gx, gy) { var o = R.floor.owner[gy * GW + gx]; return o >= 0 ? R.floor.rooms[o] : null; }
function counterpart(rm, d) {
  var other = R.floor.rooms[d.to]; if (!other) return null;
  if (d.deal || other.gx < 0) return other.doors.filter(function (x) { return x.to === rm.id; })[0];
  var ax = rm.gx + d.lx, ay = rm.gy + d.ly, s = DIRS.filter(function (q) { return q[2] === d.side; })[0], nx = ax + s[0], ny = ay + s[1];
  return other.doors.filter(function (x) { return x.side === OPP[d.side] && other.gx + x.lx === nx && other.gy + x.ly === ny; })[0];
}
function enterRoom(rm, viaDoor) {
  var P = R.P, prev = R.room;
  R.room = rm; R.floor.cur = rm.id; rm.visited = true; rm.seen = true;
  rm.doors.forEach(function (d) { var o = R.floor.rooms[d.to]; if (o && !d.hidden && o.gx >= 0) o.seen = true; });
  ENTS = []; TEARS = []; BOMBS = []; CREEP = []; LASERS = []; FALL = []; FX = []; clearRoomTimers();
  PICKS = rm.picks; P.temp = {}; P.mantle = flag('mantle') > 0; calcStats(); syncFams(); FLOW.room = null; R.darkT = 0;
  if (viaDoor) { var s = viaDoor.side, m = 36; P.x = s === 'left' ? m : s === 'right' ? rm.w - m : viaDoor.x; P.y = s === 'top' ? m - 6 : s === 'bottom' ? rm.h - m : viaDoor.y; }
  else if (prev !== rm) { P.x = rm.w / 2; P.y = rm.h / 2 + 30; if (rm.obs) { for (var k = 0; k < 30 && tileSolidAt(P.x, P.y); k++) { P.x = rnd(60, rm.w - 60); P.y = rnd(60, rm.h - 60); } } }
  P.px = P.x; P.py = P.y; P.vx *= .3; P.vy *= .3; TRAIL = [];
  FAMS.forEach(function (f) { f.x = f.px = P.x; f.y = f.py = P.y; });
  var n = prev ? ALLY.length : (P.allies || 0); ALLY = []; for (var i = 0; i < n; i++) spawnAlly(P.x + rnd(-20, 20), P.y - 20 + rnd(-10, 10));
  // wrogowie
  if (!rm.cleared && rm.type === 'normal') {
    rm.spawn.forEach(function (s) { var x = s.x, y = s.y; if (dist(x, y, P.x, P.y) < 120) { var fr = freeTiles(rm).filter(function (t) { return dist(t[0] * TS + 20, t[1] * TS + 20, P.x, P.y) > 160; }); if (fr.length) { var t = pick(fr); x = t[0] * TS + 20; y = t[1] * TS + 20; } } spawnMob(s.t, x, y, { champ: s.champ }); });
    rm.doors.forEach(function (d) { d.anim = 1; });
  }
  if (rm.type === 'boss' && !rm.cleared) {
    var b = spawnBoss(rm.boss, rm.w / 2, Math.min(rm.h / 2 - 20, 110)); var B = BOSSES[rm.boss];
    INTRO.t = 2.8; INTRO.boss = rm.boss; INTRO.max = 2.8; sfx('boss'); music(null);
    if (B.num) { vox('n' + B.num, { vol: 1 }); later(1.05, function () { vox(B.voice, { vol: 1 }); }, true); }
    R.bossHit = false; BOSSBAR.e = b;
  } else BOSSBAR.e = null;
  rm.doors.forEach(function (d) { d.open = rm.cleared && !d.locked && !d.hidden; if (d.anim == null) d.anim = d.open ? 1 : 0; });
  // muzyka
  if (rm.type === 'devil' || rm.type === 'angel') music('deal'); else if (rm.type !== 'boss' || rm.cleared) music(R.floor.def.mus);
  if (rm.type === 'shop' && !rm.saidHi) { rm.saidHi = 1; var hn = rm.npcs.filter(function (q) { return q.k === 'heniek'; })[0]; if (hn) floatText(hn.x, hn.y - 60, pick(['Dzień dobry!', 'Co podać?', 'Tylko bez długów!']), '#fff'); }
  if (rm.type === 'devil') { R.devilSeen = true; }
  if (rm.type === 'secret') sfx('open');
}
function goThroughDoor(d) {
  var rm = R.room, other = R.floor.rooms[d.to], cd = counterpart(rm, d); if (!other) return; if (!cd) { teleportTo(R.floor.rooms[0]); return; }
  if (cd.hidden) revealSecretDoor(cd);
  if (rm.type === 'secret' || other.type === 'secret') { if (d.hidden) d.hidden = false; }
  snapScene(); var s = DIRS.filter(function (q) { return q[2] === d.side; })[0]; ROOMT.k = 1; ROOMT.t = 0; ROOMT.dx = s[0]; ROOMT.dy = s[1];
  enterRoom(other, cd); sfx('door', .5);
}
function teleportTo(rm) { if (!rm) return; snapScene(); ROOMT.k = 1; ROOMT.t = 0; ROOMT.dx = 0; ROOMT.dy = 0; ROOMT.fade = 1; enterRoom(rm, null); sfx('use'); }
function revealSecretDoor(d) {
  if (!d.hidden) return; d.hidden = false; d.open = true; d.anim = 1; sfx('open'); var rm = R.room; fxPoof(d.x, d.y, '#888');
  var other = R.floor.rooms[d.to]; BGC[rm.id] = null; if (other) { other.seen = true; BGC[other.id] = null; var cd = counterpart(rm, d); if (cd) { cd.hidden = false; cd.open = true; } }
}
// ---------- logika pokoju ----------
function roomLogic(dt) {
  var rm = R.room, P = R.P;
  rm.doors.forEach(function (d) { var want = d.open ? 1 : 0; if (d.anim !== want) { d.anim = approach(d.anim, want, dt * 5); } });
  var alive = ENTS.some(function (e) { return !e.dead && !e.ally; });
  if (!rm.cleared && !alive && INTRO.t <= 0) roomCleared(rm);
  if (rm.trap) { rm.trap.t = (rm.trap.t || 0) + dt; if (rm.trap.t > 1 && !R.falling && livePlayers().some(function (q) { return dist(q.x, q.y, rm.trap.x, rm.trap.y) < 18; })) { R.falling = 1; P.fallT = 0; sfx('trap'); } }
  if (R.falling) { P.fallT += dt; P.vx = P.vy = 0; P.x = lerp(P.x, rm.trap.x, .2); P.y = lerp(P.y, rm.trap.y, .2); if (P.fallT > .9) { R.falling = 0; snapScene(); ROOMT.k = 1; ROOMT.t = 0; ROOMT.dx = 0; ROOMT.dy = 0; ROOMT.fade = 1; var nf = R.nextFi != null ? R.nextFi : R.fi + 1; R.nextFi = null; startFloor(nf); } }
}
function roomCleared(rm) {
  rm.cleared = true; sfx('door'); var P = R.P;
  rm.doors.forEach(function (d) { if (!d.locked && !d.hidden) d.open = true; });
  if (rm.type === 'normal') {
    var rng = rnd01, luck = P.st.luck, ch = clamp(.42 + luck * .045, .2, .9);
    var cx = rm.w / 2, cy = rm.h / 2, spot = nearFree(rm, cx, cy);
    if (rng() < ch) dropPick(pickRoomDrop(), null, spot[0], spot[1], false);
    if (flag('dig') && rng() < .25) dropPick(pickRoomDrop(), null, spot[0] + 20, spot[1], true);
    if (trink('grosz') && rng() < .35) dropPick('coin', 1, spot[0], spot[1], true);
    if (trink('spinacz') && rng() < .15) dropPick('key', 1, spot[0], spot[1], true);
    if (flag('eggs')) { spawnAlly(P.x, P.y - 20); spawnAlly(P.x, P.y - 20); }
  }
  chargeActive(1 + (flag('volt') ? 1 : 0));
}
function chargeActive(n) { var A = R.P.active; if (!A) return; var max = ITEMS[A.id].act; if (A.ch >= max) return; if (trink('bateria') && rnd01() < .3) n++; A.ch = Math.min(max, A.ch + n); if (A.ch >= max) sfx('charge'); }
function pickRoomDrop() { return pickW([['coin', 34], ['heart', 18], ['key', 12], ['bomb', 12], ['chest', 6], ['card', 6], ['pill', 6], ['battery', 3], ['trinket', 2]]); }
function nearFree(rm, x, y) { if (!tileSolidAt(x, y)) return [x, y]; var best = null, bd = 1e9; freeTiles(rm).forEach(function (t) { var d = dist(t[0] * TS + 20, t[1] * TS + 20, x, y); if (d < bd) { bd = d; best = [t[0] * TS + 20, t[1] * TS + 20]; } }); return best || [x, y]; }
function bossDefeated(e) {
  var rm = R.room, B = BOSSES[e.boss], P = R.P; sfx('bossdie'); shake(14); GAME.slowmo = 1; fxFlash('rgba(255,255,255,.5)', .5);
  for (var i = 0; i < 30; i++) fxPart(e.x, e.y - 30, rnd(-260, 260), rnd(-320, 60), pick(['#c83a2a', '#e8e0d0', '#ffd860']), rnd(4, 9), rnd(.6, 1.4), 1);
  ENTS.forEach(function (m) { if (m.summoned && !m.dead) { m.dead = true; fxPoof(m.x, m.y - 10, '#aaa'); } });
  TEARS.forEach(function (t) { if (t.enemy) { t.life = 0; t.lob = null; } }); LASERS.forEach(function (L) { L.t = 0; L.every = 0; });
  PROF.bossKills[e.boss] = (PROF.bossKills[e.boss] || 0) + 1;
  var ukey = { freddy: 'freddy', sigeon: 'sigeon', simi: 'simi', scary: 'scary', greek: 'greek' }[e.boss];
  if (ukey && !PROF.unl[ukey]) { PROF.unl[ukey] = 1; later(2.2, function () { toast('🔓 Odblokowano!', UNLOCKS[ukey].give); }, true); }
  saveProf(); music(null);
  if (R.floor.def.last) { later(2.6, winRun, true); return; }
  var cx = rm.w / 2, cy = rm.h / 2;
  var it = e.boss === 'sigeon' && !R.seen.crown && P.items.indexOf('crown') < 0 ? 'crown' : e.boss === 'kanar' && !R.seen.bilet ? 'bilet' : poolPick('boss', mkRng(rm.seed + 5));
  R.seen[it] = 1; var sp = nearFree(rm, cx, cy + 10); rm.peds.push({ x: sp[0], y: sp[1], item: it, pool: 'boss', cd: 1.2, appear: 1 }); fxPoof(sp[0], sp[1] - 20, '#fff');
  var hp = mkPick('heart', 'full', clamp(cx + 50, 30, rm.w - 30), cy + 30); hp.vz = 140; hp.spawnT = .3; rm.picks.push(hp);
  var tp = nearFree(rm, cx, 74); rm.trap = { x: tp[0], y: tp[1], t: -.6 };
  later(1.4, function () { music(R.floor.def.mus); });
  // diabeł / anioł
  if (R.fi >= 1) {
    var chance = .14 + (R.redHit ? 0 : .3) + (R.bossHit ? 0 : .18);
    if (rnd01() < chance) addDealDoor(rm);
  }
}
function addDealDoor(rm) {
  var F = R.floor, kind = R.devilTaken ? 'devil' : (R.devilSeen && rnd01() < .5) || (has('toga') || has('aureola')) && rnd01() < .5 ? 'angel' : 'devil';
  var used = {}; rm.doors.forEach(function (d) { used[d.side] = 1; }); var side = ['top', 'left', 'right', 'bottom'].filter(function (s) { return !used[s]; })[0]; if (!side) return;
  var deal = mkDealRoom(F, kind), d = { side: side, to: deal.id, lx: 0, ly: 0, type: kind, deal: 1, open: true, anim: 0 }; doorGeom(rm, d); rm.doors.push(d);
  deal.doors[0].to = rm.id; deal.doors[0].side = 'bottom'; BGC[rm.id] = null; sfx(kind === 'devil' ? 'boss' : 'soul');
  floatText(d.x, clamp(d.y, 30, rm.h - 20), kind === 'devil' ? 'Piwnica Scary’ego…' : 'Świątynia Greka', kind === 'devil' ? '#ff7a6a' : '#fff2b0');
}
// ---------- NPC i automaty ----------
function npcTouch(n) {
  var P = R.P; if (n.dead || n.cd > 0) return; n.cd = .7;
  if (n.k === 'slot') { if (P.coins <= 0) return; P.coins--; calcStats(); n.spin = .7; sfx('slot'); later(.7, function () { slotPay(n); }); }
  else if (n.k === 'fortune') { if (P.coins <= 0) return; P.coins--; calcStats(); sfx('card'); var q = rnd01();
    if (q < .55) banner('Wróżka Jadzia mówi:', pick(['Gołąb wie więcej, niż mówi.', 'Numbero 1 jest bliżej, niż myślisz.', 'Nie jedz kebaba po północy.', 'Simi simi… to nie jest sen.', 'Woźny pamięta wszystko.', 'Trzy krzesła to za mało.', 'Twoje łzy są twoją siłą.', 'W piwnicy ktoś na ciebie czeka.']), '#e0c8ff');
    else if (q < .7) dropPick('card', null, n.x, n.y + 30, true); else if (q < .8) dropPick('heart', 'soul', n.x, n.y + 30, true); else if (q < .9) dropPick('trinket', null, n.x, n.y + 30, true); else floatText(n.x, n.y - 50, '…', '#aaa'); }
  else if (n.k === 'babcia') { if (P.coins <= 0) return; P.coins--; calcStats(); n.given = (n.given || 0) + 1; sfx('coin'); floatText(n.x, n.y - 54, pick(['Dziękuję, wnusiu!', 'Bóg zapłać!', 'Na chlebek…']), '#fff');
    if (n.given >= 5 && rnd01() < .3) { spawnPed(n.x, n.y + 40, poolPick('tre', mkRng((rnd01() * 1e9) | 0)), 'tre'); n.dead = true; fxPoof(n.x, n.y - 20, '#fff'); }
    else if (rnd01() < .25) dropPick(pick(['heart', 'coin', 'key', 'bomb', 'pill']), null, n.x, n.y + 30, true); }
}
function slotPay(n) {
  var q = rnd01(), x = n.x, y = n.y + 34; n.res = null;
  if (q < .36) { n.res = ['🍋', '🔔', '🍒']; return; }
  if (q < .58) { n.res = ['🍒', '🍒', '🍒']; dropPick('coin', 1, x, y, true); dropPick('coin', 1, x, y, true); }
  else if (q < .68) { n.res = ['❤️', '❤️', '❤️']; dropPick('heart', 'full', x, y, true); }
  else if (q < .77) { n.res = ['💣', '💣', '💣']; dropPick('bomb', 1, x, y, true); }
  else if (q < .85) { n.res = ['🔑', '🔑', '🔑']; dropPick('key', 1, x, y, true); }
  else if (q < .91) { n.res = ['💊', '💊', '💊']; dropPick('pill', null, x, y, true); }
  else if (q < .975) { n.res = ['🕊️', '🕊️', '🕊️']; spawnMob('golab', x, y + 10); }
  else { n.res = ['7', '7', '7']; sfx('jackpot'); spawnPed(x, y + 30, poolPick('tre', mkRng((rnd01() * 1e9) | 0)), 'tre'); n.dead = true; fxPoof(x, y - 20, '#ffd860'); }
  sfx(n.res[0] === '🍋' ? 'error' : 'coin');
}
function npcBlown(n) {
  if (n.dead) return;
  if (n.k === 'slot' || n.k === 'fortune') { n.dead = true; for (var i = 0; i < rndi(2, 4); i++) dropPick('coin', 1, n.x, n.y, true); if (rnd01() < .15) dropPick(n.k === 'slot' ? 'pill' : 'card', null, n.x, n.y, true); }
  else if (n.k === 'heniek') { n.dead = true; for (var j = 0; j < 3; j++) dropPick('coin', 1, n.x, n.y, true); floatText(n.x, n.y - 40, 'Ała! Policja!', '#ffb0a0'); }
  else if (n.k === 'babcia') { floatText(n.x, n.y - 54, 'Ojej!', '#fff'); }
}
// ---------- cokoły ----------
function pedPrice(p) { if (p.price == null) return 0; var v = p.price; if (flag('sale')) v = Math.ceil(v / 2); if (trink('paragon')) v = Math.max(1, v - 2); return v; }
function takePed(p) {
  var P = R.P, rm = R.room;
  if (p.price != null) { var c = pedPrice(p); if (P.coins < c) { if (!p.warnT || p.warnT < GAME.t) { p.warnT = GAME.t + 1; sfx('error'); } return; } }
  if (p.deal) {
    var cost = p.deal * 2;
    if (P.cont >= cost && P.cont > 0) addCont(P, -cost);
    else { var halves = 0; P.extra.forEach(function (h) { halves += h.v; }); if (P.cont === 0 && halves > 6) { for (var k = 0; k < 6; k++) { var l = P.extra[P.extra.length - 1]; l.v--; if (l.v <= 0) P.extra.pop(); } } else { if (!p.warnT || p.warnT < GAME.t) { p.warnT = GAME.t + 1; sfx('error'); floatText(p.x, p.y - 60, 'Za mało serc', '#ff9a8a'); } return; } }
    R.devilTaken = true; rm.peds.forEach(function (q) { if (q !== p && q.deal) q.dealLocked = 0; });
  }
  if (p.pick) { var ok = collectPick({ type: p.pick.type, val: p.pick.type === 'card' ? (p.pick.val || pick(Object.keys(CARDS))) : p.pick.type === 'pill' ? (p.pick.val != null ? p.pick.val : rndi(0, 7)) : p.pick.val }); if (!ok) return; if (p.price != null) { P.coins -= pedPrice(p); sfx('buy'); calcStats(); } rm.peds.splice(rm.peds.indexOf(p), 1); return; }
  if (p.price != null) { P.coins -= pedPrice(p); sfx('buy'); }
  var id = p.item, it = ITEMS[id], old = it.act && P.active ? P.active.id : null;
  giveItem(id); p.price = null; p.deal = null;
  if (old) { p.item = old; p.cd = 1.5; p.pool = p.pool; } else p.item = null;
  if (p.choice) rm.peds.forEach(function (q) { if (q !== p && q.choice && q.choice === p.choice && q.item) { fxPoof(q.x, q.y - 26, '#fff'); q.item = null; } });
  calcStats();
}
// ---------- gracz ----------
function updPlayer(dt) {
  var P = R.P, rm = R.room;
  ['inv', 'hurtT', 'cryT', 'exT', 'shieldT', 'para', 'confuse', 'webT', 'yawnT', 'dodgeT'].forEach(function (k) { if (P[k] > 0) P[k] -= dt; });
  if (P.poseT > 0) { P.poseT -= dt; if (P.poseT <= 0) calcStats(); }
  P.blinkT -= dt; if (P.blinkT < 0) P.blinkT = rnd(2.5, 4.5);
  if (P.holdItem) { P.holdItem.t -= dt; if (P.holdItem.t <= 0) P.holdItem = null; }
  if (P.dead) { P.deadT = (P.deadT || 0) + dt; P.vx *= .8; P.vy *= .8; return; }
  if (R.falling) return;
  var mx = IN.mx, my = IN.my; if (P.confuse > 0) { mx = -mx; my = -my; } if (P.para > 0) { mx = my = 0; }
  var sp = 185 * P.st.spd * (P.webT > 0 ? .55 : 1) * (P.yawnT > 0 ? .6 : 1);
  var acc = Math.min(1, (mx || my ? 11 : 9) * dt); P.vx += (mx * sp - P.vx) * acc; P.vy += (my * sp - P.vy) * acc;
  P.x += P.vx * dt; P.y += P.vy * dt;
  var fly = !!flag('fly'); collideTiles(P, true, fly);
  // NPC (twarde)
  rm.npcs.forEach(function (n) { if (n.dead) return; n.cd = Math.max(0, (n.cd || 0) - dt); if (n.spin > 0) n.spin -= dt; var d = dist(P.x, P.y, n.x, n.y), rr2 = n.r + P.r; if (d < rr2 && d > .01) { P.x = n.x + (P.x - n.x) / d * rr2; P.y = n.y + (P.y - n.y) / d * rr2; if (n.k === 'slot' || n.k === 'fortune' || n.k === 'babcia') npcTouch(n); } });
  // pinezki
  if (!fly && !flag('boots') && rm.obs) { var o = rm.obs[clamp(Math.floor(P.y / TS), 0, rm.rows - 1) * rm.cols + clamp(Math.floor(P.x / TS), 0, rm.cols - 1)]; if (o && o.k === 'spikes') damagePlayer(hurtAmount(), 'spikes'); }
  var moving = Math.hypot(P.vx, P.vy) > 25;
  if (moving) { P.walk += dt * Math.hypot(P.vx, P.vy) / 18; P.stepT = (P.stepT || 0) - dt; if (P.stepT <= 0 && !fly) { P.stepT = .32; sfx('step', .6); } if (Math.abs(P.vx) > Math.abs(P.vy)) P.dir = P.vx > 0 ? 'r' : 'l'; else P.dir = P.vy > 0 ? 'd' : 'u'; }
  // strzał
  P.fireCd -= dt;
  if ((IN.sx || IN.sy) && P.para <= 0) {
    P.sdx = IN.sx; P.sdy = IN.sy; P.cryT = .3;
    if (flag('brim')) { P.brimCh += dt; }
    else if (P.fireCd <= 0) { playerShoot(IN.sx, IN.sy); P.fireCd = 1 / P.st.tears; }
  } else if (flag('brim') && P.brimCh > 0) {
    var need = clamp(2.2 / P.st.tears, .45, 2); if (P.brimCh >= need) { var a = Math.atan2(P.sdy, P.sdx), L = fireLaser(P.x + Math.cos(a) * 8, P.y - 12, a, P.st.dmg * .8, 'brim', { dur: .55, w: 16, every: .1 }); L.follow = 1; sfx('laser'); shake(3); } P.brimCh = 0;
  }
  if (IN.use) useActive();
  if (IN.bomb && P.bombs > 0) placeBomb(P.x, P.y + 2);
  if (IN.card && P.pocket) usePocket();
  if (IN.drop) { if (P.trinket) { var d0 = dropPick('trinket', P.trinket, P.x, P.y + 20, false); d0.cd = 1.5; P.trinket = null; calcStats(); } else if (P.pocket) { var d1 = dropPick(P.pocket.type, P.pocket.val, P.x, P.y + 20, false); d1.cd = 1.5; P.pocket = null; } }
  // cokoły
  rm.peds.forEach(function (p) { p.cd = Math.max(0, (p.cd || 0) - dt); if ((p.item || p.pick) && p.cd <= 0 && dist(P.x, P.y, p.x, p.y) < 22) takePed(p); });
  // drzwi
  rm.doors.forEach(function (d) {
    if (d.hidden) return; var push = false, near = false;
    if (d.side === 'top') { near = Math.abs(P.x - d.x) < 24 && P.y < 16; push = my < -.3; }
    else if (d.side === 'bottom') { near = Math.abs(P.x - d.x) < 24 && P.y > rm.h - 16; push = my > .3; }
    else if (d.side === 'left') { near = Math.abs(P.y - d.y) < 24 && P.x < 16; push = mx < -.3; }
    else { near = Math.abs(P.y - d.y) < 24 && P.x > rm.w - 16; push = mx > .3; }
    if (!near || !push || ROOMT.k) return;
    if (d.locked && rm.cleared) { if (P.keys > 0) { P.keys--; d.locked = false; d.open = true; var cd = counterpart(rm, d); if (cd) cd.locked = false; sfx('key'); sfx('open'); } return; }
    if (d.open && d.anim > .9) goThroughDoor(d);
  });
  syncFams();
}
// ---------- koniec biegu ----------
function playerDie() {
  var P = R.P; if (P.dead) return; P.dead = true; P.deadT = 0; sfx('die'); sfx('bad'); music(null); shake(10);
  PROF.deaths++; saveProf(); LS.del('lzy-run');
  later(2.2, function () { showDeath(); }, true);
}
function winRun() {
  R.won = true; PROF.wins++; PROF.winsBy[R.ch] = (PROF.winsBy[R.ch] || 0) + 1; var k = 'win_' + R.ch, fresh = !PROF.unl[k]; PROF.unl[k] = 1; saveProf(); LS.del('lzy-run');
  music('greekMusic'); showWin(fresh ? UNLOCKS[k].give : null);
}
// ---------- zapis ----------
function saveRun() { if (!R || R.P.dead || R.won) return; try { var cur = R.room; R.curRoom = cur ? cur.id : 0; R.room = null; var s = JSON.stringify(R); R.room = cur; localStorage.setItem('lzy-run', s); } catch (e) { R.room = cur; } }
function loadRun() {
  var d = LS.get('lzy-run', null); if (!d || d.v !== GV || !d.floor) return false;
  R = d; fixLoadedPlayers(); R.floor.def = FLOORS[R.floor.i]; ALLY = []; FAMS = []; TRAIL = []; BGC = {}; TIMERS = []; INTRO.t = 0; ROOMT.k = 0; R.falling = 0;
  var rm = R.floor.rooms[R.curRoom || 0]; R.room = null; calcStats(); enterRoom(rm, null);
  bigBanner(R.floor.def.n, 'Kontynuacja'); music(R.floor.def.mus); return true;
}
window.addEventListener('beforeunload', function () { if (GAME.state === 'play') saveRun(); });
document.addEventListener('visibilitychange', function () { if (document.hidden && GAME.state === 'play') { saveRun(); if (!GAME.paused) pauseGame(); } });

// ---- 13_main.js ----
// ===================== PĘTLA GŁÓWNA, KAMERA, RYSOWANIE SCENY =====================
var SC = document.createElement('canvas'), SCX = SC.getContext('2d'), MAINX = X, TRC = document.createElement('canvas');
var BGC = {}, CAM = { x: -WS, y: -WT }, DT = 1 / 60;
MUSDEF.boss = { bpm: 132, root: 43, prog: [[0, 3, 7], [0, 3, 8], [-2, 2, 5], [-1, 3, 6]], arp: [0, 1, 2, 1, 0, 2, 1, 2], lead: 'sawtooth', hat: 1 };
var ENTC = document.createElement('canvas'), ENTX = ENTC.getContext('2d', { willReadFrequently: true });
function sizeScene() { ENTC.width = Math.max(1, Math.ceil(VIEWW * VIEW.s)); ENTC.height = Math.max(1, Math.ceil(VIEWH * VIEW.s)); SC.width = Math.max(1, Math.ceil(VIEWW * VIEW.s)); SC.height = Math.max(1, Math.ceil(VIEWH * VIEW.s)); TRC.width = SC.width; TRC.height = SC.height; BGC = {}; }
EV.on('resize', sizeScene); sizeScene();
function snapScene() { var c = TRC.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, TRC.width, TRC.height); c.drawImage(SC, 0, 0); ROOMT.img = TRC; }
function camTarget() { var rm = R.room, P = R.P; return [clamp(P.x - VIEWW / 2, -WS, Math.max(-WS, rm.w + WS - VIEWW)), clamp(P.y - VIEWH / 2 + 10, -WT, Math.max(-WT, rm.h + WB - VIEWH))]; }
function updCam(dt, snap) { var t = camTarget(); if (snap || CAM.room !== R.room) { CAM.x = t[0]; CAM.y = t[1]; CAM.room = R.room; } else { CAM.x += (t[0] - CAM.x) * Math.min(1, dt * 7); CAM.y += (t[1] - CAM.y) * Math.min(1, dt * 7); } }
function savePrev() { var P = R.P; P.px = P.x; P.py = P.y; var l = [ENTS, TEARS, PICKS, BOMBS, ALLY, FAMS]; for (var i = 0; i < l.length; i++) for (var j = 0; j < l[i].length; j++) { var o = l[i][j]; o.px = o.x; o.py = o.y; } }
function interp(o, a) { o.ix = o.px == null ? o.x : lerp(o.px, o.x, a); o.iy = o.py == null ? o.y : lerp(o.py, o.y, a); }
// ---------- krok symulacji ----------
function step(dt) {
  readInput(); menuPad(); GAME.t += dt; GAME.frame++;
  if (GAME.state === 'play' && R) { if (IN.pause && !GAME.paused && !allDead() && !ROOMT.k && GAME.t - (GAME.resumeT || 0) > .15) pauseGame(); else if (!GAME.paused) world(dt); }
  endInput();
}
function world(dt) {
  if (GAME.slowmo > 0) { GAME.slowmo -= dt; dt *= .35; }
  if (!allDead()) R.time += dt;
  if (ROOMT.k) { ROOMT.t += dt; if (ROOMT.t >= ROOMT.T) { ROOMT.k = 0; ROOMT.fade = 0; } updCam(dt, true); savePrev(); return; }
  if (INTRO.t > 0) { INTRO.t -= dt; if (INTRO.t <= 0 || (IN.any && INTRO.max - INTRO.t > .7)) { INTRO.t = 0; music(BOSSES[INTRO.boss].mus || 'boss'); } savePrev(); return; }
  savePrev();
  if (GAME.slow > 0) GAME.slow -= dt; if (R.darkT > 0) R.darkT -= dt;
  updTimers(dt);
  var PL = players(), P0 = PL[0];
  // gracze (każdy ze swoim wejściem)
  for (var pi = 0; pi < PL.length; pi++) { PIN[pi] = COOPINPUT(pi) || PIN[pi]; usePlayer(PL[pi]); IN = PIN[pi]; if (PL[pi].ghost) updGhost(PL[pi], dt); else updPlayer(dt); }
  IN = IN0; usePlayer(P0);
  // mapa przepływu do każdego gracza; potwór idzie/strzela do najbliższego
  for (pi = 0; pi < PL.length; pi++) { usePlayer(PL[pi]); FLOW = FLOWS[pi]; flowUpdate(); FLOW.t -= dt; }
  for (var i = 0; i < ENTS.length; i++) if (!ENTS[i].dead) { var ni = nearestIdx(ENTS[i].x, ENTS[i].y); usePlayer(PL[ni]); FLOW = FLOWS[ni]; updMob(ENTS[i], dt); }
  usePlayer(P0); FLOW = FLOWS[0];
  ENTS = ENTS.filter(function (e) { return !e.dead; });
  updAllies(dt);
  for (pi = 0; pi < PL.length; pi++) { usePlayer(PL[pi]); IN = PIN[pi]; updFams(dt); }
  IN = IN0; usePlayer(P0);
  updTears(dt); updLasers(dt); updBombs(dt); updPicks(dt); updCreep(dt); updFall(dt); updFX(dt);
  if (SHAKE.t > 0) SHAKE.t -= dt; if (FLASH.t > 0) FLASH.t -= dt; if (BAN.t > 0) BAN.t -= dt; if (BIG.t > 0) BIG.t -= dt; if (BOSSBAR.hitT > 0) BOSSBAR.hitT -= dt;
  if (!ROOMT.k) roomLogic(dt);
  updCam(dt);
}
// ---------- rysowanie ----------
function render(a) {
  X = MAINX; X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = '#0b0908'; X.fillRect(0, 0, CV.width, CV.height);
  if (!R || GAME.state === 'title' || GAME.state === 'boot') { drawTitleBG(); PIX.quant = SET.palx === true; PIX.quantize(MAINX, CV.width, CV.height); return; }
  renderScene(a);
  X = MAINX; X.setTransform(1, 0, 0, 1, 0, 0);
  var W = SC.width, H = SC.height;
  X.save(); X.beginPath(); X.rect(VIEW.ox, VIEW.oy, W, H); X.clip();
  if (ROOMT.k && ROOMT.img) { var k = ease(Math.min(1, ROOMT.t / ROOMT.T));
    if (ROOMT.fade || (!ROOMT.dx && !ROOMT.dy)) { X.drawImage(SC, VIEW.ox, VIEW.oy); X.globalAlpha = 1 - k; X.drawImage(ROOMT.img, VIEW.ox, VIEW.oy); X.globalAlpha = 1; }
    else { X.drawImage(ROOMT.img, VIEW.ox - ROOMT.dx * k * W, VIEW.oy - ROOMT.dy * k * H); X.drawImage(SC, VIEW.ox + ROOMT.dx * (1 - k) * W, VIEW.oy + ROOMT.dy * (1 - k) * H); } }
  else X.drawImage(SC, VIEW.ox, VIEW.oy);
  if (FLASH.t > 0) { X.globalAlpha = Math.max(0, FLASH.t / FLASH.max); X.fillStyle = FLASH.col; X.fillRect(VIEW.ox, VIEW.oy, W, H); X.globalAlpha = 1; }
  if (allDead()) { X.fillStyle = 'rgba(40,0,0,' + Math.min(.55, (R.P.deadT || 0) * .3) + ')'; X.fillRect(VIEW.ox, VIEW.oy, W, H); }
  X.restore();
  drawHUD(1 / 60);
  PIX.quant = SET.palx === true; PIX.quantize(MAINX, CV.width, CV.height);
}
function renderScene(a) {
  X = SCX; var s = VIEW.s, rm = R.room, P = R.P;
  X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = '#000'; X.fillRect(0, 0, SC.width, SC.height);
  var sh = SHAKE.t > 0 && SET.shake ? SHAKE.a * (SHAKE.t / .25) : 0, sx = sh ? rnd(-sh, sh) : 0, sy = sh ? rnd(-sh, sh) : 0;
  X.setTransform(s, 0, 0, s, Math.round((-CAM.x + sx) * s), Math.round((-CAM.y + sy) * s));
  var bg = BGC[rm.id]; if (!bg) bg = BGC[rm.id] = buildRoomBG(rm); X.drawImage(bg, -WS, -WT, rm.w + WS * 2, rm.h + WT + WB);
  if (rm.type === 'angel' && IMG.temple) { X.save(); X.fillStyle = '#c9a54a'; X.fillRect(rm.w / 2 - 92, -WT + 6, 50, 58); X.fillRect(rm.w / 2 + 42, -WT + 6, 50, 58); X.globalAlpha = .85; X.drawImage(IMG.temple, rm.w / 2 - 89, -WT + 9, 44, 52); X.drawImage(IMG.temple, rm.w / 2 + 45, -WT + 9, 44, 52); X.restore(); }
  drawDecals(rm); CREEP.forEach(drawCreep);
  if (rm.trap) drawTrap(rm.trap);
  rm.doors.forEach(function (d) { drawDoor(d, rm); });
  var tfm = X.getTransform(); X = ENTX; X.setTransform(1, 0, 0, 1, 0, 0); X.clearRect(0, 0, ENTC.width, ENTC.height); X.setTransform(tfm);
  players().forEach(function (q) { interp(q, a); (q._fams || []).forEach(function (o) { interp(o, a); }); }); ENTS.forEach(function (e) { interp(e, a); }); TEARS.forEach(function (t) { interp(t, a); }); PICKS.forEach(function (p) { interp(p, a); }); BOMBS.forEach(function (b) { interp(b, a); }); ALLY.forEach(function (o) { interp(o, a); }); FAMS.forEach(function (o) { interp(o, a); });
  var L = [];
  if (rm.obs) for (var i = 0; i < rm.obs.length; i++) { var o = rm.obs[i]; if (o) L.push([o.k === 'pit' || o.k === 'spikes' ? -1e4 + o.y : o.y + 12, 0, o]); }
  rm.peds.forEach(function (p) { L.push([p.y + 8, 1, p]); }); rm.npcs.forEach(function (n) { if (!n.dead) L.push([n.y, 2, n]); });
  PICKS.forEach(function (p) { L.push([p.iy - 2, 3, p]); }); BOMBS.forEach(function (b) { L.push([b.iy, 4, b]); });
  ENTS.forEach(function (e) { if (!e.dead) L.push([e.iy + (e.fly ? 20 : 0), 5, e]); });
  players().forEach(function (q) { if (q.ghost || !q.dead || q.deadT < 1.6) L.push([q.iy + (q.ghost ? 40 : 0), 6, q]); (q === P ? FAMS : (q._fams || [])).forEach(function (o) { L.push([o.iy, 8, o]); }); }); ALLY.forEach(function (o) { L.push([o.iy + 30, 7, o]); });
  TEARS.forEach(function (t) { L.push([t.iy + 2, 9, t]); }); FALL.forEach(function (f) { L.push([f.y + 400, 10, f]); });
  L.sort(function (p, q) { return p[0] - q[0]; });
  for (var j = 0; j < L.length; j++) { var it = L[j], ob = it[2];
    switch (it[1]) { case 0: drawObstacle(ob, rm.theme); break; case 1: drawPed(ob); break; case 2: drawNPC(ob); break; case 3: drawPickup(ob); break; case 4: drawBomb(ob.ix, ob.iy - 8, 11 * (ob.mega ? 1.3 : 1) * (1 + Math.max(0, .5 - ob.fuse) * .5), true); break;
      case 5: drawMob(ob); break; case 6: var P_ = R.P; if (ob !== P_) usePlayer(ob); drawPlayer(); if (ob !== P_) { usePlayer(P_); break; } if (flag('brim') && P.brimCh > 0) { var need = clamp(2.2 / P.st.tears, .45, 2), kk = Math.min(1, P.brimCh / need); X.strokeStyle = kk >= 1 ? '#ff3a2a' : '#ffb0a0'; X.lineWidth = 3; X.beginPath(); X.arc(P.ix, P.iy - 62, 7, -PI / 2, -PI / 2 + kk * TAU); X.stroke(); } break;
      case 7: artBird({ ix: ob.ix, iy: ob.iy, fx: ob.fx, anim: ob.anim, fly: true, flash: 0 }, { col: '#8fb8e8', wing: '#5a8ac8', sz: .6 }); break; case 8: drawFam(ob); break; case 9: drawTear(ob); break; case 10: drawFall(ob); break; }
  }
  // kontur jak w Isaacu: każdy byt i przeszkoda dostaje ciemną obwódkę 1 px
  PIX.outline(ENTX, ENTC.width, ENTC.height); X = SCX; X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.drawImage(ENTC, 0, 0); X.restore();
  LASERS.forEach(drawLaser); drawFX(); drawLighting(rm);
  var dark = (R.floor.curse === 'dark' && !flag('light')) || R.darkT > 0;
  if (dark) { var r = R.darkT > 0 ? 70 : 135, g = X.createRadialGradient(P.ix, P.iy - 18, r * .25, P.ix, P.iy - 18, r * 1.6); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,' + (R.darkT > 0 ? .97 : .9) + ')'); X.fillStyle = g; X.fillRect(CAM.x - 20, CAM.y - 20, VIEWW + 40, VIEWH + 40);
    if (R.darkT > 0) ENTS.forEach(function (e) { if (e.boss === 'scary') { X.fillStyle = 'rgba(255,40,40,.9)'; X.beginPath(); X.arc(e.ix - 7, e.iy - 78, 2.6, 0, TAU); X.arc(e.ix + 9, e.iy - 79, 2.6, 0, TAU); X.fill(); } }); }
  X = MAINX;
}
function drawTrap(t) {
  if ((t.t || 0) < 0) return; var k = Math.min(1, (t.t || 0) / 1); shadow(t.x, t.y + 2, 24, 12, .2);
  X.fillStyle = '#4a3a2a'; X.beginPath(); X.ellipse(t.x, t.y, 24, 15, 0, 0, TAU); X.fill();
  X.fillStyle = '#050403'; X.beginPath(); X.ellipse(t.x, t.y, 20 * k, 12 * k, 0, 0, TAU); X.fill();
  if (k < 1) { X.fillStyle = '#6a6460'; X.beginPath(); X.ellipse(t.x, t.y - 2 * (1 - k), 20, 12 * (1 - k), 0, 0, TAU); X.fill(); }
  X.strokeStyle = '#2a2018'; X.lineWidth = 2; X.beginPath(); X.ellipse(t.x, t.y, 24, 15, 0, 0, TAU); X.stroke();
}
function drawPed(p) {
  if (p.pick) { shadow(p.x, p.y + 8, 12, 4, .3); X.fillStyle = 'rgba(0,0,0,.25)'; rr(p.x - 15, p.y - 4, 30, 14, 3); X.fill(); drawPickup({ ix: p.x, iy: p.y - 6, type: p.pick.type, val: p.pick.val, id: 7 }); var c = pedPrice(p); hudTextW(c + ' zł', p.x, p.y + 22, R.P.coins >= c ? '#ffe9a0' : '#ff8a7a'); return; }
  drawPedestal({ ix: p.x, iy: p.y, price: p.item ? (p.deal ? -p.deal : (p.price != null ? pedPrice(p) : null)) : null }, p.item ? ITEMS[p.item] : null);
  if (p.deal && p.item && R.P.cont === 0) hudTextW('3 💙', p.x, p.y + 36, '#9fd8ff');
}
function hudTextW(t, x, y, col) { X.font = 'bold 13px "Trebuchet MS"'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.strokeStyle = 'rgba(0,0,0,.8)'; X.lineWidth = 3; X.strokeText(t, x, y); X.fillStyle = col; X.fillText(t, x, y); }
function drawNPC(n) {
  var x = n.x, y = n.y;
  if (n.k === 'heniek') { drawPerson({ x: x, y: y - 6, emoji: '👨‍🦲', look: { shirt: '#7a1f1f', pants: '#2a2a2a', shoes: '#111', hair: '#3a2a1a' }, dir: 'd', walk: 0, moving: false, sc: 1.15 }); X.fillStyle = '#6a4424'; rr(x - 40, y + 2, 80, 16, 3); X.fill(); X.fillStyle = '#8a5e36'; X.fillRect(x - 40, y + 2, 80, 4); hudTextW('U HEŃKA', x, y + 11, '#ffe08a'); }
  else if (n.k === 'slot') { shadow(x, y + 16, 18, 6, .3); X.fillStyle = '#a01a2a'; rr(x - 17, y - 34, 34, 50, 6); X.fill(); X.fillStyle = '#f0c43a'; rr(x - 17, y - 40, 34, 9, 4); X.fill(); X.fillStyle = '#fff8e8'; rr(x - 13, y - 26, 26, 14, 3); X.fill();
    var sym = n.spin > 0 ? ['🍒', '🔔', '🍋', '7', '💣'].map(function (_, i, arr) { return arr[(Math.floor(GAME.t * 18) + i) % arr.length]; }) : (n.res || ['7', '7', '7']);
    for (var i = 0; i < 3; i++) { if (sym[i] === '7') hudTextW('7', x - 8 + i * 8, y - 19, '#d8201a'); else emo(sym[i], x - 8 + i * 8, y - 19, 7); }
    X.strokeStyle = '#c8c8c8'; X.lineWidth = 2; X.beginPath(); X.moveTo(x + 17, y - 10); X.lineTo(x + 24, y - 24 + (n.spin > 0 ? 8 : 0)); X.stroke(); X.fillStyle = '#e83a3a'; X.beginPath(); X.arc(x + 24, y - 25 + (n.spin > 0 ? 8 : 0), 3.5, 0, TAU); X.fill(); hudTextW('1 zł', x, y + 2, '#ffe08a'); }
  else if (n.k === 'fortune') { shadow(x, y + 16, 18, 6, .3); X.fillStyle = '#4a2a7a'; rr(x - 18, y - 40, 36, 56, 8); X.fill(); X.fillStyle = '#c8a8f0'; X.font = 'bold 7px sans-serif'; X.textAlign = 'center'; X.fillText('WRÓŻKA', x, y - 31); emo('🔮', x, y - 14, 18); hudTextW('1 zł', x, y + 6, '#ffe08a'); }
  else if (n.k === 'babcia') { drawPerson({ x: x, y: y, emoji: '👵', look: { shirt: '#4a6b3a', pants: '#3a3a3a', shoes: '#2a2a2a', hair: '#ddd' }, dir: 'd', walk: 0, moving: false, sc: 1 }); emo('🥣', x + 16, y + 6, 12); }
  else if (n.k === 'statueScary') { X.save(); X.globalAlpha = .9; drawDarkAura(x, y - 30, 70, .5); X.fillStyle = '#2a1010'; rr(x - 22, y - 2, 44, 16, 3); X.fill(); drawPerson({ x: x, y: y, ch: 'ignaczak', ex: 'k', look: { shirt: '#0a0a0a', pants: '#0a0a0a', shoes: '#111', skin: '#a89a9a', hair: '#111' }, dir: 'd', walk: 0, moving: false, sc: 1.4 }); X.restore(); }
  else if (n.k === 'statueGreek') { X.fillStyle = '#d8cfbc'; rr(x - 22, y - 2, 44, 16, 3); X.fill(); X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = 'rgba(255,220,120,.18)'; X.beginPath(); X.arc(x, y - 36, 46, 0, TAU); X.fill(); X.restore(); drawPerson({ x: x, y: y, ch: 'ignaczak', ex: 'm', look: { shirt: '#f4efe2', pants: '#e8e0d0', shoes: '#c9a54a', skin: '#ece6da', hair: '#d8d0c2' }, dir: 'd', walk: 0, moving: false, sc: 1.4, hat: laurelHat }); }
}
// ---------- tło menu tytułowego ----------
var TBG = { birds: null };
function drawTitleBG() {
  var w = CV.width, h = CV.height, s = Math.min(w / VIEWW, h / VIEWH);
  var g = X.createRadialGradient(w / 2, h * .45, 10, w / 2, h * .5, Math.max(w, h) * .7); g.addColorStop(0, '#3a2a22'); g.addColorStop(1, '#0b0807'); X.fillStyle = g; X.fillRect(0, 0, w, h);
  if (!TBG.birds) { TBG.birds = []; for (var i = 0; i < 7; i++) TBG.birds.push({ a: rnd(0, TAU), r: rnd(170, 300), sp: rnd(.2, .45) * (Math.random() < .5 ? -1 : 1), y: rnd(-60, 60), anim: rnd(0, 5) }); }
  X.setTransform(s, 0, 0, s, w / 2, h / 2);
  for (var k = 0; k < 26; k++) { var t = (GAME.t * .25 + k * .37) % 1, x = Math.sin(k * 12.9) * 300; X.fillStyle = 'rgba(110,180,255,' + (.25 * (1 - t)) + ')'; X.beginPath(); X.ellipse(x, -200 + t * 420, 2.2, 4, 0, 0, TAU); X.fill(); }
  TBG.birds.forEach(function (b) { b.a += b.sp / 60; b.anim += 1 / 60; artBird({ ix: Math.cos(b.a) * b.r, iy: b.y + Math.sin(b.a) * 50 - 30, fx: b.sp > 0 ? (Math.sin(b.a) > 0 ? -1 : 1) : (Math.sin(b.a) > 0 ? 1 : -1), anim: b.anim, fly: true, flash: 0 }, { col: '#8f98a3', sz: .9 }); });
  if (IMG.f_ignaczak_s && GAME.state === 'title') { drawPerson({ x: -210, y: 175, ch: 'ignaczak', ex: 's', look: CHARS.ignaczak.look, dir: 'd', walk: 0, moving: false, sc: 2.2, tears: true }); }
  X.setTransform(1, 0, 0, 1, 0, 0);
}
// ---------- start ----------
var LAST = 0, ACC = 0;
function frame(ts) {
  requestAnimationFrame(frame);
  var dt = Math.min(.1, (ts - LAST) / 1000 || 0); LAST = ts;
  if (window.__NR) return;
  ACC += dt; var n = 0; while (ACC >= DT && n < 5) { step(DT); ACC -= DT; n++; } if (n >= 5) ACC = 0;
  try { render(ACC / DT); } catch (e) { console.error(e); }
}
window.__G = { get R() { return R; }, newRun: newRun, step: step, world: world, render: render, giveItem: function (id) { giveItem(id); }, startFloor: startFloor, enterRoom: enterRoom, ents: function () { return ENTS; }, tears: function () { return TEARS; }, god: function (v) { GOD = v; }, spawnBoss: spawnBoss, spawnMob: spawnMob, killAll: function () { ENTS.forEach(function (e) { if (!e.dead) { e.hp = 0; killEnemy(e); } }); }, startPlay: startPlay, IN: IN, KEY: KEY, SHOTSTACK: SHOTSTACK, PROF: PROF, ev: function (s) { return eval(s); }, sim: function (n, fn) { for (var i = 0; i < n; i++) { if (fn) fn(i); step(DT); } } };
loadAssets(function () { GAME.state = 'title'; showTitle(); requestAnimationFrame(frame); });

// ---------- światło jak w Isaacu: jasny środek, ciemne kąty, smugi światła z góry; głębiej = ciemniej ----------
function drawLighting(rm) {
  if (rm.type === 'angel') { X.save(); X.globalCompositeOperation = 'lighter'; var ga = X.createRadialGradient(rm.w / 2, -20, 10, rm.w / 2, 40, rm.h); ga.addColorStop(0, 'rgba(255,240,190,.35)'); ga.addColorStop(1, 'rgba(255,240,190,0)'); X.fillStyle = ga; X.fillRect(-WS, -WT, rm.w + WS * 2, rm.h + WT + WB); X.restore(); return; }
  var depth = R.fi / 8, fl = 1 + (Math.random() < .02 + depth * .03 ? -.25 : 0) * (R.fi >= 4 ? 1 : 0);
  var g = X.createRadialGradient(rm.w / 2, rm.h * .42, Math.min(rm.w, rm.h) * .28, rm.w / 2, rm.h * .5, Math.max(rm.w, rm.h) * .72);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(6,2,2,' + Math.min(.7, (.34 + depth * .22) / fl) + ')');
  X.fillStyle = g; X.fillRect(-WS, -WT, rm.w + WS * 2, rm.h + WT + WB);
  X.save(); X.globalCompositeOperation = 'lighter'; X.globalAlpha = .07 * fl;
  for (var i = 0; i < 3; i++) { var x0 = rm.w * (.25 + i * .22); X.fillStyle = '#ffe8c0'; X.beginPath(); X.moveTo(x0, -WT); X.lineTo(x0 + 34, -WT); X.lineTo(x0 + 110, rm.h * .9); X.lineTo(x0 + 60, rm.h * .9); X.closePath(); X.fill(); }
  X.restore();
}

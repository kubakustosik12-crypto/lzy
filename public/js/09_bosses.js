// ---- 09_bosses.js ----
// ===================== BOSSOWIE: 5 Koszmarów (Numbero 5…1) + bossowie pośredni =====================
function once(e, k, t) { if (e.atT >= t && !e.atD[k]) { e.atD[k] = 1; return true; } return false; }
function every(e, k, t0, step) { var n = Math.floor((e.atT - t0) / step); if (e.atT >= t0 && n > (e.atD[k] == null ? -1 : e.atD[k])) { e.atD[k] = n; return true; } return false; }
function aimP(e, oy) { var P = R.P; return angTo(e.x, e.y - (oy || 0), P.x, P.y - 6); }
function bSpread(e, n, spread, spd, kind, a, oy, o) { a = a == null ? aimP(e, oy) : a; for (var i = 0; i < n; i++) enemyShot(e.x, e.y - (oy || 0), a + (n > 1 ? (i - (n - 1) / 2) * spread : 0), spd, kind, o); }
function bRing(e, n, spd, kind, off, oy, o) { for (var i = 0; i < n; i++) enemyShot(e.x, e.y - (oy || 0), i / n * TAU + (off || 0), spd, kind, o); }
function minions(e) { return ENTS.filter(function (m) { return !m.dead && !m.boss && m.summoned; }).length; }
function bSummon(e, t, n, max) { for (var i = 0; i < n && minions(e) < (max || 5); i++) { var a = rnd(0, TAU), m = spawnMob(t, clamp(e.x + Math.cos(a) * 50, 30, R.room.w - 30), clamp(e.y + Math.sin(a) * 40, 30, R.room.h - 30)); m.summoned = 1; } }
function bTele(e, near) { var P = R.P, rm = R.room, best = null; for (var k = 0; k < 20; k++) { var x = rnd(60, rm.w - 60), y = rnd(60, rm.h - 50), d = dist(x, y, P.x, P.y); if (tileSolidAt(x, y)) continue; if (near ? d > 70 && d < 130 : d > 170) { best = [x, y]; break; } } if (!best) best = [rm.w - P.x, rm.h - P.y]; fxPoof(e.x, e.y - 30, '#444'); e.x = e.px = best[0]; e.y = e.py = best[1]; fxPoof(e.x, e.y - 30, '#888'); }
function bLaserWarn(e, a, t, dur, oy, w, kind) { warnLaser(e.x, e.y - (oy || 0), a, t, kind || 'boss'); later(t, function () { if (e.dead || R.room !== e.room) return; fireLaser(e.x, e.y - (oy || 0), a, 0, kind || 'boss', { enemy: true, dur: dur || .35, w: w || 14, every: .1 }); }); }
function bWalkTo(e, tx, ty, spd, dt) { steer(e, tx, ty, spd, 3, dt); e.moving = Math.hypot(e.vx, e.vy) > 15; }
function bIdleMid(e, dt, sm, spd) { var P = R.P, rm = R.room, a = angTo(P.x, P.y, e.x, e.y), tx = clamp(P.x + Math.cos(a) * 150, 50, rm.w - 50), ty = clamp(P.y + Math.sin(a) * 110, 50, rm.h - 50); bWalkTo(e, tx, ty, (spd || 50) * sm, dt); }
var BOSSES = {
  // ---------- Szkoła I ----------
  fizyk: { n: 'Pan od fizyki', hp: 180, r: 16, rest: 1.1, w: { kreda: 3, wskaznik: 2, wzor: 2 },
    idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 55); },
    atk: {
      kreda: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (every(e, 'k', .3, .35) && e.atD.k < 3) { bSpread(e, 3, .26, 170, 'chalk', null, 30); sfx('shoot', .5); } return t > 1.4; },
      wskaznik: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (once(e, 'a', .1)) { floatText(e.x, e.y - 70, 'Do tablicy!', '#fff'); bLaserWarn(e, aimP(e, 30), .8, .3, 30, 10); if (e.p2) later(.5, function () { if (!e.dead) bLaserWarn(e, aimP(e, 30) + .5, .6, .3, 30, 10); }); } return t > 1.6; },
      wzor: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (once(e, 'a', .3)) { for (var i = 0; i < 10; i++) enemyShot(e.x, e.y - 30, i / 10 * TAU, 40, 'chalk', { accel: 160, life: 4 }); } return t > 1.2; }
    }, p2: function (e) { floatText(e.x, e.y - 70, 'Kartkówka!', '#ffd'); bSummon(e, 'kujon', 2, 3); },
    draw: function (e) { artHuman(e, { emoji: '👨‍🏫', sz: 1.55, look: { shirt: '#e8e0d0', jacket: '#7a5a3a', pants: '#3a3a3a', shoes: '#2a1a10', hair: '#8a8a8a' }, hand: function (dir) { X.strokeStyle = '#6a4a2a'; X.lineWidth = 2; X.beginPath(); X.moveTo(13, -14); X.lineTo(26, -32); X.stroke(); } }); } },
  kujonG: { n: 'Kujon Gigant', hp: 200, r: 18, rest: 1, w: { plecak: 3, kartki: 2, skok: 2 },
    idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 60); },
    atk: {
      plecak: function (e, dt, t) { if (t < .55) { e.vx *= .7; e.vy *= .7; e.shakeT = 1; return false; } if (once(e, 'a', .55)) { var a = aimP(e); e.vx = Math.cos(a) * 360; e.vy = Math.sin(a) * 360; sfx('charge'); } if (e.wallHit || e.tileHit) { if (!e.atD.b) { e.atD.b = 1; shake(5); bRing(e, 8, 130, 'enemy', 0, 20); } e.vx *= .5; e.vy *= .5; } return t > 1.6; },
      kartki: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (once(e, 'a', .4)) bSpread(e, 5, .22, 150, 'enemy', null, 30); if (once(e, 'b', .9)) bSpread(e, 4, .3, 150, 'enemy', null, 30); return t > 1.3; },
      skok: function (e, dt, t) { return bossJump(e, dt, t, .9, function () { bRing(e, 10, 140, 'enemy', 0, 5); }); }
    }, p2: function (e) { bSummon(e, 'kartkowka', 2, 3); },
    draw: function (e) { artHuman(e, { emoji: '🤓', sz: 1.8, look: { shirt: '#3a6ea5', pants: '#2b2b33', shoes: '#e8e8e8', hair: '#4a3a2a' } }); } },
  // ---------- Szkoła II: NUMBERO 5 ----------
  freddy: { n: 'Freddy Fazber', num: 5, voice: 'freddy', mus: 'songClass', strip: 's_class', hp: 320, r: 18, rest: .9, w: { ziew: 3, szarza: 2, jumpscare: 2, drzemka: 2 },
    idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 50); e.ex = 'n'; },
    atk: {
      drzemka: function (e, dt, t) { e.vx *= .7; e.vy *= .7; e.ex = 'z'; e.armor = .55; if (every(e, 'z', .4, .7)) enemyShot(e.x, e.y - 50, aimP(e, 50) + rnd(-.3, .3), 60, 'zzz', { life: 5, accel: 25 }); if (e.hitT > 0 && t > 1) e.atD.wake = (e.atD.wake || 0) + dt; var done = t > 3 || (e.atD.wake || 0) > .4; if (done) { e.armor = 0; floatText(e.x, e.y - 80, 'Kto mnie budzi?!', '#ffb0a0'); } return done; },
      ziew: function (e, dt, t) { e.vx *= .8; e.vy *= .8; e.ex = 'v'; if (once(e, 'a', .5)) { bRing(e, e.p2 ? 14 : 11, 45, 'zzz', 0, 40, { accel: 70, life: 5 }); sfx('burp', .6); } return t > 1.2; },
      szarza: function (e, dt, t) { e.ex = 'k'; var k = Math.floor(t / .9); if (k > 1 + (e.p2 ? 1 : 0)) return true; var lt = t - k * .9; if (lt < .3) { e.vx *= .6; e.vy *= .6; } else if (!e.atD['c' + k]) { e.atD['c' + k] = 1; var a = aimP(e); e.vx = Math.cos(a) * 330; e.vy = Math.sin(a) * 330; sfx('charge', .6); } return false; },
      jumpscare: function (e, dt, t) { if (once(e, 'a', 0)) { fxFlash('rgba(0,0,0,.95)', .7); e.alpha = 0; } if (once(e, 'b', .5)) { bTele(e, true); e.alpha = 1; e.ex = 'k'; shake(8); sfx('hurt'); } if (once(e, 'c', .8)) bRing(e, 8, 150, 'enemy', rnd(0, 1), 30); return t > 1.3; }
    }, p2: function (e) { floatText(e.x, e.y - 80, 'Numbero 5 się nie poddaje!', '#fff'); bSummon(e, 'kujon', 2, 3); },
    draw: function (e) { artHuman(e, { face: 'ignaczak', sz: 1.7, look: { shirt: '#6d7480', pants: '#33363d', shoes: '#1a1a1a', hair: '#6b5640' }, hat: hatFreddy, hand: function () { X.fillStyle = '#121212'; X.beginPath(); X.moveTo(-4, -26); X.lineTo(0, -23); X.lineTo(4, -26); X.lineTo(4, -21); X.lineTo(0, -23); X.lineTo(-4, -21); X.fill(); } }); } },
  // ---------- Rynek I ----------
  kanar: { n: 'Kanar', hp: 380, r: 17, rest: .9, w: { kontrola: 3, mandaty: 3, wir: 2 },
    idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 70); },
    atk: {
      kontrola: function (e, dt, t) { var k = Math.floor(t / .8); if (once(e, 's', 0)) floatText(e.x, e.y - 70, 'Bilecik do kontroli!', '#fff'); if (k > 2) return true; var lt = t - k * .8; if (lt < .3) { e.vx *= .6; e.vy *= .6; } else if (!e.atD['c' + k]) { e.atD['c' + k] = 1; var a = aimP(e); e.vx = Math.cos(a) * 380; e.vy = Math.sin(a) * 380; } return false; },
      mandaty: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (every(e, 'm', .3, .45) && e.atD.m < 2) bSpread(e, 5, .2, 170, 'ticket', null, 30); return t > 1.3; },
      wir: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (once(e, 'a', .4)) { bRing(e, 10, 130, 'ticket', 0, 30, { curve: 1.2 }); bRing(e, 10, 130, 'ticket', .3, 30, { curve: -1.2 }); } return t > 1.4; }
    }, p2: function (e) { floatText(e.x, e.y - 70, 'Mandat 300 zł!', '#ffb0a0'); bSummon(e, 'golab', 3, 4); },
    draw: function (e) { artHuman(e, { emoji: '👮', sz: 1.6, look: { shirt: '#1d3d6b', pants: '#1d2333', shoes: '#111', hair: '#2a2a2a' }, hand: function () { X.fillStyle = '#e8e8e0'; X.fillRect(9, -16, 9, 6); X.fillStyle = '#c83a2a'; X.fillRect(9, -16, 9, 1.5); } }); } },
  dresSzef: { n: 'Dresiarz Szef', hp: 400, r: 19, rest: 1, w: { szarza: 3, puszki: 2, ziomki: 1, kucanie: 2 },
    idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 60); },
    atk: {
      szarza: function (e, dt, t) { if (t < .5) { e.vx *= .6; e.vy *= .6; return false; } if (once(e, 'a', .5)) { var P = R.P, dx = P.x - e.x, dy = P.y - e.y; if (Math.abs(dx) > Math.abs(dy)) { e.vx = Math.sign(dx) * 400; e.vy = 0; } else { e.vy = Math.sign(dy) * 400; e.vx = 0; } } if ((e.wallHit || e.tileHit) && !e.atD.h) { e.atD.h = 1; shake(7); bRing(e, 12, 140, 'enemy', 0, 10); e.vx = e.vy = 0; sfx('trap'); } return t > 2 || e.atD.h && t > .9; },
      puszki: function (e, dt, t) { e.vx *= .8; e.vy *= .8; var P = R.P; if (every(e, 'p', .3, .3) && e.atD.p < 3) lobShot(e.x, e.y - 40, P.x + rnd(-40, 40), P.y + rnd(-30, 30), .85, 'can', function (s) { for (var i = 0; i < 6; i++) enemyShot(s.x, s.y, i / 6 * TAU, 120, 'enemy', { z: 4 }); sfx('splat'); }); return t > 1.6; },
      ziomki: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (once(e, 'a', .3)) { floatText(e.x, e.y - 70, 'Ziomki!', '#fff'); bSummon(e, 'dres', 2, 3); } return t > .9; },
      kucanie: function (e, dt, t) { e.vx *= .7; e.vy *= .7; e.sc = 1 - Math.min(.15, t * .3); if (once(e, 'a', .6)) { e.sc = 1; bRing(e, 14, 130, 'enemy', 0, 20); bRing(e, 14, 95, 'enemy', PI / 14, 20); sfx('burp'); } return t > 1; }
    },
    draw: function (e) { artHuman(e, { emoji: '😤', sz: 1.75, look: { shirt: '#121214', pants: '#121214', stripes: 1, shoes: '#f4f4f4', hair: '#111' }, hand: function () { X.strokeStyle = '#f0c43a'; X.lineWidth = 2.2; X.beginPath(); X.arc(0, -27, 7, .3, PI - .3); X.stroke(); } }); } },
  // ---------- Rynek II: NUMBERO 4 ----------
  sigeon: { n: 'Sigeon Pex', num: 4, voice: 'sigeon', mus: 'coo', strip: 's_milk', hp: 500, r: 18, fly: 1, rest: .8, w: { mleko: 3, stado: 2, nalot: 2, gru: 2 },
    idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 70); if (e.p2 && rnd01() < dt * 1.5) addCreep(e.x, e.y, 16, 'milk', 4, true); },
    atk: {
      mleko: function (e, dt, t) { e.vx *= .85; e.vy *= .85; if (once(e, 's', 0)) e.atD.a0 = aimP(e, 40) - .8; if (every(e, 'm', .2, .07) && t < 1.6) { var a = e.atD.a0 + (t - .2) / 1.4 * 1.6; enemyShot(e.x, e.y - 40, a, 190, 'milk'); if (e.p2) enemyShot(e.x, e.y - 40, a + PI, 190, 'milk'); } return t > 1.8; },
      stado: function (e, dt, t) { e.vx *= .85; e.vy *= .85; if (once(e, 'a', .3)) { floatText(e.x, e.y - 80, 'Stado, do mnie!', '#fff'); bSummon(e, rnd01() < .5 ? 'golab' : 'golabm', 3, 6); sfx('pigeon'); } return t > 1; },
      nalot: function (e, dt, t) { var P = R.P; if (t < .6) { e.z = t / .6 * 300; e.noTouch = 1; e.invul = .2; steer(e, P.x, P.y, 200, 4, dt); return false; } if (t < 1.3) { e.z = 300; e.invul = .2; steer(e, P.x, P.y, 260, 5, dt); return false; } e.z = Math.max(0, 300 - (t - 1.3) / .25 * 300); if (e.z <= 0 && !e.atD.l) { e.atD.l = 1; e.noTouch = 0; e.vx = e.vy = 0; bRing(e, 12, 150, 'milk', 0, 5); addCreep(e.x, e.y, 34, 'milk', 5, true); shake(9); sfx('trap'); } return t > 1.9; },
      gru: function (e, dt, t) { e.vx *= .85; e.vy *= .85; if (every(e, 'g', .3, .35) && e.atD.g < 3) { bRing(e, 10, 120, 'milk', e.atD.g * .3, 40); sfx('pigeon'); } return t > 1.5; }
    }, p2: function (e) { floatText(e.x, e.y - 80, 'Gru gru. Mleko dla wszystkich!', '#fff'); },
    draw: function (e) { artHuman(e, { face: 'ignaczak', ex: 's', sz: 1.65, fly: true, tears: true, look: { shirt: '#111', pants: '#2a3140', shoes: '#ddd', hair: '#6b5640' }, hat: hatCrown, hand: function () { X.fillStyle = '#f4f4f0'; X.fillRect(-18, -16, 7, 10); X.fillStyle = '#3a8ad8'; X.fillRect(-18, -13, 7, 3); } }); } },
  // ---------- Internat I ----------
  budzikG: { n: 'Budzik Gigant', hp: 560, r: 26, rest: 1, w: { dzwon: 3, skoki: 2, wskazowki: 2 },
    idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 40); e.ring = 0; },
    atk: {
      dzwon: function (e, dt, t) { e.vx *= .7; e.vy *= .7; e.ring = t < 1.6 ? 1 : 0; if (every(e, 'r', .7, .3) && e.atD.r < 3) { bRing(e, 16, 105 + e.atD.r * 15, 'enemy', e.atD.r * PI / 16, 36); sfx('zap'); } return t > 1.8; },
      skoki: function (e, dt, t) { var k = Math.floor(t / 1), lt = t - k; if (k > 2) return true; return bossJump(e, dt, lt, .7, function () { bRing(e, 8, 120, 'enemy', k * .3, 5); }, 'j' + k) && false; },
      wskazowki: function (e, dt, t) { e.vx *= .6; e.vy *= .6; e.ring = 1; if (once(e, 'a', .1)) { var a0 = aimP(e, 36); e.atD.a0 = a0; [0, PI].forEach(function (o) { warnLaser(e.x, e.y - 36, a0 + o, .8, 'boss'); }); }
        if (once(e, 'b', .9)) { e.atD.L = [0, PI].map(function (o) { var L = fireLaser(e.x, e.y - 36, e.atD.a0 + o, 0, 'boss', { enemy: true, dur: 2.6, w: 12, every: .1 }); return L; }); }
        if (e.atD.L) e.atD.L.forEach(function (L, i) { L.a = e.atD.a0 + i * PI + (t - .9) * (e.p2 ? 1.5 : 1.1); L.x = e.x; L.y = e.y - 36; });
        if (t > 3.5) { e.ring = 0; return true; } return false; }
    }, p2: function (e) { bSummon(e, 'budzik', 2, 3); },
    draw: function (e) { artClock(e, { sz: 2.6 }); } },
  // ---------- Internat II: NUMBERO 3 ----------
  simi: { n: 'Simi Simi', num: 3, voice: 'simi', mus: 'simiSong', strip: 's_simi', hp: 680, r: 18, rest: .85, w: { fala: 2, krzesla: 3, poduszki: 1, drzemka: 2 },
    idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 55); e.ex = 'b'; },
    atk: {
      fala: function (e, dt, t) { e.vx *= .7; e.vy *= .7; e.ex = 'z'; if (once(e, 'a', .5)) { floatText(e.x, e.y - 80, 'Simi simi… połóż się ze mną…', '#cfe0ff'); FX.push({ type: 'ring', x: e.x, y: e.y, r: 420, col: 'rgba(160,140,255,.6)', life: 1.2, max: 1.2 }); bRing(e, 12, 80, 'zzz', 0, 40, { life: 5 }); if (!flag('calm') && dist(e.x, e.y, R.P.x, R.P.y) < 260) R.P.yawnT = 2; } return t > 1.4; },
      krzesla: function (e, dt, t) { e.vx *= .8; e.vy *= .8; e.ex = 'n'; var n = e.p2 ? 5 : 3; if (once(e, 's', 0)) floatText(e.x, e.y - 80, (n === 3 ? 'Trzy' : 'Pięć') + ' krzesła to za mało!', '#fff'); if (every(e, 'c', .3, .4) && e.atD.c < n) { var s = enemyShot(e.x, e.y - 40, aimP(e, 40), 230, 'chair', { r: 13 }); sfx('charge', .5); } return t > .4 * n + .6; },
      poduszki: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (once(e, 'a', .3)) bSummon(e, 'poduszka', 2, 4); return t > .9; },
      drzemka: function (e, dt, t) { if (once(e, 'a', 0)) { e.alpha = .2; e.invul = 1; } if (once(e, 'b', .6)) { bTele(e); e.alpha = 1; } if (once(e, 'c', .8)) bSpread(e, 8, .22, 150, 'enemy', null, 40); return t > 1.2; }
    }, p2: function (e) { floatText(e.x, e.y - 80, 'Nie chcę wstawać!', '#fff'); },
    draw: function (e) { artHuman(e, { face: 'ignaczak', sz: 1.65, look: { shirt: '#7fb2e5', pants: '#2b2b33', shoes: '#f5f5f5', hair: '#6b5640' }, hat: hatNightcap }); } },
  // ---------- Piwnica I ----------
  duchW: { n: 'Duch Woźnego', hp: 760, r: 22, fly: 1, rest: .9, w: { mop: 3, klucze: 2, zanik: 2, szczury: 1 },
    idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 55); if (rnd01() < dt * 1.2) addCreep(e.x, e.y, 18, 'water', 4, true); },
    atk: {
      mop: function (e, dt, t) { e.vx *= .85; e.vy *= .85; if (every(e, 'm', .2, .09) && t < 2.1) { var a = t * 4.2; enemyShot(e.x, e.y - 30, a, 150, 'water'); enemyShot(e.x, e.y - 30, a + PI, 150, 'water'); } return t > 2.3; },
      klucze: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (every(e, 'k', .3, .4) && e.atD.k < 3) bSpread(e, 3, .3, 180, 'key', null, 30); return t > 1.5; },
      zanik: function (e, dt, t) { if (once(e, 'a', 0)) { e.phase = true; } if (t < 1.4) { steer(e, R.P.x + 90 * Math.cos(t * 3), R.P.y + 60 * Math.sin(t * 3), 180, 3, dt); return false; } if (once(e, 'b', 1.4)) { e.phase = false; bRing(e, 10, 140, 'water', 0, 30); } return t > 1.8; },
      szczury: function (e, dt, t) { if (once(e, 'a', .3)) bSummon(e, 'szczur', 2, 4); return t > .8; }
    }, p2: function (e) { floatText(e.x, e.y - 80, 'Kto tu nabrudził?!', '#fff'); bSummon(e, 'szczur', 2, 4); },
    draw: function (e) { artGhost(e, { sz: 2.1, mop: 1 }); } },
  // ---------- Piwnica II: NUMBERO 2 ----------
  scary: { n: 'Scary Igyatczak', num: 2, voice: 'scaryV', mus: 'scaryFx', strip: 's_hug', hp: 950, r: 19, rest: .8, w: { przytulas: 3, ciemnosc: 2, krzyk: 2, cienie: 1 },
    idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 70); },
    atk: {
      przytulas: function (e, dt, t) { if (t < .7) { e.vx *= .6; e.vy *= .6; e.arms = t / .7; return false; } if (once(e, 'a', .7)) { var a = aimP(e); e.vx = Math.cos(a) * 470; e.vy = Math.sin(a) * 470; sfx('charge'); } if (t > 1.2) { e.arms = 0; e.vx *= .8; e.vy *= .8; } return t > 1.5; },
      ciemnosc: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (once(e, 'a', 0)) { R.darkT = 2.6; floatText(e.x, e.y - 80, 'Boisz się ciemności?', '#ffb0b0'); } if (once(e, 'b', .5)) bTele(e); if (t > .8 && every(e, 's', .8, .08) && t < 2.6) { var arms = e.p2 ? 3 : 2; for (var i = 0; i < arms; i++) enemyShot(e.x, e.y - 40, t * 3 + i * TAU / arms, 140, 'dark'); } return t > 2.8; },
      krzyk: function (e, dt, t) { e.vx *= .7; e.vy *= .7; if (once(e, 'a', .5)) { bRing(e, 16, 150, 'dark', 0, 40); bRing(e, 16, 110, 'dark', PI / 16, 40); shake(10); vox('scaryV', { vol: .7, rate: .8 }); } return t > 1.1; },
      cienie: function (e, dt, t) { if (once(e, 'a', .3)) { floatText(e.x, e.y - 80, 'Nikt nie wychodzi z piwnicy.', '#ffb0b0'); bSummon(e, 'duch', 2, 3); } return t > .9; }
    }, p2: function (e) { R.darkT = 1.5; },
    draw: function (e) {
      drawDarkAura(e.ix, e.iy - 40, 90, .55);
      if (e.arms > 0) { X.save(); X.strokeStyle = '#0a0a0a'; X.lineCap = 'round'; X.lineWidth = 7; var a = aimP(e); [-1, 1].forEach(function (s) { X.beginPath(); X.moveTo(e.ix + s * 16, e.iy - 40); X.lineTo(e.ix + s * 16 + Math.cos(a + s * .35) * 55 * e.arms, e.iy - 40 + Math.sin(a + s * .35) * 55 * e.arms); X.stroke(); }); X.restore(); }
      artHuman(e, { face: 'ignaczak', ex: 'k', sz: 1.8, look: { shirt: '#0a0a0a', pants: '#0a0a0a', shoes: '#111', hair: '#1a1a1a', skin: '#c8c0c0' } });
      X.save(); X.globalCompositeOperation = 'lighter'; X.fillStyle = 'rgba(255,40,40,' + (.4 + Math.sin(GAME.t * 8) * .2) + ')'; X.beginPath(); X.arc(e.ix - 7, e.iy - 78, 3, 0, TAU); X.arc(e.ix + 9, e.iy - 79, 3, 0, TAU); X.fill(); X.restore();
    } },
  // ---------- Olimp: NUMBERO 1 ----------
  greek: { n: 'Greek Igyatczak', num: 1, voice: 'greekV', mus: 'greekMusic', strip: 's_greek', hp: 1700, r: 22, rest: .8, w: { piorun: 3, medal: 2, fala: 3, posagi: 1 }, w2: { piorun: 2, medal: 2, fala: 2, krzyz: 3, deszcz: 2 },
    idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 60); },
    atk: {
      piorun: function (e, dt, t) { e.vx *= .8; e.vy *= .8; var n = e.p2 ? 6 : 4; if (every(e, 'p', .2, .45) && e.atD.p < n) { var P = R.P, x = P.x + P.vx * .3, y = P.y + P.vy * .3; fallObj(x, y, 'bolt', function () { explodeAt(x, y, 34, 0, { small: 1, noPlayer: 1 }); if (dist(x, y, R.P.x, R.P.y) < 36) damagePlayer(hurtAmount(), 'greek'); for (var i = 0; i < 4; i++) enemyShot(x, y, i * PI / 2 + PI / 4, 110, 'gold', { z: 4 }); }, .7); } return t > .45 * n + .8; },
      medal: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (once(e, 'a', .3)) { var s = enemyShot(e.x, e.y - 50, aimP(e, 50), 330, 'medal', { r: 14, accel: -300, life: 3.2 }); s.boomer = 1; if (e.p2) { var s2 = enemyShot(e.x, e.y - 50, aimP(e, 50) + .6, 330, 'medal', { r: 14, accel: -300, life: 3.2 }); } } return t > 1.4; },
      fala: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (every(e, 'f', .3, .35) && e.atD.f < 3) bRing(e, e.p2 ? 18 : 14, 120, 'gold', e.atD.f * .25, 50); return t > 1.5; },
      posagi: function (e, dt, t) { if (once(e, 'a', .3)) bSummon(e, 'posag', 2, 2); return t > .9; },
      krzyz: function (e, dt, t) { e.vx *= .6; e.vy *= .6; if (once(e, 'a', .1)) { e.atD.a0 = rnd(0, 1); for (var i = 0; i < 4; i++) warnLaser(e.x, e.y - 50, e.atD.a0 + i * PI / 2, .8, 'gold'); }
        if (once(e, 'b', .9)) e.atD.L = [0, 1, 2, 3].map(function (i) { return fireLaser(e.x, e.y - 50, e.atD.a0 + i * PI / 2, 0, 'gold', { enemy: true, dur: 2.8, w: 12, every: .1 }); });
        if (e.atD.L) e.atD.L.forEach(function (L, i) { L.a = e.atD.a0 + i * PI / 2 + (t - .9) * .9; L.x = e.x; L.y = e.y - 50; }); return t > 3.8; },
      deszcz: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (every(e, 'd', .2, .12) && t < 2.4) { var x = rnd(30, R.room.w - 30), y = rnd(30, R.room.h - 30); lobShot(x, -20, x, y, .8, 'gold', function (s) { fxSplash(s.x, s.y, 'gold'); if (dist(s.x, s.y, R.P.x, R.P.y) < 18) damagePlayer(hurtAmount(), 'greek'); }); } return t > 2.8; }
    }, p2: function (e) { floatText(e.x, e.y - 90, 'HAPPY MEAL MNIE WZMACNIA!', '#ffe08a'); e.w = BOSSES.greek.w2; e.hp = Math.min(e.maxHp, e.hp + e.maxHp * .06); fxFlash('rgba(255,215,90,.4)'); sfx('jackpot'); bSummon(e, 'posag', 1, 2); },
    draw: function (e) {
      X.save(); X.globalCompositeOperation = 'lighter'; var g = X.createRadialGradient(e.ix, e.iy - 50, 5, e.ix, e.iy - 50, 80); g.addColorStop(0, 'rgba(255,220,120,' + (e.p2 ? .45 : .3) + ')'); g.addColorStop(1, 'rgba(255,200,80,0)'); X.fillStyle = g; X.beginPath(); X.arc(e.ix, e.iy - 50, 80, 0, TAU); X.fill(); X.restore();
      artHuman(e, { face: 'ignaczak', ex: 'm', sz: 2, look: { shirt: '#f4efe2', pants: '#e8e0d0', shoes: '#c9a54a', hair: '#d8d0c2', skin: '#ece6da' }, hat: laurelHat, hand: function () { X.fillStyle = '#f0c43a'; X.beginPath(); X.arc(0, -19, 4.5, 0, TAU); X.fill(); X.fillStyle = '#7a5a10'; X.font = 'bold 6px sans-serif'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('1', 0, -18.6); } });
    } }
};
// skok bossa (łuk w powietrzu, lądowanie z falą)
function bossJump(e, dt, t, T, onLand, key) {
  key = key || 'j'; var P = R.P;
  if (!e.atD[key + 's']) { e.atD[key + 's'] = 1; var a = angTo(e.x, e.y, P.x, P.y), d = Math.min(220, dist(e.x, e.y, P.x, P.y)); e.jvx = Math.cos(a) * d / T; e.jvy = Math.sin(a) * d / T; }
  if (t < T) { e.z = Math.sin(t / T * PI) * 80; e.vx = e.jvx; e.vy = e.jvy; e.noTouch = 1; return false; }
  if (!e.atD[key + 'l']) { e.atD[key + 'l'] = 1; e.z = 0; e.vx = e.vy = 0; e.noTouch = 0; shake(8); sfx('trap'); onLand(); if (dist(e.x, e.y, P.x, P.y) < e.r + 30) damagePlayer(hurtAmount(), e.boss); }
  return t > T + .35;
}
function spawnBoss(id, x, y) {
  var B = BOSSES[id], e = spawnMob('golab', x, y, { boss: id, noAnim: true }); e.t = id; e.D = { n: B.n, r: B.r, art: 'boss' }; e.r = B.r; e.fly = !!B.fly;
  var mul = 1 + Math.max(0, R.loops || 0) * .5; e.hp = e.maxHp = B.hp * mul; e.st = 'idle'; e.stT = 1.6; e.at = null; e.room = R.room; e.heavy = 1; e.hitOff = 26 * (B.r / 18); e.w = B.w; e.anim = 0;
  return e;
}
function bossUpdate(e, dt) {
  var B = BOSSES[e.boss];
  if (!e.p2 && B.p2 && e.hp < e.maxHp * .5) { e.p2 = true; B.p2(e); }
  if (e.stun > 0 || e.sleep > 0 || e.frozen > 0) { e.vx *= .85; e.vy *= .85; return; }
  var sm = mobSpd(e);
  if (e.at) { e.atT += dt * sm; if (B.atk[e.at](e, dt, e.atT, sm)) { e.at = null; e.stT = B.rest * (e.p2 ? .7 : 1) * rnd(.8, 1.2); e.armor = 0; e.noTouch = 0; e.z = 0; e.alpha = e.alpha === 0 ? 1 : e.alpha; e.phase = false; } }
  else {
    B.idle(e, dt, sm); e.stT -= dt * sm;
    if (e.stT <= 0) { var W = e.w || B.w, list = Object.keys(W).filter(function (k) { return k !== e.lastAt || Object.keys(W).length < 2; }); var name = pickW(list.map(function (k) { return [k, W[k]]; })); e.lastAt = name; e.at = name; e.atT = 0; e.atD = {}; }
  }
  var max = 520; e.vx = clamp(e.vx, -max, max); e.vy = clamp(e.vy, -max, max);
}
function pickW(list) { var s = 0; list.forEach(function (l) { s += l[1]; }); var r = rnd01() * s; for (var i = 0; i < list.length; i++) { r -= list[i][1]; if (r <= 0) return list[i][0]; } return list[0][0]; }
function drawBoss(e) { var B = BOSSES[e.boss]; X.save(); if (e.alpha != null) X.globalAlpha *= e.alpha; if (e.phase) X.globalAlpha *= .3; var z = e.z || 0; if (z > 0) { shadow(e.ix, e.iy + 3, e.r * (1 - Math.min(.6, z / 400)), e.r * .4, .3); X.translate(0, -z); } B.draw(e); X.restore(); }
// dodatkowe pociski bossów
var TEARDRAW = {
  zzz: function (t, x, y) { X.save(); X.font = 'bold ' + (t.r * 2.2) + 'px Georgia'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#cfe0ff'; X.strokeStyle = '#3a3a8a'; X.lineWidth = 2.5; X.strokeText('Z', x, y); X.fillText('Z', x, y); X.restore(); },
  chair: function (t, x, y) { X.save(); X.translate(x, y); X.rotate(GAME.t * 9 + t.id); X.scale(.7, .7); X.fillStyle = '#5a6a7a'; X.fillRect(-10, -4, 2.5, 13); X.fillRect(7.5, -4, 2.5, 13); X.fillStyle = '#c8924a'; rr(-12, -8, 24, 6, 2); X.fill(); X.fillStyle = '#5a6a7a'; X.fillRect(-10, -26, 2.5, 20); X.fillRect(7.5, -26, 2.5, 20); X.fillStyle = '#b8823e'; rr(-11, -28, 22, 10, 3); X.fill(); X.restore(); },
  medal: function (t, x, y) { X.save(); X.translate(x, y); X.rotate(GAME.t * 12); X.fillStyle = '#f0c43a'; X.beginPath(); X.arc(0, 0, t.r, 0, TAU); X.fill(); X.strokeStyle = '#8a6a10'; X.lineWidth = 2; X.stroke(); X.fillStyle = '#7a5a10'; X.font = 'bold ' + (t.r * 1.2) + 'px Georgia'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('1', 0, 1); X.restore(); },
  key: function (t, x, y) { X.save(); X.translate(x, y); X.rotate(GAME.t * 10 + t.id); drawKey(0, 0, 8, false); X.restore(); }
};
TEARCOL.web = ['#ffffff', '#ececec', '#a8a8a8']; TEARCOL.water = ['#e8f6ff', '#6ab8ff', '#2a6ab8']; TEARCOL.chair = TEARCOL.enemy;

// ---- 20_story.js ----
// ===================== FABUŁA: Matka Ignaczaka, dwa listy, ścieżka PRL, zakończenia =====================
// Szymon zasnął na lekcji historii nad rozdziałem „Lata 70. – propaganda sukcesu”. Im głębiej w koszmar,
// tym więcej w nim PRL-u z podręcznika. Na dnie Piwnicy czeka Matka, a po niej – dwa listy.
FLOORS[4].bosses = ['budzikG', 'duchW'];
FLOORS[6].bosses = ['scary']; FLOORS[6].numbero = 2;
FLOORS[7].bosses = ['matka']; delete FLOORS[7].numbero;
FLOORS[9] = { n: 'Kolejka', ch: 'kolejka', theme: 'kolejka', mus: 'rynek', bosses: ['kanar', 'dresSzef'] };
FLOORS[10] = { n: 'Kombinat', ch: 'kombinat', theme: 'kombinat', mus: 'piwnica', bosses: ['sekretarz'], last: 1, dark: 1 };
MOBPOOL.kolejka = [['petent', 4], ['menel', 2], ['dres', 2], ['nozownik', 2], ['golab', 2], ['plujka', 1]];
MOBPOOL.kombinat = [['petent', 2], ['dres', 2], ['szczur', 3], ['nietoperz', 2], ['nozownik', 1], ['spioch', 1], ['duch', 1]];
THEMES.kolejka = { floor: 'tiles', fa: '#8a8478', fb: '#7a7468', grout: '#4a463e', wallA: '#9a8e6e', wallB: '#7a6e52', wallLow: '#5a3a2a', trim: '#2a1a12', side: '#5e5440', vign: .76, tint: 'rgba(200,180,120,.06)' };
THEMES.kombinat = { floor: 'concrete', fa: '#5a5650', fb: '#4e4a44', grout: '#2e2a26', wallA: '#6a4a3a', wallB: '#4a3428', wallLow: '#3a2418', trim: '#1a0e08', side: '#3e2a1e', vign: .82, tint: 'rgba(255,90,20,.08)' };

// ---------- wspólne: spadające rzeczy z cieniem (kapcie, kartki) ----------
function stompAdd(e, x, y, kind) { (e.stomps = e.stomps || []).push({ x: clamp(x, 24, R.room.w - 24), y: clamp(y, 24, R.room.h - 24), t: 0, kind: kind || 'kapec' }); }
function stompUpd(e, dt) {
  (e.stomps || []).forEach(function (s) {
    s.t += dt;
    if (s.t >= .9 && !s.hit) {
      s.hit = 1; var big = s.kind === 'kapec', rad = big ? 46 : 28; shake(big ? 9 : 4); sfx(big ? 'boom' : 'splat', big ? .7 : .4);
      livePlayers().forEach(function (p) { if (dist(p.x, p.y, s.x, s.y) < rad + p.r) withPlayer(p, function () { damagePlayer(hurtAmount(), s.kind); }); });
      var n = big ? 6 : 4; for (var i = 0; i < n; i++) enemyShot(s.x, s.y - 6, i / n * TAU + (big ? 0 : PI / 4), big ? 125 : 105, big ? 'enemy' : 'ticket');
      for (var k = 0; k < 8; k++) fxPart(s.x, s.y, rnd(-120, 120), rnd(-140, -20), big ? '#c84a7a' : '#fff6c8', rnd(3, 6), rnd(.3, .7), 1);
    }
  });
  e.stomps = (e.stomps || []).filter(function (s) { return s.t < 1.4; });
}
function stompDraw(e) {
  (e.stomps || []).forEach(function (s) {
    var big = s.kind === 'kapec', k = Math.min(1, s.t / .9), rad = big ? 46 : 28;
    X.fillStyle = 'rgba(0,0,0,' + (.15 + k * .35) + ')'; X.beginPath(); X.ellipse(s.x, s.y, rad * (.4 + k * .6), rad * .45 * (.4 + k * .6), 0, 0, TAU); X.fill();
    if (s.t > .55) { var fall = s.t < .9 ? (1 - (s.t - .55) / .35) * -170 : 0, al = s.t > 1.05 ? Math.max(0, 1 - (s.t - 1.05) / .35) : 1;
      drawSpr(big ? 'slipper' : 'card', s.x, s.y - 8 + fall, big ? 64 : 16, big ? '#c84a7a' : '#fff6c8', big ? '#f4f0e8' : '#d8302a', al); }
  });
}

// ---------- MATKA IGNACZAKA ----------
BOSSES.matka = { n: 'Matka Ignaczaka', hp: 1150, r: 30, rest: .95, w: { kapec: 3, lyzka: 2, oczy: 2, krzyk: 1 }, w2: { kapec: 3, lyzka: 3, oczy: 2, krzyk: 1 },
  p2: function (e) { floatText(e.x, e.y + 30, 'SZYMOOON!!!', '#ff6a6a'); shake(14); },
  idle: function (e, dt) { e.x = R.room.w / 2; e.y = 46; e.vx = e.vy = 0; stompUpd(e, dt); },
  atk: {
    kapec: function (e, dt, t) {
      e.x = R.room.w / 2; e.y = 46; e.vx = e.vy = 0; stompUpd(e, dt); var n = e.p2 ? 4 : 3;
      if (every(e, 'k', .1, .55) && e.atD.k < n) { var P = R.P; stompAdd(e, P.x + P.vx * .35, P.y + P.vy * .35, 'kapec'); }
      return t > .55 * n + 1;
    },
    lyzka: function (e, dt, t) {
      e.x = R.room.w / 2; e.y = 46; e.vx = e.vy = 0; stompUpd(e, dt);
      if (once(e, 'a', .1)) { var P = R.P, left = rnd01() < .5; e.hand = { left: left, y: P.y, t: 0 }; bLaserWarn({ x: left ? 2 : R.room.w - 2, y: P.y + 10, dead: false, room: R.room }, left ? 0 : PI, .75, .35, 10, 22); }
      if (e.p2 && once(e, 'b', .9)) { var P2 = R.P; bLaserWarn({ x: R.room.w / 2 + rnd(-120, 120), y: 4, dead: false, room: R.room }, PI / 2, .75, .35, 0, 22); }
      if (e.hand) e.hand.t += dt;
      if (t > 1.5) { e.hand = null; return true; } return false;
    },
    oczy: function (e, dt, t) { e.x = R.room.w / 2; e.y = 46; e.vx = e.vy = 0; stompUpd(e, dt); if (every(e, 'o', .25, .5) && e.atD.o < (e.p2 ? 4 : 3)) { bSpread(e, 5, .2, 175, 'enemy', null, 0); sfx('shoot', .5); } return t > 2; },
    krzyk: function (e, dt, t) { e.x = R.room.w / 2; e.y = 46; e.vx = e.vy = 0; stompUpd(e, dt); if (once(e, 'a', .2)) { floatText(e.x, e.y + 40, 'SZYMON!', '#ff6a6a'); shake(10); bRing(e, 16, 120, 'enemy', 0, 0); bSummon(e, 'karaluch', 2, 4); } return t > 1.2; }
  },
  draw: function (e) {
    var x = e.ix, y = e.iy, f = e.flash > 0, P = R.P;
    // włosy i czoło wystające zza górnej ściany
    X.fillStyle = '#3a2418'; X.beginPath(); X.ellipse(x, y - 36, 92, 30, 0, 0, TAU); X.fill();
    X.fillStyle = f ? '#ffb0a0' : '#d8a888'; X.beginPath(); X.ellipse(x, y - 12, 80, 24, 0, PI, TAU); X.fill();
    [-1, 1].forEach(function (s) {
      var ex = x + s * 34, ey = y - 10, a = angTo(ex, ey, P.ix, P.iy);
      X.fillStyle = '#f4ece0'; X.beginPath(); X.ellipse(ex, ey, 22, 13, 0, 0, TAU); X.fill();
      X.strokeStyle = 'rgba(200,40,40,.7)'; X.lineWidth = 1; for (var v = 0; v < 3; v++) { X.beginPath(); X.moveTo(ex + s * 20, ey - 4 + v * 4); X.lineTo(ex + s * 10, ey - 2 + v * 3); X.stroke(); }
      X.fillStyle = '#5a3a1a'; X.beginPath(); X.arc(ex + Math.cos(a) * 9, ey + Math.sin(a) * 5, 7, 0, TAU); X.fill();
      X.fillStyle = '#050303'; X.beginPath(); X.arc(ex + Math.cos(a) * 10, ey + Math.sin(a) * 5.5, 3.5, 0, TAU); X.fill();
      X.strokeStyle = '#2a1810'; X.lineWidth = 4; X.beginPath(); X.moveTo(ex - 20, ey - 16 - (e.at === 'krzyk' ? 6 : 0) * s); X.lineTo(ex + 20, ey - 16 + (e.at === 'krzyk' ? 6 : 0) * s); X.stroke();
    });
    if (e.hand) { var hx = e.hand.left ? Math.min(-WS + e.hand.t * 300, 40) : Math.max(R.room.w + WS - e.hand.t * 300, R.room.w - 40); X.fillStyle = '#d8a888'; X.fillRect(e.hand.left ? -WS : hx, e.hand.y - 6, e.hand.left ? hx + WS : R.room.w + WS - hx, 12); drawSpr('tool', hx + (e.hand.left ? 10 : -10), e.hand.y - 4, 26, '#c8a070', null, null, e.hand.left ? -.8 : .8); }
    stompDraw(e);
  } };

// ---------- TOWARZYSZ PIERWSZY SEKRETARZ (fikcyjna postać ze snu) ----------
BOSSES.sekretarz = { n: 'Towarzysz Pierwszy Sekretarz', hp: 1600, r: 22, rest: .85, w: { machanie: 3, megafon: 2, transparent: 2, kartki: 2, petenci: 1 }, w2: { machanie: 3, megafon: 3, transparent: 2, kartki: 3, petenci: 1 },
  p2: function (e) { floatText(e.x, e.y - 90, 'PLAN WYKONANY W 200%!', '#ffe08a'); shake(12); },
  idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 35); if (e.y > R.room.h * .55) e.vy -= 60 * dt; stompUpd(e, dt); },
  atk: {
    machanie: function (e, dt, t) { e.vx *= .8; e.vy *= .8; stompUpd(e, dt); e.wave = t; if (every(e, 'm', .25, .45) && e.atD.m < 3) { bSpread(e, e.p2 ? 9 : 7, .17, 165, 'gold', null, 50); sfx('shoot', .5); } return t > 1.8; },
    megafon: function (e, dt, t) { e.vx *= .8; e.vy *= .8; stompUpd(e, dt); if (every(e, 'g', .3, .4) && e.atD.g < 3) { bRing(e, 16, 115, 'enemy', e.atD.g * .2, 40); sfx('zap', .4); } return t > 1.7; },
    transparent: function (e, dt, t) {
      e.vx *= .8; e.vy *= .8; stompUpd(e, dt);
      if (once(e, 'a', .1)) { floatText(e.x, e.y - 90, 'SUKCES!', '#ff4a3a'); var P = R.P; bLaserWarn({ x: 2, y: P.y + 10, dead: false, room: R.room }, 0, .8, .4, 10, 26); if (e.p2) bLaserWarn({ x: P.x, y: 4, dead: false, room: R.room }, PI / 2, .8, .4, 0, 26); }
      return t > 1.5;
    },
    kartki: function (e, dt, t) { e.vx *= .8; e.vy *= .8; stompUpd(e, dt); var n = e.p2 ? 9 : 6; if (every(e, 'k', .1, .22) && e.atD.k < n) { var P = R.P; stompAdd(e, P.x + rnd(-70, 70), P.y + rnd(-50, 50), 'kartka'); } return t > .22 * n + 1.2; },
    petenci: function (e, dt, t) { e.vx *= .8; e.vy *= .8; stompUpd(e, dt); if (once(e, 'a', .3)) { floatText(e.x, e.y - 90, 'Pomożecie?', '#fff'); bSummon(e, 'petent', 3, 5); } return t > 1.2; }
  },
  draw: function (e) {
    var x = e.ix, y = e.iy;
    // trybuna z czerwonym suknem
    X.fillStyle = '#7a1410'; X.fillRect(x - 40, y - 14, 80, 22); X.fillStyle = '#f0c43a'; X.fillRect(x - 40, y - 14, 80, 3); X.fillStyle = '#5a0e0a'; X.fillRect(x - 40, y + 5, 80, 3);
    X.fillStyle = '#ffe08a'; X.font = '8px sans-serif'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('SUKCES', x, y - 3);
    var wave = e.at === 'machanie' ? Math.sin((e.wave || 0) * 14) * .5 : Math.sin(GAME.t * 2) * .2;
    artHuman(e, { emoji: '\uE3F1', sz: 1.75, look: { shirt: '#2a2a2e', jacket: '#1a1a1e', pants: '#1a1a1e', shoes: '#111', hair: '#9a9a9a' },
      hand: function () { X.save(); X.translate(12, -26); X.rotate(-1.2 + wave); X.fillStyle = '#1a1a1e'; X.fillRect(-3, -14, 6, 14); X.fillStyle = '#e2c4a8'; X.beginPath(); X.ellipse(0, -17, 4.5, 5.5, 0, 0, TAU); X.fill(); X.restore(); } });
    stompDraw(e);
  } };

// ---------- po Matce: dwa listy ----------
u3item('listCzerwony', 'Czerwony list', 'letter', '#d8302a', null, 4, [], 'Z pieczęcią Komitetu i portretem Sekretarza. Prowadzi głębiej w PRL ze snu.');
u3item('listSzary', 'Szary list', 'letter', '#9a948a', null, 4, [], 'Wypadł z podręcznika. Prowadzi na Olimp.');
var _bossDefeatedS = bossDefeated;
bossDefeated = function (e) {
  if (e.boss === 'sekretarz' && !PROF.unl.sekretarz) { PROF.unl.sekretarz = 1; saveProf(); later(2.2, function () { toast('🔓 Odblokowano!', UNLOCKS.sekretarz.give); }, true); }
  if (e.boss !== 'matka') return _bossDefeatedS(e);
  var rm = R.room, cx = rm.w / 2, cy = rm.h / 2 + 10; sfx('bossdie'); shake(16); GAME.slowmo = 1; fxFlash('rgba(255,255,255,.55)', .6); BOSSBAR.e = null; music(null);
  for (var i = 0; i < 30; i++) fxPart(e.x, e.y, rnd(-260, 260), rnd(-80, 260), pick(['#c84a7a', '#d8a888', '#f4ece0']), rnd(4, 9), rnd(.6, 1.4), 1);
  ENTS.forEach(function (m) { if (m.summoned && !m.dead) { m.dead = true; fxPoof(m.x, m.y - 10, '#aaa'); } });
  TEARS.forEach(function (t) { if (t.enemy) t.life = 0; }); e.stomps = [];
  PROF.bossKills.matka = (PROF.bossKills.matka || 0) + 1;
  if (!PROF.unl.matka) { PROF.unl.matka = 1; later(2.2, function () { toast('🔓 Odblokowano!', UNLOCKS.matka.give); }, true); } saveProf();
  rm.dupDone = 1; // listy nigdy nie są podwójne – wybór jest jeden dla całej drużyny
  rm.peds.push({ x: cx - 70, y: cy, item: 'listCzerwony', pool: 'boss', cd: 1.5, appear: 1, choice: 77 }, { x: cx + 70, y: cy, item: 'listSzary', pool: 'boss', cd: 1.5, appear: 1, choice: 77 });
  var hp = mkPick('heart', 'full', cx, cy + 60); hp.vz = 140; hp.spawnT = .3; rm.picks.push(hp);
  later(1.6, function () { banner('Dwa listy', 'Weź jeden. Drugi spłonie.', '#ffe08a', 3.2); }, true);
};
var _giveItemS = giveItem;
giveItem = function (id, quiet) {
  _giveItemS(id, quiet);
  if (id !== 'listCzerwony' && id !== 'listSzary') return;
  var rm = R.room, red = id === 'listCzerwony'; R.path = red ? 'red' : 'grey'; R.nextFi = red ? 9 : 8;
  rm.peds.forEach(function (q) { if (q.choice === 77 && q.item && q.item !== id) { fxPoof(q.x, q.y - 26, '#ff8a2a'); q.item = null; } });
  var tp = nearFree(rm, rm.w / 2, rm.h / 2 + 70); rm.trap = { x: tp[0], y: tp[1], t: -.8 };
  later(1.4, function () { banner(red ? 'Czerwony list' : 'Szary list', red ? '„Stawić się w Kolejce. Towarzysz czeka.”' : '„Rozdział 1: Mity greckie. Strona 1.”', red ? '#ff6a5a' : '#d8d0c4', 3.4); }, true);
  later(2.2, function () { music(R.floor.def.mus); }, true);
};
// zakończenia
var ENDINGS = {
  red: ['Wielki Sukces', 'Szymon budzi się z nosem w podręczniku. Nauczyciel pyta o lata 70. – a on zna każdą odpowiedź, każdą datę i każdy slogan. Klasa patrzy z niedowierzaniem. Tylko w kieszeni coś szeleści: czerwony list z pieczęcią, którego nikt mu nie dał…'],
  grey: ['Pobudka', 'Szymon budzi się w szkolnej łazience. Wszystko było snem: Matka, kapcie, Olimp. Wszystko… prawie. W kieszeni ma szary list wyrwany z podręcznika do historii.']
};
var _showWinS = showWin;
showWin = function (u) {
  _showWinS(u);
  var E = ENDINGS[R && R.path] || ENDINGS.grey, boxes = document.querySelectorAll('.box'), b = boxes[boxes.length - 1];
  if (b) { var p = document.createElement('p'); p.innerHTML = '<b style="color:#ffe08a">Zakończenie: ' + E[0] + '</b><br>' + E[1]; b.insertBefore(p, b.children[1] || null); }
};
if (window.__G) window.__G.ENDINGS = ENDINGS;

// ---- 19_update.js ----
// ===================== UPDATE 3.0: łzy i kupa, Pocket, puszki Dzika, zielsko, łazienka nr 20 =====================
var U3 = { code: 0xE201 };
function u3icon(spr, col, col2) { var e = String.fromCharCode(U3.code++); EMO2SPR[e] = [spr, col, col2]; return e; }
function u3item(id, n, spr, col, col2, q, pool, d, extra) { ITEMS[id] = Object.assign({ n: n, e: u3icon(spr, col, col2), q: q, pool: pool, d: d }, extra || {}); }
EMO2SPR['🚽'] = ['toilet'];
EMO2SPR['\uE3F1'] = ['h_sekretarz']; EMO2SPR['\uE3F2'] = ['h_petent'];

// ---------- 1. ŁZY: kolorowe, różnorodne, ze smugą ----------
Object.assign(TEARCOL, {
  poop: ['#d8b07a', '#7a4a22', '#3a200c'], pee: ['#fffbd0', '#f0d83a', '#a8901a'], weed: ['#e8ffd8', '#7ad23a', '#2f6a20'],
  soap: ['#ffffff', '#f8c8e8', '#c888b8'], ghost: ['#ffffff', '#b8f0ff', '#5ab8d8'], rubber: ['#ffd0c8', '#e8503a', '#8a1a10']
});
TEARDRAW.poop = function (t, x, y) {
  var r = t.r; X.save(); X.translate(x, y); X.rotate((t.id || 0) * .7 + GAME.t * 3);
  var c = TEARCOL.poop; X.fillStyle = c[2]; X.beginPath(); X.arc(0, r * .15, r * 1.02, 0, TAU); X.fill();
  X.fillStyle = c[1]; [[-.35, .1, .62], [.35, .15, .58], [0, -.35, .55]].forEach(function (b) { X.beginPath(); X.arc(b[0] * r, b[1] * r, b[2] * r, 0, TAU); X.fill(); });
  X.fillStyle = c[0]; X.beginPath(); X.arc(-r * .25, -r * .45, r * .22, 0, TAU); X.fill(); X.restore();
};
TEARDRAW.weed = function (t, x, y) {
  var r = t.r; X.save(); X.translate(x, y);
  for (var i = 0; i < 4; i++) { var a = (t.id || 0) + i * 1.7 + GAME.t * 2, d = r * .45; X.globalAlpha = .55; X.fillStyle = i % 2 ? '#7ad23a' : '#a8e86a'; X.beginPath(); X.arc(Math.cos(a) * d, Math.sin(a) * d, r * .7, 0, TAU); X.fill(); }
  X.globalAlpha = .9; X.fillStyle = '#2f6a20'; X.beginPath(); X.arc(0, 0, r * .45, 0, TAU); X.fill(); X.restore();
};
TEARDRAW.rainbow = function (t, x, y) {
  var r = t.r, h = (GAME.t * 260 + (t.id || 0) * 47) % 360; X.save(); X.translate(x, y);
  X.globalCompositeOperation = 'lighter'; X.fillStyle = 'hsla(' + h + ',100%,60%,.35)'; X.beginPath(); X.arc(0, 0, r * 1.7, 0, TAU); X.fill();
  X.globalCompositeOperation = 'source-over'; X.fillStyle = 'hsl(' + h + ',95%,58%)'; X.beginPath(); X.arc(0, 0, r, 0, TAU); X.fill();
  X.fillStyle = 'rgba(255,255,255,.8)'; X.beginPath(); X.ellipse(-r * .35, -r * .38, r * .28, r * .18, -.6, 0, TAU); X.fill(); X.restore();
};
TEARDRAW.soap = function (t, x, y) {
  var r = t.r * 1.1; X.save(); X.translate(x, y); X.fillStyle = 'rgba(248,200,232,.28)'; X.beginPath(); X.arc(0, 0, r, 0, TAU); X.fill();
  X.strokeStyle = 'rgba(255,255,255,.85)'; X.lineWidth = 1.4; X.stroke(); X.strokeStyle = 'hsla(' + ((GAME.t * 200) % 360) + ',90%,70%,.7)'; X.beginPath(); X.arc(0, 0, r * .8, -.4, 1.2); X.stroke();
  X.fillStyle = '#fff'; X.beginPath(); X.arc(-r * .35, -r * .35, r * .18, 0, TAU); X.fill(); X.restore();
};
// wygląd łzy wynika z przedmiotów gracza (sam efekt dalej działa po staremu)
function tearLook(P) {
  var f = P.fl || {}, n = 0; ['fire', 'ice', 'poison', 'homing', 'spectral', 'stun', 'bounce', 'grow', 'weed', 'uranus'].forEach(function (k) { if (f[k]) n++; });
  if (P.trans && P.trans.zjarany || n >= 5) return 'rainbow';
  if (CHARS[P.ch].poop || f.poopTears || P.trans && P.trans.kupiarz) return 'poop';
  if (f.weed) return 'weed'; if (f.soap) return 'soap'; if (f.homing) return 'dark'; if (f.spectral) return 'ghost';
  if (f.fire) return 'fire'; if (f.ice || f.uranus) return 'ice'; if (f.poison) return 'poison'; if (f.stun) return 'zap';
  if (f.bounce) return 'rubber'; if (f.grow || f.vamp || f.rage) return 'blood'; if ((P.st && P.st.luck) >= 3) return 'gold';
  return null;
}
var _tearProcsU = tearProcs;
tearProcs = function (o) {
  _tearProcsU(o); var P = R.P;
  if (!o.kind || o.kind === 'tear' || o.kind === P.tearKind) { var lk = tearLook(P); if (lk) o.look = lk; }
  if (P.fl.weed) { o.r = (o.r || 5) * 1.25; }
  if (CHARS[P.ch].poop) { o.r = (o.r || 5) * (1.1 + (P.belly || 0) * .06); }
  if ((P.fl.poopTears || CHARS[P.ch].poop) && rnd01() < .15) o.slow = 1;
};
var _drawTearU = drawTear;
drawTear = function (t) {
  var k0 = t.kind;
  if (!t.enemy && Math.hypot(t.vx, t.vy) > 60) { // smuga
    var c = (TEARCOL[t.look || k0] || TEARCOL.tear)[1];
    for (var i = 2; i >= 1; i--) { X.globalAlpha = .16 * (3 - i); X.fillStyle = c; X.beginPath(); X.arc(t.ix - t.vx * .016 * i, t.iy - (t.z || 0) - t.vy * .016 * i, t.r * (1 - i * .18), 0, TAU); X.fill(); }
    X.globalAlpha = 1;
  }
  if (t.look && (!k0 || k0 === 'tear' || k0 === (R && R.P && R.P.tearKind))) t.kind = t.look;
  try { _drawTearU(t); } finally { t.kind = k0; }
};

// ---------- 2. KUPA: rodzaje jak w Isaacu ----------
var POOPCOL = { normal: '#7a4a22', golden: '#f0c43a', red: '#c8302a', black: '#2a2226', white: '#f4f0e8', corny: '#9a7a32' };
var _layoutRoomU = layoutRoom;
layoutRoom = function (F, rm, rng) {
  _layoutRoomU(F, rm, rng);
  var r2 = mkRng((rm.seed ^ 0x9009) >>> 0), gold = players && R && R.PS ? players().some(function (p) { return p.fl && p.fl.goldPoop; }) : false;
  // trochę więcej kup w zwykłych pokojach
  if (rm.type === 'normal' && rm.obs && rm.cols && r2.chance(.55)) {
    var proto = rm.obs.filter(function (o) { return o && o.k === 'poop'; })[0], mx = proto ? proto.max : 4, n = r2.int(1, 3);
    for (var k = 0; k < n * 4 && n > 0; k++) {
      var c = r2.int(1, rm.cols - 2), r = r2.int(1, rm.rows - 2), i = r * rm.cols + c;
      if (rm.obs[i] || Math.abs(c - (rm.cols - 1) / 2) < 1.6 || Math.abs(r - (rm.rows - 1) / 2) < 1.6) continue;
      rm.obs[i] = { k: 'poop', c: c, r: r, x: c * TS + TS / 2, y: r * TS + TS / 2, hp: mx, max: mx }; n--;
    }
  }
  (rm.obs || []).forEach(function (o) {
    if (!o || o.k !== 'poop' || o.pk) return; var x = r2();
    o.pk = x < (gold ? .25 : .06) ? 'golden' : x < .12 ? 'red' : x < .16 ? 'black' : x < .175 ? 'rainbow' : x < .2 && F.i >= 2 ? 'white' : x < .26 ? 'corny' : 'normal';
  });
};
var _drawObstacleU = drawObstacle;
drawObstacle = function (o, th) {
  if (o.k !== 'poop') return _drawObstacleU(o, th);
  var hp = o.max ? o.hp / o.max : 1, col = o.pk === 'rainbow' ? 'hsl(' + ((GAME.t * 120 + o.c * 40) % 360) + ',80%,55%)' : POOPCOL[o.pk || 'normal'];
  shadow(o.x, o.y + 11, 15, 5, .3);
  if (col.indexOf('hsl') === 0) { X.save(); X.translate(o.x, o.y); X.fillStyle = col; X.beginPath(); X.ellipse(0, 4, 14 * (.6 + hp * .4), 7, 0, 0, TAU); X.fill(); X.restore(); }
  drawSpr('poop', o.x, o.y - 2 + (1 - hp) * 6, 26 * (.55 + hp * .45), col.indexOf('hsl') === 0 ? '#e85ad8' : col);
  if (o.pk === 'golden' && Math.sin(GAME.t * 5 + o.c) > .8) { X.fillStyle = '#fff'; X.fillRect(o.x + 4, o.y - 10, 2, 2); }
  if (o.pk === 'corny') { X.fillStyle = '#f0e050'; X.fillRect(o.x - 4, o.y - 2, 2, 2); X.fillRect(o.x + 3, o.y + 2, 2, 2); }
};
var _destroyObsU = destroyObs;
destroyObs = function (ob, boom) {
  var rm = R.room, i = ob.r * rm.cols + ob.c, wasPoop = ob.k === 'poop' && rm.obs[i] === ob;
  _destroyObsU(ob, boom);
  if (!wasPoop || rm.obs[i] === ob) return;
  var x = ob.x, y = ob.y;
  switch (ob.pk) {
    case 'golden': for (var k = 0; k < rndi(3, 5); k++) dropPick('coin', 1, x, y, true); fxPoof(x, y - 8, '#ffe070'); break;
    case 'red': dropPick('heart', 'full', x, y, true); break;
    case 'black': explodeAt(x, y, 58, 22, { noPlayer: 1, small: 1 }); aliveEnemies().forEach(function (e) { if (dist(e.x, e.y, x, y) < 150) applyStatus(e, 'fear', 3); }); break;
    case 'rainbow': livePlayers().forEach(function (p) { withPlayer(p, function () { healRed(p, 99); }); }); fxRing(x, y - 6, 60, 'rgba(255,120,255,.9)'); floatText(x, y - 30, 'Tęcza!', '#ffb0ff'); break;
    case 'white': dropPick('heart', 'soul', x, y, true); break;
    case 'corny': spawnAlly(x, y); spawnAlly(x, y); break;
    default: if (rnd01() < .04) dropPick('dzik', rnd01() < .7 ? 'g' : 'p', x, y, true);
  }
  // przemiana Kupiarz / Karma: rozbita kupa czasem leczy
  livePlayers().forEach(function (p) { if ((p.fl.poopHeal || p.trans && p.trans.kupiarz) && rnd01() < .25 && dist(p.x, p.y, x, y) < 220 && p.red < p.cont) { p.red++; floatText(p.x, p.y - 50, '+½', '#ff8a8a'); } });
};

// ---------- 3. POCKET: kot, który je kupy i strzela kupą ----------
CHARS.pocket = { n: 'Pocket', face: 'pocket', cat: 1, poop: 1, d: 'Gruby brytyjczyk z kuchni. Strzela kupą, je kupy (pełny brzuch = mocniejsze strzały), a muchy chodzą za nim same.',
  look: { shirt: '#7a7f8a', pants: '#6a6f7a', shoes: '#8a8f9a', hair: '#6a6f7a', skin: '#8a8f9a' }, cont: 4, red: 4, soul: 4, black: 0, coins: 0, bombs: 1, keys: 0,
  active: 'kuweta', items: [], tear: 'tear', st: { dmgMult: 1.2, spd: -.08, tears: -.15, range: -1 } };
CHARS.wozny = { n: 'Woźny Zenek', face: 'wozny', d: 'Widział w tej szkole wszystko. Mopem odpycha wrogów i zmywa ich pociski.', look: { shirt: '#5a6a5a', jacket: '#3a4a3a', pants: '#2a2a30', shoes: '#1a1a1a', hair: '#8a8a8a', skin: '#d8c0a0' },
  cont: 6, red: 6, soul: 0, black: 0, coins: 5, bombs: 1, keys: 1, active: 'mop', items: [], tear: 'tear', st: { dmgMult: 1.15, spd: -.05, range: 1 }, lock: 'lazienka' };
CHARS.babcia = { n: 'Babcia Halina', face: 'babcia', d: 'Przeżyła kolejki, przeżyje i koszmar. Druty przebijają wszystko, rosół leczy wszystko.', look: { shirt: '#7a3a5a', jacket: '#4a2a3a', pants: '#3a2a30', shoes: '#2a1a1a', hair: '#d8d8d8', skin: '#d8c0a8' },
  cont: 4, red: 4, soul: 2, black: 0, coins: 0, bombs: 1, keys: 0, active: 'rosol', items: ['druty'], tear: 'tear', st: { tears: .3, dmgMult: .9, spd: -.12 }, lock: 'sekretarz' };
['pocket', 'wozny', 'babcia'].forEach(function (c) { if (CHARORDER.indexOf(c) < 0) CHARORDER.push(c); });
CHARLOCK.wozny = 'lazienka'; CHARLOCK.babcia = 'sekretarz';
Object.assign(UNLOCKS, {
  matka: { t: 'Pokonaj Matkę Ignaczaka', give: 'Dwa listy i nowe ścieżki koszmaru' },
  lazienka: { t: 'Pokonaj mini-bossa w Łazience pracowniczej nr 20', give: 'Postać: Woźny Zenek' },
  sekretarz: { t: 'Pokonaj Towarzysza Pierwszego Sekretarza', give: 'Postać: Babcia Halina' }
});
FACEMETA.pocket = { asp: 1.08, eyeL: [.36, .56], eyeR: [.64, .56] };
FACEMETA.wozny = { asp: .94, eyeL: [.3, .42], eyeR: [.7, .42] }; FACEMETA.babcia = { asp: .94, eyeL: [.3, .42], eyeR: [.7, .42] };
FACEMETA.noz = { asp: .78, eyeL: [.35, .45], eyeR: [.65, .45] };
// postać bez zdjęcia → głowa ze sprite'a h_<twarz>
var _faceImgU = faceImg;
faceImg = function (ch, ex, h, ctx) { var r = _faceImgU(ch, ex, h, ctx); if (r) return r; return SPR['h_' + ch] ? sprCanvas('h_' + ch) : r; };
// przedmioty startowe / aktywne nowych postaci
u3item('kuweta', 'Kuweta', 'bucket', '#c8a070', null, 2, ['tre'], 'Aktywny: kupy wokół ciebie – blokują wrogów, a Pocket może je zjeść', { act: 4 });
u3item('mop', 'Mop woźnego', 'broom', '#c8c4bc', null, 2, ['tre'], 'Aktywny: fala wody odpycha wrogów i zmywa pociski', { act: 2 });
u3item('rosol', 'Rosół babci', 'bowl', '#f0c43a', null, 2, ['boss'], 'Aktywny: +1 serce i szybsze łzy na chwilę', { act: 6 });
u3item('druty', 'Druty do dziergania', 'needle', '#c8c4bc', null, 2, ['tre'], 'Łzy przebijają wrogów i przelatują przez przeszkody', { fl: { pierce: 1, spectral: 1 } });

var _updPlayerU = updPlayer;
updPlayer = function (dt) {
  _updPlayerU(dt); var P = R.P, rm = R.room; if (P.dead || !rm) return;
  if (P.dzikT > 0) { P.dzikT -= dt; if (P.dzikT <= 0) calcStats(); }
  if (P.ramT > 0) { P.ramT -= dt; P.inv = Math.max(P.inv || 0, .1); P.ramHit = (P.ramHit || 0) - dt; if (P.ramHit <= 0) { P.ramHit = .15; aliveEnemies().forEach(function (e) { if (dist(e.x, e.y, P.x, P.y) < e.r + 22) hitEnemy(e, P.st.dmg * 3, { knock: 3 }); }); } }
  if (P.trans && P.trans.zjarany) { P.zjT = (P.zjT || 0) - dt; if (P.zjT <= 0) { P.zjT = 1; aliveEnemies().forEach(function (e) { if (!e.boss && dist(e.x, e.y, P.x, P.y) < 90) applyStatus(e, 'confuse', 1.2); }); } }
  // Pocket je kupy
  if (CHARS[P.ch].cat && rm.obs) {
    P.eatCd = (P.eatCd || 0) - dt;
    if (P.eatCd <= 0) {
      var c0 = Math.floor(P.x / TS), r0 = Math.floor(P.y / TS);
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        var c = c0 + dx, r = r0 + dy; if (c < 0 || r < 0 || c >= rm.cols || r >= rm.rows) continue;
        var ob = rm.obs[r * rm.cols + c]; if (!ob || ob.k !== 'poop' || dist(ob.x, ob.y, P.x, P.y) > 30) continue;
        P.eatCd = .5; destroyObs(ob, true); if (rm.obs[r * rm.cols + c] === ob) rm.obs[r * rm.cols + c] = null;
        P.belly = Math.min(5, (P.belly || 0) + 1); if (P.red < P.cont) P.red++; else if (P.cont === 0) addExtra(P, 'soul', 1);
        floatText(P.x, P.y - 54, 'Mniam! (' + P.belly + '/5)', '#d8b07a'); sfx('pickup'); P.ex = 'v'; P.exT = .5; calcStats(); FLOW.room = null;
        dy = 2; break;
      }
    }
  }
};
var _calcStatsU = calcStats;
calcStats = function () {
  _calcStatsU(); var P = R.P;
  if (P.dzikT > 0) { P.st.spd *= 1.15; P.st.tears *= 1.3; }
  if (CHARS[P.ch].cat) P.st.dmg += (P.belly || 0) * .3;
  if (P.trans && P.trans.zjarany) { P.fl.fly = 1; P.st.dmg *= 1.2; }
  if (P.trans && P.trans.kupiarz) { P.st.dmg += 1; }
  if (P.trans && P.trans.prl) { P.fl.sale = 1; }
};
var _damagePlayerU = damagePlayer;
damagePlayer = function (n, src) { var P = R.P, hit = _damagePlayerU(n, src); if (hit && CHARS[P.ch].cat && P.belly > 0) { P.belly = Math.max(0, P.belly - 2); calcStats(); } return hit; };
// kot: własny rysunek (szare futro, ogon, zacieki, muchy, paszcza przy strzale)
function drawCat(o) {
  var sc = o.sc || 1, wp = o.walk || 0, mv = o.moving ? 1 : 0, dir = o.dir || 'd';
  X.save(); X.translate(o.x, o.y); X.scale(sc, sc); if (o.alpha != null) X.globalAlpha *= o.alpha;
  shadow(0, 2, 16, 5, .3); if (o.fly) X.translate(0, -10 - Math.sin(GAME.t * 5) * 2.5);
  if (o.flash > 0) X.filter = 'brightness(' + (1 + o.flash * 3) + ')';
  var fur = '#7f8592', dark = '#5f6572', bob = Math.abs(Math.sin(wp)) * 1.5 * mv;
  // ogon
  X.strokeStyle = dark; X.lineWidth = 5; X.lineCap = 'round'; X.beginPath(); var tx = dir === 'l' ? 12 : -12; X.moveTo(tx * .6, -8); X.quadraticCurveTo(tx * 1.4, -14 - Math.sin(GAME.t * 3) * 4, tx * 1.1, -26); X.stroke();
  // łapy
  X.fillStyle = dark; [-8, -3, 3, 8].forEach(function (lx, i) { var s = Math.sin(wp + i * 1.6) * 2 * mv; X.beginPath(); X.ellipse(lx, -2 + s * .4, 3.2, 2.6, 0, 0, TAU); X.fill(); });
  // tułów
  X.translate(0, -bob); X.fillStyle = fur; X.beginPath(); X.ellipse(0, -11, 14, 10, 0, 0, TAU); X.fill();
  X.fillStyle = '#9aa0ac'; X.beginPath(); X.ellipse(0, -8, 8, 5.5, 0, 0, TAU); X.fill();
  X.fillStyle = 'rgba(110,70,30,.85)'; X.beginPath(); X.ellipse(-6, -13, 3, 2, .4, 0, TAU); X.ellipse(7, -7, 2.4, 1.6, -.3, 0, TAU); X.fill();
  if (o.hand) o.hand(dir); if (o.cos) drawCos(o, dir, 'body');
  // głowa (zdjęcie Pocketa w pikselach)
  var hh = 34, meta = FACEMETA.pocket, hw = hh * meta.asp, im = faceImg('pocket', o.shoot ? 'v' : (o.ex === 'h' || o.ex === 'v' ? o.ex : 'n'), hh);
  if (dir === 'u') { X.fillStyle = fur; X.beginPath(); X.ellipse(0, -36, hw * .46, hh * .42, 0, 0, TAU); X.fill(); X.beginPath(); X.moveTo(-hw * .4, -44); X.lineTo(-hw * .3, -56); X.lineTo(-hw * .12, -46); X.moveTo(hw * .4, -44); X.lineTo(hw * .3, -56); X.lineTo(hw * .12, -46); X.fill(); }
  else if (im) X.drawImage(im, -hw / 2, -36 - hh / 2 - 2, hw, hh);
  X.filter = 'none';
  if (o.cos) drawCos(o, dir, 'head');
  X.restore();
  // muchy (tylko wygląd)
  for (var i = 0; i < 3; i++) { var a = GAME.t * (2.2 + i * .4) + i * 2.1, fx = o.x + Math.cos(a) * 20, fy = o.y - 38 + Math.sin(a * 1.3) * 10; X.fillStyle = '#141414'; X.fillRect(fx - 1, fy - 1, 2.5, 2.5); X.fillStyle = 'rgba(220,230,255,.8)'; X.fillRect(fx - 2 + Math.sin(GAME.t * 40) , fy - 3, 1.5, 1.5); }
}
var _drawPlayerU = drawPlayer;
drawPlayer = function () {
  var P = R.P; if (!CHARS[P.ch].cat || P.ghost) return _drawPlayerU();
  var dp = drawPerson; drawPerson = function (o) { return drawCat(o); };
  try { _drawPlayerU(); } finally { drawPerson = dp; }
};

// ---------- 4. PUSZKI DZIKA: ładowanie przedmiotu pod Spacją ----------
var DZIKCOL = { g: '#7ad23a', p: '#6a3ad8', z: '#f0c43a' };
var _drawPickupU = drawPickup;
drawPickup = function (p) {
  if (p.type !== 'dzik') return _drawPickupU(p);
  var y = p.iy - (p.z || 0) - 8 + Math.sin(GAME.t * 3 + p.id) * 1.5; shadow(p.ix, p.iy + 7, 7, 3, .25);
  drawSpr('dzik', p.ix, y, 16, DZIKCOL[p.val] || DZIKCOL.g);
  if (p.val === 'z' && Math.sin(GAME.t * 6) > .6) { X.fillStyle = '#fff'; X.fillRect(p.ix + 3, y - 6, 2, 2); }
};
var _collectPickU = collectPick;
collectPick = function (p) {
  if (p.type !== 'dzik') return _collectPickU(p);
  var P = R.P, A = P.active, it = A && ITEMS[A.id];
  if (A && it && it.act) { if (p.val === 'g') A.ch = Math.min(it.act, A.ch + 2); else A.ch = it.act; }
  if (p.val !== 'g') { P.dzikT = p.val === 'z' ? 9 : 5; calcStats(); }
  if (p.val === 'z') addExtra(P, 'soul', 1);
  floatText(P.x, P.y - 50, { g: 'Dzik! +2 ładunki', p: 'Fioletowy Dzik! Pełne + przyspieszenie', z: 'ZŁOTY DZIK!' }[p.val] || 'Dzik!', DZIKCOL[p.val] || '#7ad23a');
  sfx('item'); fxPoof(p.x, p.y - 8, DZIKCOL[p.val] || '#7ad23a'); return true;
};
var _roomClearedU = roomCleared;
roomCleared = function (rm) {
  _roomClearedU(rm);
  if (!rm || rm.type === 'boss') return;
  var pack = players().some(function (q) { return q.fl && q.fl.dzikPack; });
  if (pack) eachPlayer(function (q) { if (q.fl.dzikPack && q.active) { var it = ITEMS[q.active.id]; if (it && it.act) q.active.ch = Math.min(it.act, q.active.ch + 1); } });
  if (rnd01() < .07 + (pack ? .12 : 0)) { var r = rnd01(); dropPick('dzik', r < .1 ? 'z' : r < .4 ? 'p' : 'g', rm.w / 2 + rnd(-40, 40), rm.h / 2 + rnd(-20, 20), true); }
};
var _fillRoomU = fillRoom;
fillRoom = function (F, rm, rng) {
  _fillRoomU(F, rm, rng);
  if (rm.type === 'shop') { var b = rm.peds.filter(function (q) { return q.pick && q.pick.type === 'battery'; })[0] || rm.peds.filter(function (q) { return q.pick && q.pick.type === 'bomb'; })[0]; if (b) { b.pick = { type: 'dzik', val: 'p' }; b.price = 6; } }
};
// sklep musi umieć narysować puszkę na półce
var _drawPedU = typeof drawPed === 'function' ? drawPed : null;

// ---------- 5. NOWE PRZEDMIOTY ----------
// zielsko
u3item('zielsko', 'Zielsko', 'leaf', '#5fbf3a', null, 2, ['tre', 'devil'], 'Łzy jak gęsty zielony dym: wolniejsze, większe i mocniejsze', { st: { dmg: .6, tears: -.15, range: 1.5, ss: -.25 }, fl: { weed: 1 }, tags: ['zjarany'] });
u3item('skret', 'Skręt', 'joint', '#f4f0e8', null, 2, ['tre', 'devil'], 'Aktywny: chmura dymu – wrogowie zagubieni i spowolnieni', { act: 3, tags: ['zjarany'] });
u3item('brownie', 'Brownie od kumpla', 'bread', '#5a3a20', null, 2, ['tre', 'boss', 'shop'], 'Zdrowie, łzy i szczęście w górę', { hp: { cont: 2, heal: 2 }, st: { tears: .2, luck: 1 }, tags: ['zjarany'] });
u3item('fifka', 'Fifka', 'pipe', '#8a5a32', null, 3, ['tre'], 'Łzy dymne i naprowadzane, obrażenia w górę', { st: { dmg: .4, ss: -.3 }, fl: { homing: 1, weed: 1 }, tags: ['zjarany'] });
u3item('rastaCzapka', 'Czapka rasta', 'rasta', '#d8302a', null, 1, ['tre', 'shop'], 'Szybkość i szczęście w górę', { st: { spd: .2, luck: 1 }, tags: ['zjarany'] });
// kupa
u3item('zlotaKupa', 'Złota kupa', 'poop', '#f0c43a', null, 2, ['tre', 'shop'], '+5 zł; od następnego piętra dużo więcej złotych kup', { pick: { coins: 5 }, st: { luck: 1 }, fl: { goldPoop: 1 }, tags: ['kupiarz'] });
u3item('nawoz', 'Nawóz', 'poop', '#5a7a22', null, 2, ['tre', 'devil'], 'Strzelasz kupą: obrażenia w górę, czasem spowalnia', { st: { dmg: .8 }, fl: { poopTears: 1 }, tags: ['kupiarz'] });
u3item('karma', 'Karma dla kota', 'bowl', '#c8a070', null, 2, ['tre', 'boss'], 'Zdrowie w górę; rozbite kupy czasem cię leczą', { hp: { cont: 2, heal: 4 }, fl: { poopHeal: 1 }, tags: ['kupiarz'] });
u3item('muchy', 'Muchy z kuwety', 'poop', '#3a3a40', null, 2, ['tre'], 'Dwie muchy krążą wokół ciebie i blokują pociski', { fl: { orbit: 2 }, tags: ['kupiarz'] });
// PRL
u3item('kartka', 'Kartka na mięso', 'card', '#e8d8b0', '#d8302a', 2, ['shop', 'tre'], 'Wszystko w sklepie za pół ceny', { fl: { sale: 1 }, tags: ['prl'] });
u3item('syrenka', 'Syrenka', 'car', '#5fb4ff', null, 2, ['tre', 'shop'], 'Szybkość ++', { st: { spd: .45 }, tags: ['prl'] });
u3item('talon', 'Talon na malucha', 'card', '#f0c43a', '#7a1410', 2, ['tre'], 'Aktywny: taran! Przez sekundę jesteś nietykalny i rozjeżdżasz wrogów', { act: 4, tags: ['prl'] });
u3item('oranzada', 'Oranżada w woreczku', 'bottle', '#ff8a2a', null, 1, ['tre', 'shop', 'boss'], 'Leczy i łzy w górę', { hp: { heal: 4 }, st: { tears: .35 }, tags: ['prl'] });
u3item('paszport', 'Paszport z szuflady', 'book', '#7a1410', '#f0c43a', 2, ['shop', 'secret'], 'Widzisz mapę i sekrety, +2 klucze', { fl: { map: 1, secretMap: 1 }, pick: { keys: 2 }, tags: ['prl'] });
// łazienka nr 20
u3item('kluczLaz', 'Klucz do łazienki', 'key', '#c8c4bc', null, 1, ['lazienka'], '+3 klucze i szczęście w górę', { pick: { keys: 3 }, st: { luck: .5 } });
u3item('mydlo', 'Mydło w płynie', 'bottle', '#f8a8d8', null, 2, ['lazienka', 'tre'], 'Łzy-bańki odbijają się od ścian; łzy w górę', { st: { ss: .3, tears: .2 }, fl: { bounce: 1, soap: 1 } });
u3item('rolka', 'Rolka papieru', 'scroll', '#f4f0e8', null, 2, ['lazienka'], 'Zwój papieru krąży i blokuje pociski; zasięg w górę', { fl: { orbit: 1 }, st: { range: 2 } });
u3item('odswiezacz', 'Odświeżacz powietrza', 'can', '#9fe8ff', '#f4f0e8', 2, ['lazienka'], 'Łzy-bańki ogłuszają (szansa); łzy w górę', { fl: { stun: 1, soap: 1 }, st: { tears: .3 } });
u3item('zgrzewka', 'Zgrzewka Dzików', 'dzik', '#6a3ad8', null, 3, ['shop', 'tre', 'lazienka'], '+1 ładunek po każdym pokoju i więcej puszek Dzika', { fl: { dzikPack: 1 }, st: { tears: .2 } });
// moje dodatki
u3item('skarpeta', 'Brudna skarpeta', 'cloud', '#a8a890', null, 2, ['tre'], 'Smród: wrogowie przy tobie dostają trucizny', { fl: { stink: 1 } });
u3item('kaseta', 'Kaseta z disco polo', 'note', '#d8302a', null, 2, ['tre', 'shop'], 'Łzy-nuty ogłuszają (szansa), łzy w górę', { fl: { stun: 1 }, st: { tears: .4 } });
u3item('pierogi', 'Pierogi od babci', 'bowl', '#f4e8c8', null, 2, ['boss', 'shop'], 'Zdrowie w górę i pełne leczenie', { hp: { cont: 2, heal: 99 } });
u3item('pala', 'Pała z WF-u', 'bat', '#c8c4bc', null, 2, ['tre'], 'Obrażenia ++, zasięg w dół', { st: { dmg: 1, range: -1 } });
TRANS.zjarany = { n: 'Zjarany', d: 'Latasz, łzy tęczowe, a wrogowie przy tobie gubią drogę', e: ITEMS.zielsko.e };
TRANS.kupiarz = { n: 'Kupiarz', d: 'Strzelasz kupą, obrażenia +1, rozbite kupy cię leczą', e: ITEMS.nawoz.e };
TRANS.prl = { n: 'Towarzysz', d: 'Sklep zawsze za pół ceny', e: ITEMS.kartka.e };
var _updPlayerU2 = updPlayer;
updPlayer = function (dt) {
  _updPlayerU2(dt); var P = R.P; if (P.dead || !R.room || !P.fl.stink) return;
  P.stinkT = (P.stinkT || 0) - dt; if (P.stinkT <= 0) { P.stinkT = 1; aliveEnemies().forEach(function (e) { if (dist(e.x, e.y, P.x, P.y) < 70) applyStatus(e, 'poison', 2); }); }
};
var _activeEffectU = activeEffect;
activeEffect = function (id) {
  var P = R.P, rm = R.room;
  switch (id) {
    case 'kuweta':
      var c0 = Math.floor(P.x / TS), r0 = Math.floor(P.y / TS), n = 0;
      [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]].forEach(function (d) { var c = c0 + d[0], r = r0 + d[1]; if (c < 1 || r < 1 || c >= rm.cols - 1 || r >= rm.rows - 1) return; var i = r * rm.cols + c; if (rm.obs[i]) return; rm.obs[i] = { k: 'poop', c: c, r: r, x: c * TS + TS / 2, y: r * TS + TS / 2, hp: 3, max: 3, pk: rnd01() < .15 ? 'golden' : 'normal' }; n++; fxPoof(c * TS + TS / 2, r * TS + TS / 2, '#7a4a22'); });
      FLOW.room = null; sfx('splat'); return;
    case 'mop': fxRing(P.x, P.y - 10, 120, 'rgba(120,190,255,.9)'); TEARS.forEach(function (t) { if (t.enemy && dist(t.x, t.y, P.x, P.y) < 150) t.life = 0; }); aliveEnemies().forEach(function (e) { var d = dist(e.x, e.y, P.x, P.y); if (d < 140) { var a = angTo(P.x, P.y, e.x, e.y); e.vx += Math.cos(a) * 420; e.vy += Math.sin(a) * 420; applyStatus(e, 'slow', 3); hitEnemy(e, 6, {}); } }); sfx('splat'); return;
    case 'rosol': if (P.cont > 0) healRed(P, 2); else addExtra(P, 'soul', 2); P.dzikT = 8; calcStats(); floatText(P.x, P.y - 50, 'Rosołek!', '#f0c43a'); sfx('heart'); return;
    case 'skret': fxRing(P.x, P.y - 10, 160, 'rgba(150,230,120,.6)'); aliveEnemies().forEach(function (e) { applyStatus(e, 'confuse', 4); applyStatus(e, 'slow', 4); }); for (var k = 0; k < 14; k++) fxPart(P.x, P.y - 20, rnd(-90, 90), rnd(-90, 10), pick(['#a8e86a', '#7ad23a', '#d8d8d0']), rnd(5, 10), rnd(.8, 1.6), 0); return;
    case 'talon': P.ramT = 1.1; P.vx *= 2; P.vy *= 2; floatText(P.x, P.y - 50, 'BRUM!', '#f0c43a'); sfx('dash'); return;
  }
  return _activeEffectU(id);
};

// ---------- 6. GOŚĆ Z NOŻEM (potwór): sika na ciebie ----------
MOBS.nozownik = { n: 'Gość z nożem', art: 'human', o: { face: 'noz', look: { shirt: '#141416', jacket: '#141416', pants: '#22242a', shoes: '#111', hair: '#b89a6a' }, hand: function () { drawSpr('knife', 12, -14, 16, null, null, null, .6); } }, hp: 28, spd: 52, r: 12, ai: 'walk' };
MOBS.petent = { n: 'Petent z kartką', art: 'human', o: { emoji: '\uE3F2', look: { shirt: '#6a6a62', pants: '#3a3a3a', shoes: '#1a1a1a', hair: '#4a4a4a' } }, hp: 16, spd: 46, r: 11, ai: 'walkShoot', shot: { kind: 'ticket', cd: 2.8, spd: 150 } };
MOBPOOL.rynek.push(['nozownik', 2]);
var _updMobU = updMob;
updMob = function (e, dt) {
  _updMobU(e, dt);
  if (e.dead || e.t !== 'nozownik' || e.spawnT > 0) return;
  var P = R.P, d = dist(e.x, e.y, P.x, P.y);
  e.peeT = (e.peeT == null ? rnd(1.5, 3) : e.peeT) - dt; e.lungeCd = (e.lungeCd || 0) - dt;
  if (e.pee > 0) {
    e.pee -= dt; e.vx *= .3; e.vy *= .3; e.ex = 'n';
    e.peeS = (e.peeS || 0) - dt; if (e.peeS <= 0) { e.peeS = .11; var a = angTo(e.x, e.y, P.x, P.y) + Math.sin(e.pee * 9) * .25, s = enemyShot(e.x, e.y - 10, a, 150, 'pee'); if (s) s.peeCreep = 1; }
  } else if (e.peeT <= 0 && d < 280) { e.peeT = rnd(2.6, 4); e.pee = 1.1; floatText(e.x, e.y - 60, pick(['Uważaj!', 'Hehe', 'Chwila…']), '#f0d83a'); }
  else if (d < 46 && e.lungeCd <= 0) { e.lungeCd = 1.6; var a2 = angTo(e.x, e.y, P.x, P.y); e.vx = Math.cos(a2) * 330; e.vy = Math.sin(a2) * 330; }
};
var _updTearsU = updTears;
updTears = function (dt) {
  var pee = TEARS.filter(function (t) { return t.peeCreep; }); _updTearsU(dt);
  pee.forEach(function (t) { if (TEARS.indexOf(t) < 0 && R.room) addCreep(t.x, t.y, 16, 'pee', 4, true); });
};
var _killEnemyU = killEnemy;
killEnemy = function (e) { var was = e.dead; _killEnemyU(e); if (!was && e.t === 'nozownik' && R.room) addCreep(e.x, e.y, 34, 'pee', 6, true); };
var _drawCreepU = drawCreep;
drawCreep = function (c) {
  if (c.kind !== 'pee') return _drawCreepU(c);
  var a = Math.min(1, c.life / 1.2) * .7; X.save(); X.translate(c.x, c.y); X.rotate(c.rot || 0); X.globalAlpha = a;
  X.fillStyle = '#e8c83a'; X.beginPath(); X.ellipse(0, 0, c.r, c.r * .62, 0, 0, TAU); X.fill(); X.fillStyle = '#fff2a0'; X.beginPath(); X.ellipse(-c.r * .25, -c.r * .15, c.r * .35, c.r * .2, 0, 0, TAU); X.fill(); X.restore();
};

// ---------- 7. ŁAZIENKA PRACOWNICZA NR 20: mini-bossowie ----------
THEMES.lazienka20 = { floor: 'tiles', fa: '#c8ccc4', fb: '#b4b8b0', grout: '#6a706a', wallA: '#9aa8b8', wallB: '#7a8898', wallLow: '#2a5a9a', trim: '#1a2a4a', side: '#6a7888', vign: .75, tint: 'rgba(60,140,90,.08)' };
BOSSES.kierownik = { n: 'Kierownik zmiany', hp: 300, r: 15, rest: 1.1, w: { szarza: 2, notatka: 3 },
  idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 50); },
  atk: {
    szarza: function (e, dt, t) { if (once(e, 'a', .3)) { var a = aimP(e, 0); e.cx = Math.cos(a); e.cy = Math.sin(a); floatText(e.x, e.y - 64, 'DO ROBOTY!', '#fff'); } if (t > .35 && t < 1) { e.vx = e.cx * 360; e.vy = e.cy * 360; } else { e.vx *= .8; e.vy *= .8; } return t > 1.3; },
    notatka: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (every(e, 'n', .3, .5) && e.atD.n < 3) { bSpread(e, 5, .22, 170, 'ticket', null, 30); sfx('shoot', .5); } return t > 1.8; }
  },
  draw: function (e) { artHuman(e, { face: 'prac', ex: e.flash > 0 ? 'h' : 'k', sz: 1.45, look: { shirt: '#e8e4d8', jacket: '#2a2a30', pants: '#2a2a30', shoes: '#111', hair: '#5a4a3a' }, hand: function () { drawSpr('paper', 12, -16, 14); } }); } };
BOSSES.sprzataczka = { n: 'Sprzątaczka', hp: 280, r: 14, rest: 1, w: { mop: 2, wiadro: 2 },
  idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 45); e.ct = (e.ct || 0) - dt; if (e.ct <= 0) { e.ct = .35; addCreep(e.x, e.y + 4, 18, 'milk', 4, true); } },
  atk: {
    mop: function (e, dt, t) { if (once(e, 'a', .2)) { var a = aimP(e, 0); e.cx = Math.cos(a); e.cy = Math.sin(a); } if (t > .2 && t < 1.1) { e.vx = e.cx * 250; e.vy = e.cy * 250; e.ct = (e.ct || 0) - dt; if (e.ct <= 0) { e.ct = .08; addCreep(e.x, e.y + 4, 20, 'milk', 5, true); } } else { e.vx *= .8; e.vy *= .8; } return t > 1.4; },
    wiadro: function (e, dt, t) { e.vx *= .8; e.vy *= .8; if (every(e, 'w', .3, .55) && e.atD.w < 2) bRing(e, 10, 130, 'milk', e.atD.w * .3, 24); return t > 1.5; }
  },
  draw: function (e) { artHuman(e, { emoji: '👵', sz: 1.4, look: { shirt: '#5a8ad8', pants: '#3a3a4a', shoes: '#e8e8e8', hair: '#c8c8c8' }, hand: function () { drawSpr('broom', 13, -14, 18, null, null, null, .3); } }); } };
BOSSES.kibel = { n: 'Zatkany kibel', hp: 340, r: 18, rest: .9, w: { fala: 3, struga: 2, karaluchy: 1 },
  idle: function (e) { e.vx = e.vy = 0; },
  atk: {
    fala: function (e, dt, t) { e.vx = e.vy = 0; if (every(e, 'f', .2, .45) && e.atD.f < 3) { bRing(e, 12, 120, 'poop', e.atD.f * .26, 14); sfx('splat'); } return t > 1.6; },
    struga: function (e, dt, t) { e.vx = e.vy = 0; if (every(e, 's', .2, .09) && e.atD.s < 12) { var s = enemyShot(e.x, e.y - 14, aimP(e, 14) + Math.sin(t * 8) * .3, 210, 'pee'); if (s) s.peeCreep = 1; } return t > 1.5; },
    karaluchy: function (e, dt, t) { e.vx = e.vy = 0; if (once(e, 'a', .3)) bSummon(e, 'karaluch', 2, 4); return t > 1; }
  },
  draw: function (e) { shadow(e.ix, e.iy + 8, 22, 7, .3); drawSpr('toilet', e.ix, e.iy - 14, 46, e.flash > 0 ? '#ffffff' : '#e8e4dc'); } };
var _enterRoomU = enterRoom;
enterRoom = function (rm, viaDoor) {
  _enterRoomU(rm, viaDoor);
  if (rm.type === 'lazienka' && !rm.cleared && !rm.miniOn && rm.mini) {
    rm.miniOn = 1; var e = spawnBoss(rm.mini, rm.w / 2, rm.h / 2 - 30); e.mini = 1; e.hp = e.maxHp = BOSSES[rm.mini].hp * (1 + R.fi * .14); e.stT = 1.2;
    BOSSBAR.e = e; banner('Łazienka pracownicza nr 20', BOSSES[rm.mini].n + ' nie wpuszcza nikogo!', '#9fc8ff', 2.4); sfx('door');
  }
};
var _bossDefeatedU = bossDefeated;
bossDefeated = function (e) {
  if (!e.mini) return _bossDefeatedU(e);
  var rm = R.room; sfx('bossdie'); shake(10); fxFlash('rgba(255,255,255,.4)', .4); BOSSBAR.e = null;
  for (var i = 0; i < 20; i++) fxPart(e.x, e.y - 20, rnd(-220, 220), rnd(-260, 40), pick(['#c8ccc4', '#5fb4ff', '#f0d83a']), rnd(4, 8), rnd(.5, 1.2), 1);
  ENTS.forEach(function (m) { if (m.summoned && !m.dead) { m.dead = true; fxPoof(m.x, m.y - 10, '#aaa'); } });
  TEARS.forEach(function (t) { if (t.enemy) t.life = 0; });
  var sp = nearFree(rm, rm.w / 2, rm.h / 2 + 10); rm.peds.push({ x: sp[0], y: sp[1], item: poolPick('lazienka', mkRng(rm.seed + 9)) || poolPick('tre', mkRng(rm.seed + 9)), pool: 'lazienka', cd: 1.2, appear: 1 });
  if (typeof isCoopRun === 'function' && isCoopRun()) { rm.dupDone = 0; dupPeds(rm); }
  if (!PROF.unl.lazienka) { PROF.unl.lazienka = 1; later(2.2, function () { toast('🔓 Odblokowano!', UNLOCKS.lazienka.give); }, true); }
  saveProf();
};
// wystrój łazienki: niebieska tabliczka nad drzwiami, pisuary, migająca świetlówka
var _drawLightingU = drawLighting;
drawLighting = function (rm) {
  _drawLightingU(rm);
  if (rm.type !== 'lazienka') return;
  X.save();
  var sx = rm.w / 2 - 64, sy = -WT + 8; X.fillStyle = '#ffffff'; X.fillRect(sx - 2, sy - 2, 132, 44); X.fillStyle = '#2a4fb0'; X.fillRect(sx, sy, 128, 40); X.strokeStyle = '#ffffff'; X.lineWidth = 1; X.strokeRect(sx + 3, sy + 3, 122, 34);
  X.fillStyle = '#ffffff'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.font = '13px sans-serif'; X.fillText('20', rm.w / 2, sy + 12); X.font = '8px sans-serif'; X.fillText('ŁAZIENKA PRACOWNICZA', rm.w / 2, sy + 28);
  for (var i = 0; i < 3; i++) { var ux = 40 + i * 44; X.fillStyle = '#e8ece8'; rr(ux, -26, 22, 30, 6); X.fill(); X.fillStyle = '#c8ccc8'; rr(ux + 4, -18, 14, 18, 4); X.fill(); X.fillStyle = '#f0d83a'; X.globalAlpha = .5; X.fillRect(ux + 8, 0, 6, 3); X.globalAlpha = 1; }
  if (Math.random() < .04) { X.fillStyle = 'rgba(0,0,0,.35)'; X.fillRect(-WS, -WT, rm.w + WS * 2, rm.h + WT + WB); }
  X.restore();
};
if (window.__G) window.__G.spawnBossX = function (id, x, y) { return spawnBoss(id, x, y); };

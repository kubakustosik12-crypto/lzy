// ---- 17_items.js ----
// ===================== NOWE PRZEDMIOTY + POKOJE ANIOŁA =====================
// Ikony nowych przedmiotów to znaki z prywatnego zakresu Unicode (\uE000…), mapowane na sprite'y.
(function () {
  var code = 0xE001;
  function add(id, n, spr, col, col2, q, pool, d, extra) {
    var e = String.fromCharCode(code++); EMO2SPR[e] = [spr, col, col2];
    ITEMS[id] = Object.assign({ n: n, e: e, q: q, pool: pool, d: d }, extra || {});
  }
  // ---------- anielskie ----------
  add('pioroA', 'Anielskie pióro', 'feather', '#f4f0e8', null, 2, ['angel'], 'Łzy w górę i przelatują przez przeszkody', { st: { tears: .5 }, fl: { spectral: 1 } });
  add('gromnica', 'Gromnica', 'candle', '#f4f0e8', null, 3, ['angel'], 'Co kilka sekund słup światła spada na wroga', { fl: { holyBeam: 1 } });
  add('krzyzyk', 'Krzyżyk od babci', 'cross', '#f0c43a', null, 2, ['angel', 'shop'], '+2 serca z łez, szczęście w górę', { hp: { soul: 4 }, st: { luck: 1 } });
  add('woda', 'Woda święcona', 'bottle', '#9fe8ff', null, 4, ['angel'], 'Obrażenia ×1,3 i łzy same szukają wrogów', { st: { dmgMult: 1.3, tearsMult: .85 }, fl: { homing: 1 } });
  add('harfa', 'Złota harfa', 'note', '#f0c43a', null, 2, ['angel'], 'Łzy-nuty ogłuszają, +1 serce z łez', { fl: { stun: 1 }, hp: { soul: 2 } });
  add('oplatek', 'Opłatek', 'bread', '#f4f0e8', null, 2, ['angel', 'boss'], 'Zdrowie w górę, pełne leczenie i serce z łez', { hp: { cont: 2, heal: 99, soul: 2 } });
  add('klepsydra', 'Klepsydra Kronosa', 'clock', '#f0c43a', null, 3, ['angel', 'tre'], 'Wrogowie zwalniają, łzy w górę', { fl: { slowAll: 1 }, st: { tears: .5 } });
  add('stroz', 'Anioł stróż', 'wings', '#e8eef4', null, 3, ['angel'], 'Świetlisty strażnik krąży i blokuje pociski; czasem unikasz ciosu', { fl: { orbit: 1, dodge: 1 } });
  add('swiatlo', 'Światło na końcu korytarza', 'sun', '#fff2a0', null, 2, ['angel'], 'Obrażenia i zasięg w górę, widzisz sekrety', { st: { dmg: .5, range: 2 }, fl: { light: 1, secretMap: 1 } });
  add('rozaniec', 'Różaniec', 'amulet', '#e8eef4', null, 3, ['angel'], 'Łzy w górę ++ i trzy serca z łez', { st: { tears: .7 }, hp: { soul: 6 } });
  add('serafin', 'Skrzydła serafina', 'wings', '#fff2a0', null, 4, ['angel'], 'Latanie, szybkość i obrażenia w górę', { fl: { fly: 1 }, st: { spd: .3, dmg: .5 } });
  add('cisza', 'Cisza przed burzą', 'halo', '#9fe8ff', null, 2, ['angel', 'tre'], 'Stój chwilę w miejscu: obrażenia ×1,5', { fl: { still: 1 } });
  add('modlitwa', 'Modlitwa', 'cross', '#f4f0e8', null, 2, ['angel'], 'Aktywny: +1 serce z łez', { act: 4 });
  add('egzorcyzm', 'Egzorcyzm', 'book', '#f4f0e8', '#d8302a', 3, ['angel', 'tre'], 'Aktywny: 30 obrażeń każdemu wrogowi i panika', { act: 3 });
  // ---------- straszne (diabeł / skarbiec) ----------
  add('igla', 'Zardzewiała igła', 'needle', '#a8703a', null, 2, ['tre', 'devil'], 'Łzy rosną w locie i bolą coraz mocniej', { st: { dmg: .6 }, fl: { grow: 1 } });
  add('zupa', 'Zupa ze stołówki', 'bowl', '#8aa83a', null, 3, ['tre'], 'Łzy wybuchają przy upadku; obrażenia ++, łzy wolniej', { st: { dmg: 2, tears: -.6 }, fl: { ipecac: 1 } });
  add('pazur', 'Pazur nocnej mary', 'claw', '#d8d0c4', null, 3, ['devil'], 'Co 12 zabitych wrogów leczy pół serca, obrażenia w górę', { st: { dmg: .5 }, fl: { vamp: 1 } });
  add('kropla', 'Kropla krwi z Piwnicy', 'blood', '#d8302a', null, 2, ['devil', 'tre'], 'Przy jednym sercu obrażenia ×1,6', { fl: { rage: 1 }, st: { dmg: .3 } });
  add('oko3', 'Trzecie oko', 'eye', '#9a5ad0', null, 2, ['tre'], 'Łzy lecą spiralą; zasięg i łzy w górę', { st: { range: 2, tears: .3 }, fl: { spiral: 1 } });
  add('lalka', 'Lalka voodoo', 'doll', '#c8a070', '#7a1410', 3, ['devil'], 'Wrogowie blisko ciebie cały czas tracą zdrowie', { fl: { deathAura: 1 } });
  add('maska', 'Gipsowa maska', 'mask', '#f4f0e8', null, 2, ['tre', 'devil'], 'Łzy straszą wrogów (szansa), obrażenia w górę', { st: { dmg: .4 }, fl: { fear: 1 } });
  add('drut', 'Drut kolczasty', 'wire', '#8a8a90', null, 2, ['tre', 'devil'], 'Kiedy obrywasz, wrogowie wokół dostają 25 obrażeń', { fl: { thorns: 1 } });
  add('kamienne', 'Kamienne serce', 'heartB', '#6a6a70', null, 2, ['devil'], '+2 czarne serca', { hp: { black: 4 } });
  add('robak', 'Robak z jabłka', 'worm', '#e88aa8', null, 1, ['tre'], 'Łzy wiją się jak robak; szybkość łez i obrażenia w górę', { st: { ss: .3, dmg: .3 }, fl: { wiggle: 1 } });
  add('kosci', 'Kości z szafy', 'bone', '#f4f0e8', null, 2, ['devil', 'tre'], 'Wrogowie wybuchają po śmierci, obrażenia w górę', { st: { dmg: .4 }, fl: { bodyBoom: 1 } });
  add('sloik', 'Słoik oczu', 'eye', '#6fbf3a', null, 3, ['devil'], 'Łzy naprowadzane i szybsze', { st: { tears: .5 }, fl: { homing: 1 } });
  add('czarnaswieca', 'Czarna świeca', 'candle', '#2a2026', null, 2, ['devil', 'shop'], 'Obrażenia i szczęście w górę, ciemność ci nie straszna', { st: { dmg: .8, luck: 1 }, fl: { light: 1 } });
  add('zeby', 'Naszyjnik z zębów', 'tooth', '#f4f0e8', null, 2, ['tre'], 'Co któraś łza to ząb: ×3,2 obrażeń', { st: { dmg: .3 }, fl: { tooth: 1 } });
  add('krwawalza', 'Krwawa łza', 'blood', '#a8101a', null, 2, ['devil', 'tre'], 'Aktywny: pierścień 12 krwawych łez', { act: 3 });
  add('zgas', 'Zgaś światło', 'candle', '#4a4a50', null, 2, ['devil'], 'Aktywny: ciemność, wrogowie w panice i zagubieni', { act: 3 });
  add('lustroP', 'Pęknięte lustro', 'mirror', '#9a5ad0', null, 3, ['devil', 'secret'], 'Aktywny: krzyk z lustra – 25 obrażeń i ogłuszenie', { act: 4 });
  // ---------- zwykłe ----------
  add('lapka', 'Kurza łapka', 'claw', '#f0c43a', null, 1, ['tre', 'shop'], 'Szybkość i szczęście w górę', { st: { spd: .25, luck: 2 } });
  add('kompot', 'Kompot z suszu', 'bottle', '#8a3a5a', null, 1, ['tre', 'boss', 'shop'], 'Zdrowie i łzy w górę', { hp: { cont: 2, heal: 2 }, st: { tears: .3 } });
  add('kauczuk', 'Kauczukowa piłka', 'orb', '#d8302a', null, 2, ['tre'], 'Łzy odbijają się od ścian, obrażenia w górę', { st: { dmg: .3 }, fl: { bounce: 1 } });
  add('kreda2', 'Kreda z tablicy', 'pen', '#f4f0e8', null, 1, ['tre'], 'Zasięg i szybkość łez w górę', { st: { range: 2.5, ss: .3 } });
  add('globus', 'Globus z pracowni', 'orb', '#5fb4ff', null, 2, ['shop', 'tre'], 'Widzisz mapę, bossa i skarbiec', { fl: { map: 1, compass: 1 } });
  add('kieszen', 'Dziurawa kieszeń', 'bag', '#6a4a3a', null, 1, ['shop', 'tre'], '+15 zł i szczęście w górę', { pick: { coins: 15 }, st: { luck: .5 } });
  add('zapalniczka', 'Zapalniczka', 'fire', '#ff8a2a', null, 2, ['tre', 'shop'], 'Łzy podpalają (szansa), obrażenia w górę', { fl: { fire: 1 }, st: { dmg: .3 } });
  add('szron', 'Szron z zamrażarki', 'drop', '#9fe8ff', null, 2, ['tre'], 'Łzy spowalniają (szansa), łzy w górę', { fl: { ice: 1 }, st: { tears: .3 } });
})();

// ---------- mechaniki nowych przedmiotów ----------
var _tearProcsX = tearProcs;
tearProcs = function (o) {
  _tearProcsX(o); var f = R.P.fl;
  if (f.grow) o.grow = 1;
  if (f.ipecac) { o.ipecac = 1; o.kind = 'vomit'; }
  if (f.spiral) o.curve = (rnd01() < .5 ? -1 : 1) * 3.4;
  if (f.wiggle) { o.wig = 1; o.wigP = rnd(0, 6); }
  if (f.tooth && rnd01() < procChance(.1)) { o.dmg *= 3.2; o.kind = 'blood'; o.big = 1; }
};
var _calcStatsX = calcStats;
calcStats = function () {
  _calcStatsX(); var P = R.P;
  if (P.fl.rage && (P.red <= 2 && P.cont > 0 || P.cont === 0 && slots(P) <= 1)) P.st.dmg *= 1.6;
  if (P.fl.still && P.stillT > 1) P.st.dmg *= 1.5;
};
// co klatkę dla każdego gracza
var _updPlayerX = updPlayer;
updPlayer = function (dt) {
  _updPlayerX(dt); var P = R.P; if (P.dead || !R.room) return;
  var f = P.fl;
  if (f.still) { var was = P.stillT > 1; P.stillT = Math.hypot(P.vx, P.vy) < 15 ? (P.stillT || 0) + dt : 0; if (was !== P.stillT > 1) calcStats(); }
  if (f.rage) { var low = P.red <= 2 && P.cont > 0; if (low !== !!P.rageOn) { P.rageOn = low; calcStats(); } }
  if (f.holyBeam) {
    P.beamT = (P.beamT == null ? 3 : P.beamT) - dt;
    if (P.beamT <= 0) { var al = aliveEnemies(); P.beamT = 3; if (al.length) { var e = pick(al); fireLaser(e.x, -WT, PI / 2, P.st.dmg * 2.2, 'gold', { w: 14, dur: .3 }); fxRing(e.x, e.y - 10, 34, 'rgba(255,240,180,.9)'); sfx('zap', .5); } }
  }
  if (f.deathAura) {
    P.auraT = (P.auraT || 0) - dt;
    if (P.auraT <= 0) { P.auraT = .5; aliveEnemies().forEach(function (e) { if (dist(e.x, e.y, P.x, P.y) < 78) hitEnemy(e, Math.max(1, P.st.dmg * .45), {}); }); }
  }
};
// łzy: rosnące, wijące się, wybuchowe
var _updTearsX = updTears;
updTears = function (dt) {
  for (var i = 0; i < TEARS.length; i++) { var t = TEARS[i]; if (t.enemy) continue;
    if (t.grow) { t.dmg *= 1 + dt * .9; t.r = Math.min(t.r * (1 + dt * .45), 16); }
    if (t.wig) { var a = Math.atan2(t.vy, t.vx) + Math.cos((t.maxLife - t.life) * 16 + t.wigP) * dt * 7, s = Math.hypot(t.vx, t.vy); t.vx = Math.cos(a) * s; t.vy = Math.sin(a) * s; } }
  var boom = TEARS.filter(function (t) { return t.ipecac && !t.enemy; });
  _updTearsX(dt);
  boom.forEach(function (t) { if (TEARS.indexOf(t) < 0) { var o = R.P; if (t.own && t.own !== o) usePlayer(t.own); explodeAt(t.x, t.y, 44, t.dmg * 1.1, { noPlayer: 1, small: 1 }); if (R.P !== o) usePlayer(o); } });
};
// wampir: co 12 zabitych pół serca
var _killEnemyX = killEnemy;
killEnemy = function (e) {
  var was = e.dead; _killEnemyX(e); if (was || e.ally) return;
  var P = R.P; if (P && P.fl && P.fl.vamp && !P.dead) { P.vampN = (P.vampN || 0) + 1; if (P.vampN >= 12) { P.vampN = 0; if (P.red < P.cont) { P.red++; floatText(P.x, P.y - 50, '+½ ♥', '#ff6a6a'); sfx('heart'); } } }
};
// ciernie
var _damagePlayerX = damagePlayer;
damagePlayer = function (n, src) {
  var hit = _damagePlayerX(n, src), P = R.P;
  if (hit && P.fl && P.fl.thorns) { aliveEnemies().forEach(function (e) { if (dist(e.x, e.y, P.x, P.y) < 130) hitEnemy(e, 25, { knock: 2 }); }); fxRing(P.x, P.y - 14, 60, 'rgba(160,160,170,.9)'); }
  if (hit && P.fl && P.fl.rage) calcStats();
  return hit;
};
// nowe aktywne
var _activeEffectX = activeEffect;
activeEffect = function (id) {
  var P = R.P;
  switch (id) {
    case 'krwawalza': for (var k = 0; k < 12; k++) { var a = k / 12 * TAU; spawnTear(P.x, P.y - 8, Math.cos(a), Math.sin(a), { dmg: P.st.dmg * 2.5, kind: 'blood', sp: 300, big: 1 }); } shake(5); sfx('splat'); return;
    case 'modlitwa': addExtra(P, 'soul', 2); fxRing(P.x, P.y - 16, 50, 'rgba(220,240,255,.9)'); sfx('soul'); return;
    case 'egzorcyzm': fxFlash('rgba(255,250,230,.6)', .4); aliveEnemies().forEach(function (e) { hitEnemy(e, 30, { fear: 1 }); applyStatus(e, 'fear', 3); }); sfx('boom', .6); return;
    case 'zgas': R.darkT = 4; aliveEnemies().forEach(function (e) { applyStatus(e, 'fear', 4); applyStatus(e, 'confuse', 4); }); sfx('bad'); return;
    case 'lustroP': fxFlash('rgba(160,90,210,.45)', .35); shake(8); aliveEnemies().forEach(function (e) { hitEnemy(e, 25, { stun: 1 }); applyStatus(e, 'stun', 1.5); }); sfx('hurt', .5); return;
  }
  return _activeEffectX(id);
};
if (window.__G) window.__G.giveItem = function (id) { giveItem(id); };

// ---------- pokoje anioła: częściej (jak w Isaacu, gdy nie brałeś paktu z diabłem) ----------
addDealDoor = (function (orig) {
  return function (rm) {
    var keep = R.devilSeen, angelCh = (R.devilSeen ? .5 : .35) + (has('toga') || has('aureola') || has('krzyzyk') || has('rozaniec') ? .25 : 0);
    // oryginał wybiera rodzaj sam; podmieniamy wynik losowania na nasze zasady
    if (!R.devilTaken && rnd01() < angelCh) { R.devilSeen = true; var r0 = rnd01; rnd01 = function () { return 0; }; try { orig(rm); } finally { rnd01 = r0; R.devilSeen = keep; } }
    else { var t = R.devilTaken; R.devilTaken = true; try { orig(rm); } finally { R.devilTaken = t; } }
  };
})(addDealDoor);
// pokój anioła: wybór z 2–3 przedmiotów albo przedmiot + serca z łez
mkDealRoom = (function (orig) {
  return function (F, kind) {
    var rm = orig(F, kind); if (kind !== 'angel') return rm;
    var rng = mkRng(rm.seed ^ 0xA11E1), cx = rm.w / 2, cy = rm.h / 2 + 20;
    if (rm.peds.length === 1 && rng.chance(.45)) { rm.peds[0].x = cx - 70; rm.peds[0].choice = 1; rm.peds.push({ x: cx + 70, y: cy, item: poolPick('angel', rng), pool: 'angel', choice: 1 }); }
    if (rng.chance(.5)) { rm.picks.push(mkPick('heart', 'soul', cx - 120, cy + 70, rng)); rm.picks.push(mkPick('heart', 'soul', cx + 120, cy + 70, rng)); }
    return rm;
  };
})(mkDealRoom);

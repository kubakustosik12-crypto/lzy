// ---- 21_secret.js ----
// ===================== v3.5 „The Binding of Ignaczak”: dziennik, Koszmar numer 6, walka z aniołem =====================

// ---------- 1. DZIENNIK: gazety, listy i notatki znalezione w koszmarze ----------
var JOURNAL = [
  { id: 'n1', st: 0, t: 'Notatka z ławki', x: 'Ostatnia lekcja historii. Rozdział: „Lata 70. – propaganda sukcesu”. Oczy same się zamykają. Jeszcze tylko jedna strona…' },
  { id: 'n2', st: 0, t: 'Kartkówka bez nazwiska', x: 'Pytanie 1: Co śni się uczniowi, który zasnął na lekcji? Odpowiedź ktoś wpisał za ciebie: „wszystko, czego się boi”.' },
  { id: 'n3', st: 0, t: 'Dziennik lekcyjny', x: 'Ignaczak Szymon – nieobecny. Nieobecny. Nieobecny. Ostatni wpis długopisem, którego nikt nie trzyma: „obecny… gdzieś indziej”.' },
  { id: 'g1', st: 1, t: 'Trybuna Snu nr 1', x: '„RYNEK PEŁEN TOWARU!” – głosi nagłówek. Na zdjęciu obok same puste półki i kolejka, której koniec ginie we mgle.' },
  { id: 'g2', st: 1, t: 'Paragon z Rynku', x: 'Ocet – 1 szt. Ocet – 1 szt. Ocet – 1 szt. Razem: wszystko, co miałeś w kieszeni. Gołębie przy kasie patrzą za długo.' },
  { id: 'l1', st: 2, t: 'List od Mamy (1)', x: '„Szymon, obiad stygnie. Ile razy mam wołać? Nie każ mi przychodzić na górę.” Papier pachnie rosołem i strachem.' },
  { id: 'n4', st: 2, t: 'Kartka z internatu', x: 'Ktoś wydrapał na łóżku: „budziki dzwonią, ale nikt się nie budzi”. Pod spodem dziesiątki kresek. Dni? Noce?' },
  { id: 'l2', st: 3, t: 'List od Mamy (2)', x: '„Słyszę cię w piwnicy. Wiem, że tam jesteś. Kapcie już włożyłam.”' },
  { id: 'n5', st: 3, t: 'Rysunek dziecka', x: 'Dom, kot i duża postać bez twarzy z łyżką w ręce. Podpis krzywymi literami: „MAMA SIĘ GNIEWA”.' },
  { id: 'g3', st: 4, t: 'Trybuna Snu nr 2', x: '„PLAN WYKONANY W 200%!” Mniejszym drukiem: „Brakujące 100% odnalezione w twoich snach. Prosimy nie budzić obywateli.”' },
  { id: 'g4', st: 4, t: 'Kartka na mięso', x: 'Przydział na miesiąc: 0,5 kg. Pieczątka: „KOMITET SNU”. Na odwrocie odręcznie: „ustaw się w kolejce, Szymon”.' },
  { id: 'g5', st: 4, t: 'Komunikat z megafonu', x: '„Towarzysze! Sukces jest obowiązkowy. Kto się obudzi przed końcem zmiany, zostanie wpisany do podręcznika jako przykład.”' },
  { id: 'o1', st: 5, t: 'Kartka z podręcznika', x: 'Rozdział 1: Mity greckie. Ktoś dorysował bogu twarz Szymona i podpisał: „Igyatczak – bóg płaczu”.' },
  { id: 'l3', st: 6, t: 'List bez znaczka', x: '„Pokonałeś Mamę. Pokonałeś Sekretarza. Wspiąłeś się na Olimp. Ale kto wraca do mieszkania w bloku, kiedy wszyscy śpią?” – S.' },
  { id: 'n6', st: 6, t: 'Zdjęcie z meblościanki', x: 'Rodzinne zdjęcie. Mama, dziadek, kot… i chłopiec, który wygląda jak Szymon. Tyle że płacze krwią i patrzy prosto w obiektyw.' },
  { id: 'n7', st: 6, t: 'Ostatnia strona', x: '„Koszmar numer 6 nie ma bossa. Koszmar numer 6 to ty, kiedy przestajesz się budzić.”' }
];
function journalStage() { var i = R && R.floor ? R.floor.i : 0; return i <= 1 ? 0 : i <= 3 ? 1 : i <= 5 ? 2 : i <= 7 ? 3 : i === 8 ? 5 : i <= 10 ? 4 : 6; }
function journalNext() {
  PROF.journal = PROF.journal || {}; var st = journalStage(), left = JOURNAL.filter(function (j) { return !PROF.journal[j.id]; });
  return left.filter(function (j) { return j.st === st; })[0] || left.filter(function (j) { return j.st <= st; })[0] || null;
}
EMO2SPR['\uE3F3'] = ['paper', '#e8dcb8'];
var _fillRoomJ = fillRoom;
fillRoom = function (F, rm, rng) {
  _fillRoomJ(F, rm, rng);
  if (rm.type !== 'normal') return; var r2 = mkRng((rm.seed ^ 0x6A2E) >>> 0);
  if (r2.chance(.16)) { var p = mkPick('gazeta', 'j', rm.w / 2 + r2.range(-90, 90), rm.h / 2 + r2.range(-50, 50), r2); rm.picks.push(p); }
};
var _drawPickupJ = drawPickup;
drawPickup = function (p) {
  if (p.type !== 'gazeta') return _drawPickupJ(p);
  shadow(p.ix, p.iy + 6, 8, 3, .25); drawSpr('paper', p.ix, p.iy - 6 + Math.sin(GAME.t * 2 + p.id) * 1.2, 16, '#e8dcb8', null, null, Math.sin(GAME.t + p.id) * .15);
};
var _collectPickJ = collectPick;
collectPick = function (p) {
  if (p.type !== 'gazeta') return _collectPickJ(p);
  var j = journalNext(); sfx('card');
  if (j) { PROF.journal[j.id] = 1; saveProf(); banner(j.t, 'Nowy wpis w Dzienniku (menu główne)', '#e8dcb8', 3.2); }
  else { R.P.coins = Math.min(99, R.P.coins + 2); floatText(p.x, p.y - 30, 'Stara gazeta… +2 zł', '#e8dcb8'); }
  return true;
};
function showJournal() {
  PROF.journal = PROF.journal || {}; var got = JOURNAL.filter(function (j) { return PROF.journal[j.id]; }).length;
  box('<h2>Dziennik</h2><p>Znalezione wpisy: <b>' + got + ' / ' + JOURNAL.length + '</b> — gazety, listy i notatki leżą w pokojach koszmaru.</p><div id="jl" style="display:grid;gap:6px;max-height:46vh;overflow:auto"></div><p id="jt" style="min-height:70px"></p><div id="jb"></div>');
  JOURNAL.forEach(function (j) {
    var ok = PROF.journal[j.id], d = document.createElement('button'); d.className = 'btn'; d.style.textAlign = 'left';
    d.innerHTML = ok ? esc(j.t) : '???'; d.disabled = !ok;
    d.onclick = function () { $('jt').innerHTML = '<b style="color:#e8dcb8">' + esc(j.t) + '</b><br>' + esc(j.x); sfx('card'); };
    $('jl').appendChild(d);
  });
  $('jb').appendChild(mkBtn('Wstecz', '', showTitle));
}
var _showTitleJ = showTitle;
showTitle = function () {
  var r = _showTitleJ.apply(this, arguments);
  setTimeout(function () { var m = $('tmenu'); if (!m || m.querySelector('[data-jr]')) return; PROF.journal = PROF.journal || {}; var got = JOURNAL.filter(function (j) { return PROF.journal[j.id]; }).length, b = mkBtn('Dziennik', got + ' / ' + JOURNAL.length + ' wpisów', showJournal); b.setAttribute('data-jr', 1); m.insertBefore(b, m.children[Math.min(3, m.children.length)] || null); }, 0);
  return r;
};

// ---------- 2. KOSZMAR NUMER 6: sekretna ścieżka po zaliczeniu obu zakończeń ----------
ENDINGS.secret = ['Koszmar numer 6 (prawdziwe zakończenie)', 'Cień Szymona pęka jak lustro. Za nim jest tylko mieszkanie w bloku, ciche i zwyczajne. Mama woła na obiad – normalnym głosem. Szymon budzi się naprawdę: w łóżku, w domu, bez listów w kieszeni. Na szafce siedzi Pocket i patrzy, jakby wszystko wiedział.'];
Object.assign(UNLOCKS, {
  end_grey: { t: 'Zakończenie „Pobudka” (Szary list)', give: 'Przedmioty anielskie w puli: Skrzydła serafina, Światło na końcu korytarza' },
  end_red: { t: 'Zakończenie „Wielki Sukces” (Czerwony list)', give: 'Przedmioty PRL w puli: Talon na malucha, Paszport z szuflady' },
  end_secret: { t: 'Prawdziwe zakończenie „Koszmar numer 6”', give: 'Postać: Cień Szymona' }
});
ITEMS.serafin.lock = 'end_grey'; ITEMS.swiatlo.lock = 'end_grey'; ITEMS.talon.lock = 'end_red'; ITEMS.paszport.lock = 'end_red';
FLOORS[11] = { n: 'Mieszkanie z lat 70.', ch: 'mieszkanie', theme: 'blok', mus: 'piwnica', bosses: ['cien'], last: 1, dark: 1 };
MOBPOOL.mieszkanie = [['duch', 3], ['nietoperz', 2], ['petent', 2], ['spioch', 2], ['budzik', 2], ['nozownik', 1], ['poduszka', 1]];
THEMES.blok = { floor: 'parquet', fa: '#6a4a2a', fb: '#5a3e22', grout: '#3a2614', wallA: '#8a7a4a', wallB: '#6a5a32', wallLow: '#4a3a1a', trim: '#2a1e0e', side: '#5a4a2a', vign: .82, tint: 'rgba(255,200,80,.06)' };
u3item('zdjecie', 'Rodzinne zdjęcie', 'mirror', '#c8a070', null, 4, [], 'Stare zdjęcie z mieszkania w bloku. Na nim Szymon… ale to nie on.');
var _bossDefeatedX = bossDefeated;
bossDefeated = function (e) {
  if (e.boss === 'aniol') return angelDefeated(e);
  var r = _bossDefeatedX(e);
  if (e.boss === 'matka' && PROF.unl.end_red && PROF.unl.end_grey) {
    var rm = R.room, cx = rm.w / 2, cy = rm.h / 2 + 10;
    rm.peds.forEach(function (q) { if (q.choice === 77) q.x = q.item === 'listCzerwony' ? cx - 110 : cx + 110; });
    rm.peds.push({ x: cx, y: cy - 10, item: 'zdjecie', pool: 'boss', cd: 1.5, appear: 1, choice: 77 });
    later(4.8, function () { banner('Trzecia droga', 'Na stole leży też stare zdjęcie…', '#c8a070', 3); }, true);
  }
  return r;
};
var _giveItemX = giveItem;
giveItem = function (id, quiet) {
  _giveItemX(id, quiet);
  if (id !== 'zdjecie') return;
  var rm = R.room; R.path = 'secret'; R.nextFi = 11;
  rm.peds.forEach(function (q) { if (q.choice === 77 && q.item && q.item !== id) { fxPoof(q.x, q.y - 26, '#c8a070'); q.item = null; } });
  if (!rm.trap) { var tp = nearFree(rm, rm.w / 2, rm.h / 2 + 70); rm.trap = { x: tp[0], y: tp[1], t: -.8 }; }
  later(1.4, function () { banner('Rodzinne zdjęcie', '„Wróć do domu, Szymon.”', '#c8a070', 3.4); }, true);
};
// cień Szymona – boss
BOSSES.cien = { n: 'Szymon z koszmaru', hp: 2100, r: 16, rest: .75, w: { lustro: 3, placz: 3, koszmary: 1, skok: 2 }, w2: { lustro: 3, placz: 3, koszmary: 1, skok: 2, krew: 3 },
  p2: function (e) { floatText(e.x, e.y - 80, 'TO TY. TO ZAWSZE BYŁEŚ TY.', '#ff4a4a'); shake(12); for (var i = 0; i < 8; i++) addCreep(e.x + Math.cos(i / 8 * TAU) * 50, e.y + Math.sin(i / 8 * TAU) * 34, 22, 'fire', 5, true); },
  idle: function (e, dt, sm) { // porusza się jak twoje lustrzane odbicie
    var P = R.P, rm = R.room, tx = clamp(rm.w - P.x, 40, rm.w - 40), ty = clamp(rm.h - P.y, 40, rm.h - 40), a = angTo(e.x, e.y, tx, ty), d = dist(e.x, e.y, tx, ty), sp = Math.min(130, d * 3) * sm;
    e.vx += (Math.cos(a) * sp - e.vx) * Math.min(1, dt * 6); e.vy += (Math.sin(a) * sp - e.vy) * Math.min(1, dt * 6);
  },
  atk: {
    lustro: function (e, dt, t) { BOSSES.cien.idle(e, dt, 1); if (every(e, 'l', .2, .28) && e.atD.l < (e.p2 ? 7 : 5)) { bSpread(e, e.p2 ? 2 : 1, .12, 230, 'blood', null, 34); sfx('shoot', .4); } return t > 1.8; },
    placz: function (e, dt, t) { e.vx *= .85; e.vy *= .85; if (every(e, 'p', .25, .42) && e.atD.p < 3) bRing(e, e.p2 ? 14 : 10, 130, 'blood', e.atD.p * .2, 34); return t > 1.7; },
    koszmary: function (e, dt, t) { e.vx *= .85; e.vy *= .85; if (once(e, 'a', .3)) { floatText(e.x, e.y - 80, pick(['To tylko sen…', 'Obudź się.', 'Mama woła.', 'Nie ma wyjścia.']), '#ff8a8a'); bSummon(e, 'duch', 2, 4); } return t > 1.2; },
    skok: function (e, dt, t) { if (once(e, 'a', .3)) { var a = aimP(e, 0); e.cx = Math.cos(a); e.cy = Math.sin(a); } if (t > .3 && t < .8) { e.vx = e.cx * 380; e.vy = e.cy * 380; } else { e.vx *= .8; e.vy *= .8; } return t > 1.1; },
    krew: function (e, dt, t) { BOSSES.cien.idle(e, dt, 1.2); e.ct = (e.ct || 0) - dt; if (e.ct <= 0) { e.ct = .12; addCreep(e.x, e.y + 4, 16, 'fire', 4, true); } if (every(e, 'k', .3, .5) && e.atD.k < 3) bSpread(e, 3, .25, 200, 'blood', null, 34); return t > 1.8; }
  },
  draw: function (e) {
    var g = X.createRadialGradient(e.ix, e.iy - 20, 4, e.ix, e.iy - 20, 70); g.addColorStop(0, 'rgba(120,0,0,.45)'); g.addColorStop(1, 'rgba(0,0,0,0)'); X.fillStyle = g; X.fillRect(e.ix - 70, e.iy - 90, 140, 140);
    artHuman(e, { face: 'cien', ex: 'n', sz: 1.5, look: { shirt: '#3a1a1a', pants: '#1a0a0a', shoes: '#2a0a0a', hair: '#2a1a12', skin: '#b88a7a' } });
  } };
// Cień Szymona – postać do odblokowania
CHARS.cien = { n: 'Cień Szymona', face: 'cien', d: 'Koszmar, który nauczył się płakać krwią. Mało zdrowia, ogromne obrażenia, krwawe łzy.', look: { shirt: '#2a1414', pants: '#140a0a', shoes: '#3a1a1a', hair: '#2a1a12', skin: '#b88a7a' },
  cont: 2, red: 2, soul: 0, black: 4, coins: 0, bombs: 1, keys: 0, active: 'krwawalza', items: [], tear: 'tear', st: { dmgMult: 1.5, tears: .25, spd: .05 }, lock: 'end_secret' };
if (CHARORDER.indexOf('cien') < 0) CHARORDER.push('cien'); CHARLOCK.cien = 'end_secret';
var _tearLookX = tearLook;
tearLook = function (P) { if (P.ch === 'cien') return 'blood'; return _tearLookX(P); };
// zapis zakończeń (odblokowania)
var _showWinX = showWin;
showWin = function (u) {
  var path = (R && R.path) || 'grey', k = 'end_' + path, fresh = !PROF.unl[k];
  PROF.unl[k] = 1; saveProf();
  _showWinX(u);
  if (fresh && UNLOCKS[k]) setTimeout(function () { toast('🔓 Odblokowano!', UNLOCKS[k].give); }, 900);
  if (PROF.unl.end_red && PROF.unl.end_grey && !PROF.unl.end_secret && path !== 'secret') setTimeout(function () { toast('📷 Coś się zmieniło', 'Po pokonaniu Matki pojawi się trzecia droga…'); }, 2600);
};

// ---------- 3. POKÓJ ANIOŁA: wysadź posąg, a zstąpi Anioł Stróż Koszmaru ----------
BOSSES.aniol = { n: 'Anioł Stróż Koszmaru', hp: 520, r: 16, fly: 1, rest: .9, w: { pioro: 3, promien: 2, krag: 2 },
  idle: function (e, dt, sm) { bIdleMid(e, dt, sm, 70); },
  atk: {
    pioro: function (e, dt, t) { e.vx *= .85; e.vy *= .85; if (every(e, 'p', .2, .4) && e.atD.p < 3) { bSpread(e, 5, .2, 190, 'feather', null, 40); sfx('shoot', .4); } return t > 1.5; },
    promien: function (e, dt, t) { e.vx *= .85; e.vy *= .85; if (once(e, 'a', .2)) bLaserWarn(e, aimP(e, 40), .7, .3, 40, 12, 'gold'); if (once(e, 'b', .9)) bLaserWarn(e, aimP(e, 40) + .4, .6, .3, 40, 12, 'gold'); return t > 1.7; },
    krag: function (e, dt, t) { e.vx *= .85; e.vy *= .85; if (every(e, 'k', .2, .5) && e.atD.k < 2) bRing(e, 14, 120, 'gold', e.atD.k * .22, 40); return t > 1.4; }
  },
  draw: function (e) {
    artHuman(e, { face: 'ignaczak', ex: 'm', sz: 1.45, fly: true, wingCol: 'rgba(255,250,235,.95)', look: { shirt: '#f4efe2', pants: '#e8e0d0', shoes: '#f4efe2', hair: '#e8e0d0', skin: '#e8e8f0' } });
    drawSpr('halo', e.ix, e.iy - 82 - (e.z || 0), 24, null, null, .9);
  } };
var _npcBlownX = npcBlown;
npcBlown = function (n) {
  if (n.k !== 'statueGreek' || n.dead || !R.room || R.room.type !== 'angel') return _npcBlownX(n);
  n.dead = true; var rm = R.room; rm.cleared = false; shake(10); fxFlash('rgba(255,250,220,.6)', .5); sfx('boom');
  for (var i = 0; i < 16; i++) fxPart(n.x, n.y, rnd(-180, 180), rnd(-200, 40), pick(['#e8e0d0', '#d8cfbc', '#ffe08a']), rnd(4, 8), rnd(.5, 1.2), 1);
  var e = spawnBoss('aniol', n.x, n.y + 50); e.hp = e.maxHp = BOSSES.aniol.hp * (1 + R.fi * .1); e.stT = 1.4; BOSSBAR.e = e;
  banner('Anioł Stróż Koszmaru', 'Nie trzeba było ruszać posągu…', '#ffe08a', 2.6);
};
function angelDefeated(e) {
  var rm = R.room; sfx('bossdie'); shake(10); fxFlash('rgba(255,255,255,.5)', .5); BOSSBAR.e = null;
  for (var i = 0; i < 24; i++) fxPart(e.x, e.y - 30, rnd(-220, 220), rnd(-260, 40), pick(['#ffffff', '#ffe08a', '#e8eef4']), rnd(4, 8), rnd(.6, 1.3), 1);
  TEARS.forEach(function (t) { if (t.enemy) t.life = 0; });
  var sp = nearFree(rm, e.x, e.y); rm.peds.push({ x: sp[0], y: sp[1], item: poolPick('angel', mkRng(rm.seed + 11)) || poolPick('tre', mkRng(rm.seed + 11)), pool: 'angel', cd: 1.2, appear: 1 });
  dropPick('heart', 'soul', e.x, e.y, true);
  if (typeof isCoopRun === 'function' && isCoopRun()) { rm.dupDone = 0; dupPeds(rm); }
}
if (window.__G) { window.__G.JOURNAL = JOURNAL; window.__G.showJournal = showJournal; }

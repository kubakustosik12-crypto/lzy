// ---- 12_ui.js ----
// ===================== MENU: tytuł, wybór postaci, pauza, ustawienia, kolekcja, gazeta, wygrana =====================
var UI = { sel: 0, screen: '' };
function showScr(id) { ['title', 'menu'].forEach(function (k) { $(k).classList.toggle('hid', k !== id); }); document.body.classList.toggle('menu', !!id); UI.sel = 0; setTimeout(focusSel, 0); }
function btns() { var root = !$('menu').classList.contains('hid') ? $('mbox') : $('tmenu'); return Array.prototype.slice.call(root.querySelectorAll('.btn:not(:disabled)')); }
function focusSel() { var b = btns(); b.forEach(function (x, i) { x.classList.toggle('sel', i === UI.sel); }); }
function mkBtn(label, sub, fn, cls) { var b = document.createElement('button'); b.className = 'btn' + (cls ? ' ' + cls : ''); b.innerHTML = esc(label) + (sub ? '<small>' + esc(sub) + '</small>' : ''); b.onclick = function () { sfx('pickup'); fn(); }; b.onmouseenter = function () { UI.sel = btns().indexOf(b); focusSel(); }; return b; }
function box(html) { var m = $('mbox'); m.className = 'box'; m.innerHTML = html || ''; showScr('menu'); return m; }
// ---------- tytuł ----------
function showTitle() {
  GAME.state = 'title'; GAME.paused = false; music('szkola'); var m = $('tmenu'); m.innerHTML = '';
  var save = LS.get('lzy-run', null);
  if (save && save.v === GV && save.floor) m.appendChild(mkBtn('Kontynuuj', CHARS[save.ch].n + (save.ch2 ? ' + ' + CHARS[save.ch2].n : '') + ' • ' + FLOORS[save.floor.i].n, function () { if (loadRun()) { COOP.mode = players().length > 1 ? 'local' : 'solo'; COOP.on = players().length > 1; startPlay(); } }, 'pri'));
  m.appendChild(mkBtn('Nowa gra', 'Wybierz postać i zejdź w koszmar', showCharSel, save ? '' : 'pri'));
  m.appendChild(mkBtn('Co-op', 'Dwóch graczy: na jednym komputerze albo przez internet', showCoopMenu));
  m.appendChild(mkBtn('Kolekcja', Object.keys(PROF.coll).length + ' / ' + Object.keys(ITEMS).length + ' przedmiotów', showCollection));
  m.appendChild(mkBtn('Postępy', 'Odblokowania i statystyki', showProgress));
  m.appendChild(mkBtn('Ustawienia', '', function () { showSettings(showTitle); }));
  m.appendChild(mkBtn('Sterowanie', '', function () { showControls(showTitle); }));
  $('ver').textContent = 'The Binding of Ignaczak v' + (window.BUILD || GV) + (window.LZY_APP ? ' • Windows' : '') + ' • kopia dla Ciebie';
  showScr('title');
}
// ---------- wybór postaci ----------
function charLocked(id) { return CHARLOCK[id] && !unlocked(CHARLOCK[id]); }
function showCharSel(opts) {
  opts = opts && opts.onPick ? opts : {};
  var m = box('<h2>' + esc(opts.title || 'Kto dziś płacze?') + '</h2><div class="chars" id="chars"></div><div id="chinfo" style="min-height:92px"></div><label class="ck" style="margin-top:6px">Ziarno: <input class="tx" id="seed" placeholder="losowe (np. ABCD 1234)" maxlength="9" style="width:200px"></label><div class="row" id="crow"></div>');
  var wrap = $('chars'), cur = LS.get('lzy-lastch', 'ignaczak'); if (charLocked(cur)) cur = 'ignaczak';
  var info = function (id) {
    var C = CHARS[id], lk = charLocked(id), s = Object.assign({ spd: 0, tears: 0, dmgMult: 1, range: 0 }, C.st);
    var hearts = '❤️'.repeat(C.cont / 2) + '💙'.repeat(C.soul / 2) + '🖤'.repeat(C.black / 2);
    $('chinfo').innerHTML = lk ? '<p style="color:#e8b14a">🔒 ' + esc(UNLOCKS[CHARLOCK[id]].t) + '</p>' :
      '<p>' + esc(C.d) + '</p><div class="stats"><div>Zdrowie: <b>' + hearts + '</b></div><div>Szybkość: <b>' + (1 + s.spd).toFixed(2) + '</b></div><div>Obrażenia: <b>×' + s.dmgMult.toFixed(2) + '</b></div><div>Start: <b>' + ITEMS[(id === 'ignaczak' && unlocked('win_ignaczak')) ? 'kostka' : C.active].e + ' ' + esc(ITEMS[(id === 'ignaczak' && unlocked('win_ignaczak')) ? 'kostka' : C.active].n) + '</b></div><div>Wygrane: <b>' + (PROF.winsBy[id] || 0) + '</b></div></div>';
  };
  CHARORDER.forEach(function (id) {
    var C = CHARS[id], lk = charLocked(id), d = document.createElement('div'); d.className = 'ch' + (lk ? ' lock' : '') + (id === cur ? ' sel' : '');
    var cv = document.createElement('canvas'); cv.width = 110; cv.height = 110; var x = cv.getContext('2d'), im = faceImg(C.face, lk ? 'z' : 'n', 96, x);
    x.fillStyle = '#2e2420'; x.beginPath(); x.arc(55, 55, 52, 0, TAU); x.fill(); if (im && im.complete) { var h = 96, w = h * (FM[C.face] || { asp: .72 }).asp; x.drawImage(im, 55 - w / 2, 58 - h / 2, w, h); }
    d.appendChild(cv); d.insertAdjacentHTML('beforeend', '<b>' + esc(lk ? '???' : C.n) + '</b><small>' + (lk ? 'zablokowany' : ITEMS[C.active].e + ' ' + esc(ITEMS[C.active].n)) + '</small>');
    d.onclick = function () { if (lk) { sfx('error'); info(id); return; } cur = id; wrap.querySelectorAll('.ch').forEach(function (q) { q.classList.remove('sel'); }); d.classList.add('sel'); info(id); sfx('pickup'); };
    d.ondblclick = function () { if (!lk) go(); };
    d.dataset.id = id; wrap.appendChild(d);
  });
  info(cur);
  var go = function () { var sd = ($('seed').value || '').toUpperCase().replace(/[^A-Z0-9]/g, ''), seed = sd.length >= 4 ? sd.slice(0, 4) + ' ' + sd.slice(4, 8) : null; if (opts.onPick) return opts.onPick(cur, seed); LS.set('lzy-lastch', cur); COOP.mode = 'solo'; newRun(cur, seed); startPlay(); };
  if (opts.noSeed) $('seed').parentNode.style.display = 'none';
  $('crow').appendChild(mkBtn('Wstecz', '', opts.back || showTitle)); $('crow').appendChild(mkBtn('Graj!', '', go, 'pri'));
  UI.charKeys = function (dx) { var ids = CHARORDER.filter(function (i) { return !charLocked(i); }), i = ids.indexOf(cur); cur = ids[(i + dx + ids.length) % ids.length]; wrap.querySelectorAll('.ch').forEach(function (q) { q.classList.toggle('sel', q.dataset.id === cur); }); info(cur); sfx('pickup'); };
  UI.charGo = go; UI.screen = 'chars'; UI.sel = 1;
}
function startPlay() { UI.screen = ''; UI.charKeys = null; showScr(null); GAME.state = 'play'; GAME.paused = false; GAME.resumeT = GAME.t; KHIT = {}; document.body.classList.remove('menu'); auInit(); }
// ---------- pauza ----------
function pauseGame() {
  if (GAME.state !== 'play' || GAME.paused) return; GAME.paused = true; sfx('card');
  var P = R.P, items = P.items.map(function (id) { return '<span title="' + esc(ITEMS[id].n + ' — ' + ITEMS[id].d) + '">' + ITEMS[id].e + '</span>'; }).join(' ');
  var m = box('<h2>Pauza</h2><p>' + esc(CHARS[P.ch].n) + ' • ' + esc(R.floor.def.n) + ' • czas ' + fmtTime(R.time) + ' • ziarno <b style="color:#e8b14a">' + esc(R.seed) + '</b></p><div style="font-size:22px;letter-spacing:2px;margin:8px 0;min-height:28px">' + (items || '<span style="font-size:14px;color:#8a7e6a">brak przedmiotów</span>') + '</div><div id="pb"></div>');
  var pb = $('pb'); pb.appendChild(mkBtn('Wznów', '', resumeGame, 'pri'));
  pb.appendChild(mkBtn('Ustawienia', '', function () { showSettings(function () { GAME.paused = false; pauseGame(); }); }));
  pb.appendChild(mkBtn('Sterowanie', '', function () { showControls(function () { GAME.paused = false; pauseGame(); }); }));
  pb.appendChild(mkBtn('Zapisz i wyjdź', 'Wrócisz do tego miejsca', function () { saveRun(); showTitle(); }));
  pb.appendChild(mkBtn('Porzuć bieg', 'Nowy bieg od zera', function () { LS.del('lzy-run'); R = null; showCharSel(); }));
}
function resumeGame() { GAME.paused = false; GAME.resumeT = GAME.t; KHIT = {}; showScr(null); document.body.classList.remove('menu'); }
// ---------- ustawienia ----------
function showSettings(back) {
  var m = box('<h2>Ustawienia</h2>' +
    '<label class="ck">Głośność <input type="range" id="sv" min="0" max="1" step=".05" value="' + SET.vol + '"></label>' +
    '<label class="ck">Muzyka <input type="range" id="sm" min="0" max="1" step=".05" value="' + SET.mus + '"></label>' +
    '<label class="ck"><input type="checkbox" id="ss"' + (SET.shake ? ' checked' : '') + '> Trzęsienie ekranu</label>' +
    '<label class="ck"><input type="checkbox" id="sh"' + (SET.hud ? ' checked' : '') + '> Pokazuj statystyki</label>' +
    '<label class="ck"><input type="checkbox" id="sp"' + (SET.palx === true ? ' checked' : '') + '> Retro paleta (64 kolory, grubszy piksel)</label>' +
    '<label class="ck"><input type="checkbox" id="sf"' + (document.fullscreenElement ? ' checked' : '') + '> Pełny ekran (F11)</label><div id="sb"></div>');
  $('sv').oninput = function () { SET.vol = +this.value; setVolumes(); saveSet(); }; $('sm').oninput = function () { SET.mus = +this.value; setVolumes(); saveSet(); };
  $('ss').onchange = function () { SET.shake = this.checked; saveSet(); }; $('sh').onchange = function () { SET.hud = this.checked ? 1 : 0; saveSet(); };
  $('sf').onchange = function () { toggleFS(); };
  $('sp').onchange = function () { SET.palx = this.checked; saveSet(); };
  $('sb').appendChild(mkBtn('Gotowe', '', back, 'pri'));
}
function toggleFS() { if (window.syrFullscreen) { window.syrFullscreen(); return; } try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (e) { } }
function showControls(back) {
  box('<h2>Sterowanie</h2><div class="keys"><b>WASD</b><span>ruch</span><b>Strzałki / IJKL</b><span>płacz (strzał w 4 kierunkach)</span><b>Spacja</b><span>przedmiot aktywny</span><b>E</b><span>petarda</span><b>Q</b><span>karta / puszka</span><b>Ctrl</b><span>upuść drobiazg</span><b>Tab</b><span>mapa piętra</span><b>Esc / P</b><span>pauza</span><b>F11</b><span>pełny ekran</span><b>Pad</b><span>lewa gałka ruch, przyciski ABXY strzał, RT/RB przedmiot, LT petarda, LB karta</span><b>Dotyk</b><span>lewa połowa ruch, prawa strzał</span></div><div id="cb" style="margin-top:12px"></div>');
  $('cb').appendChild(mkBtn('Wstecz', '', back, 'pri'));
}
// ---------- kolekcja i postępy ----------
function showCollection() {
  var ids = Object.keys(ITEMS), got = ids.filter(function (i) { return PROF.coll[i]; }).length;
  var m = box('<h2>Kolekcja</h2><p>Znalezione: <b>' + got + ' / ' + ids.length + '</b> — najedź, by przeczytać</p><div class="coll" id="cg"></div><p id="cd" style="min-height:40px"></p><div id="cb"></div>');
  ids.forEach(function (id) { var it = ITEMS[id], d = document.createElement('div'), ok = PROF.coll[id]; d.textContent = it.e; if (!ok) d.className = 'no'; d.onmouseenter = d.onclick = function () { $('cd').innerHTML = ok ? '<b style="color:#f3eadb">' + esc(it.n) + '</b> — ' + esc(it.d) + (it.act ? ' <i>(aktywny, ' + it.act + ' ład.)</i>' : '') : (it.lock && !unlocked(it.lock) ? '🔒 ' + esc(UNLOCKS[it.lock].t) : '??? — jeszcze go nie znalazłeś'); }; $('cg').appendChild(d); });
  $('cb').appendChild(mkBtn('Wstecz', '', showTitle, 'pri'));
}
function showProgress() {
  var rows = Object.keys(UNLOCKS).map(function (k) { var u = UNLOCKS[k], ok = PROF.unl[k]; return '<div style="padding:5px 0;border-bottom:1px solid #3a2e24;' + (ok ? '' : 'opacity:.55') + '">' + (ok ? '✅' : '🔒') + ' <b>' + esc(u.t) + '</b><br><small style="color:#b8ad98">' + esc(u.give) + '</small></div>'; }).join('');
  var bk = Object.keys(BOSSES).map(function (k) { return esc(BOSSES[k].n) + ': <b>' + (PROF.bossKills[k] || 0) + '</b>'; }).join(' • ');
  box('<h2>Postępy</h2><div class="stats"><div>Biegi: <b>' + PROF.runs + '</b></div><div>Wygrane: <b>' + PROF.wins + '</b></div><div>Śmierci: <b>' + PROF.deaths + '</b></div><div>Pokonani wrogowie: <b>' + PROF.kills + '</b></div><div>Przedmioty: <b>' + Object.keys(PROF.coll).length + '</b></div></div><p style="font-size:12.5px">' + bk + '</p>' + rows + '<div id="pb2" style="margin-top:10px"></div>');
  $('pb2').appendChild(mkBtn('Wstecz', '', showTitle, 'pri'));
}
// ---------- gazeta po śmierci ----------
var HEADS = ['{K} ZAATAKOWAŁ UCZNIA Z KOŁA!', 'TRAGEDIA: {K} KONTRA SZLOCHAJĄCY CHŁOPAK', 'ŚWIADKOWIE: „{K} BYŁ BEZLITOSNY”', 'KOSZMAR W KOLE! WINNY: {K}', 'POLICJA SZUKA SPRAWCY. TO {K}!'];
function showDeath() {
  if (!R) return; GAME.state = 'dead'; var P = R.P, killer = KILLERS[R.lastHit] || (BOSSES[R.lastHit] ? BOSSES[R.lastHit].n.toUpperCase() : 'NIEZNANY SPRAWCA');
  var items = P.items.map(function (id) { return ITEMS[id].e; }).join(' ');
  var d = new Date(), months = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
  var m = box('');
  m.className = 'paper'; m.innerHTML = '<div class="mast">GAZETA KOLSKA</div><div class="date">Koło, ' + d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear() + ' • wydanie nadzwyczajne • cena 2,50 zł</div>' +
    '<div style="display:flex;gap:14px;align-items:flex-start"><img src="' + (IMG.puppet ? IMG.puppet.src : '') + '" style="width:120px;filter:grayscale(1) contrast(1.15);border:2px solid #2a2018;transform:rotate(1deg)"><div style="flex:1"><div class="head">' + esc(pick(HEADS).replace('{K}', killer)) + '</div>' +
    '<p>' + esc(CHARS[P.ch].n) + ' nie przetrwał koszmaru na piętrze <b>' + esc(R.floor.def.n) + '</b>. Ostatni raz widziano go po ' + fmtTime(R.time) + ' płaczu. Pokonał ' + (PROF.kills - R.kills0) + ' wrogów.</p>' +
    '<p style="font-size:12px">Przy ciele znaleziono:</p><div class="its">' + (items || '—') + '</div><p style="font-size:11.5px">Ziarno: ' + esc(R.seed) + '</p></div></div><div class="row" id="dr" style="margin-top:12px"></div>';
  var row = $('dr'), ch = R.ch; row.appendChild(mkBtn('Jeszcze raz', '', function () { m.className = 'box'; newRun(ch, null); startPlay(); }, 'pri')); row.appendChild(mkBtn('Menu', '', function () { m.className = 'box'; R = null; showTitle(); }));
  focusSel();
}
// ---------- wygrana ----------
function showWin(unlockTxt) {
  GAME.state = 'won'; var P = R.P, items = P.items.map(function (id) { return ITEMS[id].e; }).join(' ');
  var m = box('<h2 style="font-size:32px">🥇 NUMBERO 1</h2><p style="font-size:16px;color:#f3eadb">Szymon budzi się w klasie. Nauczyciel patrzy na niego z niepokojem. <i>„Ignaczak, płakałeś przez sen?”</i></p><p>To był tylko sen. Pięć koszmarów pokonanych w <b>' + fmtTime(R.time) + '</b>.</p><div style="font-size:24px;letter-spacing:3px;margin:8px 0">' + items + '</div>' + (unlockTxt ? '<p style="color:#ffe08a">🔓 Odblokowano: ' + esc(unlockTxt) + '</p>' : '') + '<p style="font-size:12px">Ziarno: ' + esc(R.seed) + '</p><div class="row" id="wr"></div>');
  $('wr').appendChild(mkBtn('Nowy bieg', '', function () { R = null; showCharSel(); }, 'pri')); $('wr').appendChild(mkBtn('Menu', '', function () { R = null; showTitle(); }));
}
// ---------- klawiatura i pad w menu ----------
window.addEventListener('keydown', function (e) {
  if (e.code === 'F11') { e.preventDefault(); toggleFS(); return; }
  if (GAME.state === 'play' && !GAME.paused) return;
  if (e.target && e.target.tagName === 'INPUT' && e.code !== 'Enter' && e.code !== 'Escape') return;
  var b = btns(); if (!b.length) return;
  if (UI.screen === 'chars' && UI.charKeys && (e.code === 'ArrowLeft' || e.code === 'KeyA')) { UI.charKeys(-1); e.preventDefault(); return; }
  if (UI.screen === 'chars' && UI.charKeys && (e.code === 'ArrowRight' || e.code === 'KeyD')) { UI.charKeys(1); e.preventDefault(); return; }
  if (e.code === 'ArrowDown' || e.code === 'KeyS') { UI.sel = (UI.sel + 1) % b.length; focusSel(); e.preventDefault(); }
  else if (e.code === 'ArrowUp' || e.code === 'KeyW') { UI.sel = (UI.sel - 1 + b.length) % b.length; focusSel(); e.preventDefault(); }
  else if (e.code === 'Enter' || e.code === 'Space') { if (UI.screen === 'chars' && UI.charGo && !(b[UI.sel] && b[UI.sel].classList.contains('btn') && b[UI.sel].textContent === 'Wstecz')) { UI.charGo(); } else if (b[UI.sel]) b[UI.sel].click(); e.preventDefault(); }
  else if (e.code === 'Escape') { if (GAME.state === 'play' && GAME.paused) resumeGame(); }
});
function menuPad() {
  if (GAME.state === 'play' && !GAME.paused) return; if (!PAD.on) return; var b = btns(); if (!b.length) return;
  var ay = PAD.ax[1], ax = PAD.ax[0]; UI.padT = (UI.padT || 0) - 1 / 60;
  if (UI.padT <= 0) { if (ay > .6 || PAD.b[13]) { UI.sel = (UI.sel + 1) % b.length; focusSel(); UI.padT = .2; } else if (ay < -.6 || PAD.b[12]) { UI.sel = (UI.sel - 1 + b.length) % b.length; focusSel(); UI.padT = .2; } else if (UI.screen === 'chars' && UI.charKeys && (ax > .6 || PAD.b[15])) { UI.charKeys(1); UI.padT = .25; } else if (UI.screen === 'chars' && UI.charKeys && (ax < -.6 || PAD.b[14])) { UI.charKeys(-1); UI.padT = .25; } }
  if (padHit(0)) { if (UI.screen === 'chars' && UI.charGo) UI.charGo(); else if (b[UI.sel]) b[UI.sel].click(); }
  if (padHit(1) && GAME.state === 'play' && GAME.paused) resumeGame();
}

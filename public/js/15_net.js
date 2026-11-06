// ---- 15_net.js ----
// ===================== CO-OP ONLINE (lockstep) =====================
// Obie przeglądarki liczą ten sam świat. Co klatkę każda wysyła tylko swoje wejście (ruch, strzał,
// przyciski) na klatkę f + opóźnienie. Klatka f liczy się dopiero, gdy są wejścia obu graczy.
// Co sekundę gracze porównują odcisk stanu; przy rozjeździe gospodarz wysyła stan biegu
// i obaj wczytują go w tej samej, przyszłej klatce (bieżący pokój zaczyna się wtedy od nowa).
var NET = { ws: null, slot: -1, code: '', lobby: null, play: false, f: 0, delay: 4, inp: [{}, {}], rmax: 0, hash: {}, rhash: {}, rtt: 120, stall: 0, resync: null, unl: null, names: ['', ''], cur: null, status: '' };
var NETIN = [emptyInput(), emptyInput()];

function netUrl() { return (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/ws'; }
function netSend(m) { if (NET.ws && NET.ws.readyState === 1) NET.ws.send(JSON.stringify(m)); }
function netConnect(then) {
  if (NET.ws && NET.ws.readyState === 1) return then();
  if (location.protocol === 'file:') { netStatus('Gra online działa tylko z serwera (npm start albo Render).'); return; }
  var ws; try { ws = new WebSocket(netUrl()); } catch (e) { netStatus('Nie da się połączyć z serwerem.'); return; }
  NET.ws = ws; netStatus('Łączę z serwerem…');
  ws.onopen = function () { netStatus(''); then(); NET.pingT = setInterval(function () { netSend({ t: 'ping', c: performance.now() }); }, 1000); };
  ws.onmessage = function (ev) { var m; try { m = JSON.parse(ev.data); } catch (e) { return; } netMsg(m); };
  ws.onclose = function () { clearInterval(NET.pingT); var was = NET.play; NET.ws = null; NET.lobby = null; if (was) netPeerGone('Utracono połączenie z serwerem.'); else netStatus('Rozłączono z serwerem.'); };
  ws.onerror = function () { netStatus('Błąd połączenia z serwerem.'); };
}
function netLeave() { if (NET.ws) { netSend({ t: 'leave' }); try { NET.ws.close(); } catch (e) { } } NET.ws = null; NET.play = false; NET.lobby = null; NET.slot = -1; }
function netStatus(s) { NET.status = s; var el = $('netst'); if (el) el.textContent = s; }

function netMsg(m) {
  switch (m.t) {
    case 'joined': NET.code = m.code; NET.slot = m.slot; break;
    case 'lobby': NET.lobby = m; if (UI.screen === 'online') showLobby(); break;
    case 'error': netStatus(m.msg); sfx('error'); break;
    case 'pong': var r = performance.now() - m.c; NET.rtt = NET.rtt * .7 + r * .3; var pe = $('netping'); if (pe) pe.textContent = Math.round(NET.rtt) + ' ms'; break;
    case 'start': netStart(m); break;
    case 'in': var o = 1 - NET.slot; NET.inp[o][m.f] = m.d; if (m.f > NET.rmax) NET.rmax = m.f; break;
    case 'hash': NET.rhash[m.f] = m.h; netCheckHash(m.f); break;
    case 'resync': NET.resync = { F: m.F, s: m.s }; break;
    case 'left': if (NET.play) netPeerGone('Drugi gracz wyszedł z gry.'); else if (UI.screen === 'online') showLobby(); break;
  }
}
// ---------- start biegu (serwer wysyła to samo obu graczom) ----------
function netStart(m) {
  NET.play = true; NET.f = 0; NET.delay = m.delay; NET.inp = [{}, {}]; NET.rmax = 0; NET.hash = {}; NET.rhash = {}; NET.resync = null; NET.stall = 0;
  NET.unl = m.unl || {}; NET.names = m.names || ['', ''];
  for (var f = 0; f < NET.delay; f++) { NET.inp[0][f] = [0, 0, 0, 0, 0]; NET.inp[1][f] = [0, 0, 0, 0, 0]; }
  COOP.mode = 'online';
  COOPINPUT = function (i) { return unpackInput(NET.cur[i], NETIN[i]); };
  newRun(m.chars[0], m.seed, m.chars[1]);
  startPlay();
  toast('🌐 Co-op online', 'Grasz jako ' + (NET.slot === 0 ? 'Gracz 1 (lewy HUD)' : 'Gracz 2 (prawy HUD)') + ' • opóźnienie ' + NET.delay + ' klatek');
}
// odblokowania gospodarza obowiązują obu graczy (pule przedmiotów muszą być identyczne)
var _unlockedNet = unlocked;
unlocked = function (k) { return NET.play && NET.unl ? (!k || !!NET.unl[k]) : _unlockedNet(k); };

// ---------- pętla: zamiast zwykłego kroku ----------
var _stepNet = step;
step = function (dt) {
  if (!NET.play || GAME.state !== 'play' || !R) return _stepNet(dt);
  readInput(); menuPad(); GAME.t += dt; GAME.frame++;
  if (IN.pause && !GAME.paused && GAME.t - (GAME.resumeT || 0) > .15) pauseGame();
  netAdvance();
  endInput();
};
function netAdvance() {
  for (var steps = 0; steps < 4; steps++) {
    var f = NET.f, lf = f + NET.delay, me = NET.slot;
    if (!NET.inp[me][lf]) { var a = packInput(GAME.paused || document.hidden ? emptyInput() : IN0); NET.inp[me][lf] = a; netSend({ t: 'in', f: lf, d: a }); }
    if (NET.resync && f >= NET.resync.F) { netApply(NET.resync.s); NET.resync = null; NET.resyncing = false; }
    var a0 = NET.inp[0][f], a1 = NET.inp[1][f];
    if (!a0 || !a1) { NET.stall++; return; }
    NET.cur = [a0, a1]; IN0.any = false;
    world(DT);
    NET.f++; NET.stall = 0;
    if (NET.f % 60 === 0) { var h = simHash(); NET.hash[NET.f] = h; netSend({ t: 'hash', f: NET.f, h: h }); netCheckHash(NET.f); }
    delete NET.inp[0][f - 300]; delete NET.inp[1][f - 300]; delete NET.hash[f - 600]; delete NET.rhash[f - 600];
    if (!allDead() && GAME.state !== 'play') return;
    if (NET.rmax - NET.f <= NET.delay + 1) return; // nadrabiamy tylko, gdy zostaliśmy w tyle
  }
}
function netCheckHash(f) {
  if (NET.hash[f] == null || NET.rhash[f] == null || NET.hash[f] === NET.rhash[f]) return;
  console.warn('rozjazd stanu w klatce', f);
  if (NET.slot !== 0 || NET.resyncing) return;
  NET.resyncing = true;
  var F = NET.f + NET.delay + 2, s = netSnapshot();
  NET.resync = { F: F, s: s }; netSend({ t: 'resync', F: F, s: s });
}
// ---------- zrzut i wczytanie stanu (na wzór zapisu gry) ----------
function netSnapshot() {
  var keep = players().map(function (p) { var k = [p._fams, p._trail]; delete p._fams; delete p._trail; return k; }), cur = R.room, s;
  try { R.curRoom = cur ? cur.id : 0; R.room = null; s = JSON.stringify({ R: R, pos: players().map(function (p) { return [p.x, p.y]; }), slow: GAME.slow || 0 }); }
  finally { R.room = cur; players().forEach(function (p, i) { p._fams = keep[i][0]; p._trail = keep[i][1]; }); FAMS = R.P._fams || FAMS; TRAIL = R.P._trail || TRAIL; }
  return s;
}
function netApply(str) {
  var d = JSON.parse(str);
  R = d.R; fixLoadedPlayers(); R.floor.def = FLOORS[R.floor.i];
  ALLY = []; BGC = {}; TIMERS = []; INTRO.t = 0; ROOMT.k = 0; R.falling = 0; GAME.slow = d.slow; GAME.slowmo = 0;
  FLOWS.forEach(function (F) { F.room = null; });
  var rm = R.floor.rooms[R.curRoom || 0]; R.room = null;
  simCall(function () { eachPlayer(function () { calcStats(); }); enterRoom(rm, null); players().forEach(function (p, i) { p.x = p.px = d.pos[i][0]; p.y = p.py = d.pos[i][1]; }); });
  toast('🔄 Synchronizacja', 'Stan gry wyrównany z gospodarzem');
}
// ---------- rozłączenie: gramy dalej lokalnie, drugi gracz stoi ----------
function netPeerGone(msg) {
  NET.play = false; COOP.mode = 'local';
  var mine = NET.slot < 0 ? 0 : NET.slot;
  COOPINPUT = function (i) { return i === mine ? IN0 : emptyInput(); };
  toast('🔌 ' + msg, 'Grasz dalej sam — drugi gracz stoi w miejscu');
  netLeave();
}

// ---------- pauza online: menu na wierzchu, gra toczy się dalej ----------
var _pauseNet = pauseGame;
pauseGame = function () {
  if (!NET.play) return _pauseNet();
  if (GAME.state !== 'play' || GAME.paused) return; GAME.paused = true; sfx('card');
  var m = box('<h2>Menu (gra online trwa!)</h2><p>Pokój <b style="color:#f0c43a">' + esc(NET.code) + '</b> • ping <span id="netping">' + Math.round(NET.rtt) + ' ms</span> • ' + esc(R.floor.def.n) + '</p><p>W co-opie online gra się nie zatrzymuje — twoja postać stoi, dopóki nie wrócisz.</p><div id="pb"></div>');
  var pb = $('pb'); pb.appendChild(mkBtn('Wróć do gry', '', resumeGame, 'pri'));
  pb.appendChild(mkBtn('Ustawienia', '', function () { showSettings(function () { GAME.paused = false; pauseGame(); }); }));
  pb.appendChild(mkBtn('Wyjdź z gry', 'Drugi gracz zostanie sam', function () { netLeave(); COOP.mode = 'solo'; R = null; showTitle(); }));
};
// powrót do menu głównego kończy sesję online
var _showTitleNet = showTitle;
showTitle = function () { if (NET.ws && !NET.play) netLeave(); if (NET.play && GAME.state !== 'play') netLeave(); if (!NET.play && COOP.mode === 'online') COOP.mode = 'solo'; return _showTitleNet(); };

// napis „czekam na drugiego gracza”
var _renderNet = render;
render = function (a) {
  _renderNet(a);
  if (NET.play && NET.stall > 20 && GAME.state === 'play') { X = MAINX; X.setTransform(1, 0, 0, 1, 0, 0); X.fillStyle = 'rgba(0,0,0,.6)'; X.fillRect(0, CV.height / 2 - 14, CV.width, 28); X.font = '11px sans-serif'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = '#f0c43a'; X.fillText('Czekam na drugiego gracza…', CV.width / 2, CV.height / 2); }
};

// ---------- menu: tworzenie pokoju / dołączanie / poczekalnia ----------
function onlineChar() { var c = LS.get('lzy-lastch', 'ignaczak'); return charLocked(c) ? 'ignaczak' : c; }
function charButtons(cur, onPick) {
  var w = document.createElement('div'); w.className = 'chars';
  CHARORDER.forEach(function (id) {
    if (charLocked(id)) return; var C = CHARS[id], d = document.createElement('div'); d.className = 'ch' + (id === cur ? ' sel' : ''); d.style.width = '96px';
    var cv = document.createElement('canvas'); cv.width = cv.height = 64; var x = cv.getContext('2d'), im = faceImg(C.face, 'n', 56, x);
    if (im) { var h = 56, ww = h * (FM[C.face] || { asp: .72 }).asp; x.drawImage(im, 32 - ww / 2, 4, ww, h); }
    d.appendChild(cv); d.insertAdjacentHTML('beforeend', '<small>' + esc(C.n) + '</small>');
    d.onclick = function () { LS.set('lzy-lastch', id); onPick(id); sfx('pickup'); };
    w.appendChild(d);
  });
  return w;
}
function showOnlineMenu() {
  UI.screen = 'online';
  var name = LS.get('lzy-name', 'Szymon');
  var m = box('<h2>Co-op przez internet</h2><label class="ck">Twoje imię: <input class="tx" id="nn" maxlength="16" style="width:220px" value="' + esc(name) + '"></label><p>Twoja postać:</p><div id="och"></div><div id="ob"></div><label class="ck">Kod pokoju: <input class="tx" id="ocode" maxlength="4" style="width:120px;text-transform:uppercase" placeholder="ABCD"></label><div id="oj"></div><p id="netst" style="color:#f0c43a">' + esc(NET.status || '') + '</p><div id="oback"></div>');
  var cur = onlineChar();
  var drawChars = function () { var h = $('och'); h.innerHTML = ''; h.appendChild(charButtons(cur, function (id) { cur = id; drawChars(); })); }; drawChars();
  var nm = function () { var v = ($('nn').value || 'Gracz').trim().slice(0, 16); LS.set('lzy-name', v); return v; };
  $('ob').appendChild(mkBtn('Załóż pokój', 'Dostaniesz kod do wysłania znajomemu', function () { var n = nm(); netConnect(function () { netSend({ t: 'create', name: n, ch: cur }); }); }, 'pri'));
  $('oj').appendChild(mkBtn('Dołącz do pokoju', 'Wpisz kod od znajomego', function () { var n = nm(), c = ($('ocode').value || '').toUpperCase().trim(); if (c.length !== 4) { netStatus('Kod ma 4 litery.'); return; } netConnect(function () { netSend({ t: 'join', code: c, name: n, ch: cur }); }); }));
  $('oback').appendChild(mkBtn('Wstecz', '', function () { netLeave(); showCoopMenu(); }));
}
function showLobby() {
  var L = NET.lobby; if (!L) return; UI.screen = 'online';
  var me = NET.slot, host = me === 0, rows = L.players.map(function (p, i) { return '<div class="stats" style="grid-template-columns:auto 1fr auto;align-items:center"><b style="color:' + (i === 0 ? '#f0c43a' : '#5fb4ff') + '">P' + (i + 1) + '</b><span>' + (p ? esc(p.name) + (i === me ? ' (ty)' : '') : '<i style="color:#6d524a">czekam…</i>') + '</span><span>' + (p ? esc(CHARS[p.ch] ? CHARS[p.ch].n : p.ch) : '') + '</span></div>'; }).join('');
  box('<h2>Pokój <span style="color:#fff;letter-spacing:.2em">' + esc(L.code) + '</span></h2><p>Wyślij ten kod znajomemu. Ping: <span id="netping">' + Math.round(NET.rtt) + ' ms</span></p>' + rows + '<p>Zmień postać:</p><div id="lch"></div><div id="lb"></div><p id="netst" style="color:#f0c43a">' + esc(NET.status || '') + '</p>');
  var mine = L.players[me] ? L.players[me].ch : onlineChar();
  $('lch').appendChild(charButtons(mine, function (id) { netSend({ t: 'char', ch: id }); }));
  var lb = $('lb');
  if (host) lb.appendChild(mkBtn('Start!', L.players[1] ? 'Zaczynamy koszmar' : 'Poczekaj na drugiego gracza', function () {
    if (!NET.lobby.players[1]) { sfx('error'); return; }
    var d = clamp(Math.ceil(NET.rtt / 2 / 16.7) + 2, 3, 12);
    netSend({ t: 'start', seed: newSeedStr(), unl: PROF.unl, delay: d });
  }, 'pri'));
  else lb.appendChild(mkBtn('Czekam na start gospodarza…', '', function () { }, ''));
  lb.appendChild(mkBtn('Wyjdź z pokoju', '', function () { netLeave(); showOnlineMenu(); }));
}
if (window.__G) window.__G.NET = NET;

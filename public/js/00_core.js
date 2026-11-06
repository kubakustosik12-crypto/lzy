// ---- 00_core.js ----
// ===================== RDZEŃ: narzędzia, losowość, płótno, wejście =====================
var GV = '2.0';
var $ = function (id) { return document.getElementById(id); };
var PI = Math.PI, TAU = PI * 2;
function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lerp(a, b, t) { return a + (b - a) * t; }
function dist(ax, ay, bx, by) { var dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); }
function angTo(ax, ay, bx, by) { return Math.atan2(by - ay, bx - ax); }
function approach(v, t, d) { return v < t ? Math.min(t, v + d) : Math.max(t, v - d); }
function angDiff(a, b) { var d = (b - a) % TAU; if (d > PI) d -= TAU; if (d < -PI) d += TAU; return d; }
// ---------- losowość symulacji ----------
// W trakcie kroku symulacji (SIM.on) wszystko, co losowe, pochodzi z jednego ziarnistego generatora,
// którego stan siedzi w R.rs. Dzięki temu dwie przeglądarki w co-opie online liczą identyczny świat.
// Poza symulacją (rysowanie, dźwięk, menu) używamy zwykłego Math.random.
var SIM = { on: 0 };
function simRand() { var a = R.rs = (R.rs + 0x6D2B79F5) | 0, t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
function rnd01() { return SIM.on && R && R.rs != null ? simRand() : Math.random(); }
function simRun(fn) { SIM.on++; try { return fn(); } finally { SIM.on--; } }
function rnd(a, b) { return a + rnd01() * (b - a); }
function rndi(a, b) { return a + Math.floor(rnd01() * (b - a + 1)); }
function pick(a) { return a[Math.floor(rnd01() * a.length)]; }
function arnd(a, b) { return a + Math.random() * (b - a); }
function arndi(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function apick(a) { return a[Math.floor(Math.random() * a.length)]; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
// deterministyczny generator (mulberry32) – piętra i pokoje z ziarna
function mkRng(seed) {
  var a = seed >>> 0;
  var f = function () { a |= 0; a = a + 0x6D2B79F5 | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  f.int = function (lo, hi) { return lo + Math.floor(f() * (hi - lo + 1)); };
  f.pick = function (arr) { return arr[Math.floor(f() * arr.length)]; };
  f.chance = function (p) { return f() < p; };
  f.range = function (lo, hi) { return lo + f() * (hi - lo); };
  f.shuffle = function (arr) { for (var i = arr.length - 1; i > 0; i--) { var j = Math.floor(f() * (i + 1)), t = arr[i]; arr[i] = arr[j]; arr[j] = t; } return arr; };
  f.wpick = function (list) { var s = 0, i; for (i = 0; i < list.length; i++) s += list[i][1]; var r = f() * s; for (i = 0; i < list.length; i++) { r -= list[i][1]; if (r <= 0) return list[i][0]; } return list[list.length - 1][0]; };
  return f;
}
function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
var SEEDCH = 'ABCDEFGHJKLMNPQRSTWXYZ0123456789';
function newSeedStr() { var s = ''; for (var i = 0; i < 8; i++) { s += SEEDCH[Math.floor(Math.random() * 32)]; if (i === 3) s += ' '; } return s; }
function seedNum(str) { return hashStr(String(str).toUpperCase().replace(/[^A-Z0-9]/g, '')); }
var LS = {
  get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  del: function (k) { try { localStorage.removeItem(k); } catch (e) { } }
};
var EV = { h: {}, on: function (k, f) { (this.h[k] = this.h[k] || []).push(f); }, emit: function (k, a, b, c) { var l = this.h[k]; if (l) for (var i = 0; i < l.length; i++) { try { l[i](a, b, c); } catch (e) { console.error(e); } } } };

// ---------- wymiary świata ----------
var TS = 40;                    // kafel
var CW = 13, CH = 7;            // kafle w komórce pokoju (jak w oryginale)
var RW = CW * TS, RH = CH * TS; // wnętrze komórki 520 x 280
var WS = 56, WT = 70, WB = 50;  // grubość ścian: boki, góra (z licem), dół
var VIEWW = RW + WS * 2, VIEWH = RH + WT + WB;

// ---------- płótno ----------
var CV = $('cv'), X = CV.getContext('2d', { willReadFrequently: true });
var VIEW = { w: 1, h: 1, dpr: 1, s: 1, ox: 0, oy: 0, cx: 0, cy: 0 };
var SET = Object.assign({ vol: .8, mus: .55, shake: true, hud: 0, fs: false, pal: true }, LS.get('lzy-set', {}));
function saveSet() { LS.set('lzy-set', SET); }
function resize() {
  // niska rozdzielczość + całkowite powiększenie (piksele zawsze równe)
  var dpr = window.devicePixelRatio || 1, W = Math.round(window.innerWidth * dpr), H = Math.round(window.innerHeight * dpr);
  var s = PIX.S, bw = VIEWW * s, bh = VIEWH * s, k = Math.floor(Math.min(W / bw, H / bh));
  if (SET.px === 'big' && k > 1) { /* większe piksele: mniejszy bufor */ }
  if (k < 1) { k = 1; s = Math.min(W / VIEWW, H / VIEWH); }
  var lw = Math.max(1, Math.floor(W / k)), lh = Math.max(1, Math.floor(H / k));
  CV.width = lw; CV.height = lh; CV.style.width = (lw * k / dpr) + 'px'; CV.style.height = (lh * k / dpr) + 'px';
  VIEW.dpr = 1; VIEW.k = k; VIEW.w = lw; VIEW.h = lh; VIEW.s = s;
  VIEW.ox = Math.round((lw - VIEWW * s) / 2); VIEW.oy = Math.round((lh - VIEWH * s) / 2);
  EV.emit('resize');
}
window.addEventListener('resize', resize);
resize();

// ---------- wejście: klawiatura, pad, dotyk ----------
var KEY = {}, KHIT = {}, SHOTSTACK = [];
var SHOTK = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], KeyI: [0, -1], KeyK: [0, 1], KeyJ: [-1, 0], KeyL: [1, 0] };
window.addEventListener('keydown', function (e) {
  if (e.target && e.target.tagName === 'INPUT') return;
  if (/^(Arrow|Space|Tab)/.test(e.code) || e.code === 'Space') e.preventDefault();
  if ((e.ctrlKey || e.metaKey) && GAME.state === 'play') e.preventDefault();
  if (!KEY[e.code]) { KHIT[e.code] = true; if (SHOTK[e.code]) { var i = SHOTSTACK.indexOf(e.code); if (i >= 0) SHOTSTACK.splice(i, 1); SHOTSTACK.push(e.code); } }
  KEY[e.code] = true;
});
window.addEventListener('keyup', function (e) { KEY[e.code] = false; var i = SHOTSTACK.indexOf(e.code); if (i >= 0) SHOTSTACK.splice(i, 1); });
window.addEventListener('blur', function () { KEY = {}; SHOTSTACK = []; });
var PAD = { on: false, b: [], pb: [], ax: [0, 0, 0, 0] };
var TOUCH = { on: false, move: null, shoot: null, btn: {} };
var IN = { mx: 0, my: 0, sx: 0, sy: 0, use: false, bomb: false, card: false, map: false, pause: false, any: false, drop: false };
function padPoll() {
  var gps = navigator.getGamepads ? navigator.getGamepads() : [], g = null;
  for (var i = 0; i < gps.length; i++) if (gps[i] && gps[i].connected) { g = gps[i]; break; }
  PAD.pb = PAD.b; PAD.b = []; if (!g) { PAD.on = false; return; }
  PAD.on = true; for (var k = 0; k < g.buttons.length; k++) PAD.b[k] = g.buttons[k].pressed || g.buttons[k].value > .5;
  PAD.ax = [g.axes[0] || 0, g.axes[1] || 0, g.axes[2] || 0, g.axes[3] || 0];
}
function padHit(k) { return !!PAD.b[k] && !PAD.pb[k]; }
function readInput() {
  padPoll();
  var mx = (KEY.KeyD ? 1 : 0) - (KEY.KeyA ? 1 : 0), my = (KEY.KeyS ? 1 : 0) - (KEY.KeyW ? 1 : 0);
  if (PAD.on) { var ax = PAD.ax[0], ay = PAD.ax[1]; if (Math.hypot(ax, ay) > .22) { mx += ax; my += ay; } if (PAD.b[14]) mx -= 1; if (PAD.b[15]) mx += 1; if (PAD.b[12]) my -= 1; if (PAD.b[13]) my += 1; }
  if (TOUCH.move) { mx += TOUCH.move.x; my += TOUCH.move.y; }
  var l = Math.hypot(mx, my); if (l > 1) { mx /= l; my /= l; }
  var sx = 0, sy = 0;
  if (SHOTSTACK.length) { var d = SHOTK[SHOTSTACK[SHOTSTACK.length - 1]]; sx = d[0]; sy = d[1]; }
  if (PAD.on) {
    var rx = PAD.ax[2], ry = PAD.ax[3];
    if (Math.hypot(rx, ry) > .45) { if (Math.abs(rx) > Math.abs(ry)) { sx = rx > 0 ? 1 : -1; sy = 0; } else { sy = ry > 0 ? 1 : -1; sx = 0; } }
    if (PAD.b[3]) { sx = 0; sy = -1; } else if (PAD.b[0]) { sx = 0; sy = 1; } else if (PAD.b[2]) { sx = -1; sy = 0; } else if (PAD.b[1]) { sx = 1; sy = 0; }
  }
  if (TOUCH.shoot) { var tx = TOUCH.shoot.x, ty = TOUCH.shoot.y; if (Math.hypot(tx, ty) > .3) { if (Math.abs(tx) > Math.abs(ty)) { sx = tx > 0 ? 1 : -1; sy = 0; } else { sy = ty > 0 ? 1 : -1; sx = 0; } } }
  IN.mx = mx; IN.my = my; IN.sx = sx; IN.sy = sy;
  IN.use = KHIT.Space || padHit(7) || padHit(5) || !!TOUCH.btn.use;
  IN.bomb = KHIT.KeyE || padHit(6) || !!TOUCH.btn.bomb;
  IN.card = KHIT.KeyQ || padHit(4) || !!TOUCH.btn.card;
  IN.map = !!KEY.Tab || !!PAD.b[8];
  IN.pause = KHIT.Escape || KHIT.KeyP || padHit(9) || !!TOUCH.btn.pause;
  IN.any = KHIT.Enter || KHIT.Space || padHit(0) || padHit(9);
  IN.drop = KHIT.ControlLeft || KHIT.ControlRight || padHit(10);
  TOUCH.btn = {};
}
function endInput() { KHIT = {}; }
// dotyk: lewa połowa = ruch, prawa = strzał (4 kierunki), przyciski
function touchInit() {
  if (TOUCH.inited) return; TOUCH.inited = true; TOUCH.on = true;
  var el = $('touch'); el.classList.remove('hid');
  [['use', '⚡', 'right:18px;bottom:180px'], ['bomb', '🧨', 'right:96px;bottom:200px'], ['card', '🃏', 'right:18px;bottom:256px'], ['pause', '⏸', 'right:14px;top:12px;width:46px;height:46px;font-size:20px']].forEach(function (b) {
    var d = document.createElement('div'); d.className = 'tb'; d.textContent = b[1]; d.style.cssText += b[2];
    d.addEventListener('touchstart', function (e) { e.preventDefault(); e.stopPropagation(); TOUCH.btn[b[0]] = true; }, { passive: false }); el.appendChild(d);
  });
  var ids = {};
  function upd(e) {
    for (var i = 0; i < e.changedTouches.length; i++) {
      var t = e.changedTouches[i], s = ids[t.identifier];
      if (e.type === 'touchstart') { var side = t.clientX < window.innerWidth / 2 ? 'move' : 'shoot'; ids[t.identifier] = s = { side: side, x0: t.clientX, y0: t.clientY }; }
      if (!s) continue;
      if (e.type === 'touchend' || e.type === 'touchcancel') { TOUCH[s.side] = null; delete ids[t.identifier]; continue; }
      var dx = (t.clientX - s.x0) / 55, dy = (t.clientY - s.y0) / 55, l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; }
      TOUCH[s.side] = { x: dx, y: dy, x0: s.x0, y0: s.y0 };
    }
  }
  ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(function (n) { CV.addEventListener(n, function (e) { if (GAME.state === 'play') e.preventDefault(); upd(e); }, { passive: false }); });
}
window.addEventListener('touchstart', function () { touchInit(); }, { once: true, passive: true });

// ---------- stan gry ----------
var GAME = { state: 'boot', t: 0, frame: 0, paused: false, slow: 0 };

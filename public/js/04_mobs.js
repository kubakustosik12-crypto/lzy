// ---- 04_mobs.js ----
// ===================== GRAFIKA WROGÓW I BOSSÓW =====================
// e: {ix,iy, fx (-1/1), dir, anim, flash, sc, z, fly, champ}
function mobBegin(e, sc) {
  X.save(); X.translate(e.ix, e.iy); var s = (sc || 1) * (e.sc || 1); if (e.squash) X.scale(s * (1 + e.squash), s * (1 - e.squash)); else X.scale(s, s);
  if (e.flash > 0) X.filter = 'brightness(' + (1.6 + e.flash * 4) + ') saturate(.4)';
  else if (e.frozen > 0) X.filter = 'saturate(.2) brightness(1.3) hue-rotate(160deg)';
  else if (e.burn > 0 && (GAME.frame >> 2) % 2) X.filter = 'sepia(.6) saturate(3) hue-rotate(-20deg)';
  else if (e.poison > 0 && (GAME.frame >> 2) % 2) X.filter = 'sepia(.5) saturate(3) hue-rotate(50deg)';
  else if (e.charmed > 0) X.filter = 'sepia(.4) saturate(2) hue-rotate(290deg)';
  if (e.alpha != null) X.globalAlpha *= e.alpha;
}
function mobEnd() { X.filter = 'none'; X.restore(); }
function champRing(e, r) { if (!e.champ) return; var c = CHAMPS[e.champ].col; X.save(); X.globalAlpha = .55 + Math.sin(GAME.t * 6) * .2; X.strokeStyle = c; X.lineWidth = 3; X.beginPath(); X.ellipse(e.ix, e.iy + 3, r * 1.2, r * .5, 0, 0, TAU); X.stroke(); X.restore(); }
function eyes(x, y, sp, r, angry, look) { // para oczu kreskówkowych
  [-1, 1].forEach(function (s) { X.fillStyle = '#fff'; X.beginPath(); X.ellipse(x + s * sp, y, r, r * 1.15, 0, 0, TAU); X.fill(); X.fillStyle = '#111'; X.beginPath(); X.arc(x + s * sp + (look || 0) * r * .35, y + r * .15, r * .5, 0, TAU); X.fill();
    if (angry) { X.strokeStyle = '#111'; X.lineWidth = r * .55; X.beginPath(); X.moveTo(x + s * sp - s * r * 1.1, y - r * 1.5); X.lineTo(x + s * sp + s * r * .9, y - r * .8); X.stroke(); } });
}
// ---------- ptaki: gołąb, gołąb mleczny, mewa, harpia, złoty gołąb ----------
function artBird(e, o) {
  var flap = e.fly ? Math.sin(e.anim * 22) : Math.sin(e.anim * 4) * .15, fx = e.fx || 1, col = o.col || '#8f98a3', wing = o.wing || shade(col, -.2), z = e.fly ? 8 + Math.sin(e.anim * 3) * 3 : (e.z || 0);
  shadow(e.ix, e.iy + 4, 11 * (o.sz || 1), 4 * (o.sz || 1), .25); champRing(e, 12 * (o.sz || 1));
  mobBegin(e, o.sz); X.translate(0, -z); X.scale(fx, 1);
  // ogon
  X.fillStyle = shade(wing, -.15); X.beginPath(); X.moveTo(-9, -6); X.lineTo(-18, -9); X.lineTo(-17, -3); X.closePath(); X.fill();
  // tylne skrzydło
  X.fillStyle = shade(wing, -.25); X.save(); X.translate(-1, -9); X.rotate(-.4 - flap * .9); X.beginPath(); X.ellipse(-6, -2, 11, 5, -.2, 0, TAU); X.fill(); X.restore();
  // ciało
  var g = X.createRadialGradient(-2, -10, 2, 0, -7, 13); g.addColorStop(0, shade(col, .25)); g.addColorStop(1, shade(col, -.15)); X.fillStyle = g; X.beginPath(); X.ellipse(0, -7, 11, 8, -.15, 0, TAU); X.fill();
  if (o.neck !== false) { X.fillStyle = o.neckCol || 'rgba(110,190,150,.7)'; X.beginPath(); X.ellipse(6, -11, 4.5, 4, .4, 0, TAU); X.fill(); }
  // głowa
  X.fillStyle = shade(col, .1); X.beginPath(); X.arc(8, -15, 5.2, 0, TAU); X.fill();
  X.fillStyle = '#fff'; X.beginPath(); X.arc(9.5, -16.3, 2.1, 0, TAU); X.fill(); X.fillStyle = o.eye || '#c03010'; X.beginPath(); X.arc(10, -16.1, 1.3, 0, TAU); X.fill(); X.fillStyle = '#000'; X.beginPath(); X.arc(10.2, -16.1, .6, 0, TAU); X.fill();
  X.fillStyle = o.beak || '#3a3a3a'; X.beginPath(); X.moveTo(12.4, -15.6); X.lineTo(16.5, -14.2); X.lineTo(12.2, -13.4); X.closePath(); X.fill();
  // przednie skrzydło
  X.fillStyle = wing; X.save(); X.translate(0, -9); X.rotate(-.25 - flap * .8); X.beginPath(); X.ellipse(-4, -1, 11, 5.5, -.1, 0, TAU); X.fill(); X.strokeStyle = 'rgba(0,0,0,.18)'; X.lineWidth = .8; for (var i = 0; i < 3; i++) { X.beginPath(); X.moveTo(-12 + i * 3, -1); X.lineTo(-6 + i * 3, 3); X.stroke(); } X.restore();
  if (!e.fly) { X.strokeStyle = '#d86a5a'; X.lineWidth = 1.6; var st = Math.sin(e.anim * 14) * 2; X.beginPath(); X.moveTo(-1, 0); X.lineTo(-2 + st, 4); X.moveTo(3, 0); X.lineTo(4 - st, 4); X.stroke(); }
  if (o.gold) { X.globalCompositeOperation = 'lighter'; X.fillStyle = 'rgba(255,220,100,' + (.15 + Math.sin(e.anim * 6) * .1) + ')'; X.beginPath(); X.arc(0, -8, 16, 0, TAU); X.fill(); X.globalCompositeOperation = 'source-over'; }
  mobEnd();
}
// ---------- karaluch ----------
function artBug(e, o) {
  var a = e.ang || 0, w = Math.sin(e.anim * 30) * .5;
  shadow(e.ix, e.iy + 3, 10, 4, .25); champRing(e, 10);
  mobBegin(e, o.sz); X.rotate(a);
  X.strokeStyle = '#2a1a0c'; X.lineWidth = 1.5;
  for (var i = -1; i <= 1; i++) [-1, 1].forEach(function (s) { X.beginPath(); X.moveTo(i * 4, 0); X.lineTo(i * 4 + (i * 3 + w * s * 3), s * 9); X.lineTo(i * 5 + (i * 4 - w * s * 2), s * 12); X.stroke(); });
  var g = X.createLinearGradient(-10, -6, 10, 6); g.addColorStop(0, o.col || '#6a4422'); g.addColorStop(1, shade(o.col || '#6a4422', -.45)); X.fillStyle = g; X.beginPath(); X.ellipse(-1, 0, 10, 6.5, 0, 0, TAU); X.fill();
  X.strokeStyle = 'rgba(0,0,0,.4)'; X.beginPath(); X.moveTo(-10, 0); X.lineTo(8, 0); X.stroke();
  X.fillStyle = 'rgba(255,255,255,.22)'; X.beginPath(); X.ellipse(-3, -3, 5, 1.6, 0, 0, TAU); X.fill();
  X.fillStyle = '#2a1a0c'; X.beginPath(); X.arc(9, 0, 3.6, 0, TAU); X.fill();
  X.strokeStyle = '#3a2410'; X.lineWidth = 1; X.beginPath(); X.moveTo(11, -1); X.quadraticCurveTo(18, -8 + w * 4, 22, -6); X.moveTo(11, 1); X.quadraticCurveTo(18, 8 - w * 4, 22, 6); X.stroke();
  mobEnd();
}
// ---------- zła cebula ----------
function artOnion(e, o) {
  var b = Math.sin(e.anim * 5) * 1.2;
  shadow(e.ix, e.iy + 5, 12, 4.5, .28); champRing(e, 12);
  mobBegin(e, o.sz); X.translate(0, -(e.z || 0));
  var g = X.createRadialGradient(-4, -14, 2, 0, -9, 15); g.addColorStop(0, '#f4dcc0'); g.addColorStop(.6, '#d8a070'); g.addColorStop(1, '#9a5a30'); X.fillStyle = g;
  X.beginPath(); X.moveTo(0, -27 - b); X.bezierCurveTo(4, -20, 14, -16, 13, -6); X.bezierCurveTo(12, 2, -12, 2, -13, -6); X.bezierCurveTo(-14, -16, -4, -20, 0, -27 - b); X.fill();
  X.strokeStyle = 'rgba(120,60,20,.35)'; X.lineWidth = 1; [-6, 0, 6].forEach(function (k) { X.beginPath(); X.moveTo(k * .3, -24); X.quadraticCurveTo(k * 1.6, -10, k * .9, 1); X.stroke(); });
  X.strokeStyle = '#6a8a3a'; X.lineWidth = 2; X.beginPath(); X.moveTo(0, -26 - b); X.quadraticCurveTo(-3, -32, 1, -36 - b); X.stroke();
  eyes(0, -10, 4.3, 2.6, true);
  X.fillStyle = '#3a1a10'; X.beginPath(); X.ellipse(0, -3.5, 3, 1.6 + Math.abs(Math.sin(e.anim * 3)), 0, 0, TAU); X.fill();
  X.fillStyle = 'rgba(120,200,255,.85)'; for (var i = 0; i < 2; i++) { var ph = (e.anim * 1.8 + i * .5) % 1; X.beginPath(); X.ellipse((i ? 5 : -5), -8 + ph * 9, 1.3, 2, 0, 0, TAU); X.fill(); }
  mobEnd();
}
// ---------- budzik ----------
function artClock(e, o) {
  var sh = e.ring > 0 ? Math.sin(GAME.t * 60) * 2 : 0, sz = o.sz || 1;
  shadow(e.ix, e.iy + 4, 13 * sz, 5 * sz, .3); champRing(e, 13 * sz);
  mobBegin(e, sz); X.translate(sh, -(e.z || 0));
  X.strokeStyle = '#2a2a2a'; X.lineWidth = 2.4; X.beginPath(); X.moveTo(-7, -4); X.lineTo(-10, 2); X.moveTo(7, -4); X.lineTo(10, 2); X.stroke();
  [-1, 1].forEach(function (s) { var g2 = X.createRadialGradient(s * 9 - 1, -27, 1, s * 9, -26, 6); g2.addColorStop(0, '#fff6c8'); g2.addColorStop(1, '#c8901a'); X.fillStyle = g2; X.beginPath(); X.arc(s * 9 + (e.ring > 0 ? s * Math.sin(GAME.t * 70) * 1.5 : 0), -26, 5.5, PI, 0); X.fill(); });
  X.fillStyle = '#7a5a10'; X.fillRect(-1.5, -30, 3, 5);
  var g = X.createRadialGradient(-3, -17, 2, 0, -14, 14); g.addColorStop(0, '#ff7a6a'); g.addColorStop(1, '#a01a10'); X.fillStyle = g; X.beginPath(); X.arc(0, -14, 13, 0, TAU); X.fill();
  X.fillStyle = '#fbf6ea'; X.beginPath(); X.arc(0, -14, 10, 0, TAU); X.fill();
  X.fillStyle = '#2a2a2a'; for (var i = 0; i < 12; i++) { var a = i / 12 * TAU; X.fillRect(Math.cos(a) * 8 - .6, -14 + Math.sin(a) * 8 - .6, 1.2, 1.2); }
  var t = GAME.t * (e.ring > 0 ? 6 : .5); X.strokeStyle = '#111'; X.lineWidth = 1.6; X.beginPath(); X.moveTo(0, -14); X.lineTo(Math.cos(t) * 6.5, -14 + Math.sin(t) * 6.5); X.moveTo(0, -14); X.lineTo(Math.cos(t / 12) * 4.5, -14 + Math.sin(t / 12) * 4.5); X.stroke();
  X.fillStyle = 'rgba(255,255,255,.35)'; X.beginPath(); X.ellipse(-5, -20, 4, 2, -.6, 0, TAU); X.fill();
  if (e.ring > 0) { X.strokeStyle = 'rgba(255,240,180,.7)'; X.lineWidth = 1.5; for (var k = 0; k < 3; k++) { X.beginPath(); X.arc(0, -14, 16 + k * 4 + (GAME.t * 30 % 4), -2.4, -.7); X.stroke(); } }
  mobEnd();
}
// ---------- krzesło-mimik ----------
function artChair(e, o) {
  var z = e.z || 0, sz = o.sz || 1;
  shadow(e.ix, e.iy + 4, 14 * sz, 5 * sz, .3 - Math.min(.2, z / 100)); champRing(e, 13 * sz);
  mobBegin(e, sz); X.translate(0, -z); X.scale(e.fx || 1, 1);
  X.fillStyle = '#5a6a7a'; X.fillRect(-10, -12, 2.5, 13); X.fillRect(7.5, -12, 2.5, 13); X.fillRect(-7, -12, 2, 11); X.fillRect(5, -12, 2, 11);
  X.fillStyle = '#c8924a'; rr(-12, -16, 24, 6, 2); X.fill();
  X.fillStyle = '#5a6a7a'; X.fillRect(-10, -36, 2.5, 22); X.fillRect(7.5, -36, 2.5, 22);
  X.fillStyle = '#b8823e'; rr(-11, -38, 22, 12, 3); X.fill();
  var open = e.st === 'jump' || e.st === 'air' ? 5 : 1.5 + Math.sin(e.anim * 6);
  X.fillStyle = '#2a0808'; X.fillRect(-9, -11, 18, open); X.fillStyle = '#fff'; for (var i = 0; i < 6; i++) { X.beginPath(); X.moveTo(-9 + i * 3, -11); X.lineTo(-7.5 + i * 3, -11 + 2.4); X.lineTo(-6 + i * 3, -11); X.fill(); }
  eyes(0, -32, 4.5, 2.2, true);
  mobEnd();
}
// ---------- szczur ----------
function artRat(e, o) {
  var a = e.ang || 0, w = Math.sin(e.anim * 24), sz = o.sz || 1;
  shadow(e.ix, e.iy + 3, 12 * sz, 4 * sz, .25); champRing(e, 11 * sz);
  mobBegin(e, sz); X.rotate(a);
  X.strokeStyle = '#d8a0a0'; X.lineWidth = 2; X.beginPath(); X.moveTo(-10, 0); X.quadraticCurveTo(-18, w * 5, -24, -w * 3); X.stroke();
  X.fillStyle = '#c89a9a'; [[-5, -6], [-5, 6], [5, -6], [5, 6]].forEach(function (p, i) { X.beginPath(); X.arc(p[0] + (i % 2 ? w : -w) * 2, p[1], 2, 0, TAU); X.fill(); });
  var g = X.createRadialGradient(-2, -2, 2, 0, 0, 12); g.addColorStop(0, o.col ? shade(o.col, .2) : '#8a8a8e'); g.addColorStop(1, o.col || '#4a4a50'); X.fillStyle = g; X.beginPath(); X.ellipse(-1, 0, 11, 7, 0, 0, TAU); X.fill();
  X.beginPath(); X.ellipse(10, 0, 6, 4.5, 0, 0, TAU); X.fill();
  X.fillStyle = '#d8a0a0'; X.beginPath(); X.arc(7, -5, 2.6, 0, TAU); X.arc(7, 5, 2.6, 0, TAU); X.fill();
  X.fillStyle = '#e83a3a'; X.beginPath(); X.arc(12, -2, 1.2, 0, TAU); X.arc(12, 2, 1.2, 0, TAU); X.fill();
  X.fillStyle = '#e8a0a0'; X.beginPath(); X.arc(16, 0, 1.4, 0, TAU); X.fill();
  mobEnd();
}
// ---------- pająk ----------
function artSpider(e, o) {
  var w = Math.sin(e.anim * 26), z = e.z || 0, sz = o.sz || 1;
  shadow(e.ix, e.iy + 3, 13 * sz, 4.5 * sz, .28); champRing(e, 12 * sz);
  mobBegin(e, sz); X.translate(0, -z - 6);
  X.strokeStyle = '#15100e'; X.lineWidth = 1.8;
  for (var i = 0; i < 4; i++) [-1, 1].forEach(function (s) { var a = (i - 1.5) * .45, k = (i % 2 ? w : -w) * .25; X.beginPath(); X.moveTo(0, 0); X.lineTo(s * (10 + i), -6 + i * 3 + k * 6); X.lineTo(s * (16 + i * 1.5), 4 + i * 2 + k * 4); X.stroke(); });
  X.fillStyle = '#1e1816'; X.beginPath(); X.ellipse(0, 3, 9, 8, 0, 0, TAU); X.fill(); X.beginPath(); X.arc(0, -5, 5.5, 0, TAU); X.fill();
  X.fillStyle = '#a01a10'; X.beginPath(); X.moveTo(0, 0); X.lineTo(3, 4); X.lineTo(0, 8); X.lineTo(-3, 4); X.closePath(); X.fill();
  X.fillStyle = '#ff3a2a'; [[-2.2, -6], [2.2, -6], [-1, -8], [1, -8]].forEach(function (p) { X.beginPath(); X.arc(p[0], p[1], .9, 0, TAU); X.fill(); });
  mobEnd();
}
// ---------- nietoperz ----------
function artBat(e, o) {
  var f = Math.sin(e.anim * 20), sz = o.sz || 1;
  shadow(e.ix, e.iy + 4, 9 * sz, 3 * sz, .18); champRing(e, 10 * sz);
  mobBegin(e, sz); X.translate(0, -16 - Math.sin(e.anim * 4) * 3);
  X.fillStyle = '#2a2030';
  [-1, 1].forEach(function (s) { X.save(); X.scale(s, 1); X.rotate(f * .45); X.beginPath(); X.moveTo(3, -2); X.quadraticCurveTo(12, -12, 22, -6); X.lineTo(19, -2); X.lineTo(16, 1); X.lineTo(12, -1); X.lineTo(9, 3); X.lineTo(4, 2); X.closePath(); X.fill(); X.restore(); });
  X.fillStyle = '#3a2e40'; X.beginPath(); X.ellipse(0, 0, 6, 7, 0, 0, TAU); X.fill();
  X.beginPath(); X.moveTo(-5, -4); X.lineTo(-4, -10); X.lineTo(-1, -5); X.moveTo(5, -4); X.lineTo(4, -10); X.lineTo(1, -5); X.fill();
  X.fillStyle = '#ffde3a'; X.beginPath(); X.arc(-2.3, -2, 1.4, 0, TAU); X.arc(2.3, -2, 1.4, 0, TAU); X.fill();
  X.fillStyle = '#fff'; X.beginPath(); X.moveTo(-1.5, 2); X.lineTo(-1, 4); X.lineTo(-.5, 2); X.moveTo(1.5, 2); X.lineTo(1, 4); X.lineTo(.5, 2); X.fill();
  mobEnd();
}
// ---------- duch woźnego ----------
function artGhost(e, o) {
  var sz = o.sz || 1, wob = e.anim * 3;
  shadow(e.ix, e.iy + 4, 11 * sz, 4 * sz, .15); champRing(e, 12 * sz);
  mobBegin(e, sz); X.globalAlpha *= e.phase ? .28 : .85; X.translate(0, -14 + Math.sin(wob) * 3); X.scale(e.fx || 1, 1);
  var g = X.createLinearGradient(0, -22, 0, 14); g.addColorStop(0, '#f4f6ff'); g.addColorStop(1, 'rgba(200,210,240,.55)'); X.fillStyle = g;
  X.beginPath(); X.moveTo(-13, 10); X.lineTo(-13, -8); X.bezierCurveTo(-13, -26, 13, -26, 13, -8); X.lineTo(13, 10);
  for (var i = 0; i < 4; i++) { var xx = 13 - (i + 1) * 6.5; X.quadraticCurveTo(xx + 3.2, 4 + Math.sin(wob * 2 + i) * 3, xx, 10); } X.closePath(); X.fill();
  X.fillStyle = '#1a2a6a'; rr(-11, -22, 22, 6, 2); X.fill(); X.fillRect(-2, -24, 16, 4);
  X.fillStyle = '#111'; X.beginPath(); X.ellipse(-4, -8, 2.6, 3.6, 0, 0, TAU); X.ellipse(4, -8, 2.6, 3.6, 0, 0, TAU); X.fill(); X.beginPath(); X.ellipse(0, 0, 3, 4, 0, 0, TAU); X.fill();
  if (o.mop) { X.save(); X.translate(14, 2); X.rotate(.5 + Math.sin(e.anim * 3) * .2); X.fillStyle = '#9a6a3a'; X.fillRect(-1.2, -26, 2.4, 30); X.fillStyle = '#d8d0b8'; for (var k = 0; k < 7; k++) X.fillRect(-5 + k * 1.6, 3, 1.2, 7 + (k % 2) * 2); X.restore(); }
  mobEnd();
}
// ---------- posąg (marmurowy Igyatczak) ----------
function artStatue(e, o) {
  drawPerson({ x: e.ix, y: e.iy - (e.z || 0), ch: 'ignaczak', ex: 'm', look: { shirt: '#ece6da', pants: '#d8d0c2', shoes: '#c8c0b0', skin: '#e8e2d6', hair: '#d8d0c2' }, dir: e.dir || 'd', walk: e.anim * 6, moving: true, sc: (o.sz || 1.2) * (e.sc || 1), flash: e.flash, hat: laurelHat });
  champRing(e, 14);
}
function laurelHat(hw, hh) { X.strokeStyle = '#6a9a3a'; X.lineWidth = 2.2; X.beginPath(); X.arc(0, -hh * .05, hw * .5, PI * 1.05, PI * 1.95); X.stroke(); X.fillStyle = '#7aaa4a'; for (var i = 0; i < 9; i++) { var a = PI * 1.08 + i / 8 * PI * .84; X.beginPath(); X.ellipse(Math.cos(a) * hw * .5, -hh * .05 + Math.sin(a) * hw * .5, 3.2, 1.6, a + PI / 2, 0, TAU); X.fill(); } }
// ---------- kartkówka (latająca kartka z jedynką) ----------
function artPaper(e, o) {
  var f = Math.sin(e.anim * 9);
  shadow(e.ix, e.iy + 4, 9, 3, .15); champRing(e, 10);
  mobBegin(e, o.sz); X.translate(0, -16 + Math.sin(e.anim * 3) * 3); X.rotate(f * .25); X.transform(1, 0, f * .2, 1, 0, 0);
  X.fillStyle = '#fbfbf4'; X.fillRect(-9, -12, 18, 24); X.strokeStyle = '#9ab8e0'; X.lineWidth = .7; for (var i = 0; i < 6; i++) { X.beginPath(); X.moveTo(-8, -7 + i * 3.6); X.lineTo(8, -7 + i * 3.6); X.stroke(); }
  X.strokeStyle = '#e04030'; X.lineWidth = .9; X.beginPath(); X.moveTo(-5, -12); X.lineTo(-5, 12); X.stroke();
  X.fillStyle = '#d8201a'; X.font = 'bold 13px Georgia'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('1', 3, -3); X.lineWidth = 1.4; X.strokeStyle = '#d8201a'; X.beginPath(); X.arc(3, -3, 6.5, 0, TAU); X.stroke();
  eyes(0, 7, 3.6, 1.6, true);
  mobEnd();
}
// ---------- człowiek z twarzą-emoji (kujon, dresiarz, kanar, menel…) ----------
function artHuman(e, o) {
  champRing(e, 13 * (o.sz || 1));
  drawPerson({ x: e.ix, y: e.iy - (e.z || 0), ch: o.face, emoji: o.emoji, ex: e.ex || o.ex || 'n', look: o.look, dir: e.dir || 'd', walk: e.anim * 9, moving: e.moving !== false, sc: (o.sz || 1) * (e.sc || 1), flash: e.flash, hat: o.hat, curly: o.curly, fly: o.fly, hand: o.hand, headH: o.headH, alpha: e.alpha, tears: o.tears });
}
// ---------- kałuże (mleko, trucizna, pawie, ogień) ----------
var CREEPCOL = { milk: 'rgba(250,248,236,', poison: 'rgba(110,200,60,', vomit: 'rgba(196,200,70,', fire: 'rgba(255,130,40,', blood: 'rgba(200,30,30,', water: 'rgba(110,170,255,', web: 'rgba(240,240,240,', dark: 'rgba(30,10,40,', holy: 'rgba(255,240,170,' };
function drawCreep(c) {
  var a = Math.min(1, c.life / .6) * (c.alpha || .7), col = CREEPCOL[c.kind] || CREEPCOL.milk, r = c.r;
  X.save(); X.translate(c.x, c.y);
  if (c.kind === 'web') { X.strokeStyle = col + (a * .8) + ')'; X.lineWidth = 1; for (var i = 0; i < 8; i++) { var an = i / 8 * TAU; X.beginPath(); X.moveTo(0, 0); X.lineTo(Math.cos(an) * r, Math.sin(an) * r * .7); X.stroke(); } for (var k = 1; k <= 3; k++) { X.beginPath(); X.ellipse(0, 0, r * k / 3, r * k / 3 * .7, 0, 0, TAU); X.stroke(); } X.restore(); return; }
  if (c.kind === 'fire') { X.globalCompositeOperation = 'lighter'; var fl = 1 + Math.sin(GAME.t * 15 + c.x) * .15; var g = X.createRadialGradient(0, 0, 1, 0, 0, r * fl); g.addColorStop(0, 'rgba(255,230,140,' + a + ')'); g.addColorStop(.5, 'rgba(255,120,30,' + a * .7 + ')'); g.addColorStop(1, 'rgba(200,40,0,0)'); X.fillStyle = g; X.beginPath(); X.ellipse(0, 0, r * fl, r * .7 * fl, 0, 0, TAU); X.fill(); X.restore(); return; }
  var g2 = X.createRadialGradient(-r * .2, -r * .2, 1, 0, 0, r); g2.addColorStop(0, col + a + ')'); g2.addColorStop(.75, col + a * .85 + ')'); g2.addColorStop(1, col + '0)');
  X.fillStyle = g2; X.beginPath(); X.ellipse(0, 0, r, r * .72, c.rot || 0, 0, TAU); X.fill();
  X.fillStyle = 'rgba(255,255,255,' + a * .35 + ')'; X.beginPath(); X.ellipse(-r * .3, -r * .22, r * .25, r * .12, -.4, 0, TAU); X.fill();
  X.restore();
}
// ---------- czapki i dodatki bossów ----------
function hatFreddy(hw, hh) { // uszy misia i cylinder
  X.fillStyle = '#6a4424'; [-1, 1].forEach(function (s) { X.beginPath(); X.arc(s * hw * .4, -hh * .42, hw * .17, 0, TAU); X.fill(); X.fillStyle = '#a8784a'; X.beginPath(); X.arc(s * hw * .4, -hh * .42, hw * .08, 0, TAU); X.fill(); X.fillStyle = '#6a4424'; });
  X.fillStyle = '#121212'; X.fillRect(-hw * .2, -hh * .78, hw * .4, hh * .26); X.fillRect(-hw * .3, -hh * .54, hw * .6, hh * .05); X.fillStyle = '#5a1a1a'; X.fillRect(-hw * .2, -hh * .58, hw * .4, hh * .04);
}
function hatCrown(hw, hh) { X.fillStyle = '#f0c43a'; X.beginPath(); X.moveTo(-hw * .32, -hh * .38); X.lineTo(-hw * .34, -hh * .62); X.lineTo(-hw * .17, -hh * .48); X.lineTo(0, -hh * .68); X.lineTo(hw * .17, -hh * .48); X.lineTo(hw * .34, -hh * .62); X.lineTo(hw * .32, -hh * .38); X.closePath(); X.fill(); X.strokeStyle = '#8a6a10'; X.lineWidth = 1; X.stroke(); X.fillStyle = '#e83a3a'; X.beginPath(); X.arc(0, -hh * .46, 2, 0, TAU); X.fill(); }
function hatNightcap(hw, hh) { X.fillStyle = '#5a8ad8'; X.beginPath(); X.moveTo(-hw * .45, -hh * .3); X.quadraticCurveTo(0, -hh * .85, hw * .55, -hh * .55); X.lineTo(hw * .4, -hh * .3); X.closePath(); X.fill(); X.fillStyle = '#fff'; X.fillRect(-hw * .46, -hh * .34, hw * .9, hh * .07); X.beginPath(); X.arc(hw * .58, -hh * .55, 3.2, 0, TAU); X.fill(); }
function hatCap(col) { return function (hw, hh, dir) { X.fillStyle = col; X.beginPath(); X.ellipse(0, -hh * .36, hw * .46, hh * .17, 0, PI, 0); X.fill(); if (dir !== 'u') { X.beginPath(); X.ellipse(0, -hh * .33, hw * .55, hh * .06, 0, 0, TAU); X.fill(); } }; }
function hatKanar(hw, hh, dir) { X.fillStyle = '#1d3d6b'; X.beginPath(); X.ellipse(0, -hh * .38, hw * .44, hh * .16, 0, PI, 0); X.fill(); X.fillStyle = '#111'; X.fillRect(-hw * .44, -hh * .38, hw * .88, hh * .05); X.fillStyle = '#e8c040'; X.beginPath(); X.arc(0, -hh * .45, 2.2, 0, TAU); X.fill(); }
// ciemność wokół bossa „Scary”
function drawDarkAura(x, y, r, a) { var g = X.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(20,0,30,' + a + ')'); g.addColorStop(1, 'rgba(20,0,30,0)'); X.fillStyle = g; X.beginPath(); X.arc(x, y, r, 0, TAU); X.fill(); }

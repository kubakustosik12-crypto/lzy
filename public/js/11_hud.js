// ---- 11_hud.js ----
// ===================== HUD: serca, znajdźki, przedmiot aktywny, statystyki, minimapa, boss, napisy =====================
var BOSSBAR = { e: null, hitT: 0, shown: 0 };
var BAN = { t: 0, title: '', sub: '', col: '#fff', dur: 2.6 }, BIG = { t: 0, title: '', sub: '' };
function banner(title, sub, col, dur) { BAN.title = title; BAN.sub = sub || ''; BAN.col = col || '#fff'; BAN.dur = dur || 2.8; BAN.t = BAN.dur; }
function bigBanner(title, sub) { BIG.title = title; BIG.sub = sub || ''; BIG.t = 3; }
function toast(title, sub) {
  var d = document.createElement('div'); d.className = 'toast'; d.innerHTML = '<div class="box" style="padding:12px 18px;border-color:#e8b14a"><b style="font-size:18px;color:#ffe08a">' + esc(title) + '</b><div style="color:#d8cbb0;font-size:14px;margin-top:4px">' + esc(sub || '') + '</div></div>';
  document.body.appendChild(d); d.animate([{ opacity: 0, transform: 'translate(-50%,-14px)' }, { opacity: 1, transform: 'translate(-50%,0)' }], { duration: 300, fill: 'forwards' });
  setTimeout(function () { d.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' }); setTimeout(function () { d.remove(); }, 520); }, 3600);
}
function hudText(t, x, y, size, col, align, bold) { X.font = (bold === false ? '' : 'bold ') + size + 'px "Trebuchet MS",sans-serif'; X.textAlign = align || 'left'; X.textBaseline = 'middle'; X.lineWidth = Math.max(2, size * .22); X.strokeStyle = 'rgba(0,0,0,.85)'; X.strokeText(t, x, y); X.fillStyle = col || '#fff'; X.fillText(t, x, y); }
function drawHUD(dt) {
  var P = R.P, s = VIEW.s; X.setTransform(s, 0, 0, s, VIEW.ox, VIEW.oy);
  // przedmiot aktywny
  var A = P.active;
  X.fillStyle = 'rgba(0,0,0,.35)'; rr(6, 5, 38, 38, 7); X.fill();
  if (A) { var it = ITEMS[A.id], full = A.ch >= it.act; X.save(); if (!full) X.globalAlpha = .55; drawItemIcon(it, 25, 24, 26); X.restore(); if (full) { X.save(); X.globalAlpha = .3 + Math.sin(GAME.t * 5) * .15; X.strokeStyle = '#fff6a0'; X.lineWidth = 2; rr(6, 5, 38, 38, 7); X.stroke(); X.restore(); }
    X.fillStyle = 'rgba(0,0,0,.6)'; X.fillRect(46, 6, 7, 36); var seg = it.act, h = 34 / seg; for (var i = 0; i < seg; i++) { X.fillStyle = i < A.ch ? (full ? '#7aff5a' : '#e8d84a') : 'rgba(255,255,255,.08)'; X.fillRect(47, 41 - (i + 1) * h + 1, 5, h - 1.5); } }
  // serca
  var hx = 60, hy = 13, idx = 0, unk = R.floor.curse === 'unknown';
  var drawH = function (kind, v) { var col = idx % 6, row = Math.floor(idx / 6), x = hx + col * 15, y = hy + row * 15; if (kind === 'red') drawHeartShape(x, y, 14, v === 0 ? 'rgba(0,0,0,.4)' : '#d8302a', v === 1); else if (kind === 'soul') { if (v === 1) { X.save(); X.beginPath(); X.rect(x - 8, y - 8, 8, 16); X.clip(); drawSoulHeart(x, y, 14); X.restore(); } else drawSoulHeart(x, y, 14); } else { if (v === 1) { X.save(); X.beginPath(); X.rect(x - 8, y - 8, 8, 16); X.clip(); drawHeartShape(x, y, 14, '#2a2a30'); X.restore(); } else drawHeartShape(x, y, 14, '#2a2a30'); } idx++; };
  for (var c = 0; c < P.cont / 2; c++) { var v = clamp(P.red - c * 2, 0, 2); drawH('red', v); }
  P.extra.forEach(function (h) { drawH(h.t, h.v); });
  if (P.mantle) { X.save(); X.globalAlpha = .7; X.strokeStyle = '#fff2b0'; X.lineWidth = 1.5; X.beginPath(); X.arc(hx + (idx % 6) * 15, hy + Math.floor(idx / 6) * 15, 6, 0, TAU); X.stroke(); X.restore(); }
  // znajdźki
  var py0 = 58; drawCoin(17, py0, 6, 1); hudText(pad2(P.coins), 28, py0, 12, '#fff'); drawBomb(17, py0 + 17, 7); hudText(pad2(P.bombs), 28, py0 + 17, 12, '#fff'); drawKey(17, py0 + 34, 8, false); hudText(pad2(P.keys), 28, py0 + 34, 12, '#fff');
  // statystyki
  if (SET.hud) { var S = P.st, rows = [['👟', S.spd.toFixed(2)], ['💧', S.tears.toFixed(2)], ['💥', S.dmg.toFixed(2)], ['📏', S.range.toFixed(2)], ['💨', S.ss.toFixed(2)], ['🍀', S.luck.toFixed(1)]];
    rows.forEach(function (r, i) { var y = 122 + i * 15; X.save(); X.globalAlpha = .9; emo(r[0], 13, y, 10); X.restore(); hudText(r[1], 22, y, 9.5, '#e8e0d0', 'left'); }); }
  // drobiazg i kieszeń
  if (P.trinket) { X.fillStyle = 'rgba(0,0,0,.35)'; rr(6, VIEWH - 38, 32, 32, 6); X.fill(); emo(TRINKETS[P.trinket].e, 22, VIEWH - 22, 20); }
  if (P.pocket) { var pk = P.pocket, px = VIEWW - 26, pyy = VIEWH - 24; X.fillStyle = 'rgba(0,0,0,.35)'; rr(px - 18, pyy - 18, 36, 36, 6); X.fill(); if (pk.type === 'card') drawPickup({ ix: px, iy: pyy, type: 'card', val: pk.val, id: 1 }); else drawPickup({ ix: px, iy: pyy, type: 'pill', val: pk.val, id: 1 }); hudText(pk.type === 'card' ? CARDS[pk.val].n : pillName(pk.val), px - 24, pyy, 10, '#e8e0d0', 'right'); hudText('Q', px + 12, pyy + 12, 9, '#ffe08a'); }
  // minimapa
  if (R.floor.curse !== 'lost') drawMinimap(VIEWW - 112, 6, 106, 72, 11, 8, false);
  else { X.fillStyle = 'rgba(0,0,0,.4)'; rr(VIEWW - 112, 6, 106, 72, 6); X.fill(); hudText('?', VIEWW - 59, 42, 26, '#888', 'center'); }
  if (IN.map && !INTRO.t) { X.fillStyle = 'rgba(0,0,0,.55)'; X.fillRect(0, 0, VIEWW, VIEWH); if (R.floor.curse !== 'lost') drawMinimap(VIEWW / 2 - 200, VIEWH / 2 - 140, 400, 280, 30, 22, true); hudText(R.floor.def.n + '   •   ' + fmtTime(R.time) + '   •   ' + R.seed, VIEWW / 2, VIEWH - 18, 12, '#d8cbb0', 'center'); }
  // pasek bossa
  var b = BOSSBAR.e; if (b && !b.dead && INTRO.t <= 0) { BOSSBAR.shown = Math.min(1, BOSSBAR.shown + dt * 2); var w = 300, x0 = VIEWW / 2 - w / 2, y0 = VIEWH - 22, k = clamp(b.hp / b.maxHp, 0, 1); X.save(); X.globalAlpha = BOSSBAR.shown; X.fillStyle = 'rgba(0,0,0,.6)'; rr(x0 - 4, y0 - 6, w + 8, 14, 7); X.fill(); var g = X.createLinearGradient(0, y0 - 4, 0, y0 + 6); g.addColorStop(0, BOSSBAR.hitT > 0 ? '#fff' : '#ff6a5a'); g.addColorStop(1, '#8a1a10'); X.fillStyle = g; rr(x0, y0 - 3, w * k, 8, 4); X.fill(); hudText(BOSSES[b.boss].n, VIEWW / 2, y0 - 12, 11, '#ffd8c8', 'center'); X.restore(); }
  else BOSSBAR.shown = 0;
  // ładowanie lasera
  // napis przedmiotu
  if (BAN.t > 0 && typeof drawStreamer === 'function') drawStreamer();
  else if (BAN.t > 0) { var a = Math.min(1, BAN.t * 3, (BAN.dur - BAN.t) * 5); X.save(); X.globalAlpha = a; var y = 96; var g2 = X.createLinearGradient(VIEWW / 2 - 200, 0, VIEWW / 2 + 200, 0); g2.addColorStop(0, 'rgba(20,14,10,0)'); g2.addColorStop(.2, 'rgba(20,14,10,.78)'); g2.addColorStop(.8, 'rgba(20,14,10,.78)'); g2.addColorStop(1, 'rgba(20,14,10,0)'); X.fillStyle = g2; X.fillRect(VIEWW / 2 - 200, y - 22, 400, BAN.sub ? 50 : 34);
    hudText(BAN.title, VIEWW / 2, y - 4, 19, BAN.col, 'center'); if (BAN.sub) hudText(BAN.sub, VIEWW / 2, y + 17, 11.5, '#d8cbb0', 'center', false); X.restore(); }
  if (BIG.t > 0) { var a2 = Math.min(1, BIG.t * 2, (3 - BIG.t) * 3); X.save(); X.globalAlpha = a2; X.fillStyle = 'rgba(0,0,0,.5)'; X.fillRect(0, VIEWH / 2 - 40, VIEWW, BIG.sub ? 76 : 56); hudText(BIG.title, VIEWW / 2, VIEWH / 2 - 12, 30, '#f5e6c4', 'center'); if (BIG.sub) hudText(BIG.sub, VIEWW / 2, VIEWH / 2 + 20, 13, '#e8b14a', 'center', false); X.restore(); }
  if (INTRO.t > 0) drawIntro();
}
function pad2(n) { return (n < 10 ? '0' : '') + n; }
function fmtTime(t) { t = Math.floor(t); var m = Math.floor(t / 60), s = t % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
var ROOMCOL = { boss: '#c83a2a', treasure: '#e8b84a', shop: '#5aa05a', secret: '#6a6a7a', arcade: '#a04ab8', start: '#8ab8d8' };
var ROOMICON = { boss: '💀', treasure: '⭐', shop: '🛒', secret: '❔', arcade: '🎰', planet: '🪐' };
function drawMinimap(x, y, w, h, cw, ch, big) {
  var F = R.floor, cur = R.room; X.save(); X.fillStyle = 'rgba(0,0,0,' + (big ? .35 : .4) + ')'; rr(x, y, w, h, 6); X.fill(); X.beginPath(); X.rect(x + 2, y + 2, w - 4, h - 4); X.clip();
  var cx, cy; if (cur.gx >= 0) { cx = cur.gx + cur.cw / 2; cy = cur.gy + cur.ch / 2; } else { var bb = F.rooms[F.boss]; cx = bb.gx + .5; cy = bb.gy + .5; }
  var ox = x + w / 2 - cx * cw, oy = y + h / 2 - cy * ch;
  F.rooms.forEach(function (rm) {
    if (rm.gx < 0 || !(rm.seen || rm.visited)) return; if (rm.type === 'secret' && !rm.visited && !rm.seen) return;
    var rx = ox + rm.gx * cw + 1, ry = oy + rm.gy * ch + 1, rw = rm.cw * cw - 2, rh = rm.ch * ch - 2;
    X.fillStyle = rm === cur ? '#ffffff' : rm.visited ? '#a8a29a' : '#4a4642'; rr(rx, ry, rw, rh, 2); X.fill();
    if (rm === cur) { X.strokeStyle = '#ffe08a'; X.lineWidth = 1.2; rr(rx - .5, ry - .5, rw + 1, rh + 1, 2); X.stroke(); }
    var ic = ROOMICON[rm.type]; if (ic) emo(ic, rx + rw / 2, ry + rh / 2, big ? 16 : 7);
  });
  X.restore();
}
// ---------- plansza „VS” przed bossem ----------
function drawIntro() {
  var k = 1 - INTRO.t / INTRO.max, B = BOSSES[INTRO.boss], P = R.P, a = Math.min(1, INTRO.t * 3, k * 6);
  X.save(); X.globalAlpha = a;
  X.fillStyle = 'rgba(8,4,4,.88)'; X.fillRect(0, 0, VIEWW, VIEWH);
  // klatki z filmiku
  var strip = B.strip && IMG[B.strip]; if (strip && strip.complete && strip.naturalWidth) { var n = Math.round(strip.naturalWidth / 160), fr = Math.floor(GAME.t * 10) % n; X.save(); X.globalAlpha = a * .4; X.translate(VIEWW / 2, VIEWH / 2); X.rotate(-.06); for (var i = -3; i <= 3; i++) { X.drawImage(strip, ((fr + i + n * 4) % n) * 160, 0, 160, 160, i * 132 - 64 + ((GAME.t * 40) % 132), -64, 128, 128); } X.restore(); }
  // pasy
  X.fillStyle = '#5a1a12'; X.beginPath(); X.moveTo(0, VIEWH * .62); X.lineTo(VIEWW, VIEWH * .5); X.lineTo(VIEWW, VIEWH * .66); X.lineTo(0, VIEWH * .78); X.fill();
  var sl = Math.min(1, k * 4);
  // gracz
  X.save(); X.translate(lerp(-120, 120, ease(sl)), VIEWH * .58); var pimg = faceImg(CHARS[P.ch].face, 'h', 120); if (pimg && pimg.complete) { var hh = 120, hw = hh * (FM[CHARS[P.ch].face] || { asp: .7 }).asp; X.drawImage(pimg, -hw / 2, -hh, hw, hh); } X.restore();
  hudText(CHARS[P.ch].n, lerp(-120, 120, ease(sl)), VIEWH * .58 + 22, 14, '#fff', 'center');
  // boss
  X.save(); X.translate(lerp(VIEWW + 140, VIEWW - 150, ease(sl)), VIEWH * .52);
  var bimg = { freddy: 'z', sigeon: 's', simi: 'b', scary: 'k', greek: 'm' }[INTRO.boss];
  if (bimg) { var im = faceImg('ignaczak', bimg, 150); if (im && im.complete) { var h2 = 150, w2 = h2 * FM.ignaczak.asp; X.drawImage(im, -w2 / 2, -h2, w2, h2); } }
  else emo({ fizyk: '👨‍🏫', kujonG: '🤓', kanar: '👮', dresSzef: '😤', budzikG: '⏰', duchW: '👻' }[INTRO.boss] || '💀', 0, -70, 120);
  X.restore();
  if (B.num) hudText('NUMBERO ' + B.num, VIEWW / 2, 56, 34, '#ffe08a', 'center');
  hudText(B.n, lerp(VIEWW + 100, VIEWW - 150, ease(sl)), VIEWH * .52 + 24, 20, '#ff9a8a', 'center');
  hudText('VS', VIEWW / 2, VIEWH * .5, 40 + Math.sin(GAME.t * 12) * 2, '#fff', 'center');
  X.restore();
}
function ease(t) { return 1 - Math.pow(1 - t, 3); }

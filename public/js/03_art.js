// ---- 03_art.js ----
// ===================== GRAFIKA: pokoje, postacie, łzy, znajdźki, przeszkody =====================
function rr(x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); X.beginPath(); X.moveTo(x + r, y); X.arcTo(x + w, y, x + w, y + h, r); X.arcTo(x + w, y + h, x, y + h, r); X.arcTo(x, y + h, x, y, r); X.arcTo(x, y, x + w, y, r); X.closePath(); }
function rrc(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function shadow(x, y, rx, ry, a) { X.fillStyle = 'rgba(0,0,0,' + (a == null ? .3 : a) + ')'; X.beginPath(); X.ellipse(x, y, rx, ry, 0, 0, TAU); X.fill(); }
function shade(hex, k) { // rozjaśnij / przyciemnij kolor
  var n = parseInt(hex.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255;
  if (k > 0) { r += (255 - r) * k; g += (255 - g) * k; b += (255 - b) * k; } else { r *= 1 + k; g *= 1 + k; b *= 1 + k; }
  return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
}
// ---------- motywy rozdziałów ----------
var THEMES = {
  lazienka: { floor: 'tiles', fa: '#8e9690', fb: '#7e8680', grout: '#545a56', wallA: '#6e7a76', wallB: '#56605c', wallLow: '#3e4a48', trim: '#262e2c', side: '#4a5452', vign: .72, tint: 'rgba(30,60,50,.08)' },
  szkola: { floor: 'lino', fa: '#8a7e66', fb: '#786c56', grout: '#544a3a', wallA: '#8e8468', wallB: '#6e664e', wallLow: '#2f4a36', trim: '#1a2e20', side: '#5e5640', vign: .74, tint: 'rgba(40,60,30,.06)' },
  rynek: { floor: 'cobble', fa: '#6e665c', fb: '#5e564c', grout: '#3a342e', wallA: '#7a3a28', wallB: '#5a2a1c', wallLow: '#4a2016', trim: '#2a120c', side: '#4e2418', vign: .72, tint: 'rgba(255,110,50,.05)' },
  internat: { floor: 'parquet', fa: '#7a5234', fb: '#6a4428', grout: '#3e2614', wallA: '#6e4e6a', wallB: '#54384f', wallLow: '#3e2a3a', trim: '#24161f', side: '#4e3448', vign: .76, tint: 'rgba(90,40,120,.07)' },
  piwnica: { floor: 'concrete', fa: '#8a4a34', fb: '#7a3e2c', grout: '#4a2418', wallA: '#7a4030', wallB: '#5a2c20', wallLow: '#3e1c14', trim: '#200c08', side: '#4e2418', vign: .62, tint: 'rgba(120,20,10,.08)' },
  olimp: { floor: 'marble', fa: '#bdb6a8', fb: '#aaa294', grout: '#8a7030', wallA: '#c4bcac', wallB: '#9a9282', wallLow: '#8a7030', trim: '#5a4818', side: '#9a907e', vign: .6, tint: 'rgba(255,200,120,.05)' },
  diabel: { floor: 'concrete', fa: '#3a1a1a', fb: '#2a1010', grout: '#1a0808', wallA: '#3a1414', wallB: '#200808', wallLow: '#5a1010', trim: '#100404', side: '#2a0c0c', vign: .85, tint: 'rgba(120,0,0,.12)' },
  aniol: { floor: 'marble', fa: '#f8f6f0', fb: '#ebe7dc', grout: '#d8c48a', wallA: '#ffffff', wallB: '#e8e2d4', wallLow: '#e0cf98', trim: '#c0a860', side: '#e6dfcf', vign: .25, tint: 'rgba(255,250,220,.08)' },
  kasyno: { floor: 'carpet', fa: '#6a1f3a', fb: '#55182e', grout: '#e0b040', wallA: '#3a2a52', wallB: '#24183a', wallLow: '#c0902a', trim: '#7a5a12', side: '#2e2244', vign: .6, tint: 'rgba(255,80,160,.05)' }
};
// ---------- tekstury podłóg (proceduralne, z ziarnem) ----------
function floorTex(kind, T, seed) {
  var s = VIEW.s, S = Math.round(160 * s), c = document.createElement('canvas'); c.width = c.height = S; var x = c.getContext('2d'), r = mkRng(seed || 7), u = S / 160;
  x.fillStyle = T.fa; x.fillRect(0, 0, S, S);
  var i, j, k;
  if (kind === 'tiles') { for (i = 0; i < 8; i++) for (j = 0; j < 8; j++) { x.fillStyle = (i + j) % 2 ? T.fa : shade(T.fa, -.035); x.fillRect(i * 20 * u, j * 20 * u, 20 * u, 20 * u); } x.strokeStyle = T.grout; x.lineWidth = 1.4 * u; for (i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(i * 20 * u, 0); x.lineTo(i * 20 * u, S); x.stroke(); x.beginPath(); x.moveTo(0, i * 20 * u); x.lineTo(S, i * 20 * u); x.stroke(); } }
  else if (kind === 'lino') { for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) { x.fillStyle = (i + j) % 2 ? T.fa : T.fb; x.fillRect(i * 40 * u, j * 40 * u, 40 * u, 40 * u); } x.strokeStyle = 'rgba(0,0,0,.08)'; x.lineWidth = u; for (i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * 40 * u, 0); x.lineTo(i * 40 * u, S); x.stroke(); x.beginPath(); x.moveTo(0, i * 40 * u); x.lineTo(S, i * 40 * u); x.stroke(); }
    for (k = 0; k < 14; k++) { x.strokeStyle = 'rgba(40,30,20,' + r.range(.03, .09) + ')'; x.lineWidth = r.range(1, 3) * u; x.beginPath(); var sx = r() * S, sy = r() * S; x.moveTo(sx, sy); x.quadraticCurveTo(sx + r.range(-30, 30) * u, sy + r.range(-10, 10) * u, sx + r.range(-40, 40) * u, sy + r.range(-20, 20) * u); x.stroke(); } }
  else if (kind === 'cobble') { x.fillStyle = T.grout; x.fillRect(0, 0, S, S); for (j = 0; j < 8; j++) for (i = 0; i < 8; i++) { var ox = (j % 2) * 10 * u, cx = i * 20 * u + ox + 10 * u, cy = j * 20 * u + 10 * u, w = r.range(7.5, 9.2) * u, h = r.range(7.5, 9) * u; var col = shade(r.chance(.5) ? T.fa : T.fb, r.range(-.08, .08)); x.fillStyle = col; x.beginPath(); x.ellipse(cx % S, cy, w, h, r.range(-.3, .3), 0, TAU); x.fill(); if (cx + w > S) { x.beginPath(); x.ellipse(cx - S, cy, w, h, 0, 0, TAU); x.fill(); } x.fillStyle = 'rgba(255,255,255,.08)'; x.beginPath(); x.ellipse(cx % S - 2 * u, cy - 2 * u, w * .55, h * .45, 0, 0, TAU); x.fill(); } }
  else if (kind === 'parquet') { for (j = 0; j < 16; j++) for (i = 0; i < 4; i++) { var px = i * 40 * u + (j % 2) * 20 * u, py = j * 10 * u; x.fillStyle = shade(r.chance(.5) ? T.fa : T.fb, r.range(-.07, .07)); x.fillRect(px % S, py, 40 * u, 10 * u); if (px + 40 * u > S) x.fillRect(px - S, py, 40 * u, 10 * u); x.strokeStyle = T.grout; x.lineWidth = .8 * u; x.strokeRect(px % S, py, 40 * u, 10 * u); for (k = 0; k < 3; k++) { x.strokeStyle = 'rgba(60,30,10,.12)'; x.beginPath(); x.moveTo((px % S) + 2 * u, py + r.range(2, 8) * u); x.lineTo((px % S) + 38 * u, py + r.range(2, 8) * u); x.stroke(); } } }
  else if (kind === 'concrete') { for (k = 0; k < 900; k++) { x.fillStyle = 'rgba(' + (r.chance(.5) ? '255,255,255' : '0,0,0') + ',' + r.range(.02, .07) + ')'; x.fillRect(r() * S, r() * S, r.range(1, 3) * u, r.range(1, 3) * u); } for (k = 0; k < 4; k++) { x.strokeStyle = 'rgba(0,0,0,.25)'; x.lineWidth = r.range(.7, 1.6) * u; x.beginPath(); var cx2 = r() * S, cy2 = r() * S; x.moveTo(cx2, cy2); for (var q = 0; q < 5; q++) { cx2 += r.range(-18, 18) * u; cy2 += r.range(-18, 18) * u; x.lineTo(cx2, cy2); } x.stroke(); } for (k = 0; k < 3; k++) { var g = x.createRadialGradient(0, 0, 0, 0, 0, 30 * u); g.addColorStop(0, 'rgba(20,30,40,.25)'); g.addColorStop(1, 'rgba(20,30,40,0)'); x.save(); x.translate(r() * S, r() * S); x.scale(1.6, 1); x.fillStyle = g; x.fillRect(-30 * u, -30 * u, 60 * u, 60 * u); x.restore(); } }
  else if (kind === 'marble') { for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) { x.fillStyle = (i + j) % 2 ? T.fa : T.fb; x.fillRect(i * 80 * u, j * 80 * u, 80 * u, 80 * u); } for (k = 0; k < 9; k++) { x.strokeStyle = 'rgba(120,110,100,' + r.range(.12, .3) + ')'; x.lineWidth = r.range(.6, 1.8) * u; x.beginPath(); var vx = r() * S, vy = r() * S; x.moveTo(vx, vy); for (var q2 = 0; q2 < 6; q2++) { vx += r.range(-10, 30) * u; vy += r.range(-14, 14) * u; x.lineTo(vx, vy); } x.stroke(); } x.strokeStyle = T.grout; x.lineWidth = 2 * u; x.strokeRect(0, 0, 80 * u, 80 * u); x.strokeRect(80 * u, 80 * u, 80 * u, 80 * u); x.strokeRect(80 * u, 0, 80 * u, 80 * u); x.strokeRect(0, 80 * u, 80 * u, 80 * u); }
  else if (kind === 'carpet') { for (k = 0; k < 40; k++) { x.strokeStyle = 'rgba(224,176,64,' + r.range(.15, .35) + ')'; x.lineWidth = 1.5 * u; x.beginPath(); x.arc(r() * S, r() * S, r.range(4, 10) * u, 0, TAU); x.stroke(); } for (k = 0; k < 500; k++) { x.fillStyle = 'rgba(0,0,0,.08)'; x.fillRect(r() * S, r() * S, u, u); } }
  return c;
}
// ---------- tło pokoju (podłoga + ściany) do bufora ----------
function buildRoomBG(room) {
  var s = VIEW.s, T = THEMES[room.theme] || THEMES.szkola, W = room.w, H = room.h;
  var c = document.createElement('canvas'); c.width = Math.ceil((W + WS * 2) * s); c.height = Math.ceil((H + WT + WB) * s);
  var x = c.getContext('2d'); x.setTransform(s, 0, 0, s, WS * s, WT * s);
  var pat = x.createPattern(floorTex(T.floor, T, room.seed % 97), 'repeat'); var m = new DOMMatrix(); m.a = m.d = 1 / s; pat.setTransform(m);
  x.fillStyle = pat; x.fillRect(-4, -4, W + 8, H + 8);
  var r = mkRng(room.seed);
  // plamy i ślady (charakter pokoju)
  for (var k = 0; k < 6 + r.int(0, 6); k++) { var px = r() * W, py = r() * H, rad = r.range(14, 46); var g = x.createRadialGradient(px, py, 0, px, py, rad); var dark = T.floor === 'marble' ? 'rgba(160,140,100,' : 'rgba(30,20,10,'; g.addColorStop(0, dark + r.range(.05, .14) + ')'); g.addColorStop(1, dark + '0)'); x.fillStyle = g; x.beginPath(); x.ellipse(px, py, rad * r.range(1, 1.8), rad, r() * PI, 0, TAU); x.fill(); }
  if (room.decal && DECALS[room.decal]) DECALS[room.decal](x, r, T, room);
  // cień przy ścianach (głębia)
  var gs = x.createLinearGradient(0, 0, 0, 36); gs.addColorStop(0, 'rgba(0,0,0,.42)'); gs.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gs; x.fillRect(0, 0, W, 36);
  gs = x.createLinearGradient(0, 0, 26, 0); gs.addColorStop(0, 'rgba(0,0,0,.3)'); gs.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gs; x.fillRect(0, 0, 26, H);
  gs = x.createLinearGradient(W, 0, W - 26, 0); gs.addColorStop(0, 'rgba(0,0,0,.3)'); gs.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gs; x.fillRect(W - 26, 0, 26, H);
  // ściany w perspektywie
  wallFace(x, T, room, 'top', [[-WS, -WT], [W + WS, -WT], [W, 0], [0, 0]]);
  wallFace(x, T, room, 'left', [[-WS, -WT], [0, 0], [0, H], [-WS, H + WB]]);
  wallFace(x, T, room, 'right', [[W + WS, -WT], [W + WS, H + WB], [W, H], [W, 0]]);
  wallFace(x, T, room, 'bottom', [[0, H], [W, H], [W + WS, H + WB], [-WS, H + WB]]);
  // narożniki
  x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 2; [[[-WS, -WT], [0, 0]], [[W + WS, -WT], [W, 0]], [[-WS, H + WB], [0, H]], [[W + WS, H + WB], [W, H]]].forEach(function (l) { x.beginPath(); x.moveTo(l[0][0], l[0][1]); x.lineTo(l[1][0], l[1][1]); x.stroke(); });
  x.strokeStyle = 'rgba(0,0,0,.5)'; x.lineWidth = 2.5; x.strokeRect(0, 0, W, H);
  // otwory na drzwi (ciemne wnęki)
  room.doors.forEach(function (d) { if (!d.hidden) doorHole(x, d, T); });
  // winieta
  var vg = x.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .78); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,' + T.vign + ')');
  x.fillStyle = vg; x.fillRect(-WS, -WT, W + WS * 2, H + WT + WB);
  if (T.tint) { x.fillStyle = T.tint; x.fillRect(-WS, -WT, W + WS * 2, H + WT + WB); }
  return c;
}
function wallFace(x, T, room, side, pts) {
  x.save(); x.beginPath(); pts.forEach(function (p, i) { i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1]); }); x.closePath(); x.clip();
  var W = room.w, H = room.h, g;
  if (side === 'top') {
    g = x.createLinearGradient(0, -WT, 0, 0); g.addColorStop(0, shade(T.wallB, -.25)); g.addColorStop(.55, T.wallA); g.addColorStop(1, shade(T.wallA, -.08)); x.fillStyle = g; x.fillRect(-WS, -WT, W + WS * 2, WT);
    wallDeco(x, T, room, -WS, -WT, W + WS * 2, WT, 'h');
    x.fillStyle = 'rgba(0,0,0,.2)'; x.fillRect(-WS, -4, W + WS * 2, 4);
  } else if (side === 'bottom') {
    g = x.createLinearGradient(0, H, 0, H + WB); g.addColorStop(0, shade(T.side, -.45)); g.addColorStop(1, shade(T.side, -.2)); x.fillStyle = g; x.fillRect(-WS, H, W + WS * 2, WB);
    x.fillStyle = shade(T.trim, .05); x.fillRect(-WS, H, W + WS * 2, 4);
  } else {
    var L = side === 'left'; g = x.createLinearGradient(L ? -WS : W + WS, 0, L ? 0 : W, 0); g.addColorStop(0, shade(T.side, -.3)); g.addColorStop(1, T.side); x.fillStyle = g; x.fillRect(L ? -WS : W, -WT, WS, H + WT + WB);
    wallDeco(x, T, room, L ? -WS : W, -WT, WS, H + WT + WB, L ? 'l' : 'r');
    x.fillStyle = 'rgba(0,0,0,.18)'; x.fillRect(L ? -4 : W, 0, 4, H);
  }
  x.restore();
}
function wallDeco(x, T, room, ox, oy, w, h, dir) {
  var r = mkRng(room.seed * 7 + dir.charCodeAt(0)), k, th = room.theme;
  if (dir === 'h') {
    if (th === 'szkola' || th === 'lazienka') { // lamperia
      var ly = oy + h * .5; x.fillStyle = T.wallLow; x.fillRect(ox, ly, w, h * .5); x.fillStyle = T.trim; x.fillRect(ox, ly - 3, w, 4);
      if (th === 'lazienka') { x.strokeStyle = 'rgba(255,255,255,.25)'; x.lineWidth = 1; for (k = ox; k < ox + w; k += 16) { x.beginPath(); x.moveTo(k, ly); x.lineTo(k, oy + h); x.stroke(); } x.beginPath(); x.moveTo(ox, ly + h * .25); x.lineTo(ox + w, ly + h * .25); x.stroke(); }
      if (th === 'szkola') for (k = 0; k < 2 + r.int(0, 2); k++) { var tx = r.range(40, room.w - 80); if (room.doors.some(function (d) { return d.side === 'top' && Math.abs(d.x - tx) < 70; })) continue; x.fillStyle = '#2d4a33'; rrc(x, tx, oy + 10, r.range(38, 70), 26, 3); x.fill(); x.strokeStyle = '#7a5a3a'; x.lineWidth = 3; x.stroke(); x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 1; x.beginPath(); x.moveTo(tx + 6, oy + 18); x.lineTo(tx + 26, oy + 16); x.moveTo(tx + 8, oy + 25); x.lineTo(tx + 30, oy + 26); x.stroke(); }
    } else if (th === 'rynek' || th === 'piwnica' || th === 'diabel') { // cegły
      var bh = 9, row = 0; for (var yy = oy; yy < oy + h; yy += bh, row++) for (var xx = ox - (row % 2) * 11; xx < ox + w; xx += 22) { x.fillStyle = shade(T.wallA, r.range(-.12, .08) - (yy - oy) / h * .25); x.fillRect(xx + 1, yy + 1, 20, bh - 2); }
      if (th === 'piwnica') { x.strokeStyle = '#2a2622'; x.lineWidth = 6; x.beginPath(); x.moveTo(ox, oy + 16); x.lineTo(ox + w, oy + 16); x.stroke(); x.strokeStyle = '#4a4440'; x.lineWidth = 2; x.stroke(); }
      if (th === 'rynek') for (k = 0; k < 2; k++) { var wx = r.range(30, room.w - 70); if (room.doors.some(function (d) { return d.side === 'top' && Math.abs(d.x - wx - 20) < 70; })) continue; x.fillStyle = '#2a3440'; x.fillRect(wx, oy + 12, 34, 34); x.strokeStyle = '#e8dcc0'; x.lineWidth = 3; x.strokeRect(wx, oy + 12, 34, 34); x.beginPath(); x.moveTo(wx + 17, oy + 12); x.lineTo(wx + 17, oy + 46); x.moveTo(wx, oy + 29); x.lineTo(wx + 34, oy + 29); x.stroke(); }
    } else if (th === 'internat') { // tapeta w paski i kwiatki
      for (k = ox; k < ox + w; k += 18) { x.fillStyle = 'rgba(255,255,255,.12)'; x.fillRect(k, oy, 7, h); }
      for (k = 0; k < w / 26; k++) { x.fillStyle = 'rgba(255,230,250,.35)'; x.beginPath(); x.arc(ox + k * 26 + 9, oy + 14 + (k % 2) * 16, 3, 0, TAU); x.fill(); }
      x.fillStyle = T.wallLow; x.fillRect(ox, oy + h * .72, w, h * .28); x.fillStyle = T.trim; x.fillRect(ox, oy + h * .72 - 3, w, 4);
    } else if (th === 'olimp' || th === 'aniol') { // marmur, pilastry, złoty fryz
      x.fillStyle = T.wallLow; x.fillRect(ox, oy + 8, w, 5); x.fillRect(ox, oy + h - 14, w, 4);
      for (k = 0; k < w / 70; k++) { var cx = ox + 30 + k * 70; if (room.doors.some(function (d) { return d.side === 'top' && Math.abs(d.x - (cx - ox - WS)) < 50; })) continue; var g2 = x.createLinearGradient(cx - 9, 0, cx + 9, 0); g2.addColorStop(0, shade(T.wallA, -.15)); g2.addColorStop(.5, '#ffffff'); g2.addColorStop(1, shade(T.wallA, -.2)); x.fillStyle = g2; x.fillRect(cx - 9, oy + 13, 18, h - 27); x.fillStyle = T.wallLow; x.fillRect(cx - 12, oy + 13, 24, 4); }
    } else if (th === 'kasyno') { for (k = 0; k < w / 30; k++) { x.fillStyle = ['#ff4a8a', '#ffd04a', '#4ad8ff'][k % 3]; x.beginPath(); x.arc(ox + 15 + k * 30, oy + 12, 3.5, 0, TAU); x.fill(); } }
  } else {
    // boki: proste pasy/listwy zgodne z motywem
    if (th === 'szkola' || th === 'lazienka') { x.fillStyle = T.wallLow; if (dir === 'l') x.fillRect(ox, oy, w * .55, h); else x.fillRect(ox + w * .45, oy, w * .55, h); }
    else if (th === 'rynek' || th === 'piwnica' || th === 'diabel') { for (var y2 = oy; y2 < oy + h; y2 += 9) { x.fillStyle = 'rgba(0,0,0,' + (((y2 / 9) | 0) % 2 ? .08 : 0) + ')'; x.fillRect(ox, y2, w, 9); } }
    else if (th === 'olimp' || th === 'aniol') { x.fillStyle = T.wallLow; x.fillRect(dir === 'l' ? ox + w - 8 : ox + 3, oy, 5, h); }
  }
}
function doorHole(x, d, T) {
  x.save(); x.translate(d.x, d.y); x.rotate(d.rot); // lokalnie: drzwi „u góry”, wnęka w stronę ściany (-y)
  x.fillStyle = '#0b0807'; x.beginPath(); x.moveTo(-26, 2); x.lineTo(-30, -WT + 14); x.lineTo(30, -WT + 14); x.lineTo(26, 2); x.closePath(); x.fill();
  x.restore();
}
// ---------- drzwi (rysowane na żywo – otwierają się) ----------
var DOORSTY = {
  normal: { frame: '#6b4a2e', leaf: '#8a5e36', deco: null },
  treasure: { frame: '#b8902a', leaf: '#e0b84a', deco: '⭐' },
  shop: { frame: '#3a6a4a', leaf: '#5a8a5a', deco: '🛒' },
  boss: { frame: '#5a1a14', leaf: '#8a2a1e', deco: '💀' },
  secret: { frame: '#3a3430', leaf: '#3a3430', deco: null },
  devil: { frame: '#2a0808', leaf: '#5a0c0c', deco: '😈' },
  angel: { frame: '#e8e0c8', leaf: '#ffffff', deco: '🕊️' },
  arcade: { frame: '#5a2a6a', leaf: '#8a3a9a', deco: '🎰' },
  curse: { frame: '#3a1a2a', leaf: '#5a2a3a', deco: '🩸' }
};
function drawDoor(d, room) {
  if (d.hidden) { // ściana z rysą (sekret) – widoczna dopiero po wysadzeniu
    if (d.cracked) { X.save(); X.translate(d.x, d.y); X.rotate(d.rot); X.strokeStyle = 'rgba(0,0,0,.45)'; X.lineWidth = 2; X.beginPath(); X.moveTo(-12, -10); X.lineTo(-4, -26); X.lineTo(4, -18); X.lineTo(12, -38); X.stroke(); X.restore(); }
    return;
  }
  var st = DOORSTY[d.type] || DOORSTY.normal, open = d.open;
  X.save(); X.translate(d.x, d.y); X.rotate(d.rot);
  // futryna
  X.fillStyle = shade(st.frame, -.25); X.beginPath(); X.moveTo(-36, 6); X.lineTo(-40, -WT + 8); X.lineTo(40, -WT + 8); X.lineTo(36, 6); X.lineTo(26, 6); X.lineTo(30, -WT + 18); X.lineTo(-30, -WT + 18); X.lineTo(-26, 6); X.closePath(); X.fill();
  X.fillStyle = st.frame; X.fillRect(-40, -WT + 8, 80, 9);
  if (d.type === 'boss') { X.fillStyle = '#d8d0c0'; for (var i = -1; i <= 1; i += 2) { X.beginPath(); X.moveTo(i * 34, -WT + 10); X.lineTo(i * 46, -WT + 2); X.lineTo(i * 38, -WT + 16); X.fill(); } }
  if (d.type === 'treasure' || d.type === 'angel') { X.strokeStyle = 'rgba(255,240,180,.7)'; X.lineWidth = 2; X.strokeRect(-38, -WT + 8, 76, 9); }
  // skrzydła drzwi
  var k = d.anim == null ? (open ? 1 : 0) : d.anim;
  if (k < 1) {
    var lw = 28 * (1 - k);
    X.fillStyle = st.leaf; X.beginPath(); X.moveTo(-26, 3); X.lineTo(-30, -WT + 18); X.lineTo(-30 + lw, -WT + 18); X.lineTo(-26 + lw * .93, 3); X.closePath(); X.fill();
    X.beginPath(); X.moveTo(26, 3); X.lineTo(30, -WT + 18); X.lineTo(30 - lw, -WT + 18); X.lineTo(26 - lw * .93, 3); X.closePath(); X.fill();
    X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 1.5; X.beginPath(); X.moveTo(-26 + lw * .93, 3); X.lineTo(-30 + lw, -WT + 18); X.moveTo(26 - lw * .93, 3); X.lineTo(30 - lw, -WT + 18); X.stroke();
    if (d.locked) { X.fillStyle = '#d8b040'; X.beginPath(); X.arc(0, -WT * .45, 7, 0, TAU); X.fill(); X.fillStyle = '#3a2a10'; X.fillRect(-1.5, -WT * .45 - 1, 3, 6); }
  }
  if (st.deco) emo(st.deco, 0, -WT + 2, 16);
  if (d.type === 'secret' && open) { X.fillStyle = 'rgba(0,0,0,.5)'; X.beginPath(); X.ellipse(0, -10, 26, 10, 0, 0, TAU); X.fill(); }
  X.restore();
}
// ---------- twarz + ciało postaci (styl „głowa ze zdjęcia na małym ciałku”) ----------
// o: {x,y, ch (klucz twarzy), look:{shirt,pants,shoes,hair}, ex, dir:'d'|'u'|'l'|'r', walk, moving, shoot, sc, flash, alpha, fly, tears, hat}
function drawPerson(o) {
  var sc = o.sc || 1, x = o.x, y = o.y, L = o.look || {}, dir = o.dir || 'd', wp = o.walk || 0, mv = o.moving ? 1 : 0;
  X.save(); X.translate(x, y); X.scale(sc, sc); if (o.alpha != null) X.globalAlpha *= o.alpha;
  var lift = o.fly ? -10 - Math.sin(GAME.t * 5) * 2.5 : 0;
  shadow(0, 2, o.fly ? 11 : 13, o.fly ? 4 : 5, o.fly ? .2 : .3);
  X.translate(0, lift);
  if (o.flash > 0) X.filter = 'brightness(' + (1 + o.flash * 3) + ') saturate(' + (1 - o.flash * .6) + ')';
  if (o.tintRed > 0) X.filter = 'sepia(1) saturate(6) hue-rotate(-40deg) brightness(' + (.9 + o.tintRed * .2) + ')';
  // skrzydła (lot)
  if (o.fly) { var fl = Math.sin(GAME.t * 18) * .35; X.fillStyle = o.wingCol || 'rgba(235,235,240,.95)'; [-1, 1].forEach(function (s) { X.save(); X.translate(s * 8, -22); X.rotate(s * (.5 + fl)); X.beginPath(); X.ellipse(s * 12, 0, 14, 6, 0, 0, TAU); X.fill(); X.strokeStyle = 'rgba(0,0,0,.15)'; X.lineWidth = 1; X.stroke(); X.restore(); }); }
  // nogi
  var sw = Math.sin(wp) * 4 * mv, pants = L.pants || '#2b2b33', shoes = L.shoes || '#f0f0f0';
  X.fillStyle = pants; rr(-8 + (dir === 'l' ? -1 : 0), -12 + Math.max(0, -sw) * .3, 6.5, 11 - Math.max(0, sw) * .25, 3); X.fill(); rr(1.5 + (dir === 'r' ? 1 : 0), -12 + Math.max(0, sw) * .3, 6.5, 11 - Math.max(0, -sw) * .25, 3); X.fill();
  X.fillStyle = shoes; X.beginPath(); X.ellipse(-4.8 + (dir === 'l' ? -2 : dir === 'r' ? 1 : 0), -1.5 - Math.max(0, sw) * .5, 4.6, 2.6, 0, 0, TAU); X.fill(); X.beginPath(); X.ellipse(4.8 + (dir === 'r' ? 2 : dir === 'l' ? -1 : 0), -1.5 - Math.max(0, -sw) * .5, 4.6, 2.6, 0, 0, TAU); X.fill();
  // tułów
  var bob = Math.abs(Math.sin(wp)) * 1.6 * mv, shirt = L.shirt || '#7fb2e5';
  X.translate(0, -bob);
  var g = X.createLinearGradient(-11, 0, 11, 0); g.addColorStop(0, shade(shirt, -.22)); g.addColorStop(.5, shirt); g.addColorStop(1, shade(shirt, -.3));
  X.fillStyle = g; rr(-10.5, -27, 21, 17, 6); X.fill();
  if (L.jacket) { X.fillStyle = L.jacket; rr(-10.5, -27, 7, 17, 4); X.fill(); rr(3.5, -27, 7, 17, 4); X.fill(); }
  if (L.overalls) { X.fillStyle = L.overalls; rr(-7, -22, 14, 12, 3); X.fill(); X.fillRect(-6, -27, 2.5, 6); X.fillRect(3.5, -27, 2.5, 6); }
  if (L.stripes) { X.fillStyle = '#f0f0f0'; X.fillRect(-10, -25, 1.6, 14); X.fillRect(8.4, -25, 1.6, 14); }
  // ręce
  var arm = o.shoot ? .6 : 0, skin = L.skin || '#e2b49a';
  X.fillStyle = shade(shirt, -.12); [-1, 1].forEach(function (s) { var ay = -24 + (o.shoot && ((dir === 'l' && s < 0) || (dir === 'r' && s > 0)) ? -2 : 0) + Math.sin(wp + (s > 0 ? PI : 0)) * 1.5 * mv; X.beginPath(); X.ellipse(s * 12.5, ay + 5, 3.6, 6.2, s * .25, 0, TAU); X.fill(); X.fillStyle = skin; X.beginPath(); X.arc(s * 13.3, ay + 10.5, 2.6, 0, TAU); X.fill(); X.fillStyle = shade(shirt, -.12); });
  if (o.hand) o.hand(dir);
  // głowa
  drawHead(o, dir, 0, -27);
  X.filter = 'none';
  X.restore();
}
function drawHead(o, dir, hx, hy) {
  var ch = o.ch || 'ignaczak', img = null, meta = o.emoji ? { asp: .92, eyeL: [.33, .42], eyeR: [.67, .42] } : (FM[ch] || { asp: .72, eyeL: [.3, .48], eyeR: [.7, .48] });
  var hh = (o.headH || 36), hw = hh * meta.asp, tilt = o.tilt || 0;
  if (!o.emoji) img = faceImg(ch, o.ex || 'n', hh);
  X.save(); X.translate(hx, hy - hh * .42); X.rotate(tilt);
  if (dir === 'u') { // tył głowy
    var hc = (o.look && o.look.hair) || '#5a4632';
    var g = X.createRadialGradient(-hw * .15, -hh * .2, hh * .1, 0, 0, hh * .6); g.addColorStop(0, shade(hc, .2)); g.addColorStop(1, shade(hc, -.25));
    X.fillStyle = shade((o.look && o.look.skin) || '#e2b49a', -.1); X.beginPath(); X.ellipse(-hw * .48, hh * .02, 3.5, 5.5, 0, 0, TAU); X.ellipse(hw * .48, hh * .02, 3.5, 5.5, 0, 0, TAU); X.fill();
    X.fillStyle = g; X.beginPath(); X.ellipse(0, -hh * .02, hw * .5, hh * .5, 0, 0, TAU); X.fill();
    if (o.curly) { X.fillStyle = shade(hc, -.1); for (var k = 0; k < 9; k++) { var a = k / 9 * TAU; X.beginPath(); X.arc(Math.cos(a) * hw * .38, -hh * .1 + Math.sin(a) * hh * .32, hw * .16, 0, TAU); X.fill(); } }
    X.fillStyle = 'rgba(0,0,0,.18)'; X.beginPath(); X.ellipse(0, hh * .38, hw * .32, hh * .1, 0, 0, TAU); X.fill();
  } else {
    var sx = dir === 'l' || dir === 'r' ? .84 : 1, ox = dir === 'l' ? -hw * .06 : dir === 'r' ? hw * .06 : 0;
    X.translate(ox, 0); X.scale(dir === 'l' ? -sx : sx, 1);
    if (o.emoji) { emo(o.emoji, 0, 0, hh * 1.04); }
    else if (img && img.complete && img.naturalWidth) {
      X.drawImage(img, -hw / 2, -hh / 2, hw, hh);
    } else { X.fillStyle = '#e2b49a'; X.beginPath(); X.ellipse(0, 0, hw / 2, hh / 2, 0, 0, TAU); X.fill(); }
    if (o.tears) { // łzy spływające z oczu
      X.fillStyle = 'rgba(120,200,255,.85)'; [meta.eyeL, meta.eyeR].forEach(function (e, i) { var ex = -hw / 2 + e[0] * hw, ey = -hh / 2 + e[1] * hh; for (var q = 0; q < 2; q++) { var ph = (GAME.t * 2.2 + q * .5 + i * .3) % 1; X.globalAlpha = (1 - ph) * .9; X.beginPath(); X.ellipse(ex + (i ? 1 : -1) * ph * 2, ey + 3 + ph * hh * .32, 1.6, 2.4, 0, 0, TAU); X.fill(); } X.globalAlpha = 1; });
    }
  }
  if (o.hat) o.hat(hw, hh, dir);
  X.restore();
}
// ---------- łzy i pociski ----------
var TEARCOL = { tear: ['#e8f7ff', '#5fb4ff', '#2a74c8'], fire: ['#fff3c0', '#ff9a2a', '#c8401a'], ice: ['#ffffff', '#9fe8ff', '#4ab0e0'], poison: ['#e8ffd0', '#7ad23a', '#3a7a18'], milk: ['#ffffff', '#f4f2ea', '#c8c4b8'], gold: ['#fff6c8', '#f0c43a', '#a8801a'], blood: ['#ffb0a8', '#d8423a', '#7a1410'], dark: ['#b080d0', '#5a2a7a', '#1a0a2a'], smoke: ['#f0f0f0', '#b8b8bc', '#7a7a80'], zap: ['#ffffff', '#fff27a', '#e0b020'], enemy: ['#ffd0c8', '#c84a3a', '#5a1410'], vomit: ['#f0f8b0', '#b8c83a', '#6a7a18'] };
function drawTear(t) {
  var x = t.ix, y = t.iy, r = t.r, z = t.z || 0, k = t.kind || 'tear';
  shadow(x, y + 4, r * .9, r * .4, .22);
  var yy = y - z;
  if (TEARDRAW[k]) { TEARDRAW[k](t, x, yy); return; }
  if (k === 'credit') { X.save(); X.translate(x, yy); X.rotate(GAME.t * 8 + t.id); X.fillStyle = '#2e9a4a'; rr(-r * 1.3, -r * .8, r * 2.6, r * 1.6, 2); X.fill(); X.strokeStyle = '#bff5c8'; X.lineWidth = 1.2; X.stroke(); X.fillStyle = '#eaffea'; X.font = 'bold ' + (r * .9) + 'px monospace'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('zł', 0, .5); X.restore(); return; }
  if (k === 'pigeon') { drawPigeonTiny(x, yy, r * 1.6, Math.atan2(t.vy, t.vx)); return; }
  if (k === 'bottle') { X.save(); X.translate(x, yy); X.rotate(GAME.t * 12 + t.id); X.fillStyle = '#3a8a3a'; rr(-r * .45, -r * 1.3, r * .9, r * 2.6, r * .4); X.fill(); X.fillStyle = '#e8d8a0'; X.fillRect(-r * .45, -r * .2, r * .9, r * .6); X.fillStyle = '#2a6a2a'; X.fillRect(-r * .22, -r * 1.8, r * .44, r * .6); X.restore(); return; }
  if (k === 'can') { X.save(); X.translate(x, yy); X.rotate(GAME.t * 10 + t.id); X.fillStyle = '#d8b040'; rr(-r * .6, -r * .9, r * 1.2, r * 1.8, r * .3); X.fill(); X.fillStyle = '#7a1a10'; X.fillRect(-r * .6, -r * .3, r * 1.2, r * .6); X.restore(); return; }
  if (k === 'chalk') { X.save(); X.translate(x, yy); X.rotate(GAME.t * 9 + t.id); X.fillStyle = '#f4f4ec'; rr(-r * 1.2, -r * .4, r * 2.4, r * .8, r * .3); X.fill(); X.restore(); return; }
  if (k === 'ticket') { X.save(); X.translate(x, yy); X.rotate(Math.sin(GAME.t * 10 + t.id) * .5); X.fillStyle = '#fff6c8'; X.fillRect(-r * 1.2, -r * .7, r * 2.4, r * 1.4); X.fillStyle = '#c83a2a'; X.fillRect(-r * 1.2, -r * .7, r * .5, r * 1.4); X.restore(); return; }
  if (k === 'feather') { X.save(); X.translate(x, yy); X.rotate(Math.atan2(t.vy, t.vx)); X.fillStyle = '#d8dce0'; X.beginPath(); X.ellipse(0, 0, r * 1.6, r * .55, 0, 0, TAU); X.fill(); X.strokeStyle = '#6a7078'; X.lineWidth = 1; X.beginPath(); X.moveTo(-r * 1.6, 0); X.lineTo(r * 1.6, 0); X.stroke(); X.restore(); return; }
  if (k === 'note') { emo('🎵', x, yy, r * 2.4); return; }
  var c = TEARCOL[k] || TEARCOL.tear, sp = Math.hypot(t.vx, t.vy), st = Math.min(.35, sp / 1400);
  X.save(); X.translate(x, yy); if (st > .02) { X.rotate(Math.atan2(t.vy, t.vx)); X.scale(1 + st, 1 - st * .5); }
  if (k === 'fire' || k === 'zap' || k === 'gold' || k === 'dark') { X.globalCompositeOperation = 'lighter'; var gl = X.createRadialGradient(0, 0, 0, 0, 0, r * 2.2); gl.addColorStop(0, c[1]); gl.addColorStop(1, 'rgba(0,0,0,0)'); X.globalAlpha = .45; X.fillStyle = gl; X.beginPath(); X.arc(0, 0, r * 2.2, 0, TAU); X.fill(); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over'; }
  var g = X.createRadialGradient(-r * .35, -r * .4, r * .1, 0, 0, r); g.addColorStop(0, c[0]); g.addColorStop(.55, c[1]); g.addColorStop(1, c[2]);
  X.globalAlpha = k === 'smoke' ? .75 : .93; X.fillStyle = g; X.beginPath(); X.arc(0, 0, r, 0, TAU); X.fill(); X.globalAlpha = 1;
  X.fillStyle = 'rgba(255,255,255,.75)'; X.beginPath(); X.ellipse(-r * .35, -r * .38, r * .28, r * .18, -.6, 0, TAU); X.fill();
  X.restore();
}
function drawPigeonTiny(x, y, s, a) { X.save(); X.translate(x, y); var flap = Math.sin(GAME.t * 30) * .6; X.fillStyle = '#8f98a3'; X.beginPath(); X.ellipse(0, 0, s * .55, s * .38, 0, 0, TAU); X.fill(); X.fillStyle = '#6a7380'; [-1, 1].forEach(function (k) { X.beginPath(); X.ellipse(k * s * .4, -s * .1, s * .45, s * .16, k * (.4 + flap), 0, TAU); X.fill(); }); X.fillStyle = '#5a7a6a'; X.beginPath(); X.arc(Math.cos(a) * s * .35, Math.sin(a) * s * .25 - s * .12, s * .22, 0, TAU); X.fill(); X.restore(); }
// ---------- znajdźki ----------
function drawHeartShape(x, y, s, fill, half) {
  X.save(); X.translate(x, y); X.scale(s / 20, s / 20);
  X.beginPath(); X.moveTo(0, 7); X.bezierCurveTo(-12, -1, -11, -12, -5, -12); X.bezierCurveTo(-2, -12, 0, -10, 0, -7); X.bezierCurveTo(0, -10, 2, -12, 5, -12); X.bezierCurveTo(11, -12, 12, -1, 0, 7); X.closePath();
  if (half) { X.save(); X.clip(); X.fillStyle = fill; X.fillRect(-14, -14, 14, 24); X.fillStyle = 'rgba(0,0,0,.35)'; X.fillRect(0, -14, 14, 24); X.restore(); }
  else { X.fillStyle = fill; X.fill(); }
  X.strokeStyle = 'rgba(30,0,0,.65)'; X.lineWidth = 1.6; X.stroke();
  X.fillStyle = 'rgba(255,255,255,.55)'; X.beginPath(); X.ellipse(-5, -7, 2.6, 1.8, -.5, 0, TAU); X.fill();
  X.restore();
}
function drawCoin(x, y, s, val) {
  var sq = Math.abs(Math.sin(GAME.t * 3 + x * .1)) * .55 + .45;
  X.save(); X.translate(x, y); X.scale(sq, 1);
  var g = X.createRadialGradient(-s * .2, -s * .25, s * .1, 0, 0, s); g.addColorStop(0, val >= 5 ? '#f4f4f4' : '#fff1b0'); g.addColorStop(1, val >= 5 ? '#9aa0a8' : '#c8901a');
  X.fillStyle = g; X.beginPath(); X.arc(0, 0, s, 0, TAU); X.fill(); X.strokeStyle = val >= 5 ? '#6a7078' : '#8a5a10'; X.lineWidth = 1.4; X.stroke();
  if (val >= 5) { X.fillStyle = '#e8c04a'; X.beginPath(); X.arc(0, 0, s * .62, 0, TAU); X.fill(); }
  X.fillStyle = 'rgba(80,50,10,.85)'; X.font = 'bold ' + (s * .95) + 'px Georgia'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText(val === 1 ? '1' : String(val), 0, 1);
  X.restore();
}
function drawKey(x, y, s, gold) { X.save(); X.translate(x, y); X.rotate(-.6); X.fillStyle = gold ? '#ffd84a' : '#d8b048'; X.strokeStyle = '#6a4a10'; X.lineWidth = 1.3; X.beginPath(); X.arc(-s * .55, 0, s * .45, 0, TAU); X.fill(); X.stroke(); X.fillRect(-s * .15, -s * .13, s * 1.25, s * .26); X.strokeRect(-s * .15, -s * .13, s * 1.25, s * .26); X.fillRect(s * .75, 0, s * .15, s * .4); X.fillRect(s * .45, 0, s * .15, s * .32); X.fillStyle = '#5a3a10'; X.beginPath(); X.arc(-s * .55, 0, s * .17, 0, TAU); X.fill(); X.restore(); }
function drawBomb(x, y, s, lit) { // petarda
  X.save(); X.translate(x, y); X.rotate(-.35);
  var g = X.createLinearGradient(-s * .5, 0, s * .5, 0); g.addColorStop(0, '#8a1810'); g.addColorStop(.5, '#e8402a'); g.addColorStop(1, '#7a140c');
  X.fillStyle = g; rr(-s * .45, -s * .8, s * .9, s * 1.6, s * .2); X.fill(); X.fillStyle = '#f0e0b0'; X.fillRect(-s * .45, -s * .2, s * .9, s * .36); X.fillStyle = '#2a1a10'; X.font = 'bold ' + (s * .3) + 'px sans-serif'; X.textAlign = 'center'; X.fillText('BUM', 0, s * .1);
  X.strokeStyle = '#3a2a1a'; X.lineWidth = 1.6; X.beginPath(); X.moveTo(0, -s * .8); X.quadraticCurveTo(s * .3, -s * 1.1, s * .1, -s * 1.3); X.stroke();
  if (lit) { var f = .6 + rnd01() * .6; X.fillStyle = '#ffe070'; X.beginPath(); X.arc(s * .1, -s * 1.32, s * .18 * f, 0, TAU); X.fill(); X.fillStyle = '#ff7a20'; X.beginPath(); X.arc(s * .1, -s * 1.32, s * .1 * f, 0, TAU); X.fill(); }
  X.restore();
}
function drawPickup(p) {
  var x = p.ix, y = p.iy - (p.z || 0), t = p.type, bob = 0;
  if (p.spawnT > 0) { var k = 1 - p.spawnT / .35; X.save(); X.translate(x, y); X.scale(k, k); x = 0; y = 0; }
  shadow(x, y + 7, 9, 3.5, .25);
  if (t === 'coin') drawCoin(x, y, p.val >= 10 ? 9 : p.val >= 5 ? 8 : 7, p.val);
  else if (t === 'heart') { if (p.val === 'soul') drawSoulHeart(x, y, 17); else if (p.val === 'black') drawHeartShape(x, y, 17, '#2a2a30'); else drawHeartShape(x, y, 17, '#d8302a', p.val === 'half'); }
  else if (t === 'key') drawKey(x, y, 11, p.val === 'gold');
  else if (t === 'bomb') drawBomb(x, y, 11);
  else if (t === 'battery') { X.save(); X.translate(x, y); X.fillStyle = '#121214'; rr(-6, -10, 12, 20, 3); X.fill(); X.fillStyle = '#5aff3a'; X.fillRect(-1.5, -8, 3, 16); X.fillStyle = '#c0c0c8'; X.fillRect(-6, -11, 12, 2.5); X.restore(); }
  else if (t === 'card') { X.save(); X.translate(x, y); X.rotate(Math.sin(GAME.t * 2 + p.id) * .15); X.fillStyle = '#f8f4ea'; rr(-8, -11, 16, 22, 2.5); X.fill(); X.strokeStyle = '#8a7a5a'; X.lineWidth = 1; X.stroke(); X.fillStyle = '#8a2a1e'; X.font = 'bold 11px Georgia'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillText('🂠' === '' ? '' : '♠', 0, 1); X.restore(); }
  else if (t === 'pill') { var col = PILLCOL[p.val] || ['#d8b040', '#7a1a10']; X.save(); X.translate(x, y); X.rotate(.3); X.fillStyle = col[0]; rr(-6, -9, 12, 18, 3); X.fill(); X.fillStyle = col[1]; X.fillRect(-6, -3, 12, 6); X.fillStyle = 'rgba(255,255,255,.4)'; X.fillRect(-4, -8, 2, 16); X.restore(); }
  else if (t === 'trinket') emo(TRINKETS[p.val] ? TRINKETS[p.val].e : '❔', x, y, 18, Math.sin(GAME.t * 2) * .2);
  else if (t === 'chest') drawChest(x, y, p.val);
  if (p.spawnT > 0) X.restore();
}
function drawSoulHeart(x, y, s) {
  X.save(); X.translate(x, y); X.scale(s / 20, s / 20);
  X.beginPath(); X.moveTo(0, 7); X.bezierCurveTo(-12, -1, -11, -12, -5, -12); X.bezierCurveTo(-2, -12, 0, -10, 0, -7); X.bezierCurveTo(0, -10, 2, -12, 5, -12); X.bezierCurveTo(11, -12, 12, -1, 0, 7); X.closePath();
  var g = X.createRadialGradient(-3, -6, 1, 0, -3, 13); g.addColorStop(0, '#eaf6ff'); g.addColorStop(.5, '#7ab8f0'); g.addColorStop(1, '#2a62b8'); X.globalAlpha *= .92; X.fillStyle = g; X.fill();
  X.strokeStyle = '#163a7a'; X.lineWidth = 1.6; X.stroke(); X.fillStyle = 'rgba(255,255,255,.7)'; X.beginPath(); X.ellipse(-5, -7, 2.6, 1.8, -.5, 0, TAU); X.fill();
  X.restore();
}
function drawChest(x, y, kind) { X.save(); X.translate(x, y); var gold = kind === 'gold'; X.fillStyle = gold ? '#d8a830' : '#7a4a24'; rr(-13, -9, 26, 18, 3); X.fill(); X.fillStyle = gold ? '#f0c84a' : '#9a6234'; rr(-13, -12, 26, 9, 4); X.fill(); X.strokeStyle = 'rgba(0,0,0,.4)'; X.lineWidth = 1.2; X.strokeRect(-13, -4, 26, 2); X.fillStyle = gold ? '#7a5a10' : '#d8b048'; X.fillRect(-2.5, -5, 5, 6); X.restore(); }
var PILLCOL = { 0: ['#e8c040', '#8a1a10'], 1: ['#3ab04a', '#f0f0f0'], 2: ['#d8302a', '#f0d040'], 3: ['#3a6ad8', '#f0f0f0'], 4: ['#222226', '#c0c0c8'], 5: ['#f0f0f0', '#d83a8a'], 6: ['#8a4ad8', '#f0c040'], 7: ['#f08a2a', '#2a2a2a'] };
// ---------- cokół z przedmiotem ----------
function drawPedestal(p, item) {
  var x = p.ix, y = p.iy;
  shadow(x, y + 12, 18, 6, .3);
  var g = X.createLinearGradient(x - 16, 0, x + 16, 0); g.addColorStop(0, '#6a625a'); g.addColorStop(.5, '#a8a096'); g.addColorStop(1, '#5a524a');
  X.fillStyle = g; rr(x - 15, y - 2, 30, 14, 3); X.fill(); X.fillStyle = '#c0b8ac'; rr(x - 17, y - 6, 34, 7, 2); X.fill();
  if (!item) return;
  var fy = y - 26 + Math.sin(GAME.t * 2.4 + x) * 3;
  if (p.price != null) { X.fillStyle = p.price < 0 ? '#ff6a5a' : '#ffe9a0'; X.font = 'bold 13px "Trebuchet MS"'; X.textAlign = 'center'; X.textBaseline = 'middle'; X.strokeStyle = 'rgba(0,0,0,.8)'; X.lineWidth = 3; var txt = p.price < 0 ? '♥'.repeat(-p.price) : p.price + ' zł'; X.strokeText(txt, x, y + 22); X.fillText(txt, x, y + 22); }
  var gl = X.createRadialGradient(x, fy, 2, x, fy, 26); gl.addColorStop(0, item.q >= 3 ? 'rgba(255,220,120,.45)' : 'rgba(255,255,255,.28)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); X.fillStyle = gl; X.beginPath(); X.arc(x, fy, 26, 0, TAU); X.fill();
  drawItemIcon(item, x, fy, 26);
}
function drawItemIcon(item, x, y, sz) { if (item.draw) item.draw(x, y, sz); else emo(item.e || '❔', x, y, sz); }
// ---------- przeszkody ----------
function drawObstacle(o, th) {
  var x = o.x, y = o.y, T = THEMES[th] || THEMES.szkola, r;
  switch (o.k) {
    case 'rock':
      shadow(x, y + 14, 19, 7, .3);
      if (th === 'szkola' || th === 'lazienka') { // stos książek / karton
        r = mkRng(o.seed); var cols = ['#b83a2a', '#2a6ab8', '#3a8a4a', '#d8a030', '#6a3a8a'];
        for (var i = 0; i < 4; i++) { X.fillStyle = r.pick(cols); rr(x - 17 + r.range(-2, 2), y + 8 - i * 7, 34 - i * 2, 7.5, 2); X.fill(); X.fillStyle = 'rgba(255,255,255,.55)'; X.fillRect(x - 15 + r.range(-2, 2), y + 10 - i * 7, 28 - i * 2, 1.4); }
      } else if (th === 'rynek') { X.fillStyle = '#7a7268'; X.beginPath(); X.moveTo(x - 18, y + 14); X.lineTo(x - 16, y - 6); X.lineTo(x - 4, y - 14); X.lineTo(x + 14, y - 8); X.lineTo(x + 19, y + 14); X.closePath(); X.fill(); X.fillStyle = '#968e82'; X.beginPath(); X.moveTo(x - 16, y - 6); X.lineTo(x - 4, y - 14); X.lineTo(x + 14, y - 8); X.lineTo(x + 2, y); X.closePath(); X.fill(); }
      else if (th === 'internat') { X.fillStyle = '#7a3a6a'; rr(x - 18, y - 10, 36, 24, 6); X.fill(); X.fillStyle = '#9a5a8a'; rr(x - 18, y - 14, 36, 10, 5); X.fill(); X.fillStyle = '#e8c860'; X.fillRect(x - 3, y - 6, 6, 4); }
      else if (th === 'olimp' || th === 'aniol') { X.fillStyle = '#d8d0c0'; rr(x - 17, y - 2, 34, 16, 2); X.fill(); var g2 = X.createLinearGradient(x - 12, 0, x + 12, 0); g2.addColorStop(0, '#c8c0b0'); g2.addColorStop(.5, '#fffaf0'); g2.addColorStop(1, '#bcb4a4'); X.fillStyle = g2; X.fillRect(x - 12, y - 18, 24, 18); X.fillStyle = '#c9a54a'; X.fillRect(x - 14, y - 20, 28, 3); }
      else { X.fillStyle = '#5a3a2a'; X.beginPath(); X.ellipse(x, y + 2, 17, 14, 0, 0, TAU); X.fill(); X.strokeStyle = '#3a241a'; X.lineWidth = 2; [-8, 0, 8].forEach(function (yy) { X.beginPath(); X.moveTo(x - 15, y + yy + 2); X.lineTo(x + 15, y + yy + 2); X.stroke(); }); X.fillStyle = 'rgba(255,255,255,.1)'; X.beginPath(); X.ellipse(x - 5, y - 6, 7, 4, 0, 0, TAU); X.fill(); }
      break;
    case 'poop': // kupa gołębia
      var hp = o.hp / o.max; shadow(x, y + 10, 15, 5, .25);
      X.fillStyle = '#7a6a52'; for (var j = 0; j < 3; j++) { if (hp < (j + 1) / 3.2) break; X.beginPath(); X.ellipse(x, y + 6 - j * 7, 15 - j * 4, 7 - j, 0, 0, TAU); X.fill(); }
      X.fillStyle = 'rgba(255,255,255,.75)'; X.beginPath(); X.arc(x - 4, y - 2, 3, 0, TAU); X.arc(x + 5, y + 4, 2.5, 0, TAU); X.fill();
      break;
    case 'pot': // kosz na śmieci
      shadow(x, y + 13, 14, 5, .25); var g3 = X.createLinearGradient(x - 12, 0, x + 12, 0); g3.addColorStop(0, '#4a5a6a'); g3.addColorStop(.5, '#8a9aaa'); g3.addColorStop(1, '#3a4a5a'); X.fillStyle = g3; X.beginPath(); X.moveTo(x - 12, y - 12); X.lineTo(x + 12, y - 12); X.lineTo(x + 9, y + 13); X.lineTo(x - 9, y + 13); X.closePath(); X.fill(); X.fillStyle = '#2a3440'; X.beginPath(); X.ellipse(x, y - 12, 12, 4, 0, 0, TAU); X.fill(); X.fillStyle = '#e8e8e0'; X.fillRect(x - 5, y - 15, 7, 4);
      break;
    case 'block': // szafka szkolna / blok metalowy
      shadow(x, y + 15, 20, 6, .3); X.fillStyle = th === 'olimp' ? '#c9a54a' : '#5a6a7a'; rr(x - 19, y - 22, 38, 37, 3); X.fill(); X.fillStyle = 'rgba(255,255,255,.18)'; X.fillRect(x - 17, y - 20, 34, 3); X.strokeStyle = 'rgba(0,0,0,.35)'; X.lineWidth = 1.2; for (var q = 0; q < 3; q++) { X.beginPath(); X.moveTo(x - 10, y - 14 + q * 4); X.lineTo(x + 10, y - 14 + q * 4); X.stroke(); } X.fillStyle = '#c8c8c8'; X.fillRect(x + 11, y - 5, 3, 7);
      break;
    case 'spikes': // pinezki
      r = mkRng(o.seed); for (var s2 = 0; s2 < 9; s2++) { var px = x + r.range(-15, 15), py = y + r.range(-15, 15); X.fillStyle = r.pick(['#e83a2a', '#2a8ae8', '#e8c02a', '#3ab04a']); X.beginPath(); X.arc(px, py, 3.4, 0, TAU); X.fill(); X.fillStyle = '#d8d8d8'; X.beginPath(); X.moveTo(px - 1, py); X.lineTo(px, py - 6); X.lineTo(px + 1, py); X.fill(); }
      break;
    case 'pit': X.fillStyle = '#060404'; rr(x - 20, y - 20, 40, 40, 6); X.fill(); var g4 = X.createLinearGradient(0, y - 20, 0, y + 20); g4.addColorStop(0, 'rgba(60,40,30,.6)'); g4.addColorStop(.3, 'rgba(0,0,0,0)'); X.fillStyle = g4; X.fill(); break;
    case 'fire': // grill / rożen
      shadow(x, y + 12, 15, 5, .3); X.fillStyle = '#2a2a2e'; rr(x - 13, y, 26, 10, 3); X.fill();
      if (o.hp > 0) { var fl = 1 + Math.sin(GAME.t * 14 + x) * .12; X.globalCompositeOperation = 'lighter'; var gf = X.createRadialGradient(x, y - 6, 1, x, y - 6, 18 * fl); gf.addColorStop(0, 'rgba(255,240,160,.95)'); gf.addColorStop(.4, 'rgba(255,140,40,.7)'); gf.addColorStop(1, 'rgba(200,40,10,0)'); X.fillStyle = gf; X.beginPath(); X.ellipse(x, y - 8, 12 * fl * (o.hp / o.max * .5 + .5), 18 * fl * (o.hp / o.max * .5 + .5), 0, 0, TAU); X.fill(); X.globalCompositeOperation = 'source-over'; }
      break;
    case 'tnt': // butla gazowa
      shadow(x, y + 13, 12, 4, .3); var g5 = X.createLinearGradient(x - 10, 0, x + 10, 0); g5.addColorStop(0, '#8a1a10'); g5.addColorStop(.5, '#e04030'); g5.addColorStop(1, '#7a140c'); X.fillStyle = g5; rr(x - 10, y - 14, 20, 27, 8); X.fill(); X.fillStyle = '#d8d0c0'; X.fillRect(x - 3, y - 19, 6, 6); X.fillStyle = '#fff'; X.font = 'bold 7px sans-serif'; X.textAlign = 'center'; X.fillText('GAZ', x, y + 2);
      break;
  }
}

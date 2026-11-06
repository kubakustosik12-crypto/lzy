// plik jednoplikowy (dist/) podmienia ścieżki na osadzone dane
function assetUrl(p) { return (window.EMBED && window.EMBED[p]) || p; }
// ---- 02_assets.js ----
// ===================== ZASOBY: twarze, kadry z filmików, portret =====================
var IMG = {};
function loadAssets(cb0) {
  var cb = function () { loadFaceAtlases(cb0); };
  var keys = Object.keys(typeof ASSET !== 'undefined' ? ASSET : {}), left = keys.length;
  if (!left) { cb(); return; }
  keys.forEach(function (k) {
    var im = new Image(); var done = function () { if (--left === 0) cb(); };
    im.onload = done; im.onerror = function () { console.warn('zasób', k); done(); }; im.src = assetUrl(ASSET[k]); IMG[k] = im;
  });
}
// pikselowe twarze: atlasy w kilku wysokościach; wybieramy tę najbliższą rozmiarowi na ekranie
var FACEPX = {};
function loadFaceAtlases(cb) {
  if (typeof PFACES === 'undefined') { cb(); return; }
  var left = PFACES.sizes.length;
  PFACES.sizes.forEach(function (h) {
    var im = new Image(); im.onload = function () {
      Object.keys(PFACES.rects).forEach(function (n) { var r = PFACES.rects[n][h]; if (!r) return; var c = document.createElement('canvas'); c.width = r[1]; c.height = h; c.getContext('2d').drawImage(im, r[0], 0, r[1], h, 0, 0, r[1], h); c.complete = true; c.naturalWidth = r[1]; (FACEPX[n] = FACEPX[n] || {})[h] = c; });
      if (--left === 0) cb();
    }; im.onerror = function () { if (--left === 0) cb(); }; im.src = assetUrl('assets/faces/faces_' + h + '.png');
  });
}
function faceImg(ch, ex, h, ctx) {
  var key = FACEPX[ch + '_' + ex] ? ch + '_' + ex : ch + '_n', set = FACEPX[key];
  if (!set) return IMG['f_' + ch + '_' + ex] || IMG['f_' + ch + '_n'];
  var dev = h || 96; if (h) { var m = (ctx || X).getTransform(); dev = h * (Math.hypot(m.a, m.b) || 1); }
  var best = null, bd = 1e9; PFACES.sizes.forEach(function (sz) { var d = Math.abs(sz - dev) + (sz < dev ? .5 : 0); if (set[sz] && d < bd) { bd = d; best = set[sz]; } });
  return best;
}
var FM = typeof FACEMETA !== 'undefined' ? FACEMETA : {};
// emoji jako gotowe obrazki (ostre przy każdej skali)
var EMO = {};
function emoSpr(ch, px) {
  px = Math.max(8, Math.round(px / 4) * 4); var k = ch + '|' + px; if (EMO[k]) return EMO[k];
  var c = document.createElement('canvas'), pad = Math.ceil(px * .25); c.width = c.height = px + pad * 2; var x = c.getContext('2d');
  x.font = px + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(ch, c.width / 2, c.height / 2 + px * .06); c.pad = pad / px; EMO[k] = c; return c;
}
EV.on('resize', function () { EMO = {}; });
// rysuje emoji o rozmiarze sz (jednostki świata) na środku x,y
function emo(ch, x, y, sz, rot, alpha) {
  var c = emoSpr(ch, sz * VIEW.s), w = sz * (1 + c.pad * 2);
  if (rot || alpha != null) { X.save(); if (alpha != null) X.globalAlpha *= alpha; X.translate(x, y); if (rot) X.rotate(rot); X.drawImage(c, -w / 2, -w / 2, w, w); X.restore(); }
  else X.drawImage(c, x - w / 2, y - w / 2, w, w);
}

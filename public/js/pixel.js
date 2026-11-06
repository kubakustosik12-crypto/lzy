// ===================== SILNIK PIKSELOWY =====================
// Cała gra rysuje się w niskiej rozdzielczości (ok. 480×270, jak Isaac), a potem przeglądarka
// powiększa obraz o całkowitą wielokrotność bez wygładzania. Na koniec klatki kolory są
// sprowadzane do wspólnej palety, więc wektorowe rysunki, emoji i twarze wyglądają jak pixel art.
var PIX = (function () {
  'use strict';
  var P = {
    S: 0.65,          // ile pikseli na jednostkę świata (kafel 40 → 26 px, jak w Isaacu)
    quant: true,      // filtr palety
    pal: null, lut: null, pal32: null
  };

  // ---------- paleta (64 kolory, dobrana z kadrów gry i twarzy z 5 Koszmarów) ----------
  P.PALETTE = [];

  P.setPalette = function (hexes) {
    P.PALETTE = hexes.slice(); if (!hexes.length) { P.lut = null; return; }
    var n = hexes.length, rgb = new Array(n), i;
    for (i = 0; i < n; i++) { var h = parseInt(hexes[i].slice(1), 16); rgb[i] = [(h >> 16) & 255, (h >> 8) & 255, h & 255]; }
    P.pal = rgb;
    P.pal32 = new Uint32Array(n);
    var le = new Uint8Array(new Uint32Array([1]).buffer)[0] === 1;
    for (i = 0; i < n; i++) { var c = rgb[i]; P.pal32[i] = le ? (255 << 24 | c[2] << 16 | c[1] << 8 | c[0]) >>> 0 : (c[0] << 24 | c[1] << 16 | c[2] << 8 | 255) >>> 0; }
    // tablica 5 bitów / kanał → najbliższy kolor palety (odległość „redmean”, bliska ludzkiemu oku)
    var lut = new Uint8Array(32768);
    for (var r = 0; r < 32; r++) for (var g = 0; g < 32; g++) for (var b = 0; b < 32; b++) {
      var R = r * 8 + 4, Gg = g * 8 + 4, B = b * 8 + 4, best = 0, bd = 1e12;
      for (i = 0; i < n; i++) {
        var p = rgb[i], rm = (R + p[0]) / 2, dr = R - p[0], dg = Gg - p[1], db = B - p[2];
        var d = (2 + rm / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rm) / 256) * db * db;
        if (d < bd) { bd = d; best = i; }
      }
      lut[(r << 10) | (g << 5) | b] = best;
    }
    P.lut = lut;
  };

  // kwantyzacja gotowej klatki (płótno główne ma willReadFrequently)
  P.quantize = function (ctx, w, h) {
    if (!P.quant || !P.lut || w < 1 || h < 1) return;
    var im = ctx.getImageData(0, 0, w, h), d32 = new Uint32Array(im.data.buffer), d8 = im.data, lut = P.lut, pal = P.pal32;
    for (var i = 0, j = 0, n = d32.length; i < n; i++, j += 4) {
      d32[i] = pal[lut[((d8[j] >> 3) << 10) | ((d8[j + 1] >> 3) << 5) | (d8[j + 2] >> 3)]];
    }
    ctx.putImageData(im, 0, 0);
  };

  // ---------- rysowanie obrazków: powiększanie bez wygładzania, pomniejszanie z wygładzaniem ----------
  var C2 = CanvasRenderingContext2D.prototype, nativeDraw = C2.drawImage;
  C2.drawImage = function (img) {
    var a = arguments, sw = 0, dw = 0;
    if (a.length >= 9) { sw = a[3]; dw = a[7]; } else if (a.length >= 5) { sw = img.width || img.naturalWidth || 0; dw = a[3]; } else { sw = 1; dw = 1; }
    var m = this.getTransform(), sc = Math.hypot(m.a, m.b) * Math.abs(dw) / Math.max(1, Math.abs(sw));
    var smooth = sc < 0.7; // wyraźne pomniejszenie → wygładź, potem paleta i tak da piksele
    if (this.imageSmoothingEnabled !== smooth) this.imageSmoothingEnabled = smooth;
    if (smooth) this.imageSmoothingQuality = 'high';
    return nativeDraw.apply(this, a);
  };

  // ---------- tekst pikselową czcionką ----------
  var F = PFONT, GL = F.G, nativeFill = C2.fillText, nativeStroke = C2.strokeText, nativeMeasure = C2.measureText;
  var CELL = F.UP + F.H + F.DN; // 11 wierszy
  function glyphW(ch) { var g = GL[ch]; return g ? g.b[0].length : 0; }
  function fontPx(ctx) { var m = /(\d+(?:\.\d+)?)px/.exec(ctx.font); return m ? parseFloat(m[1]) : 10; }
  function isBold(ctx) { return /bold|[6-9]00/.test(ctx.font); }
  // podział na odcinki: znaki z czcionki / reszta (emoji) rysowana natywnie
  var SEG = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter('pl', { granularity: 'grapheme' }) : null;
  function runs(t) {
    var out = [], cur = null, arr = SEG ? Array.from(SEG.segment(String(t)), function (s) { return s.segment; }) : Array.from(String(t));
    for (var i = 0; i < arr.length; i++) {
      var ch = arr[i], ok = !!GL[ch] || ch === '\u200d' && false;
      var sp = !ok && P.inlineSprite ? P.inlineSprite(ch) : null;
      if (sp) { cur = null; out.push({ px: false, spr: sp, s: ch }); continue; }
      if (ch === '\ufe0f' || ch === '\u200d') ok = cur ? cur.px : false;
      if (!cur || cur.px !== ok) { cur = { px: ok, s: '' }; out.push(cur); }
      cur.s += ch;
    }
    return out;
  }
  function devScale(ctx) { var m = ctx.getTransform(); return Math.hypot(m.a, m.b) || 1; }
  function pxScale(ctx) { return Math.max(1, Math.round(fontPx(ctx) * devScale(ctx) / 11)); }
  function runW(ctx, r, k, ds) {
    if (r.spr) { var sc = sprCanvas(r.spr[0], r.spr[1], r.spr[2]); return sc ? (sc.sw + 1) * k : 0; }
    if (r.px) { var w = 0, a = Array.from(r.s); for (var i = 0; i < a.length; i++) w += (glyphW(a[i]) + 1) * k; return w; }
    return nativeMeasure.call(ctx, r.s).width * ds;
  }
  // bitmapa napisu w danym kolorze (pamięć podręczna)
  var CACHE = new Map();
  function textBmp(s, k, col, bold, outline, ocol) {
    var key = s + '\u0001' + k + col + (bold ? 'b' : '') + (outline ? 'o' + ocol : '');
    var c = CACHE.get(key); if (c) return c;
    var a = Array.from(s), w = 0, i; for (i = 0; i < a.length; i++) w += (glyphW(a[i]) + 1) * k;
    var pad = outline ? k : 0, bw = bold && k > 1 ? 1 : 0;
    c = document.createElement('canvas'); c.width = Math.max(1, w + pad * 2 + bw); c.height = CELL * k + pad * 2;
    var x = c.getContext('2d');
    var plot = function (ox, oy, color) {
      x.fillStyle = color; var cx = ox;
      for (var i = 0; i < a.length; i++) {
        var g = GL[a[i]]; if (!g) continue; var gw = g.b[0].length;
        var put = function (rows, y0) { for (var ry = 0; ry < rows.length; ry++) { var row = rows[ry]; for (var rx = 0; rx < row.length; rx++) if (row.charCodeAt(rx) === 35) x.fillRect(cx + rx * k, oy + (y0 + ry) * k, k + bw, k); } };
        if (g.u) put(g.u, 0); put(g.b, F.UP); if (g.d) put(g.d, F.UP + F.H);
        cx += (gw + 1) * k;
      }
    };
    if (outline) { for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) if (dx || dy) plot(pad + dx * k, pad + dy * k, ocol); }
    plot(pad, pad, col);
    c.pad = pad;
    if (CACHE.size > 600) CACHE.clear();
    CACHE.set(key, c); return c;
  }
  function anchor(ctx, w, k) {
    var al = ctx.textAlign, bl = ctx.textBaseline, ax = 0, ay;
    var rtl = ctx.direction === 'rtl';
    if (al === 'center') ax = -w / 2; else if (al === 'right' || (al === 'end' && !rtl) || (al === 'start' && rtl)) ax = -w;
    // y = górna krawędź komórki (11 wierszy: 2 akcenty + 7 korpus + 2 ogonki)
    if (bl === 'middle') ay = -(F.UP + F.H / 2) * k;
    else if (bl === 'top' || bl === 'hanging') ay = -F.UP * k + k;
    else if (bl === 'bottom' || bl === 'ideographic') ay = -CELL * k;
    else ay = -(F.UP + F.H) * k; // alphabetic
    return [ax, ay];
  }
  function drawText(ctx, t, x, y, stroke) {
    t = String(t); if (!t) return;
    var rs = runs(t);
    var allNative = true; for (var i = 0; i < rs.length; i++) if (rs[i].px || rs[i].spr) { allNative = false; break; }
    if (allNative || P.nativeText || fontPx(ctx) * devScale(ctx) < 5.5) return stroke ? nativeStroke.call(ctx, t, x, y) : nativeFill.call(ctx, t, x, y);
    var m = ctx.getTransform(), ds = Math.hypot(m.a, m.b) || 1, k = pxScale(ctx), bold = isBold(ctx);
    var p = m.transformPoint(new DOMPoint(x, y));
    var total = 0; for (i = 0; i < rs.length; i++) total += runW(ctx, rs[i], k, ds);
    var an = anchor(ctx, total, k), cx = Math.round(p.x + an[0]), top = Math.round(p.y + an[1]);
    var col = stroke ? ctx.strokeStyle : ctx.fillStyle;
    if (typeof col !== 'string') col = '#ffffff';
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    for (i = 0; i < rs.length; i++) {
      var r = rs[i], w = runW(ctx, r, k, ds);
      if (r.spr) { if (!stroke) { var sc = sprCanvas(r.spr[0], r.spr[1], r.spr[2]); if (sc) nativeDraw.call(ctx, sc, cx, Math.round(top + (F.UP + F.H / 2) * k - sc.sh * k / 2), sc.sw * k, sc.sh * k); } }
      else if (r.px) {
        if (stroke) { // obrys = ten sam napis przesunięty o piksel w 8 kierunkach
          var bo = textBmp(r.s, k, col, bold, true, col); nativeDraw.call(ctx, bo, cx - bo.pad, top - bo.pad);
        } else { var bm = textBmp(r.s, k, col, bold, false); nativeDraw.call(ctx, bm, cx, top); }
      } else {
        ctx.font = ctx.font.replace(/(\d+(?:\.\d+)?)px/, Math.round(fontPx(ctx) * ds) + 'px');
        ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        if (stroke) nativeStroke.call(ctx, r.s, cx, top + (F.UP + F.H / 2) * k); else nativeFill.call(ctx, r.s, cx, top + (F.UP + F.H / 2) * k);
      }
      cx += w;
    }
    ctx.restore();
  }
  C2.fillText = function (t, x, y) { return drawText(this, t, x, y, false); };
  C2.strokeText = function (t, x, y) { return drawText(this, t, x, y, true); };
  C2.measureText = function (t) {
    var rs = runs(String(t)), px = false; for (var i = 0; i < rs.length; i++) if (rs[i].px || rs[i].spr) px = true;
    if (!px || P.nativeText) return nativeMeasure.call(this, t);
    var ds = devScale(this), k = pxScale(this), w = 0; for (i = 0; i < rs.length; i++) w += runW(this, rs[i], k, ds);
    return { width: w / ds, actualBoundingBoxAscent: (F.UP + F.H) * k / ds, actualBoundingBoxDescent: F.DN * k / ds };
  };
  // obrys 1 px wokół nieprzezroczystych pikseli (cienie są półprzezroczyste, więc ich nie obrysowujemy)
  P.outline = function (ctx, w, h) {
    var im = ctx.getImageData(0, 0, w, h), d = im.data, n = w * h, sol = new Uint8Array(n), i;
    for (i = 0; i < n; i++) sol[i] = d[i * 4 + 3] > 170 ? 1 : 0;
    for (var y = 1; y < h - 1; y++) for (var x = 1; x < w - 1; x++) { i = y * w + x; if (sol[i]) continue;
      if (sol[i - 1] | sol[i + 1] | sol[i - w] | sol[i + w]) { var j = i * 4; d[j] = 20; d[j + 1] = 12; d[j + 2] = 12; d[j + 3] = 255; } }
    ctx.putImageData(im, 0, 0);
  };
  P.textBmp = textBmp;
  return P;
})();

// ---- 01_audio.js ----
// ===================== DŹWIĘK: głos z 5 Koszmarów, efekty syntezowane, muzyka =====================
var AU = { ctx: null, master: null, sfx: null, mus: null, buf: null, loading: false, loop: null, loopName: '' };
// fragmenty nagrania z oryginalnej gry (sekundy: start, długość)
var VOX = { helo: [0, .68], intro: [0, 3.61], n5: [3.75, .92], freddy: [4.77, 1.45], n4: [13.3, .9], sigeon: [14.33, 1.35], n3: [20.84, .86], simi: [21.85, 2.0], n2: [28.7, .8], scaryV: [29.64, .88], n1: [32.99, .74], greekV: [33.86, .94],
  songClass: [6.45, 6.7], coo: [15.85, 4.8], simiSong: [24.05, 4.5], scaryFx: [30.72, 2.1], boom: [34.82, 1.1], greekMusic: [35.7, 2.55] };
function auInit() {
  if (AU.ctx) { if (AU.ctx.state === 'suspended') AU.ctx.resume(); return; }
  try { AU.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  var c = AU.ctx; AU.master = c.createGain(); AU.master.gain.value = SET.vol; AU.master.connect(c.destination);
  var comp = c.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(AU.master);
  AU.sfx = c.createGain(); AU.sfx.gain.value = 1; AU.sfx.connect(comp);
  AU.mus = c.createGain(); AU.mus.gain.value = SET.mus * .55; AU.mus.connect(comp);
  // pogłos dla muzyki (krótki splot z szumu)
  var len = c.sampleRate * 2.2, ir = c.createBuffer(2, len, c.sampleRate);
  for (var ch = 0; ch < 2; ch++) { var d = ir.getChannelData(ch); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
  AU.verb = c.createConvolver(); AU.verb.buffer = ir; var vg = c.createGain(); vg.gain.value = .35; AU.verb.connect(vg); vg.connect(comp);
  AU.noise = c.createBuffer(1, c.sampleRate, c.sampleRate); var nd = AU.noise.getChannelData(0); for (var k = 0; k < nd.length; k++) nd[k] = Math.random() * 2 - 1;
  if (typeof VOICE_URL !== 'undefined' && !AU.loading) {
    AU.loading = true;
    var done = function (b) { if (b && !AU.buf) { AU.buf = b; EV.emit('audioReady'); } };
    fetch(assetUrl(VOICE_URL)).then(function (r) { return r.arrayBuffer(); }).then(function (ab) { var p = c.decodeAudioData(ab, done, function () { }); if (p && p.then) p.then(done, function () { }); }).catch(function () { AU.loading = false; });
  }}
['pointerdown', 'keydown', 'touchstart'].forEach(function (n) { window.addEventListener(n, auInit, { passive: true }); });
function setVolumes() { if (AU.master) AU.master.gain.value = SET.vol; if (AU.mus) AU.mus.gain.value = SET.mus * .55; }
function tone(f0, f1, dur, type, vol, delay, dest) {
  var c = AU.ctx; if (!c) return; var t = c.currentTime + (delay || 0);
  var o = c.createOscillator(), g = c.createGain(); o.type = type || 'sine'; o.frequency.setValueAtTime(f0, t); if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || .1, t + Math.min(.012, dur * .2)); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g); g.connect(dest || AU.sfx); o.start(t); o.stop(t + dur + .02);
}
function noiseB(dur, f0, f1, vol, type, delay, q) {
  var c = AU.ctx; if (!c || !AU.noise) return; var t = c.currentTime + (delay || 0);
  var s = c.createBufferSource(), fl = c.createBiquadFilter(), g = c.createGain(); s.buffer = AU.noise; s.loop = true;
  fl.type = type || 'lowpass'; fl.Q.value = q || 1; fl.frequency.setValueAtTime(f0, t); if (f1) fl.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t + dur);
  g.gain.setValueAtTime(vol || .1, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  s.connect(fl); fl.connect(g); g.connect(AU.sfx); s.start(t, Math.random() * .5); s.stop(t + dur + .02);
}
function vox(name, o) {
  o = o || {}; var c = AU.ctx; if (!c || !AU.buf) return null; var s = VOX[name]; if (!s) return null;
  try {
    var src = c.createBufferSource(), g = c.createGain(), v = o.vol == null ? .9 : o.vol, rt = o.rate || 1, t0 = c.currentTime;
    src.buffer = AU.buf; src.playbackRate.value = rt; src.connect(g); g.connect(o.dest || AU.sfx);
    if (o.loop) { src.loop = true; src.loopStart = s[0]; src.loopEnd = s[0] + s[1]; g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v, t0 + .5); src.start(0, s[0]); }
    else { var off = s[0] + (o.off || 0), d = Math.max(.05, Math.min(o.dur || s[1], s[0] + s[1] - off)), real = d / rt; g.gain.setValueAtTime(v, t0); g.gain.setValueAtTime(v, t0 + Math.max(.01, real - .05)); g.gain.linearRampToValueAtTime(0, t0 + real); src.start(0, off, d + .02); }
    return { src: src, g: g };
  } catch (e) { return null; }
}
var _sfxT = {};
function sfx(n, vol) {
  if (!AU.ctx) return; var now = AU.ctx.currentTime; if (_sfxT[n] && now - _sfxT[n] < .035) return; _sfxT[n] = now; var v = vol == null ? 1 : vol;
  switch (n) {
    case 'shoot': tone(560 + arnd(-40, 40), 340, .08, 'sine', .07 * v); noiseB(.04, 3000, 900, .015 * v, 'bandpass'); break;
    case 'splat': noiseB(.07, 1600, 300, .045 * v); tone(260, 120, .05, 'sine', .03 * v); break;
    case 'hit': tone(220, 110, .06, 'triangle', .07 * v); noiseB(.05, 900, 200, .05 * v); break;
    case 'die': noiseB(.28, 900, 90, .16 * v); tone(170, 55, .22, 'sawtooth', .05 * v); break;
    case 'hurt': tone(330, 130, .2, 'sawtooth', .1 * v); tone(250, 90, .24, 'square', .05 * v, .02); noiseB(.18, 1400, 200, .08 * v); break;
    case 'coin': tone(1320, 1320, .06, 'square', .045 * v); tone(1760, 1760, .14, 'square', .045 * v, .06); break;
    case 'key': tone(1100, 1500, .07, 'triangle', .07 * v); tone(1500, 1900, .09, 'triangle', .06 * v, .08); break;
    case 'heart': [523, 659, 784].forEach(function (f, i) { tone(f, f, .12, 'sine', .08 * v, i * .06); }); break;
    case 'soul': [659, 880, 1175].forEach(function (f, i) { tone(f, f * 1.01, .16, 'triangle', .07 * v, i * .07); }); break;
    case 'pickup': tone(600, 900, .09, 'sine', .08 * v); break;
    case 'bomb': tone(140, 140, .05, 'square', .06 * v); noiseB(.06, 5000, 2000, .03 * v, 'highpass'); break;
    case 'fuse': noiseB(.9, 6000, 4000, .018 * v, 'highpass'); break;
    case 'boom': if (AU.buf) vox('boom', { vol: .75 * v, rate: arnd(.9, 1.1) }); else { noiseB(.7, 1200, 60, .35 * v); tone(90, 30, .6, 'sine', .3 * v); } break;
    case 'door': noiseB(.18, 500, 120, .12 * v); tone(110, 70, .14, 'sine', .08 * v); break;
    case 'open': tone(180, 120, .3, 'sawtooth', .025 * v); noiseB(.25, 700, 300, .05 * v, 'bandpass', 0, 3); break;
    case 'item': [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, f, .5 - i * .05, 'triangle', .07 * v, i * .085); }); tone(262, 262, .9, 'sine', .06 * v); break;
    case 'bad': [392, 370, 349, 311].forEach(function (f, i) { tone(f, f * .98, .22, 'sawtooth', .04 * v, i * .1); }); break;
    case 'buy': tone(988, 988, .07, 'square', .05 * v); tone(1319, 1319, .2, 'square', .05 * v, .07); break;
    case 'error': tone(180, 150, .14, 'square', .06 * v); break;
    case 'charge': tone(520, 1040, .18, 'triangle', .07 * v); tone(1040, 1040, .2, 'sine', .05 * v, .17); break;
    case 'use': noiseB(.25, 2200, 300, .08 * v, 'bandpass', 0, 2); tone(300, 900, .2, 'triangle', .06 * v); break;
    case 'vomit': noiseB(.55, 600, 140, .14 * v, 'bandpass', 0, 3); tone(120, 70, .5, 'sawtooth', .04 * v); break;
    case 'laser': tone(1200, 260, .32, 'sawtooth', .04 * v); tone(600, 150, .32, 'square', .025 * v); break;
    case 'zap': noiseB(.12, 6000, 1200, .07 * v, 'bandpass', 0, 4); tone(1800, 600, .1, 'square', .03 * v); break;
    case 'pigeon': if (AU.buf) vox('coo', { off: Math.random() * 4.2, dur: .3, rate: arnd(1.1, 1.4), vol: .5 * v }); else tone(380, 300, .2, 'sine', .05 * v); break;
    case 'boss': noiseB(1.2, 400, 60, .2 * v); tone(80, 40, 1.2, 'sawtooth', .08 * v); break;
    case 'bossdie': noiseB(1.6, 2000, 50, .25 * v); [392, 311, 262, 196].forEach(function (f, i) { tone(f, f / 2, .5, 'sawtooth', .05 * v, i * .2); }); break;
    case 'trap': noiseB(.35, 300, 60, .2 * v); tone(70, 40, .4, 'sine', .15 * v); break;
    case 'step': noiseB(.03, 800, 400, .015 * v); break;
    case 'card': noiseB(.12, 4000, 1500, .05 * v, 'bandpass', 0, 2); tone(880, 1320, .1, 'triangle', .04 * v, .04); break;
    case 'pill': tone(400, 200, .12, 'sine', .07 * v); noiseB(.3, 3000, 800, .05 * v, 'bandpass', .1, 2); break;
    case 'burp': tone(110, 80, .35, 'sawtooth', .07 * v); noiseB(.3, 300, 120, .08 * v); break;
    case 'slot': for (var i = 0; i < 6; i++) tone(700 + i * 60, 700 + i * 60, .04, 'square', .03 * v, i * .05); break;
    case 'jackpot': [523, 659, 784, 1047, 784, 1047, 1319].forEach(function (f, i) { tone(f, f, .12, 'square', .05 * v, i * .08); }); break;
    case 'helo': if (AU.buf) vox('helo', { vol: 1 * v }); else tone(300, 600, .3, 'square', .05 * v); break;
  }
}
// ---------- muzyka: nastrojowy sekwencer + pętle z oryginału na bossach ----------
var MUSDEF = {
  szkola: { bpm: 82, root: 45, prog: [[0, 3, 7], [-4, 0, 3], [-7, -3, 0], [-5, -2, 2]], arp: [0, 2, 1, 2, 0, 1, 2, 1], lead: 'triangle', hat: .6 },
  rynek: { bpm: 92, root: 47, prog: [[0, 3, 7], [5, 8, 12], [3, 7, 10], [-2, 2, 5]], arp: [0, 1, 2, 1, 0, 2, 1, 2], lead: 'square', hat: .8 },
  internat: { bpm: 70, root: 44, prog: [[0, 4, 7], [-3, 0, 4], [-5, -1, 2], [-8, -5, -1]], arp: [0, 2, 1, 2, 1, 2, 0, 2], lead: 'sine', hat: .3 },
  piwnica: { bpm: 60, root: 40, prog: [[0, 3, 6], [-1, 3, 6], [0, 3, 7], [-2, 1, 5]], arp: [0, 1, 0, 2, 0, 1, 0, 2], lead: 'sawtooth', hat: 0 },
  olimp: { bpm: 76, root: 48, prog: [[0, 4, 7], [5, 9, 12], [-3, 0, 4], [7, 11, 14]], arp: [0, 1, 2, 3, 2, 1, 2, 1], lead: 'triangle', hat: .4 },
  deal: { bpm: 54, root: 38, prog: [[0, 3, 7], [1, 4, 8]], arp: [0, 2, 1, 2, 0, 2, 1, 2], lead: 'sine', hat: 0 }
};
var MUS = { def: null, name: '', step: 0, nextT: 0, timer: null, loopH: null };
function mf(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function music(name) {
  if (!AU.ctx) { MUS.want = name; return; }
  if (MUS.name === name) return; MUS.name = name;
  if (MUS.loopH) { var h = MUS.loopH; try { var n = AU.ctx.currentTime; h.g.gain.cancelScheduledValues(n); h.g.gain.setValueAtTime(h.g.gain.value, n); h.g.gain.linearRampToValueAtTime(0, n + .6); h.src.stop(n + .7); } catch (e) { } MUS.loopH = null; }
  MUS.def = null;
  if (!name) return;
  if (VOX[name]) { if (AU.buf) MUS.loopH = vox(name, { loop: true, vol: name === 'songClass' ? .5 : name === 'simiSong' ? .75 : .7, dest: AU.mus }); else MUS.pendingLoop = name; return; }
  MUS.def = MUSDEF[name] || null; MUS.step = 0; MUS.nextT = AU.ctx.currentTime + .1;
  if (!MUS.timer) MUS.timer = setInterval(musTick, 90);
}
EV.on('audioReady', function () { if (MUS.pendingLoop && MUS.name === MUS.pendingLoop) { var n = MUS.name; MUS.name = ''; MUS.pendingLoop = null; music(n); } });
function musNote(f, t, dur, type, vol, verb) {
  var c = AU.ctx, o = c.createOscillator(), g = c.createGain(), fl = c.createBiquadFilter(); o.type = type; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = type === 'sawtooth' || type === 'square' ? 1400 : 4000;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + Math.min(.08, dur * .3)); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(fl); fl.connect(g); g.connect(AU.mus); if (verb && AU.verb) g.connect(AU.verb); o.start(t); o.stop(t + dur + .05);
}
function musTick() {
  var D = MUS.def, c = AU.ctx; if (!D || !c) return;
  var spb = 60 / D.bpm / 2;
  while (MUS.nextT < c.currentTime + .35) {
    var t = MUS.nextT, st = MUS.step, bar = Math.floor(st / 8) % D.prog.length, b = st % 8, ch = D.prog[bar];
    if (b === 0) { ch.forEach(function (k) { musNote(mf(D.root + 12 + k), t, spb * 8.2, 'sawtooth', .018, true); musNote(mf(D.root + 12 + k) * 1.006, t, spb * 8.2, 'sawtooth', .014, true); }); musNote(mf(D.root - 12 + ch[0]), t, spb * 3.6, 'triangle', .11, false); }
    if (b === 4) musNote(mf(D.root - 12 + ch[0]), t, spb * 3.4, 'triangle', .085, false);
    var ai = D.arp[b] % ch.length, oct = D.arp[b] >= ch.length ? 12 : 0; musNote(mf(D.root + 24 + ch[ai] + oct), t, spb * 1.6, D.lead, .035, true);
    if (D.hat && b % 2 === 1) { var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(); s.buffer = AU.noise; f.type = 'highpass'; f.frequency.value = 7000; g.gain.setValueAtTime(.012 * D.hat, t); g.gain.exponentialRampToValueAtTime(.0001, t + .05); s.connect(f); f.connect(g); g.connect(AU.mus); s.start(t, Math.random() * .5); s.stop(t + .06); }
    MUS.step++; MUS.nextT += spb;
  }
}
EV.on('audioReady', function () { });
window.addEventListener('pointerdown', function () { if (MUS.want && AU.ctx) { var w = MUS.want; MUS.want = null; MUS.name = ''; music(w); } }, { passive: true });
window.addEventListener('keydown', function () { if (MUS.want && AU.ctx) { var w = MUS.want; MUS.want = null; MUS.name = ''; music(w); } });

// ---- 16_icons.js ----
// ===================== WŁASNE IKONY ZAMIAST EMOJI =====================
// Dane gry wciąż opisują przedmioty symbolem (pole e), ale na ekranie każdy symbol jest
// zamieniany na ręcznie narysowany sprite (sprites.js): w grze, w HUD-zie, w tekstach i w menu.
var EMO2SPR = {
  '🕊': ['bird', '#e8eef4'], '💀': ['skull'], '🍒': ['cherry'], '❤': ['heart'], '💣': ['bomb'], '⭐': ['star'], '🛒': ['cart'], '❔': ['question', '#c8c4bc'],
  '🍋': ['lemon'], '🔑': ['key'], '💊': ['pill'], '🔒': ['lock'], '→': ['arrow'], '⚡': ['bolt'], '🧨': ['firecracker'], '🃏': ['card', '#f4f0e8', '#9a5ad0'],
  '😈': ['horns'], '🎰': ['slots'], '♠': ['card', '#f4f0e8', '#2a2a30'], '♥': ['card', '#f4f0e8', '#d8302a'], '♣': ['card', '#f4f0e8', '#2a2a30'], '♦': ['card', '#f4f0e8', '#d8302a'],
  '🍺': ['can', '#c8a040', '#f4f0e8'], '📏': ['ruler'], '🌙': ['moon'], '🏛': ['column'], '🥇': ['coin'], '☄': ['fire', '#ff8a2a'], '💫': ['star', '#fff2a0'],
  '🔓': ['lock', '#c8c4bc'], '🔔': ['bell'], '💙': ['heartS', '#7ab8ff'], '🩸': ['blood'], '🎵': ['note'], '🂠': ['card', '#3a6ea5', '#f0c43a'],
  '🧅': ['onion'], '🧪': ['bottle', '#6fbf3a'], '🥤': ['can', '#3a6ea5', '#f0c43a'], '☕': ['cup'], '🎗': ['scarf', '#d8302a', '#f4f0e8'], '🏏': ['bat'],
  '🪨': ['egg', '#8a8a90'], '🪀': ['bow', '#d8a050'], '🍟': ['bag', '#d8302a', '#f0c43a'], '🏹': ['bow'], '🧢': ['cap'], '🧮': ['phone', '#c8c4bc'],
  '🎫': ['card', '#f0c43a', '#7a1410'], '🌿': ['leaf'], '😇': ['halo'], '🗡': ['sword'], '🔪': ['knife'], '🐈‍⬛': ['cat'], '🐈': ['cat'], '🤵': ['scroll', '#e8d8b0'],
  '🥐': ['bread'], '🍕': ['bun', '#e8b040', '#d8302a'], '🍩': ['donut'], '🌯': ['bread', '#c8a060'], '🍜': ['bowl'], '🍔': ['bun'], '⛑': ['cap', '#f0c43a', '#7a5a20'],
  '🥸': ['glasses', '#4a2a18'], '🧥': ['shirt', '#6a4a3a'], '👕': ['shirt', '#4a4a50'], '🧿': ['amulet', '#5fb4ff'], '🎒': ['bag'], '🥛': ['bottle', '#f4f0e8'],
  '✏': ['pen', '#f0c43a'], '🎯': ['bow', '#5a3a20'], '🪶': ['feather', '#9aa3aa'], '🦯': ['wand', '#f4f0e8'], '🥫': ['can', '#d8a050', '#d8302a'], '🍭': ['orb', '#9fe8ff'],
  '🔥': ['fire'], '🍢': ['onion'], '🎼': ['note'], '🌩': ['bolt', '#fff27a'], '👁': ['eye'], '🪄': ['wand'], '🖊': ['pen', '#3a6ea5'], '🪞': ['mirror'], '🧹': ['broom'],
  '🥪': ['bread', '#9ab84a'], '🍞': ['bread'], '👑': ['crown'], '🥚': ['egg'], '🧸': ['bear'], '🤳': ['phone', '#f4f0e8'], '🪽': ['wings'], '🦺': ['shirt', '#ff8a2a'],
  '🧣': ['scarf'], '👢': ['boot'], '🎧': ['headphones'], '🌶': ['fire', '#d8302a'], '🌊': ['wave'], '⌚': ['clock', '#c8c4bc'], '🕶': ['glasses'], '🔦': ['tool', '#f0c43a'],
  '📜': ['scroll'], '📃': ['paper'], '🧲': ['magnet'], '🐷': ['pig'], '🗝': ['key', '#c8a060'], '🥋': ['shirt', '#2a2a30'], '📿': ['ring', '#f0c43a'], '🪏': ['tool', '#8a5a32'],
  '🎩': ['hat'], '😭': ['cry'], '🪣': ['bucket'], '🫴': ['hand'], '🦬': ['can', '#6a4a2a', '#f0c43a'], '🌀': ['swirl', '#5fb4ff'], '👋': ['hand'], '😱': ['mask'],
  '🎲': ['dice'], '🗿': ['statue'], '📱': ['phone'], '🤮': ['blood', '#a8c83a'], '🛡': ['shield', '#5fb4ff'], '✨': ['star', '#fff2a0'], '🍻': ['can', '#c8a040'],
  '💚': ['heart', '#6fbf3a'], '🧯': ['bottle', '#d8302a'], '🎟': ['card', '#f0c43a', '#d8302a'], '☠': ['cloud', '#8aa83a'], '🏃': ['shoe', '#3a6ea5'], '👔': ['shirt', '#2a2a30'],
  '🗺': ['map'], '💪': ['muscle'], '⚖': ['scales'], '🗼': ['tower'], '☀': ['sun'], '💞': ['heart', '#e88aa8'], '🔘': ['coin', '#c8c4bc'], '➰': ['swirl', '#d8a050'],
  '📌': ['needle', '#d8302a'], '🦷': ['tooth'], '🪙': ['coin'], '📎': ['ring', '#c8c4bc'], '🔖': ['card', '#d8302a', '#f4f0e8'], '🔩': ['tool'], '🍂': ['leaf', '#d8a050'],
  '🧾': ['paper'], '🔋': ['battery'], '🖍': ['pen', '#f4f0e8'], '❓': ['question'], '😨': ['mask', '#b8c8d8'], '💗': ['heart', '#e88aa8'], '🩴': ['shoe', '#5fb4ff'],
  '👟': ['st_spd'], '💧': ['st_tears'], '💥': ['st_dmg'], '💨': ['st_ss'], '🍀': ['st_luck'], '⏰': ['clock'], '👻': ['ghost'], '🖤': ['heartB'], '✅': ['star', '#6fbf3a'],
  '🔮': ['orb'], '🥣': ['bowl'], '🌐': ['orb', '#5fb4ff'], '🔄': ['swirl', '#6fbf3a'], '🔌': ['tool'], '🧡': ['heart', '#ff8a2a'], '💜': ['heart', '#9a5ad0'],
  // głowy (dawne emoji-twarze) – nowe, straszne postacie
  '🤓': ['h_kujon'], '😝': ['h_plujka'], '😤': ['h_dres'], '😴': ['h_spioch'], '👨‍🏫': ['h_teacher'], '👮': ['h_kanar'], '👨‍🦲': ['h_heniek'], '👵': ['h_babcia']
};
function emoKey(ch) { return String(ch).replace(/\uFE0F/g, ''); }
function emoSprite(ch) { return EMO2SPR[emoKey(ch)] || null; }
// emo() z 02_assets.js rysuje teraz sprite (emoji tylko, gdy nie ma odpowiednika)
var _emoNative = emo;
emo = function (ch, x, y, sz, rot, alpha) {
  var m = emoSprite(ch); if (m) { drawSpr(m[0], x, y, sz * (m[0].indexOf('h_') === 0 ? 1.25 : 1), m[1], m[2], alpha, rot); return; }
  return _emoNative(ch, x, y, sz, rot, alpha);
};
// tekst na płótnie: symbole w napisach (np. „3 💙”) też jako sprite'y
PIX.inlineSprite = function (g) { return emoSprite(g); };
// HTML: każde mapowane emoji w menu zamieniamy na <img> ze spritem
function iconizeNode(root) {
  if (!root || typeof Intl === 'undefined' || !Intl.Segmenter) return;
  var seg = new Intl.Segmenter('pl', { granularity: 'grapheme' }), walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), list = [], n;
  while ((n = walker.nextNode())) if (/[\u2190-\u2BFF\uD83C-\uD83E\uE000-\uF8FF]/.test(n.nodeValue)) list.push(n);
  list.forEach(function (t) {
    var parts = Array.from(seg.segment(t.nodeValue), function (s) { return s.segment; }), any = false;
    parts.forEach(function (p) { if (emoSprite(p)) any = true; }); if (!any) return;
    var frag = document.createDocumentFragment(), buf = '';
    var size = Math.max(16, Math.min(44, parseFloat(getComputedStyle(t.parentNode).fontSize) * 1.1 || 22));
    parts.forEach(function (p) { var m = emoSprite(p); if (!m) { buf += p; return; } if (buf) { frag.appendChild(document.createTextNode(buf)); buf = ''; } var span = document.createElement('span'); span.innerHTML = sprImg(m[0], m[1], m[2], Math.round(size)); frag.appendChild(span.firstChild); });
    if (buf) frag.appendChild(document.createTextNode(buf));
    t.parentNode.replaceChild(frag, t);
  });
}
(function () {
  var busy = false;
  var obs = new MutationObserver(function (muts) { if (busy) return; busy = true; try { muts.forEach(function (m) { m.addedNodes.forEach(function (nd) { if (nd.nodeType === 1) iconizeNode(nd); else if (nd.nodeType === 3 && nd.parentNode) iconizeNode(nd.parentNode); }); if (m.type === 'characterData' && m.target.parentNode) iconizeNode(m.target.parentNode); }); } finally { busy = false; } });
  obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  iconizeNode(document.body);
})();

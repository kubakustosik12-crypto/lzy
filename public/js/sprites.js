// ===================== RĘCZNE SPRITE'Y PIXEL ART =====================
// Ikony przedmiotów, znajdziek, HUD-u i głowy potworów/NPC. Zastępują emoji z poprzedniej wersji.
// Litery: . przezroczyste, k kontur, w biel, W jasnoszary, G szary, H ciemnoszary,
// a/b/c – kolor przedmiotu (jasny/średni/ciemny, podmieniany per przedmiot), d/e – drugi kolor,
// r/R czerwień, y/Y złoto, g/q zieleń, u/U błękit, s/S skóra, n/N brąz, p/P fiolet, o pomarańcz, x czerń dziur (oczy, usta)
var SPRPAL = { k: '#140c0c', w: '#f4f0e8', W: '#c8c4bc', G: '#8a8a90', H: '#4a4a50', r: '#d8302a', R: '#7a1410', y: '#f0c43a', Y: '#a8801a',
  g: '#6fbf3a', q: '#2f6a20', u: '#5fb4ff', U: '#2a5aa8', s: '#e2b49a', S: '#a8705a', n: '#8a5a32', N: '#4a2a18', p: '#9a5ad0', P: '#4a2a6a', o: '#ff8a2a', x: '#050303', m: '#d8d0c4', M: '#9a948a' };
var SPR = {};
function S(name, col, rows, col2) { SPR[name] = { col: col || '#8a8a90', col2: col2 || '#d8302a', rows: rows.trim().split(/\s+/) }; }
// ---------- jedzenie i picie ----------
S('bottle', '#5fb4ff', `
......kkkk...... ......knnk...... ......knnk...... .....kkkkkk..... ......kWWk...... ......kWWk...... .....kaaaak.....
....kawaaaak.... ...kawaaaaaak... ...kwaaaaaabk... ...kaaaaaaabk... ...kbaaaaabbk... ...kbbaaabbbk... ....kbbbbbbk.... .....kkkkkk.....`);
S('can', '#d8302a', `
.....kkkkkk..... ....kWGGGGWk.... ....kGkkkkGk.... ....kaaaaaabk... ....kawaaaabk... ....kawddddbk... ....kawdwwdbk...
....kawddddbk... ....kawaaaabk... ....kaaaaaabk... ....kaaaaabbk... ....kbaaabbbk... ....kWGGGGWk.... .....kkkkkk.....`, '#f4f0e8');
S('cup', '#f4f0e8', `
...........k.k.. ..........k.k... ...kkkkkkkkkk... ..kaaaaaaaaaak.. ..kawnnnnnnabkk. ..kawaaaaaaabkbk ..kawaaaaaaabk.k ..kaaaaaaaaabkk.
..kbaaaaaaabbk.. ...kbbbbbbbbk... ....kkkkkkkk.... ..kkkkkkkkkkkk.. ...kkkkkkkkkk...`);
S('bowl', '#d8d0c4', `
................ ....k..k..k..... .....k..k..k.... ................ .kkkkkkkkkkkkkk. .kyyyoyyyyoyyyk. .kaaaaaaaaaaaak. ..kawaaaaaaabk..
..kaaaaaaaaabk.. ...kbaaaaaabk... ....kbbbbbbk.... .....kkkkkk.....`);
S('bun', '#d8a050', `
....kkkkkkk..... ..kkaaaaaaakk... .kaawawaaawaak.. kaaaaaaaaaaaabk. kaaaaaaaaaaaabk. kbaaaaaaaaaabbk. kqgqgqgqgqgqgqk. kRRRRRRRRRRRRRk.
kddddddddddddk.. .kbaaaaaaaabbk.. ..kkbbbbbbbkk... ....kkkkkkk.....`, '#f0c43a');
S('donut', '#e88aa8', `
....kkkkkk...... ..kkaaaaaakk.... .kaawaawaaaak... .kawakkkkaabk... kaaak....kaabk.. kaaak....kabbk.. kaaak....kabbk.. .kaaakkkkabbk...
.kbaaaaaabbbk... ..kkbbbbbbkk.... ....kkkkkk......`);
S('bread', '#d8a050', `
...kkkkkkkk..... ..kaaaaaaaakk... .kawwaaawaaabk.. .kaaaaaaaaaabk.. .kbaaaaaaaaabk.. .kbaaaaaaaabbk.. .kbbaaaaaabbbk.. ..kbbbbbbbbbk...
...kkkkkkkkkk...`);
S('onion', '#c87ad8', `
.......k........ ......kgk....... ......kgk....... .....kaak....... ....kaaaak...... ...kaawaaak..... ..kaawaaaaak.... ..kawaaaaabk....
..kawaaaaabk.... ..kaaaaaabbk.... ...kbaaabbk..... ....kbbbbk...... .....kkkk....... .....kGkGk......`);
S('meat', '#c8402a', `
.....kkkkk...... ...kkaaaaakk.... ..kaawaaaaaak... .kaawaaaaaaabk.. .kaaaaaaaaabbk.. .kbaaaaaaaabbk.. ..kbbaaaaabbk... ...kkbbbbbkwk...
.....kkkkkkwwk.. ..........kwwk.. ...........kk...`);
// ---------- ciało i horror ----------
S('heart', '#d8302a', `
..kkk...kkk..... .kaawk.kaaak.... kaawwakaaaabk... kaawaaaaaaabk... kaaaaaaaaaabk... .kaaaaaaaabk.... ..kbaaaaabk..... ...kbaaabk......
....kbabk....... .....kbk........ ......k.........`);
S('skull', '#f4f0e8', `
....kkkkkkk..... ...kaaaaaaak.... ..kaaaaaaaaak... ..kaaaaaaaaabk.. ..kaxxkaxxkabk.. ..kaxxkaxxkabk.. ..kaaaakaaaabk.. ...kaaxkxaabk...
....kawawabk.... ....kbkbkbk..... .....kkkkk......`);
S('eye', '#f4f0e8', `
................ ....kkkkkkkk.... ..kkaaaaaaaakk.. .kaaaaruurraaak. kaaaaruUUurraabk kaaaruUxxUurrabk kaaaruUxxUurrabk .kaaarUUUUraabk.
..kkbaarrrabbk.. ....kkkkkkkk....`);
S('tooth', '#f4f0e8', `
..kkkk.kkkk..... .kaaaakaaaak.... kaawaaaaaaabk... kawaaaaaaaabk... kaaaaaaaaaabk... .kaaaaaaaaabk... .kaaabkaaabk.... ..kaabk.kabk....
..kabk..kbk..... ...kk....kk.....`);
S('blood', '#d8302a', `
......k......... .....kak........ .....kak........ ....kaaak....... ...kawaaak...... ..kawaaaabk..... ..kaaaaaabk..... ..kbaaaabbk.....
...kbbbbbk...... ....kkkkk.......`);
S('claw', '#d8d0c4', `
k....k....k..... kk...kk...kk.... kak..kak..kak... .kak.kak..kak... .kaak.kak.kak... ..kaakkakkaak... ..kSSSSSSSSSk... ..kSssssssSSk...
..kSsssssssSk... ...kSSSSSSSk.... ....kkkkkkk.....`);
S('bone', '#f4f0e8', `
.kk..........kk. kaak........kaak kaawkkkkkkkkwaak .kaaaaaaaaaaaak. .kaaaaaaaaaaaak. kaabkkkkkkkkbaak kbbk........kbbk .kk..........kk.`);
S('doll', '#c8a070', `
....kkkkkk...... ...kaaaaaak..... ..kaxaaaaxak.... ..kaaaaaaaak.... ..karkrkrkak.... ...kaaaaaak..... ..kkkaaaakkk.... .kdddkaakdddk...
.kdkdddddddkdk.. ..k.kddddk.k.... ....kddkddk..... ....kakkkak..... ....kk...kk.....`, '#7a1410');
S('mask', '#f4f0e8', `
...kkkkkkkkk.... ..kaaaaaaaaak... .kaaaaaaaaaaak.. .kaxxaaaaaxxak.. .kaxxkaaakxxak.. .kaaaaaaaaaaak.. .kaaaaakaaaaak.. ..kaaaaaaaaak...
..kaakkkkkaak... ...kaaaaaaak.... ....kkkkkkk.....`);
S('candle', '#2a2026', `
......kk........ .....koyk....... .....kyyk....... ......kk........ ......kk........ .....kaak....... .....kawk....... .....kaak.......
.....kaak....... .....kaak....... .....kaak....... ...kkkaakkk..... ..kYyyyyyyYk.... ...kkkkkkkk.....`);
S('needle', '#c8c4bc', `
.............kk. ............kak. ...........kak.. ..........kak... .........kak.... ........kak..... .......kak...... ......kak.......
.....kak........ ....kak........ ...kak......... ..kRk.......... .kRk........... kk.............`);
S('wire', '#8a8a90', `
k.k..k.k..k.k... .kk..k.k..kk.... kaakkaakkaakk... .k..kk..kk..k... ................ k.k..k.k..k.k... .kk..kk...kk.... kaakkaakkaakk...
.k..kk..kk..k...`);
S('worm', '#e88aa8', `
.........kkk.... ........kaawk... ........kaxak... ...kkk..kaaak... ..kaaak.kbak.... .kak.kakkak..... .kak..kaak...... ..kk...kk.......`);
// ---------- broń ----------
S('knife', '#c8c4bc', `
.............kk. ............kwk. ...........kwak. ..........kwak.. .........kwak... ........kwak.... .......kwak..... ......kwak......
...k.kwak....... ...kkkak........ ....knk......... ...knnk......... ..knnk.......... ..kkk...........`);
S('sword', '#d8d0c4', `
..............kk .............kwk ............kwak ...........kwak. ..........kwak.. .........kwak... ....k...kwak.... ....kk.kwak.....
.....kkkak...... .....kykk....... ....kYkk........ ...kNk.......... ..kNk........... ..kk............`);
S('bat', '#8a5a32', `
.............kk. ............kaak ...........kaabk ..........kaabk. .........kaabk.. ........kaabk... .......kaabk.... ......kaabk.....
.....kaabk...... ....kaabk....... ...kkbk......... ..kNkk.......... ..kNk........... ...k............`);
S('bow', '#8a5a32', `
....kkk......... ...kaak......... ..kak.kkk....... .kak...wk....... .kak...wk....... kak....wk....... kak....wkkkkkk.. kak....wk..kk...
.kak...wk....... .kak...wk....... ..kak.kkk....... ...kaak......... ....kkk.........`);
S('wand', '#8a5a32', `
............k... ...........kyk.. ..........kyyyk. ...........kyk.. ..........k.k... .........kak..... ........kak...... .......kak.......
......kak........ .....kak......... ....kak.......... ...kak........... ..kak............ ...k..............`);
S('pen', '#5fb4ff', `
.............kk. ............kWk. ...........kaak. ..........kaak.. .........kaak... ........kaak.... .......kaak..... ......kaak......
.....kaak....... ....kWWk........ ...kWWk......... ...kHk.......... ..kk............`);
S('ruler', '#f0c43a', `
..............kk .............kak ............kaak ...........kakk. ..........kaak.. .........kakk... ........kaak.... .......kakk.....
......kaak...... .....kakk....... ....kaak........ ...kbak......... ..kbk........... ..kk............`);
// ---------- odzież ----------
S('hat', '#2a2a30', `
................ ................ .....kkkkkk..... ....kaaaaaak.... ....kawaaaak.... ....kawaaaak.... ....kaaaaaak.... ....kddddddk.... ....kddddddk....
..kkkaaaaaakkk.. .kaaaaaaaaaaaak. ..kkkkkkkkkkkk..`, '#d8302a');
S('cap', '#d8302a', `
................ ................ .....kkkkk...... ...kkaaaaakk.... ..kaawaaaaaak... ..kawaaaaaaabk.. ..kaaaaaaaabbk.. .kkkkkkkkkkkkk.. kddddddddk......
.kkkkkkkkk......`, '#7a1410');
S('crown', '#f0c43a', `
................ ................ .k...k...k...k.. kak.kak.kak.kak. kaakkaakkaakkak. kaaaaaaaaaaaabk. kawaaraaauaaabk. kaaaaaaaaaaabbk.
kbbbbbbbbbbbbbk. .kkkkkkkkkkkkk..`);
S('halo', '#f0c43a', `
................ ....kkkkkkkk.... ..kkaaaaaaaakk.. .kaawk....kaaak. .kaak......kabk. .kbak......kbbk. ..kkbbbbbbbbkk.. ....kkkkkkkk....`);
S('shirt', '#5fb4ff', `
....kkk..kkk.... ..kkaak..kaakk.. .kaaawkkkkaaaak. kaaaawaaaaaaabbk kaakkaaaaaakkbbk .kk.kaaaaaak.kk. ....kawaaaabk... ....kaaaaaabk...
....kaaaaaabk... ....kbaaaabbk... ....kbbbbbbbk... ....kkkkkkkkk...`);
S('boot', '#4a2a18', `
....kkkkk....... ....kaaaak...... ....kawaak...... ....kaaaak...... ....kaaaak...... ....kaaaak...... ....kaaaakkk.... ....kaaaaaaakk..
....kaaaaaaaaak. ....kbbbbbbbbbk. ....kkkkkkkkkkk.`);
S('glasses', '#2a2a30', `
................ ................ kkkkkkk..kkkkkkk kaaaawk..kaaaawk kaaaaak..kaaaaak kaaaaakkkkaaaaak .kaaak....kaaak. ..kkk......kkk..`);
S('scarf', '#d8302a', `
..kkkkkkkkkkk... .kaaaaaaaaaaak.. .kawdawdawdaak.. ..kaaaaaaaaak... ......kaak...... ......kawk...... ......kaak...... ......kdak......
......kaak...... ......kaak...... ......kkkk......`, '#f4f0e8');
S('wings', '#f4f0e8', `
k..............k kak..........kak kaak........kaak kaawk......kwaak kaaawk....kwaaak kaaaawkkkkwaaaak .kaaaak..kaaaak. ..kbaak..kaabk..
...kbbk..kbbk... ....kk....kk....`);
S('feather', '#f4f0e8', `
............kkk. ..........kkaak. .........kaawak. ........kaawabk. .......kaawabk.. ......kaawabk... .....kaawabk.... ....kaawabk.....
...kaawbk....... ...kabbk........ ..kGkk.......... .kGk............ kk..............`);
// ---------- przedmioty codzienne ----------
S('book', '#7a1410', `
..kkkkkkkkkkk... .kaaaaaaaaaaak.. .kawaaaaaaaaak.. .kaaayyyyyaaak.. .kaaayaaayaaak.. .kaaayyyyyaaak.. .kaaaaaaaaaaak.. .kaaaaaaaaaaak..
.kbbbbbbbbbbbk.. .kwwwwwwwwwwwk.. ..kkkkkkkkkkk...`);
S('paper', '#f4f0e8', `
..kkkkkkkkk..... ..kaaaaaaaak.... ..kaHHHHHaak.... ..kaaaaaaaak.... ..kaHHHHaaak.... ..kaaaaaaaak.... ..kaHHHHHaak.... ..kaaaaaaaak....
..kaHHHaaaak.... ..kaaaaaabbk.... ..kkkkkkkkk.....`);
S('scroll', '#e8d8b0', `
.kkkkkkkkkkkk... kaaaaaaaaaaaak.. .kkaaaaaaaaakk.. ..kaHHHHHHak.... ..kaaaaaaaak.... ..kaHHHHHaak.... ..kaaaaaaaak.... ..kaHHHHHHak....
.kkaaaaaaaaakk.. kaaaaaaaaaaaak.. .kkkkkkkkkkkk...`);
S('card', '#f4f0e8', `
...kkkkkkkk..... ..kaaaaaaaak.... ..kadaaaaaak.... ..kaaaaaaaak.... ..kaaadaaaak.... ..kaaddda.ak.... ..kadddddaak.... ..kaaadaaaak....
..kaaaaaaaak.... ..kaaaaaadak.... ..kaaaaaaaak.... ...kkkkkkkk.....`, '#d8302a');
S('phone', '#2a2a30', `
....kkkkkkk..... ...kaaaaaaak.... ...kaHHHHHak.... ...kauuuuuak.... ...kauUuuuak.... ...kauuuuuak.... ...kauuuuuak.... ...kauuUuuak....
...kauuuuuak.... ...kaHHHHHak.... ...kaaakaaak.... ...kaaaaaaak.... ....kkkkkkk.....`);
S('headphones', '#2a2a30', `
....kkkkkkk..... ..kkaaaaaaakk... .kaak.....kaak.. .kak.......kak.. kak.........kak. kak.........kak. kddk.......kddk. kddk.......kddk.
kddk.......kddk. .kk.........kk.`, '#d8302a');
S('note', '#2a2a30', `
.....kkkkkkk.... .....kaaaaaak.... .....kakkkkak.... .....kak...kak... .....kak...kak... .....kak...kak... ..kkkkak.kkkak... .kaaaaak.kaaak...
.kaaaaak.kaaak... ..kkkkk...kkk....`);
S('dice', '#f4f0e8', `
..kkkkkkkkkk.... .kaaaaaaaaaak... .kakkaaaaaaak... .kakkaaaaaaak... .kaaaaakkaaak... .kaaaaakkaaak... .kaaaaaaaakkak.. .kaaaaaaaakkak..
.kbaaaaaaaabk... ..kkkkkkkkkk....`);
S('mirror', '#5fb4ff', `
....kkkkkk...... ...kyyyyyyk..... ..kykaaaakyk.... ..kykawaaakyk... ..kykwaaaakyk... ..kykaaaabkyk... ..kykaaabbkyk... ...kykbbbkyk....
....kyyyyyk..... ......kyk....... ......kyk....... .....kyyyk...... .....kkkkk......`);
S('clock', '#f4f0e8', `
...kk......kk... ..kyykkkkkkyyk.. ..kykaaaaaakyk.. ..kkaaaHaaaakk.. .kaaaaaHaaaaak.. .kaaaaaHaaaaak.. .kaaaaaHHHHaak.. .kaaaaaaaaaaak..
..kaaaaaaaaak... ...kkaaaaakk.... ....kkkkkkk.....`);
S('bag', '#3a6ea5', `
.....kkkkk...... ....kk...kk..... ....k.....k..... ..kkkkkkkkkkk... .kaaaaaaaaaaak.. .kawaaaaaaaaak.. .kakkkkkkkkkak.. .kakddddddddkak.
.kakddddddddkak. .kaaaaaaaaaaak.. .kbaaaaaaaaabk.. ..kkkkkkkkkkk...`, '#f0c43a');
S('tool', '#8a8a90', `
..kkkk.......... .kaaaak......... kaawaak......... kaakaak......... .kk.kaak........ .....kaak....... ......knnk...... .......knnk.....
........knnk.... .........knnk... ..........knnk.. ...........kkk..`);
S('broom', '#8a5a32', `
...........kk... ..........kak.... .........kak..... ........kak...... .......kak....... ......kak........ ....kkkkk........ ...kyyyyyk....... ..kyYyYyYk........
.kyYyYyYyk....... kyYyYyYyk........ kkkkkkkk.........`);
S('bucket', '#c8c4bc', `
....kkkkkkk..... ...k.......k.... ..k.........k... .kkkkkkkkkkkkk.. .kwwwwwwwwwwwk.. ..kawaaaaaabk... ..kawaaaaaabk... ..kaaaaaaaabk...
...kaaaaaabk.... ...kbaaaabbk.... ....kkkkkkk.....`);
S('battery', '#2a2a30', `
.......kk....... ......kWWk...... .....kkkkkk..... ....kaaaaaak.... ....kaggggak.... ....kaggggak.... ....kaaaaaak.... ....kaYYYYak....
....kayyyyak.... ....kayyyyak.... ....kayyyyak.... ....kaaaaaak.... .....kkkkkk.....`);
S('magnet', '#d8302a', `
..kkkk..kkkk.... .kaaak..kaaak... .kaak....kaak... .kaak....kaak... .kaak....kaak... .kaak....kaak... .kaaak..kaaak... ..kaaakkaaak....
...kaaaaaak..... ....kkkkkk...... .kwwk....kwwk.. ..kk......kk....`);
S('shield', '#8a8a90', `
..kkkkkkkkkk.... .kaaaaaaaaaak... .kawaayyaaabk... .kaaayyyyaabk... .kaaaayyaaabk... .kaaaayyaaabk... ..kaaaaaaabk.... ..kbaaaaabbk.... ...kbaaabbk.....
....kbabbk...... .....kbbk....... ......kk........`);
S('ring', '#f0c43a', `
.....kkkkk...... ....kuuuuuk..... .....kUuUk...... ....kkkkkkk..... ...kaak..kaak... ..kak.....kak... ..kak.....kak... ..kak.....kbk...
...kaak..kbbk... ....kkkkkkk.....`);
S('amulet', '#f0c43a', `
..k.........k... ...k.......k.... ....k.....k..... .....k...k...... ......kkk....... .....kaaak...... ....kauuuak..... ....kauUuak.....
....kauuuak..... .....kaaak...... ......kkk.......`);
S('gem', '#9a5ad0', `
.....kkkkk...... ....kawaaak..... ...kawaaaabk.... ..kawaaaaaabk... ..kaaaaaaaabk... ...kaaaaaabk.... ....kbaaabk..... .....kbabk...... ......kbk....... .......k........`);
S('coin', '#f0c43a', `
....kkkkk....... ..kkaaaaakk..... .kaawaaaaaak.... .kawaYYYaabk.... kaawaYaYaaabk... kaaaaYYYaaabk... kaaaaaYaaaabk... .kaaaYYYaabk.... .kbaaaaaabbk....
..kkbbbbbkk..... ....kkkkk.......`);
S('key', '#f0c43a', `
....kkkk........ ...kaaaak....... ..kaakkaak...... ..kak..kak...... ..kaakkaak...... ...kaaaak....... ....kaak........ ....kaak........ ....kaakk.......
....kaaak....... ....kaakk....... ....kaaak....... .....kkk........`);
S('bomb', '#2a2a30', `
.........kk.k... ........kook.... .......kkk...... ......kGk....... ....kkkGkkk..... ..kkaaaaaaakk... .kaawwaaaaaabk.. .kawaaaaaaaabk.. kaawaaaaaaaabbk.
kaaaaaaaaaaabbk. .kaaaaaaaaabbk.. .kbaaaaaaabbbk.. ..kkbbbbbbbkk... ....kkkkkkk.....`);
S('firecracker', '#d8302a', `
.......k.k...... ......kook...... .......kk....... .......kk....... .....kkkkkk..... ....kaaaaaak.... ....kawaaabk.... ....kwwwwwwk....
....kawaaabk.... ....kawaaabk.... ....kwwwwwwk.... ....kaaaabbk.... .....kkkkkk.....`);
S('pill', '#f4f0e8', `
.......kkkk..... ......kddddk.... .....kdwdddk.... ....kdwddddk.... ...kddddddk..... ..kkkkkkkk...... .kaaaaaak....... kawaaaak........
kaaaaaak........ kbaaaak......... .kkkkk..........`, '#d8302a');
S('star', '#f0c43a', `
.......k........ ......kak....... ......kak....... .....kawak...... kkkkkaaaaakkkkk. .kaaawaaaaaaak.. ..kaawaaaaaak... ...kaaaaaaak.... ...kaaakaaak....
..kaaak.kaaak... ..kak.....kak... .kk.........kk..`);
S('bolt', '#f0c43a', `
........kkkk.... .......kaaak.... ......kaawk..... .....kaawk...... ....kaawkkkk.... ...kaaaaaaak.... ...kkkkaaak..... ......kaak...... .....kaak.......
....kaak........ ....kak......... ....kk..........`);
S('moon', '#f0e0a0', `
.....kkkk....... ...kkaaaak...... ..kaawk.kk...... .kaawk.......... .kawk........... kaak............ kaak............ kaabk........... .kabbk......k...
.kbbbkk...kkk... ..kkbbbkkkbk.... ....kkkkkkk.....`);
S('sun', '#f0c43a', `
.......k........ ..k....k....k... ...k.......k.... ......kkk....... ....kkaaakk..... ....kawaaaak.... kk.kawaaaaabk.kk ....kaaaaabbk.... ....kkbbbbkk....
......kkkk...... ...k.......k.... ..k....k....k...`);
S('fire', '#ff8a2a', `
.......k........ ......kak....... .....kaak....... ....kayak....k.. ....kaayak..kak. ...kaayyaakkaak. ..kaayyyyaaaaak. ..kayywyyyaaabk. ..kayywwyyyabbk.
..kaayyyyyaabk.. ...kaaaaaabbk... ....kkkkkkkk....`);
S('drop', '#5fb4ff', `
.......k........ ......kak....... ......kak....... .....kaaak...... ....kawaaak..... ...kawaaaaak.... ...kawaaaaabk... ...kaaaaaaabk... ...kbaaaaabbk...
....kbbbbbbk.... .....kkkkkk.....`);
S('wave', '#5fb4ff', `
................ ......kkkk...... ....kkaaaakk.... ...kaawk..kak... ..kaawk...kk.... ..kawk.......... .kaak....kkk.... .kaak...kaaak... kaaabkkkaaaabk.
kbbbbbbbbbbbbk.. .kkkkkkkkkkkk...`);
S('swirl', '#9a5ad0', `
...kkkkkkk...... ..kaaaaaaak..... .kak.....kak.... .kak.kkk..kak... .kak.kak..kak... .kak..k...kak... ..kak....kak.... ...kkkkkkk......`);
S('cloud', '#8a8a90', `
................ ....kkk......... ...kaaak.kkk.... ..kaawaakaaak... .kaawaaaaaaakk.. kaaaaaaaaaaaabk. kbaaaaaaaaaabbk. .kbbbbbbbbbbbk.. ..kkkkkkkkkkk...`);
S('hand', '#e2b49a', `
....k.k.k....... ...kakakak...... ...kakakak.k.... ...kakakakkak... ...kaaaaaakak... .k.kaaaaaaaak... kakkaaaaaaabk... kaaaaaaaaaabk... .kaaaaaaaaabk...
..kbaaaaaabk.... ...kbbbbbbk.....`);
S('statue', '#c8c4bc', `
....kkkkkk...... ...kaaaaaak..... ...kawaaabk..... ...kaxaxabk..... ...kaaaaabk..... ...kakkkabk..... ....kaaabk...... ..kkkaaabkkk.... .kaaaaaaaaabk...
.kaaaaaaaaabk... kkkkkkkkkkkkkk.. kbbbbbbbbbbbbk. kkkkkkkkkkkkkkk.`);
S('column', '#e8e0d0', `
..kkkkkkkkkkk... ..kaaaaaaaaak... ...kkkkkkkkk.... ....kawbawbk..... ....kawbawbk..... ....kawbawbk..... ....kawbawbk..... ....kawbawbk..... ....kawbawbk.....
...kkkkkkkkkk.... ..kaaaaaaaaak... ..kkkkkkkkkkk...`);
S('cross', '#f0c43a', `
......kkk....... ......kak....... ......kak....... ...kkkkakkkk.... ...kaaawaaaak... ...kkkkakkkk.... ......kak....... ......kak....... ......kak.......
......kbk....... ......kkk.......`);
S('egg', '#f4f0e8', `
.....kkkk....... ....kaaaak...... ...kaawaaak..... ..kaawaaaaak.... ..kawaaaaaak.... ..kaaaaaaabk.... ..kaaaaaaabk.... ...kbaaaabk..... ....kkkkkk......`);
S('leaf', '#6fbf3a', `
..........kkk... ........kkaak... ......kkaawak... .....kaaawaak... ....kaaawaabk... ...kaaawaabk.... ...kaawaabk..... ..kawwabbk...... ..kwkkkk........ .kk.............`);
S('bear', '#a8703a', `
..kk......kk.... .kaak.kk.kaak... .kaakkaakkaak.. ..kaaaaaaaaak... ..kaxaaaaxaak... ..kaaaaaaaaak... ..kaaawwwaaak... ...kaawkwaak.... ..kkkaaaaakkk... .kaaaaaaaaaaak.. .kbaaaaaaaaabk. ..kkkkkkkkkkk...`);
S('pig', '#e88aa8', `
..kk......kk.... .kaak....kaak... .kaaakkkkaaak... ..kaaaaaaaaak... ..kaxaaaaxaak... ..kaaawwwaaak... ..kaawkwkwaak... ..kaaawwwaaak... ...kbaaaaabk.... ....kkkkkkk.....`);
S('cat', '#2a2a30', `
.k........k..... kak......kak.... kaak....kaak.... kaaakkkkaaak.... kaaaaaaaaaak.... kayakaaayakk.... kaaaaakaaaak.... .kaaawkwaak..... ..kaaaaaak...... ..kkkkkkkk......`);
S('bird', '#c8ccd4', `
.......kkk...... ......kaaak..... .....kaxaak.... .....kaaaoko... ......kaak...... ...kkkkaaak..... ..kaawwaaaak.... .kaawaaaaaabk... kkaaaaaaabbk.... ..kkbbbbbkk..... ....kk.kk.......`);
S('ghost', '#e8eeff', `
....kkkkkk...... ...kaaaaaak..... ..kaaaaaaaak.... ..kaxxaaxxak.... ..kaxxaaxxak.... ..kaaaaaaaak.... ..kaaakkaaak.... ..kaaakkaaak.... ..kaaaaaaaak.... ..kakaakaakak... ..kk.kk.kk.kk...`);
S('horns', '#d8302a', `
.k..........k... kak........kak.. kaak......kaak.. .kaak....kaak... ..kaakkkkaak.... ..kaaaaaaaak.... .kaaxaaaaxaak... .kaaaaaaaaaak... .kaakwkwkwaak... ..kaaaaaaaak.... ...kkkkkkkk.....`);
S('cry', '#f0c43a', `
...kkkkkkkk..... ..kaaaaaaaak.... .kaaaaaaaaaak... kaakkaaaakkaak.. kauuaaaaaauuak.. kauuaaaaaauuak.. kauaaaaaaaauak.. kauaakkkkaauak.. .kuaakaaakaauk.. ..kaaaaaaaak.... ...kkkkkkkk.....`);
S('lock', '#f0c43a', `
....kkkkk....... ...kGGGGGk...... ..kGk...kGk..... ..kGk...kGk..... .kkkkkkkkkkk.... .kaaaaaaaaak.... .kawaakkaabk.... .kaaaakkaabk.... .kaaaakkaabk.... .kbaaaaaabbk.... ..kkkkkkkkk.....`);
S('bell', '#f0c43a', `
......kk........ .....kaak....... ....kawaak...... ...kawaaaak..... ...kawaaaak..... ...kaaaaabk..... ..kaaaaaaabk.... .kaaaaaaaaabk... .kkkkkkkkkkkk... ......kk........`);
S('cherry', '#d8302a', `
........kk...... .......kqk...... ......kqk....... ....kkqkkk...... ...kq...kq...... ..kkkk.kkkk..... .kaawk.kawak.... .kaaak.kaaak.... .kbaak.kbaak.... ..kkk...kkk.....`);
S('lemon', '#f0e050', `
................ ....kkkkkk...... ..kkaaaaaakk.... .kaawaaaaaabk... kaawaaaaaaabbk.. .kaaaaaaaabbk... ..kkbbbbbbkk.... ....kkkkkk......`);
S('question', '#f0c43a', `
...kkkkkk....... ..kaaaaaak...... .kaak..kaak..... .kkk...kaak..... ......kaak...... .....kaak....... ....kaak........ ....kkkk........ ................ ....kaak........ ....kkkk........`);
S('arrow', '#f4f0e8', `
................ ........kk...... ........kak..... kkkkkkkkkaak.... kaaaaaaaaaaak... kkkkkkkkkaak.... ........kak..... ........kk......`);
S('box', '#8a5a32', `
..kkkkkkkkkkkk.. .kaaaaaaaaaaaak. .kawaaaaaaaaabk. .kkkkkkyykkkkkk. .kaaaaakykaaaak. .kaaaaaaaaaaabk. .kaaaaaaaaaaabk. .kbbbbbbbbbbbbk. ..kkkkkkkkkkkk..`);
S('cart', '#8a8a90', `
k............... kk.............. .kkkkkkkkkkkkk.. .kaaaaaaaaaaak.. .kakakakakakak.. ..kaaaaaaaaak... ..kakakakakak... ...kkkkkkkkk.... ....k.....k..... ...kHk...kHk.... ....k.....k.....`);
S('slots', '#d8302a', `
..kkkkkkkkkk.... .kaaaaaaaaaak... .kawwwwwwwwak.k. .kawkkwkkwwakk. .kawwwwwwwwak.k. .kaaaaaaaaaak... .kaayyyyyyaak... .kaaaaaaaaaak... .kbbbbbbbbbbk... ..kkkkkkkkkk....`);
S('orb', '#9a5ad0', `
....kkkkkk...... ..kkaaaaaakk.... .kaawwaaaaaak... .kawaaaaaaabk... .kaaaaaaaaabk... .kaaaaaaaabbk... ..kkbbbbbbkk.... ...kYYYYYYk..... ..kyyyyyyyyk.... ..kkkkkkkkkk....`);
S('shoe', '#f4f0e8', `
................ ................ ......kkkk...... .....kaaaak..... ....kaawaak..... ...kaawaaakk.... ..kaawaaaaaakk.. .kaaaaaaaaaaaak. .kddddddddddddk. ..kkkkkkkkkkkk..`, '#d8302a');
S('muscle', '#e2b49a', `
.....kkkk....... ....kaaaak...... ....kawaak...... ....kaaak....... ...kaaak.kkk.... ..kaawakkaaak... ..kawaaaaaaabk.. ..kaaaaaaaaabk.. ...kbaaaaaabk... ....kkkkkkkk....`);
S('scales', '#f0c43a', `
.......kk....... ......kaak...... ..kkkkkaakkkkk.. ..k....kk....k.. .kak...kk...kak. kaaak..kk..kaaak kkkkk..kk..kkkkk .......kk....... .....kkaakk..... ....kaaaaaak.... ....kkkkkkkk....`);
S('tower', '#8a8a90', `
.....k.k.k...... .....kkkkk...... .....kaaak...... .....kakak...... .....kaaak...... ....kaaaaak..... ....kakkkak..... ....kaaaaak..... ...kaaaaaaak.... ...kaaakaaak.... ..kkkkkkkkkkk...`);
S('map', '#e8d8b0', `
.kkkkkkkkkkkkk.. .kaaakaaaakaaak. .kaaakarakaaak. .kaarkaaakaaak. .kaaakaaakkaak. .kaaakkaaakaak. .kaaaakaaakaak. .kkkkkkkkkkkkk..`);
S('heartS', '#e8eeff', `
..kkk...kkk..... .kaawk.kaaak.... kaawwakaaaabk... kaawaaaaaaabk... kaaaaaaaaaabk... .kaaaaaaaabk.... ..kbaaaaabk..... ...kbaaabk...... ....kbabk....... .....kbk........ ......k.........`);
S('heartB', '#2a2a30', `
..kkk...kkk..... .kaaak.kaaak.... kaaaaakaaaabk... kaaaaaaaaaabk... kaaaaaaaaaabk... .kaaaaaaaabk.... ..kbaaaaabk..... ...kbaaabk...... ....kbabk....... .....kbk........ ......k.........`);
S('speed', '#5fb4ff', `
.......kkkk..... ......kaaaak.... .kkk..kaaak..... ...kkkaaak...... .kkk.kaaak...... .....kaaakkkk... ...kkkaaaaaaak.. .kkk.kbbbbbbbk.. .....kkkkkkkk...`);
S('clover', '#6fbf3a', `
....kkk.kkk..... ...kaaakaaak.... ...kawaaaaak.... ..kkkaaaaakkk... .kaaaaakaaaaak. .kawaaakaaaabk. ..kkkaaaaakkk... ...kaaaaaaak.... ...kaabkkbak.... ....kkk.kkkk.... .......kak...... ......kk........`);
S('planet', '#d8a050', `
................ .....kkkkk...... ...kkaaaaakk.... ..kaawaaaaabk... kkkaaaaaaaabbkkk kdddkkkkkkkkddek .kkkaaaaaaabbkk. ...kbaaaaabbk... ....kkbbbbkk.... ......kkkk......`, '#f0e0a0');
// ---------- głowy potworów i NPC (zamiast emoji) – strasznie ----------
S('h_kujon', '#e8dcc8', `
....kkkkkkkk.... ...kNNNNNNNNk... ..kNNNNNNNNNNk.. ..kNaaaaaaaaNk.. .kkkkkkkaakkkkkk .kxxxxkkkkxxxxk. .kxxrxkaakxrxxk. .kkxxkaaaakxxkk. ..kaaaaaaaaaabk. ..kaRaaaaaaaabk. ..kaRakkkkkaabk. ..kaaakwkwkaabk. ...kaaakkkaabk.. ....kkbbbbbkk... ......kkkk......`);
S('h_plujka', '#d8c8b0', `
....kkkkkkkk.... ...kNNNNNNNNk... ..kNNaaaaaaNNk.. ..kaaaaaaaaaabk. .kaakkaaaakkaabk .kakxxkaakxxkabk .kaakkaaaakkaabk .kaaaaaaaaaaaabk .kaaakkkkkkaaabk .kaakxxxxxxkaabk .kaakxwxxwxkaabk .kaakxxxxxxkaabk ..kaakxgxxkaabk. ...kkkkgkkkkkk.. ......kgk....... .......k........`);
S('h_dres', '#c8b8a8', `
....kkkkkkkk.... ...kHHHHHHHHk... ..kHGHHHHHHHHk.. ..kaaaaaaaaaabk. .kaaaaaaaaaaaabk .kakkkkaakkkkabk .kakxxkaakxxkabk .kaakkaaaakkaabk .kaaaaaSSaaaaabk .kakkkkkkkkkkabk .kakwkwkwkwkwabk .kakkkkkkkkkkabk ..kaaaaaaaaabk.. ...kRaaaaaabk... ....kkkkkkkk.....`);
S('h_spioch', '#b8c8d8', `
....kkkkkkkk.... ...kaaaaaaaaak.. ..kaaaaaaaaaaak. ..kaaaaaaaaaabk. .kaaaaaaaaaaaabk .kakxkxaakxkxabk .kaakxaaaakxaabk .kakxkxaakxkxabk .kaaaaaaaaaaaabk .kaaaaaSSaaaaabk .kaaaaaaaaaaaabk .kaaakkkkkkaaabk ..kaakxxxxkaabk. ...kaakkkkaabk.. ....kkbbbbkk.... ......kkkk......`);
S('h_teacher', '#e0d0b8', `
....kkkkkkkk.... ...kaaaaaaaaak.. ..kawaaaaaaaaak. ..kaaaaaaaaaabk. .kkkkkkaakkkkkkk .kxxxxkkkkxxxxk. .kxrrxkaakxrrxk. .kkkkkaaaakkkkk. .kaaaaaSSaaaaabk .kaaNNNNNNNNaabk .kaNNkkkkkkNNabk .kaakkwkwkkaaabk ..kaaaaaaaaabk.. ...kaaaaaaabk... ....kkkkkkkk.....`);
S('h_kanar', '#d8c8b0', `
...kkkkkkkkkk... ..kUUUUUUUUUUk.. .kUUUyyyyyUUUUk. .kkkkkkkkkkkkkk. .kxxxxxxxxxxxxk. ..kaaaaaaaaabk.. .kaakkaaaakkaabk .kakrrkaakrrkabk .kaakkaaaakkaabk .kaaaaaSSaaaaabk .kaaakkkkkkaaabk .kaakwwwwwwkaabk ..kaakkkkkkaabk. ...kaaaaaaabk... ....kkkkkkkk.....`);
S('h_heniek', '#e2b49a', `
....kkkkkkkk.... ...kaaaaaaaaak.. ..kawwaaaaaaaak. ..kaaaaaaaaaabk. .kaaaaaaaaaaaabk .kakkkaaaakkkabk .kakxykaakxykabk .kaakkaaaakkaabk .kaaaaaSSaaaaabk .kakkkkkkkkkkabk .kakwkwkwkwkwabk .kaakkkkkkkkaabk ..kaaaaaaaaabk.. ...kaaaaaaabk... ....kkkkkkkk.....`);
S('h_babcia', '#d8c0a8', `
....kkkkkkkk.... ..kkddddddddkk.. .kddddddddddddk. .kddaaaaaaaaddk. kdkaaaaaaaaaakdk kdkakkaaaakkakdk kdkakwkaakwkakdk kdkaaaaaaaaaakdk .kkaaaaSSaaaakk. ..kaaaaaaaaaak.. ..kakkkkkkkkak.. ..kaakxxxxkaak.. ...kaakkkkaak... ...kkddddddkk... ..kddkk..kkddk..`, '#4a2a3a');
// ikony statystyk (HUD)
S('st_spd', '#5fb4ff', `......kk.. .....kaak. ..kkkaak.. kk.kaak... ..kkaaakk. ...kaaaak. ..kbbbbbk. ..kkkkkk..`);
S('st_tears', '#5fb4ff', `...kk..... ..kaak.... ..kaak.... .kawaak... .kaaaak... .kaaabk... ..kbbk.... ...kk.....`);
S('st_dmg', '#d8302a', `k...k...k. .k.kak.k.. ..kaaak... .kaawaak.. kaaaaaaak. .kaaabak.. ..kabak... .k.kbk.k.. k...k...k.`);
S('st_range', '#f0c43a', `........kk .......kak ......kak. .....kak.. ....kak... ...kak.... ..kak..... .kak...... kk........`);
S('st_ss', '#c8c4bc', `.......... ..kkkk.... .kaaaak... .kawaak.kk .kaaaakkak .kaaaak.kk ..kkkk.... ..........`);
S('st_luck', '#6fbf3a', `.kk..kk... kaak.kaak. kaaakaaak. .kaaaaak.. kaaakaaak. kaak.kaak. .kk.kk.... ....kk....`);
S('st_clock', '#f0c43a', `..kkkkk... .kaaaaak.. kaaakaaak. kaaakaaak. kaaakkaak. kaaaaaaak. .kaaaaak.. ..kkkkk...`);


// ---------- update 3.0: kupa, puszki, listy, łazienka, zielsko, nowe głowy ----------
S('poop', '#7a4a22', `
.......kk....... ......kaak...... .....kaawk...... ....kkaaabk..... ...kaaakkbbk.... ..kaawaaaabbk... ..kaaaaaaaabk... .kkaaaaaaabbkk.. kaawaaaaaaaabbk. kaaaaaaaaaaabbk. kbaaaaaaaaabbbk. .kbbbbbbbbbbbk.. ..kkkkkkkkkkk...`);
S('dzik', '#7ad23a', `
...kkkkkkk.... ..kUuuuuuUk... ..kkkkkkkkk... ..kaaaaaaak... ..kawwkwwak... ..kawkwkwak... ..kawwkwwak... ..kaaaaaaak... ..kaawaaaak... ..kawaaaabk... ..kaaaaaabk... ..krrrrrrrk... ..kRRRRRRRk... ...kkkkkkk....`);
S('letter', '#d8302a', `
kkkkkkkkkkkkkkkk kaaaaaaaaaaaaaak kakaaaaaaaaaakak kaakaaaaaaaakaak kaaakaaaaaakaaak kaaaakaGGakaaaak kaaaaakGGkaaaaak kaaaaaakkaaaaaak kaaaaakaakaaaaak kaaaaaaaaaaaaaak kaaaaaaaaaaaaaak kkkkkkkkkkkkkkkk`);
S('toilet', '#f4f0e8', `
..kkkkkkkkkk.... ..kaaaaaaaak.... ..kawaaaaaak.... ..kaaaaaaaak.... ..kkkkkkkkkk.... .kkaaaaaaaakk... kaaaxxxxxxaaak.. kaaxxNNNNxxaak.. kaaxNNNNNNxaak.. .kaaxxxxxxaak... ..kkaaaaaakk.... ....kaaaak...... ....kaaaak...... ...kkkkkkkk.....`);
S('joint', '#f4f0e8', `
............kk.. ...........kok.. ..........kaRk.. .........kaak... ........kaak.... .......kaak..... ......kaak...... .....kaak....... ....kaak........ ...kgak......... ..kNNk.......... ..kkk...........`);
S('pipe', '#8a5a32', `
..kkkkk......... .kaaaaak........ .kaGGGak........ .kaaaaak........ ..kaaak......... ...kaaak........ ....kaaakkkkk... .....kaaaaaaak.. ......kkkkkkkk..`);
S('slipper', '#c84a7a', `
....kkkkkkkk.... ..kkaaaaaaaakk.. .kaawaaaaaaaabk. kaawaaaaaaaaabbk kaaaddddddddabbk kaaadwdwdwddabbk .kaaddddddddabk. ..kkaaaaaaaakk.. ....kkkkkkkk....`, '#f4f0e8');
S('car', '#5fb4ff', `
................ ....kkkkkkk..... ...kaawwwwak.... ..kaawkkkkwak... .kkaaaaaaaaakkk. kaawaaaaaaaaaabk kaaaaaaaaaaaaabk kbkkkbbbbbkkkbbk .kHHk.....kHHk.. ..kk.......kk...`);
S('rasta', '#d8302a', `
................ ......kkkk...... ....kkggggkk.... ...kggggggggk... ..kyyyyyyyyyyk.. ..kyyyyyyyyyyk.. .kaaaaaaaaaaaak. .kaaaaaaaaaaaak. kkkkkkkkkkkkkkkk`);
S('h_wozny', '#d8c0a0', `
....kkkkkkkk.... ...kGGGGGGGGk... ..kGGWGGGGGGGk.. ..kaaaaaaaaaabk. .kaaaaaaaaaaaabk .kakkkaaaakkkabk .kakxkaaaakxkabk .kaaaaaaaaaaaabk .kaaaaaSSaaaaabk .kaaHHHHHHHHaabk .kaHHkkkkkkHHabk .kaaaHHHHHHaaabk ..kaaaaaaaaabk.. ...kaaaaaaabk... ....kkkkkkkk.....`);
S('h_sekretarz', '#d8c8b8', `
....kkkkkkkk.... ...kWWWWWWWWk... ..kWWGWWWWWWWk.. ..kWWaaaaaaWWk.. .kaaaaaaaaaaaabk .kakkkaaaakkkkbk .kakxkaaaakxkabk .kaaaaaaaaaaaabk .kaaaaaSSaaaaabk .kaaaaSSSSaaaabk .kaakkkkkkkkaabk .kaaaaaaaaaaaabk ..kbaaaaaaaabk.. ..kkbbbbbbbbkk.. ...kkkkkkkkkk...`);
S('h_petent', '#c8b8a8', `
...kkkkkkkkkk... ..kHHHHHHHHHHk.. .kkkkkkkkkkkkkk. ..kaaaaaaaaabk.. .kaaaaaaaaaaaabk .kakxxaaaaxxkabk .kaaaaaaaaaaaabk .kaaaaaSSaaaaabk .kaaakkkkkkaaabk .kaaaaaaaaaaaabk ..kaaaaaaaaabk.. ...kbbbbbbbbk... ....kkkkkkkk....`);

// ---------- rysowanie: sprite → płótno w kolorach (pamięć podręczna) ----------
var SPRC = {};
function sprShade(hex, f) { var h = parseInt(hex.slice(1), 16), r = h >> 16 & 255, g = h >> 8 & 255, b = h & 255; if (f > 0) { r += (255 - r) * f; g += (255 - g) * f; b += (255 - b) * f; } else { r *= 1 + f; g *= 1 + f; b *= 1 + f; } return 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (b | 0) + ')'; }
function sprCanvas(name, col, col2) {
  var S0 = SPR[name]; if (!S0) return null; col = col || S0.col; col2 = col2 || S0.col2;
  var key = name + col + col2; if (SPRC[key]) return SPRC[key];
  var rows = S0.rows, h = rows.length, w = 0; rows.forEach(function (r) { w = Math.max(w, r.length); });
  var c = document.createElement('canvas'); c.width = w; c.height = h; var x = c.getContext('2d');
  var map = Object.assign({}, SPRPAL, { a: sprShade(col, .25), b: col, c: sprShade(col, -.4), d: col2, e: sprShade(col2, -.35) });
  // 'b' to kolor średni, 'a' jaśniejszy – rysujemy z cieniem: b jako baza, a jako światło
  map.a = sprShade(col, .12); map.b = sprShade(col, -.28);
  for (var y = 0; y < h; y++) for (var i = 0; i < rows[y].length; i++) { var ch = rows[y][i], cc = map[ch]; if (!cc) continue; x.fillStyle = cc; x.fillRect(i, y, 1, 1); }
  c.sw = w; c.sh = h; SPRC[key] = c; return c;
}
// rysuje sprite tak, by jego piksele były całkowitą wielokrotnością pikseli ekranu (ostro)
function drawSpr(name, cx, cy, size, col, col2, alpha, rot) {
  var c = sprCanvas(name, col, col2); if (!c) return false;
  var m = X.getTransform(), ds = Math.hypot(m.a, m.b) || 1, dev = size * ds, kk = dev / Math.max(c.sw, c.sh), k = kk < 1.25 ? 1 : kk < 1.75 ? 1.5 : Math.round(kk), w = c.sw * k / ds, h = c.sh * k / ds;
  if (alpha != null || rot) { X.save(); if (alpha != null) X.globalAlpha *= alpha; X.translate(cx, cy); if (rot) X.rotate(rot); X.drawImage(c, -w / 2, -h / 2, w, h); X.restore(); }
  else X.drawImage(c, cx - w / 2, cy - h / 2, w, h);
  return true;
}
// mały obrazek do HTML (menu, kolekcja)
var SPRURL = {};
function sprImg(name, col, col2, px) {
  var c = sprCanvas(name, col, col2); if (!c) return '';
  var key = name + col + col2; if (!SPRURL[key]) SPRURL[key] = c.toDataURL();
  px = px || 32; return '<img class="pxi" src="' + SPRURL[key] + '" style="width:' + px + 'px;height:' + Math.round(px * c.sh / c.sw) + 'px" alt="">';
}

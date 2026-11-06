// ---- 05_data.js ----
// ===================== DANE: postacie, przedmioty, karty, puszki, drobiazgi, wrogowie, piętra =====================
var CHARS = {
  ignaczak: { n: 'Szymon Ignaczak', face: 'ignaczak', d: 'Płacze, żeby walczyć. Zwykłe łzy, zwykły chłopak, niezwykłe koszmary.', look: { shirt: '#7fb2e5', pants: '#2b2b33', shoes: '#f5f5f5', hair: '#6b5640', skin: '#e2b49a' },
    cont: 6, red: 6, soul: 0, black: 0, coins: 0, bombs: 1, keys: 0, active: 'szloch', items: [], tear: 'tear', st: {} },
  prac: { n: 'Pracownik', face: 'prac', d: 'Ogrodniczki, mleko i kredyty. Trafiony wróg spłaca raty.', look: { shirt: '#3a3a40', pants: '#3e5f8f', overalls: '#3e5f8f', shoes: '#e8e8e8', hair: '#5a4632', skin: '#e2a896' },
    cont: 8, red: 8, soul: 0, black: 0, coins: 5, bombs: 1, keys: 1, active: 'wiadro', items: [], tear: 'credit', st: { spd: -.1, tears: -.15 }, perk: 'credit', lock: 'freddy' },
  luz: { n: 'Luźny', face: 'luz', curly: 1, d: 'Zero stresu. Zamiast łez wypuszcza gołębie, które same szukają celu.', look: { shirt: '#f2f0ea', pants: '#2b2b33', shoes: '#f5f5f5', hair: '#2a1a12', skin: '#d49a7c' },
    cont: 6, red: 6, soul: 0, black: 0, coins: 0, bombs: 1, keys: 0, active: 'hipnoza', items: [], tear: 'pigeon', st: { spd: .25, dmgMult: .85, tears: .3 }, perk: 'homing', lock: 'sigeon' },
  kuzyn: { n: 'Kuzyn', face: 'kuzyn', d: 'Menel spod monopolowego. Mało zdrowia, ciężka ręka, butelki zamiast łez.', look: { shirt: '#16181c', jacket: '#16181c', pants: '#d8d6d0', shoes: '#e8e8e8', hair: '#3a2a1e', skin: '#e2b49a' },
    cont: 4, red: 4, soul: 0, black: 2, coins: 3, bombs: 1, keys: 0, active: 'zubr', items: [], tear: 'bottle', st: { dmgMult: 1.35, spd: -.05, tears: -.1 }, lock: 'simi' },
  bajtek: { n: 'Bajtek', face: 'bajtek', d: 'Zawsze wyluzowany. Tylko serca z łez, wolne chmurki przenikają wszystko i ogłupiają wrogów.', look: { shirt: '#a48aae', pants: '#2f3542', shoes: '#eeeeee', hair: '#9a7a58', skin: '#e8b49a' },
    cont: 0, red: 0, soul: 6, black: 0, coins: 0, bombs: 1, keys: 0, active: 'chill', items: [], tear: 'smoke', st: { dmgMult: 1.05, tears: -.25, range: 2, ss: -.2 }, perk: 'soulOnly', lock: 'scary' }
};
var CHARORDER = ['ignaczak', 'prac', 'luz', 'kuzyn', 'bajtek'];
// pule: tre (skarbiec), shop, boss, devil, angel, secret
// st: spd, tears, dmg, range, ss, luck, tearsMult, dmgMult, dmgFlat, tearsFlat | hp: cont, heal, soul, black | pick: coins, bombs, keys | fl: flagi
var ITEMS = {
  // ---------- statystyki ----------
  cebula: { n: 'Cebula', e: '🧅', q: 1, pool: ['tre', 'shop'], d: 'Łzy w górę — płaczesz częściej', st: { tears: .7 } },
  eliksir: { n: 'Eliksir łez', e: '🧪', q: 2, pool: ['tre', 'angel'], d: 'Łzy w górę ++', st: { tears: 1.2 } },
  energetyk: { n: 'Energetyk XXL', e: '🥤', q: 2, pool: ['tre', 'shop'], d: 'Szybkość i łzy w górę', st: { spd: .3, tears: .4 } },
  kawa: { n: 'Kubek kawy', e: '☕', q: 1, pool: ['tre', 'shop'], d: 'Łzy i szybkość w górę', st: { tears: .5, spd: .1 } },
  band: { n: 'Opaska Rambo', e: '🎗️', q: 1, pool: ['tre', 'boss'], d: 'Obrażenia w górę', st: { dmg: 1 } },
  puszkazubra: { n: 'Puszka Żubra', e: '🍺', q: 1, pool: ['tre', 'shop', 'devil'], d: 'Obrażenia w górę, szybkość w dół', st: { dmg: 1.1, spd: -.1 }, tags: ['menel'] },
  bejsbol: { n: 'Kij bejsbolowy', e: '🏏', q: 2, pool: ['tre', 'devil'], d: 'Obrażenia ++, łzy wolniej, mocny odrzut', st: { dmg: 1.6, tears: -.3 }, fl: { knock: 1 } },
  kamien: { n: 'Kamień z rynku', e: '🪨', q: 2, pool: ['tre'], d: 'Wielkie łzy: obrażenia ++, łzy w dół', st: { dmg: 1.4, tears: -.4 }, fl: { big: 1 } },
  proca: { n: 'Proca z gumki od majtek', e: '🪀', q: 1, pool: ['tre'], d: 'Szybkość łez i obrażenia w górę', st: { ss: .4, dmg: .4 } },
  linijka: { n: 'Linijka metalowa', e: '📏', q: 1, pool: ['tre'], d: 'Zasięg ++ i szybkość łez w górę', st: { range: 2.5, ss: .2 }, tags: ['kujon'] },
  chipsy: { n: 'Chipsy paprykowe', e: '🍟', q: 1, pool: ['tre', 'shop', 'boss'], d: 'Zasięg i szybkość w górę', st: { range: 1.5, spd: .15 } },
  kaptur: { n: 'Kaptur łucznika', e: '🏹', q: 1, pool: ['tre'], d: 'Zasięg i łzy w górę', st: { range: 1.5, tears: .3 } },
  cap: { n: 'Czapka z daszkiem', e: '🧢', q: 1, pool: ['tre', 'shop'], d: 'Szczęście w górę', st: { luck: 1, ss: .16 } },
  kalkulator: { n: 'Kalkulator', e: '🧮', q: 2, pool: ['tre', 'shop'], d: 'Wszystkie statystyki trochę w górę', st: { dmg: .3, tears: .2, spd: .05, range: .5, ss: .05, luck: .5 }, tags: ['kujon'] },
  bilet: { n: 'Bilet miesięczny', e: '🎫', q: 2, pool: ['boss'], d: 'Szybkość ++ — jeździsz na gapę', st: { spd: .35 } },
  laurel: { n: 'Wieniec laurowy', e: '🌿', q: 3, pool: ['angel'], d: 'Wszystko w górę', st: { dmg: .7, tears: .4, spd: .15, range: 1, luck: 1 }, tags: ['grek'] },
  aureola: { n: 'Aureola z Olimpu', e: '😇', q: 3, pool: ['angel'], d: 'Wszystko w górę + zdrowie', st: { dmg: .3, tears: .2, spd: .1, range: .5 }, hp: { cont: 2, heal: 2 }, tags: ['grek'] },
  miecz: { n: 'Ksiphos z Olimpu', e: '🗡️', q: 4, pool: ['angel', 'devil'], d: 'Obrażenia ×1,5 i +1', st: { dmgMult: 1.5, dmg: 1 }, tags: ['grek'] },
  rogi: { n: 'Rogi Scary’ego', e: '😈', q: 3, pool: ['devil'], d: 'Obrażenia w górę ++', st: { dmg: 1.5 } },
  noz: { n: 'Nóż kebabiarza', e: '🔪', q: 3, pool: ['devil', 'tre'], d: 'Łzy tną: obrażenia ×1,3 i przebijanie', st: { dmgMult: 1.3 }, fl: { pierce: 1 } },
  kot: { n: 'Czarny kot', e: '🐈‍⬛', q: 2, pool: ['devil'], d: 'Obrażenia w górę + czarne serce', st: { dmg: .7 }, hp: { black: 2 } },
  umowa: { n: 'Umowa z lombardu', e: '🤵', q: 3, pool: ['devil'], d: 'Obrażenia +2… za całą twoją kasę', st: { dmg: 2 }, fl: { pawn: 1 } },
  // ---------- zdrowie ----------
  drozdzowka: { n: 'Drożdżówka', e: '🥐', q: 1, pool: ['tre', 'boss', 'shop'], d: 'Zdrowie w górę', hp: { cont: 2, heal: 2 } },
  pizza: { n: 'Pizza z budki', e: '🍕', q: 1, pool: ['boss', 'shop'], d: 'Zdrowie w górę', hp: { cont: 2, heal: 2 } },
  paczek: { n: 'Pączek z różą', e: '🍩', q: 1, pool: ['boss', 'shop'], d: 'Zdrowie w górę', hp: { cont: 2, heal: 2 } },
  kebab: { n: 'Kebab z rynku', e: '🌯', q: 2, pool: ['boss', 'tre'], d: 'Zdrowie w górę + pełne leczenie', hp: { cont: 2, heal: 99 }, tags: ['menel'] },
  rosol: { n: 'Rosół babci', e: '🍜', q: 2, pool: ['boss', 'angel'], d: 'Zdrowie ++ i pełne leczenie', hp: { cont: 4, heal: 99 } },
  happymeal: { n: 'Happy Meal', e: '🍔', q: 3, pool: ['boss', 'angel'], d: 'HAPPY MEAL WZMACNIA — wszystko w górę', st: { dmg: .5, tears: .3, spd: .1, range: 1, luck: 1 }, hp: { cont: 2, heal: 99 }, tags: ['grek'] },
  beerhat: { n: 'Kask z Żubrami', e: '⛑️', q: 2, pool: ['tre', 'boss'], d: 'Zdrowie i obrażenia w górę', hp: { cont: 2, heal: 2 }, st: { dmg: .3 }, tags: ['menel'] },
  mustache: { n: 'Wąs Janusza', e: '🥸', q: 1, pool: ['shop', 'boss'], d: 'Zdrowie i szczęście w górę', hp: { cont: 2, heal: 2 }, st: { luck: 1 } },
  kurtka: { n: 'Kurtka puchowa', e: '🧥', q: 2, pool: ['tre', 'boss'], d: 'Zdrowie w górę + serce z łez', hp: { cont: 2, heal: 2, soul: 2 } },
  bluza: { n: 'Bluza z kapturem', e: '👕', q: 1, pool: ['tre', 'shop'], d: '+2 serca z łez', hp: { soul: 4 } },
  amulet: { n: 'Amulet z kapsla', e: '🧿', q: 2, pool: ['tre', 'angel'], d: 'Szczęście ++ i serce z łez', st: { luck: 2 }, hp: { soul: 2 } },
  plecak: { n: 'Plecak szkolny', e: '🎒', q: 2, pool: ['tre', 'shop'], d: 'Zdrowie w górę, serca leczą podwójnie', hp: { cont: 2 }, fl: { bow: 1 }, tags: ['kujon'] },
  // ---------- łzy ----------
  mleko: { n: 'Mleko gołębie', e: '🥛', q: 2, pool: ['tre'], d: 'Grad mlecznych łez — szybkie, ale słabe', st: { tearsMult: 4, dmgMult: .25 }, fl: { milk: 1 }, tags: ['golab'] },
  olowek: { n: 'Zaostrzony ołówek', e: '✏️', q: 2, pool: ['tre'], d: 'Łzy przebijają wrogów', st: { dmg: .2 }, fl: { pierce: 1 }, tags: ['kujon'] },
  kusza: { n: 'Kusza dziadka', e: '🎯', q: 3, pool: ['tre', 'devil'], d: 'Przebijające bełty, obrażenia i szybkość łez', st: { dmg: .7, ss: .5 }, fl: { pierce: 1 } },
  pioro: { n: 'Pióro Sigeon Pexa', e: '🪶', q: 2, pool: ['tre', 'angel'], d: 'Łzy przelatują przez przeszkody, szybkość w górę', st: { spd: .2 }, fl: { spectral: 1 }, tags: ['golab'] },
  wskaznik: { n: 'Wskaźnik do tablicy', e: '🦯', q: 2, pool: ['tre'], d: 'Łzy naprowadzane na wrogów', fl: { homing: 1 }, tags: ['kujon'] },
  artemida: { n: 'Łuk Artemidy', e: '🌙', q: 3, pool: ['tre', 'angel'], d: 'Potrójny strzał', fl: { triple: 1 }, tags: ['grek'] },
  kolczan: { n: 'Kołczan z tuby po chipsach', e: '🥫', q: 3, pool: ['tre'], d: 'Podwójny strzał', fl: { double: 1 } },
  lizak: { n: 'Lodowy lizak', e: '🍭', q: 2, pool: ['tre'], d: 'Lodowe łzy spowalniają (szansa)', fl: { ice: 1 } },
  rozen: { n: 'Różdżka z rożna', e: '🔥', q: 2, pool: ['tre', 'devil'], d: 'Ogniste łzy podpalają (szansa)', fl: { fire: 1 } },
  cebulakij: { n: 'Cebula na patyku', e: '🍢', q: 2, pool: ['tre'], d: 'Wrogowie płaczą i uciekają (szansa)', fl: { fear: 1 } },
  batuta: { n: 'Batuta dyrygenta', e: '🎼', q: 2, pool: ['tre', 'shop'], d: 'Łzy-nuty ogłuszają (szansa), łzy w górę', st: { tears: .4 }, fl: { stun: 1 } },
  berlo: { n: 'Berło Zeusa', e: '⚡', q: 3, pool: ['angel'], d: 'Łzy przeskakują piorunem na innych wrogów', fl: { chain: 1 }, tags: ['grek'] },
  piorun: { n: 'Łańcuch piorunów', e: '🌩️', q: 3, pool: ['tre', 'devil'], d: 'Strzelasz laserem zamiast łez', fl: { laser: 1 } },
  wzrok: { n: 'Spojrzenie Scary’ego', e: '👁️', q: 4, pool: ['devil'], d: 'Przytrzymaj strzał: gruby laser przez cały pokój', fl: { brim: 1 } },
  patyk: { n: 'Różdżka z bazaru', e: '🪄', q: 2, pool: ['tre', 'shop'], d: 'Każda łza ma losową moc', fl: { random: 1 } },
  dlugopis: { n: 'Długopis 4 kolory', e: '🖊️', q: 2, pool: ['tre'], d: 'Łzy: ogień, lód, trucizna i prąd po kolei', fl: { pen4: 1 }, tags: ['kujon'] },
  lustro: { n: 'Lusterko', e: '🪞', q: 2, pool: ['tre'], d: 'Łzy odbijają się od ścian', fl: { bounce: 1 } },
  mop: { n: 'Kij od mopa', e: '🧹', q: 1, pool: ['tre', 'shop'], d: 'Łzy mocno odpychają, zasięg w górę', st: { range: 1.5 }, fl: { knock: 1 } },
  trucizna: { n: 'Kanapka z szatni', e: '🥪', q: 2, pool: ['tre', 'devil'], d: 'Łzy trują wrogów (szansa)', fl: { poison: 1 } },
  // ---------- pomocnicy ----------
  bulka: { n: 'Bułka', e: '🍞', q: 2, pool: ['tre', 'shop'], d: 'Gołąb-pomocnik strzela razem z tobą', fl: { famPigeon: 1 }, tags: ['golab'] },
  crown: { n: 'Korona króla gołębi', e: '👑', q: 3, pool: ['boss'], d: 'Trzy gołębie krążą i blokują pociski', fl: { orbit: 3 }, tags: ['golab'] },
  jajo: { n: 'Gołębie jajo', e: '🥚', q: 2, pool: ['tre'], d: 'Po każdym pokoju klują się bojowe gołębie', fl: { eggs: 1 }, tags: ['golab'] },
  mis: { n: 'Pluszowy miś', e: '🧸', q: 2, pool: ['tre', 'angel'], d: 'Miś przyjmuje jeden cios na każde piętro', fl: { bear: 1 } },
  kumpel: { n: 'Zdjęcie z kumplem', e: '🤳', q: 2, pool: ['tre', 'shop'], d: 'Mały Luźny chodzi za tobą i strzela', fl: { famBuddy: 1 } },
  // ---------- ruch i obrona ----------
  skrzydla: { n: 'Skrzydła gołębia', e: '🪽', q: 3, pool: ['angel', 'tre'], d: 'Latanie!', st: { spd: .2 }, fl: { fly: 1 }, tags: ['golab'] },
  toga: { n: 'Toga grecka', e: '🏛️', q: 4, pool: ['angel'], d: 'Pierwszy cios w każdym pokoju nie boli', fl: { mantle: 1 }, tags: ['grek'] },
  kamizelka: { n: 'Kamizelka odblaskowa', e: '🦺', q: 1, pool: ['shop', 'tre'], d: 'Dłuższa nietykalność po ciosie + serce z łez', hp: { soul: 2 }, fl: { iframes: 1 } },
  peleryna: { n: 'Peleryna z firanki', e: '🧣', q: 2, pool: ['tre'], d: 'Czasem unikasz ciosu', fl: { dodge: 1 } },
  kalosze: { n: 'Kalosze', e: '👢', q: 1, pool: ['tre', 'shop'], d: 'Odporność na kałuże i pinezki', fl: { boots: 1 } },
  sluchawki: { n: 'Słuchawki', e: '🎧', q: 1, pool: ['tre', 'shop'], d: 'Nie zasypiasz i się nie boisz', st: { ss: .2 }, fl: { calm: 1 } },
  gaz: { n: 'Gaz pieprzowy', e: '🌶️', q: 2, pool: ['tre'], d: 'Po ciosie: chmura gazu truje wrogów', fl: { hurtGas: 1 } },
  fala: { n: 'Fala łez', e: '🌊', q: 2, pool: ['tre'], d: 'Po ciosie: 10 łez dookoła', fl: { hurtRing: 1 } },
  czaszka: { n: 'Czaszka z biologii', e: '💀', q: 2, pool: ['devil', 'tre'], d: 'Pokonani wrogowie wybuchają', fl: { bodyBoom: 1 } },
  zegarek: { n: 'Zegarek z bazaru', e: '⌚', q: 2, pool: ['tre', 'shop'], d: 'Wrogowie są wolniejsi', fl: { slowAll: 1 } },
  // ---------- mapa, znajdźki, sklep ----------
  okulary: { n: 'Okulary pilotki', e: '🕶️', q: 2, pool: ['shop', 'tre'], d: 'Widzisz całe piętro', fl: { map: 1 } },
  latarka: { n: 'Latarka', e: '🔦', q: 1, pool: ['tre', 'shop'], d: 'Widzisz tajne pokoje i ciemność ci nie straszna', fl: { secretMap: 1, light: 1 } },
  lista: { n: 'Strona listy Top 5', e: '📜', q: 1, pool: ['tre', 'shop', 'boss'], d: 'Widzisz bossa i skarbiec na mapie', fl: { compass: 1 } },
  sciaga: { n: 'Ściąga', e: '📃', q: 1, pool: ['shop', 'tre'], d: 'Znasz działanie wszystkich puszek', fl: { phd: 1 }, tags: ['kujon'] },
  magnes: { n: 'Magnes z lodówki', e: '🧲', q: 1, pool: ['tre', 'shop'], d: 'Znajdźki lecą do ciebie', fl: { magnet: 1 } },
  skarbonka: { n: 'Skarbonka', e: '🐷', q: 1, pool: ['tre', 'shop'], d: '+10 zł, a po ciosie wypadają złotówki', pick: { coins: 10 }, fl: { piggy: 1 } },
  petardy: { n: 'Petardy z bazaru', e: '🧨', q: 2, pool: ['tre', 'shop', 'devil'], d: '+5 petard, potężniejsze wybuchy', pick: { bombs: 5 }, fl: { megaBomb: 1 } },
  klucze: { n: 'Pęk kluczy woźnego', e: '🗝️', q: 3, pool: ['secret', 'shop'], d: '+99 kluczy', pick: { keys: 99 } },
  dres: { n: 'Dres z trzema paskami', e: '🥋', q: 2, pool: ['shop', 'tre'], d: 'Szacunek na dzielni: ceny −50%', st: { spd: .1 }, fl: { sale: 1 } },
  chain: { n: 'Złoty łańcuch', e: '📿', q: 2, pool: ['shop', 'devil'], d: 'Im więcej kasy, tym mocniej bijesz', fl: { money: 1 } },
  lopata: { n: 'Łopata woźnego', e: '🪏', q: 2, pool: ['tre', 'secret'], d: 'Odkopujesz znajdźki po pokojach, obrażenia +', st: { dmg: .5 }, fl: { dig: 1 } },
  tiara: { n: 'Spiczasty kapelusz', e: '🎩', q: 2, pool: ['tre', 'shop'], d: 'Przedmioty aktywne ładują się szybciej', fl: { volt: 1 } },
  // ---------- aktywne ----------
  szloch: { n: 'Szloch', e: '😭', q: 1, pool: ['tre'], d: 'Wybuch płaczu: pierścień wielkich łez', act: 3 },
  wiadro: { n: 'Wiadro mleka', e: '🪣', q: 1, pool: [], d: 'Chlust mleka: obrażenia i spowolnienie', act: 2, lock: 'win_prac' },
  hipnoza: { n: 'Hipnoza 67', e: '🫴', q: 2, pool: [], d: 'Gest 6-7: wrogowie stoją w miejscu', act: 3, lock: 'win_luz' },
  zubr: { n: 'Żubr', e: '🦬', q: 2, pool: [], d: 'Obrażenia +2 w tym pokoju', act: 3, tags: ['menel'], lock: 'win_kuzyn' },
  chill: { n: 'Chillout', e: '🌀', q: 2, pool: [], d: 'Wszystko zwalnia na kilka sekund', act: 3, lock: 'win_bajtek' },
  helo: { n: 'Helo guys', e: '👋', q: 2, pool: ['tre', 'shop'], d: 'Krzyk ogłusza wszystkich wrogów', act: 2, lock: 'freddy' },
  sigeon: { n: 'Sigeon Pex', e: '🕊️', q: 3, pool: ['tre', 'angel'], d: 'Wypuszczasz stado naprowadzanych gołębi', act: 3, tags: ['golab'], lock: 'sigeon' },
  simi: { n: 'Simi simi', e: '😴', q: 3, pool: ['tre', 'shop'], d: 'Usypiasz wszystkich wrogów', act: 4, lock: 'simi' },
  scary: { n: 'Scary face', e: '😱', q: 3, pool: ['tre', 'devil'], d: 'Wrogowie uciekają w panice i słabną', act: 3, lock: 'scary' },
  numbero: { n: 'Numbero 1', e: '🥇', q: 4, pool: ['angel', 'secret'], d: 'Złoty wybuch: 100 obrażeń każdemu wrogowi', act: 6, lock: 'greek' },
  kostka: { n: 'Kostka do Chińczyka', e: '🎲', q: 4, pool: ['secret', 'shop'], d: 'Przelosuj przedmioty w pokoju', act: 6, lock: 'win_ignaczak' },
  poza: { n: 'Greek poza', e: '🗿', q: 3, pool: ['angel'], d: 'Nietykalny i ×1,5 obrażeń przez 6 s', act: 4, tags: ['grek'] },
  telefon: { n: 'Telefon dyrektora', e: '📱', q: 2, pool: ['tre', 'shop'], d: '47 nieodebranych: 47 obrażeń każdemu wrogowi', act: 4 },
  paw: { n: 'Paw', e: '🤮', q: 2, pool: ['tre', 'devil'], d: 'Strumień rzygów i żrąca kałuża', act: 3, tags: ['menel'] },
  tarcza: { n: 'Tarcza z łez', e: '🛡️', q: 2, pool: ['tre', 'angel'], d: 'Tarcza na 7 sekund', act: 3 },
  skok: { n: 'Skok w bok', e: '✨', q: 1, pool: ['tre', 'shop'], d: 'Teleport do losowego pokoju', act: 2 },
  deszcz: { n: 'Deszcz Żubrów', e: '🍻', q: 2, pool: ['tre', 'devil'], d: 'Puszki spadają z nieba na wrogów', act: 3, tags: ['menel'] },
  meteor: { n: 'Meteor Numbero', e: '☄️', q: 3, pool: ['devil', 'secret'], d: 'Ogromny wybuch na najsilniejszym wrogu', act: 5 },
  oklad: { n: 'Okład z cebuli', e: '💚', q: 2, pool: ['angel', 'shop'], d: 'Leczy całe serce', act: 4 },
  gasnica: { n: 'Gaśnica', e: '🧯', q: 2, pool: ['tre', 'shop'], d: 'Mroźna chmura zamraża wrogów przed tobą', act: 2 },
  zdrapka: { n: 'Zdrapka', e: '🎟️', q: 1, pool: ['shop', 'tre'], d: 'Może wygrasz, może nie', act: 1 },
  smrod: { n: 'Smród z szatni', e: '☠️', q: 1, pool: ['tre', 'devil'], d: 'Trujący bąk wokół ciebie', act: 1 }
};
var TRANS = {
  golab: { n: 'Gołębiarz', d: 'Latasz, a pokonani wrogowie zamieniają się w gołębie', e: '🕊️' },
  grek: { n: 'Grek', d: 'Marmurowa skóra: +3 serca z łez i latanie', e: '🏛️' },
  menel: { n: 'Menel', d: 'Obrażenia w górę, czarne serce, butelki zamiast łez', e: '🍺' },
  kujon: { n: 'Kujon', d: 'Czasem wystrzeliwujesz dodatkową łzę', e: '🤓' }
};
// ---------- karty (Q) ----------
var CARDS = {
  wagary: { n: 'Wagary', d: 'Wracasz do pierwszego pokoju', s: '🏃' },
  dyrektor: { n: 'Wezwanie do dyrektora', d: 'Teleport do pokoju bossa', s: '👔' },
  sklep: { n: 'Karta stałego klienta', d: 'Teleport do sklepu', s: '🛒' },
  skarb: { n: 'Mapa skarbu', d: 'Teleport do skarbca', s: '⭐' },
  plan: { n: 'Plan lekcji', d: 'Odkrywasz całe piętro', s: '🗺️' },
  sila: { n: 'Siła Pudziana', d: 'Obrażenia ×1,5 w tym pokoju i pełne serce', s: '💪' },
  sprawiedliwosc: { n: 'Sprawiedliwość', d: 'Złotówka, klucz, petarda i serce', s: '⚖️' },
  wieza: { n: 'Wieża', d: 'Petardy spadają wokół', s: '🗼' },
  slonce: { n: 'Słońce', d: 'Pełne zdrowie, mapa i 100 obrażeń wrogom', s: '☀️' },
  ksiezyc: { n: 'Księżyc', d: 'Teleport do skrytki', s: '🌙' },
  kochankowie: { n: 'Kochankowie', d: 'Dwa serca', s: '💞' },
  smierc: { n: 'Śmierć', d: '40 obrażeń każdemu wrogowi', s: '💀' },
  joker: { n: 'Joker', d: 'Teleport do Piwnicy Scary’ego albo Świątyni Greka', s: '🃏' },
  kier2: { n: '2 Kier', d: 'Podwaja twoje czerwone serca', s: '♥' },
  trefl2: { n: '2 Trefl', d: 'Podwaja petardy', s: '♣' },
  pik2: { n: '2 Pik', d: 'Podwaja klucze', s: '♠' },
  karo2: { n: '2 Karo', d: 'Podwaja złotówki', s: '♦' }
};
// ---------- puszki (nieznane do pierwszego wypicia) ----------
var PILLS = {
  zdrowie: { n: 'Pełne zdrowie', good: 1, w: 1 }, hpup: { n: 'Zdrowie w górę', good: 1, w: .4 }, hpdown: { n: 'Zdrowie w dół', good: 0, w: .5 },
  tearsup: { n: 'Łzy w górę', good: 1, w: 1 }, tearsdown: { n: 'Łzy w dół', good: 0, w: 1 },
  spdup: { n: 'Szybkość w górę', good: 1, w: 1 }, spddown: { n: 'Szybkość w dół', good: 0, w: 1 },
  rangeup: { n: 'Zasięg w górę', good: 1, w: 1 }, rangedown: { n: 'Zasięg w dół', good: 0, w: 1 },
  luckup: { n: 'Szczęście w górę', good: 1, w: 1 }, luckdown: { n: 'Szczęście w dół', good: 0, w: 1 },
  stal: { n: 'Stalowe nerwy', good: 1, w: .8 }, zatrucie: { n: 'Zatrucie', good: 0, w: .8 },
  bak: { n: 'Bąk', good: 1, w: 1 }, widze: { n: 'Widzę wszystko!', good: 1, w: .8 }, boom: { n: 'Wybuchowa niestrawność', good: 0, w: .7 },
  energia: { n: '48 godzin energii', good: 1, w: .8 }, tele: { n: 'Telepuszka', good: 1, w: .8 }, paraliz: { n: 'Paraliż', good: 0, w: .7 },
  paw: { n: 'Paw', good: 1, w: .8 }, zamula: { n: 'Zamuła — wszyscy zwalniają', good: 1, w: .8 }, jazda: { n: 'Ale jazda! — wrogowie przyspieszają', good: 0, w: .7 },
  gdzie: { n: 'Gdzie ja jestem?', good: 0, w: .6 }, golebie: { n: 'Gołębie przyjaciółki', good: 1, w: .6 }
};
// ---------- drobiazgi ----------
var TRINKETS = {
  kapsel: { n: 'Kapsel od Żubra', e: '🔘', d: 'Szczęście +1' },
  gumka: { n: 'Gumka recepturka', e: '➰', d: 'Łzy w górę' },
  pinezka: { n: 'Pinezka', e: '📌', d: 'Łzy czasem przebijają' },
  zab: { n: 'Ząb mleczny', e: '🦷', d: 'Łzy czasem zamrażają' },
  grosz: { n: 'Szczęśliwy grosz', e: '🪙', d: 'Więcej złotówek po pokojach' },
  spinacz: { n: 'Spinacz', e: '📎', d: 'Klucz czasem po pokoju' },
  zakladka: { n: 'Zakładka', e: '🔖', d: 'Zasięg w górę' },
  nakretka: { n: 'Nakrętka', e: '🔩', d: 'Szybkość w górę' },
  lisc: { n: 'Liść laurowy', e: '🍂', d: 'Obrażenia w górę' },
  paragon: { n: 'Paragon', e: '🧾', d: 'W sklepie taniej o 2 zł' },
  bateria: { n: 'Bateria AA', e: '🔋', d: 'Przedmiot aktywny ładuje się czasem podwójnie' },
  kreda: { n: 'Kreda', e: '🖍️', d: 'Wrogowie czasem się boją' }
};
// ---------- czempioni ----------
var CHAMPS = { red: { n: 'czerwony', col: '#ff3a2a', hp: 2 }, yellow: { n: 'żółty', col: '#ffd83a', hp: 1.2, spd: 1.35 }, blue: { n: 'niebieski', col: '#3a9aff', hp: 1.3 }, black: { n: 'czarny', col: '#2a2a3a', hp: 1.6, dmg: 1 } };
// ---------- wrogowie ----------
var MOBS = {
  golab: { n: 'Gołąb', art: 'bird', o: { col: '#8f98a3' }, hp: 6, spd: 62, r: 10, ai: 'fly', fly: 1 },
  golabm: { n: 'Gołąb mleczny', art: 'bird', o: { col: '#f4f4f0', wing: '#d8d8d0', neck: false, eye: '#3a3a3a' }, hp: 11, spd: 55, r: 10, ai: 'flyShoot', fly: 1, shot: { kind: 'milk', cd: 2.4, spd: 150 } },
  kartkowka: { n: 'Kartkówka', art: 'paper', hp: 9, spd: 105, r: 10, ai: 'bounce', fly: 1 },
  kujon: { n: 'Kujon', art: 'human', o: { emoji: '🤓', look: { shirt: '#3a6ea5', pants: '#2b2b33', shoes: '#e8e8e8', hair: '#4a3a2a' } }, hp: 12, spd: 58, r: 11, ai: 'walk' },
  plujka: { n: 'Plujka', art: 'human', o: { emoji: '😝', look: { shirt: '#d8a03a', pants: '#3a3a4a', shoes: '#f0f0f0', hair: '#7a5a3a' } }, hp: 13, spd: 50, r: 11, ai: 'walkShoot', shot: { kind: 'enemy', cd: 2.4, spd: 175 } },
  karaluch: { n: 'Karaluch', art: 'bug', hp: 5, spd: 125, r: 9, ai: 'run' },
  cebula: { n: 'Zła Cebula', art: 'onion', hp: 16, spd: 20, r: 12, ai: 'turret', shot: { kind: 'enemy', cd: 2.8, spd: 150, n: 4 } },
  dres: { n: 'Dresiarz', art: 'human', o: { emoji: '😤', look: { shirt: '#121214', pants: '#121214', stripes: 1, shoes: '#f0f0f0', hair: '#1a1a1a' } }, hp: 22, spd: 55, r: 12, ai: 'charge', cspd: 300 },
  menel: { n: 'Menel spod sklepu', art: 'human', o: { face: 'kuzyn', look: { shirt: '#16181c', jacket: '#16181c', pants: '#d8d6d0', shoes: '#e8e8e8', hair: '#3a2a1e', skin: '#e2b49a' } }, hp: 20, spd: 42, r: 12, ai: 'lob', shot: { kind: 'can', cd: 3.2 } },
  mewa: { n: 'Mewa', art: 'bird', o: { col: '#ffffff', wing: '#9aa3aa', beak: '#f2c230', neck: false, eye: '#e8c02a', sz: 1.15 }, hp: 14, spd: 80, r: 11, ai: 'swoop', fly: 1 },
  budzik: { n: 'Budzik', art: 'clock', hp: 26, spd: 30, r: 13, ai: 'ring', shot: { kind: 'enemy', cd: 3.6, spd: 120, n: 8 } },
  spioch: { n: 'Śpioch', art: 'human', o: { emoji: '😴', look: { shirt: '#7aa7d8', pants: '#7aa7d8', shoes: '#f0f0f0', hair: '#6a5a4a' }, hat: 'nightcap' }, hp: 32, spd: 36, r: 12, ai: 'aura' },
  krzeslo: { n: 'Krzesło-mimik', art: 'chair', hp: 26, spd: 0, r: 12, ai: 'hop' },
  poduszka: { n: 'Latająca poduszka', art: 'pillow', hp: 18, spd: 70, r: 12, ai: 'fly', fly: 1 },
  szczur: { n: 'Szczur', art: 'rat', hp: 20, spd: 115, r: 10, ai: 'rat' },
  pajak: { n: 'Pająk', art: 'spider', hp: 24, spd: 0, r: 11, ai: 'hopShoot', shot: { kind: 'web', cd: 2.2, spd: 150 } },
  nietoperz: { n: 'Nietoperz', art: 'bat', hp: 16, spd: 125, r: 10, ai: 'swoop', fly: 1 },
  duch: { n: 'Duch', art: 'ghost', o: {}, hp: 28, spd: 52, r: 12, ai: 'ghost', fly: 1 },
  posag: { n: 'Ożywiony posąg', art: 'statue', o: { sz: 1.2 }, hp: 64, spd: 30, r: 14, ai: 'statue' },
  harpia: { n: 'Harpia', art: 'bird', o: { col: '#7a5230', wing: '#4a3018', beak: '#e0b030', sz: 1.5, eye: '#ffde3a', neck: false }, hp: 38, spd: 75, r: 14, ai: 'flyShoot', fly: 1, shot: { kind: 'feather', cd: 2.9, spd: 165, n: 3, spread: .35 } },
  zgolab: { n: 'Złoty gołąb', art: 'bird', o: { col: '#e8c040', wing: '#c99a1c', gold: 1, sz: 1.1, neck: false }, hp: 32, spd: 75, r: 11, ai: 'flyShoot', fly: 1, shot: { kind: 'gold', cd: 2.6, spd: 155, n: 3, spread: .3 }, coins: 2 },
  golabB: { n: 'Gołąb bojowy', art: 'bird', o: { col: '#8fb8e8', wing: '#5a8ac8' }, hp: 4, spd: 160, r: 8, ai: 'ally', fly: 1, ally: 1 }
};
// pule wrogów rozdziałów: [typ, waga, min. piętro w rozdziale]
var MOBPOOL = {
  szkola: [['golab', 3], ['kujon', 3], ['karaluch', 2], ['cebula', 2], ['kartkowka', 2], ['plujka', 2], ['golabm', 1, 2]],
  rynek: [['golab', 2], ['golabm', 2], ['dres', 3], ['menel', 2], ['mewa', 2], ['cebula', 1], ['karaluch', 1], ['plujka', 1]],
  internat: [['budzik', 2], ['spioch', 2], ['krzeslo', 3], ['poduszka', 2], ['kartkowka', 1], ['golabm', 1], ['karaluch', 1]],
  piwnica: [['szczur', 3], ['pajak', 2], ['nietoperz', 3], ['duch', 2], ['karaluch', 1], ['budzik', 1]],
  olimp: [['posag', 2], ['harpia', 2], ['zgolab', 1.5], ['duch', 1], ['mewa', 1.5]]
};
// ---------- piętra ----------
var FLOORS = [
  { n: 'Szkoła I', ch: 'szkola', theme: 'szkola', mus: 'szkola', bosses: ['fizyk', 'kujonG'] },
  { n: 'Szkoła II', ch: 'szkola', theme: 'szkola', mus: 'szkola', bosses: ['freddy'], numbero: 5 },
  { n: 'Rynek I', ch: 'rynek', theme: 'rynek', mus: 'rynek', bosses: ['kanar', 'dresSzef'] },
  { n: 'Rynek II', ch: 'rynek', theme: 'rynek', mus: 'rynek', bosses: ['sigeon'], numbero: 4 },
  { n: 'Internat I', ch: 'internat', theme: 'internat', mus: 'internat', bosses: ['budzikG'] },
  { n: 'Internat II', ch: 'internat', theme: 'internat', mus: 'internat', bosses: ['simi'], numbero: 3 },
  { n: 'Piwnica I', ch: 'piwnica', theme: 'piwnica', mus: 'piwnica', bosses: ['duchW'] },
  { n: 'Piwnica II', ch: 'piwnica', theme: 'piwnica', mus: 'piwnica', bosses: ['scary'], numbero: 2, dark: 1 },
  { n: 'Olimp', ch: 'olimp', theme: 'olimp', mus: 'olimp', bosses: ['greek'], numbero: 1, last: 1 }
];
// ---------- odblokowania ----------
var UNLOCKS = {
  freddy: { t: 'Pokonaj Freddy’ego Fazbera', give: 'Postać: Pracownik + przedmiot „Helo guys”' },
  sigeon: { t: 'Pokonaj Sigeon Pexa', give: 'Postać: Luźny + przedmiot „Sigeon Pex”' },
  simi: { t: 'Pokonaj Simi Simi', give: 'Postać: Kuzyn + przedmiot „Simi simi”' },
  scary: { t: 'Pokonaj Scary Igyatczaka', give: 'Postać: Bajtek + przedmiot „Scary face”' },
  greek: { t: 'Pokonaj Greek Igyatczaka', give: 'Przedmiot „Numbero 1”' },
  win_ignaczak: { t: 'Wygraj Ignaczakiem', give: 'Przedmiot „Kostka do Chińczyka”' },
  win_prac: { t: 'Wygraj Pracownikiem', give: 'Przedmiot „Wiadro mleka” w puli' },
  win_luz: { t: 'Wygraj Luźnym', give: 'Przedmiot „Hipnoza 67” w puli' },
  win_kuzyn: { t: 'Wygraj Kuzynem', give: 'Przedmiot „Żubr” w puli' },
  win_bajtek: { t: 'Wygraj Bajtkiem', give: 'Przedmiot „Chillout” w puli' }
};
var CHARLOCK = { prac: 'freddy', luz: 'sigeon', kuzyn: 'simi', bajtek: 'scary' };
// pule przedmiotów odblokowanych po wygranej postaci
var WINPOOL = { wiadro: ['tre'], hipnoza: ['tre', 'shop'], zubr: ['tre', 'devil'], chill: ['tre', 'shop'] };
// ---------- teksty na nagłówki gazety ----------
var KILLERS = {
  golab: 'GOŁĄB', golabm: 'GOŁĄB MLECZNY', kartkowka: 'KARTKÓWKA', kujon: 'KUJON', plujka: 'PLUJKA', karaluch: 'KARALUCH', cebula: 'ZŁA CEBULA', dres: 'DRESIARZ', menel: 'MENEL',
  mewa: 'MEWA', budzik: 'BUDZIK', spioch: 'ŚPIOCH', krzeslo: 'KRZESŁO', poduszka: 'PODUSZKA', szczur: 'SZCZUR', pajak: 'PAJĄK', nietoperz: 'NIETOPERZ', duch: 'DUCH', posag: 'POSĄG',
  harpia: 'HARPIA', zgolab: 'ZŁOTY GOŁĄB', bomb: 'WŁASNA PETARDA', spikes: 'PINEZKI', fire: 'GRILL', pill: 'PODEJRZANA PUSZKA', deal: 'DIABELSKI INTERES'
};

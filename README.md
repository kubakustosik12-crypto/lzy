# The Binding of Ignaczak (v3.5)

Prywatna kopia tylko dla Filipa. Roguelike w stylu *The Binding of Isaac: Repentance+*
z postaciami, bossami i światem z gry **5 Koszmarów Szymona Ignaczaka**.

- 9 pięter: Szkoła, Rynek, Internat, Piwnica, Olimp
- 5 Koszmarów jako bossowie: Freddy Fazber, Sigeon Pex, Simi Simi, Scary Igyatczak, Greek Igyatczak
- 5 postaci z twarzami ze zdjęć (w pixel arcie): Szymon Ignaczak, Pracownik, Luźny, Kuzyn, Bajtek
- 141 przedmiotów (w tym 40 nowych: anielskie, straszne, aktywne), karty, puszki, drobiazgi, sklep u Heńka, pokoje diabła i anioła, ziarna biegów
- własne ręcznie rysowane ikony i potwory w pixel arcie (bez emoji), kontury jak w Isaacu, ciemniejsze i straszniejsze piętra
- **co-op**: na jednym komputerze albo **przez internet** (pokój z kodem); w co-opie przedmioty są zawsze podwójnie
- **v3.5**: nowa nazwa, Dziennik (16 gazet, listów i notatek), sekretna ścieżka „Koszmar numer 6” (Rodzinne zdjęcie → Mieszkanie z lat 70. → Szymon z koszmaru → prawdziwe zakończenie, postać Cień Szymona), walka z Aniołem Stróżem po wysadzeniu posągu, odblokowania za zakończenia
- **v3.0**: Matka Ignaczaka (Piwnica II), dwa listy i dwie ścieżki (Olimp albo Kolejka → Kombinat → Towarzysz Pierwszy Sekretarz), dwa zakończenia
- Łazienka pracownicza nr 20 z mini-bossami (Kierownik zmiany, Sprzątaczka, Zatkany kibel)
- nowe postacie: Pocket (kot strzelający kupą, je kupy), Woźny Zenek, Babcia Halina; nowy potwór: Gość z nożem
- rodzaje kup (złota, czerwona, czarna, tęczowa, biała, z kukurydzą), puszki Dzika ładujące przedmiot, zielsko, przemiany Zjarany / Kupiarz / Towarzysz
- kolorowe łzy zależne od przedmiotów, wyższa rozdzielczość (mniej pikselozy)
- planetarium z 11 przedmiotami-planetami, stroje: przedmioty widać na postaci, wstęga z nazwą przedmiotu

## Uruchomienie u siebie

```bash
npm install
npm start          # http://localhost:3000
npm test           # testy serwera (pokoje, przekazywanie wejścia)
npm run build      # dist/lzy-ignaczaka.html – cała gra w jednym pliku (solo + co-op lokalny, bez serwera)
```

## Wrzucenie na GitHub i Render

```bash
git remote add origin https://github.com/<twoj-login>/<nazwa-repo>.git
git push -u origin main
```

Potem na [render.com](https://render.com): **New → Blueprint** → wybierz repo. Render przeczyta
`render.yaml` (Node, region Frankfurt, `npm ci` / `npm start`, health check `/health`).
Po kilku minutach gra działa pod adresem `https://lzy-ignaczaka.onrender.com` (albo podobnym).

Darmowy plan usypia serwer po ~15 min bez ruchu — pierwsze wejście potem trwa do ~1 minuty.
Każdy `git push` sam wdraża nową wersję.

## Sterowanie

| | Klawiatura | Pad |
|---|---|---|
| Ruch | WASD | lewa gałka / krzyżak |
| Płacz (strzał) | strzałki albo IJKL | ABXY / prawa gałka |
| Przedmiot aktywny | Spacja | RT / RB |
| Petarda | E | LT |
| Karta / pigułka | Q | LB |
| Upuść drobiazg | Ctrl | — |
| Mapa | Tab | Select |
| Pauza | Esc / P | Start |

## Co-op

**Na jednym komputerze:** Menu → Co-op → *Na jednym komputerze*. Gracz 1 gra na klawiaturze,
gracz 2 na padzie (przy dwóch padach: gracz 1 może też używać drugiego pada).

**Przez internet:** obaj otwieracie grę z tego samego adresu (Render). Jeden: *Co-op → Przez internet →
Załóż pokój* i wysyła 4-literowy kod. Drugi: wpisuje kod → *Dołącz*. Gospodarz klika *Start*.

Zasady co-opu (jak w Repentance+): monety, bomby i klucze są wspólne; kto zginie, zostaje duchem
i ożywa na następnym piętrze; bieg kończy się, gdy padną obaj. W grze online pauza nie zatrzymuje
gry — Twoja postać po prostu stoi.

**Jak działa sieć:** serwer nie liczy gry. Obie przeglądarki liczą identyczny świat (wspólne ziarno
losowości, ten sam zegar), a przez serwer leci tylko wejście z każdej klatki (lockstep). Opóźnienie
wejścia dobiera się z pingu (3–12 klatek). Co sekundę gracze porównują odcisk stanu; gdyby się
rozjechał, gospodarz wysyła stan biegu i obaj go wczytują (bieżący pokój zaczyna się wtedy od nowa).
Najpewniej działa, gdy obaj gracie w Chrome albo Edge.

## Struktura

```
server.js            serwer: pliki statyczne + pokoje WebSocket (/ws) + /health
render.yaml          konfiguracja Render
public/index.html    strona gry
public/js/
  pixelfont.js       pikselowa czcionka (tabela znaków, też źródło pliku TTF)
  pixel.js           silnik pikselowy: niska rozdzielczość, paleta, tekst
  palette.js         paleta 64 kolorów
  faces.js           współrzędne pikselowych twarzy w atlasach
  00_core … 13_main  gra (rdzeń, dźwięk, grafika, potwory, dane, piętra, gracz, byty, bossowie, pokoje, HUD, menu, pętla)
  14_coop.js         dwóch graczy w symulacji + determinizm
  15_net.js          co-op online (lobby, lockstep, resync)
  sprites.js         ręcznie rysowane sprite'y (ikony, głowy potworów i NPC)
  16_icons.js        podmiana symboli na sprite'y (gra, HUD, teksty, menu)
  17_items.js        nowe przedmioty i mechaniki, częstsze pokoje anioła
  18_rep.js          planetarium, co-op x2, HUD każdego gracza, stroje z przedmiotów, wstęga
  19_update.js       łzy, kupy, Pocket, Dzik, zielsko, nowe przedmioty i postacie, łazienka nr 20
  20_story.js        Matka Ignaczaka, dwa listy, Kolejka, Kombinat, Sekretarz, zakończenia
  21_secret.js       Dziennik, Koszmar numer 6, Cień Szymona, Anioł Stróż Koszmaru
public/assets/
  faces/faces_<h>.png  pikselowe twarze (atlasy 12–128 px) – można poprawiać ręcznie w Aseprite
  img/                 zdjęcia źródłowe twarzy i klatki bossów z 5 Koszmarów
  audio/voice.mp3      głos z 5 Koszmarów
  font/                Ignaczak Pixel (TTF do menu)
tests/server.test.js   testy serwera
tools/                 narzędzia (Python): make_faces.py, make_palette.py, build_font.py,
                       determinism.py (dwie karty, ten sam bieg), online_test.py (dwie przeglądarki przez serwer)
```

**Ręczne poprawki twarzy:** edytuj `public/assets/faces/faces_<h>.png` (każdy atlas to jeden rozmiar;
gra bierze rozmiar najbliższy temu na ekranie — w grze najczęściej 24 px, bossowie 32–48 px).
Uwaga: `python3 tools/make_faces.py` generuje atlasy od nowa i nadpisze ręczne zmiany.

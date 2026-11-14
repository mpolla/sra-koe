# SRA ampumakokeen pisteytyssovellus

Toimiva sovellus osoitteessa https://mpolla.github.io/sra-koe/

Tämä on selainsovellus [SRA](https://resul.fi/sra/) (Sovellettu Reserviläisammunta) toiminnallisen ampumalajin 
ampumakoneen pisteiden laskentaan.

Sovellus tallentaa tiedot ainoastaan paikalliseen päätelaitteeseen. Tietoja ei tallennneta tai jaeta verkkopalvelimilla.

Jos löydät puutteita tai haluat ehdottaa parannuksia, ota yhteyttä kehittäjään mpo@iki.fi

## Kehittäminen

    npm run dev

## Testaus

    npm run test:e2e

## Julkaiseminen

Julkaisu tehdään omalta koneelta, sillä CI-putkea ei ole. Sovellus julkaistaan
GitHub Pagesiin, ja versiot merkitään GitHubiin tageilla (`v0.9.0` jne.).

1. **Tarkista lähtötilanne.** Ole main-haarassa, ilman keskeneräisiä muutoksia
   ja ajan tasalla (`git pull && git fetch --tags`). Komennon
   `git describe --tags --abbrev=0` pitää näyttää edellinen versio. Jos se ei
   löydä mitään, tagit ovat irronneet historiasta, ja julkaisutyökalu luulisi
   koko historiaa uudeksi.

2. **Katso, mitä julkaisuun tulee.** `npm run release:dry` näyttää uuden
   versionumeron ja muutoslokin, mutta ei muuta mitään. Numero lasketaan
   commit-viesteistä: `feat` on uusi ominaisuus, `fix` korjaus. Alle 1.0:n
   versioissa työkalu nostaisi uudesta ominaisuudesta vain viimeistä numeroa,
   joten jos mukana on `feat`-commit, lisää perään `-- --release-as minor`
   (esim. 0.8.3 → 0.9.0).

3. **Kirjoita käyttäjille muutosloki.** Lisää uusi versio ja päivämäärä
   sovelluksen Tietoja-sivulle (`src/views/AboutView.vue`) selkokielellä ja
   käyttäjän näkökulmasta. Commitoi: `git commit -am "docs: versiohistoria N"`.

4. **Tee julkaisu.** `npm run release` (samoilla lisävalinnoilla kuin kohdassa
   2) nostaa versionumeron, päivittää kehittäjien muutoslokin `CHANGELOG.md` ja
   tekee julkaisucommitin sekä tagin.

5. **Vie GitHubiin.** `git push --follow-tags origin main` vie commitit ja
   tagin.

6. **Julkaise sovellus.** `npm run deploy` rakentaa sovelluksen ja vie sen
   GitHub Pagesiin (`gh-pages`-haara). Asennettu sovellus näyttää käyttäjille
   ilmoituksen "Uusi versio saatavilla" seuraavalla avauskerralla tai viimeistään
   tunnin kuluessa.

Vapaaehtoisesti julkaisusta voi tehdä myös GitHub Releasen:
`gh release create vN --notes-from-tag`.

**Tärkeää:** jo julkaistuja (tagattuja) committeja ei saa muokata jälkikäteen
(rebase, amend, force push). Muuten tagit jäävät osoittamaan vanhoihin
committeihin, ja seuraava julkaisu menee sekaisin.

Tarkempi tekninen kuvaus on tiedostossa [AGENTS.md](AGENTS.md#releasing).

<!--

Kehittäjän muistiinpanoja..

Kuvien generointi

  convert -background transparent -resize 64x64 -gravity center -extent 64x64 -define 'icon:auto-resize=16,24,32,64' public/logo.svg public/favicon.ico

Kuvien (Public Domain) lähteet

https://www.dvidshub.net/image/7873037/army-reserve-sgt-christine-won-and-army-reserve-1st-lt-jessica-romero-fire-glocks

-->

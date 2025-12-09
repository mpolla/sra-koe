# SRA ampumakokeen pistelaskuri

Toimiva sovellus osoitteessa https://mpolla.github.io/sra-ampumakoe-laskuri/

Tämä on selainsovellus [SRA](https://resul.fi/sra/) (Sovellettu Reserviläisammunta) toiminnallisen ampumalajin 
ampumakoneen pisteiden laskentaan.

*Huom.* Sovellus on testivaiheessa - tarkista toimivuus omalla laitteellasi ennen käyttämistä todellisessa koetilanteessa.

Sovellus tallentaa tiedot ainoastaan paikalliseen päätelaitteeseen. Tietoja ei tallennneta tai jaeta verkkopalvelimilla.

Jos löydät puutteita tai haluat ehdottaa parannuksia, ota yhteyttä kehittäjään mpo@iki.fi

## Kehittäminen

    npm run dev

## Testaus

    npm run test:e2e

## Julkaiseminen

Päivitä muutosloki `src/views/AboutView.vue`

    npm version minor
    npm run predeploy
    npm run deploy

<!--

Kehittäjän muistiinpanoja..

Kuvien generointi

  convert -background transparent -resize 64x64 -gravity center -extent 64x64 -define 'icon:auto-resize=16,24,32,64' public/logo.svg public/favicon.ico

Kuvien (Public Domain) lähteet

https://www.dvidshub.net/image/7873037/army-reserve-sgt-christine-won-and-army-reserve-1st-lt-jessica-romero-fire-glocks

-->

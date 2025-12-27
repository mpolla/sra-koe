<script setup lang="ts">

// https://www.flickr.com/photos/30478819@N08/44723128954
// https://commons.wikimedia.org/wiki/File:200909-F-NS874-1163_-_7th_SFG_Soldiers_conduct_Best_ODA_Competition_(Image_12_of_13).jpg

import { usePisteetStore } from '@/stores/pisteet'
import { ref } from "vue";
import { RastiSuorituksenTila, SraAmpumakoe } from "@/classes/SraAmpumakoe";
import { MapPin, Calendar, User, CardShield, Phone, UserSquare  } from '@iconoir/vue';
import { PdfPoytakirja } from "@/classes/PdfPoytakirja";

const pisteetStore = usePisteetStore()

let lisattavaAmpuja = ref('')

// Ampujien listaus näytetään heti muokkaustilassa jos lista on tyhjä
let muokkausTila = ref(Object.keys(pisteetStore.pisteet).length < 1)

let toggleKoetilaisuudenTiedot = ref(false)

const lisaaAmpuja = (nimi: string) => {
  if (nimi == null || nimi == '') {
    return
  }
  const lisattavanEtunimi = nimi.split(' ')[0]
  const toisellaSamaEtunimi = Object.keys(pisteetStore.pisteet).map((it) => it.split(' ')[0]).filter(x => x === lisattavanEtunimi).length > 0
  if (pisteetStore.pisteet[nimi] !== undefined) {
    console.warn("Ampuja nimellä " + nimi + " on jo listalla.")
    return
  }
  if (toisellaSamaEtunimi && nimi.split(' ').length == 1) {
    console.warn("Ampuja etunimellä " + lisattavanEtunimi + " on jo listalla. Lisää sukunimi.")
    return
  }
  pisteetStore.lisaaAmpuja(nimi)
  lisattavaAmpuja.value = ''
}

const muotoileOsumakerroin = (osumakerroin: number) => {
  if (osumakerroin == null || isNaN(osumakerroin)) {
    return ""
  }
  else {
    return "(" + osumakerroin.toFixed(2) + ")"
  }
}

const muotoileTulos = (kaikkiRastitSuoritettu: boolean, osumakerroin: number, ampuja: string) => {
  if (ampuja in pisteetStore.hylkaykset) {
    return "HYLÄTTY"
  }

  if (!kaikkiRastitSuoritettu) {
    return "KESKEN"
  }
  if (osumakerroin >= SraAmpumakoe.vaadittuOsumakerroin) {
    return "HYVÄKSYTTY"
  }
  return "HYLÄTTY"
}

const jatkaLinkkki = () => {
  if (pisteetStore.turvallisuuskoulutusSuoritettu !== true) {
    return 'turvallisuus'
  } else {
    return 'kirjaus/0/' + Object.keys(pisteetStore.pisteet)[0]
  }
}

const mapClass = (tila: RastiSuorituksenTila) => {
  switch (tila) {
    case RastiSuorituksenTila.Kesken:
      return 'incomplete'
    case RastiSuorituksenTila.Suorittamatta:
      return 'notdone'
    case RastiSuorituksenTila.Suoritettu:
      return 'done'
  }
}

const vahvistaPoisto = (ampuja: string) => {
  if (confirm(`Poista ampujan ${ampuja} tulostiedot?`)) {
    pisteetStore.poistaAmpuja(ampuja)
  }
}

/**
 * Näytetään koetilaisuuden tiedot jos käyttäjän on klikannut ne näkyväksi tai jos mikä tahansa tieto on syötetty.
 */
function naytaKoetilaisuudenTiedot(): boolean {
  return toggleKoetilaisuudenTiedot.value  || pisteetStore.tuomari_nimi != '' || pisteetStore.tuomari_sraid != ''
      || pisteetStore.tuomari_puhelin != '' || pisteetStore.koetilaisuus_paikka != ''
      || pisteetStore.koetilaisuus_paiva != ''
}

const reset = () => {
  if (confirm("Haluatko todella tyhjentää listan ja poistaa kaikki tulokset?")) {
    pisteetStore.reset()
  }
}

// Syötä ampujat kehityskäytössä automaattisesti
// onMounted(() => {
//   lisaaAmpuja('Katriina')
//   lisaaAmpuja('Maija')
//   lisaaAmpuja('Heidi')
//   lisaaAmpuja('Tiina')
// })

</script>

<template>
  <main v-bind:class="{ muok: !muokkausTila }">

    <div class="sisalto">

      <div class="intro" v-if="muokkausTila">
        Tervetuloa SRA ampumakokeeseen. Syötä ampumakokeeseen ostallistuvien henkilöiden nimet alla. Sovellukseen
        kirjatut tiedot tallentuvat ainoastaan päätelaitteen muistiin. Tietoja ei tallenneta ja jaeta verkossa. Voit
        ladata PDF-muotoiset tulospöytäkirjat tuloksien kirjaamisen jälkeen.
      </div>

      <h2 v-if="muokkausTila">Ampujat</h2>
      <h2 v-if="!muokkausTila">Tuloslista</h2>

      <ul v-if="muokkausTila" class="ampujat">
        <li v-bind:key="ampuja" v-for="(ampujanPisteet, ampuja) in pisteetStore.pisteet"><span class="ampuja">{{ ampuja }}</span><span @click="vahvistaPoisto(ampuja as string)" class="remove">⨉</span></li>
      </ul>

      <table id="tuloslista" cellspacing="0" v-if="!muokkausTila">
        <thead>
        <tr>
          <th class="nimi">Nimi</th>
          <th class="rastipallot">Rastit</th>
          <th class="osumakerroin">Tulos ja HF</th>
          <th class="tulos">Pöytäkirja</th>
          <th v-if="muokkausTila">Poista</th>
        </tr>
        </thead>
        <tbody>
        <tr v-bind:key="ampuja" v-for="(ampujanPisteet, ampuja) in pisteetStore.pisteet" v-bind:class="{dq: pisteetStore.getHylkaysperuste(ampuja as string) }">
          <td class="nimi">
            <a :href="'ampuja/' + ampuja"><UserSquare color="#888"/> <span>{{ ampuja }}</span></a>
          </td>
          <td class="rastipallot">
            <div v-bind:key="rasti" class="rastipallo" v-bind:class="mapClass(pisteetStore.getRastiSuorituksenTila(ampuja as string, rasti))"  v-for="rasti in [0,1,2,3,4]">
              <a :href="'kirjaus/' + rasti + '/' + ampuja">{{ rasti+1 }}</a></div>
          </td>
          <td>
          <span id="tulos" v-bind:class="muotoileTulos(pisteetStore.getKaikkiRastitSuoritettu(ampuja as string), pisteetStore.getAmpujanOsumakerroin(ampuja as string), ampuja as string)">
          {{
              muotoileTulos(pisteetStore.getKaikkiRastitSuoritettu(ampuja as string), pisteetStore.getAmpujanOsumakerroin(ampuja as string), ampuja as string)
            }}
          </span>
            {{ muotoileOsumakerroin(pisteetStore.getAmpujanOsumakerroin(ampuja as string)) }}
          </td>

          <td><button @click="(new PdfPoytakirja()).luoPdf(ampuja as string, pisteetStore)">PDF</button></td>

          <td v-if="muokkausTila"><button class="danger" @click="vahvistaPoisto(ampuja as string)">🗑 POISTA</button></td>
        </tr>
        </tbody>
      </table>

      <fieldset v-if="muokkausTila" >
        <legend>Lisää ampuja</legend>
        <input placeholder="Ampujan nimi" id="uusinimi" name="uusinimi" v-model="lisattavaAmpuja" v-on:keyup.enter="lisaaAmpuja(lisattavaAmpuja)"/>
        <button class="action" value="Lisää" @click="lisaaAmpuja(lisattavaAmpuja);pisteetStore.turvallisuuskoulutusSuoritettu = false;">Lisää</button>
      </fieldset>


      <fieldset v-if="muokkausTila">
        <legend>Kokeen ampumajärjestys</legend>
        <input type="radio" id="kiertavaJarjestys" name="ampumajarjestys" v-model="pisteetStore.jarjestys" value="kiertava" checked />
        <label for="kiertavaJarjestys">Kiertävä järjestys: ensimmäisenä ampunut siirtyy seuraavalla rastilla viimeiseksi</label>
        <input type="radio" id="eiKiertavaJarjestys" name="ampumajarjestys" v-model="pisteetStore.jarjestys" value="pysyva" />
        <label for="eiKiertavaJarjestys">Sama järjestys joka rastilla</label>
      </fieldset>

      <div>
        <div v-if="muokkausTila" @click="toggleKoetilaisuudenTiedot = !toggleKoetilaisuudenTiedot" class="accordion-header">
          <h3>Koetilaisuus »</h3>
        </div>
      </div>

      <div v-if="naytaKoetilaisuudenTiedot()" class="accordion-content">

        <fieldset v-if="muokkausTila || pisteetStore.koetilaisuus_paikka != '' || pisteetStore.koetilaisuus_paiva != ''">
          <legend>Paikka ja aika</legend>
          <div>
            <div v-if="muokkausTila || pisteetStore.koetilaisuus_paikka != ''">
              <MapPin/><input id="koetilaisuus_paikka" v-model="pisteetStore.koetilaisuus_paikka" placeholder="Paikka" :readonly="!muokkausTila"/>
            </div>
            <div v-if="muokkausTila || pisteetStore.koetilaisuus_paiva != ''">
              <Calendar/><input id="koetilaisuus_paiva" v-model="pisteetStore.koetilaisuus_paiva" type="date" :readonly="!muokkausTila"/>
            </div>
          </div>
        </fieldset>

        <fieldset v-if="muokkausTila || pisteetStore.tuomari_nimi !==''">
          <legend>Vastaanottava tuomari</legend>
          <div>
            <div v-if="muokkausTila || pisteetStore.tuomari_nimi !==''">
              <User/><input id="tuomari_nimi" v-model="pisteetStore.tuomari_nimi" placeholder="Nimi" :readonly="!muokkausTila"/>
            </div>
            <div v-if="muokkausTila || pisteetStore.tuomari_sraid !==''">
              <CardShield/><input v-model="pisteetStore.tuomari_sraid" placeholder="SRA ID" :readonly="!muokkausTila"/>
            </div>
            <div v-if="muokkausTila || pisteetStore.tuomari_puhelin !==''">
              <Phone/><input v-model="pisteetStore.tuomari_puhelin" placeholder="Puhelin" :readonly="!muokkausTila"/>
            </div>
          </div>
        </fieldset>
      </div>

      <div class="actions">
        <button class="action danger" v-if="muokkausTila && Object.keys(pisteetStore.pisteet).length > 0" @click="reset()">Poista kaikki ampujat</button>
        <button v-if="muokkausTila && Object.keys(pisteetStore.pisteet).length > 1" @click="pisteetStore.satunnaistaJarjestys()" class="action">⤭ Järjestä satunnaisesti</button>
        <button class="action" v-if="Object.keys(pisteetStore.pisteet).length > 0 && !muokkausTila" @click="muokkausTila = !muokkausTila">Muokkaa tietoja</button>
        <button class="action" v-if="Object.keys(pisteetStore.pisteet).length > 0 && muokkausTila && pisteetStore.turvallisuuskoulutusSuoritettu" @click="muokkausTila = !muokkausTila">Jatka</button>
        <button class="action" v-if="Object.keys(pisteetStore.pisteet).length > 0 && muokkausTila && pisteetStore.turvallisuuskoulutusSuoritettu == false" @click="$router.push('turvallisuus')">Jatka</button>

        <button v-if="!muokkausTila && pisteetStore.turvallisuuskoulutusSuoritettu" class="action" @click="$router.push('kirjaus/0/' + Object.keys(pisteetStore.pisteet)[0])">Aloita ampumakoe</button>
      </div>

    </div>
  </main>
</template>
<style scoped>

body {
  background-color: red;
}

main {
  background-image: linear-gradient(to bottom, rgba(233, 233, 233, .2), rgba(233, 233, 233, 1)), url("../assets/tausta.jpg");
  background-repeat: no-repeat;
  padding: 9rem 0 0 0;

  &.muok {
    padding: 0 0 0 0;
  }
}

.sisalto {
  background-color: rgba(233,233,233, .7);
  padding: 1rem;
  line-height: 1.5;
}


table#tuloslista {
  border-radius: .3rem;
  width: 100%;


  & tr {

    height: 3rem;

    &:nth-child(odd) {
      background-color: #f5f5f5;
    }
    &:nth-child(even) {
      background-color: #e7e7e7;
    }

    & td {
      text-align: center;
    }

    & td.nimi {
      text-align: left;
      padding-left: .5rem;

      a {
        color: #333;
        display: flex;

        span {
          margin-left: .4rem;
          font-weight: bold;
        }
      }
    }


    & th {
      word-wrap: anywhere;
      font-size: 105%;
      background-color: #ececec;
      border-bottom: 2px solid #145014;
      color: var(--vari1);
      font-weight: bold;

      &.rastipallot {
        min-width: 6rem;
      }
    }

    &.dq {
      & div.rastipallo {
        background-color: #ccc;
        & a {
          color: #333;
        }
      }
    }
  }
}

.rastipallot {
  .rastipallo:first-child {
    border-bottom-left-radius: 40%;
    border-top-left-radius: 40%;
  }
  .rastipallo:last-child {
    border-top-right-radius: 40%;
    border-bottom-right-radius: 40%;
  }
}

.rastipallo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.1rem;
  height: 1.1rem;
  margin: 0;
  font-size: 70%;

  &.done {
    background-color: var(--vari1);
    & a {
      color: rgba(255, 255, 255, 0.8);
      font-weight: bold;
    }
  }
  &.notdone {
    background-color: var(--vari2);
    & a {
      color: var(--vari1);
      font-weight: bold;
    }
  }
  &.incomplete {
    background-color: #dea187;
    & a {
      color: var(--vari1);
      font-weight: bold;
    }
  }

}

.ampujat {

  padding: .5rem 0 .5rem 0;
  display: flex;
  flex-wrap: wrap;

  & li {
    display: flex;
    color: #f1f1f1;
    margin: .1rem;

    .remove {
      background-color: var(--vari1);
      border-radius: 0 .8rem .8rem 0;
      padding: 0 .7rem .15rem .6rem;
      height: 1.7rem;
      font-size: 70%;
      align-content: center;
      color: #dddddd;

      &:hover {
        color: white;
        background-color: maroon;
      }
    }

    .ampuja {
      background-color: var(--vari1);
      align-content: center;
      height: 1.7rem;
      padding: 0 .1rem 0 1rem;
      border-radius: .8rem 0 0 .8rem;
    }
  }
}

fieldset {
  margin: .1rem 0 .5rem 0;
  display: flex;
  justify-content: space-between;

  & div div {
    display: flex;
    margin: .2rem 0 .2rem 0;

    & input {
      margin-left: .5rem;
    }
  }
}

input:read-only {
  background-color: #eee;
  border: none;
}

</style>

<script setup lang="ts">
import {ref, watch} from 'vue'
import {RastiSuorituksenTila, SraAmpumakoe} from '@/classes/SraAmpumakoe'
import { usePisteetStore } from '@/stores/pisteet'
import { useRoute } from 'vue-router'
import RastiPisteRivi from '@/components/RastiPisteRivi.vue'

const route = useRoute()
const pisteetStore = usePisteetStore()
const synth = window.speechSynthesis;

const naytaRastiInfo = ref(false)


let ampuja : string = (route.params.ampuja) ? route.params.ampuja as string : Object.keys(pisteetStore.pisteet)[0]
let rasti : number = (route.params.rasti) ? Number(route.params.rasti) as number : 0

watch(
    () => route.params.ampuja,
    () => {
      ampuja = route.params.ampuja as string
    }
)

watch(
    () => route.params.rasti,
    () => {
      rasti = Number(route.params.rasti) as number
    }
)

function getImageUrl() {
  return new URL(`../assets/logo.svg`, import.meta.url).href
}

const seuraavaEiHylattyAmpuja = (ampujat: string[]) => {
  for (let seuraavaKandidaatti of ampujat) {
    if (!(seuraavaKandidaatti in pisteetStore.hylkaykset)) {
      return seuraavaKandidaatti
    }
  }
  return null
}

const edellinenEiHylattyAmpuja = (ampujat: string[]) => {
  return seuraavaEiHylattyAmpuja(ampujat.reverse())
}

const seuraavaLinkki = (rasti: number, ampuja: string) => {
  const seuraavaAmpuja = rastinSeuraavaAmpuja(rasti, ampuja)
  // Seuraava rasti
  if (seuraavaAmpuja == null) {
    if (rasti == 4) {
      return '/'
    } else {
      return '/kirjaus/' + (rasti + 1) + '/' + kierrataJarjestys(Object.keys(pisteetStore.pisteet), rasti + 1)[0]
    }
  } else {
    return '/kirjaus/' + (rasti) + '/' + seuraavaAmpuja
  }
}

const edellinenLinkki = (rasti: number, ampuja: string) => {
  const edellinenAmpuja = rastinEdellinenAmpuja(rasti, ampuja)
  // Edellinen rasti
  if (edellinenAmpuja == null) {
    if (rasti == 0) {
      return '/'
    } else {
      return '/kirjaus/' + (rasti - 1) + '/' + kierrataJarjestys(Object.keys(pisteetStore.pisteet), rasti-1).reverse().find((t) => !(t in pisteetStore.hylkaykset))
    }
  } else {
    return '/kirjaus/' + (rasti) + '/' + edellinenAmpuja
  }
}

const rastinSeuraavaAmpuja = (rasti: number, ampuja: string): string | null => {
  const rastinAmpujaJarjestys: string[] = kierrataJarjestys(Object.keys(pisteetStore.pisteet), rasti)
  const rastinLoputAmpujat = rastinAmpujaJarjestys.slice(rastinAmpujaJarjestys.indexOf(ampuja)+1)
  return seuraavaEiHylattyAmpuja(rastinLoputAmpujat)
}

const rastinEdellinenAmpuja = (rasti: number, ampuja: string): string | null => {
  const rastinAmpujaJarjestys: string[] = kierrataJarjestys(Object.keys(pisteetStore.pisteet), rasti)
  const nykyisenIndex = rastinAmpujaJarjestys.indexOf(ampuja)
  const rastinEdellisetAmpujat = rastinAmpujaJarjestys.slice(0, nykyisenIndex)
  return edellinenEiHylattyAmpuja(rastinEdellisetAmpujat)
}


const ohjeFraasi = (rasti: number, ampuja: string) : string => {
  const seuraavaAmpuja = rastinSeuraavaAmpuja(rasti, ampuja)
  if (seuraavaAmpuja == null) {
    if (rasti < 4) {
      return `Ammutaan. Seuraava ampuja ${ampuja}, tämän rastin viimeinen ampuja.`
    } else {
      return `Ammutaan. Seuraava ampuja ${ampuja}, ampumakokeen viimeinen suoritus.`
    }
  } else {
    return `Ammutaan. Seuraava ampuja ${ampuja}, ${seuraavaAmpuja} valmistautuu.`
  }
}

const kierrataJarjestys = (ampujat: string[], rasti: number): string[] => {
  for (let i = 0; i < rasti; i++ ) {
    ampujat.push(ampujat.shift() as string)
  }
  return ampujat
}

const sano = (s: string) => {
  if (pisteetStore.mute === true) {
    return
  }
  const utterThis = new SpeechSynthesisUtterance(s)
  utterThis.lang = "fi-FI";
  synth.speak(utterThis);
}

const lyhennaNimi = (kaikkiNimet: string) => {

  const kaikkiEtunimet = Object.keys(pisteetStore.pisteet).map((it) => it.split(' ')[0])
  const kaikkiEunimiJaAlkukirjain = Object.keys(pisteetStore.pisteet).map((it) => {
    const toisenAmpujanNimet = it.split(' ')
    let ret = toisenAmpujanNimet[0]
    if (toisenAmpujanNimet.length > 1) {
      ret += " " + toisenAmpujanNimet[1].replace(/[a-z]/g, "")
    }
    return ret
  })
  const nimet = kaikkiNimet.split(' ')
  const etuNimi = nimet[0]

  let etuNimiJaAlkukirjain = etuNimi
  if (nimet.length > 1) {
    etuNimiJaAlkukirjain += " " + nimet[1].replace(/[a-z]/g, "")
  }

  const toisellaSamaEtunimi = kaikkiEtunimet.filter(x => x === etuNimi).length > 1
  const toisellaSamaAlkukirjain = kaikkiEunimiJaAlkukirjain.filter(x => x === etuNimiJaAlkukirjain).length > 1

  // Kenelläkään muulla ei ole samaa etunimeä
  if (!toisellaSamaEtunimi) {
    return etuNimi
  }
  // Toisella on sama nimi, mutta sukunimen alkukirjain on eri
  else if (!toisellaSamaAlkukirjain && nimet.length > 1) {
    return etuNimi + ' ' + nimet[1].replace(/[a-z]/g, "")
  }
  // Toisella ampujalla on sama etunimi ja sama sukunimen alkukirjain: näytetään siis koko nimi kummalekin
  return kaikkiNimet
}

const kirjaaHylkays = (ampuja: string) => {
  const peruste = window.prompt("Ampujan " + ampuja + " hylkäämisen syy?", "") as string
  if (peruste != null && peruste !== "") {
    pisteetStore.kirjaaHylkays(ampuja, peruste)
  }
}

const getClasses = (rasti: number, vuorossaOlevaAmpuja: string, aid: string) => {
  if (aid === vuorossaOlevaAmpuja) {
    if (aid in pisteetStore.hylkaykset) {
      return 'active dq';
    } else {
      return 'active';
    }

  }
  if (aid in pisteetStore.hylkaykset) {
    return 'inactive dq'
  }
  const tila = pisteetStore.getRastiSuorituksenTila(aid, rasti)
  switch (tila) {
    case RastiSuorituksenTila.Kesken:
      return 'inactive incomplete'
    case RastiSuorituksenTila.Suorittamatta:
      return 'inactive notdone'
    case RastiSuorituksenTila.Suoritettu:
      return 'inactive done'
  }
}

const rastinOsumakerroin = (ampuja: string, rasti: number): number => {
  if (pisteetStore.getRastiSuorituksenTila(ampuja, rasti) !== RastiSuorituksenTila.Suoritettu) {
    return 0
  }
  const pisteet = pisteetStore.getPelaajaRastiPisteSumma(ampuja, rasti)
  const aika = pisteetStore.getPelaajanRastiAika(ampuja, rasti)
  return pisteet/aika
}

const rastiClasses = (rasti: number, r: number) => {
  if (r == rasti) {
    return 'active'
  }
  const ampujat = Object.keys(pisteetStore.pisteet).filter((ampuja) => !(ampuja in pisteetStore.hylkaykset))
  if (ampujat.map((ampuja) => pisteetStore.getRastiSuorituksenTila(ampuja, r)).filter((t) => t == RastiSuorituksenTila.Suoritettu).length == ampujat.length) {
    return 'done'
  }
  //if (ampujat.map((ampuja) => pisteetStore.getRastiSuorituksenTila(ampuja, r)).filter((t) => t == RastiSuorituksenTila.Suorittamatta).length == ampujat.length) {
  //  return 'suorittamatta'
  //}
  return 'todo'
}

const naytaKuvaus = (rasti: number) => {
  return SraAmpumakoe.rastikuvaus(rasti)
}

const muotoileOsumakerroin = (hf: number): string => {
  if (hf === 0) {
    return ""
  }
  return "HF " + hf.toFixed(2)
}

/** Onko taulun pisteytys valmis tämän ampuja/rasti suorituksen osalta? */
const taulunPisteytysValmis = (ampuja: string, rasti: number, taulu: number) => {
  if (pisteetStore.rastin5suoritustavat[ampuja] == 'kiv') {
    return (pisteetStore.pisteet[ampuja][rasti].reduce((acc, cur) => acc + Number(cur[taulu]), 0) >= SraAmpumakoe.laukausMaaratKivaarilla[rasti][taulu])
  } else {
    return (pisteetStore.pisteet[ampuja][rasti].reduce((acc, cur) => acc + Number(cur[taulu]), 0) >= SraAmpumakoe.laukausMaaratPistoolilla[rasti][taulu])
  }
}

const peruHylkays = (ampuja: string) => {
  pisteetStore.peruHylkays(ampuja)
}

</script>

<template>

  <main>

    <nav class="rastit">
      <ul>
        <li :key="r" class="rasti" v-for="r in [0,1,2,3,4]" v-bind:class="rastiClasses(rasti, r)">
          <a class="rasti" :href="'/kirjaus/' + r + '/' + ampuja">Rasti {{ r + 1 }}</a>
        </li>
      </ul>
    </nav>

    <nav class="ampujat">
      <ul>
        <li class="ampuja" :key="aid"
            v-for="aid in kierrataJarjestys(Object.keys(pisteetStore.pisteet), rasti)"
            v-bind:class="getClasses(rasti, ampuja, aid)">
          <a :href="'/kirjaus/' + rasti + '/' + aid">{{ lyhennaNimi(aid) }}</a>
        </li>
      </ul>
    </nav>


    <div class="main">


      <div class="ohje" v-if="!(ampuja in pisteetStore.hylkaykset)">
        "{{ ohjeFraasi(rasti, ampuja) }}" <div class="puhu" @click="sano(ohjeFraasi(rasti, ampuja))">🔊</div>
      </div>

      <div class="rastiotsikkopalkki">
        <h2 class="rastiotsikko">Rasti {{ rasti+1 }} / {{ ampuja }} </h2><div class="tulos" v-bind:class="rastinOsumakerroin(ampuja, rasti) >= 1.3 ? 'ok' : 'notok'">{{ muotoileOsumakerroin(rastinOsumakerroin(ampuja, rasti)) }}</div>
      </div>

      <fieldset v-if="rasti === 4">
        <legend>Suoritustapa:</legend>
        <div>
          <input type="radio" id="pist" value="pist" v-model="pisteetStore.rastin5suoritustavat[ampuja]" />
          <label for="pist">Pistooli</label>
          <input type="radio" id="kiv" value="kiv" v-model="pisteetStore.rastin5suoritustavat[ampuja]" />
          <label for="kiv">Kivääri</label>
        </div>
      </fieldset>

      <div class="actions">
        <button v-if="!(ampuja in pisteetStore.hylkaykset)" class="action dq" @click="kirjaaHylkays(ampuja)">Kirjaa hylkäys</button>
        <button v-else @click="peruHylkays(ampuja as string)">Peru hylkäys</button>

        <button class="action" @click="naytaRastiInfo = true">ⓘ Rastikuvaus</button>

        <button v-if="pisteetStore.mute === true" class="action" @click="pisteetStore.mute = false">🔊 Poista mykistys</button>
        <button v-if="pisteetStore.mute === false" class="action" @click="pisteetStore.mute = true">🔇 Mykistä</button>
      </div>

      <div class="rasti-info-tausta" v-if="naytaRastiInfo"></div>
      <div class="rasti-info" v-if="naytaRastiInfo">
        <h2>Rasti {{rasti + 1}}</h2>

        <p>{{naytaKuvaus(rasti)}}</p>

        <div class="rasti-info-painike">
        <button class="close action" @click="naytaRastiInfo = false">Sulje</button>
        </div>
      </div>


      <table class="rasti" :class="{ dq: ampuja in pisteetStore.hylkaykset }">
        <tr>
          <th class="aika" v-bind:class="pisteetStore.getPelaajanRastiAjat(ampuja, rasti)[0] > 0 ? 'ok' : 'notok'">{{ pisteetStore.getPelaajanRastiAjat(ampuja, rasti)[0] > 0 ? '✔' : '⏱' }}</th>
          <td>
            <input onfocus="this.select()" class="sekunnit" v-model="pisteetStore.getPelaajanRastiAjat(ampuja, rasti)[0]" type="number"
                   min="0.00" step="0.01" :disabled="ampuja in pisteetStore.hylkaykset"/>
          </td>
        </tr>
        <tr v-if="rasti in [0, 1]">
          <th class="aika" v-bind:class="pisteetStore.getPelaajanRastiAjat(ampuja, rasti)[1] > 0 ? 'ok' : 'notok'">{{ pisteetStore.getPelaajanRastiAjat(ampuja, rasti)[1] > 0 ? '✔' : '⏱' }}</th>
          <td>
            <input onfocus="this.select()" class="sekunnit" v-model="pisteetStore.getPelaajanRastiAjat(ampuja, rasti)[1]" type="number"
                   min="0.00" step="0.01" :disabled="ampuja in pisteetStore.hylkaykset"/>
          </td>
        </tr>
        <tr v-if="rasti in [0, 1]">
          <th class="aika" v-bind:class="pisteetStore.getPelaajanRastiAjat(ampuja, rasti)[2] > 0 ? 'ok' : 'notok'">{{ pisteetStore.getPelaajanRastiAjat(ampuja, rasti)[2] > 0 ? '✔' : '⏱' }}</th>
          <td>
            <input onfocus="this.select()" class="sekunnit" v-model="pisteetStore.getPelaajanRastiAjat(ampuja, rasti)[2]" type="number"
                   min="0.00" step="0.01" :disabled="ampuja in pisteetStore.hylkaykset"/>
          </td>
        </tr>

      </table>

      <br/>
      <table cellspacing="0" class="rasti" :class="{ dq: ampuja in pisteetStore.hylkaykset }">
        <thead>
        <tr>
          <th class="osumaluokka"></th>
          <th class="taulu" v-bind:class="taulunPisteytysValmis(ampuja, rasti, 0) ? 'ok' : 'notok'"><span>{{  taulunPisteytysValmis(ampuja, rasti, 0) ? '✔' : 'T1' }}</span></th>
          <th class="taulu" v-bind:class="taulunPisteytysValmis(ampuja, rasti, 1) ? 'ok' : 'notok'"><span>{{  taulunPisteytysValmis(ampuja, rasti, 1) ? '✔' : 'T2' }}</span></th>
          <th class="osumat">Osumat</th>
          <th class="pisteet">Pisteet</th>
          <!--        <th class="aika" v-bind:class="pisteetStore.getPelaajanRastiAika(ampuja, rasti) > 0 ? 'ok' : 'notok'">Aika</th>-->
        </tr>
        </thead>
        <tbody>

        <RastiPisteRivi :key="idx" v-for="(osumaluokka, idx) in SraAmpumakoe.osumaluokat" :ampuja="ampuja" :rasti="rasti" :osumaluokka="osumaluokka" />

        <tr>
          <td class="inv"></td>
          <td class="inv"></td>
          <td></td>
          <td></td>
          <td>{{ pisteetStore.getPelaajaRastiPisteSumma(ampuja, rasti) }}</td>
          <!--        <td>{{ (pisteetStore.getPelaajanRastiAika(ampuja, rasti)).toFixed(2) }}-->
          <!--        </td>-->
        </tr>

        </tbody>

      </table>

      <div class="actions">
        <button class="action" @click="$router.push(edellinenLinkki(rasti, ampuja))">Edellinen ampuja</button>
        <!--      <button class="action tuloslista" @click="$router.push('/')">Palaa tuloslistaan</button>-->
        <!--      <button class="action" :disabled="pisteetStore.getRastiSuorituksenTila(ampuja, rasti) != RastiSuorituksenTila.Suoritettu" @click="$router.push(seuraavaLinkki(rasti, ampuja))">Seuraava</button>-->
        <button class="action" @click="$router.push(seuraavaLinkki(rasti, ampuja))">Seuraava ampuja</button>
      </div>
    </div>

  </main>
</template>
<style>

.main {
  margin: 0 .2rem 0 .2rem;
}

label {
  padding-right: 2rem;
  padding-left: .5rem;
}

div.rasti-info-tausta {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
}
div.rasti-info {
  position: relative;
  min-width: 300px;
  width: 80%;
  z-index: 9999;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: #fff;
}



.rastiotsikkopalkki {
  display: flex;
  justify-content: space-between;
  vertical-align: center;
  align-content: center;

  .rastiotsikko {
    color: #222;
  }

  .tulos {
    align-content: center;
    min-width: 4rem;
    padding: .3rem;
  }
  .tulos.ok {
    color: var(--vari1)
  }
  .tulos.notok {
    color: #363636;
  }
}

.ohje {
  font-size: 1em;
  padding: .3rem;
  border-radius: 10px;
  background: #cadbe7;
  color: #224;
  /*max-width: 600px;*/
  width: 85%;
  position: relative;
  margin: .5rem auto;
  font-style: italic;
  text-align: center;
  border: 1px solid #cadbe7
}

.ohje:after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 0;
  height: 0;
  border: 1.618em solid transparent;
  border-right-color: #cadbe7;
  border-left: 0;
  border-top: 0;
  margin-top: -0.809em;
  margin-left: -1.618em;
}

.action.tuloslista::before {
  content: '☰';
  font-size: 200%;
}

.puhu {
  display: inline;
}


/** Ampujien lista pisteytysnäkymässä */

.ampuja.done {
  background-color: #8d8d8d;
  a {
    color: var(--vari2);
    font-size: 180%;
  }
  :before {
    content: '✔';
    color: transparent;
    text-shadow: 0 0 0 green;
    padding-right: .4rem;
  }
}

.ampuja.notdone {
  background-color: var(--vari2);
  a {
    color: var(--vari1);
    display: flex;
    font-size: 180%;
  }
  ::before {
    content: '👤';
    color: transparent;
    text-shadow: 0 0 0 black;
    padding-right: .4rem;
  }
}

.ampuja.incomplete {
  background-color: #8a8a8a;
  a {
    display: flex;
    font-size: 180%;
  }
  ::before {
    content: '⚠';
    color: transparent;
    text-shadow: 0 0 0 #d20c0c;
    padding-right: .4rem;
  }
}

.ampuja.dq {
  background-color: #8a8a8a;
  color: #666;
  a {
    display: flex;
    font-size: 180%;
  }
  ::before {
    content: '🚫';
    color: transparent;
    text-shadow: 0 0 0 #754444;
    padding-right: .4rem;
  }
}

.ampuja.active {
  background-color: #ffffff;
  box-shadow: 2px 2px 3px #777;
  a {
    color: #606060;
    font-weight: bold;
    display: flex;
    font-size: 180%;
  }
  ::before {
    content: '🔫';
    color: transparent;
    text-shadow: 0 0 0 black;
    padding-right: .4rem;
  }
}

.ampuja.active.dq {
  background-color: #ffffff;
  box-shadow: 2px 2px 3px #777;
  a {
    color: #606060;
    font-weight: bold;
    display: flex;
    font-size: 180%;
  }
  ::before {
    content: '🚫';
    color: transparent;
    text-shadow: 0 0 0 darkred;
    padding-right: .4rem;
  }
}



nav {
  display: flex;
}

/* http://tarangchokshi.weebly.com/blog/how-to-create-flat-style-breadcrumb-links-with-css */
nav.rastit {
  ul {
    margin: auto;
    width: 100%;
    padding: 0;
  }
  ul li {
    display: inline-block;
    a {
      width: 3.9rem;
      padding: .2rem .4rem 0 .9rem;
    }
  }
  ul li.done a {
    display: flex;
    float: left;
    height: 30px;
    background-color: #777;
    color: var(--vari2);
    text-align: center;

    white-space: nowrap;
    position: relative;
    font-size: 95%;
    text-decoration: none;
    margin: 0 6px 0 0;
    font-weight: bold;
  }
  ul li.done a:after {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 10px solid #777;
    position: absolute;
    right: -9px;
    top: 0;
    z-index: 10;
  }

  ul li.todo a {
    display: flex;
    float: left;
    height: 30px;
    background-color: var(--vari2);
    text-align: center;
    white-space: nowrap;
    position: relative;
    font-size: 95%;
    text-decoration: none;
    margin: 0 6px 0 0;
    color: var(--vari1);
    font-weight: bold;
  }
  ul li.todo a:after {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 10px solid var(--vari2);
    position: absolute;
    right: -9px;
    top: 0;
    z-index: 10;
  }

  ul li.active a {
    display: flex;
    float: left;
    height: 30px;
    background-color: white;
    text-align: center;
    white-space: nowrap;
    position: relative;
    font-size: 95%;
    text-decoration: none;
    margin: 0 6px 0 0;
    color: var(--vari1);
    font-weight: bold;
  }
  ul li.active a:after {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 10px solid white;
    position: absolute;
    right: -9px;
    top: 0;
    z-index: 10;
  }
  ul li a:before {
    content: "";
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 10px solid var(--vari1);
    position: absolute;
    left: -0px;
    top: 0;
    z-index: 5;
  }
  ul li:first-child a {
    width: 3.4rem;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  ul li:first-child a:before {
    display: none;
  }
  ul li:last-child a {
    padding-right: 20px;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  ul li:last-child a:after {
    display: none;
  }
  ul li a:hover {
    background: rgba(200,200,200,0.5);
    transition: 0.4s;
  }
  ul li a:hover:after {
    border-left-color: rgba(200,200,200,0.5);
    transition: 0.4s;
  }
}
nav.ampujat {
  ul {
    li {
      display: inline-block;
      margin: .1rem;
    }
  }
}




span.active {
  background: white;
  color: #262626;
}
span.inactive {
  background: #546552;
  color: #8f9d8f;
}

table.rasti {
  border-radius: .3rem;
  background: var(--vari2);
  color: #222;
  width: 100%;
  td {
    background: rgba(255,255,255,0.5);
    text-align: center;
  }
}

th {
  font-size: 140%;
  background-color: var(--vari2);
}


th.osumaluokka {
  width: 10%;
}
th.taulu {
  width: 20%;
  height: 60px;
  vertical-align: bottom;

  background : url("../assets/logo.svg");
  background-size: 40%;
  background-repeat: no-repeat;
  background-position: top;
  background-color: var(--vari2);
  &.ok {
    span {
      color: darkgreen;
      font-weight: bold;
    }
  }
  &.notok {
    span {
      color: #4d4032;
      font-weight: normal;

    }
  }
}
th.osumat {
  width: 8%;
  font-size: 100%;
}
th.pisteet {
  width: 8%;
  font-size: 100%;
}
th.aika {
  width: 24%;
}


th.aika {
  padding: .3rem;
}

th.aika.ok {
  padding: .3rem;
  background-color: var(--vari2);
  color: darkgreen;
  font-size: 140%;
  transition: 1s;
  span {
    color: darkgreen;
  }
}

input.sekunnit {
  width: 5rem;
  background: #fff9d6;
  border: none;
  text-align: right;
  font-size: 130%;
  height: 1.5rem;
}

.actions {
  margin-bottom: .4rem;
}

.rasti.dq {
  background-color: #c7c7c7;
  tr { background-color: #c7c7c7; }
  th {background-color: #c7c7c7;}
  td {
    background-color: #c7c7c7;
    input { background-color: #c7c7c7; }
  }
}

.rasti-info-painike {
  margin-top: 1rem;
  text-align: right;
}



</style>

<script setup lang="ts">
import {onMounted, ref, watch} from 'vue'
import {usePisteetStore} from '@/stores/pisteet'
import {useRoute} from 'vue-router'
import {UserSquare} from '@iconoir/vue';
import {SraAmpumakoe} from "@/classes/SraAmpumakoe";
import {PdfPoytakirja} from "@/classes/PdfPoytakirja";
import pako from 'pako';

import QRCode from 'qrcode'

const route = useRoute()

const qrCanvas = ref<HTMLCanvasElement | null>(null)

/**
 * Koostetaan tuloskortin tiedot joko
 * - sovelluksen Pinia-taltiosta jos tuloskortille on navigoitu Tuloslistan kautta
 * - HTTP GET -parametrin d arvosta, joka on pakattu base64-koodattu JSON-tietorakenne
 */
function koostaData(ampuja: string | undefined, encoded: string | undefined): Korttidata {

  if (ampuja == null && encoded == null) {
    console.log("Ei ampujan tietoja saatavilla!")
    return null
  }

  if (ampuja == null) {
    return JSON.parse(decodeData(encoded)) as Korttidata
  } else {
    return {
      "n": ampuja,
      "dl": pisteetStore.getAikaJaPaikka(),
      "r": [
        pisteetStore.getAmpujaRastiLuokkaOsumat(ampuja, 0),
        pisteetStore.getAmpujaRastiLuokkaOsumat(ampuja, 1),
        pisteetStore.getAmpujaRastiLuokkaOsumat(ampuja, 2),
        pisteetStore.getAmpujaRastiLuokkaOsumat(ampuja, 3),
        pisteetStore.getAmpujaRastiLuokkaOsumat(ampuja, 4)
      ],
      "a": [
        pisteetStore.getAmpujanRastiAika(ampuja, 0),
        pisteetStore.getAmpujanRastiAika(ampuja, 1),
        pisteetStore.getAmpujanRastiAika(ampuja, 2),
        pisteetStore.getAmpujanRastiAika(ampuja, 3),
        pisteetStore.getAmpujanRastiAika(ampuja, 4)
      ],
      "h": pisteetStore.getHylkaysperuste(ampuja),
      "tn": pisteetStore.getTuomariNimi(),
      "tno": pisteetStore.getTuomariNumero()
    } as Korttidata
  }
}

onMounted(async () => {
  if (!qrCanvas.value) return
  try {
    await QRCode.toCanvas(qrCanvas.value, qrurli, {
      errorCorrectionLevel: 'M', // virheenkorjaustaso
      width: 300,
      margin: 2
    })
  } catch (err) {
    console.error('Failed to generate QR code:', err)
  }
})

interface Korttidata {
  n: string
  dl: string
  r: Array<Array<number>>
  a: Array<number>
  h: string
  tn: string
  tno: string
}

// const data: string | undefined = route.query.d as string | undefined

const pisteetStore = usePisteetStore()

let ampuja : string = (route.params.ampuja) ? route.params.ampuja as string : null

const encoded = route.query.d as string | undefined

const data : Korttidata = koostaData(ampuja, encoded) as Korttidata

const qrurli = "http://localhost:5173/sra-koe/ampuja?d=" + encodeData(JSON.stringify(data))

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

const muotoileOsumat = (asdf: Array<number>) : string => {
  let tulos = ""
  if (asdf[0] as number > 0) { tulos = tulos.concat(asdf[0] + 'A') }
  if (asdf[1] as number > 0) { tulos = tulos.concat(" " + asdf[1] + 'C') }
  if (asdf[2] as number > 0) { tulos =tulos.concat(" " + asdf[2] + 'D') }
  if (asdf[3] as number > 0) { tulos =tulos.concat(" " + asdf[3] + 'M') }
  if (asdf[4] as number > 0) { tulos =tulos.concat(" " + asdf[4] + 'R') }
  return tulos
}

const muotoileHF = (hf: number) : string => (!isNaN(hf) && hf != Infinity ) ? hf.toFixed(2) : ""

const muotoileAika = (aika: number) : string => aika > 0 ? aika.toFixed(2) + " s" : ""


const muotoileTulos = (data: any) => {
  if (data.h != null) {
    return "HYLÄTTY"
  }
  if (!koeValmis(data)) {
    return "KESKEN"
  }
  if (osumaKerroin(data) >= SraAmpumakoe.vaadittuOsumakerroin) {
    return "HYVÄKSYTTY"
  }
}


const koeValmis = (data: any): boolean => {
  // Hylätty: valmis
  if (data.h != null) {
    return true
  }
  // Rastilta puuttuu aika: ei valmis
  else if (data.a.find(aika => aika == 0) != null) {
    return false
  }
  // Alle 40 pisteytettyä osumaa: ei valmis
  else if (data.r[0].map((_, colIndex) => data.r.reduce((sum, row) => sum + (row[colIndex] ?? 0), 0)).reduce((acc, n) => acc + n, 0) < 40) {
    return false
  }
  return true
}

function osumaKerroin(data: any) {
  return pisteet(data.r[0].map((_, colIndex) => data.r.reduce((sum, row) => sum + (row[colIndex] ?? 0), 0))) / data.a.reduce((sum, val) => sum + val, 0)
}

function encodeData(obj: Korttidata): string {
  const json = JSON.stringify(obj)
  const compressed = pako.deflate(json)
  const base64 = window.btoa(
      String.fromCharCode(...compressed)
  )
  // URL-turvallinen base64
  return base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
}

function decodeData<T = unknown>(encoded: string): Korttidata {
  const padded = encoded.padEnd(encoded.length + (4 - encoded.length % 4) % 4, '=')
  // URL-turvallinen to standard Base64
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/')
  const binary = window.atob(base64)
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
  const json = pako.inflate(bytes, { to: 'string' })
  return JSON.parse(json) as Korttidata
}

function pisteet(osumat : Array<number>): number {
  return Math.max(0, 5*osumat[0] + 3*osumat[1] + osumat[2] - 10*osumat[3] -10*osumat[4])
}

async function kopioLinkki(link: string) {
  await navigator.clipboard.writeText(
      link
  )
}

</script>

<template>

  <main>

    <div class="main">

      <h2 class="tuloskorttiotsikko">Tuloskortti</h2>
      <div class="paivajapaikka">
        {{ data.dl }}
      </div>
      <div class="nimikortti">
        <UserSquare width="4rem" height="4rem" color="#888"/><h1>{{ ampuja != null ? ampuja : data.n }}</h1>
      </div>

      <table class="tuloskortti">
        <thead>
        <tr>
          <th>Rasti</th><th>Osumat</th><th>Pisteet</th><th>Aika</th><th title="Osumakerroin: pisteet jaettuna ajalla (sekunnit).">HF</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="rasti in [0,1,2,3,4]" :key="rasti" class="rasti">
          <th>{{rasti+1}}</th>
          <td>
            <span>
              {{ muotoileOsumat(data.r[rasti])}}
            </span>
          </td>
          <td>
            <span>
            {{ pisteet(data.r[rasti]) }}

            </span>
          </td>

          <td>
            <span>
            {{ muotoileAika(data.a[rasti]) }}
            </span>
          </td>
          <td>
            <span>
              {{ muotoileHF(pisteet(data.r[rasti]) / data.a[rasti]) }}
            </span>
          </td>
        </tr>
        <tr class="yhteensa">
          <th>Yht.</th>
          <td>{{ muotoileOsumat(data.r[0].map((_, colIndex) => data.r.reduce((sum, row) => sum + (row[colIndex] ?? 0), 0))) }}</td>
          <td>{{ pisteet(data.r[0].map((_, colIndex) => data.r.reduce((sum, row) => sum + (row[colIndex] ?? 0), 0))) }}</td>
          <td>{{ muotoileAika(data.a.reduce((sum, val) => sum + val, 0)) }}</td>
          <td>{{ muotoileHF(osumaKerroin(data)) }}</td>
        </tr>
        <tr>
          <th colspan="3">Tulos</th><td colspan="2">
          <span id="tulos" v-bind:class="muotoileTulos(data)">
          {{ muotoileTulos(data) }}
          </span>
        </td>
        </tr>
        <tr v-if="data.h != null && data.h != ''">
          <th colspan="3">Hylkäyksen syy</th>
          <td colspan="2">
            {{ data.h }}
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="koeValmis(data)" class="tuomarileima">
        <div v-if="data.tn">{{ data.tn }}</div>
        <div v-if="data.tno">SRA-tuomari {{ data.tno }}</div>
      </div>

      <table class="kurssitiedot" v-if="ampuja != null">
        <tbody>
        <tr>
          <th>Syntymäaika</th>
          <td><input type="date" :value="pisteetStore.syntymaajat[ampuja]" @change="event => pisteetStore.asetaSyntymaaika(ampuja, event.target.value)" /></td>
        </tr>
        <tr>
          <th>SRA kurssin numero tai muu tunniste</th>
          <td><input :value="pisteetStore.kurssinumerot[ampuja]" @change="event => pisteetStore.asetaKurssinumero(ampuja, event.target.value)"/></td>
        </tr>
        <tr>
          <th>RU/RES/MPKL yhdistys</th>
          <td><input :value="pisteetStore.yhdistykset[ampuja]" @change="event => pisteetStore.asetaYhdistys(ampuja, event.target.value)"/></td>
        </tr>
        </tbody>
      </table>

      <button v-if="ampuja != null" @click="(new PdfPoytakirja()).luoPdf(ampuja as string, pisteetStore)">PDF-pöytäkirja</button>
    </div>

    <div class="qrcode" v-if="ampuja == null || koeValmis(data)">
      <canvas ref="qrCanvas"></canvas>
    </div>
    <div>Voit jakaa tuloskortin tämän QR-koodin avulla (tulostiedot sisältyvät QR-koodiin).</div>

    <button @click="kopioLinkki(qrurli)">Copy link</button>

    <a :href="qrurli">Linkki</a> tähän tuloskorttiin.

  </main>

</template>

<style>

.kurssitiedot {
  margin-top: 1rem;
}

a {
  color: black;
}

</style>

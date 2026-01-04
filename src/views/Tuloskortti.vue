<script setup lang="ts">
import {onMounted, ref } from 'vue'
import {useRoute} from 'vue-router'
import {SraAmpumakoe} from "@/classes/SraAmpumakoe";
import { UserSquare, ShareAndroid, Copy  } from '@iconoir/vue'

import pako from 'pako';

import QRCode from 'qrcode'

const route = useRoute()

const qrCanvas = ref<HTMLCanvasElement | null>(null)

/**
 * Koostetaan tuloskortin tiedot joko
 * - sovelluksen Pinia-taltiosta jos tuloskortille on navigoitu Tuloslistan kautta
 * - HTTP GET -parametrin d arvosta, joka on pakattu base64-koodattu JSON-tietorakenne
 */
function koostaData(encoded: string | null): Korttidata | null {
  if (encoded == null) {
    return null
  }
  try {
    return puraKoodaus(encoded) as Korttidata
  } catch (err) {
    console.error('Tulostietojen tulkitseminen epäonnistui - onko linkki kopioitu virheellisesti?', err)
    return null
  }

}

onMounted(async () => {
  if (!qrCanvas.value) return
  try {
    await QRCode.toCanvas(qrCanvas.value, qrKoodiUrl, {
      errorCorrectionLevel: 'M', // virheenkorjaustaso
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


const base64Tiedot = route.query.d as string | undefined

const data : Korttidata | null = koostaData(base64Tiedot)

const qrKoodiUrl = window.location.href

const muotoileOsumat = (osumat: Array<number>) : string => {
  let tulos = ""
  if (osumat[0] as number > 0) { tulos = tulos.concat(osumat[0] + 'A') }
  if (osumat[1] as number > 0) { tulos = tulos.concat(" " + osumat[1] + 'C') }
  if (osumat[2] as number > 0) { tulos =tulos.concat(" " + osumat[2] + 'D') }
  if (osumat[3] as number > 0) { tulos =tulos.concat(" " + osumat[3] + 'M') }
  if (osumat[4] as number > 0) { tulos =tulos.concat(" " + osumat[4] + 'R') }
  return tulos
}

const muotoileHF = (hf: number) : string => (!isNaN(hf) && hf != Infinity ) ? hf.toFixed(2) : ""

const muotoileAika = (aika: number) : string => aika > 0 ? aika.toFixed(2) + " s" : ""

const muotoileTulos = (data: Korttidata) => {
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

const koeValmis = (data: Korttidata): boolean => {
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

function osumaKerroin(data: Korttidata) {
  return pisteet(data.r[0].map((_, colIndex) => data.r.reduce((sum, row) => sum + (row[colIndex] ?? 0), 0))) / data.a.reduce((sum, val) => sum + val, 0)
}

function puraKoodaus<T = unknown>(encoded: string): Korttidata {
  const padded = encoded.padEnd(encoded.length + (4 - encoded.length % 4) % 4, '=')
  // URL-turvallinen to standard Base64
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/')
  const binary = window.atob(base64)
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
  const json = pako.inflate(bytes, { to: 'string' })
  return JSON.parse(json as string) as Korttidata
}

function pisteet(osumat : Array<number>): number {
  // Ei lasketa pisteitä jos yhtäkään osumaa ei ole kirjattu tämän rastin osalta
  if (osumat.filter(a => a === 0).length == 6) {
    return ""
  }
  return Math.max(0, 5*osumat[0] + 3*osumat[1] + osumat[2] - 10*osumat[3] -10*osumat[4])
}

const kopioiLinkki = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
  } catch {
    prompt('Kopioi tämä linkki:', window.location.href)
  }
}

const jaaSivu = async () => {
  const shareData = {
    title: document.title,
    text: 'SRA-ampumakokeen tuloskortti',
    url: window.location.href
  }
  if (navigator.share) {
    try {
      await navigator.share(shareData)
    } catch (err) {
      // käyttäjä peruu jaon
    }
  } else {
    await kopioiLinkki()
  }
}

const jakoTuettu = !!navigator.share

onMounted(() => {
  document.title = (data?.n != undefined ? data.n + " - ":  "") + 'SRA-ampumakokeen tuloskortti'
})

</script>

<template>

  <main>

    <p class="virheellinenlinkki" v-if="data == null">
      Linkin tulostietojen käsittely ei onnistunut. Onko linkki kopioitu oikein?
    </p>

    <div v-if="data != null" class="main">

      <h1 class="tuloskorttiotsikko1"><a href="/">SRA Ampumakoe</a></h1>
      <h2 class="tuloskorttiotsikko2">Tuloskortti</h2>
      <div class="paivajapaikka">
        {{ data.dl }}
      </div>
      <div class="nimikortti">
        <UserSquare width="4rem" height="4rem" color="#888"/><h1>{{ data.n }}</h1>
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

      <div v-if="koeValmis(data) && (data.tn != '' || data.tno != '')" class="tuomarileima">
        <div v-if="data.tn">{{ data.tn }}</div>
        <div v-if="data.tno">SRA-tuomari {{ data.tno }}</div>
      </div>


    </div>

    <div v-if="data != null && koeValmis(data)" class="qrcodecontainer">
      <canvas id="qrcode" ref="qrCanvas" title=""></canvas>

      <div class="actions">
        <button v-if=jakoTuettu @click="jaaSivu" class="action">
          <ShareAndroid /><span>Jaa</span>
        </button>

        <button @click="kopioiLinkki" class="action">
          <Copy /><span>Kopioi linkki</span>
        </button>
      </div>
    </div>

    <div v-if="data != null && koeValmis(data)" class="eitallenneta">
      Tulostietoja ei tallenneta palvelimelle. Tällä sivulla esitetyt tulostiedot on sisällytetty QR-koodin linkin
      tietoihin.
    </div>

    <div class="footer">
      <a href="/">SRA-koe sovellus</a>
    </div>

  </main>

</template>


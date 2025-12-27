<script setup lang="ts">
import { watch } from 'vue'
import { usePisteetStore } from '@/stores/pisteet'
import { useRoute } from 'vue-router'
import { UserSquare  } from '@iconoir/vue';
import { SraAmpumakoe} from "@/classes/SraAmpumakoe";
import { PdfPoytakirja } from "@/classes/PdfPoytakirja";

const route = useRoute()

// const data: string | undefined = route.query.d as string | undefined

const pisteetStore = usePisteetStore()

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

const muotoileOsumat = (asdf: Array<number>) : string => {
  let tulos = ""
  if (asdf[0] as number > 0) { tulos = tulos.concat(asdf[0] + 'A') }
  if (asdf[1] as number > 0) { tulos = tulos.concat(" " + asdf[1] + 'C') }
  if (asdf[2] as number > 0) { tulos =tulos.concat(" " + asdf[2] + 'D') }
  if (asdf[3] as number > 0) { tulos =tulos.concat(" " + asdf[3] + 'M') }
  if (asdf[4] as number > 0) { tulos =tulos.concat(" " + asdf[4] + 'P') }
  return tulos
}

const muotoileHF = (hf: number) : string => !isNaN(hf) ? hf.toFixed(2) : ""

const muotoileAika = (aika: number) : string => aika > 0 ? aika.toFixed(2) + " s" : ""

const rastiSuoritettu = (ampuja: string, rasti: number) : boolean => pisteetStore.rastiSuoritettu(ampuja,rasti)

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

</script>

<template>

  <main>
    <div class="main">

      <b>Tuloskortti</b>
      <div class="nimikortti">
        <UserSquare width="4rem" height="4rem" color="#888"/><h1>{{ ampuja }}</h1>
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
            <span v-if="rastiSuoritettu(ampuja, rasti)">
              {{ muotoileOsumat(pisteetStore.getAmpujaRastiLuokkaOsumat(ampuja, rasti)) }}
            </span>
          </td>
          <td>
            <span v-if="rastiSuoritettu(ampuja, rasti)">
            {{ pisteetStore.getAmpujaRastiPisteSumma(ampuja, rasti) }}

            </span>
          </td>

          <td>
            <span v-if="rastiSuoritettu(ampuja, rasti)">
            {{ muotoileAika(pisteetStore.getAmpujanRastiAika(ampuja, rasti)) }}
            </span>
          </td>
          <td>
            <span v-if="rastiSuoritettu(ampuja, rasti)">
              {{ muotoileHF(pisteetStore.getAmpujaRastiPisteSumma(ampuja, rasti) /  pisteetStore.getAmpujanRastiAika(ampuja, rasti)) }}
            </span>
          </td>
        </tr>
        <tr class="yhteensa">
          <th>Yht.</th>
          <td>{{ muotoileOsumat(pisteetStore.getAmpujanOsumatLuokittain(ampuja)) }}</td>
          <td>{{ pisteetStore.getAmpujanPisteSumma(ampuja) }}</td>
          <td>{{ muotoileAika(pisteetStore.getAmpujanAikaSumma(ampuja)) }}</td>
          <td>{{ muotoileHF(pisteetStore.getAmpujanOsumakerroin(ampuja)) }}</td>
        </tr>
        <tr>
          <th colspan="3">Tulos</th><td colspan="2">
          <span id="tulos" v-bind:class="muotoileTulos(pisteetStore.getKaikkiRastitSuoritettu(ampuja as string), pisteetStore.getAmpujanOsumakerroin(ampuja as string), ampuja as string)">
          {{
              muotoileTulos(pisteetStore.getKaikkiRastitSuoritettu(ampuja as string), pisteetStore.getAmpujanOsumakerroin(ampuja as string), ampuja as string)
            }}
          </span>
        </td>
        </tr>
        <tr v-if="pisteetStore.getHylkaysperuste(ampuja) != null">
          <th colspan="3">Hylkäyksen syy</th>
          <td colspan="2">
            {{ pisteetStore.getHylkaysperuste(ampuja) }}
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </main>

  <table class="kurssitiedot">
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

  <button @click="(new PdfPoytakirja()).luoPdf(ampuja as string, pisteetStore)">PDF-pöytäkirja</button>

</template>

<style>

.nimikortti {
  display: flex;
  align-items: center;
}

.tuloskortti {
  margin-bottom: 1rem;
}

.kurssitiedot {
  margin-top: 1rem;
}

</style>

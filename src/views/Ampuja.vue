<script setup lang="ts">
import {usePisteetStore} from '@/stores/pisteet'
import {useRoute} from 'vue-router'
import {Prohibition, Undo, User} from '@iconoir/vue';
import {PdfPoytakirja} from "@/classes/PdfPoytakirja";
import {kirjaaHylkays,peruHylkays,jakoData,koodaaTiedot} from "@/classes/Util";
import {ShareAndroid} from "@iconoir/vue";

const route = useRoute()

const pisteetStore = usePisteetStore()

let ampuja : string = (route.params.ampuja) ? route.params.ampuja as string : null

</script>

<template>

  <main>

    <div class="main">

      <div class="nimikortti">
        <User width="4rem" height="4rem" color="#888"/><h1>{{ ampuja }}</h1>
      </div>

      <p>Koetuloksen PDF-pöytäkrijalle tulostettavat (valinnaiset) lisätiedot.</p>

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


      <div v-if="pisteetStore.hylkaykset[ampuja] != null" class="dqsyy">
        Hylkäyksen syy:
        {{ pisteetStore.hylkaykset[ampuja] }}
      </div>

      <div class="tuloskorttilinkki">
        <a :href="'../tulos?d=' + koodaaTiedot(jakoData(ampuja as string, pisteetStore))">
        Tuloskortti »
        </a>
      </div>

      <div class="actions">
        <button v-if="!(ampuja in pisteetStore.hylkaykset)" class="action dq" @click="kirjaaHylkays(pisteetStore, ampuja)"><Prohibition/> Kirjaa hylkäys</button>
        <button v-else @click="peruHylkays(pisteetStore, ampuja as string)" class="action"><Undo/> Peru hylkäys</button>
        <button class="action" v-if="ampuja != null" @click="(new PdfPoytakirja()).luoPdf(ampuja as string, pisteetStore, '../')">PDF-pöytäkirja</button>
      </div>
    </div>

  </main>

</template>

<style>

.kurssitiedot {
  margin-top: 1rem;
}

</style>

<template>
  <tr class="tulosrivi">
    <th class="osumaluokka">{{ props.osumaluokka }}</th>
    <td class="kuulakarkikyna">{{ osumaLkmTaulu0 > 0 ?  osumaLkmTaulu0 : "" }}</td>
    <td class="kuulakarkikyna">{{ osumaLkmTaulu1 > 0 ? osumaLkmTaulu1 : "" }}</td>
    <td class="kuulakarkikyna">{{ osumaSumma(pisteetStore.pisteet[props.ampuja][props.rasti], SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka)) > 0 ? osumaSumma(pisteetStore.pisteet[props.ampuja][props.rasti], SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka)) : "" }}</td>
    <td class="kuulakarkikyna">{{ pisteSumma(pisteetStore.pisteet[props.ampuja][props.rasti], SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka)) > 0 ? pisteSumma(pisteetStore.pisteet[props.ampuja][props.rasti], SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka)) : "" }}</td>
    <td class="kuulakarkikyna"><span class="vaihe" v-if="props.rasti < 2 && SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka) < 3">{{ SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka) }}</span>
      {{
        pisteetStore.getAmpujanRastiaAjat(props.ampuja, props.rasti)[SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka)] > 0 ? pisteetStore.getAmpujanRastiaAjat(props.ampuja, props.rasti)[SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka)] : ""
      }}
    </td>
  </tr>

</template>

<script setup lang="ts">
import { usePisteetStore } from '@/stores/pisteet'
import {SraAmpumakoe} from "@/classes/SraAmpumakoe";
import {computed} from "vue";

const pisteetStore = usePisteetStore()

interface Props {
  ampuja: string,
  rasti: number,
  osumaluokka: string
}
const props = defineProps<Props>()

const osumaLkmTaulu0 = computed( () =>  {
    return pisteetStore.pisteet[props.ampuja][props.rasti][SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka)][0]
  })
const osumaLkmTaulu1 = computed( () =>  {
    return pisteetStore.pisteet[props.ampuja][props.rasti][SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka)][1]
  })


const osumaSumma = (pist: Array<Array<number>>, luokkaIdx: number) : number => {
  return pist[luokkaIdx].reduce((a, b) => Number(a) + Number(b), 0)
}

const pisteSumma = (pist: Array<Array<number>>, luokkaIdx: number) : number => {

  switch (luokkaIdx) {
      // A
    case 0:
      return 5 * osumaSumma(pist, luokkaIdx)
      // C
    case 1:
      return 3 * osumaSumma(pist, luokkaIdx)
      // D
    case 2:
      return osumaSumma(pist, luokkaIdx)
      // Ohi ja Rangaistus
    case 3:
    case 4:
      return -10 * osumaSumma(pist, luokkaIdx)
  }
  return 0
}

</script>

<style scoped>


.tulosrivi {
  height: 1.5rem;
}

.osumaluokka {
  border: 2px solid black;
  font-size: 85%;
}


.kuulakarkikyna {
  border: 2px solid black;
  text-align: center;
  font-family: sans-serif;
  font-weight: bolder;
  color: #2a2aab;
  font-size: 100%;
}

th {
  font-weight: bold;
}

.vaihe {
  background-color: #8f9d8f;
  position: relative;

}

</style>
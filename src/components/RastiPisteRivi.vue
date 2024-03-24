<script setup lang="ts">
import { usePisteetStore } from '@/stores/pisteet'
import { SraAmpumakoe } from "@/classes/SraAmpumakoe"
import OsumaLaskuri from "@/components/OsumaLaskuri.vue"


const pisteetStore = usePisteetStore()

interface Props {
  ampuja: string,
  rasti: number,
  osumaluokka: string
}
const props = defineProps<Props>()

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


<template>
  <tr>
    <td>{{ props.osumaluokka }}</td>
    <td>
      <OsumaLaskuri :ampuja="ampuja" :rasti="rasti" :osumaluokka="props.osumaluokka" :taulu="0" />
    </td>
    <td>
      <OsumaLaskuri :ampuja="ampuja" :rasti="rasti" :osumaluokka="props.osumaluokka" :taulu="1" />
    </td>
    <td>{{ osumaSumma(pisteetStore.pisteet[props.ampuja][props.rasti], SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka)) }}</td>
    <td>{{ pisteSumma(pisteetStore.pisteet[props.ampuja][props.rasti], SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka)) }}</td>
<!--    <td>-->
<!--      <div class="nowrap">-->
<!--      <div class="vaihe" v-if="props.rasti < 2 && SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka) < 3">-->
<!--        {{SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka)+1}}</div><input v-if="props.osumaluokka == 'A'-->
<!--        || (props.rasti < 2 && SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka) < 3)"-->
<!--                                                                              class="sekunnit"-->
<!--                                                                              v-model="pisteetStore.getPelaajanRastiAjat(props.ampuja, props.rasti)[SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka)]"-->
<!--                                                                              type="number" min="0.00" step="0.01" :disabled="ampuja in pisteetStore.hylkaykset"/>-->
<!--      </div>-->
<!--    </td>-->
  </tr>

</template>

<style scoped>

.nowrap {
  white-space: nowrap;
}



div.vaihe {
  border-radius: 50%;
  background: #727272;
  color: #dddddd;

  display: inline-block;
  font-size: 80%;

  vertical-align: middle;
  text-align: center;

  width: 1.1rem;
  height: 1.1rem;

  margin-right: .1rem;

}
td {
  background: #eee8d2;
  text-align: center;
}

</style>
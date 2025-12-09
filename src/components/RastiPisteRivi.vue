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
  </tr>

</template>

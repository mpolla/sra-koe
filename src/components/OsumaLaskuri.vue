<script setup lang="ts">
import { usePisteetStore } from '@/stores/pisteet'
import {SraAmpumakoe} from "@/classes/SraAmpumakoe";
import {computed} from "vue";

const pisteetStore = usePisteetStore()

interface Props {
  ampuja: string,
  rasti: number,
  osumaluokka: string,
  taulu: number
}
const props = defineProps<Props>()

const synth = window.speechSynthesis;

const minOsumat = 0

/** Tämän osumaluokan (A/C/D/Ohi/Rang) lukumäärät tässä taulussa. */
const osumaLkm = computed({
  get() {
    return pisteetStore.pisteet[props.ampuja][props.rasti][SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka)][props.taulu]
  },
  set(newValue: number) {
    pisteetStore.pisteet[props.ampuja][props.rasti][SraAmpumakoe.osumaluokat.indexOf(props.osumaluokka)][props.taulu] = newValue
  }
})

/** Rangaistuksien lukumäärä tämän taulun osalta. */
const rangLkm = computed({
  get() {
    return pisteetStore.pisteet[props.ampuja][props.rasti][SraAmpumakoe.osumaluokat.indexOf('Rang')][props.taulu]
  },
  set(newValue: number) {
    pisteetStore.pisteet[props.ampuja][props.rasti][SraAmpumakoe.osumaluokat.indexOf('Rang')][props.taulu] = newValue
  }
})

const maxOsumat = computed(() => {
  // Rangaistuksilla ei ole varsinaista maksimimäärää
  if (props.osumaluokka == 'Rang') {
    return 100
  }
  if (pisteetStore.rastin5suoritustavat[props.ampuja] == 'kiv') {
    return SraAmpumakoe.laukausMaaratKivaarilla[props.rasti][props.taulu] - (pisteetStore.pisteet[props.ampuja][props.rasti]
        .reduce((acc, cur) => acc + Number(cur[props.taulu]), 0) - osumaLkm.value - rangLkm.value)
  } else {
    return SraAmpumakoe.laukausMaaratPistoolilla[props.rasti][props.taulu] - (pisteetStore.pisteet[props.ampuja][props.rasti]
        .reduce((acc, cur) => acc + Number(cur[props.taulu]), 0) - osumaLkm.value - rangLkm.value)
  }
})

const sano = (s: any) => {
  const utterThis = new SpeechSynthesisUtterance(s)
  utterThis.lang = "fi-FI";
  synth.speak(utterThis);
}

const miinus = () => {
  if (osumaLkm.value > minOsumat) {
    osumaLkm.value--
    sano("eiku")
  }
}

const plus = () => {
  if (osumaLkm.value < maxOsumat.value || props.osumaluokka == 'Rang') {
    osumaLkm.value++
    sano(SraAmpumakoe.osumaLuokatLausuttuna(props.osumaluokka))
  }
}

</script>

<template>
<div class="osumalaskuri">
  <button @click="miinus()" :disabled="osumaLkm === minOsumat || ampuja in pisteetStore.hylkaykset">-</button>
  <input class="osumat" v-model="osumaLkm" type="number" :disabled="ampuja in pisteetStore.hylkaykset" />
  <button @click="plus()" :disabled="(osumaluokka != 'Rang' && osumaLkm >= maxOsumat) || ampuja in pisteetStore.hylkaykset">+</button>
</div>
</template>

<style scoped>

/* Osumien +/- painikket aina samalla rivillä. */
.osumalaskuri {
  white-space: nowrap;
}

button {
  width: 1.9rem;
  height: 1.9rem;
}

button:disabled {
  color: #999;
}

input.osumat {
  width: 2.5rem;
  height: 2.0rem;
  font-size: 120%;
  background: #fff9d6;
  border: none;
  text-align: center;
}


/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  appearance: textfield;
  -moz-appearance: textfield;
}

</style>
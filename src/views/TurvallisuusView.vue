<script setup lang="ts">

import { usePisteetStore } from '@/stores/pisteet'

const pisteetStore = usePisteetStore()

//const saannotChecked : boolean = false

</script>


<template>
  <h1>Turvallisuus</h1>
  <p>
    Turvallisen aseen käsittelyn säännöt
    Kaikessa aseen käytössä on noudatettava seuraavia turvallisen aseenkäsittelyn sääntöjä:
  </p>
  <ol>
    <li><b>Asetta on aina käsiteltävä kuin se olisi ladattu</b>.
      Ei ole merkitystä, onko ase ladattu tai onko ase toimimaton käsittelyase, käsitte-
      lyn on aina oltava samanlaista.</li>
    <li>Piippukontrolli, <b>aseen piipun on aina osoitettava turvalliseen suuntaan</b>.
      "Laser-sääntö", aseella ei saa koskaan osoittaa mitään sellaista, jota ei halua
      tuhota.</li>
    <li>Sormivarmistus, <b>sormi pidetään pois liipaisimelta ennen ampumapäätöstä</b>.
      Liipaisinsormi on pidettävä tietoisesti aseen rungolla. Sormi laitetaan liipaisimelle
      vasta, kun on tehty tietoinen ampumapäätös.</li>
    <li><b>Tunnista maali ja varmista tausta</b>.
      Maali on aina tunnistettava ennen kuin sitä ammutaan. Maalin takana ei saa olla
      omia taistelijoita tai sivullisia.</li>
  </ol>

  <div class="turvallisuuscheckbox">
    <input v-model="pisteetStore.turvallisuuskoulutusSuoritettu" type="checkbox"/>
    <label for="checkbox">Kaikki ampukakokeen osallistujat tuntevat yllä olevat turvalliset aseen käsittelyn säännöt.</label>
  </div>

  <div class="actions jatka">
    <button class="action" :disabled="!pisteetStore.turvallisuuskoulutusSuoritettu" @click="pisteetStore.turvallisuuskoulutusSuoritettu = true; $router.push('/')">Jatka</button>
  </div>
</template>

<style>


.about h1,h2 {
  color: var(--vari1);
  font-weight: bold;
  padding-top: 1rem;
}

.about {
  padding: 1rem;
}

li {
  margin-top: 1rem;
}

a {
  color: var(--color-text);
}

.actions.jatka {
  flex-direction: row-reverse;
}

.turvallisuuscheckbox {
  padding: 3rem 0 3rem 0;
}


</style>

<script setup lang="ts">

import { usePisteetStore } from '@/stores/pisteet'

const pisteetStore = usePisteetStore()

//const saannotChecked : boolean = false

</script>


<template>

  <main class="turvallisuus">
    <div class="sisalto">

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
    </div>
  </main>
</template>

<style>

main.turvallisuus {
  background-image: linear-gradient(to bottom, rgba(233, 233, 233, .3), rgba(233, 233, 233, 2)), url("src/assets/9mm.jpg");
  padding: 8rem 0 0 0;

}

.sisalto {
  background-color: rgba(233,233,233,.8);
  padding: 1rem;
}


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
  padding: 1rem 0 1rem 0;
}



</style>

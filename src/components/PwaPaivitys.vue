<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'

// Tarkistetaan uusi versio myös pitkän istunnon aikana (kerran tunnissa).
const TARKISTUSVALI_MS = 60 * 60 * 1000

const { needRefresh, updateServiceWorker } = useRegisterSW({
  onRegisteredSW(swUrl, r) {
    if (r) {
      setInterval(() => {
        r.update()
      }, TARKISTUSVALI_MS)
    }
  }
})

// Päivitä: ottaa uuden service workerin käyttöön ja lataa sivun uudelleen.
// Tila säilyy, koska se on tallessa localStoragessa (Pinia persist).
const paivita = () => updateServiceWorker(true)

// Myöhemmin: piilottaa palkin. Palkki ilmestyy uudelleen seuraavalla
// latauksella niin kauan kuin uusi versio odottaa käyttöönottoa.
const myohemmin = () => {
  needRefresh.value = false
}
</script>

<template>
  <div v-if="needRefresh" class="pwa-paivitys" role="alert">
    <span class="pwa-paivitys-teksti">Uusi versio saatavilla.</span>
    <div class="pwa-paivitys-napit">
      <button class="pwa-paivita" @click="paivita">Päivitä</button>
      <button class="pwa-myohemmin" @click="myohemmin">Myöhemmin</button>
    </div>
  </div>
</template>

<style scoped>
.pwa-paivitys {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  max-width: 40rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.6rem;
  padding: 0.7rem 1rem;
  background-color: var(--vari1);
  color: var(--vari2);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.25);
}

.pwa-paivitys-teksti {
  font-size: 105%;
}

.pwa-paivitys-napit {
  display: flex;
  gap: 0.5rem;
}

.pwa-paivitys button {
  font-size: 105%;
  padding: 0.35rem 0.9rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pwa-paivita {
  background-color: var(--vari2);
  color: var(--vari1);
  font-weight: bold;
}

.pwa-myohemmin {
  background-color: transparent;
  color: var(--vari2);
  border: 1px solid var(--vari2) !important;
}
</style>

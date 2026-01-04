<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header style="background: #ddd"></header>
  <RouterView />
</template>

<style>

#app {
  padding: 0;
}

body {
  background: #eeeded;
  max-width: 40rem;
  margin: auto;
}

header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  text-align: center;
}

nav.sivuvalikko {
  /* Kaikki yläpalkin otsikot samalle riville */
  font-size: 96%;
  width: 100%;
  text-align: center;
  background-image: linear-gradient(to bottom, rgba(84, 101, 82, .7), rgba(84, 101, 82, 1)), url("./assets/metsa.jpg");
  background-repeat: no-repeat;
  background-size: cover;

  & a {
    color: var(--vari2);
  }

  & span.icon {
    display: inline-block;
    padding: 0 0 0 .3rem;
  }
}

nav a {
  display: inline-block;
  padding: 0 1rem 0 .1rem;
  border-left: 1px solid var(--color-border);
  font-size: 150%;
}

nav a:first-of-type {
  border: 0;
}

</style>

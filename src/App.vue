<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'


</script>

<template>
  <header style="background: #ddd">

    <!--    <img alt="SRA maalitaulu" src="./assets/logo.svg" width="80px"/>-->
    <!--    <img alt="metsä" src="./assets/metsa.jpg" />-->

    <div class="wrapper">

      <nav class="sivuvalikko">
        <RouterLink to="/">☰ Tuloslista</RouterLink>
        <RouterLink to="/about">🛈 Tietoja</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

</template>

<style>

#app {
  padding: .6rem;
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


  width: 100%;
  text-align: center;
  background-image: linear-gradient(to bottom, rgba(84, 101, 82, .7), rgba(84, 101, 82, 1)), url("./assets/metsa.jpg");
  background-repeat: no-repeat;

}

nav.rastit {
  background-color: var(--vari1);
}


nav.ampujat {
  background-color: #ddd;
  font-size: 50%;

  ul {
    padding-top: .4rem;
    padding-bottom: .4rem;
    width: 100%;
  }

  ul li {
    display: inline-block;
    background-color: #8f9d8f;
    border-radius: .8rem;
    margin-right: .2rem;
    margin-left: .2rem;
    padding-left: .6rem;
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

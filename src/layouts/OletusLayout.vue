<template>
  <div>
    <header style="background: #ddd">

      <div class="wrapper">
        <nav class="sivuvalikko">
          <RouterLink to="/"><span class="icon">☰</span> Tuloslista</RouterLink>
          <RouterLink to="/saannot"><span class="icon">§</span> Säännöt</RouterLink>
          <RouterLink to="/about"><span class="icon">ⓘ</span> Tietoja</RouterLink>
        </nav>
      </div>
    </header>

    <RouterView />

  </div>
</template>
<script setup lang="ts">
import {RouterLink, RouterView} from "vue-router";
</script>
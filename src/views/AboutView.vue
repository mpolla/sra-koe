<script setup lang="ts">
const version = __APP_VERSION__
</script>


<template>
  <div class="about">
    <h1>Tietoja</h1>

    <p>
      Sovelluksen versio {{ version }}
    </p>

    <p>
      Tämä on Sovelletun reserviläisammunan (SRA) käytännön ampumakokeen pisteystystyökalu, jota voidaan
      käyttää ampumakoetilaisuuksissa pisteenlaskun apuna. Sovellettu reserviläisammunta on Reserviläisurheiluliiton
      hallinnoima toiminnallinen ampumalaji. Tämä sovellus ei ole Reserviläisurheiluliiton hyväksymä tai virallinen
      työkalu, mutta voi olla hyödyllinen koetilaisuuksien toteuttamisessa ja PDF-muotoisten koepöytäkirjojen
      tuottamisessa.
    </p>

    <h2>Yksityisyys</h2>
    <p>
      Pistelaskurin tallentamat tiedot ovat: ampujan nimi ja ampumasuorituksien aika- ja pistelukemat. Tiedot
      tallentuvat ainoastaan päätelaitteen (selainohjelman) muistiin. Tietoja ei tallenneta verkkopalvelimille tai
      pilvipalveluihin.
    </p>

    <h2>Linkkejä</h2>
    <ul>
      <li><a href="https://resul.fi/sra/">Sovelletun reserviläisammunnan esittely Reserviläisurheiluliitin sivuilla</a></li>
      <li><a href="https://www.varusteleka.fi/fi/article/opas-toiminnallisen-ampumaharrastuksen-pariin/65356">Varusteleka: Opas toiminnallisen ampumaharrastuksen pariin</a></li>
      <li><a href="https://resul.fi/wp-content/uploads/2023/03/SRA_Saannot_8_0.pdf">SRA säännöt</a></li>
      <li><a href="https://resul.fi/wp-content/uploads/2023/05/SRA-ampumakoe-2023.pdf">SRA ampumakoe</a></li>
    </ul>

    <h2>Palaute ja kehitys</h2>
    <p>
      Jos huomaat sovelluksessa puutteita tai toivoisit parannuksia, ole yhteydessä suoraan kehittäjään Matti Pöllä
      <a href="mailto:mpo@iki.fi">mpo@iki.fi</a>.
    </p>
    <p>
      <a href="https://github.com/mpolla/sra-ampumakoe-laskuri">Projekti Githubissa</a>
    </p>

    <h2>Versiohistoria</h2>

    <h3>0.2 (12.4.2024)</h3>
    <ul>
      <li>Äänet oletuksena mykistetty</li>
      <li>Mahdollisuus ampua rasti 5 kiväärillä</li>
      <li>PWA-sovellus, eli mahdollisuus asentaa työpöydälle</li>
      <li>Offline-toiminnallisuus</li>
      <li>Rastien kuvaukset näkyviin</li>
      <li>Pieniä ulkoasukorjauksia</li>
    </ul>

    <h3>0.0.1 (5.4.2024)</h3>
    <ul>
      <li>Alkuperäinen toteutus</li>
    </ul>

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

a {
  color: var(--color-text);
}

p {
  margin-top: 1rem;
}

</style>

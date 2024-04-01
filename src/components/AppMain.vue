<script>
import { store } from '../store'
import axios from 'axios';
import AppCard from './AppCard.vue';


export default {
  name: 'AppMain', // Cambiato nome per evitare confusione
  components: {
    AppCard,
  },

  data() {
    return {
      
      store,
      // Per chiamata axios completa
      ListaAppartamenti: [],

      // Per la barra di ricerca
      ListaFiltrata: [],
      citta: '',
      distanza: null,
      camere: null,
      bagni: null,
      letti: null,

      activeImage: 0,
      // img che prende il carosello
      slides: [
        { image: '/slide-1.jpg' },
        { image: '/slide-2.jpg' },
        { image: '/slide-3.jpg' },
        { image: '/slide-4.jpg' },
        { image: '/slide-5.webp' },
      ],
    };
  },

  methods: {
    ricerca() {
      // Ripopola l'array completa
      this.ListaFiltrata = this.ListaAppartamenti

      // Filtra l'array ListaFiltrata in base ai valori inseriti
      this.ListaFiltrata = this.ListaAppartamenti.filter(appartamento => {

        // Filtra per numero di camere, bagni e letti
        const filtroCamere = this.camere === null || appartamento.rooms >= this.camere;
    
        const filtroLetti = this.letti === null || appartamento.beds >= this.letti;
       
        return filtroCamere && filtroLetti;
      });
    },


    // manda la foto avanti di 1 ma se al max torno a 0
    nextImg() {
      if (this.activeImage === this.slides.length - 1) {
        this.activeImage = 0;
      } else {
        this.activeImage++;
      }
    },
    setImg(index) {
      this.activeImage = index;
    },

    // Funzione per cambiare ogni TOT tempo il carosello
    startAutoPlay() {
      setInterval(() => {
        this.nextImg();
      }, 3000);
    },



  },
  created() {
    // Start del carosello
    this.startAutoPlay();

    // Effettua la chiamata per recuperare tutti gli appartamenti
    axios.get('http://127.0.0.1:8000/api/apartments').then((response) => {
      this.ListaAppartamenti = response.data.results;
      this.ListaFiltrata = this.ListaAppartamenti

    })
  },
}

</script>
<template>

  <div class="relative">
    <div class="carousel">
      <img v-for="(slide, index) in slides" :src="slide.image" :key="index" @click="setImg(index)"
        :class="{ active: index === activeImage }" class="sfondo"
        :style="{ display: index === activeImage ? 'block' : 'none' }" alt="slider" />
    </div>
  </div>

  <!-- Contenuto -->
  <div class="container">
    <div class="row">
      <h1 class="col-12 text-center my-5">Segli la casa per il tuo viaggio</h1>

      <!-- Barra di ricerca -->
      <div class="barra-ricerca">
        <input type="number" v-model="distanza" placeholder="Distanza">
        <div id="searchBoxContainer"></div>
        <input type="number" v-model="camere" placeholder="Numero di camere">
        <input type="number" v-model="letti" placeholder="Numero di letti">
        <button @click="ricerca">Cerca</button>
      </div>

      <!-- Liste card -->
      <AppCard v-for="card, index in this.ListaFiltrata" :key="index" :card="card" />
    </div>
  </div>
</template>



<style lang="scss" scoped>
@use "../style/general.scss";

.relative {
  position: relative;
}

.carousel {
  display: flex;
  justify-content: center;
}

.carousel img {
  width: 100%;
  height: calc(75vh - 81px);
  object-fit: cover;
  object-position: center;
}

.carousel img:not(.active) {
  display: none;
}

.barra-ricerca {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
}

input[type="text"],
input[type="number"] {
  padding: 10px;
  margin: 0 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 200px;
}

button {
  padding: 10px 20px;
  background-color: #000000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #292a2b;
}
</style>
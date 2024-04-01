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
      ListaAppartamenti: [],

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

    // Effettua la chiamata per recuperare gli appartamenti
    axios.get('http://127.0.0.1:8000/api/apartments').then((response) => {
      this.ListaAppartamenti = response.data.results;

    })},
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
      <h1 class="col-12 text-center my-5">Le nostre case disponibili</h1>

      <!-- Liste card -->
      
      <AppCard v-for="card, index in this.ListaAppartamenti" :key="index" :card="card" />
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
  height: calc(100vh - 81px);
  object-fit: cover;
  object-position: center;
}

.carousel img:not(.active) {
  display: none;
}
</style>
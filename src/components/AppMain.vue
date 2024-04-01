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
   
      minBeds: 0,
      minBedsInput: '', // Input field value
      apartments: [],
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

  methods:
   {
    async fetchApartments() {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/apartments', {
                    params: {
                        minBeds: this.minBeds
                    }
                });
                console.log(response);
                this.apartments = response.data.results;
            } catch (error) {
                console.error('Error fetching apartments:', error);
            }
        },
        applyFilter() {
            // Convert input value to integer
            const minBedsInput = parseInt(this.minBedsInput);
            // Check if input value is valid
            if (!isNaN(minBedsInput)) {
                // Update minBeds with the input value
                this.minBeds = minBedsInput;
                // Fetch apartments with the new filter
                this.fetchApartments();
            } else {
                // Handle invalid input
                console.error('Invalid input for minimum beds');
            }
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
    this.fetchApartments();
    // Start del carosello
    this.startAutoPlay();

    // Effettua la chiamata per recuperare gli appartamenti
    axios.get('http://127.0.0.1:8000/api/apartments').then((response) => {
      this.ListaAppartamenti = response.data.results;

    })},
  }

</script>

<template>
         <div>
        <input type="number" v-model="minBedsInput" placeholder="Minimum Beds">
        <button @click="applyFilter">Apply Filter</button>
        
        <!-- Your existing template code for displaying apartments -->
    </div>
    
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
      <template v-if="apartments.length > 0">
          <!-- Liste card -->
          <AppCard v-for="card, index in apartments" :key="index" :card="card" />
        </template>
        <!-- If there are no apartments matching the filter criteria -->
        <template v-else>
          <div class="text-center my-5">
            
            <p>Non ci sono appartamenti con questo criterio</p>
          </div>
        </template>
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
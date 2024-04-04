<script>
import { store } from '../store'
import axios from 'axios';
import AppCard from './AppCard.vue';


/* FIXME: NELL'INPUT SE IO INSERISCO LA CITTA' DEVE CERCARE QUESTA IN BASE ALLE COORDINATE. 
          SE LE COORDINATE SI TROVANO ENTRO UN RAGGIO DI 20KM ALLORA E' CORRETTO.
*/

export default {
  name: 'AppMain', // Cambiato nome per evitare confusione
  components: {
    AppCard,
  },

  data() {
    return {
      store,

      /* LISTA DEGLI APPARTAMENTI IN UN ARRAY */
      ListaAppartamenti: [],

      /* LA NUOVA LISTA FILTRATA PER GLI APPARTAMENTI CERCATI */
      ListaFiltrata: [],

      /* LA CITTA' CERCATA */
      citta: '',
      distanza: null,
      camere: null,
      letti: null,

      /* CAROSELLO */
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

    /* FUNZIONE PER LA RICERCA */

    /* TODO: INSERIRE LA RICERCA ATTRAVERSO LE COORDINATE */
    ricerca() {
      // Geocode the user's input city to get its coordinates
      this.geocodeCity(this.citta)
        .then(coordinates => {
          // Filter apartments based on user's input city and maximum distance
          this.ListaFiltrata = this.ListaAppartamenti.filter(appartamento => {
            const filtroCamere = this.camere === null || appartamento.rooms >= this.camere;
            const filtroLetti = this.letti === null || appartamento.beds >= this.letti;
            const distance = this.calculateDistance(
              coordinates.latitude,
              coordinates.longitude,
              appartamento.latitude,
              appartamento.longitude
            );
            const filtroDistanza = this.distanza === null || distance <= this.distanza;
            return filtroCamere && filtroLetti && filtroDistanza;
          });
        })
        .catch(error => {
          console.error('Error geocoding city:', error);
        });
    },
    geocodeCity(city) {
    const apiKey = 'GQoylkWTb8A3X4kupHH9BTdJj1GJaVKo';
    const encodedCity = encodeURIComponent(city);
    const apiUrl = `https://api.tomtom.com/search/2/geocode/${encodedCity}.json?key=${apiKey}`;

    return new Promise((resolve, reject) => {
      axios.get(apiUrl)
        .then(response => {
          if (response.data && response.data.results && response.data.results.length > 0) {
            const lat = response.data.results[0].position.lat;
            const lng = response.data.results[0].position.lon;
            console.log(lat);
            console.log(lng)
            const coordinates = { latitude: lat, longitude: lng };
            resolve(coordinates);
          } else {
            reject(new Error('No results found for the provided city.'));
          }
        })
        .catch(error => {
          reject(error);
        });
    });
},

    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the earth in km
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    },
    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },
    // Other methods
    
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
    this.startAutoPlay();
    axios.get('http://127.0.0.1:8000/api/apartments', {
      params: {
        orderBySponsorship: true 
      }
    }).then((response) => {
      const sponsoredApartments = response.data.results.filter(apartment => apartment.adv_level);
      const nonSponsoredApartments = response.data.results.filter(apartment => !apartment.adv_level);
      this.ListaAppartamenti = [...sponsoredApartments, ...nonSponsoredApartments];
      this.ListaFiltrata = this.ListaAppartamenti;
    });
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

  <div class="barra-ricerca">
    <input type="text" v-model="citta" placeholder="Inserisci la città">
    <input type="number" v-model="distanza" placeholder="Distanza massima (km)">
    <!-- Other input fields -->
  
  <label for="letti">Numero letti</label>
  <input type="number" v-model="letti" placeholder="Numero di letti">
  <label for="stanze">Numero stanze</label>
  <input type="number" v-model="stanze" placeholder="Numero di stanze">
  <button @click="ricerca">Cerca</button>
</div>

  <!-- Contenuto -->
  <div class="container">
    <div class="row">
      <h1 class="col-12 text-center my-5">Segli la casa per il tuo viaggio</h1>

      <!-- Barra di ricerca -->
     <!--  <div class="barra-ricerca">
        <input type="number" v-model="distanza" placeholder="Distanza">
        <div id="searchBoxContainer"></div>
        <input type="number" v-model="camere" placeholder="Numero di camere">
        <input type="number" v-model="letti" placeholder="Numero di letti">
        <button @click="ricerca">Cerca</button>
      </div>
 -->
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
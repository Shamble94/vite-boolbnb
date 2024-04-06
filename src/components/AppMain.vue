<script>
import { store } from "../store";
import axios from "axios";
import AppCard from "./AppCard.vue";
import AppHeader from "./AppHeader.vue";

/* FIXME: NELL'INPUT SE IO INSERISCO LA CITTA' DEVE CERCARE QUESTA IN BASE ALLE COORDINATE. 
          SE LE COORDINATE SI TROVANO ENTRO UN RAGGIO DI 20KM ALLORA E' CORRETTO.
*/

export default {
  name: "AppMain", // Cambiato nome per evitare confusione
  components: {
    AppCard,
    AppHeader
  },

  data() {
    return {
      store,

      isCityInputActive: false,


      /* LISTA DEGLI APPARTAMENTI IN UN ARRAY */
      ListaAppartamenti: [],

      /* LA NUOVA LISTA FILTRATA PER GLI APPARTAMENTI CERCATI */
      ListaFiltrata: [],

      /* LA CITTA' CERCATA */
      citta: "",
      selectedServices: [], 
      distanza: null,
      stanze: null,
      service : [],
 
      /* 20KM DI DISTANZA DALLA RICERCA */
      distanza: 0,
      camere: null,
      showNoApartmentsMessage: false,
      letti: null,
      longitude: null,
      latitude: null,

      /* CAROSELLO */
      activeImage: 0,
      // img che prende il carosello
      slides: [
        { image: "/slide-1.jpg" },
        { image: "/slide-2.jpg" },
        { image: "/slide-3.jpg" },
        { image: "/slide-4.jpg" },
        { image: "/slide-5.webp" },
      ],
    };
  },

  methods: {
  async geocodeCity(city) {
    try {
      const coordinates = await this.performGeocoding(city);
      return coordinates;
    } catch (error) {
      throw new Error("Geocoding failed: " + error.message);
    }
  },

  async performGeocoding(city) {

    const apiKey = "GQoylkWTb8A3X4kupHH9BTdJj1GJaVKo";
    const encodedCity = encodeURIComponent(city);
    const apiUrl = `https://api.tomtom.com/search/2/geocode/${encodedCity}.json?key=${apiKey}`;

    const response = await axios.get(apiUrl);
    const data = response.data;

    if (data && data.results && data.results.length > 0) {
      const lat = data.results[0].position.lat;
      const lng = data.results[0].position.lon;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error("No results found for the provided city.");
    }
  },
  ricerca(location) {
    console.log('ciao')
  this.ListaFiltrata = [];

  if (!location.trim()) {
    console.error("City name is required.");
    this.ListaFiltrata = this.ListaAppartamenti;
    return;
  }

  this.geocodeCity(location)
    .then((coordinates) => {
      this.ListaFiltrata = this.ListaAppartamenti.filter((appartamento) => {
        const filtroStanze = this.stanze === null || appartamento.rooms >= this.stanze;
        const filtroLetti = this.letti === null || appartamento.beds >= this.letti;

        const serviziSelezionatiPresenti = this.selectedServices.every((servizio) => {
          return appartamento.services.some(apartmentService => apartmentService.name === servizio);
        });

        const distance = this.calculateDistance(
          coordinates.latitude,
          coordinates.longitude,
          appartamento.latitude,
          appartamento.longitude
        );
        const filtroDistanza = this.distanza === null || distance <= this.distanza;
        return filtroStanze && filtroLetti && filtroDistanza && serviziSelezionatiPresenti;
      });
      
      this.showNoApartmentsMessage = this.ListaFiltrata.length === 0;
    })
    .catch((error) => {
      console.error("Error geocoding city:", error);
    });
},
     
    
    
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; 
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
      Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; 
      return distance;
    },
    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },
    
    
    
    handleCityInputFocus() {
      this.isCityInputActive = true;
    },
    handleCityInputBlur() {
      this.isCityInputActive = false;
    },
    
    updateSliderValue(event) {
      this.distanza = event.target.value;
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
    getServices() {
      axios.get("http://127.0.0.1:8000/api/service")
        .then((response) => {
          this.services = response.data.results;
          console.log(this.services);
        })
        .catch((error) => {
          console.error("Error fetching services:", error);
        });
  },
    },
  created() {
    this.getServices();
    this.startAutoPlay();
    axios
      .get("http://127.0.0.1:8000/api/apartments", {
        params: {
          orderBySponsorship: true,
        },
      })
      .then((response) => {
        const sponsoredApartments = response.data.results.filter(
          (apartment) => apartment.adv_level
        );
        const nonSponsoredApartments = response.data.results.filter(
          (apartment) => !apartment.adv_level
        );
        this.ListaAppartamenti = [
          ...sponsoredApartments,
          ...nonSponsoredApartments,
        ];
        this.ListaFiltrata = this.ListaAppartamenti;
      });
  },
};
</script>

<template>
    <AppHeader @search-city="ricerca" />
  <div class="relative">
    <div class="carousel">
      <img
        v-for="(slide, index) in slides"
        :src="slide.image"
        :key="index"
        @click="setImg(index)"
        :class="{ active: index === activeImage }"
        class="sfondo"
        :style="{ display: index === activeImage ? 'block' : 'none' }"
        alt="slider"
      />
    </div>
  </div>

  <div class="searchbar-size">
    <div class="search-bar">
      <div class="search-elem">
        <label for="city-input">Dove</label>
        <input
  type="text"
  v-model="citta"
  placeholder="Cerca le destinazioni"
  name="city"
  @focus="handleCityInputFocus"
  @blur="handleCityInputBlur"
/>
      </div>

      <div class="search-elem">
        <label for="beds-input">Quanti letti</label>
        <input
          type="text"
          name="beds-input"
          v-model="letti"
          id="beds-input"
          placeholder="Inserisci il numero di letti"
        />
      </div>
      <div class="search-elem">
        <label for="beds-input">Quante stanze</label>
        <input
          type="text"
          name="beds-input"
          v-model="stanze"
          id="beds-input"
          placeholder="Inserisci il numero di stanze"
        />
      </div>

      
    

      <div class="search-btn" role="button" id="searchBtn" @click="ricerca">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="#fff"
          class="bi bi-search"
          viewBox="0 0 16 16"
        >
          <path
            d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"
          />
        </svg>
      </div>
      <div class="distance-filter-section" id="rangeSection" :class="{ 'active': isCityInputActive }">
        <span id="title-distance">Raggio di distanza</span>
        <input type="range" v-model="distanza" min="0" max="200" value="0" class="slider" id="radius-input" @input="updateSliderValue">
        <span id="slider-value">{{ distanza }} km</span>
      </div>
    </div>
  </div>
  


  <!-- Contenuto -->
  <div class="container">
    <div class="row">
      <div v-for="service in services" :key="service.id">
      <input type="checkbox" :value="service.name" v-model="selectedServices">
      <label>{{ service.name }}</label>
    
  </div>
  
    
      <div v-if="showNoApartmentsMessage" class="no-apartments-message text-center">
         Non ci sono appartamenti che rispecchiano i filtri inseriti
      </div>
      <!-- Liste card -->
      <AppCard
        v-for="(card, index) in this.ListaFiltrata"
        :key="index"
        :card="card"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../style/general.scss";

.distance-filter-section {
  /* Stili di base */
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.distance-filter-section .active {
  opacity: 1;
}

.container {
  padding: 100px 0;
}
.relative {
  position: relative;
}

.carousel {
  display: flex;
  justify-content: center;
  position: relative;
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

.fa-sliders {
  cursor: pointer;
  transition-duration: 0.3s;
  color: #7b7b7b;

  &:hover {
    color: #000;
  }
}

.searchbar-size {
  width: 100%;
  display: flex;
  justify-content: center;
 
  top: 60px;
  font-size: 20px;
  right: 50%;
  transform: translate(0, -100%);

}

.search-bar {
  height: 100px;
  background-color: rgb(255, 255, 255);
  z-index: 999;
  bottom: -50px;
  box-shadow: 0px 6px 10px 5px rgba(42, 42, 42, 0.069);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 25px;
  position: relative;

  .search-elem {
    padding: 0 20px;
    border-right: 1px solid rgb(213, 213, 213);

    &:nth-last-child(3) {
      border-right: 1px solid rgba(253, 0, 0, 0);
    }
  }

  .search-btn {
    height: 60px;
    width: 60px;
    background-color: black;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .search-elem label {
    display: block;
    margin-bottom: 5px;
    font-weight: 800;
  }

  .search-elem input {
    border: none;

    &:focus {
      outline: none !important;
      border: 1px solid rgb(0, 0, 0);
    }
  }
}

.distance-filter-section {
  width: 100%;
  background-color: rgb(255, 255, 255);
  position: absolute;

  top: 120px;
  border-radius: 10px;
  opacity: 1;
  transition-duration: 0.3s;
  display: flex;
  align-items: center;
  font-weight: 700;
  padding: 0 50px;
  font-size: 20px;
}

.filter-section {
  width: 25%;
  height: 70px;
  background-color: rgb(255, 255, 255);
  position: absolute;

  right: 0;
  top: 120px;
  border-radius: 10px;
  opacity: 0;
  transition-duration: 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 700;
  padding: 0 50px;
  font-size: 14px;

  .rooms-number-input {
    width: 40px;
  }
}

.distance-filter-section {
  height: 70px;
  background-color: rgb(255, 255, 255);
  position: absolute;
}

.slider {
  width: 60%;
  margin: 0 25px;
  cursor: grab;
}

</style>

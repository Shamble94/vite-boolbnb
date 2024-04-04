<script>
import { store } from "../store";
import axios from "axios";
import AppCard from "./AppCard.vue";

/* FIXME: NELL'INPUT SE IO INSERISCO LA CITTA' DEVE CERCARE QUESTA IN BASE ALLE COORDINATE. 
          SE LE COORDINATE SI TROVANO ENTRO UN RAGGIO DI 20KM ALLORA E' CORRETTO.
*/

export default {
  name: "AppMain", // Cambiato nome per evitare confusione
  components: {
    AppCard,
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

      /* 20KM DI DISTANZA DALLA RICERCA */
      distanza: 20,
      camere: null,
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

    handleCityInputFocus() {
      this.isCityInputActive = true;
    },
    handleCityInputBlur() {
      this.isCityInputActive = false;
    },

    updateSliderValue(event) {
      this.distanza = event.target.value;
    },

    /* CALCOLO DELLA DISTANZA BASATA SU LONGITUDINE E LATITUDINE */
    calculateDistance(lat1, lon1, lat2, lon2) {
      const deltaLat = Math.abs(lat1 - lat2);
      const deltaLon = Math.abs(lon1 - lon2);

      /* CALCOLO APPROSSIMATIVO DELLA DISTANZA TRA I PUNTI DI LONGITUDINE E LATITUDINE */
      const approxDistance =
        Math.sqrt(deltaLat * deltaLat + deltaLon * deltaLon) * 111.319;

      return approxDistance;
    },

    ricerca() {
      // Ripopola l'array completa
      this.ListaFiltrata = this.ListaAppartamenti;

      /* PRENDE LE COORDINATE DELLA CITTA' CERCATA */
      axios
        .get(
          "https://api.tomtom.com/search/2/geocode/" + this.citta + ".json",
          {
            params: {
              key: "ARRIZGGoUek6AqDTwVcXta7pCZ07Q490",
            },
          }
        )
        .then((response) => {
          /* PRENDE DALLA RICERCA LATITUDINE E LONGITUDINE */
          const results = response.data.results;
          this.latitude = results[0].position.lat;
          this.longitude = results[0].position.lon;

          /* FILTRAGGIO DI SOLI GLI APPARTAMENTI CHE SONO NEL RAGGIO DI 20KM */
          this.ListaFiltrata = this.ListaFiltrata.filter((appartamento) => {
            /* FUNZIONE DEL CALCOLO DELLA DISTANZA (VEDI SOPRA) */
            const distance = this.calculateDistance(
              appartamento.latitude,
              appartamento.longitude,
              this.latitude,
              this.longitude
            );

            /* SE LA DISTANZA E' MINORE O UGUALE A 0 O NULLA CERCA COMUNQUE AD UN MINIMO DI 20KM */
            if (this.distanza == null || this.distanza <= 0) {
              this.distanza = 20;
            }

            return distance <= this.distanza;
          });

          /* FILTRA IN SEGUITO IN BASE AL NUMERO DI STANZE O LETTI */
          this.ListaFiltrata = this.ListaFiltrata.filter((appartamento) => {
            // Filtra per numero di camere, bagni e letti
            const filtroCamere =
              this.camere === null || appartamento.rooms >= this.camere;
            const filtroLetti =
              this.letti === null || appartamento.beds >= this.letti;

            return filtroCamere && filtroLetti;
          });
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

      <div class="search-elem me-5">
        <label for="filter-input">Filtri</label>
        <i
          name="filter-input"
          id="filter-input"
          class="fa-solid fa-sliders"
        ></i>

        <div class="filter-section" id="filterSection">
          <div class="number-room d-flex">
            <span id="label-rooms">Numero stanze</span>
            <input
              type="number"
              name="rooms-number"
              min="0"
              id="rooms-input"
              class="rooms-number-input"
            />
          </div>
          <div class="number-room d-flex">
            <span id="label-rooms">Numero stanze</span>
            <input
              type="number"
              name="rooms-number"
              min="0"
              id="rooms-input"
              class="rooms-number-input"
            />

            <input
              type="number"
              name="rooms-number"
              default="0"
              min="0"
              id="rooms-input"
              class="rooms-number-input"
            />
          </div>
        </div>
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
        <input type="range" v-model="distanza" min="20" max="100" value="20" class="slider" id="radius-input" @input="updateSliderValue">
        <span id="slider-value">{{ distanza }} km</span>
      </div>
    </div>
  </div>

  <!-- <div class="searchbar-size">
  <div class="search-bar">
        <div class="search-elem">
          <label for="city" class="fw-bolder">Dove</label>
          
        </div>

        <div class="search-elem">
          <label for="rooms" class="fw-bolder">Numero letti</label>
          <input type="number" v-model="camere" placeholder="Inserisci quanti letti" name="rooms" />
        </div>

        <div class="search-elem">
          <label for="city" class="fw-bolder">Filtri</label>
          <div class="filter-icon"><i class="fa-solid fa-sliders"></i></div>
        </div>

        <div class="search-elem">
          <button @click="ricerca"><i class="fa-solid fa-magnifying-glass"></i></button>
        </div>

        <div class="range-section">
          <span>Raggio di distanza</span>
          <input type="range" id="vol" name="vol" min="0" max="50">
          <span>100km</span>
        </div>
      </div>



</div> -->

  <!-- Contenuto -->
  <div class="container">
    <div class="row">
      <!-- <h1 class="col-12 text-center my-5">Segli la casa per il tuo viaggio</h1> -->

      <!-- Barra di ricerca -->
      <!--      <div class="barra-ricerca">
        <input type="text" v-model="citta" placeholder="Città" />
        <input
          type="number"
          min="20"
          max="100"
          v-model="distanza"
          placeholder="Distanza"
        />
        <div id="searchBoxContainer"></div>
        <input type="number" v-model="letti" placeholder="Numero di letti" />
        
      </div> -->

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
  position: sticky;
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

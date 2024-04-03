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
      <div class="search-bar">
        <div class="search-elem">
          <label for="city" class="fw-bolder">Dove</label>
          <input type="text" v-model="citta" placeholder="Cerca le destinazioni" name="city"/>
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
      </div>
    </div>
  </div>

  


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

.container{
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

button {
  width: 60px;
  height: 60px;
  background-color: #000000;
  color: #fff;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  margin-left: 20px;
}

button:hover {
  background-color: #292a2b;
}

.search-bar{
  padding: 10px 20px;
  background-color: white;
  position: absolute;
  bottom: -50px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  .search-elem{
    display: flex;
    flex-direction: column;
    justify-content: center;

    &:nth-last-child(2){
      margin-right: 20px;
      margin-bottom: 10px;
    }

    &:nth-last-child(3){
      border-right: none;
      border-right: 1px solid rgb(225, 225, 225);
      border-left: 1px solid rgb(225, 225, 225);
      padding: 0 30px;
    }

    input{
      border: none;
    }

    label{
      margin-left: 15px;
    }

    .filter-icon{
      margin-top: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      color: #909090;
      transition-duration: 0.3s;

      &:hover{
        cursor: pointer;
        color: black;
      }
    }
  }
}
</style>

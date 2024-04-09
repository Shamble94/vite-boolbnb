<script>
import { store } from "../store";
import axios from "axios";
import AppCard from "./AppCard.vue";
import AppHeader from "./AppHeader.vue";

export default {
  name: "AppMain",
  components: {
    AppCard,
    AppHeader,
  },
  data() {
    return {
      store,
      isFilterSectionVisible: false,
      isCityInputActive: false,
      ListaAppartamentiPivot: [],
      ListaAppartamenti: [],
      ListaFiltrata: [],
      ListaSponsorPivot: [],
      citta: "",
      selectedServices: [],
      distanza: null,
      stanze: null,
      service: [],
      distanza: 1,
      camere: null,
      showNoApartmentsMessage: false,
      letti: null,
      longitude: null,
      latitude: null,
      activeImage: 0,
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
    handleCardClick(card) {
      axios
        .post(`http://127.0.0.1:8000/api/apartments/${card.id}/clicks`)
        .then((response) => {});
    },
    toggleFilters() {
      this.isFilterSectionVisible = !this.isFilterSectionVisible;
    },
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
  this.citta = location;
  this.ListaFiltrata = [];
  if (this.citta.length == 0 || this.citta == "" || this.citta == "gg") {
    this.ListaFiltrata = this.ListaAppartamenti;
    return;
  }
  if (!location.trim()) {
    console.error("City name is required.");
    this.ListaFiltrata = this.ListaAppartamenti;
    return;
  }
  this.geocodeCity(location)
    .then((coordinates) => {
      this.ListaFiltrata = this.ListaAppartamenti.filter((appartamento) => {
        const filtroStanze =
          this.stanze === null || appartamento.rooms >= this.stanze;
        const filtroLetti =
          this.letti === null || appartamento.beds >= this.letti;
        const serviziSelezionatiPresenti = this.selectedServices.every(
          (servizio) => {
            return appartamento.services.some(
              (apartmentService) => apartmentService.name === servizio
            );
          }
        );
        const distance = this.calculateDistance(
          coordinates.latitude,
          coordinates.longitude,
          appartamento.latitude,
          appartamento.longitude
        );
        const filtroDistanza =
          this.distanza === null || distance <= this.distanza;
        const isSponsored = this.ListaAppartamentiPivot.some(
          (pivotAppartamento) => pivotAppartamento.id === appartamento.id
        ); // Verifica se l'appartamento è presente anche nella lista pivot
        if (isSponsored) {
          appartamento.isSponsored = true; // Aggiungi una proprietà per indicare che l'appartamento è sponsorizzato
        }
        return filtroStanze && filtroLetti && filtroDistanza && serviziSelezionatiPresenti;
      });

      console.log("Questi sono sponsorizzati: ", this.ListaAppartamentiPivot);
      console.log("Questi sono filtrati: ", this.ListaFiltrata);
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
    filterApartments() {
  axios
    .get("http://127.0.0.1:8000/api/apartments")
    .then((response) => {
      axios
        .get("http://127.0.0.1:8000/api/pivot-table")
        .then((pivotResponse) => {
          this.ListaSponsorPivot = pivotResponse.data.results;
          const currentDate = new Date();
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, "0");
          const day = String(currentDate.getDate()).padStart(2, "0");
          const hours = String(currentDate.getHours()).padStart(2, "0");
          const minutes = String(currentDate.getMinutes()).padStart(2, "0");
          const seconds = String(currentDate.getSeconds()).padStart(2, "0");
          const milliseconds = String(
            currentDate.getMilliseconds()
          ).padStart(3, "0");
          const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

          const idList = this.ListaAppartamentiPivot.map(
            (appartamento) => appartamento.id
          );
          this.ListaSponsorPivot.forEach((element) => {
            const apartments_id = element.apartments_id;
            const sponsor_id = element.sponsor_id;
            const apartmentProxy = element;

            this.ListaAppartamentiPivot.forEach((element) => {
              if (element.id == apartments_id) {
                const nowTime = new Date();
                const createdAt = new Date(apartmentProxy.created_at);
                createdAt.setHours(createdAt.getHours() - 2);
                const diffInMilliseconds = Math.abs(nowTime - createdAt);
                const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
                if (sponsor_id == 1) {
                  if (diffInHours >= 24) {
                    this.ListaAppartamentiPivot =
                      this.ListaAppartamentiPivot.filter(
                        (appartamento) => appartamento.id !== element.id
                      );
                  }
                } else if (sponsor_id == 2) {
                  if (diffInHours >= 72) {
                    this.ListaAppartamentiPivot =
                      this.ListaAppartamentiPivot.filter(
                        (appartamento) => appartamento.id !== element.id
                      );
                  }
                } else if (sponsor_id == 3) {
                  if (diffInHours >= 144) {
                    this.ListaAppartamentiPivot =
                      this.ListaAppartamentiPivot.filter(
                        (appartamento) => appartamento.id !== element.id
                      );
                  }
                }
              }
            });
          });
        });
      this.ListaAppartamenti = response.data.results;

      // Imposta isSponsored per tutti gli appartamenti in ListaAppartamenti
      this.ListaAppartamenti.forEach(apartment => {
        apartment.isSponsored = apartment.adv_level > 0; // Assumi che adv_level > 0 indica che l'appartamento è sponsorizzato
      });

      // Ordina gli appartamenti in base alla sponsorizzazione
      this.ListaAppartamenti.sort((a, b) => {
        if (a.isSponsored && !b.isSponsored) {
          return -1; // Metti l'appartamento sponsorizzato prima
        } else if (!a.isSponsored && b.isSponsored) {
          return 1; // Metti l'appartamento non sponsorizzato dopo
        } else {
          return 0; // Mantieni l'ordine attuale
        }
      });

      this.ListaFiltrata = [...this.ListaAppartamentiPivot, ...this.ListaAppartamenti.filter(apartment => !apartment.isSponsored)];
      this.ricerca(this.citta);
    })
    .catch((error) => {
      console.error("Error fetching apartments:", error);
    });
},
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
    startAutoPlay() {
      setInterval(() => {
        this.nextImg();
      }, 3000);
    },
    getServices() {
      axios
        .get("http://127.0.0.1:8000/api/service")
        .then((response) => {
          this.services = response.data.results;
        })
        .catch((error) => {
          console.error("Error fetching services:", error);
        });
    },
  },
  created() {
    this.filterApartments();
    this.getServices();
    this.startAutoPlay();
    axios
      .get("http://127.0.0.1:8000/api/pivot-apartments")
      .then((response) => {
        this.ListaAppartamentiPivot = response.data.results;

        this.ListaAppartamentiPivot.forEach(apartment => {
          apartment.isSponsored = true;
        });

        this.ListaFiltrata = this.ListaAppartamenti;
      })
      .catch((error) => {
        console.error("Error fetching pivot apartments:", error);
      });
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
  watch: {
    citta(newValue) {
      this.ricerca(newValue);
    },
    distanza(newValue) {
      this.ricerca(this.citta);
    },
    stanze(newValue) {
      this.ricerca(this.citta);
    },
    letti(newValue) {
      this.ricerca(this.citta);
    },
    selectedServices(newValue) {
      this.ricerca(this.citta);
    },
  },
};
</script>


<template>
  <AppHeader @search-city="ricerca" />


  <div class="jumbo-background">
    <div class="jumbotron">
      <div class="title-jumbotron-container">
        <h1>Trova l'appartamento perfetto per te!</h1>
        <p class="description-jumbotron">Benvenuto nel tuo portale per la casa perfetta! Scopri la nostra  variegata selezione di appartamenti, dall'elegante al moderno. Trova la  tua dimora ideale con noi oggi stesso!</p>
        <button class="register-jumbotron-btn"><a href="http://127.0.0.1:8000/register" class="text-light">Registrati</a></button>

        <div class="img-jumbotron-container">
          <img src="/pngegg.png" alt="Foto appartamento">
        </div>

      </div>
    </div>
  </div>

<div class="main-section">

  <div class="filter-row">
    <div class="filter-window-button" @click="toggleFilters">
      <i class="fas fa-filter"></i>
    </div>
    <div v-if="isFilterSectionVisible" class="filters-section p-4">
      <div class="filter-header">
        <h5 class="fw-bolder m-0">Filtra i risultati</h5>
        <i class="fa-solid fa-xmark" @click="toggleFilters"></i>
      </div>
      <hr />
      <div class="distance-section">
        <div class="section-name">Distanza</div>
        <div class="range-infos">
          <input
            type="range"
            v-model="distanza"
            min="1"
            max="200"
            value="1"
            class="slider"
            id="radius-input"
            @input="updateSliderValue"
          />
          <span id="slider-value" class="fw-bolder fs-5"
            >{{ distanza }} km</span
          >
        </div>
      </div>
      <div class="distance-section">
        <label for="beds-input" class="section-name">Letti</label>
        <div class="range-infos">
          <input
            type="text"
            name="beds-input"
            v-model="letti"
            id="beds-input"
            placeholder="Inserisci il numero di letti"
          />
        </div>
      </div>
      <div class="distance-section">
        <label for="stanze-input" class="section-name">Stanze</label>
        <div class="range-infos">
          <input
            type="text"
            name="stanze-input"
            v-model="stanze"
            id="stanze-input"
            placeholder="Inserisci il numero di stanze"
          />
        </div>
      </div>
      <div class="distance-section">
        <label class="section-name">Servizi</label>
        <div class="services-checkbox">
          <div v-for="service in services" :key="service.id">
            <input
              type="checkbox"
              class="largerCheckbox"
              :value="service.name"
              v-model="selectedServices"
            />
            <label class="label-checkbox">{{ service.name }}</label>
          </div>
        </div>
      </div>
    </div>
  </div> 




  <div class="sponsored-apartment" v-if="this.citta == ''">
    <div class="title-section">
      <h3>Appartamenti in evidenza</h3>
      <p>Qui troverai gli appartamenti sponsorizzati e più <br> apprezzati.</p>
    </div>

    <div class="card-container mt-5">
      <div
        v-if="showNoApartmentsMessage"
        class="no-apartments-message text-center"
      >
        Non ci sono appartamenti che rispecchiano i filtri inseriti
      </div> 
      <!-- Liste card -->
      <div class="container-fluid p-0">
        <div class="row">
          <AppCard
              class="me-5"
              v-for="(card, index) in ListaAppartamentiPivot"
              :key="'pivot_' + index"
              :card="card"
              @click="handleCardClick(card)"
            />
        </div>
      </div>
    </div>
  </div>

  <div class="sponsored-apartment mt-5 pt-5">
    <div class="title-section">
      <div v-if="this.citta == ''">
        <h3>Appartamenti aggiunti di recente</h3>
        <p>In questa sezione potrai vedere gli appartamenti <br> aggiunti di recente.</p>
      </div>
      <div v-else>
        <h3>Appartamenti ricercati</h3>
        <p>In questa sezione trovi gli appartamenti in base <br> alle tue ricerche</p>
      </div>
    
      
    </div>

    <div class="card-container mt-5">
      <div
        v-if="showNoApartmentsMessage"
        class="no-apartments-message text-center mb-5"
      >
        Non ci sono appartamenti che rispecchiano i filtri inseriti
      </div> 
      <!-- Liste card -->
      <div class="container-fluid p-0">
        <div class="row">
          <AppCard v-if="this.citta != ''"
            class="me-5"
            v-for="(card, index) in this.ListaFiltrata.slice().reverse()"
            :key="index"
            :card="card"
            @click="handleCardClick(card)"
            :isSponsored="card.isSponsored"
          />
          
          <AppCard 
            class="me-5"
            v-for="(card, index) in this.ListaFiltrata.slice().reverse()"

            :card="card"
            @click="handleCardClick(card)"
            :isSponsored="card.isSponsored"
            v-else
          />
        </div>
      </div>
    </div>
  </div>
</div>


  

 <!--  <div class="container-fluid p-5">
    <div class="row">
      <h1 class="text-center">
        <i class="fa-solid fa-hand-sparkles colore-viola ruotare"></i>
      </h1>
      <div class="sponsore-section-title-container">
        <h2 class="apartment-sponsored-title">Appartamenti in evidenza</h2>
      </div>
      <div class="sponsored-section">
        
      </div>
    </div>
  </div>
  </div> -->

  <!-- Contenuto -->
  
<!--    -->
</template>

<style lang="scss" scoped>
@use "../style/general.scss";

.is-sponsored {
  border: 2px solid red; /* Imposta il bordo rosso */
}

body{
  background-color: white;
}
a{
  text-decoration: none;
}
.jumbo-background{
  width: 100%;
  background: linear-gradient(180deg, rgba(223,223,236,1) 0%, rgba(225,228,235,1) 50%, rgba(255,255,255,1) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 100px;
  padding-top: 150px;

  .jumbotron{
    width: 100%;
    height: 100%;
    background-color: rgb(255, 255, 255);
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    -webkit-box-shadow: 0px 2px 14px 0px #0000001a;
    -moz-box-shadow: 0px 2px 14px 0px #0000001a;
    -o-box-shadow: 0px 2px 14px 0px #0000001a;
    box-shadow: 0px 2px 14px 0px #0000001a;
    padding: 120px;
    .title-jumbotron-container{
      width: 700px;
      h1{
        font-weight: 900;
        font-size: 60px;
      }
    }
    .description-jumbotron{
        margin-right: 100px;
        margin-top: 50px;
        color: rgb(98, 98, 98);
        font-size: 24px;
        line-height: 1.7;
    }
    .register-jumbotron-btn{
      border: none;
      padding: 15px 70px;
      font-size: 20px;
      background-color: #5968EF;
      color: white;
      font-weight: 800;
      border-radius: 10px;
      margin-top: 40px;
    }
    img{
      width: 60%;
      position: absolute;
      right: -15%;
      bottom: 0;
      object-fit: contain;
    }
  }
}
@media screen and (max-width: 1200px) {
}
.main-section{
  width: 100%;
  background-color: white;
  padding-top: 100px;
}
.sponsored-apartment{
  width: 100%;
  padding: 0 100px;
  h3{
    font-weight: 700;
    font-size: 35px;
  }
  p{
    font-size: 20px;
  }
  .card-container{
    width: 100%;
    height: 100%;
  }
}
.card-div{
  display: flex;
}

.filter-row {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
}


.filter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  i {
    font-size: 20px;
    margin-right: 10px;
    cursor: pointer;
  }

}
/* .ruotare {
  transform: rotate(60deg);
} */
.filter-window-button {
  width: 50px;
  height: 50px;
  background-color: rgb(255, 255, 255);
  -webkit-box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.051); 
  box-shadow: 0px 0px 15px 5px rgba(0, 0, 0, 0.051);
  position: absolute;
  right: 100px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(61, 123, 255);
  cursor: pointer;
}
.label-checkbox {
  margin-left: 10px;
  font-weight: 700;
}
.services-checkbox {
  margin-top: 10px;
}
.filters-section {
  width: 330px;
  position: absolute;
  right: 100px;
  z-index: 995;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  border: solid 1px rgb(231, 231, 231);
  top: -25px;
  .distance-section {
    margin-bottom: 10px;
  }
  .range-infos {
    display: flex;
    align-items: center;
  }
}
/* .distance-filter-section {
.distance-filter-section {  */
  /* Stili di base */
  /* opacity: 0; */
  /* opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.distance-filter-section .active {
  opacity: 1;
}
.container {
  padding: 0px 0;
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
input[type="checkbox"] {
  widows: 100px;
  height: 100px;
  margin-bottom: 10px;
}
input[type="text"],
input[type="number"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width: 100%;
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
input.largerCheckbox {
  width: 20px;
  height: 20px;
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
  width: 65%;
  cursor: grab;
  margin-right: 20px;
}
.sponsored-section {
  padding: 0 30px;
  overflow-x: scroll;
  .card-div {
    width: 100%;
    display: flex;
    margin-right: 20px;
  }
}
.apartment-sponsored-title {
  font-weight: 700;
  text-align: center;
  padding: 0 500px;
}
} */
</style>
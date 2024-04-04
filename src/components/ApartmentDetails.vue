<script>
import { store } from "../store.js";
import axios from "axios";
import tt from "@tomtom-international/web-sdk-maps";

export default {
  name: "ApartmentDetail",

  data() {
    return {
      store,
      apartment: null,
      loader: false,
      map: null,
      apiKey: "GQoylkWTb8A3X4kupHH9BTdJj1GJaVKo",
      marker: null,
    };
  },

  created() {
    this.getApartmentDetails();
  },
  methods: {
    getApartmentDetails() {
      axios
        .get(`${this.store.baseUrl}/api/apartments/${this.$route.params.id}`)
        .then((response) => {
          this.apartment = response.data.result;
          console.log("Appartamento:", this.apartment);
          if (
            this.apartment &&
            this.apartment.longitude &&
            this.apartment.latitude
          ) {
            this.loader = true;
            this.initializeMap(); // Call initializeMap here
          } else {
            console.error(
              "Dati di longitudine o latitudine mancanti o non validi"
            );
          }
        });
    },
    initializeMap() {
      if (!this.map && this.apartment) {
        const longitude = parseFloat(this.apartment.longitude);
        const latitude = parseFloat(this.apartment.latitude);

        if (isNaN(longitude) || isNaN(latitude)) {
          console.error("Le coordinate non sono valide:", longitude, latitude);
          return;
        }

        this.map = tt.map({
          key: this.apiKey,
          container: this.$refs.map,
          center: [longitude, latitude],
          zoom: 16,
        });

        this.map.on("load", () => {
          console.log("Map loaded."); // Add this console log
          console.log(latitude);
          try {
            this.marker = new tt.Marker()
              .setLngLat([longitude, latitude])
              .addTo(this.map);
            console.log("Marker added successfully.");
          } catch (error) {
            console.error("Error adding marker:", error);
          }
        });

        const bboxPadding = 0.01; // Adjust this value as needed
        const bbox = [
          longitude - bboxPadding, // Min Longitude (o West)
          latitude - bboxPadding, // Min Latitude (o South)
          longitude + bboxPadding, // Max Longitude (o East)
          latitude + bboxPadding, // Max Latitude (o North)
        ];

        this.map.fitBounds(bbox, {
          padding: { top: 10, bottom: 10, left: 10, right: 10 },
        });
      }
    },
  },
};
</script>

<template>
  <link
    rel="stylesheet"
    type="text/css"
    href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.12.0/maps/maps.css"
  />
  <div class="container" v-if="loader">
    <div class="row">
      <h1 class="apartments my-4">{{ apartment.description }}</h1>
      <div class="col-md-6">
        <!-- Immagine Principale -->
        <div class="main-image">
          <img
            v-if="apartment.image !== '0'"
            :src="`${store.baseUrl}/storage/${apartment.image}`"
            class="card-img-top"
            :alt="apartment.description"
          />
          <img
            v-else
            src="/placeholder2.png"
            class="card-img-top"
            :alt="apartment.description"
          />
        </div>
      </div>
      <div class="col-md-6">
        <!-- Griglia per Immagini Secondarie -->
        <div class="row">
          <div class="col-6 secondary-image">
            <img
              v-if="apartment.image !== '0'"
              :src="`${store.baseUrl}/storage/${apartment.image}`"
              class="img-fluid"
              :alt="apartment.description"
            />
          </div>
          <div class="col-6 secondary-image">
            <img
              v-if="apartment.image !== '0'"
              :src="`${store.baseUrl}/storage/${apartment.image}`"
              class="img-fluid"
              :alt="apartment.description"
            />
          </div>
          <div class="col-6 secondary-image mt-3">
            <img
              v-if="apartment.image !== '0'"
              :src="`${store.baseUrl}/storage/${apartment.image}`"
              class="img-fluid"
              :alt="apartment.description"
            />
          </div>
          <div class="col-6 secondary-image mt-3">
            <img
              v-if="apartment.image !== '0'"
              :src="`${store.baseUrl}/storage/${apartment.image}`"
              class="img-fluid"
              :alt="apartment.description"
            />
          </div>
        </div>
      </div>
      <div class="apartment-details">
        <p class="fs-3 fw-semibold my-3">
          {{ apartment.location }}, Indirizzo per esteso da aggiungere
        </p>
        <div class="fs-5">
          <span>{{ apartment.rooms }} Camere • </span>
          <span>{{ apartment.beds }} Letti •</span>
          <span>{{ apartment.bathrooms }} Bagni •</span>
          <span>{{ apartment.square_meters }} m²</span>
        </div>
      </div>
      <!-- Check if there are services -->

      <p>Servizi:</p>
      <div v-if="apartment.services && apartment.services.length > 0">
        <h3>Services:</h3>

        <ul class="list-unstyled">
          <li v-for="(service, index) in apartment.services" :key="index">
            <i :class="service.icon"></i
            ><span class="mx-2">{{ service.name }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-6 mapx">
        <p class="fs-3 fw-bold">Dove sarai</p>
        <div ref="map" id="map"></div>
        <!-- Assicurati di dare un'altezza esplicita -->
      </div>
    </div>
  </div>
  <button class="p-1" @click="redirectToMessageForm">
    Chiedi informazioni
  </button>
</template>

<style lang="scss" scoped>
img {
  width: 400px;
}

.apartment-details p {
  font-size: 20px;
}

.services-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
}

.service-item {
  margin: 10px;
  display: flex;
  align-items: center;

  i {
    margin-right: 5px;
  }
}

.apartments {
  font-size: 35px;
}

.img {
  display: flex;
  justify-content: center;
}

.back-main {
  background-color: yellow;
}

/* Stili SCSS */
.image-container {
  width: 100%;
  /* o una larghezza fissa a seconda delle tue esigenze */
  padding-top: 100%;
  /* Questo mantiene l'aspetto quadrato */
  background-size: cover;
  background-position: center;
  position: relative;
}

/* Assicurati che il contenitore dell'immagine mantenga il suo aspetto quadrato anche in responsive */
@media (max-width: 768px) {
  .image-container {
    width: 100%;
    /* Ajusta secondo necessità */
    padding-top: 100%;
  }
}

.secondary-image img {
  width: 100%;
  height: auto;
  display: block;
  /* Assicura che le immagini si estendano per tutta la larghezza del contenitore */
  object-fit: cover;
  /* Opzionale: assicura che le immagini coprano lo spazio disponibile senza perdere le proporzioni */
}

.main-image img {
  width: 100%;
  height: auto;
  display: block;
}

#map {
  width: 100%;
  height: 500px;
}

.mapx {
  border: solid rgb(177, 176, 176) 1px;
}
</style>

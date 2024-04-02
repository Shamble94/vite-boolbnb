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
          console.log(this.apartment);
          this.loader = true;
          this.initializeMap(); 
        });
    },
    redirectToMessageForm() {
      this.$router.push({ name: "MessageForm" });
    },
    
    initializeMap() {
        if (!this.map && this.apartment) {
    const longitude = this.apartment.longitude;
    const latitude = this.apartment.latitude;
    console.log(longitude, latitude);

    this.map = tt.map({
      key: this.apiKey,
      container: this.$refs.map
    });

    this.map.setCenter([longitude, latitude]);
    this.map.setZoom(16);

  }
    }
  }
};
</script>
<template>
  <div class="container" v-if="loader">
    <div class="row">
      <div class="col-4 m-5">
        <!-- Bind the src attribute to the image URL if it exists, otherwise use a placeholder -->
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

        <!-- Display apartment description -->
        <p>{{ apartment.description }}</p>

        <!-- Check if there are services -->
        <div v-if="apartment.services && apartment.services.length > 0">
          <h3>Services:</h3>
          <!-- Loop through services and display their names -->

          <ul class="list-unstyled">
            <li v-for="(service, index) in apartment.services" :key="index">
              <!-- Ensure proper class binding for the icon -->
              <i :class="service.icon"></i
              ><span class="mx-2">{{ service.name }}</span>
            </li>
          </ul>
        </div>
        <div>
          <!-- Apartment details content -->

          <!-- Button to navigate to the message form -->
          <button class="p-1" @click="redirectToMessageForm">
            Chiedi informazioni
          </button>

          <div>
    </div>
        </div>
      </div>
    </div>
  </div>

  <div ref="map" style="width: 100%; height: 100%;"></div>

</template>

<style lang="scss" scoped>
img {
  width: 400px;
}
</style>

<script>
import { store } from "../store.js";
import axios from "axios";
import tt from "@tomtom-international/web-sdk-maps";
import AppHeaderShow from "./AppHeaderShow.vue";

export default {
  name: "ApartmentDetail",
  components: {
    AppHeaderShow,
  },

  data() {
    return {
      message: "",
      name: "",
      email: "",
      subject: "",
      showSuccessAlert: false,
      showForm: false,
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
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Scorrimento fluido
    });
  },
  mounted() {
    if (this.loader) {
      this.initializeMap();
    }
  },

  methods: {
    // Modifica il metodo sendMessage() per gestire correttamente la risposta del backend
    sendMessage() {
      // Definisco i dati che verranno passati al BE
      const data = {
        apartment_id: this.apartment.id,
        name: this.name,
        email: this.email,
        subject: this.subject,
        message: this.message,
        showConfirmationMessage: false
      };

      // Faccio la chiamata passando i dati
      axios
        .post(`http://127.0.0.1:8000/api/message`, data)
        .then((response) => {
          if (response.data.success) {
            this.name = "";
            this.email = "";
            this.subject = "";
            this.message = "";
            this.showConfirmationMessage = true;

            if (this.showConfirmationMessage) {
              this.showConfirmationMessage = true;


              // Imposta un timeout per nascondere l'alert dopo alcuni secondi (ad esempio, 3 secondi)
              setTimeout(() => {
                this.showSuccessAlert = false;
                window.scrollTo({
                  top: 0,
                  behavior: "smooth", // Scorrimento fluido
                });
              }, 1500);
            }
          } else {
            this.errors = response.data.errors;
          }
        })
        .catch((error) => {
          console.error("Errore durante l'invio del messaggio:", error);
        });
    },

    getApartmentDetails() {
      axios
        .get(`${this.store.baseUrl}/api/apartments/${this.$route.params.id}`)
        .then((response) => {
          this.apartment = response.data.result;
          if (
            this.apartment &&
            this.apartment.longitude &&
            this.apartment.latitude
          ) {
            this.loader = true;
            this.initializeMap();
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

        const map = tt.map({
          key: this.apiKey,
          container: this.$refs.map,
          center: [longitude, latitude],
          zoom: 16,
        });

        map.on("load", () => {
          try {
            const marker = new tt.Marker()
              .setLngLat([this.apartment.longitude, this.apartment.latitude])
              .addTo(map);
          } catch (error) {
            console.error("Error adding marker:", error);
          }
        });

        this.map = map;

        const bboxPadding = 0.01;
        const bbox = [
          longitude - bboxPadding,
          latitude - bboxPadding,
          longitude + bboxPadding,
          latitude + bboxPadding,
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
  <AppHeaderShow />

  <link
    rel="stylesheet"
    type="text/css"
    href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.12.0/maps/maps.css"
  />



  <div class="container-fluid p-0 m-0 text-center-phone">
    <div class="remove-test">
      <div class="photo-container col-12 d-none d-lg-block">
        <div v-if="apartment && apartment.image == '0'"></div>
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
      <div class="space-left"></div>
      <div class="info-container">
        <div class="photo-mobile-container mb-5 d-lg-none d-block">
          <img
          v-if="apartment.image !== '0'"
          :src="`${store.baseUrl}/storage/${apartment.image}`"
          class="card-img-top border-radius"
          :alt="apartment.description"
        />
        <img
          v-else
          src="/placeholder2.png"
          class="card-img-top border-radius"
          :alt="apartment.description"
        />
        </div>
        <div class="info-single-section margine-superiore">
          <h1>{{ apartment.address }}</h1>
          <p>{{ apartment.description }}</p>
        </div>

        <div class="info-single-section">
          <h4 class="title-info-show">Dettagli</h4>

          <ul class="list-unstyled mt-3">
            <li>
              <i class="fa-solid fa-maximize main-color"></i
              ><span class="ms-2 fw-bold main-color"
                >Dimensioni:
                <span class="fw-light text-dark">{{
                  apartment.square_meters
                }} mq</span></span
              >
            </li>
            <li>
              <i class="fa-solid fa-door-open main-color"></i
              ><span class="ms-2 fw-bold main-color"
                >Numero Stanze:
                <span class="fw-light text-dark">{{
                  apartment.rooms
                }}</span></span
              >
            </li>
            <li>
              <i class="fa-solid fa-bed main-color"></i
              ><span class="ms-2 fw-bold main-color"
                >Numero Letti:
                <span class="fw-light text-dark">{{
                  apartment.beds
                }}</span></span
              >
            </li>
            <li>
              <i class="fa-solid fa-sink main-color"></i
              ><span class="ms-2 fw-bold main-color"
                >Numero Bagni:
                <span class="fw-light text-dark">{{
                  apartment.bathrooms
                }}</span></span
              >
            </li>
          </ul>
        </div>

        <div class="info-single-section">
          <h4 class="title-info-show">Servizi</h4>
          <div
            class="services-group-show"
            v-if="apartment.services && apartment.services.length > 0"
          >
            <div
              class="service-container-show"
              v-for="(service, index) in apartment.services"
              :key="index"
            >
              <i :class="service.icon"></i
              ><span class="mx-2">{{ service.name }}</span>
            </div>
          </div>
        </div>

        <div class="info-single-section">
          <h4 class="title-info-show">Posizione</h4>
          <div class="mapx mt-4">
            <div ref="map" id="map"></div>
          </div>
        </div>
        <div v-if="showConfirmationMessage" class="confirmation-message">
      Messaggio inviato correttamente!
    </div>
        <div class="footer-show">
          <h3>Contatta il venditore</h3>
          <form ref="form" @submit.prevent="sendMessage" class="m-3">
            <label for="name">Nome</label>
            <input
              type="text"
              id="name"
              v-model="name"
              class="form-control"
              placeholder="Inserisci il tuo nome"
              required
            />

            <div style="margin-bottom: 10px"></div>

            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="form-control"
              placeholder="Inserisci il tuo indirizzo email"
              required
            />

            <div style="margin-bottom: 10px"></div>

            <label for="subject">Soggetto</label>
            <input
              type="text"
              id="subject"
              v-model="subject"
              class="form-control"
              placeholder="Inserisci l'oggetto del messaggio"
              required
            />

            <div style="margin-bottom: 10px"></div>

            <label for="message">Messaggio</label>
            <textarea
              v-model="message"
              id="message"
              class="form-control"
              required
              placeholder="Scrivi qui il tuo messaggio"
            ></textarea>

            <div style="margin-bottom: 10px"></div>

            <button type="submit" class="my-4 p-2">INVIA</button>
          </form>
        </div>
      </div>
    </div>

    <div class="row">
      <h1 class="apartments my-4"></h1>
      <div class="col-md-6 col-5">
        <!-- Immagine Principale -->
        <div class="main-image"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../style/style.css";
@use "../style/general.scss";

@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap");
.animated-gradient {
  animation: animateBg 2s linear infinite;
  background-image: linear-gradient(90deg,#d6d6d6,#ffffff,#d6d6d6,#ffffff);
  background-size: 300% 100%;
}
@keyframes animateBg {
  0% { background-position: 100% 0%; }
  100% { background-position: 0% 0%; }
}

.border-radius{
  border-radius: 10px;
}
.confirmation-message {
  background-color: #dff0d8;
  color: #3c763d;
  border: 1px solid #d6e9c6;
  padding: 10px;
  margin-top: 10px;
  border-radius: 5px;
}
.footer-show {
  width: calc(100% - 60vw);
  position: absolute;
  right: 0;
  padding: 50px;
  margin-top: 50px;
  background-color: black;

  label {
    color: white;
  }

  input {
    margin-bottom: 20px;
  }

  button {
    width: 100%;
    border: none;
    border-radius: 10px;
    background-color: #5968ef;
    color: white;
    font-weight: 700;
    font-size: 23px;
  }

  h3 {
    text-align: center;
    color: white;
    text-transform: uppercase;
    font-weight: 800;
  }
}

.main-color {
  color: rgb(61, 123, 255);
}

li {
  line-height: 2.3;
}

.remove-test {
  width: 100%;
  display: flex;
  font-family: "Inter";
  position: relative;

  .photo-container {
    height: 100vh;
    width: 60vw;
    position: fixed;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .space-left {
    width: 60vw;
  }

  .info-container {
    width: calc(100% - 60vw);
    background-color: rgb(255, 255, 255);
    padding: 200px 100px;

    .info-single-section {
      margin-bottom: 50px;

      .title-info-show {
        font-weight: 900;
        font-size: 25px;
      }
    }

    .services-group-show {
      display: flex;
      width: 100%;
      flex-wrap: wrap;

      .service-container-show {
        width: fit-content;
        padding: 7px 10px;
        background-color: #151515;
        border-radius: 10px;
        color: white;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }

    h1 {
      font-weight: 700;
      font-size: 50px;
    }

    p {
      color: #574949;
    }
  }
}

#map {
  width: 100%;
  height: 500px;
}

/* 
*******************************
Phone 576px
******************************* 
*/
@media screen and (max-width: 576px){
  .text-center-phone{
  text-align: center;
}
.photo-container{
  width: 100%;
  height: 100px;
}
.colore-viola{
  display: none
}
}

</style>

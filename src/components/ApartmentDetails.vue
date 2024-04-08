
<script>
import { store } from "../store.js";
import axios from "axios";
import tt from "@tomtom-international/web-sdk-maps";


export default {
  name: "ApartmentDetail",

    data() {
        return {
            message: '',
        name: '',
        email: '',
        subject: '',
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
        // Modifica il metodo sendMessage() per gestire correttamente la risposta del backend
sendMessage() {
  // Definisco i dati che verranno passati al BE
  const data = {
    apartment_id: this.apartment.id,
    name: this.name,
    email: this.email,
    subject: this.subject,
    message: this.message,
  };



  // Faccio la chiamata passando i dati
  axios.post(`http://127.0.0.1:8000/api/message`, data).then((response) => {
    if (response.data.success) {
        this.name = '';
        this.email = '';
        this.subject = "";
        this.message = '';
        alert("Messaggio inviato con successo");
        window.scrollTo({
      top: 0,
      behavior: "smooth" // Scorrimento fluido
    });

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
}
,
  },
}
</script>

<template>

     <link rel="stylesheet" type="text/css" href="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.12.0/maps/maps.css">


  <div class="container" v-if="loader">
    <div class="row ">
      <h1 class="apartments margine-superiore">{{ apartment.description }}</h1>
        <div class="col-md-6 col-5">
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
            <div class="col-6">
                <div class="apartment-details">
                  <p class="fs-3 fw-semibold my-3">
                    {{ apartment.location }}
                    <h5>{{ apartment.address }}</h5>
                  </p>
                  <p><h2>La casa dispone di:</h2></p>
                  <ul class="fs-5 list-unstyled">
                    <li>{{ apartment.rooms }} Camere  </li>
                    <li>{{ apartment.beds }} Letti </li>
                    <li>{{ apartment.bathrooms }} Bagni </li>
                    <li>{{ apartment.square_meters }} m²</li>
                    </ul>
                <!-- Check if there are services -->
    
                <div v-if="apartment.services && apartment.services.length > 0">
                  <h3>Servizi che troverai all'interno della casa:</h3>
          
                  <ul class="list-unstyled">
                    <li v-for="(service, index) in apartment.services" :key="index">
                      <i :class="service.icon"></i>
                      <span class="mx-2">{{ service.name }}</span>
                    </li>
                  </ul>
                </div>
            </div>
              
            
            </div>
        </div>
      </div>
      <div class="col-md-6">
        <!-- Griglia per Immagini Secondarie -->
        <!-- <div class="row">
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
        </div> -->
      </div>


 

  <div class="container">
    <div class="row">
        <p class="fs-3 fw-bold mt-4">Dove sarai</p>
      <div class="col-6 mapx mt-4">
        <div ref="map" id="map"></div>
        <!-- Assicurati di dare un'altezza esplicita -->
      </div>
    </div>
  </div>
  <hr>
  <div class="text-center m-2 border-1 ">

      <h5>Invia un messaggio al proprietario</h5>
  </div>
  <hr>
  <form ref="form" @submit.prevent="sendMessage" class="m-3">
  <label for="name">Nome</label>
  <input type="text" id="name" v-model="name" class="form-control" placeholder="Inserisci il tuo nome" required>
  
  <!-- Aggiungi uno spazio vuoto -->
  <div style="margin-bottom: 10px;"></div>

  <label for="email">Email</label>
  <input type="email" id="email" v-model="email" class="form-control" placeholder="Inserisci il tuo indirizzo email" required>
  
  <!-- Aggiungi uno spazio vuoto -->
  <div style="margin-bottom: 10px;"></div>

  <label for="subject">Soggetto</label>
  <input type="text" id="subject" v-model="subject" class="form-control" placeholder="Inserisci l'oggetto del messaggio" required>
  
  <!-- Aggiungi uno spazio vuoto -->
  <div style="margin-bottom: 10px;"></div>

  <label for="message">Messaggio</label>
  <textarea v-model="message" id="message" class="form-control" required placeholder="Scrivi qui il tuo messaggio"></textarea>
  
  <!-- Aggiungi uno spazio vuoto -->
  <div style="margin-bottom: 10px;"></div>

  <button type="submit" class="my-4 p-2" >Invia Messaggio</button>
</form>




</template>

<style lang="scss" scoped>
img {
  width: 400px;
}

.apartment-details p {
  font-size: 20px;
}
.margine-superiore{
  margin-top: 115px;
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

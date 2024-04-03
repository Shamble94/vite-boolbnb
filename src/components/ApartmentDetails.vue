<script>
import { store } from "../store.js"
import axios from "axios";

export default {
    name: "ApartmentDetail",

    data(){
        return {
            store,
            apartment: null,
            loader: false,
        }
    },
    created(){
        this.getApartmentDetails();
    },
    methods:{
    getApartmentDetails(){
        axios.get(`${this.store.baseUrl}/api/apartments/${this.$route.params.id}`)
        .then((response) => {
            this.apartment = response.data.result;
            console.log(this.apartment);
            this.loader = true;
        }); // Cambiato da ',' a ';'
    },
    redirectToMessageForm() {
        this.$router.push({ name: 'MessageForm' });
    },
}
}

</script>

<template>
  <div class="container" v-if="loader">
    <div class="row">
        <h1 class="apartments my-4">{{ apartment.description }}</h1>
        <div class="col-md-6">
            <!-- Immagine Principale -->
            <div class="main-image">
                <img v-if="apartment.image !== '0'" :src="`${store.baseUrl}/storage/${apartment.image}`" class="img-fluid" :alt="apartment.description">
            </div>
        </div>
        <div class="col-md-6">
            <!-- Griglia per Immagini Secondarie -->
            <div class="row">
                <div class="col-6 secondary-image ">
                    <img v-if="apartment.image !== '0'" :src="`${store.baseUrl}/storage/${apartment.image}`" class="img-fluid" :alt="apartment.description">

                </div>
                <div class="col-6 secondary-image">
                    <img v-if="apartment.image !== '0'" :src="`${store.baseUrl}/storage/${apartment.image}`" class="img-fluid" :alt="apartment.description">

                </div>
                <div class="col-6 secondary-image mt-3">
                    <img v-if="apartment.image !== '0'" :src="`${store.baseUrl}/storage/${apartment.image}`" class="img-fluid" :alt="apartment.description">
                </div>
                <div class="col-6 secondary-image mt-3">
                    <img v-if="apartment.image !== '0'" :src="`${store.baseUrl}/storage/${apartment.image}`" class="img-fluid" :alt="apartment.description">

                </div>

            </div>
        </div>



                <div class="apartment-details">
                    <p class="fs-3 fw-semibold my-3"> {{ apartment.location }}, Indirizzo per esteso da aggiungere</p>
                    <div class="fs-5">
                    <span>{{ apartment.rooms }} Camere • </span> 
                    <span>{{ apartment.beds }} Letti •</span>
                    <span>{{ apartment.bathrooms }} Bagni •</span>
                    <span>{{ apartment.square_meters }} m²</span>
                    </div>
                </div>
                <div class="container my-3">
                    <div class="row">
                        <div class="col-6">
                            <div class="fs-4 fw-semibold ">Cosa Troverai:</div>
                            <div class="col-6 mt-4">
                            <div class="card" style="width: 18rem;">
  <ul class="list-group list-group-flush">
    <li class="list-group-item">An item</li>
    <li class="list-group-item">A second item</li>
    <li class="list-group-item">A third item</li>
  </ul>
  <div class="card-footer">
    Card footer
  </div>
</div></div>
                <div v-if="apartment.services && apartment.services.length > 0">
                    <h3>Servizi:</h3>
                    <ul class="list-unstyled services-list">
                        <li v-for="(service, index) in apartment.services" :key="index" class="service-item">
                            <i :class="service.icon"></i><span class="mx-2">{{ service.name }}</span>
                        </li>
                    </ul>
                </div>
                        </div>
                        <div class="col-6">
                            <div class="fs-4 fw-semibold">Posizione esatta dell'appartamento:</div>

                        </div>
                    </div>
                </div>
                
                <button class="btn-info m-5" @click="redirectToMessageForm">Chiedi informazioni al gestorejkb</button>
            </div>
        </div>
</template>
    


<style  lang="scss" scoped>
img {
    width: 100%;
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
.back-main{
    background-color: yellow;
}
/* Stili SCSS */
.image-container {
    width: 100%; /* o una larghezza fissa a seconda delle tue esigenze */
    padding-top: 100%; /* Questo mantiene l'aspetto quadrato */
    background-size: cover;
    background-position: center;
    position: relative;
}

/* Assicurati che il contenitore dell'immagine mantenga il suo aspetto quadrato anche in responsive */
@media (max-width: 768px) {
    .image-container {
        width: 100%; /* Ajusta secondo necessità */
        padding-top: 100%;
    }
}
.secondary-image img {
    width: 100%;
    height: auto;
    display: block; /* Assicura che le immagini si estendano per tutta la larghezza del contenitore */
    object-fit: cover; /* Opzionale: assicura che le immagini coprano lo spazio disponibile senza perdere le proporzioni */
}

.main-image img {
    width: 100%;
    height: auto;
    display: block;
}


</style>

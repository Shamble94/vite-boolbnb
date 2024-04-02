<script>
import { store } from "../store.js"
import axios from "axios";
import tt from '@tomtom-international/web-sdk-maps';

export default {
    name: "ApartmentDetail",

    data() {
        return {
            store,
            apartment: null,
            loader: false,

            longitude: null,
            latitude: null,
            key: null,
            container: null,
            center: [],
            zoom: null,
            // map:null,
        }
    },
    mounted() {
        // Chiamata per recuperare i dettagli dell'appartamento
        this.getApartmentDetails();
    },
    methods: {

        creazioneMappa() {
             const map = tt.map({
                key: 'GQoylkWTb8A3X4kupHH9BTdJj1GJaVKo',
                container: 'map',
                center: [this.longitude, this.latitude],
            });
            const marker = new tt.Marker().setLngLat(center).addTo(map);
            

        },

        getApartmentDetails() {
            axios.get(`${this.store.baseUrl}/api/apartments/${this.$route.params.id}`)
                .then((response) => {
                    this.apartment = response.data.result;
                    this.loader = true;
                    this.longitude = this.apartment.longitude
                    this.latitude = this.apartment.latitude
                    this.creazioneMappa();
                })
        },

        redirectToMessageForm() {
            this.$router.push({ name: 'MessageForm' });
        }
    }
}


</script>
<template>
    <div class="" v-if="loader">
        <div class="row mt-5">
            <div class="col-8  ">

                <img v-if="apartment.image !== '0'" :src="`${store.baseUrl}/storage/${apartment.image}`"
                    class="img-copertina" :alt="apartment.description">
                <img v-else src="/placeholder2.png" class="img-copertina" :alt="apartment.description">

                <div>


                </div>
            </div>
            <div class="col-4">
                <div id="indirizzoSearchBox" ></div>
                <h2>{{ apartment.description }}</h2>
                <p>Situato a {{ apartment.location }} </p>
                <p>Dispone di {{ apartment.rooms }} Stanze</p>
                <p>Possono dormirci {{ apartment.beds }} persone massimo</p>
                <p>Dispone di {{ apartment.bathrooms }} bagni</p>
                <p>Il tutto suddiviso in {{ apartment.square_meters }}m²</p>
            </div>
            <div id='map' style="width: 400px; height: 400px;"></div>
            <button class="p-1" @click="redirectToMessageForm">Chiedi informazioni</button>
        </div>
    </div>
    

</template>

<style lang="scss" scoped>
.img-copertina {
    width: 100%;
    height: auto;
}
</style>
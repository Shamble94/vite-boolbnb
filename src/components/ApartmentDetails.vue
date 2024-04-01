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
               
            })
            }
    }
}

</script>
<template>
    <div class="container" v-if="loader">
        <div class="row">
            <div class="col-4 m-5">
                <!-- Bind the src attribute to the image URL if it exists, otherwise use a placeholder -->
                <img v-if="apartment.image !== '0'" :src="`${this.store.baseUrl}/storage/${apartment.image}`"  class="card-img-top" :alt="apartment.description">
                <img v-else src="/placeholder2.png" class="card-img-top" :alt="apartment.description">
                <!-- Display apartment description -->
                {{ apartment.description }}
            </div>
        </div>
    </div>
</template>


    
<style  lang="scss" scoped>
   img{
    width: 400px;
   }
</style>
    
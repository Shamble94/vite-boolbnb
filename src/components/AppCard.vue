<script>
export default {
    name: 'AppCard',
    props: {
        card: Object,
    }
}
</script>

<template>

    <div class="col-sm-12 col-md-6 col-lg-3 col-xl-3 my-3">
        <div class="card h-100">
            <img v-if="card.image !== '0'" :src="'http://127.0.0.1:8000/storage/' + card.image" class="card-img-top"
                :alt="card.title">
            <img v-else src="/placeholder2.png" class="card-img-top" :alt="card.title">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title text-truncate">{{ card.location }}</h5>
                <h6> {{ card.description }}</h6>
                <p class="card-text flex-grow-1">{{ card.title }}</p>

            </div>
            <router-link :to="{ name: 'ApartmentDetails', params: { id: card.id } }" class="text-deco m-3">
                Mostra Dettagli.
            </router-link>
        </div>
    </div>


</template>

<style lang="scss">
/* Qui puoi aggiungere lo stile specifico per il tuo componente */
.card-title.text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

img {
    height: 200px;
    width: auto
}
</style>

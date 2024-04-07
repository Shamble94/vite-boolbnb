<script>
export default {
  name: "AppCard",
  props: {
    card: Object,
  },
};
</script>

<template>
  <div class="col-sm-12 col-md-6 col-lg-4 col-xl-2 my-2" v-if="card.visibility == 'Si'">
    <router-link
      :to="{ name: 'ApartmentDetails', params: { id: card.id } }"
      class="text-deco m-3"
    >
      <div class="my-card">
        <div class="img-container">
          <img
            v-if="card.image !== '0'"
            :src="'http://127.0.0.1:8000/storage/' + card.image"
            class="card-img-top"
            :alt="card.title"
          />
          <img
            v-else
            src="/placeholder2.png"
            class="card-img-top"
            :alt="card.title"
          />
        </div>

        <div class="apartments-infos">
          <h5 class="card-title text-truncate">{{ card.address }}</h5>
          <span>{{ card.rooms }} Stanze</span>
          <span>{{ card.beds }} Letti</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style lang="scss">
.my-card {
  width: 100%; 
  max-width: 300px; 
  background-color: rgb(255, 255, 255);
  position: relative;
  border-radius: 20px;
  -webkit-box-shadow: 0px 0px 14px 0px #00000026;
  -moz-box-shadow: 0px 0px 14px 0px #00000026;
  -o-box-shadow: 0px 0px 14px 0px #00000026;
  box-shadow: 0px 0px 14px 0px #00000026;
}

.text-deco {
  text-decoration: none;
}

.img-container {
  height: 200px;
  width: 100%;
  border-radius: 20px 20px 0 0;
  overflow: hidden;

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
  }
}

.apartments-infos {
  color: rgb(139, 139, 139);
  text-decoration: none;
  display: flex;
  flex-direction: column;
  padding: 10px 20px;

  h5 {
    font-weight: 700;
    color: black;
  }
}

@media (max-width: 576px) {
  .my-card {
    margin-bottom: 20px;
    max-width: none; 
  }
}
</style>

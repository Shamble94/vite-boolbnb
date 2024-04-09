<script>
export default {
  name: "AppCard",
  props: {
    card: Object,
    isSponsored: Boolean,
  },
};
</script>

<template>
  <div class="col-xl-2 col-lg-3" v-if="card.visibility == 'Si'">
    <router-link 
      :to="{ name: 'ApartmentDetails', params: { id: card.id } }"
      class="text-decoration-none me-3">
      <div class="my-card">
        <div class="img-container">
          <img
            v-if="card.image !== '0'"
            :src="'http://127.0.0.1:8000/storage/' + card.image"
            class="img-top"
            :alt="card.title"
            :class="{ 'is-sponsored': isSponsored }"
          />
          <img
            v-else
            src="/placeholder2.png"
            class="img-top"
            :alt="card.title"
            :class="{ 'is-sponsored': isSponsored }"
          />
        </div>

        <h2>{{ card.address }}</h2>
        <p>{{ card.bathrooms }} Bagni • {{ card.beds }} Letti • {{ card.rooms }} Stanze</p>



        <!-- <div class="d-flex align-items-center p-2">
          <h5 class="card-title text-truncate colore-viola larghezza">{{ card.address }}</h5>
          <div>
            <span class="bordo text-light p-2 m-1 sfondo-viola d-inline-block"><i class="fa-solid fa-bath mx-1"></i>{{ card.rooms }} </span> <br>
            <span class="bordo text-light p-2 m-1 sfondo-viola d-inline-block"><i class="fa-solid fa-bed mx-1"></i>{{ card.beds }}</span>
          </div>
        </div> -->
      </div>
    </router-link>
  </div>
</template>

<style lang="scss">
@use "../style/general.scss";
.is-sponsored {
  border: 3px solid #ffc815; /* Imposta il bordo rosso */
  border-radius: 15px;
}


.img-container {
  width: 270px;
  height: 270px;
  overflow: hidden; 
  img {
    width: 100%;
    height: 100%;
    object-fit: cover; 
    border-radius: 15px;
  }
}
h2{
  font-weight: 700;
  color: black;
  margin-top: 10px;
  font-size: 20px;
}
p{
  color: rgb(116, 116, 116);
  margin-top: -5px;
}
/* .my-card {
  width: 100%; 
  background-color: rgb(255, 255, 255);
  border-radius: 20px;
  -webkit-box-shadow: 0px 0px 14px 0px #00000026;
  -moz-box-shadow: 0px 0px 14px 0px #00000026;
  -o-box-shadow: 0px 0px 14px 0px #00000026;
  box-shadow: 0px 0px 14px 0px #00000026;
}
a {
    text-decoration: none; 
    color: inherit; 
}
.bordo{
  background-color: #5968EF;
  border-radius: 15px;
}
.larghezza{
  width: 70%;
}
.img-top{
  width: 100%;
  height: 260px;
  object-fit: cover;
}
} */
</style>
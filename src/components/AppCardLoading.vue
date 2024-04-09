<script>
export default {
  name: "AppCardLoading",
  props: {
    isLoading: Boolean
  },
};
</script>

<template>
  
  <div class="col-12 col-md-5 col-lg-4 col-xxl-3">

      <div class="my-card">
        <div class="img-container animated-gradient">
            </div>
        <div class="address animated-gradient"></div>
        <div class="info animated-gradient"></div>
      </div>
  </div>
    

  

  

</template>

<style lang="scss">
@use "../style/general.scss";
.is-sponsored {
  border: 3px solid #ffc815; /* Imposta il bordo rosso */
  border-radius: 15px;
}

.address{
    width: 200px;
    height: 40px;
    border-radius: 10px;
    margin-top: 10px;
}

.info{
    width: 250px;
    height: 20px;
    border-radius: 5px;
    margin-top: 10px;
}

.animated-gradient {
  animation: animateBg 2s linear infinite;
  background-image: linear-gradient(90deg,#d6d6d6,#ffffff,#d6d6d6,#ffffff);
  background-size: 300% 100%;
}
@keyframes animateBg {
  0% { background-position: 100% 0%; }
  100% { background-position: 0% 0%; }
}





.img-container {
  width: 270px;
  height: 270px;
  overflow: hidden; 
  border-radius: 15px;
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

.my-card{
  margin-bottom: 100px;
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
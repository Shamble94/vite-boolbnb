<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from "./components/AppFooter.vue";
import AppMain from "./components/AppMain.vue";
import ApartmentDetails from "./components/ApartmentDetails.vue"
export default {
  components: {
    AppHeader,
    AppFooter,
    AppMain,
    ApartmentDetails
  }
}
</script>


<template lang="">
  <AppHeader />

    <router-view></router-view> 
  <AppFooter />
</template>
<style lang="scss">
</style>
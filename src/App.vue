<script>
import AppHeader from "./components/AppHeader.vue";
import AppMain from "./components/AppMain.vue";
import ApartmentDetails from "./components/ApartmentDetails.vue";

export default {
  components: {
    AppHeader,
    AppMain,
    ApartmentDetails,
  },
};
</script>

<template lang="">
  <router-view></router-view>
</template>
<style lang="scss"></style>

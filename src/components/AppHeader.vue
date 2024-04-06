<script>
import axios from "axios";

export default {
  data() {
    return {
      cityInput: "",
      suggestions: [],
      showAutocomplete: false, 
    };
  },
  methods: {
    async handleAutocomplete() {
      if (this.cityInput.length < 3) {
        this.suggestions = [];
        return;
      }

      try {
        const response = await axios.get(
          `https://api.tomtom.com/search/2/search/${this.cityInput}.json?key=GQoylkWTb8A3X4kupHH9BTdJj1GJaVKo`
        );
        this.suggestions = response.data.results;
        this.showAutocomplete = true; 
      } catch (error) {
        console.error("Errore durante la richiesta di suggerimenti:", error);
      }
    },
    async selectCity(city) {
      console.log("Città selezionata:", city);
      this.$emit("select-city", city);
    },
    async search() {
      try {
        const response = await axios.get(
          `https://api.tomtom.com/search/2/search/${this.cityInput}.json?key=GQoylkWTb8A3X4kupHH9BTdJj1GJaVKo`
        );
        this.suggestions = response.data.results;
        this.$emit("search-city", this.cityInput);
      } catch (error) {
        console.error("Errore durante la richiesta di suggerimenti:", error);
      }
    },
    async selectSuggestion(result) {
      this.cityInput = result.address.freeformAddress;
      this.search();
      this.showAutocomplete = false; 
    },
    closeAutocomplete() {
      this.showAutocomplete = false; 
    },
  },
};
</script>

<template lang="">
  <header class="d-flex align-items-center">
    <div class="container">
      <div class="row">
        <!-- SEZIONE LOGO -->
        <div class="col-2">
          <div class="content">
            <router-link
              class="d-flex align-items-center"
              :to="{ name: 'app-main' }"
            >
              <svg
                width="50"
                height="55"
                viewBox="0 0 70 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_237_340)">
                  <path
                    d="M28.224 3.99732C24.6985 6.04104 21.4176 7.9445 20.9489 8.22501L20.0726 8.70589V5.27966V1.85343H15.9969H11.9213L11.8805 7.58385L11.8194 13.3143L6.11339 16.6002C2.97511 18.4035 0.285155 19.9463 0.142506 20.0265C-0.0612789 20.1467 0.162884 20.8279 1.01878 22.8917C1.65051 24.3744 2.18035 25.5966 2.20073 25.6166C2.22111 25.6567 3.15852 25.1558 4.27933 24.5146C7.01005 22.9718 22.2939 14.1959 29.1818 10.2287L34.7044 7.04286L40.7975 10.5292C44.1396 12.4527 49.9475 15.7587 53.6971 17.8826C57.4467 19.9864 62.093 22.6312 64.0086 23.7132C65.9242 24.7951 67.5748 25.6968 67.6767 25.6968C67.8397 25.6968 70.061 20.4472 69.9387 20.3871C69.1032 19.9864 36.192 1.03193 35.4584 0.531022C35.2342 0.370731 34.9693 0.250512 34.847 0.250512C34.7247 0.250512 31.7495 1.93357 28.224 3.99732Z"
                    fill="black"
                  />
                  <path
                    d="M27.3072 17.2614C25.0655 18.5638 19.9709 21.4891 15.9971 23.7732C12.0233 26.0774 8.41633 28.1612 8.00876 28.4217L7.23438 28.9026V32.1084C7.23438 33.8716 7.29551 35.3142 7.37702 35.3142C7.58081 35.3142 9.7613 34.092 15.6099 30.6858C22.2125 26.8589 25.6769 24.8953 25.8603 24.8953C25.9214 24.8953 25.9826 31.6676 25.9826 39.9226V54.97L28.7336 54.9099L31.5051 54.8498L31.4847 34.9335C31.4847 23.9736 31.4644 14.9773 31.4236 14.9572C31.4032 14.9372 29.5488 15.959 27.3072 17.2614Z"
                    fill="black"
                  />
                  <path
                    d="M37.3945 34.8935V54.95H40.2475H43.1005L43.1413 39.8425L43.2024 24.715L44.9346 25.6767C45.8923 26.2177 50.1311 28.602 54.3494 30.9663C58.5677 33.3306 62.0728 35.2141 62.134 35.154C62.297 35.0137 62.2562 29.704 62.0728 29.143C61.971 28.7824 60.4222 27.8006 55.4295 24.9554C51.8429 22.9317 46.4833 19.8662 43.5081 18.1831C40.5328 16.48 37.9447 15.0374 37.7613 14.9572C37.4149 14.837 37.3945 15.8789 37.3945 34.8935Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_237_340">
                    <rect width="70" height="55" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span class="fw-bolder fs-2 ms-3 text-dark">BoolBnB</span>
            </router-link>
          </div>
        </div>

        <!-- SEZIONE RICERCA -->
        <div class="col-8 align-items-center d-flex justify-content-center">
          <div class="searchbar">

      <i class="fas fa-search icons-searchbar"></i>
      <i class="fas fa-filter icons-searchbar"></i>

    <input
      class="input-field"
      type="text"
      v-model="cityInput"
      placeholder="Cerca le destinazioni"
      name="city"
      @keyup.enter="search"
      @input="handleAutocomplete"
    />
    <button><i class="fa fa-xmark"></i></button>
    <div class="autocomplete-section">
      <ul v-if="suggestions.length > 0" class="suggestions-list list-unstyled">
        <li
          v-for="(result, index) in suggestions"
          :key="index"
          @click="selectSuggestion(result)"
        >
          <div class="item-autocomplete">
            <i class="fa-solid fa-location-dot me-2"></i>{{ result.address.freeformAddress }}
          </div>
        </li>
      </ul>
    </div>
  </div>

          <!-- <button @click="search">Cerca</button> -->
        </div>

        <!-- BOTTONE VENDITORE -->
        <div class="col-2 align-items-center d-flex justify-content-center">
          <button type="button" class="btn btn-dark">
            <a href="http://127.0.0.1:8000/login">Modalità venditore</a>
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Logo -->
  <!-- <div class="col-2">
          <div class="d-flex align-items-center">
            <router-link :to="{ name: 'app-main' }">
              <svg
                width="50"
                height="55"
                viewBox="0 0 70 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_237_340)">
                  <path
                    d="M28.224 3.99732C24.6985 6.04104 21.4176 7.9445 20.9489 8.22501L20.0726 8.70589V5.27966V1.85343H15.9969H11.9213L11.8805 7.58385L11.8194 13.3143L6.11339 16.6002C2.97511 18.4035 0.285155 19.9463 0.142506 20.0265C-0.0612789 20.1467 0.162884 20.8279 1.01878 22.8917C1.65051 24.3744 2.18035 25.5966 2.20073 25.6166C2.22111 25.6567 3.15852 25.1558 4.27933 24.5146C7.01005 22.9718 22.2939 14.1959 29.1818 10.2287L34.7044 7.04286L40.7975 10.5292C44.1396 12.4527 49.9475 15.7587 53.6971 17.8826C57.4467 19.9864 62.093 22.6312 64.0086 23.7132C65.9242 24.7951 67.5748 25.6968 67.6767 25.6968C67.8397 25.6968 70.061 20.4472 69.9387 20.3871C69.1032 19.9864 36.192 1.03193 35.4584 0.531022C35.2342 0.370731 34.9693 0.250512 34.847 0.250512C34.7247 0.250512 31.7495 1.93357 28.224 3.99732Z"
                    fill="black"
                  />
                  <path
                    d="M27.3072 17.2614C25.0655 18.5638 19.9709 21.4891 15.9971 23.7732C12.0233 26.0774 8.41633 28.1612 8.00876 28.4217L7.23438 28.9026V32.1084C7.23438 33.8716 7.29551 35.3142 7.37702 35.3142C7.58081 35.3142 9.7613 34.092 15.6099 30.6858C22.2125 26.8589 25.6769 24.8953 25.8603 24.8953C25.9214 24.8953 25.9826 31.6676 25.9826 39.9226V54.97L28.7336 54.9099L31.5051 54.8498L31.4847 34.9335C31.4847 23.9736 31.4644 14.9773 31.4236 14.9572C31.4032 14.9372 29.5488 15.959 27.3072 17.2614Z"
                    fill="black"
                  />
                  <path
                    d="M37.3945 34.8935V54.95H40.2475H43.1005L43.1413 39.8425L43.2024 24.715L44.9346 25.6767C45.8923 26.2177 50.1311 28.602 54.3494 30.9663C58.5677 33.3306 62.0728 35.2141 62.134 35.154C62.297 35.0137 62.2562 29.704 62.0728 29.143C61.971 28.7824 60.4222 27.8006 55.4295 24.9554C51.8429 22.9317 46.4833 19.8662 43.5081 18.1831C40.5328 16.48 37.9447 15.0374 37.7613 14.9572C37.4149 14.837 37.3945 15.8789 37.3945 34.8935Z"
                    fill="black"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_237_340">
                    <rect width="70" height="55" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </router-link>
            <div class="ms-3 fs-4 logo-write fw-bolder">BoolBnB</div>
          </div>
        </div>
        <div class="col-4"></div> -->

  <!-- <div class="col-4">
          <input
            type="text"
            v-model="cityInput"
            placeholder="Cerca le destinazioni"
            name="city"
          />
          
          <button @click="search">Cerca</button>
        </div> -->

  <!-- Pulsante venditore -->
  <!-- <div class="col-2 d-flex align-items-center justify-content-end">
          <button type="button" class="btn btn-dark">
            <a href="http://127.0.0.1:8000/login">Modalità venditore</a>
          </button>
        </div>
      </div>
    </div>
  </header> -->
</template>

<style lang="scss">
@use "../style/general.scss";

header {
  height: 80px;
  

  .autocomplete-section {
    max-height: 400px;
    width: 100%;
    background-color: rgb(255, 255, 255);
    position: absolute;
    top: 50%;
    z-index: 998;
    border-radius: 0 0 20px 20px;
    padding-top: 40px;
    overflow: scroll;

    ul {
      line-height: 1.3;
      padding: 0;

      li {
        position: relative;
        padding: 10px 0;
        margin: 0;
        cursor: pointer;
        &:hover {
          background-color: rgb(221, 221, 221);
        }

        .item-autocomplete {
          padding: 0 50px;
        }
      }
    }
  }

  background-color: white;

  a {
    color: white;
    text-decoration: none;
  }

  .ricerca {
    width: 100%;
    border: solid black 2px;
    border-radius: 30px;
    height: 60px;
  }

  input {
    width: 100%;
    height: 50px;
    border-radius: 100px 0 0 100px;
    border: 1px solid rgb(224, 224, 224);
    padding: 0px 50px;
    box-sizing: border-box;
    z-index: 999;
    position: relative;
  }
}

.searchbar {
  width: 80%;
  display: flex;
  justify-content: center;
  position: relative;


  .icons-searchbar{
    position: absolute;
    z-index: 1000;
    top: 50%;
    transform: translate(0%, -50%);
    font-size: 20px;
  }

  .fa-filter{
    right: 55px;
    color: rgb(35, 126, 252);
  }

  .fa-search{
    left: 20px;
  }

  button {
    background-color: #ffffff;
    color: rgb(0, 0, 0);
    border: none;
    border-bottom: 1px solid rgb(224, 224, 224);
    border-right: 1px solid rgb(224, 224, 224);
    border-top: 1px solid rgb(224, 224, 224);
    padding: 10px 20px;
    border-radius: 0 100px 100px 0;
    overflow: hidden; /* Aggiunto overflow: hidden; */
    position: relative;
    z-index: 999;

    i {
      font-size: 20px;
      position: absolute; /* Aggiunto position: absolute; */
      top: 50%; /* Sposta l'icona verticalmente al centro del bottone */
      left: 50%; /* Sposta l'icona orizzontalmente al centro del bottone */
      transform: translate(-50%, -50%); /* Centra l'icona nel bottone */
    }
  }
}

.input-field {
  width: 100%;
}
</style>

<script>
import axios from "axios";

export default {
  data() {
    return {
      /* L'INPUT DELLA CITTA' CERCATA */
      cityInput: "",
      
      /* ARRAY PER I SUGGERIMENTI DELLA CITTA' CERCATA */
      suggestions: [],
      
      /* FINESTRA DELL'AUTOCOMPLETE SU SCHERMO */
      showAutocomplete: false,
      
      /* FINESTRA DELLA SEZIONE FILTRI SU SCHERMO  */
      showFilterSection: false,

      
    };
  },
  methods: {
    toggleFilterSection() {
      this.showFilterSection = !this.showFilterSection;
    },
    
    /* CLICK ALL'ESTERNO DELLE FINESTRE */
    handleClickOutside(event) {

      /* RECUPERO DELLE VARIE FINESTRE E INPUT */
      const searchbar = this.$refs.searchbar;
      const autocompleteSection = this.$refs.autocompleteSection;
      const filterSection = this.$refs.filterSection;
      const filterIcon = this.$refs.filterIcon;

      /* CONTROLLA SE IL CLICK E' AVVENUTO FUORI DALLA FINESTRA */
      if (
        searchbar && !searchbar.contains(event.target) &&
        autocompleteSection && !autocompleteSection.contains(event.target) &&
        filterIcon && !filterIcon.contains(event.target) &&
        !filterSection.contains(event.target)
      ) {
        
        /* CHIUDE LA FINESTRA DI AUTOCOMPLETAMENTO */
        this.closeAutocomplete();

        /* CHIUDE LA FINESTRA DI AUTOCOMPLETAMENTO */
        this.toggleFilterSection();
  }
},

    /* FUNZIONE PER L'AUTOCOMPLETE */
    async handleAutocomplete() {

      /* PRENDE I SUGGERIMENTI DALLA CITTA' CERCATA DALL'API DI TOMTOM */
      const response = await axios.get(`https://api.tomtom.com/search/2/search/${this.cityInput}.json?key=GQoylkWTb8A3X4kupHH9BTdJj1GJaVKo`);
      this.suggestions = response.data.results;
      
    },

    /* PASSA IL VALORE DELLA CITTA' CERCATA NEL MAIN */
    async selectCity(city) {

        this.$emit("select-city", city);


    },

    /* FUNZIONE DELLA RICERCA CON INVIO DA TASTIERA*/
    async search() {

      if (this.cityInput === '' || this.cityInput.length == 0) {
        this.$emit("search-city", this.cityInput);
        return;
      }


      /* CHIAMATA AXIOS PER LA CITTA' CERCATA*/
      const response = await axios.get(`https://api.tomtom.com/search/2/search/${this.cityInput}.json?key=GQoylkWTb8A3X4kupHH9BTdJj1GJaVKo`);
      this.suggestions = response.data.results;

      /* PASSAGGIO DELLA CITTA' CERCATA NEL MAIN */
      this.$emit("search-city", this.cityInput);
      
    },

    /* SELEZIONE DEL SUGGERIMENTO DELL'AUTOCOMPLETE */
    async selectSuggestion(result) {

      /* SUGGERIMENTO DELL'INDIRIZZO */
      this.cityInput = result.address.freeformAddress;
      this.search();

      /* UNA VOLTA CLICCATO IL SUGGERIMENTO SI CHIUDE LA FINESTRA */
      this.showAutocomplete = false; 
    },

    closeAutocomplete() {
      /* CHIUDE LA FINESTRA DELL'AUTOCOMPLETE */
      this.showAutocomplete = false; 
    },
  },
  mounted() {
    /* VERIFICA SE IL CLICK E' AVVENUTO NEL DOCUMENTO [PER LA CHIUSURA DELLE FINESTRE] */
    document.addEventListener("click", this.handleClickOutside);
  },

};
</script>


<template>

  <!-- HEADER -->
  <header class="d-flex align-items-center" style="position: fixed; width: 100%; z-index: 999;">

    <div class="container-fluid p-5">
      <div class="row">

        <!-- SEZIONE LOGO -->
        <div class="col-3">
          <div class="content colore-viola">

            <!-- RITORNO ALLA HOME -->
            <router-link class="d-flex align-items-center" :to="{ name: 'app-main' }">
              <svg class="Colore-viola" width="50" height="55" viewBox="0 0 70 55" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_237_340)">
                  <path
                    d="M28.224 3.99732C24.6985 6.04104 21.4176 7.9445 20.9489 8.22501L20.0726 8.70589V5.27966V1.85343H15.9969H11.9213L11.8805 7.58385L11.8194 13.3143L6.11339 16.6002C2.97511 18.4035 0.285155 19.9463 0.142506 20.0265C-0.0612789 20.1467 0.162884 20.8279 1.01878 22.8917C1.65051 24.3744 2.18035 25.5966 2.20073 25.6166C2.22111 25.6567 3.15852 25.1558 4.27933 24.5146C7.01005 22.9718 22.2939 14.1959 29.1818 10.2287L34.7044 7.04286L40.7975 10.5292C44.1396 12.4527 49.9475 15.7587 53.6971 17.8826C57.4467 19.9864 62.093 22.6312 64.0086 23.7132C65.9242 24.7951 67.5748 25.6968 67.6767 25.6968C67.8397 25.6968 70.061 20.4472 69.9387 20.3871C69.1032 19.9864 36.192 1.03193 35.4584 0.531022C35.2342 0.370731 34.9693 0.250512 34.847 0.250512C34.7247 0.250512 31.7495 1.93357 28.224 3.99732Z"
                    fill="#5968EF" />
                  <path
                    d="M27.3072 17.2614C25.0655 18.5638 19.9709 21.4891 15.9971 23.7732C12.0233 26.0774 8.41633 28.1612 8.00876 28.4217L7.23438 28.9026V32.1084C7.23438 33.8716 7.29551 35.3142 7.37702 35.3142C7.58081 35.3142 9.7613 34.092 15.6099 30.6858C22.2125 26.8589 25.6769 24.8953 25.8603 24.8953C25.9214 24.8953 25.9826 31.6676 25.9826 39.9226V54.97L28.7336 54.9099L31.5051 54.8498L31.4847 34.9335C31.4847 23.9736 31.4644 14.9773 31.4236 14.9572C31.4032 14.9372 29.5488 15.959 27.3072 17.2614Z"
                    fill="#5968EF" />
                  <path
                    d="M37.3945 34.8935V54.95H40.2475H43.1005L43.1413 39.8425L43.2024 24.715L44.9346 25.6767C45.8923 26.2177 50.1311 28.602 54.3494 30.9663C58.5677 33.3306 62.0728 35.2141 62.134 35.154C62.297 35.0137 62.2562 29.704 62.0728 29.143C61.971 28.7824 60.4222 27.8006 55.4295 24.9554C51.8429 22.9317 46.4833 19.8662 43.5081 18.1831C40.5328 16.48 37.9447 15.0374 37.7613 14.9572C37.4149 14.837 37.3945 15.8789 37.3945 34.8935Z"
                    fill="#5968EF" />
                </g>
                <defs>
                  <clipPath id="clip0_237_340">
                    <rect width="70" height="55" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span class="fw-bolder fs-2 ms-3  colore-viola">BoolBnB</span>
            </router-link>
          </div>


        </div>

        <!-- SEZIONE RICERCA -->
        <div class="col-6 align-items-center d-flex justify-content-center">
          <div class="searchbar" ref="searchbar">

            <!-- ICONA LENTE DI INGRANDIMENTO -->
            <i class="search icons-searchbar">
              <svg fill="#bbbbbb" height="20px" width="20px" version="1.1" id="Capa_1"
                xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 488.4 488.4"
                xml:space="preserve">
                <g>
                  <g>
                    <path d="M0,203.25c0,112.1,91.2,203.2,203.2,203.2c51.6,0,98.8-19.4,134.7-51.2l129.5,129.5c2.4,2.4,5.5,3.6,8.7,3.6
			                s6.3-1.2,8.7-3.6c4.8-4.8,4.8-12.5,0-17.3l-129.6-129.5c31.8-35.9,51.2-83,51.2-134.7c0-112.1-91.2-203.2-203.2-203.2
			                S0,91.15,0,203.25z M381.9,203.25c0,98.5-80.2,178.7-178.7,178.7s-178.7-80.2-178.7-178.7s80.2-178.7,178.7-178.7
			                S381.9,104.65,381.9,203.25z" />
                  </g>
                </g>
              </svg>
            </i>

            <i class="fas fa-filter icons-searchbar" @click="toggleFilterSection" ref="filterIcon"></i>

            <!-- INPUT RICERCA -->
            <input class="input-field" type="text" v-model="cityInput" placeholder="Cerca le destinazioni" name="city"
              @keyup.enter="search" @input="handleAutocomplete" @click="showAutocomplete = true" />

            <!-- PULSANTE CANCELLAZIONE RICERCA -->
            <button><i class="fa fa-xmark"></i></button>

            <!-- SEZIONE AUTOCOMPLETE -->
            <div class="autocomplete-section" v-show="showAutocomplete" ref="autocompleteSection">

              <!-- LISTA DEI SUGGERIMENTI -->
              <ul v-if="suggestions.length > 0" class="suggestions-list list-unstyled">

                <!-- SINGOLO SUGGERIMENTO -->
                <li v-for="(result, index) in suggestions" :key="index" @click="selectSuggestion(result)">
                  <div class="item-autocomplete">
                    <i class="fa-solid fa-location-dot me-2"></i>{{ result.address.freeformAddress }}
                  </div>
                </li>
              </ul>
            </div>

            <!-- SEZIONE FILTRI -->
            <div class="filter-section" v-show="showFilterSection" ref="filterSection">

            </div>
          </div>
        </div>

        <!-- BOTTONE VENDITORE -->
        <div class="col-3 align-items-center d-flex justify-content-end">
          <a href="http://127.0.0.1:8000/register" class="register-button">Registrati</a>
          <button type="button" class="vendor-button sfondo-viola">
            <a href="http://127.0.0.1:8000/login">Modalità venditore</a>
          </button>
        </div>

      </div>
    </div>
  </header>
</template>

<style lang="scss">

header {
  height: 100px;
  background-color: white;
/*   -webkit-box-shadow: 0px 2px 14px 0px #00000033;
  -moz-box-shadow: 0px 2px 14px 0px #00000033;
  -o-box-shadow: 0px 2px 14px 0px #00000033;
  box-shadow: 0px 2px 14px 0px #00000033;
 */
  .register-button{
    color: black;
    margin-right: 20px
  }
  .colore-viola{
    color: #5968EF;
  }
  .filter-section{
    width: 100%;
    max-width: 350px; /* Limita la larghezza massima della sezione filtro */
    height: 500px;
    background-color: rgba(255, 255, 255, 0);
    position: absolute;
    top: 60px;
    z-index: 1000;
    border-radius: 10px;
    right: 45px;
  }

 
  
  .vendor-button{
    background-color: #5968EF;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    border: none;
    font-weight: 700;
    transition-duration: 0.3s;
    font-size: 14px;

    &:hover{
      background-color: rgb(38, 38, 38);
    }
  }

  .autocomplete-section {
    max-height: 400px;
    width: calc(100% - 40px);
    background-color: rgb(255, 255, 255);
    position: absolute;
    top: 50%;
    z-index: 998;
    border-radius: 0 0 20px 20px;
    padding-top: 40px;
    overflow: scroll;
    left: 0;

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

  .content{
    display: flex;
    align-items: center
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
  max-width: 800px; /* Limita la larghezza massima della barra di ricerca */
  display: flex;
  justify-content: center;
  position: relative;


  .icons-searchbar{
    position: absolute;
    z-index: 1000;
    top: 50%;
    transform: translate(0%, -50%);
    font-size: 20px;
    display: flex;
  }

  .fa-filter{
    right: 55px;
    color: rgb(35, 126, 252);
    cursor: pointer;
  }

  .search{
    left: 20px;
    top: 50%;
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
    transition-duration: 0.2s;

    &:hover{
      background-color: rgb(243, 78, 78);
      color: white;
    }

    i {
      font-size: 20px;
      position: absolute; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%);
    }
  }
}

.input-field {
  width: 100%;
}
</style>

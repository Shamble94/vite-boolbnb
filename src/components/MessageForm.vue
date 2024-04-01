<template>
    <div>
  <h2>Contatta il proprietario dell'appartamento</h2>
  <div>
    <input type="hidden" name="_token" :value="csrfToken">
    <div class="form-group">
      <label for="name">Nome:</label>
      <input type="text" class="form-control" id="name" v-model="formData.name" required>
    </div>
    <div class="form-group">
      <label for="email">Email:</label>
      <input type="email" class="form-control" id="email" v-model="formData.email" required>
    </div>
    <div class="form-group">
      <label for="message">Messaggio:</label>
      <textarea class="form-control" id="message" rows="5" v-model="formData.message" required></textarea>
    </div>
    <button @click="sendMessage" class="btn btn-primary">Invia Messaggio</button>
  </div>
</div>

  </template>
  
  <script>
import axios from 'axios';

export default {
  data() {
    return {
      formData: {
        // Altri campi del modulo
      },
      csrfToken: '' // Inizializza la variabile per il token CSRF
    };
  },
  methods: {
    async fetchCsrfToken() {
      try {
        // Ottieni il token CSRF dal tag meta
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        this.csrfToken = csrfToken;
      } catch (error) {
        console.error('Errore durante il recupero del token CSRF:', error);
      }
    },
    async sendMessage() {
      // Invia la richiesta POST con Axios
      try {
        await axios.post('http://127.0.0.1:8000/api/messages', this.formData);
        // Gestisci la risposta
      } catch (error) {
        console.error('Errore durante l\'invio del messaggio:', error);
      }
    }
  },
  created() {
    // Carica il token CSRF quando il componente viene creato
},
mounted(){
      this.fetchCsrfToken();

  }
};
</script>
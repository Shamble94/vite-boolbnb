<template>
    <div class="m-3">
      <label for="name">Nome</label>
      <input type="text" id="name" v-model="name" class="form-control" placeholder="Inserisci il tuo nome"><hr>
      <label for="email">Email</label>
      <input type="email" id="email" v-model="email" class="form-control" placeholder="Inserisci il tuo indirizzo email"><hr>
      <label for="subject">Soggetto</label>
      <input type="text" id="subject" v-model="subject" class="form-control" placeholder="Inserisci l'oggetto del messaggio"><hr>
      <label for="message">Messaggio</label>
      <textarea v-model="message" id="message" placeholder="Scrivi qui il tuo messaggio"></textarea>
      <button @click="sendMessage">Send Message</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        message: '',
        name: '',
        email: '',
        subject: '',
      };
    },
    methods: {
      async sendMessage() {
        try {
          const response = await axios.post('http://127.0.0.1:8000/api/send-message', {
            name: this.name,
            email: this.email,
            subject: this.subject,
            message: this.message,
          });
          
          // Handle success response
          alert(response.data.message);
          
          // Clear input fields after successful message submission
          this.name = '';
          this.email = '';
          this.subject = '';
          this.message = '';
        } catch (error) {
          // Handle error
          alert('Error sending message');
          console.error(error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add your component styles here */
  textarea {
    width: 100%;
    height: 100px;
    margin-bottom: 10px;
  }
  </style>
  
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// La tua configurazione Vite
export default defineConfig({
  plugins: [vue()],
  server: {
    host: 'localhost', // Specifica localhost come host
    port: 5174, // Specifica 3000 come porta
    // Aggiungi altre opzioni di configurazione del server qui se necessario
  },
});

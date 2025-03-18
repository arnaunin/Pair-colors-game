import { defineConfig } from 'vite';

export default defineConfig({
  base: "./", // Usa rutas relativas en los enlaces generados en el HTML
  server: {
    watch: {
      usePolling: true, // Usa polling para detectar cambios
    }
  }
});

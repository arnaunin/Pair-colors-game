import { defineConfig } from 'vite';

export default defineConfig({
  base: "/Pair-colors-game/",
  server: {
    watch: {
      usePolling: true, // Usa polling para detectar cambios
    }
  }
});

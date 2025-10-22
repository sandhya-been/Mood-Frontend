// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Assuming React; adjust if needed
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add this line
  ],
});
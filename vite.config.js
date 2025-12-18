import { defineConfig } from 'vite';

// Remplace "NeoTerra" par le nom exact de ton dépôt GitHub si différent.
const repoName = 'NeoTerra';

export default defineConfig({
  base: `/${repoName}/`,
  publicDir: 'public',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 5173,
    open: true
  }
});


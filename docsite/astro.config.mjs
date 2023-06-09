import { defineConfig, sharpImageService } from 'astro/config';

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  experimental: {
    assets: true,
  },
  image: {
    service: sharpImageService(),
  },
  build: {
    inlineStylesheets: "auto",
  },
  integrations: [preact()]
});
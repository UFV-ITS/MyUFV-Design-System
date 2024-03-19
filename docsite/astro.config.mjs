import { defineConfig, sharpImageService } from 'astro/config';

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  image: {
    service: sharpImageService(),
  },
  build: {
    inlineStylesheets: "auto",
  },
  integrations: [preact()]
});
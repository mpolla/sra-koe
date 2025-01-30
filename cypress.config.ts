import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173/sra-ampumakoe-laskuri/'
  },
  // Perusluuri Samsung Galaxy A52 (2022)
  viewportHeight: 915,
  viewportWidth: 412
})

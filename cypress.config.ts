import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 411,
    viewportHeight: 823,
    baseUrl: 'http://localhost:8100',
  },
})

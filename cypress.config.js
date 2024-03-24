const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    baseUrl: "https://conduit.bondaracademy.com/",
    // APIUrl: "https://condui-api.bondaracademy.com/"
    // specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}' - optional to change the files naming
  },
});

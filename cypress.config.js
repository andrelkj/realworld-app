const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  env: {
    username: "cyapitest@test.coms",
    password: "P@ssw0rD!!",
    apiURL: "https://conduit-api.bondaracademy.com",
  },
  retries: {
    runMode: 2,
    openMode: 0
  },
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      const username = process.env.DB_USERNAME;
      const password = process.env.PASSWORD;

      //throw error message if there is no password
      // if (!password) {
      //   throw new Error(`missing PASSWORD environment variable`);
      // }

      config.env = { username, password };
      return config;
    },

    baseUrl: "https://conduit.bondaracademy.com/",
    // APIUrl: "https://condui-api.bondaracademy.com/"
    // specPattern: 'cypress/e2e/**/*.spec.{js,jsx,ts,tsx}' - optional to change the files naming
  },
});

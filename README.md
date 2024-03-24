# Cypress
## Adding environment variables
Environment variables can be created in the [cypress.config.js](/cypress.config.js) file as the example below:

```js
  env: {
    username: 'cyapitest@test.coms',
    password: 'P@ssw0rD!!',
    apiURL: 'https://conduit-api.bondaracademy.com',
  },
```

This variables will be available to everyone with access to the code and you can use it by specifying the existing variable whenever you want to call it with the `Cypress.env('variable')` method as in the example from the [firstTest.cy.js](/cypress/e2e/firstTest.cy.js) below:

```js
  it.only("delete new article from the global feed", () => {
    const bodyRequest = {
      article: {
        title: "Title",
        description: "Description",
        body: "Article body",
        tagList: [],
      },
    };

    cy.get("@token").then((token) => {
      cy.request({
        url: Cypress.env('apiURL')+"/api/articles/",
        headers: { Authorization: "Token " + token },
        method: "POST",
        body: bodyRequest,
      }).then((response) => {
        expect(response.status).to.equal(201);
      });

      cy.contains("Global Feed").click();
      cy.get(".preview-link").first().click();
      cy.get(".article-actions").contains("Delete Article").click();

      cy.request({
        url: Cypress.env('apiURL')+"/api/articles?limit=10&offset=0",
        headers: { Authorization: "Token " + token },
        method: "GET",
      })
        .its("body")
        .then((body) => {
          expect(body.articles[0].title).not.to.equal("Title");
        });
    });
  });
```

### Overiding environment variables
Another available options cypress give is to create a [cypress.env.json](/cypress.env.json) which will contain all you're local variables. This file is commonly added to the [.gitignore](.gitignore) file so that it's only avaiable to you locally.

The main point of using this environment json file is that it will overide the test variables no mather their value is without actually changing the code itself.

#### Replacing sensitive data from process variables
By appling the environment variables in our local environment json file we are exposing the used data that might be sensitive. In this case one option is to create process variables to replace it along the running process as in the example below:

Command with data exposed
- `npx cypress open --env username=cytest3@test.com, password=Welcome567`

Command using process variables with mocked data
- `npx cypress open --env username=$DB_USERNAME, password=$PASSWORD`

1) Firstly we need to define our process variables in the [cypress.config.js](/cypress.config.js) file as below:

```js
  e2e: {
    setupNodeEvents(on, config) {
      const username = process.env.DB_USERNAME;
      const password = process.env.PASSWORD;

      //throw error message if there is no password
      if (!password) {
        throw new Error(`missing PASSWORD environment variable`);
      }

      config.env = {username, password}
      return config
    },
  }
```
2) Then we assign a value to this variables and run the test using the terminal command `DB_USERNAME="cytest3@test.com" PASSWORD="Welcome567" npm run cy:open_process`

**Note:** By using the process variables we generate temporary credentials that needs to be assign every time you run the test

## Usefull cypress commands
Running tests without cypress GUI:
- `npx cypress run`
- `npx cypress run --browser chrome`
- `npx cypress run --spec "cypress/e2e/secondTest.cy.js"`

Creating commands to compile and run cypress:
- `start-test start http-get://localhost:4200 cypress:run`

Adding local environment variables to the test run:
- `npx cypress open --env username=cytest3@test.com, password=Welcome567`

**Note:** In order to assure we way the application to be compiled running cypress test cases we need to install the [start-server-and-test](https://www.npmjs.com/package/start-server-and-test) npm package
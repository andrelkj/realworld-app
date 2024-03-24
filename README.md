# Cypress
## Usefull cypress commands

Running tests without cypress GUI:
- `npx cypress run`
- `npx cypress run --browser chrome`
- `npx cypress run --spec "cypress/e2e/secondTest.cy.js"`

Creating commands to compile and run cypress:
- `start-test start http-get://localhost:4200 cypress:run`
*Note:* In order to assure we way the application to be compiled before running cypress test cases we need to install the [start-server-and-test](https://www.npmjs.com/package/start-server-and-test) npm package
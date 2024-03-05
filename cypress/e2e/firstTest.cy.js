describe("Test with backend", () => {
  beforeEach("login to application", () => {
    cy.loginToApplication();
  });

  it.only("verify correct request and response", () => {
    cy.contains('New Article').click()
    cy.get('[formcontrolname="title"]').type('This is the title')
    cy.get('[formcontrolname="description"]').type('This is a description')
    cy.get('[formcontrolname="body"]').type('This is a body of the article')
    cy.contains('Publish Article').click()

  });
});

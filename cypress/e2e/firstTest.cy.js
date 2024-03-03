describe('Test with backend', () => {

  beforeEach('login to application', () => {
    cy.loginToApplication()
  })

  it('first', () => {
    cy.visit('Yaaaay we logged in')
  })
})
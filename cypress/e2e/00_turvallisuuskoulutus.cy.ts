describe('Turvallisuusinfon kuittaamisen pakollisuus', () => {
  
  // Jatka-nappi ei saa toimia jos turvallisuusinfoa ei ole kuitattu
  // läpikäydyksi.
  it('passes', () => {
    cy.syotaAmpujat()
    cy.get('.action').contains('Jatka').click()
    cy.get('.action').contains('Jatka').should('be.disabled')
  })
})

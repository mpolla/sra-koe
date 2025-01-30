describe('Turvallisuusinfon kuittaamisen pakollisuus', () => {


  // Jatka-nappi ei saa toimia jos turvallisuusinfoa ei ole kuitattu
  // läpikäydyksi.
  it('passes', () => {

    cy.get('.rasti').contains('Rasti 4').click()

    // Rasti 4
    for(let ampuja of [1,2,3,4]) {
      cy.get('input[id="aika1"]').type('9.87')
      cy.get('button[id=T0Aplus]').click().click().click().click()
      cy.get('button[id=T0Cplus]').click().click()
      cy.get('button[id=T1Aplus]').click().click()
      cy.get('button[id=T1Cplus]').click().click().click()
      cy.get('button[id=T1Dplus]').click()
      cy.get('.action').contains('Seuraava ampuja').click()
    }
  })
})

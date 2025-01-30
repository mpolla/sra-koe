describe('Turvallisuusinfon kuittaamisen pakollisuus', () => {

  // Jatka-nappi ei saa toimia jos turvallisuusinfoa ei ole kuitattu
  // läpikäydyksi.
  it('passes', () => {

    cy.get('.rasti').contains('Rasti 3').click()

    // Rasti 3
    for(let ampuja of [1,2,3,4]) {
      cy.get('input[id="aika1"]').type('9.87')
      // Kaksi laukausta ensimmäiseen tauluun
      cy.get('button[id=T0Aplus]').click().click()
      // Kaksi laukausta toiseen tauluun
      cy.get('button[id=T1Aplus]').click().click()

      // Ja vielä kaksi laukausta ensimmäiseen tauluun
      cy.get('button[id=T0Cplus]').click().click()

      cy.get('.action').contains('Seuraava ampuja').click()
    }



  })
})

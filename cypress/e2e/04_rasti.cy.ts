


describe('Rasti 4', () => {

  it('passes', () => {

    cy.alustaKoe()

    cy.get('.rasti').contains('Rasti 4').click()

    for(let ampuja of Array(4)) {
      cy.aika1(22, 10)
      cy.ammu(0, 6)
      cy.ammu(1, 6)
      cy.get('.action').contains('Seuraava ampuja').click()
    }
  })
})

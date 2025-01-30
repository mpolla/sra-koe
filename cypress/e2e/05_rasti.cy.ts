describe('Rasti 5', () => {

  it('passes', () => {

    cy.alustaKoe()

    cy.get('.rasti').contains('Rasti 5').click()

    for(let ampuja of Array(4)) {
      cy.aika1(12, 12)
      cy.ammu(0, 4)
      cy.ammu(1, 4)
      cy.get('.action').contains('Seuraava ampuja').click()
    }

  })
})

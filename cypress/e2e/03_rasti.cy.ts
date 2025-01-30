describe('Rasti 3', () => {

  it('passes', () => {

    cy.alustaKoe()

    cy.get('.rasti').contains('Rasti 3').click()

     for(let ampuja of Array(4)) {
      cy.aika1(12, 10)
      cy.ammu(0, 4)
      cy.ammu(1, 2)
      cy.get('.action').contains('Seuraava ampuja').click()
    }
  })
})

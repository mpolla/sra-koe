describe('Rasti 2', () => {

  it('passes', () => {

    cy.alustaKoe()

    cy.get('.rasti').contains('Rasti 2').click()

    for(let ampuja of Array(4)) {
      cy.aika1(6, 7)
      cy.aika2(6, 7)
      cy.aika3(6, 7)
      cy.ammu(0, 6)
      cy.ammu(1, 6)
      cy.get('.action').contains('Seuraava ampuja').click()
    }
  })
})

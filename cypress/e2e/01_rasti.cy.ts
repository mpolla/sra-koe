describe('Rasti 1', () => {

  it('passes', () => {

    cy.alustaKoe()

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

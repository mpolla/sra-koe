describe('SRA ampumakoe', () => {

  it('passes', () => {

    cy.alustaKoe()

    // Rasti 1
    for(let ampuja of Array(4)) {
      cy.aika1(6, 7)
      cy.aika2(6, 7)
      cy.aika3(6, 7)
      cy.ammu(0, 6)
      cy.ammu(1, 6)
      cy.get('.action').contains('Seuraava ampuja').click()
    }

    // Rasti 2
    for(let ampuja of Array(4)) {
      cy.aika1(6, 7)
      cy.aika2(6, 7)
      cy.aika3(6, 7)
      cy.ammu(0, 6)
      cy.ammu(1, 6)
      cy.get('.action').contains('Seuraava ampuja').click()
    }

    // Rasti 3
    for(let ampuja of Array(4)) {
      cy.aika1(12, 10)
      cy.ammu(0, 4)
      cy.ammu(1, 2)
      cy.get('.action').contains('Seuraava ampuja').click()
    }

    // Rasti 4
    for(let ampuja of Array(4)) {
      cy.aika1(22, 10)
      cy.ammu(0, 6)
      cy.ammu(1, 6)
      cy.get('.action').contains('Seuraava ampuja').click()
    }

    // Rasti 5
    for(let ampuja of Array(4)) {
      cy.aika1(12, 12)
      cy.ammu(0, 4)
      cy.ammu(1, 4)
      cy.get('.action').contains('Seuraava ampuja').click()
    }

  })
})

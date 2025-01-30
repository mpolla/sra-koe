/// <reference types="cypress" />

export {}

Cypress.Commands.add("syotaAmpuja", (nimi: string) => {
  cy.get('input[id="uusinimi"]').type(nimi).type('{enter}')
});

Cypress.Commands.add("syotaAmpujat", () => {
    cy.visit('/')
    cy.syotaAmpuja("Kaarlo Kaskela")
    cy.syotaAmpuja("Helena Himanen")
    cy.syotaAmpuja("Timo Nieminen")
    cy.syotaAmpuja("Gisella Glock")
});

Cypress.Commands.add("alustaKoe", () => {
    cy.syotaAmpujat()
    cy.get('.action').contains('Jatka').click()
    cy.get('input[id="turvallisuuskuittaus"]').click()
    cy.get('.action').contains('Jatka').click()
    cy.get('.action').contains('Aloita ampumakoe').click()
});

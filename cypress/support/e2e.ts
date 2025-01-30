// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import {beforeAll} from "vitest";

// Alternatively you can use CommonJS syntax:
// require('./commands')


// Esivaatimuksena ampujien syöttäminen
beforeEach(() => {
    cy.visit('/')
        .get('input[id="uusinimi"]')
        .type('Matti Meikäläinen').type('{enter}')
        .type('Tiina Testi').type('{enter}')
        .type('Kalle Koehenkilö').type('{enter}')
        .type('Gabriella Glock').type('{enter}')
    cy.get('.action').contains('Jatka').click()

    cy.get('.action').contains('Jatka').should('be.disabled')

    cy.get('input[id="turvallisuuskuittaus"]').click()
    cy.get('.action').contains('Jatka').click()
    cy.get('.action').contains('Aloita ampumakoe').click()
})

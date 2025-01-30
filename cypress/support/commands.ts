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

function randomAika(ohjeaika: number, ohjeajanmaxylitys: number) {
    const randomAika = String(Math.round(100*(ohjeaika + ohjeajanmaxylitys*Math.random()))).replace(/0/g,'1')
    return randomAika[0] + '{moveToEnd}' + randomAika.substring(1)
}

Cypress.Commands.add("aika1", (ohjeaika: number, maxylitys: number) => {
    cy.get('input[id="aika1"]').type(randomAika(ohjeaika, maxylitys))
});
Cypress.Commands.add("aika2", (ohjeaika: number, maxylitys: number) => {
    cy.get('input[id="aika2"]').type(randomAika(ohjeaika, maxylitys))
});
Cypress.Commands.add("aika3", (ohjeaika: number, maxylitys: number) => {
    cy.get('input[id="aika3"]').type(randomAika(ohjeaika, maxylitys))
});

// 60 % Alpha
// 20 % Charlie
// 15 % Delta
//  5 % Mike
function randomOsuma() {
    const r = Math.random()
    if (r > .4) {
        return 'A'
    } else if (r > .2) {
        return 'C'
    } else if (r > .05) {
        return 'D'
    } else {
        return 'Ohi'
    }
}

Cypress.Commands.add("ammu", (taulu: number, laukaukset: number) => {
    for (let laukaus of Array(laukaukset))
        cy.get('button[id=T' + taulu + randomOsuma() + 'plus]').click()
});

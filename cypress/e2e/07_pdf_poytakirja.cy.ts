// Varmistetaan, että luotu PDF-pöytäkirja sisältää oikean sisällön:
// ampujan nimen, yhteispisteet ja hyväksytty/hylätty-tuloksen. Tulos merkitään
// pöytäkirjaan 'X'-ruksina (hyväksytty x≈336, hylätty x≈399), joten tarkistus
// tehdään sijainnin perusteella pdfjs:llä (ks. cypress.config.ts task 'luePdf').

const LATAUKSET = 'cypress/downloads'
const KAARLO = 'Kaarlo Kaskela'

// Kirjaa Kaarlolle kaikki laukaukset annettuun osumaluokkaan kaikilla viidellä
// rastilla. Keypadille mennään suoraan syvälinkillä (tila säilyy localStoragessa),
// jotta muiden ampujien kiertävä järjestys ei sekoita kirjausta.
function pisteytaKaarlo(luokka: string) {
  // Rasti 1 (indeksi 0): kolme aikaa, 6 + 6 laukausta
  cy.visit('/kirjaus/0/' + KAARLO)
  cy.aika1(6, 7)
  cy.aika2(6, 7)
  cy.aika3(6, 7)
  cy.ammuLuokka(0, luokka, 6)
  cy.ammuLuokka(1, luokka, 6)

  // Rasti 2 (indeksi 1): kolme aikaa, 6 + 6 laukausta
  cy.visit('/kirjaus/1/' + KAARLO)
  cy.aika1(6, 7)
  cy.aika2(6, 7)
  cy.aika3(6, 7)
  cy.ammuLuokka(0, luokka, 6)
  cy.ammuLuokka(1, luokka, 6)

  // Rasti 3 (indeksi 2): yksi aika, 4 + 2 laukausta
  cy.visit('/kirjaus/2/' + KAARLO)
  cy.aika1(12, 10)
  cy.ammuLuokka(0, luokka, 4)
  cy.ammuLuokka(1, luokka, 2)

  // Rasti 4 (indeksi 3): yksi aika, 6 + 6 laukausta
  cy.visit('/kirjaus/3/' + KAARLO)
  cy.aika1(22, 10)
  cy.ammuLuokka(0, luokka, 6)
  cy.ammuLuokka(1, luokka, 6)

  // Rasti 5 (indeksi 4): yksi aika, 4 + 4 laukausta (pistooliversio)
  cy.visit('/kirjaus/4/' + KAARLO)
  cy.aika1(12, 12)
  cy.ammuLuokka(0, luokka, 4)
  cy.ammuLuokka(1, luokka, 4)
}

// Onko ruutuun merkitty 'X' annetulle x-välille (tulosruudun rivillä y≈83)?
function onRuksi(items: Array<{ str: string; x: number; y: number }>, xMin: number, xMax: number) {
  return items.some((it) => it.str === 'X' && it.x >= xMin && it.x <= xMax && it.y > 75 && it.y < 92)
}

describe('PDF-pöytäkirja', () => {
  beforeEach(() => {
    cy.task('tyhjennaLataukset', LATAUKSET)
    cy.alustaKoe()
  })

  it('hyväksytty suoritus: nimi, pisteet ja hyväksytty-ruksi', () => {
    // Pelkkiä alfoja -> 250 pistettä, osumakerroin selvästi yli 1.3 -> hyväksytty
    pisteytaKaarlo('A')

    cy.visit('/ampuja/' + KAARLO)
    cy.get('.action').contains('PDF-pöytäkirja').click()

    cy.task('luePdf', { dir: LATAUKSET, match: 'Kaarlo-Kaskela' }, { timeout: 30000 }).then(
      (pdf: any) => {
        // Ampujan nimi
        expect(pdf.text).to.include(KAARLO)
        // Yhteispisteet (5 rastia * kaikki alfat = 250)
        expect(pdf.text).to.include('250')
        // Hyväksytty-ruksi paikallaan (x≈336), hylätty-ruutu tyhjä (x≈399)
        expect(onRuksi(pdf.items, 330, 345), 'hyväksytty-ruksi').to.be.true
        expect(onRuksi(pdf.items, 393, 406), 'hylätty-ruksi puuttuu').to.be.false
      }
    )
  })

  it('hylätty suoritus: manuaalinen hylkäys näkyy ruksina ja perusteena', () => {
    // Kaarlo ampuu läpi hyväksytyn suorituksen, mutta tuomari kirjaa hylkäyksen.
    pisteytaKaarlo('A')

    cy.visit('/ampuja/' + KAARLO)
    // Hylkäyksen syy kysytään window.promptilla -> stubataan deterministiseksi.
    cy.window().then((win) => {
      cy.stub(win, 'prompt').returns('Ennenaikainen laukaus')
    })
    cy.get('.action').contains('Kirjaa hylkäys').click()

    cy.get('.action').contains('PDF-pöytäkirja').click()

    cy.task('luePdf', { dir: LATAUKSET, match: 'Kaarlo-Kaskela' }, { timeout: 30000 }).then(
      (pdf: any) => {
        // Ampujan nimi
        expect(pdf.text).to.include(KAARLO)
        // Hylätty-ruksi paikallaan (x≈399), hyväksytty-ruutu tyhjä (x≈336)
        expect(onRuksi(pdf.items, 393, 406), 'hylätty-ruksi').to.be.true
        expect(onRuksi(pdf.items, 330, 345), 'hyväksytty-ruksi puuttuu').to.be.false
        // Hylkäyksen peruste tulostettu
        expect(pdf.text).to.include('Ennenaikainen laukaus')
      }
    )
  })
})

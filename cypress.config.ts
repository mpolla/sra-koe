import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}',
    baseUrl: 'http://localhost:4173/sra-koe/',
    setupNodeEvents(on) {
      const fs = require('fs')
      const path = require('path')

      on('task', {
        // Tyhjennä latauskansio ennen PDF-testiä, jotta uusin tiedosto on
        // varmasti se, jonka juuri loimme.
        tyhjennaLataukset(dir: string) {
          if (fs.existsSync(dir)) {
            for (const tiedosto of fs.readdirSync(dir)) {
              fs.unlinkSync(path.join(dir, tiedosto))
            }
          }
          return null
        },

        // Lue ladattu PDF ja palauta sen tekstisisältö sijainteineen (pdfjs).
        // Palauttaa { text, items: [{ str, x, y }] } uusimmasta hakuun
        // täsmäävästä tiedostosta.
        async luePdf({ dir, match }: { dir: string; match: string }) {
          const pdfjs = require('pdfjs-dist/legacy/build/pdf.js')

          // Odota, että downloadjs on ehtinyt kirjoittaa tiedoston valmiiksi
          // (koko > 0).
          const odota = (ms: number) => new Promise((r) => setTimeout(r, ms))
          let tiedostopolku: string | null = null
          for (let yritys = 0; yritys < 50; yritys++) {
            if (fs.existsSync(dir)) {
              const ehdokkaat = fs
                .readdirSync(dir)
                .filter((n: string) => n.includes(match) && n.endsWith('.pdf'))
                .map((n: string) => {
                  const p = path.join(dir, n)
                  return { p, ...fs.statSync(p) }
                })
                .filter((f: any) => f.size > 0)
                .sort((a: any, b: any) => b.mtimeMs - a.mtimeMs)
              if (ehdokkaat.length > 0) {
                tiedostopolku = ehdokkaat[0].p
                break
              }
            }
            await odota(500)
          }
          if (tiedostopolku == null) {
            throw new Error(
              'PDF-tiedostoa ei löytynyt kansiosta ' + dir + ' haulla "' + match + '"'
            )
          }

          const data = new Uint8Array(fs.readFileSync(tiedostopolku))
          const doc = await pdfjs.getDocument({
            data,
            isEvalSupported: false
          }).promise
          const page = await doc.getPage(1)
          const tc = await page.getTextContent()
          const items = tc.items
            .filter((it: any) => typeof it.str === 'string')
            .map((it: any) => ({ str: it.str, x: it.transform[4], y: it.transform[5] }))
          const text = items.map((it: any) => it.str).join(' ')
          return { text, items }
        }
      })
    }
  },
  downloadsFolder: 'cypress/downloads',
  // Perusluuri Samsung Galaxy A52 (2022)
  viewportHeight: 915,
  viewportWidth: 412
})

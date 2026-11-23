import { describe, expect, it } from 'vitest'
import { tulkitseAika } from '../Util'

/** Simuloi numeroiden näppäilyä yksi kerrallaan, kuten keyup-käsittelijä näkee ne. */
const nappaile = (numerot: string): string => {
    let arvo = ''
    for (const n of numerot) {
        arvo += n
        arvo = tulkitseAika(arvo) ?? arvo
    }
    return arvo
}

describe('tulkitseAika', () => {
    it('jättää lyhyet ja valmiiksi muotoillut arvot ennalleen', () => {
        expect(tulkitseAika('1')).toBeNull()
        expect(tulkitseAika('12')).toBeNull()
        expect(tulkitseAika('12.34')).toBeNull()
    })

    it('lisää desimaalierottimen', () => {
        expect(tulkitseAika('123')).toBe('1.23')
        expect(tulkitseAika('1.234')).toBe('12.34')
        expect(tulkitseAika('002003')).toBe('20.03')
    })

    it.each([
        ['1234', '12.34'],
        ['1210', '12.10'],
        ['1201', '12.01'],
        ['2050', '20.50'],
        ['1000', '10.00'],
        ['1028', '10.28'],
        ['12340', '123.40'],
    ])('näppäily %s --> %s', (numerot, odotettu) => {
        expect(nappaile(numerot)).toBe(odotettu)
    })
})

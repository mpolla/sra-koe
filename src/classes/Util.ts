import pako from 'pako'

export const kirjaaHylkays = (pisteetStore: any, ampuja: string) => {
    const peruste = window.prompt("Ampujan " + ampuja + " hylkäämisen syy?", "") as string
    if (peruste != null && peruste !== "") {
        pisteetStore.kirjaaHylkays(ampuja, peruste)
    }
}

export const peruHylkays = (pisteetStore: any, ampuja: string) => {
    pisteetStore.peruHylkays(ampuja)
}

export const jakoLinkki = (jakoData: Korttidata): string => {
    return "./tulos?d=" + koodaaTiedot(jakoData)
}

/**
 * Yksittäisen ampujan tuloksen koodaus JSON-oliotksi, joka välitetään pakattuna ja base64-koodattuna
 * tuloskorttille.
 */
export const jakoData = (ampuja: string, pisteetStore: any): Korttidata => {
    return {
        "n": ampuja,
        "dl": pisteetStore.getAikaJaPaikka(),
        "r": [
            pisteetStore.getAmpujaRastiLuokkaOsumat(ampuja, 0),
            pisteetStore.getAmpujaRastiLuokkaOsumat(ampuja, 1),
            pisteetStore.getAmpujaRastiLuokkaOsumat(ampuja, 2),
            pisteetStore.getAmpujaRastiLuokkaOsumat(ampuja, 3),
            pisteetStore.getAmpujaRastiLuokkaOsumat(ampuja, 4)
        ],
        "a": [
            pisteetStore.getAmpujanRastiAika(ampuja, 0),
            pisteetStore.getAmpujanRastiAika(ampuja, 1),
            pisteetStore.getAmpujanRastiAika(ampuja, 2),
            pisteetStore.getAmpujanRastiAika(ampuja, 3),
            pisteetStore.getAmpujanRastiAika(ampuja, 4)
        ],
        "h": pisteetStore.getHylkaysperuste(ampuja),
        "tn": pisteetStore.getTuomariNimi(),
        "tno": pisteetStore.getTuomariNumero()
    } as Korttidata
}

export function koodaaTiedot(tulostiedot: Korttidata): string {
    const json = JSON.stringify(tulostiedot)
    const compressed = pako.deflate(json)
    const base64 = window.btoa(
        String.fromCharCode(...compressed)
    )
    // URL-turvallinen base64
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
}
/**
 * Syötetyn ajan tulkinta: desimaalierotin lisätään automaattisesti kahden viimeisen numeron eteen.
 *
 * "121" --> "1.21", "1210" --> "12.10", "002003" --> "20.03"
 *
 * Palauttaa uuden arvon tai null, jos arvoa ei tarvitse muuttaa (alle 3 merkkiä tai valmiiksi
 * muodossa xxxx.yy).
 */
export const tulkitseAika = (arvo: string): string | null => {
    if (arvo.length < 3 || /^[0-9]{0,4}\.[0-9]{2}$/.test(arvo)) {
        return null
    }
    const vainnumerot = arvo.replace(/[^0-9]/g, "").replace(/^0+/, "").padStart(3, '0')
    return vainnumerot.substring(0, vainnumerot.length - 2) + "." + vainnumerot.substring(vainnumerot.length - 2)
}

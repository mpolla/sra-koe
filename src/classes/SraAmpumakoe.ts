export class SraAmpumakoe {
    static laukausMaaratPistoolilla = [
        // Rasti 1: Kahdella ja yhdellä kädellä
        [6, 6],
        // Rasti 2: Käännökset
        [6, 6],
        // Rasti 3: Siirtyminen sivulle ja lippaan vaihto
        [4, 2],
        // Rasti 4: Siirtyminen eteen päin ja lippaan vaihto
        [6, 6],
        // Rasti 5: Siirtyminen taakse (pistooliversio)
        [4, 4]]

    static laukausMaaratKivaarilla = [
        // Rasti 1: Kahdella ja yhdellä kädellä
        [6, 6],
        // Rasti 2: Käännökset
        [6, 6],
        // Rasti 3: Siirtyminen sivulle ja lippaan vaihto
        [4, 2],
        // Rasti 4: Siirtyminen eteen päin ja lippaan vaihto
        [6, 6],
        // Rasti 5: Siirtyminen taakse (kivääriversio)
        [6, 6]]

    static osumaluokat = ['A', 'C', 'D', 'Ohi', 'Rang']

    static rastit = [0, 1, 2, 3, 4]

    static osumaPisteytys = { 'A': 5, 'C': 3, 'D': 1, 'Ohi': -10, 'Rang': -10 }

    static rastikuvaus = (rasti: number): string => {
        switch (rasti) {
            case 0: return "RASTI 1: 10 m. Lähtöasento seisten kohti tauluja, ohjeaika 5 s/sarja. 1. ja 2. sarjassa pistooli kotelossa, 3. sarjassa pistooli pöydällä (jos ei pöytää, kädessä) ladattuna. 1. SARJA: 2 lks. per taulu, molemmin käsin. 2. SARJA: 2 lks. per taulu vahvemmalla kädellä. 3. SARJA: 2 lks. per taulu heikommalla kädellä"
            case 1: return "RASTI 2. 10 m. Lähtöasento pistooli ladattuna kotelossa, 1. sarjassa selkä kohti tauluja, 2. sarjassa vasen kylki kohti tauluja ja 3. sarjassa oikea kylki kohti tauluja, ohjeaika 5s/sarja. 1. SARJA: käännös 180° ja 2 lks. per taulu. 2. SARJA: käännös 90° ja 2 lks. per taulu. 3. SARJA: käännös 90° ja 2 lks. per taulu'"
            case 2: return "RASTI 3. 10 m. Lähtöasento selin kädet ylhäällä pistooli ladattuna kotelossa, ohjeaika 15 sekuntia, ampuja saa valita aloittaako paikasta A vai B. Suoritus: käännös 180° ja 2 lks. edessä olevaan tauluun paikasta A tai B, siirtyminen toiseen paikkaan, siirtymisen aikana lippaanvaihto. Toisesta paikasta B/A 2 lks. edessä olevaan tauluun ja siirtyminen lähtöpaikkaan, siirtymisen aikana lippaanvaihto. Lähtöpaikasta 2 lks. edessä olevaan tauluun."
            case 3: return "RASTI 4. 20–15–10 m, ohjeaika 25 sekuntia. Lähtö seisten kohti tauluja pistooli ladattuna kotelossa. Suoritus: 2 lks. per taulu paikasta A (20 m) seisaaltaan, siirtyminen, jonka aikana lippaan vaihto, paikkaan B (15 m), josta 2 lks. per taulu polvelta, siirtyminen jonka aikana lippaan vaihto paikkaan C (10 m) josta 2 lks. per taulu makuulta. Jos koeradalla makuulta ampuminen ei onnistu, niin asento paikassa C on myös polvelta."
            case 4: return "RASTI 5. Valinnainen kivääri piippu 45 asteen kulmassa alaspäin tai pistooli ladattuna kotelossa. Ohjeaika 15 sekuntia. Kivääri: 20 m, lähtö seisten kohti tauluja. Ampuja valitsee aloittaako paikasta A vai B. Lähtöpaikasta 2 lks. kumpaankin tauluun, siirtyminen paikkaan B/A, josta 2 lks. kumpaankin tauluun, siirtyminen paikkaan C, josta 2 lks. kumpaankin tauluun. Pistooli: 10–15 m, lähtö 10 m paikalta seisten kohti tauluja. 10 metristä 2 lks. kumpaankin tauluun, siirtyminen 15 metriin, josta 2 lks. kumpaankin tauluun."
        }
        return ''
    }

    static osumaLuokatLausuttuna = (osumaluokka: string): string => {
        switch(osumaluokka) {
            case 'A':
                return 'alpha'
            case 'C':
                return 'charlie'
            case 'D':
                return 'delta'
            case 'Ohi':
                return 'mike'
            case 'Rang':
                return 'procedural'
        }
        return ''
    }


}

export enum RastiSuorituksenTila {
    Suorittamatta,
    Kesken,
    Suoritettu
}

export enum KokeenSuorituksenTila {
    Suorittamatta,
    Kesken,
    Hylatty,
    Hyvaksytty
}
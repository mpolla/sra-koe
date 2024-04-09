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
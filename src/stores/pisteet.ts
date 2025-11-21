import {defineStore} from 'pinia'
import {RastiSuorituksenTila, SraAmpumakoe} from "@/classes/SraAmpumakoe";

type AmpujaPisteet = {
  [nimi: string]: Array<Array<Array<number>>>
}
type AmpujaAjat = {
  [nimi: string]: Array<Array<number>>
}
type Hylkaykset = {
  [nimi: string]: string
}
type Rastin5Suoritustavat = {
  [nimi: string]: string
}

const jarjestysOnSama = (a: string[], b: string[]) => {
  return a.length === b.length && a.every((el, idx) => el === b[idx]);
}

export const usePisteetStore = defineStore('pisteet', {
  state: () => ({
    turvallisuuskoulutusSuoritettu: false,
    mute: true,
    count: 0,
    pisteet: {} as AmpujaPisteet,
    ajat: {} as AmpujaAjat,
    hylkaykset: {} as Hylkaykset,
    rastin5suoritustavat: {} as Rastin5Suoritustavat,
    jarjestys: '',
    tuomari_nimi: '',
    tuomari_sraid: '',
    tuomari_puhelin: '',
    koetilaisuus_paikka: '',
    koetilaisuus_paiva: ''
  }),
  persist: true,
  actions: {
    lisaaPelaaja(nimi: any) {
      this.pisteet[nimi] = new Array(5).fill(0).map(() => new Array(6).fill(0).map(() => new Array(2).fill(0)))
      this.ajat[nimi] = new Array(5).fill(0).map(() => new Array(3).fill(0))
      this.rastin5suoritustavat[nimi] = 'pist'
      // Jos lisätään uusi ampuja, tarvitaan uusi vahvistus, että turvallisuuskoulutus on annettu kaikille
      this.turvallisuuskoulutusSuoritettu = false
    },
    getPelaajanPisteet(nimi: any): number[][][] {
      return this.pisteet[nimi]
    },
    getPelaajanRastiAika(nimi: string, rasti: number) {
      return this.ajat[nimi][rasti].reduce((a, b) => Number(a) + Number(b), 0)
    },
    getPelaajanRastiAjat(nimi: any, rasti: any) {
      return this.ajat[nimi][rasti]
    },
    osumaSumma(pist: Array<Array<number>>, luokka: number) : number {
      return pist[luokka].reduce((a, b) => Number(a) + Number(b), 0)
    },

    getPelaajaRastiLuokkaOsumat(ampuja: string, rasti: number) {
      return this.pisteet[ampuja][rasti].map((it) => it.reduce((a,b) => a+b, 0))
    },
    getLuPi(luokka: number, osumat: number) {
      switch(luokka) {
        case 0:
          return 5 * osumat
        case 1:
          return 3 * osumat
        case 2:
          return osumat
        case 3:
        case 4:
          return -10 * osumat
      }
      return 0
    },
    getPelaajaRastiPisteet(pelaaja: string, rasti: number) {
      return this.getPelaajaRastiLuokkaOsumat(pelaaja, rasti).map((osumat, index) => this.getLuPi(index, osumat))
    },
    getPelaajaRastiPisteSumma(pelaaja: string, rasti: number) {
      const summa = this.getPelaajaRastiPisteet(pelaaja, rasti).reduce((a, b) => a + b, 0)
      // TODO: Voiko kokeessa rastin pistesumma olla alle 0? Oletus: ei.
      return Math.max(0, summa)
    },
    // Ampujan yhteispisteet (osittain suoritettuja rasteja ei lasketa)
    getPelaajanPisteSumma(ampuja: string) : number {
      return [0,1,2,3,4].map((rasti) =>
          this.getRastiSuorituksenTila(ampuja, rasti) == RastiSuorituksenTila.Suoritettu ? this.getPelaajaRastiPisteSumma(ampuja, rasti) : 0).reduce((a,b) => a + b)
    },

    // Ampujan kokonaisaika (osittain suoritettuja rasteja ei lasketa)
    getPelaajanAikaSumma(ampuja: string) : number {
      return [0, 1, 2, 3, 4].map(rasti =>
          this.getRastiSuorituksenTila(ampuja, rasti) == RastiSuorituksenTila.Suoritettu ? this.ajat[ampuja][rasti].reduce((a,b)=> a + b, 0) : 0)
          .reduce((a,b)=>a+b,0)
    },
    getPelaajanOsumakerroin(ampuja: string) : number {
      return this.getPelaajanPisteSumma(ampuja) / this.getPelaajanAikaSumma(ampuja)
    },
    getKaikkiAmmuttu(ampuja: string) : boolean {
      return [0,1,2,3,4].map((x) => this.getRastiSuorituksenTila(ampuja, x)).filter(num => num === RastiSuorituksenTila.Suoritettu).length === 5
    },
    getRastiSuorituksenTila(ampuja: string, rasti: number) {

      // Onko kaikki laukaukset pisteytetty?
      const pisteytetytOsumat = this.getPelaajaRastiLuokkaOsumat(ampuja, rasti).reduce((a,b) => a + b, 0)

      const rastinLaukausmaara = this.rastin5suoritustavat[ampuja] === 'pist' ? SraAmpumakoe.laukausMaaratPistoolilla[rasti].reduce((a,b)=> a + b, 0) : SraAmpumakoe.laukausMaaratKivaarilla[rasti].reduce((a,b)=> a + b, 0)

      let ajatKirjattu = false
      // Onko kaikki ajat merkitty (rasteilla 1-2 kolme eri aikaa)?
      if (rasti == 0 || rasti == 1) {
        ajatKirjattu = [0, 1, 2].map((x) => this.ajat[ampuja][rasti][x]).indexOf(0) == -1
      } else {
        ajatKirjattu = (this.ajat[ampuja][rasti][0] > 0)
      }

      // Kesken: vain osa osumista on kirjattu tai aikakirjaus puuttuu
      if ((pisteytetytOsumat > 0 && pisteytetytOsumat < rastinLaukausmaara) || (pisteytetytOsumat > 0 && !ajatKirjattu) || (pisteytetytOsumat == 0 && ajatKirjattu)) {
        return RastiSuorituksenTila.Kesken
      }
      // Kaikki laukaukset on pisteytetty ja ajat on kirjattu
      if (pisteytetytOsumat >= rastinLaukausmaara && ajatKirjattu) {
        return RastiSuorituksenTila.Suoritettu
      }
      // Muutoin rasti on suorittamatta
      return RastiSuorituksenTila.Suorittamatta
    },
    poistaAmpuja(ampuja: string) {
      delete this.pisteet[ampuja]
      delete this.ajat[ampuja]
      delete this.hylkaykset[ampuja]
      delete this.rastin5suoritustavat[ampuja]

      // Merkintä turvallisuuskouluksesta vanhenee jos kaikki osallistujat poistetaan.
      if (Object.keys(this.ajat).length == 0) {
        this.turvallisuuskoulutusSuoritettu = false
      }


    },
    getKaikkiRastitSuoritettu(ampuja: string) {
      return [0,1,2,3,4].map((x) => this.getRastiSuorituksenTila(ampuja, x)).filter((x) => x === RastiSuorituksenTila.Suoritettu).length === 5
    },
    getHylkaysperuste(ampuja: string) {
      return this.hylkaykset[ampuja]
    },
    kirjaaHylkays(ampuja: string, peruste: string) {
      this.hylkaykset[ampuja] = peruste
    },
    peruHylkays(ampuja: string) {
      delete this.hylkaykset[ampuja]
    },
    reset() {
      this.pisteet = {}
      this.ajat =  {}
      this.hylkaykset = {}
      this.rastin5suoritustavat = {}
      this.turvallisuuskoulutusSuoritettu = false
      this.jarjestys = "kiertava"
    },
    // Järjestä ampujien lista satunnaisesti
    satunnaistaJarjestys() {
      const nykyinenJarjestys = Object.keys(this.pisteet)
      let uusiJarjestys = nykyinenJarjestys
      do {
        uusiJarjestys = Object.keys(this.pisteet).sort(() => Math.random() - 0.5)
      } while (jarjestysOnSama(nykyinenJarjestys, uusiJarjestys))
      this.pisteet = Object.fromEntries(uusiJarjestys.map(k => [k, this.pisteet[k]]))
    }
  },
})
import {PDFDocument, rgb} from "pdf-lib";
import download from "downloadjs";
import {SraAmpumakoe} from "@/classes/SraAmpumakoe";

/**
 * SRA ampumakokeen PDF-muotoinen pöytäkirja: ResUL:in pohja, johon lisätään koesuorituksen tiedot.
 */
export class PdfPoytakirja {

    muotoileLuku = (luku: number) : string => {
        if (luku == 0) {
            return ""
        } else {
            return luku.toString()
        }
    }

    muotoileAika = (luku: number) : string => {
        if (luku == 0 || luku == undefined) {
            return ""
        } else {
            return luku.toFixed(2)
        }
    }

    muotoileOsumakerroinPdf = (osumakerroin: number) => {
        if (osumakerroin == null || isNaN(osumakerroin)) {
            return ""
        }
        else {
            return osumakerroin.toFixed(2)
        }
    }

    pdfTuomarinTiedot(pisteetStore: any) {
        let tuomarinTiedot = "";
        tuomarinTiedot += pisteetStore.tuomari_nimi
        if (pisteetStore.tuomari_sraid != undefined && pisteetStore.tuomari_sraid != "") {
            tuomarinTiedot += " (SRA ID " + pisteetStore.tuomari_sraid + ")"
        }
        if (pisteetStore.tuomari_puhelin != undefined && pisteetStore.tuomari_puhelin != "") {
            tuomarinTiedot += " puh. " + pisteetStore.tuomari_puhelin
        }
        return tuomarinTiedot
    }

    async luoPdf(ampuja: string, pisteetStore: any) {
        const RASTI_Y_OFFSET = [687, 573, 469, 366, 262]

        const ROW_H = 12

        const T1_X = 393
        const T2_X = 427
        const OSUMAT_X = 465
        const PISTEET_X = 505
        const AIKA_X = 538

        const fontBytes = await fetch('/sra-ampumakoe.pdf').then((res) => res.arrayBuffer());
        const pdfDoc = await PDFDocument.load(fontBytes)
        const pages = pdfDoc.getPages()

        pages[0].setFontColor(rgb(0.1, 0.1, 0.97))

        pages[0].drawText(ampuja, {x: 60, y: 713, size: 12})

        // Syntymäaika
        if (pisteetStore.syntymaajat[ampuja] !== undefined) {
            pages[0].drawText(pisteetStore.syntymaajat[ampuja], {x: 83, y: 701, size: 12})
        }
        // Kurssin numero
        if (pisteetStore.kurssinumerot[ampuja] !== undefined) {
            pages[0].drawText(pisteetStore.kurssinumerot[ampuja], {x: 160, y: 691, size: 12})
        }
        // Yhdistys
        if (pisteetStore.yhdistykset[ampuja] !== undefined) {
            pages[0].drawText(pisteetStore.yhdistykset[ampuja], {x: 125, y: 680, size: 12})
        }

        for (let rasti in SraAmpumakoe.rastit) {
            for (let rivi in [0,1,2,3,4,5]) {
                // Taulu 1
                pages[0].drawText(this.muotoileLuku(pisteetStore.pisteet[ampuja][rasti][rivi][0]), {x: T1_X, y: RASTI_Y_OFFSET[rasti] - Number(rivi)*ROW_H, size: 10})
                // Taulu 2
                pages[0].drawText(this.muotoileLuku(pisteetStore.pisteet[ampuja][rasti][rivi][1]), {x: T2_X, y: RASTI_Y_OFFSET[rasti] - Number(rivi)*ROW_H, size: 10})
                // Osumat
                pages[0].drawText(this.muotoileLuku(pisteetStore.getAmpujaRastiLuokkaOsumat(ampuja, Number(rasti))[rivi]), {x: OSUMAT_X, y: RASTI_Y_OFFSET[rasti] - Number(rivi)*ROW_H, size: 10})
                // Pisteet
                pages[0].drawText(this.muotoileLuku(pisteetStore.getAmpujaRastiPisteet(ampuja, Number(rasti))[rivi]), {x: PISTEET_X, y: RASTI_Y_OFFSET[rasti] - Number(rivi)*ROW_H, size: 10})
                // Aika
                if (Number(rivi) < 3) {
                    pages[0].drawText(this.muotoileAika(pisteetStore.getAmpujanRastiaAjat(ampuja, Number(rasti))[rivi]), {x: AIKA_X, y: RASTI_Y_OFFSET[rasti] - Number(rivi) * ROW_H, size: 10})
                }
            }

            if (pisteetStore.hylkaykset[ampuja] !== undefined) {
                pages[0].drawText(pisteetStore.hylkaykset[ampuja], {x: 40, y: 50, size: 10})
            }

            // Yhteenlasketut pisteet ja aika
            pages[0].drawText(this.muotoileLuku(pisteetStore.getAmpujaRastiPisteSumma(ampuja, Number(rasti))), {x: PISTEET_X, y: RASTI_Y_OFFSET[rasti] - 5 * ROW_H, size: 10})
            pages[0].drawText(this.muotoileAika(pisteetStore.getAmpujanRastiAika(ampuja as string, Number(rasti))), {x: AIKA_X, y: RASTI_Y_OFFSET[rasti] - 5 * ROW_H, size: 10})
        }

        // Aikasumma, pistesumma, osumakerroin
        pages[0].drawText(this.muotoileLuku(pisteetStore.getAmpujanPisteSumma(ampuja)), {x: 552, y: 165, size: 10})
        pages[0].drawText(this.muotoileAika(pisteetStore.getAmpujanAikaSumma(ampuja)), {x: 552, y: 149, size: 10})
        pages[0].drawText(this.muotoileOsumakerroinPdf(pisteetStore.getAmpujanOsumakerroin(ampuja as string)), {x: 552, y: 137, size: 10})

        // X Hyväksytty
        let hf = pisteetStore.getAmpujanOsumakerroin(ampuja as string)
        if (pisteetStore.hylkaykset[ampuja] == undefined  && (pisteetStore.getKaikkiAmmuttu(ampuja) && hf >= SraAmpumakoe.vaadittuOsumakerroin)) {
            pages[0].drawText('X', {x: 336, y: 83, size: 18})
        }

        // X Hylätty
        if (pisteetStore.hylkaykset[ampuja] !== undefined || (pisteetStore.getKaikkiAmmuttu(ampuja) && hf < SraAmpumakoe.vaadittuOsumakerroin)) {
            pages[0].drawText('X', {x: 399, y: 83, size: 18})
        }

        // Paikka ja päivämäärä
        if (pisteetStore.koetilaisuus_paikka != '') {
            pages[0].drawText(pisteetStore.koetilaisuus_paikka, {x: 350, y: 69, size: 10})
        }
        if (pisteetStore.koetilaisuus_paiva != '') {
            pages[0].drawText(pisteetStore.koetilaisuus_paiva, {x: 450, y: 69, size: 10})
        }

        // Vastaanottavan tuomarin tiedot
        pages[0].drawText(this.pdfTuomarinTiedot(pisteetStore), {x: 312, y: 33, size: 10})

        const pdfBytes = await pdfDoc.save()
        download(pdfBytes, "sra-ampumakoe-" + (new Date()).toISOString().substring(0,10) + "-" +ampuja.replace(" ", "-")+ ".pdf", "application/pdf");
    }
}

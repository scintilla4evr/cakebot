import alphabet from "./alphabet"
import mapCase from "../../../bot/util/mapCase"

export default function substitute(
    str: string,
    subsitution: (index: number) => number
): string {
    return [...str].map(chr => {
        if (!alphabet.includes(chr.toLowerCase())) return chr
        let newChr = alphabet[
            subsitution(
                alphabet.indexOf(
                    chr.toLowerCase()
                )
            )
        ]
        
        return mapCase(chr, newChr)
    }).join("")
}
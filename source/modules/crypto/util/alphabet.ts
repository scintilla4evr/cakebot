let alphabet = "abcdefghijklmnopqrstuvwxyz"

export default alphabet

export function stringToAlphabetIndices(str: string): number[] {
    let out: number[] = []

    while (str.length) {
        let index = alphabet.indexOf(str[0].toLowerCase())
        if (index >= 0) out.push(index)

        str = str.substring(1)
    }

    return out
}
export default function mapCase(
    strFrom: string, strTo: string
): string {
    let upperCase = strFrom.split("").map(chr => chr === chr.toUpperCase())

    return strTo.split("").map(
        (chr, i) => (i < upperCase.length && upperCase[i]) ? chr.toUpperCase() : chr.toLowerCase()
    ).join("")
}
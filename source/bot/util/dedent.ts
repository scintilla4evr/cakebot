function dedentString(str: string, index: number): string {
    if (!index) {
        return str.trimLeft()
    } else {
        let strings = str.split(/[\r\n]/)
        
        return strings.map(
            (str, i) => {
                if (i) return str.trimLeft()
                return str
            }
        ).join("\n")
    }
}

export function dedent(strings: TemplateStringsArray, ...exprs: any[]): string {
    let out = ""

    exprs.forEach((expr, i) => {
        out += `${dedentString(strings[i], i)}${expr}`
    })

    if (strings.length > exprs.length) out += dedentString(strings[strings.length - 1], strings.length - 1)

    return out
}
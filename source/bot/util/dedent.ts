export function dedent(strings: TemplateStringsArray, ...exprs: any[]): string {
    let out = ""

    exprs.forEach((expr, i) => {
        out += `${strings[i]}${expr}`
    })

    if (strings.length > exprs.length) out += strings[strings.length - 1]

    return out
}
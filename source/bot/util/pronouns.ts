import { GuildMember } from "discord.js"

let heHimPronouns = ["he", "him", "his", "his", "himself"]
let sheHerPronouns = ["she", "her", "her", "hers", "herself"]
let theyThemPronouns = ["they", "them", "their", "theirs", "themself"]

function getPronounSets(member: GuildMember) {
    let pronounRoles = ["He/Him", "She/Her", "They/Them"]

    return pronounRoles.filter(pronoun => member.roles.find(role => role.name == pronoun))
}

function getPronouns(member: GuildMember): string[] {
    let pronounSets: string[] = getPronounSets(member)
    let pronouns: string[]

    if (pronounSets.length == 1) {
        switch (pronounSets[0]) {
            case "He/Him":
                pronouns = heHimPronouns
                break
            case "She/Her":
                pronouns = sheHerPronouns
                break
            default:
                pronouns = theyThemPronouns
                break
        }
    } else {
        pronouns = theyThemPronouns
    }

    return pronouns
}

function casePreserveReplace(strFrom: string, strTo: string) {
    let upperCase = strFrom.split("").map(chr => chr === chr.toUpperCase())

    return strTo.split("").map(
        (chr, i) => (i < upperCase.length && upperCase[i]) ? chr.toUpperCase() : chr.toLowerCase()
    ).join("")
}

function replacePronoun(str: string, pronouns: string[]): string {
    let pronounIndex = theyThemPronouns.indexOf(str.toLowerCase())

    if (pronounIndex >= 0)
        str = casePreserveReplace(str, pronouns[pronounIndex])

    return str
}

function replacePronouns(str: string, pronouns: string[]): string {
    let out = ""
    let current = ""

    str.split("").forEach(chr => {
        if (/[a-z]/i.test(chr)) {
            current += chr
        } else {
            out += replacePronoun(current, pronouns) + chr
            current = ""
        }
    })
    if (current) out += replacePronoun(current, pronouns)

    return out
}

export function pronounTemplate(member: GuildMember) {
    let pronouns = getPronouns(member)

    return (strings: TemplateStringsArray, ...exprs: any[]): string => {
        let out = ""

        exprs.forEach((expr, i) => {
            out += `${replacePronouns(strings[i], pronouns)}${expr}`
        })

        if (strings.length > exprs.length) out += replacePronouns(strings[strings.length - 1], pronouns)

        return out
    }
}
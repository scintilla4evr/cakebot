export function extractGameFromVideoTitle(title: string): string {
    let split = title.split("|")

    if (split.length < 2) return null

    let possibleName = split[split.length - 1]
    let parenPosition = possibleName.indexOf("(")

    if (parenPosition >= 0) possibleName = possibleName.substring(0, parenPosition)

    return possibleName.trim()
}
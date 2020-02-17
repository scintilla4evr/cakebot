import { Emoji, Message } from "discord.js";
import { parse, convert } from "twemoji";

type PollEmote = string | Emoji

function processLine(
    line: string,
    message: Message
): PollEmote {
    if (!line.length) return null

    // Unicode
    let uniEmote: string

    parse(
        line, {
            callback: (codepoints: string) => {
                const surrogates = codepoints.split("-").map(
                    cp => convert.fromCodePoint(cp)
                ).join("")

                uniEmote = surrogates
                return null
            }
        }
    )

    if (line.endsWith(uniEmote))
        return uniEmote

    // Discord
    const customRegex = /^.*\<a?\:[a-z_]+\:([0-9]+)\>$/i

    if (customRegex.test(line)) {
        const emojiId = customRegex.exec(line)[1]
        
        return message.client.emojis.find(e => e.id === emojiId)
    }

    return null
}

export function extractPollEmojis(
    message: Message
): PollEmote[] {
    const emotes: PollEmote[] = []
    const lines = message.content.split(/[\r\n]/)

    lines.forEach(line => {
        const emote = processLine(
            line.trim(),
            message
        )
        if (emote) emotes.push(emote)
    })

    return emotes
}
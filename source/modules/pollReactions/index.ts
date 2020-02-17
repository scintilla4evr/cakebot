import { Bot } from "../../bot";
import { Message } from "discord.js";
import { extractPollEmojis } from "./emoji";

export async function handler(bot: Bot) {
    bot.watcher.watch(
        "pollChannel",
        async (bot: Bot, message: Message, isEdit: boolean) => {
            const emotes = extractPollEmojis(message)

            if (isEdit) {
                for (const reaction of message.reactions.array()) {
                    if (reaction.me) await reaction.remove()
                }
            }

            for (const emote of emotes)
                await message.react(emote)
        },
        true
    )
}
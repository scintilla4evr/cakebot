import { Bot } from "../../../bot";
import { Command } from "../../../bot/commands/commands";
import { DocsCommandArgType } from "../../../bot/docs/types";
import { Message } from "discord.js";

let copyStrikePath = ["copystrikes"]

type Copystrike = {
    strikerId: string
    entity: string
    timestamp: string
}

export class CopystrikeCommand extends Command {
    constructor() {
        super(
            "cmd.jokes.copystrike",
            "copystrike",
            "$entity:string",
            {
                description: "Copyright strike!",
                parameters: [
                    {
                        name: "entity",
                        type: DocsCommandArgType.string,
                        description: "A legal entity to strike"
                    }
                ]
            }
        )
    }

    async process(
        bot: Bot,
        message: Message,
        args: {
            entity: string
        }
    ) {
        let strikes = await bot.storage.get(copyStrikePath) as Copystrike[]

        strikes.push({
            strikerId: message.author.id,
            entity: args.entity,
            timestamp: Date()
        })

        await bot.storage.set(copyStrikePath, strikes)

        await message.channel.send(
            `<:copystrike:548470989336346633> ${message.author} copystriked ${args.entity}! <:copystrike:548470989336346633>`
        )
    }
}

export async function prepCopystrikes(bot: Bot) {
    if (!(await bot.storage.exists(copyStrikePath)))
        await bot.storage.set(copyStrikePath, [])
}
import { Command } from "../../../bot/commands/commands"
import { Bot } from "../../../bot"
import { Message } from "discord.js"
import { randomInt } from "../../../util/random"

export class RandomCommand extends Command {
    constructor(
    ) {
        super(
            "random",
            "$min?:number $max?:number"
        )
    }

    public async process(
        bot: Bot,
        message: Message,
        args: {
            min: number,
            max: number
        }
    ) {
        await message.channel.send(
            randomInt(args.min, args.max)
        )
    }
}
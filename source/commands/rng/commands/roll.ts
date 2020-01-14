import { Command } from "../../../bot/commands/commands"
import { Bot } from "../../../bot"
import { Message } from "discord.js"
import { randomInt } from "../../../util/random"

export class DieRollCommand extends Command {
    constructor(
    ) {
        super(
            "roll",
            "$sides:number"
        )
    }

    public async process(
        bot: Bot,
        message: Message,
        args: {
            sides: number
        }
    ) {
        await message.channel.send(
            `:game_die: ${randomInt(1, args.sides)}`
        )
    }
}
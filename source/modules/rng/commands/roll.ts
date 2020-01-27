import { Command } from "../../../bot/commands/commands"
import { Bot } from "../../../bot"
import { Message } from "discord.js"
import { randomInt } from "../../../bot/util/random"
import { DocsCommandArgType } from "../../../bot/docs/types"

export class DieRollCommand extends Command {
    constructor(
    ) {
        super(
            "cmd.rng.roll",
            "roll",
            "$sides:number",
            {
                description: "Rolls an n-sided die.",
                parameters: [
                    {
                        name: "sides",
                        description: "The number of the die sides.",
                        type: DocsCommandArgType.number
                    }
                ],
                usage: [
                    {
                        description: "Roll a D6, sis.",
                        syntax: "6"
                    },
                    {
                        description: "Roll a D128, hunty.",
                        syntax: "100"
                    }
                ]
            }
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
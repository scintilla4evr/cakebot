import { Command } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";
import substitute from "../util/substitute";

export class AtbashCommand extends Command {
    constructor() {
        super(
            "cmd.crypto.atbash",
            "atbash",
            "$str:string"
        )
    }

    async process(
        bot: Bot,
        message: Message,
        args: {
            str: string
        }
    ) {
        await message.channel.send(
            substitute(
                args.str,
                (letter: number) => 25 - letter
            )
        )
    }
}
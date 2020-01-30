import { Command } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";

export class MorseCommand extends Command {
    constructor() {
        super(
            "cmd.crypto.morse",
            "morse",
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
    }
}
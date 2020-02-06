import { EditableCommand } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";
import substitute from "../util/substitute";

export class AtbashCommand extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.atbash",
            "atbash",
            "$str:string"
        )
    }

    async processEditable(
        bot: Bot,
        message: Message,
        args: {
            str: string
        }
    ) {
        return substitute(
            args.str,
            (letter: number) => 25 - letter
        )
    }
}
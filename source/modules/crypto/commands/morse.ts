import { Command, EditableCommand } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";

let morse: {
    encode: (raw: string) => string
    decode: (str: string, dichotomic?: boolean) => string
} = require("morse")

export class MorseCommand extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.morse",
            "morse",
            "$str:string"
        )
    }

    async processEditable(
        bot: Bot,
        message: Message,
        args: {
            str: string
        }
    ): Promise<string> {
        return morse.decode(args.str)
    }
}
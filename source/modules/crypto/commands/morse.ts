import { Command } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";

let morse: {
    encode: (raw: string) => string
    decode: (str: string, dichotomic?: boolean) => string
} = require("morse")

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
        await message.channel.send(
            morse.decode(args.str)
        )
    }
}
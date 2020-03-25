import { Command, EditableCommand } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";
import { DocsCommandArgType } from "../../../bot/docs/types";

let morse: {
    encode: (raw: string) => string
    decode: (str: string, dichotomic?: boolean) => string
} = require("morse")

export class MorseCommand extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.morse",
            "morse",
            "$str:string",
            {
                description: "Decodes a string of dots and dashes.",
                parameters: [
                    {
                        name: "str",
                        type: DocsCommandArgType.string,
                        description: "A string of Morse code"
                    }
                ],
                usage: [
                    {
                        description: "Decoding a secret Illuminati messge",
                        syntax: `... - .- -. .-.. --- --- -. .-`
                    }
                ]
            }
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
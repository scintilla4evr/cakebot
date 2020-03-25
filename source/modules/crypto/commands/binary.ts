import { EditableCommand } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";
import { DocsCommandArgType } from "../../../bot/docs/types";

export class BinaryCommand extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.binary",
            "binary",
            "$str:string",
            {
                description: "Decodes a string of binary digits.",
                parameters: [
                    {
                        name: "str",
                        type: DocsCommandArgType.number,
                        description: "A string of 0s and 1s"
                    }
                ],
                usage: [
                    {
                        description: "Decoding a secret Illuminati messge",
                        syntax: `01001000 01101001 00100000 01110011 01101001 01110011 01110100 01100101 01110010 01110011 00100001`
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
        let str = ""

        while (args.str.length >= 4) {
            args.str = args.str.trim()
            
            str += parseInt(args.str.substring(0, 4), 2).toString(16)
            args.str = args.str.substring(4)
        }

        return Buffer.from(
            str.replace(/\s/g, ""), "hex"
        ).toString()
    }
}
import { EditableCommand } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";
import { DocsCommandArgType } from "../../../bot/docs/types";

export class HexCommand extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.hex",
            "hex",
            "$str:string",
            {
                description: "Decodes a string of hex digits.",
                parameters: [
                    {
                        name: "str",
                        type: DocsCommandArgType.number,
                        description: "A string of hex digits (0-9, A-F)"
                    }
                ],
                usage: [
                    {
                        description: "Decoding a secret Illuminati messge",
                        syntax: `414C5958205941204641524741542059412047414E`
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
        return Buffer.from(
            args.str.replace(/\s/g, ""), "hex"
        ).toString()
    }
}
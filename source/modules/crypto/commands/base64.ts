import { EditableCommand } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";
import { DocsCommandArgType } from "../../../bot/docs/types";

export class Base64Command extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.base64",
            "base64",
            "$str:string",
            {
                description: "Decodes a string of text encoded in Base64.",
                parameters: [
                    {
                        name: "str",
                        type: DocsCommandArgType.string,
                        description: "A string encoded in Base64"
                    }
                ],
                usage: [
                    {
                        description: "Decoding a secret Illuminati messge",
                        syntax: `bWUgbWUgYmlnIGJveQ==`
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
            args.str.replace(/\s/g, ""), "base64"
        ).toString()
    }
}
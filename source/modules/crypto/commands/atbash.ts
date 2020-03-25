import { EditableCommand } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";
import substitute from "../util/substitute";
import { DocsCommandArgType } from "../../../bot/docs/types";

export class AtbashCommand extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.atbash",
            "atbash",
            "$str:string",
            {
                description: "Decodes an Atbash-encoded string.",
                parameters: [
                    {
                        name: "str",
                        type: DocsCommandArgType.string,
                        description: "A text string"
                    }
                ],
                usage: [
                    {
                        description: "Decoding a secret Illuminati messge",
                        syntax: `"lDl dszg'h gsrh?"`
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
    ) {
        return substitute(
            args.str,
            (letter: number) => 25 - letter
        )
    }
}
import { EditableCommand } from "../../../bot/commands/commands";
import { DocsCommandArgType } from "../../../bot/docs/types";
import { Bot } from "../../../bot";
import { Message } from "discord.js";
import mapCase from "../../../bot/util/mapCase";

export class OwoCommand extends EditableCommand {
    public replacements = {
        "r": "w",
        "R": "W",
        "the": "da",
        "The": "Da",
        "THE": "DA"
    }

    constructor() {
        super(
            "cmd.jokes.owo",
            "owo",
            "$str:string",
            {
                description: "Performs a crime against humanity. Owo!",
                parameters: [
                    {
                        name: "str",
                        type: DocsCommandArgType.string,
                        description: "A piece of text to be owo-ified"
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
        let newStr = args.str

        Object.keys(this.replacements).forEach(src => {
            newStr = newStr.replace(
                new RegExp(src, "g"),
                this.replacements[src]
            )
        })

        return newStr
    }
}
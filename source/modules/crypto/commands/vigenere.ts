import { EditableCommand } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";
import substitute from "../util/substitute";
import { stringToAlphabetIndices } from "../util/alphabet";
import { DocsCommandArgType } from "../../../bot/docs/types";
"Fax mt o ekzkve"
export class VigenereCommand extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.vigenere",
            "vigenere",
            "$key:singlestr $str:string",
            {
                description: "Decodes an A1Z26-encoded string of digits.",
                parameters: [
                    {
                        name: "key",
                        type: DocsCommandArgType.string,
                        description: "The decryption key."
                    },
                    {
                        name: "str",
                        type: DocsCommandArgType.string,
                        description: "An encrypted string."
                    }
                ],
                usage: [
                    {
                        description: "Decoding a secret Illuminati messge",
                        syntax: `"cakebot" "Fax mt o ekzkve"`
                    }
                ]
            }
        )
    }

    async processEditable(
        bot: Bot,
        message: Message,
        args: {
            key: string, str: string
        }
    ): Promise<string> {
        let indices = stringToAlphabetIndices(args.key)
        let idx = 0

        return substitute(args.str, (index) => {
            let out = (index - indices[idx]) % 26
            if (out < 0) out += 26

            idx = (idx + 1) % indices.length

            return out
        })
    }
}
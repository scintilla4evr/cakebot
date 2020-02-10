import { EditableCommand } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";
import substitute from "../util/substitute";
import { stringToAlphabetIndices } from "../util/alphabet";

export class VigenereCommand extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.vigenere",
            "vigenere",
            "$key:singlestr $str:string"
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
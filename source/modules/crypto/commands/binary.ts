import { EditableCommand } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";

export class BinaryCommand extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.binary",
            "binary",
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
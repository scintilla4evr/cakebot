import { EditableCommand } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";

export class HexCommand extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.hex",
            "hex",
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
        return Buffer.from(
            args.str.replace(/\s/g, ""), "hex"
        ).toString()
    }
}
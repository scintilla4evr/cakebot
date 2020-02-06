import { EditableCommand } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";

export class Base64Command extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.base64",
            "base64",
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
            args.str.replace(/\s/g, ""), "base64"
        ).toString()
    }
}
import { DevCommand } from "../../bot/commands/commands";
import { Bot } from "../../bot";
import { Message } from "discord.js";

class MarkChannelCommand extends DevCommand {
    constructor() {
        super(
            "cmd.livedev.mark",
            "d_mark",
            "$marker:string"
        )
    }

    async process(
        bot: Bot,
        message: Message,
        args: {
            marker: string
        }
    ) {
        await bot.markChannel(message.channel, args.marker)
    }
}

export async function handler(bot: Bot) {
    bot.addCommand(
        new MarkChannelCommand()
    )
}
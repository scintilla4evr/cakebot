import { Command } from "../../bot/commands/commands";
import { Bot } from "../../bot";
import { Message, Attachment } from "discord.js";
import { spawnWorker } from "../../bot/util/worker";
import { join } from "path";

export class TeaCommand extends Command {
    constructor() {
        super(
            "cmd.reaction.teeaa",
            /^te+a+$/i,
            ""
        )
    }

    async process(
        bot: Bot,
        message: Message,
        args: {},
        cmdName: string
    ) {
        const match = cmdName.match(/^t(e+)(a+)$/i)

        const headStrength = (match[1].length - 1) / 4
        const torsoStrength = (match[2].length - 1) / 4

        const buf = await spawnWorker(
            join(__dirname, "teaWorker.js"),
            {
                headStrength, torsoStrength
            }
        )

        await message.channel.send(
            new Attachment(
                Buffer.from(buf)
            )
        )
    }
}
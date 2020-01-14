import { Command } from "../../bot/commands/commands";
import { Bot } from "../../bot";
import { Message, Attachment } from "discord.js";
import { Image } from "../../bot/graphics/image";
import { fxGrayscale } from "../../bot/graphics/shader";

class ShaderCommand extends Command {
    constructor() {
        super(
            "shade",
            "$mix?:number"
        )
    }

    async process(
        bot: Bot,
        message: Message,
        args: {
            mix?: number
        }
    ) {
        if (!("mix" in args)) args.mix = 1

        let image = await Image.load("https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-11/256/crayon.png")

        image.shade(
            fxGrayscale(args.mix)
        )

        let buf = await image.toBuffer()

        let attachment = new Attachment(buf)
        await message.channel.send(attachment)
    }
}

class DefArgCommand extends Command {
    constructor() {
        super(
            "test",
            "$owo?:number=10"
        )
    }

    async process(
        bot: Bot,
        message: Message,
        args: {
            owo: number
        }
    ) {
        await message.channel.send(args.owo)
    }
}

export function handler(bot: Bot) {
    bot.addCommand(
        new ShaderCommand(),
        new DefArgCommand()
    )
    console.log(2)
}
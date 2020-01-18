import { Command } from "../../bot/commands/commands";
import { Bot } from "../../bot";
import { Message, Attachment } from "discord.js";
import { Image } from "../../bot/graphics/image";
import { fxGrayscale, fxInvert } from "../../bot/graphics/shader";
import { IArgType } from "../../bot/commands/arguments";

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
            (img, x, y) => {
                return img.sample(x, 1 - y)
            }
        )

        let buf = await image.toBuffer()

        let attachment = new Attachment(buf)
        await message.channel.send(attachment)
    }
}

class TestArgType implements IArgType {
    public alias = "owo"

    public strings = [
        "megajoules", "degrees kelvin", "newtons"
    ]

    isValid(str: string): boolean {
        return this.strings.includes(
            str.toLowerCase()
        )
    }

    parse(msg: Message, str: string): number {
        return this.strings.indexOf(
            str.toLowerCase()
        )
    }
}

class DefArgCommand extends Command {
    constructor() {
        super(
            "test",
            "$owo?:owo=megajoules"
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
    bot.parser.register(
        new TestArgType()
    )
    bot.addCommand(
        new ShaderCommand(),
        new DefArgCommand()
    )
    console.log(2)
}
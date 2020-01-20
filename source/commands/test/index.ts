import { Command } from "../../bot/commands/commands";
import { Bot } from "../../bot";
import { Message, Attachment } from "discord.js";
import { Image } from "../../bot/graphics/image";
import { fxGrayscale, fxInvert } from "../../bot/graphics/shader";
import { IArgType } from "../../bot/commands/arguments";
import { Rectangle } from "../../bot/ui/components/rectangle";
import { UnboundedTextComponent, UnboundedText } from "../../bot/ui/components/unboundedText"
import { renderComponent } from "../../bot/ui";

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

class UITestCommand extends Command {
    constructor() {
        super(
            "ui",
            ""
        )
    }

    async process(
        bot: Bot,
        message: Message,
        args: {}
    ) {
        let uiDefinition = Rectangle(
            132, 200,
            [
                Rectangle(
                    100, 32,
                    [
                        UnboundedText("Light!")
                            .fill("black")
                    ]
                )
                    .margin(8, 8, 8, 8)
                    .padding(8, 8, 8, 8)
                    .borderRadius(8, 8, 8, 8)
                    .shadow(0, 4, 8, "#00000040")
                    .fill("white"),
                Rectangle(
                    100, 32,
                    [
                        UnboundedText("Dark!")
                            .fill("white")
                    ]
                )
                    .margin(8, 8, 8, 8)
                    .padding(8, 8, 8, 8)
                    .borderRadius(8, 8, 8, 8)
                    .shadow(0, 4, 8, "#00000040")
                    .fill("#111"),
                Rectangle(
                    100, 32,
                    [
                        UnboundedText("Red!")
                            .fill("yellow")
                    ]
                )
                    .margin(8, 8, 8, 8)
                    .padding(8, 8, 8, 8)
                    .borderRadius(8, 8, 8, 8)
                    .shadow(0, 4, 8, "#00000040")
                    .fill("red")
            ]
        ).fill("white")

        let buf = renderComponent(uiDefinition)

        let attachment = new Attachment(buf)
        await message.channel.send(attachment)
    }
}

export function handler(bot: Bot) {
    bot.parser.register(
        new TestArgType()
    )
    bot.addCommand(
        new ShaderCommand(),
        new DefArgCommand(),
        new UITestCommand()
    )
    console.log(2)
}
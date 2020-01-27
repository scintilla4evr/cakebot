import { Command } from "../../bot/commands/commands";
import { Bot } from "../../bot";
import { Message, Attachment } from "discord.js";
import { Image } from "../../bot/graphics/image";
import { fxGrayscale, fxInvert } from "../../bot/graphics/shader";
import { IArgType } from "../../bot/commands/arguments";
import { Rectangle } from "../../bot/ui/components/rectangle";
import { UnboundedTextComponent, UnboundedText } from "../../bot/ui/components/unboundedText"
import { renderComponent } from "../../bot/ui";
import { pronounTemplate } from "../../bot/util/pronouns";
import { Flex, FlexDirection, FlexAlignment, FlexJustification } from "../../bot/ui/components/flex";
import { resolveUIImage } from "../../bot/ui/image";
import { ImageFill } from "../../bot/ui/fill/image";

class UITestCommand extends Command {
    constructor() {
        super(
            "cmd.test.ui",
            "ui",
            ""
        )
    }

    async process(
        bot: Bot,
        message: Message,
        args: {}
    ) {
        let image = await resolveUIImage(
            "https://media.discordapp.net/attachments/671362186496442398/671421736230715397/unknown.png"
        )

        let uiDefinition = Flex(
            332, 232,
            [
                Rectangle(50, 50, []).fill("red"),
                Rectangle(80, 30, []).fill("blue"),
                Rectangle(10, 100, []).fill("green")
            ]
        )
        .flexDirection(FlexDirection.row)
        .flexAlignment(FlexAlignment.center)
        .flexJustification(FlexJustification.spaceBetween)
        .fill(new ImageFill(image))

        let buf = renderComponent(uiDefinition)

        let attachment = new Attachment(buf)
        await message.channel.send(attachment)
    }
}

export class PronounTestCommand extends Command {
    constructor() {
        super(
            "cmd.test.pronoun",
            "pronoun",
            ""
        )
    }

    async process(
        bot: Bot,
        message: Message,
        args: {}
    ) {
        let p = pronounTemplate(message.member)

        await message.channel.send(
            p`Ah yeah, ${message.member.displayName}. They must exist, right?`
        )
    }
}

export async function handler(bot: Bot) {
    bot.addCommand(
        new UITestCommand(),
        new PronounTestCommand()
    )
    console.log(2)
}
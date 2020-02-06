import { Bot } from "../../bot";
import { Command } from "../../bot/commands/commands";
import { Message, Attachment } from "discord.js";
import { Image, ImageWrapMethod, ImageInterpolationMethod } from "../../bot/graphics/image";

class ImageTest extends Command {
    constructor() {
        super(
            "cmd.test.img",
            "img",
            ""
        )
    }

    async process(
        bot: Bot,
        message: Message,
        args: {}
    ) {
        let image = await Image.load(
            "https://pbs.twimg.com/media/EQHt7JNW4AIpOct?format=jpg&name=small"
        )

        image.shade(
            (img, x, y) => {
                let color = img.sample(
                    x + 100, y,
                    ImageWrapMethod.wrap,
                    ImageInterpolationMethod.nearestNeighbor
                )

                return color
            }
        )

        await message.channel.send(
            new Attachment(
                await image.toBuffer()
            )
        )
    }
}

export async function handler(bot: Bot) {
    bot.addCommand(
        new ImageTest()
    )
}
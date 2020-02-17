import { Command } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message, Attachment } from "discord.js";
import { getAttachedImageURL } from "../../../bot/util/attachedImage";
import { Image } from "../../../bot/graphics/image";
import { fxInvert } from "../../../bot/graphics/shader";

export class InvertCommand extends Command {
    constructor() {
        super(
            "cmd.imgProc.invert",
            "invert",
            "$url?:singlestr"
        )
    }

    async process(
        bot: Bot, message: Message, args: {
            url?: string
        }
    ) {
        const imageUrl = getAttachedImageURL(message) ?? args.url

        if (!imageUrl) {
            await message.channel.send("No image specified.")
            return
        }

        try {
            const image = (
                await Image.load(imageUrl)
            )
            image.shade(fxInvert(1))

            const attachment = new Attachment(
                await image.toBuffer()
            )

            await message.channel.send(attachment)
        } catch(e) {
            await message.channel.send("The specified URL is not an image.")
        }
    }
}
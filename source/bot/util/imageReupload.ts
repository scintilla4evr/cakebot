import { Bot } from "..";
import { Attachment, TextChannel, Message } from "discord.js";

export default async function imageReupload(bot: Bot, url: string): Promise<string> {
    const attachment = new Attachment(url);

    const message = await (
        bot.client.channels.find(c => c.id === "687054493074063364") as TextChannel
    ).send(attachment) as Message

    return message.attachments.first().url
}
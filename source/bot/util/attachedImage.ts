import { Message } from "discord.js";

export function getAttachedImageURL(
    message: Message
): string {
    const attachment = message.attachments.first()

    if (attachment) return attachment.url
    return null
}
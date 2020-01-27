import { Bot } from ".";
import { Message } from "discord.js";

export type MessageWatcherCallback = (bot: Bot, message: Message) => Promise<void>

export class MessageWatcher {
    public callbacks: {
        marker: string,
        callback: MessageWatcherCallback
    }[] = []

    constructor(
        public bot: Bot
    ) {}

    watch(
        marker: string,
        callback: MessageWatcherCallback
    ) {
        this.callbacks.push({
            marker, callback
        })
    }

    async process(
        message: Message
    ) {
        this.callbacks.forEach(async callback => {
            let channel = await this.bot.getMarkedChannel(callback.marker)
            if (!channel) return

            if (channel.id == message.channel.id) await callback.callback(this.bot, message)
        })
    }
}
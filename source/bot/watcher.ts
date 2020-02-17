import { Bot } from ".";
import { Message } from "discord.js";

export type MessageWatcherCallback = (
    bot: Bot, message: Message, isEdit?: boolean
) => Promise<void>

export class MessageWatcher {
    public callbacks: {
        marker: string,
        callback: MessageWatcherCallback,
        callOnEdits: boolean
    }[] = []

    constructor(
        public bot: Bot
    ) {}

    watch(
        marker: string,
        callback: MessageWatcherCallback,
        callOnEdits = false
    ) {
        this.callbacks.push({
            marker, callback, callOnEdits
        })
    }

    async process(
        message: Message,
        isEdit: boolean
    ) {
        this.callbacks.forEach(async callback => {
            let channel = await this.bot.getMarkedChannel(callback.marker)
            if (!channel) return
            if (isEdit && !callback.callOnEdits) return

            if (channel.id == message.channel.id) await callback.callback(
                this.bot, message, isEdit
            )
        })
    }
}
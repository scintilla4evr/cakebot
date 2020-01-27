import { Bot } from "../../../bot";
import { Message } from "discord.js";
import { EventEmitter } from "events";

export class LatePatLinkDetector extends EventEmitter {
    constructor(
        public bot: Bot
    ) {
        super()

        bot.watcher.watch(
            "latePat.linkChannel",
            async (bot: Bot, message: Message) => {
                this.detectLink(message.content)
            }
        )
    }

    detectLink(str: string) {
        let check1 = str.match(/https\:\/\/www\.youtube\.com\/watch\?v\=(.+)/)
        let check2 = str.match(/https\:\/\/youtu\.be\/(.+)/)

        if (check1) {
            this.emit("link", check1[1])
        } else if (check2) {
            this.emit("link", check2[1])
        }
    }
}
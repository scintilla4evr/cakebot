import {
    Client, Channel, TextChannel, User
} from "discord.js"

import {
    Command
} from "./commands/commands"
import {
    IStorageHandler
} from "./storage"
import { ArgumentParser } from "./commands/arguments/parser"
import { Logger } from "./logger"
import { BoxType } from "./ui/style"
import { MessageWatcher } from "./watcher"
import { processMessage } from "./commands/processor"
import { processConversations, IConversationHandler, startConversation, Conversation, endConversation } from "./conversation"
import { start } from "repl"
import { logMessageStat } from "./profile/statistics"

export class Bot {
    public client: Client

    public commands: Command[] = []
    public parser = new ArgumentParser()

    public storage: IStorageHandler

    public logger = new Logger()
    public watcher = new MessageWatcher(this)

    constructor(
        public apiKey: string,
        public commandPrefix: string
    ) {}

    async login() {
        this.client = new Client()

        this.client.on("message", async (message) => {
            this.logger.messageReceive(message)

            if (message.author === this.client.user) return

            // Telemetry, amirite?
            await logMessageStat(this, message)

            if (await processConversations(this, message)) return

            await processMessage(this, message)

            await this.watcher.process(message, false)
        })
        this.client.on("messageUpdate", (oldMessage, message) => {
            this.logger.messageReceive(message)

            if (message.author === this.client.user) return
            processMessage(this, message, true)

            this.watcher.process(message, true)
        })

        await this.client.login(this.apiKey)
    }

    async logoff() {
        await this.client.destroy()
    }

    public addCommand(...commands: Command[]) {
        commands.forEach(command => {
            let index = this.commands.findIndex(cmd => cmd.commandId === command.commandId)
            if (index >= 0) this.commands.splice(index, 1)

            this.commands.push(command)
        })
    }

    public async startConversation(
        channel: TextChannel, user: User,
        handler: IConversationHandler
    ): Promise<Conversation> {
        return await startConversation(
            this, channel, user, handler
        )
    }

    public endConversation(
        channel: TextChannel, user: User
    ) {
        endConversation(channel, user)
    }

    async markChannel(channel: Channel, marker: string) {
        await this.storage.set(
            ["meta", "markedChannels", marker],
            channel.id
        )
    }

    async getMarkedChannel(marker: string): Promise<Channel> {
        const env = `OVERRIDE_${marker.toUpperCase()}`

        if (env in process.env) {
            return this.client.channels.find(c => c.id === process.env[env])
        }

        const path = ["meta", "markedChannels", marker]

        if (!(await this.storage.exists(path))) return null

        let id = await this.storage.get(path)

        return this.client.channels.find(c => c.id === id)
    }
}

import {
    Client,
    Message, GuildMember, User,
    Guild, Channel,
    Snowflake
} from "discord.js"
import { exists } from "fs";

import {
    Command, MessageContent
} from "./commands"
import {
    IStorageHandler
} from "./storage"

export class Bot {
    public client: Client

    public commands: Command[] = []

    public storage: IStorageHandler

    constructor(
        apiKey: string,
        public commandPrefix: string
    ) {
        this.client = new Client()
        this.client.login(apiKey)

        this.client.on("message", (message) => {
            if (message.author === this.client.user) return
            MessageContent.processMessage(this, message)
        })
    }

    public addCommand(command: Command) {
        this.commands.push(command)
    }
}

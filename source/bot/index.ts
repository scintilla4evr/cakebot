import {
    Client
} from "discord.js"

import {
    Command, processMessage
} from "./commands/commands"
import {
    IStorageHandler
} from "./storage"
import { ArgumentParser } from "./commands/arguments/parser"

export class Bot {
    public client: Client

    public commands: Command[] = []
    public parser = new ArgumentParser()

    public storage: IStorageHandler

    constructor(
        apiKey: string,
        public commandPrefix: string
    ) {
        this.client = new Client()
        this.client.login(apiKey)

        this.client.on("message", (message) => {
            if (message.author === this.client.user) return
            processMessage(this, message)
        })
    }

    public addCommand(...commands: Command[]) {
        this.commands.push(...commands)
    }
}

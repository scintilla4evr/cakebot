import {
    Client,
    Message, GuildMember, User,
    Guild, Channel,
    Snowflake
} from "discord.js"
import {Bot} from ".."
import { BotError, ErrorType } from "../error"
import { DocsCommand } from "../docs/types"

export class Command {
    public permissionDeterminators: ((message: Message) => boolean)[] = []

    constructor(
        public commandId: string,
        public name: string | RegExp,
        public pattern: string,
        public docs?: DocsCommand
    ) {}

    public determinePermissions(
        message: Message
    ): boolean {
        for (let p of this.permissionDeterminators) {
            if (!p(message)) return false
        }
        return true
    }

    public async process(
        bot: Bot,
        message: Message,
        args: any
    ) {}
}

export class DevCommand extends Command {
    public determinePermissions(
        message: Message
    ) {
        if ("MAINTAINER_ID" in process.env && message.author.id !== process.env["MAINTAINER_ID"])
            return false
        return true
    }
}

export class EditableCommand extends Command {
    public async processEditable(
        bot: Bot,
        message: Message,
        args: any
    ): Promise<string> {
        return null
    }
}
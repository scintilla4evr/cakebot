import {
    Client,
    Message, GuildMember, User,
    Guild, Channel,
    Snowflake
} from "discord.js"
import {Bot} from ".."
import { BotError, ErrorType } from "../error"
import { DocsCommand } from "../docs/types"

export async function processMessage(
    bot: Bot,
    message: Message
) {
    let cmdName = message.content.trim().split(/\s/)[0]
    if (!cmdName.startsWith(bot.commandPrefix)) return

    let command = bot.commands.find(cmd => {
        if (cmd.name instanceof RegExp)
            return cmd.name.test(cmdName.substring(bot.commandPrefix.length))
        else
            return cmd.name.toLowerCase() === cmdName.substring(bot.commandPrefix.length).toLowerCase()
    })

    if (!command) return

    try {
        let args = bot.parser.parse(
            message,
            message.content.substring(cmdName.length).trim(),
            command.pattern
        )

        if (command.determinePermissions(message))
            await command.process(
                bot, message, args
            )
    } catch(e) {
        if (e.type == ErrorType.parserInvalidCommandSyntax) {
            if ("HELP_URL" in process.env) {
                await message.channel.send(
                    `Invalid syntax. For info about the command, go to: ${process.env.HELP_URL}#${command.name}`
                )
            } else {
                await message.channel.send(
                    `Invalid syntax.`
                )
            }
        } else if (e.type == ErrorType.commandAccessDenied) {
            await message.channel.send(
                "You don't have permissions to use this command."
            )
        } else {
            console.log(e)
        }
    }
}

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
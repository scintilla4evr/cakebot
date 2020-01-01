import {
    Client,
    Message, GuildMember, User,
    Guild, Channel,
    Snowflake
} from "discord.js"
import {Bot} from "."

type MessageLiteral = number | string | GuildMember


export class MessageContent {
    public message: Message

    public items: MessageLiteral[]
    public textContent: string

    public mentions: GuildMember[]
    public mentionedUsers: User[]

    public convertStringToLiteral(
        str: string
    ): MessageLiteral {
        if (!isNaN(+str)) {
            return +str
        } else if (/^\<\@[0-9]+\>$/.test(str)) {
            let matches = /^\<\@([0-9]+)\>$/.exec(str)
            let userID = matches[1]

            return this.message.mentions.members.find(member => member.id === userID)
        }
        
        return str
    }

    public preparse(
    ): void {
        let items: MessageLiteral[] = []

        let strings: string[] = [], currentString: string = ""

        this.textContent.split("").forEach((character, i) => {
            let isFirstCharacterInWord = i > 0 && /\s/.test(this.textContent[i - 1])

            if (isFirstCharacterInWord) {
                strings.push(currentString)
                currentString = character
            } else {
                currentString += character
            }
        })
        if (currentString) strings.push(currentString)

        strings.forEach((str, i) => {
            let literal = this.convertStringToLiteral(str.trim())

            if (
                items.length && typeof items[items.length - 1] === "string" && typeof literal === "string" && i > 1
            ) {
                items[items.length - 1] += str
            } else if (typeof literal === "string") {
                items.push(str)
            } else {
                items.push(literal)
            }
        })

        this.items = items.map(item => {
            if (typeof item === "string") return item.trim()
            return item
        })
    }

    static processMessage(
        bot: Bot,
        message: Message
    ) {
        let msgContent = new MessageContent()

        msgContent.message = message
        msgContent.textContent = message.content.trim()

        msgContent.preparse()


        let commandName: string = msgContent.items[0] as string
        let command = bot.commands.find(cmd => {
            if (!commandName.startsWith(bot.commandPrefix)) return false

            if (cmd.name instanceof RegExp) return cmd.name.test(commandName.substring(1))
            return cmd.name.toLowerCase() === commandName.substring(1).toLowerCase()
        })

        if (command) {
            let argObject = {}

            command.parameters.forEach((param, i) => {
                if (i >= msgContent.items.length - 1) return
                argObject[param] = msgContent.items[i + 1]
            })
            if (
                Object.keys(argObject).length !== command.parameters.length
            )
                argObject = null

            if (command.determinePermissions(message))
                command.process(
                    bot, message, argObject
                )
        }
    }
}

export class Command {
    public name: string | RegExp
    public parameters: string[]

    public permissionDeterminators: ((message: Message) => boolean)[] = []

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

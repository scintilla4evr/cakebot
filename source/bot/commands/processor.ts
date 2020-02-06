import { Bot } from ".."
import { Message } from "discord.js"
import { ErrorType } from "../error"
import { EditableCommand } from "./commands"

type EditableCommandInvocation = {
    sourceMessage: Message,
    targetMessage: Message
}

let editableCommandHistory: EditableCommandInvocation[] = []

export async function processMessage(
    bot: Bot,
    message: Message,
    isEdit = false
) {
    let cmdName = message.content.trim().split(/\s/)[0]
    if (!cmdName.startsWith(bot.commandPrefix)) return

    cmdName = cmdName.substring(bot.commandPrefix.length)

    let command = bot.commands.find(cmd => {
        if (cmd.name instanceof RegExp)
            return cmd.name.test(cmdName)
        else
            return cmd.name.toLowerCase() === cmdName.toLowerCase()
    })

    if (!command) return

    try {
        let args = bot.parser.parse(
            message,
            message.content.substring(bot.commandPrefix.length + cmdName.length).trim(),
            command.pattern
        )

        if (command.determinePermissions(message)) {
            if (
                command instanceof EditableCommand
            ) {
                let previousInvocation = editableCommandHistory.find(
                    item => item.sourceMessage == message
                )
                if (previousInvocation) {
                    let newContent = await command.processEditable(bot, message, args, cmdName)

                    previousInvocation.targetMessage.edit(newContent)
                } else {
                    let targetMessage = await message.channel.send(
                        await command.processEditable(bot, message, args, cmdName)
                    ) as Message

                    editableCommandHistory.push({
                        sourceMessage: message,
                        targetMessage
                    })
                }
            } else if (!isEdit) {
                await command.process(
                    bot, message, args, cmdName
                )
            }
        }
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
import { Bot } from "../../bot";
import { Command } from "../../bot/commands/commands";
import { Message, Attachment, TextChannel } from "discord.js";
import { Image, ImageWrapMethod, ImageInterpolationMethod } from "../../bot/graphics/image";
import { IConversationHandler, Conversation } from "../../bot/conversation";

class TestConvo implements IConversationHandler {
    public num: number

    roll() {
        this.num = Math.floor(Math.random() * 99) + 1
    }

    async start(
        bot: Bot, convo: Conversation
    ) {
        this.roll()
        await convo.channel.send(
            `Hi! Reply with my number to continue or 0 to bye bye! Number: ${this.num}`
        )
    }

    async willProceed(
        bot: Bot, message: Message, convo: Conversation
    ): Promise<boolean> {
        if (!isNaN(+message.content.trim())) return true
        return false
    }

    async process(
        bot: Bot, message: Message, convo: Conversation
    ) {
        let num = +message.content.trim()

        if (num === 0) {
            await message.channel.send("Bye!")
            convo.end()
        } else if (num === this.num) {
            this.roll()
            await message.channel.send(`Yeet! Number: ${this.num}`)
        } else {
            await message.channel.send("Nope! try again bitch")
        }
    }
}

class ConvoTestCommand extends Command {
    constructor() {
        super(
            "cmd.test.convo",
            "convo",
            ""
        )
    }

    async process(
        bot: Bot, message: Message, args: {}
    ) {
        bot.startConversation(
            message.channel as TextChannel,
            message.author,
            new TestConvo()
        )
    }
}

export async function handler(bot: Bot) {
    bot.addCommand(
        new ConvoTestCommand()
    )
}
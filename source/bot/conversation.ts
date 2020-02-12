import { Bot } from ".";
import { Message, TextChannel, User } from "discord.js";

let ongoingConversations: Conversation[] = []

export interface IConversationHandler {
    start: (
        bot: Bot, conversation: Conversation
    ) => Promise<void>
    
    willProceed: (
        bot: Bot, message: Message, conversation: Conversation
    ) => Promise<boolean>
    process: (
        bot: Bot, message: Message, conversation: Conversation
    ) => Promise<void>
}

export class Conversation {
    constructor(
        public bot: Bot,
        public channel: TextChannel,
        public user: User,
        public handler: IConversationHandler
    ) {}

    end() {
        let index = ongoingConversations.indexOf(this)

        if (index >= 0) ongoingConversations.splice(index, 1)
    }
}

export async function startConversation(
    bot: Bot, channel: TextChannel, user: User, handler: IConversationHandler
): Promise<Conversation> {
    let convo = new Conversation(bot, channel, user, handler)
    ongoingConversations.push(convo)

    await handler.start(bot, convo)

    return convo
}

export async function processConversations(
    bot: Bot, message: Message
): Promise<boolean> {
    let convo = ongoingConversations.find(
        c => c.user === message.author && c.channel === message.channel
    )

    if (
        convo &&
        await convo.handler.willProceed(
            bot, message, convo
        )
    ) {
        await convo.handler.process(bot, message, convo)
        return true
    }

    return false
}
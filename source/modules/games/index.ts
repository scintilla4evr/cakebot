import { Bot } from "../../bot";
import { Command } from "../../bot/commands/commands";
import { Message, TextChannel } from "discord.js";
import { IConversationHandler, IConversationHandlerCtor } from "../../bot/conversation";
import { HangmanGame } from "./games/hangman";

type GameDescription = {
    name: string,
    description: string,
    handler: IConversationHandlerCtor
}

const games: GameDescription[] = [
    {
        name: "hangman",
        description: "Hangman, bitch",
        handler: HangmanGame
    }
]

class GameCommand extends Command {
    constructor() {
        super(
            "cmd.games.game",
            "game",
            "$name?:string"
        )
    }

    async process(
        bot: Bot, message: Message,
        args: {
            name?: string
        }
    ) {
        if (!args.name) return

        let game = games.find(g => g.name === args.name.toLowerCase())
        if (!game) return

        bot.startConversation(
            message.channel as TextChannel, message.author,
            new game.handler()
        )
    }
}

class ExitGameCommand extends Command {
    constructor() {
        super(
            "cmd.games.exitgame",
            "exitgame",
            ""
        )
    }

    async process(
        bot: Bot, message: Message,
        args: {}
    ) {
        bot.endConversation(
            message.channel as TextChannel, message.author
        )
    }
}

export async function handler(bot: Bot) {
    bot.addCommand(
        new GameCommand(),
        new ExitGameCommand()
    )
}
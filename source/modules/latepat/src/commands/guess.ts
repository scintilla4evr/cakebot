import { Command } from "../../../../bot/commands/commands"
import { DocsCommandArgType } from "../../../../bot/docs/types"
import { Bot } from "../../../../bot"
import { Message, Attachment } from "discord.js"
import { LatePatState } from "../state"
import { getNickname } from "../nicknames"
import { LatePatClub } from "../clubs"

export class LatePatGuessCommand extends Command {
    constructor(
        public state: LatePatState
    ) {
        super(
            "cmd.latepat.guess",
            "guess",
            "$guess:number",
            {
                description: "Puts your guess in or modifies your previous guess in a LatePat guessing round.",
                parameters: [
                    {
                        name: "GUESS",
                        description: "Your guess, in minutes.",
                        type: DocsCommandArgType.number
                    }
                ],
                usage: [
                    {
                        description: "Guess 5 minutes.",
                        syntax: "5"
                    },
                    {
                        description: "Guess -432.52 minutes.",
                        syntax: "-432.52"
                    }
                ]
            }
        )
    }

    public async process(
        bot: Bot,
        message: Message,
        args: {
            guess: number
        }
    ) {
        if (!this.state.currentRound?.active) {
            await message.channel.send("The LatePat guessing round hasn't started yet.")
            return
        }

        this.state.currentRound.addGuess(message.author, args.guess)

        let nickname = await getNickname(bot, message.author)
        await message.channel.send(
            `:money_with_wings: ${nickname} guessed ${args.guess} minutes! :euro:`
        )

        await this.state.updateStorage()

        let club = await LatePatClub.getClub(bot, args.guess)

        if (club) {
            let buffer = await club.renderCard(this.state.currentRound.guesses)
            await message.channel.send(
                new Attachment(buffer)
            )
        }
    }
}
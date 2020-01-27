import { Command } from "../../../../bot/commands/commands";
import { LatePatState } from "../state";
import { Bot } from "../../../../bot";
import { Message, RichEmbed } from "discord.js";
import { average, stdDev } from "../../../../bot/util/stats";

export class LatePatGuessesCommand extends Command {
    constructor(
        public state: LatePatState
    ) {
        super(
            "cmd.latepat.guesses",
            "guesses",
            "",
            {
                description: "Displays a list of all guesses in the current LatePat round, together with some stats.",
                parameters: []
            }
        )
    }

    async process(
        bot: Bot,
        message: Message,
        args: {}
    ) {
        if (!this.state.currentRound?.active) {
            await message.channel.send("The LatePat guessing round hasn't started yet.")
            return
        }

        let guesses = this.state.currentRound.guesses.map(g => g.guess)
        let avg = average(guesses), stdDeviation = stdDev(guesses)

        await message.channel.send(
            new RichEmbed({
                description: this.state.currentRound.guesses.sort(
                    (g1, g2) => g1.guess - g2.guess
                ).map(
                    g => `${g.user} guessed ${g.guess} minutes`
                ).join("\n"),
                author: {
                    name: "LatePat Guesses"
                },
                footer: {
                    "text": `Average: ${avg.toPrecision(2)}, std. dev.: ${stdDeviation.toPrecision(2)}`
                }
            })
        )
    }
}
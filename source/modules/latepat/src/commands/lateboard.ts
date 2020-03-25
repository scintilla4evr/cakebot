import { Command } from "../../../../bot/commands/commands";
import { Bot } from "../../../../bot";
import { Message, GuildChannel } from "discord.js";
import { LatePatState } from "../state";

export class LatePatBoardCommand extends Command {
    constructor(
        public state: LatePatState
    ) {
        super(
            "cmd.latepat.lateboard",
            "lateboard",
            "",
            {
                description: "Displays the top 5 LatePat Guessing players.",
                parameters: []
            }
        )
    }

    async process(bot: Bot, message: Message, args: {}) {
        const winners: {
            [prop: string]: {
                count: number
                avg: number
            }
        } = {}

        this.state.rounds.forEach(round => {
            if (round.active || !("outcome" in round)) return
            if (
                new Date(round.timestamp) <= new Date("Thu Feb 13 2020 00:19:32 GMT+0100 (GMT+01:00)")
            ) return

            const winDistance = Math.min(
                ...round.guesses.map(guess => Math.abs(round.outcome - guess.guess))
            )

            round.guesses.forEach(guess => {
                const distance = Math.abs(guess.guess - round.outcome)
                if (distance != winDistance) return

                if (guess.userId in winners) {
                    winners[guess.userId].avg = (winners[guess.userId].avg * winners[guess.userId].count + distance) / (winners[guess.userId].count + 1)
                    winners[guess.userId].count++
                } else {
                    winners[guess.userId] = {
                        count: 1,
                        avg: distance
                    }
                }
            })
        })

        console.log(winners)

        const orderedWinners = Object.keys(winners).sort(
            (w1, w2) => {
                const countDiff = winners[w2].count - winners[w1].count
                if (countDiff !== 0) return countDiff
                return winners[w1].avg - winners[w2].avg
            }
        ).map((winner, i) => {
            const member = (message.channel as GuildChannel).guild.members.find(m => m.id === winner)
            return `**#${i + 1}:** ${member.displayName} - ${winners[winner].count} wins, off by ${(60 * winners[winner].avg).toFixed(2)} seconds on average`
        }).slice(0, 5)

        await message.channel.send(`**The LatePat Leaderboard**:\n${orderedWinners.join("\n")}`)
    }
}
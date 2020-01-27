import { Command } from "../../../bot/commands/commands"
import { Bot } from "../../../bot"
import { Message } from "discord.js"
import { pickRandom } from "../../../bot/util/random"
import { DocsCommandArgType } from "../../../bot/docs/types"

export class EightBallCommand extends Command {
    public ballAnswers = [
        "yes, definitely",
        "extremely likely",
        "yes",
        "all signs point to yes",
        "100% yes",
        "no doubt, sister",
        "Mercury and Neptune aren't lined up at a 4.2315° angle, try again",
        "hard to tell",
        "try again later",
        "think harder and `$8ball` again",
        "heck no",
        "nope",
        "doubts are at all time high",
        "definitely not",
        "nope, nope, nopety nope",
        "probably not",
        "not sure",
        "highly likely",
        "maybe"
    ]

    constructor(
    ) {
        super(
            "cmd.rng.8ball",
            "8ball",
            "",
            {
                description: "Provides a specific and on point yes/no answer to a question.",
                parameters: [
                    {
                        name: "question",
                        description: "The question you want to give to the ball.",
                        type: DocsCommandArgType.string
                    }
                ],
                usage: [
                    {
                        description: "Asking a simple question",
                        syntax: "Is the sky blue?"
                    },
                    {
                        description: "Complex queries",
                        syntax: "Is the string theory an accurate description of the nature of the Universe?"
                    }
                ]
            }
        )
    }

    public async process(
        bot: Bot,
        message: Message,
        args: {}
    ) {
        let ballMessage = pickRandom(this.ballAnswers)

        await message.channel.send(
            `The :8ball: says ${ballMessage}.`
        )
    }
}
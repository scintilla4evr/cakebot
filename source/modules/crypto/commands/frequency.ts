import { Command } from "../../../bot/commands/commands"
import { Bot } from "../../../bot"
import { Message } from "discord.js"
import { DocsCommandArgType } from "../../../bot/docs/types"

type Gram = {
    character: string
    frequency: number
}

export class FrequencyCommand extends Command {
    constructor() {
        super(
            "cmd.crypto.frequency",
            "frequency",
            "$str:string",
            {
                description: "Lists the number of occurences of every character in a string.",
                parameters: [
                    {
                        name: "str",
                        type: DocsCommandArgType.string,
                        description: "A string to analize"
                    }
                ]
            }
        )
    }

    getGrams(
        str: string
    ): Gram[] {
        let out: Gram[] = [];

        ([...str]).forEach(chr => {
            let gram = out.find(g => g.character == chr)

            if (gram) gram.frequency++
            else
                out.push({
                    character: chr,
                    frequency: 1
                })
        })

        return out.sort(
            (g1, g2) => g2.frequency - g1.frequency
        )
    }

    async process(
        bot: Bot,
        message: Message,
        args: {
            str: string
        }
    ) {
        const embed = {
            description: this.getGrams(args.str).map(
                g => `\`"${g.character}": ${g.frequency}\``
            ).join("\n"),
            author: {
                name: "Frequency analysis"
            }
        }

        await message.channel.send({ embed })
    }
}
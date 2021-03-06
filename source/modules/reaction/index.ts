import { Bot } from "../../bot";
import { Command } from "../../bot/commands/commands";
import { Message, Attachment } from "discord.js";
import { pickRandom } from "../../bot/util/random";
import { TeaCommand } from "./tea";

class ReactionImageCommand extends Command {
    public imageURLs: string[]

    constructor(
        name: string,
        description: string,
        imageURL: string | string[]
    ) {
        super(
            "cmd.reaction." + name,
            name, "",
            {
                description,
                parameters: []
            }
        )

        if (imageURL instanceof Array)
            this.imageURLs = imageURL
        else
            this.imageURLs = [imageURL]
    }

    async process(
        bot: Bot, message: Message, args: {}
    ) {
        await message.channel.send(
            new Attachment(
                pickRandom(this.imageURLs)
            )
        )
    }
}

class SinAlertCommand extends Command {
    private messages = [
        "WHO SINNED?",
        "DID SOMEONE SAY SIN?",
        "OH NO IS IT SIN TIME AGAIN?",
        "SIN! SIN! EVERYONE HIDE!",
        "SINNING TIME, SINNING TIME\nNEVER NEED TO SIN, NEVER NEED TO DIE!",
        "bass boosted sin sound.jpg",
        "YOU GET A SIN! AND YOU GET A SIN! EVERYONE GETS A SIN!!",
        "The name's Alert. Sin Alert."
    ]
    private imageURLs = [
        "https://cdn.discordapp.com/attachments/548467343571812352/551763908483088404/1.png",
        "https://cdn.discordapp.com/attachments/548467343571812352/551763912085733376/2.png",
        "https://cdn.discordapp.com/attachments/548467343571812352/551763916636553237/3.png",
        "https://cdn.discordapp.com/attachments/548467343571812352/551763918025129984/4.jpg"
    ]

    constructor() {
        super(
            "cmd.reaction.sinalert",
            "sinalert", "",
            {
                description: "Did someone sin??",
                parameters: []
            }
        )
    }

    async process(
        bot: Bot, message: Message, args: {}
    ) {
        await message.channel.send(
            pickRandom(this.messages),
            new Attachment(
                pickRandom(this.imageURLs)
            )
        )
    }
}

export async function handler(bot: Bot) {
    bot.addCommand(
        new ReactionImageCommand(
            "rulespray",
            "Ssss! You have been sprayed with the rule spray!",
            "https://cdn.discordapp.com/attachments/548467309103022101/599730990264614913/unknown.png"
        ),
        new ReactionImageCommand(
            "reverse",
            "no u",
            [
                "https://i.imgur.com/yXEiYQ4.jpg",
                "https://i.imgur.com/CSuB3ZW.png",
                "https://i.imgur.com/3WDcYbV.png",
                "https://i.imgur.com/IxDEdxW.png"
            ]
        ),
        new ReactionImageCommand(
            "microwavecat",
            "Microwave the cat!",
            "https://cdn.discordapp.com/attachments/548251314573017098/607003773398941706/unknown.png"
        ),

        new SinAlertCommand(),

        new TeaCommand()
    )
}
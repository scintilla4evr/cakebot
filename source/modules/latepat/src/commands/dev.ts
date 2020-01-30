import { LatePatState } from "../state"
import { Message } from "discord.js"
import { Bot } from "../../../../bot"
import { DevCommand } from "../../../../bot/commands/commands"
import { LatePatClub } from "../clubs"
import { getColorPalette } from "../../../../bot/apis/colormind"

export class LatePatRoundStartCommand extends DevCommand {
    constructor(
        public state: LatePatState
    ) {
        super(
            "cmd.latepat.start",
            "d_latepatstart",
            "$videoId:string"
        )
    }

    public async process(
        bot: Bot,
        message: Message,
        args: {
            videoId: string
        }
    ) {
        await this.state.startRound(args.videoId)
    }
}

export class LatePatRoundEndCommand extends DevCommand {
    constructor(
        public state: LatePatState
    ) {
        super(
            "cmd.latepat.end",
            "d_latepatend",
            "$outcome:number"
        )
    }

    public async process(
        bot: Bot,
        message: Message,
        args: {
            outcome: number
        }
    ) {
        this.state.currentRound.finish(args.outcome)

        await this.state.updateStorage()
    }
}

export class LatePatRoundCheckCommand extends DevCommand {
    constructor(
        public state: LatePatState
    ) {
        super(
            "cmd.latepat.check",
            "d_latepatcheck",
            ""
        )
    }

    public async process(
        bot: Bot,
        message: Message,
        args: {}
    ) {
        if (this.state.currentRound && this.state.currentRound.active) {
            await message.channel.send(
                `${this.state.currentRound.videoId}, ${this.state.currentRound.guesses.length} guesses`
            )
        } else {
            await message.channel.send("no round")
        }
    }
}

export class LatePatRoundClubCommand extends DevCommand {
    constructor(
        public state: LatePatState
    ) {
        super(
            "cmd.latepat.club",
            "d_club",
            "$guess:number $name:string"
        )
    }

    public async process(
        bot: Bot,
        message: Message,
        args: {
            guess: number,
            name: string
        }
    ) {
        let colors = await getColorPalette()
        
        let club = new LatePatClub(
            args.guess, args.name,
            colors[0], colors[2], colors[4]
        )

        await LatePatClub.addClub(bot, club)
    }
}
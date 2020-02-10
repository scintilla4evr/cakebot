import { TextChannel } from "discord.js";
import { LatePatRoundStruct, LatePatRound } from "./late";
import { Bot } from "../../../bot";

let latePatRoundsPath = ["latePat", "rounds"]

export class LatePatState {
    public rounds: LatePatRoundStruct[]

    public currentRound: LatePatRound

    constructor(
        public bot: Bot,
        public channel: TextChannel
    ) {}

    async import() {
        if (!await this.bot.storage.exists(latePatRoundsPath))
            await this.bot.storage.set(latePatRoundsPath, [])

        this.rounds = await this.bot.storage.get(latePatRoundsPath)

        if (this.rounds.find(r => r.active))
            this.currentRound = LatePatRound.fromJson(
                this.bot, this.rounds.find(r => r.active)
            )
    }

    async updateStorage() {
        if (this.currentRound) {
            let index = this.rounds.findIndex(r => r.videoId === this.currentRound.videoId)
            
            if (index >= 0) this.rounds[index] = this.currentRound.json
            else this.rounds.push(this.currentRound.json)
        }
    
        await this.bot.storage.set(latePatRoundsPath, this.rounds)
    }

    forceEndAllRounds() {
        this.rounds.forEach(round => round.active = false)
    }

    async startRound(
        videoId: string
    ) {
        this.forceEndAllRounds()
        
        this.currentRound = new LatePatRound(videoId)
        this.currentRound.start(this.bot)
    
        await this.updateStorage()
    
        await this.channel.send(
            `The LatePat guessing has begun!\nUse \`$guess *number*\` to add your guess to the pile! If you want to see what other people have guessed, type \`$guesses\`.\nI'll start with a guess of ${this.currentRound.getGuess(this.bot.client.user).guess} minutes!`
        )
    }
}
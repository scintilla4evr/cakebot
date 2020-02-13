import { TextChannel } from "discord.js";
import { LatePatRoundStruct, LatePatRound, LatePatGuess } from "./late";
import { Bot } from "../../../bot";
import { YTVideoDetails, getStreamInfo } from "../../../bot/apis/youtube";
import { extractGameFromVideoTitle } from "../../../bot/apis/gtlive";
import { dedent } from "../../../bot/util/dedent";
import { pickRandom } from "../../../bot/util/random";
import { pronounTemplate } from "../../../bot/util/pronouns";

let latePatRoundsPath = ["latePat", "rounds"]

export class LatePatState {
    public rounds: LatePatRoundStruct[]

    public currentRound: LatePatRound

    public currentInterval: NodeJS.Timeout

    constructor(
        public bot: Bot,
        public channel: TextChannel
    ) {}

    async import() {
        if (!await this.bot.storage.exists(latePatRoundsPath))
            await this.bot.storage.set(latePatRoundsPath, [])

        this.rounds = await this.bot.storage.get(latePatRoundsPath)

        if (this.rounds.find(r => r.active)) {
            this.currentRound = LatePatRound.fromJson(
                this.bot, this.rounds.find(r => r.active)
            )
            this.startWatchingForLaunch(this.currentRound.videoId)
        }
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

    async sendStartMessage(
        video: YTVideoDetails
    ) {
        const gameTitle = extractGameFromVideoTitle(video.title)

        const cakeGuess = this.currentRound.getGuess(this.bot.client.user).guess

        const prefix = this.bot.commandPrefix
        const instructions = pickRandom([
            dedent`Use \`${prefix}guess number\` to add your guess to the pile! If you want to see what other people have guessed, type \`${prefix}guesses\`.
            For example, to put in a guess of 7 minutes, type \`${prefix}guess 7\`.`,

            dedent`Simple! Just type \`${prefix}guess number\` to put that guess on the pile, e.g. \`${prefix}guess 1.4\` for a guess of 1.4 minutes (late).
            For a list of all guesses, type \`${prefix}guesses\`.`,
        ])

        await this.channel.send(
            dedent`The LatePat guessing has begun! Today they're playing **${gameTitle}**!
            I'll start with a guess of ${cakeGuess} minutes!

            **How to play?**
            ${instructions}`
        )
    }

    startWatchingForLaunch(
        videoId: string
    ) {
        this.currentInterval = setInterval(
            async () => {
                if (!this.currentRound || !this.currentRound.active) return this.stopWatching()

                let streamInfo = await getStreamInfo(videoId)

                if (
                    streamInfo.liveStream &&
                    streamInfo.startTime
                ) {
                    let outcome = streamInfo.startDelay / 1000 / 60

                    await this.finishRound(outcome)
                }
            },
            15 * 1000
        )
    }

    stopWatching() {
        clearInterval(this.currentInterval)
        this.currentInterval = null
    }

    async startRound(
        video: YTVideoDetails
    ) {
        let lastActiveRound = this.rounds.find(round => round.active)
        if (lastActiveRound && lastActiveRound.videoId === video.videoId) return

        this.forceEndAllRounds()
        
        this.currentRound = new LatePatRound(video.videoId)
        this.currentRound.start(this.bot)
        this.startWatchingForLaunch(video.videoId)
    
        await this.updateStorage()
    
        await this.sendStartMessage(video)
    }

    async sendFinishMessage(
        winners: LatePatGuess[],
        outcome: number
    ) {
        let message = ""
        let delta = Math.abs(60 * (outcome - winners[0].guess)).toFixed(2)

        if (winners.length === 1) {
            let member = this.channel.guild.members.find(m => m.user == winners[0].user)
            let p = pronounTemplate(member)

            message = pickRandom([
                p`The winner is ${member}! Their guess was off by ${delta} seconds!`,
                p`And the winner is ${member} with their guess off by ${delta} seconds!`,
                `With a guess off by ${delta} seconds, ${member} is the winner!`
            ])
        } else {
            let winnersList = winners.map(
                (u, i, l) => (i === l.length - 1) ? `and ${u.user}` : `${u.user}`
            ).join(", ")

            message = pickRandom([
                `With their guesses off by ${delta} seconds, the winners are ${winnersList}!`,
                `The winners are ${winnersList}! All of their guesses were off by ${delta}!`
            ])
        }

        await this.channel.send(message + " Congratulations!")
    }

    async finishRound(
        outcome: number
    ) {
        if (!this.currentRound || !this.currentRound.active) return

        let winners = this.currentRound.finish(outcome)
        this.stopWatching()

        await this.updateStorage()

        await this.sendFinishMessage(winners, outcome)
    }
}
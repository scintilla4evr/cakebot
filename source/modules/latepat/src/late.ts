import { User } from "discord.js"
import { Bot } from "../../../bot"
import { EventEmitter } from "events"

export type LatePatGuessStruct = {
    guess: number,
    userId: string
}

export type LatePatRoundStruct = {
    active: boolean,

    timestamp: string,

    guesses: LatePatGuessStruct[],
    outcome: number,

    videoId: string
}

export class LatePatGuess {
    constructor(
        public user: User,
        public guess: number
    ) {}

    get json(): LatePatGuessStruct {
        return {
            guess: this.guess,
            userId: this.user.id
        }
    }
}

export class LatePatRound {
    public guesses: LatePatGuess[] = []
    public outcome: number

    public active = false

    public timestamp: Date

    constructor(
        public videoId: string
    ) {}

    get json(): LatePatRoundStruct {
        return {
            active: this.active,
            guesses: this.guesses.map(g => g.json),
            outcome: this.outcome,
            timestamp: this.timestamp.toString(),
            videoId: this.videoId
        }
    }

    static fromJson(bot: Bot, data: LatePatRoundStruct): LatePatRound {
        let round = new LatePatRound(
            data.videoId
        )

        if (data.active) {
            round.start(bot)
        }
        
        round.timestamp = new Date(data.timestamp)

        round.guesses = data.guesses.map(g => {
            return new LatePatGuess(
                bot.client.users.find(u => u.id === g.userId),
                g.guess
            )
        })

        if ("outcome" in data && typeof data.outcome === "number")
            round.outcome = data.outcome

        return round
    }

    addGuess(
        user: User, guess: number
    ) {
        if (this.getGuess(user)) {
            this.getGuess(user).guess = guess

            return
        }
        this.guesses.push(
            new LatePatGuess(user, guess)
        )
    }

    getGuess(user: User): LatePatGuess {
        return this.guesses.find(g => g.user == user)
    }

    start(bot: Bot) {
        this.active = true
        this.timestamp = new Date() 

        this.addGuess(
            bot.client.user,
            Math.floor(Math.random() * 8 + 2)
        )
    }

    finish(outcome: number): LatePatGuess[] {
        let sortedGuesses = this.guesses.sort(
            (g1, g2) => {
                let absG1 = Math.abs(g1.guess - outcome)
                let absG2 = Math.abs(g2.guess - outcome)

                return absG1 - absG2
            }
        )

        this.active = false
        this.outcome = outcome

        return sortedGuesses.filter(
            g => Math.abs(g.guess - outcome) === Math.abs(sortedGuesses[0].guess - outcome)
        )
    }
}
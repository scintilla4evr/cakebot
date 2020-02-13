import { IConversationHandler, Conversation } from "../../../bot/conversation";
import { Bot } from "../../../bot";
import { Message, TextChannel, Channel } from "discord.js";
import { readFileSync } from "fs";
import { join } from "path";
import { dedent } from "../../../bot/util/dedent";
import { pickRandom } from "../../../bot/util/random";

const alphabet = "abcdefghijklmnopqrstuvwxyz"
const words = JSON.parse(
    readFileSync(
        join(__dirname, "../../../../assets/json/hangman.json"),
        "utf-8"
    )
)

export class HangmanGame implements IConversationHandler {
    public fullWord: string
    public currentWord: string
    public wrongLetters: string[] = []

    public lives = 6

    async sendUI(
        channel: TextChannel
    ) {
        let word = [...this.currentWord].map(chr => {
            if (chr === " ") return ":black_small_square:"
            else if (chr === "_") return ":black_large_square:"

            return `:regional_indicator_${chr}:`
        }).join(" ")
        let lives = ":heart: ".repeat(this.lives) + 
                    ":black_heart: ".repeat(6 - this.lives)

        await channel.send(
            dedent`**Word:** ${word}
            **Lives:** ${lives}`
        )
    }

    async processMove(
        letter: string,
        convo: Conversation
    ) {
        if (this.currentWord.includes(letter)) {
            await convo.channel.send("You already picked that letter.")
        } else if (!this.fullWord.includes(letter)) {
            if (this.wrongLetters.includes(letter))
                return await convo.channel.send("You already picked that letter and it wasn't in the word.")
            
            this.lives -= 1
            this.wrongLetters.push(letter)

            await convo.channel.send(
                `There are no ${letter.toUpperCase()}s in the word.`
            )

            if (this.lives === 0) {
                convo.end()
                return await convo.channel.send(
                    `And you lost! The word was **${this.fullWord.toUpperCase()}**`
                )
            }

            await this.sendUI(convo.channel)
        } else {
            this.currentWord = [...this.currentWord].map(
                (chr, i) => {
                    if (this.fullWord[i] === letter) return letter
                    return chr
                }
            ).join("")

            await this.sendUI(convo.channel)

            if (this.currentWord === this.fullWord)
                await convo.channel.send("You won! Conglaturations!")
        }
    }

    async start(
        bot: Bot, convo: Conversation
    ) {
        let categories = Object.keys(words).map(
            name => `\`${name}\``
        ).join(", ")

        await convo.channel.send(
            `k, let's do this!\n**Pick a category.** Just reply with the name of the category you want.\n${categories}`
        )
    }

    async willProceed(
        bot: Bot, message: Message,
        convo: Conversation
    ): Promise<boolean> {
        if (this.fullWord) {
            let content = message.content.toLowerCase().trim()

            if (content === this.fullWord) {
                return true
            }
            
            return content.length === 1 &&
                   alphabet.includes(content)
        } else if (
            message.content.toLowerCase().trim() in words
        ) {
            return true
        }

        return false
    }

    async process(
        bot: Bot, message: Message,
        convo: Conversation
    ) {
        let content = message.content.toLowerCase().trim()

        if (this.fullWord) {
            if (content === this.fullWord) {
                message.channel.send(
                    `Yep! The word was **${this.fullWord.toUpperCase()}**. Good job!`
                )
                convo.end()
                return
            }

            await this.processMove(
                content,
                convo
            )
        } else {
            this.fullWord = pickRandom(words[content])
            this.currentWord = this.fullWord.replace(/[a-z]/g, "_")

            await this.sendUI(convo.channel)
        }
    }
}
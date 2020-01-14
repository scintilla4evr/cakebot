import { Message } from "discord.js"

export interface IArgType {
    alias: string

    isValid: (str: string) => boolean
    parse: (msg: Message, str: string) => any
}

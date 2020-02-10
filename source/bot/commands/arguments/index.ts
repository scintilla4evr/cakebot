import { Message } from "discord.js"

export interface IArgType {
    alias: string

    isValid: (str: string, length?: number) => boolean
    parse: (msg: Message, str: string) => any
}

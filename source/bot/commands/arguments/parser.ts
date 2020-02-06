import { IArgType } from "."
import { Message } from "discord.js"
import { NumberType, StringType } from "./types/basic"
import { type } from "os"
import { BotError, ErrorType } from "../../error"

export type ArgumentTarget = {
    type: IArgType
    key: string,
    optional: boolean,
    defaultValue?: any
}

export type ParsedArguments = {
    [prop: string]: any
}

export class ArgumentParser {
    public types: IArgType[] = []

    constructor() {
        this.register(
            new NumberType(),
            new StringType()
        )
    }

    register(...types: IArgType[]) {
        this.types.push(...types)
    }

    splitArgv(argv: string): string[] {
        let output: string[] = []

        let current = ""
        let isInQuotes = false, quoteChar: string
        let quoteChars = `"'`

        while (argv.length) {
            let chr = argv[0]

            argv = argv.substring(1)

            if (isInQuotes) {
                if (chr == quoteChar) {
                    isInQuotes = false
                    output.push(current)
                    current = ""
                } else {
                    current += chr
                }
            } else {
                if (/\s/.test(chr) && current.length) {
                    output.push(current)
                    current = ""
                } else if (quoteChars.includes(chr) && !current.length) {
                    isInQuotes = true
                    quoteChar = chr
                } else {
                    if (!/\s/.test(chr))
                        current += chr
                }
            }
        }

        if (current) output.push(current)

        return output
    }

    processRawPattern(pattern: string): (ArgumentTarget | string)[] {
        return pattern.split(/\s/).map(str => {
            let rx = /^\$([a-z_][a-z0-9_]*)(\??)\:([a-z_][a-z0-9_]*)(=[^\s]+)?$/i.exec(str)

            if (rx) {
                let type = this.types.find(type => type.alias === rx[3])
                if (!type)
                    throw new BotError(
                        ErrorType.parserUnknownTypeAlias,
                        `Unknown type alias: ${rx[3]}.`
                    )

                return {
                    type, key: rx[1],
                    optional: rx[2] === "?"
                }
            } else {
                return str
            }
        })
    }

    processPattern(message: Message, pattern: string): (ArgumentTarget | string)[] {
        return pattern.split(/\s/).map(str => {
            let rx = /^\$([a-z_][a-z0-9_]*)(\??)\:([a-z_][a-z0-9_]*)(=[^\s]+)?$/i.exec(str)

            if (rx) {
                let type = this.types.find(type => type.alias === rx[3])
                if (!type)
                    throw new BotError(
                        ErrorType.parserUnknownTypeAlias,
                        `Unknown type alias: ${rx[3]}.`
                    )
                    
                let defaultValue
                if (rx[4])
                    defaultValue = type.parse(message, rx[4].substring(1))

                return {
                    type, key: rx[1],
                    optional: rx[2] === "?",
                    defaultValue
                }
            } else {
                return str
            }
        })
    }

    parse(
        message: Message,
        str: string,
        pattern: string
    ): ParsedArguments {
        let output = {}
        let template = this.processPattern(message, pattern)
        let argv = this.splitArgv(str)

        // Parse that thang
        template.forEach((item, index) => {
            let i = 0

            for (; i < argv.length; i++) {
                let joinedString = argv.slice(0, i + 1).join(" ")

                if (typeof item === "string") {
                    if (joinedString.toLowerCase() === item.toLowerCase()) {            
                        argv.splice(0, i + 1)
                        break
                    }
                } else {
                    if (item.type instanceof StringType) {
                        output[item.key] = item.type.parse(message, argv.join(" "))
                        break
                    } else if (item.type.isValid(joinedString)) {
                        output[item.key] = item.type.parse(message, joinedString)
                        
                        argv.splice(0, i + 1)
                        break
                    }
                }
            }
        })

        // Check for irregularities
        template.forEach(item => {
            if (typeof item === "string") return
            if (!item.optional && !(item.key in output))
                throw new BotError(
                    ErrorType.parserInvalidCommandSyntax,
                    `Invalid command syntax. Missing parameter: ${item.key}.`
                )
            else if (item.optional && "defaultValue" in item && !(item.key in output))
                    output[item.key] = item.defaultValue
        })

        return output
    }
}
import { EditableCommand } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";
import substitute from "../util/substitute";
import { range } from "../../../bot/util/range";
import { mod } from "../../../bot/util/mod";
import { DocsCommandArgType } from "../../../bot/docs/types";

export class Rot13Command extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.rot13",
            "rot13",
            "$str:string",
            {
                description: "Decodes a string encoded with ROT13.",
                parameters: [
                    {
                        name: "str",
                        type: DocsCommandArgType.string,
                        description: "A string of letters"
                    }
                ],
                usage: [
                    {
                        description: "Decoding a secret Illuminati messge",
                        syntax: `PNGF vf gur orfg zbivr`
                    }
                ]
            }
        )
    }

    async processEditable(
        bot: Bot,
        message: Message,
        args: {
            str: string
        }
    ): Promise<string> {
        return substitute(
            args.str,
            (index: number) => mod(index - 13, 26)
        )
    }
}

export class RotNCommand extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.rot",
            "rot",
            "$n:number $str:string",
            {
                description: "Decodes a string encoded with ROT.",
                parameters: [
                    {
                        name: "n",
                        type: DocsCommandArgType.number,
                        description: "A number in the range 1-25"
                    },
                    {
                        name: "str",
                        type: DocsCommandArgType.string,
                        description: "A string of letters"
                    }
                ],
                usage: [
                    {
                        description: "Decoding a secret Illuminati messge",
                        syntax: `9 mrm bxvnxwn arwp cqn mrwtbcna`
                    }
                ]
            }
        )
    }

    async processEditable(
        bot: Bot,
        message: Message,
        args: {
            n: number,
            str: string
        }
    ): Promise<string> {
        return substitute(
            args.str,
            (index: number) => mod(index - args.n, 26)
        )
    }
}

export class RotAllCommand extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.rotall",
            "rotall",
            "$str:string",
            {
                description: "Decodes a string encoded with ROTn for all n.",
                parameters: [
                    {
                        name: "str",
                        type: DocsCommandArgType.string,
                        description: "A string of letters"
                    }
                ],
                usage: [
                    {
                        description: "Decoding a secret Illuminati messge",
                        syntax: `QICH Tqtto`
                    }
                ]
            }
        )
    }

    async processEditable(
        bot: Bot,
        message: Message,
        args: {
            n: number,
            str: string
        }
    ): Promise<string> {
        return range(1, 25).map((n) => {
            let str = substitute(
                args.str,
                (index: number) => mod(index - n, 26)
            )

            return `ROT${n}: \`${str}\``
        }).join("\n")
    }
}
import { EditableCommand } from "../../../bot/commands/commands";
import { Bot } from "../../../bot";
import { Message } from "discord.js";
import substitute from "../util/substitute";
import { range } from "../../../bot/util/range";
import { mod } from "../../../bot/util/mod";

export class Rot13Command extends EditableCommand {
    constructor() {
        super(
            "cmd.crypto.rot13",
            "rot13",
            "$str:string"
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
            "$n:number $str:string"
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
            "$str:string"
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
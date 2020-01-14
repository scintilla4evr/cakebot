import { Command } from "../../../bot/commands/commands"
import { IUnit } from "./unit"
import { Message } from "discord.js"
import { Bot } from "../../../bot"

export class UnitCommand extends Command {
    constructor(
        public name: string,
        public from: IUnit,
        public to: IUnit
    ) {
        super(
            name,
            "$value:number"
        )
    }

    public async process(
        bot: Bot,
        message: Message,
        args: {value: number}
    ) {
        let convertedValue = this.to.convertToUnit(this.from.convertFromUnit(args.value)).toFixed(2)

        await message.channel.send(
            `${args.value} ${this.from.symbol} = ${convertedValue} ${this.to.symbol}`
        )
    }
}
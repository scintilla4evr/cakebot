import knownUnits from "./units/knownUnits";
import { Command } from "../../bot/commands/commands";
import { Bot } from "../../bot";
import { Message } from "discord.js";
import { IArgType } from "../../bot/commands/arguments";
import { IUnit } from "./types/unit";

export type UnitPair = {
    from: IUnit,
    to: IUnit
}

export class UnitType implements IArgType {
    public alias = "unit"

    getUnitsFromString(str: string): IUnit[] {
        return knownUnits.filter(unit => {
            return str === unit.symbol.replace(/[^a-zμ]/i, "") ||
                   str.toLowerCase() === unit.symbol.replace(/[^a-zμ]/i, "").toLowerCase() ||
                   str.toLowerCase() === unit.name.toLowerCase()
        })
    }

    isValid(str: string): boolean {
        return !!this.getUnitsFromString(str).length
    }

    parse(message: Message, str: string): IUnit[] {
        return this.getUnitsFromString(str)
    }
}

export class UnitConvertCommand extends Command {
    constructor() {
        super(
            "convert",
            "$value:number $unitFrom:unit to $unitTo:unit"
        )
    }

    findUnitPairs(from: IUnit[], to: IUnit[]): UnitPair[] {
        let pairs: UnitPair[] = []

        from.forEach(unitFrom => {
            pairs.push(
                ...to.filter(
                    unitTo => unitFrom.quantity === unitTo.quantity
                ).map(unitTo => {
                    return {
                        from: unitFrom,
                        to: unitTo
                    }
                })
            )
        })

        return pairs
    }

    public async process(
        bot: Bot,
        message: Message,
        args: {
            value: number,
            unitFrom: IUnit[],
            unitTo: IUnit[]
        }
    ) {
        let pairs = this.findUnitPairs(args.unitFrom, args.unitTo)
        let outStr = ""

        if (pairs.length > 1) {
            outStr = `The symbols you provided are ambiguous and the detected units might not be the ones you were looking for.\nIf that's the case, try again, but this time type out the full names (e.g. instead of "K", type "kelvin").\n\n`
        } else if (pairs.length === 0) {
            await message.channel.send(
                `The units you provided are either not convertible by the bot or represent different quantities (e.g. kelvin to gigabyte).`
            )
            return
        }

        let convertedValue = pairs[0].to.convertToUnit(
            pairs[0].from.convertFromUnit(
                args.value
            )
        ).toFixed(2)

        outStr += `${args.value} ${pairs[0].from.symbol} = ${convertedValue} ${pairs[0].to.symbol}`

        await message.channel.send(outStr)
    }
}
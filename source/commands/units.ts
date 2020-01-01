import {Bot} from "../bot"
import {Command} from "../bot/commands"
import {AttachToBot, DefineCommand} from "../bot/decorators"
import { Message } from "discord.js";


class Unit {
    constructor(
        public factor: number, public bias: number,
        public unitSymbol: string
    ) {}

    convertToUnit(base: number) {
        return base * this.factor + this.bias
    }

    convertFromUnit(unit: number) {
        return (unit - this.bias) / this.factor
    }
}

class UnitCommand extends Command {
    public from: Unit
    public to: Unit

    public async process(
        bot: Bot,
        message: Message,
        args: {value: number}
    ) {
        let convertedValue = this.to.convertToUnit(this.from.convertFromUnit(args.value))

        await message.channel.send(`${convertedValue.toFixed(2)} ${this.to.unitSymbol}`)
    }
}

export function handler(bot: Bot) {
    let kelvin = new Unit(1, 0, "K")
    let celsius = new Unit(1, -273.15, "°C")
    let fahrenheit = new Unit(9/5, -459.67, "°F")

    @DefineCommand("ktoc", ["value"])
    @AttachToBot(bot)
    class KelvinToCelsius extends UnitCommand {
        public from = kelvin
        public to = celsius
    }
    new KelvinToCelsius()

    @DefineCommand("ctok", ["value"])
    @AttachToBot(bot)
    class CelsiusToKelvin extends UnitCommand {
        public from = celsius
        public to = kelvin
    }
    new CelsiusToKelvin()

    @DefineCommand("ktof", ["value"])
    @AttachToBot(bot)
    class KelvinToFahrenheit extends UnitCommand {
        public from = kelvin
        public to = fahrenheit
    }
    new KelvinToFahrenheit()

    @DefineCommand("ftok", ["value"])
    @AttachToBot(bot)
    class FahrenheitToKelvin extends UnitCommand {
        public from = fahrenheit
        public to = kelvin
    }
    new FahrenheitToKelvin()

    @DefineCommand("ctof", ["value"])
    @AttachToBot(bot)
    class CelsiusToFahrenheit extends UnitCommand {
        public from = celsius
        public to = fahrenheit
    }
    new CelsiusToFahrenheit()

    @DefineCommand("ftoc", ["value"])
    @AttachToBot(bot)
    class FahrenheitToCelsius extends UnitCommand {
        public from = fahrenheit
        public to = celsius
    }
    new FahrenheitToCelsius()
}
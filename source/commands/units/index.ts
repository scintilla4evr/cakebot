import { Bot } from "../../bot"
import { UnitCommand } from "./types/command";

import { kelvin, fahrenheit, celsius } from "./units/temperatures";
import knownUnits from "./units/knownUnits";

export function handler(bot: Bot) {
    bot.addCommand(
        new UnitCommand("ktof", kelvin, fahrenheit),
        new UnitCommand("ktoc", kelvin, celsius),
        new UnitCommand("ftoc", fahrenheit, celsius),
        new UnitCommand("ftok", fahrenheit, kelvin),
        new UnitCommand("ctok", celsius, kelvin),
        new UnitCommand("ctof", celsius, fahrenheit)
    )
}
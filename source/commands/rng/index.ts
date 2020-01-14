import { Bot } from "../../bot";
import { EightBallCommand } from "./commands/8ball";
import { DieRollCommand } from "./commands/roll";
import { RandomCommand } from "./commands/random";

export function handler(bot: Bot) {
    bot.addCommand(
        new EightBallCommand(),
        new DieRollCommand(),
        new RandomCommand()
    )
}
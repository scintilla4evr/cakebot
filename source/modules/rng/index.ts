import { Bot } from "../../bot";
import { EightBallCommand } from "./commands/8ball";
import { DieRollCommand } from "./commands/roll";

export async function handler(bot: Bot) {
    bot.addCommand(
        new EightBallCommand(),
        new DieRollCommand()
    )
}
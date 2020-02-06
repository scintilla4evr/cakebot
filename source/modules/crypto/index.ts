import { Bot } from "../../bot";
import { MorseCommand } from "./commands/morse";

export async function handler(bot: Bot) {
    bot.addCommand(
        new MorseCommand()
    )
}
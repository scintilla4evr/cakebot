import { Bot } from "../../bot";
import { MorseCommand } from "./commands/morse";
import { A1Z26Command } from "./commands/a1z26";

export async function handler(bot: Bot) {
    bot.addCommand(
        new MorseCommand(),
        new A1Z26Command()
    )
}
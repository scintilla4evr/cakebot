import { Bot } from "../../bot";
import { InvertCommand } from "./commands";

export async function handler(bot: Bot) {
    bot.addCommand(
        new InvertCommand()
    )
}
import { Bot } from "../../bot";
import { OwoCommand } from "./commands/owo";

export async function handler(bot: Bot) {
    bot.addCommand(
        new OwoCommand()
    )
}
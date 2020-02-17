import { Bot } from "../../bot";
import { OwoCommand } from "./commands/owo";
import { prepCopystrikes, CopystrikeCommand } from "./commands/copystrike";

export async function handler(bot: Bot) {
    await prepCopystrikes(bot)

    bot.addCommand(
        new OwoCommand(),
        new CopystrikeCommand()
    )
}
import { User } from "discord.js";
import { Bot } from "../../../bot";
import { pickRandom } from "../../../bot/util/random";

export async function getNickname(bot: Bot, user: User): Promise<string> {
    let nicknamePath = ["latePat", "nicknames", user]

    if (await bot.storage.exists(nicknamePath)) {
        let nicknames: string[] = await bot.storage.get(nicknamePath)

        return pickRandom(nicknames)
    } else {
        return user.username
    }
}
import { load, loadModules } from "./loader"
import { getStreamInfo } from "./bot/apis/youtube"

(async () => {
    let bot = await load()
    await bot.login()
    await loadModules(bot)
})()

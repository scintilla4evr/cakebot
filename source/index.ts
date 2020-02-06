import { load, loadModules } from "./loader"

(async () => {
    let bot = await load()
    await bot.login()
    await loadModules(bot)
})()

import { load, loadModules } from "./loader"
import { generateDocs } from "./bot/docs/generator"
import { writeFileSync } from "fs"
import { join } from "path"

(async () => {
    let bot = await load()
    await bot.login()
    await loadModules(bot)

    let docs = generateDocs(bot)
        
    writeFileSync(
        join(__dirname, "../docs/commands_output.html"),
        docs, "utf-8"
    )

    await bot.logoff()
    process.exit()
})()
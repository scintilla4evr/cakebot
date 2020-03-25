import { load, loadModules } from "./loader"
import { generateDocs } from "./bot/docs/generator"
import { writeFileSync, readFileSync } from "fs"
import { join } from "path"
import { Bot } from "./bot"

function docsStats(bot: Bot) {
    const commandsWithHelp = bot.commands.filter(
        cmd => cmd.docs
    )
    const commandsWithoutHelp = bot.commands.filter(
        c => !commandsWithHelp.includes(c)
    )

    console.log(
        `${commandsWithHelp.length} out of ${bot.commands.length} commands have docs.
Commands w/o docs:`
    )
    console.log(
        commandsWithoutHelp.map(
            cmd => cmd.commandId
        )
    )
}

(async () => {
    const bot = await load()
    await bot.login()
    await loadModules(bot)

    docsStats(bot)

    const template = readFileSync(
        join(__dirname, "../docs/commands_template.html"),
        "utf-8"
    )

    const docs = generateDocs(bot)
        
    writeFileSync(
        join(__dirname, "../docs/commands.html"),
        template.replace("%%COMMANDS%%", docs),
        "utf-8"
    )

    await bot.logoff()
    process.exit()
})()
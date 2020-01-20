import { Bot } from "./bot"
import { setupStorage } from "./bot/storage/storage"

import { join } from "path"
import { registerFont } from "canvas"

let cake = new Bot(
    process.env.DISCORD_API_KEY,
    process.env.CMD_PREFIX
)

// Storage!
cake.storage = setupStorage()

// Fonts
registerFont(
    join(__dirname, "../assets/fonts/sans/Inter-Regular.ttf"),
    {
        family: "DefaultSansSerif",
        weight: "400"
    }
)

// Loading command modules
let commandFiles = process.env.BOT_MODULES.split(",").map(x => `commands/${x}`)

commandFiles.forEach(f => {
    let filePath = join(__dirname, f)
    
    import(filePath).then(mod => {
        mod.handler(cake)
    })
})

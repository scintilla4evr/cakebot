import {Bot} from "./bot"
import {PostgresStorage} from "./bot/storage/postgres"

import {join} from "path"
import { setupStorage } from "./bot/storage/storage"

let cake = new Bot(
    process.env.DISCORD_API_KEY,
    process.env.CMD_PREFIX
)

cake.storage = setupStorage()

let commandFiles = process.env.BOT_MODULES.split(",").map(x => `commands/${x}`)

commandFiles.forEach(f => {
    let filePath = join(__dirname, f)
    
    import(filePath).then(mod => {
        mod.handler(cake)
    })
})
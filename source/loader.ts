import { config } from "dotenv-safe"
import { join } from "path"
import { Bot } from "./bot"
import { setupStorage } from "./bot/storage/storage"
import { registerFont } from "canvas"

export async function load(): Promise<Bot> {
    config({
        path: join(__dirname, "../.env")
    })

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
    registerFont(
        join(__dirname, "../assets/fonts/sans/Inter-Bold.ttf"),
        {
            family: "DefaultSansSerif",
            weight: "700"
        }
    )

    return cake
}

export async function loadModules(cake: Bot): Promise<void> {
    let commandFiles = process.env.BOT_MODULES.split(",").map(x => `modules/${x}`)

    await Promise.all(
        commandFiles.map(async f => {
            let filePath = join(__dirname, f)
            let mod = await import(filePath)

            await mod.handler(cake)

            console.info(
                `Loaded ${f}.`
            )
        })
    )
}
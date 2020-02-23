import { config } from "dotenv-safe"
import { join } from "path"
import { Bot } from "./bot"
import { setupStorage } from "./bot/storage/storage"
import { registerFont } from "canvas"

function loadFonts() {
    registerFont(
        join(__dirname, "../assets/fonts/sans/Inter-ExtraLight-BETA.ttf"),
        {
            family: "DefaultSansSerif",
            weight: "100"
        }
    )
    registerFont(
        join(__dirname, "../assets/fonts/sans/Inter-Thin-BETA.ttf"),
        {
            family: "DefaultSansSerif",
            weight: "200"
        }
    )
    registerFont(
        join(__dirname, "../assets/fonts/sans/Inter-Light-BETA.ttf"),
        {
            family: "DefaultSansSerif",
            weight: "300"
        }
    )
    registerFont(
        join(__dirname, "../assets/fonts/sans/Inter-Regular.ttf"),
        {
            family: "DefaultSansSerif",
            weight: "400"
        }
    )
    registerFont(
        join(__dirname, "../assets/fonts/sans/Inter-Medium.ttf"),
        {
            family: "DefaultSansSerif",
            weight: "500"
        }
    )
    registerFont(
        join(__dirname, "../assets/fonts/sans/Inter-SemiBold.ttf"),
        {
            family: "DefaultSansSerif",
            weight: "600"
        }
    )
    registerFont(
        join(__dirname, "../assets/fonts/sans/Inter-Bold.ttf"),
        {
            family: "DefaultSansSerif",
            weight: "700"
        }
    )
    registerFont(
        join(__dirname, "../assets/fonts/sans/Inter-Black.ttf"),
        {
            family: "DefaultSansSerif",
            weight: "800"
        }
    )
}

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
    loadFonts()

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
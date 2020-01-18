import fetch from "node-fetch"

export async function ytRequest(
    type: string,
    args: {
        [prop: string]: any
    }
): Promise<any> {
    let query = Object.keys(args).map(key => `&${key}=${args[key]}`).join("")
    let url = `https://www.googleapis.com/youtube/v3/${type}?key=${process.env.YT_API_KEY}${query}`

    let data = await fetch(url)
    
    return await data.json()
}

export async function isStream(
    videoID: string
) {
}
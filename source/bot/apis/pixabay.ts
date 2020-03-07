import fetch from "node-fetch"

export type PixabayResult = {
    imageUrl: string
    pageUrl: string
    author: string
}

const apiKey = process.env["PIXABAY_API_KEY"]

export async function getStockImages(
    query: string
): Promise<PixabayResult[]> {
    if (!apiKey) return []

    const encQuery = query.replace(/\s/g, "+")
    const reqUrl = `https://www.pixabay.com/api/?key=${apiKey}&q=${encQuery}&image_type=photo&per_page=5`
    console.log(reqUrl)
    
    const data = await (await fetch(reqUrl)).json()

    if (!data.total) return []

    return data.hits.map(hit => {
        return {
            imageUrl: hit.largeImageURL,
            pageUrl: hit.pageURL,
            author: hit.user
        }
    })
}
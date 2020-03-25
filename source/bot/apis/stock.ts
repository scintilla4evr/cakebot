import fetch from "node-fetch"

export type StockResult = {
    imageUrl: string
    displayUrl: string
    pageUrl: string
    author: string
    source: "Pixabay" | "Unsplash"
}

const pixabayApiKey = process.env["PIXABAY_API_KEY"]

const usplashAccessKey = process.env["UNSPLASH_ACCESS_KEY"]
const usplashSecretKey = process.env["UNSPLASH_SECRET_KEY"]

export async function getUnsplashImages(
    query: string
): Promise<StockResult[]> {
    if (!usplashAccessKey) return []

    const encQuery = query.replace(/\s/g, "+")
    const reqUrl = `https://api.unsplash.com/search/photos?client_id=${usplashAccessKey}&query=${encQuery}`

    const data = await (await fetch(reqUrl)).json()

    if (!data.total) return []

    return data.results.map(hit => {
        return {
            imageUrl: hit.urls.regular,
            displayUrl: hit.urls.raw,
            pageUrl: hit.links.html,
            author: hit.user.username,
            source: "Unsplash"
        } as StockResult
    })
}

export async function getPixabayImages(
    query: string
): Promise<StockResult[]> {
    if (!pixabayApiKey) return []

    const encQuery = query.replace(/\s/g, "+")
    const reqUrl = `https://www.pixabay.com/api/?key=${pixabayApiKey}&q=${encQuery}&image_type=photo&per_page=15&safesearch=true`

    const data = await (await fetch(reqUrl)).json()

    if (!data.total) return []

    return data.hits.map(hit => {
        return {
            imageUrl: hit.largeImageURL,
            displayUrl: hit.largeImageURL,
            pageUrl: hit.pageURL,
            author: hit.user,
            source: "Pixabay"
        } as StockResult
    })
}

export async function getStockImages(
    query: string
): Promise<StockResult[]> {
    return (await Promise.all([
        getPixabayImages(query),
        // getUnsplashImages(query)
    ])).flat()
}
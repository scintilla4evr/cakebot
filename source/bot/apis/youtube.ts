import fetch from "node-fetch"

export type YTVideoDetails = {
    videoId: string,

    title: string,
    description: string,

    tags: string[],

    publishedAt: Date,

    channelName: string,
    channelId: string
}

export type YTLiveStreamDetails = {
    liveStream: boolean,

    startTime: Date,
    scheduledStartTime: Date,
    endTime: Date,

    startDelay: number,

    video: YTVideoDetails
}

export async function ytRequest(
    type: string,
    args: {
        [prop: string]: any
    }
): Promise<any> {
    let query = Object.keys(args).map(key => `&${key}=${args[key]}`).join("")
    let url = `https://www.googleapis.com/youtube/v3/${type}?key=${process.env["YT_API_KEY"]}${query}`

    let data = await fetch(url)
    
    return await data.json()
}

export function videoFromSnippet(videoId: string, snippet: any): YTVideoDetails {
    return {
        videoId,

        title: snippet.title,
        description: snippet.description,

        tags: snippet.tags,

        publishedAt: new Date(snippet.publishedAt),

        channelName: snippet.channelTitle,
        channelId: snippet.channelId
    }
}

export async function getStreamInfo(
    videoID: string
): Promise<YTLiveStreamDetails> {
    let data = await ytRequest(
        "videos",
        {
            part: "snippet,liveStreamingDetails",
            id: videoID
        }
    )

    let lsDetails = data.items[0].liveStreamingDetails

    return {
        liveStream: lsDetails ? true : false,

        startTime: (lsDetails && "actualStartTime" in lsDetails) ? new Date(lsDetails.actualStartTime) : null,
        scheduledStartTime: lsDetails ? new Date(lsDetails.scheduledStartTime) : null,
        endTime: (lsDetails && "actualEndTime" in lsDetails) ? new Date(lsDetails.actualEndTime) : null,

        startDelay: (lsDetails && "actualStartTime" in lsDetails) ? 
                    (
                        (new Date(lsDetails.actualStartTime).getTime()) - (new Date(lsDetails.scheduledStartTime).getTime())
                    ) :
                    null,

        video: videoFromSnippet(videoID, data.items[0].snippet)
    }
}
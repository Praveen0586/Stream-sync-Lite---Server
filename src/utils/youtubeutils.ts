import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY!;

export interface Video {
    video_id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    channel_id: string;
    published_at: string;
    duration_seconds: number;
}

export async function fetchLatestVideosFromYouTube(channelId: string): Promise<Video[]> {
    const searchResponse = await axios.get<{ items: any[] }>("https://www.googleapis.com/youtube/v3/search", {
        params: {
            channelId,
            part: "snippet",
            order: "date",
            maxResults: 10,
            key: YOUTUBE_API_KEY,
        },
    });

    const items = searchResponse.data.items || [];

    // Extract video IDs only
    const videoIds = items
        .filter((item: any) => item.id.kind === "youtube#video")
        .map((item: any) => item.id.videoId);

    if (videoIds.length === 0) return [];

    // 2️⃣ Fetch durations
    const detailsResponse = await axios.get<{ items: any[] }>("https://www.googleapis.com/youtube/v3/videos", {
        params: {
            id: videoIds.join(","),
            part: "contentDetails",
            key: YOUTUBE_API_KEY,
        },
    });

    const durationMap: Record<string, number> = {};

    detailsResponse.data.items.forEach((item: any) => {
        durationMap[item.id] = parseISO8601Duration(item.contentDetails.duration);
    });

    // 3️⃣ Return final cleaned data
    return items
        .filter((item: any) => item.id.kind === "youtube#video")
        .map((item: any) => ({
            video_id: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail_url: item.snippet.thumbnails.default.url,
            channel_id: channelId,
            published_at: item.snippet.publishedAt,
            duration_seconds: durationMap[item.id.videoId] || 0,
        }));
}

const parseISO8601Duration = (duration: string): number => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;

    return hours * 3600 + minutes * 60 + seconds;
};

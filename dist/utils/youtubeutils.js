"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLatestVideosFromYouTube = fetchLatestVideosFromYouTube;
const axios_1 = __importDefault(require("axios"));
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
async function fetchLatestVideosFromYouTube(channelId) {
    const searchResponse = await axios_1.default.get("https://www.googleapis.com/youtube/v3/search", {
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
        .filter((item) => item.id.kind === "youtube#video")
        .map((item) => item.id.videoId);
    if (videoIds.length === 0)
        return [];
    //  Fetch durations
    const detailsResponse = await axios_1.default.get("https://www.googleapis.com/youtube/v3/videos", {
        params: {
            id: videoIds.join(","),
            part: "contentDetails",
            key: YOUTUBE_API_KEY,
        },
    });
    const durationMap = {};
    detailsResponse.data.items.forEach((item) => {
        durationMap[item.id] = parseISO8601Duration(item.contentDetails.duration);
    });
    //  Return final cleaned data
    return items
        .filter((item) => item.id.kind === "youtube#video")
        .map((item) => ({
        video_id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail_url: item.snippet.thumbnails.high?.url,
        channel_id: channelId,
        published_at: item.snippet.publishedAt,
        duration_seconds: durationMap[item.id.videoId] || 0,
    }));
}
const parseISO8601Duration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match)
        return 0;
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
};

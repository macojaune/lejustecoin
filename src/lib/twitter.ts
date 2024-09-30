"use server";
import { TwitterApi } from "twitter-api-v2";
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY!,
  appSecret: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});

export async function sendTweet(text: string) {
  try {
    // Post the tweet
    const tweet = await client.v2.tweet(text);
    console.log("Tweet posted successfully!");
    console.log("Tweet ID:", tweet.data.id);
    console.log("Tweet text:", tweet.data.text);
  } catch (error) {
    console.error("Error posting tweet:", error);
  }
}

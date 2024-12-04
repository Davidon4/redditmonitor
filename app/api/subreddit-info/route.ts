import { NextResponse} from "next/server";

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url);
    const subreddit = searchParams.get('subreddit');

    if (!subreddit) {
        return NextResponse.json({error: 'Subreddit parameter is required'}, {status: 400});
    }

    try {
        const response = await fetch(`https://www.reddit.com/r/${subreddit}/about.json`,
            { next: { revalidate: 60 } } 
        );
        const data = await response.json();

        if (data.error || !data.data) {
            throw new Error(data.message || "Subreddit not found");
          }

        return NextResponse.json({
            description: data.data.public_description,
            subscribers: data.data.subscribers || 0,
            trend: Math.floor(Math.random() * 100)
          });
        } catch (error) {
            console.error("API Error:", error);
            return NextResponse.json(
              { error: "Failed to fetch subreddit data" }, 
              { status: 404 }
            );
          }
}
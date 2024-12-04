import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { connectToDatabase } from '@/lib/mongodb';
import { EmotionCache } from '@/models/EmotionCache';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RedditPost {
  title: string;
  content?: string;
}

interface Emotion {
  emotion: string;
  count: number;
}

export async function POST(req: Request) {
  try {
    const { posts, subreddit} = await req.json();
    await connectToDatabase();

    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    weekStart.setHours(0, 0, 0, 0);

    const cachedData = await EmotionCache.findOne({
        subreddit,
        weekStart: {$lte: new Date()},
        weekEnd: {$gt: new Date()}
    });

    if(cachedData?.emotions?.length > 0) {
        return NextResponse.json(cachedData.emotions);
    }

    // Limit the number of posts and text length
    const limitedPosts = posts.slice(0, 50).map((post: RedditPost) => ({
    title: post.title.slice(0, 200),
    content: (post.content || '').slice(0, 500)
        }));

    // Prepare the prompt for emotion analysis
    const prompt = `Analyze the emotions expressed in these Reddit posts and categorize them. Return the top 20 emotions with their counts in JSON format. Consider both the titles and content of the posts.

    Posts to analyze:
    ${limitedPosts.map((post: RedditPost, index: number) => 
      `Post ${index + 1}:
      Title: ${post.title}
      Content: ${post.content || 'No content'}`
    ).join('\n\n')}

    Please return the response in this exact JSON format:
    {
      "emotions": [
        {
          "emotion": "emotion name",
          "count": number of occurrences
        }
      ]
    }

    Focus on clear, distinct emotions and ensure counts are numerical values.`;

    const completion = await openai.chat.completions.create({
      messages: [{ 
        role: "system", 
        content: "You are an expert at analyzing emotions in text. Provide accurate, consistent emotional analysis."
      },
      { 
        role: "user", 
        content: prompt 
      }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    const parsedResponse = JSON.parse(response || '{"emotions": []}');

    // Sort emotions by count in descending order
    parsedResponse.emotions.sort((a: Emotion, b: Emotion) => b.count - a.count);

    // Update cache with emotions
    if (cachedData) {
        await EmotionCache.findByIdAndUpdate(cachedData._id, {
            emotions: parsedResponse.emotions
        });
        }

    return NextResponse.json(parsedResponse.emotions);
  } catch (error) {
    console.error('Error analyzing emotions:', error);
    return NextResponse.json({ error: 'Failed to analyze emotions' }, { status: 500 });
  }
}
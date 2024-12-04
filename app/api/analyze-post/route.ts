import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { title, content } = await request.json();

    // Use AI for emotion, sentiment, and topic analysis
    const prompt = `
      Analyze this post:
      Title: ${title}
      Content: ${content}

      Please provide:
      1. Keywords (extract 5 most relevant technical or topic-related keywords from the content)

      2. Emotion (choose one):
         Positive: joy, awe, nostalgia, inspiration, pride, love, amusement, relief, satisfaction, curiosity
         Negative: anger, outrage, fear, frustration, sadness, regret
         Mixed: surprise, empathy, schadenfreude, hope

      3. Topic Pattern Analysis (identify the type of content that engages users, choose one):
         - Learning/Tutorial: Content focused on education and skill development. Posts that teach new concepts, explain technical topics, or provide step-by-step guides. These posts help users learn and improve their skills.
         
         - Story/Experience: Personal narratives and experiences. Posts sharing journey through learning, career transitions, project development, or overcoming technical challenges. These posts connect through shared experiences.
         
         - Problem-Solving: Posts addressing specific technical issues or challenges. Content that provides solutions, workarounds, or fixes to common problems. These posts help users overcome obstacles.
         
         - Discussion/Debate: Thought-provoking topics that encourage community engagement. Posts that spark conversations about technologies, methodologies, or industry trends. These posts stimulate intellectual discourse.
         
         - News/Updates: Announcements about new technologies, updates, or industry changes. Posts keeping the community informed about latest developments. These posts help users stay current.
         
         - Resource Sharing: Posts providing valuable tools, libraries, frameworks, or learning materials. Content that shares useful resources to help others in their work or learning. These posts add value through sharing.
         
         - Career/Professional Growth: Content focused on career development, job searching, or professional skills. Posts about industry insights, job opportunities, or skill requirements. These posts help with career advancement.
         
         - Project Showcase: Demonstrations of completed projects, applications, or technical implementations. Posts sharing achievements and technical solutions. These posts inspire and demonstrate possibilities.
         
         - Question/Help: Posts seeking assistance or clarification on technical topics. Content asking for community help or expertise. These posts facilitate community support.
         
         - Tips/Best Practices: Expert advice and recommended approaches. Posts sharing professional insights, coding standards, or optimization techniques. These posts improve technical practices.

      Format as JSON with keys: keywords (array), emotion, topic_analysis
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const analysis = JSON.parse(completion.choices[0].message.content!);

    return NextResponse.json({
      keywords: analysis.keywords,
      emotion: analysis.emotion,
      engagement_pattern: {
        pattern: analysis.topic_analysis,
        description: `This post's intent and content align with patterns commonly found in the ${analysis.topic_analysis} category.` 
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze post' },
      { status: 500 }
    );
  }
}
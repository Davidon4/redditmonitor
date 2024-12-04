import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prismadb from '@/lib/prismadb';

interface SubredditData {
  id: string;
  name: string;
  description: string;
  subscribers: number;
}

export async function POST(request: Request) {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { selectedSubreddits } = await request.json() as { selectedSubreddits: SubredditData[] };

    // Update user's onboarding status
    let user = await prismadb.user.findUnique({
        where: { email: session.user.email },
        include: {
          subreddits: {
            include: {
              subreddit: true
            }
          }
        }
      });

    if (!user) {
        user = await prismadb.user.create({
            data:{
                email: session.user.email!,
                name: session.user.name ?? "",
                hasCompletedOnboarding: false,
            },
            include: {
              subreddits: {
                include: {
                  subreddit: true
                }
              }
            }
        })
    }

    for (const subredditData of selectedSubreddits) {
        try{
        const dbSubreddit = await prismadb.subreddit.upsert({
            where: {redditId: subredditData.id},
            update: {
              name: subredditData.name,
              description: subredditData.description,
              subscribers: subredditData.subscribers,
          },
          create: {
            redditId: subredditData.id,
            name: subredditData.name,
            description: subredditData.description,
            subscribers: subredditData.subscribers,
        }
        });

      await prismadb.userSubreddit.upsert({
            where: {
              userId_subredditId: {
                userId: user.id,
                subredditId: dbSubreddit.id,
              },
            },
            update: {},
            create: {
              userId: user.id,
              subredditId: dbSubreddit.id
            },
          });
        } catch (error) {
          console.error('Error processing subreddit:', subredditData, error);
          throw error;
        }
      }

        // Update user's onboarding status
        await prismadb.user.update({
            where: { id: user.id },
            data: {
              hasCompletedOnboarding: true
            },
          });

              // Verify the relationships were created
    const updatedUser = await prismadb.user.findUnique({
        where: { id: user.id },
        include: {
          subreddits: {
            include: {
              subreddit: true
            }
          }
        }
      });


      return NextResponse.json(
        { 
          success: true, 
          user: updatedUser,
        },
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          } 
        }
      );
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500,
        headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
          } 
       }
    );
  }
}
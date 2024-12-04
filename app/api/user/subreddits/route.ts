import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prismadb from '@/lib/prismadb';

export async function GET() {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const user = await prismadb.user.findUnique({
            where: { email: session.user.email },
            include: {
                subreddits: {
                    include: {
                        subreddit: true
                    }
                }
            }
        });

        return NextResponse.json({
            subreddits: user?.subreddits || []
        });
    } catch (error) {
        console.error('Error fetching user subreddits:', error);
        return NextResponse.json(
            { error: 'Failed to fetch subreddits' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const { subreddit } = await req.json();

        const user = await prismadb.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if subreddit already exists in user's list
        const existingSubreddit = await prismadb.userSubreddit.findFirst({
            where: {
                userId: user.id,
                subreddit: {
                    name: subreddit
                }
            }
        });

        if (existingSubreddit) {
            return NextResponse.json(
                { error: 'Subreddit already added' },
                { status: 400 }
            );
        }

        // Create or find subreddit and link to user
        const newUserSubreddit = await prismadb.userSubreddit.create({
            data: {
                user: {
                    connect: { id: user.id }
                },
                subreddit: {
                    connectOrCreate: {
                        where: { name: subreddit },
                        create: { 
                            redditId: subreddit, 
                            name: subreddit,
                            description: '',
                            subscribers: 0
                        }
                    }
                }
            },
            include: {
                subreddit: true
            }
        });

        return NextResponse.json(newUserSubreddit);
    } catch (error) {
        console.error('Error adding subreddit:', error);
        return NextResponse.json(
            { error: 'Failed to add subreddit' },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        const { subreddit } = await req.json();

        const user = await prismadb.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        await prismadb.userSubreddit.deleteMany({
            where: {
                userId: user.id,
                subreddit: {
                    name: subreddit
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting subreddit:', error);
        return NextResponse.json(
            { error: 'Failed to delete subreddit' },
            { status: 500 }
        );
    }
}
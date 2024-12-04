import { NextResponse } from "next/server";
import prismadb from "../../../../lib/prismadb";

export async function PATCH(request: Request) {
  try {
    const { subredditId, isTracked } = await request.json();

    const updatedSubreddit = await prismadb.subreddit.update({
      where: {
        id: subredditId
      },
      data: {
        isTracked
      }
    });

    return NextResponse.json(updatedSubreddit);
  } catch (error) {
    console.error('Failed to update tracking status:', error);
    return NextResponse.json(
      { error: 'Failed to update tracking status' },
      { status: 500 }
    );
  }
}
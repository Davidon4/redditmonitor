import { NextResponse } from 'next/server';
import { startCronJob } from '../../../scripts/cron';

export async function GET() {
  try {
    startCronJob();
    return NextResponse.json({ message: 'Cron job initialized successfully' });
  } catch (error) {
    console.error('Failed to initialize cron job:', error);
    return NextResponse.json(
      { error: 'Failed to initialize cron job' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { licenseKey } = await request.json();
    
    // Verify with Lemon Squeezy API
    const response = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ license_key: licenseKey })
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'License verification failed' }, { status: 400 });
  }
} 
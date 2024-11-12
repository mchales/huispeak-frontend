import { NextResponse } from 'next/server';

import { openai } from 'src/utils/openai';

export const runtime = 'nodejs';

// Create a new message and adds it to thread
export async function POST(request: Request, { params }: { params: { threadId: string } }) {
  console.log('threadId', params.threadId);
  const { content } = await request.json();

  const message = await openai.beta.threads.messages.create(params.threadId, {
    role: 'user',
    content,
  });

  return NextResponse.json(message, { status: 200 });
}

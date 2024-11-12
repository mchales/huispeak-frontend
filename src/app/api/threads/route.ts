import { NextResponse } from 'next/server';

import { openai } from 'src/utils/openai';

export const runtime = 'nodejs';

// Create a new thread with optional messages
export async function POST(request: Request) {
  let messages;
  try {
    const body = await request.json();
    messages = body.messages;
  } catch (error) {
    // Handle cases where the request body is empty or not valid JSON
    messages = undefined;
  }

  console.log('Messages: ', messages);

  const options = messages ? { messages } : {};
  const thread = await openai.beta.threads.create(options);

  return NextResponse.json(thread, { status: 201 });
}

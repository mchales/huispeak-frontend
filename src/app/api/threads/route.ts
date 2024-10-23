import { NextResponse } from 'next/server';

import { openai } from 'src/utils/openai';

export const runtime = 'nodejs';

// Create a new thread
export async function POST() {
  const thread = await openai.beta.threads.create();
  return NextResponse.json(thread, { status: 201 });
}

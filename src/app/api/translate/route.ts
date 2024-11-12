import { NextResponse } from 'next/server';

import { openai } from 'src/utils/openai';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.json();

  const {message} = body;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant who translates Chinese text. Given the following text ONLY return the English translation. Chinese text:.',
      },
      { role: 'user', content: message },
    ],
  });

  return NextResponse.json({ translation: response.choices[0].message.content });
}

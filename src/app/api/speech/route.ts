import { NextResponse } from 'next/server';

import { openai } from 'src/utils/openai';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const formData = await request.formData();

  const model = formData.get('model');
  const input = formData.get('input');
  const voice = formData.get('voice');
  const response_format = formData.get('response_format') || 'mp3';
  const speed = parseFloat(formData.get('speed')?.toString() || '1.0');

  if (!model || !input || !voice) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const allowedVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'] as const;
  type VoiceType = (typeof allowedVoices)[number];

  const allowedResponseFormats = ['mp3', 'opus', 'aac', 'flac', 'wav', 'pcm'] as const;
  type ResponseFormatType = (typeof allowedResponseFormats)[number];

  // Type guard functions
  function isVoiceType(value: any): value is VoiceType {
    return allowedVoices.includes(value);
  }

  function isResponseFormatType(value: any): value is ResponseFormatType {
    return allowedResponseFormats.includes(value);
  }

  if (typeof voice !== 'string' || !isVoiceType(voice)) {
    return NextResponse.json({ error: 'Invalid voice parameter' }, { status: 400 });
  }

  if (typeof response_format !== 'string' || !isResponseFormatType(response_format)) {
    return NextResponse.json({ error: 'Invalid response_format parameter' }, { status: 400 });
  }

  try {
    const mp3Response = await openai.audio.speech.create({
      model: model.toString(),
      voice,
      input: input.toString(),
      response_format,
      speed,
    });

    const arrayBuffer = await mp3Response.arrayBuffer();

    return new Response(arrayBuffer, {
      headers: {
        'Content-Type': `audio/${response_format}`,
        'Content-Disposition': `attachment; filename=generated_speech.${response_format}`,
      },
    });
  } catch (error: any) {
    console.log('Error:', error.response?.data?.error?.message || error.message);
    return NextResponse.json({ message: 'Error generating speech' }, { status: 500 });
  }
}

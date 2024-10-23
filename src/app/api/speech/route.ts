import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Get formData from request
  const formData = await request.formData();
  // FormData
  /* 
  model: string
  input: string
  voice: string
  response_format: string (optional)
  speed: number (optional)
  */

  const model = formData.get('model');
  const input = formData.get('input');
  const voice = formData.get('voice');

  if (!model || !input || !voice) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const apiKEY = process.env.OPENAI_API_KEY || formData.get('api_key');

  if (!apiKEY) {
    return NextResponse.json(
      {
        message: 'You need to set your API Key as an env variable or with the input.',
      },
      { status: 401, statusText: 'Unauthorized' }
    );
  }

  try {
    const { data } = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model,
        input,
        voice,
        response_format: formData.get('response_format') || 'mp3',
        speed: formData.get('speed') || 1.0,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKEY}`,
        },
        responseType: 'arraybuffer',
      }
    );

    return new Response(data, {
      headers: {
        'Content-Type': 'audio/mp3',
        'Content-Disposition': 'attachment; filename=generated_speech.mp3',
      },
    });
  } catch (error: any) {
    console.log('Error:', error.response?.data?.error?.message || error.message);
    return NextResponse.json({ message: 'Error generating speech' }, { status: 500 });
  }
}

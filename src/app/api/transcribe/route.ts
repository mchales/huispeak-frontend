import axios from 'axios';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Get formData from request
  const formData = await request.formData();
  // FormData
  /* 
  file: File
  model: string
  response_format: string
  propmt: string
  language: string (optional)
  */
  const file = formData.get('file');
  console.log('Received file:', file); // Log the received file to verify
  if (!file) {
    return NextResponse.json({ error: 'File not received' }, { status: 400 });
  }
  formData.append('model', 'whisper-1');
  const apiKEY = process.env.OPENAI_API_KEY || formData.get('api_key');

  if (!apiKEY) {
    return NextResponse.json(
      {
        message: 'You need to set your API Key as env varibale or with the input.',
      },
      { status: 401, statusText: 'Unauthorized' }
    );
  }

  try {
    const { data } = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        Authorization: `Bearer ${apiKEY}`,
      },
    });
    console.log(data);
    return NextResponse.json({ data });
  } catch (error: any) {
    console.log(error.response.data.error.message);
    return NextResponse.json({ message: 'Error' });
  }
}

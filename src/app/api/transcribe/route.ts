import { NextResponse } from 'next/server';

import { openai } from 'src/utils/openai';

export async function POST(request: Request) {
  // Get formData from request
  console.log('test');
  const formData = await request.formData();
  console.log(formData);

  const file = formData.get('file');
  console.log('Received file:', file);

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'File not received or invalid' }, { status: 400 });
  }

  const model = formData.get('model')?.toString() || 'whisper-1';
  const response_format = formData.get('response_format')?.toString();
  const prompt = formData.get('prompt')?.toString();
  const language = formData.get('language')?.toString() || 'zh'; // zh is chinese

  try {
    const params: any = {
      file,
      model,
      language,
    };

    if (prompt) params.prompt = prompt;
    if (response_format) params.response_format = response_format;
    if (language) params.language = language;

    // Call the transcription endpoint
    const transcription = await openai.audio.transcriptions.create(params);

    console.log('Transcription result:', transcription);

    // Return the transcription result
    return NextResponse.json({ data: transcription });
  } catch (error: any) {
    console.error(
      'Error during transcription:',
      error.response?.data?.error?.message || error.message
    );
    return NextResponse.json({ message: 'Error during transcription' }, { status: 500 });
  }
}

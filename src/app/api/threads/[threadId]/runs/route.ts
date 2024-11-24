import { NextResponse } from 'next/server';

import { openai } from 'src/utils/openai';

export const runtime = 'nodejs';

// Send a new message to a thread
export async function POST(
  request: any,
  { params: { threadId } }: { params: { threadId: string } }
) {
  let accumulatedResponse = '';
  let messageId: string | null = null;

  try {
    const { assistant_id, additional_instructions } = await request.json();

    if (!assistant_id) {
      return NextResponse.json(
        { status: 'error', message: 'assistant_id is missing' },
        { status: 400 }
      );
    }

    console.log(additional_instructions);
    const stream = await openai.beta.threads.runs.stream(threadId, {
      assistant_id,
      additional_instructions,
    });

    // Even though we could wait for this to be over, we may want to utilize streaming for
    // efficiency boosts or visuals in the future
    await new Promise((resolve, reject) => {
      stream
        .on('messageCreated', (message) => {
          messageId = message.id;
          console.log('Run ID:', messageId);
        })
        .on('textDelta', (textDelta) => {
          try {
            accumulatedResponse += textDelta.value;
          } catch (error) {
            console.error('Error processing text delta:', error);
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('Error during streaming:', error);
          reject(error);
        })
        .on('textDone', () => {
          console.log('End of stream');
          resolve('End of stream');
        });
    });

    // Return the accumulated response as a whole message
    return NextResponse.json(
      { status: 'success', message: accumulatedResponse, message_id: messageId },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error while processing:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

import { openai } from 'src/utils/openai';

// Send a new message to a thread
export async function POST(
  request: any,
  { params: { threadId } }: { params: { threadId: string } }
) {
  let accumulatedResponse = ''; // Initialize a buffer to accumulate the response

  try {
    // Extract assistant_id from the request body
    const { assistant_id } = await request.json();

    // Validate assistant_id
    if (!assistant_id) {
      return NextResponse.json(
        { status: 'error', message: 'assistant_id is missing' },
        { status: 400 }
      );
    }

    // Create a stream to the assistant
    const stream = await openai.beta.threads.runs.stream(threadId, {
      assistant_id, // Pass the assistant_id as an argument
    });

    // Accumulate the response
    await new Promise((resolve, reject) => {
      stream
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
        .on('end', () => {
          resolve('End of stream');
        });
    });

    // Return the accumulated response as a whole message
    return NextResponse.json({ status: 'success', message: accumulatedResponse }, { status: 200 });
  } catch (error) {
    console.error('Error while processing:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}

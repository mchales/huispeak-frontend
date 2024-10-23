import { openai } from 'src/utils/openai';

export const runtime = 'nodejs';

// Send a new message to a thread
export async function POST(request: any, { params: { threadId } }: { params: { threadId: any } }) {
  console.log('threadId', threadId);

  // Check if threadId exists
  if (!threadId) {
    return new Response('Error: threadId is missing', { status: 400 });
  }

  try {
    const { content, assistant_id } = await request.json();

    console.log('assistant_id', assistant_id);

    // Check if content exists
    if (!content) {
      return new Response('Error: content is missing', { status: 400 });
    }

    // Send a message to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content,
    });

    // Stream the assistant's response
    const stream = openai.beta.threads.runs.stream(threadId, {
      assistant_id, // This should be passed
    });

    return new Response(stream.toReadableStream());
  } catch (error) {
    console.error('Error occurred:', error);
    return new Response('Error processing request', { status: 500 });
  }
}

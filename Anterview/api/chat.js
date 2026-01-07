export const config = {
  runtime: 'edge', // This makes it fast and cheap on Vercel
};

export default async function handler(req) {
  // 1. Check if the method is POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // 2. Get the messages from the frontend
    const { messages } = await req.json();

    // 3. Call OpenAI securely (The key is on the server now!)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Secure Env Var
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Or gpt-3.5-turbo to save money
        messages: messages,
      }),
    });

    const data = await response.json();

    // 4. Send the answer back to the frontend
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
  }
}
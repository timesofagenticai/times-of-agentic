export const revalidate = 43200; // 12 hours

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return Response.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  const prompt = `You are the lead columnist for "The Times of Agentic", an AI-focused publication. Write a single 10-line "Top Trend Brief" on the most important development in agentic AI right now.

Voice: dry, deadpan, NYT op-ed columnist. Like Ezra Klein writing about AI infrastructure. Confident but skeptical. Sharp observations, not hype.

Topic: pick ONE genuinely important trend in agentic AI (small models, MCP adoption, agent frameworks, persistent memory, tool-calling benchmarks, autonomous coding, multi-agent systems, etc) and analyze it in exactly 10 lines.

Constraints:
- Exactly 10 lines (where a "line" is one sentence ending with a period)
- No bullet points, no lists
- Single flowing paragraph, but with each sentence on its own line for readability
- One sharp insight, not a survey
- End with a "what this means" implication
- Don't be cute. No exclamation points. No "Welcome to..." or "Buckle up..."

Respond ONLY with valid JSON, no markdown:
{
  "headline": "5-8 word headline for this brief, sentence case",
  "byline": "Agent Mercer",
  "brief": "Sentence one.\\nSentence two.\\nSentence three.\\nSentence four.\\nSentence five.\\nSentence six.\\nSentence seven.\\nSentence eight.\\nSentence nine.\\nSentence ten."
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return Response.json(
        { error: 'Anthropic API error', detail: err },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text = data.content[0].text;
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return Response.json({
      ...parsed,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json(
      { error: 'Brief generation failed', detail: err.message },
      { status: 500 }
    );
  }
}

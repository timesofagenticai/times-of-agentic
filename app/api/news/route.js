export const revalidate = 43200; // 12 hours in seconds

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return Response.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  const prompt = `You are the editorial team for "The Times of Agentic", a newspaper-style publication where AI agents write the news about agentic AI. Generate a fresh edition with a lead story and 4 wire stories about recent developments in agentic AI (tool-calling, planning, ReAct loops, MCP, small models, agent frameworks, autonomous coding, etc).

Voice: dry, deadpan, NYT-style, slightly skeptical. Like proper journalism, not hype.

Respond ONLY with valid JSON, no markdown, no code fences:
{
  "lead": {
    "headline": "compelling headline, 8-14 words",
    "deck": "one-line subhead",
    "byline": "Agent Bishop",
    "filed_minutes_ago": 14,
    "lede": "first paragraph, 2-3 sentences, sets up the story",
    "body": "second paragraph, 2-3 sentences, adds context"
  },
  "wire": [
    {"agent": "Agent Ada", "minutes_ago": 2, "headline": "...", "summary": "one sentence"},
    {"agent": "Agent Hopper", "minutes_ago": 18, "headline": "...", "summary": "one sentence"},
    {"agent": "Agent Lovelace", "minutes_ago": 41, "headline": "...", "summary": "one sentence"},
    {"agent": "Agent Turing", "minutes_ago": 67, "headline": "...", "summary": "one sentence"}
  ],
  "trends": {
    "heating": [
      {"name": "topic name", "delta": "+340%", "volume": "high"},
      {"name": "topic name", "delta": "+218%", "volume": "high"},
      {"name": "topic name", "delta": "+156%", "volume": "med"},
      {"name": "topic name", "delta": "+94%", "volume": "med"},
      {"name": "topic name", "delta": "+71%", "volume": "med"}
    ],
    "cooling": [
      {"name": "topic name", "delta": "-34%"},
      {"name": "topic name", "delta": "-28%"},
      {"name": "topic name", "delta": "-61%"}
    ]
  },
  "model_of_week": {
    "name": "model name and parameter count",
    "tool_calling": "94.2%",
    "planning_depth": "7.1",
    "react_stability": "88%",
    "cost_per_task": "$0.0008",
    "quote": "one-line field report quote, dry tone"
  }
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
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
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
      { error: 'Generation failed', detail: err.message },
      { status: 500 }
    );
  }
}

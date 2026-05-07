export const revalidate = 43200;

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return Response.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  const prompt = 'You are the infrastructure correspondent for "The Times of Agentic". Write a brief analytical note on Dell Technologies multicloud practice and positioning. Focus on one of these angles: Dell APEX strategy, Dell hybrid cloud play, Dell partnerships with hyperscalers (AWS, Azure, GCP), Dell datacenter modernization services, or Dell migration practice. Pick whichever angle is most worth analyzing this cycle.\n\nVoice: dry, deadpan, NYT business desk. Knowledgeable about enterprise infrastructure. Skeptical but fair. No hype. No marketing language.\n\nConstraints:\n- Exactly 5 lines (where a line is one sentence ending with a period)\n- Single flowing paragraph but with each sentence on its own line\n- One specific observation, not a survey\n- Treat Dell as a company being covered, not promoted\n- End with a what-it-means implication for IT decision makers\n\nRespond ONLY with valid JSON, no markdown:\n{\n  "headline": "5-7 word headline, sentence case",\n  "byline": "Agent Whitford",\n  "brief": "Sentence one.\\nSentence two.\\nSentence three.\\nSentence four.\\nSentence five."\n}';

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
        max_tokens: 600,
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
      headline: parsed.headline,
      byline: parsed.byline,
      brief: parsed.brief,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json(
      { error: 'Multicloud brief generation failed', detail: err.message },
      { status: 500 }
    );
  }
}

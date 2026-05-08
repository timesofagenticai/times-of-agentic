export const revalidate = 43200; // 12 hours

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const since = sevenDaysAgo.toISOString().split('T')[0];

    // Simpler query: Python repos with high stars pushed recently
    // We'll filter for AI relevance after fetching
    const query = 'language:Python pushed:>' + since + ' stars:>1000';
    const url = 'https://api.github.com/search/repositories?q=' + encodeURIComponent(query) + '&sort=stars&order=desc&per_page=50';

    const headers = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'TimesOfAgentic/1.0',
    };
    
    const githubToken = process.env.GITHUB_TOKEN;
    if (githubToken) {
      headers['Authorization'] = 'Bearer ' + githubToken;
    }

    const res = await fetch(url, {
      headers: headers,
      next: { revalidate: 43200 },
    });

    if (!res.ok) {
      const errText = await res.text();
      return Response.json(
        { error: 'GitHub API error', status: res.status, detail: errText, repos: [] },
        { status: 200 }
      );
    }

    const data = await res.json();
    const now = Date.now();
    
    // Filter for AI/agent relevance via name + description scan
    const aiKeywords = /\b(agent|llm|ai|gpt|claude|gemini|mcp|agentic|chatbot|copilot|rag|prompt|transformer|embedding|vector|inference|fine.?tun|chat|model|neural|deep.?learn|machine.?learn|huggingface|langchain|llama|mistral|whisper|stable.?diffusion|diffusion)/i;
    
    const repos = (data.items || [])
      .filter(function(repo) {
        const text = (repo.name + ' ' + (repo.description || '')).toLowerCase();
        return aiKeywords.test(text);
      })
      .map(function(repo) {
        const pushedAt = new Date(repo.pushed_at).getTime();
        const hoursSincePush = (now - pushedAt) / (1000 * 60 * 60);
        
        const recencyMultiplier = hoursSincePush < 24 ? 1.5 : (hoursSincePush < 72 ? 1.2 : 1.0);
        const heat = repo.stargazers_count * recencyMultiplier;
        
        let intensity = 'warm';
        if (hoursSincePush < 24 && repo.stargazers_count >= 5000) intensity = 'blazing';
        else if (hoursSincePush < 48 && repo.stargazers_count >= 3000) intensity = 'hot';
        else if (hoursSincePush < 72) intensity = 'rising';
        
        return {
          name: repo.full_name,
          description: repo.description || '',
          stars: repo.stargazers_count,
          stars_display: formatStars(repo.stargazers_count),
          language: repo.language || 'Various',
          url: repo.html_url,
          pushed_at: repo.pushed_at,
          hours_since_push: Math.round(hoursSincePush),
          heat: heat,
          intensity: intensity,
        };
      });

    repos.sort(function(a, b) { return b.heat - a.heat; });
    const top = repos.slice(0, 10);

    return Response.json({
      repos: top,
      generated_at: new Date().toISOString(),
      total_filtered: repos.length,
      total_fetched: (data.items || []).length,
    });
  } catch (err) {
    return Response.json(
      { error: 'Viral fetch failed', detail: err.message, repos: [] },
      { status: 200 }
    );
  }
}

function formatStars(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}

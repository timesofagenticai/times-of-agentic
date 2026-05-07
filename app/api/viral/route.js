export const revalidate = 43200; // 12 hours

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const since = sevenDaysAgo.toISOString().split('T')[0];

    // Broader query - searches by topic OR keywords in name/description
    // Catches repos even if they haven't tagged themselves with topics
    const query = encodeURIComponent(
      '(agent OR llm OR ai OR gpt OR claude OR gemini OR mcp OR agentic) language:Python pushed:>' + since + ' stars:>500'
    );
    
    const url = 'https://api.github.com/search/repositories?q=' + query + '&sort=stars&order=desc&per_page=20';

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
      return Response.json(
        { error: 'GitHub API error', status: res.status, repos: [] },
        { status: 200 }
      );
    }

    const data = await res.json();
    const now = Date.now();
    
    // Filter for AI/agent relevance via name + description scan
    const aiKeywords = /\b(agent|llm|ai|gpt|claude|gemini|mcp|agentic|chatbot|copilot|rag|prompt|transformer|embedding|vector|inference|fine.?tun)/i;
    
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
      query_count: data.total_count || 0,
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

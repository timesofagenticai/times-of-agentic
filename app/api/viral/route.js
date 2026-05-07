export const revalidate = 43200; // 12 hours

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const since = sevenDaysAgo.toISOString().split('T')[0];

    const query = encodeURIComponent(
      '(topic:agents OR topic:ai-agents OR topic:llm OR topic:agentic OR topic:mcp OR topic:llm-agent OR topic:autonomous-agents OR topic:ai OR topic:gpt OR topic:claude OR topic:gemini) pushed:>' + since + ' stars:>1000'
    );
    
    const url = 'https://api.github.com/search/repositories?q=' + query + '&sort=stars&order=desc&per_page=15';

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
    
    const repos = (data.items || []).map(function(repo) {
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

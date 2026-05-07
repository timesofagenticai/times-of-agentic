export const revalidate = 43200; // 12 hours

export async function GET() {
  try {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const since = date.toISOString().split('T')[0];

    const query = encodeURIComponent(
      '(topic:agents OR topic:ai-agents OR topic:llm OR topic:agentic OR topic:mcp OR topic:llm-agent OR topic:autonomous-agents) pushed:>' + since
    );
    
    const url = 'https://api.github.com/search/repositories?q=' + query + '&sort=stars&order=desc&per_page=10';

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
    
    const repos = (data.items || []).slice(0, 10).map(function(repo) {
      return {
        name: repo.full_name,
        description: repo.description || '',
        stars: repo.stargazers_count,
        stars_display: formatStars(repo.stargazers_count),
        language: repo.language || 'Various',
        url: repo.html_url,
        updated: repo.pushed_at,
        owner: repo.owner.login,
        owner_avatar: repo.owner.avatar_url,
      };
    });

    return Response.json({
      repos: repos,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json(
      { error: 'Repos fetch failed', detail: err.message, repos: [] },
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

export const revalidate = 43200; // 12 hours

// Official YouTube channel IDs for top AI labs
const AI_LABS = [
  { name: 'Anthropic', handle: '@anthropic-ai', channelId: 'UCrDwWp7EBBv4NwvScIpBDOA' },
  { name: 'OpenAI', handle: '@OpenAI', channelId: 'UCXZCJLdBC09xxGZ6gcdrc6A' },
  { name: 'Google DeepMind', handle: '@Google_DeepMind', channelId: 'UCP7jMXSY2xbc3KCAE0MHQ-A' },
  { name: 'Meta AI', handle: '@MetaAI', channelId: 'UCa3oVZW6Hcjz0XK1ZGI8mLA' },
  { name: 'Hugging Face', handle: '@HuggingFace', channelId: 'UCo_IB5145EVNcf8hw1Kku7w' },
  { name: 'Microsoft AI', handle: '@MicrosoftAI', channelId: 'UCukZK7swh4UGkWAiKMrptqA' },
  { name: 'xAI', handle: '@xAI', channelId: 'UC5l1zxUMV99Kbo0dUHt0CQQ' },
];

function parseRss(xml, labName) {
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = entryRegex.exec(xml)) !== null) {
    const entry = m[1];
    const get = (tag) => {
      const r = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
      const x = entry.match(r);
      return x ? x[1].trim() : null;
    };
    const getAttr = (tag, attr) => {
      const r = new RegExp(`<${tag}[^>]*${attr}="([^"]+)"`);
      const x = entry.match(r);
      return x ? x[1] : null;
    };

    const videoId = get('yt:videoId');
    const title = get('title');
    const published = get('published');
    const thumbnail = getAttr('media:thumbnail', 'url');

    if (videoId && title) {
      entries.push({
        id: videoId,
        title,
        published,
        thumbnail,
        lab: labName,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }
  }
  return entries;
}

async function fetchLabVideos(lab) {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${lab.channelId}`;
    const res = await fetch(rssUrl, { next: { revalidate: 43200 } });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRss(xml, lab.name).slice(0, 3); // Top 3 per lab
  } catch (err) {
    return [];
  }
}

export async function GET() {
  try {
    const allVideos = await Promise.all(AI_LABS.map(fetchLabVideos));
    const flat = allVideos.flat();
    
    // Sort by published date, most recent first
    flat.sort((a, b) => new Date(b.published) - new Date(a.published));
    
    // Take top 6 most recent across all labs
    const videos = flat.slice(0, 6);

    return Response.json({
      videos,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json(
      { error: 'Lab feed fetch failed', detail: err.message, videos: [] },
      { status: 200 }
    );
  }
}

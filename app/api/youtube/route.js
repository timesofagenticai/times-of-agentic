export const revalidate = 43200; // 12 hours

const CHANNEL_HANDLE = '@timesofagenticai';

async function resolveChannelId(handle) {
  // Fetch the channel page and extract the channelId from the HTML
  const url = `https://www.youtube.com/${handle}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    next: { revalidate: 86400 }, // cache channel ID resolution for 24h
  });
  const html = await res.text();
  const match = html.match(/"channelId":"(UC[\w-]{22})"/);
  if (match) return match[1];
  // Fallback pattern
  const fallback = html.match(/channel\/(UC[\w-]{22})/);
  return fallback ? fallback[1] : null;
}

function parseRss(xml) {
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
    const description = get('media:description');
    const views = getAttr('media:statistics', 'views');

    if (videoId) {
      entries.push({
        id: videoId,
        title,
        published,
        thumbnail,
        description: description ? description.slice(0, 200) : '',
        views: views ? parseInt(views, 10) : 0,
        url: `https://www.youtube.com/watch?v=${videoId}`,
      });
    }
  }
  return entries;
}

export async function GET() {
  try {
    const channelId = await resolveChannelId(CHANNEL_HANDLE);
    if (!channelId) {
      return Response.json(
        { error: 'Could not resolve channel ID', videos: [] },
        { status: 200 }
      );
    }

    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const res = await fetch(rssUrl, { next: { revalidate: 43200 } });
    
    if (!res.ok) {
      return Response.json(
        { error: 'RSS fetch failed', videos: [] },
        { status: 200 }
      );
    }

    const xml = await res.text();
    const videos = parseRss(xml).slice(0, 10);

    return Response.json({
      channel_id: channelId,
      handle: CHANNEL_HANDLE,
      videos,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json(
      { error: 'YouTube fetch failed', detail: err.message, videos: [] },
      { status: 200 }
    );
  }
}

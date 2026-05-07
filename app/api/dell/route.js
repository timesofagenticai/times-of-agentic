export const revalidate = 43200;

const DELL_FEEDS = [
  'https://www.dell.com/en-us/blog/feed/',
];

function parseRss(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRegex.exec(xml)) !== null) {
    const item = m[1];
    const get = function(tag) {
      const r = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>');
      const x = item.match(r);
      if (!x) return null;
      let val = x[1].trim();
      val = val.replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '');
      val = val.replace(/<[^>]+>/g, '');
      return val.trim();
    };

    const title = get('title');
    const link = get('link');
    const pubDate = get('pubDate');
    const description = get('description');
    const category = get('category');

    if (title && link) {
      const aiRelated = /\b(AI|artificial intelligence|GenAI|GPU|server|infrastructure|APEX|cloud|HPC|machine learning|LLM|inference|NVIDIA|compute)\b/i.test(title + ' ' + (description || ''));
      
      items.push({
        title,
        link,
        pubDate,
        description: description ? description.slice(0, 180) : '',
        category: category || 'Dell',
        ai_related: aiRelated,
      });
    }
  }
  return items;
}

export async function GET() {
  try {
    const allItems = [];
    
    for (let i = 0; i < DELL_FEEDS.length; i++) {
      try {
        const res = await fetch(DELL_FEEDS[i], {
          headers: { 'User-Agent': 'Mozilla/5.0 TimesOfAgentic/1.0' },
          next: { revalidate: 43200 },
        });
        if (res.ok) {
          const xml = await res.text();
          const items = parseRss(xml);
          allItems.push.apply(allItems, items);
        }
      } catch (e) {
        // continue with other feeds
      }
    }

    // Prioritize AI-related, then by date
    allItems.sort(function(a, b) {
      if (a.ai_related && !b.ai_related) return -1;
      if (!a.ai_related && b.ai_related) return 1;
      return new Date(b.pubDate) - new Date(a.pubDate);
    });

    const items = allItems.slice(0, 5);

    return Response.json({
      items,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    return Response.json(
      { error: 'Dell feed fetch failed', detail: err.message, items: [] },
      { status: 200 }
    );
  }
}

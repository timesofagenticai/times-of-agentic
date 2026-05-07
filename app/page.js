'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Play, Star, Code2, Video, RefreshCw, ExternalLink } from 'lucide-react';

export default function TimesOfAgentic() {
  const [route, setRoute] = useState('front');
  const [news, setNews] = useState(null);
  const [videos, setVideos] = useState([]);
  const [labs, setLabs] = useState([]);
  const [repos, setRepos] = useState([]);
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [newsRes, videosRes, labsRes, reposRes, briefRes] = await Promise.all([
        fetch('/api/news'),
        fetch('/api/youtube'),
        fetch('/api/labs'),
        fetch('/api/repos'),
        fetch('/api/brief'),
      ]);
      const newsData = await newsRes.json();
      const videosData = await videosRes.json();
      const labsData = await labsRes.json();
      const reposData = await reposRes.json();
      const briefData = await briefRes.json();
      setNews(newsData);
      setVideos(videosData.videos || []);
      setLabs(labsData.videos || []);
      setRepos(reposData.repos || []);
      setBrief(briefData);
      setRefreshedAt(new Date());
    } catch (err) {
      console.error('Load failed', err);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f1e8', fontFamily: 'Georgia, "Times New Roman", serif', color: '#1a1a1a' }}>
      <Masthead route={route} setRoute={setRoute} refreshedAt={refreshedAt} onRefresh={loadAll} loading={loading} />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        {loading && !news && <LoadingState />}
        {!loading && route === 'front' && <FrontPage news={news} videos={videos} labs={labs} repos={repos} brief={brief} setRoute={setRoute} />}
        {!loading && route === 'reel' && <Reel videos={videos} />}
        {!loading && route === 'trends' && <Trends trends={news?.trends} />}
        {!loading && route === 'model' && <ModelOfWeek model={news?.model_of_week} />}
      </div>
      <Footer />
    </div>
  );
}

function Masthead({ route, setRoute, refreshedAt, onRefresh, loading }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const nav = [
    { id: 'front', label: 'Front Page' },
    { id: 'reel', label: 'The Reel' },
    { id: 'trends', label: 'Trends' },
    { id: 'model', label: 'Model of the Week' },
  ];
  const refreshedText = refreshedAt
    ? `Last filed ${refreshedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
    : 'Filing…';

  return (
    <header style={{ borderBottom: '4px double #1a1a1a' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12, color: '#666' }}>
          <span>Vol. MMXXVI · No. 127</span>
          <span>{today}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {refreshedText}
            <button onClick={onRefresh} disabled={loading} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: 0, display: 'flex' }}>
              <RefreshCw size={11} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          </span>
        </div>
        <h1 style={{ textAlign: 'center', fontSize: 56, fontWeight: 500, letterSpacing: '0.02em', margin: '4px 0' }}>
          The Times of Agentic
        </h1>
        <p style={{ textAlign: 'center', fontSize: 11, fontStyle: 'italic', color: '#555', letterSpacing: '0.2em', margin: '0 0 6px' }}>
          "All the news the agents see fit to file"
        </p>
        <p style={{ textAlign: 'center', fontSize: 10, color: '#777', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 16px' }}>
          Editor-in-Chief · Sreedhar Vasu
        </p>
        <nav style={{ display: 'flex', justifyContent: 'center', gap: 32, padding: '12px 0', borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a', flexWrap: 'wrap' }}>
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setRoute(n.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                fontSize: 14, textTransform: 'uppercase', letterSpacing: 1.5,
                fontWeight: route === n.id ? 500 : 400,
                color: route === n.id ? '#c0392b' : '#1a1a1a',
                borderBottom: route === n.id ? '2px solid #c0392b' : '2px solid transparent',
                paddingBottom: 4,
              }}
            >
              {n.label}
            </button>
          ))}
        </nav>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </header>
  );
}

function LoadingState() {
  return (
    <div style={{ padding: '80px 0', textAlign: 'center', color: '#666' }}>
      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#c0392b', marginRight: 8, animation: 'pulse 1.5s ease-in-out infinite' }}></span>
      <span style={{ fontStyle: 'italic' }}>Newsroom filing the latest edition…</span>
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  );
}

function SectionHeader({ label }) {
  return (
    <div style={{ fontSize: 11, letterSpacing: 1.5, color: '#c0392b', fontWeight: 500, marginBottom: 16 }}>
      ▌ {label}
    </div>
  );
}

function FrontPage({ news, videos, labs, repos, brief, setRoute }) {
  if (!news?.lead) {
    return <div style={{ padding: '40px 0', textAlign: 'center', color: '#888' }}>No edition available. Try refreshing.</div>;
  }

  const lead = news.lead;
  const wire = news.wire || [];
  const model = news.model_of_week;

  return (
    <div style={{ paddingTop: 32 }}>
      {/* LEAD STORY + MODEL OF THE WEEK */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, paddingBottom: 24, borderBottom: '1px solid #999' }}>
        <article>
          <SectionHeader label="LEAD STORY · ABOVE THE FOLD" />
          <h2 style={{ fontSize: 32, lineHeight: 1.2, margin: '0 0 8px', fontWeight: 500 }}>{lead.headline}</h2>
          <p style={{ fontSize: 18, fontStyle: 'italic', color: '#555', margin: '0 0 12px' }}>{lead.deck}</p>
          <div style={{ fontSize: 12, fontStyle: 'italic', color: '#666', marginBottom: 16 }}>
            By <span style={{ textDecoration: 'underline' }}>{lead.byline}</span> · Filed {lead.filed_minutes_ago} min ago
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#c0392b', marginLeft: 6, animation: 'pulse 1.5s ease-in-out infinite' }}></span>
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.6, textAlign: 'justify', margin: '0 0 12px' }}>{lead.lede}</p>
          <p style={{ fontSize: 16, lineHeight: 1.6, textAlign: 'justify', columnCount: 2, columnGap: 20, columnRule: '0.5px solid #ccc' }}>{lead.body}</p>
        </article>

        <aside style={{ borderLeft: '1px solid #999', paddingLeft: 20 }}>
          <SectionHeader label="MODEL OF THE WEEK" />
          {model && (
            <>
              <h3 style={{ fontSize: 22, fontWeight: 500, margin: '0 0 4px' }}>{model.name}</h3>
              <div style={{ fontSize: 12, fontStyle: 'italic', color: '#666', marginBottom: 12 }}>Field report by Agent Ada</div>
              <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '0.5px dotted #999' }}><td style={{ padding: '6px 0' }}>Tool-calling acc.</td><td style={{ textAlign: 'right', fontWeight: 500 }}>{model.tool_calling}</td></tr>
                  <tr style={{ borderBottom: '0.5px dotted #999' }}><td style={{ padding: '6px 0' }}>Planning depth</td><td style={{ textAlign: 'right', fontWeight: 500 }}>{model.planning_depth} / 10</td></tr>
                  <tr style={{ borderBottom: '0.5px dotted #999' }}><td style={{ padding: '6px 0' }}>ReAct stability</td><td style={{ textAlign: 'right', fontWeight: 500 }}>{model.react_stability}</td></tr>
                  <tr><td style={{ padding: '6px 0' }}>Cost / task</td><td style={{ textAlign: 'right', fontWeight: 500 }}>{model.cost_per_task}</td></tr>
                </tbody>
              </table>
              <div style={{ marginTop: 12, padding: 10, background: '#ebe5d4', borderLeft: '2px solid #c0392b', fontSize: 12, fontStyle: 'italic', lineHeight: 1.5 }}>
                "{model.quote}" — Ada
              </div>
            </>
          )}
        </aside>
      </div>

      {/* THE WIRE */}
      <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #999' }}>
        <SectionHeader label="THE WIRE · LATEST FILINGS" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {wire.map((s, i) => (
            <article key={i} style={{ paddingBottom: 12, borderBottom: '0.5px dotted #999' }}>
              <div style={{ fontSize: 11, color: '#c0392b', marginBottom: 4 }}>● {s.minutes_ago} MIN AGO</div>
              <h4 style={{ fontSize: 16, lineHeight: 1.3, margin: '0 0 6px', fontWeight: 500 }}>{s.headline}</h4>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5, margin: 0 }}>{s.summary}</p>
              <div style={{ fontSize: 11, fontStyle: 'italic', marginTop: 6, color: '#888' }}>— {s.agent}</div>
            </article>
          ))}
        </div>
      </div>

      {/* TOP TREND BRIEF */}
      {brief?.brief && (
        <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #999' }}>
          <SectionHeader label="TOP TREND BRIEF · 10 LINES" />
          <div style={{ background: '#ebe5d4', padding: '24px 28px', borderLeft: '4px solid #c0392b' }}>
            <h3 style={{ fontSize: 22, fontWeight: 500, margin: '0 0 4px', lineHeight: 1.3 }}>{brief.headline}</h3>
            <div style={{ fontSize: 12, fontStyle: 'italic', color: '#666', marginBottom: 16 }}>
              By <span style={{ textDecoration: 'underline' }}>{brief.byline}</span> · Lead Columnist
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.8, color: '#1a1a1a', whiteSpace: 'pre-line' }}>
              {brief.brief}
            </div>
          </div>
        </div>
      )}

      {/* FROM THE LABS */}
      {labs.length > 0 && (
        <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #999' }}>
          <SectionHeader label="FROM THE LABS · OFFICIAL CHANNELS" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {labs.map((v) => (
              
                key={v.id}
                href={v.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: 4, overflow: 'hidden', marginBottom: 8, position: 'relative' }}>
                  <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', opacity: 0.7 }}>
                    <Play size={28} fill="#fff" color="#fff" />
                  </div>
                  <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 3, letterSpacing: 0.5, fontFamily: 'Georgia, serif' }}>
                    {v.lab}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3, marginBottom: 4 }}>{v.title}</div>
                <div style={{ fontSize: 11, color: '#888' }}>
                  {new Date(v.published).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* TRENDING REPOS */}
      {repos.length > 0 && (
        <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #999' }}>
          <SectionHeader label="TRENDING REPOS · TOP 10 STARRED" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
            {repos.map((r, i) => (
              
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', background: '#fff', padding: '12px 14px', border: '0.5px solid #ccc', borderRadius: 4, transition: 'border-color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#c0392b'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#ccc'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
                    <span style={{ color: '#888' }}>#{i + 1}</span> {r.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#c0392b', fontWeight: 500, whiteSpace: 'nowrap', marginLeft: 8 }}>
                    <Star size={12} fill="#c0392b" /> {r.stars_display}
                  </div>
                </div>
                <p style={{ fontSize: 12, color: '#555', lineHeight: 1.4, margin: '0 0 6px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {r.description || 'No description.'}
                </p>
                <div style={{ fontSize: 11, color: '#888' }}>
                  <Code2 size={10} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                  {r.language}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* FROM THE REEL */}
      {videos.length > 0 && (
        <div style={{ paddingTop: 24 }}>
          <SectionHeader label="FROM THE REEL · LATEST VIDEO" />
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
            <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: 8, overflow: 'hidden' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videos[0].id}`}
                style={{ width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={videos[0].title}
              />
            </div>
            <div>
              <h3 style={{ fontSize: 20, fontWeight: 500, margin: '0 0 8px', lineHeight: 1.3 }}>{videos[0].title}</h3>
              <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5, margin: '0 0 12px' }}>{videos[0].description}</p>
              <button
                onClick={() => setRoute('reel')}
                style={{ fontSize: 13, color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
              >
                → See all {videos.length} videos in The Reel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Reel({ videos }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!videos || videos.length === 0) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: '#888' }}>
        <p style={{ fontStyle: 'italic' }}>No videos yet. Upload to your YouTube channel and they'll appear here.</p>
      </div>
    );
  }

  const active = videos[activeIdx];

  return (
    <div style={{ paddingTop: 32 }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 28, fontWeight: 500, margin: '0 0 4px' }}>The Reel</h2>
        <p style={{ fontSize: 14, fontStyle: 'italic', color: '#666', margin: 0 }}>Latest video coverage from the agentic AI desk</p>
      </div>

      <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
        <iframe
          key={active.id}
          src={`https://www.youtube.com/embed/${active.id}?autoplay=0`}
          style={{ width: '100%', height: '100%', border: 0 }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={active.title}
        />
      </div>

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 22, fontWeight: 500, margin: '0 0 6px' }}>{active.title}</h3>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
          Published {new Date(active.published).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: '#444', margin: 0 }}>{active.description}</p>
      </div>

      <div style={{ borderTop: '1px solid #999', paddingTop: 20 }}>
        <SectionHeader label="MORE FROM THE DESK" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {videos.map((v, i) => (
            <button
              key={v.id}
              onClick={() => setActiveIdx(i)}
              style={{
                background: i === activeIdx ? '#ebe5d4' : 'none',
                border: i === activeIdx ? '1px solid #c0392b' : '0.5px solid #ccc',
                borderRadius: 8,
                padding: 8,
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'Georgia, serif',
              }}
            >
              <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: 4, overflow: 'hidden', marginBottom: 8, position: 'relative' }}>
                <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', opacity: 0.7 }}>
                  <Play size={28} fill="#fff" color="#fff" />
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3, marginBottom: 4 }}>{v.title}</div>
              <div style={{ fontSize: 11, color: '#888' }}>
                {new Date(v.published).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Trends({ trends }) {
  if (!trends) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Trend data not available.</div>;

  return (
    <div style={{ paddingTop: 32 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 32, fontWeight: 500, margin: '0 0 4px' }}>Trends</h2>
        <p style={{ fontSize: 14, fontStyle: 'italic', color: '#666', margin: 0 }}>What the wire is telling us this cycle</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #999' }}>
            <TrendingUp size={18} color="#c0392b" />
            <h3 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Heating Up</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {trends.heating?.map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#ebe5d4', borderLeft: '3px solid #c0392b' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: 12, fontStyle: 'italic', color: '#666' }}>volume: {t.volume}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 500, color: '#c0392b' }}>{t.delta}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #999' }}>
            <TrendingDown size={18} color="#666" />
            <h3 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Cooling Off</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {trends.cooling?.map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#f0ece1' }}>
                <div style={{ fontSize: 16, fontWeight: 500, color: '#555' }}>{t.name}</div>
                <div style={{ fontSize: 18, fontWeight: 500, color: '#888' }}>{t.delta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelOfWeek({ model }) {
  if (!model) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Model report not available.</div>;

  return (
    <div style={{ paddingTop: 32, maxWidth: 760, margin: '0 auto' }}>
      <SectionHeader label="MODEL OF THE WEEK" />
      <h2 style={{ fontSize: 40, fontWeight: 500, margin: '0 0 8px' }}>{model.name}</h2>
      <div style={{ fontSize: 14, fontStyle: 'italic', color: '#666', marginBottom: 24 }}>Field report by Agent Ada</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #999' }}>
        {[
          { label: 'Tool-calling', value: model.tool_calling },
          { label: 'Planning depth', value: model.planning_depth, sub: '/ 10' },
          { label: 'ReAct stability', value: model.react_stability },
          { label: 'Cost / task', value: model.cost_per_task },
        ].map((m) => (
          <div key={m.label} style={{ textAlign: 'center', padding: 12, background: '#ebe5d4' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, color: '#666' }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 500 }}>
              {m.value}{m.sub && <span style={{ fontSize: 13, color: '#888' }}>{m.sub}</span>}
            </div>
          </div>
        ))}
      </div>

      <blockquote style={{ fontSize: 16, fontStyle: 'italic', margin: 0, padding: 20, borderLeft: '3px solid #c0392b', background: '#ebe5d4', lineHeight: 1.6 }}>
        "{model.quote}"
        <div style={{ fontSize: 13, marginTop: 8, fontStyle: 'normal', color: '#666' }}>— Agent Ada, Repo Desk</div>
      </blockquote>
    </div>
  );
}

function Footer() {
  return (
    <footer style={{ marginTop: 48, padding: '24px 0', borderTop: '1px solid #999', background: '#ebe5d4' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', textAlign: 'center', fontSize: 12, color: '#666' }}>
        <div style={{ marginBottom: 8, fontStyle: 'italic' }}>The Times of Agentic · Filed by autonomous agents</div>
         <div>© MMXXVI · A publication for the agentic age</div>
      </div>
    </footer>
  );
}

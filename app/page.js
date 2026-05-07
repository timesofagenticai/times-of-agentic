'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Play, Star, Code2, RefreshCw, Cloud, Server, ExternalLink, Flame } from 'lucide-react';

function openUrl(url) {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

const STYLES = `
  body, html { margin: 0; padding: 0; }
  
  .toa-page {
    min-height: 100vh;
    background: #f5f1e8;
    font-family: Georgia, "Times New Roman", serif;
    color: #1a1a1a;
  }
  
  .toa-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px 80px;
  }
  
  .toa-masthead-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px 24px 0;
  }
  
  .toa-meta {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 12px;
    color: #666;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .toa-title {
    text-align: center;
    font-size: 56px;
    font-weight: 500;
    letter-spacing: 0.02em;
    margin: 4px 0;
  }
  
  .toa-tagline {
    text-align: center;
    font-size: 11px;
    font-style: italic;
    color: #555;
    letter-spacing: 0.2em;
    margin: 0 0 6px;
  }
  
  .toa-editor {
    text-align: center;
    font-size: 10px;
    color: #777;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin: 0 0 16px;
  }
  
  .toa-nav {
    display: flex;
    justify-content: center;
    gap: 32px;
    padding: 12px 0;
    border-top: 1px solid #1a1a1a;
    border-bottom: 1px solid #1a1a1a;
    flex-wrap: wrap;
  }
  
  .toa-nav button {
    background: none;
    border: none;
    cursor: pointer;
    font-family: Georgia, serif;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    padding-bottom: 4px;
  }
  
  .toa-front-grid {
    padding-top: 32px;
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 32px;
    align-items: start;
  }
  
  .toa-aside-sticky {
    position: sticky;
    top: 24px;
    align-self: start;
  }
  
  .toa-lead-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #999;
  }
  
  .toa-lead-aside {
    border-left: 1px solid #999;
    padding-left: 16px;
  }
  
  .toa-wire-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .toa-labs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px;
  }
  
  .toa-repos-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 10px;
  }
  
  .toa-reel-row {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 20px;
  }
  
  .toa-headline {
    font-size: 28px;
    line-height: 1.2;
    margin: 0 0 8px;
    font-weight: 500;
  }
  
  .toa-deck {
    font-size: 16px;
    font-style: italic;
    color: #555;
    margin: 0 0 12px;
  }
  
  .toa-body {
    font-size: 15px;
    line-height: 1.6;
    text-align: justify;
    margin: 0 0 12px;
  }
  
  /* Tablets */
  @media (max-width: 1024px) {
    .toa-front-grid {
      grid-template-columns: 1fr;
    }
    .toa-aside-sticky {
      position: static;
    }
  }
  
  /* Phones */
  @media (max-width: 720px) {
    .toa-container {
      padding: 0 16px 60px;
    }
    .toa-masthead-inner {
      padding: 16px 16px 0;
    }
    .toa-title {
      font-size: 36px;
    }
    .toa-tagline {
      letter-spacing: 0.1em;
    }
    .toa-nav {
      gap: 16px;
      padding: 10px 0;
    }
    .toa-nav button {
      font-size: 11px;
      letter-spacing: 1px;
    }
    .toa-meta {
      font-size: 9px;
      letter-spacing: 1px;
    }
    .toa-lead-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    .toa-lead-aside {
      border-left: none;
      padding-left: 0;
      border-top: 1px solid #999;
      padding-top: 16px;
    }
    .toa-headline {
      font-size: 24px;
    }
    .toa-deck {
      font-size: 15px;
    }
    .toa-body {
      font-size: 14px;
      text-align: left;
    }
    .toa-reel-row {
      grid-template-columns: 1fr;
    }
    .toa-repos-grid {
      grid-template-columns: 1fr;
    }
  }
  
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
`;

export default function TimesOfAgentic() {
  const [route, setRoute] = useState('front');
  const [news, setNews] = useState(null);
  const [videos, setVideos] = useState([]);
  const [labs, setLabs] = useState([]);
  const [repos, setRepos] = useState([]);
  const [brief, setBrief] = useState(null);
  const [dell, setDell] = useState([]);
  const [multicloud, setMulticloud] = useState(null);
  const [viral, setViral] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshedAt, setRefreshedAt] = useState(null);

  useEffect(function() {
    loadAll();
  }, []);

  function loadAll() {
    setLoading(true);
    Promise.all([
      fetch('/api/news').then(function(r) { return r.json(); }).catch(function() { return null; }),
      fetch('/api/youtube').then(function(r) { return r.json(); }).catch(function() { return { videos: [] }; }),
      fetch('/api/labs').then(function(r) { return r.json(); }).catch(function() { return { videos: [] }; }),
      fetch('/api/repos').then(function(r) { return r.json(); }).catch(function() { return { repos: [] }; }),
      fetch('/api/brief').then(function(r) { return r.json(); }).catch(function() { return null; }),
      fetch('/api/dell').then(function(r) { return r.json(); }).catch(function() { return { items: [] }; }),
      fetch('/api/multicloud').then(function(r) { return r.json(); }).catch(function() { return null; }),
      fetch('/api/viral').then(function(r) { return r.json(); }).catch(function() { return { repos: [] }; }),
    ]).then(function(results) {
      setNews(results[0]);
      setVideos((results[1] && results[1].videos) || []);
      setLabs((results[2] && results[2].videos) || []);
      setRepos((results[3] && results[3].repos) || []);
      setBrief(results[4]);
      setDell((results[5] && results[5].items) || []);
      setMulticloud(results[6]);
      setViral((results[7] && results[7].repos) || []);
      setRefreshedAt(new Date());
      setLoading(false);
    });
  }

  return (
    <div className="toa-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      <Masthead route={route} setRoute={setRoute} refreshedAt={refreshedAt} onRefresh={loadAll} loading={loading} />
      <div className="toa-container">
        {loading && !news && <LoadingState />}
        {!loading && route === 'front' && (
          <FrontPage
            news={news}
            videos={videos}
            labs={labs}
            repos={repos}
            brief={brief}
            dell={dell}
            multicloud={multicloud}
            setRoute={setRoute}
          />
        )}
        {!loading && route === 'reel' && <Reel videos={videos} />}
        {!loading && route === 'trends' && <Trends trends={news && news.trends} viral={viral} />}
        {!loading && route === 'model' && <ModelOfWeek model={news && news.model_of_week} />}
      </div>
      <Footer />
    </div>
  );
}

function Masthead(props) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const nav = [
    { id: 'front', label: 'Front Page' },
    { id: 'reel', label: 'The Reel' },
    { id: 'trends', label: 'Trends' },
    { id: 'model', label: 'Model of the Week' },
  ];
  const refreshedText = props.refreshedAt
    ? 'Last filed ' + props.refreshedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : 'Filing...';

  return (
    <header style={{ borderBottom: '4px double #1a1a1a' }}>
      <div className="toa-masthead-inner">
        <div className="toa-meta">
          <span>Vol. MMXXVI</span>
          <span>{today}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {refreshedText}
            <button
              onClick={props.onRefresh}
              disabled={props.loading}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: 0, display: 'flex' }}
            >
              <RefreshCw size={11} style={{ animation: props.loading ? 'spin 1s linear infinite' : 'none' }} />
            </button>
          </span>
        </div>
        <h1 className="toa-title">The Times of Agentic</h1>
        <p className="toa-tagline">"All the news the agents see fit to file"</p>
        <p className="toa-editor">Editor-in-Chief - Sreedhar Vasu</p>
        <nav className="toa-nav">
          {nav.map(function(n) {
            return (
              <button
                key={n.id}
                onClick={function() { props.setRoute(n.id); }}
                style={{
                  fontWeight: props.route === n.id ? 500 : 400,
                  color: props.route === n.id ? '#c0392b' : '#1a1a1a',
                  borderBottom: props.route === n.id ? '2px solid #c0392b' : '2px solid transparent',
                }}
              >
                {n.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function LoadingState() {
  return (
    <div style={{ padding: '80px 0', textAlign: 'center', color: '#666' }}>
      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#c0392b', marginRight: 8, animation: 'pulse 1.5s ease-in-out infinite' }}></span>
      <span style={{ fontStyle: 'italic' }}>Newsroom filing the latest edition...</span>
    </div>
  );
}

function SectionHeader(props) {
  return (
    <div style={{ fontSize: 11, letterSpacing: 1.5, color: '#c0392b', fontWeight: 500, marginBottom: 16 }}>
      {'\u258C '}{props.label}
    </div>
  );
}

function InlineVideoCard(props) {
  const [playing, setPlaying] = useState(false);
  const v = props.video;
  
  if (playing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
          <iframe
            src={'https://www.youtube.com/embed/' + v.id + '?autoplay=1'}
            style={{ width: '100%', height: '100%', border: 0 }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={v.title}
          />
        </div>
        <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3, marginBottom: 4, color: '#1a1a1a' }}>{v.title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#888' }}>
            {props.label} - {new Date(v.published).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <button
            onClick={function() { setPlaying(false); }}
            style={{ fontSize: 10, color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Georgia, serif' }}
          >
            close
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={function() { setPlaying(true); }}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'Georgia, serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: 4, overflow: 'hidden', marginBottom: 8, position: 'relative' }}>
        <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
          <div style={{ background: 'rgba(0,0,0,0.7)', borderRadius: '50%', padding: 12, display: 'flex' }}>
            <Play size={20} fill="#fff" color="#fff" />
          </div>
        </div>
        {props.label && (
          <div style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: 10, padding: '2px 6px', borderRadius: 3, letterSpacing: 0.5, fontFamily: 'Georgia, serif' }}>
            {props.label}
          </div>
        )}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3, marginBottom: 4, color: '#1a1a1a' }}>{v.title}</div>
      <div style={{ fontSize: 10, color: '#888' }}>
        {new Date(v.published).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </div>
    </button>
  );
}

function FrontPage(props) {
  const news = props.news;
  if (!news || !news.lead) {
    return <div style={{ padding: '40px 0', textAlign: 'center', color: '#888' }}>No edition available. Try refreshing.</div>;
  }

  return (
    <div className="toa-front-grid">
      <main>
        <MainColumn {...props} />
      </main>
      <aside className="toa-aside-sticky">
        <DellSidebar dell={props.dell} multicloud={props.multicloud} />
      </aside>
    </div>
  );
}

function MainColumn(props) {
  const news = props.news;
  const lead = news.lead;
  const wire = news.wire || [];
  const model = news.model_of_week;
  const brief = props.brief;
  const labs = props.labs || [];
  const repos = props.repos || [];
  const videos = props.videos || [];

  return (
    <div>
      <div className="toa-lead-grid">
        <article>
          <SectionHeader label="LEAD STORY - ABOVE THE FOLD" />
          <h2 className="toa-headline">{lead.headline}</h2>
          <p className="toa-deck">{lead.deck}</p>
          <div style={{ fontSize: 12, fontStyle: 'italic', color: '#666', marginBottom: 16 }}>
            By <span style={{ textDecoration: 'underline' }}>{lead.byline}</span> - Filed {lead.filed_minutes_ago} min ago
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#c0392b', marginLeft: 6, animation: 'pulse 1.5s ease-in-out infinite' }}></span>
          </div>
          <p className="toa-body">{lead.lede}</p>
          <p className="toa-body">{lead.body}</p>
        </article>

        <aside className="toa-lead-aside">
          <SectionHeader label="MODEL OF THE WEEK" />
          {model && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 500, margin: '0 0 4px' }}>{model.name}</h3>
              <div style={{ fontSize: 11, fontStyle: 'italic', color: '#666', marginBottom: 10 }}>Field report by Agent Ada</div>
              <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '0.5px dotted #999' }}><td style={{ padding: '5px 0' }}>Tool-calling</td><td style={{ textAlign: 'right', fontWeight: 500 }}>{model.tool_calling}</td></tr>
                  <tr style={{ borderBottom: '0.5px dotted #999' }}><td style={{ padding: '5px 0' }}>Planning</td><td style={{ textAlign: 'right', fontWeight: 500 }}>{model.planning_depth} / 10</td></tr>
                  <tr style={{ borderBottom: '0.5px dotted #999' }}><td style={{ padding: '5px 0' }}>ReAct</td><td style={{ textAlign: 'right', fontWeight: 500 }}>{model.react_stability}</td></tr>
                  <tr><td style={{ padding: '5px 0' }}>Cost / task</td><td style={{ textAlign: 'right', fontWeight: 500 }}>{model.cost_per_task}</td></tr>
                </tbody>
              </table>
              <div style={{ marginTop: 10, padding: 10, background: '#ebe5d4', borderLeft: '2px solid #c0392b', fontSize: 11, fontStyle: 'italic', lineHeight: 1.5 }}>
                "{model.quote}"
              </div>
            </div>
          )}
        </aside>
      </div>

      <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #999' }}>
        <SectionHeader label="THE WIRE - LATEST FILINGS" />
        <div className="toa-wire-grid">
          {wire.map(function(s, i) {
            return (
              <article key={i} style={{ paddingBottom: 12, borderBottom: '0.5px dotted #999' }}>
                <div style={{ fontSize: 11, color: '#c0392b', marginBottom: 4 }}>{'\u25CF '}{s.minutes_ago} MIN AGO</div>
                <h4 style={{ fontSize: 15, lineHeight: 1.3, margin: '0 0 6px', fontWeight: 500 }}>{s.headline}</h4>
                <p style={{ fontSize: 13, color: '#555', lineHeight: 1.5, margin: 0 }}>{s.summary}</p>
                <div style={{ fontSize: 11, fontStyle: 'italic', marginTop: 6, color: '#888' }}>- {s.agent}</div>
              </article>
            );
          })}
        </div>
      </div>

      {brief && brief.brief && (
        <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #999' }}>
          <SectionHeader label="TOP TREND BRIEF - 10 LINES" />
          <div style={{ background: '#ebe5d4', padding: '24px 28px', borderLeft: '4px solid #c0392b' }}>
            <h3 style={{ fontSize: 22, fontWeight: 500, margin: '0 0 4px', lineHeight: 1.3 }}>{brief.headline}</h3>
            <div style={{ fontSize: 12, fontStyle: 'italic', color: '#666', marginBottom: 16 }}>
              By <span style={{ textDecoration: 'underline' }}>{brief.byline}</span> - Lead Columnist
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: '#1a1a1a', whiteSpace: 'pre-line' }}>
              {brief.brief}
            </div>
          </div>
        </div>
      )}

      {labs.length > 0 && (
        <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #999' }}>
          <SectionHeader label="FROM THE LABS - OFFICIAL CHANNELS" />
          <div className="toa-labs-grid">
            {labs.map(function(v) {
              return <InlineVideoCard key={v.id} video={v} label={v.lab} />;
            })}
          </div>
        </div>
      )}

      {repos.length > 0 && (
        <div style={{ paddingTop: 24, paddingBottom: 24, borderBottom: '1px solid #999' }}>
          <SectionHeader label="TRENDING REPOS - TOP 10 STARRED" />
          <div className="toa-repos-grid">
            {repos.map(function(r, i) {
              return (
                <button
                  key={r.name}
                  onClick={function() { openUrl(r.url); }}
                  style={{
                    background: '#fff',
                    padding: '10px 12px',
                    border: '0.5px solid #ccc',
                    borderRadius: 4,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>
                      <span style={{ color: '#888' }}>#{i + 1}</span> {r.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#c0392b', fontWeight: 500, whiteSpace: 'nowrap', marginLeft: 8 }}>
                      <Star size={11} fill="#c0392b" /> {r.stars_display}
                    </div>
                  </div>
                  <p style={{ fontSize: 11, color: '#555', lineHeight: 1.4, margin: '0 0 6px' }}>
                    {r.description || 'No description.'}
                  </p>
                  <div style={{ fontSize: 10, color: '#888' }}>
                    <Code2 size={10} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                    {r.language}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {videos.length > 0 && (
        <div style={{ paddingTop: 24 }}>
          <SectionHeader label="FROM THE REEL - LATEST VIDEO" />
          <div className="toa-reel-row">
            <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: 8, overflow: 'hidden' }}>
              <iframe
                src={'https://www.youtube.com/embed/' + videos[0].id}
                style={{ width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={videos[0].title}
              />
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 500, margin: '0 0 8px', lineHeight: 1.3 }}>{videos[0].title}</h3>
              <p style={{ fontSize: 13, color: '#555', lineHeight: 1.5, margin: '0 0 12px' }}>{videos[0].description}</p>
              <button
                onClick={function() { props.setRoute('reel'); }}
                style={{ fontSize: 13, color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Georgia, serif', fontStyle: 'italic', padding: 0 }}
              >
                See all {videos.length} videos in The Reel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DellSidebar(props) {
  return (
    <div style={{ background: '#1a1a1a', color: '#f5f1e8', padding: 18, borderRadius: 4 }}>
      <div style={{ fontSize: 10, letterSpacing: 1.5, color: '#c0392b', fontWeight: 500, marginBottom: 4, textTransform: 'uppercase' }}>
        {'\u258C '}DELL DESK
      </div>
      <div style={{ fontSize: 11, color: '#888', fontStyle: 'italic', marginBottom: 18, paddingBottom: 10, borderBottom: '0.5px solid #444' }}>
        Infrastructure correspondent
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 11, letterSpacing: 1, color: '#f5f1e8', fontWeight: 500 }}>
          <Server size={12} /> ON THE WIRE
        </div>
        {props.dell && props.dell.length > 0 ? (
          <div>
            {props.dell.slice(0, 5).map(function(item, i) {
              return (
                <button
                  key={i}
                  onClick={function() { openUrl(item.link); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '8px 0',
                    borderBottom: i < props.dell.length - 1 ? '0.5px dotted #444' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    color: '#f5f1e8',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.3, marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 10, color: '#888' }}>
                    {item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div style={{ fontSize: 11, color: '#888', fontStyle: 'italic' }}>Wire is quiet.</div>
        )}
      </div>

      {props.multicloud && props.multicloud.brief && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, fontSize: 11, letterSpacing: 1, color: '#f5f1e8', fontWeight: 500 }}>
            <Cloud size={12} /> MULTICLOUD BRIEF
          </div>
          <div style={{ background: '#2a2a2a', padding: '14px 16px', borderLeft: '2px solid #c0392b' }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, lineHeight: 1.3 }}>{props.multicloud.headline}</div>
            <div style={{ fontSize: 10, color: '#888', fontStyle: 'italic', marginBottom: 10 }}>By {props.multicloud.byline}</div>
            <div style={{ fontSize: 12, lineHeight: 1.7, whiteSpace: 'pre-line', color: '#ddd' }}>
              {props.multicloud.brief}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Reel(props) {
  const videos = props.videos;
  const [activeIdx, setActiveIdx] = useState(0);

  if (!videos || videos.length === 0) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: '#888' }}>
        <p style={{ fontStyle: 'italic' }}>No videos yet. Upload to your YouTube channel and they will appear here.</p>
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
          src={'https://www.youtube.com/embed/' + active.id}
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
        <div className="toa-labs-grid">
          {videos.map(function(v, i) {
            return (
              <button
                key={v.id}
                onClick={function() { setActiveIdx(i); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
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
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ background: 'rgba(0,0,0,0.7)', borderRadius: '50%', padding: 10, display: 'flex' }}>
                      <Play size={20} fill="#fff" color="#fff" />
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3, marginBottom: 4 }}>{v.title}</div>
                <div style={{ fontSize: 11, color: '#888' }}>
                  {new Date(v.published).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Trends(props) {
  const trends = props.trends;
  const viral = props.viral || [];

  return (
    <div style={{ paddingTop: 32 }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h2 style={{ fontSize: 32, fontWeight: 500, margin: '0 0 4px' }}>Trends</h2>
        <p style={{ fontSize: 14, fontStyle: 'italic', color: '#666', margin: 0 }}>What the wire is telling us this cycle</p>
      </div>

      {viral.length > 0 && (
        <div style={{ marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid #999' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #c0392b', flexWrap: 'wrap' }}>
            <Flame size={20} color="#c0392b" />
            <h3 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Viral Now</h3>
            <span style={{ fontSize: 12, fontStyle: 'italic', color: '#666', marginLeft: 'auto' }}>AI repos exploding in the last 7 days</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
            {viral.map(function(r, i) {
              const intensityColor = r.intensity === 'blazing' ? '#c0392b' : (r.intensity === 'hot' ? '#e67e22' : (r.intensity === 'rising' ? '#f39c12' : '#888'));
              const intensityLabel = r.intensity === 'blazing' ? 'BLAZING' : (r.intensity === 'hot' ? 'HOT' : (r.intensity === 'rising' ? 'RISING' : 'WARM'));
              return (
                <button
                  key={r.name}
                  onClick={function() { openUrl(r.url); }}
                  style={{
                    background: '#fff',
                    padding: '14px 16px',
                    border: '0.5px solid #ccc',
                    borderLeft: '3px solid ' + intensityColor,
                    borderRadius: 4,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'Georgia, serif',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 8 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#1a1a1a' }}>
                      <span style={{ color: '#888' }}>#{i + 1}</span> {r.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#c0392b', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      <Star size={12} fill="#c0392b" /> {r.stars_display}
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: '#555', lineHeight: 1.4, margin: '0 0 8px' }}>
                    {r.description || 'No description.'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, flexWrap: 'wrap', gap: 4 }}>
                    <span style={{ color: '#888' }}>
                      <Code2 size={10} style={{ display: 'inline', marginRight: 4, verticalAlign: -1 }} />
                      {r.language}
                    </span>
                    <span style={{ color: intensityColor, fontWeight: 600, letterSpacing: 1 }}>
                      {'\u25CF '}{intensityLabel} - pushed {r.hours_since_push}h ago
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {trends && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #999' }}>
              <TrendingUp size={18} color="#c0392b" />
              <h3 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Heating Up</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(trends.heating || []).map(function(t, i) {
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#ebe5d4', borderLeft: '3px solid #c0392b' }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 500 }}>{t.name}</div>
                      <div style={{ fontSize: 12, fontStyle: 'italic', color: '#666' }}>volume: {t.volume}</div>
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 500, color: '#c0392b' }}>{t.delta}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #999' }}>
              <TrendingDown size={18} color="#666" />
              <h3 style={{ fontSize: 20, fontWeight: 500, margin: 0 }}>Cooling Off</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(trends.cooling || []).map(function(t, i) {
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#f0ece1' }}>
                    <div style={{ fontSize: 16, fontWeight: 500, color: '#555' }}>{t.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 500, color: '#888' }}>{t.delta}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!trends && viral.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Trend data not available.</div>
      )}
    </div>
  );
}

function ModelOfWeek(props) {
  const model = props.model;
  if (!model) return <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Model report not available.</div>;

  const metrics = [
    { label: 'Tool-calling', value: model.tool_calling },
    { label: 'Planning depth', value: model.planning_depth, sub: '/ 10' },
    { label: 'ReAct stability', value: model.react_stability },
    { label: 'Cost / task', value: model.cost_per_task },
  ];

  return (
    <div style={{ paddingTop: 32, maxWidth: 760, margin: '0 auto' }}>
      <SectionHeader label="MODEL OF THE WEEK" />
      <h2 style={{ fontSize: 40, fontWeight: 500, margin: '0 0 8px' }}>{model.name}</h2>
      <div style={{ fontSize: 14, fontStyle: 'italic', color: '#666', marginBottom: 24 }}>Field report by Agent Ada</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid #999' }}>
        {metrics.map(function(m) {
          return (
            <div key={m.label} style={{ textAlign: 'center', padding: 12, background: '#ebe5d4' }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, color: '#666' }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 500 }}>
                {m.value}{m.sub && <span style={{ fontSize: 13, color: '#888' }}>{m.sub}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <blockquote style={{ fontSize: 16, fontStyle: 'italic', margin: 0, padding: 20, borderLeft: '3px solid #c0392b', background: '#ebe5d4', lineHeight: 1.6 }}>
        "{model.quote}"
        <div style={{ fontSize: 13, marginTop: 8, fontStyle: 'normal', color: '#666' }}>- Agent Ada, Repo Desk</div>
      </blockquote>
    </div>
  );
}

function Footer() {
  function openLinkedIn() {
    openUrl('https://www.linkedin.com/in/sreedhar-v-24831453/');
  }

  return (
    <footer style={{ marginTop: 48, padding: '24px 0', borderTop: '1px solid #999', background: '#ebe5d4' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center', fontSize: 12, color: '#666' }}>
        <div style={{ marginBottom: 8, fontStyle: 'italic' }}>The Times of Agentic - Filed by autonomous agents</div>
        <div style={{ marginBottom: 8 }}>
          Editor-in-Chief:{' '}
          <button
            onClick={openLinkedIn}
            style={{ color: '#c0392b', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Georgia, serif', fontSize: 12, padding: 0 }}
          >
            Sreedhar Vasu
          </button>
        </div>
        <div>(c) MMXXVI - A publication for the agentic age</div>
      </div>
    </footer>
  );
}

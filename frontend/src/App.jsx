import { useState, useEffect } from 'react';
import MemeCard from './MemeCard';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

function App() {
  const [trending, setTrending] = useState([]);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const [trendingRes, codesRes] = await Promise.all([
          fetch(`${API_BASE}/trending`),
          fetch(`${API_BASE}/codes`)
        ]);

        if (!trendingRes.ok || !codesRes.ok) {
          throw new Error('Failed to fetch from API. Is the backend running on port 3000?');
        }

        const trendingData = await trendingRes.json();
        const codesData = await codesRes.json();

        setTrending(trendingData.data);
        setCodes(codesData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '5rem' }}>Loading Memes...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', marginTop: '5rem' }}>{error}</div>;

  return (
    <>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <img src="/favicon.webp" alt="logo" style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'cover' }} />
          <h1 style={{ marginBottom: 0 }}>http.meme</h1>
        </div>
        <p className="subtitle">Like http.cat, but memes. Click any card to copy the embed HTML.</p>
      </header>

      <main>
        <section className="usage-section">
          <h2>Usage</h2>
          <div className="usage-code-block glass-panel">
            <span className="method">GET</span>
            <code className="url">{API_BASE}/[status_code]</code>
            <button 
              className="copy-btn" 
              onClick={() => navigator.clipboard.writeText(`${API_BASE}/`)}
              title="Copy base URL"
            >
              📋
            </button>
          </div>
          <p className="usage-example" style={{ lineHeight: '2' }}>
            Example: <a href={`${API_BASE}/404`} target="_blank" rel="noreferrer">{API_BASE}/404</a> <br/>
            Available endpoints: <code>/[code]</code> &bull; <code>/[code]/json</code> &bull; <code>/codes</code> &bull; <code>/trending</code>
          </p>
        </section>

        {trending.length > 0 && (
          <section>
            <h2>🔥 Trending Status Codes</h2>
            <div className="masonry-grid">
              {trending.map((meme) => (
                <MemeCard key={`trend-${meme.code}`} meme={meme} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2>All Status Codes</h2>
          <div className="masonry-grid">
            {codes.map((meme) => (
              <MemeCard key={`all-${meme.code}`} meme={meme} />
            ))}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>
          Built by <a href='https://github.com/anandx3505'>Anandx3505</a>. Inspired by the legendary <a href="https://http.cat" target="_blank" rel="noreferrer">http.cat</a>.
        </p>
        <p>
          <a href="https://github.com/Anandx3505" target="_blank" rel="noreferrer">GitHub</a> • <a href="/docs" target="_blank">API Docs</a>
        </p>
      </footer>
    </>
  );
}

export default App;

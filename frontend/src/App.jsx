import { useState, useEffect } from 'react';
import MemeCard from './MemeCard';

function App() {
  const [trending, setTrending] = useState([]);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const [trendingRes, codesRes] = await Promise.all([
          fetch('http://localhost:3000/trending'),
          fetch('http://localhost:3000/codes')
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
        <h1>http.meme</h1>
        <p className="subtitle">Like http.cat, but memes. Click any card to copy the embed HTML.</p>
      </header>

      <main>
        <section className="usage-section">
          <h2>Usage</h2>
          <div className="usage-code-block glass-panel">
            <span className="method">GET</span>
            <code className="url">http://localhost:3000/[status_code]</code>
            <button 
              className="copy-btn" 
              onClick={() => navigator.clipboard.writeText('http://localhost:3000/')}
              title="Copy base URL"
            >
              📋
            </button>
          </div>
          <p className="usage-example">
            Example: <a href="http://localhost:3000/404" target="_blank" rel="noreferrer">http://localhost:3000/404</a> &bull; Available endpoints: <code>/[code]</code>, <code>/[code]/json</code>
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

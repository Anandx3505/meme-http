import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function MemeCard({ meme }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {

    const embedHtml = `${API_BASE}/${meme.code}`;
    navigator.clipboard.writeText(embedHtml);

    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  return (
    <div
      className={`glass-panel meme-card animate-fade-in ${copied ? 'copied' : ''}`}
      onClick={handleCopy}
    >
      <div className="copy-toast">Copied HTML!</div>


      <img
        src={`${API_BASE}/${meme.code}`}
        alt={`HTTP ${meme.code}`}
        loading="lazy"
      />

      <div className="card-body">
        <div className="status-code">
          {meme.code}
          {meme.hits !== undefined && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              🔥 {meme.hits}
            </span>
          )}
        </div>
        <div className="status-desc">{meme.description}</div>
      </div>
    </div>
  );
}

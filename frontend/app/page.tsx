import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">Parlant Guidelines</span> vs Traditional Prompt
            </h1>
            <p className="hero-subtitle">
              See the difference between structured, reliable AI agents and monolithic prompts.
              Compare side-by-side responses from both approaches in real-time.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">9</div>
                <div className="stat-label">Structured Guidelines</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">8</div>
                <div className="stat-label">Specialized Tools</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">223</div>
                <div className="stat-label">Lines of Traditional Prompt</div>
              </div>
            </div>
            <Link href="/demo" className="btn btn-hero">
              Try the Demo →
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Parlant&apos;s Approach Wins</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Structured Guidelines</h3>
              <p>Conditional rules that trigger based on context, ensuring consistent and reliable responses.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Dynamic Tools</h3>
              <p>8 specialized tools for calculations, data retrieval, and real-time information access.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👁️</div>
              <h3>Full Observability</h3>
              <p>See exactly which guidelines and tools were used for each response with complete reasoning traces.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛠️</div>
              <h3>Easy Maintenance</h3>
              <p>Modular architecture makes it simple to update individual guidelines without affecting others.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Guaranteed Reliability</h3>
              <p>Critical rules are enforced by the system, not left to the LLM&apos;s interpretation.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Better Performance</h3>
              <p>Lower token usage and faster responses through targeted, context-aware processing.</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/demo" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '16px 32px', textDecoration: 'none', display: 'inline-block' }}>
              Launch Comparison Demo →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>Built to demonstrate the power of structured AI agents over traditional prompts</p>
        </div>
      </footer>
    </>
  );
}


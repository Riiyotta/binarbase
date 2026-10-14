// Section 1 — Hero (div.hero-wrap > section.hero). CLONE_SPEC 5
// Markup translated 1:1 from recon/dom-1440-clean.html; styles in src/styles/site.css.
export default function Hero() {
  return (
    <div className="hero-wrap">
      <div className="stripe-gradient-art">
        <div className="gradient-canvas">
          <div className="gradient-blob blob-1" />
          <div className="gradient-blob blob-2" />
          <div className="gradient-blob blob-3" />
          <div className="gradient-blob blob-4" />
        </div>
      </div>
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge" data-aos="fade-up">
            <div className="badge-pulse" />
            <span className="badge-text">{"Your company's AI brain"}</span>
            <div className="badge-shine" />
          </div>
          <h1 className="hero-title" data-aos="fade-up" data-aos-delay="100">
            <span className="title-line">AI that actually</span>
            <span className="title-gradient">knows your business</span>
          </h1>
          <p className="hero-subtitle" data-aos="fade-up" data-aos-delay="200">
            {"Every AI is generic until it knows you. BinarBase builds a living digital twin of your company — your definitions, your numbers, your way of working. "}
            <strong>One brain. Correct answers. Everywhere.</strong>
          </p>
        </div>
        <div className="hero-actions">
          <div className="hero-cta" data-aos="fade-up" data-aos-delay="300">
            <a href="https://app.binarbase.com/signup" className="cta-primary">
              <span>Start Free Trial</span>
              <svg className="cta-arrow" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="cta-shine" />
            </a>
            <button className="cta-secondary disabled" disabled>
              <div className="play-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <span>Watch Demo</span>
              <span className="coming-soon-badge">Coming Soon</span>
            </button>
          </div>
          <div className="trust-row" data-aos="fade-up" data-aos-delay="400">
            <div className="trust-item">
              <svg className="trust-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Grounded in your definitions</span>
            </div>
            <div className="trust-item">
              <svg className="trust-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>First answers in minutes</span>
            </div>
            <div className="trust-item">
              <svg className="trust-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Yours in any AI</span>
            </div>
            <a href="#deployment" className="trust-item trust-link">
              <svg className="trust-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a2 2 0 012-2h10a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V4zm3 1.5a1 1 0 100 2 1 1 0 000-2zM3 13a2 2 0 012-2h10a2 2 0 012 2v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3zm3 1.5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              <span>Runs in the cloud or on your servers</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

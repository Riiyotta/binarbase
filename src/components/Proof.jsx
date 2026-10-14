// Section 8 — Proof / stories (#proof). CLONE_SPEC 12
// Markup translated 1:1 from recon/dom-1440-clean.html; styles in src/styles/site.css.
export default function Proof() {
  return (
    <section id="proof" className="blog-section proof-section">
      <div className="section-container">
        <div className="section-header">
          <div className="section-badge">
            <span className="section-num">07</span>
            <span>From our clients</span>
          </div>
          <h2 className="section-title">
            Already working
            <br />
            <span className="gradient-text">in companies like yours.</span>
          </h2>
          <p className="section-subtitle">Read how companies across Slovakia and the CEE region use BinarBase.</p>
        </div>
        <div className="proof-logos">
          <p className="trusted-label">Building their company brain across Slovakia & CEE</p>
          <div className="trusted-logos">
            <div className="logo-item">
              <img src="/assets/applifting.png" alt="Applifting" className="client-logo" loading="lazy" />
            </div>
            <div className="logo-item">
              <img src="/assets/impactHub.png" alt="Impact Hub" className="client-logo" loading="lazy" />
            </div>
            <div className="logo-item">
              <img src="/assets/e-consulting-logo.png" alt="eConsulting" className="client-logo" loading="lazy" />
            </div>
            <div className="logo-item">
              <img src="/assets/delia.png" alt="Delia" className="client-logo" loading="lazy" />
            </div>
            <div className="logo-item">
              <img src="/assets/jt-wine-fund.png" alt="J&T Wine Fund" className="client-logo logo-dark" loading="lazy" />
            </div>
            <div className="logo-item">
              <img src="/assets/highgate.png" alt="Highgate Group" className="client-logo logo-dark logo-large" loading="lazy" />
            </div>
            <div className="logo-item">
              <img src="/assets/wflow.png" alt="Wflow" className="client-logo" loading="lazy" />
            </div>
            <div className="logo-item">
              <img src="/assets/malcom.png" alt="Malcom" className="client-logo" loading="lazy" />
            </div>
            <div className="logo-item">
              <img src="/assets/this_one_sro_logo.jpeg" alt="This One" className="client-logo" loading="lazy" />
            </div>
            <div className="logo-item">
              <img src="/assets/realitni_advokati.png" alt="Realitní Advokáti" className="client-logo logo-large" loading="lazy" />
            </div>
            <div className="logo-item">
              <img src="/assets/bwd.png" alt="BWD" className="client-logo" loading="lazy" />
            </div>
          </div>
        </div>
        <div className="blog-grid">
          <article className="blog-card">
            <div className="blog-card-inner">
              <div className="blog-category success-story">Success Story</div>
              <h3 className="blog-title">Transforming Wine Distribution: How BWD Achieved Real-Time Sales Intelligence</h3>
              <p className="blog-excerpt">How BWD eliminated hours of daily Excel reporting and empowered their sales team with real-time analytics and inventory planning.</p>
              <div className="blog-meta">
                <span className="blog-date">February 2026</span>
                <span className="blog-read-time">5 min read</span>
              </div>
              <a href="/insights/bwd-case-study" className="blog-link">
                {"Read the story "}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                </svg>
              </a>
            </div>
            <div className="blog-card-glow" />
          </article>
          <article className="blog-card">
            <div className="blog-card-inner">
              <div className="blog-category success-story">Success Story</div>
              <h3 className="blog-title">{"How BinarBase Enhanced Voxberg's Analytics"}</h3>
              <p className="blog-excerpt">Discover how BinarBase helped Voxberg transform data chaos into strategic clarity, enabling smarter business decisions through unified analytics and real-time reporting.</p>
              <div className="blog-meta">
                <span className="blog-date">December 2024</span>
                <span className="blog-read-time">5 min read</span>
              </div>
              <a href="/insights/voxberg-case-study" className="blog-link">
                {"Read the story "}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                </svg>
              </a>
            </div>
            <div className="blog-card-glow" />
          </article>
          <article className="blog-card">
            <div className="blog-card-inner">
              <div className="blog-category success-story">Success Story</div>
              <h3 className="blog-title">Automating Financial Workflows at Applifting</h3>
              <p className="blog-excerpt">How Applifting boosted efficiency and control by automating financial processes through BinarBase, saving over 46 hours of work every month.</p>
              <div className="blog-meta">
                <span className="blog-date">November 2024</span>
                <span className="blog-read-time">4 min read</span>
              </div>
              <a href="/insights/applifting-case-study" className="blog-link">
                {"Read the story "}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                </svg>
              </a>
            </div>
            <div className="blog-card-glow" />
          </article>
        </div>
        <div className="blog-cta">
          <a href="/insights" className="blog-all-link">
            {"All stories & insights "}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

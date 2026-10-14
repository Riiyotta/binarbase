// Section 4 — Engine (#how-it-works). CLONE_SPEC 8
// Markup translated 1:1 from recon/dom-1440-clean.html; styles in src/styles/site.css.
export default function Engine() {
  return (
    <section id="how-it-works" className="engine-section">
      <div className="section-container">
        <div className="section-header">
          <div className="section-badge">
            <span className="section-num">03</span>
            <span>How the context works</span>
          </div>
          <h2 className="section-title">
            A self-improving engine —
            <br />
            <span className="gradient-text">not a database someone has to maintain.</span>
          </h2>
          <p className="section-subtitle">{"Most \"AI knowledge bases\" are folders that rot: someone has to keep them current, and they go stale within months. Your BinarBase context is different — it's an engine. A private AI runs on your company's knowledge, continuously organising it, catching gaps, and turning every correction into a permanent improvement."}</p>
        </div>
        <div className="engine-flow" data-aos="fade-up">
          <div className="engine-step">
            <h4 className="engine-step-title">Capture</h4>
            <p className="engine-step-desc">Data, documents and corrections become a structured, governed model</p>
          </div>
          <div className="engine-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
          <div className="is-core engine-step">
            <span className="engine-step-badge">private AI</span>
            <h4 className="engine-step-title">Curate</h4>
            <p className="engine-step-desc">An internal AI promotes corrections into definitions, spots gaps, and keeps one source of truth</p>
          </div>
          <div className="engine-arrow" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
          <div className="engine-step">
            <h4 className="engine-step-title">Serve</h4>
            <p className="engine-step-desc">Correct, traceable answers for dashboards, agents and your own AI</p>
          </div>
        </div>
        <div className="engine-loop" data-aos="fade-up">
          <span className="engine-loop-icon" aria-hidden="true">↺</span>
          <span>Every use and every correction feeds back — the engine restructures and improves itself</span>
        </div>
        <div className="engine-cards">
          <div className="engine-card" data-aos="fade-up" data-aos-delay="0">
            <h4>A private AI curates it</h4>
            <p>An internal AI keeps your context consistent — it turns corrections into definitions, flags the ones that are missing, and enforces one source of truth across every team.</p>
          </div>
          <div className="engine-card" data-aos="fade-up" data-aos-delay="100">
            <h4>Self-improving by design</h4>
            <p>Every use and correction feeds back. The engine compounds — no manual upkeep, no rot. Sharper every week, on its own.</p>
          </div>
          <div className="engine-card" data-aos="fade-up" data-aos-delay="200">
            <h4>Governed & private</h4>
            <p>It runs on your context, with your permissions. Every change is auditable, roles are enforced, and nothing leaks out.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Section 11 — Final CTA (section.final-cta). CLONE_SPEC 15
// Markup translated 1:1 from recon/dom-1440-clean.html; styles in src/styles/site.css.
export default function FinalCta() {
  return (
    <section className="final-cta">
      <div className="cta-container">
        <div className="cta-glow-bg" />
        <div className="cta-content">
          <h2 className="cta-title">
            Stop prompting a stranger.
            <br />
            <span className="gradient-text">Start working with a brain that knows you.</span>
          </h2>
          <p className="cta-subtitle">Give your company an AI brain — live the same day, smarter every week.</p>
          <div className="cta-actions">
            <a href="https://app.binarbase.com/signup" className="cta-primary large">
              <span>Start Free Trial</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" />
              </svg>
            </a>
            <button className="cta-secondary large">
              <span>Schedule Demo</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

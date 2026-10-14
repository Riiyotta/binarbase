// Section 2 — "Your AI, upgraded" (#upgraded). CLONE_SPEC 6
// Markup translated 1:1 from recon/dom-1440-clean.html; styles in src/styles/site.css.
export default function Upgraded() {
  return (
    <section id="upgraded" className="upgraded-section">
      <div className="section-container">
        <div className="section-header">
          <div className="section-badge">
            <span className="section-num">01</span>
            <span>Your AI, upgraded</span>
          </div>
          <h2 className="section-title">
            Turn any AI into your
            <br />
            <span className="gradient-text">most experienced employee.</span>
          </h2>
          <p className="section-subtitle">{"On day one, even the smartest AI is a brilliant stranger — it doesn't know your definitions, your history, or how your team actually works. BinarBase gives it years of institutional memory."}</p>
        </div>
        <div className="mismatch-panel" data-aos="fade-up">
          <p className="mismatch-label">The same word, three different numbers</p>
          <div className="mismatch-rows">
            <div className="mismatch-row" style={{ "--delay": "0s" }}>
              <span className="mismatch-source">E-shop</span>
              <span className="mismatch-definition">revenue = all orders</span>
              <span className="mismatch-mark" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l8 8M14 6l-8 8" />
                </svg>
              </span>
            </div>
            <div className="mismatch-row" style={{ "--delay": "0.1s" }}>
              <span className="mismatch-source">Accounting</span>
              <span className="mismatch-definition">revenue = invoices issued</span>
              <span className="mismatch-mark" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l8 8M14 6l-8 8" />
                </svg>
              </span>
            </div>
            <div className="mismatch-row" style={{ "--delay": "0.2s" }}>
              <span className="mismatch-source">CRM</span>
              <span className="mismatch-definition">revenue = signed contracts</span>
              <span className="mismatch-mark" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l8 8M14 6l-8 8" />
                </svg>
              </span>
            </div>
          </div>
          <div className="mismatch-callout">
            <strong>Which one will your AI pick? Whichever one it likes.</strong>
            <span>{"And it happens inside a single system too: average your margin percentages and you get a number that isn't your margin. Count your rows and you've counted order lines, not orders. Both look right. Both are wrong."}</span>
          </div>
        </div>
        <div className="compare-table" data-aos="fade-up">
          <div className="compare-head">
            <div className="compare-cell compare-label" />
            <div className="compare-cell compare-generic-head">Any AI on day one</div>
            <div className="compare-cell compare-bb-head">The same AI, with BinarBase</div>
          </div>
          <div className="compare-row">
            <div className="compare-cell compare-label">Your definitions</div>
            <div className="compare-cell compare-generic">
              <span className="compare-mark mark-x" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l8 8M14 6l-8 8" />
                </svg>
              </span>
              <span>{"Guesses what \"revenue\" means"}</span>
            </div>
            <div className="compare-cell compare-bb">
              <span className="compare-mark mark-check" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 10.5l3.5 3.5L15 7" />
                </svg>
              </span>
              <span>Knows your confirmed definition</span>
            </div>
          </div>
          <div className="compare-row">
            <div className="compare-cell compare-label">Your history</div>
            <div className="compare-cell compare-generic">
              <span className="compare-mark mark-x" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l8 8M14 6l-8 8" />
                </svg>
              </span>
              <span>Starts from zero every chat</span>
            </div>
            <div className="compare-cell compare-bb">
              <span className="compare-mark mark-check" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 10.5l3.5 3.5L15 7" />
                </svg>
              </span>
              <span>Remembers decisions & corrections</span>
            </div>
          </div>
          <div className="compare-row">
            <div className="compare-cell compare-label">Your flows</div>
            <div className="compare-cell compare-generic">
              <span className="compare-mark mark-x" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l8 8M14 6l-8 8" />
                </svg>
              </span>
              <span>Generic best practice</span>
            </div>
            <div className="compare-cell compare-bb">
              <span className="compare-mark mark-check" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 10.5l3.5 3.5L15 7" />
                </svg>
              </span>
              <span>Follows how your team actually works</span>
            </div>
          </div>
          <div className="compare-row">
            <div className="compare-cell compare-label">{"When it's unsure"}</div>
            <div className="compare-cell compare-generic">
              <span className="compare-mark mark-x" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l8 8M14 6l-8 8" />
                </svg>
              </span>
              <span>Answers anyway</span>
            </div>
            <div className="compare-cell compare-bb">
              <span className="compare-mark mark-check" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 10.5l3.5 3.5L15 7" />
                </svg>
              </span>
              <span>Asks — like a good employee would</span>
            </div>
          </div>
          <div className="compare-row">
            <div className="compare-cell compare-label">Where numbers come from</div>
            <div className="compare-cell compare-generic">
              <span className="compare-mark mark-x" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l8 8M14 6l-8 8" />
                </svg>
              </span>
              <span>Black box</span>
            </div>
            <div className="compare-cell compare-bb">
              <span className="compare-mark mark-check" aria-hidden="true">
                <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 10.5l3.5 3.5L15 7" />
                </svg>
              </span>
              <span>Shows its work — source & definition</span>
            </div>
          </div>
        </div>
        <p className="compare-closing" data-aos="fade-up">{"The difference isn't a smarter model — it's context. And because a wrong number in a board meeting is a disaster, every answer shows its work."}</p>
      </div>
    </section>
  )
}

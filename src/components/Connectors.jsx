// Section 3 — Connectors & MCP (.integrations-section). CLONE_SPEC 7
// Markup translated 1:1 from recon/dom-1440-clean.html; styles in src/styles/site.css.
import { useRef, useState } from 'react'

export default function Connectors() {
  // Click on the core: .brain-excited on the core + .pulse-excited on the rings for 1200ms.
  const [excited, setExcited] = useState(false)
  const timer = useRef(null)
  const excite = () => {
    setExcited(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setExcited(false), 1200)
  }
  const ex = excited ? ' pulse-excited' : ''
  return (
    <section className="integrations-section">
      <div className="section-container">
        <div className="section-header">
          <div className="section-badge emerald">
            <span className="section-num">02</span>
            <span>Connectors & MCP</span>
          </div>
          <h2 className="section-title">
            {"Everything connected. "}
            <span className="gradient-text-emerald">One meaning.</span>
          </h2>
          <p className="section-subtitle">200+ connectors bring your systems together and map them onto your definitions. One MCP endpoint serves the result to any agent you already use.</p>
        </div>
        <div className="integrations-content">
          <div className="integrations-info">
            <h3 className="integrations-headline">Connecting tools is easy. Meaning is the hard part.</h3>
            <p className="integrations-description">{"Every vendor can connect your tools — that's table stakes. The hard part is meaning: knowing that your \"active customer\" is someone who bought in the last 90 days, that your fiscal month starts on the 1st, and that averaging your margin percentages doesn't give you your margin. BinarBase maps every connected source onto definitions your team confirmed, and keeps them in sync."}</p>
            <ul className="integrations-features">
              <li>
                <span className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div className="feature-text">
                  <strong>200+ connectors</strong>
                  <span>Stripe, Shopify, QuickBooks, Xero, HubSpot, Salesforce and more — connected once, kept in sync</span>
                </div>
              </li>
              <li>
                <span className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <div className="feature-text">
                  <strong>Mapped to your definitions</strong>
                  <span>Every field lands on a metric you confirmed, so a number means the same thing everywhere</span>
                </div>
              </li>
              <li>
                <span className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </span>
                <div className="feature-text">
                  <strong>One MCP endpoint out</strong>
                  <span>Add BinarBase to Claude, ChatGPT or Cursor and they read your brain live, with your permissions</span>
                </div>
              </li>
              <li>
                <span className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <div className="feature-text">
                  <strong>Governed and audited</strong>
                  <span>Access follows your roles, every call is logged, data encrypted, GDPR ready</span>
                </div>
              </li>
            </ul>
            <div className="integrations-cta">
              <a href="https://app.binarbase.com/signup" className="cta-primary cta-wide">
                <span>Connect Now</span>
                <svg className="cta-arrow" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
          <div className="integrations-visual">
            <div className="data-brain">
              <div className={"brain-pulse brain-pulse-1" + ex} />
              <div className={"brain-pulse brain-pulse-2" + ex} />
              <div className={"brain-pulse brain-pulse-3" + ex} />
              <div className={excited ? "brain-core brain-excited" : "brain-core"} onClick={excite}>
                <div className="heartbeat-pulse heartbeat-1" />
                <div className="heartbeat-pulse heartbeat-2" />
                <div className="heartbeat-pulse heartbeat-3" />
                <div className="brain-center">
                  <svg viewBox="0 0 140 140" fill="none">
                    <path d="M70.0001555,34.9997668 C31.3405872,34.9997668 -0.000414590936,50.6702677 -0.000414590936,69.9995336 C-0.000414590936,76.3749057 3.40855938,82.3522705 9.36519465,87.5004535 C21.4681405,77.0382512 44.0902949,69.9995336 70.0001555,69.9995336 L70.0001555,34.9997668 Z M9.36519465,87.5004535 C3.40855938,92.6475999 -0.000414590936,98.6249647 -0.000414590936,105.000337 C-0.000414590936,124.136818 30.7166278,139.686051 68.8424103,139.994921 L70.0001555,140.000104 L70.0001555,105.000337 L68.8424103,104.995154 C43.4176212,104.788895 21.2877935,97.8051112 9.36519465,87.5004535 L9.36519465,87.5004535 Z M130.635116,52.4996502 C118.712517,62.8053444 96.5826898,69.7891287 71.1579007,69.9953877 L70.0001555,69.9995336 L70.0001555,105.000337 L71.1579007,104.995154 C109.283683,104.686284 140.000726,89.1370512 140.000726,69.9995336 C140.000726,63.6251979 136.591752,57.6478331 130.635116,52.4996502 L130.635116,52.4996502 Z M140.000726,34.9997668 C140.000726,15.6694644 108.659724,0 70.0001555,0 L70.0001555,34.9997668 C95.910016,34.9997668 118.53217,42.0384844 130.635116,52.4996502 C136.591752,47.3514672 140.000726,41.3751389 140.000726,34.9997668 L140.000726,34.9997668 Z" fill="white" />
                  </svg>
                </div>
              </div>
              <div className="floating-icons">
                <div className="floating-icon fi-1">📊</div>
                <div className="floating-icon fi-2">💳</div>
                <div className="floating-icon fi-3">📈</div>
                <div className="floating-icon fi-4">🔗</div>
                <div className="floating-icon fi-5">⚡</div>
                <div className="floating-icon fi-6">🎯</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Section 6 — Product showcase (#product). CLONE_SPEC 10
// Markup translated 1:1 from recon/dom-1440-clean.html; styles in src/styles/site.css.
import { useRef, useState } from 'react'

const COUNT = 5

export default function Showcase() {
  // Active card index; click on card/dot/arrow sets it and centres that card in the track.
  // No auto-advance and no scroll listener (manual horizontal scroll doesn't change it).
  const [active, setActive] = useState(0)
  const trackRef = useRef(null)
  const go = (i) => {
    setActive(i)
    const track = trackRef.current
    if (!track) return
    const card = track.querySelectorAll('.showcase-card')[i]
    if (!card) return
    const left = card.offsetLeft - track.getBoundingClientRect().width / 2 + card.getBoundingClientRect().width / 2
    track.scrollTo({ left, behavior: 'smooth' })
  }
  const next = () => active < COUNT - 1 && go(active + 1)
  const prev = () => active > 0 && go(active - 1)
  const cardClass = (i) => (active === i ? 'active showcase-card' : 'showcase-card')
  return (
    <section id="product" className="features-section">
      <div className="features-header">
        <div className="section-badge">
          <span className="section-num">05</span>
          <span>What your brain does for you</span>
        </div>
        <h2 className="features-title">
          {"One context. "}
          <span className="gradient-text">Every output.</span>
        </h2>
        <p className="features-subtitle">None of this is a separate product. Each one is the same Company Context, put to work — which is why they all use your definitions, your voice and your rules without being told twice.</p>
      </div>
      <div className="showcase-container">
        <div className="showcase-track" ref={trackRef}>
          <div className={cardClass(0)} onClick={() => go(0)}>
            <div className="card-glow blue" />
            <div className="card-inner">
              <div className="app-screen">
                <div className="screen-header">
                  <div className="screen-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="screen-title">AI Agents</div>
                </div>
                <div className="screen-content agent-screen">
                  <div className="agent-chat">
                    <div className="chat-message ai">
                      <div className="message-avatar">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <div className="message-content">
                        <div className="message-header">
                          {"AI Agent "}
                          <span className="message-time">Just now</span>
                        </div>
                        <p>Net revenue is 12% below plan this quarter — using your definition: orders − refunds − shipping. Two drivers explain most of it:</p>
                        <div className="message-actions">
                          <button className="action-chip">Show the breakdown</button>
                          <button className="action-chip">Compare to last year</button>
                          <button className="action-chip">Draft board note</button>
                        </div>
                      </div>
                    </div>
                    <div className="chat-message alert">
                      <div className="alert-icon">⚠️</div>
                      <div className="alert-content">
                        <strong>Definition needed</strong>
                        <p>{"\"Active customer\" isn't confirmed yet — confirm it and I'll rerun this"}</p>
                      </div>
                    </div>
                    <div className="chat-input">
                      <input type="text" placeholder="Ask your company anything..." disabled />
                      <button className="send-btn">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="card-badge blue">Always on</div>
                <h3 className="card-title">Work that arrives already done</h3>
                <p className="card-desc">Board summaries, account briefs, proposals — drafted by agents that already know your definitions, your processes and your voice. When a definition is missing they ask instead of guessing, so nothing lands on your desk quietly wrong.</p>
                <ul className="card-features">
                  <li>
                    <span className="check">✓</span>
                    {" Board summaries in your format"}
                  </li>
                  <li>
                    <span className="check">✓</span>
                    {" Answers grounded in confirmed definitions"}
                  </li>
                  <li>
                    <span className="check">✓</span>
                    {" Asks you when a definition is missing"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={cardClass(1)} onClick={() => go(1)}>
            <div className="card-glow cyan" />
            <div className="card-inner">
              <div className="app-screen">
                <div className="screen-header">
                  <div className="screen-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="screen-title">Revenue Forecast</div>
                </div>
                <div className="screen-content forecast-screen">
                  <div className="forecast-chart">
                    <div className="chart-header">
                      <span className="chart-label">Revenue Projection</span>
                      <div className="chart-legend">
                        <span className="legend-item actual">
                          <span className="dot" />
                          Actual
                        </span>
                        <span className="legend-item predicted">
                          <span className="dot" />
                          Predicted
                        </span>
                        <span className="legend-item confidence">
                          <span className="dot" />
                          Confidence
                        </span>
                      </div>
                    </div>
                    <div className="chart-visual">
                      <svg viewBox="0 0 300 120" className="forecast-svg">
                        <path d="M0,90 L50,85 L100,75 L150,65 L150,45 L100,40 L50,50 L0,60 Z" fill="url(#confidenceGradient)" opacity="0.3" />
                        <path d="M0,75 L50,68 L100,58 L150,55" stroke="#06B6D4" strokeWidth="3" fill="none" strokeLinecap="round" />
                        <path d="M150,55 L200,42 L250,30 L300,20" stroke="#06B6D4" strokeWidth="3" fill="none" strokeDasharray="8,4" strokeLinecap="round" />
                        <defs>
                          <lineargradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                          </lineargradient>
                        </defs>
                      </svg>
                    </div>
                    <div className="chart-stats">
                      <div className="stat">
                        <span className="stat-label">Q4 Forecast</span>
                        <span className="stat-value cyan">€2.4M</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Confidence</span>
                        <span className="stat-value">89%</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">YoY Growth</span>
                        <span className="stat-value positive">+34%</span>
                      </div>
                    </div>
                  </div>
                  <div className="scenario-pills">
                    <button className="scenario-pill active">Base Case</button>
                    <button className="scenario-pill">Best Case</button>
                    <button className="scenario-pill">Worst Case</button>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="card-badge cyan">Your fiscal calendar</div>
                <h3 className="card-title">Forecasts you can defend</h3>
                <p className="card-desc">{"Runway, cash flow and revenue projected on the metrics your team confirmed and the fiscal calendar you actually use — with the source behind every line, so the first question in the room doesn't derail the meeting."}</p>
                <ul className="card-features">
                  <li>
                    <span className="check">✓</span>
                    {" 30/60/90 day projections"}
                  </li>
                  <li>
                    <span className="check">✓</span>
                    {" What-if scenarios on your own drivers"}
                  </li>
                  <li>
                    <span className="check">✓</span>
                    {" Runway on your burn definition"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={cardClass(2)} onClick={() => go(2)}>
            <div className="card-glow emerald" />
            <div className="card-inner">
              <div className="app-screen">
                <div className="screen-header">
                  <div className="screen-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="screen-title">Reports & Dashboards</div>
                </div>
                <div className="screen-content reporting-screen">
                  <div className="reporting-preview">
                    <div className="dash-row">
                      <div className="mini-widget">
                        <span className="widget-label">MRR</span>
                        <span className="widget-value">€847K</span>
                        <span className="widget-change positive">↑ 12%</span>
                      </div>
                      <div className="mini-widget">
                        <span className="widget-label">Gross Margin</span>
                        <span className="widget-value">67.2%</span>
                        <span className="widget-change positive">↑ 2.2%</span>
                      </div>
                    </div>
                    <div className="mini-chart">
                      <div className="chart-bars">
                        <div className="bar" style={{ "--h": "45%" }} />
                        <div className="bar" style={{ "--h": "60%" }} />
                        <div className="bar" style={{ "--h": "52%" }} />
                        <div className="bar" style={{ "--h": "78%" }} />
                        <div className="bar" style={{ "--h": "65%" }} />
                        <div className="bar" style={{ "--h": "85%" }} />
                        <div className="bar active" style={{ "--h": "92%" }} />
                      </div>
                    </div>
                    <div className="report-mini">
                      <div className="report-header">
                        <span className="report-icon">📊</span>
                        <span className="report-name">Q4 Board Report</span>
                        <span className="report-status">Ready</span>
                      </div>
                      <div className="metric-pills">
                        <span className="metric-pill green">Revenue +23%</span>
                        <span className="metric-pill green">Margin 67%</span>
                        <span className="metric-pill amber">CAC +8%</span>
                      </div>
                    </div>
                    <div className="live-indicator">
                      <span className="live-dot" />
                      <span>Live data • Updated 2s ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="card-badge emerald">Traceable</div>
                <h3 className="card-title">The end of arguing about whose number is right</h3>
                <p className="card-desc">Live dashboards and board-ready reports where every metric traces back to a definition your team confirmed. One number, the same everywhere, with its origin one click away.</p>
                <ul className="card-features">
                  <li>
                    <span className="check">✓</span>
                    {" Every metric traceable to its definition"}
                  </li>
                  <li>
                    <span className="check">✓</span>
                    {" Board-ready reports in seconds"}
                  </li>
                  <li>
                    <span className="check">✓</span>
                    {" One number — the same everywhere"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={cardClass(3)} onClick={() => go(3)}>
            <div className="card-glow amber" />
            <div className="card-inner">
              <div className="app-screen">
                <div className="screen-header">
                  <div className="screen-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="screen-title">Connected Apps</div>
                </div>
                <div className="screen-content integrations-screen">
                  <div className="integrations-mini">
                    <div className="integration-item connected">
                      <span className="int-icon">💳</span>
                      <span className="int-name">Stripe</span>
                      <span className="int-status">✓</span>
                    </div>
                    <div className="integration-item connected">
                      <span className="int-icon">📊</span>
                      <span className="int-name">QuickBooks</span>
                      <span className="int-status">✓</span>
                    </div>
                    <div className="integration-item connected">
                      <span className="int-icon">🛒</span>
                      <span className="int-name">Shopify</span>
                      <span className="int-status">✓</span>
                    </div>
                    <div className="integration-item">
                      <span className="int-icon">☁️</span>
                      <span className="int-name">Salesforce</span>
                      <span className="int-status add">+</span>
                    </div>
                  </div>
                  <div className="sync-status">
                    <div className="sync-animation">
                      <div className="sync-ring" />
                      <div className="sync-ring" />
                      <div className="sync-ring" />
                    </div>
                    <span>Mapping your data onto your definitions...</span>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="card-badge amber">200+ connectors</div>
                <h3 className="card-title">Your systems, finally speaking one language</h3>
                <p className="card-desc">Accounting, CRM, payments and e-commerce connected in minutes, then mapped onto the definitions you confirmed. Connecting tools is the easy part — this is the part that makes the data mean something.</p>
                <ul className="card-features">
                  <li>
                    <span className="check">✓</span>
                    {" 200+ native connectors"}
                  </li>
                  <li>
                    <span className="check">✓</span>
                    {" Mapped onto your confirmed metrics"}
                  </li>
                  <li>
                    <span className="check">✓</span>
                    {" Kept fresh automatically"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={cardClass(4)} onClick={() => go(4)}>
            <div className="card-glow purple" />
            <div className="card-inner">
              <div className="app-screen">
                <div className="screen-header">
                  <div className="screen-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="screen-title">Voice Assistant</div>
                </div>
                <div className="screen-content voice-screen">
                  <div className="voice-container">
                    <div className="voice-orb">
                      <div className="orb-ring" />
                      <div className="orb-ring" />
                      <div className="orb-ring" />
                      <div className="orb-core">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                          <line x1="12" y1="19" x2="12" y2="23" />
                          <line x1="8" y1="23" x2="16" y2="23" />
                        </svg>
                      </div>
                    </div>
                    <div className="voice-status-text">Listening...</div>
                    <div className="voice-conversation">
                      <div className="voice-bubble user">
                        <span>{"\"What's our net revenue this month?\""}</span>
                      </div>
                      <div className="voice-bubble ai">
                        <div className="ai-avatar">🤖</div>
                        <span>€847K net revenue — orders minus refunds and shipping, your definition. Up 12% on last month; Product X leads with €312K.</span>
                      </div>
                    </div>
                    <div className="voice-quick-actions">
                      <button className="quick-action">Show the source</button>
                      <button className="quick-action">Compare periods</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="card-badge purple">Coming soon</div>
                <h3 className="card-title">And whatever you build next</h3>
                <p className="card-desc">{"The context is yours to build on. Ask out loud from your phone, wire it into your own tools over MCP, or build something we haven't thought of — it all reads the same brain."}</p>
                <ul className="card-features">
                  <li>
                    <span className="check">✓</span>
                    {" Ask in plain language, anywhere"}
                  </li>
                  <li>
                    <span className="check">✓</span>
                    {" Answers on your own definitions"}
                  </li>
                  <li>
                    <span className="check">✓</span>
                    {" Your own apps over MCP"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="showcase-nav">
          <button className="nav-arrow prev" disabled={active === 0} onClick={prev}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="nav-dots">
            {Array.from({ length: COUNT }, (_, i) => (
              <button key={i} className={active === i ? 'active nav-dot' : 'nav-dot'} onClick={() => go(i)} />
            ))}
          </div>
          <button className="nav-arrow next" disabled={active === COUNT - 1} onClick={next}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

// Section 5 — Console (#console). CLONE_SPEC 9
// Markup translated 1:1 from recon/dom-1440-clean.html; styles in src/styles/site.css.
export default function Console() {
  return (
    <section id="console" className="console-section">
      <div className="section-container">
        <div className="section-header">
          <div className="section-badge">
            <span className="section-num">04</span>
            <span>Two ways to work with it</span>
          </div>
          <h2 className="section-title">
            Manage it in BinarBase —
            <br />
            <span className="gradient-text">or from your own tools over MCP.</span>
          </h2>
          <p className="section-subtitle">Run your brain whichever way suits you: a console for editing definitions and sources by hand, and an MCP endpoint so Claude, ChatGPT or Cursor can read and work with the same context directly.</p>
        </div>
        <div className="console-grid">
          <div className="console-pane" data-aos="fade-up">
            <span className="console-pane-label">Manage · the BinarBase console</span>
            <h3 className="console-pane-title">Your context and data, in one place</h3>
            <p className="console-pane-desc">Edit definitions in plain language, connect sources, review what the engine learned, and set who sees what. No code.</p>
            <div className="console-mock">
              <div className="console-mock-bar">
                <span className="console-dot" />
                <span className="console-dot" />
                <span className="console-dot" />
                <span className="console-mock-name">BinarBase · Context console</span>
              </div>
              <div className="console-mock-nav">
                <span className="console-nav-item">Context</span>
                <span className="console-nav-item">Data sources</span>
                <span className="active console-nav-item">Definitions</span>
                <span className="console-nav-item">Corrections</span>
                <span className="console-nav-item">Roles</span>
              </div>
              <div className="console-mock-body">
                <div className="definition-row">
                  <div className="definition-head">
                    <span className="definition-name">Gross margin</span>
                    <span className="is-confirmed definition-status">confirmed</span>
                  </div>
                  <code className="definition-formula">total profit ÷ total revenue — weighted, not an average of percentages</code>
                </div>
                <div className="definition-row">
                  <div className="definition-head">
                    <span className="definition-name">Order count</span>
                    <span className="is-review definition-status">needs review</span>
                  </div>
                  <code className="definition-formula">distinct orders — not order lines</code>
                </div>
              </div>
            </div>
            <p className="console-pane-note">Write the definition in plain language — the engine applies it everywhere</p>
          </div>
          <div className="console-pane is-accent" data-aos="fade-up" data-aos-delay="100">
            <span className="console-pane-label">Connect · your own tools over MCP</span>
            <h3 className="console-pane-title">Your context, inside the tools you already use</h3>
            <p className="console-pane-desc">One endpoint. Add it to Claude, ChatGPT or Cursor and they read your context live, with your permissions — no export, no rebuild.</p>
            <div className="endpoint-box">
              <span className="endpoint-label">A direct line to your company brain</span>
              <span className="endpoint-value">One brain. Every tool you use.</span>
            </div>
            <ol className="connect-steps">
              <li>
                <span className="connect-step-num">1</span>
                <span>Add BinarBase as an MCP server in your agent</span>
              </li>
              <li>
                <span className="connect-step-num">2</span>
                <span>Paste your endpoint and sign in</span>
              </li>
              <li>
                <span className="connect-step-num">3</span>
                <span>Your agent now knows your business — live</span>
              </li>
            </ol>
            <p className="console-pane-note">Works with Claude, ChatGPT, Cursor and any MCP-ready agent. Access follows your roles; every call is logged.</p>
          </div>
        </div>
        <div className="mcp-agents" data-aos="fade-up">
          <p className="mcp-agents-label">Works with the AI you already use</p>
          <div className="mcp-agent-list">
            <span className="mcp-agent">
              <span className="mcp-agent-mark" aria-hidden="true">✦</span>
              {" Claude"}
            </span>
            <span className="mcp-agent">
              <span className="mcp-agent-mark" aria-hidden="true">◎</span>
              {" ChatGPT"}
            </span>
            <span className="mcp-agent">
              <span className="mcp-agent-mark" aria-hidden="true">✧</span>
              {" Gemini"}
            </span>
            <span className="mcp-agent">
              <span className="mcp-agent-mark" aria-hidden="true">▶</span>
              {" Cursor"}
            </span>
            <span className="mcp-agent">
              <span className="mcp-agent-mark" aria-hidden="true">◆</span>
              {" Copilot"}
            </span>
          </div>
          <p className="mcp-agents-note">Works with Claude, ChatGPT, Cursor and any MCP-ready agent</p>
        </div>
        <div className="mcp-cards">
          <div className="mcp-card" data-aos="fade-up" data-aos-delay="0">
            <h4>Yours to take</h4>
            <p>Your definitions, knowledge and history are yours to export — whenever you want them</p>
          </div>
          <div className="mcp-card" data-aos="fade-up" data-aos-delay="100">
            <h4>One brain, every surface</h4>
            <p>Dashboards, BinarBase agents and your favourite chat AI — always in sync</p>
          </div>
        </div>
      </div>
    </section>
  )
}

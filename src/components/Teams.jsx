// Section 9 — For teams (#teams.solutions-section) incl. the ContextTreeGraph. CLONE_SPEC 13.
// Markup translated 1:1 from recon/dom-1440-clean.html; styles in src/styles/site.css.
// Tree geometry reproduces the original ContextTreeGraph formulas so coordinates match the DOM dump.
import { useState } from 'react'

const CX = 432
const CY = 330
const CORE_R = 74
const DEPT_R = 166
const LEAF_STEP_Y = 34
const LEAF_DX = 72
const LEAF_BULGE = 16

const rad = (d) => (d * Math.PI) / 180
const px = (r, d, o = CX) => o + r * Math.cos(rad(d))
const py = (r, d, o = CY) => o + r * Math.sin(rad(d))

const CORES = [
  { label: 'Definitions', deg: 0 },
  { label: 'Knowledge', deg: 90 },
  { label: 'Memory', deg: 180 },
  { label: 'Connectors', deg: 270 },
].map((c) => ({ ...c, x: px(CORE_R, c.deg), y: py(CORE_R, c.deg), below: c.deg === 90 }))

const DEPT_DEF = [
  { key: 'cfo', role: 'Finance', deg: 225, leaves: ['Invoice capture', 'Live margin', 'Cash flow forecast', 'Month-end close', 'ROI tracking'] },
  { key: 'founder', role: 'Marketing', deg: 315, leaves: ['RFM segments', 'B2B attribution', 'Measurement', 'SEO & content', 'Campaign history'] },
  { key: 'owner', role: 'Sales', deg: 135, leaves: ['Enquiry → quote', 'Code matching', 'Duplicates', 'Loss reasons', 'Public tenders'] },
  { key: 'retail', role: 'Operations', deg: 45, leaves: ['Min–max limits', 'Live stock', 'Order proposals', 'Internal transfers', 'Product data'] },
]

const DEPTS = DEPT_DEF.map((d) => ({ ...d, x: px(DEPT_R, d.deg), y: py(DEPT_R, d.deg), below: d.deg > 0 && d.deg < 180 }))

const LEAVES = DEPTS.flatMap((d) => {
  const side = d.x < CX ? -1 : 1
  return d.leaves.map((label, n) => ({
    dept: d.key,
    label,
    x: d.x + side * (LEAF_DX + LEAF_BULGE * (1 - Math.abs(n - 2) / 2)),
    y: d.y + (n - 2) * LEAF_STEP_Y,
    anchor: side < 0 ? 'end' : 'start',
  }))
})

const CORE_LINES = [
  ...CORES.map((c) => ({ dept: '', x1: CX, y1: CY, x2: c.x, y2: c.y })),
  ...DEPTS.flatMap((d) => CORES.map((c) => ({ dept: d.key, x1: d.x, y1: d.y, x2: c.x, y2: c.y }))),
]
const DEPT_LINES = DEPTS.map((d) => ({ dept: d.key, x1: CX, y1: CY, x2: d.x, y2: d.y }))
const LEAF_LINES = LEAVES.map((l) => {
  const d = DEPTS.find((x) => x.key === l.dept)
  return { dept: l.dept, x1: d.x, y1: d.y, x2: l.x, y2: l.y }
})

const cx = (...parts) => parts.filter(Boolean).join(' ')

export default function Teams() {
  // Default department is Finance ("cfo"); no auto-cycle.
  const [active, setActive] = useState('cfo')
  const dim = (key) => !!key && key !== active
  return (
    <section id="teams" className="solutions-section">
      <div className="superpowers-header">
        <div className="section-badge cyan">
          <span className="section-num">08</span>
          <div className="badge-icon-small">⚡</div>
          <span>For teams</span>
        </div>
        <h2 className="superpowers-title">
          {"Start where it hurts most. "}
          <span className="gradient-text-cyan">Then let it spread.</span>
        </h2>
        <p className="superpowers-subtitle">Most companies start with finance, because that is where a wrong number costs the most. The same brain then serves every other department without being rebuilt — it already knows the business.</p>
      </div>
      <div className="ct">
        <div className="ct-layout">
          <div className="ct-canvas">
            <svg className="ct-svg" viewBox="74 126 718 406" role="img" aria-label="Context tree: BinarBase at the centre, the shared core, and each department's own use cases">
              {CORE_LINES.map((l, i) => (
                <line key={'c' + i} className={cx('ct-line line-core', l.dept === active && 'is-on')} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
              ))}
              {DEPT_LINES.map((l, i) => (
                <line key={'d' + i} className={cx('ct-line line-dept', dim(l.dept) && 'is-dim')} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
              ))}
              {LEAF_LINES.map((l, i) => (
                <line key={'f' + i} className={cx('ct-line line-leaf', dim(l.dept) && 'is-dim')} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
              ))}
              {LEAVES.map((n, i) => (
                <g key={'lf' + i} className={cx('ct-node ct-leaf', dim(n.dept) && 'is-dim')} transform={`translate(${n.x} ${n.y})`}>
                  <circle r="3.4" />
                  <text textAnchor={n.anchor} x={n.anchor === 'end' ? -8 : 8} y="4">{n.label}</text>
                </g>
              ))}
              {CORES.map((n, i) => (
                <g key={'cr' + i} className="ct-node ct-core" transform={`translate(${n.x} ${n.y})`}>
                  <circle r="5.5" />
                  <text textAnchor="middle" y={n.below ? 20 : -12}>{n.label}</text>
                </g>
              ))}
              {DEPTS.map((n) => (
                <g
                  key={n.key}
                  className={cx('ct-node ct-dept', active === n.key && 'is-active', dim(n.key) && 'is-dim')}
                  transform={`translate(${n.x} ${n.y})`}
                  tabIndex={0}
                  role="button"
                  aria-label={n.role}
                  onMouseEnter={() => setActive(n.key)}
                  onFocus={() => setActive(n.key)}
                  onClick={() => setActive(n.key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActive(n.key)
                    }
                  }}
                >
                  <circle className="ct-dept-hit" r="26" />
                  <circle className="ct-dept-dot" r="10" />
                  <text className="ct-dept-name" textAnchor="middle" y={n.below ? 30 : -19}>{n.role}</text>
                </g>
              ))}
              <g className="ct-node ct-root" transform="translate(432 330)">
                <circle className="ct-root-dot" r="21" />
                <text className="ct-root-label" textAnchor="middle" y="42">Your Company Context</text>
              </g>
            </svg>
          </div>
          <div className="ct-detail-stack">
            <aside className={cx('ct-detail', active === 'cfo' && 'is-shown')} aria-hidden={active !== 'cfo'}>
              <div className="ct-detail-head">
                <span className="ct-detail-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18M7 14l3.5-3.5 3 3L21 7" />
                  </svg>
                </span>
                <h3 className="ct-detail-role">Finance</h3>
                <span className="ct-detail-stage">Start here</span>
              </div>
              <p className="ct-detail-tagline">Invoices, margin and cash flow without the manual month</p>
              <div className="ct-detail-pain">
                <span className="ct-detail-label">Today:</span>
                <p>Thousands of supplier invoices keyed in by hand, margin visible only after the fact, and forecasts rebuilt in spreadsheets every cycle.</p>
              </div>
              <span className="ct-detail-label is-good">With BinarBase:</span>
              <ul className="ct-detail-list">
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Supplier invoices read, matched and posted automatically</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Live margin per order, product and customer</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Cash flow and demand forecast on your own definitions</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>{"Month-end that doesn't depend on one person's spreadsheet"}</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Every automation measured against real return</span>
                </li>
              </ul>
            </aside>
            <aside className={cx('ct-detail', active === 'founder' && 'is-shown')} aria-hidden={active !== 'founder'}>
              <div className="ct-detail-head">
                <span className="ct-detail-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11v2a1 1 0 001 1h2l4 4V6L6 10H4a1 1 0 00-1 1zM16 8a5 5 0 010 8" />
                  </svg>
                </span>
                <h3 className="ct-detail-role">Marketing</h3>
              </div>
              <p className="ct-detail-tagline">Spend you can defend, in a funnel that actually attributes</p>
              <div className="ct-detail-pain">
                <span className="ct-detail-label">Today:</span>
                <p>Budget spent without measurement in place, no segmentation, and attribution that never worked for a B2B buying cycle.</p>
              </div>
              <span className="ct-detail-label is-good">With BinarBase:</span>
              <ul className="ct-detail-list">
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>RFM segmentation on your own customer history</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Attribution that fits B2B, not just last click</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Measurement set up properly before the spend starts</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>SEO and content drafted from your real product data</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Campaign history the whole team can query</span>
                </li>
              </ul>
            </aside>
            <aside className={cx('ct-detail', active === 'owner' && 'is-shown')} aria-hidden={active !== 'owner'}>
              <div className="ct-detail-head">
                <span className="ct-detail-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 20v-6M10 20V8M16 20v-9M22 20V4" />
                  </svg>
                </span>
                <h3 className="ct-detail-role">Sales</h3>
              </div>
              <p className="ct-detail-tagline">Quotes in minutes instead of days — and a reason for every loss</p>
              <div className="ct-detail-pain">
                <span className="ct-detail-label">Today:</span>
                <p>Enquiries arrive as PDFs, e-mails and scans, then get retyped line by line while the best opportunities go cold.</p>
              </div>
              <span className="ct-detail-label is-good">With BinarBase:</span>
              <ul className="ct-detail-list">
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Unstructured enquiries turned into priced quotes automatically</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Supplier product codes matched to your own catalogue</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Duplicate enquiries for the same project flagged</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Every lost quote captured, with the reason why</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Public tenders surfaced instead of missed</span>
                </li>
              </ul>
            </aside>
            <aside className={cx('ct-detail', active === 'retail' && 'is-shown')} aria-hidden={active !== 'retail'}>
              <div className="ct-detail-head">
                <span className="ct-detail-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3.2" />
                    <path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7M18.4 18.4l-1.7-1.7M7.3 7.3L5.6 5.6" />
                  </svg>
                </span>
                <h3 className="ct-detail-role">Operations</h3>
              </div>
              <p className="ct-detail-tagline">Stock, ordering and transfers that run themselves</p>
              <div className="ct-detail-pain">
                <span className="ct-detail-label">Today:</span>
                <p>Min–max limits maintained in Excel, a six-hour export before anyone can look at stock, and people tied up entirely by internal transfers.</p>
              </div>
              <span className="ct-detail-label is-good">With BinarBase:</span>
              <ul className="ct-detail-list">
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Min–max stock limits maintained automatically</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Stock levels on demand, not after an overnight export</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Purchase orders and internal transfers proposed for approval</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Supplier price lists consolidated into consistent product data</span>
                </li>
                <li>
                  <span className="ct-bullet" aria-hidden="true" />
                  <span>Product cards completed with the attributes that are missing</span>
                </li>
              </ul>
            </aside>
          </div>
        </div>
        <p className="ct-note">Hover a department to see what it inherits from the core — and what it adds on top.</p>
      </div>
      <div className="superpowers-heading" data-aos="fade-up">
        <h3 className="superpowers-heading-title">
          {"Trust isn't a feature. "}
          <span className="gradient-text">{"It's the whole point."}</span>
        </h3>
      </div>
      <div className="superpowers-row">
        <div className="superpower-item">
          <div className="blue superpower-icon">
            <span>🧠</span>
          </div>
          <div className="superpower-content">
            <h4>Every number shows its work</h4>
            <p>Definition, source and period — on demand, for any figure</p>
          </div>
        </div>
        <div className="superpower-item">
          <div className="cyan superpower-icon">
            <span>⚡</span>
          </div>
          <div className="superpower-content">
            <h4>It asks instead of guessing</h4>
            <p>No confirmed definition? It asks you rather than faking a confident answer</p>
          </div>
        </div>
        <div className="superpower-item">
          <div className="emerald superpower-icon">
            <span>🔮</span>
          </div>
          <div className="superpower-content">
            <h4>Role-based by design</h4>
            <p>People see only what they should, and every access is logged</p>
          </div>
        </div>
        <div className="superpower-item">
          <div className="amber superpower-icon">
            <span>🛡️</span>
          </div>
          <div className="superpower-content">
            <h4>Enterprise security</h4>
            <p>Data encrypted in transit and at rest, GDPR ready</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Section 7 — Deployment (#deployment.deploy-section). CLONE_SPEC 11.
// Markup translated 1:1 from recon/dom-1440-clean.html; styles in src/styles/site.css.
import { useEffect, useRef, useState } from 'react'

const MODES = ['cloud', 'private', 'onprem']

const MODE = {
  cloud: {
    name: 'BinarBase Cloud',
    boundary: 'Your network',
    location: 'BinarBase EU cloud',
    models: 'Claude · ChatGPT · Gemini',
    modelsSub: 'leading cloud models',
    desc: 'We host and run everything. The fastest way to start: live the same day.',
    span: 1,
    links: ['out', 'out'],
    mail: 'mailto:info@binarbase.com?subject=BinarBase%20deployment%3A%20BinarBase%20Cloud',
  },
  private: {
    name: 'Private cloud',
    boundary: 'Your cloud account',
    location: 'Your cloud account',
    models: 'Cloud or private models',
    modelsSub: 'your choice',
    desc: 'A dedicated BinarBase instance in your own cloud account and region, under your security rules.',
    span: 3,
    links: ['in', 'opt'],
    mail: 'mailto:info@binarbase.com?subject=BinarBase%20deployment%3A%20Private%20cloud',
  },
  onprem: {
    name: 'On-premise · local AI',
    boundary: 'Your building',
    location: 'Your servers',
    models: 'Local open models',
    modelsSub: 'on your own GPUs',
    desc: 'BinarBase and open AI models run on your own hardware. Nothing has to leave your building, and it can run fully offline.',
    span: 5,
    links: ['in', 'in'],
    mail: 'mailto:info@binarbase.com?subject=BinarBase%20deployment%3A%20On-premise%20%C2%B7%20local%20AI',
  },
}

const LINK_TAG = { out: 'leaves your network', in: 'stays inside', opt: 'only if you choose' }

const MARK_PATH = { out: 'M7 13l6-6M8 7h5v5', in: 'M5 10.5l3.5 3.5L15 7', opt: 'M6 10h8' }

// "What leaves your network?" rows: [label, { mode: [state, text] }]
const DATA_ROWS = [
  ['Your data and documents', {
    cloud: ['out', 'Stored in our EU cloud'],
    private: ['in', 'Stays in your cloud account'],
    onprem: ['in', 'Stays on your servers'],
  }],
  ['Company Context (definitions, memory)', {
    cloud: ['out', 'Stored in our EU cloud'],
    private: ['in', 'Stays in your cloud account'],
    onprem: ['in', 'Stays on your servers'],
  }],
  ['Questions and answers', {
    cloud: ['out', 'Processed by our AI provider'],
    private: ['opt', 'Only if you choose a cloud model'],
    onprem: ['in', 'Stay on your servers'],
  }],
]

// "Running it" rows
const PLAIN_ROWS = [
  ['Who runs it', { cloud: 'BinarBase', private: 'BinarBase together with your IT', onprem: 'Your IT, with our support' }],
  ['Works offline', { cloud: 'No', private: 'No', onprem: 'Yes, fully offline is possible' }],
  ['Best for', {
    cloud: 'Most companies that want to start now',
    private: 'Companies with their own cloud and strict security rules',
    onprem: 'Banks, insurance, healthcare, manufacturing, public sector',
  }],
]

const reducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Mirrors Vue's <Transition name="dp-fade"> class sequence (.35s, timing lives in site.css).
// outIn=true -> mode="out-in"; false -> default mode (leave and enter overlap).
const FADE_MS = 350
const LEAVE_FROM = 'dp-fade-leave-from dp-fade-leave-active'
const LEAVE_TO = 'dp-fade-leave-active dp-fade-leave-to'
const ENTER_FROM = 'dp-fade-enter-from dp-fade-enter-active'
const ENTER_TO = 'dp-fade-enter-active dp-fade-enter-to'

function useFadeSwap(key, outIn) {
  const [items, setItems] = useState([{ key, cls: '' }])
  const shown = useRef(key)
  const gen = useRef(0)

  useEffect(() => {
    if (shown.current === key) return
    const old = shown.current
    shown.current = key
    const g = ++gen.current
    const live = (fn) => () => g === gen.current && fn()
    const nextFrame = (fn) => requestAnimationFrame(() => requestAnimationFrame(live(fn)))
    const later = (fn) => setTimeout(live(fn), FADE_MS)

    if (reducedMotion()) {
      setItems([{ key, cls: '' }])
      return
    }
    const enter = () => {
      setItems([{ key, cls: ENTER_FROM }])
      nextFrame(() => setItems([{ key, cls: ENTER_TO }]))
      later(() => setItems([{ key, cls: '' }]))
    }
    if (outIn) {
      setItems([{ key: old, cls: LEAVE_FROM }])
      nextFrame(() => setItems([{ key: old, cls: LEAVE_TO }]))
      later(enter)
    } else {
      setItems([{ key: old, cls: LEAVE_FROM }, { key, cls: ENTER_FROM }])
      nextFrame(() => setItems([{ key: old, cls: LEAVE_TO }, { key, cls: ENTER_TO }]))
      later(() => setItems([{ key, cls: '' }]))
    }
  }, [key, outIn])

  return items
}

const cx = (...parts) => parts.filter(Boolean).join(' ')

export default function Deployment() {
  const [mode, setMode] = useState('cloud')
  const rootRef = useRef(null)
  const timer = useRef(null)
  const userPicked = useRef(false)

  const stop = () => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
  }

  // Auto-cycle every 4500ms while the section is in view (IO threshold .35 on the section root,
  // as in the original DeploymentOptions component). Any user pick stops it permanently.
  useEffect(() => {
    if (reducedMotion()) return undefined
    const start = () => {
      if (userPicked.current || timer.current) return
      timer.current = setInterval(() => {
        setMode((m) => MODES[(MODES.indexOf(m) + 1) % MODES.length])
      }, 4500)
    }
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), { threshold: 0.35 })
    if (rootRef.current) io.observe(rootRef.current)
    return () => {
      stop()
      io.disconnect()
    }
  }, [])

  const pick = (m) => {
    userPicked.current = true
    stop()
    setMode(m)
  }

  const cur = MODE[mode]
  const boundaryItems = useFadeSwap(mode, false)
  const whereItems = useFadeSwap(mode, true)
  const modelsItems = useFadeSwap(mode, true)
  const captionItems = useFadeSwap(mode, true)

  return (
    <section id="deployment" className="deploy-section" ref={rootRef}>
      <div className="section-container">
        <div className="section-header">
          <div className="section-badge">
            <span className="section-num">06</span>
            <span>Where it runs</span>
          </div>
          <h2 className="section-title">
            One brain.
            <br />
            <span className="gradient-text">Runs where you decide.</span>
          </h2>
          <p className="section-subtitle">Your Company Context is the same everywhere: your definitions, knowledge and memory. You only choose where it runs: in our EU cloud, in your own cloud, or on your own servers with local AI models.</p>
        </div>
        <div className="dp-switch" role="radiogroup" aria-label="Where it runs">
          {MODES.map((m) => (
            <button key={m} type="button" role="radio" className={cx('dp-switch-btn', mode === m && 'active')} aria-checked={mode === m} onClick={() => pick(m)}>
              {MODE[m].name}
            </button>
          ))}
        </div>
        <div className={cx('dp-diagram', `is-${mode}`)} role="img" aria-label={`Diagram: where your data and the AI models run in the selected setup: ${cur.name}`}>
          {boundaryItems.map(({ key, cls }) => (
            <div key={key} className={cx('dp-boundary', `span-${MODE[key].span}`, cls)}>
              <span className="dp-boundary-label">{MODE[key].boundary}</span>
            </div>
          ))}
          <div className="dp-node dp-systems">
            <p className="dp-node-title">Your systems</p>
            <ul className="dp-chips">
              <li>ERP & accounting</li>
              <li>CRM</li>
              <li>E-shop</li>
              <li>Documents</li>
            </ul>
          </div>
          <div className={cx('dp-link dp-link-a', cur.links[0])}>
            <i aria-hidden="true" />
            <span className="dp-link-tag">{LINK_TAG[cur.links[0]]}</span>
          </div>
          <div className="dp-node dp-brain">
            {whereItems.map(({ key, cls }) => (
              <span key={key} className={cx('dp-where', cls)}>{MODE[key].location}</span>
            ))}
            <div className="dp-orb" aria-hidden="true">
              <svg viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="30" />
                <path d="M18 34l14-12 18 6 12 14-8 18-20 4-14-12zM32 22l2 22 16-16M18 34l16 10 20 14M34 44l28-2" />
              </svg>
            </div>
            <p className="dp-node-title">Company Context</p>
            <p className="dp-node-sub">definitions · knowledge · memory</p>
          </div>
          <div className={cx('dp-link dp-link-b', cur.links[1])}>
            <i aria-hidden="true" />
            <span className="dp-link-tag">{LINK_TAG[cur.links[1]]}</span>
          </div>
          <div className="dp-node dp-models">
            <p className="dp-node-title">AI models</p>
            {modelsItems.map(({ key, cls }) => (
              <div key={key} className={cls || undefined}>
                <p className="dp-models-name">{MODE[key].models}</p>
                <p className="dp-node-sub">{MODE[key].modelsSub}</p>
              </div>
            ))}
          </div>
        </div>
        {captionItems.map(({ key, cls }) => (
          <p key={key} className={cx('dp-caption', cls)}>
            <strong>{MODE[key].name}</strong>
            {' ' + MODE[key].desc}
          </p>
        ))}
        <div className="dp-leaves">
          <div className="dp-table" role="table" aria-label="The three setups side by side">
            <div className="dp-tr dp-thead" role="row">
              <span role="columnheader" />
              {MODES.map((m) => (
                <button key={m} type="button" role="columnheader" className={cx('dp-colhead', mode === m && 'active')} onClick={() => pick(m)}>
                  <span className="dp-available">Available now</span>
                  {' ' + MODE[m].name}
                </button>
              ))}
            </div>
            <div className="dp-tr dp-group" role="row">
              <span role="rowheader">What leaves your network?</span>
            </div>
            {DATA_ROWS.map(([label, cells]) => (
              <div key={label} className="dp-tr" role="row">
                <span role="rowheader" className="dp-rowhead">{label}</span>
                {MODES.map((m) => {
                  const [state, text] = cells[m]
                  return (
                    <span key={m} role="cell" className={cx('dp-cell', state, mode === m && 'active')} data-col={MODE[m].name}>
                      <span className="dp-mark" aria-hidden="true">
                        <svg viewBox="0 0 20 20">
                          <path d={MARK_PATH[state]} />
                        </svg>
                      </span>
                      {' ' + text}
                    </span>
                  )
                })}
              </div>
            ))}
            <div className="dp-tr dp-group" role="row">
              <span role="rowheader">Running it</span>
            </div>
            {PLAIN_ROWS.map(([label, cells]) => (
              <div key={label} className="dp-tr" role="row">
                <span role="rowheader" className="dp-rowhead">{label}</span>
                {MODES.map((m) => (
                  <span key={m} role="cell" className={cx('dp-cell dp-plain', mode === m && 'active')} data-col={MODE[m].name}>{cells[m]}</span>
                ))}
              </div>
            ))}
            <div className="dp-tr dp-ctas" role="row">
              <span role="rowheader" />
              {MODES.map((m) => (
                <span key={m} role="cell" className={cx('dp-cell dp-plain', mode === m && 'active')}>
                  <a className="dp-cta" href={MODE[m].mail}>
                    {'Book a call '}
                    <span className="dp-cta-mode">{MODE[m].name}</span>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </span>
              ))}
            </div>
          </div>
          <p className="dp-note">
            {'Connecting an outside AI such as ChatGPT or Claude over MCP shares what it reads with that provider, in any setup. For a fully local setup, use local models. Details on our AI providers: '}
            <a href="/subprocessors">Sub-processors</a>
          </p>
        </div>
        <div className="dp-local">
          <h3>Why a smaller local model is enough</h3>
          <p>{"Local models are smaller than the big cloud ones. With your Company Context they don't have to guess what revenue means: they answer from your confirmed definitions and show where every number comes from."}</p>
        </div>
      </div>
    </section>
  )
}

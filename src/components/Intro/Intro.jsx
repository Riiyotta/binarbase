import { useCallback, useEffect, useRef, useState } from 'react'
import { CHAPTERS, UI, SCENE_STRINGS, cardFor } from './strings.js'
import './intro.css'

const LAST = CHAPTERS.length - 1
const WHEEL_GAP_MS = 180 // accumulator resets after this pause
const WHEEL_STEP_PX = 30
const STEP_LOCK_MS = 650
const INERTIA_MS = 900
const SWIPE_PX = 45

const ChevronLeft = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
)
const ChevronRight = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
)
const ArrowDown = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
)
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
)

export default function Intro() {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const labelsRef = useRef(null)
  const storyRef = useRef(null)
  const sceneRef = useRef(null)

  const [chapter, setChapterState] = useState(0) // drives progress + scene
  const [shown, setShown] = useState(0) // chapter whose text is rendered
  const [out, setOut] = useState(true) // .sbi-story.out
  const [ready, setReady] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const [failed, setFailed] = useState(false)
  const [card, setCard] = useState(null)

  // Mutable mirrors for window-level handlers.
  const chapterRef = useRef(0)
  const readyRef = useRef(false)
  const cardRef = useRef(null)
  const reduceRef = useRef(false)
  const swapTimer = useRef(0)
  cardRef.current = card

  const goTo = useCallback((target, initial = false) => {
    const next = Math.min(LAST, Math.max(0, target))
    if (next === chapterRef.current && !initial) return
    chapterRef.current = next
    setChapterState(next)
    setCard(null)
    sceneRef.current?.setChapter(next)
    clearTimeout(swapTimer.current)
    setOut(true)
    const delay = reduceRef.current ? 0 : initial ? 1600 : 420
    swapTimer.current = setTimeout(() => {
      setShown(next)
      setOut(false)
    }, delay)
  }, [])

  const updateOccluder = useCallback(() => {
    const story = storyRef.current
    const root = rootRef.current
    if (!story || !root || !sceneRef.current) return
    const s = story.getBoundingClientRect()
    const r = root.getBoundingClientRect()
    const pad = 24
    sceneRef.current.setOccluder({
      left: s.left - r.left - pad,
      top: s.top - r.top - pad,
      right: s.right - r.left + pad,
      bottom: s.bottom - r.top + pad,
    })
  }, [])

  // Re-measure the text block whenever its content swaps.
  useEffect(() => { updateOccluder() }, [shown, updateOccluder])

  const skip = useCallback(() => {
    const el = rootRef.current
    if (!el) return
    window.scrollTo({ top: el.offsetTop + el.offsetHeight, behavior: reduceRef.current ? 'auto' : 'smooth' })
  }, [])

  // ---- scene lifecycle + global listeners ----
  useEffect(() => {
    let disposed = false
    const root = rootRef.current
    let io = null

    // Nav dark mode + "at top" flag (rAF-throttled). Idempotent: toggle(cls, bool).
    let scrollQueued = false
    const onScroll = () => {
      if (scrollQueued) return
      scrollQueued = true
      requestAnimationFrame(() => {
        scrollQueued = false
        setAtTop(window.scrollY <= 2)
        if (!rootRef.current || root.classList.contains('sbi--failed')) return
        const navH = document.querySelector('.nav-glass')?.offsetHeight ?? 70
        document.documentElement.classList.toggle('sbi-dark', rootRef.current.getBoundingClientRect().bottom > navH)
      })
    }

    // Wheel stepping.
    let lastWheel = 0
    let mode = 'page'
    let acc = 0
    let swallow = false
    let lockUntil = 0
    let inertiaUntil = 0
    let lastDir = 0
    const onWheel = (e) => {
      if (!readyRef.current) return
      const now = performance.now()
      const gap = now - lastWheel
      lastWheel = now
      const mult = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1
      const dx = e.deltaX * mult
      const dy = e.deltaY * mult
      const d = Math.abs(dx) > Math.abs(dy) ? dx : dy
      if (d === 0) return
      if (gap > WHEEL_GAP_MS) {
        acc = 0
        swallow = false
        const top = window.scrollY <= 2
        if (top && now < inertiaUntil && Math.sign(d) === lastDir) {
          mode = 'intro'
          swallow = true
        } else {
          const ch = chapterRef.current
          mode = top && (d > 0 ? ch < LAST : ch > 0) ? 'intro' : 'page'
        }
      }
      if (mode === 'page') return
      e.preventDefault()
      if (swallow) {
        inertiaUntil = Math.max(inertiaUntil, now + 350)
        return
      }
      acc += d
      if (Math.abs(acc) >= WHEEL_STEP_PX && now >= lockUntil) {
        swallow = true
        lastDir = Math.sign(acc)
        lockUntil = now + STEP_LOCK_MS
        inertiaUntil = now + INERTIA_MS
        goTo(chapterRef.current + lastDir)
      }
    }

    // Touch swipe.
    let touch = null
    const onTouchStart = (e) => {
      if (e.touches.length !== 1) { touch = null; return }
      touch = { x: e.touches[0].clientX, y: e.touches[0].clientY, top: window.scrollY <= 2 }
    }
    const onTouchEnd = (e) => {
      if (!touch || !readyRef.current) return
      const t = touch
      touch = null
      if (!t.top) return
      const dx = e.changedTouches[0].clientX - t.x
      const dy = e.changedTouches[0].clientY - t.y
      const d = Math.abs(dx) > Math.abs(dy) ? dx : dy
      if (Math.abs(d) < SWIPE_PX) return
      const dir = d < 0 ? 1 : -1
      if (dir > 0 && chapterRef.current === LAST) return
      goTo(chapterRef.current + dir)
    }

    // Keys.
    const onKey = (e) => {
      if (!readyRef.current || e.altKey || e.ctrlKey || e.metaKey) return
      const t = e.target
      if ((t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || window.scrollY > 2) return
      const fwd = ['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)
      const back = ['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)
      if (e.key === ' ' && t && /^(BUTTON|A)$/.test(t.tagName)) return
      if (e.key === 'Escape') { setCard(null); return }
      const ch = chapterRef.current
      if (fwd && ch < LAST) { e.preventDefault(); goTo(ch + 1) }
      else if (back && ch > 0) { e.preventDefault(); goTo(ch - 1) }
    }

    reduceRef.current = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const compact = Math.min(window.innerWidth, window.innerHeight) < 600

    import('./scene.js')
      .then(({ createSecondBrainScene }) => {
        if (disposed || !canvasRef.current || !labelsRef.current) return
        try {
          sceneRef.current = createSecondBrainScene(canvasRef.current, labelsRef.current, SCENE_STRINGS, {
            reduce: reduceRef.current,
            compact,
          })
        } catch (err) {
          console.warn('[SecondBrainIntro] disabled:', err)
          setFailed(true)
          document.documentElement.classList.remove('sbi-dark')
          return
        }
        readyRef.current = true
        setReady(true)
        goTo(0, true)
        window.addEventListener('wheel', onWheel, { passive: false })
        window.addEventListener('keydown', onKey)
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', updateOccluder)
        root.addEventListener('touchstart', onTouchStart, { passive: true })
        root.addEventListener('touchend', onTouchEnd, { passive: true })
        onScroll()
        // Render only while the section is on screen.
        io = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) sceneRef.current?.start()
          else sceneRef.current?.stop()
        })
        io.observe(root)
      })
      .catch((err) => {
        console.warn('[SecondBrainIntro] disabled:', err)
        if (!disposed) setFailed(true)
      })

    return () => {
      disposed = true
      readyRef.current = false
      io?.disconnect()
      clearTimeout(swapTimer.current)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateOccluder)
      root.removeEventListener('touchstart', onTouchStart)
      root.removeEventListener('touchend', onTouchEnd)
      document.documentElement.classList.remove('sbi-dark')
      sceneRef.current?.dispose()
      sceneRef.current = null
    }
  }, [goTo, updateOccluder])

  // ---- canvas pointer: click picks / advances, mouse drag orbits ----
  const ptr = useRef(null)
  const onPointerDown = (e) => {
    ptr.current = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, mouse: e.pointerType === 'mouse', moved: false }
    if (ptr.current.mouse) {
      try { canvasRef.current?.setPointerCapture(e.pointerId) } catch { /* noop */ }
    }
  }
  const onPointerMove = (e) => {
    const p = ptr.current
    if (!p) return
    if (Math.abs(e.clientX - p.x) + Math.abs(e.clientY - p.y) > 10) p.moved = true
    if (p.moved && p.mouse) {
      sceneRef.current?.setDragging(true)
      sceneRef.current?.orbit(e.clientX - p.lx, e.clientY - p.ly)
    }
    p.lx = e.clientX
    p.ly = e.clientY
  }
  const onPointerUp = (e) => {
    const p = ptr.current
    ptr.current = null
    sceneRef.current?.setDragging(false)
    if (!p || p.moved) return
    const id = sceneRef.current?.pick(e.clientX, e.clientY)
    if (id) { setCard(cardFor(id)); return }
    if (cardRef.current) { setCard(null); return }
    if (chapterRef.current < LAST) goTo(chapterRef.current + 1)
  }
  const onPointerCancel = () => {
    ptr.current = null
    sceneRef.current?.setDragging(false)
  }

  const text = CHAPTERS[shown]
  const lockTouch = ready && atTop && chapter < LAST

  return (
    <section
      ref={rootRef}
      className={'sbi' + (failed ? ' sbi--failed' : '')}
      style={{ touchAction: lockTouch ? 'none' : 'pan-y' }}
      aria-roledescription="carousel"
      aria-labelledby="sbi-title"
    >
      <canvas
        ref={canvasRef}
        className="sbi-canvas"
        role="img"
        aria-label={UI.canvasLabel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      />
      <div ref={labelsRef} className="sbi-labels" aria-hidden="true" />

      <div ref={storyRef} className={'sbi-story' + (out ? ' out' : '')} aria-live="polite">
        <h2 id="sbi-title">{text.title}</h2>
        <p className="sbi-body">{text.body}</p>
        {text.extra && <p className="sbi-extra">{text.extra}</p>}
        {shown === LAST && (
          <div className="sbi-cta">
            <a href="https://app.binarbase.com/signup" className="sbi-btn sbi-btn--primary">{UI.primaryCta}</a>
            <button type="button" className="sbi-btn" onClick={skip}>
              {UI.explore} <ArrowDown />
            </button>
          </div>
        )}
      </div>

      {card && (
        <aside className="sbi-card" aria-live="polite">
          <button type="button" className="sbi-close" aria-label={UI.close} onClick={() => setCard(null)}>
            <CloseIcon />
          </button>
          <h3>{card.title}</h3>
          <p>{card.text}</p>
        </aside>
      )}

      <div className="sbi-bottom">
        <nav className="sbi-progress" aria-label={UI.chaptersLabel}>
          {CHAPTERS.map((c, i) => (
            <button
              key={i}
              type="button"
              className={'sbi-seg' + (i < chapter ? ' done' : '') + (i === chapter ? ' current' : '')}
              aria-label={`${i + 1}: ${c.title}`}
              aria-current={i === chapter ? 'step' : undefined}
              onClick={() => goTo(i)}
            >
              <i />
            </button>
          ))}
          <span className="sbi-count">{chapter + 1} / {CHAPTERS.length}</span>
          <span className={'sbi-cue' + (chapter !== 0 || !ready ? ' hidden' : '')} aria-hidden="true">
            <i />
            {UI.scrollHint}
          </span>
        </nav>
        <div className="sbi-controls">
          <p className="sbi-hint">{UI.hint}</p>
          {chapter !== LAST && (
            <button type="button" className="sbi-skip" onClick={skip}>{UI.skip}</button>
          )}
          <button
            type="button"
            className="sbi-round"
            aria-label={UI.prev}
            disabled={chapter === 0}
            onClick={() => goTo(chapterRef.current - 1)}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="sbi-round sbi-round--primary"
            aria-label={chapter === LAST ? UI.explore : UI.next}
            onClick={() => (chapterRef.current === LAST ? skip() : goTo(chapterRef.current + 1))}
          >
            {chapter === LAST ? <ArrowDown /> : <ChevronRight />}
          </button>
        </div>
      </div>
    </section>
  )
}

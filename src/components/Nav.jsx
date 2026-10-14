// Navbar (nav.nav-glass) + mobile drawer (.mobile-menu). CLONE_SPEC 3.
// Markup translated 1:1 from recon/dom-1440-clean.html; styles in src/styles/site.css.
import { useEffect, useState } from 'react'

const LANGS = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sk', name: 'Slovensky', flag: '🇸🇰' },
  { code: 'cs', name: 'Cesky', flag: '🇨🇿' },
]

export default function Nav() {
  const [langOpen, setLangOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  // Only English copy exists in the clone; the selection is tracked for the active state only.
  const [lang, setLang] = useState('en')
  const current = LANGS.find((l) => l.code === lang)

  // Close the language dropdown on any click outside .lang-selector (original document listener).
  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest('.lang-selector')) setLangOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  // --header-h / --hero-h custom properties (ResizeObserver on .nav-glass and .hero, resize, fonts.ready).
  useEffect(() => {
    const update = () => {
      const nav = document.querySelector('.nav-glass')
      const bottom = nav ? nav.getBoundingClientRect().bottom : 0
      if (bottom > 0) document.documentElement.style.setProperty('--header-h', `${Math.round(bottom)}px`)
      const hero = document.querySelector('.hero')
      if (hero) {
        const h = Math.round(hero.getBoundingClientRect().height)
        if (h > 0) document.documentElement.style.setProperty('--hero-h', `${h}px`)
      }
    }
    update()
    const ro = new ResizeObserver(update)
    const nav = document.querySelector('.nav-glass')
    const hero = document.querySelector('.hero')
    if (nav) ro.observe(nav)
    if (hero) ro.observe(hero)
    window.addEventListener('resize', update)
    document.fonts?.ready.then(update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [])

  // html.sbi-dark while the intro's bottom edge is below the nav (rAF-throttled scroll handler).
  useEffect(() => {
    let queued = false
    const check = () => {
      queued = false
      const sbi = document.querySelector('section.sbi')
      if (!sbi || sbi.classList.contains('sbi--failed')) {
        document.documentElement.classList.remove('sbi-dark')
        return
      }
      const navH = document.querySelector('.nav-glass')?.offsetHeight ?? 70
      document.documentElement.classList.toggle('sbi-dark', sbi.getBoundingClientRect().bottom > navH)
    }
    const onScroll = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      document.documentElement.classList.remove('sbi-dark')
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const pickLang = (code) => {
    setLang(code)
    setLangOpen(false)
  }

  return (
    <>
      <nav className="nav-glass">
        <div className="nav-container">
          <div className="nav-brand">
            <img src="/assets/logo.svg" alt="BinarBase" className="brand-logo" />
          </div>
          <div className="nav-links">
            <a href="#how-it-works" className="nav-link">How it works</a>
            <a href="#product" className="nav-link">Product</a>
            <a href="#teams" className="nav-link">Solutions</a>
            <a href="#pricing" className="nav-link">Pricing</a>
            <a href="/insights" className="nav-link">Insights</a>
          </div>
          <div className="nav-actions">
            <div className="lang-selector">
              <button className="lang-button" onClick={() => setLangOpen((v) => !v)}>
                <span className="lang-flag">{current.flag}</span>
                <span className="lang-code">{current.code.toUpperCase()}</span>
                <svg className={langOpen ? 'lang-chevron rotate' : 'lang-chevron'} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {langOpen && (
                <div className="lang-dropdown">
                  {LANGS.map((l) => (
                    <button key={l.code} onClick={() => pickLang(l.code)} className={l.code === lang ? 'lang-option active' : 'lang-option'}>
                      <span className="lang-flag">{l.flag}</span>
                      <span>{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <a href="https://app.binarbase.com/login" className="nav-signin">Sign In</a>
            <a href="https://app.binarbase.com/signup" className="nav-cta">
              <span>Get Started</span>
              <div className="cta-glow" />
            </a>
            <button className={menuOpen ? 'mobile-menu-btn active' : 'mobile-menu-btn'} onClick={() => setMenuOpen((v) => !v)}>
              <span className="hamburger-line" />
              <span className="hamburger-line" />
              <span className="hamburger-line" />
            </button>
          </div>
        </div>
      </nav>
      <div className={menuOpen ? 'mobile-menu open' : 'mobile-menu'}>
        <div className="mobile-menu-overlay" onClick={closeMenu} />
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <div className="nav-brand">
              <img src="/assets/logo.svg" alt="BinarBase" className="brand-logo" />
            </div>
            <button className="mobile-menu-close" onClick={closeMenu}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="mobile-nav-links">
            <a href="#how-it-works" className="mobile-nav-link" onClick={closeMenu}>How it works</a>
            <a href="#product" className="mobile-nav-link" onClick={closeMenu}>Product</a>
            <a href="#teams" className="mobile-nav-link" onClick={closeMenu}>Solutions</a>
            <a href="#pricing" className="mobile-nav-link" onClick={closeMenu}>Pricing</a>
            <a href="/insights" className="mobile-nav-link" onClick={closeMenu}>Insights</a>
          </nav>
          <div className="mobile-menu-divider" />
          <div className="mobile-lang-section">
            <span className="mobile-lang-label">Language</span>
            <div className="mobile-lang-options">
              {LANGS.map((l) => (
                <button key={l.code} onClick={() => pickLang(l.code)} className={l.code === lang ? 'active mobile-lang-option' : 'mobile-lang-option'}>
                  <span className="lang-flag">{l.flag}</span>
                  <span>{l.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mobile-menu-divider" />
          <div className="mobile-menu-actions">
            <a href="https://app.binarbase.com/login" className="mobile-signin" onClick={closeMenu}>Sign In</a>
            <a href="https://app.binarbase.com/signup" className="mobile-cta" onClick={closeMenu}>Get Started</a>
          </div>
        </div>
      </div>
    </>
  )
}

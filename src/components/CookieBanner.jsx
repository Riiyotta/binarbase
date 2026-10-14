// Cookie banner (.cookie-consent), teleported to <body> like the original. CLONE_SPEC 15.
// Styles in src/styles/site.css (from entry.qOVbJ9mW.css).
// The choice is stored in the same cookie the original uses (bb_cookie_consent, 1 year, SameSite=Lax).
// The original loads GA/GTM/PostHog on "allow"; the clone intentionally loads no third-party scripts.
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const COOKIE = 'bb_cookie_consent'
const MAX_AGE = 3600 * 24 * 365

const readConsent = () => {
  const m = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`))
  return m ? decodeURIComponent(m[1]) : null
}

export default function CookieBanner() {
  // Rendered only after mount (client-only, as in the original).
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(readConsent() === null)
  }, [])

  const choose = (value) => {
    document.cookie = `${COOKIE}=${encodeURIComponent(value)}; max-age=${MAX_AGE}; path=/; SameSite=Lax`
    setOpen(false)
  }

  if (!open) return null

  return createPortal(
    <div className="cookie-consent" role="dialog" aria-modal="false" aria-label="We use cookies">
      <div className="cookie-consent-inner">
        <div className="cookie-consent-text">
          <p className="cookie-consent-title">We use cookies</p>
          <p className="cookie-consent-body">
            {'Strictly necessary cookies keep this site running. We would also like to measure how the site is used, and to measure our advertising. Neither happens unless you agree, and you can change your mind at any time. '}
            <a href="/cookies-policy">Read our Cookies Policy</a>
          </p>
        </div>
        <div className="cookie-consent-actions">
          <button type="button" className="cookie-btn cookie-btn-secondary" onClick={() => choose('none')}>Necessary only</button>
          <button type="button" className="cookie-btn cookie-btn-secondary" onClick={() => choose('analytics')}>Allow measurement</button>
          <button type="button" className="cookie-btn cookie-btn-primary" onClick={() => choose('all')}>Allow all</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

import { useEffect } from 'react'
import Aurora from './components/Aurora.jsx'
import Nav from './components/Nav.jsx'
import Intro from './components/Intro/Intro.jsx'
import Hero from './components/Hero.jsx'
import Upgraded from './components/Upgraded.jsx'
import Connectors from './components/Connectors.jsx'
import Engine from './components/Engine.jsx'
import Console from './components/Console.jsx'
import Showcase from './components/Showcase.jsx'
import Deployment from './components/Deployment.jsx'
import Proof from './components/Proof.jsx'
import Teams from './components/Teams.jsx'
import Pricing from './components/Pricing.jsx'
import FinalCta from './components/FinalCta.jsx'
import Footer from './components/Footer.jsx'
import CookieBanner from './components/CookieBanner.jsx'

// Scroll reveal: same contract as the original page — every [data-aos] gets .aos-animate once
// (never removed) when it intersects; the transition itself lives in site.css ([data-aos] rules).
function useScrollReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('aos-animate')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
    )
    document.querySelectorAll('[data-aos]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export default function App() {
  useScrollReveal()
  return (
    <div className="landing-page">
      <Aurora />
      <Nav />
      <Intro />
      <Hero />
      <Upgraded />
      <Connectors />
      <Engine />
      <Console />
      <Showcase />
      <Deployment />
      <Proof />
      <Teams />
      <Pricing />
      <FinalCta />
      <Footer />
      <CookieBanner />
    </div>
  )
}

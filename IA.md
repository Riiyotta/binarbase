# https://binarbase.com/ (English homepage), cloned in this project

Source: https://binarbase.com/ (English homepage), cloned in this project
Status: **measured-from-live-site** · production approved: **false**
1 routes · 1 templates · 16 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 1 template (Homepage) accounts for 1 of 1 routes (100%). The remaining 0 routes span 0 templates.

| template | routes | share |
|---|---:|---:|
| Homepage | 1 | 100% |

## Page chrome

**1 routes carry chrome = `full`** — Homepage.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `shell.aurora-background` | SHELL | 1 | 1 | `src/components/Aurora.jsx` | Present on the 1 cloned route, behind all content. |
| `shell.navbar` | SHELL | 1 | 1 | `src/components/Nav.jsx` | Present on the 1 cloned route. |
| `intro.second-brain-3d` | INTRO | 1 | 1 | `src/components/Intro/Intro.jsx` | Homepage only, first block on the 1 cloned route. |
| `hero.headline` | HERO | 1 | 1 | `src/components/Hero.jsx` | Homepage only, directly after the intro. |
| `features.upgraded` | FEATURES | 1 | 1 | `src/components/Upgraded.jsx` | Homepage only. |
| `features.connectors-mcp` | FEATURES | 1 | 1 | `src/components/Connectors.jsx` | Homepage only. |
| `features.engine` | FEATURES | 1 | 1 | `src/components/Engine.jsx` | Homepage only; target of the 'How it works' nav link. |
| `features.console` | FEATURES | 1 | 1 | `src/components/Console.jsx` | Homepage only. |
| `features.product-showcase` | FEATURES | 1 | 1 | `src/components/Showcase.jsx` | Homepage only; target of the 'Product' nav link. |
| `features.deployment-modes` | FEATURES | 1 | 1 | `src/components/Deployment.jsx` | Homepage only. |
| `proof.customer-stories` | PROOF | 1 | 1 | `src/components/Proof.jsx` | Homepage only. |
| `solutions.teams-tree` | SOLUTIONS | 1 | 1 | `src/components/Teams.jsx` | Homepage only; target of the 'Solutions' nav link. |
| `conversion.pricing-quote` | CONVERSION | 1 | 1 | `src/components/Pricing.jsx` | Homepage only; target of the 'Pricing' nav link. |
| `conversion.final-cta` | CONVERSION | 1 | 1 | `src/components/FinalCta.jsx` | Homepage only. |
| `shell.footer` | SHELL | 1 | 1 | `src/components/Footer.jsx` | Present on the 1 cloned route. |
| `shell.cookie-consent` | SHELL | 1 | 1 | `src/components/CookieBanner.jsx` | Overlay on the 1 cloned route until dismissed. |

**0 shared sections** appear in more than one template and belong in a component library.

**16 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Homepage — `template.home`

1 route · `/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | SHELL | `shell.aurora-background` | page-local |
| 2 | SHELL | `shell.navbar` | page-local |
| 3 | INTRO | `intro.second-brain-3d` | page-local |
| 4 | HERO | `hero.headline` | page-local |
| 5 | FEATURES | `features.upgraded` | page-local |
| 6 | FEATURES | `features.connectors-mcp` | page-local |
| 7 | FEATURES | `features.engine` | page-local |
| 8 | FEATURES | `features.console` | page-local |
| 9 | FEATURES | `features.product-showcase` | page-local |
| 10 | FEATURES | `features.deployment-modes` | page-local |
| 11 | PROOF | `proof.customer-stories` | page-local |
| 12 | SOLUTIONS | `solutions.teams-tree` | page-local |
| 13 | CONVERSION | `conversion.pricing-quote` | page-local |
| 14 | CONVERSION | `conversion.final-cta` | page-local |
| 15 | SHELL | `shell.footer` | page-local |
| 16 | SHELL | `shell.cookie-consent` | page-local |

## Section reference

### SHELL

_Page chrome that is not content: fixed background, navigation, footer, consent overlay._

**`shell.aurora-background`** — Fixed, full-page decorative backdrop: three blurred aurora colour layers, a mesh gradient and a noise overlay that show through every transparent section.

· Present on the 1 cloned route, behind all content. · appears on 1 routes · implemented by `src/components/Aurora.jsx`

**`shell.navbar`** — Fixed 71px glass navigation (logo, anchor links, language dropdown, log in / sign up). Turns dark (html.sbi-dark) while the 3D intro is under it; collapses to a hamburger with a 320px slide-in drawer at ≤1024px.

· Present on the 1 cloned route. · appears on 1 routes · implemented by `src/components/Nav.jsx`

**`shell.footer`** — Site footer: brand column (logo, tagline, 3 social icons), a Product link column, and a Contact column (email, phone, address); bottom bar with copyright and 4 legal-page links.

· Present on the 1 cloned route. · appears on 1 routes · implemented by `src/components/Footer.jsx`

**`shell.cookie-consent`** — Non-modal cookie consent dialog fixed to the bottom of the viewport; stores the choice in the bb_cookie_consent cookie. The clone loads no analytics either way.

· Overlay on the 1 cloned route until dismissed. · appears on 1 routes · implemented by `src/components/CookieBanner.jsx`

### INTRO

_Full-viewport scroll-captured opening experience shown before the hero._

**`intro.second-brain-3d`** — 100svh dark (#070c1f) three.js scene of a 'second brain' with 7 story chapters; wheel/arrow/swipe input steps chapters before releasing normal page scroll, with skip and explore actions.

· Homepage only, first block on the 1 cloned route. · appears on 1 routes · implemented by `src/components/Intro/Intro.jsx`

### HERO

_Page-opening headline block with the primary calls to action._

**`hero.headline`** — Centred page-opening block: pulsing 'AI brain' badge, two-line headline (second line in brand gradient), subtitle, and a sign-up call to action, with skewed drifting gradient blobs behind it on the right.

· Homepage only, directly after the intro. · appears on 1 routes · implemented by `src/components/Hero.jsx`

### FEATURES

_Numbered product-explanation sections (01–06) describing capabilities._

**`features.upgraded`** — Section 01 (#upgraded): numbered header, a 'same word, three different numbers' mismatch panel (one metric defined three ways across source systems, plus a callout), then a comparison table.

· Homepage only. · appears on 1 routes · implemented by `src/components/Upgraded.jsx`

**`features.connectors-mcp`** — Section 02 (no anchor id): connectors and MCP, centred on an animated brain core with heartbeat, pulse rings and six floating integration icons, plus connector cards; clicking the core triggers a 1.2s excited state.

· Homepage only. · appears on 1 routes · implemented by `src/components/Connectors.jsx`

**`features.engine`** — Section 03 (#how-it-works) on the #f6f9fc band: a three-step Capture → Curate → Serve flow joined by arrows; the middle step is highlighted with a 'private AI' badge.

· Homepage only; target of the 'How it works' nav link. · appears on 1 routes · implemented by `src/components/Engine.jsx`

**`features.console`** — Section 04 (#console): two side-by-side panes (stacked at ≤968px) — managing context in the BinarBase console (with a mock definitions UI) versus working from your own AI tools over MCP.

· Homepage only. · appears on 1 routes · implemented by `src/components/Console.jsx`

**`features.product-showcase`** — Section 05 (#product) on the #f6f9fc band: horizontal carousel of 5 product cards with mock UIs, arrow buttons and dot pagination; no auto-advance.

· Homepage only; target of the 'Product' nav link. · appears on 1 routes · implemented by `src/components/Showcase.jsx`

**`features.deployment-modes`** — Section 06 (#deployment) on the #f6f9fc band: 3-way switch between cloud, private cloud and on-premise with an animated flow diagram and comparison table; auto-cycles every 4.5s while in view until the user picks a mode.

· Homepage only. · appears on 1 routes · implemented by `src/components/Deployment.jsx`

### PROOF

_Customer evidence: client logos and case-study cards._

**`proof.customer-stories`** — Section 07 (#proof): a static row of 11 real client logos (no marquee) and 3 case-study cards linking to /insights pages.

· Homepage only. · appears on 1 routes · implemented by `src/components/Proof.jsx`

### SOLUTIONS

_Audience/department-specific positioning._

**`solutions.teams-tree`** — Section 08 (#teams): hover-driven department tree (Finance selected by default) that highlights a branch and swaps a detail card, followed by 4 trust cards.

· Homepage only; target of the 'Solutions' nav link. · appears on 1 routes · implemented by `src/components/Teams.jsx`

### CONVERSION

_Pricing and closing call-to-action blocks._

**`conversion.pricing-quote`** — Section 09 (#pricing): header and lede, a dashed 'get started yourself or with us' setup banner, then a single on-request quote card listing 15 included features; no tiered price table.

· Homepage only; target of the 'Pricing' nav link. · appears on 1 routes · implemented by `src/components/Pricing.jsx`

**`conversion.final-cta`** — Closing call-to-action card over a radial glow, with a 'Start Free Trial' sign-up link and a 'Schedule Demo' button that has no action (as on the original), directly before the footer.

· Homepage only. · appears on 1 routes · implemented by `src/components/FinalCta.jsx`

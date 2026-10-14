Source: https://binarbase.com/

# BinarBase homepage — clone spec

Measured live on 2026-10-14 with Playwright at 1440x900, 1280x800, 768x1024 and 390x844. Everything below comes from computed styles, the live stylesheet (`_nuxt/index.AtHXy8dp.css`) and the site's JS chunks. Nothing is eyeballed.

## 0. Read this first: how to build it

* **Stack of the original:** Nuxt 3 / Vue SFCs with scoped CSS (`data-v-*`). There is no Tailwind on the original. All class names below are the original ones.
* **The stylesheet is the source of truth. Port it, don't re-derive it.** The page uses **height-based media queries** (`max-height:900px and min-width:1024px`, `max-height:800px and min-width:1024px`) on top of width queries. So at 1440x900 and 1280x800, many sizes are *smaller* than they are at 1440x1000. Rebuilding this with Tailwind utilities will drift. Recommended approach:
  * Copy the rules from `recon/css/index.AtHXy8dp.css` (one rule per line, already split) into a global stylesheet such as `src/styles/binarbase.css`, and keep the class names in JSX.
  * Strip the `[data-v-xxxx]` attribute selectors. The only scoped components are SecondBrainIntro `00d3a672`, Deployment `a75c984f` and ContextTree `a6fe94b3`. Also strip the `:deep`-style `[data-v-00d3a672] .sbi-lbl` → `.sbi-labels .sbi-lbl`.
  * Use Tailwind only for things you add yourself. If Tailwind preflight is on, it conflicts with the original reset, so either disable `corePlugins.preflight` or make sure the reset below wins.
  * The `entry.qOVbJ9mW.css` reset and cookie banner rules are in `recon/css/entry.qOVbJ9mW.css`.
  * Dead CSS: `.pulse-*`, `.icp-*` (except colours), `.testimonial-*`, `.pricing-card/grid`, `.deck-*`, `.dashboard-*`, `.hero-visual`, `.hero-stat*` and `.data-flow-visual` are in the stylesheet but **not rendered** on the homepage. Skip them.
* **Verbatim markup reference:** `recon/dom-1440-clean.html` is the full rendered `#__nuxt` DOM with comments and `data-v` removed. It includes all 83 inline SVGs, the context-tree SVG geometry and every string. Translate it to JSX one-to-one.
* **Reference screenshots:** `recon/screens/` (see section 16).
* **Raw measurements:** `recon/measure-1440.json`, `measure-1280.json`, `measure-768.json`, `measure-390.json`. Rects are `left,top(document),width,height`.
* Asset manifest: `assets.manifest.json` (next to this file).

## 1. Global tokens

### 1.1 Fonts (measured: zero web fonts loaded)
`document.fonts` is empty and there are no font requests. Fonts are system only:
* `body` (reset): `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif`
* `.landing-page` (wraps everything): `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`
* Intro mono (`--mono`): `"JetBrains Mono", ui-monospace, Menlo, Consolas, monospace`. JetBrains Mono is **not loaded**, so it renders as ui-monospace/Menlo. Do not add it.
* Code (`.definition-formula`): `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
* `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale` on body. Root font-size is 16px. `html { scroll-behavior: smooth }`.

### 1.2 Color tokens (`:root`)
| token | value |
|---|---|
| --color-primary | #6042f9 |
| --color-primary-dark | #4d35c7 |
| --color-gradient-start | #3f34fe |
| --color-gradient-end | #8e64fa |
| --color-text | #0a2540 |
| --color-text-secondary | #425466 |
| --color-text-tertiary | #697386 |
| --color-bg | #fff |
| --color-bg-secondary | #f6f9fc |
| --color-bg-tertiary | #f0f3f7 |
| --color-border | #e6ebf1 |
| --color-success | #00d4aa |
| --color-warning | #fb0 |

`--color-surface` is referenced by `.footer-social a` but **not defined**, so it computes to transparent. Keep that behaviour.

Intro-only tokens (on `.sbi`): `--ink:#070c1f; --paper:#f4f2ff; --muted:#bdb9de; --lav:#c4b8ff; --violet:#6042f9; --line:rgba(196,184,255,.22); --pad:clamp(20px,3.2vw,64px)`.
Deployment-only tokens: `--dp-in:#00a67d; --dp-out:#6042f9; --dp-opt:#d68a00`.
Recurring accents: green #10b981 / #059669 / #00a67d, amber #f59e0b / #b45309 / #d97706, cyan #06b6d4 / #0891b2, blue #3b82f6 / #2563eb, violet #8b5cf6 / #a78bfa, red mark #e2506b, grey x-mark #c3cad6.

### 1.3 Gradients (exact stops)
* Brand text and button gradient: `linear-gradient(135deg,#3f34fe,#8e64fa)`. Used by `.gradient-text`, `.gradient-text-emerald` (same stops), `.title-gradient`, `.quote-price`, `.engine-step-badge` and `.connect-step-num`. `.gradient-text-cyan` is reversed: `linear-gradient(135deg,#8e64fa,#3f34fe)`. All text versions use `-webkit-background-clip:text; -webkit-text-fill-color:transparent`.
* Page background (`.aurora-bg`, **position:fixed; inset:0; z-index:0**): `linear-gradient(180deg,#fff,#f8f6ff 40%,#f3f0ff)` plus:
  * `.aurora-1`: 900x900, left -15%, top -30%, `radial-gradient(circle,rgba(96,66,249,.08) 0,rgba(96,66,249,.02) 50%,transparent 70%)`, blur 80px. At ≥1400px it is 1100px; at ≥1600px, 1300px; at ≤768px, 500px with left -25% and top -15%.
  * `.aurora-2`: 700x700, right -10%, top 0, `rgba(142,100,250,.1)/.03`, blur 70px. At ≥1400px, 900px; at ≤768px, 400px with right -15% and top 5%.
  * `.aurora-3`: 600x600, left 20%, bottom 10%, `rgba(96,66,249,.06)/.01`, blur 60px. At ≥1400px, 700px; at ≤768px, 350px.
  * `.mesh-gradient`: three radial ellipses (see CSS line `.mesh-gradient`).
  * `.noise-overlay`: 1px grid lines `rgba(96,66,249,.025)` every 60px (80px at ≥1400px, 100px at ≥1600px, 40px with opacity .5 at ≤768px), masked by `radial-gradient(ellipse 90% 70% at 50% 40%,#000 0,transparent 70%)`.
* Hero art blobs (`.stripe-gradient-art` → `.gradient-canvas` skewY(-12deg) → 4 `.gradient-blob`, blur 80px, opacity .7):
  * blob-1: `#a960ee→#ff333d`, 600px
  * blob-2: `#90e0ff→#635bff`, 500px
  * blob-3: `#ffcb57→#ff6b6b`, 450px
  * blob-4: `#00d4aa→#635bff`, 400px
  * All use `linear-gradient(135deg, a, b)`.
* Brain core: `linear-gradient(135deg,#6042f9,#8b5cf6 50%,#a78bfa)`. Deployment orb: `radial-gradient(circle at 40% 35%,#8e64fa,#3f34fe 70%)`.
* Footer: `linear-gradient(180deg,#f8fafc,#fff)`.

### 1.4 Radii / shadows / borders (most-used)
* Radii:
  * 8px: nav CTA, cta-primary/secondary, lang button
  * 10px: cookie button, mini widgets
  * 12px: mismatch row, endpoint box
  * 14px: console mock, engine loop, floating icon
  * 16px: engine step/card, mcp card, superpower item
  * 20px: panels, tables, blog card, console pane, ct-detail, setup banner
  * 24px: showcase card-inner, dp-diagram, quote card, cta-content (32px when wider than 900px tall; 24px under the max-height:900 query)
  * 100px/999px: pills
* Shadows:
  * `0 4px 16px #0a25400d` (panels and tables)
  * `0 2px 8px #0000000a` (small cards)
  * `0 4px 24px #0000000f` (blog card)
  * `0 8px 32px #0000000f` (cta-content)
  * `0 20px 60px #6042f924` (quote card)
  * `0 10px 34px #0a254012` (ct-detail)
  * `0 12px 30px #6042f91f` (engine-step.is-core)
  * `0 12px 30px #6042f91a` (console-pane.is-accent)
  * `0 8px 32px #6042f926` (active showcase card)
* Standard border is `1px solid #e6ebf1`.
* Backdrop filters:
  * nav `blur(20px)`
  * mobile overlay `blur(4px)`
  * intro detail card `blur(10px)`

### 1.5 Layout primitives
* `.section-container`: max-width 1200px, padding 0 2rem (32px), centred. Inner width at 1440 = 1136px. At ≤768px: padding 0 1rem, max-width 100%. At ≤640px: padding 0 .75rem.
* `.section-header`: centred.
  * margin-bottom 4rem (64px). At 1440x900 and 1280x800 it measured 40px and 32px, from the height queries.
* `.section-badge`: inline-flex pill.
  * Colours: background `#6042f914`, border `1px solid rgba(96,66,249,.15)`, colour `#6042f9`.
  * Size: .85rem/600, padding .4rem 1rem, mb 1.5rem.
  * Measured at 1440x900: 12px, padding 4.8px 12px. At 1280x800: 11.2px, padding 4px 8px. At 768: 13.6px. At 390: 13.6px with padding 8px 16px.
  * `.cyan` / `.emerald` variants: background `#00a67d14`, border `#00a67d26`, colour `#00a67d`.
  * Content is `<span class="section-num">01</span><span>Label</span>`. `.section-num` has opacity .7, `font-variant-numeric: tabular-nums`, and `::after{content:"·"; margin:0 .45em}`.
* `.section-title`:
  * Base: `clamp(2.5rem,5vw,3.5rem)`/800, letter-spacing -.03em, mb 1rem.
  * Measured font-size: 48px @1440x900, 44px @1280x800, 40px @768, 32px @390. Line-height is `normal`.
* `.section-subtitle`:
  * Base: 1.15rem (18.4px), line-height 1.7, colour #425466, max-width 600px, centred.
  * Measured: 18.4px / 31.28px @1440, 17.6px / 24.64px @1280x800, 18.4px / 29.44px @768, 18px / 28.8px @390.
* Section stacking: `.landing-page{position:relative; overflow-x:hidden}`. Every section has `position:relative; z-index:2`. The intro is `.sbi` z-index 3, the nav z-index 100 and the mobile menu z-index 99. Sections without a background let the fixed aurora show through.
* `section[id]{scroll-margin-top: calc(var(--header-h,80px) + 1rem)}`.
* JS sets `--header-h` to the nav's bottom edge (71px @1440/1280, 77px @768, 88px @390) and `--hero-h` to the `.hero` height (477px @1440x900). It uses a ResizeObserver on `.nav-glass` and `.hero`, plus resize and `document.fonts.ready`.

### 1.6 Breakpoints in use
* Width:
  * max: 1280, 1100, 1024, 968, 768, 720, 640, 620, 560, 480
  * min: 1400, 1600
* Height (only applies at ≥1024 wide): `max-height:900px`, `max-height:800px`
* Aspect ratio: `max-aspect-ratio:11/10` (intro only)
* `prefers-reduced-motion:reduce` disables intro and deployment animations.
* Main switches:
  * ≤1024: nav links hidden and hamburger shown; integrations go to 1 column; superpowers go to 2 columns; blog goes to 1 column (max 500px).
  * ≤968: console, engine-cards and mcp-cards go to 1 column; engine-flow becomes a column with arrows rotated 90°.
  * ≤768: the compare table becomes stacked cards, the deployment diagram becomes vertical, the dp table becomes stacked, and section paddings drop to 4rem.
  * ≤640: CTAs stack, superpowers go to 1 column, the footer grid is 2 columns.
  * ≤480: the footer is 1 column.

## 2. Page order (DOM) and measured section boxes

`.landing-page` > `.aurora-bg` (fixed) · `nav.nav-glass` (fixed) · `.mobile-menu` (fixed) · sections:

| # | element | 1440x900 top+h | 1280x800 | 768x1024 | 390x844 |
|---|---|---|---|---|---|
| 0 | `section.sbi` (3D intro) | 0+900 (100svh) | 0+800 | 0+1024 | 0+844 |
| 1 | `div.hero-wrap` > `section.hero` | 900+477 | 800+395 | 1024+583 | 844+733 |
| 2 | `section#upgraded.upgraded-section` | 1377+1400 | 1195+1353 | 1607+1663 | 1577+1902 |
| 3 | `section.integrations-section` (no id) | 2777+948 | 2548+701 | 3270+1266 | 3479+1691 |
| 4 | `section#how-it-works.engine-section` | 3726+1042 | 3250+982 | 4536+1571 | 5169+1940 |
| 5 | `section#console.console-section` | 4768+1383 | 4231+1336 | 6106+1893 | 7110+2369 |
| 6 | `section#product.features-section` | 6151+1414 | 5568+1362 | 7999+1430 | 9479+1394 |
| 7 | `section#deployment.deploy-section` | 7565+1810 | 6929+1763 | 9429+3347 | 10872+3650 |
| 8 | `section#proof.blog-section.proof-section` | 9374+1052 | 8692+1017 | 12776+1548 | 14522+1842 |
| 9 | `section#teams.solutions-section` | 10426+1131 | 9709+1053 | 14324+1645 | 16364+2292 |
| 10 | `section#pricing.pricing-section` | 11558+1492 | 10762+1421 | 15969+1636 | 18656+2211 |
| 11 | `section.final-cta` | 13049+404 | 12183+313 | 17605+507 | 20867+827 |
| 12 | `footer.footer` | 13453+374 | 12496+374 | 18111+452 | 21694+818 |
| | total document height | 13827 | 12870 | 18563 | 22512 |

Backgrounds:
* `#f6f9fc`: engine, features and deployment.
* Transparent (aurora shows through): upgraded, integrations, console, proof, teams, pricing and final-cta.
* Dark `#070c1f`: the intro.

## 3. Navbar (`nav.nav-glass`)

* Box: `position:fixed; top:0; left:0; right:0; z-index:100; backdrop-filter:blur(20px); background:#fffffff2; border-bottom:1px solid #e6ebf1; transition: background-color .35s ease, border-color .35s ease`. Height 70px + 1px border = 71px.
* `.nav-container`: max-width 1200px, padding 1rem 2rem, flex, space-between, align centre.
* `.brand-logo` is `<img src="/logo.svg" alt="BinarBase">`, height 32px (150x32 rendered). It is not a link.
* `.nav-links` uses `gap:2.5rem` (40px). `.nav-link` is 15.2px/500, colour #425466, hover colour #0a2540, `transition: color .2s`. Links:
  * "How it works" → `#how-it-works`
  * "Product" → `#product`
  * "Solutions" → `#teams`
  * "Pricing" → `#pricing`
  * "Insights" → `/insights`
* `.nav-actions` has gap 1.5rem and contains:
  * `.lang-selector > button.lang-button` "🇬🇧 EN" + chevron 14px.
    * Box: border 1px #e6ebf1, radius 8px, padding .5rem .75rem, font 13.6px, gap .5rem.
    * Hover: background #f6f9fc, border #697386.
    * `.lang-flag` is 1.1rem; `.lang-code` is .8rem/600.
    * Dropdown `.lang-dropdown`: white, radius 10px, shadow `0 10px 40px #0000001f`, min-width 160px, top calc(100% + .5rem). Options are English / Slovensky / Cesky with flags 🇬🇧 🇸🇰 🇨🇿. `.lang-option` padding .75rem 1rem; active colour #6042f9 on `#6042f914`. The chevron rotates 180° (`.2s`).
  * `a.nav-signin` "Sign In" → `https://app.binarbase.com/login`. Same style as nav-link.
  * `a.nav-cta` "Get Started" → `https://app.binarbase.com/signup`.
    * Box: background #6042f9, colour #fff, 14.4px/600, padding .65rem 1.25rem (10.4px 20px), radius 8px, 120x38 rendered.
    * Hover: background #4d35c7, `box-shadow:0 4px 12px #6042f959`, `translateY(-1px)`, `transition: all .2s ease`.
* **Dark mode over the intro.** The scroll handler toggles `html.sbi-dark` while the intro section's bottom edge is below the nav height (rAF-throttled):
  * Nav background becomes `#070c1f8c` and the border colour `#c4b8ff24`.
  * The logo gets `filter: brightness(0) invert(1)` (white).
  * nav-link, nav-signin and lang-button colour becomes `#bdb9de` (measured rgb(180,177,213) while transitioning). Hover colour is `#f4f2ff`.
  * The lang-button border becomes `#c4b8ff38`, with hover background `#ffffff0f`.
  * The hamburger lines become `#f4f2ff`.
  * The colour change animates through the .35s background transition.
* **≤1024px:**
  * `.nav-links`, `.lang-selector` and `.nav-signin` get `display:none`.
  * `.mobile-menu-btn` appears: 44x44, three `.hamburger-line` of 22x2px, radius 2px, gap 5px, colour #0a2540.
  * When active, line 1 gets `rotate(45deg) translate(5px,5px)`, line 2 gets opacity 0, and line 3 gets `rotate(-45deg) translate(5px,-5px)` (`.3s`).
  * The Get Started CTA stays. At 390 it wraps onto 2 lines (116x55). This is a faithful quirk.
* **Mobile menu** (`.mobile-menu`, fixed inset 0, z 99, hidden):
  * Opening adds `.open`.
  * `.mobile-menu-overlay`: background `#0006`, backdrop blur 4px, opacity 0→1 over .3s.
  * `.mobile-menu-content`: right drawer, white, max-width 320px, full height, shadow `-4px 0 24px #00000026`, `translate(100%)`→`translate(0)` over .3s ease.
  * Header: logo plus a 40x40 close X (24px icon), padding 2.5rem 1.5rem 1rem, bottom border.
  * Links: the same 5 links as `.mobile-nav-link`, 1.1rem/500, padding 1rem 1.5rem, colour #0a2540. Hover: background #f6f9fc, colour #6042f9.
  * Divider: 1px #e6ebf1, margin .5rem 1.5rem.
  * "LANGUAGE" label: .8rem/600 uppercase, tracking .05em, #697386.
  * Language chips (`.mobile-lang-option`): English (active), Slovensky, Cesky. Padding .5rem .75rem, radius 8px. Active state: background `#6042f91a`, border #6042f9.
  * Divider.
  * `.mobile-menu-actions` (margin-top:auto): "Sign In" (`.mobile-signin`, background #f6f9fc, border, radius 10px, padding .875rem 1.25rem) and "Get Started" (`.mobile-cta`, #6042f9, white, radius 10px).
  * Clicking outside closes it (document click listener). Screenshot: `recon/screens/m390-mobile-menu-open.png`.

## 4. Section 0 — 3D intro "Second Brain" (`section.sbi`)

**Canvas-rendered.** The scene and its 3D labels are WebGL (three.js r186) from the site's own chunk `_nuxt/_BDyuz0e.js` (`export createSecondBrainScene(canvas, labelsEl, strings, {reduce, compact})`, saved at `recon/js/_BDyuz0e.js`). The geometry can't be measured from the DOM. Use the screenshots `recon/screens/00-intro-ch1…ch7-1440.png` as the visual reference. Parameters read from the source:
* Renderer: antialias, `setPixelRatio(min(dpr, compact?1.5:2))`. `compact = min(innerWidth, innerHeight) < 600`.
* Scene: background and fog `#070c1f`, `FogExp2` density .016. Camera is perspective, FOV 42, near .1, far 400.
* Background dust: 1600 points (800 when compact), colour `#c4b8ff`, size .12, opacity .5, additive. Spread over 170x95x130.
* Floor: `GridHelper(140, 70)`, colour `#2a2470`, opacity .13, y -7.
* Core sphere: radius 2.2. It has 380 Fibonacci-sphere nodes (300 when compact), colour `#c4b8ff`, size .13. Each node links to its 3 nearest neighbours with lines in `#8b76ff` at opacity .34. 260 inner glow points.
* Source nodes (Accounting / CRM / E-shop / Documents) are teal `#3ddbb0` crystals.
* Layer chapters: `core, sources, inFlow, layers, mcp, outputs, outFlow, loop`. Each layer group fades in and out per chapter.
* Labels are DOM `.sbi-lbl` elements positioned over the canvas:
  * Title `<b>`: `clamp(13px,1.05vw,19px)`/600, colour #f4f2ff. The `.big` version is `clamp(15px,1.35vw,24px)`.
  * Sub-line: `clamp(11px,.85vw,16px)`/500, colour #bdb9de, `text-shadow:0 1px 12px rgba(7,12,31,.95)`.
  * `.mono` sub-line (the MCP URL) is #c4b8ff in the mono stack.

Label strings:
* Company Context / living knowledge base
* 200+ connectors / mapped to your definitions
* Accounting / invoices, costs, ERP
* CRM / customers, deals
* E-shop / orders, returns
* Documents / SOPs, contracts, playbooks
* Definitions / what revenue really means
* Knowledge / processes and know-how
* Memory / decisions and corrections
* Access / roles and audit
* MCP endpoint / mcp.binarbase.com/your-company
* Claude, ChatGPT, Cursor, Gemini / via MCP, live
* Your local model / on your own servers
* Corrections flow back / and become definitions

If an exact WebGL port is out of scope, the fallback is: `#070c1f` background, a glowing violet node sphere centred right of centre (about x 920, y 390 at 1440x900, about 570px across), and the story text block bottom-left.

**Section box:**
* `height:100vh; height:100svh; min-height:520px; overflow:hidden; background:#070c1f; colour:#f4f2ff; user-select:none; z-index:3`.
* `touch-action: none` while at the top and the chapter is below the last one; otherwise `pan-y`.
* Canvas is `cursor:grab` (`grabbing` when active).

**Story block** (`.sbi-story`, `aria-live=polite`):
* Position: absolute, `left:var(--pad)` (46.08px @1440), `bottom:clamp(100px,13vh,160px)`, width `min(42rem,44vw)` (634px @1440).
* Scrim `::before`: `radial-gradient(ellipse 60% 55% at 35% 58%,#070c1feb 30%,#070c1f00)`.
* `h2`:
  * Base: `clamp(34px,4.4vw,76px)`/700, letter-spacing -.035em, line-height 1.02, `text-wrap:balance`.
  * Measured: 63.36px / 64.63px / -2.2176px @1440; 56.32px @1280; 34px @768 and @390.
* `p.sbi-body`:
  * Base: `clamp(16px,1.3vw,21px)`, line-height 1.5, colour #bdb9de, max-width 36ch, margin-top `clamp(14px,1.4vw,24px)`.
  * Measured: 18.72px / 28.08px, mt 20.16px @1440.
* `p.sbi-extra` (chapter 4 only): mono, `500 clamp(14px,1.1vw,19px)/1.3`, colour #c4b8ff.
* Chapter 7 also renders `.sbi-cta` (gap 12px, mt `clamp(18px,1.8vw,28px)`) with two buttons:
  * `a.sbi-btn.sbi-btn--primary` "Start Free Trial" → `https://app.binarbase.com/signup`.
  * `button.sbi-btn` "Explore BinarBase" with a ↓ arrow svg (`M12 5v14M5 12l7 7 7-7`).
  * `.sbi-btn` styling: pill, min-height 48px, padding 0 22px, 16px/600, background `#0e1a3a99`, border `1px solid rgba(196,184,255,.22)`. Hover border is #c4b8ff.
  * The primary button is #6042f9 with hover #7058fb.
* `≤ aspect 11/10` (portrait): the story is `bottom:96px; right:var(--pad); width:auto` and the scrim becomes `linear-gradient(#070c1f00,#070c1fe6 40%)`.

**Chapters (7), verbatim:**
1. **Your company's second brain.** — One living knowledge base that every AI you use draws from.
2. **Everything your company knows, in one place.** — Accounting, CRM, e-shop and documents. 200+ connectors plug into the systems you already have, with no migration.
3. **Data gets meaning.** — Definitions, knowledge, memory and access make up your Company Context. A private AI keeps it current, so nothing goes stale.
4. **One MCP endpoint.** — Add it to your agent, sign in, and your AI reads the company brain live, with your permissions. Extra line: `mcp.binarbase.com/your-company`
5. **For every AI you use.** — Claude, ChatGPT, Cursor, Gemini, or a local model on your own servers. They all work from the same definitions, so the same question gets the same answer.
6. **A brain that learns.** — Every question and every correction flows back. Corrections become definitions, and the knowledge base gets sharper every week.
7. **See your company's second brain.** — Connect the systems you already use and get your first answers in minutes. Plus the two CTAs.

**Bottom bar** (`.sbi-bottom`):
* Position: absolute bottom 0, flex space-between, gap 24px, padding `0 var(--pad) calc(env(safe-area-inset-bottom) + clamp(16px,2.2vw,36px))` (31.68px @1440).
* Left side, `nav.sbi-progress` (aria-label "Intro chapters", gap `clamp(4px,.5vw,8px)`):
  * 7 `button.sbi-seg`, each 44px tall and `clamp(26px,3vw,56px)` wide (43px @1440; 20px at ≤640).
    * Track `::before`: 4px tall, radius 2px, `#c4b8ff38`.
    * Fill `<i>`: `#c4b8ff`, width animates 0→100% over `.5s ease` on `.current`. `.done` fill is `#c4b8ff8c`.
  * `span.sbi-count` "1 / 7": 14px/500, tabular-nums, #bdb9de, ml `clamp(8px,1vw,16px)`.
  * `span.sbi-cue` "SCROLL": 12px, tracking .14em, uppercase, #c4b8ff, with a 1x18px drip line animating `sbi-drip` 1.8s ease-in-out infinite. It is visible only on chapter 1 (`.hidden` gives opacity 0 over .4s).
* Right side, `.sbi-controls` (gap `clamp(10px,1vw,16px)`):
  * `p.sbi-hint` "Click a node for details · drag to rotate": 13px/1.4, #bdb9de, right-aligned, max-width 30ch. Hidden ≤1100px and at portrait aspect.
  * `button.sbi-skip` "Skip intro": pill, min-height 44px, padding 0 16px, 14px/500, background `#0e1a3a8c`. Hidden on the last chapter and at ≤640.
  * `button.sbi-round` (prev, chevron `M15 5l-7 7 7 7`): 52x52 circle, background `#0e1a3a99`, border `--line`. Disabled at opacity .35.
  * `button.sbi-round.sbi-round--primary` (next, chevron `M9 5l7 7-7 7`; on the last chapter it shows ↓ and acts as Explore): background #6042f9. Both are 46x46 at ≤640. The icon is 42% of the button, stroke 2.
* The count and cue are hidden at ≤640.

**Detail card** (`aside.sbi-card`, appears when a node is clicked):
* Position: absolute, top `calc(var(--header-h) + clamp(16px,2vw,32px))`, right `var(--pad)`, width `min(26rem, 100% - 2*pad)`.
* Look: background `#0c142edb`, `backdrop-filter:blur(10px)`, border `1px solid rgba(139,118,255,.45)`, radius 16px.
* `h3` is `clamp(20px,1.6vw,26px)`/600; `p` is `clamp(15px,1.1vw,17px)`/1.5 in #bdb9de.
* Close button: 40px circle. Card texts are in `BoenAJz5.js` under `intro.cards`.

**Intro interaction logic** (from `DC-ke6xp.js`):
* **Wheel hijack.** Active only while `scrollY<=2` and only after the scene has loaded.
  * Deltas are normalised (deltaMode 1 → ×16, deltaMode 2 → ×innerHeight).
  * If more than 180ms pass between events, the accumulator resets.
  * When the accumulator reaches |30px|, the chapter steps ±1. Further steps are locked out for 650ms, and residual inertia is swallowed for 900ms.
  * Scrolling down on the last chapter (or up on the first) falls through to normal page scroll.
* **Touch.** A swipe of at least 45px (dominant axis) while at the top steps the chapter.
* **Keys.**
  * ArrowRight, ArrowDown, PageDown and Space go to the next chapter.
  * ArrowLeft, ArrowUp and PageUp go to the previous chapter.
  * Escape closes the card.
  * Keys are ignored inside inputs and when `scrollY>2`.
* **Chapter change.**
  1. `.sbi-story` gets `.out` (opacity 0, `translateY(12px)`, `.45s ease`).
  2. After 420ms (1600ms on first load; 0 with reduced motion) the text swaps and `.out` is removed.
  3. The scene receives `setChapter(i)`.
* **Pointer.** A click without dragging (movement ≤10px) picks a node and opens the card. If nothing is picked it closes the card, or advances the chapter if no card is open. A mouse drag orbits the scene.
* "Skip intro" and "Explore" call `scrollTo({top: sbi.offsetTop + sbi.offsetHeight, behavior:'smooth'})`.
* An IntersectionObserver starts and stops the render loop when the intro enters and leaves the viewport.
* If WebGL fails, the section gets `.sbi--failed` (display:none).

## 5. Section 1 — Hero (`div.hero-wrap > section.hero`)

* `.hero-wrap{position:relative}` contains `.stripe-gradient-art` (absolute, top 0, right 0, width 65%, height `var(--hero-h)`, `pointer-events:none`, z 1). Inside it, `.gradient-canvas` (140% tall, 120% wide, right -10%, top -20%, `skewY(-12deg)`, origin top right) holds the 4 blobs.
  * ≤1024: art width 100%, opacity .6, skewY(-8deg), blobs blur 100px / opacity .5 (sizes 400/350/300/280).
  * ≤768: opacity .4, blur 120px, blob-4 hidden.
* `.hero`: flex column, centred, text-align centre, max-width 1200px (1360 at ≥1400, 1520 at ≥1600), `padding: calc(var(--header-h) + var(--hero-top-gap,2rem)) 2rem 3rem`.
  * hero-top-gap is 1.25rem under max-height 900 (so 91px top padding @1440x900) and 1rem under max-height 800.
  * Measured padding: `91px 32px 16px` @1440x900; `87px 32px 8px` @1280x800; `93px 24px 24px` @768; `101.6px 16px 16px` @390.
* `.hero-content`: max-width 760px (640 at ≥1400), mb 2rem.
* Badge `.hero-badge`:
  * Box: pill, background `#6042f914`, border `rgba(96,66,249,.15)`, padding .5rem 1rem, gap .75rem, mb 1rem. 214x34 @1440.
  * Contents: `.badge-pulse` 8px #00d4aa dot (`pulse` 2s infinite), then `.badge-text` "Your company's AI brain" (.85rem/600, #6042f9).
* `h1.hero-title`:
  * Base: `clamp(2.5rem,4vw,3.5rem)`/700, letter-spacing -.03em, line-height 1.15. Two block spans: `.title-line` "AI that actually" (#0a2540) and `.title-gradient` "knows your business" (brand gradient text).
  * Measured: 43.2px / lh 49.68px / ls -1.296px @1440x900; 32px / 36.8px @1280x800; 56px / 58.8px @768; 40px / 42px @390.
* `p.hero-subtitle`:
  * Text: "Every AI is generic until it knows you. BinarBase builds a living digital twin of your company — your definitions, your numbers, your way of working. **One brain. Correct answers. Everywhere.**". The strong part is #0a2540 at 600.
  * Measured: 16px / 25.6px #425466 @1440x900; 15.2px @1280x800; 19.2px / 30.72px @768; 18.4px / 27.6px @390.
* `.hero-actions > .hero-cta` (flex, gap 1rem, centred, mb 1.25rem; column at ≤640):
  * `a.cta-primary` "Start Free Trial" + arrow svg (18px, `M5 12H19M19 12L12 5M19 12L12 19`) → `https://app.binarbase.com/signup`.
    * Box: 186x58, background #6042f9, white, 16px/600, padding 14px 24px, radius 8px, gap 8px.
    * Hover: background #4d35c7, `box-shadow:0 8px 20px #6042f959`, `translateY(-1px)`, arrow `translate(3px)` (.2s).
  * `button.cta-secondary.disabled[disabled]`:
    * Contents: `.play-icon` (28px #6042f9 circle with a white 12px play triangle), then "Watch Demo", then `.coming-soon-badge` "COMING SOON".
    * Button: transparent, border 1px #e6ebf1, opacity .6, cursor not-allowed.
    * Badge: absolute top -8px right -8px, `linear-gradient(135deg,#f59e0b,#d97706)`, 9.6px/700, tracking .5px, uppercase, padding 3.2px 8px, radius 4px.
* `.trust-row` (flex wrap, gap 2rem; 16px under max-height 800; column at ≤640). `.trust-item` is .9rem (14.4px), #697386, gap .5rem, with an 18px `#00d4aa` icon. Items:
  1. "Grounded in your definitions" (check-circle)
  2. "First answers in minutes" (check-circle)
  3. "Yours in any AI" (lock)
  4. `a.trust-link` "Runs in the cloud or on your servers" → `#deployment` (server icon). Colour #6042f9 at 500; hover is underlined with offset 3px.
* Reveal: badge, title, subtitle, cta and trust-row are each `[data-aos=fade-up]` with delays 0 / 100 / 200 / 300 / 400ms (see Motion).

## 6. Section 2 — "Your AI, upgraded" (`#upgraded`, padding 6rem 0; 4rem at ≤768)

* Header:
  * Badge: `01 · Your AI, upgraded`.
  * h2: "Turn any AI into your`<br>`**[gradient]most experienced employee.**"
  * Subtitle: "On day one, even the smartest AI is a brilliant stranger — it doesn't know your definitions, your history, or how your team actually works. BinarBase gives it years of institutional memory."
* `.mismatch-panel` (aos):
  * Box: max-width 780px, white, border, radius 20px, padding 2rem (1.5rem at ≤768), shadow `0 4px 16px #0a25400d`, mb 3rem. 780x440 @1440.
  * `p.mismatch-label` "THE SAME WORD, THREE DIFFERENT NUMBERS": .75rem/700, tracking .08em, uppercase, #697386, mb 1.25rem.
  * `.mismatch-rows`: flex column, gap .75rem. Each `.mismatch-row` is a grid `130px 1fr 24px`, gap 1rem, padding .9rem 1.1rem, background #f6f9fc, border, radius 12px. ≤768 changes it to areas `"source mark" "definition definition"`, columns `1fr 20px`, gap .35rem .75rem.
    * E-shop / revenue = all orders
    * Accounting / revenue = invoices issued
    * CRM / revenue = signed contracts
    * The source is .95rem/700 #0a2540; the definition is .95rem #425466; the mark is a 20px X in #e2506b.
  * `.mismatch-callout`:
    * Box: background `#6042f90d`, border-left 3px #6042f9, radius 0 12px 12px 0, padding 1.25rem, mt 1.5rem.
    * Contents: `strong` "Which one will your AI pick? Whichever one it likes." (1rem, mb .5rem), then span (.92rem / 1.65, #425466) "And it happens inside a single system too: average your margin percentages and you get a number that isn't your margin. Count your rows and you've counted order lines, not orders. Both look right. Both are wrong."
* `.compare-table` (aos):
  * Box: max-width 940px, white, border, radius 20px, shadow as above, overflow hidden.
  * Head and rows are grids `1fr 1.4fr 1.4fr`. The head background is #f6f9fc with a bottom border; rows have top borders.
  * `.compare-cell`: padding 1.1rem 1.35rem, .95rem, gap .6rem.
  * Head: (empty) | "Any AI on day one" (`.compare-generic-head`: .85rem/700, #697386) | "The same AI, with BinarBase" (`.compare-bb-head`: #6042f9).
  * The BinarBase column (`.compare-bb`) has background `#6042f90b`, `box-shadow: inset 2px 0 #6042f959`, #0a2540 at 600.
  * Generic cells are #697386 with an 18px X mark in #c3cad6. BB cells have an 18px check in #00d4aa.
  * Rows (label | generic | BB):
    * Your definitions | Guesses what "revenue" means | Knows your confirmed definition
    * Your history | Starts from zero every chat | Remembers decisions & corrections
    * Your flows | Generic best practice | Follows how your team actually works
    * When it's unsure | Answers anyway | Asks — like a good employee would
    * Where numbers come from | Black box | Shows its work — source & definition
  * ≤768: the head is hidden, each row is a block (padding 1.1rem 1.25rem), cells get padding .3rem 0, and the label is .8rem uppercase #697386.
* `p.compare-closing` (aos): 1rem / 1.7, #425466, max-width 720px, mt 2.5rem, centred. Text: "The difference isn't a smarter model — it's context. And because a wrong number in a board meeting is a disaster, every answer shows its work."

## 7. Section 3 — Connectors & MCP (`section.integrations-section`, padding 5rem 0 base; measured 56px @1440x900, 40px 32px @1280x800, 48px 0 @768, 40px 0 @390)

* Header:
  * Badge (emerald/green): `02 · Connectors & MCP`.
  * h2: "Everything connected. **[gradient-text-emerald]One meaning.**"
  * Subtitle: "200+ connectors bring your systems together and map them onto your definitions. One MCP endpoint serves the result to any agent you already use."
* `.integrations-content`: grid `1fr 1fr`, gap 4rem (40px @1440x900, 32px @1280x800), mt 3rem, align centre. 1 column at ≤1024 (visual second); at ≤640 the visual comes first and the text is centred.
* Left column, `.integrations-info` (max-width 560px):
  * `h3.integrations-headline` "Connecting tools is easy. Meaning is the hard part.": 1.75rem/700 base (24px @1440x900, 20px @1280x800, 28px @768, 20px @390).
  * `p.integrations-description` (1.1rem / 1.7 base; 16px / 27.2px @1440x900): "Every vendor can connect your tools — that's table stakes. The hard part is meaning: knowing that your "active customer" is someone who bought in the last 90 days, that your fiscal month starts on the 1st, and that averaging your margin percentages doesn't give you your margin. BinarBase maps every connected source onto definitions your team confirmed, and keeps them in sync."
  * `ul.integrations-features`: gap 1.25rem. Each `li` is flex, gap 1rem. The icon box is 40x40 (36 under the 900 query), radius 10px, background `linear-gradient(135deg,#10b9811a,#10b9810d)`, with a 20px #10b981 icon. The text block has a `strong` (1rem/600) and a `span` (.9rem / 1.5, #425466). Items:
    * **200+ connectors** — Stripe, Shopify, QuickBooks, Xero, HubSpot, Salesforce and more — connected once, kept in sync
    * **Mapped to your definitions** — Every field lands on a metric you confirmed, so a number means the same thing everywhere
    * **One MCP endpoint out** — Add BinarBase to Claude, ChatGPT or Cursor and they read your brain live, with your permissions
    * **Governed and audited** — Access follows your roles, every call is logged, data encrypted, GDPR ready
  * `.integrations-cta` holds `a.cta-primary` "Connect Now" + arrow → `https://app.binarbase.com/signup`.
* Right column, `.integrations-visual > .data-brain`:
  * Size: 420x420 base; 480 at ≥1400 (measured 480 @1440); 540 at ≥1600; 320 at ≤1024.
  * 3 `.brain-pulse` rings: 48% size, border 2px `rgba(96,66,249,.4)`, `brain-pulse-anim` 2s ease-out infinite, delays .15 / .3 / .45s.
  * `.brain-core` is a 200px circle (220 at ≥1400, 260 at ≥1600) with the brain gradient, `core-heartbeat` 2s ease-in-out infinite, cursor pointer. Hover adds `box-shadow 0 0 40px #6042f94d`.
  * Inside the core: 3 `.heartbeat-pulse` white rings (`heartbeat-wave` 2s, delays 0 / .1 / .2s) and `.brain-center` (80px; 90 at ≥1400) with the white BinarBase mark SVG at 60px (70 at ≥1400). The SVG is in the DOM dump.
  * **Click on the core:** the core gets `.brain-excited` (`brain-excited-beat` 1.2s ease-in-out) and the rings get `.pulse-excited` (`pulse-heartbeat` 1.2s, delays 0 / .1 / .2s) for 1200ms.
  * 6 `.floating-icon` tiles:
    * Each is 48px (52 at ≥1400, 56 at ≥1600), white, radius 14px, shadow `0 4px 20px #0000001a`, font-size 1.5rem.
    * Animation: `float-icon` 4s ease-in-out infinite (translateY 0 → -10px), delays 0 / .5 / 1 / 1.5 / 2 / 2.5s.
    * Emoji and positions:
      * 📊 fi-1: left 20%, top 5%
      * 💳 fi-2: right 10%, top 15%
      * 📈 fi-3: right 0, top 50%
      * 🔗 fi-4: right 15%, bottom 15%
      * ⚡ fi-5: left 15%, bottom 10%
      * 🎯 fi-6: left 0, top 45%

## 8. Section 4 — Engine (`#how-it-works.engine-section`, background #f6f9fc, padding 6rem 0; 4rem at ≤768)

* Header:
  * Badge: `03 · How the context works`.
  * h2: "A self-improving engine —`<br>`**[gradient]not a database someone has to maintain.**"
  * Subtitle: "Most "AI knowledge bases" are folders that rot: someone has to keep them current, and they go stale within months. Your BinarBase context is different — it's an engine. A private AI runs on your company's knowledge, continuously organising it, catching gaps, and turning every correction into a permanent improvement."
* `.engine-flow` (aos): flex, gap 1rem, centred, stretch. It holds 3 `.engine-step` with 2 `.engine-arrow` between them.
  * Arrow: #6042f9 at opacity .5, 26px svg.
  * Step: white, border, radius 16px, padding 2rem 1.75rem, max-width 320px, flex 1, shadow `0 2px 8px #0000000a`. 320x172 @1440.
    * `h4.engine-step-title`: 1.2rem (19.2px)/700, mb .6rem.
    * `p.engine-step-desc`: .93rem (14.88px) / 1.65, #425466.
  * The middle step is `.is-core`: border `#6042f966`, shadow `0 12px 30px #6042f91f`, plus `.engine-step-badge` "PRIVATE AI".
    * Badge position: absolute, top -11px, centred.
    * Badge look: brand gradient, white, .68rem/700, tracking .06em, padding .25rem .85rem, pill.
  * Steps:
    * **Capture** — Data, documents and corrections become a structured, governed model
    * **Curate** (badge "private AI") — An internal AI promotes corrections into definitions, spots gaps, and keeps one source of truth
    * **Serve** — Correct, traceable answers for dashboards, agents and your own AI
  * ≤968: column; arrows rotated 90°; the badge sits at left 1.5rem without transform.
* `.engine-loop` (aos):
  * Box: max-width 860px, mt 1.75rem, background `#6042f90a`, border `1px dashed rgba(96,66,249,.45)`, radius 14px, padding 1rem 1.5rem.
  * Text: #6042f9, .95rem/600, centred, gap .75rem.
  * Content: "↺" (1.2rem) "Every use and every correction feeds back — the engine restructures and improves itself".
* `.engine-cards`: grid with 3 columns, gap 1.5rem, mt 3rem; 1 column at ≤968. Each `.engine-card` is aos with delays 0 / 100 / 200.
  * Card: white, border, radius 16px, padding 1.75rem, shadow `0 2px 8px #0000000a`. `h4` is 1.05rem/700, mb .5rem; `p` is .92rem / 1.65, #425466.
  * Hover: border #6042f9, shadow `0 8px 20px #6042f91a`, `translateY(-2px)` (.2s).
  * Cards:
    * **A private AI curates it** — An internal AI keeps your context consistent — it turns corrections into definitions, flags the ones that are missing, and enforces one source of truth across every team.
    * **Self-improving by design** — Every use and correction feeds back. The engine compounds — no manual upkeep, no rot. Sharper every week, on its own.
    * **Governed & private** — It runs on your context, with your permissions. Every change is auditable, roles are enforced, and nothing leaks out.

## 9. Section 5 — Console (`#console.console-section`, transparent, padding 6rem 0; 4rem at ≤768)

* Header:
  * Badge: `04 · Two ways to work with it`.
  * h2: "Manage it in BinarBase —`<br>`**[gradient]or from your own tools over MCP.**"
  * Subtitle: "Run your brain whichever way suits you: a console for editing definitions and sources by hand, and an MCP endpoint so Claude, ChatGPT or Cursor can read and work with the same context directly."
* `.console-grid`: 2 equal columns, gap 2rem (552px each @1440); 1 column at ≤968. Two `.console-pane` (aos, second has delay 100).
  * Pane: white, border, radius 20px, padding 2rem (1.5rem at ≤768), shadow `0 4px 16px #0a25400d`.
  * `.console-pane-label`: .72rem/700, tracking .08em, uppercase, #6042f9, mb .85rem.
  * `.console-pane-title`: 1.35rem (21.6px)/700.
  * `.console-pane-desc`: .95rem / 1.7, #425466, mb 1.5rem.
  * `.console-pane-note`: .85rem / 1.6, #697386, mt 1.1rem.
  * **Pane 1:**
    * Label: "MANAGE · THE BINARBASE CONSOLE". Title: "Your context and data, in one place". Desc: "Edit definitions in plain language, connect sources, review what the engine learned, and set who sees what. No code."
    * `.console-mock`:
      * Box: background #f6f9fc, border, radius 14px.
      * Bar: white, padding .7rem .9rem, three 9px #e6ebf1 dots, then "BinarBase · Context console" (.75rem/600, #697386).
      * Nav chips (`.console-nav-item`: .75rem/600, pill, padding .3rem .7rem, background #f0f3f7, #697386): Context, Data sources, **Definitions** (active: background `#6042f91a`, #6042f9), Corrections, Roles.
      * Body: 2 `.definition-row` (white, border, radius 10px, padding .9rem 1rem):
        * "Gross margin" with status `confirmed` (`.is-confirmed`: background `#00d4aa1f`, colour #00937a). Formula: `total profit ÷ total revenue — weighted, not an average of percentages`.
        * "Order count" with status `needs review` (`.is-review`: background `#ffbb0026`, colour #9a7100). Formula: `distinct orders — not order lines`.
        * Name is .92rem/700; status is .68rem/700 pill; formula is mono .8rem / 1.5.
    * Note: "Write the definition in plain language — the engine applies it everywhere".
  * **Pane 2** (`.is-accent`: border `#6042f959`, shadow `0 12px 30px #6042f91a`):
    * Label: "CONNECT · YOUR OWN TOOLS OVER MCP". Title: "Your context, inside the tools you already use". Desc: "One endpoint. Add it to Claude, ChatGPT or Cursor and they read your context live, with your permissions — no export, no rebuild."
    * `.endpoint-box`:
      * Box: background #f6f9fc, border, radius 12px, padding 1rem 1.15rem, mb 1.5rem.
      * Label: "A DIRECT LINE TO YOUR COMPANY BRAIN" (.68rem/700, uppercase, tracking .06em).
      * Value: "One brain. Every tool you use." (.95rem/600, #6042f9).
    * `ol.connect-steps`: gap .9rem; li is .95rem / 1.55. `.connect-step-num` is a 24px gradient circle with .78rem/700 white text. Steps:
      1. Add BinarBase as an MCP server in your agent
      2. Paste your endpoint and sign in
      3. Your agent now knows your business — live
    * Note: "Works with Claude, ChatGPT, Cursor and any MCP-ready agent. Access follows your roles; every call is logged."
* `.mcp-agents` (aos, mt 4rem, centred):
  * Label: "WORKS WITH THE AI YOU ALREADY USE" (.75rem/700, tracking .08em, #697386, mb 1.25rem).
  * Pills (`.mcp-agent`): white, border, pill, padding .65rem 1.2rem, .95rem/600, shadow `0 2px 8px #0000000a`. Hover: border #6042f9, `translateY(-2px)`. The mark is #6042f9. Pills:
    * ✦ Claude
    * ◎ ChatGPT
    * ✧ Gemini
    * ▶ Cursor
    * ◆ Copilot
  * Note below: "Works with Claude, ChatGPT, Cursor and any MCP-ready agent" (.85rem, #697386, mt 1rem).
* `.mcp-cards`: 2 columns here (`.console-section .mcp-cards`), max-width 820px, gap 1.5rem, mt 2.5rem; 1 column at ≤968. Cards are aos with delays 0 / 100; same style as engine-card.
  * **Yours to take** — Your definitions, knowledge and history are yours to export — whenever you want them
  * **One brain, every surface** — Dashboards, BinarBase agents and your favourite chat AI — always in sync

## 10. Section 6 — Product showcase (`#product.features-section`, background #f6f9fc, `overflow:hidden`)

Padding is 4rem 0 base. Measured: 56px 0 @1440x900, 40px 32px @1280x800, 48px 24px @768, 40px 16px @390.

* `.features-header`: max-width 700px (800 at ≥1400), padding 0 2rem, centred, mb 2.5rem (32px measured).
  * Badge: `05 · What your brain does for you`.
  * `h2.features-title`: "One context. **[gradient]Every output.**" Base `clamp(2.5rem,5vw,3.5rem)`/800, -.03em. Measured 44px @1280x800, 40 @768, 32 @390. At 1440x900 the max-height query gives `clamp(2.25rem,5vw,3rem)`, which is 48px.
  * `p.features-subtitle`: "None of this is a separate product. Each one is the same Company Context, put to work — which is why they all use your definitions, your voice and your rules without being told twice."
* `.showcase-container` (padding 2rem 0) > `.showcase-track`:
  * Horizontal flex with `overflow-x:auto`, `scroll-snap-type:x mandatory`, scrollbar hidden.
  * Gap and padding: gap 2rem / padding 2rem 4rem base; 2.5rem / 2.5rem 5rem at ≥1400 (40px / 40px 80px measured @1440); 1rem / 1rem at ≤640.
* 5 `.showcase-card` (`scroll-snap-align:center`, cursor pointer, `transition: transform .4s ease, opacity .4s ease`):
  * Width / min-height: base 480 / 540; ≥1400 520 / 580; under max-height 900 400 / 480 (**measured 400px @1440x900**); ≤1280 420 / 500; max-height 800 380 / 460 (measured 380 @1280x800); ≤768 360 / 480; ≤640 `calc(100vw - 2rem)` with max 340.
  * Non-active cards: opacity .6, `scale(.95)`. The active card is opacity 1, scale 1.
  * `.card-inner`: white, border, radius 24px, shadow `0 4px 24px #00000014`, flex column. Active: border #6042f9, shadow `0 8px 32px #6042f926`.
  * `.app-screen`: background #f6f9fc, bottom border.
    * `.screen-header`: white, padding 1rem 1.5rem, dots 10px #ef4444 / #f59e0b / #10b981, title .85rem/600 #425466 right-aligned.
    * `.screen-content`: padding 1.5rem, min-height 280px.
  * `.card-content`: padding 1.5rem (1rem at ≤640).
    * `.card-badge`: pill, .7rem/600, padding .35rem .75rem.
    * `h3.card-title`: 1.5rem/700 (20px at ≤640).
    * `p.card-desc`: .95rem / 1.6, #425466.
    * `ul.card-features`: gap .5rem; li is .9rem, gap .75rem; `.check` "✓" in #10b981 at 600.
  * Cards (screen title / badge colour + text / title / desc / features). The mock UIs are fully in the DOM dump.
    1. **AI Agents** / blue "Always on" / **Work that arrives already done** / "Board summaries, account briefs, proposals — drafted by agents that already know your definitions, your processes and your voice. When a definition is missing they ask instead of guessing, so nothing lands on your desk quietly wrong."
       * Features: Board summaries in your format · Answers grounded in confirmed definitions · Asks you when a definition is missing.
       * Mock chat:
         * 36px avatar with `linear-gradient(135deg,#3b82f6,#06b6d4)`.
         * Header "AI Agent" plus "Just now".
         * Message: "Net revenue is 12% below plan this quarter — using your definition: orders − refunds − shipping. Two drivers explain most of it:"
         * Chips: Show the breakdown / Compare to last year / Draft board note.
         * Alert (background `#f59e0b1a`, strong #b45309): ⚠️ **Definition needed** — "Active customer" isn't confirmed yet — confirm it and I'll rerun this.
         * Disabled input with placeholder "Ask your company anything..." and a 40px gradient send button.
    2. **Revenue Forecast** / cyan "Your fiscal calendar" / **Forecasts you can defend** / "Runway, cash flow and revenue projected on the metrics your team confirmed and the fiscal calendar you actually use — with the source behind every line, so the first question in the room doesn't derail the meeting."
       * Features: 30/60/90 day projections · What-if scenarios on your own drivers · Runway on your burn definition.
       * Mock:
         * "Revenue Projection" with legend Actual / Predicted / Confidence (#06b6d4).
         * SVG line chart, 120px tall.
         * Stats: Q4 Forecast €2.4M, Confidence 89% (cyan), YoY Growth +34% (green).
         * Pills: **Base Case** (active), Best Case, Worst Case.
    3. **Reports & Dashboards** / emerald "Traceable" / **The end of arguing about whose number is right** / "Live dashboards and board-ready reports where every metric traces back to a definition your team confirmed. One number, the same everywhere, with its origin one click away."
       * Features: Every metric traceable to its definition · Board-ready reports in seconds · One number — the same everywhere.
       * Mock:
         * Widgets: MRR €847K ↑ 12%; Gross Margin 67.2% ↑ 2.2%.
         * Bars: 80px tall, violet gradient `#8b5cf6cc→#8b5cf64d`; active bar is `#8b5cf6→#a78bfa`. Heights are set by `--h`.
         * "📊 Q4 Board Report" with status Ready. Pills: Revenue +23%, Margin 67%, CAC +8%.
         * "Live data • Updated 2s ago" with an 8px green `live-pulse` dot.
    4. **Connected Apps** / purple "200+ connectors" / **Your systems, finally speaking one language** / "Accounting, CRM, payments and e-commerce connected in minutes, then mapped onto the definitions you confirmed. Connecting tools is the easy part — this is the part that makes the data mean something."
       * Features: 200+ native connectors · Mapped onto your confirmed metrics · Kept fresh automatically.
       * Mock:
         * 2x2 grid: 💳 Stripe ✓, 📊 QuickBooks ✓, 🛒 Shopify ✓, ☁️ Salesforce +.
         * Amber sync bar "Mapping your data onto your definitions..." with 3 `sync-pulse` rings (1.5s, delays 0 / .3 / .6s).
    5. **Voice Assistant** / amber "Coming soon" / **And whatever you build next** / "The context is yours to build on. Ask out loud from your phone, wire it into your own tools over MCP, or build something we haven't thought of — it all reads the same brain."
       * Features: Ask in plain language, anywhere · Answers on your own definitions · Your own apps over MCP.
       * Mock:
         * Voice orb: 60px with 3 `orb-pulse` rings (2s, delays 0 / .4 / .8s) and a 40px gradient core with a mic icon.
         * "LISTENING..." (.7rem/600, tracking 1px, #6042f9).
         * User bubble: "What's our net revenue this month?"
         * AI bubble: 🤖 "€847K net revenue — orders minus refunds and shipping, your definition. Up 12% on last month; Product X leads with €312K."
         * Quick actions: Show the source / Compare periods. These are #6042f9 pills, .65rem; hover background #8b5cf6 with `translateY(-1px)`.
* `.showcase-nav` (mt 2rem, gap 2rem; 1rem at ≤640):
  * `button.nav-arrow` prev/next: 48px circle (40 at ≤640), white, border, shadow `0 2px 8px #0000000f`, 20px chevron in #425466. Hover: background #f6f9fc, border and icon #6042f9. Disabled: opacity .3, cursor not-allowed. Prev is disabled on card 0; next is disabled on card 4.
  * `.nav-dots`: gap .75rem, 5 dots 10px #e6ebf1. The active dot is 32x10 pill #6042f9 (`transition: all .3s`).
* **Behaviour:**
  * Active index starts at 0.
  * Clicking a card, dot or arrow sets the active index and calls `track.scrollTo({left: card.offsetLeft - track.width/2 + card.width/2, behavior:'smooth'})`.
  * There is no auto-advance and no scroll listener: manual horizontal scrolling does not change the active state.

## 11. Section 7 — Deployment (`#deployment.deploy-section`, background #f6f9fc, padding 6rem 0; 4rem at ≤768)

* Header:
  * Badge: `06 · Where it runs`.
  * h2: "One brain.`<br>`**[gradient]Runs where you decide.**"
  * Subtitle: "Your Company Context is the same everywhere: your definitions, knowledge and memory. You only choose where it runs: in our EU cloud, in your own cloud, or on your own servers with local AI models."
* `.dp-switch` (`role=radiogroup`, aria-label "Where it runs"):
  * Box: white, border, pill, padding .35rem, gap .5rem, fit-content, centred, mb 1.5rem. 490x53 @1440.
  * `.dp-switch-btn` (`role=radio`): min-height 40px, padding 0 1.1rem, .92rem/600, #425466, hover #0a2540. Active is #6042f9 with white text (`.25s`).
  * Options: **BinarBase Cloud** · Private cloud · On-premise · local AI.
* **Auto-cycle:** an IntersectionObserver (threshold .35) on the diagram starts `setInterval` every **4500ms** while in view, cycling cloud → private → onprem. It stops when out of view. Any user click on a switch button or column head stops it permanently. It is disabled with reduced motion.
* `.dp-diagram` (`role=img`):
  * Box: max-width 1040px, white, border, radius 24px, padding 3.25rem 1.5rem 1.75rem, shadow `0 4px 16px #0a25400d`, mb 3rem.
  * Layout: grid `1fr 150px 1fr 150px 1fr` (230 / 150 / 230 / 150 / 230 @1440).
  * `.dp-boundary` (dashed boundary box): `2px dashed #00a67d`, background `#00a67d0d`, radius 18px, margin -2.25rem -.75rem -.75rem. It spans 1 column for cloud, 3 for private and 5 for on-prem. Label `.dp-boundary-label` (.72rem/700 uppercase, tracking .08em, #00a67d): "YOUR NETWORK" / "YOUR CLOUD ACCOUNT" / "YOUR BUILDING".
  * Node 1 `.dp-systems`: "Your systems" (1rem/700). Chips (`.dp-chips li`: .8rem/500, background #f6f9fc, border, radius 8px, padding .3rem .65rem): ERP & accounting · CRM · E-shop · Documents.
  * Link A (`.dp-link`): an animated dotted line `<i>` (radial dots 2px every 14px, `dp-flow` .9s linear infinite) plus a tag (.7rem/700). Colour by state:
    * `--dp-in` #00a67d: "stays inside"
    * `--dp-out` #6042f9: "leaves your network"
    * `--dp-opt` #d68a00 at opacity .55: "only if you choose"
  * Node 2 `.dp-brain`:
    * `.dp-where` pill (location: "BinarBase EU cloud" / "Your cloud account" / "Your servers"): background `#6042f914`, border `rgba(96,66,249,.18)`, .78rem/700 #6042f9.
    * `.dp-orb`: 84px, radial gradient, `dp-pulse` 2.6s ease-out infinite (box-shadow ring 0→22px), with a 64px white stroke svg.
    * "Company Context" / "definitions · knowledge · memory".
  * Link B: same as link A.
  * Node 3 `.dp-models`: "AI models" with name / sub per mode:
    * Claude · ChatGPT · Gemini / leading cloud models
    * Cloud or private models / your choice
    * Local open models / on your own GPUs
  * Link states per mode (verified by clicking each mode live):
    * cloud: A `.out` / B `.out` ("leaves your network"), boundary `span-1`
    * private: A `.in` ("stays inside") / B `.opt` ("only if you choose"), boundary `span-3`
    * onprem: A `.in` / B `.in`, boundary `span-5`
  * Mode changes cross-fade with a Vue `dp-fade` transition (opacity .35s ease).
  * ≤768: single column with rows `auto 72px auto 72px auto`. Links become vertical (`dp-flow-v`) and the tag is absolutely positioned at left calc(50% + 14px).
* `p.dp-caption`: 1rem / 1.6, #425466, max-width 720px, margin -1.5rem auto 3rem. Content is `<strong>{name}</strong>` + description:
  * Cloud: "We host and run everything. The fastest way to start: live the same day."
  * Private: "A dedicated BinarBase instance in your own cloud account and region, under your security rules."
  * On-prem: "BinarBase and open AI models run on your own hardware. Nothing has to leave your building, and it can run fully offline."
* `.dp-table` (role=table, "The three setups side by side"):
  * Box: white, border, radius 20px. Rows `.dp-tr` are a grid `1.2fr repeat(3,1fr)` (296.57 / 247.14 ×3 @1440). Cells have padding 1rem 1.1rem, .92rem.
  * Head row: empty cell, then `button.dp-colhead` per mode (background #f6f9fc, .95rem/700). Each head contains `.dp-available` "Available now" (.68rem/700, pill, background `#00a67d14`, #00a67d) above the mode name. The active column head is background `#6042f914` and #6042f9. The active column's cells are background `#6042f90a`. Clicking a head selects that mode.
  * Group rows `.dp-group` (.72rem/700 uppercase, tracking .08em, #697386, background #fbfcfe):
    * "WHAT LEAVES YOUR NETWORK?"
    * "RUNNING IT"
  * Data rows (row head is 600 #0a2540; cells are #425466 with a 20px `.dp-mark` circle icon: out = violet arrow on `#6042f91a`, in = green check on `#00a67d1a`, opt = amber minus on `#d68a001f`):
    * Your data and documents | ↗ Stored in our EU cloud | ✓ Stays in your cloud account | ✓ Stays on your servers
    * Company Context (definitions, memory) | ↗ Stored in our EU cloud | ✓ Stays in your cloud account | ✓ Stays on your servers
    * Questions and answers | ↗ Processed by our AI provider | − Only if you choose a cloud model | ✓ Stay on your servers
    * Who runs it | BinarBase | BinarBase together with your IT | Your IT, with our support
    * Works offline | No | No | Yes, fully offline is possible
    * Best for | Most companies that want to start now | Companies with their own cloud and strict security rules | Banks, insurance, healthcare, manufacturing, public sector
  * CTA row: `a.dp-cta` "Book a call →" (#6042f9/600; hover underline offset 3px). The hidden `.dp-cta-mode` span carries the mode name. Links:
    * `mailto:info@binarbase.com?subject=BinarBase%20deployment%3A%20BinarBase%20Cloud`
    * `…%3A%20Private%20cloud`
    * `…%3A%20On-premise%20%C2%B7%20local%20AI`
  * ≤768: single column, head hidden, each cell shows `::before{content:attr(data-col)}` as a .72rem uppercase label.
* `p.dp-note`: .85rem / 1.6, #697386, centred, mt 1rem. Text: "Connecting an outside AI such as ChatGPT or Claude over MCP shares what it reads with that provider, in any setup. For a fully local setup, use local models. Details on our AI providers: [Sub-processors](/subprocessors)" (link #6042f9).
* `.dp-local`:
  * Box: max-width 780px, mt 3rem, background `#6042f90d`, border-left 3px #6042f9, radius 0 16px 16px 0, padding 1.5rem 1.75rem.
  * `h3`: "Why a smaller local model is enough" (1.1rem/700).
  * `p` (.98rem / 1.65): "Local models are smaller than the big cloud ones. With your Company Context they don't have to guess what revenue means: they answer from your confirmed definitions and show where every number comes from."

## 12. Section 8 — Proof / stories (`#proof.blog-section.proof-section`)

Padding is 5rem 2rem; measured 80px 32px @1440 and @1280; 64px 16px @768/390.

* Header:
  * Badge: `07 · From our clients`.
  * h2: "Already working`<br>`**[gradient]in companies like yours.**"
  * Subtitle: "Read how companies across Slovakia and the CEE region use BinarBase."
* `.proof-logos` (mb 3rem, centred):
  * `p.trusted-label` "BUILDING THEIR COMPANY BRAIN ACROSS SLOVAKIA & CEE": 13.6px/500, tracking .15em (2.04px), uppercase, #697386, mb 1.5rem.
  * `.trusted-logos`: flex nowrap, gap 3rem (wrap with gap 1.25rem at ≤768), padding 0 2rem.
  * 11 `img.client-logo` (lazy). Base style: height 30px, max-width 120px, `object-fit:contain`, `filter:grayscale(100%)`, opacity .5. `.logo-dark` has opacity .34; `.logo-large` has height 45px. At ≤768 the heights are 20 / 26px. Logos in order (alt):
    * Applifting
    * Impact Hub
    * eConsulting
    * Delia
    * J&T Wine Fund (`.logo-dark`)
    * Highgate Group (`.logo-dark.logo-large`)
    * Wflow
    * Malcom
    * This One
    * Realitní Advokáti (`.logo-large`)
    * BWD
  * Static row: **no marquee/animation**.
* `.blog-grid`: 3 columns, gap 2rem, max-width 1200px, mb 3rem. It becomes 1 column with max 500px at ≤1024.
  * `article.blog-card`: white, border, radius 20px, shadow `0 4px 24px #0000000f`. Hover: border #6042f9, shadow `0 12px 32px #6042f926`, `translateY(-4px)` (.3s).
  * `.blog-card-inner`: padding 2rem, flex column.
  * Inside each card:
    * `.blog-category.success-story` "SUCCESS STORY": .75rem/600, tracking .05em, pill, background `#10b9811a`, border `rgba(16,185,129,.2)`, #10b981.
    * `h3.blog-title`: 1.25rem / 1.4 / 700.
    * `p.blog-excerpt`: .9rem / 1.6, #425466, flex-grow.
    * `.blog-meta`: .8rem, #697386, gap 1rem.
    * `a.blog-link` "Read the story" + arrow: .9rem/600, #6042f9, gap .5rem → .75rem on hover.
  * Cards:
    1. **Transforming Wine Distribution: How BWD Achieved Real-Time Sales Intelligence** — How BWD eliminated hours of daily Excel reporting and empowered their sales team with real-time analytics and inventory planning. — February 2026 · 5 min read → `/insights/bwd-case-study`
    2. **How BinarBase Enhanced Voxberg's Analytics** — Discover how BinarBase helped Voxberg transform data chaos into strategic clarity, enabling smarter business decisions through unified analytics and real-time reporting. — December 2024 · 5 min read → `/insights/voxberg-case-study`
    3. **Automating Financial Workflows at Applifting** — How Applifting boosted efficiency and control by automating financial processes through BinarBase, saving over 46 hours of work every month. — November 2024 · 4 min read → `/insights/applifting-case-study`
* `.blog-cta > a.blog-all-link` "All stories & insights" + arrow → `/insights`:
  * Box: white pill, border, padding 1rem 2rem, 1rem/600, shadow `0 2px 8px #0000000f`.
  * Hover: background #f6f9fc, border #10b981, gap .75→1rem.

## 13. Section 9 — For teams (`#teams.solutions-section`, transparent, `overflow:hidden`)

Padding is 5rem 0; measured 56px 0 @1440x900.

* `.superpowers-header`: max-width 800 (900 at ≥1400), centred.
  * Badge (cyan → green variant): `08 · ⚡ For teams`. The ⚡ is `.badge-icon-small` (.9rem).
  * `h2.superpowers-title`: "Start where it hurts most. **[gradient-text-cyan]Then let it spread.**" Base `clamp(2.5rem,5vw,4rem)`/800, -.03em, lh 1.1, mb 1.5rem. Measured 44 / 48.4px @1280x800, 40 @768, 32 @390.
  * `p.superpowers-subtitle` (1.2rem / 1.7): "Most companies start with finance, because that is where a wrong number costs the most. The same brain then serves every other department without being rebuilt — it already knows the business."
* **Context tree** (`.ct`, scoped `a6fe94b3`): max-width 1200px, padding 0 2rem.
  * `.ct-layout` is a grid `1.2fr 1fr` (602 / 502 @1440), gap 2rem; 1 column at ≤1024 with the detail at max-width 620.
  * SVG graph `.ct-svg` (width 100%, overflow visible). The geometry and coordinates are in the DOM dump. Pieces:
    * Root "Your Company Context": `.ct-root-dot` #6042f9 with stroke `#6042f940` width 8; label 17px/800.
    * 4 core nodes (Definitions, Knowledge, Memory, Connectors): `.ct-core` circle r 5.5, white fill, stroke `#6042f9a6`; label 14px/700 #6042f9.
    * 4 departments (Finance, Marketing, Sales, Operations): `.ct-dept` with a dot, white fill, stroke #6042f9 width 2.4. The active dot is filled #6042f9. Name is 17px/800.
    * 5 leaves per department: `.ct-leaf` circle with stroke `#00a67db3`; text 15px/600 #425466.
    * Line colours: dept lines `#6042f96b`, leaf lines `#00a67d5c`, core lines hidden. When the dept is active, core lines become `.is-on` (`#6042f957`, dasharray 3 4).
    * Non-active departments, their leaves and their lines get `.is-dim` (nodes opacity .28, lines .16), transition .25s.
    * SVG text grows at narrower widths: ≤1024 leaf 17 / dept 19 / core 16 / root 19; ≤620 20 / 23 / 19 / 23.
  * Interaction: mouseenter, focus, click, Enter or Space on a department sets it active. **Default is Finance (`cfo`).** There is no auto-cycle.
  * `aside` detail stack: all 4 `.ct-detail` are stacked in one grid cell; only `.is-shown` is visible.
    * Card: white, border, radius 20px, padding 1.6rem, shadow `0 10px 34px #0a254012`.
    * Head: 32px icon box (`#6042f91a`, radius 9px), role `h3` 1.3rem/800, then a stage pill. The pill is "START HERE" for Finance and "EXPAND" for the others: .62rem/700, background `#00a67d1f`, #00a67d.
    * Tagline: .92rem / 1.55.
    * `.ct-detail-pain` box (background #f6f9fc, radius 12px, padding .85rem .95rem) with label "TODAY:" and a .84rem pain text.
    * "WITH BINARBASE:" label in #6042f9, then the list (.86rem, 5px #00d4aa bullets).
  * Department content:
    * **Finance** — Invoices, margin and cash flow without the manual month.
      * Today: Thousands of supplier invoices keyed in by hand, margin visible only after the fact, and forecasts rebuilt in spreadsheets every cycle.
      * With: Supplier invoices read, matched and posted automatically / Live margin per order, product and customer / Cash flow and demand forecast on your own definitions / Month-end that doesn't depend on one person's spreadsheet / Every automation measured against real return.
      * Leaves: Invoice capture, Live margin, Cash flow forecast, Month-end close, ROI tracking.
    * **Marketing** — Spend you can defend, in a funnel that actually attributes.
      * Today: Budget spent without measurement in place, no segmentation, and attribution that never worked for a B2B buying cycle.
      * With: RFM segmentation on your own customer history / Attribution that fits B2B, not just last click / Measurement set up properly before the spend starts / SEO and content drafted from your real product data / Campaign history the whole team can query.
      * Leaves: RFM segments, B2B attribution, Measurement, SEO & content, Campaign history.
    * **Sales** — Quotes in minutes instead of days — and a reason for every loss.
      * Today: Enquiries arrive as PDFs, e-mails and scans, then get retyped line by line while the best opportunities go cold.
      * With: Unstructured enquiries turned into priced quotes automatically / Supplier product codes matched to your own catalogue / Duplicate enquiries for the same project flagged / Every lost quote captured, with the reason why / Public tenders surfaced instead of missed.
      * Leaves: Enquiry → quote, Code matching, Duplicates, Loss reasons, Public tenders.
    * **Operations** — Stock, ordering and transfers that run themselves.
      * Today: Min–max limits maintained in Excel, a six-hour export before anyone can look at stock, and people tied up entirely by internal transfers.
      * With: Min–max stock limits maintained automatically / Stock levels on demand, not after an overnight export / Purchase orders and internal transfers proposed for approval / Supplier price lists consolidated into consistent product data / Product cards completed with the attributes that are missing.
      * Leaves: Min–max limits, Live stock, Order proposals, Internal transfers, Product data.
  * `p.ct-note` (.82rem, #697386, mt 1.75rem, centred): "Hover a department to see what it inherits from the core — and what it adds on top."
* `.superpowers-heading` (aos, margin 4rem auto 2rem): `h3.superpowers-heading-title` "Trust isn't a feature. **[gradient]It's the whole point.**" `clamp(1.6rem,3vw,2.2rem)`/800 (35.2px @1440), -.02em.
* `.superpowers-row`: grid with 4 columns, gap 1.5rem, max-width 1200, padding 0 2rem. 2 columns at ≤1024; 1 column at ≤640 with items as a centred column.
  * `.superpower-item`: flex, gap 1rem, white, border, radius 16px, padding 1.25rem, shadow `0 2px 8px #0000000a`. Hover: border #6042f9, shadow `0 8px 20px #6042f91a`, `translateY(-2px)`.
  * Icon: 48px box, radius 12px, emoji 1.5rem, with a tinted gradient plus border per colour (blue / cyan / emerald / amber, see `.superpower-icon.*`).
  * `h4`: .95rem/600. `p`: .8rem / 1.4, #697386.
  * Items:
    * 🧠 (blue) **Every number shows its work** — Definition, source and period — on demand, for any figure
    * ⚡ (cyan) **It asks instead of guessing** — No confirmed definition? It asks you rather than faking a confident answer
    * 🔮 (emerald) **Role-based by design** — People see only what they should, and every access is logged
    * 🛡️ (amber) **Enterprise security** — Data encrypted in transit and at rest, GDPR ready

## 14. Section 10 — Pricing (`#pricing.pricing-section`, transparent)

Padding is 5rem 0; measured 56px 0 @1440x900.

* Header:
  * Badge: `09 · Pricing`.
  * h2: "Built for you. **[gradient]Owned by you.**" (no subtitle inside the header).
* `p.section-subtitle.pricing-lede` (max-width 720px, margin -1.5rem auto 3rem): "Every company is a different size, runs different systems and needs different things from a brain. So we price each one individually — you get everything below, scoped to what you actually need."
* `.setup-banner` (aos):
  * Box: max-width 900px, background `#6042f90a`, border `1px dashed rgba(96,66,249,.4)`, radius 20px, padding 2rem, centred, mb 3rem.
  * Label: "GET STARTED · YOURSELF OR WITH US" (.72rem/700, tracking .08em, #6042f9).
  * `h3.setup-title`: "Connect your tools, confirm your definitions — live the same day." `clamp(1.2rem,2.4vw,1.5rem)`/700.
  * `p` (.95rem / 1.7, max 640): "Standing up your brain takes an afternoon, not a data project: connect your sources, confirm what your metrics mean, and your first dashboards and agents go live. Do it yourself, or have us set it up with you."
* `.quote-card` (aos):
  * Box: max-width 900px, white, border `1px solid rgba(96,66,249,.3)`, radius 24px, padding 2.5rem (1.75rem 1.25rem at ≤720), shadow `0 20px 60px #6042f924`.
  * `.quote-head` (centred, pb 2rem, border-bottom, mb 2rem):
    * `.quote-label` "ONE PLATFORM, NO TIERS": pill, background `#6042f917`, .7rem/700.
    * `.quote-price` "On request": gradient text, `clamp(2.2rem,5vw,3rem)`/800, -.03em, lh 1.1. 48px @1440.
    * `p.quote-desc` (1rem / 1.7, max 560): "One platform, nothing held back behind a higher tier. We size the engagement around your business, not around a plan name."
  * `ul.quote-features`: grid with 2 columns (1 column at ≤720), gap .75rem 2rem. Each li is .92rem / 1.5, #425466, with an 18px #00d4aa check svg. Features (15):
    * Company Context — your confirmed definitions
    * Connectors to your systems — 200+ available
    * Custom dashboards built on your definitions
    * Agent library — board summaries, briefs, proposals
    * MCP endpoint for Claude, ChatGPT and Cursor
    * The learning loop — corrections become definitions
    * Definitions versioned and audited
    * Roles, permissions and full access logging
    * Unlimited users
    * We run ingestion and keep sources fresh
    * Custom agents built for your processes
    * Dedicated success manager
    * Priority support and SLA
    * Data encryption, role-based access, GDPR ready
    * Deploy in our EU cloud, your private cloud or on-premise
  * `.quote-foot` (border-top, pt 2rem, centred):
    * `a.cta-primary.cta-wide.quote-cta` "Get a quote" → `https://app.binarbase.com/signup` (padding .875rem 2.5rem).
    * `p.quote-note` (.88rem / 1.65, #697386, max 620): "We scope the price to the size of your business and the use cases you start with — no tiers to outgrow."
* `p.pricing-guarantee` (aos; .95rem / 1.7, #697386, max 680, mt 3rem): "Every engagement is done when your twin correctly answers the 20 questions your team actually asks. We call it the 20-Question Test."

## 15. Section 11 — Final CTA (`section.final-cta`) and Section 12 — Footer

**Final CTA**
* Padding is 5rem 0; measured 56px 0 @1440x900.
* `.cta-container`: max-width 800 (900 at ≥1400, 1000 at ≥1600), padding 0 2rem. `.cta-glow-bg` is `radial-gradient(ellipse at center,rgba(59,130,246,.15) 0,transparent 70%)` at inset -50%.
* `.cta-content`:
  * Box: white, border, padding 4rem (5rem at ≥1400; **2.5rem under max-height 900, measured 40px**; 2rem under max-height 800), centred, shadow `0 8px 32px #0000000f`.
  * Radius: 32px base; 24px measured at 1440x900.
  * `::before`: 1px top line `linear-gradient(90deg,transparent,#6042f9,transparent)` at opacity .3.
* `h2.cta-title`: "Stop prompting a stranger.`<br>`**[gradient]Start working with a brain that knows you.**" 800 weight. Measured 36px @1440x900, 30px @1280x800, 32px @768/390.
* `p.cta-subtitle`: "Give your company an AI brain — live the same day, smarter every week." Measured 16px @1440x900.
* `.cta-actions` (flex centred, gap 1rem; column at ≤640):
  * `a.cta-primary.large` "Start Free Trial" + arrow → `https://app.binarbase.com/signup` (padding 1rem 2rem, 1.05rem).
  * `button.cta-secondary.large` "Schedule Demo" + 18px right-arrow svg (`M5 12H19M19 12L12 5M19 12L12 19`). It is a plain `<button>` with no href or action. The svg nudges `translate(3px)` on hover.

**Footer** (`footer.footer`)
* Box: background `linear-gradient(180deg,#f8fafc,#fff)`, top border.
* `.footer-main`: max-width 1200, padding 4rem 2rem 3rem.
* `.footer-grid`: `2fr 1fr 1.5fr`, gap 3rem (462 / 231 / 347 @1440). ≤640: 2 columns with the brand spanning and centred. ≤480: 1 column, centred.
* Brand column (max 320):
  * Logo at 28px.
  * `p.footer-tagline` (.9rem / 1.6, #425466): "You built your company — you shouldn't need a data science degree to understand it. Give it a brain that knows your business, answers in plain language, and belongs to you."
  * Social: 36px squares, radius 8px, border, transparent background, #425466. Hover: background and border #6042f9, white, `translateY(-2px)`. Links:
    * LinkedIn → `https://www.linkedin.com/company/binarbase`
    * Facebook → `https://www.facebook.com/binarbase`
    * Instagram → `https://www.instagram.com/binarbase`
* `h4.footer-heading` "PRODUCT": .85rem/600, tracking .05em, uppercase, mb 1.25rem.
  * Links (.9rem, #425466, hover #6042f9, gap .75rem):
    * Features → `#product`
    * Pricing → `#pricing`
    * Start Free Trial → `https://app.binarbase.com/signup`
    * Blog → `https://www.binarbase.com/blog-en`
* "CONTACT" column (min-width 265px): 18px #697386 icons, gap .75rem, .9rem.
  * `info@binarbase.com` (mailto)
  * `+421 915 261 658` (tel:+421915261658)
  * Staré Grunty 18, 841 04 Bratislava
* `.footer-bottom` (white, top border):
  * Inner: max-width 1200, padding 1.5rem 2rem, flex space-between (column at ≤640).
  * Left: "© 2026 BinarBase, s.r.o. All rights reserved." (.85rem, #425466).
  * Right, `.footer-legal-links` (.85rem, gap .75rem, dividers "|" in #e6ebf1):
    * Terms & Conditions → `/terms-conditions`
    * Privacy Policy → `/privacy-policy`
    * Cookies Policy → `/cookies-policy`
    * Sub-processors → `/subprocessors`

**Cookie banner** (`.cookie-consent`, teleported outside `#__nuxt`; shown until a choice is made):
* Box: fixed bottom, white, top border #e5e7eb, shadow `0 -4px 24px #00000014`, padding 1rem, z 9999. Inner max-width 1100, gap 1.5rem.
* Title: "We use cookies" (.95rem/600, #1a1a2e).
* Body (.85rem / 1.55, #4b5563): "Strictly necessary cookies keep this site running. We would also like to measure how the site is used, and to measure our advertising. Neither happens unless you agree, and you can change your mind at any time. [Read our Cookies Policy](/cookies-policy)" (link #6042f9, underlined).
* Buttons (radius 10px, .875rem/600, padding .6rem 1.15rem, hover opacity .88):
  * "Necessary only" (white, border #d1d5db, #374151)
  * "Allow measurement" (same)
  * "Allow all" (#6042f9)
* ≤720: column layout with the buttons at flex 1.

## 16. Motion inventory

| what | trigger | spec |
|---|---|---|
| Scroll reveal `[data-aos="fade-up"]` (22 elements) | IntersectionObserver `{threshold:.1, rootMargin:"0px 0px -50px 0px"}`; adds `.aos-animate` once (never removed) | from `opacity:0; translateY(30px)` to `opacity:1; translateY(0)`, `transition: opacity .6s ease, transform .6s ease`; delays via `[data-aos-delay="100…400"]` → .1–.4s |
| aos targets | — | hero-badge (0), hero-title (100), hero-subtitle (200), hero-cta (300), trust-row (400), mismatch-panel, compare-table, compare-closing, engine-flow, engine-loop, engine-card ×3 (0/100/200), console-pane ×2 (0/100), mcp-agents, mcp-card ×2 (0/100), superpowers-heading, setup-banner, quote-card, pricing-guarantee |
| Quirk: engine-card / mcp-card | — | their own `transition: transform .2s, border-color .2s, box-shadow .2s` comes later in the CSS and overrides the aos transition. So opacity jumps instantly, translateY eases over .2s, and the delay attributes have no effect. Reproduce by keeping rule order. |
| Intro chapter swap | wheel / keys / swipe / buttons | see section 4: `.sbi-story.out` opacity + translateY(12px) .45s ease; text swap after 420ms (1600ms on first load); progress fill `width .5s ease` |
| Intro scroll cue | loop | `sbi-drip` 1.8s ease-in-out infinite: scaleY 0→1 (0–60%) then fade out |
| Nav light/dark | scroll (rAF) | background-color and border-color .35s ease; toggles `html.sbi-dark` |
| Hero badge dot | loop | `pulse` 2s infinite: scale 1→1.2, opacity 1→.5 |
| Hero blobs | loop | `blob-float` 20s ease-in-out infinite, delays 0/-5/-10/-15s: translate(30px,-40px) scale 1.05 @25%; (-20px,30px) .95 @50%; (-30px,-20px) 1.02 @75% |
| Brain core | loop | `core-heartbeat` 2s ease-in-out infinite: scale 1 → 1.05 (15%) → 1 (30%) → 1.03 (45%) → 1 |
| Brain rings | loop | `brain-pulse-anim` 2s ease-out infinite, delays .15/.3/.45s: opacity 0 → .6 (10%) → 0 at scale 2.2 (50%) |
| Heartbeat rings | loop | `heartbeat-wave` 2s ease-out infinite, delays 0/.1/.2s: scale 1→1.4, opacity peak .5 at 10%, 0 by 40% |
| Brain click | click | `.brain-excited` → `brain-excited-beat` 1.2s ease-in-out; rings `.pulse-excited` → `pulse-heartbeat` 1.2s ease-out (delays 0/.1/.2s); state cleared after 1200ms |
| Floating icons | loop | `float-icon` 4s ease-in-out infinite, translateY 0↔-10px, delays 0/.5/1/1.5/2/2.5s |
| Showcase cards | click/arrows/dots | transform + opacity .4s ease (inactive scale .95 / opacity .6); smooth scrollTo centring; dot width .3s |
| Live dot | loop | `live-pulse` 2s infinite: scale 1→1.2, opacity →.5 |
| Sync rings | loop | `sync-pulse` 1.5s infinite, delays 0/.3/.6s: scale .5→1.5, opacity 1→0 |
| Voice orb rings | loop | `orb-pulse` 2s ease-out infinite, delays 0/.4/.8s: scale .8→1.6, opacity 1→0 |
| Deployment auto-cycle | in view (IO threshold .35) | every 4500ms; stops permanently on user click; `dp-fade` opacity .35s; switch and column background/colour .25s |
| Deployment flow dots | loop | `dp-flow` .9s linear infinite: background-position 0→14px (vertical `dp-flow-v` on mobile) |
| Deployment orb | loop | `dp-pulse` 2.6s ease-out infinite: box-shadow 0 0 0 0 #6042f959 → 0 0 0 22px #6042f900 |
| Context tree | hover/focus/click | opacity .25s on nodes and lines; stroke .25s; dot fill .25s; detail cards swap instantly (opacity/visibility, no transition) |
| Hover lifts | hover | cta-primary −1px .2s; nav-cta −1px; blog-card −4px .3s; engine/mcp-card and superpower-item −2px .2s; mcp-agent −2px; footer social −2px; quick-action −1px |
| Logo row | — | **static**: no marquee or carousel |
| Reduced motion | media | disables intro transitions, drip, dp flow, orb and fade; intro stops the auto-transition delay |

Not used despite being in the CSS: `float`, `float-notif`, `typing`, `blink`, `dot-pulse`, `flow-move*`, `output-move*`, `ring-pulse`, `fade-slide-*`, `skeleton-shine`, all `deck*`.

## 17. Assets

All assets are listed in `assets.manifest.json`. Summary:

* Already in `public/assets/` (from the saved `_files` folder): `logo.svg` (655x140), applifting.png, impactHub.png, e-consulting-logo.png, delia.png, jt-wine-fund.png, highgate.png, wflow.png, malcom.png, this_one_sro_logo.jpeg, realitni_advokati.png, bwd.png. Live paths are `/logo.svg` and `/logos/<file>`.
* **Downloaded by recon** (were not in `_files`):
  * `public/assets/favicon.svg` (32 viewBox gradient #4f46e5→#e879f9)
  * `public/assets/favicon.png` (32x32)
  * `public/assets/apple-touch-icon.png` (256x256)
  * `public/assets/og/default.png` (1200x630)
* Fonts: none. The site uses only the system stack, and `public/assets/fonts/` was not created because there is nothing to put in it.
* Video / Lottie: none.
* Everything else (icons, the brain mark, the deployment orb glyph, chart SVGs, the context-tree graph) is inline SVG or emoji. Copy it from `recon/dom-1440-clean.html`.
* `<head>`:
  * `<html lang="en">`; title "BinarBase — AI that actually knows your business".
  * Meta description and og:description: "A digital twin of your company — your definitions, your data, your way of working — so dashboards are right and any AI finally understands your business."
  * og:image and twitter:image are `/og/default.png` at 1200x630; twitter:card is summary_large_image.
  * Icons: `favicon.svg`, `favicon.png`, `apple-touch-icon.png`.

## 18. Reference screenshots (1440x900, cookie banner dismissed, nav hidden for section crops)

`recon/screens/`:
* Intro:
  * `00-intro-3d-chapter1-1440.png` (with cookie banner)
  * `00-intro-ch1-1440.png` … `00-intro-ch7-1440.png` (one per chapter)
* Sections:
  * `01-hero-1440.png`
  * `02-upgraded-1440.png`
  * `03-integrations-1440.png`
  * `04-engine-1440.png`
  * `05-console-1440.png`
  * `06-features-showcase-1440.png`
  * `07-deployment-1440.png`
  * `08-proof-1440.png`
  * `09-teams-1440.png`
  * `10-pricing-1440.png`
  * `11-final-cta-1440.png`
  * `12-footer-1440.png`
* Mobile (390):
  * `m390-intro.png`
  * `m390-mobile-menu-open.png`
  * `m390-fullpage.png`
* Note: the fixed `.aurora-bg` makes element crops show a lighter or cut band at the crop edges. That is a screenshot artefact, not a design element.

## 19. Things Playwright could not measure

* 3D intro geometry, node positions, camera paths per chapter and label placement are WebGL/canvas. Only parameters from the source and the screenshots are available. A pixel-exact match needs a port of `recon/js/_BDyuz0e.js`; vendoring the site's code is a decision for the user.
* The deployment diagram was screenshotted in the "BinarBase Cloud" state only. The other two states were verified by DOM class (section 11), not screenshotted.
* The language dropdown's open state (desktop): the styles come from CSS and the options from the mobile menu DOM. It was not opened on desktop.

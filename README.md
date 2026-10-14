# BinarBase homepage clone

Local, pixel-faithful clone of the English homepage of https://binarbase.com/, built in
React 18 + Vite 5 + Tailwind 3 (preflight off; the original site's CSS is ported into
`src/styles/site.css` with its class names kept). The 3D intro is a three.js rebuild in
`src/components/Intro/`.

```bash
npm install
npm run dev        # http://localhost:5180
```

Recon evidence lives in `CLONE_SPEC.md`, `assets.manifest.json` and `recon/`.

## Information architecture

`ia.json` is the only IA file to hand-edit. `IA.md` and `matrix.csv` are **generated** —
never edit them directly; they are overwritten on every build.

```bash
node validate.mjs   # checks route/template totals, section references, categories
node build.mjs      # regenerates IA.md and matrix.csv from ia.json
```

Each section in `ia.json` names the component that renders it (`implementedBy`), so the IA
doubles as a map of `src/components/`.

### What the data shows

- The clone covers **1 route on 1 template** with **16 sections across 7 categories**.
  All 16 are single-use, so there is no shared-component question to answer yet: every
  section should stay page-local until a second page needs it.
- The page is mostly product explanation: 6 of the 16 sections are the numbered
  FEATURES blocks (01–06), against 1 PROOF, 1 SOLUTIONS and 2 CONVERSION sections.
- 4 sections are SHELL chrome (background, nav, footer, cookie consent) — these are the
  likeliest to become shared if more routes are cloned.

### Out of scope (not cloned, not modelled)

The live site also has these routes, which were never measured and so are not templates
in `ia.json`: `/insights`, `/insights/applifting-case-study`, `/insights/bwd-case-study`,
`/insights/voxberg-case-study`, `/privacy-policy`, `/terms-conditions`, `/cookies-policy`,
`/subprocessors`, and the `/cs/` and `/sk/` language versions. Links to them from the
homepage point at paths that do not exist in this clone.

## Using this clone

This copies a real company's brand, copy and client logos. Keep it as a local reference;
do not deploy it publicly without BinarBase's permission.

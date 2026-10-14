# BinarBase home page — design-repo

**Status: `design-review-pending` · `productionApproved: false`.** Built from scratch (v1.0.0, 2026-10-14) from a
measured clone of <https://binarbase.com/>. Nothing here has had human design approval.

A machine-validated PageSpec system: tokens → primitives → components → section contracts → one template →
compatibility graph → draft-07 schema → semantic validator → adversarial tests. An LLM composes a page as a
`PageSpec` JSON; `schema/semantic_validate.py` decides whether it is legal.

## Source and scope

| | |
|---|---|
| Source | https://binarbase.com/ — a **real, live company** (BinarBase, s.r.o., Bratislava) |
| Cloned | the English home page `/` only (React 18.3.1 + Vite 5.4.21 + Tailwind 3.4.19 with preflight off; three 0.169.0) |
| Clone styling | the original stylesheet ported verbatim into `src/styles/site.css` (original class names kept); Tailwind only for additions |
| Routes → templates | 1 route (`/`) → 1 template (`template.home`) |
| Out of scope | `/insights`, 3 case studies (`/insights/{bwd,voxberg,applifting}-case-study`), `/privacy-policy`, `/terms-conditions`, `/cookies-policy`, `/subprocessors`, `/cs/`, `/sk/` |

The scope reduction is deliberate. The out-of-scope routes are listed in `templates/routes.json →
outOfScopeRoutes` with evidence, and have **no template**: nothing here claims they were measured. Links
to them carry `linkRole: route.out-of-scope` and always raise the `OUT_OF_SCOPE_ROUTE_LINK` warning.

## Read this before generating anything (structurally unusual)

1. **Real company → two PageSpec purposes.**
   - `purpose: "reference-reconstruction"` is only legal for `template.home` at `/`. The bundled example
     uses it, so it contains the real copy, logos and endpoints.
   - `purpose: "generated"` is for anything new. It is rejected if it contains any of these:
     - a `live.*` link: app signup/login, `info@binarbase.com`, the phone number, social profiles or the blog.
       Use `placeholder.generated` hrefs such as `{{SIGNUP_URL}}` instead.
     - an asset whose role is not `may-generate-new`. That covers the BinarBase logo, mark, OG image and
       favicons, the 11 real customer logos, and the proprietary 3D intro scene. Use `brand.placeholder`
       (`{{BRAND_LOGO}}` / `{{BRAND_MARK}}`) instead.
     - any registry `protectedNames`: the company, its customers and its case studies.
     - the proof section at all (`GENERATED_NO_FABRICATED_PROOF`). Customer logos and case studies cannot
       be generated or invented; a human adds them later from real, licensed evidence.
2. **Pinned compliance values.** The policies of these roles are pinned to exact values in
   `extraction/verify_all.py` (`PINNED_ROLES`), not just checked for enum membership:
   - asset roles: `brand.logo`, `brand.mark`, `customer.logo`, `meta.og-image`, `meta.favicon`, `scene.intro-3d`
   - link roles: every `live.*` role, plus `route.out-of-scope`

   Changing one of them to a *different but valid* policy fails verification. `customer.logo` is
   `must-not-fabricate`: do not invent stand-in customers either.
3. **Cookie banner.** The clone stores `bb_cookie_consent` and loads **no** analytics. The original loads
   GA, GTM and PostHog after consent. The contract pins `loadsThirdPartyScripts: false`.
4. **Height-based breakpoints.** `(max-height:900px)` and `(max-height:800px)` (both only at ≥1024 px wide)
   shrink type, padding and showcase cards. At 1440x900 the page is *smaller* than at 1440x1000. See
   `tokens/00-foundation/breakpoint.json` and each section's `responsive` list.
5. **3D intro.**
   - It is WebGL: the original runs three r186, the clone runs three 0.169.
   - It is home-route-only (`HOME_ROUTE_ONLY`), and its scene is proprietary, so a generated page must omit it.
   - Chapter stepping is driven by the wheel: a 30 px accumulator with a 650 ms lock. The nav turns dark
     (`html.sbi-dark`) while the intro is under it.
6. **Reduced motion is only partly real.** The original honours `prefers-reduced-motion` only in the intro
   and the deployment section. Every other section's `reducedMotionFallback` is marked
   `fallbackGrounding: "policy"`: it is a requirement for generated pages, not observed behaviour.
7. **AOS quirk.** `.engine-card` and `.mcp-card` declare their own transition after `[data-aos]`, so their
   opacity snaps, translateY eases over .2 s, and their delays do nothing. This is encoded as the motion
   pattern `aos-fade-up-cards-snap-quirk`.
8. **CLONE_SPEC was corrected in 5 places.** The rendered DOM and the original JS disagree with it on:
   - the showcase badge colours
   - two CTA class lists
   - the deployment IntersectionObserver target (it is the section root, not the diagram)
   - the Teams "Expand" pill, which does not exist
   - the three.js version

   See `extraction/measured-values.json → specCorrections`.
9. **The pixel audit (`recon/audit`) was interrupted.** It is used only for measured corrections. It has one
   unresolved +86 px proof-section height difference at 390 px, recorded under `auditNotes`.
10. **Two roles are introduced by this repo**, not observed on the site: `brand.placeholder` and
    `placeholder.generated`. They exist only so generated pages have a legal stand-in.

## Layout

```
registry.manifest.json   status, counts, versions, entry points (all inside this folder)
tokens/00-foundation     color, gradient, typography, radius, spacing, breakpoint, elevation, icon-size, motion
tokens/10-semantic       intent → foundation aliases
tokens/20-component      component-scoped refs
tokens/30-layout         container, grids, stacking, anchor offset
tokens/themes            light (default) + intro-dark (scoped to the intro and the nav while over it)
tokens/llm               component-allowlist, token-catalog, token-policy
assets/asset-roles.json  closed asset + link role registry, generation policies, protected names
primitives/ components/  atomic and composed contracts
sections/                16 section contracts (content schema + word budgets, motion, responsive, evidence)
templates/               templates.json (structured nodes) + routes.json (in/out of scope)
compatibility/graph.json rules with severities + machine-readable params shared with the validator
schema/                  pagespec.schema.json, example.pagespec.json, semantic_validate.py, tests/adversarial_test.py
extraction/              measured-values.json (citation ledger), verify_all.py, prove_drift.py
```

## Generating and validating a page

1. Choose `template.home` and keep its node order. Optional nodes may be dropped. The required nodes are
   aurora, nav, hero, final CTA and footer.
2. Fill each node's `content` within its section contract (`sections/<id>.json → contentSchema`). Every
   text field has an `x-maxWords` budget.
3. Copy the section's `motion.reducedMotionFallback` exactly. It is const-locked.
4. Run `python3 schema/semantic_validate.py my.pagespec.json`. It exits 1 on any error; warnings are informational.

PageSpecs carry **no style or token override field**. Styling belongs to the contracts (see
`tokens/llm/token-policy.json → overrides`).

## Verification

```
python3 extraction/verify_all.py          # 22 integrity checks; WARN-degrades citation/asset checks when no sibling evidence tree exists
python3 schema/tests/adversarial_test.py  # mutations across schema/structural/runtime/asset/link/pinned-value + controls
python3 extraction/prove_drift.py         # proves each verify_all check FAILS on injected drift in a scratch copy
```

Citations look like `{"cite": "path:line[-line]", "quote": "..."}`, with paths relative to the folder
that contains `design-repo/`. The check fails if a cite is out of range **or** if its quote is not
present in the cited lines. When `design-repo/` is delivered on its own, these checks print WARN
instead of failing.

## Versions

- `allowlistVersion` is machine-checked: `verify_all.py ALLOWLIST_VERSION` compares it with
  `tokens/llm/component-allowlist.json`.
- `repositoryVersion` and `pageSpecVersion` are documentation-only. Nothing checks them except the
  schema `const` on `pageSpecVersion`.

## Counts (recomputed from disk by `verify_all.py`; a stale number fails `README_COUNTS`)

<!-- COUNTS:BEGIN -->
| what | count |
|---|---|
| sections | 16 |
| primitives | 12 |
| components | 9 |
| templates | 1 |
| routes | 1 |
| outOfScopeRoutes | 10 |
| foundationTokens | 188 |
| semanticTokens | 32 |
| componentTokens | 40 |
| layoutTokens | 16 |
| themes | 2 |
| graphRules | 25 |
| assetRoles | 9 |
| linkRoles | 9 |
| citations | 477 |
| files | 68 |
<!-- COUNTS:END -->

## Packaging

- `design-repo.zip` sits next to this folder. It is built with the CLI `zip`, fresh and last, with no
  `__MACOSX` or `.DS_Store` entries and no `__pycache__`.
- The project is **not** a git repository today. If it is ever put under git, add `design-repo.zip` to
  `.gitignore` by name. Never commit the zip next to the live folder, or the two copies will drift apart.
- This is a real company's content: do not publish this repo or make it public.

Everything ungrounded or approximate is listed in `extraction/measured-values.json → ungroundedOrApproximate`.
That includes the word-budget headroom, the policy-only reduced-motion fallbacks, the rhythm heuristics,
and the judgement calls on which template nodes are optional.

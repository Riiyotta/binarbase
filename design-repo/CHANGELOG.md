# Changelog

## 1.0.0 — 2026-10-14 — initial build (design-review-pending)

### Added

- Foundation tokens grounded in the live original CSS histogram (hex + `var()` usage counts per colour).
  - Categories: color, gradient, typography, radius, spacing, breakpoint, elevation, icon-size, motion.
  - The breakpoints include the height queries `max-height:900`/`800` (only at ≥1024 px wide), the
    aspect query `max-aspect-ratio:11/10`, and `prefers-reduced-motion`.
- Semantic, component and layout token layers.
- Themes `light` (default) and `intro-dark` (scoped to the intro and to the nav while it is over the intro).
- 12 primitives, 9 components and 16 section contracts, following the page order of the measured home.
  Each section contract has:
  - a closed content schema with `x-maxWords` budgets derived from the real copy (+25%)
  - closed per-section motion enums with a const-locked `reducedMotionFallback`
  - a structured `responsive` list
  - citations to the evidence it is based on
- `template.home` with structured nodes (`required` / `repeatable` / `homeRouteOnly`).
- `routes.json`: 1 in-scope route, plus 10 out-of-scope live routes recorded with no template.
- `compatibility/graph.json`: 25 rules with error/warn severity and machine-readable params that the
  validator reads.
- Draft-07 `pagespec.schema.json` and a real `example.pagespec.json` (reference reconstruction, every
  node, real copy).
- `semantic_validate.py`, which:
  - cross-checks a PageSpec against the real node list of the template it declares
  - keys duplicates on (section, variant)
  - enforces route rules, anchors, link/asset roles, the generated-vs-reference purpose rules,
    protected names, rhythm, reduced motion and per-instance word budgets
- `assets/asset-roles.json`:
  - 9 asset roles and 9 link roles, closed and grounded in real JSX usage
  - generation and licensing policy for each role
  - the real customer, case-study and company names as `protectedNames`
- `verify_all.py`: 22 checks, including:
  - allowlist parity and allowlist version
  - manifest and README counts recomputed from disk
  - citation range **and quote** validity, which degrades to WARN when the evidence tree is absent
  - pinned role values
  - schema ↔ contract parity and graph ↔ validator parity
  - theme resolution and token grounding
  - every multi-word string in the reference example occurs verbatim in the rendered DOM or clone source
- `prove_drift.py`: 28 scratch-copy injections, each proven to be caught.
- `adversarial_test.py`: mutation suite covering schema, structural, runtime, asset-role, link-role,
  pinned-value and warn-severity cases, plus controls.

### Recorded corrections to CLONE_SPEC.md (evidence in `extraction/measured-values.json`)

- Showcase card badges: Connected Apps is **amber** and Voice Assistant is **purple** (the spec swapped them).
- "Connect Now" is `cta-primary cta-wide`, and "Get a quote" is `cta-primary quote-cta`.
- The deployment auto-cycle IntersectionObserver watches the **section root**, not the diagram.
- Teams: only Finance shows a stage pill ("Start here"). No "Expand" pill is rendered.
- three.js is r186 on the original and 0.169 in the clone (a version difference, not a defect).

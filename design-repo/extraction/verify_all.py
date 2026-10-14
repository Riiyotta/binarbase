#!/usr/bin/env python3
"""One-shot integrity check for this design-repo. Exit 1 on any FAIL; WARN never fails.

Every check below is proven to FAIL on injected drift by extraction/prove_drift.py (run it; it copies
the repo to a scratch dir, mutates the copy, and asserts this script fails there while the untouched
copy passes).

Checks
  JSON_PARSE                 every *.json parses
  EXAMPLE_VALID              draft-07 schema + semantic validator: 0 errors on schema/example.pagespec.json
  ALLOWLIST_PARITY           allowlist ids == contract files; nodeProperties/pageSpecProperties == schema; roles == registry == schema enums
  ALLOWLIST_VERSION          registry.manifest.json allowlistVersion == tokens/llm/component-allowlist.json version   (machine-checked)
  MANIFEST_COUNTS            manifest.counts recomputed from disk
  README_COUNTS              README.md counts table recomputed from disk
  MANIFEST_STATUS            status design-review-pending, productionApproved false, versionFieldNote present
  ENTRYPOINTS_INSIDE         every manifest entry point is a relative path inside design-repo/ that exists
  NO_ABSOLUTE_PATHS          no home-directory / drive absolute paths in any file
  CITATIONS                  every {"cite": "path:a[-b]", "quote": ...} resolves in range AND the quote occurs in those lines;
                             {"file": path} exists. Degrades to WARN when the sibling evidence tree is absent.
  PINNED_ROLES               compliance-critical asset/link roles pinned to exact policy values (not just enum membership)
  ASSET_ROLE_CLOSURE         policies in the closed vocabulary; every contract assetField role is registered; every role is used
  ASSET_FILES_ON_DISK        registered asset files exist in the sibling project; customer-logo count on disk (WARN-degrade)
  SCHEMA_CONTRACT_PARITY     schema content./motion. definitions deep-equal each section contract's contentSchema/motionSchema
  GRAPH_VALIDATOR_PARITY     compatibility/graph.json rule ids+severities == schema/semantic_validate.py RULES; every contract
                             constraint key has an enforcing rule (no decorative constraints)
  TEMPLATE_ROUTE_COVERAGE    each in-scope route -> exactly one existing template; out-of-scope routes map to none;
                             template node flags (homeRouteOnly, requiresRealEvidence) agree with the section contracts
  THEME_RESOLUTION           every theme's resolved values recompute from semantic -> foundation
  TOKEN_REFS_RESOLVE         every token path referenced by primitives/components/component tokens/semantic/catalog exists
  POLICY_CATEGORIES          token-policy categories == token-catalog categories (real keys)
  TOKEN_GROUNDING            every foundation colour value occurs in the original CSS (WARN-degrade)
  DOC_SCRIPTS_EXIST          every script the docs/manifest name exists
  EXAMPLE_COPY_GROUNDED      every multi-word string in the reference example occurs verbatim in the rendered DOM text or the
                             clone source (no invented copy in the reference reconstruction) (WARN-degrade)
"""
import json
import os
import re
import sys

sys.dont_write_bytecode = True
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EVIDENCE_ROOT = os.path.dirname(REPO)
sys.path.insert(0, os.path.join(REPO, 'schema'))

# Compliance pins. Deliberately NOT read from assets/asset-roles.json: editing the registry alone cannot relax them.
NOT_IN_GENERATED = {'generationPolicy': 'must-not-reproduce-in-generated-output', 'realEntity': True, 'reproduceInGeneratedOutput': False}
PINNED_ROLES = {
    'assetRoles': {
        'brand.logo': NOT_IN_GENERATED,
        'brand.mark': NOT_IN_GENERATED,
        'meta.og-image': NOT_IN_GENERATED,
        'meta.favicon': NOT_IN_GENERATED,
        'scene.intro-3d': NOT_IN_GENERATED,
        'customer.logo': {'generationPolicy': 'must-not-fabricate', 'realEntity': True, 'reproduceInGeneratedOutput': False},
    },
    'linkRoles': {
        'live.app-signup': {'generationPolicy': 'must-not-reuse-live-endpoint'},
        'live.app-login': {'generationPolicy': 'must-not-reuse-live-endpoint'},
        'live.contact-email': {'generationPolicy': 'must-not-reuse-live-endpoint'},
        'live.contact-phone': {'generationPolicy': 'must-not-reuse-live-endpoint'},
        'live.social': {'generationPolicy': 'must-not-reuse-live-endpoint'},
        'live.blog-external': {'generationPolicy': 'must-not-reuse-live-endpoint'},
        'route.out-of-scope': {'generationPolicy': 'must-not-link-as-existing'},
    },
    'protectedNames': ['BinarBase', 'BWD', 'Voxberg', 'Applifting', 'Impact Hub', 'eConsulting', 'Delia', 'J&T Wine Fund', 'Highgate',
                       'Wflow', 'Malcom', 'This One', 'Realitní Advokáti'],
    'customerLogoCount': 11,
    # Cookie overlay must never load third-party scripts (clone behaviour; original loads GA/GTM/PostHog).
    'cookieNoThirdParty': ('overlay.cookie-consent', 'loadsThirdPartyScripts', False),
}

ABS_PATH = re.compile('(' + '/' + 'Users/' + r'|/home/[A-Za-z]|\b[A-Z]:\\\\)')
CITE_RE = re.compile(r'^(?P<path>[^:]+):(?P<a>\d+)(?:-(?P<b>\d+))?$')
SKIP_DIRS = {'__pycache__'}
SKIP_FILES = {'.DS_Store'}

results = []


def report(status, check, msg=''):
    results.append((status, check, msg))


def rel_files():
    out = []
    for d, dirs, files in os.walk(REPO):
        dirs[:] = sorted(x for x in dirs if x not in SKIP_DIRS)
        for f in sorted(files):
            if f not in SKIP_FILES:
                out.append(os.path.relpath(os.path.join(d, f), REPO))
    return out


def load(rel):
    with open(os.path.join(REPO, rel), encoding='utf-8') as f:
        return json.load(f)


def token_leaves(o, p=''):
    if isinstance(o, dict) and ('value' in o and 'type' in o):
        yield p, o
        return
    if isinstance(o, dict):
        for k, v in o.items():
            if not k.startswith('$'):
                yield from token_leaves(v, f'{p}.{k}' if p else k)


def ref_leaves(o, p=''):
    if isinstance(o, dict) and ('ref' in o or 'value' in o):
        yield p, o
        return
    if isinstance(o, dict):
        for k, v in o.items():
            if not k.startswith('$'):
                yield from ref_leaves(v, f'{p}.{k}' if p else k)


def foundation():
    out = {}
    for fn in sorted(os.listdir(os.path.join(REPO, 'tokens/00-foundation'))):
        if fn.endswith('.json'):
            for p, t in token_leaves(load('tokens/00-foundation/' + fn)):
                out[p] = t
    return out


def compute_counts():
    """Single source of truth for every hand-maintained summary number (manifest + README)."""
    tpl = load('templates/templates.json')['templates']
    routes = load('templates/routes.json')
    reg = load('assets/asset-roles.json')
    graph = load('compatibility/graph.json')
    n_cites = 0
    for f in rel_files():
        if f.endswith('.json'):
            n_cites += len(list(iter_citations(load(f))))
    return {
        'sections': len([f for f in os.listdir(os.path.join(REPO, 'sections')) if f.endswith('.json')]),
        'primitives': len([f for f in os.listdir(os.path.join(REPO, 'primitives')) if f.endswith('.json')]),
        'components': len([f for f in os.listdir(os.path.join(REPO, 'components')) if f.endswith('.json')]),
        'templates': len(tpl),
        'routes': len(routes['routes']),
        'outOfScopeRoutes': len(routes['outOfScopeRoutes']),
        'foundationTokens': len(foundation()),
        'semanticTokens': len(load('tokens/10-semantic/semantic.json')['semantic']),
        'componentTokens': len(list(ref_leaves(load('tokens/20-component/component.json')['component']))),
        'layoutTokens': len(list(token_leaves(load('tokens/30-layout/layout.json')['layout']))),
        'themes': len([f for f in os.listdir(os.path.join(REPO, 'tokens/themes')) if f.endswith('.json')]),
        'graphRules': len(graph['rules']),
        'assetRoles': len(reg['assetRoles']),
        'linkRoles': len(reg['linkRoles']),
        'citations': n_cites,
        'files': len(rel_files()),
    }


def iter_citations(o):
    if isinstance(o, dict):
        if isinstance(o.get('cite'), str):
            yield o
        elif isinstance(o.get('file'), str) and len(o) == 1:
            yield o
        for v in o.values():
            yield from iter_citations(v)
    elif isinstance(o, list):
        for v in o:
            yield from iter_citations(v)


def evidence_present():
    return os.path.isfile(os.path.join(EVIDENCE_ROOT, 'CLONE_SPEC.md')) and os.path.isdir(os.path.join(EVIDENCE_ROOT, 'recon'))


# ------------------------------------------------------------------------------------------- checks
def check_json():
    bad = []
    for f in rel_files():
        if f.endswith('.json'):
            try:
                load(f)
            except Exception as e:  # noqa
                bad.append(f'{f}: {e}')
    report('FAIL' if bad else 'PASS', 'JSON_PARSE', '; '.join(bad) or f'{sum(f.endswith(".json") for f in rel_files())} JSON files parse')
    return not bad


def check_example():
    import semantic_validate as sv
    r = sv.validate(load('schema/example.pagespec.json'))
    from jsonschema import Draft7Validator
    Draft7Validator.check_schema(load('schema/pagespec.schema.json'))
    if r.errors:
        report('FAIL', 'EXAMPLE_VALID', f'{len(r.errors)} error(s): {r.errors[:3]}')
    else:
        report('PASS', 'EXAMPLE_VALID', f'0 errors, {len(r.warnings)} warning(s) ({", ".join(w[0] for w in r.warnings)})')


def check_allowlist():
    al = load('tokens/llm/component-allowlist.json')
    schema = load('schema/pagespec.schema.json')
    reg = load('assets/asset-roles.json')
    probs = []
    for kind, folder in (('primitives', 'primitives'), ('components', 'components'), ('sections', 'sections')):
        files = {load(f'{folder}/{fn}')['id'] for fn in os.listdir(os.path.join(REPO, folder)) if fn.endswith('.json')}
        listed = set(al[kind])
        if listed - files:
            probs.append(f'phantom {kind}: {sorted(listed - files)}')
        if files - listed:
            probs.append(f'orphan {kind} (no allowlist entry): {sorted(files - listed)}')
    if set(al['sections']) != set(schema['definitions']['node']['properties']['section']['enum']):
        probs.append('allowlist sections != schema node section enum')
    if al['nodeProperties'] != list(schema['definitions']['node']['properties']):
        probs.append(f'nodeProperties {al["nodeProperties"]} != schema node properties {list(schema["definitions"]["node"]["properties"])}')
    if al['pageSpecProperties'] != list(schema['properties']):
        probs.append('pageSpecProperties != schema top-level properties')
    if set(al['templates']) != set(load('templates/templates.json')['templates']) or set(al['templates']) != set(schema['properties']['template']['enum']):
        probs.append('templates mismatch (allowlist / templates.json / schema enum)')
    for k, sk in (('assetRoles', 'assetRef'), ('linkRoles', 'link')):
        enum_key = 'assetRole' if k == 'assetRoles' else 'linkRole'
        if set(al[k]) != set(reg[k]) or set(al[k]) != set(schema['definitions'][sk]['properties'][enum_key]['enum']):
            probs.append(f'{k} mismatch (allowlist / registry / schema enum)')
    if set(al['themes']) != set(schema['properties']['theme']['enum']):
        probs.append('themes mismatch')
    report('FAIL' if probs else 'PASS', 'ALLOWLIST_PARITY', '; '.join(probs) or
           f'{len(al["primitives"])} primitives, {len(al["components"])} components, {len(al["sections"])} sections, node props, roles all in parity')


def check_versions(man):
    al = load('tokens/llm/component-allowlist.json')
    ok = man.get('allowlistVersion') == al.get('version')
    report('PASS' if ok else 'FAIL', 'ALLOWLIST_VERSION', f'manifest {man.get("allowlistVersion")!r} vs allowlist {al.get("version")!r}')


def check_counts(man):
    real = compute_counts()
    diff = {k: (man.get('counts', {}).get(k), v) for k, v in real.items() if man.get('counts', {}).get(k) != v}
    extra = set(man.get('counts', {})) - set(real)
    if extra:
        diff.update({k: (man['counts'][k], None) for k in extra})
    report('FAIL' if diff else 'PASS', 'MANIFEST_COUNTS', f'stated vs recomputed: {diff}' if diff else json.dumps(real))
    return real


def check_readme(real):
    txt = open(os.path.join(REPO, 'README.md'), encoding='utf-8').read()
    m = re.search(r'<!-- COUNTS:BEGIN -->(.*?)<!-- COUNTS:END -->', txt, re.S)
    if not m:
        report('FAIL', 'README_COUNTS', 'counts block missing')
        return
    stated = {k: int(v) for k, v in re.findall(r'^\|\s*`?([A-Za-z]+)`?\s*\|\s*(\d+)\s*\|', m.group(1), re.M)}
    diff = {k: (stated.get(k), v) for k, v in real.items() if stated.get(k) != v}
    report('FAIL' if diff else 'PASS', 'README_COUNTS', f'README vs recomputed: {diff}' if diff else 'README table matches disk')


def check_status(man):
    probs = []
    if man.get('status') != 'design-review-pending':
        probs.append(f'status={man.get("status")!r}')
    if man.get('productionApproved') is not False:
        probs.append('productionApproved must be false')
    if not man.get('versionFieldNote'):
        probs.append('versionFieldNote missing')
    report('FAIL' if probs else 'PASS', 'MANIFEST_STATUS', '; '.join(probs) or 'design-review-pending, productionApproved=false, versionFieldNote present')


def check_entrypoints(man):
    eps = man.get('entryPoints', {})
    vals = list(eps.values()) if isinstance(eps, dict) else list(eps)
    bad = [v for v in vals if os.path.isabs(v) or '..' in v.replace('\\', '/').split('/') or not os.path.isfile(os.path.join(REPO, v))]
    report('FAIL' if bad else 'PASS', 'ENTRYPOINTS_INSIDE', f'bad: {bad}' if bad else f'{len(vals)} entry points, all inside design-repo/')


def check_abs_paths():
    hits = []
    for f in rel_files():
        try:
            txt = open(os.path.join(REPO, f), encoding='utf-8').read()
        except UnicodeDecodeError:
            continue
        for i, line in enumerate(txt.split('\n'), 1):
            if ABS_PATH.search(line):
                hits.append(f'{f}:{i}')
    report('FAIL' if hits else 'PASS', 'NO_ABSOLUTE_PATHS', f'{hits[:10]}' if hits else 'none found')


def check_citations():
    cites = []
    for f in rel_files():
        if f.endswith('.json'):
            cites += [(f, c) for c in iter_citations(load(f))]
    if not evidence_present():
        report('WARN', 'CITATIONS', f'sibling evidence tree not present next to design-repo/; {len(cites)} citations not resolvable here (standalone copy). Format-checked only.')
        bad = [f'{f}: {c}' for f, c in cites if 'cite' in c and not CITE_RE.match(c['cite'])]
        if bad:
            report('FAIL', 'CITATIONS', f'malformed: {bad[:5]}')
        return
    cache, bad = {}, []
    for f, c in cites:
        if 'file' in c and 'cite' not in c:
            if not os.path.isfile(os.path.join(EVIDENCE_ROOT, c['file'])):
                bad.append(f'{f}: missing file {c["file"]}')
            continue
        m = CITE_RE.match(c['cite'])
        if not m:
            bad.append(f'{f}: malformed {c["cite"]!r}')
            continue
        path, a = m.group('path'), int(m.group('a'))
        b = int(m.group('b') or a)
        full = os.path.join(EVIDENCE_ROOT, path)
        if path.startswith('/') or '..' in path.split('/') or not os.path.isfile(full):
            bad.append(f'{f}: {c["cite"]} -> file not found')
            continue
        if full not in cache:
            cache[full] = open(full, encoding='utf-8').read().splitlines()
        lines = cache[full]
        if a < 1 or b < a or b > len(lines):
            bad.append(f'{f}: {c["cite"]} out of range (file has {len(lines)} lines)')
            continue
        q = c.get('quote')
        if q is not None and q not in '\n'.join(lines[a - 1:b]):
            bad.append(f'{f}: {c["cite"]} quote not found in cited lines: {q[:60]!r}')
    report('FAIL' if bad else 'PASS', 'CITATIONS', '; '.join(bad[:8]) + (f' (+{len(bad) - 8} more)' if len(bad) > 8 else '') if bad else
           f'{len(cites)} citations resolve in range and every quote matches its cited lines')


def check_pins():
    reg = load('assets/asset-roles.json')
    probs = []
    for kind in ('assetRoles', 'linkRoles'):
        for role, pins in PINNED_ROLES[kind].items():
            d = reg[kind].get(role)
            if d is None:
                probs.append(f'pinned {kind} {role} missing from registry')
                continue
            for k, v in pins.items():
                if d.get(k) != v:
                    probs.append(f'{role}.{k} = {d.get(k)!r}, pinned to {v!r}')
    missing = [n for n in PINNED_ROLES['protectedNames'] if n not in reg['protectedNames']]
    if missing:
        probs.append(f'protectedNames missing pinned entries: {missing}')
    nlogo = len(reg['assetRoles'].get('customer.logo', {}).get('files', []))
    if nlogo != PINNED_ROLES['customerLogoCount']:
        probs.append(f'customer.logo registers {nlogo} files, pinned {PINNED_ROLES["customerLogoCount"]}')
    sid, field, val = PINNED_ROLES['cookieNoThirdParty']
    got = load(f'sections/{sid}.json')['contentSchema']['properties'].get(field, {}).get('const', 'MISSING')
    if got is not val:
        probs.append(f'{sid}.{field} const is {got!r}, pinned {val!r}')
    report('FAIL' if probs else 'PASS', 'PINNED_ROLES', '; '.join(probs) or
           f'{len(PINNED_ROLES["assetRoles"])} asset roles + {len(PINNED_ROLES["linkRoles"])} link roles pinned to exact values; protected names; 11 logos; cookie no-3rd-party')


def check_asset_closure():
    reg = load('assets/asset-roles.json')
    pol = set(reg['generationPolicies'])
    probs = [f'{k}.{r}: policy {d.get("generationPolicy")!r} not in vocabulary' for k in ('assetRoles', 'linkRoles') for r, d in reg[k].items() if d.get('generationPolicy') not in pol]
    used = set()
    for fn in os.listdir(os.path.join(REPO, 'sections')):
        if fn.endswith('.json'):
            for path, roles in load('sections/' + fn)['assetFields'].items():
                for r in roles:
                    used.add(r)
                    if r not in reg['assetRoles']:
                        probs.append(f'{fn}{path}: unregistered role {r}')
    used |= {'meta.og-image', 'meta.favicon'}  # PageSpec meta fields (semantic_validate.META_ASSET_FIELDS)
    unused = set(reg['assetRoles']) - used
    if unused:
        probs.append(f'registered but unused roles: {sorted(unused)}')
    ex = load('schema/example.pagespec.json')
    ex_roles = set(re.findall(r'"assetRole":\s*"([^"]+)"', json.dumps(ex)))
    if ex_roles - set(reg['assetRoles']):
        probs.append(f'example uses unregistered roles {ex_roles - set(reg["assetRoles"])}')
    report('FAIL' if probs else 'PASS', 'ASSET_ROLE_CLOSURE', '; '.join(probs) or f'{len(reg["assetRoles"])} asset roles closed, all used; example uses {len(ex_roles)}')


def check_asset_files():
    if not os.path.isdir(os.path.join(EVIDENCE_ROOT, 'public', 'assets')):
        report('WARN', 'ASSET_FILES_ON_DISK', 'sibling public/assets not present (standalone copy); skipped')
        return
    reg = load('assets/asset-roles.json')
    missing = [f for d in reg['assetRoles'].values() for f in d.get('files', []) if not os.path.isfile(os.path.join(EVIDENCE_ROOT, f))]
    on_disk = sorted(f for f in os.listdir(os.path.join(EVIDENCE_ROOT, 'public', 'assets'))
                     if os.path.isfile(os.path.join(EVIDENCE_ROOT, 'public', 'assets', f)) and f not in ('logo.svg', 'favicon.svg', 'favicon.png', 'apple-touch-icon.png', '.DS_Store'))
    reg_logos = sorted(os.path.basename(f) for f in reg['assetRoles']['customer.logo']['files'])
    probs = []
    if missing:
        probs.append(f'missing on disk: {missing}')
    if on_disk != reg_logos:
        probs.append(f'customer logos on disk {on_disk} != registry {reg_logos}')
    report('FAIL' if probs else 'PASS', 'ASSET_FILES_ON_DISK', '; '.join(probs) or f'all registered files exist; {len(on_disk)} customer logos on disk == registry')


def check_schema_parity():
    schema = load('schema/pagespec.schema.json')['definitions']
    probs = []
    for fn in sorted(os.listdir(os.path.join(REPO, 'sections'))):
        if fn.endswith('.json'):
            c = load('sections/' + fn)
            if schema.get(f'content.{c["id"]}') != c['contentSchema']:
                probs.append(f'content.{c["id"]} differs from its section contract')
            if schema.get(f'motion.{c["id"]}') != c['motionSchema']:
                probs.append(f'motion.{c["id"]} differs from its section contract')
            m = c['motionSchema']['properties']
            if m['reducedMotionFallback'].get('const') != c['motion']['reducedMotionFallback'] or m['pattern']['enum'] != c['motion']['patterns']:
                probs.append(f'{c["id"]} motionSchema disagrees with its motion block')
            if c['motionSchema'].get('additionalProperties') is not False:
                probs.append(f'{c["id"]} motion schema is open')
    report('FAIL' if probs else 'PASS', 'SCHEMA_CONTRACT_PARITY', '; '.join(probs) or 'schema content/motion definitions == section contracts; all motion objects closed')


def check_graph_parity():
    import semantic_validate as sv
    g = {r['id']: r['severity'] for r in load('compatibility/graph.json')['rules']}
    probs = []
    if set(g) != set(sv.RULES):
        probs.append(f'graph-only {sorted(set(g) - set(sv.RULES))}, validator-only {sorted(set(sv.RULES) - set(g))}')
    probs += [f'{k}: graph {g[k]} vs validator {sv.RULES[k]}' for k in set(g) & set(sv.RULES) if g[k] != sv.RULES[k]]
    used = set()
    for fn in os.listdir(os.path.join(REPO, 'sections')):
        if fn.endswith('.json'):
            used |= set(load('sections/' + fn)['constraints'])
    if used - set(sv.ENFORCED_CONSTRAINTS):
        probs.append(f'contract constraint keys with no enforcing rule: {sorted(used - set(sv.ENFORCED_CONSTRAINTS))}')
    probs += [f'constraint {k} enforced by unknown rule {r}' for k, r in sv.ENFORCED_CONSTRAINTS.items() if r not in g]
    report('FAIL' if probs else 'PASS', 'GRAPH_VALIDATOR_PARITY', '; '.join(probs) or f'{len(g)} rules agree (ids + severities); all {len(used)} contract constraint keys are enforced')


def check_routes():
    tpl = load('templates/templates.json')['templates']
    r = load('templates/routes.json')
    probs = []
    paths = [x['path'] for x in r['routes']]
    dup = {p for p in paths if paths.count(p) > 1}
    if dup:
        probs.append(f'routes assigned more than once: {dup}')
    probs += [f'{x["path"]} -> unknown template {x["template"]}' for x in r['routes'] if x['template'] not in tpl]
    probs += [f'out-of-scope {x["path"]} has a template' for x in r['outOfScopeRoutes'] if x.get('template')]
    overlap = set(paths) & {x['path'] for x in r['outOfScopeRoutes']}
    if overlap:
        probs.append(f'route both in and out of scope: {overlap}')
    unused = set(tpl) - {x['template'] for x in r['routes']}
    if unused:
        probs.append(f'templates with no route: {unused}')
    secs = {load('sections/' + f)['id'] for f in os.listdir(os.path.join(REPO, 'sections')) if f.endswith('.json')}
    for t in tpl.values():
        probs += [f'{t["id"]} node {n["section"]} has no contract' for n in t['nodes'] if n['section'] not in secs]
        for n in t['nodes']:
            if n['section'] in secs:
                con = load(f'sections/{n["section"]}.json')['constraints']
                for k in ('homeRouteOnly', 'requiresRealEvidence'):
                    if bool(n.get(k)) != bool(con.get(k)):
                        probs.append(f'{t["id"]} node {n["section"]}.{k}={n.get(k)} disagrees with its contract ({con.get(k)})')
    report('FAIL' if probs else 'PASS', 'TEMPLATE_ROUTE_COVERAGE', '; '.join(probs) or
           f'{len(paths)} route(s) -> exactly one template each; {len(r["outOfScopeRoutes"])} out-of-scope routes unmapped')


def check_themes():
    F = foundation()
    sem = {k: v['ref'].strip('{}') for k, v in load('tokens/10-semantic/semantic.json')['semantic'].items()}
    probs = []
    for fn in sorted(os.listdir(os.path.join(REPO, 'tokens/themes'))):
        th = load('tokens/themes/' + fn)
        ov = {k: v.strip('{}') for k, v in th.get('overrides', {}).items()}
        for k in sem:
            target = ov.get(k, sem[k])
            if target not in F:
                probs.append(f'{fn}: {k} -> {target} not a foundation token')
            elif th['resolved'].get(k) != F[target]['value']:
                probs.append(f'{fn}: {k} resolved {th["resolved"].get(k)!r} != {F[target]["value"]!r}')
        if set(th['resolved']) != set(sem):
            probs.append(f'{fn}: resolved keys != semantic keys')
    report('FAIL' if probs else 'PASS', 'THEME_RESOLUTION', '; '.join(probs[:6]) or 'all themes resolve semantic -> foundation exactly')


def check_token_refs():
    F = foundation()
    sem = load('tokens/10-semantic/semantic.json')['semantic']
    known = set(F) | set(sem)
    probs = []
    for k, v in sem.items():
        if v['ref'].strip('{}') not in F:
            probs.append(f'semantic {k} -> {v["ref"]}')
    for p, t in ref_leaves(load('tokens/20-component/component.json')['component']):
        if 'ref' in t and t['ref'].strip('{}') not in known:
            probs.append(f'component {p} -> {t["ref"]}')
    for folder in ('primitives', 'components'):
        for fn in os.listdir(os.path.join(REPO, folder)):
            if fn.endswith('.json'):
                c = load(f'{folder}/{fn}')
                probs += [f'{c["id"]} -> {t}' for t in c.get('tokens', []) if t not in known]
                probs += [f'{c["id"]} composes unknown {x}' for x in c.get('composes', []) if x not in set(load('tokens/llm/component-allowlist.json')['primitives'])]
    cat = load('tokens/llm/token-catalog.json')
    listed = {p for v in cat['categories'].values() for p in v}
    if listed != set(F):
        probs.append(f'catalog != foundation (catalog-only {sorted(listed - set(F))[:3]}, foundation-only {sorted(set(F) - listed)[:3]})')
    report('FAIL' if probs else 'PASS', 'TOKEN_REFS_RESOLVE', '; '.join(probs[:6]) or f'{len(F)} foundation + {len(sem)} semantic tokens; every reference resolves')


def check_policy():
    pol = set(load('tokens/llm/token-policy.json')['rawValueRestrictions'])
    cat = set(load('tokens/llm/token-catalog.json')['categories'])
    report('PASS' if pol == cat else 'FAIL', 'POLICY_CATEGORIES', f'policy {sorted(pol)} vs catalog {sorted(cat)}' if pol != cat else f'{len(cat)} categories match real catalog keys')


def _norm_hex(h):
    h = h.lower()
    if re.fullmatch(r'#[0-9a-f]{3}', h):
        h = '#' + ''.join(c * 2 for c in h[1:])
    return h


def check_grounding():
    css_path = os.path.join(EVIDENCE_ROOT, 'recon', 'css')
    if not os.path.isdir(css_path):
        report('WARN', 'TOKEN_GROUNDING', 'sibling recon/css not present (standalone copy); skipped')
        return
    txt = ''.join(open(os.path.join(css_path, f), encoding='utf-8').read() for f in os.listdir(css_path) if f.endswith('.css'))
    present = {_norm_hex(h) for h in re.findall(r'#[0-9a-fA-F]{3,8}\b', txt)}
    bad = [f'{p}={t["value"]}' for p, t in foundation().items() if t['type'] == 'color' and _norm_hex(t['value']) not in present]
    report('FAIL' if bad else 'PASS', 'TOKEN_GROUNDING', f'colours not in original CSS: {bad}' if bad else 'every foundation colour occurs in the original CSS')


def check_doc_scripts(man):
    needed = {'extraction/prove_drift.py', 'schema/tests/adversarial_test.py', 'schema/semantic_validate.py', 'extraction/verify_all.py'}
    txt = open(os.path.join(REPO, 'README.md'), encoding='utf-8').read() + json.dumps(man)
    named = set(re.findall(r'((?:schema|extraction)/[\w/]+\.py)', txt))
    missing = sorted(p for p in needed | named if not os.path.isfile(os.path.join(REPO, p)))
    report('FAIL' if missing else 'PASS', 'DOC_SCRIPTS_EXIST', f'missing: {missing}' if missing else f'{len(needed | named)} referenced scripts exist')


def check_copy_grounded():
    dom_p = os.path.join(EVIDENCE_ROOT, 'recon', 'dom-1440-clean.html')
    src_p = os.path.join(EVIDENCE_ROOT, 'src', 'components')
    if not (os.path.isfile(dom_p) and os.path.isdir(src_p)):
        report('WARN', 'EXAMPLE_COPY_GROUNDED', 'sibling recon/dom + src not present (standalone copy); skipped')
        return
    import html
    dom = html.unescape(open(dom_p, encoding='utf-8').read())
    corpus = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', dom))
    for d, _, fs in os.walk(src_p):
        for f in fs:
            if f.endswith(('.jsx', '.js')):
                corpus += open(os.path.join(d, f), encoding='utf-8').read().replace('\\"', '"')
    corpus += open(os.path.join(EVIDENCE_ROOT, 'index.html'), encoding='utf-8').read()
    ex = load('schema/example.pagespec.json')
    strings = []

    def walk(o, p):
        if isinstance(o, dict):
            for k, v in o.items():
                if k not in ('assetRef', 'assetRole', 'linkRole', 'href'):
                    walk(v, f'{p}.{k}')
        elif isinstance(o, list):
            for i, v in enumerate(o):
                walk(v, f'{p}[{i}]')
        elif isinstance(o, str) and len(o.split()) >= 2:
            strings.append((p, o))
    walk(ex, '')
    bad = [f'{p}: {s[:50]!r}' for p, s in strings if s not in corpus]
    report('FAIL' if bad else 'PASS', 'EXAMPLE_COPY_GROUNDED', '; '.join(bad[:5]) if bad else f'{len(strings)} example strings found verbatim in the rendered DOM / clone source')


def main():
    if not check_json():
        return finish()
    man = load('registry.manifest.json')
    check_example()
    check_allowlist()
    check_versions(man)
    real = check_counts(man)
    check_readme(real)
    check_status(man)
    check_entrypoints(man)
    check_abs_paths()
    check_citations()
    check_pins()
    check_asset_closure()
    check_asset_files()
    check_schema_parity()
    check_graph_parity()
    check_routes()
    check_themes()
    check_token_refs()
    check_policy()
    check_grounding()
    check_doc_scripts(man)
    check_copy_grounded()
    return finish()


def finish():
    for st, ck, msg in results:
        print(f'{st:4} [{ck}] {msg}')
    nfail = sum(st == 'FAIL' for st, _, _ in results)
    nwarn = sum(st == 'WARN' for st, _, _ in results)
    print(f'verify_all: {len(results)} checks, {nfail} FAIL, {nwarn} WARN -> {"FAILED" if nfail else "OK"}')
    return 1 if nfail else 0


if __name__ == '__main__':
    sys.exit(main())

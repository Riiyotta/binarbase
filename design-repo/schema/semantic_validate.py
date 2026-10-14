#!/usr/bin/env python3
"""Semantic validator for BinarBase design-repo PageSpecs.

Runs the draft-07 schema first, then every rule JSON Schema cannot express. Rule ids and severities
in RULES below must match compatibility/graph.json exactly (checked by extraction/verify_all.py,
GRAPH_VALIDATOR_PARITY). Rule *parameters* (exception pairs, budgets) are read from graph.json so the
prose rule and the enforced rule share one source of data.

Usage:
    python3 schema/semantic_validate.py [pagespec.json ...]   # default: schema/example.pagespec.json
Exit code 1 if any error-severity finding; warnings never fail the run.
"""
import json
import os
import re
import sys
from collections import Counter

sys.dont_write_bytecode = True
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Rule id -> severity. Must equal compatibility/graph.json (verify_all.py GRAPH_VALIDATOR_PARITY).
RULES = {
    'TEMPLATE_DECLARED': 'error',
    'TEMPLATE_SEQUENCE': 'error',
    'TEMPLATE_REQUIRED_NODES': 'error',
    'VARIANT_ALLOWED': 'error',
    'NO_DUPLICATE_SECTION_VARIANT': 'error',
    'ONE_PER_PAGE': 'error',
    'SHELL_POSITION': 'error',
    'HOME_ROUTE_ONLY': 'error',
    'ONE_HERO': 'error',
    'NUMBERED_BADGES_ASCENDING': 'error',
    'NUMBERED_BADGES_CONTIGUOUS': 'warn',
    'IN_PAGE_ANCHORS_RESOLVE': 'error',
    'OUT_OF_SCOPE_ROUTE_LINK': 'warn',
    'LINK_ROLE_HREF_MATCH': 'error',
    'ASSET_ROLE_FIELD_MATCH': 'error',
    'ASSET_REF_REGISTERED': 'error',
    'GENERATED_NO_LIVE_ENDPOINTS': 'error',
    'GENERATED_NO_PROTECTED_ASSETS': 'error',
    'GENERATED_NO_PROTECTED_NAMES': 'error',
    'GENERATED_NO_FABRICATED_PROOF': 'error',
    'REFERENCE_RECONSTRUCTION_HOME_ONLY': 'error',
    'NO_ADJACENT_SECTION_ALT': 'warn',
    'MOTION_LOOP_BUDGET': 'warn',
    'REDUCED_MOTION_FALLBACK_PRESENT': 'error',
    'MAX_WORDS': 'error',
}

# Every key a section contract may put in `constraints`, and the rule that enforces it.
# verify_all.py GRAPH_VALIDATOR_PARITY fails if a contract uses a key not listed here (no decorative constraints).
ENFORCED_CONSTRAINTS = {
    'onePerPage': 'ONE_PER_PAGE', 'mustBeFirst': 'SHELL_POSITION', 'mustBeLast': 'SHELL_POSITION',
    'mustFollow': 'SHELL_POSITION', 'mustPrecede': 'SHELL_POSITION', 'mustBeLastContent': 'SHELL_POSITION',
    'homeRouteOnly': 'HOME_ROUTE_ONLY', 'requiresRealEvidence': 'GENERATED_NO_FABRICATED_PROOF',
}

META_ASSET_FIELDS = {'.ogImage': ['meta.og-image'], '.icons[]': ['meta.favicon']}


def _load(rel):
    with open(os.path.join(REPO, rel), encoding='utf-8') as f:
        return json.load(f)


class Repo:
    """All contracts the validator cross-references, loaded from inside design-repo/ only."""

    def __init__(self):
        self.schema = _load('schema/pagespec.schema.json')
        self.templates = _load('templates/templates.json')['templates']
        self.graph = _load('compatibility/graph.json')
        self.registry = _load('assets/asset-roles.json')
        self.sections = {}
        for fn in sorted(os.listdir(os.path.join(REPO, 'sections'))):
            if fn.endswith('.json'):
                c = _load('sections/' + fn)
                self.sections[c['id']] = c
        self.params = {r['id']: r.get('params', {}) for r in self.graph['rules']}


def words(s):
    return len(s.split())


def walk(obj, path=''):
    """Yield (normalized_path, value) for every node; list indices normalized to []."""
    yield path, obj
    if isinstance(obj, dict):
        for k, v in obj.items():
            yield from walk(v, f'{path}.{k}')
    elif isinstance(obj, list):
        for v in obj:
            yield from walk(v, f'{path}[]')


def is_link(v):
    return isinstance(v, dict) and 'linkRole' in v and 'href' in v


def is_asset(v):
    return isinstance(v, dict) and 'assetRole' in v and 'assetRef' in v


class Result:
    def __init__(self):
        self.errors, self.warnings = [], []

    def add(self, rule, msg):
        sev = RULES[rule]
        (self.errors if sev == 'error' else self.warnings).append((rule, msg))


def _resolve(schema_root, s):
    while isinstance(s, dict) and '$ref' in s:
        ref = s['$ref']
        assert ref.startswith('#/definitions/')
        s = schema_root['definitions'][ref[len('#/definitions/'):]]
    return s


def _max_words(schema_root, s, inst, path, res):
    s = _resolve(schema_root, s)
    if not isinstance(s, dict):
        return
    if isinstance(inst, str) and 'x-maxWords' in s:
        n = words(inst)
        if n > s['x-maxWords']:
            res.add('MAX_WORDS', f'{path}: {n} words > maxWords {s["x-maxWords"]}')
    elif isinstance(inst, dict) and 'properties' in s:
        for k, v in inst.items():
            if k in s['properties']:
                _max_words(schema_root, s['properties'][k], v, f'{path}.{k}', res)
    elif isinstance(inst, list) and 'items' in s:
        for i, v in enumerate(inst):
            _max_words(schema_root, s['items'], v, f'{path}[{i}]', res)


def validate(spec, repo=None):
    repo = repo or Repo()
    res = Result()
    schema_errors = []
    try:
        from jsonschema import Draft7Validator
        schema_errors = sorted(Draft7Validator(repo.schema).iter_errors(spec), key=lambda e: list(e.path))
    except ImportError:  # pragma: no cover
        res.errors.append(('SCHEMA', 'jsonschema not installed (pip install jsonschema)'))
    for e in schema_errors:
        res.errors.append(('SCHEMA', f'{"/".join(map(str, e.path)) or "<root>"}: {e.message[:220]}'))
    if not isinstance(spec, dict):
        return res
    nodes = [n for n in spec.get('nodes', []) if isinstance(n, dict) and n.get('section') in repo.sections]
    route = spec.get('route')
    purpose = spec.get('purpose')
    tpl_id = spec.get('template')
    sec = repo.sections

    # ---- template cross-reference (the declared template's REAL node list, not nodes[] in isolation)
    tpl = repo.templates.get(tpl_id)
    if tpl is None:
        res.add('TEMPLATE_DECLARED', f'template {tpl_id!r} is not in templates/templates.json')
    else:
        order = [t['section'] for t in tpl['nodes']]
        tnode = {t['section']: t for t in tpl['nodes']}
        last = -1
        for i, n in enumerate(spec.get('nodes', [])):
            sid = n.get('section') if isinstance(n, dict) else None
            if sid not in tnode:
                res.add('TEMPLATE_SEQUENCE', f'nodes[{i}] section {sid!r} is not part of {tpl_id}')
                continue
            idx = order.index(sid)
            if idx < last or (idx == last and not tnode[sid]['repeatable']):
                res.add('TEMPLATE_SEQUENCE', f'nodes[{i}] {sid} is out of {tpl_id} order (after {order[last]})')
            last = max(last, idx)
            if n.get('variant') not in tnode[sid]['variants']:
                res.add('VARIANT_ALLOWED', f'nodes[{i}] {sid} variant {n.get("variant")!r} not in {tnode[sid]["variants"]}')
        present = {n['section'] for n in nodes}
        for t in tpl['nodes']:
            if t['required'] and t['section'] not in present:
                res.add('TEMPLATE_REQUIRED_NODES', f'{tpl_id} requires {t["section"]}')
        pairs = Counter((n['section'], n.get('variant')) for n in nodes)
        for (sid, var), c in pairs.items():
            if c > 1 and not tnode.get(sid, {}).get('repeatable', False):
                res.add('NO_DUPLICATE_SECTION_VARIANT', f'({sid}, {var}) appears {c} times')

    counts = Counter(n['section'] for n in nodes)
    for sid, c in counts.items():
        if c > 1 and sec[sid]['constraints'].get('onePerPage'):
            res.add('ONE_PER_PAGE', f'{sid} is onePerPage but appears {c} times')

    # ---- position constraints from each section contract
    ids = [n['section'] for n in nodes]
    for i, sid in enumerate(ids):
        con = sec[sid]['constraints']
        if con.get('mustBeFirst') and i != 0:
            res.add('SHELL_POSITION', f'{sid} must be the first node (is #{i})')
        if con.get('mustBeLast') and i != len(ids) - 1:
            res.add('SHELL_POSITION', f'{sid} must be the last node')
        if con.get('mustFollow') in ids and (i == 0 or ids[i - 1] != con['mustFollow']):
            res.add('SHELL_POSITION', f'{sid} must immediately follow {con["mustFollow"]}')
        if con.get('mustPrecede') in ids and (i == len(ids) - 1 or ids[i + 1] != con['mustPrecede']):
            res.add('SHELL_POSITION', f'{sid} must immediately precede {con["mustPrecede"]}')
        if con.get('mustBeLastContent') and any(sec[x]['category'] != 'overlay' for x in ids[i + 1:]):
            res.add('SHELL_POSITION', f'{sid} must be the last content node (only overlays may follow)')
        if con.get('requiresRealEvidence') and purpose == 'generated':
            res.add('GENERATED_NO_FABRICATED_PROOF', f'{sid} needs real, licensed customer evidence and cannot appear in a generated page')
        if con.get('homeRouteOnly') and route != '/':
            res.add('HOME_ROUTE_ONLY', f'{sid} is home-route-only but route is {route!r}')

    p = repo.params['ONE_HERO']
    heroes = [s for s in ids if sec[s]['category'] in p['countCategories'] and s not in p['exemptSections']]
    if len(heroes) != p['expected']:
        res.add('ONE_HERO', f'expected exactly {p["expected"]} hero node, found {len(heroes)}')

    # ---- numbered section badges
    nums = []
    for n in nodes:
        h = n.get('content', {}).get('header') if isinstance(n.get('content'), dict) else None
        if isinstance(h, dict) and isinstance(h.get('number'), str) and h['number'].isdigit():
            nums.append((n['section'], int(h['number'])))
    for (a, x), (b, y) in zip(nums, nums[1:]):
        if y <= x:
            res.add('NUMBERED_BADGES_ASCENDING', f'{b} number {y:02d} does not follow {a} {x:02d}')
    expect = repo.params['NUMBERED_BADGES_CONTIGUOUS'].get('start', 1)
    for sid, x in nums:
        if x != expect:
            res.add('NUMBERED_BADGES_CONTIGUOUS', f'{sid} is numbered {x:02d}, expected {expect:02d}')
            break
        expect += 1

    # ---- links
    reg = repo.registry
    lroles = reg['linkRoles']
    live_values = {}
    for r, d in lroles.items():
        if r.startswith('live.'):
            for h in d.get('hrefs', []):
                live_values[h] = r
    anchors = {sec[s]['anchorId'] for s in ids if sec[s]['anchorId']}
    oos = []
    all_links = [(f'nodes[{i}]({n["section"]}){pth}', v) for i, n in enumerate(nodes) for pth, v in walk(n.get('content')) if is_link(v)]
    for where, lk in all_links:
        role, href = lk['linkRole'], lk['href']
        d = lroles.get(role)
        if d is None:
            continue  # schema already rejects unknown roles
        ok = True
        if 'hrefPattern' in d:
            ok = re.match(d['hrefPattern'], href) is not None
        if 'hrefs' in d:
            ok = href in d['hrefs']
        if 'hrefPrefixes' in d:
            ok = any(href.startswith(px) for px in d['hrefPrefixes'])
        if not ok:
            res.add('LINK_ROLE_HREF_MATCH', f'{where}: href {href!r} does not match linkRole {role}')
        hit = live_values.get(href) or next((r for r, dd in lroles.items() if r.startswith('live.') and any(href.startswith(px) for px in dd.get('hrefPrefixes', []))), None)
        if hit and role != hit:
            res.add('LINK_ROLE_HREF_MATCH', f'{where}: href {href!r} is the live endpoint {hit} but is labelled {role}')
        if role == 'anchor.in-page' and href[1:] not in anchors:
            res.add('IN_PAGE_ANCHORS_RESOLVE', f'{where}: {href} has no section with that anchorId on this page')
        if role == 'route.out-of-scope':
            oos.append(href)
        if purpose == 'generated' and (role.startswith('live.') or hit):
            res.add('GENERATED_NO_LIVE_ENDPOINTS', f'{where}: live endpoint {href!r} reused in a generated page (use placeholder.generated)')
    if oos:
        res.add('OUT_OF_SCOPE_ROUTE_LINK', f'{len(oos)} link(s) to live routes not in this repo: {sorted(set(oos))}')

    # ---- assets
    aroles = reg['assetRoles']
    asset_sites = [(f'nodes[{i}]({n["section"]})', pth, v, sec[n['section']]['assetFields']) for i, n in enumerate(nodes) for pth, v in walk(n.get('content')) if is_asset(v)]
    if isinstance(spec.get('meta'), dict):
        asset_sites += [('meta', pth, v, META_ASSET_FIELDS) for pth, v in walk(spec['meta']) if is_asset(v)]
    for where, pth, a, fields in asset_sites:
        role, ref = a['assetRole'], a['assetRef']
        if role not in aroles:
            continue
        if role not in fields.get(pth, []):
            res.add('ASSET_ROLE_FIELD_MATCH', f'{where}{pth}: role {role} not allowed here (allowed: {fields.get(pth, [])})')
        d = aroles[role]
        registered = list(d.get('files', [])) + list(d.get('refs', []))
        if role == 'icon.emoji':
            if re.search(r'[A-Za-z0-9]', ref) or len(ref) > 4:
                res.add('ASSET_REF_REGISTERED', f'{where}{pth}: icon.emoji ref {ref!r} is not a single emoji')
        elif registered and ref not in registered:
            res.add('ASSET_REF_REGISTERED', f'{where}{pth}: {ref!r} is not a registered {role} asset')
        if purpose == 'generated' and d['generationPolicy'] != 'may-generate-new':
            res.add('GENERATED_NO_PROTECTED_ASSETS', f'{where}{pth}: role {role} is {d["generationPolicy"]}')

    # ---- purpose rules
    if purpose == 'reference-reconstruction' and (tpl_id != 'template.home' or route != '/'):
        res.add('REFERENCE_RECONSTRUCTION_HOME_ONLY', f'reference-reconstruction requires template.home at "/", got {tpl_id} at {route!r}')
    if purpose == 'generated':
        for pth, v in walk({'meta': spec.get('meta'), 'nodes': spec.get('nodes')}):
            if not isinstance(v, str):
                continue
            for name in reg['protectedNames']:
                hit = (name.lower() in v.lower()) if 'binarbase' in name.lower() else re.search(r'(?<!\w)' + re.escape(name) + r'(?!\w)', v)
                if hit:
                    res.add('GENERATED_NO_PROTECTED_NAMES', f'{pth}: contains protected name {name!r}')

    # ---- rhythm / motion
    p = repo.params['NO_ADJACENT_SECTION_ALT']
    exc = {tuple(x) for x in p['exceptionPairs']}
    for a, b in zip(ids, ids[1:]):
        if sec[a]['surface'] == p['surface'] == sec[b]['surface'] and (a, b) not in exc:
            res.add('NO_ADJACENT_SECTION_ALT', f'{a} and {b} are adjacent on the {p["surface"]} surface')
    looping = [n['section'] for n in nodes if isinstance(n.get('motion'), dict) and n['motion'].get('loops')]
    if len(looping) > repo.params['MOTION_LOOP_BUDGET']['maxLoopNodes']:
        res.add('MOTION_LOOP_BUDGET', f'{len(looping)} looping nodes > {repo.params["MOTION_LOOP_BUDGET"]["maxLoopNodes"]}: {looping}')
    for i, n in enumerate(nodes):
        m = n.get('motion') if isinstance(n.get('motion'), dict) else {}
        want = sec[n['section']]['motion']['reducedMotionFallback']
        if m.get('reducedMotionFallback') != want:
            res.add('REDUCED_MOTION_FALLBACK_PRESENT', f'nodes[{i}] {n["section"]}: reducedMotionFallback must be {want!r}')

    # ---- per-instance word budgets (every instance, not just the bundled example)
    if isinstance(spec.get('meta'), dict):
        _max_words(repo.schema, repo.schema['properties']['meta'], spec['meta'], 'meta', res)
    for i, n in enumerate(nodes):
        _max_words(repo.schema, {'$ref': f'#/definitions/content.{n["section"]}'}, n.get('content'), f'nodes[{i}]({n["section"]}).content', res)
    return res


def main(argv):
    paths = argv[1:] or [os.path.join(REPO, 'schema', 'example.pagespec.json')]
    repo = Repo()
    failed = False
    for p in paths:
        with open(p, encoding='utf-8') as f:
            spec = json.load(f)
        r = validate(spec, repo)
        for rule, msg in r.errors:
            print(f'ERROR [{rule}] {msg}')
        for rule, msg in r.warnings:
            print(f'WARN  [{rule}] {msg}')
        print(f'{os.path.basename(p)}: {len(r.errors)} error(s), {len(r.warnings)} warning(s)')
        failed |= bool(r.errors)
    return 1 if failed else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))

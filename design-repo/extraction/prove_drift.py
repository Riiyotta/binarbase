#!/usr/bin/env python3
"""Prove that every verify_all.py check actually catches drift.

For each injection: copy design-repo/ to a fresh scratch dir, mutate the COPY, run the copy's own
extraction/verify_all.py, and assert it exits non-zero with the expected check marked FAIL.
A control copy (no mutation) must exit 0, and finally the real, untouched repo must still pass.

When the sibling evidence tree (CLONE_SPEC.md + recon/ next to design-repo/) exists, it is symlinked
next to each scratch copy so citation/grounding checks run for real; when it does not (standalone
delivery), evidence-dependent injections are reported SKIP, never silently passed.

Usage: python3 extraction/prove_drift.py        (exit 1 if any injection is NOT caught)
"""
import json
import os
import shutil
import subprocess
import sys
import tempfile

sys.dont_write_bytecode = True
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EVIDENCE = os.path.dirname(REPO)
HAS_EVIDENCE = os.path.isfile(os.path.join(EVIDENCE, 'CLONE_SPEC.md')) and os.path.isdir(os.path.join(EVIDENCE, 'recon'))
ENV = dict(os.environ, PYTHONDONTWRITEBYTECODE='1')


def jload(p):
    with open(p, encoding='utf-8') as f:
        return json.load(f)


def jsave(p, d):
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(d, f, indent=2, ensure_ascii=False)


def jedit(rel, fn):
    def m(root):
        p = os.path.join(root, rel)
        d = jload(p)
        fn(d)
        jsave(p, d)
    return m


def tedit(rel, fn):
    def m(root):
        p = os.path.join(root, rel)
        with open(p, encoding='utf-8') as f:
            t = f.read()
        with open(p, 'w', encoding='utf-8') as f:
            f.write(fn(t))
    return m


def add_orphan_section(root):
    src = os.path.join(root, 'sections', 'process.engine-flow.json')
    d = jload(src)
    d['id'] = 'process.engine-flow-copy'
    jsave(os.path.join(root, 'sections', 'process.engine-flow-copy.json'), d)


def shift_quote_cite(d):
    # move a real single-line cite one line up: still in range, now pointing at the wrong rule
    t = d['color']['brand']['primary']['evidence'][0]
    path, line = t['cite'].rsplit(':', 1)
    t['cite'] = f'{path}:{int(line) - 1}'


def open_motion(root):
    for rel in ('schema/pagespec.schema.json',):
        p = os.path.join(root, rel)
        d = jload(p)
        d['definitions']['motion.hero.centered-gradient-art']['additionalProperties'] = True
        jsave(p, d)
    p = os.path.join(root, 'sections', 'hero.centered-gradient-art.json')
    d = jload(p)
    d['motionSchema']['additionalProperties'] = True
    jsave(p, d)


ABS = '/' + 'Users/' + 'someone/project/design-repo'
INJECTIONS = [
    # (name, expected FAIL check, mutator, needs evidence tree)
    ('phantom allowlist entry', 'ALLOWLIST_PARITY', jedit('tokens/llm/component-allowlist.json', lambda d: d['primitives'].append('primitive.divider')), False),
    ('orphan section contract (no allowlist entry)', 'ALLOWLIST_PARITY', add_orphan_section, False),
    ('allowlistVersion drift in manifest', 'ALLOWLIST_VERSION', jedit('registry.manifest.json', lambda d: d.update(allowlistVersion='1.1.0')), False),
    ('hand-bumped manifest count', 'MANIFEST_COUNTS', jedit('registry.manifest.json', lambda d: d['counts'].update(sections=17)), False),
    ('stale README count', 'README_COUNTS', tedit('README.md', lambda t: t.replace('| sections | 16 |', '| sections | 15 |')), False),
    ('status flipped to approved', 'MANIFEST_STATUS', jedit('registry.manifest.json', lambda d: d.update(status='approved', productionApproved=True)), False),
    ('entry point outside design-repo', 'ENTRYPOINTS_INSIDE', jedit('registry.manifest.json', lambda d: d['entryPoints'].update(spec='../CLONE_SPEC.md')), False),
    ('absolute machine path in README', 'NO_ABSOLUTE_PATHS', tedit('README.md', lambda t: t + f'\nBuilt at {ABS}\n'), False),
    ('out-of-range citation', 'CITATIONS', jedit('tokens/00-foundation/radius.json', lambda d: d['radius']['sm']['evidence'][0].update(cite='recon/css/index.AtHXy8dp.css:99999')), True),
    ('in-range citation pointing at the wrong line', 'CITATIONS', jedit('tokens/00-foundation/color.json', shift_quote_cite), True),
    ('pinned role relaxed to a different-but-valid policy', 'PINNED_ROLES', jedit('assets/asset-roles.json', lambda d: d['assetRoles']['customer.logo'].update(generationPolicy='may-generate-new')), False),
    ('live endpoint role relaxed to a different-but-valid policy', 'PINNED_ROLES', jedit('assets/asset-roles.json', lambda d: d['linkRoles']['live.app-signup'].update(generationPolicy='may-generate-new')), False),
    ('unregistered asset role in a section contract', 'ASSET_ROLE_CLOSURE', jedit('sections/shell.nav.json', lambda d: d['assetFields']['.logo'].append('stock.photo')), False),
    ('registered logo file vs disk mismatch', 'ASSET_FILES_ON_DISK', jedit('assets/asset-roles.json', lambda d: d['assetRoles']['customer.logo']['files'].append('public/assets/acme.png')), True),
    ('schema content budget drifts from section contract', 'SCHEMA_CONTRACT_PARITY',
     jedit('schema/pagespec.schema.json', lambda d: d['definitions']['content.hero.centered-gradient-art']['properties']['titleLine'].update({'x-maxWords': 50})), False),
    ('motion object opened (additionalProperties:true)', 'SCHEMA_CONTRACT_PARITY', open_motion, False),
    ('graph severity drifts from validator', 'GRAPH_VALIDATOR_PARITY', jedit('compatibility/graph.json', lambda d: next(r for r in d['rules'] if r['id'] == 'ONE_HERO').update(severity='warn')), False),
    ('decorative (unenforced) constraint key in a contract', 'GRAPH_VALIDATOR_PARITY', jedit('sections/shell.footer.json', lambda d: d['constraints'].update(mustBeCentered=True)), False),
    ('template node flag disagrees with its contract', 'TEMPLATE_ROUTE_COVERAGE', jedit('templates/templates.json', lambda d: next(n for n in d['templates']['template.home']['nodes'] if n['section'] == 'intro.scroll-chapters-3d').pop('homeRouteOnly')), False),
    ('route assigned twice', 'TEMPLATE_ROUTE_COVERAGE', jedit('templates/routes.json', lambda d: d['routes'].append(dict(d['routes'][0]))), False),
    ('theme resolved value drift', 'THEME_RESOLUTION', jedit('tokens/themes/light.json', lambda d: d['resolved'].update({'text.primary': '#000000'})), False),
    ('dangling token reference', 'TOKEN_REFS_RESOLVE', jedit('primitives/button-primary.json', lambda d: d['tokens'].append('color.brand.tertiary')), False),
    ('policy category not a real catalog key', 'POLICY_CATEGORIES', jedit('tokens/llm/token-policy.json', lambda d: d['rawValueRestrictions'].update(shadow='enforced')), False),
    ('invented colour token not in the original CSS', 'TOKEN_GROUNDING', jedit('tokens/00-foundation/color.json', lambda d: d['color']['accent'].update(
        {'teal': {'value': '#123456', 'type': 'color', 'evidence': [{'cite': 'CLONE_SPEC.md:1', 'quote': 'Source'}]}})), True),
    ('invented copy in the reference example (within budget)', 'EXAMPLE_COPY_GROUNDED', jedit('schema/example.pagespec.json', lambda d: d['nodes'][3]['content'].update(titleLine='AI that truly')), True),
    ('bundled example breaks a word budget', 'EXAMPLE_VALID', jedit('schema/example.pagespec.json', lambda d: d['nodes'][3]['content'].update(titleLine='one two three four five six seven')), False),
    ('documented script deleted', 'DOC_SCRIPTS_EXIST', lambda root: os.remove(os.path.join(root, 'schema', 'tests', 'adversarial_test.py')), False),
    ('corrupt JSON file', 'JSON_PARSE', tedit('templates/templates.json', lambda t: t[:-20]), False),
]


def make_copy(base):
    proj = tempfile.mkdtemp(prefix='bb-drift-', dir=base)
    dst = os.path.join(proj, 'design-repo')
    shutil.copytree(REPO, dst, ignore=shutil.ignore_patterns('__pycache__', '.DS_Store'))
    if HAS_EVIDENCE:
        for name in os.listdir(EVIDENCE):
            if name in ('design-repo', 'design-repo.zip', 'node_modules') or name.startswith('.'):
                continue
            os.symlink(os.path.join(EVIDENCE, name), os.path.join(proj, name))
    return dst


def run_verify(root):
    p = subprocess.run([sys.executable, '-B', os.path.join(root, 'extraction', 'verify_all.py')], capture_output=True, text=True, env=ENV)
    fails = {line.split('[', 1)[1].split(']', 1)[0] for line in p.stdout.splitlines() if line.startswith('FAIL [')}
    return p.returncode, fails, p.stdout


def main():
    base = tempfile.mkdtemp(prefix='bb-prove-drift-')
    rows, ok_all = [], True
    try:
        root = make_copy(base)
        rc, fails, out = run_verify(root)
        ok = rc == 0
        ok_all &= ok
        rows.append(('PASS' if ok else 'FAIL', 'control: unmutated scratch copy passes', f'exit={rc} fails={sorted(fails)}'))
        for name, check, mut, needs_ev in INJECTIONS:
            if needs_ev and not HAS_EVIDENCE:
                rows.append(('SKIP', f'{name} -> {check}', 'needs the sibling evidence tree (standalone copy)'))
                continue
            root = make_copy(base)
            mut(root)
            rc, fails, out = run_verify(root)
            ok = rc != 0 and check in fails
            ok_all &= ok
            rows.append(('PASS' if ok else 'FAIL', f'{name} -> {check}', f'exit={rc}, FAIL checks={sorted(fails)}'))
    finally:
        shutil.rmtree(base, ignore_errors=True)
    rc, fails, _ = run_verify(REPO)
    ok = rc == 0
    ok_all &= ok
    rows.append(('PASS' if ok else 'FAIL', 'real repo still passes after all injections', f'exit={rc} fails={sorted(fails)}'))
    for st, name, detail in rows:
        print(f'{st:4} {name}  [{detail}]')
    caught = sum(1 for r in rows[1:-1] if r[0] == 'PASS')
    skipped = sum(1 for r in rows if r[0] == 'SKIP')
    print(f'prove_drift: evidence tree {"present" if HAS_EVIDENCE else "ABSENT"}; {caught}/{len(INJECTIONS)} injections caught, {skipped} skipped, '
          f'{sum(r[0] == "FAIL" for r in rows)} misbehaving -> {"OK" if ok_all else "FAILED"}')
    return 0 if ok_all else 1


if __name__ == '__main__':
    sys.exit(main())

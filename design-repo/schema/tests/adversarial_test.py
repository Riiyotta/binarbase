#!/usr/bin/env python3
"""Adversarial suite: every rule must REJECT a mutated PageSpec (or registry), and every control must PASS.

Categories: schema, structural, runtime (maxWords / route / anchors), asset-role, link-role,
pinned-value (registry/contract mutated to a DIFFERENT-BUT-STILL-VALID value), warn-severity, control.

Usage: python3 schema/tests/adversarial_test.py      (exit 1 if any case misbehaves)
"""
import copy
import json
import os
import re
import sys

sys.dont_write_bytecode = True
HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(REPO, 'schema'))
sys.path.insert(0, os.path.join(REPO, 'extraction'))
import semantic_validate as sv  # noqa: E402

with open(os.path.join(REPO, 'schema', 'example.pagespec.json'), encoding='utf-8') as f:
    EXAMPLE = json.load(f)
BASE_REPO = sv.Repo()
CASES = []


def case(category, name, expect, severity='error', repo_mut=None):
    def deco(fn):
        CASES.append((category, name, expect, severity, fn, repo_mut))
        return fn
    return deco


def node(spec, sid):
    return next(n for n in spec['nodes'] if n['section'] == sid)


def drop(spec, *sids):
    spec['nodes'] = [n for n in spec['nodes'] if n['section'] not in sids]


def walk_mut(o, fn):
    """Apply fn to every dict (post-order) / replace strings via fn on str."""
    if isinstance(o, dict):
        for k in list(o):
            o[k] = walk_mut(o[k], fn)
        return fn(o)
    if isinstance(o, list):
        return [walk_mut(v, fn) for v in o]
    return fn(o)


PLACEHOLDER = {'live.app-signup': '{{SIGNUP_URL}}', 'live.app-login': '{{LOGIN_URL}}', 'live.contact-email': '{{CONTACT_URL}}',
               'live.contact-phone': '{{PHONE_URL}}', 'live.social': '{{SOCIAL_URL}}', 'live.blog-external': '{{BLOG_URL}}'}


def generated_control():
    """A legal purpose=generated page derived from the example: no live endpoints, no protected assets/names."""
    s = copy.deepcopy(EXAMPLE)
    s['purpose'] = 'generated'
    drop(s, 'intro.scroll-chapters-3d', 'proof.logos-and-stories')   # proprietary scene; real-customer evidence
    s['meta'].pop('ogImage', None)
    s['meta'].pop('icons', None)
    names = BASE_REPO.registry['protectedNames']

    def fix(o):
        if isinstance(o, dict) and 'linkRole' in o and o['linkRole'] in PLACEHOLDER:
            o['href'], o['linkRole'] = PLACEHOLDER[o['linkRole']], 'placeholder.generated'
        if isinstance(o, dict) and o.get('assetRole') == 'brand.logo':
            o.update(assetRole='brand.placeholder', assetRef='{{BRAND_LOGO}}', alt='Acme')
        if isinstance(o, dict) and o.get('assetRole') == 'brand.mark':
            o.update(assetRole='brand.placeholder', assetRef='{{BRAND_MARK}}')
        if isinstance(o, str):
            for n in sorted(names, key=len, reverse=True):
                o = re.sub(re.escape(n), 'Acme', o, flags=re.I if 'binarbase' in n.lower() else 0)
        return o
    s['meta'] = walk_mut(s['meta'], fix)
    s['nodes'] = walk_mut(s['nodes'], fix)
    return s


# ---------------------------------------------------------------- schema layer
@case('schema', 'unknown template enum', 'SCHEMA')
def _(s): s['template'] = 'template.landing'


@case('schema', 'node missing content', 'SCHEMA')
def _(s): del node(s, 'hero.centered-gradient-art')['content']


@case('schema', 'invented section type alias', 'SCHEMA')
def _(s): node(s, 'hero.centered-gradient-art')['section'] = 'hero.marketing'


@case('schema', 'missing reducedMotionFallback', 'SCHEMA')
def _(s): del node(s, 'process.engine-flow')['motion']['reducedMotionFallback']


@case('schema', 'wrong const reducedMotionFallback on intro', 'SCHEMA')
def _(s): node(s, 'intro.scroll-chapters-3d')['motion']['reducedMotionFallback'] = 'render-final-state'


@case('schema', 'motion pattern borrowed from another section', 'SCHEMA')
def _(s): node(s, 'interactive.deployment-switcher')['motion']['pattern'] = 'aos-fade-up'


@case('schema', 'invented motion field (closed motion object)', 'SCHEMA')
def _(s): node(s, 'hero.centered-gradient-art')['motion']['inventedAnimation'] = 'spin'


@case('schema', 'invented content property', 'SCHEMA')
def _(s): node(s, 'hero.centered-gradient-art')['content']['videoUrl'] = 'x.mp4'


@case('schema', 'per-instance style/token override field', 'SCHEMA')
def _(s): node(s, 'hero.centered-gradient-art')['style'] = {'color': '#ff0000'}


@case('schema', 'invented assetRole', 'SCHEMA')
def _(s): node(s, 'shell.nav')['content']['logo']['assetRole'] = 'stock.photo'


@case('schema', 'invented linkRole', 'SCHEMA')
def _(s): node(s, 'shell.nav')['content']['cta']['linkRole'] = 'external.any'


@case('schema', 'unknown variant', 'SCHEMA')
def _(s): node(s, 'process.engine-flow')['variant'] = 'dark'


@case('schema', 'showcase maxItems overflow (6 cards)', 'SCHEMA')
def _(s):
    c = node(s, 'showcase.card-carousel')['content']['cards']
    c.append(copy.deepcopy(c[0]))


@case('schema', 'cookie overlay loads third-party scripts', 'SCHEMA')
def _(s): node(s, 'overlay.cookie-consent')['content']['loadsThirdPartyScripts'] = True


@case('schema', 'non-light theme', 'SCHEMA')
def _(s): s['theme'] = 'dark'


# ---------------------------------------------------------------- structural layer
@case('structural', 'duplicate one-per-page nav (same section, same variant)', 'NO_DUPLICATE_SECTION_VARIANT')
def _(s): s['nodes'].insert(2, copy.deepcopy(node(s, 'shell.nav')))


@case('structural', 'duplicate nav also trips ONE_PER_PAGE', 'ONE_PER_PAGE')
def _(s): s['nodes'].insert(2, copy.deepcopy(node(s, 'shell.nav')))


@case('structural', 'mandatory footer removed', 'TEMPLATE_REQUIRED_NODES')
def _(s): drop(s, 'shell.footer')


@case('structural', 'hero reordered before nav', 'TEMPLATE_SEQUENCE')
def _(s):
    h = node(s, 'hero.centered-gradient-art'); s['nodes'].remove(h); s['nodes'].insert(1, h)


@case('structural', 'fixed-position aurora not first', 'SHELL_POSITION')
def _(s):
    a = s['nodes'].pop(0); s['nodes'].insert(1, a)


@case('structural', 'cookie overlay not last', 'SHELL_POSITION')
def _(s):
    s['nodes'][-1], s['nodes'][-2] = s['nodes'][-2], s['nodes'][-1]


@case('structural', 'numbered sections swapped (02 after 03)', 'TEMPLATE_SEQUENCE')
def _(s):
    i = s['nodes'].index(node(s, 'feature.split-visual-brain')); s['nodes'][i], s['nodes'][i + 1] = s['nodes'][i + 1], s['nodes'][i]


@case('structural', 'badge numbers not ascending', 'NUMBERED_BADGES_ASCENDING')
def _(s): node(s, 'process.engine-flow')['content']['header']['number'] = '02'


@case('structural', 'hero removed -> zero heroes', 'ONE_HERO')
def _(s): drop(s, 'hero.centered-gradient-art')


def _tpl_without_console(repo):
    t = repo.templates['template.home']
    t['nodes'] = [n for n in t['nodes'] if n['section'] != 'feature.dual-pane-console']


@case('structural', 'PageSpec contradicts its declared template (template lacks console, spec has it)', 'TEMPLATE_SEQUENCE', repo_mut=_tpl_without_console)
def _(s): pass


def _console_required(repo):
    for n in repo.templates['template.home']['nodes']:
        if n['section'] == 'feature.dual-pane-console':
            n['required'] = True


@case('structural', 'template marks console required, spec omits it', 'TEMPLATE_REQUIRED_NODES', repo_mut=_console_required)
def _(s): drop(s, 'feature.dual-pane-console')


# ---------------------------------------------------------------- runtime layer
@case('runtime', 'maxWords overflow: hero titleLine', 'MAX_WORDS')
def _(s): node(s, 'hero.centered-gradient-art')['content']['titleLine'] = 'AI that actually really truly deeply'


@case('runtime', 'maxWords overflow: nested showcase card feature', 'MAX_WORDS')
def _(s): node(s, 'showcase.card-carousel')['content']['cards'][2]['features'][0] = 'Every metric traceable to its definition and also to its owner and history'


@case('runtime', 'maxWords overflow: link label', 'MAX_WORDS')
def _(s): node(s, 'shell.nav')['content']['cta']['label'] = 'Get Started with the best and most complete AI platform today'


@case('runtime', 'maxWords overflow: meta title', 'MAX_WORDS')
def _(s): s['meta']['title'] = ' '.join(['word'] * 40)


@case('runtime', 'home-route-only intro on another route', 'HOME_ROUTE_ONLY')
def _(s): s['route'] = '/landing'


@case('runtime', 'reference reconstruction off the home route', 'REFERENCE_RECONSTRUCTION_HOME_ONLY')
def _(s): s['route'] = '/landing'


@case('runtime', 'nav anchor to a section not on the page', 'IN_PAGE_ANCHORS_RESOLVE')
def _(s): drop(s, 'process.engine-flow')


# ---------------------------------------------------------------- asset-role layer
@case('asset-role', 'customer.logo placed in the nav logo field', 'ASSET_ROLE_FIELD_MATCH')
def _(s): node(s, 'shell.nav')['content']['logo']['assetRole'] = 'customer.logo'


@case('asset-role', 'fabricated customer logo file', 'ASSET_REF_REGISTERED')
def _(s): node(s, 'proof.logos-and-stories')['content']['logos'][0]['asset']['assetRef'] = 'public/assets/acme-corp.png'


@case('asset-role', 'icon.emoji ref is a word, not an emoji', 'ASSET_REF_REGISTERED')
def _(s): node(s, 'feature.split-visual-brain')['content']['visual']['floatingIcons'][0]['assetRef'] = 'chart'


@case('asset-role', 'generated page keeps the real BinarBase logo', 'GENERATED_NO_PROTECTED_ASSETS')
def _(s):
    g = generated_control(); g['nodes'][1]['content']['logo'] = {'assetRole': 'brand.logo', 'assetRef': 'public/assets/logo.svg', 'alt': 'Acme'}; s.clear(); s.update(g)


@case('asset-role', 'generated page reproduces real customer logos', 'GENERATED_NO_PROTECTED_ASSETS')
def _(s):
    g = generated_control()
    p = copy.deepcopy(node(EXAMPLE, 'proof.logos-and-stories'))
    for st in p['content']['stories']:
        st['link'] = {'label': 'Read the story', 'href': '{{STORY_URL}}', 'linkRole': 'placeholder.generated'}
    i = [n['section'] for n in g['nodes']].index('interactive.context-tree')
    g['nodes'].insert(i, p); s.clear(); s.update(g)


@case('asset-role', 'generated page keeps the proprietary 3D intro scene', 'GENERATED_NO_PROTECTED_ASSETS')
def _(s):
    g = generated_control(); intro = copy.deepcopy(node(EXAMPLE, 'intro.scroll-chapters-3d'))
    intro['content']['primaryCta'] = {'label': 'Start Free Trial', 'href': '{{SIGNUP_URL}}', 'linkRole': 'placeholder.generated'}
    intro['content']['chapters'][3]['extra'] = 'mcp.example.com/your-company'
    intro['content']['sceneLabels'][10]['sub'] = 'mcp.example.com/your-company'
    g['nodes'].insert(2, intro); s.clear(); s.update(g)


# ---------------------------------------------------------------- link-role layer
@case('link-role', 'live signup URL disguised as a placeholder', 'LINK_ROLE_HREF_MATCH')
def _(s): node(s, 'shell.nav')['content']['cta']['linkRole'] = 'placeholder.generated'


@case('link-role', 'anchor role with an external URL', 'LINK_ROLE_HREF_MATCH')
def _(s): node(s, 'hero.centered-gradient-art')['content']['trustLink']['href'] = 'https://example.com'


@case('link-role', 'generated page reuses the live signup endpoint', 'GENERATED_NO_LIVE_ENDPOINTS')
def _(s):
    g = generated_control(); node(g, 'shell.nav')['content']['cta'] = {'label': 'Get Started', 'href': 'https://app.binarbase.com/signup', 'linkRole': 'live.app-signup'}; s.clear(); s.update(g)


@case('link-role', 'generated page reuses the real sales mailbox', 'GENERATED_NO_LIVE_ENDPOINTS')
def _(s):
    g = generated_control(); node(g, 'shell.footer')['content']['contact']['email'] = {'label': 'Email us', 'href': 'mailto:info@binarbase.com', 'linkRole': 'live.contact-email'}; s.clear(); s.update(g)


# ---------------------------------------------------------------- protected names
@case('pinned-value', 'generated copy names the real company', 'GENERATED_NO_PROTECTED_NAMES')
def _(s):
    g = generated_control(); node(g, 'hero.centered-gradient-art')['content']['subtitleStrong'] = 'BinarBase. Correct answers.'; s.clear(); s.update(g)


@case('pinned-value', 'generated copy names a real customer', 'GENERATED_NO_PROTECTED_NAMES')
def _(s):
    g = generated_control(); node(g, 'process.engine-flow')['content']['cards'][0]['title'] = 'Built for Applifting'; s.clear(); s.update(g)


@case('pinned-value', 'generated page with an invented case study (no real logos)', 'GENERATED_NO_FABRICATED_PROOF')
def _(s):
    g = generated_control()
    p = copy.deepcopy(node(EXAMPLE, 'proof.logos-and-stories'))
    p['content']['logos'] = []
    p['content']['stories'] = [{'category': 'Success Story', 'title': 'How Northwind Cut Reporting Time in Half', 'excerpt': 'An invented customer story.',
                                'date': 'March 2026', 'readTime': '3 min read', 'link': {'label': 'Read the story', 'href': '{{STORY_URL}}', 'linkRole': 'placeholder.generated'}}]
    p['content']['allLink'] = {'label': 'All stories', 'href': '{{STORIES_URL}}', 'linkRole': 'placeholder.generated'}
    i = [n['section'] for n in g['nodes']].index('interactive.context-tree')
    g['nodes'].insert(i, p); s.clear(); s.update(g)


@case('structural', 'final CTA moved after the footer (footer no longer last content)', 'SHELL_POSITION')
def _(s):
    f = node(s, 'conversion.final-cta'); s['nodes'].remove(f); s['nodes'].insert(len(s['nodes']) - 1, f)


# ---------------------------------------------------------------- warn-severity (must warn, must NOT error)
@case('warn', 'two #f6f9fc sections adjacent after removing console', 'NO_ADJACENT_SECTION_ALT', severity='warn')
def _(s): drop(s, 'feature.dual-pane-console')


@case('warn', 'badge numbering gap after removing an optional section', 'NUMBERED_BADGES_CONTIGUOUS', severity='warn')
def _(s): drop(s, 'feature.dual-pane-console')


@case('warn', 'links to live routes outside this repo', 'OUT_OF_SCOPE_ROUTE_LINK', severity='warn')
def _(s): pass


def _tight_loop_budget(repo):
    repo.params['MOTION_LOOP_BUDGET'] = {'maxLoopNodes': 2}


@case('warn', 'motion loop budget exceeded', 'MOTION_LOOP_BUDGET', severity='warn', repo_mut=_tight_loop_budget)
def _(s): pass


# ---------------------------------------------------------------- registry / contract pinned values (different-but-VALID)
PIN_CASES = [
    ('customer.logo policy relaxed to may-generate-new (valid enum member)', 'assets/asset-roles.json', lambda r: r['assetRoles']['customer.logo'].update(generationPolicy='may-generate-new')),
    ('brand.logo policy changed to must-reuse-exact (valid enum member)', 'assets/asset-roles.json', lambda r: r['assetRoles']['brand.logo'].update(generationPolicy='must-reuse-exact')),
    ('brand.logo reproduceInGeneratedOutput flipped to true', 'assets/asset-roles.json', lambda r: r['assetRoles']['brand.logo'].update(reproduceInGeneratedOutput=True)),
    ('live.app-signup policy changed to must-not-link-as-existing (valid)', 'assets/asset-roles.json', lambda r: r['linkRoles']['live.app-signup'].update(generationPolicy='must-not-link-as-existing')),
    ('route.out-of-scope relaxed to may-generate-new', 'assets/asset-roles.json', lambda r: r['linkRoles']['route.out-of-scope'].update(generationPolicy='may-generate-new')),
    ('Voxberg dropped from protectedNames', 'assets/asset-roles.json', lambda r: r['protectedNames'].remove('Voxberg')),
    ('cookie contract loadsThirdPartyScripts const flipped', 'sections/overlay.cookie-consent.json', lambda c: c['contentSchema']['properties']['loadsThirdPartyScripts'].update(const=True)),
]


def run_pin_case(rel, mut):
    import verify_all as va
    real_load = va.load

    def fake(r):
        d = real_load(r)
        if r == rel:
            d = copy.deepcopy(d)
            mut(d)
        return d
    va.load, va.results[:] = fake, []
    try:
        va.check_pins()
        return [x for x in va.results if x[1] == 'PINNED_ROLES']
    finally:
        va.load, va.results[:] = real_load, []


def main():
    ok_all, rows = True, []
    for cat, name, expect, sev, fn, repo_mut in CASES:
        spec = copy.deepcopy(EXAMPLE)
        fn(spec)
        repo = BASE_REPO
        if repo_mut:
            repo = sv.Repo()
            repo_mut(repo)
        r = sv.validate(spec, repo)
        err_rules = {x[0] for x in r.errors}
        warn_rules = {x[0] for x in r.warnings}
        if sev == 'error':
            ok = expect in err_rules
            got = f'rejected by {expect}' if ok else f'NOT rejected (errors={sorted(err_rules)})'
        else:
            ok = expect in warn_rules and not r.errors
            got = f'warned {expect}, 0 errors' if ok else f'warn={sorted(warn_rules)} errors={r.errors[:2]}'
        ok_all &= ok
        rows.append(('PASS' if ok else 'FAIL', cat, name, got))
    for name, rel, mut in PIN_CASES:
        res = run_pin_case(rel, mut)
        ok = bool(res) and res[0][0] == 'FAIL'
        ok_all &= ok
        rows.append(('PASS' if ok else 'FAIL', 'pinned-value', name, 'verify_all PINNED_ROLES -> FAIL' if ok else f'not caught: {res}'))
    # ---- controls
    for tid in BASE_REPO.templates:
        if EXAMPLE['template'] == tid:
            r = sv.validate(copy.deepcopy(EXAMPLE), BASE_REPO)
            ok = not r.errors
            ok_all &= ok
            rows.append(('PASS' if ok else 'FAIL', 'control', f'{tid}: bundled example (reference-reconstruction)', f'{len(r.errors)} errors, {len(r.warnings)} warnings'))
    g = generated_control()
    r = sv.validate(g, BASE_REPO)
    ok = not r.errors
    ok_all &= ok
    rows.append(('PASS' if ok else 'FAIL', 'control', 'legal purpose=generated page (placeholders, no protected assets/names)',
                 f'{len(r.errors)} errors {r.errors[:3]}, warnings: {sorted({w[0] for w in r.warnings})}'))
    res = run_pin_case('assets/asset-roles.json', lambda d: None)
    ok = bool(res) and res[0][0] == 'PASS'
    ok_all &= ok
    rows.append(('PASS' if ok else 'FAIL', 'control', 'unmutated registry passes PINNED_ROLES', res[0][0] if res else 'no result'))
    for row in rows:
        print('{:4} [{:12}] {} -> {}'.format(*row))
    n_fail = sum(r[0] == 'FAIL' for r in rows)
    cats = sorted({r[1] for r in rows})
    print(f'adversarial_test: {len(rows)} cases ({", ".join(f"{c}={sum(r[1] == c for r in rows)}" for c in cats)}), {n_fail} misbehaving -> {"FAILED" if n_fail else "OK"}')
    return 0 if ok_all else 1


if __name__ == '__main__':
    sys.exit(main())

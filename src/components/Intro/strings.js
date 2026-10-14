// English strings for the intro, verbatim from recon/js/BoenAJz5.js (intro.*)
// and recon/dom-1440-clean.html.

export const CHAPTERS = [
  { title: "Your company's second brain.", body: 'One living knowledge base that every AI you use draws from.' },
  { title: 'Everything your company knows, in one place.', body: 'Accounting, CRM, e-shop and documents. 200+ connectors plug into the systems you already have, with no migration.' },
  { title: 'Data gets meaning.', body: 'Definitions, knowledge, memory and access make up your Company Context. A private AI keeps it current, so nothing goes stale.' },
  { title: 'One MCP endpoint.', body: 'Add it to your agent, sign in, and your AI reads the company brain live, with your permissions.', extra: 'mcp.binarbase.com/your-company' },
  { title: 'For every AI you use.', body: 'Claude, ChatGPT, Cursor, Gemini, or a local model on your own servers. They all work from the same definitions, so the same question gets the same answer.' },
  { title: 'A brain that learns.', body: 'Every question and every correction flows back. Corrections become definitions, and the knowledge base gets sharper every week.' },
  { title: "See your company's second brain.", body: 'Connect the systems you already use and get your first answers in minutes.' },
]

export const UI = {
  canvasLabel: '3D visualisation: data from your company systems flows into the BinarBase knowledge base and, through one MCP endpoint, into Claude, ChatGPT, Cursor and Gemini.',
  chaptersLabel: 'Intro chapters',
  skip: 'Skip intro',
  scrollHint: 'Scroll',
  hint: 'Click a node for details · drag to rotate',
  prev: 'Previous chapter',
  next: 'Next chapter',
  close: 'Close detail',
  explore: 'Explore BinarBase',
  primaryCta: 'Start Free Trial',
}

const L = {
  core: { title: 'Company Context', sub: 'living knowledge base' },
  connectors: { title: '200+ connectors', sub: 'mapped to your definitions' },
  accounting: { title: 'Accounting', sub: 'invoices, costs, ERP' },
  crm: { title: 'CRM', sub: 'customers, deals' },
  eshop: { title: 'E-shop', sub: 'orders, returns' },
  documents: { title: 'Documents', sub: 'SOPs, contracts, playbooks' },
  definitions: { title: 'Definitions', sub: 'what revenue really means' },
  knowledge: { title: 'Knowledge', sub: 'processes and know-how' },
  memory: { title: 'Memory', sub: 'decisions and corrections' },
  access: { title: 'Access', sub: 'roles and audit' },
  loop: { title: 'Corrections flow back', sub: 'and become definitions' },
  local: { title: 'Your local model', sub: 'on your own servers' },
}

const SOURCE_KEYS = ['accounting', 'crm', 'eshop', 'documents']
const LAYER_KEYS = ['definitions', 'knowledge', 'memory', 'access']
const OUTPUT_NAMES = ['Claude', 'ChatGPT', 'Cursor', 'Gemini']

export const SCENE_STRINGS = {
  core: L.core,
  connectors: L.connectors,
  sources: SOURCE_KEYS.map((k) => L[k]),
  layers: LAYER_KEYS.map((k) => L[k]),
  mcp: { title: 'MCP endpoint', sub: 'mcp.binarbase.com/your-company' },
  outputSub: 'via MCP, live',
  local: L.local,
  loop: L.loop,
}

const CARDS = {
  core: 'A living model of your company: definitions, knowledge, memory and access in one place. Dashboards, agents and your own AI all read from it.',
  accounting: 'Invoices, costs and balances, mapped to your definitions. Revenue is exactly what you count as revenue.',
  crm: "Customers, deals and communication history. An active customer by your rule, not the tool's.",
  eshop: 'Orders, returns and shipping. Counted as orders, not as order lines.',
  documents: "Processes, contracts and the know-how that today lives in people's heads. Available to people and AI alike.",
  definitions: 'What revenue, margin or an active customer means at your company. Confirmed by your team and applied the same way everywhere.',
  knowledge: 'Processes and playbooks, so AI works the way your team works.',
  memory: 'Decisions and corrections stay with the company, even when people leave.',
  access: 'Roles and permissions. People and agents see only what they should, and every question is logged.',
  mcpTitle: 'One MCP endpoint',
  mcp: 'Add it to Claude, ChatGPT or Cursor, sign in, and the agent reads your context live, with your permissions.',
  local: 'A local open model running on your own servers. It reads the same Company Context, so nothing has to leave your building.',
}

/** Detail card content for a picked node id ("core", "source:2", "layer:0", "mcp", "output:4"). */
export function cardFor(id) {
  const [kind, n] = id.split(':')
  const i = Number(n)
  switch (kind) {
    case 'core':
      return { title: L.core.title, text: CARDS.core }
    case 'source':
      return { title: L[SOURCE_KEYS[i]].title, text: CARDS[SOURCE_KEYS[i]] }
    case 'layer':
      return { title: L[LAYER_KEYS[i]].title, text: CARDS[LAYER_KEYS[i]] }
    case 'mcp':
      return { title: CARDS.mcpTitle, text: CARDS.mcp }
    default:
      return i === OUTPUT_NAMES.length
        ? { title: L.local.title, text: CARDS.local }
        : { title: OUTPUT_NAMES[i], text: `${OUTPUT_NAMES[i]} connects to BinarBase via MCP. It knows your definitions, history and processes, and shows where every number comes from.` }
  }
}

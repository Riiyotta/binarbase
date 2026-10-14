// Second Brain intro scene.
// Own implementation; every number below was read from the original
// createSecondBrainScene (recon/js/_BDyuz0e.js) and is listed in CLONE_SPEC.md §4.
import * as THREE from 'three'

const INK = 0x070c1f
const VIOLET = 0x6042f9
const VIOLET_LINE = 0x8b76ff
const LAV = 0xc4b8ff
const TEAL = 0x3ddbb0
const PAPER = 0xf4f2ff
const ADD = THREE.AdditiveBlending
const CORE_R = 2.2

export const LAYER_KEYS = ['core', 'sources', 'inFlow', 'layers', 'mcp', 'outputs', 'outFlow', 'loop']

// Camera position, look-at target and per-layer opacity focus for each chapter.
export const CHAPTERS = [
  { p: [0, 0.6, 9.5], t: [0, 0, 0], focus: { core: 1 } },
  { p: [-7.5, 2.4, 14], t: [-5.5, 0, 0], focus: { core: 0.6, sources: 1, inFlow: 1 } },
  { p: [2.8, 3.6, 12.5], t: [0, 0, 0], focus: { core: 1, sources: 0.4, inFlow: 0.4, layers: 1 } },
  { p: [9.6, 1.6, 8.6], t: [6.5, 0, 0], focus: { core: 0.6, sources: 0.3, inFlow: 0.3, layers: 0.45, mcp: 1 } },
  { p: [13, 2.4, 14], t: [10, 0, 0], focus: { core: 0.6, sources: 0.3, inFlow: 0.3, layers: 0.45, mcp: 0.7, outputs: 1, outFlow: 1 } },
  { p: [5, 7.5, 20], t: [5, 2.5, 0], focus: { core: 1, sources: 0.4, inFlow: 0.4, layers: 0.7, mcp: 0.6, outputs: 0.8, outFlow: 0.6, loop: 1 } },
  { p: [1, 3, 31], t: [1, 0.5, 0], focus: { core: 1, sources: 1, inFlow: 1, layers: 1, mcp: 1, outputs: 1, outFlow: 1, loop: 0.8 } },
]

const SOURCE_POS = [[-11, 3.4, -0.8], [-11.6, 1.15, 0.9], [-11.6, -1.15, -0.9], [-11, -3.4, 0.8]]
const ORBITS = [
  { e: [0.35, 0, 0.2], r: 3.6, v: 0.16, ph: 0 },
  { e: [-0.5, 0.4, -0.3], r: 3.95, v: -0.13, ph: 1.6 },
  { e: [1.15, 0.2, 0.5], r: 4.3, v: 0.11, ph: 3.1 },
  { e: [-1, -0.6, 0.9], r: 4.65, v: -0.1, ph: 4.6 },
]
const OUTPUTS = [
  { n: 'Claude', p: [13, 4.2, -0.6] },
  { n: 'ChatGPT', p: [13.7, 2.1, 0.7] },
  { n: 'Cursor', p: [14, 0, -0.5] },
  { n: 'Gemini', p: [13.7, -2.1, 0.6] },
  { n: '', p: [13, -4.2, -0.4] }, // local model
]

function radialTexture(stops) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  stops.forEach(([o, col]) => grad.addColorStop(o, col))
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

function ringPoints(r, n) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r))
  }
  return pts
}

const randomDir = () =>
  new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize()

/**
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLElement} labelsEl  container for DOM labels (.sbi-labels)
 * @param {object} strings        label strings (see strings.js sceneStrings)
 * @param {{reduce:boolean, compact:boolean}} opts
 */
export function createSecondBrainScene(canvas, labelsEl, strings, { reduce, compact }) {
  // The original disables colour management and renders in linear sRGB, so hex
  // colours land on screen unconverted.
  THREE.ColorManagement.enabled = false

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2))

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(INK)
  scene.fog = new THREE.FogExp2(INK, 0.016)
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 400)

  const glowTex = radialTexture([[0, 'rgba(255,255,255,1)'], [0.18, 'rgba(255,255,255,.55)'], [0.5, 'rgba(255,255,255,.12)'], [1, 'rgba(255,255,255,0)']])
  const dotTex = radialTexture([[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(255,255,255,.9)'], [0.6, 'rgba(255,255,255,.25)'], [1, 'rgba(255,255,255,0)']])

  // ---- layer bookkeeping: each chapter fades whole layers in/out ----
  const layers = {}
  LAYER_KEYS.forEach((k) => { layers[k] = { fade: 0, target: 0, mats: [], objs: [] } })
  const track = (layer, mat, base) => {
    mat.transparent = true
    mat.opacity = 0
    layers[layer].mats.push({ mat, base })
    return mat
  }
  const layerGroup = (layer) => {
    const g = new THREE.Group()
    scene.add(g)
    layers[layer].objs.push(g)
    return g
  }
  const lineMat = (layer, color, base) =>
    track(layer, new THREE.LineBasicMaterial({ color, depthWrite: false, blending: ADD }), base)
  const meshMat = (layer, color, base, extra = {}) =>
    track(layer, new THREE.MeshBasicMaterial({ color, depthWrite: false, ...extra }), base)
  const pointsMat = (layer, color, size, base) =>
    track(layer, new THREE.PointsMaterial({ color, size, map: dotTex, depthWrite: false, blending: ADD, sizeAttenuation: true }), base)
  const glow = (layer, color, scale, base) => {
    const s = new THREE.Sprite(track(layer, new THREE.SpriteMaterial({ map: glowTex, color, depthWrite: false, blending: ADD }), base))
    s.scale.set(scale, scale, 1)
    return s
  }
  const edges = (geo, mat) => new THREE.LineSegments(new THREE.EdgesGeometry(geo), mat)

  // ---- DOM labels ----
  const labels = []
  function addLabel(obj, layer, offset, str, subClass, big) {
    const el = document.createElement('div')
    el.className = 'sbi-lbl' + (big ? ' big' : '')
    const b = document.createElement('b')
    b.textContent = str.title
    el.appendChild(b)
    let s = null
    if (str.sub !== undefined) {
      s = document.createElement('span')
      s.textContent = str.sub
      if (subClass) s.className = subClass
      el.appendChild(s)
    }
    labelsEl.appendChild(el)
    const l = { el, b, s, obj, layer, offset: new THREE.Vector3(...offset) }
    labels.push(l)
    return l
  }
  const setLabel = (l, str) => {
    l.b.textContent = str.title
    if (l.s) l.s.textContent = str.sub ?? ''
  }

  // ---- invisible pick targets ----
  const pickables = []
  const pickMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false })
  function addPick(parent, radius, layer, id) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(radius, 12, 12), pickMat)
    m.userData = { layer, id }
    parent.add(m)
    pickables.push(m)
  }

  // ---- background dust ----
  const dustCount = compact ? 800 : 1600
  const dustPos = new Float32Array(dustCount * 3)
  for (let i = 0; i < dustCount; i++) {
    dustPos[i * 3] = (Math.random() - 0.5) * 170
    dustPos[i * 3 + 1] = (Math.random() - 0.5) * 95
    dustPos[i * 3 + 2] = (Math.random() - 0.5) * 130 - 12
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: LAV, size: 0.12, map: dotTex, transparent: true, opacity: 0.5, depthWrite: false, blending: ADD }))
  scene.add(dust)

  // ---- floor grid ----
  const grid = new THREE.GridHelper(140, 70, VIOLET, 0x2a2470)
  grid.position.y = -7
  grid.material.transparent = true
  grid.material.opacity = 0.13
  grid.material.depthWrite = false
  scene.add(grid)

  // ---- core sphere ----
  const core = layerGroup('core')
  const coreSpin = new THREE.Group()
  core.add(coreSpin)
  const nodeCount = compact ? 300 : 380
  const nodeFinal = new Float32Array(nodeCount * 3)
  const nodeStart = new Float32Array(nodeCount * 3)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < nodeCount; i++) {
    const y = 1 - (i / (nodeCount - 1)) * 2
    const ring = Math.sqrt(1 - y * y)
    const a = golden * i
    const r = CORE_R * (0.93 + Math.random() * 0.12)
    const x = Math.cos(a) * ring * r
    const z = Math.sin(a) * ring * r
    nodeFinal.set([x, y * r, z], i * 3)
    const d = randomDir().multiplyScalar(5 + Math.random() * 12)
    nodeStart.set([x + d.x, y * r + d.y, z + d.z], i * 3)
  }
  const nodeLive = new Float32Array(reduce ? nodeFinal : nodeStart)
  const nodeGeo = new THREE.BufferGeometry()
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodeLive, 3))
  coreSpin.add(new THREE.Points(nodeGeo, pointsMat('core', LAV, 0.13, 1)))

  // Materials that also scale with the assembly progress of the sphere.
  const assemblyMats = []
  {
    // 3 nearest neighbours per node, de-duplicated.
    const seg = []
    const seen = new Set()
    for (let i = 0; i < nodeCount; i++) {
      const dists = []
      for (let j = 0; j < nodeCount; j++) {
        if (i === j) continue
        const dx = nodeFinal[i * 3] - nodeFinal[j * 3]
        const dy = nodeFinal[i * 3 + 1] - nodeFinal[j * 3 + 1]
        const dz = nodeFinal[i * 3 + 2] - nodeFinal[j * 3 + 2]
        dists.push([dx * dx + dy * dy + dz * dz, j])
      }
      dists.sort((a, b) => a[0] - b[0])
      for (let k = 0; k < 3; k++) {
        const j = dists[k][1]
        const key = i < j ? i + '_' + j : j + '_' + i
        if (seen.has(key)) continue
        seen.add(key)
        seg.push(nodeFinal[i * 3], nodeFinal[i * 3 + 1], nodeFinal[i * 3 + 2], nodeFinal[j * 3], nodeFinal[j * 3 + 1], nodeFinal[j * 3 + 2])
      }
    }
    const linkGeo = new THREE.BufferGeometry()
    linkGeo.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3))
    const linkMat = lineMat('core', VIOLET_LINE, 0.34)
    assemblyMats.push(linkMat)
    coreSpin.add(new THREE.LineSegments(linkGeo, linkMat))

    const innerCount = 260
    const inner = new Float32Array(innerCount * 3)
    for (let i = 0; i < innerCount; i++) {
      const v = randomDir().multiplyScalar(1.85 * Math.cbrt(Math.random()))
      inner.set([v.x, v.y, v.z], i * 3)
    }
    const innerGeo = new THREE.BufferGeometry()
    innerGeo.setAttribute('position', new THREE.BufferAttribute(inner, 3))
    const innerMat = pointsMat('core', VIOLET_LINE, 0.08, 0.7)
    assemblyMats.push(innerMat)
    coreSpin.add(new THREE.Points(innerGeo, innerMat))
  }
  const shellMat = lineMat('core', LAV, 0.1)
  assemblyMats.push(shellMat)
  const shell = edges(new THREE.IcosahedronGeometry(2.95, 1), shellMat)
  core.add(shell)
  const coreGlowA = glow('core', VIOLET, 10, 0.55)
  const coreGlowB = glow('core', LAV, 3.2, 0.45)
  assemblyMats.push(coreGlowA.material, coreGlowB.material)
  core.add(coreGlowA, coreGlowB)

  // Twinkling highlight nodes (3 sets of 14).
  const sparkles = []
  for (let s = 0; s < 3; s++) {
    const arr = new Float32Array(42)
    for (let k = 0; k < 14; k++) {
      const idx = Math.floor(Math.random() * nodeCount)
      arr.set([nodeFinal[idx * 3], nodeFinal[idx * 3 + 1], nodeFinal[idx * 3 + 2]], k * 3)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    const m = new THREE.PointsMaterial({ color: PAPER, size: 0.3, map: dotTex, transparent: true, opacity: 0, depthWrite: false, blending: ADD })
    coreSpin.add(new THREE.Points(g, m))
    sparkles.push({ m, ph: s * 2.1 })
  }
  const coreLabel = addLabel(core, 'core', [0, -3.35, 0], strings.core, undefined, true)
  addPick(core, 2.4, 'core', 'core')

  // ---- flow particles + connecting curves ----
  const flows = []
  function addFlow(layer, curves, per, color, size, speed, base) {
    const arr = new Float32Array(curves.length * per * 3)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    layerGroup(layer).add(new THREE.Points(geo, pointsMat(layer, color, size, base)))
    flows.push({ curves, per, arr, geo, speed })
  }
  function addCurveLine(layer, curve, color, base, dashed) {
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100))
    let line
    if (dashed) {
      line = new THREE.Line(geo, track(layer, new THREE.LineDashedMaterial({ color, dashSize: 0.35, gapSize: 0.25, depthWrite: false, blending: ADD }), base))
      line.computeLineDistances()
    } else {
      line = new THREE.Line(geo, lineMat(layer, color, base))
    }
    layerGroup(layer).add(line)
  }

  // ---- sources (teal crystals) ----
  const crystals = []
  const inCurves = []
  const sourcesGroup = layerGroup('sources')
  const sourceLabels = SOURCE_POS.map((pos, i) => {
    const g = new THREE.Group()
    g.position.set(...pos)
    sourcesGroup.add(g)
    const crystal = edges(new THREE.OctahedronGeometry(0.55, 0), lineMat('sources', TEAL, 0.95))
    g.add(crystal)
    crystals.push(crystal)
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), meshMat('sources', TEAL, 1)))
    g.add(glow('sources', TEAL, 2.4, 0.55))
    const start = new THREE.Vector3(...pos)
    const curve = new THREE.CubicBezierCurve3(
      start.clone().add(new THREE.Vector3(0.6, 0, 0)),
      new THREE.Vector3(-6.8, pos[1], pos[2]),
      new THREE.Vector3(-4.6, pos[1] * 0.35, pos[2] * 0.3),
      new THREE.Vector3(-CORE_R * 0.95, pos[1] * 0.18, pos[2] * 0.2),
    )
    inCurves.push(curve)
    addCurveLine('inFlow', curve, TEAL, 0.28)
    addPick(g, 0.95, 'sources', 'source:' + i)
    return addLabel(g, 'sources', [0, -1, 0], strings.sources[i])
  })
  addFlow('inFlow', inCurves, 14, TEAL, 0.22, 0.16, 1)
  const connectorsAnchor = new THREE.Object3D()
  connectorsAnchor.position.set(-11.3, 5.2, 0)
  scene.add(connectorsAnchor)
  const connectorsLabel = addLabel(connectorsAnchor, 'sources', [0, 0, 0], strings.connectors)

  // ---- context layers (orbiting satellites) ----
  const layersGroup = layerGroup('layers')
  const satellites = []
  const layerLabels = ORBITS.map((o, i) => {
    const tilt = new THREE.Group()
    tilt.rotation.set(...o.e)
    layersGroup.add(tilt)
    tilt.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(ringPoints(o.r, 160)), lineMat('layers', LAV, 0.22)))
    const sat = new THREE.Group()
    tilt.add(sat)
    sat.add(new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), meshMat('layers', PAPER, 1)))
    sat.add(glow('layers', VIOLET_LINE, 1.9, 0.75))
    satellites.push({ sat, o })
    addPick(sat, 0.8, 'layers', 'layer:' + i)
    return addLabel(sat, 'layers', [0, -0.62, 0], strings.layers[i])
  })

  // ---- MCP endpoint ----
  const mcp = layerGroup('mcp')
  mcp.position.set(7, 0, 0)
  const mcpFace = new THREE.Group()
  mcpFace.rotation.y = Math.PI / 2
  mcp.add(mcpFace)
  const mcpOuter = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.045, 8, 6), meshMat('mcp', VIOLET_LINE, 1))
  const mcpInner = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.03, 8, 6), meshMat('mcp', LAV, 0.8))
  mcpFace.add(mcpOuter, mcpInner)
  mcpFace.add(new THREE.Mesh(new THREE.CircleGeometry(1.25, 6), meshMat('mcp', VIOLET, 0.14, { side: THREE.DoubleSide })))
  mcp.add(glow('mcp', VIOLET, 5.2, 0.5))
  const mcpLabel = addLabel(mcp, 'mcp', [0, -1.85, 0], strings.mcp, 'mono', true)
  addPick(mcp, 1.5, 'mcp', 'mcp')
  const mcpLine = new THREE.LineCurve3(new THREE.Vector3(CORE_R + 0.25, 0, 0), new THREE.Vector3(5.65, 0, 0))
  addCurveLine('mcp', mcpLine, VIOLET_LINE, 0.5)
  addFlow('mcp', [mcpLine], 12, LAV, 0.22, 0.32, 1)

  // ---- outputs (AI clients) ----
  const outputStr = (i, s) => (i === 4 ? s.local : { title: OUTPUTS[i].n, sub: s.outputSub })
  const outputsGroup = layerGroup('outputs')
  const outCurves = []
  const outputLabels = OUTPUTS.map((out, i) => {
    const g = new THREE.Group()
    g.position.set(...out.p)
    outputsGroup.add(g)
    const local = i === 4
    const crystal = edges(new THREE.IcosahedronGeometry(0.5, 0), lineMat('outputs', local ? TEAL : LAV, 0.9))
    g.add(crystal)
    crystals.push(crystal)
    g.add(new THREE.Mesh(new THREE.SphereGeometry(0.17, 16, 16), meshMat('outputs', local ? TEAL : PAPER, 1)))
    g.add(glow('outputs', local ? TEAL : VIOLET, 2.5, 0.65))
    const curve = new THREE.CubicBezierCurve3(
      new THREE.Vector3(8.4, 0, 0),
      new THREE.Vector3(10.4, 0, 0),
      new THREE.Vector3(11.3, out.p[1], out.p[2]),
      new THREE.Vector3(out.p[0] - 0.62, out.p[1], out.p[2]),
    )
    outCurves.push(curve)
    addCurveLine('outFlow', curve, VIOLET_LINE, 0.3)
    addPick(g, 0.95, 'outputs', 'output:' + i)
    return addLabel(g, 'outputs', [0, -1, 0], outputStr(i, strings))
  })
  addFlow('outFlow', outCurves, 12, LAV, 0.2, 0.2, 1)

  // ---- feedback loop ----
  const loopCurve = new THREE.CubicBezierCurve3(
    new THREE.Vector3(12.8, 4.1, 0),
    new THREE.Vector3(10.6, 8.8, 0),
    new THREE.Vector3(3.2, 8.6, 0),
    new THREE.Vector3(0.35, CORE_R + 0.35, 0),
  )
  addCurveLine('loop', loopCurve, LAV, 0.55, true)
  addFlow('loop', [loopCurve], 9, PAPER, 0.3, 0.12, 1)
  const loopAnchor = new THREE.Object3D()
  loopAnchor.position.copy(loopCurve.getPointAt(0.5))
  scene.add(loopAnchor)
  const loopLabel = addLabel(loopAnchor, 'loop', [0, 0.75, 0], strings.loop)
  const loopGroup = layerGroup('loop')
  const ripples = []
  for (let i = 0; i < 3; i++) {
    const m = new THREE.LineBasicMaterial({ color: LAV, transparent: true, opacity: 0, depthWrite: false, blending: ADD })
    const l = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(ringPoints(CORE_R + 0.15, 120)), m)
    l.rotation.x = 0.25 * i
    l.rotation.z = 0.2 * i
    loopGroup.add(l)
    ripples.push({ l, m, ph: i / 3 })
  }

  // ---- sizing / framing ----
  let W = 1
  let H = 1
  let radiusScale = 1
  function resize() {
    W = canvas.clientWidth || window.innerWidth
    H = canvas.clientHeight || window.innerHeight
    renderer.setSize(W, H, false)
    camera.aspect = W / H
    if (W / H < 1.1) {
      // Portrait: wider FOV, scene pushed up, camera pulled back.
      camera.fov = 58
      camera.setViewOffset(W, H, 0, Math.round(H * 0.17), W, H)
      const a = Math.tan((21 * Math.PI) / 180) * 1.6
      const b = Math.tan((29 * Math.PI) / 180) * (W / H)
      radiusScale = Math.min(1.85, 1 + (a / b - 1) * 0.6)
    } else {
      // Landscape: scene framed right of centre and slightly up.
      camera.fov = 42
      camera.setViewOffset(W, H, Math.round(-W * 0.14), Math.round(H * 0.07), W, H)
      radiusScale = 1
    }
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  // ---- camera state ----
  const camPos = new THREE.Vector3(...CHAPTERS[0].p)
  const camLook = new THREE.Vector3(...CHAPTERS[0].t)
  if (!reduce) camPos.set(0, 1.5, 22) // fly-in on load
  const goalPos = new THREE.Vector3(...CHAPTERS[0].p)
  const goalLook = new THREE.Vector3(...CHAPTERS[0].t)
  const offset = new THREE.Vector3()
  const sph = new THREE.Spherical()
  const tmp = new THREE.Vector3()
  const proj = new THREE.Vector3()
  let dragTheta = 0
  let dragPhi = 0
  let autoSpin = 0
  let chapter = 0
  let dragging = false
  let occluder = null

  function setChapter(i) {
    chapter = Math.min(CHAPTERS.length - 1, Math.max(0, i))
    const c = CHAPTERS[chapter]
    goalPos.set(...c.p)
    goalLook.set(...c.t)
    LAYER_KEYS.forEach((k) => { layers[k].target = c.focus[k] || 0 })
  }
  setChapter(0)

  const orbit = (dx, dy) => {
    dragTheta = Math.max(-1.3, Math.min(1.3, dragTheta - dx * 0.005))
    dragPhi = Math.max(-0.6, Math.min(0.6, dragPhi + dy * 0.004))
  }
  const setDragging = (v) => { dragging = v }
  const setOccluder = (r) => { occluder = r }

  const raycaster = new THREE.Raycaster()
  const ndc = new THREE.Vector2()
  function pick(clientX, clientY) {
    const rect = canvas.getBoundingClientRect()
    ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1)
    raycaster.setFromCamera(ndc, camera)
    const hits = raycaster.intersectObjects(pickables.filter((m) => layers[m.userData.layer].fade > 0.3), false)
    return hits.length ? hits[0].object.userData.id : null
  }

  function setStrings(s) {
    setLabel(coreLabel, s.core)
    setLabel(connectorsLabel, s.connectors)
    sourceLabels.forEach((l, i) => setLabel(l, s.sources[i]))
    layerLabels.forEach((l, i) => setLabel(l, s.layers[i]))
    setLabel(mcpLabel, s.mcp)
    outputLabels.forEach((l, i) => setLabel(l, outputStr(i, s)))
    setLabel(loopLabel, s.loop)
  }

  // ---- render loop ----
  let time = 0
  let assembly = reduce ? 1 : 0
  let assemblyEased = reduce ? 1 : 0
  let lastFrame = 0
  let raf = 0
  let running = false

  function frame(now) {
    const dt = lastFrame ? Math.min(0.05, (now - lastFrame) / 1000) : 0.016
    lastFrame = now
    time += dt
    const speed = reduce ? 0.25 : 1

    // Sphere assembles from scattered points over 3.8s (ease-out cubic).
    if (assembly < 1) {
      assembly = Math.min(1, assembly + dt / 3.8)
      assemblyEased = 1 - Math.pow(1 - assembly, 3)
      for (let i = 0; i < nodeCount * 3; i++) nodeLive[i] = nodeStart[i] + (nodeFinal[i] - nodeStart[i]) * assemblyEased
      nodeGeo.attributes.position.needsUpdate = true
    }

    const k = 1 - Math.exp(-dt * 2.4)
    LAYER_KEYS.forEach((key) => {
      const L = layers[key]
      L.fade += (L.target - L.fade) * k
      L.mats.forEach((m) => { m.mat.opacity = m.base * L.fade })
      const vis = L.fade > 0.005
      L.objs.forEach((o) => { o.visible = vis })
    })
    assemblyMats.forEach((m) => { m.opacity *= assemblyEased })
    sparkles.forEach((s) => {
      s.m.opacity = layers.core.fade * assemblyEased * (0.25 + 0.75 * Math.abs(Math.sin(time * 1.7 + s.ph)))
    })

    coreSpin.rotation.y += dt * 0.12 * speed
    coreSpin.rotation.x = Math.sin(time * 0.2) * 0.08
    shell.rotation.y -= dt * 0.05 * speed
    shell.rotation.z += dt * 0.03 * speed
    crystals.forEach((c, i) => {
      c.rotation.y += dt * (0.35 + i * 0.03) * speed
      c.rotation.x += dt * 0.15 * speed
    })
    mcpOuter.rotation.z += dt * 0.25 * speed
    mcpInner.rotation.z -= dt * 0.45 * speed
    dust.rotation.y += dt * 0.004 * speed
    satellites.forEach(({ sat, o }) => {
      const a = o.ph + time * o.v * speed
      sat.position.set(Math.cos(a) * o.r, 0, Math.sin(a) * o.r)
    })
    flows.forEach((f) => {
      for (let c = 0; c < f.curves.length; c++) {
        for (let j = 0; j < f.per; j++) {
          const u = (time * f.speed * speed + j / f.per + c * 0.17) % 1
          f.curves[c].getPointAt(u, tmp)
          f.arr.set([tmp.x, tmp.y, tmp.z], (c * f.per + j) * 3)
        }
      }
      f.geo.attributes.position.needsUpdate = true
    })
    ripples.forEach((r) => {
      const p = (time * 0.33 * speed + r.ph) % 1
      r.l.scale.setScalar(1 + p * 1.5)
      r.m.opacity = layers.loop.fade * (1 - p) * 0.7
    })

    // Camera: ease toward chapter pose, plus drag offset, idle sway and
    // a slow auto-orbit on the final chapter.
    const ease = reduce ? 1 : 1 - Math.exp(-dt * 1.3)
    camPos.lerp(goalPos, ease)
    camLook.lerp(goalLook, ease)
    if (chapter === CHAPTERS.length - 1 && !reduce) autoSpin += dt * 0.07
    else autoSpin *= Math.exp(-dt * 0.6)
    offset.subVectors(camPos, camLook)
    sph.setFromVector3(offset)
    sph.radius *= radiusScale
    sph.theta += dragTheta + autoSpin + (reduce ? 0 : Math.sin(time * 0.13) * 0.06)
    sph.phi = Math.max(0.35, Math.min(2.75, sph.phi - dragPhi + (reduce ? 0 : Math.sin(time * 0.09) * 0.025)))
    offset.setFromSpherical(sph)
    camera.position.copy(camLook).add(offset)
    camera.lookAt(camLook)
    if (!dragging) {
      const decay = Math.exp(-dt * 0.35)
      dragTheta *= decay
      dragPhi *= decay
    }

    // Project labels; dim those behind the story text block.
    labels.forEach((l) => {
      const fade = layers[l.layer].fade
      if (fade < 0.04) { l.el.style.opacity = '0'; return }
      l.obj.getWorldPosition(proj)
      proj.add(l.offset).project(camera)
      if (proj.z > 1 || proj.z < -1) { l.el.style.opacity = '0'; return }
      const x = (proj.x * 0.5 + 0.5) * W
      const y = (-proj.y * 0.5 + 0.5) * H
      l.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-50%)`
      const hidden = occluder && x > occluder.left && x < occluder.right && y > occluder.top && y < occluder.bottom
      l.el.style.opacity = String(Math.min(1, fade * 1.15) * (hidden ? 0.12 : 1))
    })

    renderer.render(scene, camera)
    if (running) raf = requestAnimationFrame(frame)
  }

  function start() {
    if (running) return
    running = true
    lastFrame = 0
    raf = requestAnimationFrame(frame)
  }
  function stop() {
    running = false
    cancelAnimationFrame(raf)
  }
  function dispose() {
    stop()
    ro.disconnect()
    scene.traverse((o) => {
      o.geometry?.dispose()
      const m = o.material
      if (Array.isArray(m)) m.forEach((x) => x.dispose())
      else m?.dispose()
    })
    glowTex.dispose()
    dotTex.dispose()
    renderer.dispose()
    labels.forEach((l) => l.el.remove())
  }

  return { setChapter, setStrings, setOccluder, orbit, setDragging, pick, start, stop, dispose }
}

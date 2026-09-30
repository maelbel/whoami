import {
  ACESFilmicToneMapping,
  CanvasTexture,
  Color,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Path,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  Shape,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer
} from 'three'
import type { Material } from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

// Units: 1 = 10 mm. x runs along the board's 85 mm edge, z along its 56 mm edge,
// y is up, and the top of the PCB sits at y = PCB_TOP.
const PCB_W = 8.5
const PCB_D = 5.6
const PCB_TOP = 0.16

export type AnchorName = 'soc' | 'ram' | 'rp1' | 'gpio' | 'usb3' | 'eth' | 'nvme' | 'dongle'

export interface ScreenAnchor {
  x: number
  y: number
  visible: boolean
}

export interface PiScene {
  setProgress: (progress: number) => void
  resize: (width: number, height: number) => void
  dispose: () => void
}

export interface PiSceneOptions {
  onFrame: (progress: number, anchors: Record<AnchorName, ScreenAnchor>) => void
}

interface Keyframe {
  p: number
  cam: [number, number, number]
  target: [number, number, number]
  rot: number
  shell: number
  sink: number
  base: number
  dongle: number
  shift: number
}

// The whole scroll story, as camera + part positions at given scroll progress.
const KEYFRAMES: Keyframe[] = [
  { p: 0, cam: [10, 7.5, 12], target: [0, 0.4, 0], rot: -0.35, shell: 0, sink: 0, base: 0, dongle: 16, shift: 1 },
  { p: 0.1, cam: [9, 6, 11.5], target: [0, 0.4, 0], rot: 0.15, shell: 0, sink: 0, base: 0, dongle: 16, shift: 1 },
  { p: 0.22, cam: [8, 9, 10], target: [0.6, 0.8, 0], rot: 0.2, shell: 5, sink: 0, base: 0, dongle: 16, shift: -1 },
  { p: 0.34, cam: [-1.5, 10.5, 7.5], target: [-0.8, 0.2, 0.2], rot: 0, shell: 12, sink: 7, base: 0, dongle: 16, shift: 1 },
  { p: 0.46, cam: [3, 7.5, 6.5], target: [1.2, 0.2, 0.4], rot: 0, shell: 12, sink: 7, base: 0, dongle: 16, shift: 1 },
  { p: 0.6, cam: [7, 3, 9.5], target: [0, -2.2, 0], rot: 0.3, shell: 12, sink: 7, base: 3.2, dongle: 16, shift: -1 },
  { p: 0.72, cam: [11, 5.5, 10], target: [2, 0.5, 0], rot: 0.1, shell: 0, sink: 0, base: 0, dongle: 9, shift: 1 },
  { p: 0.84, cam: [15, 7, 10], target: [5, 1.8, -1.5], rot: 0, shell: 0, sink: 0, base: 0, dongle: 0, shift: 1 },
  { p: 1, cam: [13, 8, 16], target: [2.5, 1.2, 0], rot: -0.25, shell: 0, sink: 0, base: 0, dongle: 0, shift: 1 }
]

function sampleKeyframes(progress: number): Keyframe {
  const p = MathUtils.clamp(progress, 0, 1)
  let index = KEYFRAMES.findIndex(frame => frame.p > p) - 1
  if (index < 0) index = KEYFRAMES.length - 2

  const from = KEYFRAMES[index]!
  const to = KEYFRAMES[index + 1]!
  const t = MathUtils.smootherstep((p - from.p) / (to.p - from.p), 0, 1)
  const lerp = (a: number, b: number) => a + (b - a) * t

  return {
    p,
    cam: [lerp(from.cam[0], to.cam[0]), lerp(from.cam[1], to.cam[1]), lerp(from.cam[2], to.cam[2])],
    target: [lerp(from.target[0], to.target[0]), lerp(from.target[1], to.target[1]), lerp(from.target[2], to.target[2])],
    rot: lerp(from.rot, to.rot),
    shell: lerp(from.shell, to.shell),
    sink: lerp(from.sink, to.sink),
    base: lerp(from.base, to.base),
    dongle: lerp(from.dongle, to.dongle),
    shift: lerp(from.shift, to.shift)
  }
}

function roundedRect(shape: Shape | Path, x: number, y: number, w: number, h: number, r: number) {
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
}

/** A flat plate in the XY plane, centered, with rectangular cut-outs, extruded along Z. */
function plateWithHoles(width: number, height: number, thickness: number, holes: { cx: number, cy: number, w: number, h: number }[]) {
  const shape = new Shape()
  shape.moveTo(-width / 2, -height / 2)
  shape.lineTo(width / 2, -height / 2)
  shape.lineTo(width / 2, height / 2)
  shape.lineTo(-width / 2, height / 2)
  shape.lineTo(-width / 2, -height / 2)

  for (const hole of holes) {
    const path = new Path()
    roundedRect(path, hole.cx - hole.w / 2, hole.cy - hole.h / 2, hole.w, hole.h, 0.05)
    shape.holes.push(path)
  }

  const geometry = new ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false })
  geometry.translate(0, 0, -thickness / 2)
  return geometry
}

function box(parent: Object3D, size: [number, number, number], position: [number, number, number], material: Material, radius = 0.02) {
  const geometry = radius > 0
    ? new RoundedBoxGeometry(size[0], size[1], size[2], 2, Math.min(radius, ...size.map(s => s / 2 - 0.001)))
    : new RoundedBoxGeometry(size[0], size[1], size[2], 1, 0.001)
  const mesh = new Mesh(geometry, material)
  mesh.position.set(...position)
  parent.add(mesh)
  return mesh
}

function anchor(parent: Object3D, position: [number, number, number]) {
  const object = new Object3D()
  object.position.set(...position)
  parent.add(object)
  return object
}

/** Silkscreen + copper traces for the top of the PCB, drawn once on a canvas. */
function pcbTexture() {
  const scale = 120
  const canvas = document.createElement('canvas')
  canvas.width = PCB_W * scale
  canvas.height = PCB_D * scale
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#1c5a33'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Copper pours and traces, slightly lighter than the solder mask.
  ctx.strokeStyle = 'rgba(120, 190, 120, 0.22)'
  ctx.lineCap = 'round'
  let seed = 7
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  for (let i = 0; i < 140; i++) {
    ctx.lineWidth = 1 + random() * 3
    let x = random() * canvas.width
    let y = random() * canvas.height
    ctx.beginPath()
    ctx.moveTo(x, y)
    for (let segment = 0; segment < 3; segment++) {
      const horizontal = random() > 0.5
      const length = (random() - 0.5) * 260
      x += horizontal ? length : length * 0.5
      y += horizontal ? length * 0.5 * (random() > 0.5 ? 1 : 0) : length
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  ctx.fillStyle = 'rgba(210, 190, 110, 0.5)'
  for (let i = 0; i < 260; i++) {
    ctx.beginPath()
    ctx.arc(random() * canvas.width, random() * canvas.height, 2.5, 0, Math.PI * 2)
    ctx.fill()
  }

  // Silkscreen, in board coordinates (mm from the top-left corner).
  const mm = (value: number) => value * scale / 10
  ctx.strokeStyle = 'rgba(240, 240, 232, 0.8)'
  ctx.fillStyle = 'rgba(240, 240, 232, 0.85)'
  ctx.lineWidth = 2
  ctx.font = `600 ${mm(2.2)}px monospace`
  ctx.fillText('J8', mm(4), mm(9))
  ctx.fillText('PCIE', mm(2), mm(36))
  ctx.fillText('ETH', mm(66), mm(40))
  ctx.fillText('FAN', mm(68), mm(10))
  ctx.font = `600 ${mm(1.6)}px monospace`
  ctx.fillText('ACT', mm(2.5), mm(44))
  ctx.strokeRect(mm(18), mm(22), mm(22), mm(22))
  ctx.strokeRect(mm(42), mm(24), mm(15), mm(17))
  ctx.strokeRect(mm(58), mm(28), mm(12), mm(12))

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function labelTexture(lines: string[], width = 512, height = 180) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ecebe6'
  ctx.fillRect(0, 0, width, height)
  ctx.fillStyle = '#EB5517'
  ctx.fillRect(0, 0, 18, height)
  ctx.fillStyle = '#16150f'
  ctx.font = '700 44px monospace'
  ctx.fillText(lines[0] ?? '', 44, 70)
  ctx.font = '500 26px monospace'
  lines.slice(1).forEach((line, index) => ctx.fillText(line, 44, 112 + index * 34))
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

function shadowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 128)
  gradient.addColorStop(0, 'rgba(0,0,0,0.75)')
  gradient.addColorStop(0.5, 'rgba(0,0,0,0.35)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 256)
  return new CanvasTexture(canvas)
}

function buildModel() {
  const materials = {
    pcb: new MeshPhysicalMaterial({ map: pcbTexture(), roughness: 0.55, clearcoat: 0.4, clearcoatRoughness: 0.4 }),
    pcbEdge: new MeshStandardMaterial({ color: '#14361f', roughness: 0.7 }),
    chip: new MeshStandardMaterial({ color: '#141414', roughness: 0.42 }),
    lid: new MeshStandardMaterial({ color: '#b9bdc3', metalness: 1, roughness: 0.28 }),
    metal: new MeshStandardMaterial({ color: '#c8ccd2', metalness: 1, roughness: 0.3 }),
    darkHole: new MeshStandardMaterial({ color: '#050505', roughness: 0.9 }),
    usb3: new MeshStandardMaterial({ color: '#1f55d6', roughness: 0.45 }),
    plastic: new MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.6 }),
    gold: new MeshStandardMaterial({ color: '#d8b04a', metalness: 1, roughness: 0.25 }),
    connector: new MeshStandardMaterial({ color: '#e7e1cf', roughness: 0.55 }),
    shell: new MeshPhysicalMaterial({ color: '#2f3033', metalness: 0.85, roughness: 0.38, clearcoat: 0.25, clearcoatRoughness: 0.5 }),
    tray: new MeshStandardMaterial({ color: '#141414', roughness: 0.72 }),
    heatsink: new MeshStandardMaterial({ color: '#aeb3b9', metalness: 0.95, roughness: 0.34 }),
    ribbon: new MeshStandardMaterial({ color: '#c77a2c', roughness: 0.5, metalness: 0.2 }),
    dongle: new MeshPhysicalMaterial({ color: '#e9e7e2', roughness: 0.45, clearcoat: 0.3 }),
    antenna: new MeshStandardMaterial({ color: '#121212', roughness: 0.55 }),
    ledGreen: new MeshStandardMaterial({ color: '#3fb950', emissive: new Color('#3fb950'), emissiveIntensity: 2.5 }),
    ledRed: new MeshStandardMaterial({ color: '#f85149', emissive: new Color('#f85149'), emissiveIntensity: 1.5 }),
    ledAmber: new MeshStandardMaterial({ color: '#e3b341', emissive: new Color('#e3b341'), emissiveIntensity: 1.5 }),
    ssdLabel: new MeshStandardMaterial({ map: labelTexture(['1 TB NVMe', 'M.2 2280 · PCIe', 'boot + data']), roughness: 0.6 }),
    dongleLabel: new MeshStandardMaterial({ map: labelTexture(['ZBDongle-E', 'Zigbee 3.0 · EFR32MG21'], 512, 150), roughness: 0.6 })
  }

  const root = new Group()
  const board = new Group()
  root.add(board)

  // --- PCB, with the Pi's real, asymmetric mounting-hole pattern (58 × 49 mm) ---
  const pcbShape = new Shape()
  roundedRect(pcbShape, -PCB_W / 2, -PCB_D / 2, PCB_W, PCB_D, 0.3)
  for (const hx of [-3.9, 1.9]) {
    for (const hz of [-2.45, 2.45]) {
      const hole = new Path()
      hole.absarc(hx, hz, 0.14, 0, Math.PI * 2, true)
      pcbShape.holes.push(hole)
    }
  }
  const pcbGeometry = new ExtrudeGeometry(pcbShape, { depth: PCB_TOP, bevelEnabled: false, curveSegments: 12 })
  // Shape y becomes world -z; the texture's top row lands on the north (GPIO) edge.
  pcbGeometry.rotateX(-Math.PI / 2)
  const pcbTex = materials.pcb.map!
  pcbTex.repeat.set(1 / PCB_W, 1 / PCB_D)
  pcbTex.offset.set(0.5, 0.5)
  board.add(new Mesh(pcbGeometry, [materials.pcb, materials.pcbEdge]))

  const onBoard = (height: number) => PCB_TOP + height / 2

  // SoC, RAM, RP1 and a few passives.
  box(board, [1.65, 0.12, 1.65], [-1.35, onBoard(0.12), 0.4], materials.lid, 0.04)
  box(board, [1.25, 0.1, 1.45], [0.5, onBoard(0.1), 0.4], materials.chip, 0.03)
  box(board, [1.0, 0.08, 1.0], [2.2, onBoard(0.08), 0.6], materials.chip, 0.03)
  box(board, [0.6, 0.08, 0.6], [-3.2, onBoard(0.08), -0.6], materials.chip, 0.02)
  box(board, [0.45, 0.06, 0.45], [0.9, onBoard(0.06), -1.3], materials.chip, 0.02)
  for (let i = 0; i < 14; i++) {
    const x = -3.4 + (i % 7) * 0.22
    const z = 1.3 + Math.floor(i / 7) * 0.2
    box(board, [0.1, 0.05, 0.06], [x, onBoard(0.05), z], i % 3 ? materials.chip : materials.connector, 0)
  }

  // 40-pin GPIO header along the north edge.
  box(board, [5.08, 0.25, 0.508], [-1.0, onBoard(0.25), -2.45], materials.plastic, 0.02)
  const pinGeometry = new RoundedBoxGeometry(0.064, 0.62, 0.064, 1, 0.005)
  const pins = new InstancedMesh(pinGeometry, materials.gold, 40)
  const matrix = new Matrix4()
  for (let i = 0; i < 40; i++) {
    const column = Math.floor(i / 2)
    const row = i % 2
    matrix.makeTranslation(-1.0 - 2.54 + 0.127 + column * 0.254, PCB_TOP + 0.36, -2.45 - 0.127 + row * 0.254)
    pins.setMatrixAt(i, matrix)
  }
  board.add(pins)

  // Fan header and PCIe FFC connector.
  box(board, [0.5, 0.3, 0.3], [3.2, onBoard(0.3), -2.2], materials.connector, 0.02)
  box(board, [0.35, 0.18, 1.6], [-3.95, onBoard(0.18), -0.2], materials.connector, 0.02)

  // Two MIPI connectors between the HDMI ports and Ethernet.
  box(board, [1.3, 0.16, 0.3], [1.3, onBoard(0.16), 2.2], materials.connector, 0.02)
  box(board, [1.3, 0.16, 0.3], [2.9, onBoard(0.16), 2.2], materials.connector, 0.02)

  // USB stacks + Ethernet on the east edge (Pi 5 layout: USB 2, USB 3, Ethernet).
  const eastEdge = PCB_W / 2 + 0.2
  const usbStack = (z: number, insert: Material) => {
    box(board, [1.75, 1.6, 1.33], [eastEdge - 0.875, onBoard(1.6), z], materials.metal, 0.03)
    for (const y of [0.56, 1.34]) {
      box(board, [0.06, 0.52, 1.14], [eastEdge + 0.001, PCB_TOP + y, z], materials.darkHole, 0)
      box(board, [0.08, 0.16, 1.0], [eastEdge - 0.02, PCB_TOP + y - 0.08, z], insert, 0)
    }
  }
  usbStack(-1.9, materials.plastic)
  usbStack(-0.1, materials.usb3)
  box(board, [2.1, 1.35, 1.6], [eastEdge - 1.05, onBoard(1.35), 1.85], materials.metal, 0.03)
  box(board, [0.06, 0.9, 1.2], [eastEdge + 0.001, PCB_TOP + 0.62, 1.85], materials.darkHole, 0)
  box(board, [0.04, 0.12, 0.22], [eastEdge + 0.02, PCB_TOP + 1.18, 1.35], materials.ledGreen, 0)
  box(board, [0.04, 0.12, 0.22], [eastEdge + 0.02, PCB_TOP + 1.18, 2.35], materials.ledAmber, 0)

  // USB-C power and two micro-HDMI on the south edge.
  const southEdge = PCB_D / 2 + 0.2
  box(board, [0.9, 0.32, 0.75], [-3.13, onBoard(0.32), southEdge - 0.375], materials.metal, 0.1)
  for (const x of [-1.67, -0.33]) {
    box(board, [0.66, 0.3, 0.75], [x, onBoard(0.3), southEdge - 0.375], materials.metal, 0.05)
  }

  // Status LEDs + power button on the west edge.
  box(board, [0.14, 0.06, 0.1], [-4.0, onBoard(0.06), 1.6], materials.ledGreen, 0)
  box(board, [0.14, 0.06, 0.1], [-4.0, onBoard(0.06), 1.9], materials.ledRed, 0)
  box(board, [0.3, 0.2, 0.3], [-4.0, onBoard(0.2), 2.3], materials.plastic, 0.04)

  // --- Passive heatsink over the SoC ---
  const sink = new Group()
  root.add(sink)
  const sinkY = PCB_TOP + 0.12 + 0.02
  box(sink, [2.6, 0.12, 2.4], [-1.35, sinkY + 0.06, 0.4], materials.heatsink, 0.03)
  for (let i = 0; i < 9; i++) {
    box(sink, [0.07, 0.9, 2.4], [-1.35 - 1.2 + 0.05 + i * 0.3, sinkY + 0.12 + 0.45, 0.4], materials.heatsink, 0.02)
  }

  // --- Aluminium top shell with port cut-outs ---
  const shell = new Group()
  root.add(shell)
  const shellMinY = -0.5
  const shellMaxY = 1.9
  const wallHeight = shellMaxY - shellMinY
  const wallMidY = (shellMinY + shellMaxY) / 2
  const wallThickness = 0.15
  const shellMinX = -4.6
  const shellMaxX = 4.5
  const shellWidth = shellMaxX - shellMinX
  const shellMidX = (shellMinX + shellMaxX) / 2
  const shellDepth = 6.2

  const eastHoles = [
    { z: -1.9, w: 1.4, y0: 0.2, y1: 1.72 },
    { z: -0.1, w: 1.4, y0: 0.2, y1: 1.72 },
    { z: 1.85, w: 1.66, y0: 0.2, y1: 1.47 }
  ].map(hole => ({ cx: hole.z, cy: (hole.y0 + hole.y1) / 2 - wallMidY, w: hole.w, h: hole.y1 - hole.y0 }))
  const eastWall = new Mesh(plateWithHoles(shellDepth, wallHeight, wallThickness, eastHoles), materials.shell)
  eastWall.rotation.y = -Math.PI / 2
  eastWall.position.set(shellMaxX - wallThickness / 2, wallMidY, 0)
  shell.add(eastWall)

  const southHoles = [
    { x: -3.13, w: 1.0 },
    { x: -1.67, w: 0.76 },
    { x: -0.33, w: 0.76 }
  ].map(hole => ({ cx: hole.x - shellMidX, cy: PCB_TOP + 0.17 - wallMidY, w: hole.w, h: 0.42 }))
  const southWall = new Mesh(plateWithHoles(shellWidth, wallHeight, wallThickness, southHoles), materials.shell)
  southWall.position.set(shellMidX, wallMidY, shellDepth / 2 - wallThickness / 2)
  shell.add(southWall)

  box(shell, [shellWidth, wallHeight, wallThickness], [shellMidX, wallMidY, -shellDepth / 2 + wallThickness / 2], materials.shell, 0.02)
  box(shell, [wallThickness, wallHeight, shellDepth], [shellMinX + wallThickness / 2, wallMidY, 0], materials.shell, 0.02)
  box(shell, [shellWidth + 0.02, 0.16, shellDepth + 0.02], [shellMidX, shellMaxY + 0.08, 0], materials.shell, 0.06)
  for (let i = 0; i < 13; i++) {
    box(shell, [0.07, 0.02, 3.4], [-3.6 + i * 0.24, shellMaxY + 0.165, 0.4], materials.darkHole, 0)
  }

  // --- Base tray with the NVMe drive ---
  const base = new Group()
  root.add(base)
  const trayTop = shellMinY - 0.02
  const trayBottom = trayTop - 0.8
  box(base, [shellWidth, 0.12, shellDepth], [shellMidX, trayBottom + 0.06, 0], materials.tray, 0.04)
  const trayWallH = trayTop - trayBottom
  const trayWallY = (trayTop + trayBottom) / 2
  box(base, [shellWidth, trayWallH, 0.15], [shellMidX, trayWallY, -shellDepth / 2 + 0.075], materials.tray, 0.02)
  box(base, [shellWidth, trayWallH, 0.15], [shellMidX, trayWallY, shellDepth / 2 - 0.075], materials.tray, 0.02)
  box(base, [0.15, trayWallH, shellDepth], [shellMinX + 0.075, trayWallY, 0], materials.tray, 0.02)
  box(base, [0.15, trayWallH, shellDepth], [shellMaxX - 0.075, trayWallY, 0], materials.tray, 0.02)
  for (const fx of [shellMinX + 0.6, shellMaxX - 0.6]) {
    for (const fz of [-shellDepth / 2 + 0.6, shellDepth / 2 - 0.6]) {
      const foot = new Mesh(new CylinderGeometry(0.28, 0.28, 0.1, 20), materials.plastic)
      foot.position.set(fx, trayBottom - 0.05, fz)
      base.add(foot)
    }
  }

  const ssdY = trayBottom + 0.3
  box(base, [8.0, 0.08, 2.2], [0, ssdY, 0], materials.chip, 0.02)
  box(base, [1.1, 0.1, 1.1], [-2.6, ssdY + 0.09, 0], materials.chip, 0.02)
  const ssdLabel = new Mesh(new PlaneGeometry(5.2, 1.9), materials.ssdLabel)
  ssdLabel.rotation.x = -Math.PI / 2
  ssdLabel.position.set(0.9, ssdY + 0.07, 0)
  base.add(ssdLabel)
  box(base, [0.3, 0.02, 1.9], [3.9, ssdY + 0.05, 0], materials.gold, 0)
  const screw = new Mesh(new CylinderGeometry(0.16, 0.16, 0.08, 16), materials.metal)
  screw.position.set(-3.85, ssdY + 0.08, 0)
  base.add(screw)

  // FFC ribbon from the board's PCIe connector down into the base.
  const ribbon = new Mesh(new RoundedBoxGeometry(0.03, 1, 1.3, 1, 0.01), materials.ribbon)
  root.add(ribbon)

  // --- SONOFF ZBDongle-E, plugged into the upper USB 2 port ---
  const dongle = new Group()
  root.add(dongle)
  const portY = PCB_TOP + 1.34
  const portZ = -1.9
  box(dongle, [1.3, 0.45, 1.2], [eastEdge - 0.4, portY, portZ], materials.metal, 0.02)
  box(dongle, [5.2, 1.0, 2.5], [eastEdge + 0.25 + 2.6, portY, portZ], materials.dongle, 0.3)
  const dongleLabel = new Mesh(new PlaneGeometry(3.6, 1.05), materials.dongleLabel)
  dongleLabel.rotation.x = -Math.PI / 2
  dongleLabel.position.set(eastEdge + 2.6, portY + 0.505, portZ)
  dongle.add(dongleLabel)
  const smaX = eastEdge + 0.25 + 5.2 + 0.15
  const sma = new Mesh(new CylinderGeometry(0.2, 0.2, 0.4, 20), materials.gold)
  sma.rotation.z = Math.PI / 2
  sma.position.set(smaX, portY, portZ)
  dongle.add(sma)
  box(dongle, [0.55, 0.55, 0.55], [smaX + 0.35, portY, portZ], materials.antenna, 0.12)
  const rod = new Mesh(new CylinderGeometry(0.2, 0.26, 4.6, 24), materials.antenna)
  rod.position.set(smaX + 0.35, portY + 0.25 + 2.3, portZ)
  dongle.add(rod)

  const anchors: Record<AnchorName, Object3D> = {
    soc: anchor(board, [-1.35, PCB_TOP + 0.2, 0.4]),
    ram: anchor(board, [0.5, PCB_TOP + 0.15, 0.4]),
    rp1: anchor(board, [2.2, PCB_TOP + 0.12, 0.6]),
    gpio: anchor(board, [-2.6, PCB_TOP + 0.7, -2.45]),
    usb3: anchor(board, [eastEdge, PCB_TOP + 0.9, -0.1]),
    eth: anchor(board, [eastEdge, PCB_TOP + 0.9, 1.85]),
    nvme: anchor(base, [-2.6, ssdY + 0.15, 0]),
    dongle: anchor(dongle, [eastEdge + 3.6, portY + 0.5, portZ])
  }

  const shadow = new Mesh(
    new PlaneGeometry(20, 14),
    new MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false })
  )
  shadow.rotation.x = -Math.PI / 2

  return {
    root,
    shell,
    sink,
    base,
    dongle,
    ribbon,
    shadow,
    trayTop,
    trayBottom,
    anchors,
    dispose() {
      root.traverse((object) => {
        if (object instanceof Mesh) object.geometry.dispose()
      })
      shadow.geometry.dispose()
      Object.values(materials).forEach((material) => {
        const map = 'map' in material ? material.map : null
        map?.dispose()
        material.dispose()
      })
    }
  }
}

export function createPiScene(canvas: HTMLCanvasElement, options: PiSceneOptions): PiScene {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.outputColorSpace = SRGBColorSpace

  const scene = new Scene()
  const pmrem = new PMREMGenerator(renderer)
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environment = environment
  scene.environmentIntensity = 0.55

  const key = new DirectionalLight('#fff6ea', 1.5)
  key.position.set(4, 10, 7)
  scene.add(key)
  const rim = new DirectionalLight('#ff7a3d', 1.1)
  rim.position.set(-6, 1.5, -10)
  scene.add(rim)
  const fill = new DirectionalLight('#9fb4ff', 0.4)
  fill.position.set(-6, -3, 8)
  scene.add(fill)

  const camera = new PerspectiveCamera(32, 1, 0.1, 200)
  const model = buildModel()
  scene.add(model.root)
  scene.add(model.shadow)

  const target = new Vector3()
  const projected = new Vector3()
  const anchorNames = Object.keys(model.anchors) as AnchorName[]

  let width = 1
  let height = 1
  let targetProgress = 0
  let currentProgress = -1
  let frameId = 0
  let lastTime = 0
  let disposed = false

  function apply(progress: number) {
    const frame = sampleKeyframes(progress)

    model.root.rotation.y = frame.rot
    model.shell.position.y = frame.shell
    model.sink.position.y = frame.sink
    model.base.position.y = -frame.base
    model.dongle.position.x = frame.dongle
    model.dongle.visible = frame.dongle < 15

    const ribbonTop = PCB_TOP
    const ribbonBottom = model.trayBottom + 0.3 - frame.base
    model.ribbon.scale.y = ribbonTop - ribbonBottom
    model.ribbon.position.set(-4.3, (ribbonTop + ribbonBottom) / 2, -0.2)

    model.shadow.position.y = model.trayBottom - 0.12 - frame.base

    // Narrow viewports pull the camera back so the whole assembly stays in frame.
    const aspect = width / height
    const narrow = aspect < 1
    const distanceScale = 1.25 * (narrow ? MathUtils.lerp(1.7, 1.1, MathUtils.clamp((aspect - 0.5) / 0.5, 0, 1)) : 1)
    target.set(...frame.target)
    camera.position.set(...frame.cam).sub(target).multiplyScalar(distanceScale).add(target)
    camera.lookAt(target)

    // Slide the rendered image sideways (or up, on phones) to leave room for the copy.
    if (narrow) camera.setViewOffset(width, height, 0, height * 0.14, width, height)
    else camera.setViewOffset(width, height, -frame.shift * width * 0.17, 0, width, height)

    renderer.render(scene, camera)

    const anchors = {} as Record<AnchorName, ScreenAnchor>
    for (const name of anchorNames) {
      projected.setFromMatrixPosition(model.anchors[name].matrixWorld).project(camera)
      anchors[name] = {
        x: (projected.x + 1) / 2 * width,
        y: (1 - projected.y) / 2 * height,
        visible: projected.z < 1 && Math.abs(projected.x) < 1.1 && Math.abs(projected.y) < 1.1
      }
    }
    options.onFrame(progress, anchors)
  }

  function loop(time = 0) {
    if (disposed) return
    frameId = requestAnimationFrame(loop)

    const elapsed = Math.min(0.1, (time - lastTime) / 1000)
    lastTime = time

    const delta = targetProgress - currentProgress
    if (currentProgress >= 0 && Math.abs(delta) < 0.0002) return

    // Frame-rate independent easing towards the scroll position.
    currentProgress = currentProgress < 0 ? targetProgress : currentProgress + delta * (1 - Math.exp(-elapsed * 5))
    apply(currentProgress)
  }

  loop()

  return {
    setProgress(progress) {
      targetProgress = MathUtils.clamp(progress, 0, 1)
    },
    resize(nextWidth, nextHeight) {
      width = Math.max(1, nextWidth)
      height = Math.max(1, nextHeight)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      apply(Math.max(currentProgress, 0))
    },
    dispose() {
      disposed = true
      cancelAnimationFrame(frameId)
      model.dispose()
      environment.dispose()
      pmrem.dispose()
      renderer.dispose()
    }
  }
}

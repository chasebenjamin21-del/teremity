// The map: an original schematic of the Lands Between with pinch, pan and fly-to.
// Pans and zooms touch only the SVG viewBox and one CSS variable, so it stays smooth on an iPad.
import { useEffect, useMemo, useRef } from 'preact/hooks'
import { world, graces, bosses, loot, markers, places, regionShape } from '../lib/world.js'
import { REGIONS, LANDMARKS } from '../content/regions.js'
import { getState } from '../lib/store.js'

const BOUNDS = { 0: [36, 28, 196, 240], 1: [40, 86, 165, 196] }
const HOME = { 0: [40, 102, 168, 236], 1: [44, 90, 160, 192] }   // the parts of the world we know so far
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

export function MapView({ state, here, selected, onSelect, flyRef }) {
  const wrap = useRef(null), svg = useRef(null)
  const view = useRef({ cx: 110, cy: 150, upp: 0.25 })
  const size = useRef({ w: 800, h: 600 })
  const layer = state.under ? 1 : 0

  const apply = () => {
    const { cx, cy, upp } = view.current, { w, h } = size.current
    const el = svg.current
    if (!el) return
    el.setAttribute('viewBox', `${cx - (w * upp) / 2} ${cy - (h * upp) / 2} ${w * upp} ${h * upp}`)
    el.style.setProperty('--s', upp)
    el.dataset.zoom = upp < 0.045 ? 'near' : upp < 0.1 ? 'mid' : 'far'
  }
  const clamp = () => {
    const v = view.current, [x0, y0, x1, y1] = BOUNDS[layer], { w, h } = size.current
    const maxUpp = Math.max((x1 - x0) / w, (y1 - y0) / h) * 1.15
    v.upp = Math.min(Math.max(v.upp, 0.012), maxUpp)
    v.cx = Math.min(Math.max(v.cx, x0), x1); v.cy = Math.min(Math.max(v.cy, y0), y1)
  }
  const fit = (all) => {
    const [x0, y0, x1, y1] = (all ? BOUNDS : HOME)[layer], { w, h } = size.current
    view.current = { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, upp: Math.max((x1 - x0) / w, (y1 - y0) / h) * 1.02 }
  }

  // fly to a point; zoom is in units per pixel
  const anim = useRef(0)
  const flyTo = (x, y, upp) => {
    const from = { ...view.current }, to = { cx: x, cy: y, upp: upp ?? Math.min(from.upp, 0.07) }
    cancelAnimationFrame(anim.current)
    if (reduce) { view.current = to; clamp(); apply(); return }
    const t0 = performance.now(), dur = 650
    const step = now => {
      const t = Math.min(1, (now - t0) / dur), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      const lz = Math.log(from.upp) + (Math.log(to.upp) - Math.log(from.upp)) * e
      view.current = { cx: from.cx + (to.cx - from.cx) * e, cy: from.cy + (to.cy - from.cy) * e, upp: Math.exp(lz) }
      clamp(); apply()
      if (t < 1) anim.current = requestAnimationFrame(step)
    }
    anim.current = requestAnimationFrame(step)
  }
  if (flyRef) flyRef.current = { flyTo, fit: () => { const [x0, y0, x1, y1] = BOUNDS[layer], { w, h } = size.current; flyTo((x0 + x1) / 2, (y0 + y1) / 2, Math.max((x1 - x0) / w, (y1 - y0) / h) * 1.02) } }

  const ready = useRef(false)
  useEffect(() => {
    const ro = new ResizeObserver(([en]) => {
      if (!en.contentRect.width || !en.contentRect.height) return
      size.current = { w: en.contentRect.width, h: en.contentRect.height }
      if (!ready.current) {
        ready.current = true
        fit()
        if (here && (here.l || 0) === layer) view.current = { cx: here.x, cy: here.y, upp: here.approx ? 0.12 : 0.07 }
      }
      clamp(); apply()
    })
    ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [])
  useEffect(() => { if (ready.current) { fit(); clamp(); apply() } }, [layer])

  // gestures
  useEffect(() => {
    const el = svg.current, pts = new Map()
    let start = null, pinch = null
    const toMap = (px, py) => {
      const r = el.getBoundingClientRect(), { cx, cy, upp } = view.current, { w, h } = size.current
      return { x: cx + (px - r.left - w / 2) * upp, y: cy + (py - r.top - h / 2) * upp }
    }
    const zoomAt = (px, py, factor) => {
      const before = toMap(px, py)
      view.current.upp *= factor; clamp()
      const after = toMap(px, py)
      view.current.cx += before.x - after.x; view.current.cy += before.y - after.y
      clamp(); apply()
    }
    const down = e => {
      cancelAnimationFrame(anim.current)
      el.setPointerCapture?.(e.pointerId)
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY })
      if (pts.size === 1) start = { x: e.clientX, y: e.clientY, t: performance.now(), moved: 0, target: e.target }
      if (pts.size === 2) {
        const [a, b] = [...pts.values()]
        pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), upp: view.current.upp }
        start = null
      }
    }
    const move = e => {
      if (!pts.has(e.pointerId)) return
      const prev = pts.get(e.pointerId), cur = { x: e.clientX, y: e.clientY }
      pts.set(e.pointerId, cur)
      if (pts.size === 1) {
        const dx = cur.x - prev.x, dy = cur.y - prev.y
        if (start) start.moved += Math.abs(dx) + Math.abs(dy)
        view.current.cx -= dx * view.current.upp; view.current.cy -= dy * view.current.upp
        clamp(); apply()
      } else if (pts.size === 2 && pinch) {
        const [a, b] = [...pts.values()]
        const d = Math.hypot(a.x - b.x, a.y - b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
        const target = pinch.upp * (pinch.d / Math.max(d, 1))
        zoomAt(mx, my, target / view.current.upp)
        // pan with the midpoint too
        if (pinch.mx != null) { view.current.cx -= (mx - pinch.mx) * view.current.upp; view.current.cy -= (my - pinch.my) * view.current.upp; clamp(); apply() }
        pinch.mx = mx; pinch.my = my
      }
    }
    let lastTap = 0
    const up = e => {
      pts.delete(e.pointerId)
      if (pts.size < 2) pinch = null
      if (start && pts.size === 0) {
        const quick = performance.now() - start.t < 450 && start.moved < 10
        if (quick) {
          const hit = start.target.closest?.('[data-id]')
          const now = performance.now()
          if (hit) onSelect(hit.dataset.id)
          else if (now - lastTap < 320) zoomAt(e.clientX, e.clientY, 0.5)
          else onSelect(null)
          lastTap = now
        }
        start = null
      }
    }
    const wheel = e => { e.preventDefault(); zoomAt(e.clientX, e.clientY, Math.exp(e.deltaY * 0.0022)) }
    el.addEventListener('pointerdown', down); el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up)
    el.addEventListener('wheel', wheel, { passive: false })
    return () => { el.removeEventListener('pointerdown', down); el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up); el.removeEventListener('wheel', wheel) }
  }, [onSelect])

  const shapes = world.shapes.filter(s => s.l === layer)
  const L = state.layers
  const at = e => ({ transform: `translate(${e.x}px, ${e.y}px) scale(calc(var(--s) * var(--k, 1)))` })
  const isDone = b => (state.done[b.id] ?? b.d) ? 1 : 0
  const isGot = l => state.got[l.id] ? 1 : 0
  const seen = g => (state.visited[g.id] ?? g.v) ? 1 : 0

  const pins = useMemo(() => ({
    graces: graces.filter(g => (g.l || 0) === layer),
    bosses: bosses.filter(b => (b.l || 0) === layer),
    loot: loot.filter(l => (l.l || 0) === layer),
    markers: layer ? [] : markers,
    places: places.filter(p => (p.l || 0) === layer && /legacy|fort|divine|minor_erdtree|church|catacomb|cave|tunnel|gaol|ruins|rise/.test(p.t || '')),
  }), [layer])

  return (
    <div class="map" ref={wrap}>
      <svg ref={svg} class="map-svg" role="application" aria-label="Map of the Lands Between. Drag to move, pinch to zoom, tap a pin for details.">
        <defs>
          <pattern id="waves" width="6" height="3.2" patternUnits="userSpaceOnUse">
            <path d="M0 1.6 q1.5 -1 3 0 t3 0" fill="none" class="wave" />
          </pattern>
          <radialGradient id="treeGlow"><stop offset="0" class="tg0" /><stop offset="1" class="tg1" /></radialGradient>
        </defs>
        <rect x="-50" y="-50" width="400" height="400" class="sea" />
        <rect x="-50" y="-50" width="400" height="400" fill="url(#waves)" class="sea-lines" />
        <path d={world.land[layer ? 'under' : 'surface']} class="land-halo" />
        {shapes.map(s => <path d={s.d} class={`region r-${s.id} tone-${REGIONS[s.id]?.tone}`} />)}
        {!layer && <ErdtreeGlyph />}
        {!layer && LANDMARKS.filter(l => l.id !== 'erdtree').map(l => (
          <g class="landmark" style={at(l)}><path d="M-5 4 V-3 h2 v2 h2 v-3 h2 v3 h2 v-2 h2 V4 Z" /></g>
        ))}
        {shapes.map(s => (
          <g class="rlabel-g" style={at({ x: s.cx, y: s.cy })}><text class="rlabel">{(REGIONS[s.id]?.name || s.id).replace(', Royal Capital', '').replace('of the Giants', '').trim()}</text></g>
        ))}
        {L.places ? pins.places.map(p => (
          <g class="pin place" data-id={p.id} style={at(p)}><rect x="-3.5" y="-3.5" width="7" height="7" rx="1.5" /><circle r="16" class="hit" /><text class="lbl" y="15">{p.n}</text></g>
        )) : null}
        {L.graces ? pins.graces.map(g => (
          <g class={`pin grace ${seen(g) ? 'seen' : 'unseen'} ${selected === g.id ? 'sel' : ''}`} data-id={g.id} style={at(g)}>
            <circle r="6.2" class="g-ring" /><path d="M0 -3.4 L2.8 0 L0 3.4 L-2.8 0 Z" class="g-core" /><circle r="16" class="hit" />
            <text class="lbl" y="17">{g.n}</text>
          </g>
        )) : null}
        {L.loot ? pins.loot.map(l => (
          <g class={`pin loot ${isGot(l) ? 'got' : ''} ${selected === l.id ? 'sel' : ''}`} data-id={l.id} style={at(l)}>
            <path d="M-5.5 -1.5 L-2.8 -5.5 L2.8 -5.5 L5.5 -1.5 L0 6 Z" /><path d="M-5.5 -1.5 H5.5 M-2.8 -5.5 L0 6 L2.8 -5.5" class="facet" /><circle r="15" class="hit" />
            <text class="lbl" y="17">{l.n}</text>
          </g>
        )) : null}
        {L.bosses ? pins.bosses.map(b => (
          <g class={`pin boss ${b.m ? 'main' : 'minor'} ${isDone(b) ? 'done' : ''} ${selected === b.id ? 'sel' : ''}`} data-id={b.id} style={at(b)}>
            <path d="M0 -7.5 L6.5 0 L0 7.5 L-6.5 0 Z" class="b-shape" /><circle r="2.1" class="b-eye" /><circle r="16" class="hit" />
            <text class="lbl" y="18">{b.n}</text>
          </g>
        )) : null}
        {L.markers ? pins.markers.map(m => (
          <g class={`pin marker ${selected === m.id ? 'sel' : ''}`} data-id={m.id} style={at(m)}>
            <circle r="9.5" class="m-disc" /><MarkerGlyph sym={m.sym} /><circle r="17" class="hit" />
            <text class="lbl" y="21">{m.n}</text>
          </g>
        )) : null}
        {here && (here.l || 0) === layer && (
          <g class="here" style={at(here)} aria-label="You are here">
            {here.approx ? <circle r="34" class="here-area" /> : null}
            <circle r="13" class="here-pulse" /><circle r="8.5" class="here-ring" /><circle r="3.6" class="here-dot" />
          </g>
        )}
      </svg>
    </div>
  )
}

function ErdtreeGlyph() {
  return (
    <g class="erdtree" transform="translate(118.5 104)">
      <circle r="12" fill="url(#treeGlow)" />
      <g class="trunk">
        <path d="M0 6 V-6 M0 1 C-2 -1 -4 -2 -6 -5 M0 1 C2 -1 4 -2 6 -5 M0 -2 C-1 -4 -1.6 -6 -2 -8 M0 -2 C1 -4 1.6 -6 2 -8" />
      </g>
    </g>
  )
}

export function MarkerGlyph({ sym }) {
  switch (sym) {
    case 'skull': return <g class="m-glyph"><path d="M-4.2 0.6 a4.2 4.2 0 1 1 8.4 0 v1.6 h-1.6 v2 h-5.2 v-2 h-1.6 z" class="fill" /><circle cx="-1.6" cy="0.2" r="1.1" class="hole" /><circle cx="1.6" cy="0.2" r="1.1" class="hole" /></g>
    case 'flag': return <g class="m-glyph"><path d="M-3 5 V-5" class="line" /><path d="M-3 -5 H4 L1.6 -2.4 L4 0.2 H-3 Z" class="fill" /></g>
    case 'turtle': return <g class="m-glyph"><ellipse rx="4.2" ry="3.2" class="fill" /><circle cx="0" cy="-4.4" r="1.3" class="fill" /><path d="M-4 -2.6 l-1.6 -1.2 M4 -2.6 l1.6 -1.2 M-4 2.6 l-1.6 1.2 M4 2.6 l1.6 1.2" class="line" /></g>
    case 'diamond': return <g class="m-glyph"><path d="M-4.4 -1.2 L-2.2 -4.4 H2.2 L4.4 -1.2 L0 4.8 Z" class="fill" /></g>
    case 'house': return <g class="m-glyph"><path d="M-4.2 4.2 V-0.6 L0 -4.6 L4.2 -0.6 V4.2 Z" class="fill" /><rect x="-1.1" y="1.2" width="2.2" height="3" class="hole" /></g>
    default: return <circle r="2.5" class="m-glyph fill" />
  }
}

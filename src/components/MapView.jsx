// The map. On the surface it shows the real in-game map, stitched from Chase's own Switch captures;
// underground (and wherever the game map hasn't been revealed) it falls back to our drawn schematic.
// Pans and zooms touch only the SVG viewBox, one CSS transform on the picture layer and one CSS
// variable, so it stays smooth on an iPad. Tapping empty map drops a "We're here" pin.
import { useEffect, useMemo, useRef } from 'preact/hooks'
import { world, graces, bosses, loot, markers, places, nearest } from '../lib/world.js'
import { REGIONS, LANDMARKS } from '../content/regions.js'
import REAL from '../data/realmap.json'
import { currentRoute, nextStep, stopOf } from '../lib/plan.js'

const BOUNDS = { 0: [36, 70, 196, 240], 1: [40, 86, 165, 196] }
const HOME = { 0: [40, 100, 192, 238], 1: [44, 90, 160, 192] }   // the parts of the world we know so far
const RQ = 24   // CSS px per world unit inside the picture layer, close to the stitched image's own detail
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const BASE = import.meta.env.BASE_URL + 'realmap/'
export const NEAR_R = 16   // world units counted as "nearby" everywhere in the app

export function MapView({ state, here, selected, onSelect, onTapMap, flyRef }) {
  const wrap = useRef(null), svg = useRef(null), raster = useRef(null)
  const view = useRef({ cx: 110, cy: 160, upp: 0.25 })
  const size = useRef({ w: 800, h: 600 })
  const layer = state.under ? 1 : 0
  const real = !layer && state.layers.real !== 0

  const apply = () => {
    const { cx, cy, upp } = view.current, { w, h } = size.current
    const el = svg.current
    if (!el) return
    const vx = cx - (w * upp) / 2, vy = cy - (h * upp) / 2
    el.setAttribute('viewBox', `${vx} ${vy} ${w * upp} ${h * upp}`)
    el.style.setProperty('--s', upp)
    const z = upp < 0.045 ? 'near' : upp < 0.1 ? 'mid' : 'far'
    el.dataset.zoom = z
    if (wrap.current) wrap.current.dataset.zoom = z
    const r = raster.current
    if (r) r.style.transform = `translate3d(${(REAL.bounds[0] - vx) / upp}px, ${(REAL.bounds[1] - vy) / upp}px, 0) scale(${1 / (upp * RQ)})`
  }
  const clamp = () => {
    const v = view.current, [x0, y0, x1, y1] = BOUNDS[layer], { w, h } = size.current
    const maxUpp = Math.max((x1 - x0) / w, (y1 - y0) / h) * 1.1
    v.upp = Math.min(Math.max(v.upp, 0.012), maxUpp)
    v.cx = Math.min(Math.max(v.cx, x0), x1); v.cy = Math.min(Math.max(v.cy, y0), y1)
  }
  const fit = (all) => {
    const [x0, y0, x1, y1] = (all ? BOUNDS : HOME)[layer], { w, h } = size.current
    view.current = { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, upp: Math.max((x1 - x0) / w, (y1 - y0) / h) * 1.02 }
  }

  // Fly to a point; zoom is in world units per screen pixel.
  const anim = useRef(0)
  const flyTo = (x, y, upp) => {
    const from = { ...view.current }, to = { cx: x, cy: y, upp: upp ?? Math.min(from.upp, 0.07) }
    cancelAnimationFrame(anim.current)
    if (reduce) { view.current = to; clamp(); apply(); return }
    const t0 = performance.now(), dur = 600
    const step = now => {
      const t = Math.min(1, (now - t0) / dur), e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      const lz = Math.log(from.upp) + (Math.log(to.upp) - Math.log(from.upp)) * e
      view.current = { cx: from.cx + (to.cx - from.cx) * e, cy: from.cy + (to.cy - from.cy) * e, upp: Math.exp(lz) }
      clamp(); apply()
      if (t < 1) anim.current = requestAnimationFrame(step)
    }
    anim.current = requestAnimationFrame(step)
  }
  if (flyRef) flyRef.current = {
    flyTo,
    fit: () => { const [x0, y0, x1, y1] = HOME[layer], { w, h } = size.current; flyTo((x0 + x1) / 2, (y0 + y1) / 2, Math.max((x1 - x0) / w, (y1 - y0) / h) * 1.02) },
    zoomBy: f => { const v = view.current; flyTo(v.cx, v.cy, v.upp * f) },
  }

  const ready = useRef(false)
  useEffect(() => {
    const ro = new ResizeObserver(([en]) => {
      if (!en.contentRect.width || !en.contentRect.height) return
      size.current = { w: en.contentRect.width, h: en.contentRect.height }
      if (!ready.current) {
        ready.current = true
        fit()
        if (here && !here.noMap && (here.l || 0) === layer) view.current = { cx: here.x, cy: here.y, upp: here.approx ? 0.12 : 0.06 }
      }
      clamp(); apply()
    })
    ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [])
  useEffect(() => { if (ready.current) { fit(); clamp(); apply() } }, [layer])
  useEffect(() => { apply() }, [real])

  // gestures: drag to pan, pinch or wheel to zoom, tap a pin to open it, tap anywhere else to drop our pin
  const tapRef = useRef(onTapMap); tapRef.current = onTapMap
  useEffect(() => {
    const el = wrap.current, pts = new Map()
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
      if (e.target.closest?.('.map-ui')) return
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
        if (pinch.mx != null) { view.current.cx -= (mx - pinch.mx) * view.current.upp; view.current.cy -= (my - pinch.my) * view.current.upp; clamp(); apply() }
        pinch.mx = mx; pinch.my = my
      }
    }
    const up = e => {
      if (!pts.has(e.pointerId)) return
      pts.delete(e.pointerId)
      if (pts.size < 2) pinch = null
      if (start && pts.size === 0) {
        const quick = performance.now() - start.t < 500 && start.moved < 12
        if (quick && e.type === 'pointerup') {
          const hit = start.target.closest?.('[data-id]')
          if (hit) onSelect(hit.dataset.id)
          else tapRef.current?.(toMap(e.clientX, e.clientY), view.current.upp)
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

  // Everything inside the ring around our spot is what the panel lists.
  const focus = here && !here.noMap && !here.approx && (here.l || 0) === layer ? here : null
  const near = useMemo(() => {
    if (!focus) return null
    const s = new Set()
    for (const list of [graces, bosses, loot, markers, places]) for (const { e } of nearest(list, focus, { max: NEAR_R, limit: 99, layer })) s.add(e.id)
    return s
  }, [focus?.id, layer])
  const nc = id => (near && near.has(id) ? ' near' : '')
  // The plan's stops, numbered in order, so the map and the Plan tab tell the same story.
  const route = currentRoute(state), now = nextStep(state, route)
  const stops = L.plan === 0 ? [] : route.steps.map((st, i) => ({ st, i, e: stopOf(st) })).filter(x => x.e && (x.e.l || 0) === layer)
  const todo = stops.filter(x => !state.steps[x.st.id])
  const unrevealedLabel = s => ['next', 'later'].includes(REGIONS[s.id]?.status)

  return (
    <div class={`map ${real ? 'real' : 'drawn'}`} ref={wrap}>
      {real && (
        <div class="raster" ref={raster} aria-hidden="true">
          <img class="r-lo" src={BASE + REAL.lo} alt="" draggable={false} decoding="async"
            style={{ width: `${(REAL.bounds[2] - REAL.bounds[0]) * RQ}px`, height: `${(REAL.bounds[3] - REAL.bounds[1]) * RQ}px` }} />
          {REAL.tiles.map(t => (
            <img class="r-hi" src={BASE + t.f} alt="" draggable={false} decoding="async"
              style={{ left: `${(t.x - REAL.bounds[0]) * RQ}px`, top: `${(t.y - REAL.bounds[1]) * RQ}px`, width: `${t.w * RQ + 1}px`, height: `${t.h * RQ + 1}px` }} />
          ))}
        </div>
      )}
      <svg ref={svg} class={`map-svg ${focus ? 'focus' : ''}`} role="application" aria-label="Map of the Lands Between. Drag to move, pinch to zoom, tap a pin for details, or tap anywhere to mark where you are.">
        <defs>
          <pattern id="waves" width="6" height="3.2" patternUnits="userSpaceOnUse">
            <path d="M0 1.6 q1.5 -1 3 0 t3 0" fill="none" class="wave" />
          </pattern>
          <radialGradient id="treeGlow"><stop offset="0" class="tg0" /><stop offset="1" class="tg1" /></radialGradient>
          <pattern id="grain" width="2.2" height="2.2" patternUnits="userSpaceOnUse"><circle cx=".55" cy=".55" r=".16" class="grain-dot" /><circle cx="1.65" cy="1.65" r=".12" class="grain-dot" /></pattern>
        </defs>
        {!real && <>
          <rect x="-50" y="-50" width="400" height="400" class="sea" />
          <rect x="-50" y="-50" width="400" height="400" fill="url(#waves)" class="sea-lines" />
          <path d={world.land[layer ? 'under' : 'surface']} class="land-halo" />
          {shapes.map(s => <path d={s.d} class={`region r-${s.id} tone-${REGIONS[s.id]?.tone} st-${(REGIONS[s.id]?.status || '').replace(/ /g, '-')}`} />)}
          {shapes.map(s => <path d={s.d} class="region-grain" />)}
          {!layer && <ErdtreeGlyph />}
          {!layer && LANDMARKS.filter(l => l.id !== 'erdtree').map(l => (
            <g class="landmark" style={at(l)}><path d="M-5 4 V-3 h2 v2 h2 v-3 h2 v3 h2 v-2 h2 V4 Z" /></g>
          ))}
        </>}
        {shapes.filter(s => !real || unrevealedLabel(s)).map(s => (
          <g class="rlabel-g" style={at({ x: s.cx, y: s.cy })}><text class="rlabel">{(REGIONS[s.id]?.name || s.id).replace(', Royal Capital', '').replace('of the Giants', '').trim()}</text></g>
        ))}
        {focus && <circle cx={focus.x} cy={focus.y} r={NEAR_R} class="near-ring" />}
        {L.places ? pins.places.map(p => (
          <g class={`pin place${nc(p.id)}`} data-id={p.id} style={at(p)}><rect x="-3.5" y="-3.5" width="7" height="7" rx="1.5" /><circle r="16" class="hit" /><text class="lbl" y="15">{p.n}</text></g>
        )) : null}
        {L.graces ? pins.graces.map(g => (
          <g class={`pin grace ${seen(g) ? 'seen' : 'unseen'} ${selected === g.id ? 'sel' : ''}${nc(g.id)}`} data-id={g.id} style={at(g)}>
            <circle r="6.2" class="g-ring" /><path d="M0 -3.4 L2.8 0 L0 3.4 L-2.8 0 Z" class="g-core" /><circle r="14" class="hit" />
            <text class="lbl" y="17">{g.n}</text>
          </g>
        )) : null}
        {L.loot ? pins.loot.map(l => (
          <g class={`pin loot ${isGot(l) ? 'got' : ''} ${selected === l.id ? 'sel' : ''}${nc(l.id)}`} data-id={l.id} style={at(l)}>
            <path d="M-5.5 -1.5 L-2.8 -5.5 L2.8 -5.5 L5.5 -1.5 L0 6 Z" /><path d="M-5.5 -1.5 H5.5 M-2.8 -5.5 L0 6 L2.8 -5.5" class="facet" /><circle r="14" class="hit" />
            <text class="lbl" y="17">{l.n}</text>
          </g>
        )) : null}
        {L.bosses ? pins.bosses.map(b => (
          <g class={`pin boss ${b.m ? 'main' : 'minor'} ${isDone(b) ? 'done' : ''} ${selected === b.id ? 'sel' : ''}${nc(b.id)}`} data-id={b.id} style={at(b)}>
            <path d="M0 -7.5 L6.5 0 L0 7.5 L-6.5 0 Z" class="b-shape" /><circle r="2.1" class="b-eye" /><circle r="15" class="hit" />
            <text class="lbl" y="18">{b.n}</text>
          </g>
        )) : null}
        {L.markers ? pins.markers.map(m => (
          <g class={`pin marker ${selected === m.id ? 'sel' : ''}${nc(m.id)}`} data-id={m.id} style={at(m)}>
            <circle r="9.5" class="m-disc" /><MarkerGlyph sym={m.sym} /><circle r="16" class="hit" />
            <text class="lbl" y="21">{m.n}</text>
          </g>
        )) : null}
        {todo.length > 1 && <path d={'M' + todo.map(x => `${x.e.x} ${x.e.y}`).join(' L')} class="plan-line" />}
        {stops.map(({ st, i, e }) => (
          <g class={`pin plan-stop ${state.steps[st.id] ? 'done' : ''} ${st === now ? 'now' : ''}`} data-id={e.id} style={at(e)}>
            {st === now && <circle r="13" class="ps-pulse" />}
            <circle r="11.5" class="ps-disc" /><text class="ps-num" y="4.2">{i + 1}</text><circle r="17" class="hit" />
            <text class="lbl" y="26">{st.t.replace(/^Optional: /, '')}</text>
          </g>
        ))}
        {here && !here.noMap && (here.l || 0) === layer && (
          <g class={`here ${here.pin ? 'is-pin' : ''}`} style={at(here)} aria-label="We are here">
            {here.approx ? <circle r="34" class="here-area" /> : null}
            <circle r="15" class="here-pulse" />
            <path d="M0 0 C-3 -6 -9 -10 -9 -17 A9 9 0 1 1 9 -17 C9 -10 3 -6 0 0 Z" class="here-pin" />
            <circle cy="-17" r="3.6" class="here-dot" />
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

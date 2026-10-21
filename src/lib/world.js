// World data plus the questions the app keeps asking of it: where is this, what's near, which way is that.
import W from '../data/world.json'
import { REGIONS, LANDMARKS } from '../content/regions.js'

export const world = W
export const graces = W.graces
export const bosses = W.bosses
export const loot = W.loot
export const places = W.places
export const markers = W.markers
export const byId = new Map()
for (const list of [W.graces, W.bosses, W.loot, W.places, W.markers]) for (const e of list) byId.set(e.id, e)

export const regionShape = Object.fromEntries(W.shapes.map(s => [s.id, s]))

export function kindOf(e) {
  if (!e) return null
  if (e.id.startsWith('b-')) return 'boss'
  if (e.id.startsWith('l-')) return 'loot'
  if (e.id.startsWith('p-')) return 'place'
  if (e.id.startsWith('mk-')) return 'marker'
  return 'grace'
}

// Resolve the current location to a point with a region. It can be a grace id, 'region:<id>',
// or 'pt:<x>,<y>,<layer>' for a pin Truc dropped on the map.
const pinCache = new Map()
export function resolveHere(here) {
  if (!here) return null
  if (here.startsWith('pt:')) {
    if (pinCache.has(here)) return pinCache.get(here)
    const [x, y, l = 0] = here.slice(3).split(',').map(Number)
    const p = { x, y, l }
    const g = nearest(W.graces, p, { max: 80, limit: 1 })[0]?.e
    const d = g ? dist(g, p) : 0
    const n = !g ? 'Our pin' : d < 3 ? `By ${g.n}` : d < 9 ? `Near ${g.n}` : `${cap(bearing(g, p).word)} of ${g.n}`
    const out = { id: here, n, x, y, l, r: g?.r, s: g?.s, pin: true, grace: g, graceDist: d }
    pinCache.set(here, out)
    return out
  }
  if (here.startsWith('region:')) {
    const r = here.slice(7), s = regionShape[r]
    if (r === 'roundtable') return { id: here, n: 'Roundtable Hold', r, noMap: true, x: 0, y: 0, l: 9 }
    return s ? { id: here, n: REGIONS[r]?.name || r, x: s.cx, y: s.cy, r, l: s.l, approx: true } : null
  }
  return byId.get(here) || null
}

export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y)

const DIRS = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west']
export function bearing(from, to) {
  const dx = to.x - from.x, dy = from.y - to.y   // map y grows southward
  const deg = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360
  return { deg, word: DIRS[Math.round(deg / 45) % 8] }
}
export function howFar(d) {
  if (d < 3) return 'right here'
  if (d < 8) return 'close by'
  if (d < 18) return 'a short ride'
  if (d < 40) return 'a long ride'
  return 'far away'
}

export function nearest(list, p, { max = 20, layer, limit = 6, filter } = {}) {
  const lay = layer ?? p.l ?? 0
  return list
    .filter(e => (e.l || 0) === lay && (!filter || filter(e)))
    .map(e => ({ e, d: dist(e, p) }))
    .filter(x => x.d <= max)
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
}

export function landmarksFrom(p) {
  if (!p || p.l) return []
  return LANDMARKS.map(l => ({ ...l, d: dist(l, p), b: bearing(p, l) }))
    .filter(l => l.d > 4)
    .sort((a, b) => (a.id === 'erdtree' ? -1 : b.id === 'erdtree' ? 1 : a.d - b.d))
    .slice(0, 3)
}

// Find a named stop for the plan (grace first, then places, bosses, loot).
export function findByName(name) {
  if (!name) return null
  const n = name.toLowerCase()
  for (const list of [W.graces, W.places, W.bosses, W.loot]) {
    const e = list.find(x => x.n.toLowerCase() === n) || list.find(x => x.n.toLowerCase().startsWith(n))
    if (e) return e
  }
  return null
}

const cap = s => s[0].toUpperCase() + s.slice(1)

// Places worth naming around a spot: dungeons, evergaols, churches, forts, towers.
export const DUNGEON_RE = /catacomb|cave|tunnel|gaol|hero|legacy|fort|divine|church|rise|ruins|minor_erdtree/

// Turn the level range written for a region into a plain verdict for Teremity.
export function levelVerdict(range, lvl = 103) {
  const m = /(\d+)\D+(\d+)/.exec(range || '')
  if (!m) return null
  const lo = +m[1], hi = +m[2]
  if (lvl >= hi + 15) return { k: 'easy', short: 'Easy for Teremity', t: `Enemies here suit levels ${lo} to ${hi}. At ${lvl}, Teremity outclasses this area.` }
  if (lvl >= hi) return { k: 'fair', short: 'Comfortable for Teremity', t: `Enemies here suit levels ${lo} to ${hi}. At ${lvl}, Teremity is comfortably ready.` }
  if (lvl >= lo) return { k: 'fair', short: 'A fair fight', t: `Enemies here suit levels ${lo} to ${hi}. At ${lvl}, this is a fair fight.` }
  return { k: 'hard', short: 'Tough for Teremity', t: `Enemies here suit levels ${lo} to ${hi}. At ${lvl}, expect it to hurt. Go carefully.` }
}

export function regionName(r) { return REGIONS[r]?.name || r }
export function subName(e) { return e?.s || null }

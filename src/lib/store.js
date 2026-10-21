// A tiny persistent store. Everything Truc changes lives on this device only.
import { useEffect, useState } from 'preact/hooks'

const KEY = 'teremity.v1'
const DEFAULTS = {
  here: null,          // grace id, or 'region:<id>' when only the region is known
  trail: [],           // [{ id, at }]
  done: {},            // boss id -> 1 (or 0 to override a preset)
  got: {},             // loot id -> 1
  visited: {},         // grace id -> 1 / 0 overrides
  steps: {},           // plan step id -> 1
  route: 'caria',
  theme: 'auto',
  layers: { real: 1, plan: 1, graces: 1, bosses: 0, loot: 0, markers: 1, places: 0 },
  v: 2,                // layout version, for one-time changes to saved settings
  under: 0,            // 1 = show the underground map
  tab: 'plan',
  spoilers: 0,         // 1 = show spoilers without tapping
  asked: [],           // recent Ask Claude questions
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULTS }
    const s = JSON.parse(raw)
    const out = { ...DEFAULTS, ...s, layers: { ...DEFAULTS.layers, ...(s.layers || {}) } }
    // Version 2 (Oct 21): a calmer start. Open on the Plan, hide boss and loot pins until asked for.
    if (!s.v || s.v < 2) out.layers = { ...out.layers, bosses: 0, loot: 0, plan: 1 }, out.tab = 'plan', out.v = 2
    return out
  } catch { return { ...DEFAULTS } }
}

let state = load()
const subs = new Set()

export function getState() { return state }

export function setState(patch) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  subs.forEach(f => f(state))
}

export function useStore() {
  const [, force] = useState(0)
  useEffect(() => {
    const f = () => force(n => n + 1)
    subs.add(f)
    return () => subs.delete(f)
  }, [])
  return state
}

export function toggle(map, id, preset = 0) {
  setState(s => {
    const cur = s[map][id] ?? preset
    return { [map]: { ...s[map], [id]: cur ? 0 : 1 } }
  })
}

// Set where we are. Returns a function that undoes it.
export function goHere(id, stay = false) {
  const before = { here: state.here, trail: state.trail, visited: state.visited, tab: state.tab }
  setState(s => {
    const trail = [{ id, at: Date.now() }, ...s.trail.filter(t => t.id !== id)].slice(0, 16)
    const isPlace = id && !id.startsWith('region:') && !id.startsWith('pt:')
    const visited = isPlace ? { ...s.visited, [id]: 1 } : s.visited
    return { here: id, trail, visited, tab: stay ? s.tab : 'here', pinned: id?.startsWith('pt:') ? 1 : s.pinned }
  })
  return () => setState(before)
}

export function exportState() { return JSON.stringify(state) }
export function importState(text) {
  const s = JSON.parse(text)
  setState({ ...DEFAULTS, ...s })
}
export function resetState() { setState({ ...DEFAULTS }) }

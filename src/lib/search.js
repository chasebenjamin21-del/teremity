// Forgiving search for "Where are we?": prefix, substring and one-typo matches on grace names.
import { graces, places, bosses } from './world.js'
import { REGIONS } from '../content/regions.js'

const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’`]/g, '').replace(/[^a-z0-9]+/g, ' ').trim()

function lev1(a, b) { // true if edit distance <= 1
  if (Math.abs(a.length - b.length) > 1) return false
  let i = 0, j = 0, edits = 0
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue }
    if (++edits > 1) return false
    if (a.length > b.length) i++
    else if (a.length < b.length) j++
    else { i++; j++ }
  }
  return edits + (a.length - i) + (b.length - j) <= 1
}

const index = [
  ...graces.map(e => ({ e, kind: 'grace', key: norm(e.n), words: norm(e.n).split(' ') })),
  ...places.filter(p => /legacy|fort|divine|church|ruins|rise|surface/.test(p.t || '') || /Castle|Manor|Academy|Village/.test(p.n))
    .map(e => ({ e, kind: 'place', key: norm(e.n), words: norm(e.n).split(' ') })),
  ...bosses.filter(b => b.m || b.t !== 'field').map(e => ({ e, kind: 'boss', key: norm(e.n), words: norm(e.n).split(' ') })),
]

export function searchPlaces(q, { limit = 12 } = {}) {
  const nq = norm(q)
  if (!nq) return []
  const qw = nq.split(' ')
  const out = []
  for (const it of index) {
    let score = 0
    if (it.key === nq) score = 100
    else if (it.key.startsWith(nq)) score = 80
    else if (it.key.includes(nq)) score = 60
    else {
      // every query word must match some word by prefix or a one-letter typo
      let ok = true, s = 0
      for (const w of qw) {
        const hit = it.words.find(x => x.startsWith(w)) ? 2 : it.words.find(x => w.length >= 4 && lev1(w, x.slice(0, w.length + 1)) || (w.length >= 4 && lev1(w, x))) ? 1 : 0
        if (!hit) { ok = false; break }
        s += hit
      }
      if (ok) score = 20 + s * 5
    }
    if (!score) continue
    if (it.kind === 'grace') score += 6
    if (it.e.v) score += 4          // places you have been float up
    out.push({ ...it, score })
  }
  const seenNames = new Set()
  return out.sort((a, b) => b.score - a.score || (a.kind === 'grace' ? -1 : 1) || a.e.n.length - b.e.n.length)
    .filter(r => { const k = r.e.n.toLowerCase(); if (seenNames.has(k)) return false; seenNames.add(k); return true })
    .slice(0, limit)
}

export function regionLabel(r) { return REGIONS[r]?.name || r }

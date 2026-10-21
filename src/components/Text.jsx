// Text that explains itself: any glossary word becomes tappable, and opens a one-sentence card.
import { useEffect, useState } from 'preact/hooks'
import { GLOSSARY } from '../content/glossary.js'
import { setState, getState } from '../lib/store.js'

const entries = []
for (const g of GLOSSARY) for (const w of [g.t, ...(g.also || [])]) entries.push([w, g])
entries.sort((a, b) => b[0].length - a[0].length)
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const RX = new RegExp(`(?<![\\w'])(${entries.map(e => esc(e[0])).join('|')})(?![\\w'])`, 'gi')
const lookup = new Map(entries.map(([w, g]) => [w.toLowerCase(), g]))

let openTerm = null
const listeners = new Set()
export function showTerm(g) { openTerm = g; listeners.forEach(f => f(g)) }
export function useOpenTerm() {
  const [t, setT] = useState(openTerm)
  useEffect(() => { listeners.add(setT); return () => listeners.delete(setT) }, [])
  return [t, () => showTerm(null)]
}
export function glossaryEntry(word) { return lookup.get(word.toLowerCase()) }

// Wrap glossary words in a string. Each term links once per block, so text stays calm.
export function T({ children, skip }) {
  const text = Array.isArray(children) ? children.join('') : String(children ?? '')
  const used = new Set(skip ? [skip.toLowerCase()] : [])
  const parts = []
  let last = 0
  text.replace(RX, (m, _w, off) => {
    const g = lookup.get(m.toLowerCase())
    if (!g || used.has(g.t.toLowerCase())) return m
    used.add(g.t.toLowerCase())
    if (off > last) parts.push(text.slice(last, off))
    parts.push(<button class="term" type="button" onClick={e => { e.stopPropagation(); showTerm(g) }}>{m}</button>)
    last = off + m.length
    return m
  })
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}

export function Spoiler({ children, label = 'Story spoiler' }) {
  const [open, setOpen] = useState(!!getState().spoilers)
  return open
    ? <span class="spoiler open">{children}</span>
    : <button type="button" class="spoiler" onClick={() => setOpen(true)} aria-label={`${label}, tap to reveal`}><span class="spoiler-label">{label} · tap to reveal</span><span class="spoiler-text" aria-hidden="true">{children}</span></button>
}

// Hand a question to Claude with our context already written in.
export function askClaude(question, ctx = {}) {
  const s = getState()
  const where = ctx.where ? ` We're at ${ctx.where}.` : ''
  const prompt = `We're playing Elden Ring (Tarnished Edition on Switch 2). Our character, Teremity, is level 103 and uses the Godslayer's Greatsword +5, the Clawmark Seal and some sorceries. We've beaten Margit, Godrick and Rennala, and we haven't fought Radahn or ridden the Grand Lift of Dectus yet.${where} Please answer simply and avoid big story spoilers unless I ask.\n\nMy question: ${question}`
  setState({ asked: [question, ...s.asked.filter(q => q !== question)].slice(0, 10) })
  try { navigator.clipboard?.writeText(prompt) } catch {}
  const url = 'https://claude.ai/new?q=' + encodeURIComponent(prompt)
  window.open(url, '_blank', 'noopener')
}

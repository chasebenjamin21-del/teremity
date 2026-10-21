// "Where are we?" — the heart of the app. Type a few letters of what's on the TV, or pick what you see.
import { useEffect, useRef, useState } from 'preact/hooks'
import { searchPlaces } from '../lib/search.js'
import { graces, byId, regionName } from '../lib/world.js'
import { REGIONS } from '../content/regions.js'
import { goHere, getState } from '../lib/store.js'
import { Icon } from './ui.jsx'

const SIGHTS = ['limgrave', 'weeping', 'liurnia', 'caelid', 'altus', 'gelmir', 'leyndell', 'siofra', 'ainsel', 'roundtable']

export function WhereSheet({ onClose, onPicked }) {
  const [q, setQ] = useState('')
  const [region, setRegion] = useState(null)
  const input = useRef(null)
  useEffect(() => { setTimeout(() => input.current?.focus(), 60) }, [])
  useEffect(() => {
    const k = e => { if (e.key === 'Escape') onClose() }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [])
  const s = getState()
  const results = q.trim() ? searchPlaces(q) : []
  const pick = id => { goHere(id); onPicked(id) }
  const seen = g => (s.visited[g.id] ?? g.v)

  return (
    <div class="sheet-back" onClick={onClose}>
      <div class="sheet where" role="dialog" aria-modal="true" aria-labelledby="where-title" onClick={e => e.stopPropagation()}>
        <div class="sheet-head">
          <h2 id="where-title">Where are we?</h2>
          <button class="iconbtn" type="button" aria-label="Close" onClick={onClose}><Icon name="close" /></button>
        </div>
        <label class="where-input">
          <Icon name="search" />
          <input ref={input} type="search" value={q} onInput={e => { setQ(e.currentTarget.value); setRegion(null) }}
            placeholder="Type the place name from the screen" autocomplete="off" autocapitalize="off" spellcheck={false} enterkeyhint="go"
            onKeyDown={e => { if (e.key === 'Enter' && results[0]) pick(results[0].e.id) }} />
        </label>
        <p class="hint">Rest at a grace or open the map and the name shows on screen. A few letters is enough, and small typos are fine.</p>

        {q.trim() ? (
          <ul class="results" role="listbox" aria-label="Matching places">
            {results.length === 0 && <li class="empty">Nothing matches "{q}". Try the first word only, or pick what you see below.</li>}
            {results.map(({ e, kind }) => (
              <li><button type="button" class="result" onClick={() => pick(e.id)}>
                <span class="r-name">{e.n}</span>
                <span class="r-meta">{kind === 'boss' ? 'Boss · ' : kind === 'place' ? 'Place · ' : ''}{regionName(e.r)}{e.s ? ` · ${e.s}` : ''}</span>
                {kind === 'grace' && seen(e) ? <span class="badge">Been here</span> : null}
              </button></li>
            ))}
          </ul>
        ) : region ? (
          <RegionPicker r={region} seen={seen} onPick={pick} onBack={() => setRegion(null)} />
        ) : (
          <>
            {s.trail.length > 0 && (
              <section>
                <h3 class="eyebrowless">Recently</h3>
                <div class="trail">
                  {s.trail.slice(0, 6).map(t => {
                    const e = t.id.startsWith('region:') ? { n: regionName(t.id.slice(7)) } : byId.get(t.id)
                    return e ? <button type="button" class="pill" onClick={() => pick(t.id)}>{e.n}</button> : null
                  })}
                </div>
              </section>
            )}
            <section>
              <h3 class="eyebrowless">No name on screen? Pick what you see</h3>
              <div class="sights">
                {SIGHTS.map(r => (
                  <button type="button" class={`sight tone-${REGIONS[r].tone}`} onClick={() => setRegion(r)}>
                    <span class="sight-swatch" aria-hidden="true" />
                    <span class="sight-text"><b>{REGIONS[r].looks}</b><span>{REGIONS[r].name}</span></span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

function RegionPicker({ r, seen, onPick, onBack }) {
  const list = graces.filter(g => g.r === r).sort((a, b) => (seen(b) ? 1 : 0) - (seen(a) ? 1 : 0) || a.n.localeCompare(b.n))
  const subs = [...new Set(list.map(g => g.s || ''))]
  return (
    <section class="region-pick">
      <button type="button" class="link back" onClick={onBack}><Icon name="back" /> All regions</button>
      <h3>{REGIONS[r].name}</h3>
      <p class="muted">{REGIONS[r].blurb}</p>
      <button type="button" class="btn primary wide" onClick={() => onPick('region:' + r)}>{r === 'roundtable' ? "We're at the Roundtable Hold" : `We're somewhere in ${REGIONS[r].name}`}</button>
      {subs.map(sub => (
        <div>
          {subs.length > 1 && <h4>{sub || REGIONS[r].name}</h4>}
          <div class="grace-grid">
            {list.filter(g => (g.s || '') === sub).map(g => (
              <button type="button" class={`gchip ${seen(g) ? 'seen' : ''}`} onClick={() => onPick(g.id)}>{g.n}</button>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}

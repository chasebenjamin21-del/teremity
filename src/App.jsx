import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import { useStore, setState, getState, goHere, exportState, importState, resetState } from './lib/store.js'
import { resolveHere, byId, regionName, nearest, graces } from './lib/world.js'
import { MapView } from './components/MapView.jsx'
import { WhereSheet } from './components/WhereSheet.jsx'
import { HereTab, PlanTab, BossesTab, LootTab, BuildTab, LearnTab, Detail, setViewer } from './components/Panels.jsx'
import { useOpenTerm, T, askClaude } from './components/Text.jsx'
import { Icon } from './components/ui.jsx'
import { updater } from './lib/updater.js'

const TABS = [['here', 'Here'], ['plan', 'Plan'], ['bosses', 'Bosses'], ['loot', 'Loot'], ['build', 'Teremity'], ['learn', 'Learn']]
const LAYERS = [['real', 'Real game map'], ['markers', 'Your markers'], ['graces', 'Graces'], ['bosses', 'Bosses'], ['loot', 'Loot'], ['places', 'Places']]

export function App() {
  const state = useStore()
  const here = resolveHere(state.here)
  const [where, setWhere] = useState(false)
  const [settings, setSettings] = useState(false)
  const [layersOpen, setLayersOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const fly = useRef(null)
  const [term, closeTerm] = useOpenTerm()
  const [viewer, setV] = useState(null)
  const [updateReady, setUpdateReady] = useState(updater.ready)
  const [toast, setToast] = useState(null)
  const scroller = useRef(null)
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 8000); return () => clearTimeout(t) }, [toast])
  useEffect(() => { if (scroller.current) scroller.current.scrollTop = 0 }, [state.here])
  useEffect(() => { updater.listeners.add(setUpdateReady); return () => updater.listeners.delete(setUpdateReady) }, [])
  useEffect(() => { setViewer(setV) }, [])

  useEffect(() => {
    const root = document.documentElement
    if (state.theme === 'auto') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', state.theme)
  }, [state.theme])

  const flyToId = useCallback(id => {
    const e = byId.get(id)
    if (!e) return
    if ((e.l || 0) !== state.under) setState({ under: e.l || 0 })
    setSelected(id)
    setTimeout(() => fly.current?.flyTo(e.x, e.y, 0.055), (e.l || 0) !== state.under ? 60 : 0)
  }, [state.under])

  const onPicked = id => {
    setWhere(false); setSelected(null)
    const p = resolveHere(id)
    if (p && !p.noMap) {
      if ((p.l || 0) !== state.under) setState({ under: p.l || 0 })
      setTimeout(() => fly.current?.flyTo(p.x, p.y, p.approx ? 0.14 : 0.07), 80)
    }
  }
  const onSelect = useCallback(id => setSelected(id), [])
  // Tap anywhere on the map: that's where we are. A tap on (or right by) a grace snaps to the grace.
  const onTapMap = useCallback((p, upp) => {
    const layer = getState().under ? 1 : 0
    const snap = nearest(graces, { ...p, l: layer }, { max: Math.max(0.9, 20 * upp), limit: 1, layer })[0]
    const id = snap ? snap.e.id : `pt:${p.x.toFixed(2)},${p.y.toFixed(2)},${layer}`
    setSelected(null)
    const undo = goHere(id)
    if (!getState().pinned) setState({ pinned: 1 })
    setToast({ n: resolveHere(id)?.n, undo })
  }, [])

  const tab = state.tab
  const Tab = { here: HereTab, plan: PlanTab, bosses: BossesTab, loot: LootTab, build: BuildTab, learn: LearnTab }[tab] || HereTab

  return (
    <div class={`app ${selected ? 'has-detail' : ''}`}>
      <header class="topbar">
        <div class="brand" aria-label="Teremity">
          <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" width="34" height="34" />
          <span class="brand-name">Teremity</span>
        </div>
        <button type="button" class="where-pill" onClick={() => setWhere(true)} aria-label={here ? `Where are we? Currently ${here.n}` : 'Where are we?'}>
          <span class="wp-q">Where are we?</span>
          <span class="wp-a">{here ? <>{here.n}{!here.approx && !here.noMap ? <span class="wp-r"> · {regionName(here.r)}</span> : null}</> : 'Tap to set'}</span>
        </button>
        <button type="button" class="iconbtn" aria-label="Settings" onClick={() => setSettings(true)}><Icon name="gear" /></button>
      </header>

      <main class="stage">
        <div class="map-pane">
          <MapView state={state} here={here} selected={selected} onSelect={onSelect} onTapMap={onTapMap} flyRef={fly} />
          <div class="map-tools">
            <div class="seg small" role="group" aria-label="Map level">
              <button type="button" aria-pressed={!state.under ? 'true' : 'false'} onClick={() => setState({ under: 0 })}>Surface</button>
              <button type="button" aria-pressed={state.under ? 'true' : 'false'} onClick={() => setState({ under: 1 })}>Underground</button>
            </div>
            <button type="button" class="iconbtn float" aria-label="Map layers" aria-expanded={layersOpen ? 'true' : 'false'} onClick={() => setLayersOpen(!layersOpen)}><Icon name="layers" /></button>
            {here && !here.noMap && <button type="button" class="iconbtn float" aria-label="Center on where we are" onClick={() => { if ((here.l || 0) !== state.under) setState({ under: here.l || 0 }); setTimeout(() => fly.current?.flyTo(here.x, here.y, here.approx ? 0.14 : 0.07), 40) }}><Icon name="target" /></button>}
            <button type="button" class="iconbtn float" aria-label="Show the whole map" onClick={() => fly.current?.fit()}><Icon name="expand" /></button>
          </div>
          {layersOpen && (
            <div class="layers-pop" role="group" aria-label="Show on map">
              {LAYERS.map(([k, n]) => (
                <label class={`layer l-${k}`}><input type="checkbox" checked={!!state.layers[k]} onChange={() => setState(s => ({ layers: { ...s.layers, [k]: s.layers[k] ? 0 : 1 } }))} /><span class="swatch" aria-hidden="true" />{n}</label>
              ))}
            </div>
          )}
          <div class="zoom-tools map-ui">
            <button type="button" class="iconbtn float" aria-label="Zoom in" onClick={() => fly.current?.zoomBy(0.5)}><Icon name="plus" /></button>
            <button type="button" class="iconbtn float" aria-label="Zoom out" onClick={() => fly.current?.zoomBy(2)}><Icon name="minus" /></button>
          </div>
          {toast ? (
            <div class="map-toast map-ui" role="status">
              <span><b>We're here:</b> {toast.n}</span>
              <button type="button" class="btn small" onClick={() => { toast.undo(); setToast(null) }}>Undo</button>
            </div>
          ) : !state.pinned ? (
            <p class="map-hint map-ui" role="note">Tap the map where you are to drop a pin.</p>
          ) : null}
          {(state.under || state.layers.real === 0) ? <p class="map-credit">Drawn map. Pinch to zoom.</p> : null}
        </div>

        <section class="panel" aria-label="Guide">
          {selected && <Detail id={selected} state={state} here={here} onClose={() => setSelected(null)} onFly={flyToId} />}
          <nav class="tabs" role="tablist" aria-label="Sections">
            {TABS.map(([id, label]) => (
              <button type="button" role="tab" aria-selected={tab === id ? 'true' : 'false'} class={tab === id ? 'on' : ''} onClick={() => { setState({ tab: id }); setSelected(null) }}>{label}</button>
            ))}
          </nav>
          <div class="panel-scroll" ref={scroller}>
            <Tab state={state} here={here} onWhere={() => setWhere(true)} onFly={flyToId} />
          </div>
        </section>
      </main>

      {where && <WhereSheet onClose={() => setWhere(false)} onPicked={onPicked} />}
      {term && (
        <div class="term-pop" role="dialog" aria-label={term.t}>
          <div class="term-card">
            <div class="term-head"><h3>{term.t}</h3><button type="button" class="iconbtn" aria-label="Close" onClick={closeTerm}><Icon name="close" /></button></div>
            <p><T skip={term.t}>{term.d}</T></p>
            {term.more && <p class="muted"><T skip={term.t}>{term.more}</T></p>}
            <button type="button" class="link" onClick={() => { askClaude(`Explain "${term.t}" in Elden Ring in simple terms, with an example.`, { where: here?.n }); closeTerm() }}>Ask Claude for more</button>
          </div>
        </div>
      )}
      {settings && <Settings state={state} onClose={() => setSettings(false)} />}
      {updateReady && (
        <div class="update-bar" role="status">
          <span>A newer version of Teremity is ready.</span>
          <button type="button" class="btn small primary" onClick={() => updater.update(true)}>Refresh now</button>
          <button type="button" class="btn small" onClick={() => setUpdateReady(false)}>Later</button>
        </div>
      )}
      {viewer && (
        <div class="viewer" role="dialog" aria-modal="true" aria-label={viewer.cap} onClick={() => setV(null)}>
          <img src={viewer.src} alt={viewer.cap} />
          <p>{viewer.cap} · tap anywhere to close</p>
        </div>
      )}
    </div>
  )
}

function Settings({ state, onClose }) {
  const [msg, setMsg] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [text, setText] = useState('')
  return (
    <div class="sheet-back" onClick={onClose}>
      <div class="sheet" role="dialog" aria-modal="true" aria-labelledby="set-title" onClick={e => e.stopPropagation()}>
        <div class="sheet-head"><h2 id="set-title">Settings</h2><button class="iconbtn" type="button" aria-label="Close" onClick={onClose}><Icon name="close" /></button></div>
        <h3>Look</h3>
        <div class="seg" role="group" aria-label="Theme">
          {[['auto', 'Match the iPad'], ['dark', 'Night'], ['light', 'Day']].map(([k, n]) => <button type="button" aria-pressed={state.theme === k ? 'true' : 'false'} onClick={() => setState({ theme: k })}>{n}</button>)}
        </div>
        <h3>Spoilers</h3>
        <label class="inline-check"><input type="checkbox" checked={!!state.spoilers} onChange={() => setState({ spoilers: state.spoilers ? 0 : 1 })} /> Show story spoilers without tapping</label>
        <h3>Progress</h3>
        <p class="muted">Ticks, the trail and where you are live on this device only.</p>
        <div class="row-actions">
          <button type="button" class="btn" onClick={async () => { try { await navigator.clipboard.writeText(exportState()); setMsg('Copied. Paste it into Notes to keep a backup.') } catch { setText(exportState()); setMsg('Copy the text below to keep a backup.') } }}>Copy a backup</button>
          {!confirm ? <button type="button" class="btn danger" onClick={() => setConfirm(true)}>Start over</button>
            : <button type="button" class="btn danger" onClick={() => { resetState(); setConfirm(false); setMsg('Progress cleared.') }}>Yes, clear everything</button>}
        </div>
        <textarea class="backup" rows="3" value={text} onInput={e => setText(e.currentTarget.value)} placeholder="Paste a backup here to restore it" aria-label="Backup text" />
        <button type="button" class="btn" disabled={!text.trim()} onClick={() => { try { importState(text); setMsg('Restored.') } catch { setMsg("That doesn't look like a Teremity backup.") } }}>Restore backup</button>
        {msg && <p class="note" role="status">{msg}</p>}
        <h3>About</h3>
        <p class="muted small">Made for Chase and Truc's Elden Ring run. The surface map is stitched from Chase's own Switch captures of the game's map. Pin coordinates come from the open GraceMap project (GPL-3.0). The underground drawing and all the writing are our own. Facts were checked against the community wiki, and the guide links out for anything deeper.</p>
      </div>
    </div>
  )
}

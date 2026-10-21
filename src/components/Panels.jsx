// The side panel: Here, Plan, Bosses, Loot, Teremity and Learn, plus the detail card for whatever is tapped.
import { useMemo, useState } from 'preact/hooks'
import { byId, kindOf, nearest, bosses, loot, markers, graces, places, landmarksFrom, bearing, dist, howFar, regionName, findByName, resolveHere, levelVerdict, DUNGEON_RE } from '../lib/world.js'
import { REGIONS, REGION_ORDER } from '../content/regions.js'
import { tipsFor } from '../content/bosses.js'
import { GLOSSARY, GLOSSARY_GROUPS } from '../content/glossary.js'
import { TEREMITY, BUILD_ADVICE, TALISMAN_SETS, PREP, ROUTES, SECRETS, VIDEO_TIPS, GRIND } from '../content/guide.js'
import { setState, toggle, goHere } from '../lib/store.js'
import { T, Spoiler, askClaude, showTerm } from './Text.jsx'
import { Check, Dir, Icon } from './ui.jsx'
import { MarkerGlyph } from './MapView.jsx'
import { useShots, addShots, removeShot } from '../lib/shots.js'

export const LOOT_CATS = [
  ['seed', 'Golden Seeds', 'Each flask upgrade adds a charge, and the seed cost rises as you go. The next one needs 3, and you hold 2.'],
  ['tear', 'Sacred Tears', 'Every flask charge heals more.'],
  ['larval', 'Larval Tears', 'Each one lets Rennala reset your stats once.'],
  ['memory', 'Memory Stones', 'One more spell slot.'],
  ['pouch', 'Talisman Pouches', 'One more talisman slot.'],
  ['somber', 'Somber Smithing Stones', "Upgrades for the Godslayer's Greatsword. It needs [6] next."],
  ['bell', 'Bell Bearings', 'Give them to the Twin Maiden Husks to unlock new items in their shop, like smithing stones.'],
  ['crystal', 'Crystal Tears', 'New effects for the Physick flask.'],
  ['deathroot', 'Deathroot', 'Trade to Gurranq in the Bestial Sanctum for rewards.'],
  ['pick', 'Build picks', 'Gear that suits Teremity.'],
]
const PICK_NOTES = {
  'Golden Vow': 'More attack and defense for you and your summons. A top Faith buff.',
  'Flame, Grant Me Strength': 'A big physical and fire damage buff. Perfect with the Godslayer.',
  'Black Flame': 'A strong fire incantation from the Godskin Prayerbook.',
  'Lightning Spear': 'A reliable ranged incantation.',
  'Erdtree Heal': 'A big heal for you and allies.',
  "Blessing's Boon": 'Slow healing over time.',
  'Flame of the Fell God': 'A huge fire explosion incantation.',
  "Godslayer's Seal": 'Boosts Godskin black flame incantations.',
  'Erdtree Seal': 'The best seal for high Faith.',
  Moonveil: 'A famous katana with a magic slash skill.',
  'Blasphemous Blade': 'A fire greatsword that heals you when enemies die near you; its skill heals as it hits.',
  "Erdtree's Favor": 'More health, stamina and equip load.',
  'Green Turtle Talisman': 'Faster stamina recovery.',
  'Dragoncrest Shield Talisman': 'Less physical damage taken.',
  'Godfrey Icon': 'Stronger charged spells and skills.',
  'Ritual Sword Talisman': 'More damage while at full health.',
  'Two Fingers Heirloom': '+5 Faith.',
  "Bull-Goat's Talisman": 'More poise, so you get knocked around less.',
  'Arsenal Charm': 'More equip load.',
  'Shard of Alexander': 'Much stronger weapon skills.',
  "Assassin's Crimson Dagger": 'Heals you on critical hits.',
  'Crimson Seed Talisman': 'Red flasks heal more.',
  'Cerulean Seed Talisman': 'Blue flasks restore more FP.',
  'Fire Scorpion Charm': 'More fire damage.',
  "Flock's Canvas Talisman": 'Stronger incantations.',
  "Faithful's Canvas Talisman": 'Stronger incantations.',
  'Incantation Scarab': 'A head piece: incantations cost a little less FP, but you take a bit more damage.',
  "Bloodhound's Fang": 'A bleed curved greatsword.',
}
const catOf = l => (l.c.startsWith('pick') ? 'pick' : l.c)
const clean = n => n.replace(/\s*\(.*?\)\s*/g, ' ').replace(/ - .*$/, '').replace(/\s+/g, ' ').trim()
const wikiUrl = n => 'https://eldenring.wiki.fextralife.com/' + encodeURIComponent(n).replace(/%20/g, '+').replace(/%27/g, "'")
const picsUrl = n => 'https://www.google.com/search?tbm=isch&q=' + encodeURIComponent('Elden Ring ' + n)
const watchUrl = n => 'https://www.youtube.com/results?search_query=' + encodeURIComponent('Elden Ring ' + n + ' boss fight guide')
function SeeIt({ e, k }) {
  const n = clean(e.n)
  const wiki = k === 'grace' ? (REGIONS[e.r]?.name || n) : k === 'marker' ? n : n
  return (
    <div class="see">
      <a class="btn" href={picsUrl(k === 'grace' ? n + ' site of grace' : n)} target="_blank" rel="noopener">See pictures</a>
      <a class="btn" href={wikiUrl(wiki)} target="_blank" rel="noopener">Wiki page</a>
      {k === 'boss' && <a class="btn" href={watchUrl(n)} target="_blank" rel="noopener">Watch a fight</a>}
    </div>
  )
}
export const lootNote = l => (catOf(l) === 'pick' ? PICK_NOTES[l.n] || 'Suits Teremity.' : LOOT_CATS.find(c => c[0] === l.c)?.[2])
const SYM = { skull: 'skull (someone to kill)', flag: 'flag (important place)', turtle: 'turtle (mausoleum)', diamond: 'diamond (loot)', house: 'house (building)' }

const isDone = (s, b) => !!(s.done[b.id] ?? b.d)
const isGot = (s, l) => !!s.got[l.id]

function Where({ e, from }) {
  if (!from || from.noMap || (e.l || 0) !== (from.l || 0)) return <span class="where">{regionName(e.r)}{e.g ? ` · near ${e.g}` : ''}</span>
  const d = dist(e, from), b = bearing(from, e)
  return <span class="where"><Dir deg={b.deg} /> {howFar(d)}{d >= 3 ? `, ${b.word}` : ''}{e.g ? ` · near ${e.g}` : ''}</span>
}

// ---------- detail card ----------
export function Detail({ id, state, here, onClose, onFly }) {
  const e = byId.get(id)
  if (!e) return null
  const k = kindOf(e)
  return (
    <article class={`detail k-${k}`}>
      <header>
        <div>
          <p class="kicker">{k === 'grace' ? 'Site of Grace' : k === 'boss' ? 'Boss' : k === 'loot' ? (LOOT_CATS.find(c => c[0] === catOf(e))?.[1] || 'Loot') : k === 'marker' ? 'Your map marker' : 'Place'}</p>
          <h2>{e.n}</h2>
          <p class="sub">{regionName(e.r)}{e.s ? ` · ${e.s}` : ''}</p>
        </div>
        <button class="iconbtn" type="button" aria-label="Close" onClick={onClose}><Icon name="close" /></button>
      </header>
      {k === 'grace' && <>
        <div class="row-actions">
          <button type="button" class="btn primary" onClick={() => goHere(e.id)}>We're here</button>
          <label class="inline-check"><Check on={!!(state.visited[e.id] ?? e.v)} onClick={() => toggle('visited', e.id, e.v)} label="Been here" /> Been here</label>
        </div>
        <NearbyLists p={e} state={state} onFly={onFly} compact />
      </>}
      {k === 'boss' && <BossBody b={e} state={state} />}
      {k === 'loot' && <>
        <p><T>{lootNote(e)}</T></p>
        {e.w && <p class="muted">Where: {e.w}</p>}
        <p class="muted">Closest grace: {e.g}</p>
        <label class="inline-check big"><Check on={isGot(state, e)} onClick={() => toggle('got', e.id)} label="Got it" /> Got it</label>
      </>}
      {k === 'marker' && <>
        <p class="marker-sym"><svg viewBox="-12 -12 24 24" class="msym"><circle r="11" class="m-disc" /><MarkerGlyph sym={e.sym} /></svg> Your {SYM[e.sym]}</p>
        <p><T>{e.note}</T></p>
        <p class="muted">We matched this marker from your Switch map video, so it's our best reading of what you marked.</p>
      </>}
      {k === 'place' && <p class="muted">{(e.t || '').replace(/_/g, ' ')}</p>}
      <SeeIt e={e} k={k} />
      <Shots eid={e.id} name={e.n} />
      <div class="row-actions">
        <button type="button" class="btn" onClick={() => askClaude(`Tell us about ${e.n} and what we should know before going there.`, { where: here?.n })}><Icon name="chat" /> Ask Claude about this</button>
      </div>
    </article>
  )
}

function BossBody({ b, state }) {
  const t = tipsFor(b.n)
  return (
    <div class="boss-body">
      <label class="inline-check big"><Check on={isDone(state, b)} onClick={() => toggle('done', b.id, b.d)} label="Beaten" /> Beaten</label>
      {t ? <>
        {t.level && t.level !== 'done' && <p class={`lvl lvl-${t.level.replace(' ', '-')}`}>At level 103: {t.level}</p>}
        <h3>Read these out loud</h3>
        <ol class="tips">{t.tips.map(x => <li><T>{x}</T></li>)}</ol>
        <dl class="facts">
          {t.weak && <><dt>Weak to</dt><dd><T>{t.weak}</T></dd></>}
          {t.summon && <><dt>Summon</dt><dd><T>{t.summon}</T></dd></>}
          {t.drops && <><dt>Drops</dt><dd><T>{t.drops}</T></dd></>}
        </dl>
        {t.lore && <p class="lore"><Spoiler>{t.lore}</Spoiler></p>}
      </> : <p class="muted">No tips written for this one yet. Tap "Ask Claude about this" for help.</p>}
    </div>
  )
}

function NearbyLists({ p, state, onFly, compact }) {
  const bs = nearest(bosses, p, { max: 16, limit: compact ? 3 : 5, filter: b => !isDone(state, b) })
  const ls = nearest(loot, p, { max: 16, limit: compact ? 3 : 6, filter: l => !isGot(state, l) })
  const ms = nearest(markers, p, { max: 24, limit: compact ? 2 : 4 })
  const gs = nearest(graces, p, { max: 14, limit: 4, filter: g => g.id !== p.id })
  const ps = compact ? [] : nearest(places, p, { max: 14, limit: 5, filter: x => DUNGEON_RE.test(x.t || '') })
  const Row = ({ e, sub }) => (
    <li><button type="button" class="nrow" onClick={() => onFly(e.id)}>
      <span class="nname">{e.n}</span><Where e={e} from={p} />{sub ? <span class="nsub">{sub}</span> : null}
    </button></li>
  )
  return (
    <div class="nearby">
      {ms.length > 0 && <section><h3>Your markers nearby</h3><ul>{ms.map(({ e }) => <Row e={e} />)}</ul></section>}
      {bs.length > 0 && <section><h3>Bosses still to beat</h3><ul>{bs.map(({ e }) => <Row e={e} sub={tipsFor(e.n)?.level && tipsFor(e.n).level !== 'done' ? `At your level: ${tipsFor(e.n).level}` : null} />)}</ul></section>}
      {ls.length > 0 && <section><h3>Loot nearby</h3><ul>{ls.map(({ e }) => <Row e={e} sub={LOOT_CATS.find(c => c[0] === catOf(e))?.[1]} />)}</ul></section>}
      {ps.length > 0 && <section><h3>Dungeons and places nearby</h3><ul>{ps.map(({ e }) => <Row e={e} sub={placeKind(e)} />)}</ul></section>}
      {!compact && gs.length > 0 && <section><h3>Closest graces</h3><ul>{gs.map(({ e }) => <Row e={e} />)}</ul></section>}
    </div>
  )
}

export function Shots({ eid, label = 'Our screenshots', name }) {
  const list = useShots(eid)
  const [busy, setBusy] = useState(false)
  return (
    <section class="shots">
      <h3>{label}</h3>
      {list.length > 0 && <div class="captures">{list.map(s => (
        <figure class="shot"><button type="button" class="cap" onClick={() => openViewer(s.url, name || 'Our screenshot')}><img src={s.url} alt={name ? `Our screenshot of ${name}` : 'Our screenshot'} /></button>
          <button type="button" class="link small" onClick={() => removeShot(s.id)}>Remove</button></figure>
      ))}</div>}
      <label class="btn add-shot">
        <input type="file" accept="image/*" multiple onChange={async e => { const f = [...e.currentTarget.files]; e.currentTarget.value = ''; if (!f.length) return; setBusy(true); try { await addShots(eid, f) } finally { setBusy(false) } }} />
        {busy ? 'Saving…' : list.length ? 'Add another screenshot' : 'Add a screenshot'}
      </label>
      {list.length === 0 && <p class="muted small">On the Switch 2: Album, pick a screenshot, Send to Smartphone, then save it to the iPad and add it here.</p>}
    </section>
  )
}

// One-tap questions about things right where you are, so ticking things off takes no digging.
function QuickCheck({ here, state, onFly }) {
  if (!here || here.noMap || here.approx) return null
  const snooze = state.snooze || {}
  const bs = nearest(bosses, here, { max: 5, limit: 2, filter: b => !isDone(state, b) && !snooze[b.id] })
  const ls = nearest(loot, here, { max: 4, limit: 3, filter: l => !isGot(state, l) && !snooze[l.id] })
  const steps = []
  for (const r of ROUTES) for (const st of r.steps) {
    if (state.steps[st.id] || snooze[st.id]) continue
    const e = findByName(st.where)
    if (e && (e.l || 0) === (here.l || 0) && dist(e, here) < 3) steps.push(st)
  }
  const qs = [
    ...steps.slice(0, 1).map(st => ({ id: st.id, q: `Plan step: ${st.t}. Done?`, yes: () => toggle('steps', st.id) })),
    ...bs.map(({ e }) => ({ id: e.id, q: `Did you beat ${e.n}?`, yes: () => toggle('done', e.id, e.d), e })),
    ...ls.map(({ e }) => ({ id: e.id, q: `Picked up the ${e.n}${e.w ? ` (${e.w})` : ''}?`, yes: () => toggle('got', e.id), e })),
  ]
  if (!qs.length) return null
  const later = id => setState(s => ({ snooze: { ...(s.snooze || {}), [id]: 1 } }))
  return (
    <section class="quick">
      <h3>Quick check, right here</h3>
      <ul>{qs.map(q => (
        <li>
          <button type="button" class="qtext" onClick={() => q.e && onFly(q.e.id)}>{q.q}</button>
          <span class="qbtns"><button type="button" class="btn small primary" onClick={q.yes}>Yes</button><button type="button" class="btn small" onClick={() => later(q.id)}>Not yet</button></span>
        </li>
      ))}</ul>
    </section>
  )
}

const PLACE_KINDS = [[/catacomb/, 'Catacombs: a small dungeon with a boss at the end'], [/hero/, "Hero's Grave: a tougher catacomb with chariot traps"], [/cave/, 'Cave: a short dungeon with a boss'], [/tunnel/, 'Tunnel: a mine with smithing stones'], [/gaol/, 'Evergaol: a stone circle with one boss inside'], [/legacy/, 'Legacy dungeon: a huge castle-sized area'], [/divine/, 'Divine Tower'], [/fort/, 'Fort'], [/church/, 'Church: often a Sacred Tear or an item'], [/minor_erdtree/, 'Minor Erdtree'], [/rise/, 'Sorcerer tower'], [/ruins/, 'Ruins: often a cellar with loot']]
const placeKind = e => PLACE_KINDS.find(([re]) => re.test(e.t || ''))?.[1] || null

// For a dropped pin: the closest grace, which way it is and how far.
function ClosestGrace({ pin, onFly }) {
  const g = pin.grace, d = pin.graceDist, b = bearing(pin, g)
  return (
    <button type="button" class="closest" onClick={() => onFly(g.id)}>
      <Dir deg={b.deg} />
      <span><b>Closest grace: {g.n}</b><span class="muted">{d < 3 ? 'Right here.' : `${howFar(d)[0].toUpperCase() + howFar(d).slice(1)}, to the ${b.word}.`} Rest there to refill flasks and save your spot.</span></span>
    </button>
  )
}

// Plan steps that happen near here.
function PlanNear({ here, state, onFly }) {
  if (here.approx) return null
  const rows = []
  for (const r of ROUTES) for (const st of r.steps) {
    if (state.steps[st.id]) continue
    const e = findByName(st.where)
    if (e && (e.l || 0) === (here.l || 0) && dist(e, here) < 14) rows.push({ st, e, r })
  }
  if (!rows.length) return null
  return (
    <section class="plan-near">
      <h3>On the plan, near here</h3>
      <ul>{rows.slice(0, 4).map(({ st, e, r }) => (
        <li><Check on={false} onClick={() => toggle('steps', st.id)} label={`Done: ${st.t}`} />
          <button type="button" class="nrow" onClick={() => onFly(e.id)}><span class="nname">{st.t}</span><Where e={e} from={here} /><span class="nsub">{r.title}</span></button></li>
      ))}</ul>
    </section>
  )
}

// ---------- Here ----------
export function HereTab({ state, here, onWhere, onFly }) {
  if (!here) return (
    <div class="tab-body here-empty">
      <h2 class="display">Start here</h2>
      <p><b>Tap the map where you are.</b> A pin drops there, and everything in this app lines up around that spot: the closest grace, which way the landmarks are, bosses and loot nearby, and what's worth doing.</p>
      <p class="muted">Or tap <b>Where are we?</b> and type the name of the place on the TV.</p>
      <button type="button" class="btn primary wide" onClick={onWhere}>Where are we?</button>
      <h3>While you're here</h3>
      <ul class="plain">
        <li><T>Any underlined word explains itself when you tap it. Try Golden Seed or Poise.</T></li>
        <li>On the map, the gold circles are the game's own Sites of Grace. Green discs are your markers, red diamonds are bosses and teal gems are loot. Tap any of them for details.</li>
        <li>Progress is saved on this iPad, so tick things off as you go.</li>
      </ul>
    </div>
  )
  const R = REGIONS[here.r] || {}
  if (here.noMap) return (
    <div class="tab-body">
      <p class="kicker">You are at</p>
      <h2 class="display">Roundtable Hold</h2>
      <button type="button" class="cap wide" onClick={() => openViewer(CAPTURES[4].src, CAPTURES[4].cap)}><img src={CAPTURES[4].src} alt="Roundtable Hold, from your Switch" /></button>
      <p class="lead">{R.blurb}</p>
      <ul class="plain">
        <li><b>Hewg the smith</b> upgrades weapons, including Somber upgrades for the Godslayer.</li>
        <li><b>Enia</b> trades Remembrances for unique weapons and spells.</li>
        <li><b>The Twin Maiden Husks</b> sell items and take Bell Bearings.</li>
        <li><b>Roderika</b> upgrades Spirit Ashes with Glovewort.</li>
        <li><b>Gideon</b>, by the library, gives hints about where to go.</li>
      </ul>
    </div>
  )
  const lms = landmarksFrom(here)
  const lv = levelVerdict(R.level)
  const secrets = SECRETS[here.r] || []
  const secret = secrets.length ? secrets[(here.n.length + new Date().getHours()) % secrets.length] : null
  return (
    <div class="tab-body">
      <p class="kicker">{here.pin ? 'Our pin is' : here.approx ? 'You are somewhere in' : 'You are at'}</p>
      <h2 class="display">{here.approx ? R.name : here.n}</h2>
      {!here.approx && <p class="sub">{R.name}{here.s ? ` · ${here.s}` : ''}</p>}
      {here.pin && here.grace && <ClosestGrace pin={here} onFly={onFly} />}
      <p class="lead">{(here.s && R.subs?.[here.s]) || R.blurb}</p>
      {lv && <p class={`verdict v-${lv.k}`}>{lv.t}</p>}
      {lms.length > 0 && (
        <section class="compass">
          <h3>Look around</h3>
          <ul>{lms.map(l => <li><Dir deg={l.b.deg} /><span><b>{l.n[0].toUpperCase() + l.n.slice(1)}</b> is to the {l.b.word}{l.id === 'erdtree' ? ' (the giant golden tree)' : ''}. <span class="muted">{howFar(l.d)}</span></span></li>)}</ul>
          <p class="muted small">The compass bar at the top of the screen shows N, E, S and W.</p>
        </section>
      )}
      <QuickCheck here={here} state={state} onFly={onFly} />
      <PlanNear here={here} state={state} onFly={onFly} />
      {secret && <aside class="secret"><h3>Something to tell Chase</h3><p><T>{secret}</T></p></aside>}
      <NearbyLists p={here} state={state} onFly={onFly} />
      {!here.approx && !here.pin && <Shots eid={here.id} name={here.n} label="Our screenshots of this place" />}
      <div class="row-actions">
        <button type="button" class="btn" onClick={onWhere}>Find a place by name</button>
        <button type="button" class="btn" onClick={() => askClaude(`What is worth doing around ${here.n} in ${R.name}?`, { where: here.n })}><Icon name="chat" /> Ask Claude about here</button>
      </div>
    </div>
  )
}

// End-of-session recap: everything near tonight's trail that hasn't been answered yet.
function Recap({ state, onFly }) {
  const since = Date.now() - 14 * 3600 * 1000
  const stops = state.trail.filter(t => t.at > since && !t.id.startsWith('region:')).map(t => resolveHere(t.id)).filter(Boolean)
  if (!stops.length) return null
  const answered = state.recap || {}
  const seen = new Set(), items = []
  for (const p of stops) {
    for (const { e } of nearest(bosses, p, { max: 6, limit: 4, filter: b => !isDone(state, b) && !answered[b.id] })) if (!seen.has(e.id)) { seen.add(e.id); items.push({ e, kind: 'boss' }) }
    for (const { e } of nearest(loot, p, { max: 4, limit: 4, filter: l => !isGot(state, l) && !answered[l.id] })) if (!seen.has(e.id)) { seen.add(e.id); items.push({ e, kind: 'loot' }) }
  }
  const no = id => setState(s => ({ recap: { ...(s.recap || {}), [id]: 1 } }))
  return (
    <section class="quick recap">
      <h3>Tonight's recap</h3>
      <p class="muted small">You stopped at {stops.length} {stops.length === 1 ? 'place' : 'places'} tonight: {stops.slice(0, 4).map(p => p.n).join(', ')}{stops.length > 4 ? ', and more' : ''}. {items.length ? 'Did any of these happen?' : 'Everything nearby is answered.'}</p>
      {items.length > 0 && <ul>{items.slice(0, 12).map(({ e, kind }) => (
        <li>
          <button type="button" class="qtext" onClick={() => onFly(e.id)}>{kind === 'boss' ? `Beat ${e.n}?` : `Got the ${e.n}${e.w ? ` (${e.w})` : ''}?`}</button>
          <span class="qbtns"><button type="button" class="btn small primary" onClick={() => kind === 'boss' ? toggle('done', e.id, e.d) : toggle('got', e.id)}>Yes</button><button type="button" class="btn small" onClick={() => no(e.id)}>No</button></span>
        </li>
      ))}</ul>}
    </section>
  )
}

// ---------- Plan ----------
export function PlanTab({ state, onFly }) {
  const route = ROUTES.find(r => r.id === state.route) || ROUTES[0]
  const showStop = name => { const e = findByName(name); if (e) onFly(e.id) }
  const doneCount = r => r.steps.filter(s => state.steps[s.id]).length
  return (
    <div class="tab-body">
      <h2 class="display">Today's plan</h2>
      <Recap state={state} onFly={onFly} />
      <p class="lead">Three good ways to spend the session. All of them suit level 103. Pick one, and tick steps off as you go.</p>
      <div class="routes">
        {ROUTES.map(r => (
          <button type="button" class={`route ${r.id === route.id ? 'on' : ''}`} aria-pressed={r.id === route.id ? 'true' : 'false'} onClick={() => setState({ route: r.id })}>
            <span class="route-title">{r.title}{r.pick ? <span class="badge">Our pick</span> : null}</span>
            <span class="route-why">{r.why}</span>
            <span class="route-meta">{r.time} · {doneCount(r)} of {r.steps.length} done</span>
          </button>
        ))}
      </div>
      <ol class="steps">
        {route.steps.map(s => (
          <li class={state.steps[s.id] ? 'done' : ''}>
            <Check on={!!state.steps[s.id]} onClick={() => toggle('steps', s.id)} label={`Done: ${s.t}`} />
            <div>
              <b>{s.t}</b>
              <p><T>{s.d}</T></p>
              {s.where && <button type="button" class="link" onClick={() => showStop(s.where)}>Show {s.where} on the map</button>}
            </div>
          </li>
        ))}
      </ol>
      <section class="prep">
        <h3>Chase's prep before you start</h3>
        <p class="muted">Menu things only. None of these move the story forward.</p>
        <ul class="checks">
          {PREP.map(p => (
            <li><Check on={!!state.steps[p.id]} onClick={() => toggle('steps', p.id)} label={p.t} /><div><b>{p.t}</b><p><T>{p.d}</T></p></div></li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Rune grinding, for Truc's turns</h3>
        <ul class="cards">{GRIND.map(g => <li class="card"><b>{g.n}</b><span class="muted">{g.runes}</span><p><T>{g.how}</T></p></li>)}</ul>
      </section>
    </div>
  )
}

// ---------- Bosses ----------
export function BossesTab({ state, here, onFly }) {
  const [mode, setMode] = useState(here && !here.noMap ? 'near' : 'region')
  const [showDone, setShowDone] = useState(false)
  const list = bosses.filter(b => showDone || !isDone(state, b))
  const near = here && !here.noMap ? nearest(list, here, { max: 60, limit: 25 }).map(x => x.e) : []
  const groups = REGION_ORDER.map(r => [r, list.filter(b => b.r === r)]).filter(([, l]) => l.length)
  const Row = b => {
    const t = tipsFor(b.n)
    return (
      <li class={isDone(state, b) ? 'done' : ''}>
        <Check on={isDone(state, b)} onClick={() => toggle('done', b.id, b.d)} label={`Beaten: ${b.n}`} />
        <button type="button" class="nrow" onClick={() => onFly(b.id)}>
          <span class="nname">{b.n}</span>
          {mode === 'near' ? <Where e={b} from={here} /> : <span class="where">{b.t === 'legacy' ? 'Main boss' : b.t === 'dungeon' ? 'Dungeon boss' : 'Field boss'}</span>}
          {t?.level && t.level !== 'done' ? <span class={`lvl lvl-${t.level.replace(' ', '-')}`}>{t.level}</span> : null}
        </button>
      </li>
    )
  }
  return (
    <div class="tab-body">
      <h2 class="display">Bosses</h2>
      <div class="seg" role="group" aria-label="Sort bosses">
        <button type="button" aria-pressed={mode === 'near' ? 'true' : 'false'} disabled={!here || here.noMap} onClick={() => setMode('near')}>Near us</button>
        <button type="button" aria-pressed={mode === 'region' ? 'true' : 'false'} onClick={() => setMode('region')}>By region</button>
        <button type="button" aria-pressed={showDone ? 'true' : 'false'} onClick={() => setShowDone(!showDone)}>{showDone ? 'Hide beaten' : 'Show beaten'}</button>
      </div>
      <p class="muted small">Tap a boss for tips you can read out loud mid-fight. Tick the ones you've beaten; a few are ticked already.</p>
      {mode === 'near' ? <ul class="list">{near.map(Row)}</ul> : groups.map(([r, l]) => (
        <section><h3>{REGIONS[r].name} <span class="count">{l.length}</span></h3><ul class="list">{l.map(Row)}</ul></section>
      ))}
    </div>
  )
}

// ---------- Loot ----------
export function LootTab({ state, here, onFly }) {
  const [cat, setCat] = useState('seed')
  const [showGot, setShowGot] = useState(false)
  const items = loot.filter(l => catOf(l) === cat && (showGot || !isGot(state, l)))
  const sorted = here && !here.noMap
    ? [...items].sort((a, b) => ((a.l || 0) !== (here.l || 0)) - ((b.l || 0) !== (here.l || 0)) || dist(a, here) - dist(b, here))
    : [...items].sort((a, b) => REGION_ORDER.indexOf(a.r) - REGION_ORDER.indexOf(b.r))
  const counts = Object.fromEntries(LOOT_CATS.map(([c]) => [c, loot.filter(l => catOf(l) === c && !isGot(state, l)).length]))
  const info = LOOT_CATS.find(c => c[0] === cat)
  return (
    <div class="tab-body">
      <h2 class="display">Loot</h2>
      <div class="chips" role="group" aria-label="Loot type">
        {LOOT_CATS.map(([c, n]) => <button type="button" class="chip" aria-pressed={cat === c ? 'true' : 'false'} onClick={() => setCat(c)}>{n} <span class="count">{counts[c]}</span></button>)}
      </div>
      <p class="lead"><T>{info[2]}</T></p>
      <p class="muted small">{here && !here.noMap ? `Sorted by distance from ${here.n}.` : 'Set where you are to sort by distance.'} The game doesn't tell us which ones you already picked up, so tick them as you find or remember them.</p>
      <label class="inline-check"><Check on={showGot} onClick={() => setShowGot(!showGot)} label="Show ones we have" /> Show ones we have</label>
      <ul class="list">
        {sorted.map(l => (
          <li class={isGot(state, l) ? 'done' : ''}>
            <Check on={isGot(state, l)} onClick={() => toggle('got', l.id)} label={`Got ${l.n}`} />
            <button type="button" class="nrow" onClick={() => onFly(l.id)}>
              <span class="nname">{l.n}</span>
              <Where e={l} from={here} />
              {l.w ? <span class="nsub">{l.w}</span> : catOf(l) === 'pick' ? <span class="nsub">{lootNote(l)}</span> : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------- Teremity ----------
export function BuildTab() {
  const t = TEREMITY
  return (
    <div class="tab-body">
      <h2 class="display">Teremity</h2>
      <p class="sub">Level {t.level} · {t.runes.toLocaleString()} runes held · next level costs about {t.nextLevelCost.toLocaleString()}</p>
      <div class="stats">
        {Object.entries(t.stats).map(([k, v]) => <button type="button" class="stat" onClick={() => showTermByName(k)}><span>{k}</span><b>{v}</b></button>)}
      </div>
      <p class="muted small">HP {t.hp} · FP {t.fp} · Stamina {t.stamina} · <T>{`Equip Load ${t.equipLoad}`}</T> · Flask {t.flask} · {t.seeds} Golden Seeds held</p>
      <section><h3>What we're carrying</h3><ul class="cards">{t.gear.map(g => <li class="card"><b>{g.n}</b><p><T>{g.note}</T></p></li>)}</ul></section>
      <section><h3>Where to put the next levels</h3><ul class="advice">{BUILD_ADVICE.map(a => <li><b>{a.h}</b><p><T>{a.p}</T></p></li>)}</ul></section>
      <section><h3>Talisman sets from what we own</h3><ul class="cards">{TALISMAN_SETS.map(s => <li class="card"><b>{s.h}</b><p>{s.items.join(' · ')}</p><p class="muted"><T>{s.why}</T></p></li>)}</ul></section>
      <section><h3>Also in the bag</h3><p class="muted">{t.owned.join(' · ')}</p></section>
      <section><h3>From your Switch, October 20</h3>
        <div class="captures">{CAPTURES.map(c => <figure><button type="button" class="cap" onClick={() => openViewer(c.src, c.cap)}><img src={c.src} alt={c.cap} loading="lazy" /></button><figcaption>{c.cap}</figcaption></figure>)}</div>
      </section>
    </div>
  )
}
const B = import.meta.env.BASE_URL
export const CAPTURES = [
  { src: B + 'captures/status.jpg', cap: "Teremity's status screen" },
  { src: B + 'captures/godslayer.jpg', cap: "The Godslayer's Greatsword +5" },
  { src: B + 'captures/map-markers.jpg', cap: 'Your world map and markers' },
  { src: B + 'captures/map-limgrave-south.jpg', cap: 'South Limgrave, zoomed in' },
  { src: B + 'captures/roundtable.jpg', cap: 'Roundtable Hold' },
]
let viewerSet = null
export function setViewer(f) { viewerSet = f }
export function openViewer(src, cap) { viewerSet && viewerSet({ src, cap }) }
function showTermByName(n) { const g = GLOSSARY.find(x => x.t === n); if (g) showTerm(g) }

// ---------- Learn ----------
export function LearnTab({ state, here }) {
  const [q, setQ] = useState('')
  const [ask, setAsk] = useState('')
  const terms = useMemo(() => {
    const n = q.trim().toLowerCase()
    return n ? GLOSSARY.filter(g => g.t.toLowerCase().includes(n) || (g.also || []).some(a => a.toLowerCase().includes(n)) || g.d.toLowerCase().includes(n)) : null
  }, [q])
  const regs = here?.r && SECRETS[here.r] ? [here.r, ...Object.keys(SECRETS).filter(r => r !== here.r)] : Object.keys(SECRETS)
  return (
    <div class="tab-body">
      <h2 class="display">Learn</h2>
      <section class="ask">
        <h3>Ask Claude anything</h3>
        <form onSubmit={e => { e.preventDefault(); if (ask.trim()) { askClaude(ask.trim(), { where: here?.n }); setAsk('') } }}>
          <textarea rows="2" value={ask} onInput={e => setAsk(e.currentTarget.value)} placeholder="How does poise work? Should we fight Radahn now?" aria-label="Your question" />
          <button type="submit" class="btn primary" disabled={!ask.trim()}><Icon name="chat" /> Ask Claude</button>
        </form>
        <p class="muted small">Opens Claude with your question and our character details already written in. The question is copied too, in case you need to paste it.</p>
        {state.asked.length > 0 && <div class="trail">{state.asked.slice(0, 5).map(a => <button type="button" class="pill" onClick={() => askClaude(a, { where: here?.n })}>{a}</button>)}</div>}
      </section>
      <section>
        <h3>Game words, explained</h3>
        <input class="filter" type="search" value={q} onInput={e => setQ(e.currentTarget.value)} placeholder="Find a word" aria-label="Find a game word" />
        {terms ? <dl class="gloss">{terms.map(g => <Term g={g} />)}</dl> : GLOSSARY_GROUPS.map(([id, label]) => (
          <details class="gloss-group">
            <summary>{label}</summary>
            <dl class="gloss">{GLOSSARY.filter(g => g.g === id).map(g => <Term g={g} />)}</dl>
          </details>
        ))}
      </section>
      <section>
        <h3>Secrets worth knowing</h3>
        {regs.map(r => <details class="gloss-group" open={r === here?.r}><summary>{REGIONS[r].name}</summary><ul class="plain">{SECRETS[r].map(s => <li><T>{s}</T></li>)}</ul></details>)}
      </section>
      <section>
        <h3>From the YouTube guides</h3>
        <ul class="plain">{VIDEO_TIPS.map(v => <li><T>{v.tip}</T> <span class="muted small">({v.from})</span></li>)}</ul>
      </section>
    </div>
  )
}
function Term({ g }) {
  return <div class="gterm"><dt>{g.t}</dt><dd><T skip={g.t}>{g.d}</T>{g.more ? <> <span class="muted"><T skip={g.t}>{g.more}</T></span></> : null}</dd></div>
}

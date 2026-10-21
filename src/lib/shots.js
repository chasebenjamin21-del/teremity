// Our own screenshots, attached to any place, boss or item. Stored in IndexedDB on this device only.
import { useEffect, useState } from 'preact/hooks'

let dbp = null
function db() {
  if (!dbp) dbp = new Promise((res, rej) => {
    const r = indexedDB.open('teremity-shots', 1)
    r.onupgradeneeded = () => { const s = r.result.createObjectStore('shots', { keyPath: 'id' }); s.createIndex('eid', 'eid') }
    r.onsuccess = () => res(r.result)
    r.onerror = () => rej(r.error)
  })
  return dbp
}
const listeners = new Set()
const ping = () => listeners.forEach(f => f())

async function shrink(file) {
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url })
    const k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight))
    const c = document.createElement('canvas')
    c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k)
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
    return await new Promise(res => c.toBlob(b => res(b || file), 'image/jpeg', 0.85))
  } catch { return file } finally { URL.revokeObjectURL(url) }
}

export async function addShots(eid, files) {
  try { navigator.storage?.persist?.() } catch {}
  const d = await db()
  let i = 0
  for (const f of files) {
    const blob = await shrink(f)
    await new Promise((res, rej) => {
      const tx = d.transaction('shots', 'readwrite')
      tx.objectStore('shots').put({ id: `${eid}~${Date.now()}~${i++}`, eid, blob, at: Date.now() })
      tx.oncomplete = res; tx.onerror = () => rej(tx.error)
    })
  }
  ping()
}

export async function removeShot(id) {
  const d = await db()
  await new Promise(res => { const tx = d.transaction('shots', 'readwrite'); tx.objectStore('shots').delete(id); tx.oncomplete = res })
  ping()
}

export async function getShots(eid) {
  const d = await db()
  return new Promise(res => {
    const out = []
    const req = d.transaction('shots').objectStore('shots').index('eid').openCursor(IDBKeyRange.only(eid))
    req.onsuccess = () => { const c = req.result; if (c) { out.push(c.value); c.continue() } else res(out) }
    req.onerror = () => res([])
  })
}

export function useShots(eid) {
  const [list, setList] = useState([])
  useEffect(() => {
    let urls = [], alive = true
    const load = async () => {
      if (!eid || typeof indexedDB === 'undefined') return
      const rows = await getShots(eid).catch(() => [])
      urls.forEach(u => URL.revokeObjectURL(u))
      urls = rows.map(r => URL.createObjectURL(r.blob))
      if (alive) setList(rows.map((r, i) => ({ id: r.id, url: urls[i], at: r.at })))
    }
    load(); listeners.add(load)
    return () => { alive = false; listeners.delete(load); urls.forEach(u => URL.revokeObjectURL(u)) }
  }, [eid])
  return list
}

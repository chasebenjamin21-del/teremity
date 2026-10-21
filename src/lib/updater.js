// New versions wait politely: a small banner offers to refresh, so nothing reloads mid-fight.
import { registerSW } from 'virtual:pwa-register'
export const updater = { ready: false, update: () => {}, listeners: new Set() }
export function startUpdater() {
  updater.update = registerSW({
    immediate: true,
    onNeedRefresh() { updater.ready = true; updater.listeners.forEach(f => f(true)) },
  })
}

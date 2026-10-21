// The session plan: which route is chosen, which step comes next, and where each step is on the map.
import { ROUTES } from '../content/guide.js'
import { findByName, bosses } from './world.js'

export const currentRoute = s => ROUTES.find(r => r.id === s.route) || ROUTES[0]

// The step to show next: the one Truc picked (if it isn't done yet), otherwise the first one not done.
export function nextStep(s, route = currentRoute(s)) {
  const picked = s.stepPick && route.steps.find(x => x.id === s.stepPick && !s.steps[x.id])
  return picked || route.steps.find(x => !s.steps[x.id]) || null
}

const stopCache = new Map()
export function stopOf(step) {
  if (!step?.where) return null
  if (!stopCache.has(step.id)) stopCache.set(step.id, findByName(step.where))
  return stopCache.get(step.id)
}
export const bossOf = step => (step?.boss ? bosses.find(b => b.n === step.boss) || null : null)

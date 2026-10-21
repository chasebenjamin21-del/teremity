// Small shared pieces.
export function Check({ on, onClick, label }) {
  return (
    <button type="button" class={`check ${on ? 'on' : ''}`} aria-pressed={on ? 'true' : 'false'} aria-label={label} onClick={e => { e.stopPropagation(); onClick() }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" class="c-ring" /><path d="M7 12.5 l3.2 3.2 L17 8.8" class="c-tick" /></svg>
    </button>
  )
}

export function Dir({ deg }) {
  return (
    <svg class="dir" viewBox="0 0 24 24" aria-hidden="true" style={{ transform: `rotate(${deg}deg)` }}>
      <path d="M12 3 L17 15 L12 12.5 L7 15 Z" />
    </svg>
  )
}

export function Icon({ name }) {
  const p = {
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 L21 21" /></>,
    close: <path d="M6 6 L18 18 M18 6 L6 18" />,
    gear: <><circle cx="12" cy="12" r="3.2" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M5.2 18.8l2.1-2.1M16.7 7.3l2.1-2.1" /></>,
    layers: <><path d="M12 3 L21 8 L12 13 L3 8 Z" /><path d="M3 12.5 L12 17.5 L21 12.5" /><path d="M3 16.5 L12 21.5 L21 16.5" /></>,
    target: <><circle cx="12" cy="12" r="7.5" /><circle cx="12" cy="12" r="2.2" /><path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4" /></>,
    expand: <path d="M4 9 V4 H9 M15 4 H20 V9 M20 15 V20 H15 M9 20 H4 V15" />,
    chat: <path d="M4 5 H20 V16 H11 L6 20 V16 H4 Z" />,
    down: <path d="M12 3 V21 M5 14 L12 21 L19 14" />,
    back: <path d="M15 5 L8 12 L15 19" />,
  }[name]
  return <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">{p}</svg>
}

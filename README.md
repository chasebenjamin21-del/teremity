# Teremity

An offline field guide for Chase and Truc's Elden Ring run (Switch 2, Tarnished Edition), built for Truc's iPad.

**Open it:** https://chasebenjamin21-del.github.io/teremity/
**Install it:** in Safari, tap Share, then **Add to Home Screen**. It then opens full screen with its own icon and works offline.

## What it does

- **Where are we?** Type a few letters of the place name on the TV, or pick what you see. The map flies there, and the app says which way the big landmarks are and what's nearby.
- **Map:** an original schematic of the Lands Between with Sites of Grace, bosses, loot and Chase's own map markers. Pinch, drag and tap.
- **Plan:** three routes for the next session, plus menu-only prep that doesn't move the story forward.
- **Bosses:** tips written to be read out loud mid-fight, what each boss is weak to, and what it drops.
- **Loot:** Golden Seeds, Sacred Tears, Larval Tears, upgrade stones and build picks, sorted by distance.
- **Teremity:** the character sheet and where to put the next levels.
- **Learn:** every game word explained in one sentence (tap any underlined word anywhere), secrets per region, and an Ask Claude button.

Progress (ticks, the trail, where you are) is saved on the device only.

## Building

```
npm install
npm run dev      # local preview
npm run build    # writes the site to docs/, which GitHub Pages serves
```

`tools/` holds the Python scripts that built `src/data/world.json` from Chase's map captures and the GraceMap coordinates.

## Credits

Map coordinates come from [GraceMap](https://github.com/AndreBFarias/GraceMap) by AndreBFarias (GPL-3.0), so this project is GPL-3.0 too. The map drawing and all the writing are original to Teremity. Elden Ring is a trademark of FromSoftware and Bandai Namco; this is a fan-made guide with no affiliation.

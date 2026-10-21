# How the real map is made

The surface map in the app is stitched from Chase's own Switch 2 captures of the in-game map screen.
Nothing comes from a website or from game files.

1. `reg1.py` lines every frame from Chase's earlier videos up with one zoomed-out frame (b_010) using SIFT
   features. `xf_b010.json` (in the scratch notes) maps that frame to world coordinates: px = 8.1433 x - 84.41,
   py = 8.1986 y - 766.27, fitted on the gold grace icons.
2. `reg2.py` lines new screenshots and video frames up against the current mosaic, which is sharper to match.
3. `mosaic2.py` builds the picture: a per-pixel median of all zoomed-out frames as the base (it removes the
   moving cursor), then each closer zoom level on top with feathered edges. The cursor is found by template
   matching and masked out of every frame, and the on-screen buttons, compass, dial and time of day are masked.
4. `export.py` fills small holes, fades the outer edge into the fog colour, and writes `lo.webp` (the whole map,
   small) plus a 5 by 5 grid of `hi-*.webp` tiles and `realmap.json` with their world positions.
   Copy `out/*.webp` to `public/realmap/` and `out/realmap.json` to `src/data/`.

To add new captures: put the new screenshots in `new/` (and video frames in `vid/`), run reg2, mosaic2 and export.
The registration files here record where every frame used so far sits.
